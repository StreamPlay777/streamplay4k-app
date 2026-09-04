import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Tv2, ChevronRight } from 'lucide-react';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Channels', to: '/channels' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Setup Guide', to: '/setup' },
  { label: 'Devices', to: '/devices' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-brand-darker/95 backdrop-blur-md shadow-lg shadow-black/30' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-red rounded-lg flex items-center justify-center">
              <Tv2 size={18} className="text-white" />
            </div>
            <span className="text-xl font-black tracking-tight">
              <span className="text-white">Stream</span>
              <span className="text-brand-red">Play</span>
              <span className="text-brand-orange text-sm font-bold ml-0.5">4K</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(l => (
              <Link
                key={l.to}
                to={l.to}
                className={`text-sm font-medium transition-colors hover:text-brand-red ${pathname === l.to ? 'text-brand-red' : 'text-gray-300'}`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/pricing" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Sign In</Link>
            <Link
              to="/pricing"
              className="flex items-center gap-1 px-4 py-2 gradient-red text-white text-sm font-bold rounded-lg hover:opacity-90 transition-opacity"
            >
              Get Started <ChevronRight size={14} />
            </Link>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(o => !o)} className="md:hidden text-white p-1">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-brand-darker/98 backdrop-blur-md border-t border-brand-border px-4 py-4 space-y-3">
          {navLinks.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`block py-2 text-sm font-medium ${pathname === l.to ? 'text-brand-red' : 'text-gray-300'}`}
            >
              {l.label}
            </Link>
          ))}
          <Link to="/pricing" className="block w-full text-center py-3 gradient-red text-white font-bold rounded-lg mt-2">
            Get Started Free
          </Link>
        </div>
      )}
    </nav>
  );
}
