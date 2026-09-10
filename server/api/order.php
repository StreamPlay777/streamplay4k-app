<?php
/**
 * POST /api/order — the order endpoint.
 *
 * ORDER OF OPERATIONS, AND WHY
 *   1. reject anything that is not a well-formed POST
 *   2. validate the customer's details
 *   3. RECALCULATE the price here; the browser's figure is only compared
 *   4. WRITE THE ORDER TO DISK
 *   5. only then try to send email
 *
 * Four before five is the whole point. Mailgun will have a bad minute
 * eventually — a key rotated, a DNS blip, an outage. When it does, the order
 * is already on disk and you can still serve the customer. An endpoint that
 * emails first and stores second loses the order and tells the customer it
 * failed, which is the worst of both.
 *
 * The response never leaks internals: the customer sees "received" or a plain
 * failure, and the detail goes to the log.
 */

declare(strict_types=1);

require __DIR__ . '/lib/pricing.php';
require __DIR__ . '/lib/validate.php';
require __DIR__ . '/lib/mailer.php';
require __DIR__ . '/lib/store.php';
require __DIR__ . '/lib/stripe.php';
require __DIR__ . '/lib/sheets.php';
require __DIR__ . '/templates/emails.php';

$configPath = __DIR__ . '/config.php';
if (!is_file($configPath)) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['ok' => false, 'error' => 'not configured']);
    exit;
}
$cfg = require $configPath;

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
// Same-origin only: the site posts to its own /api/order, so no CORS headers
// are sent at all. Adding Access-Control-Allow-Origin here would let any site
// on the internet submit orders in your name.

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    echo json_encode(['ok' => false, 'error' => 'method not allowed']);
    exit;
}

$raw = file_get_contents('php://input') ?: '';
if (strlen($raw) > 8192) {
    http_response_code(413);
    echo json_encode(['ok' => false, 'error' => 'payload too large']);
    exit;
}
$in = json_decode($raw, true);
if (!is_array($in)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'bad request']);
    exit;
}

/* ── Throttle ─────────────────────────────────────────────────────────── */
/* Checked before validation so a script cannot use the error responses to
   probe the endpoint for free. 429 is honest about why. */
$ip = sp_clean($_SERVER['REMOTE_ADDR'] ?? '', 45);
if (sp_rate_limited($cfg, $ip)) {
    sp_log($cfg, "rate limited {$ip}");
    http_response_code(429);
    header('Retry-After: 900');
    echo json_encode(['ok' => false, 'error' => 'too many requests']);
    exit;
}

/* ── Validate ─────────────────────────────────────────────────────────── */
$phone = sp_clean($in['phone'] ?? '', 40);
$email = mb_strtolower(sp_clean($in['email'] ?? '', 160));

$errors = [];
if (!sp_valid_phone($phone)) $errors['phone'] = 'Enter a phone number we can reach you on.';
if (!sp_valid_email($email)) $errors['email'] = 'Enter a valid email address.';

if ($errors) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'errors' => $errors]);
    exit;
}

/* ── Price: computed here, never accepted ─────────────────────────────── */
$termId = sp_clean($in['planId'] ?? '', 8);
$devices = (int) ($in['deviceCount'] ?? 1);
$q = sp_quote($termId, $devices);

$clientTotal = (int) ($in['total'] ?? 0);
$mismatch = $clientTotal !== $q['totalCents'];

/* ── Assemble ─────────────────────────────────────────────────────────── */
/* Short and sequential — SP-1001, SP-1002. It is read out on WhatsApp and
   typed into a payment description, so every character costs something. */
$id = sp_next_order_id($cfg);

$order = [
    'id'              => $id,
    'createdAt'       => gmdate('c'),
    'planId'          => $q['term']['id'],
    'planLabel'       => $q['term']['label'],
    'planTier'        => $q['term']['tier'],
    'termMonths'      => $q['term']['months'],
    'devices'         => $q['devices'],
    'baseCents'       => $q['baseCents'],
    'extraCents'      => $q['extraDevicesCents'],
    'totalCents'      => $q['totalCents'],
    'totalFormatted'  => sp_money($q['totalCents']),
    'perMonthCents'   => $q['perMonthCents'],
    'phone'           => $phone,
    'country'         => sp_clean($in['country'] ?? '', 4),
    'email'           => $email,
    'sourcePage'      => sp_clean($in['sourcePage'] ?? '', 120),
    'campaign'        => sp_campaign($in['campaign'] ?? null),
    'clientTotal'     => $clientTotal,
    'priceMismatch'   => $mismatch,
    'ip'              => $ip,
    'userAgent'       => sp_clean($_SERVER['HTTP_USER_AGENT'] ?? '', 200),
    'status'          => 'new',
];

