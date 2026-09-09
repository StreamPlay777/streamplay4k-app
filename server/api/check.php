<?php
/**
 * /api/check.php — does this server actually run the order system?
 *
 * WRITTEN IN OLD PHP ON PURPOSE. Every other file here needs PHP 8, and on
 * PHP 7 they fail with a parse error before a single line runs — which shows
 * up as a blank 500 and an order form that silently stops working. This file
 * uses nothing newer than PHP 5.4, so it still runs on the version that is the
 * problem, and can say so.
 *
 * Reveals no secrets: whether a key is filled in, never what it is.
 * Delete this file once the site is live.
 */

header('Content-Type: text/html; charset=utf-8');
header('X-Robots-Tag: noindex, nofollow');

$checks = array();

/* ── PHP version ──────────────────────────────────────────────────── */
$phpOk = version_compare(PHP_VERSION, '8.0.0', '>=');
$checks[] = array(
    'ok'   => $phpOk,
    'name' => 'PHP version',
    'got'  => PHP_VERSION,
    'fix'  => 'hPanel &rarr; Advanced &rarr; PHP Configuration &rarr; set PHP to 8.1 or newer, then Save. '
            . 'WordPress hosting is often left on 7.4, and on 7.4 the order endpoint cannot run at all.',
);

/* ── Extensions ───────────────────────────────────────────────────── */
$curl = function_exists('curl_init');
$checks[] = array(
    'ok'   => $curl,
    'name' => 'cURL extension',
    'got'  => $curl ? 'available' : 'MISSING',
    'fix'  => 'Enable curl in hPanel &rarr; PHP Configuration &rarr; PHP extensions. '
            . 'Without it no email can be sent and no row reaches the sheet.',
);

$mb = function_exists('mb_substr');
$checks[] = array(
    'ok'   => $mb,
    'name' => 'mbstring extension',
    'got'  => $mb ? 'available' : 'MISSING',
    'fix'  => 'Enable mbstring in hPanel &rarr; PHP Configuration &rarr; PHP extensions.',
);

/* ── Config ───────────────────────────────────────────────────────── */
$configPath = dirname(__FILE__) . '/config.php';
$hasConfig = file_exists($configPath);
$checks[] = array(
    'ok'   => $hasConfig,
    'name' => 'config.php exists',
    'got'  => $hasConfig ? 'found' : 'NOT FOUND',
    'fix'  => 'Copy config.example.php to config.php in this same folder and fill it in.',
);

$cfg = array();
if ($hasConfig && $phpOk) {
    $cfg = include $configPath;
    if (!is_array($cfg)) $cfg = array();
}

if ($hasConfig && !$phpOk) {
    $checks[] = array(
        'ok' => false, 'name' => 'Everything below',
        'got' => 'not checked',
        'fix' => 'Fix the PHP version first, then reload this page. Nothing else can be tested until then.',
    );
} elseif ($hasConfig) {

    $need = array(
        'mailgun_key'  => 'Your Mailgun sending API key. Without it, no emails go out at all.',
        'orders_inbox' => 'The address that receives new-order notifications.',
        'orders_dir'   => 'Full path to the orders folder, ABOVE public_html.',
    );
    foreach ($need as $key => $why) {
        $filled = isset($cfg[$key]) && $cfg[$key] !== '';
        $checks[] = array(
            'ok'   => $filled,
            'name' => 'config: ' . $key,
            'got'  => $filled ? 'filled in' : 'EMPTY',
            'fix'  => $why,
        );
    }

    /* The orders folder is the one thing that must be writable, and the one
       thing most likely to be wrong — a typo in the path looks like nothing
       until the first order fails to save. */
    $dir = isset($cfg['orders_dir']) ? rtrim($cfg['orders_dir'], '/') : '';
    if ($dir !== '') {
        $exists = is_dir($dir);
        if (!$exists) @mkdir($dir, 0750, true);
        $exists = is_dir($dir);
        $writable = $exists && is_writable($dir);
        $checks[] = array(
            'ok'   => $writable,
            'name' => 'orders folder writable',
            'got'  => !$exists ? 'DOES NOT EXIST' : ($writable ? 'yes' : 'NOT WRITABLE'),
            'fix'  => 'Create the folder in hPanel File Manager, one level ABOVE public_html, and put its '
                    . 'full path in config.php. It must be outside public_html so order records can never '
                    . 'be fetched over the web.',
        );

        $inside = $exists && strpos(realpath($dir), realpath(dirname(dirname(__FILE__)))) === 0;
        $checks[] = array(
            'ok'   => !$inside,
            'name' => 'orders folder is private',
            'got'  => $inside ? 'INSIDE THE WEB ROOT' : 'outside the web root',
            'fix'  => 'Move it above public_html. Where it is now, anyone who guesses the path can read '
                    . 'your customers&rsquo; names, emails and phone numbers.',
        );
    }

    $optional = array(
        'sheets_url'          => 'Google Sheet mirror is off. Orders still work.',
        'stripe_secret'       => 'Stripe checkout is off. The email says an invoice is coming.',
        'payment_link'        => 'No pay-now link in the email. The email says an invoice is coming.',
        'admin_password_hash' => 'The /admin/ dashboard cannot be signed into.',
    );
    foreach ($optional as $key => $note) {
        $filled = isset($cfg[$key]) && $cfg[$key] !== '';
        $checks[] = array(
            'ok'   => true,
            'soft' => !$filled,
            'name' => 'config: ' . $key,
            'got'  => $filled ? 'filled in' : 'not set',
            'fix'  => $note,
        );
    }
}

