<?php
/**
 * One order, and everything you can do to it.
 *
 * THE ACTIONS ARE THE POINT. Every button on this page is wired to something
 * that actually happens: Send invoice sends mail through Mailgun, the status
 * buttons write to the order file and push to the Sheet. There is no Refund
 * button that only changes a label — refunding money happens in Stripe or in
 * your bank, and the button here records that you did it. That distinction is
 * written on the button itself, so nobody presses it expecting a transfer.
 *
 * WHAT IS SHOWN, and what deliberately is not: this page shows what was
 * captured at order time. The form asks for a phone number and an email
 * address, so there is no customer name to display and none is invented.
 */

if (!defined('SP_ADMIN')) { http_response_code(403); exit; }

$id = sp_clean($_GET['id'] ?? '', 32);
$o  = $id !== '' ? sp_read_order($cfg, $id) : null;

if (!$o) {
    sp_shell_open([
        'page' => 'orders', 'title' => 'Order not found',
        'back' => ['href' => sp_url('orders'), 'label' => 'All orders'],
    ], $cfg, $actor);
    echo '<div class="card"><div class="empty">' . sp_icon('search')
       . '<b>That order is not here</b><p>The order number may be mistyped, or the file may have '
       . 'been removed from the orders folder.</p></div></div>';
    sp_shell_close();
    return;
}

$status   = sp_status_of($o);
$email    = (string) ($o['email'] ?? '');
$digits   = sp_wa_digits((string) ($o['phone'] ?? ''));
$sent     = !empty($o['invoiceSentAt']);
$mailable = sp_valid_email($email);
$link     = sp_payment_link($cfg);
$here     = './?' . http_build_query(['p' => 'order', 'id' => $id]);

/** One action button, as its own form so each carries its own token. */
$act = function (string $action, string $label, string $icon, array $opts = []) use ($csrf, $id, $here): string {
    $cls = 'btn' . (!empty($opts['primary']) ? ' btn--primary' : '') . (!empty($opts['danger']) ? ' btn--danger' : '');
    // data-confirm, not onsubmit: the page's CSP forbids inline handlers, and
    // one delegated listener in the shell reads this for every form.
    $confirm = !empty($opts['confirm']) ? ' data-confirm="' . e((string) $opts['confirm']) . '"' : '';
    $extra = '';
    foreach ($opts['fields'] ?? [] as $k => $v) {
        $extra .= '<input type="hidden" name="' . e($k) . '" value="' . e((string) $v) . '">';
    }
    return '<form method="post"' . $confirm . '>' . sp_csrf_field($csrf)
         . '<input type="hidden" name="action" value="' . e($action) . '">'
         . '<input type="hidden" name="id" value="' . e($id) . '">'
         . '<input type="hidden" name="back" value="' . e($here) . '">'
         . $extra
         . '<button class="' . $cls . '" type="submit">' . sp_icon($icon) . e($label) . '</button></form>';
};

sp_shell_open([
    'page'  => 'orders',
    'title' => $id,
    'sub'   => sp_datetime((string) ($o['createdAt'] ?? '')),
    'back'  => ['href' => sp_url('orders'), 'label' => 'All orders'],
    'actions' => sp_badge($status),
], $cfg, $actor);

echo $flash;

if (!empty($o['priceMismatch'])): ?>
  <div class="note note--warn"><?= sp_icon('alert') ?><p>
    The price this customer saw did not match the price the server calculated
    (<?= e((string) ($o['clientTotal'] ?? '?')) ?> against
    <?= e((string) ($o['totalFormatted'] ?? '')) ?>). The server figure is the one stored and
    invoiced. Check it before taking payment.
  </p></div>
<?php endif;

if (!$mailable): ?>
  <div class="note note--warn"><?= sp_icon('alert') ?><p>
    This order has no usable email address, so an invoice cannot be emailed. Reach the customer
    on WhatsApp instead.
  </p></div>
<?php elseif ($link === ''): ?>
  <div class="note note--warn"><?= sp_icon('alert') ?><p>
    <b>No payment link is set.</b> An invoice sent now will show the amount but no pay button —
    it will tell the customer you are sending payment details on WhatsApp.
    <a href="<?= e(sp_url('settings-payments')) ?>">Set the link in Settings &rarr; Payments</a>
    first if you want them to be able to pay themselves.
  </p></div>
