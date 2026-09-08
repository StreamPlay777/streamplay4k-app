import { useEffect, useMemo, useRef, useState } from 'react';
import {
  TERMS, MAX_DEVICES, DEFAULT_TERM_ID, DEFAULT_DEVICES,
  quote, money,
  PLAN_HIGHLIGHTS, PLAN_FEATURES, TRUST_POINTS, INVOICE_PAYMENT_METHODS,
} from '../../data/pricing';
import { track } from '../../lib/analytics';
import OrderFlow from './OrderFlow';
import OrderBar from './OrderBar';
import Check from './Check';
import PaymentMarks from '../PaymentMarks';

/**
 * Pricing and quick order — presented as one configurator rather than two
 * floating cards.
 *
 * WHAT THIS COMPONENT DOES NOT DO
 * It does not calculate anything. Every figure on screen comes from quote() in
 * data/pricing.ts, including the per-device totals, which previously repeated
 * the 50% formula inline. There is now exactly one implementation of the
 * pricing rule in the codebase.
 *
 * LAYOUT
 * One outer surface, split by a hairline. The left column is the configurator
 * and stays put through the whole flow; only the right column changes between
 * features, details and confirm. Both columns stretch to the same height, so
 * the outer box never resizes as the panel swaps — the thing that made the old
 * version feel like two unrelated cards.
 */
