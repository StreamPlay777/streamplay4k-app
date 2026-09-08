import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu, X, ChevronDown,
  Cast, MonitorPlay, Tv, Airplay, Smartphone, Laptop,
} from 'lucide-react';
import { navLinks, mobileNavLinks, setupMenu, routes, site, type SetupIcon } from '../data/site';
import { track } from '../lib/analytics';
import logo from '../assets/logo-light.png';

/**
 * Floating glass navigation bar.
 *
 * RESIZE BEHAVIOUR
 * Past a scroll threshold the bar narrows, loses a little height, and its glass
 * firms up — the same idea as the Aceternity resizable navbar, rebuilt with CSS
 * transitions. No animation library, no rAF loop, no layout measurement: one
 * boolean crosses one threshold and CSS interpolates everything.
 *
 * The bar never hides. Auto-hide-on-scroll is a usability tax — people reach
 * for navigation exactly when they are scrolling — and it was explicitly not
 * wanted here.
 *
 * WHY THE OUTER WRAPPER KEEPS ITS PADDING
 * Only the inner <nav> resizes. The sticky wrapper's height is driven by the
 * nav's content box, and since the nav shrinks by padding rather than by
 * transform, nothing outside it moves — no layout shift, and no jump in the
 * Setup dropdown, which is positioned against the button rather than the bar.
 *
 * MOBILE
 * Width and height stay fixed below lg. Only the glass responds to scroll. A
 * header that resizes on every scroll on a small screen reads as jitter, and
 * the drawer's measurements have to stay predictable.
 *
 * Reduced motion is handled globally in index.css, which clamps every
 * transition to 0.01ms — the states still change, they just change instantly.
 */

/** Crossing this many pixels toggles the compact state. */
const SCROLL_THRESHOLD = 80;

const SETUP_ICONS: Record<SetupIcon, typeof Tv> = {
  cast: Cast,
  'monitor-play': MonitorPlay,
  tv: Tv,
  airplay: Airplay,
  smartphone: Smartphone,
  laptop: Laptop,
};

