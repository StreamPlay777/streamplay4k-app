<?php
/**
 * Operational settings the owner changes from the admin, not from a file.
 *
 * WHY THIS EXISTS SEPARATELY FROM config.php
 * config.php holds two different kinds of thing, and they want opposite
 * treatment. The Mailgun key, the Sheets token, the dashboard password hash —
 * those are secrets and infrastructure. They change rarely, they must never be
 * writable by a web request, and they belong in a file only SSH can touch.
 *
 * The active payment link is neither. It changes every few days, it is public
 * by nature (customers click it), and requiring SSH to rotate it means it
 * eventually goes stale and customers are handed a dead link. So it lives here
 * instead: one small JSON file the admin can write.
 *
 * WHERE
 * Beside the orders, in orders_dir, which is above the web root. Nothing here
 * is secret, but there is no reason for it to be fetchable either, and keeping
 * every piece of mutable state in one private directory means one thing to
 * back up and one thing to get right.
 *
 * HOW IT IS WRITTEN
 * Write to a temp file in the same directory, then rename over the target.
 * rename() is atomic within a filesystem, so a reader either sees the whole
 * old file or the whole new one — never a half-written one. The naive
 * file_put_contents can be read mid-write, and a truncated JSON file here
 * would mean the order endpoint suddenly has no payment link.
 */

declare(strict_types=1);

/** Every key the admin may write, with the rules for each. */
const SP_SETTINGS_FIELDS = [
    'payment_link' => ['type' => 'url', 'max' => 500],
];

function sp_settings_path(array $cfg): string
{
    return rtrim($cfg['orders_dir'], '/') . '/settings.json';
}

/**
 * All settings. Never throws; a missing or corrupt file reads as empty, which
 * every caller already handles as "not configured".
 */
function sp_settings_all(array $cfg): array
{
    $file = sp_settings_path($cfg);
    if (!is_file($file)) return [];
    $data = json_decode((string) @file_get_contents($file), true);
    return is_array($data) ? $data : [];
}

/**
 * The payment link the site should be using right now.
 *
 * PRECEDENCE, and why: the admin-managed value wins, and config.php is the
 * fallback. An installation that never opens the admin keeps working exactly
 * as it did before this file existed, and the moment the owner saves a link in
 * the admin it takes over — with no deploy, no rebuild, and no edit to
 * config.php.
 */
function sp_payment_link(array $cfg): string
{
    $s = sp_settings_all($cfg);
    $fromAdmin = isset($s['payment_link']) ? trim((string) $s['payment_link']) : '';
    if ($fromAdmin !== '') return $fromAdmin;
    return trim((string) ($cfg['payment_link'] ?? ''));
}

/** When the admin last changed it, or null if it has never been set there. */
function sp_payment_link_updated(array $cfg): ?array
{
    $s = sp_settings_all($cfg);
    if (empty($s['payment_link'])) return null;
    return [
        'at' => (string) ($s['payment_link_updated_at'] ?? ''),
        'by' => (string) ($s['payment_link_updated_by'] ?? ''),
    ];
}

/**
 * Validates one value against its field rule.
 *
 * A payment link is allowed to be cleared — an empty string is how the owner
 * says "there is no link right now", which the invoice email must handle
 * rather than rendering a button to nowhere.
 *
 * @return array{ok: bool, value: string, error: string}
 */
function sp_settings_validate(string $key, string $raw): array
{
    $rule = SP_SETTINGS_FIELDS[$key] ?? null;
    if ($rule === null) return ['ok' => false, 'value' => '', 'error' => 'Unknown setting.'];

    $v = trim($raw);
    if (mb_strlen($v) > $rule['max']) {
        return ['ok' => false, 'value' => '', 'error' => 'That is too long to be a link.'];
    }
    if ($v === '') return ['ok' => true, 'value' => '', 'error' => ''];

    if ($rule['type'] === 'url') {
        if (!filter_var($v, FILTER_VALIDATE_URL)) {
            return ['ok' => false, 'value' => '', 'error' => 'That is not a valid web address.'];
        }
        $scheme = strtolower((string) parse_url($v, PHP_URL_SCHEME));
        // https only. A payment page reached over http would have the
        // customer's card details travelling in the clear, and every real
        // processor serves https anyway — so an http link here is a typo or a
        // phishing attempt, never a legitimate configuration.
        if ($scheme !== 'https') {
            return ['ok' => false, 'value' => '', 'error' => 'The link must start with https:// — a payment page over http is not safe.'];
        }
        if (parse_url($v, PHP_URL_HOST) === null) {
            return ['ok' => false, 'value' => '', 'error' => 'That link has no website name in it.'];
        }
        // Control characters would break the mail header and the HTML alike.
        if (preg_match('/[\x00-\x1F\x7F<>"\']/', $v)) {
            return ['ok' => false, 'value' => '', 'error' => 'That link contains characters that are not allowed.'];
        }
    }
    return ['ok' => true, 'value' => $v, 'error' => ''];
}

/**
 * Writes one setting, atomically, with an audit stamp.
 *
 * @return array{ok: bool, error: string}
 */
function sp_settings_put(array $cfg, string $key, string $value, string $by): array
{
    if (!isset(SP_SETTINGS_FIELDS[$key])) return ['ok' => false, 'error' => 'Unknown setting.'];

    $dir = rtrim($cfg['orders_dir'], '/');
    if (!is_dir($dir) && !@mkdir($dir, 0750, true) && !is_dir($dir)) {
        return ['ok' => false, 'error' => 'The settings folder is not writable.'];
    }

    $all = sp_settings_all($cfg);
    $all[$key] = $value;
    $all[$key . '_updated_at'] = gmdate('c');
    $all[$key . '_updated_by'] = mb_substr($by, 0, 60);

    $json = json_encode($all, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    if ($json === false) return ['ok' => false, 'error' => 'Could not encode the settings.'];

    // Temp file in the SAME directory: rename is only atomic within one
    // filesystem, and /tmp is frequently a different one.
    $tmp = $dir . '/.settings.' . bin2hex(random_bytes(6)) . '.tmp';
    if (@file_put_contents($tmp, $json, LOCK_EX) === false) {
        return ['ok' => false, 'error' => 'Could not write the settings file.'];
    }
    @chmod($tmp, 0640);
    if (!@rename($tmp, sp_settings_path($cfg))) {
        @unlink($tmp);
        return ['ok' => false, 'error' => 'Could not save the settings file.'];
    }
    return ['ok' => true, 'error' => ''];
}
