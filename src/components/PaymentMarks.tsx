/**
 * Payment marks, drawn as inline SVG.
 *
 * These were plain text before. That was over-caution on my part: I had ruled
 * out scraping broadcaster logos, and applied the same rule here. It does not
 * apply — card schemes and wallets publish acceptance marks precisely so
 * merchants can show what they take, and showing them is the intended use.
 *
 * Drawn rather than downloaded: no external files, no scraping, crisp at any
 * size, and a few hundred bytes each. Simplified to the recognisable form of
 * each mark; swap in the official assets from each brand's acceptance-mark kit
 * if you want pixel-exact artwork.
 *
 * Sizing note: the chip MUST be a flex/grid box, never a plain inline <span>.
 * Width and height do not apply to non-replaced inline boxes, so an inline
 * wrapper leaves the child <svg> with no resolvable height and it falls back to
 * its intrinsic size (~300x150), which blows the whole row apart.
 */

type MarkProps = { className?: string };

/**
 * White acceptance chip. inline-flex so the fixed size actually applies.
 * Height is uniform; width varies per mark so wide wordmarks (Google Pay,
 * PayPal) are not squeezed down to an unreadable size next to the card marks.
 */
const box =
  'inline-flex h-[26px] flex-none items-center justify-center overflow-hidden ' +
  'rounded-[5px] bg-white px-[3px] shadow-[0_1px_2px_rgba(0,0,0,.28)] ring-1 ring-black/5';

/** Every mark fits inside the chip and keeps its own aspect ratio. */
const art = 'block h-full w-full';

function Visa({ className = '' }: MarkProps) {
  return (
    <span className={`${box} w-[40px] ${className}`} title="Visa">
      <svg viewBox="0 0 48 16" className={art} preserveAspectRatio="xMidYMid meet"
           role="img" aria-label="Visa">
        <text x="24" y="13" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif"
              fontSize="14" fontWeight="700" fontStyle="italic" fill="#1A1F71"
              letterSpacing="0.5">VISA</text>
      </svg>
    </span>
  );
}

function Mastercard({ className = '' }: MarkProps) {
  return (
    <span className={`${box} w-[40px] ${className}`} title="Mastercard">
      <svg viewBox="0 0 40 24" className={art} preserveAspectRatio="xMidYMid meet"
           role="img" aria-label="Mastercard">
        <circle cx="15.5" cy="12" r="9.2" fill="#EB001B" />
        <circle cx="24.5" cy="12" r="9.2" fill="#F79E1B" />
        <path d="M20 4.9a9.2 9.2 0 0 0 0 14.2 9.2 9.2 0 0 0 0-14.2Z" fill="#FF5F00" />
      </svg>
    </span>
  );
}

function Amex({ className = '' }: MarkProps) {
  return (
    <span className={`${box} w-[40px] ${className}`} title="American Express">
      <svg viewBox="0 0 40 24" className={art} preserveAspectRatio="xMidYMid meet"
           role="img" aria-label="American Express">
        <rect width="40" height="24" rx="3" fill="#1F72CD" />
        <text x="20" y="15.5" textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif"
              fontSize="8" fontWeight="700" fill="#fff" letterSpacing="0.4">AMEX</text>
      </svg>
    </span>
  );
}

function ApplePay({ className = '' }: MarkProps) {
  return (
    <span className={`${box} w-[46px] ${className}`} title="Apple Pay">
      <svg viewBox="0 0 40 18" className={art} preserveAspectRatio="xMidYMid meet"
           role="img" aria-label="Apple Pay">
        {/* Apple glyph, scaled to sit on the same baseline as the wordmark */}
        <path
          fill="#000"
          transform="translate(2 1.6) scale(0.62)"
          d="M13.6 7.3c-.6.7-1.5 1.2-2.4 1.1-.1-.9.3-1.9.8-2.5.6-.7 1.6-1.2 2.4-1.2.1 1-.3 1.9-.8 2.6Zm.8 1.3c-1.3-.1-2.5.8-3.1.8-.7 0-1.6-.7-2.7-.7-1.4 0-2.7.8-3.4 2.1-1.5 2.5-.4 6.2 1 8.3.7 1 1.5 2.1 2.6 2.1 1 0 1.4-.7 2.7-.7s1.6.7 2.7.6c1.1 0 1.8-1 2.5-2 .8-1.2 1.1-2.3 1.1-2.3s-2.2-.9-2.2-3.3c0-2.1 1.7-3 1.8-3.1-1-1.4-2.5-1.6-3-1.8Z"
        />
        <text x="14.5" y="13.5" fontFamily="Helvetica, Arial, sans-serif" fontSize="11"
              fontWeight="500" fill="#000">Pay</text>
      </svg>
    </span>
  );
}

function GooglePay({ className = '' }: MarkProps) {
  return (
    <span className={`${box} w-[58px] ${className}`} title="Google Pay">
      <svg viewBox="0 0 71 18" className={art} preserveAspectRatio="xMidYMid meet"
           role="img" aria-label="Google Pay">
        <text x="0" y="14" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="500">
          <tspan fill="#4285F4">G</tspan><tspan fill="#EA4335">o</tspan><tspan fill="#FBBC05">o</tspan>
          <tspan fill="#4285F4">g</tspan><tspan fill="#34A853">l</tspan><tspan fill="#EA4335">e</tspan>
        </text>
        <text x="45" y="14" fontFamily="Helvetica, Arial, sans-serif" fontSize="13"
              fontWeight="500" fill="#5F6368">Pay</text>
      </svg>
    </span>
  );
}

function PayPal({ className = '' }: MarkProps) {
  return (
    <span className={`${box} w-[52px] ${className}`} title="PayPal">
      <svg viewBox="0 0 54 18" className={art} preserveAspectRatio="xMidYMid meet"
           role="img" aria-label="PayPal">
        <text x="0" y="14" fontFamily="Helvetica, Arial, sans-serif" fontSize="13"
              fontWeight="700" fontStyle="italic" fill="#003087">Pay</text>
        <text x="24" y="14" fontFamily="Helvetica, Arial, sans-serif" fontSize="13"
              fontWeight="700" fontStyle="italic" fill="#009CDE">Pal</text>
      </svg>
    </span>
  );
}

function LinkPay({ className = '' }: MarkProps) {
  return (
    <span className={`${box} w-[40px] ${className}`} title="Link">
      <svg viewBox="0 0 40 22" className={art} preserveAspectRatio="xMidYMid meet"
           role="img" aria-label="Link">
        <rect width="40" height="22" rx="4" fill="#00D66F" />
        <text x="20" y="15.5" textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif"
              fontSize="11" fontWeight="700" fill="#011E0F">link</text>
      </svg>
    </span>
  );
}

export const MARKS = {
  Visa, Mastercard, Amex, 'Apple Pay': ApplePay,
  'Google Pay': GooglePay, PayPal, Link: LinkPay,
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
    <ul className={`flex flex-wrap items-center gap-1.5 ${className}`}>
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
