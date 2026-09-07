import { site } from '../data/site';
import PricingOrder from '../components/pricing/PricingOrder';
import SavingsSection from '../components/SavingsSection';
import { SectionHeading } from '../components/ui';
import Faq from '../components/Faq';

export default function Pricing() {

  return (
    <>
      {/* Page header */}
      <section className="px-7 pb-[46px] pt-[74px]">
        <div className="mx-auto max-w-shell">
          <div className="eyebrow">US IPTV pricing</div>
          <h1
            className="mt-4 font-display font-extrabold leading-none text-ink"
            style={{ fontSize: 'clamp(38px, 6.5vw, 66px)' }}
          >
            One plan.
            <br />
            <span className="text-grad">Pick your term.</span>
          </h1>
          <p className="mt-6 max-w-[620px] text-[18px] leading-relaxed text-ink-3">
            Choose the term that suits you and how many devices stream at once. Live TV, sport, films,
            series and international entertainment in HD and 4K.
          </p>
          <p className="mt-5 text-[14px] text-ink-4">
            No hidden fees · Fast activation · 24/7 support
          </p>
        </div>
      </section>

      {/* Section 05 — the one pricing + order experience, shared with the homepage */}
      <PricingOrder />

      {/* Same cost comparison as the homepage — one component, not a copy */}
      <SavingsSection id="savings" />

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
