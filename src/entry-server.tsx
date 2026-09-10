import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';

/**
 * Server entry, used only by scripts/prerender.mjs at build time.
 *
 * StaticRouter rather than BrowserRouter: the same component tree, given a URL
 * instead of the browser's location. Nothing in App knows the difference, which
 * is what keeps this from becoming a second implementation of the site.
 *
 * Effects do not run during renderToString, so anything behind useEffect —
 * scroll reveals, the SEO head sync, the WhatsApp button's MutationObserver —
 * is simply absent from the output and attaches on hydration. That is why the
 * reveal CSS hides content only under `html.js`: the pre-rendered HTML has no
 * such class until the inline script runs, so the text is visible to a crawler
 * that never executes JavaScript.
 */
export function render(url: string): string {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );
}

/**
 * Resolve the lazily-imported routes before the real render.
 *
 * The blog routes use React.lazy so their markdown machinery stays out of the
 * homepage bundle. React.lazy resolves asynchronously, but renderToString is
 * synchronous — so a first pass renders the Suspense fallback and, as a side
 * effect, starts the import. Awaiting a macrotask lets those imports settle;
 * every render after that is synchronous and complete.
 *
 * Without this, /blog/ and every article would be pre-rendered as an empty
 * placeholder, which is exactly the content a crawler most needs to see.
 */
export async function warm(urls: string[]): Promise<void> {
  for (const url of urls) render(url);
  await new Promise((r) => setTimeout(r, 0));
}

/**
 * Re-exported so scripts/prerender.mjs can read the route list and build head
 * markup from the same TypeScript modules the app uses, instead of keeping a
 * duplicate list in a build script that would drift.
 */
export { pageSeo, renderHeadHtml, absolute, articleLd, breadcrumbLd, DEFAULT_OG_IMAGE } from './data/seo';
export { posts } from './data/blog';
export { site, routes } from './data/site';
export { landings } from './data/landings';
