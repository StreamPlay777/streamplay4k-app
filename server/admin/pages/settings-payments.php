<?php
/**
 * Settings → Payments — the one link the whole shop runs on.
 *
 * WHY THIS PAGE EXISTS AT ALL. The payment link is rotated every few days. If
 * it lived only in config.php, changing it would mean an SFTP client, a text
 * editor and a live production file — at which point it does not get changed,
 * and customers are handed a dead link. Here it is a text box and a button,
 * saved to a JSON file beside the orders, and it takes effect on the very next
 * invoice with no deploy, no rebuild and no restart.
 *
 * WHAT THE PAGE HAS TO BE HONEST ABOUT: it never shows a preview of an invoice
 * that would not be sent, it says plainly what happens when the box is empty,
 * and it distinguishes a link inherited from config.php from one saved here —
 * because "where is this value actually coming from?" is the question you ask
 * at the exact moment something is wrong.
 */

if (!defined('SP_ADMIN')) { http_response_code(403); exit; }

$link    = sp_payment_link($cfg);
$updated = sp_payment_link_updated($cfg);
$saved   = sp_settings_all($cfg);
$here    = './?' . http_build_query(['p' => 'settings-payments']);

/* A link is "inherited" when one is in force but nothing was ever saved here,
   which means it is coming from config.php. */
$inherited = $link !== '' && empty($saved['payment_link']);

sp_shell_open([
    'page'  => 'settings',
    'title' => 'Payments',
    'sub'   => 'The link customers use to pay their invoice',
    'back'  => ['href' => sp_url('settings'), 'label' => 'Settings'],
], $cfg, $actor);

echo $flash;
?>

<div class="grid grid--2">
  <div>
    <div class="card">
      <div class="card__h">
        <h2>Active payment link</h2>
        <span class="sp"><?= $link === ''
            ? '<span class="badge badge--warning">Not set</span>'
            : '<span class="badge badge--success">Active</span>' ?></span>
      </div>
      <form method="post">
        <div class="card__b">
          <?= sp_csrf_field($csrf) ?>
          <input type="hidden" name="action" value="setting">
          <input type="hidden" name="key" value="payment_link">
          <input type="hidden" name="back" value="<?= e($here) ?>">

          <div class="field">
            <label for="pl">Payment link</label>
            <input class="inp inp--mono" id="pl" name="value" type="url" inputmode="url"
                   spellcheck="false" autocapitalize="off" autocorrect="off"
                   value="<?= e((string) ($saved['payment_link'] ?? '')) ?>"
                   placeholder="https://buy.stripe.com/&hellip;">
            <p class="hint">
              Paste the current link from your payment provider. It must start with
              <code>https://</code>. Leave it empty to remove it.
            </p>
          </div>

          <?php if ($inherited): ?>
            <div class="note note--info" style="margin-bottom:0;"><?= sp_icon('info') ?><p>
              The link in use right now comes from <code>api/config.php</code> on the server.
              Saving here replaces it for every future invoice — the file itself is left alone.
            </p></div>
          <?php endif; ?>
        </div>
        <div class="card__f">
          <button class="btn btn--primary" type="submit"><?= sp_icon('check') ?>Save link</button>
          <span class="t-mut" style="font-size:12.5px;">Takes effect immediately. Invoices already sent keep the link they were sent with.</span>
        </div>
      </form>
    </div>

    <div class="card">
      <div class="card__h"><h2>What happens with no link</h2></div>
      <div class="card__b">
        <p class="hint" style="margin:0;">
          Invoices are still sent, and still show the amount and the order number — but there is no
          pay button, and the email tells the customer you are sending payment details on WhatsApp.
          That is deliberate: a button that leads to a dead page makes the shop look broken, and the
          customer is more likely to give up than to ask.
        </p>
      </div>
    </div>
  </div>

  <div>
    <div class="card">
      <div class="card__h"><h2>Currently in use</h2></div>
      <div class="card__b">
        <?php if ($link === ''): ?>
          <p class="hint" style="margin:0;">Nothing set. Invoices go out without a pay button.</p>
        <?php else: ?>
          <p style="margin:0 0 12px;word-break:break-all;font-family:var(--mono);font-size:12.5px;">
            <?= e($link) ?>
          </p>
          <a class="btn btn--sm" href="<?= e($link) ?>" target="_blank" rel="noopener noreferrer">
            <?= sp_icon('external') ?>Open it and check</a>
          <p class="hint">Worth doing after every change — this is the page your customers land on.</p>
        <?php endif; ?>

        <dl class="dl" style="margin-top:16px;border-top:1px solid var(--line);padding-top:14px;">
          <dt>Source</dt>
          <dd><?= $link === '' ? '&mdash;' : ($inherited ? 'api/config.php' : 'Saved here') ?></dd>
          <?php if ($updated): ?>
            <dt>Last changed</dt><dd><?= e(sp_datetime($updated['at'])) ?></dd>
            <dt>By</dt><dd><?= e($updated['by'] !== '' ? $updated['by'] : '—') ?></dd>
          <?php endif; ?>
        </dl>
      </div>
    </div>

    <div class="card">
      <div class="card__h"><h2>Where it is stored</h2></div>
      <div class="card__b">
        <p class="hint" style="margin:0;">
          In <code>settings.json</code>, in the same private folder as your orders — above the
          website, so nobody can fetch it. It is written by replacing the whole file at once, so an
          interrupted save can never leave a half-written link behind.
        </p>
      </div>
    </div>
  </div>
</div>

<?php sp_shell_close();
