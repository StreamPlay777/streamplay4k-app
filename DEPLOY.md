# Deploying StreamPlay4K to Hostinger

Everything here is done once. After that a deploy is: build, upload `dist/`.

---

## What the order system actually does

A customer picks a term and a device count, taps **Order**, and types a phone
number and an email address. No payment is taken on the site. On submit:

1. The browser POSTs to `/api/order` on the same domain.
2. `server/api/order.php` throttles by IP, validates the details, and
   **recalculates the price from scratch** — the browser's figure is only
   compared, never trusted. If they disagree, the server's number wins and the
   mismatch is written to the log.
3. The order is **written to disk first**, above the web root.
4. If a payment link is configured, it is attached (see section 6). By
   default none is, and the email simply says an invoice is coming.
5. The order is mirrored into your Google Sheet, if one is set up.
6. Only then are two emails sent through Mailgun:
   - one to your inbox: the order, with a one-tap WhatsApp link to the customer;
   - one to the customer: what they ordered, what happens next, and how to reach you.
7. The browser gets `{ ok: true, orderId: "SP-1001" }` and the
   customer lands on `/thank-you/` with that reference.

Steps 4 and 5 are optional and independent, and nothing in either can fail an
order — it is on disk by then. With neither configured you have a complete
shop: the customer is told an invoice is on its way, and you send it.

Storing before sending is the part that matters. Mailgun will have a bad
minute eventually. When it does, the order is already on disk and you can still
serve the customer.

---

## 1. Create the orders folder (once)

The order records must sit **above** `public_html` so they can never be fetched
over HTTP. In hPanel → **File Manager**, go up one level from `public_html` and
create a folder next to it:

```
/home/uXXXXXXX/streamplay4k-orders
```

Copy that full path — you need it in step 3. (Your real `uXXXXXXX` is shown in
the File Manager address bar.)

---

## 2. Get the Mailgun sending key

Mailgun → **Send** → **Domain settings** → **Sending API keys** → create one for
`streamplay4k.com`.

Copy it once; Mailgun will not show it again. It goes into one file on the
server and nowhere else — never into the repo, never into a chat, never into
anything the browser downloads. If it leaks, rotate it in that same screen.

The code calls Mailgun's **HTTP API on port 443**, not SMTP. Shared hosts very
often block outbound 587/465, and when they do, SMTP fails slowly and silently.
Port 443 is the one port that is always open.

---

## 3. Write the config (once)

Upload the site (step 4) first, then in File Manager open `public_html/api/`,
copy `config.example.php` to **`config.php`**, and fill in the three marked
values:

```php
'mailgun_key'  => 'the key from step 2',
'orders_inbox' => 'your-personal-address@gmail.com',       // yours, not public
'orders_dir'   => '/home/uXXXXXXX/streamplay4k-orders',    // from step 1
```

`orders_inbox` is where every new-order notification lands. It is read by PHP
on the server and never appears in the site's HTML, JavaScript or this
repository — which is why it is not written out here. Put your real address in
`config.php` and nowhere else: an address committed to a repo gets scraped, and
the one you are giving out is a personal inbox.

`mail_reply_to` is different — that one *is* public, because it is where a
customer's reply goes. Leave it as `support@streamplay4k.com`, and make sure
that inbox actually receives mail. A confirmation whose replies bounce is worse
than one with no reply address at all.

Leave the rest as it is — the domain, region base URL and brand facts are
already correct.

`config.php` is git-ignored and is never included in a build, so future deploys
cannot overwrite it. It is also the only file the endpoint refuses to run
without: if it is missing, `/api/order` returns 500 rather than pretending.

---

## 4. Build and upload

```bash
npm install
npm run build
```

That produces `dist/` containing the pre-rendered site **and** `dist/api/` with
the PHP endpoint. Upload the **contents of `dist/`** into `public_html/`.

Hostinger's File Manager can unzip: zip the contents of `dist`, upload the zip
to `public_html`, extract, delete the zip. Or use SFTP — Cloud Startup includes
SSH, so `rsync` works too:

```bash
rsync -avz --delete --exclude 'api/config.php' dist/ uXXXXXXX@your-host:~/public_html/
```

`--exclude 'api/config.php'` is what stops `--delete` from removing your live
key.

---

## 5. Check it end to end

```bash
# Should return JSON with an orderId, and should NOT return HTML.
curl -sS -X POST https://streamplay4k.com/api/order \
  -H 'Content-Type: application/json' \
  -d '{"planId":"12m","deviceCount":2,"total":14999,"phone":"+12125551234","email":"you@example.com","sourcePage":"/pricing/"}'
```

Expect `{"ok":true,"orderId":"SP-1001"}`, an email in your inbox, an email at
`you@example.com`, and a new `SP-1001.json` in the orders folder.

Note the `total` above is deliberately wrong — the server should still charge
$149.99 (12 months, 2 devices) and log a `PRICE MISMATCH` line. That is the
check working.

