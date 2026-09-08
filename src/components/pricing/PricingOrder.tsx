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
  /**
   * Phones only. While the order form is open the configurator is folded away
   * so the fields are reachable without scrolling past it; tapping the plan
   * summary unfolds it again. The form itself stays mounted throughout, so a
   * change of mind about the term or a device never costs a typed number.
   */
  const [editingPlan, setEditingPlan] = useState(false);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);

  /**
   * Flag the document while the order form is on screen, so the global
   * WhatsApp button hides rather than sitting over the form's controls.
   */
  useEffect(() => {
    if (!ordering) return;
    document.documentElement.dataset.orderOpen = 'true';
    return () => { delete document.documentElement.dataset.orderOpen; };
  }, [ordering]);

  /**
   * Hold the surface at the height it has while the plans are showing.
   *
   * Opening the flow removes the Order button from the left column and swaps a
   * long feature list for a short form, so the box would collapse by about
   * 160px under the visitor's cursor at the exact moment they are reaching for
   * a field. Measured, never guessed, and re-measured whenever the resting
   * layout changes. Applied only from the large breakpoint up (see
   * .config-shell in index.css) — on phones the configurator deliberately
   * folds away and the box is meant to get shorter.
   */
  useEffect(() => {
    const el = shellRef.current;
    if (!el || ordering || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => el.style.setProperty('--shell-rest', `${el.offsetHeight}px`));
    ro.observe(el);
    return () => ro.disconnect();
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

  /**
   * What a term saves against buying the same months in the shortest term,
   * e.g. 12 months at $99.99 against four 3-month plans at $159.96. Straight
   * arithmetic on the published prices — no invented "was" price, no monthly
   * subscription we do not sell.
   */
  const shortest = useMemo(() => TERMS.reduce((a, t) => (t.months < a.months ? t : a), TERMS[0]), []);
  const savingVsShortest = useMemo(() => Object.fromEntries(TERMS.map((t) => {
    const same = Math.round(t.months / shortest.months) * shortest.baseCents;
    return [t.id, t.months > shortest.months ? same - t.baseCents : 0];
  })), [shortest]);

  const pickTerm = (id: string) => { setTermId(id); track('select_plan', { term: id, devices }); };
  const pickDevices = (n: number) => { setDevices(n); track('select_devices', { term: termId, devices: n }); };
  const beginOrder = () => {
    setOrdering(true);
    setEditingPlan(false);
    track('begin_order', { term: termId, devices, total: q.totalCents / 100 });
  };

  /** From the sticky bar: bring the section back into view, then open the flow. */
  const beginFromBar = () => {
    document.getElementById('pricing')?.scrollIntoView({ block: 'start' });
    setOrdering(true);
    setEditingPlan(false);
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
        <div
          ref={shellRef}
          data-ordering={ordering || undefined}
          className="config-shell mt-11 grid overflow-hidden rounded-2xl lg:grid-cols-[1.34fr_1fr]"
        >
          {/* ── Left: configurator. Never moves. ───────────────────────── */}
          <div className="p-5 sm:p-7 lg:p-8">
            {/* Compact summary, mobile only, once the order flow is open —
                so the form is reachable without scrolling past the whole
                configurator. */}
            {ordering && (
              <button
                type="button"
                onClick={() => setEditingPlan((v) => !v)}
                aria-expanded={editingPlan}
                aria-controls="plan-editor"
                className="mb-6 flex w-full items-center justify-between gap-4 rounded-xl border border-white/[.09] bg-white/[.03] px-4 py-3.5 text-left transition-colors hover:border-white/[.2] lg:hidden"
              >
                <span className="min-w-0">
                  <span className="block font-display text-[14.5px] font-bold text-ink">
                    {q.term.label} · {q.devices} {q.devices === 1 ? 'device' : 'devices'}
                  </span>
                  <span className="mt-0.5 flex items-center gap-1.5 text-[12.5px] text-accent">
                    <Chevron open={editingPlan} />
                    {editingPlan ? 'Hide plan options' : 'Change plan or devices'}
                  </span>
                </span>
                <span className="nums flex-none font-display text-[20px] font-extrabold text-ink">
                  {money(q.totalCents)}
                </span>
              </button>
            )}

            <div id="plan-editor" className={ordering && !editingPlan ? 'max-lg:hidden' : ''}>
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
                        aria-label={`${t.label}, ${money(t.baseCents)}, ${money(termMonthly[t.id])} per month${
                          savingVsShortest[t.id] > 0
                            ? `, saves ${money(savingVsShortest[t.id])} against ${shortest.label.toLowerCase()}`
                            : ''
                        }${best ? ', best value' : ''}`}
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
                        {savingVsShortest[t.id] > 0 && (
                          <span className="nums mt-2.5 inline-block rounded-md bg-success/[.13] px-1.5 py-[3px] text-[10.5px] font-bold text-success">
                            Save {money(savingVsShortest[t.id])}
                          </span>
                        )}
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
                        aria-label={`${n} ${n === 1 ? 'device' : 'devices'}, ${
                          n === 1 ? 'included' : `adds ${money(totalFor(n) - totalFor(1))}`
                        }`}
                        className={`device-tile min-h-[62px] rounded-xl border px-2 py-2.5 ${
                          on
                            ? 'device-tile-on border-accent'
                            : 'border-white/[.12] bg-white/[.02] text-ink-2 hover:border-white/[.28]'
                        }`}
                      >
                        <span className="block font-display text-[17px] font-extrabold leading-none">{n}</span>
                        <span className={`nums mt-1.5 block text-[11px] ${on ? 'text-white/85' : 'text-ink-4'}`}>
                          {n === 1 ? 'Included' : `+${money(totalFor(n) - totalFor(1))}`}
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
            <div className={`border-t border-white/[.09] pt-6 ${
              ordering ? `mt-0 ${editingPlan ? 'max-lg:mt-7' : 'max-lg:hidden'}` : 'mt-7'
            }`}>
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

          </div>

          {/* ── Right: features, or the order flow. Hairline divider. ─── */}
          <div className="config-panel p-5 sm:p-7 lg:p-8">
            {ordering ? (
              <div className="flex h-full flex-col">
                <OrderFlow q={q} onCancel={() => setOrdering(false)} />
                <Assurances className="mt-auto pt-7" />
              </div>
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
                <Assurances className="mt-auto pt-7" />

                <p className="mt-5 text-[12.5px] leading-relaxed text-ink-4">
                  Every feature listed here is included whichever term you choose. The term changes
                  the price, never the line-up.
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

/**
 * What you get and what you can pay with — the reassurance that used to sit
 * under the configurator.
 *
 * It belongs beside the decision, not beneath the controls. On the left it
 * competed with the price for attention and pushed the Order button down the
 * page; on the right it reads as the fine print of whatever the panel is
 * showing, which is what it is. Identical in both panel states, so the
 * guarantees do not vanish at the moment someone is deciding to type their
 * number in.
 */
function Assurances({ className = '' }: { className?: string }) {
  return (
    <div className={`border-t border-white/[.07] ${className}`}>
      {/* Line icons rather than the accent tick used by the feature list. The
          two sit next to each other now, and identical ticks would read as one
          twelve-row list instead of features and then guarantees. */}
      <ul className="grid gap-[9px]">
        {TRUST_POINTS.map((t, i) => (
          <li key={t} className="flex items-center gap-2.5 text-[12.5px] text-ink-3">
            <span className="flex-none text-success/85">{ASSURANCE_ICONS[i % ASSURANCE_ICONS.length]}</span>
            {t}
          </li>
        ))}
      </ul>
      <p className="mt-5 text-[11px] font-bold uppercase tracking-[.14em] text-ink-5">
        Payment methods available on your invoice
      </p>
      <PaymentMarks methods={INVOICE_PAYMENT_METHODS} className="mt-3" />
    </div>
  );
}

/**
 * One glyph per guarantee: how fast it starts, the refund window, the support
 * promise. Drawn here rather than pulled from an icon set — three shapes at
 * one weight, no dependency.
 */
const ico = { width: 15, height: 15, viewBox: '0 0 20 20', fill: 'none', stroke: 'currentColor',
              strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

const ASSURANCE_ICONS = [
  // Clock — activation time
  <svg key="clock" {...ico} aria-hidden="true"><circle cx="10" cy="10" r="7.4" /><path d="M10 5.9V10l2.8 1.9" /></svg>,
  // Shield — money-back guarantee
  <svg key="shield" {...ico} aria-hidden="true"><path d="M10 2.6 4.4 4.9v4.4c0 3.4 2.3 6.5 5.6 7.9 3.3-1.4 5.6-4.5 5.6-7.9V4.9Z" /><path d="M7.7 9.9 9.4 11.6l3-3.2" /></svg>,
  // Speech bubble — 24/7 support
  <svg key="chat" {...ico} aria-hidden="true"><path d="M16.6 9.6c0 3.1-2.9 5.6-6.6 5.6a8 8 0 0 1-2-.2l-3.6 1.5.9-3A5.2 5.2 0 0 1 3.4 9.6C3.4 6.5 6.3 4 10 4s6.6 2.5 6.6 5.6Z" /></svg>,
];

/** Small disclosure caret for the phone-only plan summary. */
function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"
      className={`transition-transform duration-200 motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}
    >
      <path d="M3.5 6 8 10.5 12.5 6" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
