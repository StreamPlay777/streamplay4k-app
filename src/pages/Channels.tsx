import Seo from '../components/Seo';
import { pageSeo } from '../data/seo';
import { site, routes } from '../data/site';
import ChannelBrowser from '../components/ChannelBrowser';
import CountUp from '../components/CountUp';
import ClosingCta from '../components/ClosingCta';
import Reveal from '../components/Reveal';
import { SectionHeading } from '../components/ui';
import { MAX_DEVICES } from '../data/pricing';
import { CatIcon } from '../components/CategoryIcons';
import { channelStats } from '../data/channelStats';

/**
 * Channel guide.
 *
 * Richer than the original handoff spec: the category chips with counts, the
 * country filter, the adult toggle and the "showing N of M" meta line are all
 * carried over from the live Primo guide, which handles the same catalogue.
 */
const categoryCards = [
  { label: 'Live Sports', note: 'channels', value: channelStats.groups.sports.toLocaleString('en-US'), icon: <CatIcon name="sports" /> },
  { label: 'Movies', note: 'and 24/7 film channels', value: channelStats.groups.movies.toLocaleString('en-US'), icon: <CatIcon name="movies" /> },
  { label: 'Entertainment', note: 'channels', value: channelStats.groups.entertainment.toLocaleString('en-US'), icon: <CatIcon name="entertainment" /> },
  { label: 'Kids', note: 'and family channels', value: channelStats.groups.kids.toLocaleString('en-US'), icon: <CatIcon name="kids" /> },
  { label: 'News', note: 'channels worldwide', value: channelStats.groups.news.toLocaleString('en-US'), icon: <CatIcon name="news" /> },
  { label: '4K & UHD', note: 'channels', value: channelStats.groups.uhd.toLocaleString('en-US'), icon: <CatIcon name="uhd" /> },
];

const includedCards = [
  {
    title: `Up to ${MAX_DEVICES} devices`,
    body: 'Share it with the family. Everyone watches what they want, at the same time.',
    icon: <CatIcon name="devices" />,
  },
  {
    title: `${site.channels} channels`,
    body: 'Sports, news, entertainment and kids. Every channel you need, in one place.',
    icon: <CatIcon name="entertainment" />,
  },
  {
    title: 'Set up in minutes',
    body: `Install the app, sign in with the details we send, and start watching — usually ready in ${site.activationWindow}.`,
    icon: <CatIcon name="setup" />,
  },
  {
    title: '24/7 human support',
    body: 'Message us any time. A real person answers on WhatsApp, not a ticket queue.',
    icon: <CatIcon name="support" />,
  },
];

export default function Channels() {
  // Every figure is counted from the shipped catalogue rather than asserted.
  const stats = [
    { value: site.channels, label: 'Live channels' },
    { value: String(channelStats.regions), label: 'Countries & regions' },
    { value: site.vod, label: 'Movies & series' },
  ];

  return (
    <>
      <Seo seo={pageSeo[routes.channels]} />
      {/* Header */}
      <section className="px-7 pb-[46px] pt-[74px]">
        <div className="mx-auto max-w-shell">
          <div className="eyebrow">Channel guide</div>
          <h1 className="mt-4 font-display font-extrabold leading-none text-ink" style={{ fontSize: 'clamp(38px, 6.5vw, 66px)' }}>
            Every channel.
            <br />
            <span className="text-grad">Every country.</span>
          </h1>
          <p className="mt-6 max-w-[620px] text-[18px] leading-relaxed text-ink-3">
            The US, the UK, Europe, the Arab world and South Asia — in HD, 4K and 8K.
            Search the whole line-up by name, or browse by where you are from.
          </p>
        </div>
      </section>

      {/* Stat cards */}
      <section className="px-7 pb-10">
        <div className="mx-auto grid max-w-shell gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="card px-6 py-7">
              <CountUp as="div" value={s.value} className="font-display text-[36px] font-extrabold leading-none text-ink" />
              <div className="mt-2.5 text-[14px] text-ink-3">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* What the line-up covers, category by category.
          Counts are the real group totals from the catalogue build, not round
          marketing numbers — a specific figure is more persuasive than a
          rounded one, and these can be checked by filtering the browser below
          on the same category. */}
      <section className="section-tight px-7">
        <div className="mx-auto max-w-shell">
          <SectionHeading
            label="Explore the line-up"
            title={<>TV Made <span className="text-grad">For You</span></>}
            sub="What a subscription covers, category by category."
          />
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categoryCards.map((c, i) => (
              <Reveal key={c.label} delay={i} shift={12} className="cat-card rounded-2xl border border-line bg-raise p-6 text-center">
                <span className="cat-icon mx-auto grid h-11 w-11 place-items-center rounded-xl" aria-hidden="true">
                  {c.icon}
                </span>
                <CountUp
                  as="p"
                  value={c.value}
                  className="nums mt-4 font-display text-[30px] font-extrabold leading-none text-ink sm:text-[34px]"
                />
                <p className="mt-2 text-[13.5px] text-ink-3">
                  <span className="font-semibold text-ink-2">{c.label}</span> {c.note}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Four things every plan includes. Straight from site.ts and
          pricing.ts, so none of it can drift from what the rest of the site
          promises. */}
      <section className="section-tight px-7">
        <div className="mx-auto max-w-shell">
          <SectionHeading
            title={<>Everything You Need, <span className="text-grad">Nothing You Don't</span></>}
            sub={`What comes with every ${site.name} subscription.`}
          />
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {includedCards.map((c, i) => (
              <Reveal key={c.title} delay={i} shift={12} className="card-hover h-full px-6 py-7">
                <span className="cat-icon grid h-11 w-11 place-items-center rounded-xl" aria-hidden="true">
                  {c.icon}
                </span>
                <h3 className="mt-4 font-display text-[16.5px] font-bold text-ink">{c.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-3">{c.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* The real catalogue, loaded on demand */}
      <section className="px-7 pb-[110px]">
        <ChannelBrowser />
        <p className="mx-auto mt-5 max-w-shell nums text-[10.5px] text-ink-6">
          Browse the live line-up across {channelStats.regions} countries and regions, updated{' '}
          {channelStats.generated}.
        </p>
      </section>

      <ClosingCta from="channels-closing" />
    </>
  );
}
