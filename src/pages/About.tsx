import { Link } from 'react-router-dom';
import { site, routes } from '../data/site';
import { MAX_DEVICES } from '../data/pricing';
import Seo from '../components/Seo';
import Reveal from '../components/Reveal';
import { pageSeo } from '../data/seo';

/**
 * About page.
 *
 * Deliberately makes no claims we cannot support: no founding date, no team
 * size, no subscriber count, no awards. It explains what the service is and how
 * it works, which is what someone landing here actually wants to know.
 */
export default function About() {
  const seo = pageSeo[routes.about];

  const pillars = [
    {
      title: 'Simple access to entertainment',
      body: 'Live TV, sports, movies and series in one subscription, instead of a stack of separate services that each cover part of what you watch.',
    },
    {
      title: 'Broad device compatibility',
      body: `Set up on the devices you already own — smart TVs, streaming sticks, phones, tablets and computers. Choose up to ${MAX_DEVICES} devices with your plan.`,
    },
    {
      title: 'Content worth browsing',
      body: `${site.channels} live channels and ${site.vod} on-demand titles, spanning categories, countries and languages, with EPG support on compatible players.`,
    },
    {
      title: 'Fast setup',
      body: `Nothing to install in your home and no engineer visit. Once payment is confirmed, access is ${site.activation}.`,
    },
    {
      title: 'Help when you need it',
      body: 'Support by WhatsApp and email, 24/7, for setup, troubleshooting and billing questions.',
    },
    {
      title: 'Straightforward plans',
      body: 'Three subscription lengths, one device included, and a clear price before you order. No contract and no hidden fees.',
    },
  ];

  return (
    <>
      <Seo seo={seo} />

      <section className="section amb amb-warm bg-bg">
        <div className="mx-auto max-w-shell">
          <div className="mx-auto max-w-[760px] text-center">
            <p className="eyebrow">About us</p>
            <h1
              className="mt-4 font-display font-extrabold leading-[1.04] text-ink"
              style={{ fontSize: 'clamp(32px, 5vw, 52px)' }}
            >
              Everything you love, <span className="text-grad">in one place.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-[620px] text-[17.5px] leading-relaxed text-ink-2">
              {site.name} exists to make watching simple again. One subscription, on the devices you
              already use, with someone to talk to when you need a hand.
            </p>
          </div>

          <div className="mt-14 grid gap-4 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((c, i) => (
              <Reveal key={c.title} delay={i} shift={16} className="card-hover p-7">
                <h2 className="font-display text-[18px] font-extrabold leading-snug text-ink">{c.title}</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-3">{c.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-bg">
        <div className="mx-auto max-w-[760px]">
          <h2 className="font-display text-[26px] font-extrabold leading-tight text-ink sm:text-[32px]">
            How the service works
          </h2>
          <p className="mt-5 text-[16.5px] leading-[1.75] text-ink-3">
            {site.name} resells IPTV subscription access. We do not produce or own the channels and
            titles a subscription can reach — that content comes from third-party providers. What we
            do is make it straightforward to get set up: you choose a plan, we send an invoice, and
            once payment is confirmed your login details arrive by email and WhatsApp.
          </p>
          <p className="mt-5 text-[16.5px] leading-[1.75] text-ink-3">
            No payment is ever taken on this website. The order form asks for an invoice; it does not
            charge you. That is deliberate, and it is why you will not find a checkout here.
          </p>
          <p className="mt-5 text-[16.5px] leading-[1.75] text-ink-3">
            If it turns out not to be for you, there is a {site.refundDays}-day money-back guarantee —
            see the{' '}
            <Link to={routes.refund} className="text-accent-link hover:underline">Refund Policy</Link>{' '}
            for how it works.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link to={routes.pricing} className="btn-accent w-full sm:w-auto">View plans →</Link>
            <Link to={routes.contact} className="btn-outline w-full sm:w-auto">Talk to support</Link>
          </div>
        </div>
      </section>
    </>
  );
}
