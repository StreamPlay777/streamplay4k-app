<?php
/**
 * The two emails sent the moment an order arrives.
 *
 * WHY THEY LOOK LIKE THIS
 * Table-based layout with inline styles, a 600px body, and no external CSS —
 * not nostalgia, but the only thing Outlook, Gmail's clipper and Apple Mail
 * all render the same way. A <div> grid with a stylesheet looks right in a
 * browser preview and falls apart in the client that half your customers use.
 *
 * Dark-mode-safe: explicit background AND text colour on every cell. A client
 * that inverts colours will otherwise leave dark text on the dark card it just
 * made, which is the most common way a "nice" email becomes unreadable.
 *
 * The customer email exists to answer one question — "did that work, and what
 * happens now?" — inside three seconds of being opened. Everything in it
 * serves that. The order is restated so they can see we got it right, the next
 * step is stated with a real timeframe, and WhatsApp is one tap away for the
 * ones who would rather talk than wait.
 */

declare(strict_types=1);

function sp_esc(string $s): string
{
    return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function sp_email_shell(string $title, string $inner, array $cfg): string
{
    $brand = sp_esc($cfg['brand_name']);
    $site = sp_esc($cfg['site_url']);
    $addr = sp_esc($cfg['postal_address']);
    return <<<HTML
<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark">
<title>{$title}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f7;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:28px 12px;">
<tr><td align="center">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
    <tr><td style="background:#0b0e18;padding:22px 28px;">
      <span style="color:#ffffff;font-size:19px;font-weight:800;letter-spacing:-.2px;">{$brand}</span>
    </td></tr>
    {$inner}
    <tr><td style="background:#ffffff;padding:22px 28px 28px;border-top:1px solid #e8e8ee;">
      <p style="margin:0 0 6px;color:#656a78;font-size:12px;line-height:1.6;">{$brand} · <a href="{$site}" style="color:#c41f0f;text-decoration:none;">{$site}</a></p>
      <p style="margin:0;color:#8a8f9c;font-size:11.5px;line-height:1.6;">{$addr}</p>
    </td></tr>
  </table>
</td></tr></table>
</body></html>
HTML;
}

/** What the customer gets, instantly. */
function sp_customer_email(array $o, array $cfg): array
{
    $brand = sp_esc($cfg['brand_name']);
    $plan = sp_esc($o['planLabel']);
    $devices = (int) $o['devices'];
    $deviceWord = $devices === 1 ? 'device' : 'devices';
    $total = sp_esc($o['totalFormatted']);
    $ref = sp_esc($o['id']);
    $window = sp_esc($cfg['activation_window']);
    $wa = sp_esc($cfg['whatsapp_url']);
    $refund = sp_esc($cfg['refund_label']);

    $inner = <<<HTML
    <tr><td style="background:#ffffff;padding:30px 28px 6px;">
      <h1 style="margin:0 0 10px;color:#111114;font-size:24px;line-height:1.25;font-weight:800;">We have your order</h1>
      <p style="margin:0 0 22px;color:#4b4f5a;font-size:15px;line-height:1.65;">
        Thanks — your order reached us and nothing more is needed from you right now.
        Your invoice and payment instructions are on their way.
      </p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f7fa;border:1px solid #e8e8ee;border-radius:12px;">
        <tr><td style="padding:18px 20px;">
          <p style="margin:0 0 4px;color:#656a78;font-size:11px;letter-spacing:1.2px;text-transform:uppercase;font-weight:700;">Your order</p>
          <p style="margin:0 0 2px;color:#111114;font-size:17px;font-weight:700;">{$plan} · {$devices} {$deviceWord}</p>
          <p style="margin:0;color:#111114;font-size:28px;font-weight:800;line-height:1.2;">{$total}</p>
          <p style="margin:8px 0 0;color:#656a78;font-size:12.5px;">Reference {$ref}</p>
        </td></tr>
      </table>

      <p style="margin:24px 0 10px;color:#111114;font-size:15px;font-weight:700;">What happens next</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding:0 0 10px;color:#4b4f5a;font-size:14.5px;line-height:1.6;">
          <strong style="color:#111114;">1.</strong> We send your invoice with payment instructions.
        </td></tr>
        <tr><td style="padding:0 0 10px;color:#4b4f5a;font-size:14.5px;line-height:1.6;">
          <strong style="color:#111114;">2.</strong> You pay using whichever method suits you.
        </td></tr>
        <tr><td style="padding:0 0 10px;color:#4b4f5a;font-size:14.5px;line-height:1.6;">
          <strong style="color:#111114;">3.</strong> Your login arrives, usually {$window} after payment is confirmed. Then you are watching.
        </td></tr>
      </table>

      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:22px 0 6px;">
        <tr><td style="background:#ff2b20;border-radius:10px;">
          <a href="{$wa}" style="display:inline-block;padding:13px 26px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;">Message us on WhatsApp</a>
        </td></tr>
      </table>
      <p style="margin:10px 0 22px;color:#656a78;font-size:13px;line-height:1.6;">
        Faster than email if you have a question, and someone is there around the clock.
        {$refund} · Reply to this email any time.
      </p>
    </td></tr>
HTML;

    $text = "We have your order\n\n"
        . "Thanks — your order reached us and nothing more is needed from you right now.\n\n"
        . "YOUR ORDER\n{$o['planLabel']} · {$devices} {$deviceWord}\n{$o['totalFormatted']}\nReference {$o['id']}\n\n"
        . "WHAT HAPPENS NEXT\n"
        . "1. We send your invoice with payment instructions.\n"
        . "2. You pay using whichever method suits you.\n"
        . "3. Your login arrives, usually {$cfg['activation_window']} after payment is confirmed.\n\n"
        . "Questions? Message us on WhatsApp: {$cfg['whatsapp_url']}\n"
        . "{$cfg['refund_label']} · Reply to this email any time.\n\n"
        . "{$cfg['brand_name']} · {$cfg['site_url']}\n{$cfg['postal_address']}\n";

    return [
        'subject' => "We have your order — {$o['planLabel']}, {$o['totalFormatted']}",
        'html'    => sp_email_shell('We have your order', $inner, $cfg),
        'text'    => $text,
    ];
}

/** What you get, so you can act on it without opening anything else. */
function sp_internal_email(array $o, array $cfg): array
{
    $rows = [
        'Plan'      => $o['planLabel'] . ' (' . $o['termMonths'] . ' months)',
        'Devices'   => (string) $o['devices'],
        'Total'     => $o['totalFormatted'],
        'Phone'     => $o['phone'],
        'Email'     => $o['email'],
        'Reference' => $o['id'],
        'Placed'    => $o['createdAt'],
        'From page' => $o['sourcePage'] !== '' ? $o['sourcePage'] : '—',
        'Campaign'  => $o['campaign'] !== '' ? $o['campaign'] : '—',
    ];

    /* A mismatch means the browser sent a total that is not what the server
       calculated — a stale tab, or someone editing the request. The server's
       figure was used either way; this is here so you see it before you invoice.
       As a table row among nine others it would be skimmed past, so it gets a
       banner. */
    $warning = '';
    $warningText = '';
    if ($o['priceMismatch']) {
        $said = sp_esc(sp_money((int) $o['clientTotal']));
        $charged = sp_esc($o['totalFormatted']);
        $warning = '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 18px;">'
            . '<tr><td style="background:#FEF2F2;border-left:3px solid #DC2626;border-radius:6px;padding:11px 14px;'
            . 'color:#7F1D1D;font-size:13px;line-height:1.5;">'
            . '<strong>Price mismatch.</strong> The browser sent ' . $said . '; the server charged ' . $charged
            . '. Invoice the server figure.</td></tr></table>';
        $warningText = "!! PRICE MISMATCH: browser sent " . sp_money((int) $o['clientTotal'])
            . ", server charged {$o['totalFormatted']}. Invoice the server figure.\n\n";
    }

    $html = '';
    $text = "NEW ORDER\n\n" . $warningText;
    foreach ($rows as $k => $v) {
        $html .= '<tr><td style="padding:7px 0;color:#656a78;font-size:13px;width:110px;">' . sp_esc((string) $k)
              . '</td><td style="padding:7px 0;color:#111114;font-size:14px;font-weight:600;">' . sp_esc((string) $v) . '</td></tr>';
        $text .= str_pad((string) $k, 12) . $v . "\n";
    }

    /* wa.me needs the customer's number in digits only, no + and no spaces.
       whatsapp_base is OUR number — linking to it here would open a chat with
       yourself, which is what this used to do. */
    $customerDigits = preg_replace('/\D+/', '', $o['phone']) ?? '';
    $waCustomer = sp_esc('https://wa.me/' . $customerDigits . '?text=' . rawurlencode(
        "Hi, this is {$cfg['brand_name']} about your order {$o['id']} — {$o['planLabel']}, {$o['devices']} device(s), {$o['totalFormatted']}."
    ));

    $inner = <<<HTML
    <tr><td style="background:#ffffff;padding:28px 28px 8px;">
      <h1 style="margin:0 0 4px;color:#111114;font-size:21px;font-weight:800;">New order</h1>
      <p style="margin:0 0 18px;color:#4b4f5a;font-size:14px;">{$o['totalFormatted']} · {$o['planLabel']}</p>
      {$warning}<table role="presentation" width="100%" cellpadding="0" cellspacing="0">{$html}</table>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:22px 0 8px;">
        <tr><td style="background:#25D366;border-radius:10px;">
          <a href="{$waCustomer}" style="display:inline-block;padding:12px 22px;color:#ffffff;font-size:14.5px;font-weight:700;text-decoration:none;">Open WhatsApp with this customer</a>
        </td></tr>
      </table>
    </td></tr>
HTML;

    $text .= "\nWhatsApp this customer: https://wa.me/{$customerDigits}\n";

    return [
        'subject' => "New order · {$o['totalFormatted']} · {$o['planLabel']} · {$o['devices']}× device",
        'html'    => sp_email_shell('New order', $inner, $cfg),
        'text'    => $text,
    ];
}
