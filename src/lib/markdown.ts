import MarkdownIt from 'markdown-it';

/**
 * Markdown pipeline for the blog.
 *
 * SAFETY: `html: false` is markdown-it's default and is kept deliberately.
 * Raw HTML inside a post is escaped rather than executed, so a post can never
 * inject a script, an iframe or an event handler. If embedded HTML is ever
 * needed, add an explicit allow-list sanitizer — do not simply flip this flag.
 *
 * Frontmatter is parsed by hand rather than with gray-matter. gray-matter
 * pulls js-yaml and expects Node's Buffer, which is awkward in a browser
 * bundle; the schema here is small, fixed and fully validated below, so a
 * 40-line parser is the safer trade. Anything it does not understand throws at
 * build time with the offending file named, rather than failing silently.
 */

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  breaks: false,
});

/** Adds ids to h2/h3 so the table of contents can link to them. */
const slugify = (s: string) =>
  s.toLowerCase().trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export interface Heading { level: 2 | 3; text: string; id: string; }

export interface Frontmatter {
  title: string;
  slug: string;
  description: string;
  date: string;
  updated?: string;
  author: string;
  category: string;
  tags: string[];
  featuredImage?: string;
  featuredImageAlt?: string;
  canonical?: string;
  draft: boolean;
}

const REQUIRED = ['title', 'slug', 'description', 'date', 'author', 'category'] as const;

function unquote(v: string): string {
  const t = v.trim();
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    return t.slice(1, -1);
  }
  return t;
}

/** Splits `---\n…\n---\n<body>` into typed frontmatter and the markdown body. */
export function parseFrontmatter(raw: string, file: string): { data: Frontmatter; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw.replace(/^﻿/, ''));
  if (!match) throw new Error(`[blog] ${file}: missing --- frontmatter block`);

  const [, head, body] = match;
  const out: Record<string, string | string[] | boolean> = {};
  let listKey: string | null = null;

  for (const line of head.split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('#')) continue;

    const item = /^\s*-\s+(.*)$/.exec(line);
    if (item && listKey) {
      (out[listKey] as string[]).push(unquote(item[1]));
      continue;
    }

    const pair = /^([A-Za-z][A-Za-z0-9_]*):\s*(.*)$/.exec(line);
    if (!pair) throw new Error(`[blog] ${file}: cannot parse frontmatter line: ${line}`);

    const [, key, rawValue] = pair;
    if (rawValue.trim() === '') { listKey = key; out[key] = []; continue; }
    listKey = null;

    const value = unquote(rawValue);
    out[key] = value === 'true' ? true : value === 'false' ? false : value;
  }

  for (const k of REQUIRED) {
    if (typeof out[k] !== 'string' || !(out[k] as string)) {
      throw new Error(`[blog] ${file}: "${k}" is required in frontmatter`);
    }
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(out.date as string)) {
    throw new Error(`[blog] ${file}: "date" must be YYYY-MM-DD, got "${out.date}"`);
  }

  return {
    data: {
      title: out.title as string,
      slug: out.slug as string,
      description: out.description as string,
      date: out.date as string,
      updated: (out.updated as string) || undefined,
      author: out.author as string,
      category: out.category as string,
      tags: Array.isArray(out.tags) ? out.tags : [],
      featuredImage: (out.featuredImage as string) || undefined,
      featuredImageAlt: (out.featuredImageAlt as string) || undefined,
      canonical: (out.canonical as string) || undefined,
      // Anything other than an explicit `draft: false` is treated as a draft,
      // so a typo keeps a post unpublished rather than accidentally shipping it.
      draft: out.draft !== false,
    },
    body,
  };
}

/** Renders the body and collects h2/h3 for a table of contents. */
export function renderMarkdown(body: string): { html: string; headings: Heading[] } {
  const headings: Heading[] = [];
  const tokens = md.parse(body, {});

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.type !== 'heading_open' || (t.tag !== 'h2' && t.tag !== 'h3')) continue;
    const text = tokens[i + 1]?.content ?? '';
    const id = slugify(text);
    t.attrSet('id', id);
    headings.push({ level: t.tag === 'h2' ? 2 : 3, text, id });
  }

  return { html: md.renderer.render(tokens, md.options, {}), headings };
}

/** Reading time, rounded up, minimum one minute. */
export function readingMinutes(body: string): number {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}
