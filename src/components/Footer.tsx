import { Link } from 'react-router-dom';
import { site, footerLinks, routes } from '../data/site';
import { INVOICE_PAYMENT_METHODS } from '../data/pricing';
import PaymentMarks from './PaymentMarks';
import { track } from '../lib/analytics';
import logo from '../assets/logo-light.png';

/**
 * Site footer.
 *
 * Four columns (brief §19). Every legal link now resolves to a real page —
 * previously all five pointed at /contact, which promised documents that did
 * not exist.
 *
 * External rows (WhatsApp, mailto) render as <a>, internal ones as <Link>, so
 * the router never tries to handle a wa.me or mailto URL.
 */
export default function Footer() {
  return (
    <footer className="border-t border-white/[.07] bg-bg-deepest px-7 pb-[34px] pt-16">
      <div className="mx-auto max-w-shell">
        <div className="grid gap-11 md:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div>
            <Link to={routes.home} className="flex items-center gap-1.5">
              <img src={logo} alt={site.name} className="h-7 w-auto" />
              <span className="font-display text-[16px] font-extrabold text-accent">4K</span>
            </Link>
            <p className="mt-4 max-w-[320px] text-[14px] leading-relaxed text-ink-4">{site.description}</p>

            <h2 className="mt-7 font-display text-[12px] font-extrabold uppercase tracking-[.16em] text-ink-4">
              We accept
            </h2>
            <PaymentMarks methods={INVOICE_PAYMENT_METHODS} className="mt-3.5 max-w-[240px] sm:max-w-[268px]" />
            {/* Says plainly what these marks mean — no checkout happens here. */}
            <p className="mt-3 max-w-[300px] text-[12px] leading-relaxed text-ink-5">
              Ways to pay your invoice. No payment is taken on this website.
            </p>
          </div>

          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h2 className="font-display text-[12px] font-extrabold uppercase tracking-[.16em] text-accent-bright">
                {heading}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {links.map((l) => (
                  <li key={l.label}>
                    {'external' in l && l.external ? (
                      <a
                        href={l.to}
                        target={l.to.startsWith('http') ? '_blank' : undefined}
                        rel={l.to.startsWith('http') ? 'noopener noreferrer' : undefined}
                        onClick={l.to.startsWith('https://wa.me') ? () => track('whatsapp_click', { from: 'footer' }) : undefined}
                        className="break-words text-[14px] text-ink-3 transition-colors hover:text-accent-link"
                      >
                        {l.label}
                      </a>
                    ) : (
                      <Link to={l.to} className="text-[14px] text-ink-3 transition-colors hover:text-accent-link">
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/[.07] pt-6 text-[12.5px] text-[#4E5771] md:flex-row md:items-start md:justify-between">
          <p>© {site.year} {site.legalName}. All rights reserved.</p>
          <p className="max-w-[560px] md:text-right">{site.disclaimer}</p>
        </div>
      </div>
    </footer>
  );
}
