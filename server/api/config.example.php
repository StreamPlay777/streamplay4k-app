<?php
/**
 * Copy this file to config.php and fill in the marked values.
 *
 * config.php is git-ignored and must never be committed. Nothing in here is
 * ever sent to a browser — it is read by PHP on the server only.
 */

return [
    /* ── Mailgun ─────────────────────────────────────────────────────────
       Your domain is verified in the US region, so the base URL below is the
       right one. (EU accounts use https://api.eu.mailgun.net/v3.)

       The key is your Mailgun *Sending* API key:
         Mailgun → Send → Domain settings → Sending API keys.
       It starts with "key-" or is a long random string. Paste it here and
       nowhere else. If it ever leaks, rotate it in that same screen. */
    'mailgun_key'    => '',                                   // ← PASTE YOURS
    'mailgun_domain' => 'streamplay4k.com',
    'mailgun_base'   => 'https://api.mailgun.net/v3',

    /* ── Addresses ───────────────────────────────────────────────────────
       mail_from must be on the verified domain above or Mailgun rejects it.
       reply_to is where a customer's reply lands — a real inbox you read. */
    'mail_from'     => 'StreamPlay4K <orders@streamplay4k.com>',
    'mail_reply_to' => 'support@streamplay4k.com',

    /* Where new-order notifications go. Server-side only — this address is
       never rendered into the website's HTML or JavaScript. */
    'orders_inbox'  => '',                                    // ← YOUR INBOX

    /* ── Storage ─────────────────────────────────────────────────────────
       ABOVE the web root, so order records can never be fetched over HTTP.
       On Hostinger your site is public_html/, so a sibling folder works:
         /home/uXXXXXXX/streamplay4k-orders
       Create it in hPanel → File Manager and paste the full path here. */
    'orders_dir' => '',                                       // ← FULL PATH

    /* ── Stripe (optional) ───────────────────────────────────────────────
       With these blank, the site still works exactly as before: the customer
       gets "your invoice is on its way" and you send payment details by hand.
       Fill them in and the same email carries a Pay-now button for the exact
       amount, and orders mark themselves paid.

       stripe_secret          Developers → API keys → Secret key (sk_live_…).
                              Treat it exactly like the Mailgun key: this file
                              only, never a commit, never a chat.
       stripe_webhook_secret  Developers → Webhooks → add endpoint
                                https://streamplay4k.com/api/stripe-webhook
                              listening for `checkout.session.completed`.
                              Stripe then shows a signing secret (whsec_…).
                              Without it every webhook is rejected — which is
                              the correct default, since an unverified webhook
                              would let anyone mark an order paid. */
    'stripe_secret'         => '',
    'stripe_webhook_secret' => '',

    /* ── Google Sheet (optional) ─────────────────────────────────────────
       Mirrors every order into a spreadsheet. A mirror only: orders are
       written to disk first and a sheet failure never reaches the customer.
       Setup is in server/google-sheets/README.md — it takes about five
       minutes and needs no API key.

       sheets_url    the /exec URL of your deployed Apps Script web app
       sheets_token  the same long random string as SHARED_TOKEN in Code.gs */
    'sheets_url'   => '',
    'sheets_token' => '',

    /* ── Dashboard login ─────────────────────────────────────────────────
       For https://streamplay4k.com/admin/ — your orders, contact details and
       who did not finish.

       The PASSWORD IS NEVER STORED HERE, only its hash. Generate it over SSH:

         php -r 'echo password_hash("your-password-here", PASSWORD_DEFAULT), "\n";'

       Paste the output (it starts $2y$) below. Anyone who later reads this
       file still cannot sign in as you anywhere else. */
    'admin_user'          => '',
    'admin_password_hash' => '',

    /* ── Brand facts used in the emails ──────────────────────────────────
       Kept in step with src/data/site.ts by hand; they are the same values. */
    'brand_name'        => 'StreamPlay4K',
    'site_url'          => 'https://streamplay4k.com',
    'postal_address'    => '1520 Bedford Ave, Brooklyn, NY 11216, USA',
    'activation_window' => '5–15 minutes',
    'refund_label'      => '7-Day Money-Back Guarantee',
    'whatsapp_url'      => 'https://wa.me/33675734132',
];
