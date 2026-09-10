<?php
/**
 * POST /api/lead — someone got as far as a valid phone number and stopped.
 *
 * WHAT THIS IS FOR
 * The people who type a number and never press Order are the closest anyone
 * gets to buying without buying. They are worth one message. Nothing else on
 * the site can tell you who they were.
 *
 * WHERE THE LINE IS, AND WHY IT IS HERE
 * This fires only once the number VALIDATES and the customer has moved on to
 * the email field — a deliberate, completed act, not a keystroke logger on a
 * half-typed field. It records the number and nothing else about them: no
 * partial entries, no keystroke timing, no page-by-page trail.
 *
 * It is still personal data collected before anyone pressed a button that
 * said "order", so it has to be disclosed. The Privacy Policy names it. If
 * that line is ever removed, this endpoint has to go with it.
 *
 * A lead is NOT an order and never becomes one here: no email is sent to the
 * customer, no confirmation, nothing that would look like a purchase they did
 * not make. It appears in your dashboard so you can decide whether to reach
 * out.
 */

declare(strict_types=1);

require __DIR__ . '/lib/validate.php';
require __DIR__ . '/lib/store.php';

$configPath = __DIR__ . '/config.php';
if (!is_file($configPath)) { http_response_code(500); exit; }
$cfg = require $configPath;

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    echo json_encode(['ok' => false]);
    exit;
}

$raw = file_get_contents('php://input') ?: '';
if (strlen($raw) > 2048) { http_response_code(413); echo json_encode(['ok' => false]); exit; }
$in = json_decode($raw, true);
if (!is_array($in)) { http_response_code(400); echo json_encode(['ok' => false]); exit; }

$ip = sp_clean($_SERVER['REMOTE_ADDR'] ?? '', 45);
// Shares the order endpoint's throttle budget: this is the same visitor, and
// a script hitting this one is no more welcome than one hitting the other.
if (sp_rate_limited($cfg, $ip, 20)) { http_response_code(429); echo json_encode(['ok' => false]); exit; }

$phone = sp_clean($in['phone'] ?? '', 40);
if (!sp_valid_phone($phone)) { http_response_code(422); echo json_encode(['ok' => false]); exit; }

$dir = rtrim($cfg['orders_dir'], '/');
if (!is_dir($dir) && !@mkdir($dir, 0750, true) && !is_dir($dir)) {
    http_response_code(500); echo json_encode(['ok' => false]); exit;
}

$file = $dir . '/leads.json';
$leads = is_file($file) ? (json_decode((string) @file_get_contents($file), true) ?: []) : [];

$key = hash('sha256', preg_replace('/\D+/', '', $phone) ?? '');
$now = gmdate('c');

if (isset($leads[$key])) {
    // Seen before: refresh the timestamp and count, do not add a second row.
    $leads[$key]['lastSeen'] = $now;
    $leads[$key]['times'] = (int) ($leads[$key]['times'] ?? 1) + 1;
} else {
    $leads[$key] = [
        'phone'      => $phone,
        'country'    => sp_clean($in['country'] ?? '', 4),
        'term'       => sp_clean($in['planId'] ?? '', 8),
        'devices'    => max(1, min(5, (int) ($in['deviceCount'] ?? 1))),
        'firstSeen'  => $now,
        'lastSeen'   => $now,
        'times'      => 1,
        'sourcePage' => sp_clean($in['sourcePage'] ?? '', 120),
        'campaign'   => sp_campaign($in['campaign'] ?? null),
        'converted'  => false,
    ];
}

// Newest last, capped. Leads are a working list, not an archive.
if (count($leads) > 1000) $leads = array_slice($leads, -1000, null, true);
@file_put_contents($file, json_encode($leads, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES), LOCK_EX);

echo json_encode(['ok' => true]);
