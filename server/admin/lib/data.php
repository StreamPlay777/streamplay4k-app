<?php
/**
 * Reading the orders: counting them, and narrowing them.
 *
 * Kept out of the pages so that Overview and Orders cannot drift into two
 * different answers for the same question — the commonest way a dashboard
 * ends up showing one revenue figure on the front page and another on the
 * list behind it.
 *
 * EVERY FIGURE HERE IS DERIVED FROM A STORED FIELD. There is no estimated
 * conversion rate, no projected revenue, no forecast. If the data on disk
 * cannot answer a question, this file does not answer it either.
 */

declare(strict_types=1);

if (!defined('SP_ADMIN')) { http_response_code(403); exit; }

/** What one order is worth: what was actually paid if known, else the total. */
function sp_order_cents(array $o): int
{
    return (int) ($o['paidCents'] ?? $o['totalCents'] ?? 0);
}

/**
 * The numbers on the Overview.
 *
 * "Last 30 days" is measured against paidAt, which is stamped when an order is
 * marked paid — so it answers "money that came in recently", not "orders
 * placed recently". Those differ whenever someone pays a week late, and the
 * first is the one worth putting on a dashboard.
 */
function sp_admin_stats(array $orders): array
{
    $s = [
        'total' => 0, 'paid' => 0, 'awaiting' => 0, 'toInvoice' => 0, 'invoiced' => 0,
        'revenueCents' => 0, 'pipelineCents' => 0, 'todayCents' => 0, 'monthCents' => 0,
        'mismatch' => 0, 'refunded' => 0, 'refundedCents' => 0,
    ];
    $today = gmdate('Y-m-d');
    $since = gmdate('c', time() - 30 * 86400);

    foreach ($orders as $o) {
        $s['total']++;
        if (!empty($o['priceMismatch'])) $s['mismatch']++;
        $status = sp_status_of($o);

        if ($status === 'refunded') {
            // Counted on its own, and deliberately not netted off the revenue
            // figure: "you took $774 and gave $99 back" is two facts, and
            // showing one number instead hides the second.
            $s['refunded']++;
            $s['refundedCents'] += sp_order_cents($o);
        } elseif (sp_is_paid($o)) {
            $s['paid']++;
            $cents = sp_order_cents($o);
            $s['revenueCents'] += $cents;
            $paidAt = (string) ($o['paidAt'] ?? '');
            if (str_starts_with($paidAt, $today)) $s['todayCents'] += $cents;
            if ($paidAt !== '' && $paidAt >= $since) $s['monthCents'] += $cents;
        } elseif (sp_is_open($o)) {
            $s['awaiting']++;
            $s['pipelineCents'] += (int) ($o['totalCents'] ?? 0);
            if ($status === 'invoice_sent') $s['invoiced']++;
            else $s['toInvoice']++;
        }
    }
    return $s;
}

/**
 * Search and status filtering.
 *
 * "open" is offered as a pseudo-status because "everything still waiting on
 * money" is the question actually asked of this list, and it does not map to
 * a single stored value.
 */
function sp_admin_filter(array $orders, string $q, string $status): array
{
    $q = mb_strtolower(trim($q));

    return array_values(array_filter($orders, static function (array $o) use ($q, $status): bool {
        if ($status !== '') {
            if ($status === 'open') { if (!sp_is_open($o)) return false; }
            elseif (sp_status_of($o) !== $status) return false;
        }
        if ($q === '') return true;

        $hay = mb_strtolower(implode(' ', [
            (string) ($o['id'] ?? ''),
            (string) ($o['email'] ?? ''),
            (string) ($o['phone'] ?? ''),
            (string) ($o['planTier'] ?? ''),
            (string) ($o['planLabel'] ?? ''),
            (string) ($o['country'] ?? ''),
            (string) ($o['campaign'] ?? ''),
        ]));
        return str_contains($hay, $q);
    }));
}

/** Digits only, for a wa.me link. Empty when there is nothing dialable. */
function sp_wa_digits(?string $phone): string
{
    return (string) preg_replace('/\D+/', '', (string) $phone);
}

/**
 * What happened to this order, in order.
 *
 * Built from the timestamps the order carries, so an order taken before a step
 * existed simply has fewer entries — never a fabricated one.
 */
function sp_order_timeline(array $o): array
{
    $rows = [['label' => 'Order placed', 'at' => (string) ($o['createdAt'] ?? '')]];

    if (!empty($o['invoiceSentAt'])) {
        $n = (int) ($o['invoiceSends'] ?? 1);
        $rows[] = [
            'label' => 'Invoice sent' . ($n > 1 ? ' (' . $n . ' times)' : ''),
            'at'    => (string) $o['invoiceSentAt'],
        ];
        if ($n > 1 && !empty($o['invoiceLastSentAt'])) {
            $rows[] = ['label' => 'Invoice last resent', 'at' => (string) $o['invoiceLastSentAt']];
        }
    }
    foreach ([
        'paidAt'      => 'Marked paid',
        'activatedAt' => 'Activated',
        'cancelledAt' => 'Cancelled',
        'refundedAt'  => 'Refunded',
        'expiredAt'   => 'Expired',
    ] as $field => $label) {
        if (!empty($o[$field])) $rows[] = ['label' => $label, 'at' => (string) $o[$field]];
    }

    usort($rows, static fn($a, $b) => strcmp($a['at'], $b['at']));
    return $rows;
}
