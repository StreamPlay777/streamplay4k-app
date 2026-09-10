import { parseFrontmatter, renderMarkdown, readingMinutes, type Frontmatter, type Heading } from '../lib/markdown';
import { routes } from './site';

/**
 * Blog index, built from content/blog/*.md at build time.
 *
 * `import.meta.glob(..., { query: '?raw', eager: true })` inlines the markdown
 * source into this module. Because the blog routes are lazy-loaded in App.tsx,
 * markdown-it and the post bodies land in their own chunk and cost the
 * homepage nothing.
 *
 * DRAFTS: a post is published only when its frontmatter says `draft: false`.
 * Drafts are excluded from `posts`, from the blog listing, from the sitemap and
 * from pre-rendering. They stay in `allPosts` so a preview tool could reach
 * them later.
 */

export interface Post extends Frontmatter {
  html: string;
  headings: Heading[];
  readingMinutes: number;
  /** Canonical path, e.g. /blog/example-article/ */
  path: string;
  /** Absolute canonical, honouring an explicit frontmatter override. */
  canonicalPath: string;
}

const files = import.meta.glob('/content/blog/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

function build(): Post[] {
  const out: Post[] = [];
  for (const [file, raw] of Object.entries(files)) {
    const { data, body } = parseFrontmatter(raw, file);
    const { html, headings } = renderMarkdown(body);
    const path = `${routes.blog}${data.slug}/`;
    out.push({
      ...data,
      html,
      headings,
      readingMinutes: readingMinutes(body),
      path,
      canonicalPath: data.canonical || path,
    });
  }
  // Newest first.
  return out.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export const allPosts: Post[] = build();

/** Published posts only — this is what the site renders. */
export const posts: Post[] = allPosts.filter((p) => !p.draft);

export const categories: string[] = [...new Set(posts.map((p) => p.category))].sort();

export function postBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

/** Up to three others, preferring the same category. */
export function relatedPosts(post: Post, limit = 3): Post[] {
  const others = posts.filter((p) => p.slug !== post.slug);
  const sameCategory = others.filter((p) => p.category === post.category);
  return [...sameCategory, ...others.filter((p) => p.category !== post.category)].slice(0, limit);
}
