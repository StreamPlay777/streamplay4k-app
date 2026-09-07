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
 */

type MarkProps = { className?: string };

const box = 'h-[26px] w-[42px] flex-none rounded-[5px] bg-white p-[3px] shadow-[0_1px_3px_rgba(0,0,0,.25)]';

function Visa({ className = '' }: MarkProps) {
  return (
    <span className={`${box} ${className}`} title="Visa">
      <svg viewBox="0 0 48 16" className="h-full w-full" role="img" aria-label="Visa">
        <text x="24" y="13" textAnchor="middle" fontFamily="Georgia, serif" fontSize="14"
              fontWeight="700" fontStyle="italic" fill="#1A1F71" letterSpacing="0.5">VISA</text>
      </svg>
    </span>
  );
}

function Mastercard({ className = '' }: MarkProps) {
  return (
    <span className={`${box} ${className}`} title="Mastercard">
      <svg viewBox="0 0 48 30" className="h-full w-full" role="img" aria-label="Mastercard">
        <circle cx="19" cy="15" r="11" fill="#EB001B" />
        <circle cx="29" cy="15" r="11" fill="#F79E1B" />
        <path d="M24 6.6a11 11 0 0 0 0 16.8 11 11 0 0 0 0-16.8Z" fill="#FF5F00" />
      </svg>
    </span>
  );
}

function Amex({ className = '' }: MarkProps) {
  return (
    <span className={`${box} ${className}`} title="American Express">
      <svg viewBox="0 0 48 30" className="h-full w-full" role="img" aria-label="American Express">
        <rect width="48" height="30" rx="3" fill="#1F72CD" />
        <text x="24" y="19" textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif"
              fontSize="9" fontWeight="700" fill="#fff" letterSpacing="0.3">AMEX</text>
      </svg>
    </span>
  );
}

function ApplePay({ className = '' }: MarkProps) {
  return (
    <span className={`${box} ${className}`} title="Apple Pay">
      <svg viewBox="0 0 48 22" className="h-full w-full" role="img" aria-label="Apple Pay">
        {/* Apple glyph */}
        <path
          fill="#000"
          d="M13.6 7.3c-.6.7-1.5 1.2-2.4 1.1-.1-.9.3-1.9.8-2.5.6-.7 1.6-1.2 2.4-1.2.1 1-.3 1.9-.8 2.6Zm.8 1.3c-1.3-.1-2.5.8-3.1.8-.7 0-1.6-.7-2.7-.7-1.4 0-2.7.8-3.4 2.1-1.5 2.5-.4 6.2 1 8.3.7 1 1.5 2.1 2.6 2.1 1 0 1.4-.7 2.7-.7s1.6.7 2.7.6c1.1 0 1.8-1 2.5-2 .8-1.2 1.1-2.3 1.1-2.3s-2.2-.9-2.2-3.3c0-2.1 1.7-3 1.8-3.1-1-1.4-2.5-1.6-3-1.8Z"
        />
        <text x="27" y="16" fontFamily="Helvetica, Arial, sans-serif" fontSize="12"
              fontWeight="500" fill="#000">Pay</text>
      </svg>
    </span>
  );
}

function GooglePay({ className = '' }: MarkProps) {
  return (
    <span className={`${box} ${className}`} title="Google Pay">
      <svg viewBox="0 0 60 22" className="h-full w-full" role="img" aria-label="Google Pay">
        <text x="0" y="16" fontFamily="Helvetica, Arial, sans-serif" fontSize="14" fontWeight="500">
          <tspan fill="#4285F4">G</tspan><tspan fill="#EA4335">o</tspan><tspan fill="#FBBC05">o</tspan>
          <tspan fill="#4285F4">g</tspan><tspan fill="#34A853">l</tspan><tspan fill="#EA4335">e</tspan>
        </text>
        <text x="44" y="16" fontFamily="Helvetica, Arial, sans-serif" fontSize="14"
              fontWeight="500" fill="#5F6368">Pay</text>
      </svg>
    </span>
  );
}

function PayPal({ className = '' }: MarkProps) {
  return (
    <span className={`${box} ${className}`} title="PayPal">
      <svg viewBox="0 0 60 20" className="h-full w-full" role="img" aria-label="PayPal">
        <text x="0" y="15" fontFamily="Helvetica, Arial, sans-serif" fontSize="14"
              fontWeight="700" fontStyle="italic" fill="#003087">Pay</text>
        <text x="26" y="15" fontFamily="Helvetica, Arial, sans-serif" fontSize="14"
              fontWeight="700" fontStyle="italic" fill="#009CDE">Pal</text>
      </svg>
    </span>
  );
}

function LinkPay({ className = '' }: MarkProps) {
  return (
    <span className={`${box} ${className}`} title="Link">
      <svg viewBox="0 0 48 24" className="h-full w-full" role="img" aria-label="Link">
        <rect width="48" height="24" rx="4" fill="#00D66F" />
        <text x="24" y="17" textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif"
              fontSize="12" fontWeight="700" fill="#011E0F">link</text>
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
        return <li key={m}><Mark /></li>;
      })}
    </ul>
  );
}
