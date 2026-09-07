import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon, ChevronDown } from 'lucide-react';
import { navLinks, setupMenu } from '../data/site';
import logo from '../assets/logo-light.png';

/**
 * Floating frosted navigation bar.
 *
 * Laid out as three columns — logo, links, controls — rather than a single
 * flex row. The links previously followed the logo on flex:1, which put them
 * left of centre; a 1fr / auto / 1fr grid centres them against the bar itself,
 * whatever the side columns weigh.
 *
 * The bar firms up slightly once the page scrolls, so it separates from the
 * content beneath without being heavy over the hero.
 */
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);   // setup dropdown
  const [mobileOpen, setMobileOpen] = useState(false);
  const [light, setLight] = useState(false);          // appearance toggle, icon only
  const [scrolled, setScrolled] = useState(false);
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
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

  const goSetup = () => { setMenuOpen(false); navigate('/setup'); };
  const isActive = (to: string) =>
    to.startsWith('/#') ? pathname === '/' && hash === to.slice(1) : pathname === to;

  const linkBase =
    'rounded-xl px-3.5 py-2.5 font-display text-[14.5px] font-semibold transition-all duration-200 lg:text-[15px]';

  return (
    <div className="sticky top-0 z-[60] px-4 pb-2 pt-3 sm:px-6 sm:pt-4">
      <nav
        aria-label="Main"
        className={`mx-auto grid max-w-nav items-center gap-3 rounded-2xl border px-3 py-2.5
                    transition-all duration-300 ease-out sm:px-4
                    lg:grid-cols-[1fr_auto_1fr] ${
                      scrolled
                        ? 'border-white/[.1] bg-[rgba(9,12,23,.86)] shadow-pill backdrop-blur-2xl'
                        : 'border-white/[.07] bg-[rgba(10,14,27,.6)] shadow-none backdrop-blur-xl'
                    }`}
      >
        {/* Left — logo */}
        <div className="flex items-center">
          <Link
            to="/"
            className="flex flex-none items-center gap-1.5 rounded-lg transition-opacity duration-200 hover:opacity-80"
            aria-label="Streamplay4k home"
          >
            <img src={logo} alt="Streamplay" className="h-[28px] w-auto sm:h-[30px]" />
            <span className="font-display text-[16px] font-extrabold text-accent sm:text-[17px]">4K</span>
          </Link>

          {/* Controls sit here on mobile, where there is no centre column */}
          <div className="ml-auto flex items-center gap-1.5 sm:gap-2 lg:hidden">
            <span className="hidden min-[360px]:block">
              <ThemeToggle light={light} onToggle={() => setLight((v) => !v)} />
            </span>
            <Link to="/pricing" className="btn-accent !rounded-xl !px-3.5 !py-2.5 !text-[13px] !shadow-cta-sm sm:!px-4 sm:!text-[13.5px]">
              Get started
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
                    <div
                      className="absolute left-1/2 top-[52px] w-[356px] -translate-x-1/2 rounded-2xl border
                                 border-white/10 bg-[rgba(12,17,32,.96)] p-2.5 shadow-dropdown backdrop-blur-2xl"
                    >
                      <div className="px-2 pb-1.5 pt-1 text-[10.5px] font-semibold uppercase tracking-[.16em] text-ink-4">
                        Setup guides
                      </div>
                      {setupMenu.map((row) => (
                        <button
                          key={row.code}
                          onClick={goSetup}
                          className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left
                                     transition-colors duration-150 hover:bg-white/[.055]"
                        >
                          <span
                            className="grid h-[30px] w-[30px] flex-none place-items-center rounded-lg border
                                       border-accent/30 bg-accent/[.14] font-mono text-[10px] text-accent-bright"
                          >
                            {row.code}
                          </span>
                          <span className="min-w-0">
                            <span className="block font-display text-[14.5px] font-bold text-ink">{row.name}</span>
                            <span className="block text-[12.5px] text-[#8792A8]">{row.note}</span>
                          </span>
                        </button>
                      ))}
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

        {/* Right — controls */}
        <div className="hidden items-center justify-end gap-2 lg:flex">
          <ThemeToggle light={light} onToggle={() => setLight((v) => !v)} />
          <Link
            to="/contact"
            className="flex items-center gap-2 rounded-xl border border-white/[.12] px-4 py-2.5
                       font-display text-[13.5px] font-semibold text-ink transition-all duration-200
                       hover:border-white/25 hover:bg-white/[.04]"
          >
            <span className="h-[7px] w-[7px] rounded-full bg-success" aria-hidden="true" />
            Free trial
          </Link>
          <Link to="/pricing" className="btn-accent !rounded-xl !px-5 !py-2.5 !text-[13.5px] !shadow-cta-sm">
            Get started
          </Link>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="col-span-full border-t border-white/[.08] pt-2 lg:hidden">
            {navLinks.map((link) => (
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
              to="/contact"
              className="mt-1 flex items-center gap-2 rounded-xl px-3 py-3 font-display text-[15px] font-semibold text-ink-2"
            >
              <span className="h-[7px] w-[7px] rounded-full bg-success" aria-hidden="true" />
              Free trial
            </Link>
            <div className="mt-2 px-3 pb-1 min-[360px]:hidden">
              <ThemeToggle light={light} onToggle={() => setLight((v) => !v)} />
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}

function ThemeToggle({ light, onToggle }: { light: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle appearance"
      title="Appearance toggle — not yet wired to a light theme"
      className="grid h-[38px] w-[38px] flex-none place-items-center rounded-xl border border-white/[.1]
                 text-accent-bright transition-all duration-200 hover:border-accent hover:bg-accent/[.08]"
    >
      {light ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
