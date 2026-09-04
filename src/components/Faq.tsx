import { useState } from 'react';
import { faqs } from '../data/faqs';

/** Single-open accordion; clicking the open row collapses it. */
export default function Faq({ items = faqs }: { items?: { q: string; a: string }[] }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="flex flex-col gap-2.5">
      {items.map((item, i) => {
        const isOpen = i === open;
        return (
          <div key={item.q} className="rounded-[13px] border border-white/[.08] bg-white/[.02]">
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-[22px] py-[19px] text-left"
            >
              <span className="font-display text-[16.5px] font-bold text-ink">{item.q}</span>
              <span className="flex-none text-[20px] leading-none text-accent">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && (
              <div className="max-w-[680px] px-[22px] pb-[22px] text-[15.5px] leading-[1.66] text-ink-3">
                {item.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
