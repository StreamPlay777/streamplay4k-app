<?php
/**
 * Settings — a landing page, not a form.
 *
 * The distinction matters. Everything settable from a browser lives behind one
 * of these cards; everything else — the Mailgun key, the Sheets token, this
 * password — is deliberately not settable from a browser and is named here so
 * that looking for it does not end in a hunt through the source. A settings
 * page that silently omits the things it cannot change is how someone ends up
 * believing a value is missing when it is simply held somewhere safer.
 */

if (!defined('SP_ADMIN')) { http_response_code(403); exit; }

$link    = sp_payment_link($cfg);
$updated = sp_payment_link_updated($cfg);
$fromCfg = $link !== '' && $updated === null;

sp_shell_open([
    'page'  => 'settings',
    'title' => 'Settings',
    'sub'   => 'What you can change from here, and what you cannot',
], $cfg, $actor);

echo $flash;
?>

<div class="tiles" style="margin-bottom:20px;">
  <a class="tile" href="<?= e(sp_url('settings-payments')) ?>">
    <span class="tile__i"><?= sp_icon('link') ?></span>
    <span>
      <b>Payments</b>
      <p><?= $link === ''
            ? 'No payment link set — invoices go out without a pay button.'
            : 'Link active' . ($fromCfg ? ' from config.php' : ($updated['at'] ? ', updated ' . e(sp_ago($updated['at'])) : '')) . '.' ?></p>
    </span>
  </a>

  <span class="tile tile--off" aria-disabled="true">
    <span class="tile__i"><?= sp_icon('mail') ?></span>
    <span><b>Email templates</b><p>Not built yet. The invoice and order emails are set in the code.</p></span>
  </span>

  <span class="tile tile--off" aria-disabled="true">
    <span class="tile__i"><?= sp_icon('user') ?></span>
    <span><b>Admin account</b><p>Not built yet. Change the username or password in <code>api/config.php</code>.</p></span>
  </span>
</div>

<div class="card">
  <div class="card__h"><h2>Held on the server, not here</h2></div>
  <div class="card__b">
    <p class="hint" style="margin-bottom:14px;">
      These are secrets or infrastructure. They live in <code>api/config.php</code>, which sits on
      the server and is never part of a deployment — so a bad password on this page can never
      expose them, and a browser session can never overwrite them. Changing one means editing that
      file over SFTP or SSH.
    </p>
    <dl class="dl" style="max-width:520px;">
      <dt>Mailgun API key</dt><dd><?= !empty($cfg['mailgun_key']) ? 'Set' : '<span style="color:var(--err)">Missing</span>' ?></dd>
      <dt>Sending domain</dt><dd><?= e((string) ($cfg['mailgun_domain'] ?? '—')) ?></dd>
      <dt>Orders inbox</dt><dd><?= e((string) ($cfg['orders_inbox'] ?? '—')) ?></dd>
      <dt>Orders folder</dt><dd><?= e(basename(rtrim((string) $cfg['orders_dir'], '/'))) ?></dd>
      <dt>Google Sheet mirror</dt><dd><?= sp_sheets_enabled($cfg) ? 'Connected' : 'Not connected' ?></dd>
      <dt>Stripe</dt><dd><?= !empty($cfg['stripe_secret']) ? 'Connected' : 'Not connected' ?></dd>
      <dt>Admin username</dt><dd><?= e((string) ($cfg['admin_user'] ?? '—')) ?></dd>
    </dl>
  </div>
</div>

<?php sp_shell_close();
