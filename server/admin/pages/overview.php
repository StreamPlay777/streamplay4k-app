<?php
/**
 * Overview — what needs doing, and what has come in.
 *
 * EVERY NUMBER ON THIS PAGE IS COUNTED FROM THE ORDER FILES. There is no
 * conversion rate, no growth percentage, no chart of a trend, because nothing
 * on disk supports one honestly. A dashboard that invents a metric is worse
 * than a dashboard with fewer of them: you start making decisions on it.
 *
 * The order of the page is the order of the working day: first the money,
 * then the things waiting on you, then what has just happened.
 */

if (!defined('SP_ADMIN')) { http_response_code(403); exit; }

$orders = sp_list_orders($cfg, 1000);
$leads  = sp_open_leads($cfg);
$stats  = sp_admin_stats($orders);
$link   = sp_payment_link($cfg);

/* The queue: unpaid orders, oldest first, because the oldest is the one going
   cold. The rest of the page is newest-first; this list is not, on purpose. */
$todo = array_values(array_filter($orders, static fn(array $o): bool => sp_is_open($o)));
usort($todo, static fn($a, $b) => strcmp((string) ($a['createdAt'] ?? ''), (string) ($b['createdAt'] ?? '')));

sp_shell_open([
    'page'  => 'overview',
    'title' => 'Overview',
    'sub'   => $stats['total'] ? $stats['total'] . ' orders on file' : 'No orders yet',
    'actions' => '<a class="btn" href="' . e(sp_url('orders')) . '">' . sp_icon('orders') . 'All orders</a>',
], $cfg, $actor);

echo $flash;

if ($link === ''): ?>
  <div class="note note--warn"><?= sp_icon('alert') ?><p>
    <b>No payment link is set.</b> Invoices will go out without a pay button until you add one.
    <a href="<?= e(sp_url('settings-payments')) ?>">Set it in Settings &rarr; Payments</a>.
  </p></div>
<?php endif; ?>

<div class="kpis">
  <div class="kpi"><span>Paid revenue</span><b><?= e(sp_money($stats['revenueCents'])) ?></b>
    <small><?= $stats['paid'] ?> paid <?= $stats['paid'] === 1 ? 'order' : 'orders' ?><?php
      if ($stats['refunded']) echo ' &middot; ' . e(sp_money($stats['refundedCents'])) . ' refunded'; ?></small></div>
  <div class="kpi"><span>Paid, last 30 days</span><b><?= e(sp_money($stats['monthCents'])) ?></b>
    <small><?= e(sp_money($stats['todayCents'])) ?> today</small></div>
  <div class="kpi"><span>Awaiting payment</span><b><?= $stats['awaiting'] ?></b>
    <small><?= e(sp_money($stats['pipelineCents'])) ?> outstanding</small></div>
  <div class="kpi"><span>Invoice not sent</span><b><?= $stats['toInvoice'] ?></b>
    <small><?= $stats['invoiced'] ?> invoiced, unpaid</small></div>
  <div class="kpi"><span>Didn&rsquo;t finish</span><b><?= count($leads) ?></b>
    <small>left before ordering</small></div>
</div>

<div class="card">
  <div class="card__h">
    <h2>Needs you</h2>
    <span class="t-mut" style="font-size:12.5px;">oldest first</span>
    <span class="sp"><a class="btn btn--sm btn--ghost" href="<?= e(sp_url('orders', ['status' => 'open'])) ?>">See all</a></span>
  </div>

  <?php if (!$todo): ?>
    <div class="empty"><?= sp_icon('check') ?>
      <b><?= $stats['total'] ? 'Nothing waiting' : 'No orders yet' ?></b>
      <p><?= $stats['total']
          ? 'Every order has been paid, activated or closed.'
          : 'When someone orders on the website it appears here immediately.' ?></p>
    </div>
  <?php else: ?>
    <div class="scroller">
      <table>
        <thead><tr><th>Order</th><th>Customer</th><th>Plan</th><th>Total</th><th>Status</th><th>Waiting</th><th></th></tr></thead>
        <tbody>
        <?php foreach (array_slice($todo, 0, 8) as $o):
            $oid = (string) $o['id']; ?>
          <tr>
            <td><a class="rowlink" href="<?= e(sp_url('order', ['id' => $oid])) ?>"><?= e($oid) ?></a></td>
            <td><?= e((string) ($o['email'] ?? '—')) ?></td>
            <td><?= e((string) ($o['planTier'] ?? '—')) ?>
                <span class="t-sub"><?= (int) ($o['devices'] ?? 1) ?> <?= (int) ($o['devices'] ?? 1) === 1 ? 'device' : 'devices' ?></span></td>
            <td class="num" style="font-weight:600;"><?= e((string) ($o['totalFormatted'] ?? '')) ?></td>
            <td><?= sp_badge(sp_status_of($o)) ?></td>
            <td class="t-mut num" title="<?= e((string) ($o['createdAt'] ?? '')) ?>"><?= e(sp_waited((string) ($o['createdAt'] ?? ''))) ?></td>
            <td style="text-align:right;">
              <a class="btn btn--sm" href="<?= e(sp_url('order', ['id' => $oid])) ?>">Open</a>
            </td>
          </tr>
        <?php endforeach; ?>
        </tbody>
      </table>
    </div>
    <?php if (count($todo) > 8): ?>
      <div class="card__f"><span class="t-mut" style="font-size:12.5px;">
        <?= count($todo) - 8 ?> more waiting.
        <a href="<?= e(sp_url('orders', ['status' => 'open'])) ?>">Show them all</a>.
      </span></div>
    <?php endif; ?>
  <?php endif; ?>
