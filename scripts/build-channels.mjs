/**
 * Turns a raw IPTV panel export into the catalogue the site ships.
 *
 *   node scripts/build-channels.mjs <path-to-panel-export.json>
 *
 * The raw export is ~15 MB of panel bookkeeping. This produces a compact,
 * dictionary-encoded file at public/data/channels.json — about 1.8 MB, ~310 KB
 * over the wire once the server gzips it — plus src/data/channelStats.ts, which
 * carries only the counts, is tiny, and is bundled so the homepage can show
 * figures without downloading anything.
 *
 * WHAT IT DELIBERATELY DROPS, and why
 *
 *   stream_id   An internal identifier from your panel. Nothing in the UI needs
 *               it, and 46,000 of them published on a public page is an
 *               unnecessary gift to anyone trying to reconstruct stream URLs.
 *
 *   logo        Every logo URL in the export points at somebody else's server —
 *               43,750 at icon-tmdb.me, the rest at picon hosts and two bare IP
 *               addresses. Three separate problems: 76% are plain http://, so a
 *               browser on our https site blocks them as mixed content and they
 *               cannot render at all; hotlinking them makes every visitor's
 *               browser announce itself to those hosts, which contradicts the
 *               Cookie Policy's promise that nothing third-party is loaded; and
 *               they are not ours to serve. The grid uses the initials mark the
 *               site already draws. To show real artwork, self-host the images
 *               and add a `logo` field pointing at our own domain.
 *
 *   country/    Empty in every one of the 47,721 rows of the export, so the
 *   countryCode field is useless. The region is really in the category prefix
 *               ("US| SPORTS"), which is what this script reads instead.
 *
 *   separators  963 rows are panel section markers like "##### ALBANIA #####"
 *               rather than channels. They are not viewable and are dropped.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const src = process.argv[2];
if (!src) {
  console.error('usage: node scripts/build-channels.mjs <panel-export.json>');
  process.exit(1);
}

/* ── Region prefixes ──────────────────────────────────────────────────────
   The export's prefixes are a mix of ISO-ish codes and the panel's own
   groupings (ASIA, AFR, EXYU, 8K). Anything unlisted still ships — it keeps
   its prefix as the label — so a new region appearing in a future export is
   never silently dropped. */
const REGIONS = {
  US: ['United States', '🇺🇸'], UK: ['United Kingdom', '🇬🇧'], CA: ['Canada', '🇨🇦'],
  AR: ['Arabic', '🌍'], DE: ['Germany', '🇩🇪'], FR: ['France', '🇫🇷'],
  ES: ['Spain', '🇪🇸'], IT: ['Italy', '🇮🇹'], NL: ['Netherlands', '🇳🇱'],
  SE: ['Sweden', '🇸🇪'], NO: ['Norway', '🇳🇴'], DK: ['Denmark', '🇩🇰'],
  FI: ['Finland', '🇫🇮'], PT: ['Portugal', '🇵🇹'], PL: ['Poland', '🇵🇱'],
  BR: ['Brazil', '🇧🇷'], MX: ['Mexico', '🇲🇽'], TR: ['Türkiye', '🇹🇷'],
  GR: ['Greece', '🇬🇷'], AL: ['Albania', '🇦🇱'], RU: ['Russia', '🇷🇺'],
  IL: ['Israel', '🇮🇱'], IR: ['Iran', '🇮🇷'], AU: ['Australia', '🇦🇺'],
  NZ: ['New Zealand', '🇳🇿'], IE: ['Ireland', '🇮🇪'], AT: ['Austria', '🇦🇹'],
  BE: ['Belgium', '🇧🇪'], CH: ['Switzerland', '🇨🇭'], CZ: ['Czechia', '🇨🇿'],
  HU: ['Hungary', '🇭🇺'], RO: ['Romania', '🇷🇴'], BG: ['Bulgaria', '🇧🇬'],
  HR: ['Croatia', '🇭🇷'], SI: ['Slovenia', '🇸🇮'], MK: ['North Macedonia', '🇲🇰'],
  LT: ['Lithuania', '🇱🇹'], IS: ['Iceland', '🇮🇸'], CY: ['Cyprus', '🇨🇾'],
  MA: ['Morocco', '🇲🇦'], TN: ['Tunisia', '🇹🇳'], PH: ['Philippines', '🇵🇭'],
  TH: ['Thailand', '🇹🇭'], ID: ['Indonesia', '🇮🇩'], IN: ['India', '🇮🇳'],
  JP: ['Japan', '🇯🇵'], HK: ['Hong Kong', '🇭🇰'], SG: ['Singapore', '🇸🇬'],
  KZ: ['Kazakhstan', '🇰🇿'], AZ: ['Azerbaijan', '🇦🇿'], AM: ['Armenia', '🇦🇲'],
  GE: ['Georgia', '🇬🇪'], UZ: ['Uzbekistan', '🇺🇿'], VE: ['Venezuela', '🇻🇪'],
  BO: ['Bolivia', '🇧🇴'], CR: ['Costa Rica', '🇨🇷'], CG: ['Congo', '🇨🇬'],
  BH: ['Bahrain', '🇧🇭'], KU: ['Kurdish', '🌍'], SR: ['Serbia', '🇷🇸'],
  ASIA: ['Asia', '🌏'], AFR: ['Africa', '🌍'], LA: ['Latin America', '🌎'],
  EXYU: ['Ex-Yugoslavia', '🌍'], '4K': ['4K & UHD', '✨'], '8K': ['8K & UHD', '✨'],
};

