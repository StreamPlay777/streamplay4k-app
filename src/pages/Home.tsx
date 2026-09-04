import { Link } from 'react-router-dom';
import { site, heroStats, paymentMethods } from '../data/site';
import { terms } from '../data/plans';
import { usePlan } from '../hooks/usePlan';
import {
  networksRowA, networksRowB,
  whySwitch, deviceTiles, coverageChecklist,
} from '../data/marquees';
import { railA, railB, featured } from '../data/vod';
import { basketMonthly, basketYearly, paymentsPerYear, smallPrint } from '../data/receipt';
import { reviews } from '../data/reviews';
import { SectionHeading, Placeholder, Marquee, TitleMarquee, Tick, Stars } from '../components/ui';
import Poster from '../components/Poster';
import DeviceCard from '../components/DeviceCard';
import Receipt from '../components/Receipt';
import { PlanCard, FeaturesCard } from '../components/PlanCard';
import Faq from '../components/Faq';
import ReviewCard from '../components/ReviewCard';

export default function Home() {
  return (
    <>
      <Hero />
      <StatBar />
      <NetworkWall />
      <CostComparison />
      <OnDemand />
      <PricingSection />
      <DeviceCoverage />
      <WhySwitch />
      <ThreeSteps />
      <Reviews />
      <FaqSection />
      <ClosingCta />
    </>
  );
}

/* ── 1.1 Hero ──────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden px-7 pt-[92px]">
      {/* Decorative layers, both non-interactive */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 900px 520px at 50% -8%, rgba(255,43,42,.20), transparent 70%),
                       radial-gradient(ellipse 620px 360px at 78% 8%, rgba(255,154,62,.13), transparent 70%),
                       radial-gradient(ellipse 700px 400px at 12% 40%, rgba(38,64,160,.20), transparent 70%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.028) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,.028) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 20%, #000, transparent)',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 20%, #000, transparent)',
        }}
      />

      <div className="relative mx-auto max-w-[1000px] text-center">
        <div className="inline-flex items-center gap-2.5 rounded-full border border-accent/[.32] bg-accent/[.09] px-4 py-2">
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-accent" />
          <span className="font-display text-[12px] font-bold uppercase tracking-[.14em] text-accent-soft">
            US live TV · 4K · no contract
          </span>
        </div>

        <h1
          className="mt-7 font-display font-extrabold leading-[0.96] text-ink text-balance"
          style={{ fontSize: 'clamp(40px, 7.5vw, 82px)' }}
        >
          All Your Entertainment.
          <br />
          <span className="text-accent">One Powerful Platform.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-[620px] text-[18.5px] leading-relaxed text-ink-3">
          {site.channels} live channels and {site.vod} films and series across every screen in the house.
          Live sports, news, kids and international TV in HD and 4K — activated the minute you pay.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link to="/pricing" className="btn-accent">See pricing →</Link>
          <Link to="/contact" className="btn-outline">Start 24h free trial</Link>
        </div>

        <p className="mt-5 text-[13px] text-ink-4">
          No hidden fees · Money-back guarantee · 24/7 live chat
        </p>

        {/* Browser-chrome frame around the app screenshot slot */}
        <div className="mx-auto mt-14 max-w-[940px] overflow-hidden rounded-t-2xl border border-white/[.09] border-b-0 bg-surface-2">
          <div className="flex items-center gap-2 border-b border-white/[.07] px-4 py-3">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-[9px] w-[9px] rounded-full bg-[#2A3350]" />
            ))}
          </div>
          <Placeholder label="[ app screenshot — live TV grid ]" note="drop a 1880×600 image here" height={300} />
        </div>
      </div>
    </section>
  );
}

