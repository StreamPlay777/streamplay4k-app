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
 * Two rules keep the row looking like a set:
 *
 * 1. The chip MUST be a flex/grid box, never a plain inline <span>. Width and
 *    height do not apply to non-replaced inline boxes, so an inline wrapper
 *    leaves the child <svg> with no resolvable height and it falls back to its
 *    intrinsic size (~300x150), which blows the whole row apart.
 * 2. The chip steps down a size on the narrowest phones. Six marks beside a
 *    form column at 390px would otherwise wrap with one mark stranded on a
 *    line of its own, which reads as a broken row rather than a set.
 * 3. Every viewBox is 40 units tall. Marks then scale by the same factor into
 *    the chip, so cap heights line up instead of each mark finding its own
 *    size. Width varies per mark, exactly as the real logos do.
 */

type MarkProps = { className?: string };

/**
 * Acceptance chip. Dark glass to sit on our theme: a faint lit gradient, a
 * hairline rim, and a bright top edge so it reads as raised. Lifts gently on
 * hover.
 */
const chip =
  'inline-flex h-[28px] w-[46px] min-[420px]:h-[30px] min-[420px]:w-[52px] sm:h-[32px] sm:w-[56px] '
  'flex-none items-center justify-center overflow-hidden ' +
  'rounded-[9px] border border-white/[.09] bg-[linear-gradient(160deg,rgba(255,255,255,.075),rgba(255,255,255,.018))] ' +
  'px-[5px] py-[6px] backdrop-blur-[2px] ' +
  'shadow-[inset_0_1px_0_rgba(255,255,255,.10),0_2px_6px_-2px_rgba(0,0,0,.55)] ' +
  'transition duration-300 ease-out ' +
  'hover:-translate-y-[1.5px] hover:border-white/25 ' +
  'hover:shadow-[inset_0_1px_0_rgba(255,255,255,.16),0_6px_16px_-6px_rgba(0,0,0,.7)] ' +
  'motion-reduce:transform-none motion-reduce:transition-none';

/** Fits inside the chip, keeps its own aspect ratio, never spills. */
const art = 'block h-full w-full';

const HELV = "Helvetica, Arial, 'Liberation Sans', sans-serif";

function Visa({ className = '' }: MarkProps) {
  return (
    <span className={`${chip} ${className}`} title="Visa">
      <svg viewBox="0 0 88 40" className={art} preserveAspectRatio="xMidYMid meet"
           role="img" aria-label="Visa">
        {/* Visa navy (#1A1F71) is unreadable on near-black, so the scheme blue
            is lifted just enough to stay legible on a dark chip. */}
        <text x="44" y="32" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif"
              fontSize="30" fontWeight="700" fontStyle="italic" fill="#3D77FF"
              letterSpacing="0.5">VISA</text>
      </svg>
    </span>
  );
}

function Mastercard({ className = '' }: MarkProps) {
  return (
    <span className={`${chip} ${className}`} title="Mastercard">
      <svg viewBox="0 0 62 40" className={art} preserveAspectRatio="xMidYMid meet"
           role="img" aria-label="Mastercard">
        <circle cx="21.5" cy="20" r="18.5" fill="#EB001B" />
        <circle cx="40.5" cy="20" r="18.5" fill="#F79E1B" />
        <path d="M31 5.8a18.5 18.5 0 0 0 0 28.4 18.5 18.5 0 0 0 0-28.4Z" fill="#FF5F00" />
      </svg>
    </span>
  );
}

function Amex({ className = '' }: MarkProps) {
  return (
    <span className={`${chip} ${className}`} title="American Express">
      <svg viewBox="0 0 78 40" className={art} preserveAspectRatio="xMidYMid meet"
           role="img" aria-label="American Express">
        <rect x="1" y="1" width="76" height="38" rx="5" fill="#1F72CD" />
        <text x="39" y="18" textAnchor="middle" fontFamily={HELV} fontSize="11.5"
              fontWeight="700" fill="#fff" letterSpacing="0.6">AMERICAN</text>
        <text x="39" y="31" textAnchor="middle" fontFamily={HELV} fontSize="11.5"
              fontWeight="700" fill="#fff" letterSpacing="0.6">EXPRESS</text>
      </svg>
    </span>
  );
}

function Discover({ className = '' }: MarkProps) {
  return (
    <span className={`${chip} ${className}`} title="Discover">
      <svg viewBox="0 0 122 40" className={art} preserveAspectRatio="xMidYMid meet"
           role="img" aria-label="Discover">
        <text x="0" y="29" fontFamily={HELV} fontSize="22" fontWeight="700"
              fill="#EEF1F6" letterSpacing="-0.4">DISC</text>
        <circle cx="63" cy="21.5" r="8.6" fill="#F76B1C" />
        <text x="74" y="29" fontFamily={HELV} fontSize="22" fontWeight="700"
              fill="#EEF1F6" letterSpacing="-0.4">VER</text>
      </svg>
    </span>
  );
}