/* ── Mailgun, tested against Mailgun ───────────────────────────────
   "Filled in" is not the same as "works". The three ways this goes wrong —
   an SMTP password pasted where an API key belongs, a key from the EU region
   against a US base URL, and a domain that was never verified — all look
   identical in the config file and all fail silently at the first order.
   One authenticated GET tells them apart. It sends no email. */
if ($hasConfig && $phpOk && $curl && !empty($cfg['mailgun_key']) && !empty($cfg['mailgun_domain'])) {
    $base = isset($cfg['mailgun_base']) ? rtrim($cfg['mailgun_base'], '/') : 'https://api.mailgun.net/v3';
    $ch = curl_init($base . '/domains/' . rawurlencode($cfg['mailgun_domain']));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_USERPWD, 'api:' . $cfg['mailgun_key']);
    curl_setopt($ch, CURLOPT_TIMEOUT, 12);
    $mgBody = curl_exec($ch);
    $mgCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $mgErr = curl_error($ch);
    curl_close($ch);

    if ($mgCode === 200) {
        $state = '';
        $d = json_decode((string) $mgBody, true);
        if (is_array($d) && isset($d['domain']['state'])) $state = $d['domain']['state'];
        $verified = ($state === '' || $state === 'active');
        $checks[] = array(
            'ok'   => $verified,
            'name' => 'Mailgun key works',
            'got'  => $verified ? 'yes — domain active' : ('domain state: ' . $state),
            'fix'  => 'Mailgun accepted the key but the domain is not active yet. Finish the DNS records '
                    . 'under Send &rarr; Domain settings &rarr; DNS records, then click Verify.',
        );
    } else {
        $why = 'Mailgun refused the request (HTTP ' . $mgCode . ').';
        if ($mgCode === 401) {
            $why = 'Mailgun says the key is wrong (401). Two things this usually is: you pasted the '
                 . '<b>SMTP password</b> instead of an API key &mdash; they are different, and only an API '
                 . 'key works here; or the key is from the wrong region. Your domain is US, so '
                 . 'mailgun_base must stay <code>https://api.mailgun.net/v3</code> (EU accounts use '
                 . 'api.eu.mailgun.net). Get a key at Send &rarr; Domain settings &rarr; Sending API keys.';
        } elseif ($mgCode === 404) {
            $why = 'The key works but Mailgun has no domain called <code>'
                 . htmlspecialchars($cfg['mailgun_domain'], ENT_QUOTES, 'UTF-8')
                 . '</code>. Check the spelling, and that you are looking at the same Mailgun account.';
        } elseif ($mgCode === 0) {
            $why = 'Could not reach Mailgun at all' . ($mgErr ? ' (' . htmlspecialchars($mgErr, ENT_QUOTES, 'UTF-8') . ')' : '')
                 . '. If this persists, ask Hostinger whether outbound HTTPS is blocked.';
        }
        $checks[] = array('ok' => false, 'name' => 'Mailgun key works', 'got' => 'HTTP ' . $mgCode, 'fix' => $why);
    }
}

