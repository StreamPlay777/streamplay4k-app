<?php
/**
 * POST /api/stripe-webhook — Stripe tells us a payment succeeded.
 *
 * THE SIGNATURE CHECK IS THE WHOLE SECURITY MODEL. This is a public URL that
 * marks orders paid and triggers an activation email. Without verification,
 * anyone who finds it can POST a fabricated "payment succeeded" and get a
 * subscription for free, so an unverified handler here is a free-goods button.
 * A request that fails the check is refused before anything is read from it.
 *
 * IDEMPOTENT BY DESIGN. Stripe retries a webhook until it gets a 2xx, and will
 * happily deliver the same event twice. An order already marked paid is
 * acknowledged and dropped — the second delivery must not send the customer a
 * second "payment received" email.
 *
 * ALWAYS ANSWERS 2xx once the signature passes, even for events we ignore. A
 * non-2xx makes Stripe retry for days and eventually disable the endpoint,
 * which is how a working integration quietly stops working.
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
if (!is_file($configPath)) { http_response_code(500); exit; }
$cfg = require $configPath;

header('Content-Type: application/json; charset=utf-8');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    echo json_encode(['ok' => false]);
    exit;
}

$payload = file_get_contents('php://input') ?: '';
$sig = $_SERVER['HTTP_STRIPE_SIGNATURE'] ?? '';

if (!sp_stripe_verify($payload, $sig, (string) ($cfg['stripe_webhook_secret'] ?? ''))) {
    sp_log($cfg, 'stripe webhook REJECTED: bad or missing signature');
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'bad signature']);
    exit;
}

$event = json_decode($payload, true);
$type = is_array($event) ? (string) ($event['type'] ?? '') : '';
$object = $event['data']['object'] ?? [];

/* Everything past here is verified as coming from Stripe. */

if ($type !== 'checkout.session.completed') {
    // Acknowledged so Stripe stops retrying. Logged so there is a record if a
    // payment ever seems to go missing.
    sp_log($cfg, "stripe webhook ignored: {$type}");
    echo json_encode(['ok' => true, 'ignored' => $type]);
    exit;
}

/* The order id travels in metadata rather than being matched on email: a
   customer who orders twice would otherwise have the wrong order marked. */
$orderId = sp_clean($object['metadata']['orderId'] ?? ($object['client_reference_id'] ?? ''), 32);
$order = sp_read_order($cfg, $orderId);

if ($order === null) {
    sp_log($cfg, "stripe webhook: paid session for UNKNOWN order '{$orderId}' — check Stripe dashboard");
    echo json_encode(['ok' => true, 'unknown' => true]);
    exit;
}

if (($order['status'] ?? '') === 'paid' || !empty($order['paidAt'])) {
    echo json_encode(['ok' => true, 'duplicate' => true]);
    exit;
}

/* Stripe's own figure, not ours. If they disagree, the amount actually taken
   is the one that counts, and the difference needs a human. */
$paidCents = (int) ($object['amount_total'] ?? 0);
$expected = (int) $order['totalCents'];

$order = sp_update_order($cfg, $orderId, [
    'status'        => 'paid',
    'paidAt'        => gmdate('c'),
    'paidCents'     => $paidCents,
    'stripeSession' => sp_clean($object['id'] ?? '', 80),
    'stripeIntent'  => sp_clean($object['payment_intent'] ?? '', 80),
]) ?? $order;

if ($paidCents !== $expected) {
    sp_log($cfg, "AMOUNT MISMATCH {$orderId}: Stripe took {$paidCents}, order says {$expected}");
}

$sheet = sp_sheets_push($cfg, $order);
if (!$sheet['ok']) sp_sheets_defer($cfg, $orderId);

$paidMail = sp_paid_email($order, $cfg);
$r = sp_send_mail($cfg, $order['email'], $paidMail['subject'], $paidMail['html'], $paidMail['text'], ['tag' => 'order-paid']);

/* You need to know to activate the account. This is the one that matters most
   of the three, so it goes out even if the customer's email failed. */
$note = sp_internal_paid_email($order, $cfg);
sp_send_mail($cfg, $cfg['orders_inbox'], $note['subject'], $note['html'], $note['text'], ['tag' => 'paid-internal']);

sp_log($cfg, sprintf('%s PAID %s customer=%s(%d)', $orderId, sp_money($paidCents), $r['ok'] ? 'ok' : 'FAIL', $r['status']));

echo json_encode(['ok' => true, 'orderId' => $orderId]);
