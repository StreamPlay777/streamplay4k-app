import { Link } from 'react-router-dom';
import type { LegalDoc } from '../data/legal';
import { routes } from '../data/site';
import Seo from './Seo';
import { pageSeo } from '../data/seo';

/**
 * Shared layout for the five legal documents.
 *
 * Deliberately reads as a document, not a landing page: one narrow measure,
 * generous line height, real headings, no cards, no CTAs. The only accent is
 * the section rules and the contents list.
 */
export default function LegalPage({ doc, path }: { doc: LegalDoc; path: string }) {
  const seo = pageSeo[path];
  return (
    <>
      {/* Structured data lives in data/seo.ts so the pre-rendered HTML and the
          client render emit exactly the same graph. */}
      <Seo seo={seo} />

      <section className="section bg-bg">
        <div className="mx-auto max-w-[760px]">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="text-[12.5px] text-ink-4">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li><Link to={routes.home} className="transition-colors hover:text-accent-link">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-ink-3">{doc.title}</li>
            </ol>
          </nav>

          <h1
            className="mt-6 font-display font-extrabold leading-[1.05] text-ink"
            style={{ fontSize: 'clamp(30px, 4.6vw, 46px)' }}
          >
            {doc.title}
          </h1>
          <p className="mt-2.5 text-[13px] text-ink-4">Last updated: {doc.updated}</p>
          <p className="mt-6 text-[17px] leading-relaxed text-ink-2">{doc.intro}</p>

          {/* Contents */}
          <nav aria-label="On this page" className="mt-10 rounded-2xl border border-line bg-raise p-6">
            <h2 className="font-display text-[12px] font-extrabold uppercase tracking-[.16em] text-ink-4">
              On this page
            </h2>
            <ol className="mt-4 grid gap-2 sm:grid-cols-2">
              {doc.sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-[14.5px] text-ink-3 transition-colors hover:text-accent-link">
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Body */}
          <div className="mt-12">
            {doc.sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-28 border-t border-line py-9 first:border-t-0 first:pt-0">
                <h2 className="font-display text-[21px] font-extrabold leading-tight text-ink sm:text-[24px]">
                  {s.heading}
                </h2>
                {s.blocks.map((b, i) =>
                  b.kind === 'p' ? (
                    <p key={i} className="mt-4 text-[16px] leading-[1.75] text-ink-3">{b.text}</p>
                  ) : (
                    <ul key={i} className="mt-4 space-y-2.5">
                      {b.items?.map((item) => (
                        <li key={item} className="flex gap-3 text-[16px] leading-[1.7] text-ink-3">
                          <span aria-hidden="true" className="mt-[10px] h-[5px] w-[5px] flex-none rounded-full bg-accent/70" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ),
                )}
              </section>
            ))}
          </div>

          <p className="mt-12 border-t border-line pt-8 text-[14px] leading-relaxed text-ink-4">
            This page is part of our{' '}
            <Link to={routes.terms} className="text-accent-link hover:underline">Terms of Service</Link>,{' '}
            <Link to={routes.privacy} className="text-accent-link hover:underline">Privacy Policy</Link>,{' '}
            <Link to={routes.refund} className="text-accent-link hover:underline">Refund Policy</Link>,{' '}
            <Link to={routes.cookies} className="text-accent-link hover:underline">Cookie Policy</Link> and{' '}
            <Link to={routes.dmca} className="text-accent-link hover:underline">DMCA</Link> set.
          </p>
        </div>
      </section>
    </>
  );
}