/* A repeat of the same selection by the same person within five minutes is a
   double-tap or a browser retry, not a second order. Acknowledge it as success
   — telling them it failed would make them submit a third time. */
$fingerprint = hash('sha256', $email . '|' . $phone . '|' . $q['term']['id'] . '|' . $q['devices']);
$previous = sp_recent_duplicate($cfg, $fingerprint, $id);
if ($previous !== null) {
    sp_log($cfg, "duplicate suppressed {$email} {$q['term']['id']}x{$q['devices']} -> {$previous}");
    echo json_encode(['ok' => true, 'orderId' => $previous, 'duplicate' => true]);
    exit;
}

/* ── Store first ──────────────────────────────────────────────────────── */
$stored = sp_store_order($cfg, $order);
if (!$stored['ok']) {
    // Nowhere to put the order means we cannot promise to fulfil it. Say so
    // rather than sending a confirmation for something that was not recorded.
    sp_log($cfg, 'STORE FAILED: ' . ($stored['error'] ?? '?'));
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'could not record the order']);
    exit;
}

if ($mismatch) {
    sp_log($cfg, "PRICE MISMATCH {$id}: browser said {$clientTotal}, server charged {$q['totalCents']}");
}

/* ── A pay-now link, if one is configured ─────────────────────────────── */
/*
 * THREE WAYS THIS CAN GO, in the order they are tried:
 *
 *   1. stripe_secret set  — a Checkout Session for this exact order. The
 *      amount is fixed, the payment reports itself back, the order marks
 *      itself paid. Best, and the most setup.
 *
 *   2. payment_link set   — one reusable Stripe link the customer types the
 *      amount into. No API key, nothing to maintain. The email states the
 *      figure large and twice, because with a link like this the amount is
 *      the customer's job to get right and a mistyped one is your afternoon.
 *      Nothing reports back, so you mark orders paid in the dashboard.
 *
 *   3. neither            — the email says the invoice is on its way, and you
 *      send it. This is the default and it is a complete, working shop.
 *
 * None of the three can fail an order: it is already on disk by this point.
 */
$pay = sp_stripe_checkout($cfg, $order);
if ($pay) {
    $order['payUrl'] = $pay['url'];
    $order['stripeSession'] = $pay['sessionId'];
    sp_update_order($cfg, $id, [
        'payUrl'        => $pay['url'],
        'stripeSession' => $pay['sessionId'],
    ]);
} elseif (sp_stripe_enabled($cfg)) {
    sp_log($cfg, "{$id} stripe checkout FAILED — customer gets the invoice-coming email");
} elseif (!empty($cfg['payment_link'])) {
    $order['payLink'] = (string) $cfg['payment_link'];
}

/* This person is no longer an abandoned lead. */
sp_lead_converted($cfg, $phone);

/* ── Mirror into the Google Sheet ─────────────────────────────────────── */
/* Best-effort by design. A failure is queued for the cron to retry rather
   than shown to the customer — the order is on disk either way. */
$sheet = sp_sheets_push($cfg, $order);
if (!$sheet['ok']) {
    sp_sheets_defer($cfg, $id);
    sp_log($cfg, "{$id} sheet push failed ({$sheet['error']}) — queued for retry");
}

/* ── Then email ───────────────────────────────────────────────────────── */
$internal = sp_internal_email($order, $cfg);
$r1 = sp_send_mail($cfg, $cfg['orders_inbox'], $internal['subject'], $internal['html'], $internal['text'], ['tag' => 'order-internal']);

$customer = sp_customer_email($order, $cfg);
$r2 = sp_send_mail($cfg, $email, $customer['subject'], $customer['html'], $customer['text'], ['tag' => 'order-customer']);

sp_log($cfg, sprintf(
    '%s stored=1 internal=%s(%d) customer=%s(%d) %s',
    $id, $r1['ok'] ? 'ok' : 'FAIL', $r1['status'], $r2['ok'] ? 'ok' : 'FAIL', $r2['status'],
    trim($r1['error'] . ' ' . $r2['error'])
));

/* The order is recorded, so this is a success from the customer's side even
   if a message bounced off Mailgun. You have the record either way. */
echo json_encode(['ok' => true, 'orderId' => $id]);
