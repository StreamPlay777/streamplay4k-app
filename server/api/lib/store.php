<?php
/**
 * Order records.
 *
 * Written to disk BEFORE any email is attempted, and outside the web root, so
 * that:
 *   - an order survives Mailgun being down, a key expiring, or a typo in the
 *     config — the three ways a shop silently stops taking orders
 *   - nothing is ever readable over HTTP, whatever the .htaccess does
 *
 * One JSON file per order plus one append-only NDJSON log. The log is what you
 * open to see the day's orders at a glance; the files are what a future admin
 * page or export would read. At this volume that is the right amount of
 * machinery — a database can come later without changing the endpoint.
 */

declare(strict_types=1);

function sp_store_order(array $cfg, array $record): array
{
    $dir = rtrim($cfg['orders_dir'], '/');
    if (!is_dir($dir) && !@mkdir($dir, 0750, true) && !is_dir($dir)) {
        return ['ok' => false, 'error' => 'orders directory is not writable'];
    }

    $file = $dir . '/' . $record['id'] . '.json';
    $json = json_encode($record, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    $wrote = @file_put_contents($file, $json, LOCK_EX);

    // Append-only day log, one order per line.
    @file_put_contents(
        $dir . '/orders-' . gmdate('Y-m') . '.ndjson',
        json_encode($record, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . "\n",
        FILE_APPEND | LOCK_EX
    );

    return $wrote === false
        ? ['ok' => false, 'error' => 'could not write the order file']
        : ['ok' => true, 'file' => $file];
}

/** Appends a line to the endpoint's own log. Never fatal. */
function sp_log(array $cfg, string $line): void
{
    $dir = rtrim($cfg['orders_dir'], '/');
    @file_put_contents($dir . '/endpoint.log', gmdate('c') . ' ' . $line . "\n", FILE_APPEND | LOCK_EX);
}

/**
 * The reference of an identical order taken in the last few minutes, or null.
 *
 * A double-tap on a slow connection, or a browser retry, must not produce two
 * orders and two emails. Keyed on the customer and the selection rather than a
 * client-supplied token, because the client cannot be trusted to send one.
 *
 * Returns the ORIGINAL reference, not the new one. The thank-you page prints
 * whatever comes back, and a reference that matches no stored order is worse
 * than useless — it is the number the customer reads out when they ask what
 * happened to their order.
 */
function sp_recent_duplicate(array $cfg, string $fingerprint, string $id, int $windowSeconds = 300): ?string
{
    $dir = rtrim($cfg['orders_dir'], '/');
    if (!is_dir($dir) && !@mkdir($dir, 0750, true) && !is_dir($dir)) return null;
    $seen = $dir . '/recent.json';
    $now = time();

    $map = is_file($seen) ? (json_decode((string) @file_get_contents($seen), true) ?: []) : [];
    $map = array_filter(
        $map,
        static fn($e) => is_array($e) && isset($e['t']) && is_int($e['t']) && $now - $e['t'] < $windowSeconds
    );

    $previous = $map[$fingerprint]['id'] ?? null;
    if ($previous === null) $map[$fingerprint] = ['t' => $now, 'id' => $id];

    @file_put_contents($seen, json_encode($map), LOCK_EX);

    return is_string($previous) ? $previous : null;
}

/**
 * Per-IP throttle.
 *
 * This endpoint sends two emails per accepted request, which makes it a spam
 * amplifier if left open: a script can burn the Mailgun quota and get the
 * domain's reputation flagged in an afternoon. The duplicate check above does
 * not help — that only catches the *same* order twice, and a script varies the
 * address every time.
 *
 * Deliberately generous. A real customer might legitimately submit twice (a
 * typo in the email, a second subscription for a relative), so the limit is
 * set where no human reaches it and a loop does immediately.
 */
function sp_rate_limited(array $cfg, string $ip, int $max = 8, int $windowSeconds = 3600): bool
{
    if ($ip === '') return false;

    $dir = rtrim($cfg['orders_dir'], '/');
    // The throttle runs before sp_store_order(), so on the very first request
    // after deploy the directory may not exist yet. Without this the counter
    // would silently never persist and the limit would never apply.
    if (!is_dir($dir) && !@mkdir($dir, 0750, true) && !is_dir($dir)) return false;
    $file = $dir . '/ratelimit.json';
    $now = time();

    $map = is_file($file) ? (json_decode((string) @file_get_contents($file), true) ?: []) : [];

    // Drop expired stamps everywhere, so the file cannot grow without bound.
    foreach ($map as $k => $stamps) {
        $kept = array_values(array_filter((array) $stamps, static fn($t) => is_int($t) && $now - $t < $windowSeconds));
        if ($kept) { $map[$k] = $kept; } else { unset($map[$k]); }
    }

    $key = hash('sha256', $ip);
    $hits = $map[$key] ?? [];
    $over = count($hits) >= $max;

    if (!$over) {
        $hits[] = $now;
        $map[$key] = $hits;
    }

    @file_put_contents($file, json_encode($map), LOCK_EX);
    return $over;
}
