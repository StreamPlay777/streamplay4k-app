# Mirroring orders into Google Sheets

Five minutes, once. No API key, no service account, no downloaded credentials.

## Why it works this way

The Sheets API would need a service-account private key sitting on your server,
JWT signing and token refresh — three more things to hold correctly, and a key
file that must never become web-readable. An Apps Script bound to your own
spreadsheet already has permission to write to it. The only credential is a
random string you choose.

**The sheet is a mirror, never the record.** Orders are written to disk on your
server first, and a sheet that is unreachable produces a line in the log, not a
failed order. If Google is down, or you edit the script and forget to redeploy,
the shop keeps taking money. Anything that failed is retried by the hourly cron.

## Setup

**1.** Create a spreadsheet at [sheets.new](https://sheets.new). Name it
something you will recognise — *StreamPlay4K orders*.

**2.** In that sheet: **Extensions → Apps Script**. Delete whatever is in the
editor and paste the whole of `Code.gs` from this folder.

**3.** Near the top, replace the placeholder:

```js
const SHARED_TOKEN = 'CHANGE-ME-TO-A-LONG-RANDOM-STRING';
```

Generate one over SSH and paste the output:

```bash
php -r 'echo bin2hex(random_bytes(24)), "\n";'
```

Save (**⌘S** / **Ctrl+S**).

**4.** **Deploy → New deployment** → gear icon → **Web app**.

| Field | Value |
|---|---|
| Execute as | **Me** |
| Who has access | **Anyone** |

Deploy, and grant the permissions Google asks for. It will warn that the app is
unverified — that is expected for a script you wrote yourself; choose
**Advanced → Go to (project name)**.

> **"Anyone" does not mean anyone can read your sheet.** It means the URL
> accepts a request without a Google login, which is what lets your server post
> to it. The script only appends rows, never reads any back, and refuses every
> request that does not carry your token.

**5.** Copy the deployment URL. It ends in `/exec`.

**6.** Put both values into `public_html/api/config.php`:

```php
'sheets_url'   => 'https://script.google.com/macros/s/AKfy…/exec',
'sheets_token' => 'the same string you pasted in step 3',
```

**7.** Check it. Open the `/exec` URL in a browser — you should see
`{"ok":true,"service":"StreamPlay4K orders"}`. Then place a test order on the
site and watch a row appear.

## What lands in the sheet

Order ID · Created · Status · Plan · Months · Devices · Total · Total (cents) ·
Phone · Email · Country · Source page · Campaign · Paid at · Activated at · Notes

Rows update in place rather than duplicating, so an order that is later marked
paid changes on the row it already had.

Phone numbers are written with a leading apostrophe. Without it Sheets reads
`+12125551234` as a formula and shows `#ERROR!` where the number should be.

## If rows stop appearing

Check `endpoint.log` in your orders folder — a failed push is logged with the
reason and queued for retry.

- **`script said: bad token`** — `SHARED_TOKEN` and `sheets_token` disagree.
- **`http 302` or an HTML body** — the deployment was edited without being
  redeployed. **Deploy → Manage deployments → edit → Version: New version.**
  This is the common one: editing the script does not change what the URL
  serves until you publish a new version.
- **Nothing in the log at all** — `sheets_url` is empty, so the mirror is off.

Anything queued is pushed on the next hourly cron run, so a fixed
configuration back-fills itself.
