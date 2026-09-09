<?php
/**
 * The follow-up sequence. Run hourly by cron.
 *
 * WHAT IT SENDS, AND WHY EACH ONE EXISTS
 *
 *   +6h   unpaid   A nudge with a fresh pay link. Most people who abandon at
 *                  this stage got distracted, not cold. One reminder recovers
 *                  more than the next three combined.
 *   +24h  unpaid   Second and LAST payment reminder. It offers the human
 *                  route — WhatsApp — because someone who ignored a button
 *                  twice has a question, not a memory problem.
 *   +48h  paid     Check-in: is everything working? Catches the customer who
 *                  is quietly stuck on setup and would otherwise charge back.
 *   +5d   paid     A note before the 7-day refund window closes. This looks
 *                  like it invites refunds; it does the opposite. Someone who
 *                  was about to give up gets help while there is still time,
 *                  and someone happy is reminded they chose well.
 *
 * THREE RULES THIS FILE OBEYS
 *
 *   Never twice. Every send is recorded on the order as sentFollowups[], and
 *   the check is against that list. A cron that double-fires — an overlapping
 *   run, a manual invocation — must not mail anyone a second time.
 *
 *   Never to the paid. The unpaid nudges re-read the order's status at send
 *   time, so a payment that lands between runs cancels the chase. Asking a
 *   paying customer for money again is worse than not asking at all.
 *
 *   Never retroactively. Orders placed before the sequence existed are marked
 *   as already-sent rather than blasted with four emails at once. Switching
 *   this on must not mail your entire back catalogue.
 *
 * The Stripe link in a nudge is issued FRESH, because checkout sessions expire
 * after 24 hours and a reminder built around a dead link is worse than no
 * reminder at all.
 */

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    // Cron on Hostinger runs `php /path/followups.php`. Reachable over HTTP it
    // would be a way for anyone to trigger your mail sending.
    http_response_code(403);
    exit("cli only\n");
}

$base = dirname(__DIR__);
require $base . '/lib/pricing.php';
require $base . '/lib/validate.php';
require $base . '/lib/mailer.php';
require $base . '/lib/store.php';
require $base . '/lib/stripe.php';
require $base . '/lib/sheets.php';
require $base . '/templates/emails.php';
require $base . '/templates/followups.php';

$cfg = require $base . '/config.php';

$dry = in_array('--dry-run', $argv, true);
$now = time();

/* ── Which stage is due, in order ─────────────────────────────────────── */
const STAGES = [
    ['key' => 'nudge1',   'after' => 6 * 3600,      'needs' => 'unpaid'],
    ['key' => 'nudge2',   'after' => 24 * 3600,     'needs' => 'unpaid'],
    ['key' => 'checkin',  'after' => 48 * 3600,     'needs' => 'paid'],
    ['key' => 'refund',   'after' => 5 * 24 * 3600, 'needs' => 'paid'],
];

/* Orders older than this were placed before the sequence existed, or are long
   dead. Either way nobody wants an email about them now. */
const MAX_AGE = 14 * 24 * 3600;

$sent = 0; $skipped = 0; $errors = 0;
$lines = [];

foreach (sp_list_orders($cfg, 1000) as $order) {
    $age = $now - strtotime((string) $order['createdAt']);
    if ($age < 0 || $age > MAX_AGE) { $skipped++; continue; }

    $already = is_array($order['sentFollowups'] ?? null) ? $order['sentFollowups'] : [];
    $paid = ($order['status'] ?? '') === 'paid' || !empty($order['paidAt']);
    if (($order['status'] ?? '') === 'cancelled') { $skipped++; continue; }

    foreach (STAGES as $stage) {
        if ($age < $stage['after']) continue;              // not due yet
        if (in_array($stage['key'], $already, true)) continue;   // already sent
        if ($stage['needs'] === 'unpaid' && $paid) {
            // Paid before the nudge was due. Mark it done so it never fires.
            $already[] = $stage['key'];
            if (!$dry) sp_update_order($cfg, $order['id'], ['sentFollowups' => $already]);
            continue;
        }
        if ($stage['needs'] === 'paid' && !$paid) continue;  // unpaid: nothing to check in about

        /* A nudge needs a link that still works. */
        $fresh = $order;
        if ($stage['needs'] === 'unpaid' && sp_stripe_enabled($cfg) && !$dry) {
            $pay = sp_stripe_checkout($cfg, $order, $stage['key']);
            if ($pay) {
                $fresh['payUrl'] = $pay['url'];
                sp_update_order($cfg, $order['id'], ['payUrl' => $pay['url']]);
            }
        }

        $mail = sp_followup_email($stage['key'], $fresh, $cfg);
        if ($mail === null) continue;

        $lines[] = sprintf('%s %s → %s', $order['id'], $stage['key'], $order['email']);

        // break, not continue: one stage per order per run, in dry mode too,
        // or the preview shows sends that would not happen.
        if ($dry) { $sent++; break; }

        $r = sp_send_mail($cfg, $order['email'], $mail['subject'], $mail['html'], $mail['text'], ['tag' => 'followup-' . $stage['key']]);
        if ($r['ok']) {
            $already[] = $stage['key'];
            sp_update_order($cfg, $order['id'], ['sentFollowups' => $already]);
            $sent++;
        } else {
            // NOT marked as sent, so the next hourly run tries again. A
            // transient Mailgun failure should not silently drop a stage.
            sp_log($cfg, "followup {$stage['key']} FAILED for {$order['id']}: {$r['error']}");
            $errors++;
        }
        // One stage per order per run. If two are due, the second goes out an
        // hour later rather than two emails landing in the same minute.
        break;
    }
}

/* Catch up anything the Google Sheet missed while it was unreachable. */
$flush = $dry ? ['sent' => 0, 'left' => 0] : sp_sheets_flush($cfg);

$summary = sprintf(
    'followups: sent=%d skipped=%d errors=%d sheet_retried=%d sheet_pending=%d%s',
    $sent, $skipped, $errors, $flush['sent'], $flush['left'], $dry ? ' (DRY RUN)' : ''
);
if (!$dry) sp_log($cfg, $summary);

echo $summary . "\n";
foreach ($lines as $l) echo '  ' . $l . "\n";
