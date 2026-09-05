import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { navLinks, setupMenu } from '../data/site';
import logo from '../assets/logo-light.png';

/**
 * Sticky floating frosted pill, detached from the viewport edge.
 * "Setup guide" opens a dropdown rather than navigating; every row in it
 * closes the menu and goes to the Setup page.
 */
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);   // setup dropdown
  const [mobileOpen, setMobileOpen] = useState(false);
  const [light, setLight] = useState(false);          // appearance toggle, icon only
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // The handoff flags both of these as missing from the prototype.
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

  useEffect(() => { setMobileOpen(false); setMenuOpen(false); }, [pathname]);

  const goSetup = () => { setMenuOpen(false); navigate('/setup'); };

  return (
    <div className="sticky top-0 z-[60] px-4 pb-2 pt-4 sm:px-7">
      <nav
        className="mx-auto flex max-w-nav flex-wrap items-center gap-x-3.5 gap-y-2 rounded-2xl
                   border border-white/[.09] bg-[rgba(10,14,27,.74)] py-2.5 pl-5 pr-3
                   shadow-pill backdrop-blur-[22px]"
      >
        {/* Left — logo */}
        <Link to="/" className="flex flex-none items-center gap-1.5" aria-label="Streamplay4k home">
          <img src={logo} alt="Streamplay" className="h-[30px] w-auto" />
          <span className="font-display text-[17px] font-extrabold text-accent">4K</span>
        </Link>

        {/* Centre — page links, wraps rather than clipping */}
        <div className="hidden min-w-0 flex-1 flex-wrap items-center gap-0.5 md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.to;
            if (link.dropdown) {
              return (
                <div key={link.to} className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setMenuOpen((o) => !o)}
                    aria-expanded={menuOpen}
                    aria-haspopup="true"
                    className={`flex items-center gap-1.5 rounded-[9px] px-3.5 py-2 text-[14.5px] transition-colors ${
                      active || menuOpen
                        ? 'bg-accent/[.13] font-bold text-accent-bright'
                        : 'font-medium text-ink-2 hover:text-ink'
                    }`}
                  >
                    {link.label}
                    <span className="text-[10px] opacity-75">{menuOpen ? '▲' : '▼'}</span>
                  </button>

                  {menuOpen && (
                    <div
                      className="absolute left-1/2 top-[46px] -ml-[178px] w-[356px] rounded-2xl border
                                 border-white/10 bg-[rgba(12,17,32,.94)] p-2.5 shadow-dropdown backdrop-blur-[22px]"
                    >
                      <div className="px-2 pb-1.5 pt-1 text-[10.5px] font-semibold uppercase tracking-[.16em] text-ink-4">
                        Setup guides
                      </div>
                      {setupMenu.map((row) => (
                        <button
                          key={row.code}
                          onClick={goSetup}
                          className="flex w-full items-center gap-3 rounded-[10px] px-2 py-2 text-left transition-colors hover:bg-white/[.055]"
                        >
                          <span
                            className="grid h-[30px] w-[30px] flex-none place-items-center rounded-lg border
                                       border-accent/30 bg-accent/[.14] nums text-[10px] text-accent-bright"
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
                className={`rounded-[9px] px-3.5 py-2 text-[14.5px] transition-colors ${
                  active ? 'bg-accent/[.13] font-bold text-accent-bright' : 'font-medium text-ink-2 hover:text-ink'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right — appearance toggle + two CTAs */}
        <div className="ml-auto flex flex-none items-center gap-2">
          <button
            onClick={() => setLight((v) => !v)}
            aria-label="Toggle appearance"
            title="Appearance toggle — not yet wired to a light theme"
            className="grid h-[34px] w-[34px] place-items-center rounded-[9px] border border-white/10
                       text-accent-bright transition-colors hover:border-accent"
          >
            {light ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <Link
            to="/contact"
            className="hidden items-center gap-2 rounded-[10px] border border-white/[.14] px-3.5 py-2
                       font-display text-[13.5px] font-bold text-ink transition-colors hover:border-accent sm:inline-flex"
          >
            <span className="h-[7px] w-[7px] rounded-full bg-success" />
            Free trial
          </Link>

          <Link
            to="/pricing"
            className="rounded-[10px] bg-accent px-4 py-2.5 font-display text-[13.5px] font-bold
                       text-white shadow-cta-sm transition-colors hover:bg-accent-hover"
          >
            Get started
          </Link>

          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
            className="grid h-[34px] w-[34px] place-items-center rounded-[9px] border border-white/10 text-ink md:hidden"
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {/* Mobile menu — the prototype was desktop-only, so this is new */}
        {mobileOpen && (
          <div className="w-full border-t border-white/[.08] pt-2 md:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block rounded-[9px] px-3 py-2.5 text-[15px] ${
                  pathname === link.to ? 'bg-accent/[.13] font-bold text-accent-bright' : 'font-medium text-ink-2'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </div>
  );
}
