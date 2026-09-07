import { Link } from 'react-router-dom';
import { site, footerLinks } from '../data/site';
import { INVOICE_PAYMENT_METHODS } from '../data/pricing';
import PaymentMarks from './PaymentMarks';
import logo from '../assets/logo-light.png';

export default function Footer() {
  return (
    <footer className="border-t border-white/[.07] bg-bg-deepest px-7 pb-[34px] pt-16">
      <div className="mx-auto max-w-shell">
        <div className="grid gap-11 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div>
            <Link to="/" className="flex items-center gap-1.5">
              <img src={logo} alt="Streamplay" className="h-7 w-auto" />
              <span className="font-display text-[16px] font-extrabold text-accent">4K</span>
            </Link>
            <p className="mt-4 max-w-[300px] text-[14px] leading-relaxed text-ink-4">{site.description}</p>
            <h4 className="mt-7 font-display text-[12px] font-extrabold uppercase tracking-[.16em] text-ink-4">
              We accept
            </h4>
            <PaymentMarks methods={INVOICE_PAYMENT_METHODS} className="mt-3.5 max-w-[240px] sm:max-w-[268px]" />
          </div>

          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="font-display text-[12px] font-extrabold uppercase tracking-[.16em] text-accent-bright">
                {heading}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-[14px] text-ink-3 transition-colors hover:text-accent-link">
                      {l.label}
                    </Link>
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
