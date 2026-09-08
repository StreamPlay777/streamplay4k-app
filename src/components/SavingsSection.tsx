import { Link } from 'react-router-dom';
import Receipt from './Receipt';
import {
  basket, basketMonthlyCents, basketYearlyCents, paymentsPerYear,
  ourMonthlyCents, ourYearlyCents, savedMonthlyCents, savedYearlyCents,
  smallPrint,
} from '../data/competitors';
import { site } from '../data/site';

const money = (c: number) =>
  '$' + (c / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const round = (c: number) =>
  '$' + Math.round(c / 100).toLocaleString('en-US');

/**
 * Cost comparison — the receipt and the maths beside it.
 *
 * Extracted so the homepage and /pricing render the same component rather than
 * two copies that can drift apart. Every number derives from
 * src/data/competitors.ts, which derives our side from the locked pricing.
 */
export default function SavingsSection({ id = 'savings' }: { id?: string }) {
  const rows = [
    {
      label: `Now · ${basket.length} subscriptions`,
      monthly: money(basketMonthlyCents),
      yearly: money(basketYearlyCents),
    },
    { label: site.name, monthly: money(ourMonthlyCents), yearly: money(ourYearlyCents), bold: true },
    {
      label: 'You save',
      monthly: '+' + money(savedMonthlyCents),
      yearly: '+' + money(savedYearlyCents),
      accent: true,
    },
  ];

  return (
    <section
      id={id}
      className="section"
      style={{ background: 'linear-gradient(180deg, var(--bg), var(--bg-alt))' }}
    >
      <div className="mx-auto grid max-w-shell items-start gap-12 lg:grid-cols-[400px_minmax(0,1fr)] lg:gap-[80px]">
        {/* Receipt */}
        <div className="mx-auto w-full min-w-0 max-w-[400px]">
          <Receipt />
        </div>

        {/* The maths */}
        <div className="min-w-0">
          <p className="eyebrow">Let's do the math</p>
          <h2
            className="mt-4 font-display font-extrabold leading-[1.02] text-ink"
            style={{ fontSize: 'clamp(34px, 5.6vw, 60px)' }}
          >
            You save
            <br />
            <span className="text-grad">{round(savedYearlyCents)}</span> a year.
          </h2>

          <p className="mt-6 max-w-[540px] text-[16.5px] leading-relaxed text-ink-3 sm:text-[17.5px]">
            {basket.length} subscriptions. {basket.length} logins. {paymentsPerYear} payments a year.{' '}
            <strong className="font-semibold text-ink">Why keep paying month after month?</strong>
          </p>

          {/* Comparison table */}
          <div className="mt-9">
            <div className="grid grid-cols-[minmax(0,1fr)_64px_74px] gap-2 pb-3 min-[400px]:grid-cols-[minmax(0,1fr)_100px_110px] sm:grid-cols-[minmax(0,1fr)_140px_150px]">
              <span />
              <span className="text-right text-[10.5px] font-bold uppercase tracking-[.14em] text-ink-4 sm:text-[11px]">
                Monthly
              </span>
              <span className="text-right text-[10.5px] font-bold uppercase tracking-[.14em] text-ink-4 sm:text-[11px]">
                Yearly
              </span>
            </div>
            {rows.map((r) => (
              <div
                key={r.label}
                className={`grid grid-cols-[minmax(0,1fr)_64px_74px] gap-2 py-4 min-[400px]:grid-cols-[minmax(0,1fr)_100px_110px] sm:grid-cols-[minmax(0,1fr)_140px_150px] ${
                  r.accent ? 'border-t-2 border-accent' : 'border-t border-line-2'
                }`}
              >
                <span className={`min-w-0 text-[13.5px] sm:text-[15px] ${
                  r.accent ? 'font-bold text-accent-ink' : r.bold ? 'font-bold text-ink' : 'text-ink-2'
                }`}>
                  {r.label}
                </span>
                <span className={`nums text-right text-[13px] sm:text-[15px] ${
                  r.accent ? 'font-bold text-accent-ink' : r.bold ? 'font-bold text-ink' : 'text-ink-2'
                }`}>
                  {r.monthly}
                </span>
                <span className={`nums text-right text-[13px] sm:text-[15px] ${
                  r.accent ? 'font-bold text-accent-ink' : r.bold ? 'font-bold text-ink' : 'text-ink-2'
                }`}>
                  {r.yearly}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-8 max-w-[540px] text-[16px] font-semibold leading-relaxed text-ink sm:text-[17px]">
            That's the stack most US households pay for. {site.name} covers the same viewing for one price.
          </p>

          <Link to="/#pricing" className="btn-accent mt-6 w-full sm:w-auto">
            Get {site.name} for {money(ourYearlyCents)} / year
          </Link>

          <p className="mt-6 max-w-[540px] text-[12px] leading-relaxed text-ink-5">{smallPrint}</p>
        </div>
      </div>
    </section>
  );
}