/* ── Optionally, actually send one ────────────────────────────────── */
/* Only ever to orders_inbox from the config — never to an address supplied in
   the request. The worst anyone who finds this page can do is mail its owner,
   and the page is meant to be deleted once setup is done. */
$sent = null;
if (isset($_POST['sendtest']) && $hasConfig && $phpOk && $curl && !empty($cfg['mailgun_key']) && !empty($cfg['orders_inbox'])) {
    $base = isset($cfg['mailgun_base']) ? rtrim($cfg['mailgun_base'], '/') : 'https://api.mailgun.net/v3';
    $ch = curl_init($base . '/' . rawurlencode($cfg['mailgun_domain']) . '/messages');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_USERPWD, 'api:' . $cfg['mailgun_key']);
    curl_setopt($ch, CURLOPT_TIMEOUT, 20);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query(array(
        'from'    => $cfg['mail_from'],
        'to'      => $cfg['orders_inbox'],
        'subject' => 'StreamPlay4K test — your order emails are working',
        'text'    => "This is the test from api/check.php on your server.

"
                   . "If you are reading it, Mailgun is configured correctly and real order
"
                   . "confirmations will reach your customers.

"
                   . "Remember to delete api/check.php now that setup is done.
",
    )));
    $tBody = curl_exec($ch);
    $tCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    $sent = array('ok' => ($tCode >= 200 && $tCode < 300), 'code' => $tCode, 'body' => (string) $tBody);
}

/* ── The rewrite rule, tested by actually asking for the URL ──────── */
$scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : '';
$orderUrl = $scheme . '://' . $host . '/api/order';

$routeOk = null; $routeGot = 'not tested';
if ($curl && $host !== '') {
    $ch = curl_init($orderUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 8);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $body = curl_exec($ch);
    $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    // A GET to the endpoint must be refused with 405 and a JSON body. HTML
    // back means .htaccess did not upload and the SPA answered instead — the
    // single most common way this deploy goes wrong.
    $isHtml = $body !== false && stripos(substr(ltrim($body), 0, 20), '<!doctype') !== false;
    $routeOk = ($code === 405 && !$isHtml);
    $routeGot = $isHtml ? 'served the website instead of the API' : ('HTTP ' . $code);
}
$checks[] = array(
    'ok'   => $routeOk === null ? true : $routeOk,
    'soft' => $routeOk === null,
    'name' => '/api/order is routed',
    'got'  => $routeGot,
    'fix'  => 'Expected HTTP 405. If you got the website back, the .htaccess file did not upload &mdash; '
            . 'File Manager hides dotfiles by default (Settings &rarr; Show hidden files). Without it, every '
            . 'order is answered with the homepage and nothing is ever saved.',
);

