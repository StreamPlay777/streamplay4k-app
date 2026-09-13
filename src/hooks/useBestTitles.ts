import { useEffect, useState } from 'react';
import { fetchTitles, TMDB_ENABLED } from '../lib/tmdb';
import type { Title } from '../data/vod';

/**
 * The two live US rails: highest rated, and most watched.
 *
 * RETURNS NOTHING UNTIL REAL DATA ARRIVES, and that is the whole design.
 *
 * The obvious alternative — seed from the bundled list, swap in live titles
 * when they land — was built first and looked wrong on screen. The bundled
 * titles in vod.ts carry no poster artwork, so every card rendered as a striped
 * placeholder: twenty grey boxes on the homepage whenever the key was missing
 * or TMDB was slow. And the fallback titles are the same films the curated row
 * below already shows with real artwork, so filling these rails from it would
 * print the same posters twice.
 *
 * So: no key, no data, or a failed request means the section renders only the
 * curated row — exactly what the site shows today. There is no state in which
 * this adds empty-looking furniture to the page.
 */
export interface LiveTitles {
  best: Title[];
  popular: Title[];
  /** True only when TMDB actually returned titles. Gates both the rails and
   *  the attribution their licence requires. */
  live: boolean;
}

export function useBestTitles(): LiveTitles {
  const [state, setState] = useState<LiveTitles>({ best: [], popular: [], live: false });

  useEffect(() => {
    if (!TMDB_ENABLED) return;
    let cancelled = false;

    // Both lists in parallel; one failing does not sink the other.
    Promise.all([
      fetchTitles('best', 'movie', 10),
      fetchTitles('popular', 'movie', 10),
    ]).then(([b, p]) => {
      if (cancelled) return;
      const best = b ?? [];
      const popular = p ?? [];
      if (best.length || popular.length) setState({ best, popular, live: true });
    });

    return () => { cancelled = true; };
  }, []);

  return state;
}
