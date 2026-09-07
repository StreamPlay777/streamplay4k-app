import { site, routes } from './site';
import { faqs } from './faqs';

/**
 * Page metadata, and the one place head tags are built.
 *
 * The same functions run in two places:
 *   - scripts/prerender.mjs calls renderHeadHtml() to bake tags into the
 *     static HTML, so crawlers that never execute JavaScript (Facebook,
 *     WhatsApp, Slack, X) get real metadata.
 *   - useSeo() calls applyHead() on client-side navigation, so metadata stays
 *     correct after the first route change.
 *
 * Because both read this file, the served HTML and the SPA can never disagree.
 *
 * Canonicals are absolute and self-referencing. Nothing points at the homepage
 * canonical except the homepage.
 */

export const SITE_URL = site.url;
export const DEFAULT_OG_IMAGE = '/og-image.png';

export interface PageSeo {
  /** Canonical path, with the trailing slash the build emits. */
  path: string;
  title: string;
  description: string;
  /** Defaults to 'index,follow'. */
  robots?: string;
  ogType?: 'website' | 'article';
  /** Root-relative or absolute. Defaults to DEFAULT_OG_IMAGE. */
  ogImage?: string;
  /** Extra structured data for this page. */
  jsonLd?: Record<string, unknown>[];
  /** Set false to keep the page out of sitemap.xml. */
  sitemap?: boolean;
}

