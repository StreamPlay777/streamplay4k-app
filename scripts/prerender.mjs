/**
 * Build-time pre-rendering.
 *
 * Runs after both Vite builds and turns each public route into a real HTML
 * document with its content, title, description, canonical, Open Graph tags and
 * structured data already in the markup — so a crawler that never executes
 * JavaScript still sees a complete page.
 *
 * The route list, the metadata and the head markup all come from the compiled
 * SSR bundle, which is the same TypeScript the app runs. There is no second
 * list of routes in this file to fall out of step.
 *
 * Also writes sitemap.xml and robots.txt from the same source.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const serverDir = path.join(dist, 'server');

const server = await import(pathToFileURL(path.join(serverDir, 'entry-server.js')).href);
const { render, warm, pageSeo, notFoundSeo, renderHeadHtml, posts, site, routes, landings, articleLd, breadcrumbLd, DEFAULT_OG_IMAGE } = server;

// Resolve React.lazy routes first — see the note on warm() in entry-server.tsx.
await warm([
  routes.blog, routes.about, routes.faq,
  routes.terms, routes.privacy, routes.refund, routes.cookies, routes.dmca,
  ...posts.map((p) => p.path),
]);

const template = await fs.readFile(path.join(dist, 'index.html'), 'utf8');
if (!template.includes('<!--app-html-->') || !template.includes('<!--app-head-->')) {
  throw new Error('index.html is missing the <!--app-html--> or <!--app-head--> placeholder');
}

/** Route -> file path. "/" becomes index.html, "/pricing/" becomes pricing/index.html.
    A route that already names a file, like "/404.html", is written as that file. */
const outFile = (route) => {
  if (/\.html$/.test(route)) return path.join(dist, route.replace(/^\//, ''));
  const clean = route.replace(/^\/|\/$/g, '');
  return clean ? path.join(dist, clean, 'index.html') : path.join(dist, 'index.html');
};

const written = [];

async function emit(route, seo) {
  // renderToString needs a path React Router recognises; trailing slashes are
  // ignored when matching, so either form resolves to the same route.
  const html = render(route);
  const head = renderHeadHtml(seo);
  const doc = template.replace('<!--app-head-->', head).replace('<!--app-html-->', html);

  const file = outFile(route);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, doc, 'utf8');
  written.push({ route, file: path.relative(dist, file), bytes: Buffer.byteLength(doc), seo });
}

/* ── Static routes ───────────────────────────────────────────────────────── */
for (const [route, seo] of Object.entries(pageSeo)) {
  await emit(route, seo);
}

/* ── Blog posts (published only — drafts never reach `posts`) ────────────── */
for (const post of posts) {
  await emit(post.path, {
    path: post.canonicalPath,
    title: `${post.title} — ${site.name}`,
    description: post.description,
    ogType: 'article',
    ogImage: post.featuredImage || DEFAULT_OG_IMAGE,
    jsonLd: [
      articleLd({
        title: post.title,
        description: post.description,
        path: post.canonicalPath,
        date: post.date,
        updated: post.updated,
        author: post.author,
        image: post.featuredImage,
      }),
      breadcrumbLd([
        { name: 'Home', path: routes.home },
        { name: 'Blog', path: routes.blog },
        { name: post.title, path: post.path },
      ]),
    ],
  });
}

/* ── Campaign landings (published only) ──────────────────────────────────── */
for (const l of landings.filter((x) => x.status === 'published')) {
  const p = `/${l.slug}/`;
  await emit(p, {
    path: p,
    title: l.seoTitle || pageSeo[routes.home].title,
    description: l.metaDescription || pageSeo[routes.home].description,
    canonical: l.canonical,
    robots: l.robots ?? 'index,follow',
  });
}

/* ── 404 ─────────────────────────────────────────────────────────────────── */
/* Rendered at a path no route claims, so the router's catch-all produces the
   NotFound screen inside the normal shell. Apache serves this file for every
   URL with nothing on disk — with a real 404 status, which the old SPA
   fallback never sent. Excluded from the sitemap by its own noindex. */
await emit(notFoundSeo.path, notFoundSeo);

/* ── sitemap.xml ─────────────────────────────────────────────────────────── */
const today = new Date().toISOString().slice(0, 10);
const sitemapEntries = written
  // `sitemap: false` excludes /thank-you/; noindex pages are excluded too, so a
  // page can never be told "do not index" and listed for indexing at once.
  .filter(({ seo }) => seo.sitemap !== false && !String(seo.robots || '').includes('noindex'))
  .map(({ seo, route }) => {
    const loc = `${site.url}${seo.path || route}`;
    const post = posts.find((p) => p.path === route);
    const lastmod = post ? post.updated || post.date : today;
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
  })
  .sort();

await fs.writeFile(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries.join('\n')}\n</urlset>\n`,
  'utf8',
);

/* ── robots.txt ──────────────────────────────────────────────────────────── */
/* No Disallow for /thank-you/. It carries a noindex tag, and a page a crawler
   is forbidden to fetch is a page whose noindex it never reads — a disallowed
   URL can still be indexed, URL-only, if anything links to it. The tag is the
   stronger control, and it only works if the page can be read. */
await fs.writeFile(
  path.join(dist, 'robots.txt'),
  ['User-agent: *', 'Allow: /', '', `Sitemap: ${site.url}/sitemap.xml`, ''].join('\n'),
  'utf8',
);

/* ── Tidy up: the SSR bundle is a build artefact, not something to deploy ── */
await fs.rm(serverDir, { recursive: true, force: true });

const indexed = sitemapEntries.length;
console.log(`\nPre-rendered ${written.length} HTML documents (${indexed} in sitemap.xml):`);
for (const w of written.sort((a, b) => a.file.localeCompare(b.file))) {
  const noindex = String(w.seo.robots || '').includes('noindex') ? '  [noindex]' : '';
  console.log(`  ${w.file.padEnd(34)} ${String((w.bytes / 1024).toFixed(1)).padStart(7)} kB${noindex}`);
}