export default function PricingOrder() {
  const [termId, setTermId] = useState(DEFAULT_TERM_ID);
  const [devices, setDevices] = useState(DEFAULT_DEVICES);
  const [ordering, setOrdering] = useState(false);
  const ctaRef = useRef<HTMLButtonElement>(null);

  /**
   * Flag the document while the order form is on screen, so the global
   * WhatsApp button hides rather than sitting over the form's controls.
   */
  useEffect(() => {
    if (!ordering) return;
    document.documentElement.dataset.orderOpen = 'true';
    return () => { delete document.documentElement.dataset.orderOpen; };
  }, [ordering]);

  const q = useMemo(() => quote(termId, devices), [termId, devices]);

  /** Per-month equivalent for each term at one device, straight from quote(). */
  const termMonthly = useMemo(
    () => Object.fromEntries(TERMS.map((t) => [t.id, quote(t.id, 1).perMonthCents])),
    [],
  );

  /**
   * Best value is derived, not asserted: the term with the lowest cost per
   * month. With the locked ladder that is 12 months, but deriving it means the
   * badge can never contradict the prices.
   */
  const bestValueId = useMemo(
    () => TERMS.reduce((best, t) =>
      t.baseCents / t.months < best.baseCents / best.months ? t : best, TERMS[0]).id,
    [],
  );

  /** Total for n devices on the current term — the engine, not a copy of it. */
  const totalFor = (n: number) => quote(termId, n).totalCents;

  const pickTerm = (id: string) => { setTermId(id); track('select_plan', { term: id, devices }); };
  const pickDevices = (n: number) => { setDevices(n); track('select_devices', { term: termId, devices: n }); };
  const beginOrder = () => {
    setOrdering(true);
    track('begin_order', { term: termId, devices, total: q.totalCents / 100 });
  };

  /** From the sticky bar: bring the section back into view, then open the flow. */
  const beginFromBar = () => {
    document.getElementById('pricing')?.scrollIntoView({ block: 'start' });
    setOrdering(true);
    track('begin_order', { term: termId, devices, total: q.totalCents / 100, from: 'sticky-bar' });
  };

  return (
    <section id="pricing" className="section amb amb-warm bg-bg">
      <div className="mx-auto max-w-shell">
        {/* Header */}
        <div className="mx-auto max-w-[720px] text-center">
          <p className="eyebrow">Simple pricing</p>
          <h2
            className="mt-4 font-display font-extrabold leading-[1.02] text-ink"
            style={{ fontSize: 'clamp(32px, 5vw, 52px)' }}
          >
            One plan.
            <br />
            <span className="text-grad">Pick your term.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-[560px] text-[16.5px] leading-relaxed text-ink-3">
            Choose your subscription length and the number of devices you want to use.
          </p>
        </div>

        {/* ── One surface, two columns ─────────────────────────────────── */}
        <div className="config-shell mt-11 grid overflow-hidden rounded-2xl lg:grid-cols-[1.34fr_1fr]">
          {/* ── Left: configurator. Never moves. ───────────────────────── */}
          <div className="p-5 sm:p-7 lg:p-8">
            {/* Compact summary, mobile only, once the order flow is open —
                so the form is reachable without scrolling past the whole
                configurator. */}
            {ordering && (
              <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-white/[.09] bg-white/[.03] px-4 py-3.5 lg:hidden">
                <div className="min-w-0">
                  <p className="font-display text-[14.5px] font-bold text-ink">
                    {q.term.label} · {q.devices} {q.devices === 1 ? 'device' : 'devices'}
                  </p>
                  <p className="mt-0.5 text-[12.5px] text-ink-4">≈ {money(q.perMonthCents)}/mo</p>
                </div>
                <p className="nums flex-none font-display text-[20px] font-extrabold text-ink">
                  {money(q.totalCents)}
                </p>
              </div>
            )}

            <div className={ordering ? 'max-lg:hidden' : ''}>
              {/* Term */}
              <fieldset>
                <legend className="text-[11px] font-bold uppercase tracking-[.16em] text-ink-4">
                  Subscription
                </legend>
                <div className="mt-3.5 grid gap-2.5 sm:grid-cols-3">
                  {TERMS.map((t) => {
                    const on = t.id === termId;
                    const best = t.id === bestValueId;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => pickTerm(t.id)}
                        aria-pressed={on}
                        // Explicit, so the name reads "12 Months, $99.99, best
                        // value" rather than leading with the badge, which sits
                        // first in the DOM because it is positioned.
                        aria-label={`${t.label}, ${money(t.baseCents)}, ${money(termMonthly[t.id])} per month${best ? ', best value' : ''}`}
                        className={`term-tile relative rounded-xl border p-4 pt-5 text-left ${
                          on ? 'term-tile-on border-accent' : 'border-white/[.1] bg-white/[.02] hover:border-white/[.28]'
                        }`}
                      >
                        {best && (
                          <span
                            className={`absolute -top-2 left-4 rounded-full px-2 py-[3px] text-[9.5px] font-extrabold uppercase tracking-[.1em] ${
                              on ? 'bg-accent text-white' : 'bg-white/[.12] text-ink-2'
                            }`}
                          >
                            Best value
                          </span>
                        )}
                        {/* Selection carries a mark as well as colour. */}
                        {on && (
                          <span className="absolute right-3 top-3 text-accent" aria-hidden="true">
                            <Check />
                          </span>
                        )}
                        <span className="block font-display text-[14px] font-bold text-ink">{t.label}</span>
                        <span className="nums mt-1.5 block font-display text-[25px] font-extrabold leading-none text-ink">
                          {money(t.baseCents)}
                        </span>
                        <span className="nums mt-1.5 block text-[12px] text-ink-4">
                          {money(termMonthly[t.id])}/mo
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="mt-3 text-[12.5px] text-ink-4">One-time payment. No subscription is set up.</p>
              </fieldset>

              {/* Devices — the resulting total under each, not "+$X" */}
              <fieldset className="mt-7 border-t border-white/[.09] pt-6">
                <legend className="text-[11px] font-bold uppercase tracking-[.16em] text-ink-4">
                  Devices
                </legend>
                <div className="mt-3.5 grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {Array.from({ length: MAX_DEVICES }, (_, i) => i + 1).map((n) => {
                    const on = n === devices;
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => pickDevices(n)}
                        aria-pressed={on}
                        aria-label={`${n} ${n === 1 ? 'device' : 'devices'}, ${money(totalFor(n))}`}
                        className={`device-tile min-h-[62px] rounded-xl border px-2 py-2.5 ${
                          on
                            ? 'device-tile-on border-accent'
                            : 'border-white/[.12] bg-white/[.02] text-ink-2 hover:border-white/[.28]'
                        }`}
                      >
                        <span className="block font-display text-[17px] font-extrabold leading-none">{n}</span>
                        <span className={`nums mt-1.5 block text-[11px] ${on ? 'text-white/85' : 'text-ink-4'}`}>
                          {n === 1 ? 'Included' : money(totalFor(n))}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="mt-3 text-[12.5px] leading-relaxed text-ink-4">
                  1 device included. Each additional device adds 50% of the base plan price.
                </p>
              </fieldset>
            </div>

            {/* Price + CTA */}
            <div className={`border-t border-white/[.09] pt-6 ${ordering ? 'mt-0 max-lg:hidden' : 'mt-7'}`}>
              <p className="sr-only" aria-live="polite" aria-atomic="true">
                Total {money(q.totalCents)} for {q.term.label}, {q.devices}{' '}
                {q.devices === 1 ? 'device' : 'devices'}
              </p>
              <div className="flex flex-wrap items-end gap-x-4 gap-y-1">
                <span className="nums font-display text-[42px] font-extrabold leading-none tracking-[-.03em] text-ink sm:text-[52px]">
                  {money(q.totalCents)}
                </span>
                <span className="nums pb-1.5 text-[14px] text-ink-3">≈ {money(q.perMonthCents)}/mo</span>
              </div>
              <p className="mt-2 text-[14px] text-ink-3">
                {q.term.label.toLowerCase()} · {q.devices} {q.devices === 1 ? 'device' : 'devices'}
              </p>

              {q.extraDevicesCents > 0 && (
                <dl className="nums mt-4 max-w-[320px] space-y-1.5 text-[13.5px]">
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-4">Base plan</dt>
                    <dd className="text-ink-2">{money(q.baseCents)}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-4">
                      {q.devices - 1} extra {q.devices - 1 === 1 ? 'device' : 'devices'}
                    </dt>
                    <dd className="text-ink-2">{money(q.extraDevicesCents)}</dd>
                  </div>
                  <div className="flex justify-between gap-4 border-t border-white/[.12] pt-1.5">
                    <dt className="font-semibold text-ink">Total</dt>
                    <dd className="font-semibold text-ink">{money(q.totalCents)}</dd>
                  </div>
                </dl>
              )}

              {!ordering && (
                <button ref={ctaRef} type="button" onClick={beginOrder} className="btn-accent group mt-6 w-full">
                  Order now
                  <span className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden="true">
                    →
                  </span>
                </button>
              )}
            </div>

            {/* Trust + invoice payment options */}
            <div className={`border-t border-white/[.09] pt-5 ${ordering ? 'mt-6 max-lg:hidden' : 'mt-6'}`}>
              <ul className="grid gap-2 sm:grid-cols-2">
                {TRUST_POINTS.map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-[13px] text-ink-3">
                    <span className="mt-[3px] flex-none text-accent"><Check /></span>
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-[11px] font-bold uppercase tracking-[.14em] text-ink-5">
                Payment methods available on your invoice
              </p>
              <PaymentMarks methods={INVOICE_PAYMENT_METHODS} className="mt-3" />
            </div>
          </div>

          {/* ── Right: features, or the order flow. Hairline divider. ─── */}
          <div className="config-panel p-5 sm:p-7 lg:p-8">
            {ordering ? (
              <OrderFlow q={q} onCancel={() => setOrdering(false)} />
            ) : (
              // h-full + mt-auto on the closing note: the left column is the
              // taller of the two, so without this the feature list ended
              // partway down and left a void under it.
              <div className="panel-swap flex h-full flex-col">
                <h3 className="font-display text-[18px] font-bold text-ink">Included with every plan</h3>

                {/* The two catalogue figures carry more weight than the rest —
                    they are the first thing anyone reads here. */}
                <div className="mt-5 grid grid-cols-2 gap-2.5">
                  {PLAN_HIGHLIGHTS.map((h) => (
                    <div key={h.label} className="rounded-xl border border-white/[.08] bg-white/[.03] px-4 py-4">
                      <p className="nums text-grad font-display text-[22px] font-extrabold leading-none">
                        {h.value}
                      </p>
                      <p className="mt-1.5 text-[12.5px] leading-snug text-ink-3">{h.label}</p>
                    </div>
                  ))}
                </div>

                <ul className="mt-5 space-y-[11px]">
                  {PLAN_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <span className="mt-[3px] flex-none text-accent"><Check /></span>
                      <span className="text-[13.5px] leading-snug text-ink-2">{f}</span>
                    </li>
                  ))}
                </ul>

                {/* mt-auto rather than a fixed gap: the left column is the
                    taller of the two, so this settles at the bottom of the
                    panel instead of leaving a void beneath it. */}
                <p className="mt-auto border-t border-white/[.07] pt-5 text-[12.5px] leading-relaxed text-ink-4">
                  Everything above is included whichever term you choose. The term changes the price,
                  never the line-up.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <OrderBar q={q} ctaRef={ctaRef} onOrder={beginFromBar} hidden={ordering} />
    </section>
  );
}
