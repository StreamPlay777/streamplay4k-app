/**
 * Line icons for the channel categories and the "what's included" cards.
 *
 * Drawn here rather than pulled from an icon package: six glyphs at one stroke
 * weight, a few hundred bytes, and no dependency that ships two thousand more.
 * They inherit currentColor, so the tinted plate around them controls the
 * colour and both themes are handled without a second set.
 */

const box = {
  viewBox: '0 0 24 24', width: 20, height: 20, fill: 'none', stroke: 'currentColor',
  strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true,
} as const;

const PATHS: Record<string, React.ReactNode> = {
  // Ball — sports
  sports: <><circle cx="12" cy="12" r="8.6" /><path d="M12 3.4c2.6 2.3 2.6 15 0 17.2M12 3.4c-2.6 2.3-2.6 15 0 17.2M3.6 10.4c3.4 1.2 13.4 1.2 16.8 0" /></>,
  // Clapperboard — movies
  movies: <><rect x="3" y="7.5" width="18" height="13" rx="2" /><path d="M3 11.5h18M7.5 7.5 9.5 4M12.5 7.5 14.5 4M17.5 7.5 19.5 4" /></>,
  // Screen with a play mark — entertainment
  entertainment: <><rect x="2.6" y="4.4" width="18.8" height="13" rx="2" /><path d="M8 20.6h8M12 17.4v3.2M10.6 8.6l4 2.3-4 2.3z" /></>,
  // Balloon and string — kids
  kids: <><path d="M12 3.4c2.9 0 5 2.3 5 5.2 0 3.4-3 6-5 7.2-2-1.2-5-3.8-5-7.2 0-2.9 2.1-5.2 5-5.2Z" /><path d="M12 15.8v1.8M12 17.6c1.4.9.2 2 1.6 3" /></>,
  // Broadcast tower — news
  news: <><circle cx="12" cy="9" r="2.2" /><path d="M7.8 4.8a6 6 0 0 0 0 8.4M16.2 4.8a6 6 0 0 1 0 8.4M4.9 2a10 10 0 0 0 0 14M19.1 2a10 10 0 0 1 0 14M12 11.2 9.4 21M12 11.2 14.6 21" /></>,
  // 4K frame — ultra HD
  uhd: <><rect x="2.6" y="5" width="18.8" height="14" rx="2" /><path d="M7.4 9v3.2h3.2M10.6 9v6M14 15V9M17.6 9l-2.6 3 2.6 3" /></>,
  // Devices — screens of three sizes
  devices: <><rect x="2.4" y="5" width="12" height="9" rx="1.6" /><path d="M5.4 17.4h6M8.4 14v3.4" /><rect x="16.4" y="9" width="5.2" height="10" rx="1.4" /></>,
  // Download arrow into a base — setup
  setup: <><path d="M12 3.6v10M8.4 10l3.6 3.6L15.6 10M4.4 16.4v2.2a1.8 1.8 0 0 0 1.8 1.8h11.6a1.8 1.8 0 0 0 1.8-1.8v-2.2" /></>,
  // Speech bubble with a tick — support
  support: <><path d="M20.4 11.6c0 4-3.8 7.2-8.4 7.2a10 10 0 0 1-2.6-.3l-4.6 1.9 1.2-3.9a6.7 6.7 0 0 1-2.4-4.9c0-4 3.8-7.2 8.4-7.2s8.4 3.2 8.4 7.2Z" /><path d="M9.2 11.6 11 13.4l3.8-4" /></>,
};

export function CatIcon({ name }: { name: keyof typeof PATHS | string }) {
  return <svg {...box}>{PATHS[name] ?? PATHS.entertainment}</svg>;
}
