/**
 * StreamPlay4K → Google Sheets
 *
 * Paste this into a Google Apps Script bound to a BLANK Google Sheet, run
 * Setup once, and deploy it as a web app. Step-by-step in README.md.
 *
 * WHY APPS SCRIPT AND NOT THE SHEETS API
 * The Sheets API needs a service account, a private key file on the server,
 * JWT signing and token refresh — four more things to hold correctly on a
 * shared host, and a key that must never become web-readable. This runs inside
 * your own Google account and authorises itself. The only credential is a
 * shared token you choose.
 *
 * THE SHEET IS A MIRROR, NOT THE RECORD. Orders are written to your server
 * first, outside the web root. If this script breaks, or a deployment is
 * edited without being republished, orders still complete and nothing is lost;
 * anything that failed to arrive is pushed by the hourly cron.
 */

/** Must match 'sheets_token' in config.php. Change both together. */
const SHARED_TOKEN = 'CHANGE-ME-TO-A-LONG-RANDOM-STRING';

const SHEET_NAME = 'Orders';

/**
 * Twelve columns, down from seventeen.
 *
 * Dropped: term, months, total-in-cents, source page, campaign. They were
 * true but nobody acts on them, and a sheet you have to scroll sideways is a
 * sheet you stop opening. Everything dropped is still on the server and in
 * /admin/ if it is ever needed.
 *
 * Kept against a shorter request: Date, Total and Phone. An orders sheet
 * without the amount cannot tell you what to invoice or what you are owed,
 * and without the phone you cannot do the thing this business actually does,
 * which is message the customer on WhatsApp.
 */
const HEADERS = [
  'Order', 'Date', 'Status', 'Plan', 'Devices', 'Total',
  'Email', 'Phone', 'Country', 'Paid', 'Activated', 'Notes',
];

const COL = {
  id: 1, date: 2, status: 3, plan: 4, devices: 5, total: 6,
  email: 7, phone: 8, country: 9, paid: 10, activated: 11, notes: 12,
};

const STATUSES = ['new', 'paid', 'activated', 'cancelled'];

/* ═══════════════════════════════════════════════════════════════════════
   THE MENU — this is what makes the sheet usable rather than just readable

   Select any cell in an order's row, then StreamPlay4K → Mark as paid. It
   stamps the date as well as the status, which is the half people forget when
   they type it by hand, and the half every "paid today" figure depends on.
   ═══════════════════════════════════════════════════════════════════════ */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('StreamPlay4K')
    .addItem('✅  Mark as paid', 'markPaid')
    .addItem('🚀  Mark as activated', 'markActivated')
    .addItem('↩️  Back to new', 'markNew')
    .addSeparator()
    .addItem('🚫  Mark as cancelled', 'markCancelled')
    .addSeparator()
    .addItem('⚙️  Setup / repair formatting', 'setup')
    .addToUi();
}

function markPaid()      { setStatus_('paid'); }
function markActivated() { setStatus_('activated'); }
function markNew()       { setStatus_('new'); }
function markCancelled() { setStatus_('cancelled'); }

function setStatus_(status) {
  const ui = SpreadsheetApp.getUi();
  const sheet = SpreadsheetApp.getActiveSheet();

  if (sheet.getName() !== SHEET_NAME) {
    ui.alert('Open the "' + SHEET_NAME + '" tab first, then select a row.');
    return;
  }

  // Whatever rows the selection touches, ignoring the header.
  const sel = sheet.getActiveRange();
  const first = Math.max(2, sel.getRow());
  const last = sel.getRow() + sel.getNumRows() - 1;
  if (last < 2) { ui.alert('Select an order row first.'); return; }

  const now = new Date();
  let changed = 0;

  for (let r = first; r <= last; r++) {
    if (!sheet.getRange(r, COL.id).getValue()) continue;   // blank row
    sheet.getRange(r, COL.status).setValue(status);

    // Stamp the dates the status implies. An activated account is a paid one,
    // so activating fills in a missing Paid date rather than leaving a gap
    // that makes the revenue total wrong.
    if (status === 'paid' || status === 'activated') {
      if (!sheet.getRange(r, COL.paid).getValue()) sheet.getRange(r, COL.paid).setValue(now);
    }
    if (status === 'activated') {
      if (!sheet.getRange(r, COL.activated).getValue()) sheet.getRange(r, COL.activated).setValue(now);
    }
    if (status === 'new') {
      sheet.getRange(r, COL.paid).clearContent();
      sheet.getRange(r, COL.activated).clearContent();
    }
    changed++;
  }

  SpreadsheetApp.getActiveSpreadsheet().toast(
    changed + (changed === 1 ? ' order' : ' orders') + ' marked ' + status + '.',
    'StreamPlay4K', 4
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   SETUP — run once. Safe to run again; it repairs rather than resets.
   ═══════════════════════════════════════════════════════════════════════ */

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ensureSheet_(ss);

  formatOrders_(sheet);
  buildSummary_(ss);
  tidyTabs_(ss);

  ss.toast('Ready. Deploy the web app next.', 'StreamPlay4K', 6);
  SpreadsheetApp.getUi().alert(
    'Setup complete.\n\n' +
    'Next: Deploy → New deployment → Web app.\n' +
    'Execute as: Me.  Who has access: Anyone.\n\n' +
    'Then paste the /exec URL into config.php on your server.'
  );
}

function ensureSheet_(ss) {
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    // A brand-new spreadsheet has one tab called Sheet1. Rename it rather
    // than leaving an empty tab beside the real one.
    const only = ss.getSheets();
    if (only.length === 1 && only[0].getLastRow() === 0) {
      sheet = only[0].setName(SHEET_NAME);
    } else {
      sheet = ss.insertSheet(SHEET_NAME, 0);
    }
  }
  return sheet;
}

