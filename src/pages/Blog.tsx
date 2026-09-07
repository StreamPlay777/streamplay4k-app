import { Link } from 'react-router-dom';
import { useState } from 'react';
import { posts, categories } from '../data/blog';
import { routes, site } from '../data/site';
import { pageSeo } from '../data/seo';
import Seo from '../components/Seo';
import Reveal from '../components/Reveal';

const fmtDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
  });

/** Blog index. Published posts only — drafts never reach this list. */
export default function Blog() {
  const [category, setCategory] = useState<string | null>(null);
  const seo = pageSeo[routes.blog];
  const shown = category ? posts.filter((p) => p.category === category) : posts;
  const [lead, ...rest] = shown;

  return (
    <>
      <Seo seo={seo} />

      <section className="section amb amb-cool bg-bg">
        <div className="mx-auto max-w-shell">
          <div className="mx-auto max-w-[720px] text-center">
            <p className="eyebrow">Guides & help</p>
            <h1
              className="mt-4 font-display font-extrabold leading-[1.04] text-ink"
              style={{ fontSize: 'clamp(32px, 5vw, 52px)' }}
            >
              The <span className="text-grad">{site.name} blog</span>
            </h1>
            <p className="mx-auto mt-5 max-w-[560px] text-[16.5px] leading-relaxed text-ink-3">
              Setup walkthroughs, troubleshooting and plain-language guides to getting more out of
              your subscription.
            </p>
          </div>

          {posts.length === 0 ? (
            <p className="mt-16 text-center text-[16px] text-ink-4">
              The first articles are on their way. In the meantime, the{' '}
              <Link to={routes.setup} className="text-accent-link hover:underline">setup guide</Link>{' '}
              covers every supported device.
            </p>
          ) : (
            <>
              {categories.length > 1 && (
                <div className="mt-12 flex flex-wrap justify-center gap-2">
                  <CategoryChip label="All" on={category === null} onClick={() => setCategory(null)} />
                  {categories.map((c) => (
                    <CategoryChip key={c} label={c} on={category === c} onClick={() => setCategory(c)} />
                  ))}
                </div>
              )}

              {/* Lead article */}
              {lead && (
                <Reveal className="mt-12 sm:mt-14">
                  <Link
                    to={lead.path}
                    className="card-hover block overflow-hidden p-7 sm:p-9"
                  >
                    <p className="label-accent">{lead.category}</p>
                    <h2 className="mt-3 font-display font-extrabold leading-tight text-ink"
                        style={{ fontSize: 'clamp(24px, 3.4vw, 34px)' }}>
                      {lead.title}
                    </h2>
                    <p className="mt-4 max-w-[640px] text-[16px] leading-relaxed text-ink-3">{lead.description}</p>
                    <p className="mt-5 text-[13px] text-ink-4">
                      {fmtDate(lead.date)} · {lead.readingMinutes} min read
                    </p>
                  </Link>
                </Reveal>
              )}

              {rest.length > 0 && (
                <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {rest.map((p, i) => (
                    <Reveal key={p.slug} delay={i} shift={16}>
                      <Link to={p.path} className="card-hover flex h-full flex-col p-6">
                        <p className="label-accent">{p.category}</p>
                        <h3 className="mt-2.5 font-display text-[18.5px] font-extrabold leading-snug text-ink">
                          {p.title}
                        </h3>
                        <p className="mt-3 flex-1 text-[14.5px] leading-relaxed text-ink-3">{p.description}</p>
                        <p className="mt-5 text-[12.5px] text-ink-4">
                          {fmtDate(p.date)} · {p.readingMinutes} min read
                        </p>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}

function CategoryChip({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`min-h-[40px] rounded-full border px-4 font-display text-[13.5px] font-semibold transition-colors ${
        on ? 'border-accent bg-accent/[.14] text-accent' : 'border-white/[.12] text-ink-3 hover:border-white/25 hover:text-ink'
      }`}
    >
      {label}
    </button>
  );
}
