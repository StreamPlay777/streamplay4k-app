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

/* ═══════════════════════════════════════════════════════════════════════
   READING AND UPDATING

   Written after the endpoint, because the dashboard, the follow-up cron and
   the Stripe webhook all need to read an order back and change its status.
   They share these four functions rather than each parsing the directory
   their own way — three implementations of "which orders are unpaid" would
   drift, and the one that drifts is the one that emails the wrong customer.
   ═══════════════════════════════════════════════════════════════════════ */

/** Absolute path of one order's file. Never built from unfiltered input. */
function sp_order_path(array $cfg, string $id): ?string
{
    // Ids are SP-1234. The longer SP-YYYYMMDD-XXXXXX form is still accepted so
    // that orders taken before the short format stay readable. Anything else
    // is a traversal attempt or a bug, and must not reach the filesystem.
    if (!preg_match('/^SP-(\d{4,8}|\d{8}-[A-Z0-9]{6})$/', $id)) return null;
    return rtrim($cfg['orders_dir'], '/') . '/' . $id . '.json';
}

function sp_read_order(array $cfg, string $id): ?array
{
    $path = sp_order_path($cfg, $id);
    if ($path === null || !is_file($path)) return null;
    $data = json_decode((string) @file_get_contents($path), true);
    return is_array($data) ? $data : null;
}

/**
 * Merge fields into an order and write it back.
 *
 * Read-modify-write under an exclusive lock held across BOTH halves. Without
 * the lock, the follow-up cron and a Stripe webhook landing in the same second
 * would each read the pre-change record and the second write would erase the
 * first — which in practice means an order marked paid, then un-marked, and a
 * customer chased for money they already sent.
 */
function sp_update_order(array $cfg, string $id, array $changes): ?array
{
    $path = sp_order_path($cfg, $id);
    if ($path === null || !is_file($path)) return null;

    $fh = @fopen($path, 'c+');
    if (!$fh) return null;
    if (!flock($fh, LOCK_EX)) { fclose($fh); return null; }

    $raw = stream_get_contents($fh);
    $order = json_decode((string) $raw, true);
    if (!is_array($order)) { flock($fh, LOCK_UN); fclose($fh); return null; }

    $order = array_merge($order, $changes);
    $order['updatedAt'] = gmdate('c');

    $json = json_encode($order, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    rewind($fh);
    ftruncate($fh, 0);
    fwrite($fh, (string) $json);
    fflush($fh);
    flock($fh, LOCK_UN);
    fclose($fh);

    return $order;
}

/**
 * Every order, newest first.
 *
 * Reads the per-order files rather than the NDJSON log, because the log is
 * append-only and holds each order as it was *created* — an order marked paid
 * an hour later still reads "new" there. The files are the current truth.
 *
 * A directory scan is the right tool at this volume. If this ever gets slow,
 * that is the signal to move to SQLite, and the endpoint will not have to
 * change: only these four functions know how orders are stored.
 */
function sp_list_orders(array $cfg, int $limit = 500): array
{
    $dir = rtrim($cfg['orders_dir'], '/');
    $files = glob($dir . '/SP-*.json') ?: [];
    rsort($files, SORT_STRING);           // ids start with the date, so this is chronological
    $out = [];
    foreach (array_slice($files, 0, $limit) as $f) {
        $o = json_decode((string) @file_get_contents($f), true);
        if (is_array($o) && isset($o['id'])) $out[] = $o;
    }
    return $out;
}

/**
 * Marks a captured lead as converted, so the recovery list only holds people
 * who genuinely did not finish.
 *
 * Called when an order completes. Without it the list fills with customers who
 * already bought, and chasing those is worse than not chasing at all.
 */
function sp_lead_converted(array $cfg, string $phone): void
{
    $file = rtrim($cfg['orders_dir'], '/') . '/leads.json';
    if (!is_file($file)) return;
    $leads = json_decode((string) @file_get_contents($file), true) ?: [];
    $key = hash('sha256', preg_replace('/\D+/', '', $phone) ?? '');
    if (!isset($leads[$key])) return;
    $leads[$key]['converted'] = true;
    $leads[$key]['convertedAt'] = gmdate('c');
    @file_put_contents($file, json_encode($leads, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES), LOCK_EX);
}

/** Leads who never ordered, newest first. */
function sp_open_leads(array $cfg): array
{
    $file = rtrim($cfg['orders_dir'], '/') . '/leads.json';
    if (!is_file($file)) return [];
    $leads = json_decode((string) @file_get_contents($file), true) ?: [];
    $open = array_values(array_filter($leads, static fn($l) => is_array($l) && empty($l['converted'])));
    usort($open, static fn($a, $b) => strcmp((string) $b['lastSeen'], (string) $a['lastSeen']));
    return $open;
}

/**
 * The next order reference: SP-1001, SP-1002, and so on.
 *
 * SEQUENTIAL, NOT RANDOM. Four digits is 10,000 values, and random picks from
 * that pool collide sooner than intuition suggests — a 50/50 chance of a
 * repeat by the 118th order. A repeat here is not cosmetic: two orders would
 * write to the same file and one customer's details would overwrite the
 * other's. Counting removes the possibility instead of making it unlikely.
 *
 * Starts at 1001 so the first customer is not told they are order number one.
 *
 * The counter is read and written under one exclusive lock. Two orders landing
 * in the same instant would otherwise both read the same number, and the
 * second write would silently replace the first order on disk.
 *
 * If the counter file is ever lost, it is rebuilt from the highest id already
 * in the directory rather than restarting at 1001 and overwriting history.
 */
function sp_next_order_id(array $cfg): string
{
    $dir = rtrim($cfg['orders_dir'], '/');
    if (!is_dir($dir) && !@mkdir($dir, 0750, true) && !is_dir($dir)) {
        // Nowhere to keep a counter. A timestamp-based id is ugly but unique,
        // and the caller is about to fail on the write anyway.
        return 'SP-' . substr((string) time(), -6);
    }

    $file = $dir . '/counter.json';
    $fh = @fopen($file, 'c+');
    if (!$fh) return 'SP-' . substr((string) time(), -6);
    flock($fh, LOCK_EX);

    $raw = stream_get_contents($fh);
    $data = json_decode((string) $raw, true);
    $next = is_array($data) && isset($data['next']) ? (int) $data['next'] : 0;

    if ($next < 1001) {
        // First run, or a lost counter: resume above the highest id on disk.
        $highest = 1000;
        foreach (glob($dir . '/SP-*.json') ?: [] as $f) {
            if (preg_match('/SP-(\d+)\.json$/', $f, $m)) $highest = max($highest, (int) $m[1]);
        }
        $next = $highest + 1;
    }

    rewind($fh);
    ftruncate($fh, 0);
    fwrite($fh, (string) json_encode(['next' => $next + 1, 'updatedAt' => gmdate('c')]));
    fflush($fh);
    flock($fh, LOCK_UN);
    fclose($fh);

    return 'SP-' . $next;
}