/** '/pricing/' and '/pricing' are the same route; compare without the slash. */
const norm = (p: string) => (p !== '/' && p.endsWith('/') ? p.slice(0, -1) : p);

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);   // setup dropdown
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  /**
   * Threshold-based, not per-pixel. The listener runs on every scroll event but
   * only calls setState when the boolean actually flips, so React re-renders
   * twice per page rather than hundreds of times.
   */
  useEffect(() => {
    let last = window.scrollY > SCROLL_THRESHOLD;
    setScrolled(last);
    const onScroll = () => {
      const next = window.scrollY > SCROLL_THRESHOLD;
      if (next !== last) { last = next; setScrolled(next); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  useEffect(() => { setMobileOpen(false); setMenuOpen(false); }, [pathname, hash]);

  const goSetup = (h?: string) => {
    setMenuOpen(false);
    navigate(h ? `${routes.setup}#${h}` : routes.setup);
  };

  /** Section match, so /blog/ stays active on an article and Setup on a hash. */
  const isActive = (to: string) => {
    const t = norm(to.split('#')[0]);
    const p = norm(pathname);
    return t === '/' ? p === '/' : p === t || p.startsWith(`${t}/`);
  };

  const linkBase =
    'rounded-xl px-3 py-2.5 font-display text-[14px] font-semibold transition-colors duration-200 xl:px-3.5 xl:text-[14.5px]';

  return (
    <div className="sticky top-0 z-[60] px-4 pb-2 pt-3 sm:px-6 sm:pt-4">
      <nav
        aria-label="Main"
        data-scrolled={scrolled}
        className={`nav-shell mx-auto grid items-center gap-3 rounded-2xl border
                    lg:grid-cols-[auto_1fr_auto] ${
                      scrolled
                        // Exactly the previous glass values. The resize pass
                        // had pushed these to .90/.13 and .62/.075, which read
                        // as an almost-solid black bar rather than smoked glass.
                        ? 'border-white/[.1] bg-[rgba(9,12,23,.86)] shadow-pill backdrop-blur-2xl'
                        : 'border-white/[.07] bg-[rgba(10,14,27,.6)] shadow-none backdrop-blur-xl'
                    }`}
      >
        {/* Left — logo. The wordmark stands alone; the separate red "4K" chip
            that used to sit beside it has been removed. */}
        <div className="flex items-center">
          <Link
            to={routes.home}
            className="flex flex-none items-center rounded-lg transition-opacity duration-200 hover:opacity-80"
            aria-label={`${site.name} home`}
          >
            <img
              src={logo}
              alt={site.name}
              width={960}
              height={280}
              className="nav-logo w-auto"
            />
          </Link>

          {/* Controls sit here on mobile, where there is no centre column */}
          <div className="ml-auto flex items-center gap-1.5 sm:gap-2 lg:hidden">
            <Link
              to={routes.pricing}
              onClick={() => track('view_pricing', { from: 'navbar-mobile' })}
              className="btn-accent !rounded-xl !px-3.5 !py-2.5 !text-[13px] !shadow-cta-sm sm:!px-4 sm:!text-[13.5px]"
            >
              View plans
            </Link>
            <button
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              className="grid h-[38px] w-[38px] place-items-center rounded-xl border border-white/[.1]
                         text-ink transition-colors duration-200 hover:border-white/25"
            >
              {mobileOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>

        {/* Centre — the links, centred against the bar */}
        <div className="hidden items-center justify-center gap-0.5 lg:flex">
          {navLinks.map((link) => {
            const active = isActive(link.to);
            if (link.dropdown) {
              return (
                <div key={link.to} className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setMenuOpen((o) => !o)}
                    aria-expanded={menuOpen}
                    aria-haspopup="true"
                    className={`${linkBase} flex items-center gap-1 ${
                      active || menuOpen
                        ? 'bg-accent/[.13] text-accent'
                        : 'text-ink-2 hover:bg-white/[.05] hover:text-ink'
                    }`}
                  >
                    {link.label}
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>

                  {menuOpen && (
                    // Anchored to the button, not the bar, so resizing the bar
                    // never moves it.
                    <div
                      className="absolute left-1/2 top-[calc(100%+10px)] w-[356px] -translate-x-1/2 rounded-2xl
                                 border border-white/10 bg-[rgba(12,17,32,.96)] p-2.5 shadow-dropdown
                                 backdrop-blur-2xl"
                    >
                      <div className="px-2 pb-1.5 pt-1 text-[10.5px] font-semibold uppercase tracking-[.16em] text-ink-4">
                        Setup guides
                      </div>
                      {setupMenu.map((row) => {
                        const Icon = SETUP_ICONS[row.icon];
                        return (
                          <button
                            key={row.hash}
                            onClick={() => goSetup(row.hash)}
                            className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left
                                       transition-colors duration-150 hover:bg-white/[.055]"
                          >
                            <span
                              className="grid h-[30px] w-[30px] flex-none place-items-center rounded-lg border
                                         border-accent/30 bg-accent/[.14] text-accent-bright"
                            >
                              <Icon size={15} aria-hidden="true" />
                            </span>
                            <span className="min-w-0">
                              <span className="block font-display text-[14.5px] font-bold text-ink">{row.name}</span>
                              <span className="block text-[12.5px] text-[#8792A8]">{row.note}</span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <Link
                key={link.to}
                to={link.to}
                aria-current={active ? 'page' : undefined}
                className={`${linkBase} ${
                  active ? 'bg-accent/[.13] text-accent' : 'text-ink-2 hover:bg-white/[.05] hover:text-ink'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right — one primary CTA, visually separated from the links. */}
        <div className="hidden items-center justify-end lg:flex">
          <Link
            to={routes.pricing}
            onClick={() => track('view_pricing', { from: 'navbar' })}
            className={`btn-accent !rounded-xl !shadow-cta-sm transition-[padding,font-size] duration-300
                        ${scrolled ? '!px-[18px] !py-2 !text-[13px]' : '!px-5 !py-2.5 !text-[13.5px]'}`}
          >
            View plans
          </Link>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="col-span-full border-t border-white/[.08] pt-2 lg:hidden">
            {mobileNavLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                aria-current={isActive(link.to) ? 'page' : undefined}
                className={`block rounded-xl px-3 py-3 font-display text-[15px] font-semibold transition-colors duration-150 ${
                  isActive(link.to) ? 'bg-accent/[.13] text-accent' : 'text-ink-2 hover:bg-white/[.05]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to={routes.contact}
              onClick={() => track('start_free_trial', { from: 'nav-drawer' })}
              className="mt-1 flex items-center gap-2 rounded-xl px-3 py-3 font-display text-[15px] font-semibold text-ink-2"
            >
              <span className="h-[7px] w-[7px] rounded-full bg-success" aria-hidden="true" />
              Free trial
            </Link>
            <a
              href={site.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('whatsapp_click', { from: 'nav-drawer' })}
              className="flex items-center gap-2 rounded-xl px-3 py-3 font-display text-[15px] font-semibold text-ink-2"
            >
              <span className="h-[7px] w-[7px] rounded-full bg-[#25D366]" aria-hidden="true" />
              WhatsApp support
            </a>
          </div>
        )}
      </nav>
    </div>
  );
}
