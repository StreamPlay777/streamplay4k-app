<?php
/**
 * The invoice email — the one the owner sends by hand from the admin.
 *
 * IT IS THE CHECKOUT, not a notification. The customer ordered some time ago
 * and has been waiting; this arrives, and everything they need to pay has to
 * be in the first screenful: what they are paying, how much, and where to
 * click. Anything else is below that.
 *
 * THE PAYMENT LINK IS READ AT SEND TIME, never stored in this template and
 * never baked into a build. The owner rotates it every few days from the
 * admin, so the only correct source is whatever sp_payment_link() returns at
 * the moment the button is pressed.
 *
 * NO LINK, NO BUTTON. A payment button pointing nowhere is worse than no
 * button: the customer clicks, lands on an error, and concludes the shop is
 * broken. Without a link this email tells them the details are coming by
 * WhatsApp instead, which is true and which the owner can act on.
 *
 * ON NAMES: the order form asks for a phone number and an email address and
 * nothing else, so there is no name to greet anyone by. Rather than invent one
 * or print a raw email address as if it were a name, the greeting is written
 * to read correctly without one.
 */

declare(strict_types=1);

/**
 * @param array  $o       the order record
 * @param array  $cfg     config
 * @param string $payLink the CURRENT link, or '' if none is configured
 * @param bool   $isResend changes the opening line only
 * @return array{subject: string, html: string, text: string}
 */