function formatOrders_(sheet) {
  const WIDTHS = [92, 108, 104, 96, 78, 92, 210, 150, 78, 108, 108, 260];

  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sheet.setFrozenRows(1);
  sheet.setRowHeight(1, 34);

  sheet.getRange(1, 1, 1, HEADERS.length)
    .setBackground('#0B0E18')
    .setFontColor('#FFFFFF')
    .setFontSize(10)
    .setFontWeight('bold')
    .setVerticalAlignment('middle')
    .setHorizontalAlignment('left');

  WIDTHS.forEach((w, i) => sheet.setColumnWidth(i + 1, w));

  const rows = 500;
  const body = sheet.getRange(2, 1, rows, HEADERS.length);
  body.setFontSize(10).setVerticalAlignment('middle');
  sheet.setRowHeights(2, rows, 28);

  sheet.getRange(2, COL.date, rows, 1).setNumberFormat('dd mmm  hh:mm');
  sheet.getRange(2, COL.paid, rows, 1).setNumberFormat('dd mmm  hh:mm');
  sheet.getRange(2, COL.activated, rows, 1).setNumberFormat('dd mmm  hh:mm');
  sheet.getRange(2, COL.total, rows, 1).setNumberFormat('$#,##0.00').setFontWeight('bold');
  sheet.getRange(2, COL.devices, rows, 1).setHorizontalAlignment('center');
  sheet.getRange(2, COL.id, rows, 1).setFontFamily('Roboto Mono').setFontWeight('bold');
  sheet.getRange(2, COL.notes, rows, 1).setWrap(true);

  // Status is the one column typed into by hand, so it is a dropdown. Free
  // text lets "Paid", "paid " and "PAID" all exist, and every count that reads
  // the column is then quietly wrong.
  sheet.getRange(2, COL.status, rows, 1).setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(STATUSES, true)
      .setAllowInvalid(false)
      .build()
  );

  applyStatusColours_(sheet, rows);

  // Banding makes a wide row readable across; it is re-applied cleanly so
  // running Setup twice does not stack two bandings on the same range.
  sheet.getBandings().forEach((b) => b.remove());
  sheet.getRange(1, 1, rows + 1, HEADERS.length)
    .applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, true, false);

  const filter = sheet.getFilter();
  if (filter) filter.remove();
  sheet.getRange(1, 1, rows + 1, HEADERS.length).createFilter();

  if (sheet.getMaxColumns() > HEADERS.length) {
    sheet.deleteColumns(HEADERS.length + 1, sheet.getMaxColumns() - HEADERS.length);
  }
}

/**
 * Colour by status, applied to the WHOLE ROW rather than the status cell.
 *
 * A coloured chip in one column is decoration; a coloured row is something you
 * can read at arm's length. Scanning for what still needs paying is the single
 * most common thing anyone does with this sheet.
 */
function applyStatusColours_(sheet, rows) {
  const range = sheet.getRange(2, 1, rows, HEADERS.length);
  const rule = (formula, bg, fc) =>
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied(formula)
      .setBackground(bg)
      .setFontColor(fc)
      .setRanges([range])
      .build();

  sheet.setConditionalFormatRules([
    rule('=$C2="paid"',      '#E7F8EE', '#0F5132'),
    rule('=$C2="activated"', '#E8F1FE', '#0B3D91'),
    rule('=$C2="cancelled"', '#F2F3F5', '#8A8F9C'),
    rule('=$C2="new"',       '#FFF7E6', '#7A4E00'),
  ]);
}

