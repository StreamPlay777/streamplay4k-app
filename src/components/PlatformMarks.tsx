/**
 * Device / platform glyphs for the compatibility section.
 *
 * Drawn as inline SVG in the same house style as PaymentMarks: no downloaded
 * artwork, no scraping, crisp at any size, a few hundred bytes each.
 *
 * These are simplified device glyphs, not replicas of any company's logo. The
 * platform NAME sits beside the glyph and does the identifying work, which is
 * both clearer for customers and the honest way to state compatibility — we
 * are naming what our service works with, not implying a partnership.
 *
 * Sizing note: the wrapper must be a flex/grid box, never a plain inline
 * <span>. Width and height do not apply to non-replaced inline boxes, so an
 * inline wrapper leaves the child <svg> with no resolvable height and it falls
 * back to its intrinsic ~300x150.
 */

import type { Platform } from '../data/platforms';

type G = { className?: string };

const svg = 'block h-full w-full';

function Fire({ className = '' }: G) {
  return (
    <svg viewBox="0 0 24 24" className={`${svg} ${className}`} fill="none" aria-hidden="true">
      {/* Stick body with a flame notch — a Fire TV stick in silhouette */}
      <rect x="3.5" y="9" width="12.5" height="6" rx="3" fill="currentColor" opacity=".85" />
      <path d="M18.4 7.6c1.9 1.3 2.8 2.8 2.8 4.4 0 1.6-.9 3.1-2.8 4.4.5-1.3.6-2.4.3-3.3-.3-.9-1-1.6-2-2.1 1-.5 1.7-1.2 2-2.1.3-.9.2-2-.3-3.3Z" fill="currentColor" />
    </svg>
  );
}

function Android({ className = '' }: G) {
  return (
    <svg viewBox="0 0 24 24" className={`${svg} ${className}`} fill="currentColor" aria-hidden="true">
      {/* Rounded head, antennae, two eyes */}
      <path d="M6 11.6a6 6 0 0 1 12 0v5.2a1.3 1.3 0 0 1-1.3 1.3H7.3A1.3 1.3 0 0 1 6 16.8v-5.2Z" />
      <rect x="2.6" y="11.2" width="2.4" height="6.4" rx="1.2" />
      <rect x="19" y="11.2" width="2.4" height="6.4" rx="1.2" />
      <path d="m7.4 5.1 1.2 2M16.6 5.1l-1.2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="9.6" cy="10.2" r=".95" fill="#0B0E18" />
      <circle cx="14.4" cy="10.2" r=".95" fill="#0B0E18" />
    </svg>
  );
}

function Apple({ className = '' }: G) {
  return (
    <svg viewBox="0 0 24 24" className={`${svg} ${className}`} fill="currentColor" aria-hidden="true">
      <path d="M16.3 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.9-1.4-.1-2.8.9-3.5.9-.7 0-1.9-.9-3.1-.8-1.6 0-3.1.9-3.9 2.4-1.7 2.9-.4 7.2 1.2 9.5.8 1.2 1.7 2.5 3 2.4 1.2 0 1.6-.8 3.1-.8 1.4 0 1.8.8 3.1.7 1.3 0 2.1-1.2 2.9-2.4.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.6-1-2.7-3.8ZM14 5.5c.6-.8 1.1-1.9 1-3-.9 0-2.1.6-2.8 1.4-.6.7-1.2 1.9-1 3 1 .1 2.1-.5 2.8-1.4Z" />
    </svg>
  );
}