**If you get HTML back instead of JSON**, the `.htaccess` did not upload.
`/api/order` has no file extension, so without the rewrite rule the SPA
fallback answers it with `index.html`. Confirm `public_html/.htaccess` contains
the `^api/order/?$` rule, and that hidden files were included in the upload —
File Manager hides dotfiles by default (Settings → *Show hidden files*).

These must all pass before you take real orders:

- [ ] `curl https://streamplay4k.com/api/config.php` returns **403**, not PHP source
- [ ] `curl https://streamplay4k.com/api/lib/mailer.php` returns **403**
- [ ] `curl https://streamplay4k.com/api/cron/followups.php` returns **403**
- [ ] `https://streamplay4k.com/streamplay4k-orders/` is **404** (the folder is outside the web root)
- [ ] `https://streamplay4k.com/admin/` asks for a password before showing anything

The first three matter most. `config.php` holds your Mailgun and Stripe keys;
`cron/` sends email to your customer list.

---

## Where things end up

```
/home/uXXXXXXX/
├── streamplay4k-orders/          ← above the web root, not reachable over HTTP
│   ├── SP-1001.json               one file per order — the current truth
│   ├── counter.json              the next order number
│   ├── orders-2026-09.ndjson     one line per order as placed
│   ├── endpoint.log              what was sent, what failed, price mismatches
│   ├── leads.json                entered a number, never ordered
│   ├── recent.json               5-minute duplicate guard
│   ├── ratelimit.json            per-IP throttle
│   ├── admin-attempts.json       dashboard login lockouts
│   └── sheets-pending.json       sheet pushes awaiting retry
└── public_html/
    ├── .htaccess                 routes the API, blocks lib/ cron/ and config
    ├── index.html, pricing/, …   the pre-rendered site
    ├── admin/index.php           your dashboard
    └── api/
        ├── order.php             the order endpoint
        ├── lead.php              captures an abandoned number
        ├── stripe-webhook.php    payment confirmations from Stripe
        ├── config.php            ← YOUR KEYS. By hand, never deployed.
        ├── cron/followups.php    the four follow-up emails
        ├── lib/                  pricing, validation, mail, storage, Stripe, Sheets
        └── templates/            the emails
```

`orders-YYYY-MM.ndjson` is one JSON object per line, so a month of orders opens
in anything:

```bash
# every order this month, newest last
cat ~/streamplay4k-orders/orders-2026-09.ndjson | python3 -c "
import sys, json
for l in sys.stdin:
    o = json.loads(l)
    print(o['createdAt'], o['id'], o['planLabel'], o['devices'], o['totalFormatted'], o['email'])
"
```

---

## Guard rails already in place

- **The price cannot be edited by the customer.** `server/api/lib/pricing.php`
  is a line-for-line mirror of `src/data/pricing.ts`. If you ever change the
  prices, change **both** — there is a warning at the top of the PHP file
  saying so.
- **Double-submits do not become double orders.** The same person, same plan,
  same device count within five minutes is acknowledged as success and dropped.
  Returning an error there would just make them tap a third time.
- **The endpoint is not an open mail relay.** Eight requests per IP per hour;
  above that it returns 429 without sending anything. A real customer never
  reaches that, a script reaches it immediately.
- **No CORS headers are sent at all.** The site posts to its own origin, so
  nothing else needs permission. Adding `Access-Control-Allow-Origin: *` here
  would let any site on the internet submit orders in your name.
- **Your internal inbox never appears in the website's HTML or JavaScript.** It
  exists only in `config.php` on the server.

---

## 6. Payment — three options, pick one

The site works with **none** of these configured. That is the default: the
customer is told an invoice is on its way, and you send it.

### Option A — nothing (the default)

Leave `payment_link` and `stripe_secret` blank. The confirmation email says:

> Thanks — your order reached us and nothing more is needed from you right now.
> We are preparing your invoice and will send it to this address shortly, and
> on WhatsApp.

Honest, complete, and every order waits on you.

### Option B — one reusable payment link (custom amount)

If you have a single Stripe payment link the customer types the amount into:

```php
'payment_link' => 'https://buy.stripe.com/…',
```

The email gains a panel with **the amount at headline size**, a Pay button, and
the order reference to put in the description. The figure appears three times,
because with a link like this the amount is the customer's job to get right and
a mistyped one is your afternoon, not theirs.

⚠️ **Nothing reports back.** A reusable link cannot tell the site who paid or
how much, so orders never mark themselves paid — you confirm each payment in
Stripe and set the order to **paid** in `/admin/`. Fine at low volume; it stops
being fine when you are doing tens a day.

### Option C — Stripe Checkout, per order

The amount is fixed, the payment reports itself back, and the order marks
itself paid without you touching it. Two values:

1. **Developers → API keys → Secret key** (`sk_live_…`). Treat it exactly like
   the Mailgun key: `config.php` only.
