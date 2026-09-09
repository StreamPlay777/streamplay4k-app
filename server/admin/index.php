<?php
/**
 * https://streamplay4k.com/admin/ — every order, in one page.
 *
 * WHY THIS EXISTS: the alternative is reading a folder of JSON files over SFTP
 * or scrolling an inbox, and neither tells you at a glance how many orders are
 * sitting unpaid right now.
 *
 * SECURITY, in the order it matters:
 *
 *   The password is stored as a hash, never in plain text. config.php holds
 *   the output of password_hash(), so someone who reads the file still cannot
 *   log in anywhere else you reused that password.
 *
 *   Login is throttled per IP. Five wrong attempts buys a fifteen-minute
 *   lockout. A page that lets an unlimited number of guesses through is a
 *   password field in name only.
 *
 *   hash_equals for the token comparison, so the check does not leak, through
 *   its timing, how much of a guess was right.
 *
 *   The session cookie is HttpOnly, SameSite=Strict, and Secure over HTTPS.
 *   Every state-changing action carries a CSRF token, because otherwise any
 *   page you visit while logged in could mark orders paid on your behalf.
 *
 *   Nothing here is indexable: noindex headers, and the orders themselves are
 *   read from outside the web root, so they were never fetchable anyway.
 *
 * This file is deliberately self-contained — one page, no framework, no build
 * step. It is read far more often than it is edited.
 */

declare(strict_types=1);

$base = dirname(__DIR__) . '/api';
require $base . '/lib/pricing.php';
require $base . '/lib/validate.php';
require $base . '/lib/store.php';
require $base . '/lib/sheets.php';

$configPath = $base . '/config.php';
if (!is_file($configPath)) { http_response_code(500); exit('Not configured.'); }
$cfg = require $configPath;

header('X-Robots-Tag: noindex, nofollow');
header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');

$https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
      || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');

session_set_cookie_params([
    'lifetime' => 0,
    'path'     => '/admin/',
    'httponly' => true,
    'secure'   => $https,
    'samesite' => 'Strict',
]);
session_name('sp_admin');
session_start();

$user = (string) ($cfg['admin_user'] ?? '');
$hash = (string) ($cfg['admin_password_hash'] ?? '');
$configured = $user !== '' && $hash !== '';

/* ── Login throttle ───────────────────────────────────────────────────── */
function admin_locked(array $cfg, string $ip): bool
{
    $f = rtrim($cfg['orders_dir'], '/') . '/admin-attempts.json';
    $m = is_file($f) ? (json_decode((string) @file_get_contents($f), true) ?: []) : [];
    $e = $m[hash('sha256', $ip)] ?? null;
    return is_array($e) && ($e['n'] ?? 0) >= 5 && (time() - ($e['t'] ?? 0)) < 900;
}
function admin_attempt(array $cfg, string $ip, bool $ok): void
{
    $f = rtrim($cfg['orders_dir'], '/') . '/admin-attempts.json';
    $m = is_file($f) ? (json_decode((string) @file_get_contents($f), true) ?: []) : [];
    $k = hash('sha256', $ip);
    $now = time();
    foreach ($m as $kk => $vv) if ($now - ($vv['t'] ?? 0) > 900) unset($m[$kk]);
    if ($ok) { unset($m[$k]); }
    else { $m[$k] = ['n' => (($m[$k]['n'] ?? 0) + 1), 't' => $now]; }
    @file_put_contents($f, json_encode($m), LOCK_EX);
}

$ip = (string) ($_SERVER['REMOTE_ADDR'] ?? '');
$loginError = '';

if (($_POST['action'] ?? '') === 'login') {
    if (admin_locked($cfg, $ip)) {
        $loginError = 'Too many attempts. Try again in 15 minutes.';
    } elseif (
        hash_equals($user, (string) ($_POST['user'] ?? ''))
        && $hash !== '' && password_verify((string) ($_POST['pass'] ?? ''), $hash)
    ) {
        // New id on login, so a session id captured beforehand cannot be used.
        session_regenerate_id(true);
        $_SESSION['ok'] = true;
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
        admin_attempt($cfg, $ip, true);
        header('Location: ./');
        exit;
    } else {
        admin_attempt($cfg, $ip, false);
        $loginError = 'Wrong username or password.';
    }
}