function Tv({ className = '' }: G) {
  return (
    <svg viewBox="0 0 24 24" className={`${svg} ${className}`} fill="none" aria-hidden="true">
      <rect x="2.2" y="4.4" width="19.6" height="13" rx="2.2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8.2 20.4h7.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M12 17.4v3" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function Cast({ className = '' }: G) {
  return (
    <svg viewBox="0 0 24 24" className={`${svg} ${className}`} fill="none" aria-hidden="true">
      <path d="M3 6.4A2.4 2.4 0 0 1 5.4 4h13.2A2.4 2.4 0 0 1 21 6.4v11.2a2.4 2.4 0 0 1-2.4 2.4h-4.2"
            stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M3 19.9a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2Z" fill="currentColor" />
      <path d="M3 15.2a4.8 4.8 0 0 1 4.8 4.8M3 10.6A9.4 9.4 0 0 1 12.4 20"
            stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function Windows({ className = '' }: G) {
  return (
    <svg viewBox="0 0 24 24" className={`${svg} ${className}`} fill="currentColor" aria-hidden="true">
      <path d="M3 5.9 11 4.8v7.3H3V5.9ZM12.3 4.6 21 3.4v8.7h-8.7V4.6ZM3 13.4h8v7.2L3 19.4v-6ZM12.3 13.4H21v8.7l-8.7-1.2v-7.5Z" />
    </svg>
  );
}

function Mac({ className = '' }: G) {
  return (
    <svg viewBox="0 0 24 24" className={`${svg} ${className}`} fill="none" aria-hidden="true">
      <rect x="3.4" y="4.6" width="17.2" height="11.4" rx="1.9" stroke="currentColor" strokeWidth="1.7" />
      <path d="M1.6 19.3h20.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M10 19.3h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function Vlc({ className = '' }: G) {
  return (
    <svg viewBox="0 0 24 24" className={`${svg} ${className}`} fill="none" aria-hidden="true">
      {/* Traffic cone in outline — VLC's shape, not its artwork */}
      <path d="M12 3.2 17.6 17H6.4L12 3.2Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M8.6 10.2h6.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="4.2" y="17" width="15.6" height="3.6" rx="1.4" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}


function Roku({ className = '' }: G) {
  return (
    <svg viewBox="0 0 24 24" className={`${svg} ${className}`} fill="none" aria-hidden="true">
      {/* Rounded badge with the notch of the Roku mark, drawn not copied */}
      <rect x="1.6" y="5" width="20.8" height="14" rx="3.4" stroke="currentColor" strokeWidth="1.7" />
      <path d="M7 15.4V8.6h3.1a2.1 2.1 0 0 1 0 4.2H7.9l2.6 2.6" stroke="currentColor" strokeWidth="1.7"
            strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="16.4" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function Mag({ className = '' }: G) {
  return (
    <svg viewBox="0 0 24 24" className={`${svg} ${className}`} fill="none" aria-hidden="true">
      {/* Set-top box: shallow slab, front indicator, vents */}
      <rect x="1.8" y="7.6" width="20.4" height="8.8" rx="2.2" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="18.4" cy="12" r="1.15" fill="currentColor" />
      <path d="M5 10.9h7.4M5 13.3h5.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function Kodi({ className = '' }: G) {
  return (
    <svg viewBox="0 0 24 24" className={`${svg} ${className}`} fill="none" aria-hidden="true">
      {/* Media-centre play mark inside a soft container */}
      <path d="M12 1.9 22.1 12 12 22.1 1.9 12 12 1.9Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M10.1 8.5 15.3 12l-5.2 3.5V8.5Z" fill="currentColor" />
    </svg>
  );
}

function Box({ className = '' }: G) {
  return (
    <svg viewBox="0 0 24 24" className={`${svg} ${className}`} fill="none" aria-hidden="true">
      {/* Android set-top box: cube with a status light */}
      <rect x="2.6" y="6.4" width="18.8" height="11.2" rx="2.6" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.6" cy="12" r="1.2" fill="currentColor" />
      <path d="M6 9.6h6.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M6 14.4h4.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function TabletMark({ className = '' }: G) {
  return (
    <svg viewBox="0 0 24 24" className={`${svg} ${className}`} fill="none" aria-hidden="true">
      <rect x="4.2" y="2.2" width="15.6" height="19.6" rx="2.6" stroke="currentColor" strokeWidth="1.7" />
      <path d="M10.6 19h2.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function PhoneMark({ className = '' }: G) {
  return (
    <svg viewBox="0 0 24 24" className={`${svg} ${className}`} fill="none" aria-hidden="true">
      <rect x="6.4" y="2.2" width="11.2" height="19.6" rx="2.6" stroke="currentColor" strokeWidth="1.7" />
      <path d="M10.8 18.9h2.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

const MARKS = {
  fire: Fire, android: Android, apple: Apple, tv: Tv, cast: Cast,
  windows: Windows, mac: Mac, vlc: Vlc,
  roku: Roku, mag: Mag, kodi: Kodi, box: Box, tablet: TabletMark, phone: PhoneMark,
};

/**
 * One platform tile. Glyph over name, on the same dark glass surface the
 * payment chips use so the two systems read as one family.
 */
export default function PlatformTile({ platform }: { platform: Platform }) {
  const Mark = MARKS[platform.mark];
  return (
    <div
      title={platform.note}
      className="group flex h-[104px] w-[140px] flex-none flex-col items-center justify-center gap-2.5
                 rounded-2xl border border-line
                 bg-[linear-gradient(158deg,var(--raise-2),var(--raise))]
                 px-3 text-center backdrop-blur-[2px]
                 shadow-[inset_0_1px_0_var(--glass-inset)]
                 transition-colors duration-300 hover:border-line-3
                 sm:h-[116px] sm:w-[158px]"
    >
      <span className="h-[26px] w-[26px] flex-none text-ink-2 transition-colors duration-300 group-hover:text-accent-bright sm:h-[28px] sm:w-[28px]">
        <Mark />
      </span>
      <span className="font-display text-[12.5px] font-bold leading-tight text-ink sm:text-[13.5px]">
        {platform.name}
      </span>
    </div>
  );
}