function sp_invoice_email(array $o, array $cfg, string $payLink, bool $isResend = false): array
{
    $brand   = sp_esc($cfg['brand_name']);
    $plan    = sp_esc((string) ($o['planTier'] ?? $o['planLabel'] ?? ''));
    $term    = sp_esc((string) ($o['planLabel'] ?? ''));
    $devices = (int) ($o['devices'] ?? 1);
    $word    = $devices === 1 ? 'device' : 'devices';
    $total   = sp_esc((string) ($o['totalFormatted'] ?? ''));
    $ref     = sp_esc((string) ($o['id'] ?? ''));
    $window  = sp_esc((string) $cfg['activation_window']);
    $wa      = sp_esc((string) $cfg['whatsapp_url']);
    $refund  = sp_esc((string) $cfg['refund_label']);
    $link    = $payLink !== '' ? sp_esc($payLink) : '';

    $opening = $isResend
        ? 'Here is your invoice again, with a fresh payment link.'
        : 'Here is your invoice. Everything you need to complete your order is below.';

    /* ── The pay block, or the honest absence of one ─────────────────── */
    if ($link !== '') {
        $payBlock = <<<PAY
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f7fa;border:1px solid #e8e8ee;border-radius:12px;margin:0 0 10px;">
        <tr><td style="padding:20px 22px 22px;">
          <p style="margin:0 0 2px;color:#656a78;font-size:11px;letter-spacing:1.2px;text-transform:uppercase;font-weight:700;">Amount due</p>
          <p style="margin:0 0 16px;color:#111114;font-size:34px;font-weight:800;line-height:1.12;">{$total}</p>
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr><td style="background:#ff2b20;border-radius:10px;">
              <a href="{$link}" style="display:inline-block;padding:15px 30px;color:#ffffff;font-size:16px;font-weight:700;text-decoration:none;">Pay this invoice &rarr;</a>
            </td></tr>
          </table>
          <p style="margin:14px 0 0;color:#4b4f5a;font-size:13px;line-height:1.6;">
            Enter <strong style="color:#111114;">{$total}</strong> as the amount, and add your reference
            <strong style="color:#111114;">{$ref}</strong> so we can match your payment straight away.
          </p>
        </td></tr>
      </table>
      <p style="margin:0 0 22px;color:#656a78;font-size:12.5px;line-height:1.6;">
        Secure checkout &mdash; card, Apple Pay or Google Pay.
      </p>
PAY;
        $steps = [
            "Pay {$o['totalFormatted']} using the button above.",
            'We activate your account as soon as your payment reaches us.',
            "Your login arrives, usually {$cfg['activation_window']} later. Then you are watching.",
        ];
    } else {
        $payBlock = <<<PAY
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f7fa;border:1px solid #e8e8ee;border-radius:12px;margin:0 0 22px;">
        <tr><td style="padding:18px 20px;">
          <p style="margin:0 0 2px;color:#656a78;font-size:11px;letter-spacing:1.2px;text-transform:uppercase;font-weight:700;">Amount due</p>
          <p style="margin:0 0 10px;color:#111114;font-size:30px;font-weight:800;line-height:1.15;">{$total}</p>
          <p style="margin:0;color:#4b4f5a;font-size:14px;line-height:1.6;">
            We&rsquo;ll send your payment details on WhatsApp in the next few minutes.
            Reply here if you&rsquo;d rather have them by email.
          </p>
        </td></tr>
      </table>
PAY;
        $steps = [
            'We send your payment details on WhatsApp.',
            'We activate your account as soon as your payment reaches us.',
            "Your login arrives, usually {$cfg['activation_window']} later. Then you are watching.",
        ];
    }

    $stepRows = '';
    foreach ($steps as $i => $step) {
        $stepRows .= '<tr><td style="padding:0 0 10px;color:#4b4f5a;font-size:14.5px;line-height:1.6;">'
                   . '<strong style="color:#111114;">' . ($i + 1) . '.</strong> ' . sp_esc($step)
                   . '</td></tr>';
    }

    $inner = <<<HTML
    <tr><td style="background:#ffffff;padding:30px 28px 6px;">
      <h1 style="margin:0 0 10px;color:#111114;font-size:24px;line-height:1.25;font-weight:800;">Your invoice</h1>
      <p style="margin:0 0 22px;color:#4b4f5a;font-size:15px;line-height:1.65;">{$opening}</p>

      {$payBlock}

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8e8ee;border-radius:12px;">
        <tr><td style="padding:16px 20px;">
          <p style="margin:0 0 10px;color:#656a78;font-size:11px;letter-spacing:1.2px;text-transform:uppercase;font-weight:700;">Your order</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:4px 0;color:#656a78;font-size:13.5px;">Plan</td><td style="padding:4px 0;color:#111114;font-size:13.5px;font-weight:600;text-align:right;">{$plan} &middot; {$term}</td></tr>
            <tr><td style="padding:4px 0;color:#656a78;font-size:13.5px;">Devices</td><td style="padding:4px 0;color:#111114;font-size:13.5px;font-weight:600;text-align:right;">{$devices} {$word}</td></tr>
            <tr><td style="padding:4px 0;color:#656a78;font-size:13.5px;">Reference</td><td style="padding:4px 0;color:#111114;font-size:13.5px;font-weight:600;text-align:right;">{$ref}</td></tr>
            <tr><td style="padding:9px 0 0;border-top:1px solid #e8e8ee;color:#111114;font-size:14.5px;font-weight:700;">Total</td><td style="padding:9px 0 0;border-top:1px solid #e8e8ee;color:#111114;font-size:17px;font-weight:800;text-align:right;">{$total}</td></tr>
          </table>
        </td></tr>
      </table>

      <p style="margin:24px 0 10px;color:#111114;font-size:15px;font-weight:700;">What happens next</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">{$stepRows}</table>

      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0 6px;">
        <tr><td style="background:#25D366;border-radius:10px;">
          <a href="{$wa}" style="display:inline-block;padding:13px 26px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;">Message us on WhatsApp</a>
        </td></tr>
      </table>
      <p style="margin:10px 0 22px;color:#656a78;font-size:13px;line-height:1.6;">
        Someone is there around the clock. {$refund} &middot; Reply to this email any time.
      </p>
    </td></tr>
HTML;

    $textSteps = '';
    foreach ($steps as $i => $s) $textSteps .= ($i + 1) . '. ' . $s . "\n";

    $text = "Your invoice\n\n"
        . ($isResend
            ? "Here is your invoice again, with a fresh payment link.\n\n"
            : "Here is your invoice. Everything you need to complete your order is below.\n\n")
        . "AMOUNT DUE\n{$o['totalFormatted']}\n\n"
        . ($payLink !== ''
            ? "Pay here:\n{$payLink}\n"
              . "Enter {$o['totalFormatted']} as the amount and add reference {$o['id']}.\n\n"
            : "We'll send your payment details on WhatsApp in the next few minutes.\n\n")
        . "YOUR ORDER\n"
        . "Plan       " . ($o['planTier'] ?? '') . " · " . ($o['planLabel'] ?? '') . "\n"
        . "Devices    {$devices} {$word}\n"
        . "Reference  {$o['id']}\n"
        . "Total      {$o['totalFormatted']}\n\n"
        . "WHAT HAPPENS NEXT\n" . $textSteps . "\n"
        . "Questions? WhatsApp: {$cfg['whatsapp_url']}\n"
        . "{$cfg['refund_label']} · Reply to this email any time.\n\n"
        . "{$cfg['brand_name']} · {$cfg['site_url']}\n{$cfg['postal_address']}\n";

    return [
        // The reference belongs in the subject. With a reusable payment link
        // the customer types the amount and quotes the order number, and the
        // number they quote is whichever one they can find — so it has to be
        // visible in the inbox list, not four paragraphs down.
        'subject' => ($isResend ? 'Your invoice (resent) — ' : 'Your invoice — ')
                   . ($o['id'] ?? '') . ' — '
                   . ($o['planLabel'] ?? '') . ', ' . ($o['totalFormatted'] ?? ''),
        'html'    => sp_email_shell('Your invoice', $inner, $cfg),
        'text'    => $text,
    ];
}