2. **Developers → Webhooks → Add endpoint**
   - URL: `https://streamplay4k.com/api/stripe-webhook`
   - Event: **`checkout.session.completed`**

   Stripe then shows a **signing secret** (`whsec_…`).

```php
'stripe_secret'         => 'sk_live_…',
'stripe_webhook_secret' => 'whsec_…',
```

⚠️ **Both, or neither.** Without the webhook secret every webhook is rejected —
which is the correct default, because an unverified webhook endpoint is a
button anyone can press to mark an order paid. You would take payments and
never hear about them.

**What Option C changes.** The confirmation email becomes the checkout: subject
"Complete your order", a **Pay $149.99 now** button above the fold, and three
steps that describe paying rather than waiting. When the payment clears, the
order marks itself paid, the customer gets "Payment received — setting up your
account" with a link to the setup guide, and you get a **PAID — create the
account** email with their details.

The checkout amount is created per order from the server's own figure, so it
can never disagree with what you quoted. Links expire after 24 hours; the
follow-up emails issue fresh ones.

**Test with Stripe in test mode first** — `sk_test_…` and a test-mode webhook —
and use card `4242 4242 4242 4242`. Confirm the order flips to paid in
`/admin/` before switching to live keys.

---

## 7. Google Sheets

**Start from a blank sheet, not a file.** Go to
**[sheets.new](https://sheets.new)**, paste `server/google-sheets/Code.gs` into
**Extensions → Apps Script**, set your token, and run **setup** once. The script
builds both tabs, the formatting and the colours itself.

> Do not upload a spreadsheet file to Drive for this. An uploaded file stays an
> *Excel* file, and Excel files have no **Extensions** menu — so Apps Script is
> nowhere to be found. A blank Google Sheet has it from the start.

Every click is written out in `server/google-sheets/README.md`. Two values end
up in `config.php`.

**Twelve columns:** Order · Date · Status · Plan · Devices · Total · Email ·
Phone · Country · Paid · Activated · Notes.

**A menu, not just a table.** Select a row and use **StreamPlay4K → Mark as
paid** (or activated, or cancelled). It colours the whole row and stamps the
date, which is the half people forget by hand and the half every figure on the
Summary tab depends on.

The sheet is a mirror. Orders reach your server first, and a failed push is
queued for the hourly cron — a Google outage cannot cost you an order or leave
a hole in the sheet.

## 8. The follow-up emails (cron)

Four emails, each with one job:

| When | To | What it does |
|---|---|---|
| +6h | unpaid | A nudge with a **fresh** pay link. Most people who stop here got distracted, not cold. |
| +24h | unpaid | Last one about money. Offers WhatsApp, because someone who ignored a button twice has a question. |
| +48h | paid | "Is everything working?" — catches the customer quietly stuck on setup who would otherwise charge back. |
| +5d | paid | Two days before the refund window closes. |

hPanel → **Advanced → Cron Jobs** → add:

```
0 * * * *   /usr/bin/php /home/uXXXXXXX/public_html/api/cron/followups.php
```

Hourly. Each run sends at most one stage per order, so nobody gets two emails
in the same minute. The same run retries any Google Sheet pushes that failed.

**Try it first without sending anything:**

```bash
php ~/public_html/api/cron/followups.php --dry-run
```

That prints exactly what a real run would send.

Three things it will not do: send the same stage twice (each send is recorded
on the order), chase someone who has paid in the meantime (status is re-read at
send time), or mail your back catalogue when you switch it on (anything older
than 14 days is left alone).

---

## 9. Your dashboard

**`https://streamplay4k.com/admin/`**

Set a username and a password hash in `config.php`. The password itself is
never stored — generate the hash over SSH:

```bash
php -r 'echo password_hash("your-password-here", PASSWORD_DEFAULT), "\n";'
```

```php
'admin_user'          => 'hamza',
'admin_password_hash' => '$2y$10$…the output above…',
```

What you get: paid revenue, paid today, how many are awaiting payment and what
that is worth; every order with contact details and a one-tap WhatsApp link;
search and filter; and a status you can set to paid, activated or cancelled —
which writes through to the Google Sheet too.

Below that, **Didn't finish** — people who entered a working number and stopped
before ordering, each with a pre-written WhatsApp message. They are the closest
anyone gets to buying without buying. Rows vanish once the person orders.

Five wrong passwords locks that IP out for fifteen minutes.

⚠️ This page shows customer phone numbers and email addresses. Use a password
you use nowhere else. If you want a second lock, hPanel → **Password Protect
Directories** on `/admin/` adds a browser prompt in front of it.

---

## Still to decide

**Whether you want a database.** Orders are one JSON file each plus a monthly
NDJSON log. That is the right amount of machinery at this volume, and only four
functions in `lib/store.php` know how orders are stored — moving to SQLite later
would not change the endpoint, the cron or the dashboard.
