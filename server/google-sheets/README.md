# Connect your orders to a Google Sheet

**About 6 minutes.** No API key, no downloads beyond the file already in this
folder.

`StreamPlay4K-orders.xlsx` is the finished sheet — columns, colours, the status
dropdown, conditional formatting and the summary formulas are all in the file.
The setup steps are also written on its first tab, so they are in front of you
when you need them.

---

## First — turn the file into a Google Sheet

Upload `StreamPlay4K-orders.xlsx` to [drive.google.com](https://drive.google.com),
open it, then:

**File → Save as Google Sheets**

A second file opens. Work in that one.

> An uploaded spreadsheet stays an *Excel* file until you do this, and Excel
> files have no **Extensions** menu — which is why Apps Script cannot be found
> before this step.

✅ **Check:** the menu bar now has an **Extensions** item.

---

## Step 1 — Paste the script

**Extensions → Apps Script.** A new tab opens with a code editor containing a
few lines of placeholder code.

1. Select all of it and delete it.
2. Open `Code.gs` from this folder, copy the whole file, paste it in.

---

## Step 2 — Set your token

Near the top of what you just pasted:

```js
const SHARED_TOKEN = 'CHANGE-ME-TO-A-LONG-RANDOM-STRING';
```

Replace the placeholder with a long random string. Generate one over SSH:

```bash
php -r 'echo bin2hex(random_bytes(24)), "\n";'
```

**Keep it somewhere for a moment** — the same string goes into `config.php` in
step 5.

Save: **⌘S** (Mac) or **Ctrl+S** (Windows).

---

## Step 3 — Give it permission

Press **▶ Run**. Google asks for permission the first time:

**Review permissions** → pick your account → it warns the app is unverified
(normal — you wrote it) → **Advanced** → **Go to (project name)** → **Allow**.

Go back to the spreadsheet tab and reload the page. A **StreamPlay4K** menu
appears in the menu bar.

> The formatting is already in the file, so there is nothing to build here.
> Running it once is how you grant permission — and **StreamPlay4K → Setup /
> repair formatting** is there if the colours or widths ever get knocked about.

---

## Step 4 — Publish it

**Deploy → New deployment.**

Click the **gear icon** next to "Select type" and choose **Web app**.

| Field | Value |
|---|---|
| Description | anything, e.g. `orders` |
| Execute as | **Me** |
| Who has access | **Anyone** |

**Deploy**, then copy the **Web app URL**. It ends in `/exec`.

> **"Anyone" does not mean anyone can read your sheet.** It means the URL
> accepts a request without a Google login — which is what lets your server
> post to it. The script only ever appends rows, never reads any back, and
> refuses every request that doesn't carry your token.

---

## Step 5 — Tell the site about it

In `public_html/api/config.php` on Hostinger:

```php
'sheets_url'   => 'https://script.google.com/macros/s/AKfy…/exec',
'sheets_token' => 'the same string from step 2',
```

---

## Step 6 — Test

Open the `/exec` URL in a browser. You should see:

```json
{"ok":true,"service":"StreamPlay4K orders","sheet":"Orders"}
```

Then place a test order on the site and watch a row appear.

---

## Using it day to day

Click any cell in an order's row, then use the **StreamPlay4K** menu:

| | |
|---|---|
| 📨 **Mark as invoice sent** | Row turns pale blue |
| ✅ **Mark as paid** | Row turns green, stamps today's date in **Paid** |
| 🚀 **Mark as activated** | Row turns blue, stamps **Activated** |
| ↩️ **Back to new** | Row turns amber, clears both dates |
| 🚫 **Mark as cancelled** | Row turns grey |
| 💸 **Mark as refunded** | Row turns orange |

Select several rows first and it marks all of them at once.

**This menu changes the sheet only.** It does not send anything and does not
reach the website. Sending an invoice, and every other action that touches a
customer, happens in the site's own admin at `/admin/` — which then updates
this sheet by itself. Use the menu here to correct the mirror, or when you are
in the sheet anyway and want to note something down.

The colour is on the **whole row**, not a chip in one column, so you can see
what still needs paying from across the room. The dates are stamped for you
because that is the half everyone forgets by hand — and every figure on the
**Summary** tab is built on those dates.

**Notes** is yours. Nothing ever overwrites it, including an order that
updates itself later.

---

## The twelve columns

`Order · Date · Status · Plan · Devices · Total · Email · Phone · Country ·
Paid · Activated · Notes`

Order references are short — **SP-1001**, **SP-1002** — because they get read
out on WhatsApp and typed into payment descriptions.

Dropped from the earlier version: term, months, total-in-cents, source page and
campaign. All true, none of them acted on, and a sheet you scroll sideways is a
sheet you stop opening. They are all still on your server and in `/admin/`.

Three kept against a shorter list, and why: **Total**, because a sheet without
the amount can't tell you what to invoice or what you're owed; **Phone**,
because messaging on WhatsApp is the thing this business does; **Date**,
because without it nothing sorts.

---

## Rules that keep it working

- Don't rename the **Orders** tab.
- Don't reorder or delete its columns — the script writes by position.
- Adding columns **to the right of Notes** is fine; the script never touches them.
- Sorting and filtering are fine; rows are matched by Order reference, not position.

Run **StreamPlay4K → Setup / repair formatting** any time the colours or widths
get knocked about. It repairs; it does not wipe your data.

---

## If rows stop appearing

Check `endpoint.log` in your orders folder — a failed push is logged with the
reason.

| What you see | What it means |
|---|---|
| `script said: bad token` | `SHARED_TOKEN` and `sheets_token` disagree |
| `http 302`, or an HTML body | The script was edited but not redeployed |
| Nothing logged at all | `sheets_url` is blank, so the mirror is off |

**The redeploy one catches everybody: editing the script does not change what
the URL serves.** Go to **Deploy → Manage deployments → pencil icon →
Version: New version → Deploy.**

Nothing is lost while it is broken. Orders are on your server first, and
anything that failed to reach the sheet is pushed on the next hourly cron run —
so a fixed configuration back-fills itself.