$fails = 0; $warns = 0;
foreach ($checks as $c) {
    if (!$c['ok']) $fails++;
    elseif (!empty($c['soft'])) $warns++;
}
?>
<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Server check · StreamPlay4K</title>
<style>
  :root { color-scheme: light dark; --bg:#FAFAF7; --card:#fff; --ink:#16181D; --mut:#6B7183;
          --line:#E3E3DC; --ok:#1B6B3A; --bad:#C0201A; --warn:#9A5400; }
  @media (prefers-color-scheme: dark) {
    :root { --bg:#131519; --card:#1A1D23; --ink:#E9EAEE; --mut:#98A0B0;
            --line:#2A2E37; --ok:#58C88A; --bad:#FF6357; --warn:#E0A23C; }
  }
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--ink);
       font:15px/1.6 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
  .w{max-width:760px;margin:0 auto;padding:36px 20px 80px}
  h1{font-size:25px;margin:0 0 6px;letter-spacing:-.02em}
  .sub{color:var(--mut);margin:0 0 26px}
  .verdict{padding:15px 18px;border-radius:11px;margin:0 0 26px;font-weight:600}
  .v-ok{background:rgba(27,107,58,.11);color:var(--ok)}
  .v-bad{background:rgba(192,32,26,.10);color:var(--bad)}
  .row{background:var(--card);border:1px solid var(--line);border-radius:11px;
       padding:14px 16px;margin-bottom:9px;display:grid;grid-template-columns:26px 1fr;gap:12px}
  .row.min-w{min-width:0}
  .mark{font-size:17px;line-height:1.35}
  .name{font-weight:600}
  .got{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12.5px;color:var(--mut);margin-top:2px}
  .fix{margin-top:8px;font-size:13.5px;color:var(--ink);opacity:.85}
  .pass .mark{color:var(--ok)} .fail .mark{color:var(--bad)} .warn .mark{color:var(--warn)}
  .pass .fix{display:none}
  footer{margin-top:30px;padding-top:18px;border-top:1px solid var(--line);
         font-size:13px;color:var(--mut)}
  code{font-family:ui-monospace,Menlo,monospace;font-size:.92em}
  .btn{font:600 14px/1 inherit;background:#FF2B20;color:#fff;border:0;border-radius:8px;
       padding:12px 18px;cursor:pointer}
  .btn:hover{filter:brightness(1.08)}
  .btn-note{font-size:13px;color:var(--mut);margin-left:12px}
</style>
</head><body><div class="w">

<h1>Server check</h1>
<p class="sub">Everything the order system needs, tested on this server right now.</p>

<?php if ($fails === 0): ?>
  <div class="verdict v-ok">✓ Ready. Orders placed on the site will be saved and emailed.<?php
    if ($warns) echo ' ' . $warns . ' optional feature' . ($warns === 1 ? '' : 's') . ' switched off — see below.'; ?></div>
<?php else: ?>
  <div class="verdict v-bad">✗ <?php echo $fails; ?> problem<?php echo $fails === 1 ? '' : 's'; ?> to fix.
    Orders will not work correctly until <?php echo $fails === 1 ? 'it is' : 'they are'; ?> sorted.</div>
<?php endif; ?>

<?php if ($sent !== null): ?>
  <div class="verdict <?php echo $sent['ok'] ? 'v-ok' : 'v-bad'; ?>">
    <?php if ($sent['ok']): ?>
      ✓ Test email sent to <?php echo htmlspecialchars($cfg['orders_inbox'], ENT_QUOTES, 'UTF-8'); ?>.
      Check the inbox — and the spam folder, since it is the first mail from this domain.
    <?php else: ?>
      ✗ Mailgun refused it (HTTP <?php echo (int) $sent['code']; ?>).
      <?php echo htmlspecialchars(substr($sent['body'], 0, 200), ENT_QUOTES, 'UTF-8'); ?>
    <?php endif; ?>
  </div>
<?php endif; ?>

<?php if ($hasConfig && $phpOk && !empty($cfg['mailgun_key']) && !empty($cfg['orders_inbox'])): ?>
  <form method="post" style="margin:0 0 26px">
    <button type="submit" name="sendtest" value="1" class="btn">Send a test email to my inbox</button>
    <span class="btn-note">Goes to <?php echo htmlspecialchars($cfg['orders_inbox'], ENT_QUOTES, 'UTF-8'); ?> only.</span>
  </form>
<?php endif; ?>

<?php foreach ($checks as $c):
  $cls = !$c['ok'] ? 'fail' : (!empty($c['soft']) ? 'warn' : 'pass');
  $mk  = !$c['ok'] ? '✗' : (!empty($c['soft']) ? '!' : '✓');
?>
  <div class="row min-w <?php echo $cls; ?>">
    <div class="mark"><?php echo $mk; ?></div>
    <div>
      <div class="name"><?php echo htmlspecialchars($c['name'], ENT_QUOTES, 'UTF-8'); ?></div>
      <div class="got"><?php echo htmlspecialchars($c['got'], ENT_QUOTES, 'UTF-8'); ?></div>
      <?php if ($cls !== 'pass'): ?><div class="fix"><?php echo $c['fix']; ?></div><?php endif; ?>
    </div>
  </div>
<?php endforeach; ?>

<footer>
  No passwords or keys are shown on this page — only whether they are filled in.
  <strong>Delete <code>api/check.php</code> once your site is live.</strong>
</footer>

</div></body></html>
