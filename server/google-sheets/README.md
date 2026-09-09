# Your orders, in a Google Sheet

Two parts: **make the sheet** (2 minutes, and the file is already made for you)
and **connect it** (3 minutes). No API key, no service account, nothing to
download from Google.

---

## Part 1 — Make the sheet

You do not have to build it. `StreamPlay4K-orders.xlsx` in this folder is the
finished thing: three tabs, the right columns in the right order, a status
dropdown, and a Summary tab whose totals update themselves.

1. Open [drive.google.com](https://drive.google.com).
2. Drag `StreamPlay4K-orders.xlsx` onto the page. It uploads.
3. Double-click it → **Open with → Google Sheets**.
4. **File → Save as Google Sheets.** (Drive keeps `.xlsx` files as Excel until
   you do this. The Apps Script in Part 2 only works on a real Google Sheet.)

You now have three tabs:

| Tab | What it is |
|---|---|
| **Read me** | The rules, so a month from now you remember them |
| **Orders** | Where every order lands. One row each |
| **Summary** | Totals and a per-plan count. Formulas, always current |

> Do not rename the **Orders** tab or reorder its columns — the script writes
> by tab name and column position. Adding columns to the right of **Notes** is
> safe; the script never touches them.

---

## Part 2 — Connect it to the site

**1.** In your sheet: **Extensions → Apps Script**. Delete whatever is in the
editor and paste the whole of `Code.gs` from this folder.

**2.** Near the top, replace the placeholder:

```js
const SHARED_TOKEN = 'CHANGE-ME-TO-A-LONG-RANDOM-STRING';
```

Generate one over SSH and paste the output in place of the placeholder text:

```bash
php -r 'echo bin2hex(random_bytes(24)), "\n";'
```

Save (**⌘S** / **Ctrl+S**).

**3.** **Deploy → New deployment** → the gear icon → **Web app**.

| Field | Value |
|---|---|
| Execute as | **Me** |
| Who has access | **Anyone** |

Deploy, and grant the permissions Google asks for. It warns that the app is
unverified — expected for a script you wrote yourself. **Advanced → Go to
(project name) → Allow.**

> **"Anyone" does not mean anyone can read your sheet.** It means the URL
> accepts a request without a Google login, which is what lets your server post
> to it. The script only appends rows, never reads any back, and refuses every
> request that does not carry your token.

**4.** Copy the deployment URL. It ends in `/exec`.

**5.** Put both values into `public_html/api/config.php`:

```php
'sheets_url'   => 'https://script.google.com/macros/s/AKfy…/exec',
'sheets_token' => 'the same string you pasted in step 2',
```

**6.** Check it. Open the `/exec` URL in a browser — you should see
`{"ok":true,"service":"StreamPlay4K orders"}`. Then place a test order on the
site and watch a row appear.

---

## What lands in each row

Order ID · Created · Status · **Plan** (Basic / Standard / Premium) · Term ·
Months · Devices · Total · Total in cents · Phone · Email · Country ·
Source page · Campaign · Paid at · Activated at · Notes

Rows **update in place** rather than duplicating, so an order you later mark
paid changes the row it already has. Matching is by Order ID, so sorting and
filtering the sheet is safe.

Phone numbers are written with a leading apostrophe. Without it Sheets reads
`+12125551234` as a formula and shows `#ERROR!` where the number should be.

**The sheet is a copy, not the record.** Every order is written to your server
first, outside the web root. If the sheet is deleted, or Google has a bad hour,
nothing is lost and the shop keeps working — anything that failed to reach the
sheet is queued and pushed by the hourly cron.

---

## If rows stop appearing

Look in `endpoint.log` in your orders folder; a failed push is logged with the
reason.

| What you see | What it means |
|---|---|
| `script said: bad token` | `SHARED_TOKEN` and `sheets_token` disagree |
| `http 302`, or an HTML body | The script was edited but not redeployed |
| Nothing logged at all | `sheets_url` is blank, so the mirror is off |

The redeploy one catches everybody: **editing the script does not change what
the URL serves.** Go to **Deploy → Manage deployments → pencil icon → Version:
New version → Deploy.**

Anything queued goes out on the next hourly cron run, so a fixed configuration
back-fills itself.
