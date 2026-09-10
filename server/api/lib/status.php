<?php
/**
 * The order lifecycle, defined once.
 *
 * The admin renders these, the invoice action sets them, the dashboard counts
 * them and the spreadsheet mirrors them. Four places reading four private
 * lists is how a status ends up spelled two ways and every total goes quietly
 * wrong, so there is one list and they all read it.
 *
 * THE HAPPY PATH
 *   new → invoice_sent → paid → activated
 *
 * AND THE ENDINGS THAT ARE NOT FAILURES OF THE CODE
 *   expired    the term ran out
 *   cancelled  it is not going ahead
 *   refunded   money went back
 *
 * BACKWARD COMPATIBILITY IS THE POINT OF sp_status_of(). Orders taken before
 * invoice_sent existed carry 'new' or 'paid' and no timestamps for the new
 * steps. Nothing here requires a field to be present; an unknown or missing
 * status reads as 'new', so an old order renders and counts correctly rather
 * than disappearing from a filter or crashing a page.
 */

declare(strict_types=1);

const SP_STATUSES = [
    'new'          => ['label' => 'New',          'tone' => 'neutral', 'open' => true],
    'invoice_sent' => ['label' => 'Invoice sent', 'tone' => 'info',    'open' => true],
    'paid'         => ['label' => 'Paid',         'tone' => 'success', 'open' => false],
    'activated'    => ['label' => 'Activated',    'tone' => 'active',  'open' => false],
    'expired'      => ['label' => 'Expired',      'tone' => 'muted',   'open' => false],
    'cancelled'    => ['label' => 'Cancelled',    'tone' => 'muted',   'open' => false],
    'refunded'     => ['label' => 'Refunded',     'tone' => 'warning', 'open' => false],
];

/** The stored status, normalised. Anything unrecognised reads as 'new'. */
function sp_status_of(array $order): string
{
    $s = (string) ($order['status'] ?? 'new');
    return isset(SP_STATUSES[$s]) ? $s : 'new';
}

function sp_status_label(string $status): string
{
    return SP_STATUSES[$status]['label'] ?? ucfirst(str_replace('_', ' ', $status));
}

function sp_status_tone(string $status): string
{
    return SP_STATUSES[$status]['tone'] ?? 'neutral';
}

/**
 * Has the customer paid, and kept it? True for paid and activated.
 *
 * Reads paidAt as well as the status, because an order can be marked activated
 * directly — an activated account is a paid one, and a revenue figure that
 * only counted 'paid' would under-report every order that skipped a step.
 *
 * Refunded is false even though such an order was certainly paid once. It
 * still carries its paidAt, which is correct — that is when the money arrived —
 * but money that has gone back is not revenue, and a total that keeps counting
 * it overstates the business by exactly the amount you returned.
 *
 * Cancelled is treated the other way: if a cancelled order has a paidAt, the
 * money did arrive and has not been recorded as going back. Record a refund on
 * it if it did.
 */
function sp_is_paid(array $order): bool
{
    $s = sp_status_of($order);
    if ($s === 'refunded') return false;
    return $s === 'paid' || $s === 'activated' || !empty($order['paidAt']);
}

/** Still waiting on money: not paid, not cancelled, not refunded, not expired. */
function sp_is_open(array $order): bool
{
    if (sp_is_paid($order)) return false;
    return SP_STATUSES[sp_status_of($order)]['open'] ?? true;
}

/**
 * The timestamp field that a status implies, for stamping on transition.
 * Statuses not listed carry no timestamp of their own.
 */
const SP_STATUS_STAMP = [
    'invoice_sent' => 'invoiceSentAt',
    'paid'         => 'paidAt',
    'activated'    => 'activatedAt',
    'cancelled'    => 'cancelledAt',
    'refunded'     => 'refundedAt',
    'expired'      => 'expiredAt',
];

/**
 * The changes to write when moving an order to a status.
 *
 * Stamps the status's own timestamp if it is missing, and fills in the ones it
 * implies. An order marked activated without ever being marked paid still gets
 * a paidAt, because you cannot activate an unpaid account and a gap there
 * makes every revenue total wrong.
 *
 * Timestamps are never overwritten once set: the first time something happened
 * is the true answer, and re-marking an order should not rewrite its history.
 */
function sp_status_changes(array $order, string $to): array
{
    if (!isset(SP_STATUSES[$to])) return [];

    $now = gmdate('c');
    $changes = ['status' => $to];

    $stamp = static function (string $field) use ($order, &$changes, $now): void {
        if (empty($order[$field])) $changes[$field] = $now;
    };

    if (isset(SP_STATUS_STAMP[$to])) $stamp(SP_STATUS_STAMP[$to]);
    if ($to === 'activated') $stamp('paidAt');

    // Back to 'new' is a correction, so it clears the forward progress it
    // undoes. Without this an order reset to new still counts as revenue.
    if ($to === 'new') {
        foreach (['invoiceSentAt', 'paidAt', 'activatedAt', 'cancelledAt', 'refundedAt', 'expiredAt'] as $f) {
            $changes[$f] = null;
        }
    }

    return $changes;
}
