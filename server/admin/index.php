<?php
/**
 * https://streamplay4k.com/admin/ — the whole back office.
 *
 * One entry point. Every screen is ./?p=<name>, every change is a POST back
 * here, and the pages under pages/ render markup and nothing else. The reason
 * for the split is that the previous version was a single 400-line file that
 * mixed authentication, business rules, queries and HTML, and adding one
 * screen to it meant reading all of it.
 *
 * The order of operations below is deliberate:
 *
 *   1. Load the libraries and the config. Without config.php there is no
 *      password to check against and no orders directory to read, so the page
 *      stops there rather than rendering half a dashboard.
 *   2. Boot the session and handle login/logout.
 *   3. Refuse everything else if not signed in.
 *   4. Run the POST action, if there is one, and redirect.
 *   5. Only then choose a page and render it.
 *
 * Steps 3 and 4 are in that order on purpose: an action must never run for a
 * request that has not proved who it is.
 */

declare(strict_types=1);

define('SP_ADMIN', 1);

$base = dirname(__DIR__) . '/api';
require $base . '/lib/pricing.php';
require $base . '/lib/validate.php';
require $base . '/lib/store.php';
require $base . '/lib/sheets.php';
require $base . '/lib/mailer.php';
require $base . '/lib/settings.php';
require $base . '/lib/status.php';
require $base . '/templates/emails.php';
require $base . '/templates/invoice.php';

require __DIR__ . '/lib/ui.php';
require __DIR__ . '/lib/auth.php';
require __DIR__ . '/lib/data.php';
require __DIR__ . '/lib/actions.php';

$configPath = $base . '/config.php';
if (!is_file($configPath)) { http_response_code(500); exit('Not configured.'); }
$cfg = require $configPath;

$auth = sp_admin_boot($cfg);

if (!$auth['configured'] || !$auth['authed']) {
    require __DIR__ . '/pages/login.php';
    exit;
}

$actor = $auth['user'];
$csrf  = $auth['csrf'];

if (($_POST['action'] ?? '') !== '') {
    sp_admin_dispatch($cfg, sp_clean($_POST['action'], 32), $actor);
    // sp_admin_dispatch always redirects.
}

/* The result of the last action, shown once and then forgotten. */
$flash = '';
if (!empty($_SESSION['flash']) && is_array($_SESSION['flash'])) {
    $flash = sp_note((string) $_SESSION['flash']['text'], (string) $_SESSION['flash']['tone']);
    unset($_SESSION['flash']);
}

/* Only pages that exist are routable. A nav item marked "Soon" has no file
   behind it, and typing its name in the address bar lands on Overview rather
   than on a blank screen pretending to be a feature. */
$routes = [
    'overview'         => 'overview.php',
    'orders'           => 'orders.php',
    'order'            => 'order.php',
    'settings'         => 'settings.php',
    'settings-payments'=> 'settings-payments.php',
];
$p = (string) ($_GET['p'] ?? 'overview');
if (!isset($routes[$p])) $p = 'overview';

require __DIR__ . '/pages/' . $routes[$p];
