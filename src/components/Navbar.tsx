import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Tv2, ChevronDown } from 'lucide-react';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Setup Guide', to: '/setup', dropdown: true },
  { label: 'Channel List', to: '/channels' },
  { label: 'Reviews', to: '/#reviews' },
  { label: 'FAQs', to: '/#faq' },
  { label: 'Contact', to: '/#contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  const isActive = (to: string) => to === '/' ? pathname === '/' : pathname.startsWith(to.split('#')[0]) && to !== '/';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0d1117]/95 backdrop-blur-md shadow-lg' : 'bg-[#0d1117]/80 backdrop-blur-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <Tv2 size={22} className="text-brand-red" />
            <span className="text-lg font-black tracking-tight leading-tight">
              <span className="text-white">Stream</span>
              <span className="text-brand-red">Play</span>
              <br />
              <span className="text-[10px] font-bold text-brand-orange tracking-widest -mt-1 block">4K</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(l => (
              <Link
                key={l.to}
                to={l.to}
                className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium transition-all ${
                  isActive(l.to)
                    ? 'bg-brand-red text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {l.label}
                {l.dropdown && <ChevronDown size={13} />}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/pricing"
              className="px-5 py-2 gradient-red text-white text-sm font-bold rounded-lg hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(o => !o)} className="lg:hidden text-white p-1">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-[#0d1117]/98 backdrop-blur-md border-t border-white/10 px-4 py-4 space-y-1">
          {navLinks.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`flex items-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium ${
                isActive(l.to) ? 'bg-brand-red text-white' : 'text-gray-300'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link to="/pricing" className="block w-full text-center py-3 gradient-red text-white font-bold rounded-lg mt-3">
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
}
