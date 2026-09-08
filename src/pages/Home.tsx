import { useState } from 'react';
import Seo from '../components/Seo';
import { pageSeo } from '../data/seo';
import { Link } from 'react-router-dom';
import { site, heroStats, routes } from '../data/site';
import { track } from '../lib/analytics';
import Reveal from '../components/Reveal';
import ChannelFinder from '../components/ChannelFinder';
import { TERMS, quote, money, savingsPerMonth, DEFAULT_TERM_ID, INVOICE_PAYMENT_METHODS } from '../data/pricing';
import EmailMock from '../components/EmailMock';
import PaymentMarks from '../components/PaymentMarks';
import { whySwitch, coverageChecklist } from '../data/marquees';
import { platforms, platformRowA, platformRowB } from '../data/platforms';
import PlatformTile from '../components/PlatformMarks';
import { MAX_DEVICES } from '../data/pricing';
import { logoRows, networkLogos } from '../data/logos';
import PosterWall from '../components/PosterWall';
import SavingsSection from '../components/SavingsSection';
import ShowcaseRow from '../components/ShowcaseRow';
import TrustpilotBadge from '../components/TrustpilotBadge';
import ReviewWall from '../components/ReviewWall';
import TrustCards from '../components/TrustCards';
import { trustpilot } from '../data/reviews';
import Check from '../components/pricing/Check';
import { SectionHeading, LogoMarquee, Marquee, Tick } from '../components/ui';
import PricingOrder from '../components/pricing/PricingOrder';
import Faq from '../components/Faq';

export default function Home() {
  return (
    <>
      <Seo seo={pageSeo[routes.home]} />
      {/* Home page order — see the brief. Keep these in this sequence. */}
      <Hero />
      <StatBar />
      <NetworkWall />        {/* Animated channel logos */}
      <ChannelFinder />      {/* Live search over the real channel dataset */}
      <OnDemand />           {/* Movies & series / premium content */}
      <SavingsSection />     {/* Savings */}
      <PricingOrder />       {/* Pricing + quick order flow */}
      <ThreeSteps />         {/* How it works */}
      <Reviews />            {/* Social proof */}
      <DeviceCoverage />     {/* Device compatibility */}
      <WhySwitch />          {/* Not in the brief's list — flagged for a decision */}
      <FaqSection />
      <ClosingCta />
    </>
  );
}

