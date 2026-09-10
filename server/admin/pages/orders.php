<?php
/**
 * Orders — the screen this admin exists for.
 *
 * COLUMN ORDER IS THE ARGUMENT. Order, Customer, Plan, Devices, Total, Status,
 * Date. You scan down the status column, find the ones still waiting, and open
 * them; everything else is context for deciding whether to bother. Actions sit
 * last because they are what you do after you have decided, not before.
 *
 * ONE ACTION PER ROW, and it is the obvious next one: an order with no invoice
 * gets Send invoice, everything else gets Open. Six buttons on every row turns
 * a list into a control panel and makes the wrong click as easy as the right
 * one — the full set lives on the order's own page, where there is room to
 * show what each one will do.
 */

if (!defined('SP_ADMIN')) { http_response_code(403); exit; }

$orders = sp_list_orders($cfg, 1000);
$q      = trim((string) ($_GET['q'] ?? ''));
$filter = sp_clean($_GET['status'] ?? '', 20);
if ($filter !== 'open' && $filter !== '' && !isset(SP_STATUSES[$filter])) $filter = '';

$rows  = sp_admin_filter($orders, $q, $filter);
$stats = sp_admin_stats($orders);
$here  = './?' . http_build_query(array_filter(['p' => 'orders', 'q' => $q, 'status' => $filter]));

$sub = count($rows) === count($orders)
    ? count($orders) . ' ' . (count($orders) === 1 ? 'order' : 'orders')
    : count($rows) . ' of ' . count($orders) . ' shown';

sp_shell_open([
    'page'  => 'orders',
    'title' => 'Orders',
    'sub'   => $sub,
], $cfg, $actor);

echo $flash;
?>

<div class="card">
  <form class="tools" method="get">
    <input type="hidden" name="p" value="orders">
    <input class="inp" type="search" name="q" value="<?= e($q) ?>"
           placeholder="Search order number, email, phone, plan, country&hellip;">
    <select class="inp" name="status" aria-label="Filter by status">
      <option value="">All statuses</option>
      <option value="open"<?= $filter === 'open' ? ' selected' : '' ?>>Still awaiting payment</option>
      <?php foreach (SP_STATUSES as $key => $meta): ?>
        <option value="<?= e($key) ?>"<?= $filter === $key ? ' selected' : '' ?>><?= e($meta['label']) ?></option>
      <?php endforeach; ?>
    </select>
    <button class="btn" type="submit">Apply</button>
    <?php if ($q !== '' || $filter !== ''): ?>
      <a class="btn btn--ghost" href="<?= e(sp_url('orders')) ?>">Clear</a>
    <?php endif; ?>
  </form>

  <?php if (!$rows): ?>
    <div class="empty">
      <?= sp_icon($orders ? 'search' : 'inbox') ?>
      <?php if ($orders): ?>
        <b>Nothing matches that</b>
        <p>No order matches <?= $q !== '' ? '&ldquo;' . e($q) . '&rdquo;' : 'this filter' ?>.
           Try a shorter search, or clear the filter to see all <?= count($orders) ?>.</p>
      <?php else: ?>
        <b>No orders yet</b>
        <p>Orders placed on the website appear here straight away — you do not have to refresh
           anything or import them.</p>
      <?php endif; ?>
    </div>
  <?php else: ?>
    <div class="scroller">
      <table>
        <thead>
          <tr>
            <th>Order</th><th>Customer</th><th>Plan</th><th>Devices</th>
            <th>Total</th><th>Status</th><th>Date</th><th></th>
          </tr>
        </thead>
        <tbody>
        <?php foreach ($rows as $o):
            $id     = (string) $o['id'];
            $status = sp_status_of($o);
            $link   = sp_url('order', ['id' => $id]);
        ?>
          <tr>
            <td>
              <a class="rowlink" href="<?= e($link) ?>"><?= e($id) ?></a>
              <?php if (!empty($o['priceMismatch'])): ?>
                <span class="t-sub" style="color:var(--warnc);">price mismatch</span>
              <?php endif; ?>
            </td>
            <td>
              <?= e((string) ($o['email'] ?? '—')) ?>
              <span class="t-sub"><?= e((string) ($o['phone'] ?? '')) ?><?php
                  if (!empty($o['country'])) echo ' &middot; ' . e((string) $o['country']); ?></span>
            </td>
            <td>
              <?= e((string) ($o['planTier'] ?? $o['planLabel'] ?? '—')) ?>
              <span class="t-sub"><?= e((string) ($o['planLabel'] ?? '')) ?></span>
            </td>
            <td class="num"><?= (int) ($o['devices'] ?? 1) ?></td>
            <td class="num" style="font-weight:600;"><?= e((string) ($o['totalFormatted'] ?? sp_money((int) ($o['totalCents'] ?? 0)))) ?></td>
            <td><?= sp_badge($status) ?></td>
            <td class="t-mut num" title="<?= e((string) ($o['createdAt'] ?? '')) ?>"><?= e(sp_ago((string) ($o['createdAt'] ?? ''))) ?></td>
            <td style="text-align:right;">
              <?php if ($status === 'new' && sp_valid_email((string) ($o['email'] ?? ''))): ?>
                <form method="post" style="display:inline">
                  <?= sp_csrf_field($csrf) ?>
                  <input type="hidden" name="action" value="invoice">
                  <input type="hidden" name="id" value="<?= e($id) ?>">
                  <input type="hidden" name="back" value="<?= e($here) ?>">
                  <button class="btn btn--sm" type="submit"><?= sp_icon('send') ?>Send invoice</button>
                </form>
              <?php else: ?>
                <a class="btn btn--sm btn--ghost" href="<?= e($link) ?>">Open</a>
              <?php endif; ?>
            </td>
          </tr>
        <?php endforeach; ?>
        </tbody>
      </table>
    </div>
    <div class="card__f">
      <span class="t-mut" style="font-size:12.5px;">
        <?= $stats['awaiting'] ?> still awaiting payment &middot;
        <?= e(sp_money($stats['pipelineCents'])) ?> outstanding
      </span>
    </div>
  <?php endif; ?>
</div>

<?php sp_shell_close();
