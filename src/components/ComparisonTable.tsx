import { Link } from 'react-router-dom';
import { comparisonRows, comparisonDisclaimer } from '../data/comparison';
import { site, routes } from '../data/site';
import { SectionHeading } from './ui';
import Reveal from './Reveal';
import Check from './pricing/Check';

/**
 * StreamPlay4K against what a shopper commonly meets elsewhere.
 *
 * Deliberately NOT a price comparison. Every figure here is one we publish and
 * can be held to; the other column describes a market pattern rather than a
 * named rival, and says so underneath. See data/comparison.ts for why.
 *
 * LAYOUT
 * A real <table> from md up, because that is what this is and it is what a
 * screen reader wants. Below md the same rows become stacked cards: a
 * three-column table at 375px is either unreadable or scrolls sideways, and
 * both are worse than repeating a heading per card.
 *
 * The two columns are given different weight on purpose. Ours is the one with
 * the tick, the ink and the surface; the other is quiet grey. The point of the
 * section is answered before anything is read closely.
 */
export default function ComparisonTable({ id }: { id?: string }) {
  return (
    <section id={id} className="section amb amb-cool bg-bg">
      <div className="mx-auto max-w-shell">
        <SectionHeading
          label="Before you choose"
          title={<>How we compare on the things you can <span className="text-grad">check</span></>}
          sub="No invented prices and no names — just the terms we publish, next to what people keep running into when they shop around."
        />

        {/* ── Phones: one card per row ──────────────────────────────────── */}
        <div className="mt-11 space-y-3 md:hidden">
          {comparisonRows.map((r, i) => (
            <Reveal key={r.label} delay={i} shift={12} className="card px-5 py-5">
              <p className="font-display text-[15px] font-bold text-ink">{r.label}</p>
              {r.note && <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-4">{r.note}</p>}

              <div className="mt-4 grid gap-2.5">
                <div className="flex items-start gap-2.5 rounded-xl border border-accent/30 bg-accent/[.07] px-3.5 py-3">
                  <span className="mt-[3px] flex-none text-accent-ink"><Check /></span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-bold uppercase tracking-[.12em] text-accent-ink">
                      {site.name}
                    </span>
                    <span className="mt-0.5 block text-[14px] font-semibold text-ink">{r.ours}</span>
                  </span>
                </div>

                <div className="rounded-xl border border-line bg-raise px-3.5 py-3">
                  <span className="block text-[11px] font-bold uppercase tracking-[.12em] text-ink-5">
                    Commonly elsewhere
                  </span>
                  <span className="mt-0.5 block text-[13.5px] leading-snug text-ink-3">{r.common}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* ── Tablet and up: the real table ─────────────────────────────── */}
        <div className="mt-12 hidden overflow-hidden rounded-2xl border border-line md:block">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">
              {site.name} compared with what shoppers commonly encounter elsewhere
            </caption>
            <thead>
              <tr className="border-b border-line bg-raise">
                <th scope="col" className="px-6 py-4 text-[11.5px] font-bold uppercase tracking-[.14em] text-ink-5">
                  What you are comparing
                </th>
                <th scope="col" className="px-6 py-4 text-[11.5px] font-extrabold uppercase tracking-[.14em] text-accent-ink">
                  {site.name}
                </th>
                <th scope="col" className="px-6 py-4 text-[11.5px] font-bold uppercase tracking-[.14em] text-ink-5">
                  Commonly elsewhere
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((r) => (
                <tr key={r.label} className="border-b border-line last:border-b-0">
                  <th scope="row" className="w-[30%] px-6 py-5 align-top font-normal">
                    <span className="block font-display text-[15px] font-bold text-ink">{r.label}</span>
                    {r.note && (
                      <span className="mt-1 block text-[12.5px] leading-relaxed text-ink-4">{r.note}</span>
                    )}
                  </th>
                  {/* Our column carries a tinted ground the whole way down, so
                      the eye follows one stripe instead of reading row by row. */}
                  <td className="w-[32%] bg-accent/[.06] px-6 py-5 align-top">
                    <span className="flex items-start gap-2.5">
                      <span className="mt-[3px] flex-none text-accent-ink"><Check /></span>
                      <span className="text-[15px] font-semibold text-ink">{r.ours}</span>
                    </span>
                  </td>
                  <td className="px-6 py-5 align-top text-[14px] leading-snug text-ink-3">{r.common}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mx-auto mt-6 max-w-[720px] text-center text-[12.5px] leading-relaxed text-ink-5">
          {comparisonDisclaimer}
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to={routes.refund} className="btn-outline w-full sm:w-auto">Read the refund policy</Link>
          <Link to={routes.terms} className="btn-outline w-full sm:w-auto">Read the terms</Link>
        </div>
      </div>
    </section>
  );
}