/* ── 1.2 Stat bar ──────────────────────────────────────────────────────────── */
function StatBar() {
  return (
    <section className="bg-accent px-7 py-[26px]">
      <div className="mx-auto grid max-w-shell grid-cols-2 md:grid-cols-4">
        {heroStats.map((s, i) => (
          <div key={s.label} className={i > 0 ? 'border-l border-white/20 px-4 md:px-6' : 'px-4 md:px-6'}>
            <div className="font-display text-[28px] font-extrabold text-white md:text-[34px]">{s.value}</div>
            <div className="mt-0.5 font-display text-[11px] font-bold uppercase tracking-[.16em] text-white/[.72] md:text-[12px]">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── 1.3 Network wall ──────────────────────────────────────────────────────── */
function NetworkWall() {
  const chip = (name: string, key: string) => (
    <span
      key={key}
      className="flex h-[54px] flex-none items-center whitespace-nowrap rounded-[9px] border border-white/[.09]
                 bg-white/[.03] px-5 font-display text-[14px] font-bold uppercase tracking-[.04em] text-ink-3"
    >
      {name}
    </span>
  );

  return (
    <section className="overflow-hidden bg-bg pb-[42px] pt-[46px]">
      <p className="mb-7 text-center font-display text-[12px] font-bold uppercase tracking-[.18em] text-ink-4">
        Every network you are already paying for
      </p>
      <div className="flex flex-col gap-2.5">
        <Marquee items={networksRowA} direction="left" duration={42} renderItem={chip} />
        <Marquee items={networksRowB} direction="right" duration={52} renderItem={chip} />
      </div>
      <p className="mt-6 text-center font-mono text-[10.5px] text-ink-6">
        edit this list to match your own line-up
      </p>
    </section>
  );
}

/* ── 1.4 Cost comparison ───────────────────────────────────────────────────── */
function CostComparison() {
  const yearly = 108; // annual term headline, matches the 12-month plan
  const savedMonthly = basketMonthly - yearly / 12;
  const savedYearly = basketYearly - yearly;

  const Row = ({ label, monthly, yearly: y, accent, bold }: {
    label: string; monthly: string; yearly: string; accent?: boolean; bold?: boolean;
  }) => (
    <div
      className={`grid grid-cols-[1fr_100px_110px] gap-2 py-4 sm:grid-cols-[1fr_140px_150px] ${
        accent ? 'border-t-2 border-accent' : 'border-t border-white/[.12]'
      }`}
    >
      <span className={`text-[15px] ${accent ? 'font-bold text-accent' : bold ? 'font-bold text-ink' : 'text-ink-2'}`}>
        {label}
      </span>
      <span className={`text-right text-[15px] ${accent ? 'font-bold text-accent' : bold ? 'font-bold text-ink' : 'text-ink-2'}`}>
        {monthly}
      </span>
      <span className={`text-right text-[15px] ${accent ? 'font-bold text-accent' : bold ? 'font-bold text-ink' : 'text-ink-2'}`}>
        {y}
      </span>
    </div>
  );

  return (
    <section
      className="px-7 py-[110px]"
      style={{ background: 'linear-gradient(180deg, #06080F, #080B16)' }}
    >
      <div className="mx-auto grid max-w-shell items-start gap-16 lg:grid-cols-[400px_1fr] lg:gap-[88px]">
        <div className="mx-auto w-full max-w-[400px]">
          <Receipt />
        </div>

        <div>
          <div className="label-accent">Let's do the math</div>
          <h2
            className="mt-4 font-display font-extrabold leading-none text-ink"
            style={{ fontSize: 'clamp(38px, 6vw, 62px)' }}
          >
            You save
            <br />
            <span className="text-accent">${savedYearly.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span> a year.
          </h2>

          <p className="mt-6 max-w-[520px] text-[17.5px] leading-relaxed text-ink-3">
            Six subscriptions. Six logins. Seventy-two payments a year.{' '}
            <strong className="font-semibold text-ink">Why keep paying month after month?</strong>
          </p>

          <div className="mt-9">
            <div className="grid grid-cols-[1fr_100px_110px] gap-2 pb-3 sm:grid-cols-[1fr_140px_150px]">
              <span />
              <span className="text-right text-[11px] font-bold uppercase tracking-[.16em] text-ink-4">Monthly</span>
              <span className="text-right text-[11px] font-bold uppercase tracking-[.16em] text-ink-4">Yearly</span>
            </div>
            <Row
              label={`Now · ${paymentsPerYear / 12} subscriptions`}
              monthly={`$${basketMonthly.toFixed(2)}`}
              yearly={`$${basketYearly.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            />
            <Row label={site.name} monthly={`$${(yearly / 12).toFixed(2)}`} yearly={`$${yearly}.00`} bold />
            <Row
              label="You save"
              monthly={`+$${savedMonthly.toFixed(2)}`}
              yearly={`+$${savedYearly.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
              accent
            />
          </div>

          <p className="mt-8 text-[17px] font-bold text-ink">
            All of this combined. And there is still more with {site.name}.
          </p>

          <Link to="/pricing" className="btn-accent mt-6">
            Get {site.name} for ${yearly} / year
          </Link>

          <p className="mt-6 max-w-[520px] text-[13.5px] text-ink-3">
            One subscription replaces the lot — live TV, sport, films, series and the kids' channels,
            on every screen you own.
          </p>
          <p className="mt-3 max-w-[520px] text-[12px] leading-relaxed text-ink-5">{smallPrint}</p>
        </div>
      </div>
    </section>
  );
}

/* ── 1.5 On-demand library ─────────────────────────────────────────────────── */
function OnDemand() {
  return (
    <section className="bg-bg pb-[90px] pt-[86px]">
      <div className="px-7">
        <SectionHeading
          label="On demand"
          title={<>Thousands of hours of <span className="text-accent">premium content</span></>}
          sub={`${site.vod} films and series sitting alongside the live line-up, on the same subscription.`}
        />

        {/* Featured strip */}
        <div className="mx-auto mt-12 grid max-w-shell grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {featured.map((t) => (
            <Poster key={t.name} title={t} width={undefined} height={260} />
          ))}
        </div>
      </div>

      {/* Two rails: films one way, series the other */}
      <div className="mt-10 flex flex-col gap-2.5">
        <TitleMarquee titles={railA} direction="left" duration={60} />
        <TitleMarquee titles={railB} direction="right" duration={72} />
      </div>
    </section>
  );
}

/* ── 1.6 Pricing card ──────────────────────────────────────────────────────── */
function PricingSection() {
  return (
    <section id="pricing" className="bg-bg-alt px-7 py-[110px]">
      <div className="mx-auto max-w-[1120px]">
        <SectionHeading
          label="Pricing"
          title={<>One plan. <span className="text-accent">Pick your term.</span></>}
          sub="The longer you stay, the less you pay. Everything is included on every term."
        />
        <div className="mt-14 grid gap-7 lg:grid-cols-2">
          <PlanCard ctaTo="/pricing" />
          <FeaturesCard />
        </div>
      </div>
    </section>
  );
}

/* ── 1.7 Device coverage ───────────────────────────────────────────────────── */
function DeviceCoverage() {
  return (
    <section className="bg-bg-alt px-7 py-[100px]">
      <div className="mx-auto max-w-shell">
        <SectionHeading
          label="What is on"
          title={
            <>
              Every screen in the house.
              <br />
              <span className="font-semibold italic text-ink-3">One login.</span>
            </>
          }
          sub="Install it everywhere you watch. Pick how many screens play at the same time — the rest is the same subscription."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {deviceTiles.map((tile) => (
            <DeviceCard key={tile.name} tile={tile} />
          ))}
        </div>

        <div className="mx-auto mt-12 grid max-w-[900px] gap-3 sm:grid-cols-2 sm:gap-x-8">
          {coverageChecklist.map((line) => (
            <div key={line} className="flex items-start gap-3">
              <Tick />
              <span className="text-[15px] leading-snug text-ink-2">{line}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 1.8 Why switch ────────────────────────────────────────────────────────── */
function WhySwitch() {
  return (
    <section className="px-7 py-[110px]" style={{ background: 'linear-gradient(180deg, #080B16, #06080F)' }}>
      <div className="mx-auto max-w-shell">
        <SectionHeading title={<>Why people switch to <span className="text-accent">{site.name}</span></>} />
        <div className="mt-14 grid gap-[18px] md:grid-cols-2 lg:grid-cols-3">
          {whySwitch.map((card, i) => (
            <div key={card.title} className="card-hover px-[26px] pb-[30px] pt-7">
              <div className="font-mono text-[13px] font-bold text-accent">
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="mt-4 font-display text-[21px] font-bold text-ink">{card.title}</h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-ink-3">{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 1.9 Three-step setup ──────────────────────────────────────────────────── */
function ThreeSteps() {
  const { term, setTerm, screens, total } = usePlan();

  const steps = [
    {
      headline: <>Pick your <span className="font-semibold text-ink-3">plan.</span></>,
      body: 'Choose how long you want to stay. The longer the term, the lower the monthly cost — everything else is identical.',
      widget: (
        <div className="flex flex-col gap-2">
          {terms.map((t) => {
            const on = t.months === term.months;
            return (
              <button
                key={t.months}
                onClick={() => setTerm(t)}
                className={`flex items-center gap-3 rounded-[10px] border px-4 py-3.5 text-left transition-colors ${
                  on ? 'border-accent bg-accent/[.14]' : 'border-white/10 bg-white/[.02] hover:border-white/20'
                }`}
              >
                <span className="flex-1 font-display text-[15px] font-bold text-ink">{t.label}</span>
                {t.popular && (
                  <span className="rounded bg-accent-gradient px-2 py-0.5 font-display text-[10px] font-extrabold uppercase text-white">
                    Popular
                  </span>
                )}
                <span className="font-display text-[18px] font-extrabold text-ink">${t.total}</span>
              </button>
            );
          })}
        </div>
      ),
    },
    {
      headline: <>Pay <span className="font-semibold text-ink-3">securely.</span></>,
      body: 'Card, PayPal or a wallet — checkout takes under a minute and your login is emailed the moment it clears.',
      widget: (
        <div className="rounded-2xl border border-white/[.09] bg-white/[.025] p-5">
          <div className="flex justify-between text-[14px]">
            <span className="text-ink-3">{site.name}</span>
            <span className="font-medium text-ink">{term.label}</span>
          </div>
          <div className="mt-2 flex justify-between text-[14px]">
            <span className="text-ink-3">{screens} screen{screens > 1 ? 's' : ''} at a time</span>
            <span className="font-medium text-ink">${total}</span>
          </div>
          <div className="my-4 border-t border-white/[.09]" />
          <div className="flex items-end justify-between">
            <span className="text-[11px] font-bold uppercase tracking-[.16em] text-ink-4">To pay</span>
            <span className="font-display text-[28px] font-extrabold leading-none text-ink">${total}</span>
          </div>
          <button className="btn-accent mt-5 w-full !py-3 !text-[14px]">Checkout</button>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {paymentMethods.map((p) => (
              <span key={p} className="rounded-[5px] border border-white/10 px-2 py-1 font-mono text-[9.5px] text-ink-4">
                {p}
              </span>
            ))}
          </div>
        </div>
      ),
    },
    {
      headline: <>Press <span className="font-semibold text-ink-3">play.</span></>,
      body: 'Install the player, paste the login we sent, and the full channel list plus the guide loads in seconds.',
      extra: <Link to="/setup" className="btn-outline mt-6 !py-3 !text-[14px]">Open the setup guide</Link>,
      widget: (
        <div className="overflow-hidden rounded-2xl border border-white/[.09]">
          <Placeholder label="[ phone casting to the TV ]" height={196} />
          <div className="bg-surface-2 px-4 py-3.5 text-[13.5px] text-ink-3">
            Login emailed in minutes · works on every device
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="setup" className="bg-bg px-7 pb-[110px] pt-[100px]">
      <div className="mx-auto max-w-shell">
        <div className="max-w-[680px]">
          <div className="label mb-4">Set up in minutes</div>
          <h2 className="font-display font-extrabold leading-[1.02] text-ink" style={{ fontSize: 'clamp(34px, 5vw, 54px)' }}>
            Three steps.
            <br />
            <span className="font-semibold text-ink-3">Six minutes.</span>
          </h2>
        </div>

        <div className="mt-14 border-t border-white/[.09]">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`grid items-center gap-8 py-12 lg:grid-cols-[220px_1fr_340px] lg:gap-12 lg:py-14 ${
                i < steps.length - 1 ? 'border-b border-white/[.09]' : ''
              }`}
            >
              <div
                className="font-display font-extrabold leading-[.8] tracking-[-.06em] text-accent"
                style={{ fontSize: 'clamp(72px, 10vw, 128px)' }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="max-w-[400px]">
                <h3 className="font-display text-[28px] font-extrabold text-ink lg:text-[34px]">{step.headline}</h3>
                <p className="mt-3 text-[16.5px] leading-relaxed text-ink-3">{step.body}</p>
                {step.extra}
              </div>
              <div>{step.widget}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 1.10 Reviews ──────────────────────────────────────────────────────────── */
function Reviews() {
  return (
    <section className="bg-bg-alt px-7 py-[110px]">
      <div className="mx-auto max-w-shell">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <h2 className="font-display font-extrabold leading-[1.02] text-ink" style={{ fontSize: 'clamp(32px, 5vw, 52px)' }}>
            Reviews from
            <br />
            real subscribers
          </h2>
          <div className="md:text-right">
            <div className="font-display text-[40px] font-extrabold leading-none text-ink">
              {site.rating} <span className="text-[22px] text-ink-4">/ 5</span>
            </div>
            <div className="mt-1.5 text-[14px] text-ink-3">{site.reviewCount} verified reviews</div>
            <div className="mt-3 inline-flex items-center gap-2.5 rounded-full border border-white/[.12] px-4 py-2">
              <Stars size={13} />
              <span className="text-[13px] text-ink-3">{site.rating} on our public review profile</span>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-[18px] md:grid-cols-2 lg:grid-cols-3">
          {reviews.slice(0, 6).map((r) => <ReviewCard key={r.title} review={r} />)}
        </div>

        <div className="mt-10 text-center">
          <Link to="/reviews" className="btn-outline">Read all reviews</Link>
        </div>
      </div>
    </section>
  );
}

/* ── 1.11 FAQ ──────────────────────────────────────────────────────────────── */
function FaqSection() {
  return (
    <section id="faq" className="bg-bg px-7 py-[110px]">
      <div className="mx-auto max-w-narrow">
        <SectionHeading
          label="Questions"
          title={<>US IPTV <span className="text-accent">FAQs</span></>}
          sub="Support is on live chat 24/7 for anything not covered here."
          size={50}
        />
        <div className="mt-12">
          <Faq />
        </div>
      </div>
    </section>
  );
}

/* ── 1.12 Closing CTA ──────────────────────────────────────────────────────── */
function ClosingCta() {
  return (
    <section className="relative overflow-hidden border-t border-white/[.07] px-7 py-[120px] text-center">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 800px 400px at 50% 100%, rgba(255,43,42,.22), transparent 70%)' }}
      />
      <div className="relative mx-auto max-w-[720px]">
        <h2 className="font-display font-extrabold leading-[1.02] text-ink" style={{ fontSize: 'clamp(34px, 5.5vw, 60px)' }}>
          Ready to cancel
          <br />
          the other six?
        </h2>
        <p className="mx-auto mt-6 max-w-[520px] text-[18px] leading-relaxed text-ink-3">
          One subscription, every screen, activated in minutes. Money-back guarantee if it is not for you.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link to="/pricing" className="btn-accent">Get {site.name}</Link>
          <Link to="/contact" className="btn-outline">Talk to support</Link>
        </div>
      </div>
    </section>
  );
}
