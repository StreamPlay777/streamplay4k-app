<?php
/**
 * Mailgun sending.
 *
 * WHY THE HTTP API RATHER THAN SMTP
 * Same Mailgun account, same verified domain — a different door. The API is a
 * single HTTPS request to port 443, which is never blocked. Outbound SMTP on
 * ports 587 and 465 is blocked by a great many hosts, and when it is blocked
 * it fails slowly and silently: the page hangs, then the order looks like it
 * failed. If you would rather use SMTP, that needs PHPMailer added as a
 * dependency; say the word and it is a small change.
 *
 * Every send returns a result rather than throwing. An order is never lost
 * because a mail server had a bad minute — order.php writes the record to disk
 * BEFORE calling any of this, and a failure here is logged, not fatal.
 */

declare(strict_types=1);

/**
 * @return array{ok: bool, status: int, id: string, error: string}
 */
function sp_send_mail(array $cfg, string $to, string $subject, string $html, string $text, array $opts = []): array
{
    $endpoint = rtrim($cfg['mailgun_base'], '/') . '/' . rawurlencode($cfg['mailgun_domain']) . '/messages';

    $fields = [
        'from'    => $opts['from'] ?? $cfg['mail_from'],
        'to'      => $to,
        'subject' => $subject,
        'html'    => $html,
        // Always send a plain-text part too. Some clients prefer it, some
        // spam filters distrust HTML-only mail, and it is what a screen
        // reader or a watch will show.
        'text'    => $text,
    ];

    if (!empty($cfg['mail_reply_to'])) {
        $fields['h:Reply-To'] = $cfg['mail_reply_to'];
    }
    if (!empty($opts['tag'])) {
        $fields['o:tag'] = $opts['tag'];
    }
    // Transactional mail must never be batched or tracked for opens by
    // default: an order confirmation is not marketing.
    $fields['o:tracking-opens'] = 'no';
    $fields['o:tracking-clicks'] = 'no';

    $ch = curl_init($endpoint);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => http_build_query($fields),
        CURLOPT_USERPWD        => 'api:' . $cfg['mailgun_key'],
        CURLOPT_TIMEOUT        => 20,
        CURLOPT_CONNECTTIMEOUT => 8,
    ]);
    $body = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);

    $id = '';
    if (is_string($body)) {
        $decoded = json_decode($body, true);
        if (is_array($decoded) && isset($decoded['id'])) {
            $id = (string) $decoded['id'];
        }
    }

    return [
        'ok'     => $status >= 200 && $status < 300,
        'status' => $status,
        'id'     => $id,
        'error'  => $err !== '' ? $err : (is_string($body) && $status >= 400 ? mb_substr($body, 0, 300) : ''),
    ];
}
