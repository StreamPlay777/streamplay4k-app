import { useEffect, useState } from 'react';
import { fetchBest, TMDB_ENABLED } from '../lib/tmdb';
import { railA, railB, type Title } from '../data/vod';

/**
 * Recent best-rated films and series, 20 in total.
 *
 * Starts from the bundled list so the section renders instantly with no layout
 * shift, then swaps in live titles once they arrive. If TMDB is unreachable,
 * rate-limited, or no key is configured, the bundled list simply stays — the
 * section never ends up empty.
 */
export function useBestTitles() {
  const [films, setFilms] = useState<Title[]>(() => railA.slice(0, 10));
  const [series, setSeries] = useState<Title[]>(() => railB.slice(0, 10));
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (!TMDB_ENABLED) return;
    let cancelled = false;

    // Both lists in parallel; one failing does not sink the other.
    Promise.all([fetchBest('movie', 10), fetchBest('tv', 10)]).then(([m, t]) => {
      if (cancelled) return;
      if (m?.length) { setFilms(m); setLive(true); }
      if (t?.length) { setSeries(t); setLive(true); }
    });

    return () => { cancelled = true; };
  }, []);

  return { films, series, live };
}
