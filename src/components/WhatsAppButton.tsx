import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { site } from '../data/site';
import { track } from '../lib/analytics';

/**
 * Global WhatsApp support button.
 *
 * One instance, mounted at the app shell. Deliberately a small pill rather than
 * the usual giant floating bubble, and it never opens a popup of its own.
 *
 * Placement rules it has to respect:
 *  - bottom-right, above the iOS home indicator via env(safe-area-inset-*)
 *  - out of the way of the order flow: hidden on /thank-you, where the page
 *    already gives a WhatsApp link, and while the order form is open (the
 *    OrderFlow sets data-order-open on <html>)
 *  - 48px minimum touch target, above the 44px floor
 *
 * On pointer devices it starts as an icon and widens on hover; on touch it is
 * a compact circle with an accessible label, since there is no hover to reveal
 * the text and a permanent wide pill covers more of a small screen.
 */

const HIDDEN_ON = ['/thank-you'];

export default function WhatsAppButton() {
  const { pathname } = useLocation();
  const [orderOpen, setOrderOpen] = useState(false);

  // The order flow marks the document while its form is on screen.
  useEffect(() => {
    const read = () => setOrderOpen(document.documentElement.dataset.orderOpen === 'true');
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-order-open'] });
    return () => mo.disconnect();
  }, []);

  if (HIDDEN_ON.some((p) => pathname.startsWith(p)) || orderOpen) return null;

  return (
    <a
      href={site.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track('whatsapp_click', { route: pathname })}
      aria-label={`Message ${site.name} support on WhatsApp`}
      className="wa-pill group fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))]
                 z-50 inline-flex h-[48px] min-w-[48px] items-center gap-2.5 overflow-hidden
                 rounded-full border border-line-2 bg-[rgba(11,15,26,.92)] px-[13px]
                 shadow-[0_8px_24px_-8px_rgba(0,0,0,.8)] backdrop-blur-xl
                 transition-[border-color,box-shadow,transform,bottom] duration-300
                 hover:border-[#25D366]/60 hover:shadow-[0_10px_30px_-8px_rgba(37,211,102,.35)]
                 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                 focus-visible:outline-[#25D366]
                 motion-reduce:transition-none
                 sm:bottom-[max(1.5rem,env(safe-area-inset-bottom))] sm:right-[max(1.5rem,env(safe-area-inset-right))]"
    >
      <span className="grid h-[22px] w-[22px] flex-none place-items-center text-[#25D366]">
        <WhatsAppGlyph />
      </span>
      {/* Widens on hover on pointer devices; on touch it stays a circle. */}
      <span
        className="hidden max-w-0 whitespace-nowrap font-display text-[14px] font-semibold text-ink
                   opacity-0 transition-[max-width,opacity] duration-300 ease-out
                   group-hover:max-w-[120px] group-hover:opacity-100
                   group-focus-visible:max-w-[120px] group-focus-visible:opacity-100
                   motion-reduce:transition-none
                   [@media(hover:hover)and(pointer:fine)]:inline-block"
      >
        Need help?
      </span>
    </a>
  );
}

function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23a8.19 8.19 0 0 1 8.23 8.24c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.44.13-.14.17-.25.25-.41.09-.17.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.84-.2-.48-.4-.42-.55-.43h-.47c-.16 0-.43.06-.65.31-.23.25-.85.83-.85 2.03 0 1.2.87 2.35.99 2.52.13.16 1.71 2.61 4.15 3.66.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.29Z" />
    </svg>
  );
}
