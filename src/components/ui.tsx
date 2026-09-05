import type { ReactNode } from 'react';
import type { Title } from '../data/vod';
import Poster from './Poster';

/** Centred section header: eyebrow label, h2, optional sub-paragraph. */
export function SectionHeading({
  label, title, sub, align = 'center', size = 52,
}: {
  label?: string;
  title: ReactNode;
  sub?: ReactNode;
  align?: 'center' | 'left';
  size?: number;
}) {
  const centred = align === 'center';
  return (
    <div className={centred ? 'mx-auto max-w-[720px] text-center' : 'max-w-[720px]'}>
      {label && <div className="label mb-4">{label}</div>}
      <h2
        className="font-display font-extrabold leading-[1.02] text-ink text-balance"
        style={{ fontSize: `clamp(32px, 5vw, ${size}px)` }}
      >
        {title}
      </h2>
      {sub && (
        <p className={`mt-5 text-[17px] leading-relaxed text-ink-3 ${centred ? 'mx-auto max-w-[620px]' : 'max-w-[620px]'}`}>
          {sub}
        </p>
      )}
    </div>
  );
}

/**
 * Striped stand-in for artwork not yet supplied. Every one of these is a slot
 * waiting on a real asset — see the Assets note in the design handoff.
 */
export function Placeholder({ label, note, height }: { label: string; note?: string; height: number }) {
  return (
    <div
      className="placeholder-stripes relative grid place-items-center px-4 text-center"
      style={{ height }}
    >
      <div>
        <div className="nums text-[11px] text-ink-5">{label}</div>
        {note && <div className="mt-1.5 nums text-[10px] text-ink-6">{note}</div>}
      </div>
    </div>
  );
}

/**
 * Infinite CSS marquee. The track renders its children twice back to back inside
 * a max-content flex row so the loop is seamless. Pauses on hover; disabled
 * entirely under prefers-reduced-motion (see index.css).
 */
export function Marquee({
  items, direction = 'left', duration, tight = false, renderItem,
}: {
  items: string[];
  direction?: 'left' | 'right';
  duration: number;
  tight?: boolean;
  renderItem: (item: string, key: string) => ReactNode;
}) {
  return (
    <div className={`overflow-hidden ${tight ? 'mask-rail-tight' : 'mask-rail'}`}>
      <div
        className="marquee-track flex w-max gap-2.5"
        style={{
          animationName: direction === 'left' ? 'marquee-l' : 'marquee-r',
          animationDuration: `${duration}s`,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
        }}
      >
        {[0, 1].map((pass) => (
          <div key={pass} className="flex gap-2.5" aria-hidden={pass === 1}>
            {items.map((item, i) => renderItem(item, `${pass}-${i}`))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Accent tick used across feature and checklist rows. */
export function Tick() {
  return <span className="mt-[2px] flex-none font-display text-[15px] font-bold text-accent">✓</span>;
}

/** Five accent stars. */
export function Stars({ size = 14 }: { size?: number }) {
  return (
    <div className="tracking-[.2em] text-accent" style={{ fontSize: size }} aria-label="5 out of 5 stars">
      ★★★★★
    </div>
  );
}

/** Marquee of poster cards — the on-demand rails. */
export function TitleMarquee({ titles, direction, duration }: {
  titles: Title[];
  direction: 'left' | 'right';
  duration: number;
}) {
  return (
    <div className="mask-rail-tight overflow-hidden">
      <div
        className="marquee-track flex w-max gap-2.5"
        style={{
          animationName: direction === 'left' ? 'marquee-l' : 'marquee-r',
          animationDuration: `${duration}s`,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
        }}
      >
        {[0, 1].map((pass) => (
          <div key={pass} className="flex gap-2.5" aria-hidden={pass === 1}>
            {titles.map((t) => <Poster key={`${pass}-${t.name}`} title={t} />)}
          </div>
        ))}
      </div>
    </div>
  );
}