if (($_GET['logout'] ?? '') === '1') {
    $_SESSION = [];
    session_destroy();
    header('Location: ./');
    exit;
}

$authed = !empty($_SESSION['ok']);

/* ── Actions ──────────────────────────────────────────────────────────── */
$flash = '';
if ($authed && ($_POST['action'] ?? '') === 'status') {
    if (!hash_equals((string) ($_SESSION['csrf'] ?? ''), (string) ($_POST['csrf'] ?? ''))) {
        $flash = 'Expired form — please try again.';
    } else {
        $id = sp_clean($_POST['id'] ?? '', 32);
        $to = sp_clean($_POST['status'] ?? '', 16);
        if (in_array($to, ['new', 'paid', 'activated', 'cancelled'], true)) {
            $changes = ['status' => $to];
            $before = sp_read_order($cfg, $id);
            // An activated account is by definition a paid one. Stamping
            // paidAt here too keeps "paid today" honest when you skip
            // straight to activated, which is what happens on a bank
            // transfer you confirmed by hand.
            if (in_array($to, ['paid', 'activated'], true) && empty($before['paidAt'])) $changes['paidAt'] = gmdate('c');
            if ($to === 'activated') $changes['activatedAt'] = gmdate('c');
            $updated = sp_update_order($cfg, $id, $changes);
            if ($updated) {
                if (!sp_sheets_push($cfg, $updated)['ok']) sp_sheets_defer($cfg, $id);
                $flash = "{$id} marked {$to}.";
            } else {
                $flash = "Could not update {$id}.";
            }
        }
    }
    // Redirect after POST so a refresh does not repeat the action.
    $_SESSION['flash'] = $flash;
    header('Location: ./' . (isset($_POST['q']) && $_POST['q'] !== '' ? '?q=' . urlencode((string) $_POST['q']) : ''));
    exit;
}
if ($authed && !empty($_SESSION['flash'])) { $flash = (string) $_SESSION['flash']; unset($_SESSION['flash']); }

/* ── Data ─────────────────────────────────────────────────────────────── */
$orders = $authed ? sp_list_orders($cfg, 1000) : [];
$leads  = $authed ? sp_open_leads($cfg) : [];
$q = trim((string) ($_GET['q'] ?? ''));
$filter = (string) ($_GET['status'] ?? '');

$stats = ['count' => 0, 'paid' => 0, 'unpaid' => 0, 'revenueCents' => 0, 'pipelineCents' => 0, 'todayCents' => 0];
$today = gmdate('Y-m-d');
foreach ($orders as $o) {
    $stats['count']++;
    $isPaid = ($o['status'] ?? '') === 'paid' || ($o['status'] ?? '') === 'activated' || !empty($o['paidAt']);
    if ($isPaid) {
        $stats['paid']++;
        $stats['revenueCents'] += (int) ($o['paidCents'] ?? $o['totalCents']);
        if (str_starts_with((string) ($o['paidAt'] ?? ''), $today)) $stats['todayCents'] += (int) ($o['paidCents'] ?? $o['totalCents']);
    } elseif (($o['status'] ?? '') !== 'cancelled') {
        $stats['unpaid']++;
        $stats['pipelineCents'] += (int) $o['totalCents'];
    }
}

$rows = array_values(array_filter($orders, function ($o) use ($q, $filter) {
    if ($filter !== '') {
        $s = ($o['status'] ?? 'new');
        if ($filter === 'unpaid' ? in_array($s, ['paid', 'activated', 'cancelled'], true) : $s !== $filter) return false;
    }
    if ($q === '') return true;
    $hay = mb_strtolower(implode(' ', [$o['id'] ?? '', $o['email'] ?? '', $o['phone'] ?? '', $o['planLabel'] ?? '', $o['campaign'] ?? '']));
    return str_contains($hay, mb_strtolower($q));
}));

