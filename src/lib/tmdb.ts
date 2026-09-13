import type { Title } from '../data/vod';

/**
 * TMDB film and series feed — United States.
 *
 * What this fetches, in two flavours:
 *   'best'    recent releases, highest-rated first
 *   'popular' what US audiences are actually watching right now
 *
 * Both are region-locked to the US, because this site sells to the US and a
 * global list is a different list: it surfaces releases that never reached
 * American screens and buries ones that did.
 *
 * ON "MOST SEARCHED". TMDB has no Google-search data and neither do we, so
 * 'popular' uses TMDB's own US popularity ranking. It is the closest honest
 * proxy. Their /trending endpoint sounds like a better fit but takes no region
 * parameter — it is worldwide — which is why it is not used here.
 *
 * Capped at 10 titles per rail to keep the page light.
 *
 * Sorting note: TMDB's own /top_rated list lets a title with a few hundred
 * votes outrank a classic with thirty thousand, so its first page comes back
 * full of obscure releases. We use /discover with a vote-count floor instead.
 * The floor is lower here than it would be for all-time lists, because a film
 * released this year has had less time to accumulate votes.
 *
 * Attribution required by TMDB's terms — rendered in the UI:
 * "This product uses the TMDB API but is not endorsed or certified by TMDB."
 *
 * The key is read from VITE_TMDB_KEY and is never committed. Note that any key
 * used from the browser is visible to visitors; TMDB expects this for v3 keys
 * and rate-limits per key rather than treating them as secret.
 */

const KEY = import.meta.env.VITE_TMDB_KEY as string | undefined;
const BASE = 'https://api.themoviedb.org/3';
const IMG = 'https://image.tmdb.org/t/p';

/** Every request is scoped to this market. See the note on regions above. */
const REGION = 'US';
const LANG = 'en-US';

export const TMDB_ENABLED = Boolean(KEY);

// A missing key is a silent failure otherwise: the section quietly serves the
// bundled list and looks like TMDB simply returned nothing. Say so plainly,
// because the usual cause is a deploy host that has not been given the
// variable — it lives in .env locally, which is never committed.
if (!KEY && typeof console !== 'undefined') {
  console.info(
    '[tmdb] VITE_TMDB_KEY is not set, so the bundled title list is being used. ' +
    'Add it to your hosting provider\'s environment variables and redeploy to show live titles.',
  );
}
export const TMDB_ATTRIBUTION =
  'This product uses the TMDB API but is not endorsed or certified by TMDB.';

/** w342 is the smallest TMDB size that still looks sharp on a 160px card at 2x. */
export function poster(path: string | null, size: 'w185' | 'w342' = 'w342'): string | null {
  return path ? `${IMG}/${size}${path}` : null;
}

// TMDB genre ids are stable; mapping them locally avoids a second request.
const MOVIE_GENRES: Record<number, string> = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
  99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
  27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance',
  878: 'Sci-fi', 10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western',
};
const TV_GENRES: Record<number, string> = {
  10759: 'Action', 16: 'Animation', 35: 'Comedy', 80: 'Crime', 99: 'Documentary',
  18: 'Drama', 10751: 'Family', 10762: 'Kids', 9648: 'Mystery', 10763: 'News',
  10764: 'Reality', 10765: 'Sci-fi', 10766: 'Soap', 10767: 'Talk',
  10768: 'War', 37: 'Western',
};

interface TmdbItem {
  id: number;
  title?: string;          // films
  name?: string;           // series
  release_date?: string;
  first_air_date?: string;
  poster_path: string | null;
  genre_ids: number[];
  vote_average: number;
  vote_count: number;
}

function toTitle(item: TmdbItem, kind: 'movie' | 'tv'): Title | null {
  const name = item.title ?? item.name;
  const date = item.release_date ?? item.first_air_date;
  if (!name || !item.poster_path) return null;

  const genres = kind === 'movie' ? MOVIE_GENRES : TV_GENRES;
  return {
    name,
    year: date ? Number(date.slice(0, 4)) : 0,
    genre: genres[item.genre_ids?.[0]] ?? (kind === 'movie' ? 'Film' : 'Series'),
    badge: item.vote_average >= 8.4 ? 'Top rated' : undefined,
    poster: poster(item.poster_path) ?? undefined,
  };
}

/** Cached for the browsing session so a page change does not re-request. */
const CACHE_KEY = (kind: string, mode: string) => `sp4k:tmdb:${mode}:${kind}`;

function readCache(kind: string, mode: string): Title[] | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY(kind, mode));
    return raw ? (JSON.parse(raw) as Title[]) : null;
  } catch {
    return null;
  }
}

function writeCache(kind: string, mode: string, titles: Title[]): void {
  try { sessionStorage.setItem(CACHE_KEY(kind, mode), JSON.stringify(titles)); } catch { /* private mode */ }
}

/** How far back counts as "new". */
const MONTHS_BACK = 24;

/**
 * Enough votes to be a real release rather than an unknown, but reachable for
 * something out in the last two years.
 *
 * Without a floor, TMDB's rating sort hands back films with eleven votes and a
 * perfect score. The floor is what makes "best rated" mean anything.
 */
const MIN_VOTES = 400;

function sinceDate(): string {
  const d = new Date();
  d.setMonth(d.getMonth() - MONTHS_BACK);
  return d.toISOString().slice(0, 10);
}

export type Mode = 'best' | 'popular';

function endpoint(mode: Mode, kind: 'movie' | 'tv'): string {
  const p = new URLSearchParams({
    api_key: KEY as string,
    include_adult: 'false',
    language: LANG,
    region: REGION,
    page: '1',
  });

  if (mode === 'popular') {
    // /movie/popular and /tv/popular honour `region`; /trending does not.
    return `${BASE}/${kind}/popular?${p}`;
  }

  p.set('sort_by', 'vote_average.desc');
  p.set('vote_count.gte', String(MIN_VOTES));
  p.set('with_original_language', 'en');
  // Films and series use different date fields for the same idea.
  p.set(kind === 'movie' ? 'primary_release_date.gte' : 'first_air_date.gte', sinceDate());
  return `${BASE}/discover/${kind}?${p}`;
}

/**
 * US films or series, either best-rated-recent or currently-popular.
 *
 * Returns null on ANY failure — no key, offline, rate-limited, blocked by an
 * extension, empty result — so the caller keeps its bundled list rather than
 * rendering an empty rail. A missing poster is dropped rather than shown as a
 * gap, which is why the result can be shorter than `limit`.
 */
export async function fetchTitles(mode: Mode, kind: 'movie' | 'tv', limit = 10): Promise<Title[] | null> {
  if (!KEY) return null;

  const cached = readCache(kind, mode);
  if (cached?.length) return cached.slice(0, limit);

  try {
    const res = await fetch(endpoint(mode, kind));
    if (!res.ok) return null;
    const data = (await res.json()) as { results?: TmdbItem[] };
    const titles = (data.results ?? [])
      .map((i) => toTitle(i, kind))
      .filter((t): t is Title => t !== null)
      .slice(0, limit);
    if (!titles.length) return null;
    writeCache(kind, mode, titles);
    return titles;
  } catch {
    return null;
  }
}
