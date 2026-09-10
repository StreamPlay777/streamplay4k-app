<?php
/**
 * Everything the admin can change, in one place.
 *
 * Each handler follows the same shape and it is worth stating once: check the
 * CSRF token, validate the input, do the work, then redirect. The redirect is
 * not cosmetic — without it, refreshing the page after marking an order paid
 * marks it paid again, and after sending an invoice sends a second copy.
 *
 * THE RULE THAT MATTERS MOST IS IN sp_admin_send_invoice(): the order's status
 * is changed only after Mailgun has accepted the message. Optimistically
 * flipping to "invoice sent" and then failing to send leaves the dashboard
 * saying the customer was invoiced when nothing left the building, and the
 * order silently stops being chased. A failed send therefore changes nothing
 * at all, and says so.
 */

declare(strict_types=1);

if (!defined('SP_ADMIN')) { http_response_code(403); exit; }

/**
 * A redirect target supplied by the form.
 *
 * Only our own query strings are allowed through. Anything else — a scheme, a
 * host, a protocol-relative "//evil" — is discarded in favour of the default,
 * so this can never become a redirector that sends someone off-site.
 */
function sp_admin_back(string $raw, string $fallback): string
{
    if ($raw !== '' && preg_match('#^\./\?[A-Za-z0-9_\-=&%.+]*$#', $raw)) return $raw;
    return $fallback;
}

function sp_admin_flash(string $text, string $tone = 'ok'): void
{
    $_SESSION['flash'] = ['text' => $text, 'tone' => $tone];
}

/** Push the order to the Sheet, queueing a retry rather than failing loudly. */
function sp_admin_mirror(array $cfg, array $order): void
{
    if (!sp_sheets_enabled($cfg)) return;
    if (!sp_sheets_push($cfg, $order)['ok']) sp_sheets_defer($cfg, (string) $order['id']);
}

/* ── Send / resend the invoice ────────────────────────────────────────── */
/**
 * @param bool $isResend true only when the admin pressed Resend. The two are
 *        separate actions on purpose: a resend is a deliberate act, and the
 *        customer should never receive a second invoice because a button was
 *        double-clicked or a page refreshed.
 */
function sp_admin_send_invoice(array $cfg, string $id, bool $isResend, string $actor): void
{
    $order = sp_read_order($cfg, $id);
    if (!$order) { sp_admin_flash('That order could not be found.', 'err'); return; }

    $already = !empty($order['invoiceSentAt']);
    if (!$isResend && $already) {
        sp_admin_flash('An invoice has already been sent for this order. Use Resend invoice.', 'warn');
        return;
    }
    if ($isResend && !$already) {
        sp_admin_flash('No invoice has been sent yet — use Send invoice.', 'warn');
        return;
    }
    $email = (string) ($order['email'] ?? '');
    if (!sp_valid_email($email)) {
        sp_admin_flash('This order has no usable email address, so nothing was sent.', 'err');
        return;
    }

    // Read the link NOW. It is rotated from Settings every few days, and the
    // only correct value is the one live at the moment of sending — never one
    // captured when the page was rendered or when the order was placed.
    $link = sp_payment_link($cfg);

    $mail = sp_invoice_email($order, $cfg, $link, $isResend);
    $r = sp_send_mail($cfg, $email, $mail['subject'], $mail['html'], $mail['text'], [
        'tag' => $isResend ? 'invoice-resend' : 'invoice',
    ]);

    if (!$r['ok']) {
        // Nothing is written. The order keeps the status it had, so it stays
        // in the queue of things still to do.
        sp_log($cfg, sprintf('%s invoice %s FAILED (%d) %s', $id, $isResend ? 'resend' : 'send', $r['status'], $r['error']));
        sp_admin_flash('The invoice could not be sent, so nothing was changed. ' . ($r['error'] ?: 'Mail service error ' . $r['status']), 'err');
        return;
    }

    $now = gmdate('c');
    $changes = [
        'invoiceSends'      => ((int) ($order['invoiceSends'] ?? 0)) + 1,
        'invoiceLastSentAt' => $now,
        // The link that actually went out, kept so that "which link did this
        // customer get?" has an answer after the link has been rotated twice.
        'invoiceLink'       => $link,
        'invoiceBy'         => $actor,
    ];
    if (!$already) $changes['invoiceSentAt'] = $now;

    // Only a brand-new order advances. An order already paid, activated,
    // cancelled or refunded keeps its status: a resent copy of the paperwork
    // does not undo what has happened since.
    if (sp_status_of($order) === 'new') {
        $changes = array_merge($changes, sp_status_changes($order, 'invoice_sent'));
    }

    $updated = sp_update_order($cfg, $id, $changes);
    if (!$updated) {
        sp_admin_flash('The invoice was sent, but the order file could not be updated. Check the orders folder.', 'warn');
        return;
    }
    sp_admin_mirror($cfg, $updated);
    sp_log($cfg, sprintf('%s invoice %s ok to %s link=%s', $id, $isResend ? 'resend' : 'send', $email, $link !== '' ? 'yes' : 'none'));

    $note = $isResend ? 'Invoice resent to ' . $email . '.' : 'Invoice sent to ' . $email . '.';
    if ($link === '') $note .= ' It has no payment button, because no payment link is set in Settings.';
    sp_admin_flash($note, $link === '' ? 'warn' : 'ok');
}

