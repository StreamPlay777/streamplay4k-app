import { useEffect, useRef, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { money, type Quote } from '../../data/pricing';

/**
 * Sticky order bar.
 *
 * Docks to the bottom of the viewport once the visitor has scrolled past the
 * pricing section's own Order button, and stays until they reach the footer.
 * The person who reads the plans, scrolls down to check the reviews and the
 * FAQ, then decides — that person no longer has to scroll back up to find
 * the button. Tesla and Apple configurators do the same thing.
 *
 * WHEN IT SHOWS
 *   - the section's CTA has scrolled above the viewport (they have seen it)
 *   - the footer is not yet in view
 *   - the order flow is not open (the form is the thing to look at then)
 * It never shows before the visitor has reached pricing: a bar that appears
 * over the hero would be nagging, not helping.
 *
 * WHEN IT IS VISIBLE it marks <html data-order-bar>, and the WhatsApp pill
 * moves up out of its way. Two fixed elements at the same corner would collide
 * otherwise.
 *
 * Two IntersectionObservers, no scroll listener: nothing runs per pixel.
 */
export default function OrderBar({
  q, ctaRef, onOrder, hidden,
}: {
  q: Quote;
  /** The in-section Order button; the bar shows once this is above the fold. */
  ctaRef: RefObject<HTMLElement>;
  onOrder: () => void;
  /** Force-hide, e.g. while the order flow is open. */
  hidden: boolean;
}) {
  const [pastCta, setPastCta] = useState(false);
  const [footerNear, setFooterNear] = useState(false);
  // Rendered through a portal on <body>: the pricing section is an isolated
  // stacking context (see .amb), so a fixed bar left inside it would paint
  // beneath every later section no matter its z-index. Portals do not exist
  // on the server, and the bar is hidden until a scroll anyway, so it mounts
  // after hydration.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // The WhatsApp pill steps up by the bar's real height (see .wa-pill in
  // index.css). Measured rather than guessed: the summary wraps to a third
  // line on narrow phones and a fixed offset would leave the two overlapping.
  const shellRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const shell = shellRef.current;
    if (!shell || typeof ResizeObserver === 'undefined') return;
    const root = document.documentElement.style;
    const ro = new ResizeObserver(() => root.setProperty('--order-bar-h', `${shell.offsetHeight}px`));
    ro.observe(shell);
    return () => { ro.disconnect(); root.removeProperty('--order-bar-h'); };
  }, [mounted]);

  useEffect(() => {
    // The CTA unmounts while the flow is open and remounts on Cancel, so this
    // re-attaches to the fresh node whenever `hidden` flips.
    const cta = ctaRef.current;
    if (!cta || typeof IntersectionObserver === 'undefined') return;
    // The root is stretched far below the viewport, so "intersecting" means
    // "at or below the fold" and "not intersecting" means "scrolled past".
    // Observing the plain viewport would miss a jump straight over the
    // section (a nav link to #reviews or #faq, the End key, scroll
    // restoration): the button goes from below to above the fold without
    // ever being visible, no threshold is crossed, and the bar never shows.
    const io = new IntersectionObserver(
      ([e]) => setPastCta(!e.isIntersecting && e.boundingClientRect.bottom <= 0),
      { rootMargin: '0px 0px 100000px 0px', threshold: 0 },
    );
    io.observe(cta);
    return () => io.disconnect();
  }, [ctaRef, hidden]);

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setFooterNear(e.isIntersecting), { rootMargin: '0px 0px 80px 0px' });
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  const show = pastCta && !footerNear && !hidden;

  useEffect(() => {
    if (show) document.documentElement.dataset.orderBar = 'true';
    else delete document.documentElement.dataset.orderBar;
    return () => { delete document.documentElement.dataset.orderBar; };
  }, [show]);

  if (!mounted) return null;

  return createPortal(
    <div
      aria-hidden={!show}
      className={`order-bar fixed inset-x-0 bottom-0 z-[55] px-3 pb-[max(.75rem,env(safe-area-inset-bottom))] sm:px-6 ${
        show ? 'order-bar-in' : 'order-bar-out'
      }`}
    >
      <div ref={shellRef} className="order-bar-shell mx-auto flex max-w-[760px] items-center justify-between gap-3 rounded-2xl px-4 py-3 sm:px-5">
        <div className="min-w-0">
          <p className="truncate font-display text-[13.5px] font-bold text-ink sm:text-[14.5px]">
            {q.term.label} · {q.devices} {q.devices === 1 ? 'device' : 'devices'}
          </p>
          <p className="nums text-[12px] text-ink-4">
            <span className="text-ink-2">{money(q.totalCents)}</span> · ≈ {money(q.perMonthCents)}/mo
            <span className="max-sm:hidden"> · no payment taken now</span>
          </p>
        </div>
        <button
          type="button"
          onClick={onOrder}
          tabIndex={show ? 0 : -1}
          className="btn-accent group flex-none !rounded-xl !px-5 !py-[11px] !text-[14px] !shadow-cta-sm"
        >
          Order now
          <span className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden="true">
            →
          </span>
        </button>
      </div>
    </div>,
    document.body,
  );
}