/** Totals that keep themselves current. Formulas, not a snapshot. */
function buildSummary_(ss) {
  let sm = ss.getSheetByName('Summary');
  if (!sm) sm = ss.insertSheet('Summary', 1);
  sm.clear();

  const rows = [
    ['StreamPlay4K', ''],
    ['', ''],
    ['Paid revenue',      '=SUMIFS(Orders!F:F,Orders!C:C,"paid")+SUMIFS(Orders!F:F,Orders!C:C,"activated")'],
    ['Still to collect',  '=SUMIFS(Orders!F:F,Orders!C:C,"new")'],
    ['', ''],
    ['Orders',            '=COUNTA(Orders!A2:A)'],
    ['Awaiting payment',  '=COUNTIF(Orders!C:C,"new")'],
    ['Paid',              '=COUNTIF(Orders!C:C,"paid")+COUNTIF(Orders!C:C,"activated")'],
    ['Cancelled',         '=COUNTIF(Orders!C:C,"cancelled")'],
    ['', ''],
    ['By plan', ''],
    ['Basic — 3 months',     '=COUNTIF(Orders!D:D,"Basic")'],
    ['Standard — 6 months',  '=COUNTIF(Orders!D:D,"Standard")'],
    ['Premium — 12 months',  '=COUNTIF(Orders!D:D,"Premium")'],
  ];
  sm.getRange(1, 1, rows.length, 2).setValues(rows);

  sm.setColumnWidth(1, 230);
  sm.setColumnWidth(2, 150);
  sm.getRange('A1').setFontSize(18).setFontWeight('bold').setFontColor('#111114');
  sm.getRange('A11').setFontWeight('bold').setFontColor('#656A78');
  sm.getRange('B3:B4').setNumberFormat('$#,##0.00');
  sm.getRange('B1:B20').setFontWeight('bold').setFontSize(13).setHorizontalAlignment('right');
  sm.getRange('B3').setFontColor('#0F5132');
  sm.getRange('B4').setFontColor('#B45309');
  sm.getRange(1, 1, 20, 2).setVerticalAlignment('middle');
  sm.setRowHeights(1, 20, 26);
  sm.setHiddenGridlines(true);
}

function tidyTabs_(ss) {
  const orders = ss.getSheetByName(SHEET_NAME);
  const summary = ss.getSheetByName('Summary');
  if (orders) { orders.setTabColor('#FF2B20'); ss.setActiveSheet(orders); ss.moveActiveSheet(1); }
  if (summary) { summary.setTabColor('#8A8F9C'); ss.setActiveSheet(summary); ss.moveActiveSheet(2); }
  if (orders) ss.setActiveSheet(orders);
}

/* ═══════════════════════════════════════════════════════════════════════
   THE ENDPOINT
   ═══════════════════════════════════════════════════════════════════════ */

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);

    // A web app deployed as "anyone with the link" is a public URL. The token
    // is what stops whoever finds it from writing rows.
    if (body.token !== SHARED_TOKEN) return json({ ok: false, error: 'bad token' });

    const o = body.order || {};
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) { sheet = ensureSheet_(ss); formatOrders_(sheet); }

    const row = [
      o.id || '',
      o.createdAt ? new Date(o.createdAt) : new Date(),
      o.status || 'new',
      o.planTier || o.planLabel || '',
      o.devices || '',
      // A NUMBER, not "$149.99". Written as text the currency column looks
      // right and every SUMIF over it silently returns zero.
      (o.totalCents || 0) / 100,
      o.email || '',
      // The leading apostrophe stops Sheets reading +12125551234 as a formula
      // and showing #ERROR! where the phone number should be.
      o.phone ? "'" + o.phone : '',
      o.country || '',
      o.paidAt ? new Date(o.paidAt) : '',
      o.activatedAt ? new Date(o.activatedAt) : '',
      '',
    ];

    // An order posted twice — a retry, or the cron catching up — updates its
    // existing row rather than appending a duplicate.
    const existing = findRow_(sheet, o.id);
    if (existing > 0) {
      // Notes are yours. Never overwrite what you typed.
      row[COL.notes - 1] = sheet.getRange(existing, COL.notes).getValue();
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

function findRow_(sheet, id) {
  if (!id) return 0;
  const last = sheet.getLastRow();
  if (last < 2) return 0;
  const ids = sheet.getRange(2, COL.id, last - 1, 1).getValues();
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