function ApplePay({ className = '' }: MarkProps) {
  return (
    <span className={`${chip} ${className}`} title="Apple Pay">
      <svg viewBox="0 0 82 40" className={art} preserveAspectRatio="xMidYMid meet"
           role="img" aria-label="Apple Pay">
        {/* Apple's dark-background asset is the white mark. */}
        <path
          fill="#fff"
          transform="translate(0 3.2) scale(1.42)"
          d="M13.6 7.3c-.6.7-1.5 1.2-2.4 1.1-.1-.9.3-1.9.8-2.5.6-.7 1.6-1.2 2.4-1.2.1 1-.3 1.9-.8 2.6Zm.8 1.3c-1.3-.1-2.5.8-3.1.8-.7 0-1.6-.7-2.7-.7-1.4 0-2.7.8-3.4 2.1-1.5 2.5-.4 6.2 1 8.3.7 1 1.5 2.1 2.6 2.1 1 0 1.4-.7 2.7-.7s1.6.7 2.7.6c1.1 0 1.8-1 2.5-2 .8-1.2 1.1-2.3 1.1-2.3s-2.2-.9-2.2-3.3c0-2.1 1.7-3 1.8-3.1-1-1.4-2.5-1.6-3-1.8Z"
        />
        <text x="30" y="30" fontFamily={HELV} fontSize="26" fontWeight="500"
              fill="#fff">Pay</text>
      </svg>
    </span>
  );
}

function GooglePay({ className = '' }: MarkProps) {
  return (
    <span className={`${chip} ${className}`} title="Google Pay">
      <svg viewBox="0 0 88 40" className={art} preserveAspectRatio="xMidYMid meet"
           role="img" aria-label="Google Pay">
        {/* Four-colour G: arcs of one circle, plus the crossbar. */}
        <g fill="none" strokeWidth="6.3" strokeLinecap="butt">
          <path stroke="#4285F4" d="M30 20A13 13 0 0 1 26.19 29.19" />
          <path stroke="#34A853" d="M26.19 29.19A13 13 0 0 1 7.81 29.19" />
          <path stroke="#FBBC05" d="M7.81 29.19A13 13 0 0 1 7.81 10.81" />
          <path stroke="#EA4335" d="M7.81 10.81A13 13 0 0 1 29.22 15.55" />
        </g>
        <rect x="17.6" y="16.85" width="12.4" height="6.3" fill="#4285F4" />
        <text x="38" y="30" fontFamily={HELV} fontSize="26" fontWeight="500"
              fill="#EEF1F6">Pay</text>
      </svg>
    </span>
  );
}

function PayPal({ className = '' }: MarkProps) {
  return (
    <span className={`${chip} ${className}`} title="PayPal">
      <svg viewBox="0 0 96 40" className={art} preserveAspectRatio="xMidYMid meet"
           role="img" aria-label="PayPal">
        {/* PayPal's dark-background lockup keeps both blues, brightened. */}
        <text x="0" y="30" fontFamily={HELV} fontSize="26" fontWeight="700"
              fontStyle="italic" fill="#5A97FF">Pay</text>
        <text x="46" y="30" fontFamily={HELV} fontSize="26" fontWeight="700"
              fontStyle="italic" fill="#12BEEC">Pal</text>
      </svg>
    </span>
  );
}

function LinkPay({ className = '' }: MarkProps) {
  return (
    <span className={`${chip} ${className}`} title="Link">
      <svg viewBox="0 0 74 40" className={art} preserveAspectRatio="xMidYMid meet"
           role="img" aria-label="Link">
        <rect width="74" height="40" rx="9" fill="#00D66F" />
        <text x="37" y="28" textAnchor="middle" fontFamily={HELV} fontSize="21"
              fontWeight="700" fill="#011E0F">link</text>
      </svg>
    </span>
  );
}

export const MARKS = {
  Visa, Mastercard, Amex, Discover, 'Apple Pay': ApplePay,
  'Google Pay': GooglePay, PayPal, Link: LinkPay,
} as const;

export type MarkName = keyof typeof MARKS;

/**
 * Below 420px the row becomes a three-column grid, so six marks always land as
 * a tidy 3 + 3. Left to wrap on their own they split 5 + 1 at 375px, and a
 * lone stranded mark reads as a rendering fault rather than a set.
 */
const ALIGN = {
  start: 'justify-items-start min-[420px]:justify-start',
  center: 'justify-items-center min-[420px]:justify-center',
  end: 'justify-items-end min-[420px]:justify-end',
} as const;

/**
 * Row of acceptance marks. Names must match the MARKS keys.
 *
 * `align` should follow the section the row sits in — centred inside a centred
 * card, left in a left-aligned column — so the marks never look adrift.
 */
export default function PaymentMarks({
  methods, align = 'start', className = '',
}: {
  methods: readonly string[];
  align?: keyof typeof ALIGN;
  className?: string;
}) {
  return (
    <ul
      className={`grid grid-cols-3 gap-[6px] min-[420px]:flex min-[420px]:flex-wrap
                  min-[420px]:items-center sm:gap-2 ${ALIGN[align]} ${className}`}
    >
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