<?php endif; ?>

<div class="grid grid--2">
  <div>
    <!-- Customer -->
    <div class="card">
      <div class="card__h"><h2>Customer</h2></div>
      <div class="card__b">
        <dl class="dl">
          <dt>Email</dt>
          <dd><?php if ($email !== ''): ?><a href="mailto:<?= e($email) ?>"><?= e($email) ?></a><?php else: ?>&mdash;<?php endif; ?></dd>
          <dt>Phone</dt>
          <dd><?php if ($digits !== ''): ?>
                <a href="https://wa.me/<?= e($digits) ?>" target="_blank" rel="noopener noreferrer">
                  <?= e((string) $o['phone']) ?> &nearr;</a>
              <?php else: ?><?= e((string) ($o['phone'] ?? '—')) ?><?php endif; ?></dd>
          <dt>Country</dt><dd><?= e((string) ($o['country'] ?? '—')) ?></dd>
          <dt>Came from</dt>
          <dd><?= e((string) ($o['sourcePage'] ?? '—')) ?>
              <?php if (!empty($o['campaign'])): ?><span class="t-sub"><?= e((string) $o['campaign']) ?></span><?php endif; ?></dd>
        </dl>
      </div>
    </div>

    <!-- Subscription -->
    <div class="card">
      <div class="card__h"><h2>Subscription</h2></div>
      <div class="card__b">
        <dl class="dl">
          <dt>Plan</dt><dd><?= e((string) ($o['planTier'] ?? '—')) ?></dd>
          <?php // "6 Months (6 months)" — only restate the count when the label
                // does not already contain it, which it does for every current plan.
                $months = (int) ($o['termMonths'] ?? 0);
                $label  = (string) ($o['planLabel'] ?? '');
                $restate = $months > 0 && !str_contains($label, (string) $months); ?>
          <dt>Term</dt><dd><?= e($label !== '' ? $label : '—') ?><?php
              if ($restate) echo ' <span class="t-mut">(' . $months . ' months)</span>'; ?></dd>
          <dt>Devices</dt><dd><?= (int) ($o['devices'] ?? 1) ?></dd>
          <?php if (!empty($o['perMonthCents'])): ?>
            <dt>Per month</dt><dd class="num"><?= e(sp_money((int) $o['perMonthCents'])) ?></dd>
          <?php endif; ?>
        </dl>
      </div>
    </div>

    <!-- Payment -->
    <div class="card">
      <div class="card__h"><h2>Payment</h2></div>
      <div class="card__b">
        <dl class="dl">
          <dt>Base price</dt><dd class="num"><?= e(sp_money((int) ($o['baseCents'] ?? 0))) ?></dd>
          <?php if (!empty($o['extraCents'])): ?>
            <dt>Extra devices</dt><dd class="num"><?= e(sp_money((int) $o['extraCents'])) ?></dd>
          <?php endif; ?>
          <dt style="font-weight:600;color:var(--ink)">Total</dt>
          <dd class="num" style="font-weight:700;font-size:15px;">
            <?= e((string) ($o['totalFormatted'] ?? sp_money((int) ($o['totalCents'] ?? 0)))) ?></dd>
          <dt>Status</dt><dd><?= sp_badge($status) ?></dd>
          <?php if ($sent): ?>
            <dt>Invoice sent</dt>
            <dd><?= e(sp_datetime((string) $o['invoiceSentAt'])) ?>
              <?php $n = (int) ($o['invoiceSends'] ?? 1); if ($n > 1): ?>
                <span class="t-sub"><?= $n ?> copies, last <?= e(sp_ago((string) ($o['invoiceLastSentAt'] ?? ''))) ?></span>
              <?php endif; ?></dd>
            <dt>Link used</dt>
            <dd><?php if (!empty($o['invoiceLink'])): ?>
                  <a href="<?= e((string) $o['invoiceLink']) ?>" target="_blank" rel="noopener noreferrer">
                    <?= e(parse_url((string) $o['invoiceLink'], PHP_URL_HOST) ?: 'payment link') ?> &nearr;</a>
                <?php else: ?><span class="t-mut">no link at the time</span><?php endif; ?></dd>
          <?php endif; ?>
          <?php if (!empty($o['payUrl'])): ?>
            <dt>Checkout</dt>
            <dd><a href="<?= e((string) $o['payUrl']) ?>" target="_blank" rel="noopener noreferrer">Stripe session &nearr;</a></dd>
          <?php endif; ?>
        </dl>
      </div>
    </div>
  </div>

  <div>
    <!-- Actions -->
    <div class="card">
      <div class="card__h"><h2>Actions</h2></div>
      <div class="card__b" style="display:flex;flex-direction:column;gap:9px;">
        <?php if ($mailable && !$sent): ?>
          <?= $act('invoice', 'Send invoice', 'send', ['primary' => true]) ?>
          <p class="hint">Emails the invoice to <?= e($email) ?><?php
             if ($link !== '') echo ', with a pay button using the link currently set in Settings'; ?>.
             The status only changes if the email is accepted.</p>
        <?php elseif ($mailable && $sent): ?>
          <?= $act('invoice_resend', 'Resend invoice', 'refresh', [
                'confirm' => 'Send another copy of the invoice to ' . $email . '? It will use the payment link that is set right now.']) ?>
          <p class="hint">Sends a fresh copy using whatever payment link is set at the moment you press it.</p>
        <?php endif; ?>

        <?php if ($status !== 'paid' && $status !== 'activated'): ?>
          <?= $act('status', 'Mark paid', 'money', ['fields' => ['status' => 'paid'],
                'confirm' => 'Mark ' . $id . ' as paid? Do this once the money has actually arrived.']) ?>
        <?php endif; ?>

        <?php if ($status !== 'activated'): ?>
          <?= $act('status', 'Mark activated', 'check', ['fields' => ['status' => 'activated'],
                'confirm' => 'Mark ' . $id . ' as activated? This also records it as paid.']) ?>
        <?php endif; ?>

        <?php if ($status !== 'cancelled' && $status !== 'refunded'): ?>
          <?= $act('status', 'Cancel order', 'ban', ['danger' => true, 'fields' => ['status' => 'cancelled'],
                'confirm' => 'Cancel ' . $id . '? It stops being counted as expected income.']) ?>
        <?php endif; ?>

        <?php if (sp_is_paid($o) && $status !== 'refunded'): ?>
          <?= $act('status', 'Record a refund', 'refresh', ['danger' => true, 'fields' => ['status' => 'refunded'],
                'confirm' => 'Record ' . $id . ' as refunded? This does NOT move any money — refund the customer in Stripe or your bank first, then record it here.']) ?>
          <p class="hint">Recording only. The money must be sent back in Stripe or your bank —
             nothing here can move it.</p>
        <?php endif; ?>

        <?php if ($status !== 'new'): ?>
          <?= $act('status', 'Reset to new', 'left', ['fields' => ['status' => 'new'],
                'confirm' => 'Reset ' . $id . ' to new? This clears its paid, activated and invoice dates. Use it to undo a mistake.']) ?>
        <?php endif; ?>

        <?php if ($digits !== ''): ?>
          <a class="btn" href="https://wa.me/<?= e($digits) ?>" target="_blank" rel="noopener noreferrer">
            <?= sp_icon('external') ?>Message on WhatsApp</a>
        <?php endif; ?>
      </div>
    </div>

    <!-- Timeline -->
    <div class="card">
      <div class="card__h"><h2>Timeline</h2></div>
      <div class="card__b">
        <ul class="tl">
          <?php foreach (sp_order_timeline($o) as $t): ?>
            <li class="on"><b><?= e($t['label']) ?></b><span><?= e(sp_datetime($t['at'])) ?></span></li>
          <?php endforeach; ?>
          <?php if (sp_is_open($o)): ?>
            <li><b class="t-mut"><?= $sent ? 'Waiting for payment' : 'Invoice not sent yet' ?></b>
                <span><?= $sent ? 'Since ' . e(sp_ago((string) $o['invoiceSentAt'])) : 'Nothing has been emailed' ?></span></li>
          <?php endif; ?>
        </ul>
      </div>
    </div>
  </div>
</div>

<?php sp_shell_close();
