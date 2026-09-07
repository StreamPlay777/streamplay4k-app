/**
 * Payment acceptance marks, drawn as inline SVG.
 *
 * Card schemes and wallets publish acceptance marks precisely so merchants can
 * show what they take, and showing them is the intended use. Drawn rather than
 * downloaded: no external files, no scraping, crisp at any size, a few hundred
 * bytes each. Simplified to the recognisable form of each mark — swap in the
 * official artwork from each brand's acceptance-mark kit if you want it
 * pixel-exact.
 *
 * Sizing note: the chip MUST be a flex/grid box, never a plain inline <span>.
 * Width and height do not apply to non-replaced inline boxes, so an inline
 * wrapper leaves the child <svg> with no resolvable height and it falls back to
 * its intrinsic size (~300x150), which blows the whole row apart.
 */

type MarkProps = { className?: string };

/**
 * Dark acceptance chip, tuned for our theme: near-black glass tile, hairline
 * rim, an inset top highlight so it reads as raised rather than painted on.
 * Uniform size for every mark, which is what makes the row look like a set.
 */
const chip =
  'group inline-flex h-[32px] w-[50px] flex-none items-center justify-center overflow-hidden ' +
  'rounded-[7px] border border-white/[.10] bg-[linear-gradient(158deg,#1C2231_0%,#0D1119_100%)] ' +
  'px-[5px] py-[6px] shadow-[inset_0_1px_0_rgba(255,255,255,.07),0_1px_3px_rgba(0,0,0,.45)] ' +
  'transition-colors duration-200 hover:border-white/25';

/** Fits inside the chip, keeps its own aspect ratio, never spills. */
const art = 'block h-full w-full';

const HELV = "Helvetica, Arial, 'Liberation Sans', sans-serif";

/* ------------------------------------------------------------------ cards */

function Visa({ className = '' }: MarkProps) {
  return (
    <span className={`${chip} ${className}`} title="Visa">
      <svg viewBox="0 0 48 15" className={art} preserveAspectRatio="xMidYMid meet"
           role="img" aria-label="Visa">
        {/* Visa navy is unreadable on near-black; this is the scheme blue lifted
            to stay legible on a dark chip. */}
        <text x="24" y="12.5" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif"
              fontSize="14" fontWeight="700" fontStyle="italic" fill="#2E6BFF"
              letterSpacing="0.4">VISA</text>
      </svg>
    </span>
  );
}

function Mastercard({ className = '' }: MarkProps) {
  return (
    <span className={`${chip} ${className}`} title="Mastercard">
      <svg viewBox="0 0 38 24" className={art} preserveAspectRatio="xMidYMid meet"
           role="img" aria-label="Mastercard">
        <circle cx="14.6" cy="12" r="9.4" fill="#EB001B" />
        <circle cx="23.4" cy="12" r="9.4" fill="#F79E1B" />
        <path d="M19 4.8a9.4 9.4 0 0 0 0 14.4 9.4 9.4 0 0 0 0-14.4Z" fill="#FF5F00" />
      </svg>
    </span>
  );
}

function Amex({ className = '' }: MarkProps) {
  return (
    <span className={`${chip} ${className}`} title="American Express">
      <svg viewBox="0 0 40 24" className={art} preserveAspectRatio="xMidYMid meet"
           role="img" aria-label="American Express">
        <rect width="40" height="24" rx="3" fill="#1F72CD" />
        <text x="20" y="11" textAnchor="middle" fontFamily={HELV} fontSize="7.2"
              fontWeight="700" fill="#fff" letterSpacing="0.5">AMERICAN</text>
        <text x="20" y="19" textAnchor="middle" fontFamily={HELV} fontSize="7.2"
              fontWeight="700" fill="#fff" letterSpacing="0.5">EXPRESS</text>
      </svg>
    </span>
  );
}

function Discover({ className = '' }: MarkProps) {
  return (
    <span className={`${chip} ${className}`} title="Discover">
      <svg viewBox="0 0 62 16" className={art} preserveAspectRatio="xMidYMid meet"
           role="img" aria-label="Discover">
        <text x="0" y="12.5" fontFamily={HELV} fontSize="12" fontWeight="700"
              fill="#F2F4F8" letterSpacing="-0.2">DISC</text>
        <circle cx="30.5" cy="8.4" r="4.6" fill="#F76B1C" />
        <text x="36.5" y="12.5" fontFamily={HELV} fontSize="12" fontWeight="700"
              fill="#F2F4F8" letterSpacing="-0.2">VER</text>
      </svg>
    </span>
  );
}

