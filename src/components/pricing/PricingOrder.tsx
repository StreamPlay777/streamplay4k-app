import { useMemo, useState } from 'react';
import {
  TERMS, MAX_DEVICES, DEFAULT_TERM_ID, DEFAULT_DEVICES,
  quote, money, savingsPerMonth,
  PLAN_FEATURES, TRUST_POINTS, INVOICE_PAYMENT_METHODS,
} from '../../data/pricing';
import { track } from '../../lib/analytics';
import OrderFlow from './OrderFlow';
import Check from './Check';

/**
 * Section 05 — pricing and quick order flow.
 *
 * One service; the customer picks a term and a device count. The order panel
 * opens in place of the feature list rather than on a new page, so the
 * selection stays visible throughout (spec §11).
 */
export default function PricingOrder() {
  const [termId, setTermId] = useState(DEFAULT_TERM_ID);
  const [devices, setDevices] = useState(DEFAULT_DEVICES);
  const [ordering, setOrdering] = useState(false);

  const q = useMemo(() => quote(termId, devices), [termId, devices]);

  const pickTerm = (id: string) => {
    setTermId(id);
    track('select_plan', { term: id, devices });
  };
  const pickDevices = (n: number) => {
    setDevices(n);
    track('select_devices', { term: termId, devices: n });
  };
  const beginOrder = () => {
    setOrdering(true);
    track('begin_order', { term: termId, devices, total: q.totalCents / 100 });
  };

  return (
    <section id="pricing" className="bg-bg-alt px-5 py-20 sm:px-7 sm:py-[110px]">
      <div className="mx-auto max-w-shell">
        {/* Header (spec §3) */}
        <div className="mx-auto max-w-[720px] text-center">
          <p className="text-[12px] font-bold uppercase tracking-[.18em] text-ink-4">Simple pricing</p>
          <h2
            className="mt-4 font-display font-extrabold leading-[1.02] text-ink"
            style={{ fontSize: 'clamp(32px, 5vw, 52px)' }}
          >
            One plan.
            <br />
            <span className="text-accent">Pick your term.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-[560px] text-[16.5px] leading-relaxed text-ink-3">
            Choose your subscription length and the number of devices you want to use.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-[1.15fr_1fr] lg:gap-6">
          {/* ── Left: selection + price ─────────────────────────────── */}
          <div className="rounded-2xl border border-white/[.1] bg-white/[.02] p-5 sm:p-7">
            {/* Term */}
            <fieldset>
              <legend className="text-[11px] font-bold uppercase tracking-[.16em] text-ink-4">
                Subscription
              </legend>
              <div className="mt-3.5 grid gap-2.5 sm:grid-cols-3">
                {TERMS.map((t) => {
                  const on = t.id === termId;
                  const saving = savingsPerMonth(t);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => pickTerm(t.id)}
                      aria-pressed={on}
                      className={`relative rounded-xl border p-4 text-left transition-colors ${
                        on
                          ? 'border-accent bg-accent/[.12]'
                          : 'border-white/[.1] bg-white/[.02] hover:border-white/25'
                      }`}
                    >
                      {/* Selected state carries a mark as well as colour (spec §6) */}
                      {on && (
                        <span className="absolute right-3 top-3 text-accent" aria-hidden="true">
                          <Check />
                        </span>
                      )}
                      <span className="block font-display text-[15px] font-bold text-ink">{t.label}</span>
                      <span className="nums mt-1.5 block font-display text-[24px] font-extrabold leading-none text-ink">
                        {money(t.baseCents)}
                      </span>
                      <span className="mt-1.5 block text-[12px] text-ink-4">
                        {saving > 0 ? `Save ${money(saving)}/mo vs 3 months` : 'One-time payment'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Devices */}
            <fieldset className="mt-8 border-t border-white/[.09] pt-7">
              <legend className="text-[11px] font-bold uppercase tracking-[.16em] text-ink-4">
                Devices
              </legend>
              <div className="mt-3.5 flex flex-wrap gap-2">
                {Array.from({ length: MAX_DEVICES }, (_, i) => i + 1).map((n) => {
                  const on = n === devices;
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => pickDevices(n)}
                      aria-pressed={on}
                      aria-label={`${n} ${n === 1 ? 'device' : 'devices'}`}
                      className={`min-h-[48px] min-w-[56px] flex-1 rounded-xl border px-3 py-2 transition-colors sm:flex-none sm:px-5 ${
                        on
                          ? 'border-accent bg-accent text-white'
                          : 'border-white/[.12] bg-white/[.02] text-ink-2 hover:border-white/25'
                      }`}
                    >
                      <span className="block font-display text-[17px] font-extrabold leading-none">{n}</span>
                      <span className={`mt-1 block text-[10.5px] ${on ? 'text-white/80' : 'text-ink-4'}`}>
                        {n === 1 ? 'included' : `+${money(Math.round(q.baseCents * 0.5 * (n - 1)))}`}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-[12.5px] text-ink-4">
                1 device included. Each additional device adds 50% of the base plan price.
              </p>
            </fieldset>

            {/* Price (spec §8) */}
            <div className="mt-8 border-t border-white/[.09] pt-7">
              <p className="sr-only" aria-live="polite" aria-atomic="true">
                Total {money(q.totalCents)} for {q.term.label}, {q.devices}{' '}
                {q.devices === 1 ? 'device' : 'devices'}
              </p>
              <div className="flex flex-wrap items-end gap-x-4 gap-y-1">
                <span className="nums font-display text-[46px] font-extrabold leading-none tracking-[-.03em] text-ink sm:text-[56px]">
                  {money(q.totalCents)}
                </span>
                <span className="pb-1.5 text-[14px] text-ink-3">≈ {money(q.perMonthCents)}/mo</span>
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
                <button type="button" onClick={beginOrder} className="btn-accent mt-7 w-full">
                  Order now
                </button>
              )}
            </div>

            {/* Trust + invoice payment options (spec §10) */}
            <div className="mt-7 border-t border-white/[.09] pt-6">
              <ul className="space-y-2">
                {TRUST_POINTS.map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-[13.5px] text-ink-3">
                    <span className="mt-[3px] flex-none text-accent"><Check /></span>
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-[11px] font-bold uppercase tracking-[.14em] text-ink-5">
                Payment methods available on your invoice
              </p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {INVOICE_PAYMENT_METHODS.map((m) => (
                  <span key={m} className="rounded-md border border-white/[.12] px-2.5 py-1 text-[11.5px] text-ink-4">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: features, or the order flow once opened ───────── */}
          <div>
            {ordering ? (
              <OrderFlow q={q} onCancel={() => setOrdering(false)} />
            ) : (
              <div className="rounded-2xl border border-white/[.08] bg-white/[.015] p-5 sm:p-7">
                <h3 className="font-display text-[19px] font-bold text-ink">Included with every plan</h3>
                <ul className="mt-5">
                  {PLAN_FEATURES.map((f, i) => (
                    <li
                      key={f}
                      className={`flex items-start gap-3 py-3 ${i > 0 ? 'border-t border-white/[.05]' : ''}`}
                    >
                      <span className="mt-[2px] flex-none text-accent"><Check /></span>
                      <span className="text-[14.5px] leading-snug text-ink-2">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
