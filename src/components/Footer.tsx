import { Link } from 'react-router-dom';
import { Tv2, Mail, MessageCircle, Shield, Star } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-darker border-t border-brand-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 gradient-red rounded-lg flex items-center justify-center">
                <Tv2 size={18} className="text-white" />
              </div>
              <span className="text-xl font-black">
                <span className="text-white">Stream</span>
                <span className="text-brand-red">Play</span>
                <span className="text-brand-orange text-sm font-bold">4K</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              The #1 4K IPTV service in the USA. Stream 10,000+ live channels, 60,000+ movies & TV shows on any device, anywhere.
            </p>
            <div className="flex items-center gap-1 text-brand-orange">
              {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              <span className="text-gray-400 text-xs ml-1">4.9/5 (2,847 reviews)</span>
            </div>
          </div>

          {/* Pages */}
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: 'Home', to: '/' },
                { label: 'Channel List', to: '/channels' },
                { label: 'Pricing Plans', to: '/pricing' },
                { label: 'Setup Guide', to: '/setup' },
                { label: 'Compatible Devices', to: '/devices' },
                { label: 'Free Trial', to: '/pricing' },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-gray-400 hover:text-brand-red text-sm transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-2">
              {[
                { label: 'Terms & Conditions', to: '/terms' },
                { label: 'Privacy Policy', to: '/privacy' },
                { label: 'Refund Policy', to: '/refund' },
                { label: 'Cookie Policy', to: '/cookies' },
                { label: 'DMCA', to: '/dmca' },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-gray-400 hover:text-brand-red text-sm transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4">24/7 Support</h4>
            <div className="space-y-3">
              <a href="mailto:support@streamplay4k.com" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
                <Mail size={14} className="text-brand-red" />
                support@streamplay4k.com
              </a>
              <a href="https://wa.me/1234567890" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
                <MessageCircle size={14} className="text-green-500" />
                WhatsApp Support
              </a>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Shield size={14} className="text-brand-orange" />
                30-Day Money-Back Guarantee
              </div>
            </div>
            <div className="mt-6">
              <p className="text-xs text-gray-500 mb-2">Accepted Payments</p>
              <div className="flex flex-wrap gap-2">
                {['Visa', 'MC', 'PayPal', 'Crypto', 'Amex'].map(p => (
                  <span key={p} className="px-2 py-1 bg-brand-card border border-brand-border rounded text-xs text-gray-400">{p}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-brand-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs text-center">
            © 2025 StreamPlay4K. All rights reserved. StreamPlay4K is a streaming technology provider. Content is provided by third-party sources.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>🇺🇸 USA</span>
            <span>🇨🇦 Canada</span>
            <span>🇬🇧 UK</span>
            <span>Worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