/* ── Group keywords ────────────────────────────────────────────────────────
   Matched against "name + category", lowercased, at BUILD time and stored as a
   bitmask. Doing it here rather than in the browser is the difference between
   one pass over 46,000 rows now and seven regular expressions across 46,000
   rows on every keystroke. */
const GROUPS = [
  ['sports', ['sport', 'football', 'soccer', 'nfl', 'nba', 'mlb', 'nhl', 'tennis', 'golf',
              'racing', 'cricket', 'rugby', 'boxing', 'wrestling', 'ufc', 'espn', 'fox sport',
              'bein', 'dazn', 'motogp', 'formula']],
  ['movies', ['movie', 'cinema', 'film', 'hbo', 'starz', 'showtime', '24/7', 'cine']],
  ['news', ['news', 'cnn', 'fox news', 'msnbc', 'cnbc', 'bbc news', 'al jazeera', 'sky news']],
  ['entertainment', ['entertainment', 'comedy', 'drama', 'reality', 'mtv', 'bravo', 'tlc',
                     'lifetime', 'hallmark', 'nickelodeon', 'bet ', 'general']],
  ['kids', ['kid', 'child', 'cartoon', 'disney', 'nick', 'baby', 'junior', 'toon', 'boomerang']],
  ['uhd', ['4k', 'uhd', '8k', '3840', 'fhd']],
  ['adult', ['adult', 'xxx', 'porn', 'erotic']],
];

