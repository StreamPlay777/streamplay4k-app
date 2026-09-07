import { routes } from './site';

/**
 * Campaign / duplicate page definitions (brief §29).
 *
 * The scaffolding for a future admin tool, not the tool itself. A landing
 * re-uses an existing page template with optional overrides — there is no
 * duplicated template code, and no separate copy of the homepage to maintain.
 *
 * Each entry gets a real pre-rendered HTML file at its slug, so a campaign URL
 * is indexable (or explicitly not, via `robots`) without a client-side render.
 *
 * HOW TO USE THIS RESPONSIBLY
 * A landing exists to match an ad's message to the page it lands on — a
 * different headline for a Firestick campaign, say. It is not a way to publish
 * near-identical pages to occupy more search results; search engines treat that
 * as doorway spam and demote the whole domain for it. Pages that differ only in
 * a swapped keyword should carry `robots: 'noindex,follow'`, which is what
 * `status: 'draft'` does automatically below.
 *
 * Nothing here changes how any platform enforces its own rules. Duplicating a
 * page does not affect copyright, ad-policy or search enforcement in any way.
 */

export interface Landing {
  /** Stable id, so an admin tool can address a row that has been renamed. */
  id: string;
  /** Path segment only, no slashes: 'firestick-iptv' -> /firestick-iptv/ */
  slug: string;
  /** Which page template to render. Only 'home' exists so far. */
  sourceTemplate: 'home';
  status: 'published' | 'draft';

  /* All optional. Anything omitted falls back to the template's own content. */
  seoTitle?: string;
  metaDescription?: string;
  heroEyebrow?: string;
  heroHeadline?: string;
  heroSubtext?: string;
  /** Absolute URL. Defaults to a self-referencing canonical for the slug. */
  canonical?: string;
  /** Defaults to index,follow when published and noindex,follow when draft. */
  robots?: string;
}

/**
 * No campaign pages are live. The array is typed and wired end to end — the
 * pre-render step, the sitemap and the router all read it — so adding one is a
 * data change rather than a code change.
 */
export const landings: Landing[] = [];

export const landingPath = (l: Landing): string => `/${l.slug}/`;

export const landingRobots = (l: Landing): string =>
  l.robots ?? (l.status === 'published' ? 'index,follow' : 'noindex,follow');

/** Published landings only — drafts are never pre-rendered or listed. */
export const publishedLandings = (): Landing[] => landings.filter((l) => l.status === 'published');

/** Guard against a slug colliding with a real route. */
export const RESERVED_SLUGS = new Set(
  Object.values(routes).map((r) => r.replace(/\//g, '')).filter(Boolean),
);
