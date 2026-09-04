import { site } from '../data/site';
import { usePlan } from '../hooks/usePlan';
import { PlanCard, FeaturesCard } from '../components/PlanCard';
import { SectionHeading } from '../components/ui';
import Faq from '../components/Faq';
import Receipt from '../components/Receipt';
import { basketMonthly, basketYearly, smallPrint } from '../data/receipt';

export default function Pricing() {
  const { monthly, term } = usePlan();

  return (
    <>
      {/* Page header */}
      <section className="px-7 pb-[46px] pt-[74px]">
        <div className="mx-auto max-w-shell">
          <div className="label-accent">US IPTV pricing</div>
          <h1
            className="mt-4 font-display font-extrabold leading-none text-ink"
            style={{ fontSize: 'clamp(38px, 6.5vw, 66px)' }}
          >
            One plan.
            <br />
            <span className="text-accent">Pick your term.</span>
          </h1>
          <p className="mt-6 max-w-[620px] text-[18px] leading-relaxed text-ink-3">
            Choose the term that suits you and how many devices stream at once. Live TV, sport, films,
            series and international entertainment in HD and 4K.
          </p>
          <p className="mt-5 text-[14px] text-ink-4">
            From <strong className="font-semibold text-ink">${monthly}</strong>/month over {term.label.toLowerCase()}
            {' '}· No hidden fees · Fast activation · 24/7 support
          </p>
        </div>
      </section>

      {/* Plan + features */}
      <section className="px-7 pb-[100px]">
        <div className="mx-auto grid max-w-shell gap-6 lg:grid-cols-2">
          <PlanCard ctaTo="/contact" />
          <FeaturesCard />
        </div>
      </section>

      {/* The receipt argument, repeated for visitors landing straight on Pricing */}
      <section className="px-7 py-[100px]" style={{ background: 'linear-gradient(180deg, #06080F, #080B16)' }}>
        <div className="mx-auto grid max-w-shell items-start gap-16 lg:grid-cols-[400px_1fr] lg:gap-[88px]">
          <div className="mx-auto w-full max-w-[400px]">
            <Receipt />
          </div>
          <div>
            <div className="label-accent">Let's do the math</div>
            <h2 className="mt-4 font-display font-extrabold leading-none text-ink" style={{ fontSize: 'clamp(36px, 5.5vw, 56px)' }}>
              You save
              <br />
              <span className="text-accent">${(basketYearly - 108).toLocaleString('en-US', { maximumFractionDigits: 0 })}</span> a year.
            </h2>
            <p className="mt-6 max-w-[520px] text-[17.5px] leading-relaxed text-ink-3">
              Six services at ${basketMonthly.toFixed(2)} a month, billed seventy-two times a year.{' '}
              <strong className="font-semibold text-ink">One subscription replaces all of it.</strong>
            </p>
            <p className="mt-8 max-w-[520px] text-[12px] leading-relaxed text-ink-5">{smallPrint}</p>
          </div>
        </div>
      </section>

      {/* Page FAQ */}
      <section className="bg-bg px-7 py-[100px]">
        <div className="mx-auto max-w-[860px]">
          <SectionHeading title="Questions" size={44} />
          <div className="mt-10">
            <Faq />
          </div>
          <p className="mt-10 text-center text-[14px] text-ink-4">
            Still unsure? Live chat is staffed 24/7 — or email {site.email}.
          </p>
        </div>
      </section>
    </>
  );
}
