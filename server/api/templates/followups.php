<?php
/**
 * The four follow-up emails.
 *
 * WRITTEN SHORT ON PURPOSE. These are interruptions the customer did not ask
 * for. Each one has a single job, says it in the first line, and gives one
 * thing to do. A long follow-up reads as pressure, and pressure is what makes
 * people unsubscribe rather than pay.
 *
 * None of them invents urgency — no fake countdown, no "your order will be
 * cancelled". Everything they say is true: the link really does expire, the
 * refund window really does close on day seven. A shop that cries wolf on the
 * first reminder is not believed on the last one.
 */

declare(strict_types=1);

/** Returns ['subject','html','text'] or null if the stage has no email. */
function sp_followup_email(string $stage, array $o, array $cfg): ?array
{
    $plan    = sp_esc($o['planLabel']);
    $devices = (int) $o['devices'];
    $word    = $devices === 1 ? 'device' : 'devices';
    $total   = sp_esc($o['totalFormatted']);
    $ref     = sp_esc($o['id']);
    $wa      = sp_esc($cfg['whatsapp_url']);
    $window  = sp_esc($cfg['activation_window']);
    $refund  = sp_esc($cfg['refund_label']);
    $setup   = sp_esc(rtrim($cfg['site_url'], '/') . '/setup-guide/');
    /* Either kind of pay link. A per-order checkout carries its own amount;
       a reusable one does not, so the nudge has to say the figure out loud. */
    $pay      = isset($o['payUrl'])  && $o['payUrl']  !== '' ? sp_esc((string) $o['payUrl'])  : '';
    $payLink  = isset($o['payLink']) && $o['payLink'] !== '' ? sp_esc((string) $o['payLink']) : '';
    $payHref  = $pay ?: $payLink;
    $payHrefRaw = $pay ? (string) $o['payUrl'] : (string) ($o['payLink'] ?? '');
    $payNote  = $payLink && !$pay
        ? '<p style="margin:10px 0 0;color:#656a78;font-size:12.5px;line-height:1.6;">'
          . "Enter <strong style=\"color:#111114;\">{$total}</strong> as the amount and add reference "
          . "<strong style=\"color:#111114;\">{$ref}</strong>.</p>"
        : '';

    $button = function (string $href, string $label, string $bg = '#ff2b20'): string {
        return '<table role="presentation" cellpadding="0" cellspacing="0" style="margin:4px 0 8px;">'
             . '<tr><td style="background:' . $bg . ';border-radius:10px;">'
             . '<a href="' . $href . '" style="display:inline-block;padding:13px 26px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;">'
             . $label . '</a></td></tr></table>';
    };

    $shell = function (string $title, string $bodyHtml) use ($cfg): string {
        return sp_email_shell($title, '<tr><td style="background:#ffffff;padding:30px 28px 24px;">' . $bodyHtml . '</td></tr>', $cfg);
    };

    switch ($stage) {

        /* ── +6h, unpaid ──────────────────────────────────────────────── */
        case 'nudge1': {
            $cta = $payHref
                ? $button($payHref, "Pay {$total} and finish &rarr;") . $payNote
                : $button($wa, 'Get your invoice on WhatsApp &rarr;', '#25D366');
            $html = $shell('Your order is still waiting', <<<H
              <h1 style="margin:0 0 10px;color:#111114;font-size:22px;font-weight:800;line-height:1.3;">Your order is still waiting</h1>
              <p style="margin:0 0 20px;color:#4b4f5a;font-size:15px;line-height:1.65;">
                We're holding {$plan} on {$devices} {$word} for you &mdash; {$total}. It takes about a minute to finish.
              </p>
              {$cta}
              <p style="margin:14px 0 0;color:#656a78;font-size:13px;line-height:1.6;">
                Reference {$ref}. If something stopped you &mdash; a question about devices, or the price &mdash;
                <a href="{$wa}" style="color:#c41f0f;text-decoration:none;">just reply or message us on WhatsApp</a>. A person answers.
              </p>
H);
            $link = $payHrefRaw ?: $cfg['whatsapp_url'];
            return [
                'subject' => "Still want {$o['planLabel']}? Your order is waiting",
                'html'    => $html,
                'text'    => "Your order is still waiting\n\n"
                    . "We're holding {$o['planLabel']} on {$devices} {$word} for you — {$o['totalFormatted']}.\n"
                    . "Finish here: {$link}\n"
                    . ($payLink && !$pay ? "Enter {$o['totalFormatted']} as the amount and add reference {$o['id']}.\n" : '')
                    . "\n"
                    . "Reference {$o['id']}. Questions? {$cfg['whatsapp_url']}\n\n"
                    . "{$cfg['brand_name']} · {$cfg['site_url']}\n{$cfg['postal_address']}\n",
            ];
        }

        /* ── +24h, unpaid. The last one about money. ──────────────────── */
        case 'nudge2': {
            $cta = $payHref ? $button($payHref, "Pay {$total} &rarr;") . $payNote : '';
            $html = $shell('Anything we can help with?', <<<H
              <h1 style="margin:0 0 10px;color:#111114;font-size:22px;font-weight:800;line-height:1.3;">Anything we can help with?</h1>
              <p style="margin:0 0 18px;color:#4b4f5a;font-size:15px;line-height:1.65;">
                Your order for {$plan} is still open. If you have a question &mdash; whether it works on your TV,
                how many devices you need, anything &mdash; message us and we'll answer straight away.
              </p>
              {$button($wa, 'Ask us on WhatsApp &rarr;', '#25D366')}
              {$cta}
              <p style="margin:16px 0 0;color:#656a78;font-size:13px;line-height:1.6;">
                {$refund}, so there's very little to lose by trying it.
                This is the last email we'll send about this order &mdash; reference {$ref}.
              </p>
H);
            return [
                'subject' => 'Anything we can help with before you decide?',
                'html'    => $html,
                'text'    => "Anything we can help with?\n\n"
                    . "Your order for {$o['planLabel']} is still open. Questions of any kind: {$cfg['whatsapp_url']}\n"
                    . ($payHrefRaw ? "Or pay here: {$payHrefRaw}\n" : '')
                    . "\n{$cfg['refund_label']}. This is the last email about order {$o['id']}.\n\n"
                    . "{$cfg['brand_name']} · {$cfg['site_url']}\n{$cfg['postal_address']}\n",
            ];
        }

        /* ── +48h, paid. Catch the quietly-stuck. ─────────────────────── */
        case 'checkin': {
            $html = $shell('Is everything working?', <<<H
              <h1 style="margin:0 0 10px;color:#111114;font-size:22px;font-weight:800;line-height:1.3;">Is everything working?</h1>
              <p style="margin:0 0 18px;color:#4b4f5a;font-size:15px;line-height:1.65;">
                You've had your {$plan} account for a couple of days. If it's all running, ignore this &mdash;
                enjoy it. If anything is off, we'd rather fix it than have you put up with it.
              </p>
              {$button($wa, 'Tell us what&rsquo;s wrong &rarr;', '#25D366')}
              <p style="margin:14px 0 0;color:#656a78;font-size:13px;line-height:1.6;">
                Buffering, a channel missing, a device you can't get set up &mdash; most of it takes us a
                few minutes. The <a href="{$setup}" style="color:#c41f0f;text-decoration:none;">setup guide</a>
                covers the common ones.
              </p>
H);
            return [
                'subject' => 'Is your StreamPlay4K running smoothly?',
                'html'    => $html,
                'text'    => "Is everything working?\n\n"
                    . "You've had your {$o['planLabel']} account for a couple of days. If anything is off,\n"
                    . "we'd rather fix it than have you put up with it: {$cfg['whatsapp_url']}\n\n"
                    . "Setup guide: " . rtrim($cfg['site_url'], '/') . "/setup-guide/\n\n"
                    . "{$cfg['brand_name']} · {$cfg['site_url']}\n{$cfg['postal_address']}\n",
            ];
        }

        /* ── +5d, paid. Two days of the refund window left. ───────────── */
        case 'refund': {
            $html = $shell('Two days left on your guarantee', <<<H
              <h1 style="margin:0 0 10px;color:#111114;font-size:22px;font-weight:800;line-height:1.3;">Two days left on your guarantee</h1>
              <p style="margin:0 0 18px;color:#4b4f5a;font-size:15px;line-height:1.65;">
                Your {$refund} runs out in two days. We're telling you because it's yours &mdash;
                not to talk you out of using it.
              </p>
              <p style="margin:0 0 18px;color:#4b4f5a;font-size:15px;line-height:1.65;">
                If something hasn't worked, message us today. Most problems people give up on take us
                minutes, and we'd much rather sort it out than see you go.
              </p>
              {$button($wa, 'Message us &rarr;', '#25D366')}
              <p style="margin:14px 0 0;color:#656a78;font-size:13px;line-height:1.6;">
                Happy with it? Nothing to do &mdash; your {$plan} runs to the end of its term. Reference {$ref}.
              </p>
H);
            return [
                'subject' => "Two days left on your {$cfg['refund_label']}",
                'html'    => $html,
                'text'    => "Two days left on your guarantee\n\n"
                    . "Your {$cfg['refund_label']} runs out in two days. If something hasn't worked,\n"
                    . "message us today — most problems take minutes: {$cfg['whatsapp_url']}\n\n"
                    . "Happy with it? Nothing to do. Reference {$o['id']}.\n\n"
                    . "{$cfg['brand_name']} · {$cfg['site_url']}\n{$cfg['postal_address']}\n",
            ];
        }
    }

    return null;
}
