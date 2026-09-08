/**
 * The live channel catalogue: 46,758 channels, loaded on demand.
 *
 * The file is ~1.9 MB of JSON (about 310 KB over the wire once gzipped) and is
 * fetched at most once per page load, the first time somebody actually searches
 * or opens the full list. Nothing about it is bundled — importing this module
 * costs a few hundred bytes, and a visitor who never touches the search never
 * downloads it.
 *
 * Counts shown before it loads come from data/channelStats.ts, which IS bundled
 * and is only numbers.
 *
 * SHAPE
 * The file is dictionary-encoded: categories and regions appear once each and
 * rows reference them by index. That is what takes it from 15 MB to under 2.
 * `hydrate()` turns the arrays into objects once, and also builds the lowercase
 * search string per row a single time — doing it per keystroke would be 46,000
 * allocations for every letter typed.
 */

export interface CatalogueChannel {
  name: string;
  category: string;
  region: string;
  regionName: string;
  flag: string;
  flags: number;
  /** name + category, lowercased once at hydrate time. */
  hay: string;
}

export interface Region {
  code: string;
  name: string;
  flag: string;
  count: number;
}

export type Group = 'sports' | 'movies' | 'news' | 'entertainment' | 'kids' | 'uhd' | 'adult';

export interface Catalogue {
  generated: string;
  total: number;
  groups: Group[];
  regions: Region[];
  channels: CatalogueChannel[];
}

type RawRow = [string, number, number, number];
interface RawFile {
  v: number;
  generated: string;
  total: number;
  groups: Group[];
  regions: [string, string, string, number][];
  cats: string[];
  rows: RawRow[];
}

export const CATALOGUE_URL = '/data/channels.json';

let cache: Catalogue | null = null;
let inFlight: Promise<Catalogue> | null = null;

function hydrate(f: RawFile): Catalogue {
  const regions: Region[] = f.regions.map(([code, name, flag, count]) => ({ code, name, flag, count }));
  const channels: CatalogueChannel[] = new Array(f.rows.length);
  for (let i = 0; i < f.rows.length; i++) {
    const [name, ci, ri, flags] = f.rows[i];
    const category = f.cats[ci] ?? '';
    const r = regions[ri];
    channels[i] = {
      name,
      category,
      region: r?.code ?? '',
      regionName: r?.name ?? '',
      flag: r?.flag ?? '🌐',
      flags,
      hay: `${name} ${category}`.toLowerCase(),
    };
  }
  return { generated: f.generated, total: f.total, groups: f.groups, regions, channels };
}

/**
 * Fetch and hydrate, once. Concurrent callers share the same promise, so a
 * component that prefetches on focus and then searches does not fetch twice.
 */
export function loadCatalogue(signal?: AbortSignal): Promise<Catalogue> {
  if (cache) return Promise.resolve(cache);
  if (inFlight) return inFlight;
  inFlight = fetch(CATALOGUE_URL, { signal })
    .then((r) => {
      if (!r.ok) throw new Error(`catalogue: HTTP ${r.status}`);
      return r.json() as Promise<RawFile>;
    })
    .then((f) => { cache = hydrate(f); return cache; })
    .catch((e) => { inFlight = null; throw e; });
  return inFlight;
}

/** What is already in memory, if anything. Never triggers a fetch. */
export function peekCatalogue(): Catalogue | null {
  return cache;
}

export const GROUP_LABELS: Record<Group, string> = {
  sports: 'Sports',
  movies: 'Movies',
  news: 'News',
  entertainment: 'Entertainment',
  kids: 'Kids',
  uhd: '4K & UHD',
  adult: 'Adult',
};

const groupBit = (c: Catalogue, g: Group) => 1 << c.groups.indexOf(g);

/** Adult channels are hidden unless explicitly asked for, as on the channels page. */
export function isAdult(c: Catalogue, ch: CatalogueChannel): boolean {
  return (ch.flags & groupBit(c, 'adult')) !== 0;
}

export interface Query {
  text?: string;
  group?: Group | null;
  region?: string | null;
  includeAdult?: boolean;
  /** Cap on returned rows. The count of matches is reported separately. */
  limit?: number;
}

export interface Result {
  channels: CatalogueChannel[];
  /** How many matched in total, before the limit. */
  matched: number;
}

/**
 * Filter the catalogue.
 *
 * US first, because this is a US-market site and an American visitor searching
 * "sports" should not have to scroll past fourteen other countries to find
 * theirs. Within that, original catalogue order is preserved — it groups
 * related channels together, and re-sorting alphabetically would scatter them.
 */
export function queryCatalogue(c: Catalogue, q: Query): Result {
  const text = (q.text ?? '').trim().toLowerCase();
  const limit = q.limit ?? 300;
  const gBit = q.group ? groupBit(c, q.group) : 0;
  const aBit = groupBit(c, 'adult');
  const wantAdult = q.includeAdult === true || q.group === 'adult';

  const us: CatalogueChannel[] = [];
  const rest: CatalogueChannel[] = [];
  let matched = 0;

  for (const ch of c.channels) {
    if (!wantAdult && (ch.flags & aBit) !== 0) continue;
    if (gBit && (ch.flags & gBit) === 0) continue;
    if (q.region && ch.region !== q.region) continue;
    if (text && !ch.hay.includes(text)) continue;

    matched++;
    // Each bucket fills to `limit` independently. Capping the PAIR instead
    // would mean that when the first few hundred matches happen to be
    // non-US, the buckets fill up and every US channel further down the
    // catalogue is discarded — which is precisely the case US-first exists
    // to handle. Counting continues past both caps so "Showing 300 of 4,812"
    // stays truthful.
    if (ch.region === 'US') {
      if (us.length < limit) us.push(ch);
    } else if (rest.length < limit) {
      rest.push(ch);
    }
  }

  return { channels: [...us, ...rest].slice(0, limit), matched };
}