export function absolute(pathOrUrl: string): string {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  return SITE_URL + (pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`);
}

/* ── Structured data ──────────────────────────────────────────────────────
   Only claims that match what a visitor can actually see on the page.
   Deliberately absent: AggregateRating. The Trustpilot score is a real number
   but it is Trustpilot's, collected on their platform — restating it as our
   own review schema would misrepresent where it came from. Also absent: Offer
   availability and Product inventory, since no purchase happens on this site. */

export const organizationLd: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: site.name,
  url: SITE_URL,
  logo: absolute('/favicon.png'),
  description: site.description,
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: site.email,
      telephone: site.whatsapp,
      availableLanguage: ['English'],
    },
  ],
  sameAs: ['https://www.trustpilot.com/review/streamplay4k.com'],
};

export const webSiteLd: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: site.name,
  url: SITE_URL,
  // No SearchAction: the channel search filters a bundled list in the browser
  // and has no shareable results URL, so advertising one would be false.
};

export function faqPageLd(items: { q: string; a: string }[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

export function breadcrumbLd(trail: { name: string; path: string }[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absolute(c.path),
    })),
  };
}

export function articleLd(a: {
  title: string; description: string; path: string;
  date: string; updated?: string; author: string; image?: string;
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.description,
    datePublished: a.date,
    dateModified: a.updated || a.date,
    author: { '@type': 'Organization', name: a.author },
    publisher: { '@type': 'Organization', name: site.name, logo: { '@type': 'ImageObject', url: absolute('/favicon.png') } },
    mainEntityOfPage: absolute(a.path),
    ...(a.image ? { image: absolute(a.image) } : {}),
  };
}

/* ── Static page metadata ─────────────────────────────────────────────────── */

/** Home > Page. Legal and content pages all sit one level down. */
const crumb = (name: string, path: string) =>
  breadcrumbLd([{ name: 'Home', path: routes.home }, { name, path }]);

export const pageSeo: Record<string, PageSeo> = {
  [routes.home]: {
    path: routes.home,
    title: `${site.name} — Premium TV Streaming, Sports, Movies & Series`,
    description:
      'Live TV, sports, movies and series in HD and 4K across your favorite devices. Simple plans, fast activation and 24/7 support.',
    jsonLd: [organizationLd, webSiteLd],
  },
  [routes.pricing]: {
    path: routes.pricing,
    title: `Plans & Pricing — ${site.name}`,
    description:
      'Choose a 3, 6 or 12 month subscription and the number of devices you need. One device included, up to five. No payment is taken on the order form.',
    jsonLd: [crumb('Pricing', routes.pricing)],
  },
  [routes.channels]: {
    path: routes.channels,
    title: `Channel List — Browse the ${site.name} Line-up`,
    description:
      'Search the channel line-up by name, category or country. Sports, news, entertainment, movies and international channels.',
    jsonLd: [crumb('Channels', routes.channels)],
  },
  [routes.setup]: {
    path: routes.setup,
    title: `Setup Guide — Firestick, Smart TV, Android TV & More | ${site.name}`,
    description:
      'Step-by-step setup for Amazon Firestick, Android TV, Samsung and LG smart TVs, Apple TV, phones, tablets and computers.',
    jsonLd: [crumb('Setup Guide', routes.setup)],
  },
  [routes.reviews]: {
    path: routes.reviews,
    title: `Customer Reviews — ${site.name} on Trustpilot`,
    description:
      'Read what customers say about their experience with StreamPlay4K, including the current Trustpilot rating and review count.',
    jsonLd: [crumb('Reviews', routes.reviews)],
  },
  [routes.blog]: {
    path: routes.blog,
    title: `Blog — Streaming Guides & Setup Help | ${site.name}`,
    description:
      'Guides, setup walkthroughs and troubleshooting for streaming live TV, sports and on-demand entertainment.',
    jsonLd: [crumb('Blog', routes.blog)],
  },
  [routes.about]: {
    path: routes.about,
    title: `About ${site.name}`,
    description:
      'What StreamPlay4K is, how the service works, and what to expect from setup, plans and support.',
    jsonLd: [crumb('About', routes.about)],
  },
  [routes.contact]: {
    path: routes.contact,
    title: `Contact & Support — ${site.name}`,
    description: `Get help by WhatsApp on ${site.whatsapp} or by email at ${site.email}. Setup help, billing questions and troubleshooting.`,
    jsonLd: [crumb('Contact', routes.contact)],
  },
  [routes.faq]: {
    path: routes.faq,
    title: `Frequently Asked Questions — ${site.name}`,
    description:
      'Answers on devices, activation times, how payment works, trials, refunds and getting support.',
    jsonLd: [crumb('FAQ', routes.faq), faqPageLd(faqs)],
  },
  [routes.terms]: {
    path: routes.terms,
    title: `Terms of Service — ${site.name}`,
    description: 'The terms that apply when you order and use a StreamPlay4K subscription.',
    jsonLd: [crumb('Terms of Service', routes.terms)],
  },
  [routes.privacy]: {
    path: routes.privacy,
    title: `Privacy Policy — ${site.name}`,
    description: 'What information StreamPlay4K collects, why, how long it is kept and how to make a request.',
    jsonLd: [crumb('Privacy Policy', routes.privacy)],
  },
  [routes.refund]: {
    path: routes.refund,
    title: `Refund Policy — ${site.name}`,
    description: `StreamPlay4K offers a ${site.refundDays}-day money-back guarantee. How it works and how to request a refund.`,
    jsonLd: [crumb('Refund Policy', routes.refund)],
  },
  [routes.cookies]: {
    path: routes.cookies,
    title: `Cookie Policy — ${site.name}`,
    description: 'Which cookies and browser storage StreamPlay4K uses, and how to control them.',
    jsonLd: [crumb('Cookie Policy', routes.cookies)],
  },
  [routes.dmca]: {
    path: routes.dmca,
    title: `DMCA & Copyright — ${site.name}`,
    description: 'How to send a copyright notice to StreamPlay4K and what information to include.',
    jsonLd: [crumb('DMCA & Copyright', routes.dmca)],
  },
  [routes.thankYou]: {
    path: routes.thankYou,
    title: `Order Received — ${site.name}`,
    description: 'Your order request has been received. Your invoice follows by email and WhatsApp.',
    robots: 'noindex,nofollow',
    sitemap: false,
  },
};

/** Routes that get pre-rendered and (unless excluded) listed in the sitemap. */
export const staticRoutes = Object.keys(pageSeo);

/* ── Head rendering ───────────────────────────────────────────────────────── */

interface Tag { tag: 'meta' | 'link'; attrs: Record<string, string>; }

function headTags(seo: PageSeo): { title: string; tags: Tag[]; jsonLd: Record<string, unknown>[] } {
  const url = absolute(seo.path);
  const image = absolute(seo.ogImage || DEFAULT_OG_IMAGE);
  const tags: Tag[] = [
    { tag: 'meta', attrs: { name: 'description', content: seo.description } },
    { tag: 'meta', attrs: { name: 'robots', content: seo.robots || 'index,follow' } },
    { tag: 'link', attrs: { rel: 'canonical', href: url } },
    { tag: 'meta', attrs: { property: 'og:type', content: seo.ogType || 'website' } },
    { tag: 'meta', attrs: { property: 'og:site_name', content: site.name } },
    { tag: 'meta', attrs: { property: 'og:title', content: seo.title } },
    { tag: 'meta', attrs: { property: 'og:description', content: seo.description } },
    { tag: 'meta', attrs: { property: 'og:url', content: url } },
    { tag: 'meta', attrs: { property: 'og:image', content: image } },
    { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
    { tag: 'meta', attrs: { name: 'twitter:title', content: seo.title } },
    { tag: 'meta', attrs: { name: 'twitter:description', content: seo.description } },
    { tag: 'meta', attrs: { name: 'twitter:image', content: image } },
  ];
  return { title: seo.title, tags, jsonLd: seo.jsonLd || [] };
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Head markup for the static build. */
export function renderHeadHtml(seo: PageSeo): string {
  const { title, tags, jsonLd } = headTags(seo);
  const lines = [`<title>${escapeHtml(title)}</title>`];
  for (const t of tags) {
    const attrs = Object.entries(t.attrs)
      .map(([k, v]) => `${k}="${escapeHtml(v)}"`)
      .join(' ');
    lines.push(`<${t.tag} ${attrs} />`);
  }
  for (const ld of jsonLd) {
    // `<` is escaped so a stray "</script>" inside content cannot close the tag.
    lines.push(
      `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`,
    );
  }
  return lines.join('\n    ');
}

/**
 * Sync the live document head on client-side navigation.
 *
 * Tags written here are marked data-seo so they can be replaced wholesale on
 * the next navigation without disturbing anything the build put in the head.
 */
export function applyHead(seo: PageSeo): void {
  if (typeof document === 'undefined') return;
  const { title, tags, jsonLd } = headTags(seo);
  document.title = title;

  document.head.querySelectorAll('[data-seo]').forEach((el) => el.remove());
  // The build writes a description and canonical without the marker; remove
  // those too or the page would carry two of each.
  document.head
    .querySelectorAll('meta[name="description"], link[rel="canonical"], meta[name="robots"], meta[property^="og:"], meta[name^="twitter:"], script[type="application/ld+json"]')
    .forEach((el) => el.remove());

  const frag = document.createDocumentFragment();
  for (const t of tags) {
    const el = document.createElement(t.tag);
    for (const [k, v] of Object.entries(t.attrs)) el.setAttribute(k, v);
    el.setAttribute('data-seo', '');
    frag.appendChild(el);
  }
  for (const ld of jsonLd) {
    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.textContent = JSON.stringify(ld);
    el.setAttribute('data-seo', '');
    frag.appendChild(el);
  }
  document.head.appendChild(frag);
}