</div>

<?php if ($orders): ?>
<div class="card">
  <div class="card__h"><h2>Latest orders</h2>
    <span class="sp"><a class="btn btn--sm btn--ghost" href="<?= e(sp_url('orders')) ?>">See all</a></span></div>
  <div class="scroller">
    <table>
      <thead><tr><th>Order</th><th>Customer</th><th>Plan</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
      <tbody>
      <?php foreach (array_slice($orders, 0, 6) as $o): $oid = (string) $o['id']; ?>
        <tr>
          <td><a class="rowlink" href="<?= e(sp_url('order', ['id' => $oid])) ?>"><?= e($oid) ?></a></td>
          <td><?= e((string) ($o['email'] ?? '—')) ?></td>
          <td><?= e((string) ($o['planTier'] ?? '—')) ?></td>
          <td class="num"><?= e((string) ($o['totalFormatted'] ?? '')) ?></td>
          <td><?= sp_badge(sp_status_of($o)) ?></td>
          <td class="t-mut num"><?= e(sp_ago((string) ($o['createdAt'] ?? ''))) ?></td>
        </tr>
      <?php endforeach; ?>
      </tbody>
    </table>
  </div>
</div>
<?php endif; ?>

<?php if ($leads): ?>
<div class="card">
  <div class="card__h"><h2>Didn&rsquo;t finish</h2>
    <span class="t-mut" style="font-size:12.5px;">left a working number, no order</span></div>
  <div class="scroller">
    <table>
      <thead><tr><th>Phone</th><th>Was looking at</th><th>Last seen</th><th>Visits</th><th></th></tr></thead>
      <tbody>
      <?php foreach (array_slice($leads, 0, 8) as $l):
          $d = sp_wa_digits((string) ($l['phone'] ?? ''));
          $t = TERMS[$l['term'] ?? ''] ?? null;
          $msg = rawurlencode('Hi! You were looking at ' . $cfg['brand_name']
               . ' earlier — can I help you finish your order, or answer anything first?'); ?>
        <tr>
          <td style="font-family:var(--mono);font-size:12.5px;"><?= e((string) ($l['phone'] ?? '')) ?></td>
          <td><?= e($t ? $t['tier'] . ' · ' . $t['label'] : ((string) ($l['term'] ?? '') ?: '—')) ?><?php
              if (!empty($l['devices'])) echo ' &middot; ' . (int) $l['devices'] . ' ' . ((int) $l['devices'] === 1 ? 'device' : 'devices'); ?></td>
          <td class="t-mut num"><?= e(sp_ago((string) ($l['lastSeen'] ?? ''))) ?></td>
          <td class="num"><?= (int) ($l['times'] ?? 1) ?></td>
          <td style="text-align:right;">
            <?php if ($d !== ''): ?>
              <a class="btn btn--sm" href="https://wa.me/<?= e($d) ?>?text=<?= $msg ?>" target="_blank" rel="noopener noreferrer">
                <?= sp_icon('external') ?>WhatsApp</a>
            <?php endif; ?>
          </td>
        </tr>
      <?php endforeach; ?>
      </tbody>
    </table>
  </div>
</div>
<?php endif; ?>

<?php sp_shell_close();
