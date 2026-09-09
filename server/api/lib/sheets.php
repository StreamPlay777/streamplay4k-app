<?php
/**
 * Mirror of every order into a Google Sheet.
 *
 * A MIRROR, NOT THE RECORD. Every call here is best-effort: the order is
 * already on disk before this runs, and a failure is a line in the log, never
 * an error the customer sees. A shop whose checkout breaks because a
 * spreadsheet is unreachable has put the spreadsheet in charge of taking
 * money, and Google Apps Script is not a service to put in that position — it
 * silently stops working when a deployment is edited.
 *
 * A failed post is remembered in sheets-pending.json so the follow-up cron can
 * push it later. Without that, the sheet quietly develops holes exactly when
 * you would most want it to be complete.
 *
 * The transport is an Apps Script web app rather than the Sheets API: no
 * service-account key on the server, no JWT signing, no token refresh. See
 * server/google-sheets/README.md.
 */

declare(strict_types=1);

/** True when a sheet is configured at all. Everything here no-ops otherwise. */
function sp_sheets_enabled(array $cfg): bool
{
    return !empty($cfg['sheets_url']) && !empty($cfg['sheets_token']);
}

/**
 * Push one order. Returns ['ok'=>bool, 'error'=>string].
 *
 * The timeouts are deliberately short. This runs while the customer is
 * watching a spinner, and Apps Script can take seconds to cold-start. Six
 * seconds is long enough for the normal case and short enough that a bad day
 * at Google does not become a bad day for the order form.
 */
function sp_sheets_push(array $cfg, array $order): array
{
    if (!sp_sheets_enabled($cfg)) return ['ok' => true, 'error' => ''];

    $payload = json_encode([
        'token' => $cfg['sheets_token'],
        'order' => $order,
    ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

    $ch = curl_init($cfg['sheets_url']);
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        // Apps Script answers a POST with a 302 to script.googleusercontent.com
        // and the real body is behind it. Without this the response is an empty
        // redirect page and every push looks like a failure.
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_CONNECTTIMEOUT => 4,
        CURLOPT_TIMEOUT        => 6,
    ]);
    $body = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);

    if ($body === false || $status < 200 || $status >= 300) {
        return ['ok' => false, 'error' => $err ?: ('http ' . $status)];
    }
    $data = json_decode((string) $body, true);
    if (!is_array($data) || ($data['ok'] ?? false) !== true) {
        // The commonest cause is a token mismatch, so name it: the alternative
        // is staring at "sheet push failed" with nothing to act on.
        return ['ok' => false, 'error' => 'script said: ' . mb_substr((string) ($data['error'] ?? $body), 0, 120)];
    }
    return ['ok' => true, 'error' => ''];
}

/** Remembers an order id whose push failed, for the cron to retry. */
function sp_sheets_defer(array $cfg, string $id): void
{
    $file = rtrim($cfg['orders_dir'], '/') . '/sheets-pending.json';
    $ids = is_file($file) ? (json_decode((string) @file_get_contents($file), true) ?: []) : [];
    if (!in_array($id, $ids, true)) $ids[] = $id;
    @file_put_contents($file, json_encode(array_slice($ids, -500)), LOCK_EX);
}

/**
 * Retry everything that failed earlier. Called by the cron.
 *
 * Ids that still fail stay in the queue; ids whose order file has since been
 * deleted are dropped rather than retried forever.
 */
function sp_sheets_flush(array $cfg): array
{
    if (!sp_sheets_enabled($cfg)) return ['sent' => 0, 'left' => 0];

    $file = rtrim($cfg['orders_dir'], '/') . '/sheets-pending.json';
    if (!is_file($file)) return ['sent' => 0, 'left' => 0];

    $ids = json_decode((string) @file_get_contents($file), true) ?: [];
    $left = [];
    $sent = 0;
    foreach ($ids as $id) {
        $order = sp_read_order($cfg, (string) $id);
        if ($order === null) continue;                 // gone; stop chasing it
        if (sp_sheets_push($cfg, $order)['ok']) { $sent++; } else { $left[] = $id; }
    }
    @file_put_contents($file, json_encode($left), LOCK_EX);
    return ['sent' => $sent, 'left' => count($left)];
}