function DinersClub({ className = '' }: MarkProps) {
  return (
    <span className={`${chip} ${className}`} title="Diners Club">
      <svg viewBox="0 0 54 22" className={art} preserveAspectRatio="xMidYMid meet"
           role="img" aria-label="Diners Club">
        <circle cx="11" cy="11" r="9.6" fill="#0079BE" />
        <circle cx="11" cy="11" r="6.3" fill="#fff" />
        <rect x="9.6" y="4.7" width="2.8" height="12.6" fill="#0079BE" />
        <text x="24" y="9.4" fontFamily={HELV} fontSize="6.6" fontWeight="700"
              fill="#E6EAF2" letterSpacing="0.3">DINERS</text>
        <text x="24" y="17.4" fontFamily={HELV} fontSize="6.6" fontWeight="700"
              fill="#E6EAF2" letterSpacing="0.3">CLUB</text>
      </svg>
    </span>
  );
}

function JCB({ className = '' }: MarkProps) {
  return (
    <span className={`${chip} ${className}`} title="JCB">
      <svg viewBox="0 0 40 26" className={art} preserveAspectRatio="xMidYMid meet"
           role="img" aria-label="JCB">
        <rect x="0.5" y="0.5" width="12" height="25" rx="3" fill="#0E4C96" />
        <rect x="14" y="0.5" width="12" height="25" rx="3" fill="#D0202E" />
        <rect x="27.5" y="0.5" width="12" height="25" rx="3" fill="#007B40" />
        <text x="6.5" y="17" textAnchor="middle" fontFamily={HELV} fontSize="11"
              fontWeight="700" fill="#fff">J</text>
        <text x="20" y="17" textAnchor="middle" fontFamily={HELV} fontSize="11"
              fontWeight="700" fill="#fff">C</text>
        <text x="33.5" y="17" textAnchor="middle" fontFamily={HELV} fontSize="11"
              fontWeight="700" fill="#fff">B</text>
      </svg>
    </span>
  );
}

function UnionPay({ className = '' }: MarkProps) {
  return (
    <span className={`${chip} ${className}`} title="UnionPay">
      <svg viewBox="0 0 44 26" className={art} preserveAspectRatio="xMidYMid meet"
           role="img" aria-label="UnionPay">
        <path d="M8.4 1h9.2l-4 24H4.4a3 3 0 0 1-3-3.5L4.9 3.6A3.2 3.2 0 0 1 8.4 1Z" fill="#E21836" />
        <path d="M19.6 1h9.2l-4 24h-9.2l4-24Z" fill="#00447C" />
        <path d="M30.8 1h8.8a3 3 0 0 1 3 3.5l-3.5 17.9a3.2 3.2 0 0 1-3.5 2.6h-8.8l4-24Z" fill="#007B84" />
      </svg>
    </span>
  );
}

function CardGeneric({ className = '' }: MarkProps) {
  return (
    <span className={`${chip} ${className}`} title="Debit &amp; credit cards">
      <svg viewBox="0 0 40 26" className={art} preserveAspectRatio="xMidYMid meet"
           role="img" aria-label="Debit and credit cards">
        <rect x="1" y="2" width="38" height="22" rx="3.5" fill="none"
              stroke="#9AA6BF" strokeWidth="2" />
        <rect x="1" y="7" width="38" height="4.5" fill="#9AA6BF" />
        <rect x="5" y="16" width="12" height="3" rx="1.5" fill="#9AA6BF" />
      </svg>
    </span>
  );
}

/* ---------------------------------------------------------------- wallets */