const SEPARATOR = /[#*=]{2,}|^[\s\-_.]{3,}$/;

/* ── Display cleaning ──────────────────────────────────────────────────────
   Panel exports carry bookkeeping in the channel name: a source prefix
   ("GO: ESPN", "SLING: TNT"), and decorations spelled in Unicode modifier
   letters and superscripts — ᴿᴬᵂ for RAW, ⁶⁰ᶠᵖˢ for 60fps, ᵁᴴᴰ ³⁸⁴⁰ᴾ for UHD.
   None of it means anything to a customer and all of it looks like a rendering
   fault on a marketing page.

   The decorations are removed BY UNICODE RANGE, not by "strip non-ASCII".
   17,332 names contain non-ASCII characters and a great many of them are
   Arabic, Greek or Cyrillic channel names — real content that must survive.
   Only the modifier-letter, superscript and dingbat blocks are dropped. */
// \u00B2\u00B3\u00B9 are ² ³ ¹ — superscripts that live in Latin-1, well away
// from the U+2070 superscript block, and are the ones the panel actually uses
// in "³⁸⁴⁰ᴾ". Missing them leaves a stray ³ on several thousand names.
const DECORATION = /[\u00B2\u00B3\u00B9\u02B0-\u02FF\u1D2C-\u1DBF\u2070-\u209F\u2100-\u214F\u2190-\u21FF\u2600-\u27BF\uFE0F]/g;

/* Leading "XX:" markers that name the source or repeat the region we already
   display. "24/7" is kept deliberately — it tells you the channel is a
   round-the-clock loop of one show rather than a live feed, which is a real
   distinction a viewer wants. */
const DROP_PREFIX = new Set([
  'GO', 'PRIME', 'SLING', 'VIP', 'RK', 'DIRECTV', 'DIREC TV', 'FUBO', 'HULU',
  'YTTV', 'PPV', 'RAW', 'BK', 'PLEX', 'TS',
]);

function clean(value, { dropRegionPrefix = true } = {}) {
  let out = String(value ?? '').replace(DECORATION, ' ');

  // A leading marker, possibly with the region code attached ("AR 4K:").
  const m = out.match(/^([A-Za-z0-9/ +.-]{1,14}):\s*/);
  if (m) {
    const head = m[1].trim().toUpperCase();
    // Digits allowed: the prefix is often a quality marker like "4K" or "8K".
    const isRegion = dropRegionPrefix && /^[A-Z0-9]{2,5}( ?(4K|8K|HD|FHD|UHD))?$/.test(head);
    if (DROP_PREFIX.has(head) || isRegion) out = out.slice(m[0].length);
  }

  return out
    .replace(/\(\s*\)/g, ' ')            // parens emptied by the decoration strip
    .replace(/\s*\([A-Z]{1,2}\)\s*$/i, ' ') // trailing panel markers: "(D)", "(BK)"
    .replace(/\s*\|\s*/g, ' · ')         // the panel's own separator
    .replace(/[\s\u00A0]+/g, ' ')
    .replace(/^[\s·:.\-—/]+|[\s·:.\-—/]+$/g, '')
    .trim();
}

const raw = JSON.parse(readFileSync(src, 'utf8'));
if (!Array.isArray(raw)) throw new Error('expected the export to be an array');

const cats = new Map();      // category string -> index
const regions = new Map();   // prefix -> { name, flag, count }
const rows = [];
let dropped = 0;

for (const item of raw) {
  const name = String(item?.name ?? '').trim();
  if (!name || SEPARATOR.test(name)) { dropped++; continue; }

  const category = String(item?.category ?? '').trim();
  const prefix = (category.split('|')[0] || '').trim().toUpperCase();

  // The region prefix stays on the category only long enough to read it; the
  // displayed label drops it, because the region is already its own column.
  const label = clean(name);
  const catLabel = clean(category.split('|').slice(1).join('|') || category, { dropRegionPrefix: false });
  if (!label) { dropped++; continue; }

  if (!regions.has(prefix)) {
    const known = REGIONS[prefix];
    regions.set(prefix, { name: known?.[0] ?? (prefix || 'Other'), flag: known?.[1] ?? '🌐', count: 0 });
  }
  regions.get(prefix).count++;

  if (!cats.has(catLabel)) cats.set(catLabel, cats.size);

  // Search runs against what is DISPLAYED. Indexing the raw string instead
  // would make "raw" and "fps" match thousands of channels whose names show
  // no such word, which reads as a broken search.
  const hay = `${label} ${catLabel}`.toLowerCase();
  let flags = 0;
  GROUPS.forEach(([, words], i) => { if (words.some((w) => hay.includes(w))) flags |= 1 << i; });

  rows.push([label, cats.get(catLabel), prefix, flags]);
}

// Regions in descending size, so the busiest are the first chips offered.
const regionList = [...regions.entries()]
  .sort((a, b) => b[1].count - a[1].count)
  .map(([code, r]) => [code, r.name, r.flag, r.count]);
const regionIndex = new Map(regionList.map(([code], i) => [code, i]));

const out = {
  v: 1,
  generated: new Date().toISOString().slice(0, 10),
  total: rows.length,
  groups: GROUPS.map(([g]) => g),
  regions: regionList,
  cats: [...cats.keys()],
  // [name, categoryIndex, regionIndex, groupFlags]
  rows: rows.map(([n, c, p, f]) => [n, c, regionIndex.get(p), f]),
};

mkdirSync(resolve(root, 'public/data'), { recursive: true });
const json = JSON.stringify(out);
writeFileSync(resolve(root, 'public/data/channels.json'), json);

const counts = Object.fromEntries(GROUPS.map(([g], i) => [g, rows.filter((r) => r[3] & (1 << i)).length]));

/* ── Bundled preview ───────────────────────────────────────────────────────
   The first 240 US channels, bundled rather than fetched.

   The catalogue itself loads in the browser, which means the pre-rendered HTML
   for /channels/ would otherwise contain no channel names at all — and that is
   the one page whose job is to rank for people searching whether a service
   carries a given channel. The page used to ship 280 names in its static HTML;
   this keeps real names in the markup, gives the page something to paint before
   the fetch lands, and is replaced by live results the moment it does. */
const adultBit = 1 << GROUPS.findIndex(([g]) => g === 'adult');
const catNames = [...cats.keys()];

/* Live channels only. Catalogue order puts the "24/7:" blocks first, and 240
   rows of round-the-clock reruns of one show is the least useful thing this
   page could put in front of a search engine — or a visitor. What earns its
   place here is the recognisable live line-up: ESPN, CNN, the regional sports
   networks. */
const isLoop = (name, category) => /^24\/7\b/i.test(name) || /\b24\/7\b/i.test(category);
const preview = rows
  .filter(([name, ci, region, flags]) =>
    region === 'US' && !(flags & adultBit) && !isLoop(name, catNames[ci]))
  .slice(0, 240)
  .map(([name, ci]) => [name, catNames[ci]]);

writeFileSync(resolve(root, 'src/data/channelStats.ts'), `/**
 * Catalogue figures — GENERATED by scripts/build-channels.mjs. Do not edit.
 *
 * Counts only. They are bundled so the homepage and the channels page can show
 * real totals without downloading the 1.8 MB catalogue, which loads lazily and
 * only when someone actually searches or opens the full list.
 */

export const channelStats = {
  generated: '${out.generated}',
  total: ${out.total},
  regions: ${regionList.length},
  groups: ${JSON.stringify(counts)},
  /** Largest regions first: [code, name, flag, count]. */
  topRegions: ${JSON.stringify(regionList.slice(0, 12))},
} as const;

/**
 * A slice of the catalogue, bundled so /channels/ has real channel names in
 * its pre-rendered HTML and something to paint before the full list arrives.
 * [name, category] — all United States, no adult channels.
 */
export const channelPreview: readonly (readonly [string, string])[] = ${JSON.stringify(preview)};
`);

const mb = (n) => `${(n / 1e6).toFixed(2)} MB`;
console.log(`channels: ${rows.length} kept, ${dropped} separator rows dropped`);
console.log(`regions:  ${regionList.length}   categories: ${cats.size}`);
console.log(`groups:   ${Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(', ')}`);
console.log(`written:  public/data/channels.json  ${mb(json.length)}`);
console.log(`written:  src/data/channelStats.ts`);
