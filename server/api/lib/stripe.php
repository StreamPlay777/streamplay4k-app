<?php
/**
 * Stripe Checkout, created per order.
 *
 * WHY A SESSION AND NOT A PAYMENT LINK
 * Stripe's no-code Payment Links carry a fixed amount. This shop sells three
 * terms times five device counts — fifteen prices — so using links would mean
 * creating and maintaining fifteen of them, and the day a price changes,
 * fifteen edits with one of them forgotten. A Checkout Session is created at
 * order time for the exact figure the server calculated, so the amount the
 * customer pays cannot disagree with the amount you quoted.
 *
 * PRICE_DATA, NOT A PRICE ID: no products to pre-create in the dashboard, and
 * nothing in Stripe to keep in step with src/data/pricing.ts.
 *
 * OPTIONAL. With no stripe_secret in config.php this is inert and the emails
 * fall back to "your invoice is on its way", which is what they said before
 * Stripe existed. The site works either way.
 *
 * Talks to Stripe over HTTPS with cURL — no SDK, for the same reason as
 * Mailgun: one HTTP call does not justify a dependency tree on a shared host.
 */

declare(strict_types=1);

function sp_stripe_enabled(array $cfg): bool
{
    return !empty($cfg['stripe_secret']);
}

/**
 * A checkout URL for this order, or null if Stripe is off or the call failed.
 *
 * Never throws and never blocks the order: a null return means the customer
 * gets the older "we will send your invoice" email, which is still true.
 *
 * $attempt varies the idempotency key ONLY. Sessions expire after 24 hours, so
 * a follow-up needs a genuinely new one — but the order id in metadata must
 * stay untouched, because that is what the webhook matches a payment against.
 * Changing the id to force a new session would break the payment it enables.
 */
function sp_stripe_checkout(array $cfg, array $order, string $attempt = ''): ?array
{
    if (!sp_stripe_enabled($cfg)) return null;

    $devices = (int) $order['devices'];
    $name = $cfg['brand_name'] . ' — ' . $order['planLabel']
          . ', ' . $devices . ' ' . ($devices === 1 ? 'device' : 'devices');

    /* Stripe takes form-encoded bodies with bracketed nesting. */
    $fields = [
        'mode'                                  => 'payment',
        'success_url'                           => rtrim($cfg['site_url'], '/') . '/thank-you/?paid=1',
        'cancel_url'                            => rtrim($cfg['site_url'], '/') . '/pricing/',
        'client_reference_id'                   => $order['id'],
        'customer_email'                        => $order['email'],
        // Echoed back on the webhook. It is how the payment finds its order —
        // matching on email would break for anyone who orders twice.
        'metadata[orderId]'                     => $order['id'],
        'metadata[plan]'                        => $order['planId'],
        'metadata[devices]'                     => (string) $devices,
        'line_items[0][quantity]'               => '1',
        'line_items[0][price_data][currency]'   => 'usd',
        'line_items[0][price_data][unit_amount]'=> (string) ((int) $order['totalCents']),
        'line_items[0][price_data][product_data][name]' => $name,
        'line_items[0][price_data][product_data][description]'
            => 'One-time payment. No subscription is set up.',
        // A link nobody opens for two days is not worth keeping alive; Stripe
        // allows up to 24h, and the follow-up emails issue a fresh one.
        'expires_at' => (string) (time() + 23 * 3600),
    ];

    $ch = curl_init('https://api.stripe.com/v1/checkout/sessions');
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => http_build_query($fields),
        CURLOPT_USERPWD        => $cfg['stripe_secret'] . ':',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_TIMEOUT        => 12,
        // Stripe retries are safe to make idempotent, and this key means a
        // duplicated request cannot create a second session for one order.
        CURLOPT_HTTPHEADER     => ['Idempotency-Key: sp-' . $order['id'] . ($attempt !== '' ? '-' . $attempt : '')],
    ]);
    $body = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($body === false || $status < 200 || $status >= 300) return null;

    $data = json_decode((string) $body, true);
    if (!is_array($data) || empty($data['url'])) return null;

    return ['url' => (string) $data['url'], 'sessionId' => (string) ($data['id'] ?? '')];
}

/**
 * Verifies a webhook came from Stripe.
 *
 * The endpoint is a public URL that marks orders paid. Without this check,
 * anyone who finds it can POST a fabricated "payment succeeded" and get a
 * subscription for nothing, so the signature is not optional — an unverified
 * webhook handler is a free-goods button.
 *
 * hash_equals rather than === because a plain comparison leaks, through its
 * timing, how much of the signature was right.
 */
function sp_stripe_verify(string $payload, string $sigHeader, string $secret, int $tolerance = 300): bool
{
    if ($secret === '' || $sigHeader === '') return false;

    $timestamp = null;
    $signatures = [];
    foreach (explode(',', $sigHeader) as $part) {
        $kv = explode('=', trim($part), 2);
        if (count($kv) !== 2) continue;
        if ($kv[0] === 't') $timestamp = $kv[1];
        if ($kv[0] === 'v1') $signatures[] = $kv[1];
    }
    if ($timestamp === null || !$signatures) return false;

    // Rejects a signed payload captured and replayed later.
    if (abs(time() - (int) $timestamp) > $tolerance) return false;

    $expected = hash_hmac('sha256', $timestamp . '.' . $payload, $secret);
    foreach ($signatures as $s) {
        if (hash_equals($expected, $s)) return true;
    }
    return false;
}