/* ── Move an order along ──────────────────────────────────────────────── */
function sp_admin_set_status(array $cfg, string $id, string $to): void
{
    if (!isset(SP_STATUSES[$to])) { sp_admin_flash('That is not a status.', 'err'); return; }
    $order = sp_read_order($cfg, $id);
    if (!$order) { sp_admin_flash('That order could not be found.', 'err'); return; }

    $updated = sp_update_order($cfg, $id, sp_status_changes($order, $to));
    if (!$updated) { sp_admin_flash('Could not update ' . $id . '.', 'err'); return; }

    sp_admin_mirror($cfg, $updated);
    sp_log($cfg, sprintf('%s status %s -> %s (admin)', $id, sp_status_of($order), $to));
    sp_admin_flash($id . ' is now ' . mb_strtolower(sp_status_label($to)) . '.');
}

/* ── Save a setting ───────────────────────────────────────────────────── */
function sp_admin_save_setting(array $cfg, string $key, string $raw, string $actor): void
{
    $v = sp_settings_validate($key, $raw);
    if (!$v['ok']) { sp_admin_flash($v['error'], 'err'); return; }

    $w = sp_settings_put($cfg, $key, $v['value'], $actor);
    if (!$w['ok']) { sp_admin_flash($w['error'], 'err'); return; }

    sp_log($cfg, sprintf('setting %s %s by %s', $key, $v['value'] === '' ? 'cleared' : 'updated', $actor));
    sp_admin_flash($v['value'] === ''
        ? 'The payment link has been cleared. Invoices will not show a pay button until you set one.'
        : 'Saved. New invoices will use this link straight away.',
        $v['value'] === '' ? 'warn' : 'ok');
}

/**
 * The router's POST half. Runs the named action, then redirects, always.
 */
function sp_admin_dispatch(array $cfg, string $action, string $actor): void
{
    if (!sp_admin_csrf_ok()) {
        sp_admin_flash('That form had expired. Nothing was changed — please try again.', 'err');
        header('Location: ./');
        exit;
    }

    $id   = sp_clean($_POST['id'] ?? '', 32);
    $back = sp_admin_back((string) ($_POST['back'] ?? ''), './');

    switch ($action) {
        case 'invoice':
            sp_admin_send_invoice($cfg, $id, false, $actor);
            break;
        case 'invoice_resend':
            sp_admin_send_invoice($cfg, $id, true, $actor);
            break;
        case 'status':
            sp_admin_set_status($cfg, $id, sp_clean($_POST['status'] ?? '', 16));
            break;
        case 'setting':
            $key = sp_clean($_POST['key'] ?? '', 40);
            sp_admin_save_setting($cfg, $key, (string) ($_POST['value'] ?? ''), $actor);
            break;
        default:
            sp_admin_flash('Unknown action.', 'err');
    }

    header('Location: ' . $back);
    exit;
}
