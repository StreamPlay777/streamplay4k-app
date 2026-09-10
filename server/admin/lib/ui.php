<?php
/**
 * The admin's design system and shell.
 *
 * DIRECTION: a working tool, not a landing page. The reference points are the
 * dense, quiet admin consoles people spend hours in — neutral ground, white
 * panels, hairline borders, restrained type, and colour reserved for meaning
 * rather than decoration. Every pixel of chrome is pixel taken from the data.
 *
 * WHY THE CSS IS INLINE. This admin is one person on one browser. A separate
 * stylesheet would add a request, a caching question and a path that has to be
 * routed and protected, to save perhaps 9KB on a page nobody loads a hundred
 * times a day. Inline removes all of that and the page can never render
 * unstyled because a file was missed in a deploy.
 *
 * TOKENS, NOT LITERALS. Every colour and space below is a custom property.
 * Changing the ramp changes the whole admin, and a component cannot quietly
 * invent its own grey.
 */

declare(strict_types=1);

if (!defined('SP_ADMIN')) { http_response_code(403); exit; }

function e(?string $s): string
{
    return htmlspecialchars((string) $s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/** "3 minutes ago" for anything recent, a date once that stops being useful. */
function sp_ago(?string $iso): string
{
    if (!$iso) return '—';
    $t = strtotime($iso);
    if (!$t) return '—';
    $d = time() - $t;
    if ($d < 60)     return 'just now';
    if ($d < 3600)   return max(1, intdiv($d, 60)) . ' min ago';
    if ($d < 86400)  return intdiv($d, 3600) . ' hr ago';
    if ($d < 604800) return intdiv($d, 86400) . ' d ago';
    return gmdate('j M Y', $t);
}

/**
 * How long something has been going on — always a duration, never a date.
 *
 * sp_ago() switches to a date once "43 d ago" stops being easy to read, which
 * is right for a "Date" column and wrong for a "Waiting" one: "waiting: 30 Aug"
 * makes you do the arithmetic yourself, and the whole point of the column is
 * that the number should hit you.
 */
function sp_waited(?string $iso): string
{
    if (!$iso) return '—';
    $t = strtotime($iso);
    if (!$t) return '—';
    $d = max(0, time() - $t);
    if ($d < 3600)   return max(1, intdiv($d, 60)) . ' min';
    if ($d < 86400)  return intdiv($d, 3600) . ' hr';
    if ($d < 86400 * 14) return intdiv($d, 86400) . ' days';
    if ($d < 86400 * 60) return intdiv($d, 86400 * 7) . ' weeks';
    return intdiv($d, 86400 * 30) . ' months';
}

function sp_datetime(?string $iso): string
{
    if (!$iso) return '—';
    $t = strtotime($iso);
    return $t ? gmdate('j M Y, H:i', $t) . ' UTC' : '—';
}

/** A status pill. Tone comes from status.php, never from the call site. */
function sp_badge(string $status): string
{
    return '<span class="badge badge--' . e(sp_status_tone($status)) . '">'
         . e(sp_status_label($status)) . '</span>';
}

/**
 * The navigation.
 *
 * Sections that do not exist yet are listed and visibly disabled rather than
 * hidden. Hiding them makes the admin look finished and leaves the owner
 * wondering where a feature went; showing them greyed says plainly what is
 * built and what is not, and nothing here pretends to be clickable.
 */
function sp_nav(): array
{
    return [
        ['label' => null, 'items' => [
            ['id' => 'overview', 'label' => 'Overview', 'icon' => 'home', 'ready' => true],
        ]],
        ['label' => 'Orders', 'items' => [
            ['id' => 'orders',    'label' => 'Orders',    'icon' => 'orders',   'ready' => true],
            ['id' => 'customers', 'label' => 'Customers', 'icon' => 'people',   'ready' => false],
        ]],
        ['label' => 'Content', 'items' => [
            ['id' => 'pages',    'label' => 'Pages',      'icon' => 'page',     'ready' => false],
            ['id' => 'blog',     'label' => 'Blog Posts', 'icon' => 'post',     'ready' => false],
            ['id' => 'channels', 'label' => 'Channels',   'icon' => 'tv',       'ready' => false],
            ['id' => 'reviews',  'label' => 'Reviews',    'icon' => 'star',     'ready' => false],
            ['id' => 'faqs',     'label' => 'FAQs',       'icon' => 'help',     'ready' => false],
        ]],
        ['label' => 'Marketing', 'items' => [
            ['id' => 'landing',   'label' => 'Landing Pages', 'icon' => 'layout', 'ready' => false],
            ['id' => 'seo',       'label' => 'SEO',           'icon' => 'search', 'ready' => false],
            ['id' => 'analytics', 'label' => 'Analytics',     'icon' => 'chart',  'ready' => false],
        ]],
        ['label' => 'Communication', 'items' => [
            ['id' => 'templates',     'label' => 'Email Templates', 'icon' => 'mail',   'ready' => false],
            ['id' => 'announcements', 'label' => 'Announcements',   'icon' => 'megaphone', 'ready' => false],
        ]],
        ['label' => 'System', 'items' => [
            ['id' => 'settings', 'label' => 'Settings', 'icon' => 'gear', 'ready' => true],
        ]],
    ];
}

/** Line icons, drawn rather than loaded — no icon font, no sprite request. */
function sp_icon(string $name): string
{
    $p = [
        'home'      => '<path d="M3 8.5 9 3.5l6 5V15a1 1 0 0 1-1 1h-3v-4H7v4H4a1 1 0 0 1-1-1z"/>',
        'orders'    => '<path d="M4 4h10v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path d="M6.5 7.5h5M6.5 10h5M6.5 12.5h3"/>',
        'people'    => '<circle cx="7" cy="7" r="2.5"/><path d="M2.5 15.5c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4"/><path d="M12 5.2a2.3 2.3 0 0 1 0 4.1M13.5 15.5c0-1.6-.5-2.8-1.4-3.6"/>',
        'page'      => '<path d="M5 2.5h5l4 4v11H5z"/><path d="M10 2.5v4h4"/>',
        'post'      => '<rect x="3" y="4" width="13" height="11" rx="1.5"/><path d="M6 7.5h7M6 10h7M6 12.5h4"/>',
        'tv'        => '<rect x="2.5" y="4.5" width="14" height="9.5" rx="1.5"/><path d="M6.5 17h6"/>',
        'star'      => '<path d="m9.5 3 2 4.2 4.5.6-3.3 3.1.8 4.6-4-2.2-4 2.2.8-4.6L3 7.8l4.5-.6z"/>',
        'help'      => '<circle cx="9.5" cy="9.5" r="7"/><path d="M7.6 7.5a2 2 0 1 1 2.6 2c-.5.3-.7.7-.7 1.3M9.5 13.8v.3"/>',
        'layout'    => '<rect x="2.5" y="3.5" width="14" height="12" rx="1.5"/><path d="M2.5 7.5h14M7.5 7.5v8"/>',
        'search'    => '<circle cx="8.5" cy="8.5" r="5"/><path d="m12.5 12.5 4 4"/>',
        'chart'     => '<path d="M3 16V9M7.5 16V4.5M12 16v-4.5M16.5 16V7"/>',
        'mail'      => '<rect x="2.5" y="4.5" width="14" height="10" rx="1.5"/><path d="m2.5 6 7 4.5L16.5 6"/>',
        'megaphone' => '<path d="M4 8v3l8 4V4L4 8H2.5v3H4z"/><path d="M6.5 12v3.5"/>',
        'menu'      => '<path d="M3 5.5h13M3 9.5h13M3 13.5h13"/>',
        'left'      => '<path d="M11.5 4.5 6.5 9.5l5 5"/>',
        'logout'    => '<path d="M7.5 3.5H4.5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/><path d="M11 6.5l3 3-3 3M14 9.5H7"/>',
        'check'     => '<path d="m4 9.8 3.4 3.4L15 5.6"/>',
        'alert'     => '<path d="M9.5 2.8 17 15.5H2z"/><path d="M9.5 7.5v3.4M9.5 13.2v.3"/>',
        'info'      => '<circle cx="9.5" cy="9.5" r="7"/><path d="M9.5 8.8v4.4M9.5 6v.3"/>',
        'send'      => '<path d="M16.5 3 2.8 8.2l5.4 2.1 2.1 5.4z"/><path d="m8.2 10.3 3.4-3.4"/>',
        'refresh'   => '<path d="M15.5 8.2A6 6 0 1 0 15 12"/><path d="M16.5 4v4.3h-4.3"/>',
        'money'     => '<rect x="2.5" y="5" width="14" height="9" rx="1.5"/><circle cx="9.5" cy="9.5" r="2"/>',
        'clock'     => '<circle cx="9.5" cy="9.5" r="7"/><path d="M9.5 5.6v4.1l2.7 1.6"/>',
        'link'      => '<path d="M8 11.2a3 3 0 0 1 0-4.2l2-2a3 3 0 0 1 4.2 4.2l-1 1"/><path d="M11 7.8a3 3 0 0 1 0 4.2l-2 2A3 3 0 0 1 4.8 9.8l1-1"/>',
        'external'  => '<path d="M11 3.5h4.5V8"/><path d="m15.5 3.5-6 6"/><path d="M13.5 11v3.5a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1H8"/>',
        'ban'       => '<circle cx="9.5" cy="9.5" r="7"/><path d="m4.6 4.6 9.8 9.8"/>',
        'inbox'     => '<path d="M2.5 10.5h4l1 2h4l1-2h4"/><path d="M4.4 4.5h10.2l1.9 6v5a1 1 0 0 1-1 1h-12a1 1 0 0 1-1-1v-5z"/>',
        'user'      => '<circle cx="9.5" cy="6.8" r="3"/><path d="M3.5 16c0-3.1 2.7-5 6-5s6 1.9 6 5"/>',
        'gear'      => '<circle cx="9.5" cy="9.5" r="2.6"/><path d="M9.5 2.5v2M9.5 14.5v2M2.5 9.5h2M14.5 9.5h2M4.6 4.6l1.4 1.4M13 13l1.4 1.4M14.4 4.6 13 6M6 13l-1.4 1.4"/>',
    ];
    $d = $p[$name] ?? $p['page'];
    return '<svg viewBox="0 0 19 19" fill="none" stroke="currentColor" stroke-width="1.4" '
         . 'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' . $d . '</svg>';
}

/**
 * The stylesheet.
 *
 * Light ground, white panels, hairline borders. Shadow is used once — on the
 * mobile drawer, where something genuinely floats above something else — and
 * nowhere for decoration. Colour appears only in status pills, the primary
 * button and destructive confirmations, so that when you see colour on this
 * page it always means something.
 *
 * color-scheme is pinned to light. Left to "normal", a browser in dark mode
 * inverts form controls and scrollbars against panels that stay white, which
 * looks like a rendering fault rather than a theme.
 */
function sp_css(): string
{
    return <<<'CSS'
:root{
  color-scheme:light;
  --bg:#f4f5f7; --panel:#fff; --panel2:#fafbfb; --sidebar:#f0f1f3;
  --line:#e3e5e9; --line2:#d3d6dd; --ring:#1f2430;
  --ink:#1a1c21; --ink2:#42464f; --ink3:#666c78; --ink4:#8b919d;
  --accent:#1f2430; --accent-ink:#fff;
  --brand:#e0241a;
  --ok:#0b7f4e; --ok-bg:#e6f4ec; --ok-line:#bfe3d0;
  --info:#1f5fa8; --info-bg:#e8f0fa; --info-line:#c5daf1;
  --act:#5b3fbf; --act-bg:#eeeafa; --act-line:#d8cff3;
  --warnc:#8a5a06; --warn-bg:#fdf3e2; --warn-line:#f2ddb4;
  --err:#a3231c; --err-bg:#fdecea; --err-line:#f6cdc9;
  --r:10px; --r2:8px;
  --sidebar-w:236px;
  --mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
}
*{box-sizing:border-box}
html,body{height:100%}
body{margin:0;background:var(--bg);color:var(--ink);
  font:14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  -webkit-font-smoothing:antialiased}
a{color:inherit}
h1,h2,h3{margin:0;font-weight:650;letter-spacing:-.011em}
input,select,textarea,button{font:inherit;color:inherit}
:focus-visible{outline:2px solid var(--ring);outline-offset:2px;border-radius:4px}

/* ── Layout ───────────────────────────────────────────────────────── */
.app{display:flex;min-height:100%}
.side{width:var(--sidebar-w);flex:0 0 var(--sidebar-w);background:var(--sidebar);
  border-right:1px solid var(--line);display:flex;flex-direction:column;
  position:sticky;top:0;height:100vh}
.side__brand{display:flex;align-items:center;gap:9px;padding:16px 18px 14px;
  font-weight:700;font-size:14.5px;letter-spacing:-.2px}
.side__mark{width:26px;height:26px;flex:0 0 26px;border-radius:7px;background:var(--accent);
  color:#fff;display:grid;place-items:center;font-size:11.5px;font-weight:800;letter-spacing:.3px}
.side__scroll{flex:1;overflow-y:auto;padding:2px 10px 14px}
.side__group{margin-top:14px}
.side__label{padding:0 8px 6px;font-size:10.5px;font-weight:700;letter-spacing:.09em;
  text-transform:uppercase;color:var(--ink4)}
.nav{display:flex;align-items:center;gap:9px;padding:7px 8px;border-radius:var(--r2);
  color:var(--ink2);text-decoration:none;font-weight:500;font-size:13.5px;margin-bottom:1px}
.nav svg{width:17px;height:17px;flex:0 0 17px;color:var(--ink3)}
.nav:hover{background:rgba(0,0,0,.045);color:var(--ink)}
.nav[aria-current="page"]{background:var(--panel);color:var(--ink);font-weight:600;
  box-shadow:0 0 0 1px var(--line)}
.nav[aria-current="page"] svg{color:var(--ink)}
.nav--off{color:var(--ink4);cursor:default}
.nav--off svg{color:#b6bbc4}
.nav--off:hover{background:none;color:var(--ink4)}
.nav__soon{margin-left:auto;font-size:9.5px;font-weight:700;letter-spacing:.06em;
  text-transform:uppercase;color:var(--ink4);background:rgba(0,0,0,.05);
  padding:2px 6px;border-radius:5px}
.side__foot{border-top:1px solid var(--line);padding:10px}

/* ── Main ─────────────────────────────────────────────────────────── */
.main{flex:1;min-width:0;display:flex;flex-direction:column}
.top{background:var(--panel);border-bottom:1px solid var(--line);
  padding:14px 26px;display:flex;align-items:center;gap:14px;flex-wrap:wrap;
  position:sticky;top:0;z-index:20}
.top__t{min-width:0;flex:1}
.top h1{font-size:19px}
.top__sub{margin:3px 0 0;color:var(--ink3);font-size:12.5px}
.top__act{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.who{display:flex;align-items:center;gap:8px;padding-left:14px;border-left:1px solid var(--line);
  color:var(--ink3);font-size:12.5px}
.who__av{width:26px;height:26px;border-radius:50%;background:var(--accent);color:#fff;
  display:grid;place-items:center;font-size:11px;font-weight:700}
.body{padding:22px 26px 64px;max-width:1240px;width:100%}
.back{display:inline-flex;align-items:center;gap:5px;color:var(--ink3);text-decoration:none;
  font-size:12.5px;margin-bottom:10px}
.back:hover{color:var(--ink)}
.back svg{width:14px;height:14px}

/* ── Panels ───────────────────────────────────────────────────────── */
.card{background:var(--panel);border:1px solid var(--line);border-radius:var(--r);margin-bottom:16px}
.card__h{display:flex;align-items:center;gap:10px;flex-wrap:wrap;
  padding:13px 16px;border-bottom:1px solid var(--line)}
.card__h h2{font-size:14px;font-weight:650}
.card__h .sp{margin-left:auto;display:flex;gap:8px}
.card__b{padding:16px}
.card__b>:first-child{margin-top:0}.card__b>:last-child{margin-bottom:0}
.card__f{padding:12px 16px;border-top:1px solid var(--line);background:var(--panel2);
  border-radius:0 0 var(--r) var(--r);display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.grid{display:grid;gap:16px;align-items:start}
@media(min-width:900px){.grid--2{grid-template-columns:1fr 340px}}

/* ── KPIs ─────────────────────────────────────────────────────────── */
.kpis{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(168px,1fr));margin-bottom:18px}
.kpi{background:var(--panel);border:1px solid var(--line);border-radius:var(--r);padding:13px 15px}
.kpi span{display:block;font-size:11px;font-weight:650;letter-spacing:.045em;
  text-transform:uppercase;color:var(--ink4)}
.kpi b{display:block;margin-top:5px;font-size:23px;font-weight:680;letter-spacing:-.6px;
  font-variant-numeric:tabular-nums}
.kpi small{display:block;margin-top:3px;color:var(--ink4);font-size:11.5px}

/* ── Table ────────────────────────────────────────────────────────── */
.scroller{overflow-x:auto;-webkit-overflow-scrolling:touch}
table{width:100%;border-collapse:collapse}
th{text-align:left;font-size:11px;font-weight:650;letter-spacing:.05em;text-transform:uppercase;
  color:var(--ink4);padding:10px 14px;background:var(--panel2);border-bottom:1px solid var(--line);
  white-space:nowrap}
td{padding:11px 14px;border-bottom:1px solid var(--line);vertical-align:middle}
tbody tr:last-child td{border-bottom:0}
tbody tr:hover td{background:var(--panel2)}
.rowlink{color:inherit;text-decoration:none;font-weight:600;font-family:var(--mono);font-size:12.5px}
.rowlink:hover{text-decoration:underline}
.num{font-variant-numeric:tabular-nums;white-space:nowrap}
.t-sub{display:block;color:var(--ink4);font-size:12px;margin-top:1px}
.t-mut{color:var(--ink3)}

/* ── Badges ───────────────────────────────────────────────────────── */
.badge{display:inline-flex;align-items:center;gap:5px;padding:2px 8px;border-radius:999px;
  font-size:11.5px;font-weight:600;white-space:nowrap;border:1px solid}
.badge::before{content:"";width:5px;height:5px;border-radius:50%;background:currentColor}
.badge--neutral{background:#eef0f3;border-color:#dfe2e7;color:#495060}
.badge--info{background:var(--info-bg);border-color:var(--info-line);color:var(--info)}
.badge--success{background:var(--ok-bg);border-color:var(--ok-line);color:var(--ok)}
.badge--active{background:var(--act-bg);border-color:var(--act-line);color:var(--act)}
.badge--muted{background:#f1f2f4;border-color:#e4e6ea;color:var(--ink4)}
.badge--warning{background:var(--warn-bg);border-color:var(--warn-line);color:var(--warnc)}

/* ── Controls ─────────────────────────────────────────────────────── */
.btn{display:inline-flex;align-items:center;gap:6px;padding:7px 13px;border-radius:var(--r2);
  border:1px solid var(--line2);background:var(--panel);color:var(--ink);font-size:13px;
  font-weight:550;cursor:pointer;text-decoration:none;white-space:nowrap}
.btn:hover{background:var(--panel2);border-color:#bfc4cd}
.btn svg{width:15px;height:15px}
.btn--primary{background:var(--accent);border-color:var(--accent);color:var(--accent-ink);font-weight:600}
.btn--primary:hover{background:#2c3342;border-color:#2c3342}
.btn--danger{color:var(--err);border-color:var(--err-line)}
.btn--danger:hover{background:var(--err-bg);border-color:#e8b4af}
.btn--sm{padding:5px 10px;font-size:12.5px}
.btn--ghost{background:none;border-color:transparent;color:var(--ink3)}
.btn--ghost:hover{background:rgba(0,0,0,.05);border-color:transparent;color:var(--ink)}
.btn[disabled],.btn[aria-disabled="true"]{opacity:.45;pointer-events:none}
.inp,select.inp{width:100%;padding:8px 11px;border:1px solid var(--line2);border-radius:var(--r2);
  background:var(--panel);font-size:13.5px}
.inp:focus{outline:2px solid var(--ring);outline-offset:-1px;border-color:var(--ring)}
.inp--mono{font-family:var(--mono);font-size:12.5px}
.field{margin-bottom:15px}
.field label{display:block;font-size:12.5px;font-weight:600;margin-bottom:5px}
.hint{margin:6px 0 0;color:var(--ink3);font-size:12.5px}
.tools{display:flex;gap:8px;flex-wrap:wrap;padding:12px 16px;border-bottom:1px solid var(--line)}
.tools .inp{width:auto;flex:1;min-width:180px}
.tools select.inp{flex:0 0 auto;min-width:150px}

/* ── Notices ──────────────────────────────────────────────────────── */
.note{display:flex;gap:9px;padding:11px 14px;border:1px solid;border-radius:var(--r);
  margin-bottom:16px;font-size:13px;align-items:flex-start}
.note svg{width:16px;height:16px;flex:0 0 16px;margin-top:1px}
.note p{margin:0}
.note--ok{background:var(--ok-bg);border-color:var(--ok-line);color:#0a5c39}
.note--err{background:var(--err-bg);border-color:var(--err-line);color:var(--err)}
.note--warn{background:var(--warn-bg);border-color:var(--warn-line);color:var(--warnc)}
.note--info{background:var(--info-bg);border-color:var(--info-line);color:var(--info)}

/* ── Detail lists & timeline ──────────────────────────────────────── */
.dl{margin:0;display:grid;grid-template-columns:auto 1fr;gap:9px 18px;font-size:13.5px}
.dl dt{color:var(--ink3);white-space:nowrap}
.dl dd{margin:0;text-align:right;word-break:break-word}
.tl{margin:0;padding:0;list-style:none;font-size:13px}
.tl li{position:relative;padding:0 0 15px 21px;border-left:1px solid var(--line);margin-left:4px}
.tl li:last-child{border-left-color:transparent;padding-bottom:0}
.tl li::before{content:"";position:absolute;left:-4.5px;top:4px;width:8px;height:8px;
  border-radius:50%;background:var(--line2);box-shadow:0 0 0 3px var(--panel)}
.tl li.on::before{background:var(--ok)}
.tl b{font-weight:600;display:block}
.tl span{color:var(--ink4);font-size:12px}

/* ── Empty states ─────────────────────────────────────────────────── */
.empty{padding:44px 22px;text-align:center;color:var(--ink3)}
.empty svg{width:26px;height:26px;color:#c3c8d1;margin-bottom:10px}
.empty b{display:block;color:var(--ink);font-size:14.5px;font-weight:620;margin-bottom:4px}
.empty p{margin:0 auto;max-width:380px;font-size:13px}

/* ── Cards on the settings index ──────────────────────────────────── */
.tiles{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(250px,1fr))}
.tile{display:flex;gap:12px;background:var(--panel);border:1px solid var(--line);
  border-radius:var(--r);padding:15px;text-decoration:none;color:inherit}
.tile:hover{border-color:var(--line2);background:var(--panel2)}
.tile__i{width:32px;height:32px;flex:0 0 32px;border-radius:8px;background:#eef0f3;
  color:var(--ink2);display:grid;place-items:center}
.tile__i svg{width:17px;height:17px}
.tile b{display:block;font-size:13.5px;font-weight:620}
.tile p{margin:3px 0 0;color:var(--ink3);font-size:12.5px;line-height:1.45}
.tile--off{opacity:.55;pointer-events:none}

/* ── Login ────────────────────────────────────────────────────────── */
.auth{min-height:100vh;display:grid;place-items:center;padding:24px}
.auth__box{width:100%;max-width:360px}
.auth__brand{display:flex;align-items:center;gap:9px;justify-content:center;margin-bottom:18px;
  font-weight:700;letter-spacing:-.2px}
.auth .card__b{padding:22px}

/* ── Mobile drawer, CSS only ──────────────────────────────────────── */
#drawer{position:absolute;opacity:0;pointer-events:none}
.burger{display:none}
.scrim{display:none}
@media(max-width:860px){
  .burger{display:inline-flex}
  .side{position:fixed;z-index:60;transform:translateX(-100%);transition:transform .18s ease;
    box-shadow:0 10px 40px rgba(16,20,28,.18)}
  #drawer:checked~.app .side{transform:none}
  #drawer:checked~.app .scrim{display:block;position:fixed;inset:0;z-index:50;
    background:rgba(16,20,28,.34)}
  .body{padding:18px 16px 56px}
  .top{padding:12px 16px}
  .who__name{display:none}
  .dl{grid-template-columns:1fr;gap:2px 0}
  .dl dd{text-align:left;margin-bottom:8px;font-weight:550}
}
@media(max-width:520px){
  .top h1{font-size:17px}
  .kpi b{font-size:20px}
}
@media print{.side,.top__act,.burger{display:none}}
CSS;
}

/** Where a nav id lives. Everything is one file, so a link is one query. */
function sp_url(string $page, array $params = []): string
{
    $q = array_filter(array_merge(['p' => $page], $params), static fn($v) => $v !== '' && $v !== null);
    return './?' . http_build_query($q);
}

/** The one-line result of the last action, replayed after the redirect. */
function sp_note(string $text, string $tone = 'ok'): string
{
    $icon = ['ok' => 'check', 'err' => 'alert', 'warn' => 'alert', 'info' => 'info'][$tone] ?? 'info';
    return '<div class="note note--' . e($tone) . '" role="status">' . sp_icon($icon)
         . '<p>' . e($text) . '</p></div>';
}

/**
 * Opens the page: document head, sidebar, header. Everything after the call
 * lands inside the content column until sp_shell_close().
 *
 * $ctx: page (nav id), title, sub, actions (html), back (['href','label'])
 */
function sp_shell_open(array $ctx, array $cfg, string $adminUser): void
{
    $page  = (string) ($ctx['page'] ?? '');
    $title = (string) ($ctx['title'] ?? 'Admin');
    $brand = (string) ($cfg['brand_name'] ?? 'StreamPlay4K');
    $mark  = mb_strtoupper(mb_substr($brand, 0, 2));
    $who   = mb_strtoupper(mb_substr($adminUser !== '' ? $adminUser : 'A', 0, 1));
    ?>
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title><?= e($title) ?> · <?= e($brand) ?> admin</title>
<style><?= sp_css() ?></style>
</head>
<body>
<input type="checkbox" id="drawer" aria-label="Show navigation">
<div class="app">
  <label class="scrim" for="drawer" aria-hidden="true"></label>

  <nav class="side" aria-label="Admin sections">
    <div class="side__brand"><span class="side__mark"><?= e($mark) ?></span><?= e($brand) ?></div>
    <div class="side__scroll">
      <?php foreach (sp_nav() as $group): ?>
        <div class="side__group">
          <?php if ($group['label']): ?><div class="side__label"><?= e($group['label']) ?></div><?php endif; ?>
          <?php foreach ($group['items'] as $it):
              $on = $it['id'] === $page;
              if (!empty($it['ready'])): ?>
            <a class="nav" href="<?= e(sp_url($it['id'])) ?>"<?= $on ? ' aria-current="page"' : '' ?>>
              <?= sp_icon($it['icon']) ?><?= e($it['label']) ?>
            </a>
          <?php else: ?>
            <span class="nav nav--off" aria-disabled="true" title="Not built yet">
              <?= sp_icon($it['icon']) ?><?= e($it['label']) ?><span class="nav__soon">Soon</span>
            </span>
          <?php endif; endforeach; ?>
        </div>
      <?php endforeach; ?>
    </div>
    <div class="side__foot">
      <a class="nav" href="./?logout=1"><?= sp_icon('logout') ?>Sign out</a>
    </div>
  </nav>

  <div class="main">
    <header class="top">
      <label class="btn btn--sm burger" for="drawer" title="Menu"><?= sp_icon('menu') ?></label>
      <div class="top__t">
        <h1><?= e($title) ?></h1>
        <?php if (!empty($ctx['sub'])): ?><p class="top__sub"><?= e($ctx['sub']) ?></p><?php endif; ?>
      </div>
      <div class="top__act">
        <?= $ctx['actions'] ?? '' ?>
        <span class="who">
          <span class="who__av"><?= e($who) ?></span>
          <span class="who__name"><?= e($adminUser !== '' ? $adminUser : 'Admin') ?></span>
        </span>
      </div>
    </header>
    <main class="body">
      <?php if (!empty($ctx['back'])): ?>
        <a class="back" href="<?= e($ctx['back']['href']) ?>"><?= sp_icon('left') ?><?= e($ctx['back']['label']) ?></a>
      <?php endif; ?>
<?php
}

function sp_shell_close(): void
{
    ?>
    </main>
  </div>
</div>
<?= sp_confirm_script() ?>
</body>
</html>
<?php
}

/**
 * The only script in the admin: a confirmation prompt on destructive forms.
 *
 * Written once here and attached by data attribute rather than repeated as an
 * onsubmit on every button, because an inline handler is exactly the thing the
 * page's Content-Security-Policy refuses. The nonce lets this block — and only
 * this block — run.
 *
 * The page works without it. A browser that blocks the script still submits
 * the form; you simply lose the "are you sure", which is a prompt, not a
 * permission check. The permission check is the CSRF token on the server.
 */
function sp_confirm_script(): string
{
    $nonce = defined('SP_NONCE') ? SP_NONCE : '';
    return '<script nonce="' . e($nonce) . '">'
         . 'document.addEventListener("submit",function(e){'
         . 'var m=e.target.getAttribute("data-confirm");'
         . 'if(m&&!window.confirm(m)){e.preventDefault();}'
         . '},true);</script>';
}