function ApplePay({ className = '' }: MarkProps) {
  return (
    <span className={`${chip} ${className}`} title="Apple Pay">
      <svg viewBox="0 0 44 18" className={art} preserveAspectRatio="xMidYMid meet"
           role="img" aria-label="Apple Pay">
        {/* Apple's dark-background asset is the white mark. */}
        <path
          fill="#fff"
          transform="translate(2 1.4) scale(0.66)"
          d="M13.6 7.3c-.6.7-1.5 1.2-2.4 1.1-.1-.9.3-1.9.8-2.5.6-.7 1.6-1.2 2.4-1.2.1 1-.3 1.9-.8 2.6Zm.8 1.3c-1.3-.1-2.5.8-3.1.8-.7 0-1.6-.7-2.7-.7-1.4 0-2.7.8-3.4 2.1-1.5 2.5-.4 6.2 1 8.3.7 1 1.5 2.1 2.6 2.1 1 0 1.4-.7 2.7-.7s1.6.7 2.7.6c1.1 0 1.8-1 2.5-2 .8-1.2 1.1-2.3 1.1-2.3s-2.2-.9-2.2-3.3c0-2.1 1.7-3 1.8-3.1-1-1.4-2.5-1.6-3-1.8Z"
        />
        <text x="15.5" y="13.8" fontFamily={HELV} fontSize="11.5" fontWeight="500"
              fill="#fff">Pay</text>
      </svg>
    </span>
  );
}

function GooglePay({ className = '' }: MarkProps) {
  return (
    <span className={`${chip} ${className}`} title="Google Pay">
      <svg viewBox="0 0 60 24" className={art} preserveAspectRatio="xMidYMid meet"
           role="img" aria-label="Google Pay">
        {/* Four-colour G, built from arcs of one circle plus the crossbar. */}
        <g fill="none" strokeWidth="3.4" strokeLinecap="butt">
          <path stroke="#4285F4" d="M19 12A7 7 0 0 1 16.95 16.95" />
          <path stroke="#34A853" d="M16.95 16.95A7 7 0 0 1 7.05 16.95" />
          <path stroke="#FBBC05" d="M7.05 16.95A7 7 0 0 1 7.05 7.05" />
          <path stroke="#EA4335" d="M7.05 7.05A7 7 0 0 1 18.58 9.61" />
        </g>
        <rect x="12.4" y="10.3" width="6.6" height="3.4" fill="#4285F4" />
        <text x="24" y="16.4" fontFamily={HELV} fontSize="12.5" fontWeight="500"
              fill="#EEF1F6">Pay</text>
      </svg>
    </span>
  );
}

function PayPal({ className = '' }: MarkProps) {
  return (
    <span className={`${chip} ${className}`} title="PayPal">
      <svg viewBox="0 0 56 17" className={art} preserveAspectRatio="xMidYMid meet"
           role="img" aria-label="PayPal">
        {/* PayPal's dark-background lockup keeps the two blues. */}
        <text x="0" y="13.5" fontFamily={HELV} fontSize="13" fontWeight="700"
              fontStyle="italic" fill="#4C8BF5">Pay</text>
        <text x="24" y="13.5" fontFamily={HELV} fontSize="13" fontWeight="700"
              fontStyle="italic" fill="#00B4E6">Pal</text>
      </svg>
    </span>
  );
}

function LinkPay({ className = '' }: MarkProps) {
  return (
    <span className={`${chip} ${className}`} title="Link">
      <svg viewBox="0 0 40 22" className={art} preserveAspectRatio="xMidYMid meet"
           role="img" aria-label="Link">
        <rect width="40" height="22" rx="4.5" fill="#00D66F" />
        <text x="20" y="15.6" textAnchor="middle" fontFamily={HELV} fontSize="11.5"
              fontWeight="700" fill="#011E0F">link</text>
      </svg>
    </span>
  );
}

export const MARKS = {
  Visa,
  Mastercard,
  Amex,
  Discover,
  'Diners Club': DinersClub,
  JCB,
  UnionPay,
  Card: CardGeneric,
  'Apple Pay': ApplePay,
  'Google Pay': GooglePay,
  PayPal,
  Link: LinkPay,
} as const;

export type MarkName = keyof typeof MARKS;

/** Row of acceptance marks. Names must match the MARKS keys. */
export default function PaymentMarks({
  methods, className = '',
}: {
  methods: readonly string[];
  className?: string;
}) {
  return (
    <ul className={`flex flex-wrap items-center gap-[7px] ${className}`}>
      {methods.map((m) => {
        const Mark = MARKS[m as MarkName];
        if (!Mark) return null;
        return (
          <li key={m} className="flex">
            <Mark />
          </li>
        );
      })}
    </ul>
  );
}
