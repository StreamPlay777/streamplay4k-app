<?php
/**
 * The sign-in screen, and the screen you get instead when the admin has no
 * credentials configured yet.
 *
 * It carries no navigation and names nothing about the business. A login page
 * that lists your sections tells someone who should not be here what is worth
 * coming back for.
 */

if (!defined('SP_ADMIN')) { http_response_code(403); exit; }

$brand = (string) ($cfg['brand_name'] ?? 'StreamPlay4K');
$mark  = mb_strtoupper(mb_substr($brand, 0, 2));
?>
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Sign in · <?= e($brand) ?></title>
<style><?= sp_css() ?></style>
</head>
<body>
<div class="auth">
  <div class="auth__box">
    <div class="auth__brand"><span class="side__mark"><?= e($mark) ?></span><?= e($brand) ?></div>

    <?php if (!$auth['configured']): ?>
      <div class="card"><div class="card__b">
        <h2 style="font-size:15px;margin-bottom:8px;">Not set up yet</h2>
        <p class="hint">
          Add <code>admin_user</code> and <code>admin_password_hash</code> to
          <code>api/config.php</code> on the server. DEPLOY.md has the one-line
          command that generates the hash.
        </p>
      </div></div>
    <?php else: ?>
      <div class="card"><div class="card__b">
        <form method="post">
          <input type="hidden" name="action" value="login">
          <div class="field">
            <label for="u">Username</label>
            <input class="inp" id="u" name="user" type="text" autocomplete="username" autofocus required>
          </div>
          <div class="field">
            <label for="p">Password</label>
            <input class="inp" id="p" name="pass" type="password" autocomplete="current-password" required>
          </div>
          <button class="btn btn--primary" type="submit" style="width:100%;justify-content:center;">Sign in</button>
          <?php if ($auth['error']): ?>
            <p class="hint" style="color:var(--err);margin-top:12px;"><?= e($auth['error']) ?></p>
          <?php endif; ?>
        </form>
      </div></div>
    <?php endif; ?>
  </div>
</div>
</body>
</html>
