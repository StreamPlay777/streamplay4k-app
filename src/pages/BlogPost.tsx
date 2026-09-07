import { Link, useParams } from 'react-router-dom';
import { postBySlug, relatedPosts } from '../data/blog';
import { routes, site } from '../data/site';
import { articleLd, breadcrumbLd, DEFAULT_OG_IMAGE, type PageSeo } from '../data/seo';
import Seo from '../components/Seo';

const fmtDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
  });

/**
 * Article page.
 *
 * The body is markdown rendered at build time by lib/markdown.ts with raw HTML
 * disabled, so dangerouslySetInnerHTML here can only ever receive markdown-it's
 * own escaped output — no author-supplied HTML reaches the DOM.
 */
export default function BlogPost() {
  const { slug = '' } = useParams();
  const post = postBySlug(slug);

  if (!post) {
    return (
      <section className="section bg-bg">
        <div className="mx-auto max-w-[640px] text-center">
          <h1 className="font-display text-[32px] font-extrabold text-ink">Article not found</h1>
          <p className="mt-4 text-[16px] text-ink-3">That article does not exist, or it is not published yet.</p>
          <Link to={routes.blog} className="btn-accent mt-8">Back to the blog</Link>
        </div>
      </section>
    );
  }

  const trail = [
    { name: 'Home', path: routes.home },
    { name: 'Blog', path: routes.blog },
    { name: post.title, path: post.path },
  ];

  const seo: PageSeo = {
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
      breadcrumbLd(trail),
    ],
  };

  const related = relatedPosts(post);

  return (
    <>
      <Seo seo={seo} />

      <article className="section bg-bg">
        <div className="mx-auto max-w-[760px]">
          <nav aria-label="Breadcrumb" className="text-[12.5px] text-ink-4">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li><Link to={routes.home} className="transition-colors hover:text-accent-link">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link to={routes.blog} className="transition-colors hover:text-accent-link">Blog</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-ink-3">{post.category}</li>
            </ol>
          </nav>

          <p className="label-accent mt-6">{post.category}</p>
          <h1
            className="mt-3 font-display font-extrabold leading-[1.06] text-ink"
            style={{ fontSize: 'clamp(30px, 4.6vw, 46px)' }}
          >
            {post.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13px] text-ink-4">
            <span>{post.author}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={post.date}>{fmtDate(post.date)}</time>
            {post.updated && post.updated !== post.date && (
              <>
                <span aria-hidden="true">·</span>
                <span>Updated <time dateTime={post.updated}>{fmtDate(post.updated)}</time></span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span>{post.readingMinutes} min read</span>
          </div>

          {post.featuredImage && (
            <img
              src={post.featuredImage}
              alt={post.featuredImageAlt || ''}
              loading="lazy"
              className="mt-9 w-full rounded-2xl border border-white/[.08]"
            />
          )}

          {post.headings.length > 2 && (
            <nav aria-label="On this page" className="mt-10 rounded-2xl border border-white/[.08] bg-white/[.02] p-6">
              <h2 className="font-display text-[12px] font-extrabold uppercase tracking-[.16em] text-ink-4">
                On this page
              </h2>
              <ol className="mt-4 space-y-2">
                {post.headings.map((h) => (
                  <li key={h.id} className={h.level === 3 ? 'pl-4' : ''}>
                    <a href={`#${h.id}`} className="text-[14.5px] text-ink-3 transition-colors hover:text-accent-link">
                      {h.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <div className="prose-sp mt-10" dangerouslySetInnerHTML={{ __html: post.html }} />

          {post.tags.length > 0 && (
            <ul className="mt-12 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <li key={t} className="rounded-full border border-white/[.1] px-3 py-1.5 text-[12.5px] text-ink-4">
                  {t}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-12 rounded-2xl border border-white/[.08] bg-white/[.02] p-7 text-center">
            <h2 className="font-display text-[20px] font-extrabold text-ink">Ready to get started?</h2>
            <p className="mx-auto mt-3 max-w-[440px] text-[15px] leading-relaxed text-ink-3">
              Pick a plan, choose your devices, and we will send your invoice by email and WhatsApp.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to={routes.pricing} className="btn-accent w-full sm:w-auto">View plans →</Link>
              <Link to={routes.setup} className="btn-outline w-full sm:w-auto">Setup guides</Link>
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-14 border-t border-white/[.07] pt-10">
              <h2 className="font-display text-[19px] font-extrabold text-ink">Related reading</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((r) => (
                  <Link key={r.slug} to={r.path} className="card-hover p-5">
                    <p className="label-accent">{r.category}</p>
                    <h3 className="mt-2 font-display text-[16px] font-bold leading-snug text-ink">{r.title}</h3>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </>
  );
}
