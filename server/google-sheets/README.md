# Connect your orders to a Google Sheet

**About 6 minutes.** No API key, no downloads, no Excel file. You start with a
blank Google Sheet and the script builds everything else.

> Ignore any earlier `.xlsx` file. Uploading a spreadsheet to Drive leaves it as
> an *Excel* file, and Excel files have no **Extensions** menu — which is why
> Apps Script was nowhere to be found. Starting from a blank Google Sheet
> avoids that entirely.

---

## Step 1 — Make a blank sheet

Go to **[sheets.new](https://sheets.new)**

That's it. A new, empty Google Sheet opens. Give it a name in the top-left —
*StreamPlay4K orders*.

✅ Check: the menu bar reads **File Edit View Insert Format Data Tools
Extensions Help**. If you can see **Extensions**, you are on a real Google
Sheet and everything below will work.

---

## Step 2 — Paste the script

**Extensions → Apps Script.** A new tab opens with a code editor containing a
few lines of placeholder code.

1. Select all of it and delete it.
2. Open `Code.gs` from this folder, copy the whole file, paste it in.

---

## Step 3 — Set your token

Near the top of what you just pasted:

```js
const SHARED_TOKEN = 'CHANGE-ME-TO-A-LONG-RANDOM-STRING';
```

Replace the placeholder with a long random string. Generate one over SSH:

```bash
php -r 'echo bin2hex(random_bytes(24)), "\n";'
```

**Keep it somewhere for a moment** — the same string goes into `config.php` in
step 6.

Save: **⌘S** (Mac) or **Ctrl+S** (Windows).

---

## Step 4 — Run Setup once

Still in the Apps Script editor:

1. In the toolbar there is a function dropdown — it probably says `onOpen`.
   Change it to **`setup`**.
2. Click **▶ Run**.
3. Google asks for permission the first time. **Review permissions** → pick
   your account → it warns the app is unverified (expected, you wrote it) →
   **Advanced** → **Go to (project name)** → **Allow**.

Go back to your spreadsheet tab and reload the page. You now have:

- an **Orders** tab, formatted, with a red tab colour
- a **Summary** tab with revenue and per-plan totals
- a **StreamPlay4K** menu in the menu bar

---

## Step 5 — Publish it

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

## Step 6 — Tell the site about it

In `public_html/api/config.php` on Hostinger:

```php
'sheets_url'   => 'https://script.google.com/macros/s/AKfy…/exec',
'sheets_token' => 'the same string from step 3',
```

---

## Step 7 — Test

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
| ✅ **Mark as paid** | Row turns green, stamps today's date in **Paid** |
| 🚀 **Mark as activated** | Row turns blue, stamps **Activated** |
| ↩️ **Back to new** | Row turns amber, clears both dates |
| 🚫 **Mark as cancelled** | Row turns grey |

Select several rows first and it marks all of them at once.

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