/* ── 1.1 Hero ──────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section
      className="relative isolate overflow-hidden px-5 pb-20 sm:px-7 sm:pb-24"
      // Pulled up behind the floating nav so the artwork runs to the very top
      // of the window, with the padding put back so the copy sits where it did.
      style={{
        marginTop: 'calc(var(--nav-h) * -1)',
        paddingTop: 'calc(var(--nav-h) + 92px)',
      }}
    >
      {/* Drifting wall of artwork, blurred well back. Layer order matters:
          artwork, then a scrim heavy enough to hold the headline's contrast,
          then the brand glow. No grid overlay: it read as a
          visible mesh over the artwork rather than as texture. */}
      <PosterWall variant="backdrop" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(6,8,15,.52) 0%, rgba(6,8,15,.66) 46%, rgba(6,8,15,.90) 82%, #06080F 100%)',
        }}
      />

      {/* Decorative layers, all non-interactive */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 900px 520px at 50% -8%, rgba(255,43,42,.20), transparent 70%),
                       radial-gradient(ellipse 620px 360px at 78% 8%, rgba(255,154,62,.13), transparent 70%),
                       radial-gradient(ellipse 700px 400px at 12% 40%, rgba(38,64,160,.20), transparent 70%)`,
        }}
      />
      <div className="relative mx-auto max-w-[1000px] text-center">
        <div className="inline-flex items-center gap-2.5 rounded-full border border-accent/[.32] bg-accent/[.09] px-4 py-2">
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-accent" />
          <span className="font-display text-[12px] font-bold uppercase tracking-[.14em] text-accent-soft">
            Premium TV • Sports • Movies • 4K
          </span>
        </div>

        <h1
          className="mt-7 font-display font-extrabold leading-[0.96] text-ink text-balance"
          style={{ fontSize: 'clamp(40px, 7.5vw, 82px)' }}
        >
          Everything You Love.
          <br />
          <span className="text-grad">One Simple Subscription.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-[620px] text-[18.5px] leading-relaxed text-ink-2">
          Live TV, sports, movies and series in HD &amp; 4K — available across your favorite devices,
          with fast activation and 24/7 support.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            to={routes.pricing}
            onClick={() => track('view_pricing', { from: 'hero' })}
            className="btn-accent"
          >
            View plans →
          </Link>
          <Link
            to={routes.contact}
            onClick={() => track('start_free_trial', { from: 'hero' })}
            className="btn-outline"
          >
            Start free trial
          </Link>
        </div>

        <p className="mt-5 text-[13px] text-ink-3">
          {site.refundLabel} · Fast Activation · 24/7 Support
        </p>

        {/* Social proof sits with the CTAs rather than in a separate strip */}
        <div className="mt-9 flex justify-center">
          <TrustpilotBadge />
        </div>
      </div>
    </section>
  );
}

/* ── 1.2 Stat bar ──────────────────────────────────────────────────────────── */
/**
 * Proof strip under the hero.
 *
 * Was a solid red slab, which was the only flat-colour block on an otherwise
 * dark, layered page — it read as a template banner and fought the hero rather
 * than continuing it. Now the band stays dark and the brand colour lives in the
 * numbers themselves, where the eye goes anyway.
 *
 * `dt` must precede `dd` in a definition list, so the label is first in the DOM
 * and flex-col-reverse puts the number on top visually. Screen readers get
 * "Live channels: 60,000+"; sighted readers get the number leading.
 */
function StatBar() {
  return (
    <section className="section-tight relative bg-bg">
      {/* Carries the hero's warmth down over the seam so the two sections read
          as one movement rather than two stacked blocks. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
        style={{ background: 'radial-gradient(ellipse 760px 120px at 50% 0%, rgba(255,70,32,.13), transparent 72%)' }}
      />
      <dl
        className="relative mx-auto grid max-w-shell grid-cols-2 gap-y-10 [&>*:nth-child(even)]:border-l
                   [&>*]:border-white/[.09] md:grid-cols-4 md:gap-y-0 md:[&>*:nth-child(n+2)]:border-l"
      >
        {heroStats.map((s) => (
          <div key={s.label} className="flex flex-col-reverse items-center px-3 text-center sm:px-6">
            {/* ink-3, not ink-4: measured on the rendered pixels, ink-4 came out
                at 4.36:1 over the warm glow — just under the 4.5:1 minimum. */}
            <dt className="mt-2.5 font-display text-[11px] font-bold uppercase tracking-[.18em] text-ink-3 sm:text-[11.5px]">
              {s.label}
            </dt>
            <dd
              className="nums text-grad font-display font-extrabold leading-[.95]"
              style={{ fontSize: 'clamp(28px, 4.4vw, 42px)' }}
            >
              {s.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ── 1.3 Network wall ──────────────────────────────────────────────────────── */
function NetworkWall() {
  // Alternating directions, and each row a different speed so the rows never
  // fall into step with one another.
  const rows = [
    { direction: 'left' as const, duration: 64 },
    { direction: 'right' as const, duration: 78 },
    { direction: 'left' as const, duration: 88 },
  ];

  return (
    <section className="section-tight relative overflow-hidden bg-bg">
      {/* Red wash behind the rails, echoing the band on the brand sites */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 50% 50%, rgba(255,43,42,.16), transparent 72%)',
        }}
      />
      <div className="relative">
        <div className="mx-auto mb-10 max-w-[680px] px-6 text-center sm:mb-12">
          <p className="eyebrow">Channels for every interest</p>
          <h2
            className="mt-4 font-display font-extrabold leading-[1.06] text-ink"
            style={{ fontSize: 'clamp(27px, 4vw, 42px)' }}
          >
            Find What You <span className="text-grad">Love to Watch</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[520px] text-[16px] leading-relaxed text-ink-3">
            Explore entertainment across sports, news, movies, international channels and more.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:gap-2.5">
          {rows.map((row, i) => (
            <LogoMarquee key={i} logos={logoRows[i]} direction={row.direction} duration={row.duration} />
          ))}
        </div>

        <p className="mt-8 px-6 text-center text-[12px] leading-relaxed text-ink-5 sm:mt-10">
          Showing {networkLogos.length} of the networks a subscription can reach. Network names and
          logos belong to their owners and are shown for identification only.
        </p>
      </div>
    </section>
  );
}

/* ── Cost comparison lives in components/SavingsSection.tsx ────────────────── */

/* ── 1.5 On-demand library ─────────────────────────────────────────────────── */
function OnDemand() {
  const points = [
    'Movies & series on demand',
    'New content added regularly',
    'HD & 4K where available',
    'Entertainment from around the world',
  ];

  return (
    <section className="section relative isolate overflow-hidden bg-bg">
      {/* Blurred wall of artwork behind everything — the library, felt rather
          than listed. Scrimmed heavily so the copy in front stays readable. */}
      <PosterWall variant="backdrop" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, #06080F 0%, rgba(6,8,15,.58) 26%, rgba(6,8,15,.58) 74%, #06080F 100%)',
        }}
      />

      <div className="relative mx-auto max-w-shell px-5 sm:px-7">
        {/* Header */}
        <div className="mx-auto max-w-[760px] text-center">
          <p className="flex items-center justify-center gap-3 text-[12px] font-bold uppercase tracking-[.18em] text-accent">
            <span className="h-px w-8 bg-accent/50" aria-hidden="true" />
            Movies &amp; series
            <span className="h-px w-8 bg-accent/50" aria-hidden="true" />
          </p>
          <h2
            className="mt-5 font-display font-extrabold leading-[1.04] text-ink"
            style={{ fontSize: 'clamp(30px, 4.6vw, 50px)' }}
          >
            Movies, Series &amp; More.
            <br />
            <span className="text-grad">Ready When You Are.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-[560px] text-[16.5px] leading-relaxed text-ink-3">
            Explore movies, series, box sets and on-demand entertainment, with HD and 4K quality
            where available.
          </p>
        </div>

        {/* Labelled cards */}
        <div className="mt-12">
          <ShowcaseRow />
        </div>

        {/* The copy that actually sells, kept from the previous version */}
        <ul className="mx-auto mt-14 grid max-w-[840px] gap-3 sm:grid-cols-2 sm:gap-x-10">
          {points.map((t, i) => (
            <Reveal as="li" key={t} delay={i} shift={12} className="flex items-start gap-3">
              <span className="mt-[3px] grid h-[18px] w-[18px] flex-none place-items-center rounded-full bg-accent text-white">
                <Check />
              </span>
              <span className="text-[15px] leading-snug text-ink-2">{t}</span>
            </Reveal>
          ))}
        </ul>

        <div className="mt-10 text-center">
          <Link to={routes.pricing} className="btn-accent">Explore what&apos;s included →</Link>
        </div>
      </div>
    </section>
  );
}

/* ── 1.6 Pricing + order (Section 05) ──────────────────────────────────────── */
// Lives in components/pricing/PricingOrder.tsx — see spec section 05.

/* ── 1.7 Device coverage ───────────────────────────────────────────────────── */
/**
 * Device ecosystem (brief §10) — the one homepage section approved for a
 * visual redesign.
 *
 * Replaces four generic category cards with the actual platform list from
 * data/platforms.ts, which is derived from the setup guides we publish. Nothing
 * is shown that we cannot walk a customer through.
 *
 * Two slow counter-rotating rows on wide screens, one swipeable row on phones.
 * Both use the existing Marquee — no new animation code, and the shared
 * reduced-motion rule in index.css already stops them.
 *
 * The old headline "Every screen in the house. One login." is gone: it
 * contradicted the selected-device model. The approved line is the device cap.
 */
function DeviceCoverage() {
  return (
    <section className="section relative overflow-hidden bg-bg">
      <div className="mx-auto max-w-shell">
        <SectionHeading
          label="Watch your way"
          title={<><span className="text-grad">{site.name}</span> on Any Device</>}
          sub="Set up StreamPlay4K on the devices you already use at home or on the go."
        />
        <p className="mx-auto mt-5 max-w-[520px] text-center text-[14.5px] font-semibold text-ink-2">
          Choose up to {MAX_DEVICES} devices with your plan.
        </p>

        {/* Phones: one swipeable row, full-size tiles, no clipped logos. */}
        <div className="mt-12 sm:hidden">
          <div className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {platforms.map((pf) => (
              <div key={pf.name} className="snap-start">
                <PlatformTile platform={pf} />
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-[12px] text-ink-5">Swipe to see them all</p>
        </div>

        {/* Tablet and up: two rows drifting in opposite directions. */}
        <div className="mt-14 hidden flex-col gap-3 sm:flex">
          <PlatformMarquee row={platformRowA} direction="left" duration={62} />
          <PlatformMarquee row={platformRowB} direction="right" duration={74} />
        </div>

        <div className="mx-auto mt-12 grid max-w-[900px] gap-3 sm:grid-cols-2 sm:gap-x-8">
          {coverageChecklist.map((line, i) => (
            <Reveal key={line} delay={i} shift={12} className="flex items-start gap-3">
              <Tick />
              <span className="text-[15px] leading-snug text-ink-2">{line}</span>
            </Reveal>
          ))}
        </div>

        <div className="mt-11 text-center">
          <Link to={routes.setup} className="btn-outline">See the setup guides →</Link>
        </div>
      </div>
    </section>
  );
}

/** One drifting row of platform tiles, edge-faded by the shared mask. */
function PlatformMarquee({
  row, direction, duration,
}: {
  row: typeof platforms;
  direction: 'left' | 'right';
  duration: number;
}) {
  return (
    <Marquee
      items={row.map((p) => p.name)}
      direction={direction}
      duration={duration}
      renderItem={(name: string, key: string) => {
        const pf = row.find((p) => p.name === name)!;
        return <PlatformTile key={key} platform={pf} />;
      }}
    />
  );
}

/* ── 1.8 Why switch ────────────────────────────────────────────────────────── */
function WhySwitch() {
  return (
    <section className="section amb amb-cool bg-bg">
      <div className="mx-auto max-w-shell">
        <SectionHeading title={<>Why people switch to <span className="text-grad">{site.name}</span></>} />
        <div className="mt-14 grid gap-[18px] md:grid-cols-2 lg:grid-cols-3">
          {whySwitch.map((card, i) => (
            <Reveal key={card.title} delay={i} shift={16} className="card-hover px-[26px] pb-[30px] pt-7">
              <div className="nums text-[13px] font-bold text-accent">
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="mt-4 font-display text-[21px] font-bold text-ink">{card.title}</h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-ink-3">{card.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── How it works / three steps ────────────────────────────────────────────── */
/**
 * How it works.
 *
 * The live widgets stay: they let someone try the plan ladder and see the real
 * total before they commit, which the flat editorial version could not do. What
 * changed is the ground under them — the section now sits on the same near-black
 * as its neighbours with the cinematic ambient behind it, and on the shared
 * spacing scale, so it no longer reads as a separate black rectangle.
 *
 * Step copy is the client's approved wording from the polish brief.
 */
function ThreeSteps() {
  // Mirrors the locked pricing; the live selector with device count is Section 05.
  const [termId, setTermId] = useState(DEFAULT_TERM_ID);
  const q = quote(termId, 1);

  // "Best value" is computed, not asserted: the term with the lowest cost per
  // month. With the locked ladder that is 12 months, but it is derived so the
  // label can never drift out of step with the prices.
  const bestValueId = TERMS.reduce((best, t) =>
    t.baseCents / t.months < best.baseCents / best.months ? t : best, TERMS[0]).id;

  const steps = [
    {
      n: '01',
      title: 'Choose Your Plan',
      body: 'Select your subscription length and the number of devices you need.',
      widget: (
        <div className="rounded-2xl border border-white/[.08] bg-white/[.03] p-2.5" role="group" aria-label="Choose a plan">
          <div className="flex flex-col gap-2">
            {TERMS.map((t) => {
              const on = t.id === termId;
              const save = savingsPerMonth(t);
              const best = t.id === bestValueId;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTermId(t.id)}
                  aria-pressed={on}
                  className={`flex min-h-[54px] items-center gap-3 rounded-xl px-4 text-left transition-colors ${
                    on ? 'bg-accent text-white shadow-cta' : 'bg-white/[.04] text-ink hover:bg-white/[.07]'
                  }`}
                >
                  <span className="flex-1 font-display text-[15px] font-bold">{t.label}</span>
                  {best ? (
                    <span className={`rounded px-1.5 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wide ${
                      on ? 'bg-white text-accent' : 'bg-accent/[.14] text-accent-bright'
                    }`}>
                      Best value
                    </span>
                  ) : (
                    <span className={`text-[11.5px] ${on ? 'text-white/80' : 'text-ink-4'}`}>
                      {save > 0 ? `Save ${money(save)}/mo` : 'Try it out'}
                    </span>
                  )}
                  <span className="nums font-display text-[19px] font-extrabold">{money(t.baseCents)}</span>
                </button>
              );
            })}
          </div>
        </div>
      ),
    },
    {
      n: '02',
      title: 'Place Your Order',
      // No payment is taken on this site — the invoice follows by email and
      // WhatsApp — so this step is honest about that rather than echoing the
      // reference's "pay now".
      body: 'Enter your contact details and confirm your order. No payment is taken on the order form.',
      widget: (
        <div className="rounded-2xl border border-white/[.08] bg-white/[.03] p-5">
          <div className="flex items-start gap-3">
            <span
              className="grid h-10 w-10 flex-none place-items-center rounded-lg bg-accent-gradient-diag font-display text-[17px] font-extrabold text-white"
              aria-hidden="true"
            >
              S
            </span>
            <span className="min-w-0">
              <span className="block font-display text-[15.5px] font-bold text-ink">{site.name}, {q.term.label.toLowerCase()}</span>
              <span className="block text-[12.5px] text-ink-4">1 device · 4K where available · Login by email</span>
            </span>
          </div>
          <div className="my-4 border-t border-white/[.09]" />
          <div className="flex items-end justify-between">
            <span className="text-[14px] text-ink-3">Total on your invoice</span>
            <span className="nums font-display text-[28px] font-extrabold leading-none text-ink">{money(q.totalCents)}</span>
          </div>
          <Link to="/#pricing" className="btn-accent mt-5 w-full !py-3.5 !text-[14.5px]">
            Order now →
          </Link>
          <p className="mt-3 text-center text-[11.5px] text-ink-4">
            No payment is taken on this page.
          </p>
          <p className="mt-4 text-center text-[10px] font-bold uppercase tracking-[.14em] text-ink-5">
            Pay your invoice with
          </p>
          <PaymentMarks methods={INVOICE_PAYMENT_METHODS} align="center" className="mx-auto mt-2.5 max-w-[226px] sm:max-w-[248px]" />
        </div>
      ),
    },
    {
      n: '03',
      title: 'Get Activated',
      body: `We\u2019ll send your invoice and payment instructions by email and WhatsApp. Once payment is confirmed, your access is usually ready within ${site.activationWindow}.`,
      extra: <Link to="/setup" className="btn-outline mt-6 !py-3 !text-[14px]">See the setup guides</Link>,
      widget: <EmailMock />,
    },
  ];

  return (
    <section id="setup" className="section amb amb-cine bg-bg">
      <div className="mx-auto max-w-shell">
        {/* Header */}
        <div className="mx-auto max-w-[720px] text-center">
          <p className="eyebrow">Three simple steps</p>
          <h2
            className="mt-4 font-display font-extrabold leading-[1.02] text-ink"
            style={{ fontSize: 'clamp(32px, 5vw, 54px)' }}
          >
            Choose. Order.
            <br />
            <span className="text-grad">Start Watching.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-[460px] text-[16px] leading-relaxed text-ink-3">
            No hardware, no contract, no waiting around.
          </p>
        </div>

        {/* Rules-only table: giant numeral, copy, live widget */}
        <div className="mt-12 border-t border-white/[.09] sm:mt-16">
          {steps.map((step, i) => (
            <div
              key={step.n}
              className={`grid items-center gap-8 py-12 sm:py-14 lg:grid-cols-[180px_minmax(0,1fr)_380px] lg:gap-12 lg:py-16 ${
                i < steps.length - 1 ? 'border-b border-white/[.09]' : ''
              }`}
            >
              {/* Phone: numeral and copy share a row; desktop: three columns */}
              <div className="flex items-center gap-5 lg:contents">
                <div
                  className="text-grad flex-none font-display font-extrabold leading-[.8] tracking-[-.06em]"
                  style={{ fontSize: 'clamp(64px, 10vw, 120px)' }}
                  aria-hidden="true"
                >
                  {step.n}
                </div>
                <div className="min-w-0 max-w-[440px]">
                  <h3 className="font-display text-[24px] font-extrabold leading-tight text-ink sm:text-[28px] lg:text-[30px]">
                    <span className="sr-only">Step {step.n}: </span>{step.title}
                  </h3>
                  <p className="mt-2.5 text-[15.5px] leading-relaxed text-ink-3 sm:text-[16px]">{step.body}</p>
                  {step.extra}
                </div>
              </div>
              <div className="min-w-0">{step.widget}</div>
            </div>
          ))}
        </div>

        {/* Close */}
        <div className="mt-10 flex flex-col items-center gap-4 border-t border-white/[.09] pt-10 sm:mt-12">
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link to="/#pricing" className="btn-accent w-full sm:w-auto">I'm in — get my sub →</Link>
            <Link to="/setup" className="btn-outline w-full sm:w-auto">See the setup guides</Link>
          </div>
          <p className="text-center text-[11.5px] font-bold uppercase tracking-[.13em] text-ink-4">
            {site.refundLabel} · 24/7 support
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── Reviews / social proof ────────────────────────────────────────────────── */
function Reviews() {
  // Every figure here comes from src/data/reviews.ts. The activation time is
  // our own locked delivery figure, not a Trustpilot support metric, so it is
  // labelled as activation rather than reply time.
  const stats = [
    { value: String(trustpilot.rating), label: 'Average rating out of 5' },
    { value: String(trustpilot.reviewCount), label: 'Reviews on Trustpilot' },
    { value: site.activationWindow, label: 'Typical activation time' },
    { value: `Up to ${MAX_DEVICES}`, label: 'Devices you can choose' },
  ];

  return (
    <section className="section amb amb-cool relative overflow-hidden bg-bg">
      <ReviewWall />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, #06080F 0%, rgba(6,8,15,.62) 20%, rgba(6,8,15,.62) 80%, #06080F 100%)',
        }}
      />

      <div className="relative mx-auto max-w-shell">
        {/* Header */}
        <div className="mx-auto max-w-[760px] text-center">
          <p className="eyebrow">What our customers say</p>
          <h2
            className="mt-5 font-display font-extrabold leading-[1.04] text-ink"
            style={{ fontSize: 'clamp(30px, 4.8vw, 52px)' }}
          >
            Our Customers
            <br />
            <span className="text-grad">Say It Best.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-[520px] text-[15.5px] leading-relaxed text-ink-3 sm:text-[16px]">
            See what customers are saying about their experience with {site.name} on Trustpilot.
          </p>
          <div className="mt-7 flex justify-center">
            <TrustpilotBadge />
          </div>
        </div>

        {/* Featured reviews */}
        <div className="mt-12 sm:mt-14">
          <TrustCards />
        </div>

        {/* Metrics — 2x2 on phones, four across from tablet up */}
        <dl className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[.1] bg-white/[.06] lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-[#0A0E1B] px-4 py-5 sm:px-6 sm:py-7">
              <dt className="font-display text-[24px] font-extrabold leading-none text-ink sm:text-[30px] lg:text-[34px]">
                {s.value}
              </dt>
              <dd className="mt-2 text-[10.5px] font-bold uppercase tracking-[.13em] text-ink-4 sm:text-[11px]">
                {s.label}
              </dd>
            </div>
          ))}
        </dl>

        {/* Actions */}
        <div className="mt-10 flex flex-col items-center justify-between gap-5 lg:flex-row">
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link to="/pricing" className="btn-accent w-full sm:w-auto">View plans →</Link>
            <a
              href={trustpilot.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Read all ${site.name} reviews on Trustpilot. Opens in a new tab.`}
              className="btn-outline w-full sm:w-auto"
            >
              Read all reviews
            </a>
          </div>
          <p className="text-center text-[11.5px] font-bold uppercase tracking-[.13em] text-ink-4 lg:text-right">
            7-day money-back guarantee · 24/7 support
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── 1.11 FAQ ──────────────────────────────────────────────────────────────── */
function FaqSection() {
  return (
    <section id="faq" className="section bg-bg">
      <div className="mx-auto max-w-narrow">
        <SectionHeading
          label={`${site.name} FAQ`}
          title={<>Questions? <span className="text-grad">We&apos;ve Got You.</span></>}
          sub="Devices, activation, payment, trials and refunds — the things people ask before ordering."
          size={50}
        />
        <div className="mt-12">
          <Faq />
        </div>
        <p className="mt-9 text-center text-[14.5px] text-ink-4">
          Still unsure?{' '}
          <Link to={routes.faq} className="text-accent-link hover:underline">Read the full FAQ</Link>
          {' '}or{' '}
          <Link to={routes.contact} className="text-accent-link hover:underline">talk to support</Link>.
        </p>
      </div>
    </section>
  );
}

