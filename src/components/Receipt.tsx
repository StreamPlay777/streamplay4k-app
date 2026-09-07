import { basket, basketMonthlyCents, basketYearlyCents, paymentsPerYear, receiptMeta } from '../data/competitors';

const money = (c: number) => (c / 100).toFixed(2);
const withCommas = (c: number) =>
  (c / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/**
 * The till receipt — what a household pays before switching.
 *
 * Set in monospace, because a receipt that is not monospaced does not read as
 * a receipt; the aligned price column is the whole device. See .font-receipt.
 *
 * The torn edges are an SVG zigzag rather than a CSS trick, and the circle
 * round the total is a hand-drawn SVG ellipse — a CSS border-radius circle is
 * too perfect and kills the "someone marked this up" effect.
 *
 * Every figure comes from src/data/competitors.ts. Nothing is typed in here.
 */

function TornEdge({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 120 6"
      preserveAspectRatio="none"
      className="block h-[7px] w-full"
      style={flip ? { transform: 'scaleY(-1)' } : undefined}
      aria-hidden="true"
    >
      <path d="M0 6 L5 0 L10 6 L15 0 L20 6 L25 0 L30 6 L35 0 L40 6 L45 0 L50 6 L55 0 L60 6 L65 0 L70 6 L75 0 L80 6 L85 0 L90 6 L95 0 L100 6 L105 0 L110 6 L115 0 L120 6 Z"
            fill="#FDFCF8" />
    </svg>
  );
}

export default function Receipt() {
  return (
    <div className="relative">
      {/* Annotation above the paper */}
      <div className="relative mb-3 flex items-start justify-between gap-3">
        <span className="pt-1 font-display text-[12px] font-extrabold uppercase tracking-[.18em] text-accent sm:text-[13px]">
          Without Streamplay4k
        </span>
        <span className="relative flex-none text-right">
          <span
            className="block whitespace-nowrap font-hand text-[17px] font-bold text-accent sm:text-[20px]"
            style={{ transform: 'rotate(-3deg)' }}
          >
            Every. Single. Month.
          </span>
          {/* Hand-drawn arrow curving down toward the receipt */}
          <svg viewBox="0 0 90 54" className="ml-auto mt-0.5 h-[34px] w-[58px]" aria-hidden="true">
            <path d="M78 4 C64 2, 30 8, 14 34" fill="none" stroke="currentColor"
                  strokeWidth="2.6" strokeLinecap="round" className="text-accent" />
            <path d="M8 46 L14 33 L25 39" fill="none" stroke="currentColor"
                  strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="text-accent" />
          </svg>
        </span>
      </div>

      <div style={{ filter: 'drop-shadow(0 24px 55px rgba(0,0,0,.6))' }}>
        <TornEdge />

        <div className="font-receipt bg-[#FDFCF8] px-4 pb-4 pt-3 text-[#14161C] sm:px-6 sm:pb-5 sm:pt-4">
          {/* Meta */}
          <div className="flex justify-between text-[10.5px] text-[#6E6A61] sm:text-[11.5px]">
            <span>{receiptMeta.customer}</span>
            <span>09.07.26 03:32</span>
          </div>
          <div className="my-3 border-t border-[#DEDAD0]" />

          {/* Line items */}
          <ul className="flex flex-col gap-[9px] sm:gap-[11px]">
            {basket.map((item) => (
              <li key={item.name} className="flex items-center gap-2.5">
                <span
                  className="grid h-[21px] w-[21px] flex-none place-items-center rounded-[5px] text-[8px] font-bold leading-none text-white sm:h-[23px] sm:w-[23px] sm:text-[8.5px]"
                  style={{ background: item.bg }}
                  aria-hidden="true"
                >
                  {item.mark}
                </span>
                <span className="min-w-0 flex-1 truncate text-[11.5px] sm:text-[12.5px]">{item.name}</span>
                <span className="flex-none text-[11.5px] sm:text-[12.5px]">{money(item.cents)}</span>
              </li>
            ))}
          </ul>

          <div className="my-3 border-t border-[#DEDAD0]" />

          {/* Total, circled */}
          <div className="text-center">
            <div className="text-[9px] tracking-[.24em] text-[#6E6A61] sm:text-[9.5px]">TO PAY</div>
            <div className="relative mx-auto mt-1 inline-block px-6 py-1">
              <svg viewBox="0 0 200 74" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
                {/* Deliberately imperfect: an unclosed, slightly oval loop */}
                <path
                  d="M100 6 C158 6 192 20 192 37 C192 55 152 68 98 68 C44 68 8 55 8 37 C8 20 40 7 96 6 C120 6 140 8 152 12"
                  fill="none" stroke="#E0201C" strokeWidth="2.6" strokeLinecap="round"
                  style={{ transform: 'rotate(-2deg)', transformOrigin: 'center' }}
                />
              </svg>
              <span className="relative font-display text-[32px] font-extrabold text-[#E0201C] sm:text-[38px]">
                ${withCommas(basketMonthlyCents)}
              </span>
            </div>
            <div className="mt-1.5 text-[9px] tracking-[.24em] text-[#6E6A61] sm:text-[9.5px]">PER MONTH</div>
            <div className="mt-1 text-[10.5px] font-bold text-[#E0201C] sm:text-[11.5px]">
              ${withCommas(basketYearlyCents)} a year
            </div>
          </div>

          <div className="my-3 border-t border-[#DEDAD0]" />

          <div className="flex justify-between text-[10.5px] font-bold text-[#E0201C] sm:text-[11.5px]">
            <span>Separate payments a year</span>
            <span>{paymentsPerYear}×</span>
          </div>
          <div className="mt-1.5 flex justify-between text-[10.5px] sm:text-[11.5px]">
            <span className="text-[#6E6A61]">Card {receiptMeta.card}</span>
            <span className="font-bold" style={{ color: '#1E7A4B' }}>APPROVED</span>
          </div>

          <div className="mt-4 text-center text-[9px] tracking-[.16em] text-[#6E6A61] sm:text-[9.5px]">
            THANK YOU FOR YOUR BUSINESS
          </div>

          {/* Barcode */}
          <div
            className="mt-2.5 h-10 w-full sm:h-11"
            aria-hidden="true"
            style={{
              backgroundImage:
                'repeating-linear-gradient(90deg, #14161C 0 2px, transparent 2px 5px, #14161C 5px 8px, transparent 8px 10px, #14161C 10px 11px, transparent 11px 14px)',
            }}
          />
          <div className="mt-1.5 text-center text-[9.5px] tracking-[.14em] text-[#6E6A61] sm:text-[10.5px]">
            {receiptMeta.barcodeRef}
          </div>
        </div>

        <TornEdge flip />
      </div>

      {/* Notes under the paper */}
      <div className="mt-4 flex items-start justify-between gap-4 px-1">
        <span className="font-hand text-[17px] font-bold leading-tight text-accent sm:text-[19px]"
              style={{ transform: 'rotate(-3deg)' }}>
          6 apps.<br />6 logins.
        </span>
        <span className="text-right font-hand text-[17px] font-bold leading-tight text-ink sm:text-[19px]"
              style={{ transform: 'rotate(2deg)' }}>
          More content.<br />More fun.
        </span>
      </div>
    </div>
  );
}
