import { basket, basketMonthly, receiptMeta } from '../data/receipt';

/**
 * The torn-paper receipt.
 *
 * The zigzag torn edges are inline SVG data URIs. They MUST NOT contain double
 * quotes — %27 is used for the inner attribute quotes, otherwise the CSS value
 * terminates early and the strips vanish. (Called out explicitly in the handoff.)
 */
const tearUp =
  "url(\"data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%278%27%3E%3Cpath d=%27M0 8 L6 0 L12 8 Z%27 fill=%27%23F7F5F0%27/%3E%3C/svg%3E\")";
const tearDown =
  "url(\"data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%278%27%3E%3Cpath d=%27M0 0 L6 8 L12 0 Z%27 fill=%27%23F7F5F0%27/%3E%3C/svg%3E\")";

const tearStyle = (img: string) => ({
  height: 8,
  backgroundImage: img,
  backgroundSize: '12px 8px',
  backgroundRepeat: 'repeat-x',
});

export default function Receipt() {
  return (
    <div className="relative">
      {/* Label and annotation share a flow row rather than being absolutely
          positioned. Single-typeface text is wider than the handwriting face
          this originally used, and overlapped it; a flex row cannot collide
          at any width. */}
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <span className="text-[12.5px] font-extrabold uppercase tracking-[.2em] text-accent">
          Without Streamplay4k
        </span>
        <span className="flex items-center gap-1.5 whitespace-nowrap text-accent">
          <span className="text-[19px] font-bold italic sm:text-[21px]">Every. Single. Month.</span>
          <span className="text-[18px]" style={{ transform: 'rotate(28deg)' }} aria-hidden="true">
            ↙
          </span>
        </span>
      </div>

      <div style={{ filter: 'drop-shadow(0 26px 60px rgba(0,0,0,.55))' }}>
        <div style={tearStyle(tearUp)} />

        <div className="bg-paper px-[22px] pb-5 pt-[18px] nums text-paper-ink">
          {/* Meta */}
          <div className="nums flex justify-between text-[11px] text-paper-meta">
            <span>{receiptMeta.customer}</span>
            <span>{receiptMeta.date}</span>
          </div>
          <div className="my-3 border-t border-dashed border-paper-rule" />

          {/* Line items */}
          <div className="flex flex-col gap-[11px]">
            {basket.map((line) => (
              <div key={line.code} className="flex items-center gap-2.5">
                <span
                  className="grid h-[22px] w-[22px] flex-none place-items-center rounded nums text-[9px] font-bold text-white"
                  style={{ background: line.chip }}
                >
                  {line.code}
                </span>
                <span className="flex-1 text-[12.5px]">{line.name}</span>
                <span className="nums text-[12.5px]">{line.price.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="my-3 border-t border-dashed border-paper-rule" />

          {/* Total, circled by hand */}
          <div className="text-center">
            <div className="text-[9.5px] tracking-[.22em] text-paper-meta">TO PAY</div>
            <div className="mt-2 inline-block">
              <div
                className="inline-block px-5 py-1"
                style={{ border: '2.5px solid #E0201C', borderRadius: '50%', transform: 'rotate(-3.5deg)' }}
              >
                <span
                  className="inline-block font-display text-[40px] font-extrabold text-accent-print"
                  style={{ transform: 'rotate(3.5deg)' }}
                >
                  ${basketMonthly.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="mt-2 text-[9.5px] tracking-[.22em] text-paper-meta">PER MONTH</div>
            <div className="nums mt-1 text-[11px] text-accent-print">
              ${(basketMonthly * 12).toLocaleString('en-US', { minimumFractionDigits: 2 })} a year
            </div>
          </div>

          <div className="my-3 border-t border-dashed border-paper-rule" />

          <div className="nums flex justify-between text-[11px] text-accent-print">
            <span>Separate payments a year</span>
            <span>{basket.length * 12}×</span>
          </div>
          <div className="nums mt-1.5 flex justify-between text-[11px]" style={{ color: '#2F6B4F' }}>
            <span>Card {receiptMeta.card}</span>
            <span>APPROVED</span>
          </div>

          <div className="mt-4 text-center text-[9.5px] tracking-[.16em]">THANK YOU FOR YOUR BUSINESS</div>

          {/* CSS barcode */}
          <div
            className="mt-3 h-11 w-full"
            style={{
              backgroundImage:
                'repeating-linear-gradient(90deg, #14161C 0 2px, transparent 2px 5px, #14161C 5px 8px, transparent 8px 10px)',
            }}
          />
          <div className="nums mt-1.5 text-center text-[10px] tracking-[.14em] text-paper-meta">
            {receiptMeta.barcodeRef}
          </div>
        </div>

        <div style={tearStyle(tearDown)} />
      </div>

      {/* Notes under the paper */}
      <div className="mt-6 flex justify-between gap-4 px-2">
        <div className="text-[19px] font-bold italic leading-tight text-accent">
          6 apps.<br />6 logins.
        </div>
        <div className="text-right text-[19px] font-bold italic leading-tight text-ink">
          More content.<br />More fun.
        </div>
      </div>
    </div>
  );
}
