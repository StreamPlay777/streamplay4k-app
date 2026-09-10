/**
 * On-demand library.
 *
 * ARTWORK — titles, years, genres and ratings are factual metadata and safe to
 * ship. Poster IMAGES are not included: they are licensed artwork and must not
 * be hotlinked or scraped. `posterUrl()` below is the single swap point.
 *
 * Two legitimate sources, pick one:
 *   1. TMDB — free, permits poster use with attribution. Register for an API key,
 *      look titles up by `tmdbId`, and build the URL from their image base.
 *      Attribution required: "This product uses the TMDB API but is not
 *      endorsed or certified by TMDB."
 *   2. Your own pack — the artwork your IPTV provider supplies with the VOD
 *      catalogue, served from your CDN. Set VITE_POSTER_BASE to its root.
 *
 * Until one is configured, cards fall back to the striped placeholder — which
 * is honest rather than broken.
 */

export interface Title {
  name: string;
  year: number;
  genre: string;
  /** Editorial badge shown on the card corner. */
  badge?: string;
  /** Poster filename or TMDB path, resolved by posterUrl(). */
  poster?: string;
}

const POSTER_BASE = import.meta.env.VITE_POSTER_BASE ?? '';

/**
 * Returns a usable poster URL, or null to render the placeholder instead.
 *
 * `poster` arrives in one of two shapes: a complete URL (TMDB builds these
 * itself), or a bare filename from your own artwork pack. Absolute URLs are
 * passed straight through — an earlier version required VITE_POSTER_BASE for
 * every case, which silently discarded every TMDB poster and left the whole
 * rail showing placeholders.
 */
export function posterUrl(title: Title): string | null {
  if (!title.poster) return null;
  if (/^https?:\/\//i.test(title.poster)) return title.poster;
  if (!POSTER_BASE) return null;
  return `${POSTER_BASE.replace(/\/$/, '')}/${title.poster}`;
}

/** Headline VOD categories, mirroring how the library is grouped in the app. */
export const vodCategories = [
  'Box office hits',
  'Series & box sets',
  'Kids & family',
  'Documentaries',
  'Sport films',
  'International',
] as const;

export const films: Title[] = [
  { name: 'The Shawshank Redemption', year: 1994, genre: 'Drama', badge: 'Classic' },
  { name: 'The Godfather', year: 1972, genre: 'Crime', badge: 'Classic' },
  { name: 'The Dark Knight', year: 2008, genre: 'Action' },
  { name: 'Pulp Fiction', year: 1994, genre: 'Crime' },
  { name: 'Inception', year: 2010, genre: 'Sci-fi' },
  { name: 'Goodfellas', year: 1990, genre: 'Crime' },
  { name: 'The Matrix', year: 1999, genre: 'Sci-fi' },
  { name: 'Interstellar', year: 2014, genre: 'Sci-fi', badge: '4K' },
  { name: 'Parasite', year: 2019, genre: 'Thriller' },
  { name: 'Gladiator', year: 2000, genre: 'Action' },
  { name: 'Whiplash', year: 2014, genre: 'Drama' },
  { name: 'Mad Max: Fury Road', year: 2015, genre: 'Action', badge: '4K' },
  { name: 'Dune', year: 2021, genre: 'Sci-fi', badge: '4K' },
  { name: 'Oppenheimer', year: 2023, genre: 'Drama', badge: '4K' },
  { name: 'Everything Everywhere All at Once', year: 2022, genre: 'Adventure' },
  { name: 'Top Gun: Maverick', year: 2022, genre: 'Action', badge: '4K' },
  { name: 'Spirited Away', year: 2001, genre: 'Animation' },
  { name: 'Coco', year: 2017, genre: 'Animation' },
  { name: 'The Grand Budapest Hotel', year: 2014, genre: 'Comedy' },
  { name: 'Blade Runner 2049', year: 2017, genre: 'Sci-fi', badge: '4K' },
];

export const series: Title[] = [
  { name: 'Breaking Bad', year: 2008, genre: 'Crime', badge: 'Box set' },
  { name: 'The Sopranos', year: 1999, genre: 'Crime' },
  { name: 'The Wire', year: 2002, genre: 'Crime' },
  { name: 'Chernobyl', year: 2019, genre: 'Drama', badge: 'Mini-series' },
  { name: 'Band of Brothers', year: 2001, genre: 'War' },
  { name: 'Succession', year: 2018, genre: 'Drama' },
  { name: 'The Last of Us', year: 2023, genre: 'Drama', badge: '4K' },
  { name: 'Stranger Things', year: 2016, genre: 'Sci-fi' },
  { name: 'Better Call Saul', year: 2015, genre: 'Crime' },
  { name: 'True Detective', year: 2014, genre: 'Crime' },
  { name: 'Peaky Blinders', year: 2013, genre: 'Drama' },
  { name: 'The Bear', year: 2022, genre: 'Comedy' },
  { name: 'Severance', year: 2022, genre: 'Thriller', badge: '4K' },
  { name: 'Game of Thrones', year: 2011, genre: 'Fantasy' },
  { name: 'Planet Earth II', year: 2016, genre: 'Documentary', badge: '4K' },
  { name: 'The Crown', year: 2016, genre: 'Drama' },
  { name: 'Fargo', year: 2014, genre: 'Crime' },
  { name: 'Ted Lasso', year: 2020, genre: 'Comedy' },
  { name: 'Formula 1: Drive to Survive', year: 2019, genre: 'Sport' },
  { name: 'The Mandalorian', year: 2019, genre: 'Sci-fi', badge: '4K' },
];

/** Two rails for the on-demand marquees. */
export const railA = films;
export const railB = series;

/** Featured strip — the six cards shown above the rails. */
export const featured: Title[] = [
  films[13], // Oppenheimer
  series[6], // The Last of Us
  films[12], // Dune
  series[12], // Severance
  films[15], // Top Gun: Maverick
  series[14], // Planet Earth II
];
