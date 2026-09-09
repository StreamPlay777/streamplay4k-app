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
4. Only then are two emails sent through Mailgun:
   - one to your inbox: the order, with a one-tap WhatsApp link to the customer;
   - one to the customer: what they ordered, what happens next, and how to reach you.
5. The browser gets `{ ok: true, orderId: "SP-20260909-A1B2C3" }` and the
   customer lands on `/thank-you/` with that reference.

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
'orders_inbox' => 'the inbox where you want new orders',   // yours, not public
'orders_dir'   => '/home/uXXXXXXX/streamplay4k-orders',    // from step 1
```

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

Expect `{"ok":true,"orderId":"SP-..."}`, an email in your inbox, an email at
`you@example.com`, and a new `SP-....json` in the orders folder.

Note the `total` above is deliberately wrong — the server should still charge
$149.99 (12 months, 2 devices) and log a `PRICE MISMATCH` line. That is the
check working.

**If you get HTML back instead of JSON**, the `.htaccess` did not upload.
`/api/order` has no file extension, so without the rewrite rule the SPA
fallback answers it with `index.html`. Confirm `public_html/.htaccess` contains
the `^api/order/?$` rule, and that hidden files were included in the upload —
File Manager hides dotfiles by default (Settings → *Show hidden files*).

These must all be false before you take real orders:

- [ ] `curl https://streamplay4k.com/api/config.php` returns **403**, not PHP source
- [ ] `curl https://streamplay4k.com/api/lib/mailer.php` returns **403**
- [ ] `https://streamplay4k.com/streamplay4k-orders/` is **404** (the folder is outside the web root)
- [ ] The order form on the live site does **not** show the yellow "development mode" notice

---

## Where things end up

```
/home/uXXXXXXX/
├── streamplay4k-orders/          ← above the web root, not reachable over HTTP
│   ├── SP-20260909-A1B2C3.json   one file per order
│   ├── orders-2026-09.ndjson     one line per order — open this to see the day
│   ├── endpoint.log              what was sent, what failed, price mismatches
│   ├── recent.json               5-minute duplicate guard
│   └── ratelimit.json            per-IP throttle
└── public_html/
    ├── .htaccess                 routes /api/order, blocks /api/lib and config
    ├── index.html, pricing/, …   the pre-rendered site
    └── api/
        ├── order.php             the endpoint
        ├── config.php            ← YOUR KEY. Created by hand, never deployed.
        ├── lib/                  pricing, validation, mailer, storage
        └── templates/            the two emails
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

## Still to decide

Two things are not built because they depend on answers only you have:

1. **How customers pay.** The customer email currently says you will send
   payment details — because there is no payment link in the code yet. Once you
   pick a method (Stripe payment link, PayPal.me, bank transfer), it becomes one
   value in `config.php` and one line in the email template.
2. **Which inbox receives orders.** `orders_inbox` in `config.php`.

The follow-up sequence (a nudge at 6h and 24h if an order is unpaid, a check-in
on day 2, a note before the refund window closes on day 5) is the next piece.
Cloud Startup has cron, so it runs on a schedule reading the same order files —
no extra service, no extra cost.
