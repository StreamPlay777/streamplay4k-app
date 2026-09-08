import { useCallback, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';

const KEY = 'sp-theme';

/** What the pre-paint script in index.html already put on <html>. */
function current(): Theme {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

/**
 * The site's theme.
 *
 * The value is owned by the document, not by React: index.html sets
 * <html data-theme> before first paint so a pre-rendered page never flashes
 * the wrong palette. This hook reads that, writes changes back to the same
 * place, and remembers the choice.
 *
 * It deliberately does not follow prefers-color-scheme. A visitor who has
 * never expressed a preference gets the dark site, because that is the brand;
 * the switch is theirs to throw. Every colour resolves through the CSS
 * variables in index.css, so flipping the attribute restyles the whole site.
 */
export function useTheme(): { theme: Theme; toggle: () => void } {
  // Starts at the value the server rendered with, NOT at what the document
  // says. Reading the document here would make the first client render
  // disagree with the pre-rendered HTML, and React throws out the whole tree
  // and re-renders it (hydration errors #418/#423 on every page). The real
  // value arrives one effect later; anything that must be right at first paint
  // is driven by the data-theme attribute in CSS instead.
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => { setTheme(current()); }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      // The browser chrome (address bar, status bar) is told too, or a light
      // page keeps a black notch on iOS.
      document.querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', next === 'light' ? '#FFFFFF' : '#06080F');
      try { localStorage.setItem(KEY, next); } catch { /* private mode: the
        choice simply does not survive the tab, which is better than throwing. */ }
      return next;
    });
  }, []);

  return { theme, toggle };
}