function e(?string $s): string { return htmlspecialchars((string) $s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
function ago(string $iso): string
{
    $t = strtotime($iso);
    if (!$t) return '—';
    $d = time() - $t;
    if ($d < 3600) return max(1, intdiv($d, 60)) . 'm ago';
    if ($d < 86400) return intdiv($d, 3600) . 'h ago';
    return intdiv($d, 86400) . 'd ago';
}
$csrf = (string) ($_SESSION['csrf'] ?? '');
?>
<!doctype html>
<html lang="en" data-authed="<?= $authed ? '1' : '0' ?>">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Orders · StreamPlay4K</title>
<style>
  /* Same ink and accent as the site, restated here: this page must keep
     working if the site's build output is ever replaced or broken. */
  :root {
    color-scheme: dark;
    --bg:#06080f; --surface:#0d1119; --raise:#141924; --raise2:#1a2030;
    --line:#232a3a; --line2:#2e3648; --ink:#e8ecf5; --ink2:#c4ccdc; --ink4:#6b7689;
    --accent:#ff2b20; --warn:#f59e0b;
  }
  * { box-sizing:border-box; }
  body { margin:0; background:var(--bg); color:var(--ink);
         font:15px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif; }
  a { color:var(--accent); }
  .wrap { max-width:1180px; margin:0 auto; padding:28px 20px 80px; }
  header { display:flex; flex-wrap:wrap; gap:12px; align-items:baseline; justify-content:space-between; margin-bottom:24px; }
  h1 { font-size:21px; margin:0; letter-spacing:-.2px; }
  .muted { color:var(--ink4); font-size:13px; }
  .cards { display:grid; gap:12px; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); margin-bottom:22px; }
  .card { background:var(--surface); border:1px solid var(--line); border-radius:12px; padding:14px 16px; }
  .card b { display:block; font-size:24px; font-weight:800; letter-spacing:-.5px; margin-top:4px;
            font-variant-numeric:tabular-nums; }
  .card span { font-size:11px; text-transform:uppercase; letter-spacing:.12em; color:var(--ink4); font-weight:700; }
  form.tools { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:16px; }
  input, select, button { font:inherit; }
  input[type=text], input[type=password], select {
    background:var(--raise); border:1px solid var(--line2); color:var(--ink);
    border-radius:9px; padding:9px 12px; outline:none; }
  input:focus, select:focus { border-color:var(--accent); }
  button { background:var(--raise2); border:1px solid var(--line2); color:var(--ink2);
           border-radius:9px; padding:9px 14px; cursor:pointer; }
  button:hover { border-color:var(--ink4); color:var(--ink); }
  button.primary { background:var(--accent); border-color:var(--accent); color:#fff; font-weight:700; }
  table { width:100%; border-collapse:collapse; font-size:14px; }
  th { text-align:left; font-size:11px; text-transform:uppercase; letter-spacing:.1em;
       color:var(--ink4); padding:0 10px 8px; font-weight:700; white-space:nowrap; }
  td { padding:11px 10px; border-top:1px solid var(--line); vertical-align:top; }
  tr:hover td { background:var(--surface); }
  .id { font-family:ui-monospace,SFMono-Regular,Menlo,monospace; font-size:12.5px; color:var(--ink2); }
  .amt { font-variant-numeric:tabular-nums; font-weight:700; white-space:nowrap; }
  .pill { display:inline-block; padding:3px 9px; border-radius:999px; font-size:11px;
          font-weight:800; text-transform:uppercase; letter-spacing:.06em; }
  .s-new       { background:rgba(245,158,11,.16); color:#fbbf24; }
  .s-paid      { background:rgba(34,197,94,.16);  color:#4ade80; }
  .s-activated { background:rgba(59,130,246,.16); color:#60a5fa; }
  .s-cancelled { background:var(--raise2);        color:var(--ink4); }
  .flash { background:rgba(34,197,94,.1); border:1px solid rgba(34,197,94,.35);
           color:#86efac; padding:10px 14px; border-radius:10px; margin-bottom:16px; font-size:13.5px; }
  .warn { background:rgba(245,158,11,.1); border:1px solid rgba(245,158,11,.35); color:#fbbf24; }
  .login { max-width:340px; margin:14vh auto; }
  .login .card { padding:24px; }
  .login label { display:block; font-size:12px; color:var(--ink4); margin:14px 0 6px; font-weight:700;
                 text-transform:uppercase; letter-spacing:.1em; }
  .login input { width:100%; }
  .login button { width:100%; margin-top:18px; }
  .err { color:#fca5a5; font-size:13px; margin-top:12px; }
  .scroller { overflow-x:auto; -webkit-overflow-scrolling:touch; }
  @media (max-width:640px) { .wrap { padding:18px 12px 60px; } h1 { font-size:19px; } }
</style>
</head>
<body>

<?php if (!$configured): ?>
  <div class="login"><div class="card">
    <h1>Not set up yet</h1>
    <p class="muted" style="margin-top:10px;">
      Add <code>admin_user</code> and <code>admin_password_hash</code> to
      <code>api/config.php</code>. DEPLOY.md has the one-line command that
      generates the hash.
    </p>
  </div></div>

<?php elseif (!$authed): ?>
  <div class="login"><div class="card">
    <h1>StreamPlay4K orders</h1>
    <form method="post">
      <input type="hidden" name="action" value="login">
      <label for="u">Username</label>
      <input id="u" name="user" type="text" autocomplete="username" autofocus required>
      <label for="p">Password</label>
      <input id="p" name="pass" type="password" autocomplete="current-password" required>
      <button class="primary" type="submit">Sign in</button>
      <?php if ($loginError): ?><p class="err"><?= e($loginError) ?></p><?php endif; ?>
    </form>
  </div></div>

<?php else: ?>
  <div class="wrap">
    <header>
      <div>
        <h1>Orders</h1>
        <p class="muted" style="margin:4px 0 0;">
          <?= $stats['count'] ?> total · reading <?= e(basename(rtrim($cfg['orders_dir'], '/'))) ?>
        </p>
      </div>
      <a href="?logout=1" class="muted">Sign out</a>
    </header>

    <?php if ($flash): ?><div class="flash"><?= e($flash) ?></div><?php endif; ?>

    <div class="cards">
      <div class="card"><span>Paid revenue</span><b><?= e(sp_money($stats['revenueCents'])) ?></b></div>
      <div class="card"><span>Paid today</span><b><?= e(sp_money($stats['todayCents'])) ?></b></div>
      <div class="card"><span>Awaiting payment</span><b><?= $stats['unpaid'] ?></b></div>
      <div class="card"><span>In the pipeline</span><b><?= e(sp_money($stats['pipelineCents'])) ?></b></div>
      <div class="card"><span>Didn&rsquo;t finish</span><b><?= count($leads) ?></b></div>
    </div>

    <form class="tools" method="get">
      <input type="text" name="q" value="<?= e($q) ?>" placeholder="Search id, email, phone, campaign…" style="flex:1;min-width:200px;">
      <select name="status">
        <?php foreach (['' => 'All statuses', 'unpaid' => 'Awaiting payment', 'paid' => 'Paid', 'activated' => 'Activated', 'cancelled' => 'Cancelled'] as $v => $l): ?>
          <option value="<?= e($v) ?>"<?= $filter === $v ? ' selected' : '' ?>><?= e($l) ?></option>
        <?php endforeach; ?>
      </select>
      <button type="submit">Filter</button>
      <?php if ($q !== '' || $filter !== ''): ?><a href="./"><button type="button">Clear</button></a><?php endif; ?>
    </form>

    <?php if (!$rows): ?>
      <div class="card"><p class="muted" style="margin:0;">
        <?= $stats['count'] ? 'Nothing matches that.' : 'No orders yet. They appear here the moment one comes in.' ?>
      </p></div>
    <?php else: ?>
    <div class="scroller">
    <table>
      <thead><tr>
        <th>Order</th><th>When</th><th>Plan</th><th>Total</th>
        <th>Contact</th><th>Source</th><th>Status</th><th></th>
      </tr></thead>
      <tbody>
      <?php foreach ($rows as $o):
        $s = (string) ($o['status'] ?? 'new');
        $digits = preg_replace('/\D+/', '', (string) ($o['phone'] ?? '')) ?? '';
      ?>
        <tr>
          <td class="id"><?= e($o['id']) ?><?php if (!empty($o['priceMismatch'])): ?><br><span style="color:var(--warn);font-size:11px;">price mismatch</span><?php endif; ?></td>
          <td class="muted" title="<?= e($o['createdAt']) ?>"><?= e(ago((string) $o['createdAt'])) ?></td>
          <td><?= e($o['planLabel']) ?><br><span class="muted"><?= (int) $o['devices'] ?> <?= (int) $o['devices'] === 1 ? 'device' : 'devices' ?></span></td>
          <td class="amt"><?= e($o['totalFormatted']) ?></td>
          <td style="min-width:190px;">
            <a href="mailto:<?= e($o['email']) ?>"><?= e($o['email']) ?></a><br>
            <?php if ($digits): ?><a href="https://wa.me/<?= e($digits) ?>" target="_blank" rel="noopener">WhatsApp <?= e($o['phone']) ?></a><?php endif; ?>
          </td>
          <td class="muted" style="max-width:170px;"><?= e($o['sourcePage'] ?? '') ?><?php if (!empty($o['campaign'])): ?><br><?= e($o['campaign']) ?><?php endif; ?></td>
          <td><span class="pill s-<?= e($s) ?>"><?= e($s) ?></span></td>
          <td>
            <form method="post" style="display:flex;gap:6px;">
              <input type="hidden" name="action" value="status">
              <input type="hidden" name="csrf" value="<?= e($csrf) ?>">
              <input type="hidden" name="id" value="<?= e($o['id']) ?>">
              <input type="hidden" name="q" value="<?= e($q) ?>">
              <select name="status" aria-label="Set status for <?= e($o['id']) ?>">
                <?php foreach (['new', 'paid', 'activated', 'cancelled'] as $opt): ?>
                  <option value="<?= $opt ?>"<?= $s === $opt ? ' selected' : '' ?>><?= $opt ?></option>
                <?php endforeach; ?>
              </select>
              <button type="submit">Set</button>
            </form>
          </td>
        </tr>
      <?php endforeach; ?>
      </tbody>
    </table>
    </div>
    <?php endif; ?>

    <?php if ($leads): ?>
      <h2 style="font-size:17px;margin:34px 0 6px;">Didn&rsquo;t finish</h2>
      <p class="muted" style="margin:0 0 14px;">
        They entered a working number and stopped before placing the order. One message
        often finishes it. Rows disappear from here once the person orders.
      </p>
      <div class="scroller">
      <table>
        <thead><tr><th>Phone</th><th>Was looking at</th><th>Last seen</th><th>Visits</th><th>Source</th><th></th></tr></thead>
        <tbody>
        <?php foreach (array_slice($leads, 0, 100) as $l):
          $d = preg_replace('/\D+/', '', (string) $l['phone']) ?? '';
          $msg = rawurlencode('Hi! You were looking at ' . $cfg['brand_name'] . ' earlier — can I help you finish your order, or answer anything first?');
        ?>
          <tr>
            <td class="id"><?= e($l['phone']) ?></td>
            <?php /* The raw id "12m" reads as twelve minutes sitting next to
                     "1m ago" in the very next column. Use the label. */
                  $t = TERMS[$l['term']] ?? null; ?>
            <td><?= e($t ? $t['label'] : ($l['term'] ?: '—')) ?><?php if (!empty($l['devices'])): ?> · <?= (int) $l['devices'] ?>&nbsp;<?= (int) $l['devices'] === 1 ? 'device' : 'devices' ?><?php endif; ?></td>
            <td class="muted"><?= e(ago((string) $l['lastSeen'])) ?></td>
            <td class="muted"><?= (int) ($l['times'] ?? 1) ?></td>
            <td class="muted" style="max-width:190px;"><?= e($l['sourcePage'] ?? '') ?><?php if (!empty($l['campaign'])): ?><br><?= e($l['campaign']) ?><?php endif; ?></td>
            <td><?php if ($d): ?><a href="https://wa.me/<?= e($d) ?>?text=<?= e($msg) ?>" target="_blank" rel="noopener"><button type="button">WhatsApp</button></a><?php endif; ?></td>
          </tr>
        <?php endforeach; ?>
        </tbody>
      </table>
      </div>
    <?php endif; ?>
  </div>
<?php endif; ?>

</body>
</html>
