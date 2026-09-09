import Seo from '../components/Seo';
import { pageSeo } from '../data/seo';
import { site, routes } from '../data/site';
import ChannelBrowser from '../components/ChannelBrowser';
import CountUp from '../components/CountUp';
import { channelStats } from '../data/channelStats';

/**
 * Channel guide.
 *
 * Richer than the original handoff spec: the category chips with counts, the
 * country filter, the adult toggle and the "showing N of M" meta line are all
 * carried over from the live Primo guide, which handles the same catalogue.
 */
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

      {/* The real catalogue, loaded on demand */}
      <section className="px-7 pb-[110px]">
        <ChannelBrowser />
        <p className="mx-auto mt-5 max-w-shell nums text-[10.5px] text-ink-6">
          Browse the live line-up across {channelStats.regions} countries and regions, updated{' '}
          {channelStats.generated}. Channel names belong to their owners and are shown for
          identification only.
        </p>
      </section>
    </>
  );
}
