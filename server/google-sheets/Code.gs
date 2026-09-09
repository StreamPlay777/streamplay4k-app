/**
 * StreamPlay4K → Google Sheets
 *
 * Paste this into a Google Apps Script bound to your orders spreadsheet, then
 * deploy it as a web app. The PHP endpoint posts each order here; this script
 * appends a row. Setup instructions are in server/google-sheets/README.md.
 *
 * WHY APPS SCRIPT AND NOT THE SHEETS API
 * The Sheets API needs a service account, a private key JSON on the server,
 * JWT signing and token refresh — three more things to hold correctly on a
 * shared host, and a key file that must never be web-readable. This runs
 * inside your own Google account, authorises itself, and the only credential
 * is a shared token you choose. For appending rows that is the whole job.
 *
 * THE SHEET IS A MIRROR, NOT THE RECORD. The PHP writes the order to disk
 * first and treats a failure here as a warning in the log. If this script is
 * broken, redeployed, or Google is having an outage, orders still complete.
 */

/** Must match 'sheets_token' in config.php. Change both together. */
const SHARED_TOKEN = 'CHANGE-ME-TO-A-LONG-RANDOM-STRING';

/** Tab name. Created with headers on first use. */
const SHEET_NAME = 'Orders';

const HEADERS = [
  'Order ID', 'Created (UTC)', 'Status', 'Plan', 'Months', 'Devices',
  'Total', 'Total (cents)', 'Phone', 'Email', 'Country', 'Source page',
  'Campaign', 'Paid at', 'Activated at', 'Notes',
];

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);

    // A web app deployed as "anyone with the link" is a public URL. The token
    // is what stops anyone who guesses or finds it from writing rows.
    if (body.token !== SHARED_TOKEN) {
      return json({ ok: false, error: 'bad token' });
    }

    const o = body.order || {};
    const sheet = getSheet();

    // An order posted twice — a retry, or the backfill script catching up —
    // must update its existing row, not append a duplicate. Orders are keyed
    // by id in column A.
    const existing = findRow(sheet, o.id);
    const row = [
      o.id || '',
      o.createdAt || '',
      o.status || 'new',
      o.planLabel || '',
      o.termMonths || '',
      o.devices || '',
      o.totalFormatted || '',
      o.totalCents || '',
      // A leading ' keeps Sheets from reading "+12125551234" as a formula and
      // showing #ERROR! where the phone number should be.
      o.phone ? "'" + o.phone : '',
      o.email || '',
      o.country || '',
      o.sourcePage || '',
      o.campaign || '',
      o.paidAt || '',
      o.activatedAt || '',
      o.notes || '',
    ];

    if (existing > 0) {
      sheet.getRange(existing, 1, 1, row.length).setValues([row]);
      return json({ ok: true, updated: true, row: existing });
    }
    sheet.appendRow(row);
    return json({ ok: true, appended: true, row: sheet.getLastRow() });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

/** Lets you open the deployment URL in a browser to confirm it is live. */
function doGet() {
  return json({ ok: true, service: 'StreamPlay4K orders', sheet: SHEET_NAME });
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function findRow(sheet, id) {
  if (!id) return 0;
  const last = sheet.getLastRow();
  if (last < 2) return 0;
  const ids = sheet.getRange(2, 1, last - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(id)) return i + 2;
  }
  return 0;
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
