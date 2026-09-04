import { Link } from 'react-router-dom';
import { terms, screenOptions, DISCOUNT_BADGE, includedFeatures } from '../data/plans';
import { usePlan } from '../hooks/usePlan';
import { site } from '../data/site';
import { Tick } from './ui';

/**
 * The plan card. Reads and writes the shared plan state, so changing the term
 * here also updates home step 01 and the Pricing page.
 */
export function PlanCard({ ctaTo = '/contact' }: { ctaTo?: string }) {
  const { term, screens, setTerm, setScreens, total, monthly, wasPrice } = usePlan();

  return (
    <div
      className="rounded-[18px] border border-accent/[.28] p-8"
      style={{ background: 'linear-gradient(180deg, rgba(255,43,42,.07), rgba(255,255,255,.02))' }}
    >
      <h3 className="font-display text-[24px] font-extrabold text-ink">{site.name} Complete</h3>
      <p className="mt-1.5 text-[15px] text-ink-3">Everything we carry, on every device you own.</p>

      <div className="label mt-7">Choose your term</div>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {terms.map((t) => {
          const on = t.months === term.months;
          return (
            <button
              key={t.months}
              onClick={() => setTerm(t)}
              className={`rounded-[10px] border px-1.5 py-2.5 text-center transition-colors ${
                on ? 'border-accent bg-accent/[.14]' : 'border-white/10 bg-white/[.02] hover:border-white/20'
              }`}
            >
              <span className={`block font-display text-[14px] font-bold ${on ? 'text-white' : 'text-ink-2'}`}>
                {t.label}
              </span>
              <span className={`block text-[11.5px] ${on ? 'text-accent-soft' : 'text-ink-4'}`}>{t.note}</span>
            </button>
          );
        })}
      </div>

      {/* Price */}
      <div className="mt-7 flex flex-wrap items-end gap-3">
        <span className="font-display text-[62px] font-extrabold leading-none tracking-[-.04em] text-ink">
          ${total}
        </span>
        <span className="pb-2 text-[14px] text-ink-3">≈ ${monthly}/mo</span>
      </div>
      <div className="mt-2.5 flex items-center gap-2.5">
        <span className="text-[14px] text-ink-4 line-through">${wasPrice}</span>
        <span className="rounded-[5px] bg-accent-gradient px-2 py-1 font-display text-[11.5px] font-extrabold uppercase text-white">
          {DISCOUNT_BADGE}
        </span>
      </div>
      <p className="mt-2.5 text-[13.5px] text-ink-4">
        Billed once for {term.label.toLowerCase()}. No auto-renewal surprises.
      </p>

      {/* Simultaneous screens */}
      <div className="mt-6 rounded-xl border border-white/[.09] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="font-display text-[15px] font-bold text-ink">Simultaneous screens</div>
            <div className="text-[13px] text-ink-4">How many can play at the same time</div>
          </div>
          <div className="flex gap-1.5">
            {screenOptions.map((n) => (
              <button
                key={n}
                onClick={() => setScreens(n)}
                aria-label={`${n} screen${n > 1 ? 's' : ''}`}
                className={`h-9 w-9 rounded-[9px] font-display text-[14px] font-bold transition-colors ${
                  n === screens ? 'bg-accent text-white' : 'border border-white/10 text-ink-2 hover:border-white/25'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Link to={ctaTo} className="btn-accent mt-6 w-full">
        Get {site.name} — ${total}
      </Link>
      <p className="mt-3 text-center text-[13px] text-ink-4">
        Secure checkout · Money-back guarantee · Login emailed instantly
      </p>
    </div>
  );
}

/** The twelve included lines, shown beside the plan card. */
export function FeaturesCard() {
  return (
    <div className="rounded-[18px] border border-white/[.08] bg-white/[.015] p-8">
      <div className="label">Included on every term</div>
      <ul className="mt-5">
        {includedFeatures.map((f, i) => (
          <li
            key={f}
            className={`flex items-start gap-3 py-3 ${i > 0 ? 'border-t border-white/[.05]' : ''}`}
          >
            <Tick />
            <span className="text-[15px] leading-snug text-ink-2">{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