/* ── 1.12 Closing CTA ──────────────────────────────────────────────────────── */
function ClosingCta() {
  return (
    <section className="section-lead relative overflow-hidden bg-bg text-center">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 800px 400px at 50% 100%, rgba(255,43,42,.22), transparent 70%)' }}
      />
      <div className="relative mx-auto max-w-[720px]">
        <h2 className="font-display font-extrabold leading-[1.02] text-ink" style={{ fontSize: 'clamp(34px, 5.5vw, 60px)' }}>
          Ready for a Simpler
          <br />
          Way to Watch?
        </h2>
        <p className="mx-auto mt-6 max-w-[540px] text-[18px] leading-relaxed text-ink-3">
          One subscription. Your favorite devices. Fast activation and support whenever you need it.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            to={routes.pricing}
            onClick={() => track('view_pricing', { from: 'closing-cta' })}
            className="btn-accent"
          >
            View plans →
          </Link>
          <Link
            to={routes.contact}
            onClick={() => track('start_free_trial', { from: 'closing-cta' })}
            className="btn-outline"
          >
            Start free trial
          </Link>
        </div>
        <p className="mx-auto mt-7 max-w-[520px] text-[13px] leading-relaxed text-ink-4">
          {site.refundLabel} · Usually Ready in {site.activationWindow} · 24/7 Support
        </p>
      </div>
    </section>
  );
}
