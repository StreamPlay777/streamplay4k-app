<?php
/**
 * Who is allowed in, and proof that a request came from them.
 *
 * This is the previous admin's security model moved into its own file, not a
 * new one. It was reviewed and it works; splitting the page into a router and
 * several screens is a layout change, and a layout change is no reason to
 * rewrite the part that keeps strangers out.
 *
 * WHAT IT DOES, in the order it matters:
 *
 *   The password lives as a hash in config.php. Reading the file does not give
 *   you a password to reuse anywhere else.
 *
 *   Five wrong attempts from one IP buys a fifteen-minute lockout. A login
 *   form with unlimited guesses is a password field in name only.
 *
 *   hash_equals for username and CSRF comparisons, so neither leaks through
 *   its timing how much of a guess was right.
 *
 *   The session cookie is scoped to /admin/, HttpOnly, SameSite=Strict, and
 *   Secure whenever the request arrived over HTTPS.
 *
 *   Every state-changing request carries a CSRF token. Without it, any page
 *   you visited while signed in could mark orders paid or send invoices on
 *   your behalf.
 *
 *   Nothing is indexable, and the orders themselves are read from outside the
 *   web root, so they were never fetchable to begin with.
 */

declare(strict_types=1);

if (!defined('SP_ADMIN')) { http_response_code(403); exit; }

function sp_admin_locked(array $cfg, string $ip): bool
{
    $f = rtrim($cfg['orders_dir'], '/') . '/admin-attempts.json';
    $m = is_file($f) ? (json_decode((string) @file_get_contents($f), true) ?: []) : [];
    $e = $m[hash('sha256', $ip)] ?? null;
    return is_array($e) && ($e['n'] ?? 0) >= 5 && (time() - ($e['t'] ?? 0)) < 900;
}

function sp_admin_attempt(array $cfg, string $ip, bool $ok): void
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

/**
 * Starts the session, applies the response headers, and handles login and
 * logout. Returns the request's auth state for the router to act on.
 *
 * @return array{configured: bool, authed: bool, user: string, csrf: string, error: string}
 */
function sp_admin_boot(array $cfg): array
{
    header('X-Robots-Tag: noindex, nofollow');
    header('X-Frame-Options: DENY');
    header('X-Content-Type-Options: nosniff');
    header('Referrer-Policy: no-referrer');
    // The admin loads no third-party anything: no CDN, no font host, no
    // analytics. Saying so out loud means an injected <script src> from
    // somewhere else cannot run even if one ever got in.
    //
    // The one script on the page — the confirmation prompts — is allowed by a
    // per-request nonce rather than by 'unsafe-inline'. 'unsafe-inline' would
    // permit ANY inline script, including one that arrived through an escaping
    // mistake, which is precisely what the policy is here to stop. A nonce
    // permits only the block we wrote, on this one response.
    define('SP_NONCE', base64_encode(random_bytes(16)));
    header("Content-Security-Policy: default-src 'none'; img-src 'self' data:; "
         . "style-src 'unsafe-inline'; script-src 'nonce-" . SP_NONCE . "'; "
         . "form-action 'self'; base-uri 'none'; frame-ancestors 'none'");

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
    $error = '';
    $ip = (string) ($_SERVER['REMOTE_ADDR'] ?? '');

    if ($configured && ($_POST['action'] ?? '') === 'login') {
        if (sp_admin_locked($cfg, $ip)) {
            $error = 'Too many attempts. Try again in 15 minutes.';
        } elseif (
            hash_equals($user, (string) ($_POST['user'] ?? ''))
            && password_verify((string) ($_POST['pass'] ?? ''), $hash)
        ) {
            // A new id on login, so a session id captured beforehand — from a
            // shared machine or a link — cannot be ridden into the account.
            session_regenerate_id(true);
            $_SESSION['ok']   = true;
            $_SESSION['user'] = $user;
            $_SESSION['csrf'] = bin2hex(random_bytes(32));
            sp_admin_attempt($cfg, $ip, true);
            header('Location: ./');
            exit;
        } else {
            sp_admin_attempt($cfg, $ip, false);
            $error = 'Wrong username or password.';
        }
    }

    if (($_GET['logout'] ?? '') === '1') {
        $_SESSION = [];
        session_destroy();
        header('Location: ./');
        exit;
    }

    return [
        'configured' => $configured,
        'authed'     => !empty($_SESSION['ok']),
        'user'       => (string) ($_SESSION['user'] ?? $user),
        'csrf'       => (string) ($_SESSION['csrf'] ?? ''),
        'error'      => $error,
    ];
}

/** True only if this POST carries the session's own token. */
function sp_admin_csrf_ok(): bool
{
    $have = (string) ($_SESSION['csrf'] ?? '');
    $sent = (string) ($_POST['csrf'] ?? '');
    return $have !== '' && hash_equals($have, $sent);
}

/** A hidden field for every form that changes something. */
function sp_csrf_field(string $csrf): string
{
    return '<input type="hidden" name="csrf" value="' . e($csrf) . '">';
}
