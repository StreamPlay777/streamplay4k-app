# StreamPlay4K

Static marketing site for StreamPlay4K, built with [Eleventy](https://www.11ty.dev/).
Semantic HTML, modern CSS, vanilla JavaScript, Markdown content. No SPA
framework, no CSS framework, no runtime dependencies in the browser.
Manrope Variable is the brand typeface, self-hosted from `src/assets/fonts/`.

## Commands

```bash
npm install          # install build tooling
npm run dev          # local dev server with live reload (drafts visible)
npm run build        # production build into dist/ (drafts excluded)
npm run build:dev    # production-shaped build with drafts included
npm run clean        # remove dist/
npm run serve:dist    # serve the built output for a final check
```

Output is plain static HTML in `dist/`, suitable for any CDN or static host.

## Layout

```
src/
  _data/            Site configuration and content data (see below)
  _includes/
    layouts/        base, page, template-page, post
    partials/       head, header, footer, breadcrumbs, schema, analytics
    components/     button and logo macros
    templates/      SOURCE TEMPLATE bodies (homepage, pricing, free-trial, landing)
    sections/       one file per approved page section
  assets/
    css/            design tokens + component styles, bundled by Lightning CSS
    js/             native ES modules, no bundler
    img/            brand and Open Graph assets
    fonts/          self-hosted web fonts
    root/           files copied to the site root (favicon, webmanifest)
  content/blog/     Markdown articles
  pages/            one file per route
```

## Data layer

Nothing that appears on more than one page is hardcoded in a template.

| File | Owns |
| --- | --- |
| `site.js` | Domain, language, build metadata, asset version |
| `business.js` | Contact details, guarantees, catalog figures, payment methods |
| `pricing.js` | Plans, device limits, additional-device pricing rule |
| `navigation.js` | Header, footer and legal navigation |
| `seoDefaults.js` | Title template, description, robots, OG defaults, Organization |
| `analytics.js` | GTM / GA4 / Google Ads IDs and the allowed event vocabulary |
| `brand.js` | Logo and favicon asset paths |
| `devices.js` | Devices offered by the interactive setup page |
| `channels.js` | Channel reference list for the future channel search |
| `redirects.js` | Old-URL redirect map (empty until URLs are inventoried) |
| `templates.js` | Source template registry |
| `duplicatePages.js` | Duplicate / campaign page records |
| `eleventyComputed.js` | Metadata inheritance: SEO resolution and breadcrumbs |

## Metadata inheritance

Each page resolves its metadata centrally in `_data/eleventyComputed.js`:

```
page front matter -> source template defaults -> global SEO defaults
```

Canonicals are self-referencing unless `canonicalUrl` is set. Descriptions are
clamped to 160 characters once, so `<meta>`, Open Graph and Twitter always
agree. Drafts and unpublished records are automatically `noindex,nofollow` and
excluded from the sitemap.

## Duplicate / campaign pages

A **source template** (`_includes/templates/`) is a page body that can render at
more than one URL. `_data/templates.js` registers them; `_data/duplicatePages.js`
holds the records a future admin writes. Each record publishes at its own slug
with optional per-page overrides and inherits everything it leaves empty. No
template code is duplicated and no content is regenerated.

```js
{
  pageName: "USA Campaign 2026",
  slug: "iptv-usa-2026",        // normalised to lowercase-hyphenated
  sourceTemplate: "homepage",
  status: "published"           // "draft" never builds in production
}
```

## Adding a page section

1. Create `src/_includes/sections/<name>.njk` (one `<section>`, heading linked
   with `aria-labelledby`).
2. Create `src/assets/css/components/<name>.css` and `@import` it from
   `src/assets/css/main.css`.
3. Include the section from the relevant source template.

Approved sections are self-contained so later work does not reopen them.

## Blog

Markdown in `src/content/blog/`. Front matter: `title`, `slug`, `description`,
`date`, `updated`, `author`, `category`, `tags`, `featuredImage`,
`featuredImageAlt`, `canonical`, `draft`. Defaults, permalinks and `Article`
structured data come from `blog.11tydata.js`. Articles get breadcrumbs, an
automatic table of contents at three or more headings, reading time and related
posts by category.

## Analytics

`_data/analytics.js` is the only place tracking IDs live. Components emit events
declaratively:

```html
<a href="/pricing/" data-sp-event="view_pricing" data-sp-event-location="header">
```

`assets/js/analytics.js` validates the event name against the allowed list
before pushing to the data layer.

**`submit_order` is a lead event, not a purchase.** The site does not take
payment: a customer submits an order request and is invoiced separately. Never
map it to a purchase conversion.

## Redirects

`_data/redirects.js` generates both `dist/.htaccess` (Apache/Hostinger) and
`dist/_redirects` (Netlify/Cloudflare) at build time. It is deliberately empty
until the existing indexed URLs are inventoried.
