import { Link } from 'react-router-dom';
import {
  Play, ChevronRight, Check, Star, Zap, Shield, Wifi, Monitor,
  Globe, Award, Clock, MessageCircle
} from 'lucide-react';
import { movies } from '../data/movies';
import { channels } from '../data/channels';
import { plans } from '../data/pricing';

// Movie posters shown in hero background TV grid
const heroPosterRows = [
  [
    'https://image.tmdb.org/t/p/w200/rSnpBMFHFtSyBSBDHXXRAWntnhS.jpg',
    'https://image.tmdb.org/t/p/w200/z53D72EAOxGRqdr7KXXWp9dJiDe.jpg',
    'https://image.tmdb.org/t/p/w200/m9EXaDAzMFW3eFO36vTZ0MRXqBD.jpg',
    'https://image.tmdb.org/t/p/w200/pzIddUEMWhWzfvLI3TwxUG2wGoi.jpg',
    'https://image.tmdb.org/t/p/w200/vbpGlEGPFvK7dT2jRFbYHFkuEFG.jpg',
    'https://image.tmdb.org/t/p/w200/3bN6nPMQSv3kWKMBHRQTfqfEwSv.jpg',
    'https://image.tmdb.org/t/p/w200/6CoRTJTmijhBLJTUNoVSUNxZMEI.jpg',
    'https://image.tmdb.org/t/p/w200/oSGGfyR8232pWOpFWmtLV2cMFBo.jpg',
  ],
  [
    'https://image.tmdb.org/t/p/w200/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
    'https://image.tmdb.org/t/p/w200/iPh4d5IzAv2s9Cj9IF6nrXJC8tl.jpg',
    'https://image.tmdb.org/t/p/w200/q4HWlkC7nGBBLfb6MAfxhQJHgzf.jpg',
    'https://image.tmdb.org/t/p/w200/m9EXaDAzMFW3eFO36vTZ0MRXqBD.jpg',
    'https://image.tmdb.org/t/p/w200/rSnpBMFHFtSyBSBDHXXRAWntnhS.jpg',
    'https://image.tmdb.org/t/p/w200/vbpGlEGPFvK7dT2jRFbYHFkuEFG.jpg',
    'https://image.tmdb.org/t/p/w200/z53D72EAOxGRqdr7KXXWp9dJiDe.jpg',
    'https://image.tmdb.org/t/p/w200/6CoRTJTmijhBLJTUNoVSUNxZMEI.jpg',
  ],
];

const stats = [
  { value: '10,000+', label: 'Live Channels' },
  { value: '60,000+', label: 'Movies & Series' },
  { value: '24/7', label: 'Live Support' },
  { value: 'HD / 4K', label: 'Quality' },
];

const features = [
  { icon: Zap, title: '4K Ultra HD Quality', desc: 'Stream in stunning 4K and HD quality on any device. Crystal-clear picture every time.' },
  { icon: Wifi, title: '10,000+ Live Channels', desc: 'Sports, news, entertainment, kids, international & more — all in one subscription.' },
  { icon: Monitor, title: 'All Devices Supported', desc: 'Firestick, Android TV, Apple TV, Smart TV, PC, iPhone, iPad & more.' },
  { icon: Shield, title: '99.9% Uptime', desc: 'Anti-freeze servers ensure smooth, buffer-free streaming 24/7.' },
  { icon: Globe, title: 'No Contract', desc: 'Month-to-month plans. Cancel anytime, no questions asked, no hidden fees.' },
  { icon: Clock, title: '24/7 Live Support', desc: 'Expert support team ready to help via WhatsApp, live chat & email.' },
];

const testimonials = [
  { name: 'Mike T.', location: 'Los Angeles, CA', rating: 5, text: 'Best IPTV service I\'ve ever used. The 4K quality on NFL games is absolutely insane. Zero buffering all season long.' },
  { name: 'Sarah K.', location: 'New York, NY', rating: 5, text: 'Setup took less than 5 minutes on my Firestick. 10,000+ channels and they all work flawlessly. Worth every penny!' },
  { name: 'James R.', location: 'Chicago, IL', rating: 5, text: 'Been with StreamPlay4K for 8 months. Never had a single issue. Customer support is top notch. Highly recommend.' },
  { name: 'Diana M.', location: 'Miami, FL', rating: 5, text: 'Cut the cord 6 months ago and this is better than cable in every way. Sports, movies, kids shows — everything.' },
  { name: 'Carlos V.', location: 'Houston, TX', rating: 5, text: 'Amazing international channels — Spanish, Arabic, French plus all US channels. Incredible value.' },
  { name: 'Priya S.', location: 'San Jose, CA', rating: 5, text: 'The EPG guide is super clean and easy to use. Feels premium, works perfectly every single day.' },
];

const faqs = [
  { q: 'What devices does StreamPlay4K work on?', a: 'StreamPlay4K works on Amazon Firestick, Android TV, Apple TV, Smart TVs, Windows PC, Mac, iPhone, iPad, Roku, MAG Box, and more.' },
  { q: 'How fast will I receive my login credentials?', a: 'Instantly! After payment, your credentials are emailed within 60 seconds. Setup takes under 5 minutes.' },
  { q: 'Is there a free trial?', a: 'Yes! We offer a 24-hour free trial. Contact our support team via WhatsApp or live chat to request yours.' },
  { q: 'How many devices can I use at the same time?', a: 'Depends on plan: Monthly = 1 connection, 3-Month = 2, 6-Month = 2, 12-Month = 3 simultaneous connections.' },
  { q: 'What payment methods do you accept?', a: 'Visa, Mastercard, PayPal, American Express, and multiple cryptocurrencies (Bitcoin, USDT, ETH).' },
  { q: 'Is there a money-back guarantee?', a: 'Yes — 30-day money-back guarantee if you\'re not satisfied for any reason. No questions asked.' },
];

export default function Home() {
  const featuredMovies = movies.slice(0, 12);
  const sportChannels = channels.filter(c => c.category === 'Sports');
  const newsChannels = channels.filter(c => c.category === 'News');
  const entertainmentChannels = channels.filter(c => c.category === 'Entertainment');
  const kidsChannels = channels.filter(c => c.category === 'Kids');

  return (
    <div className="bg-[#0a0d14]">

      {/* ═══════════════════════════════════════ HERO ═══════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">

        {/* Background: movie poster grid (like Netflix on TV) */}
        <div className="absolute inset-0 z-0">
          {/* Dark room background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0d14] via-[#0d1117]/60 to-[#0a0d14]" />

          {/* Poster grid rows */}
          <div className="absolute inset-0 opacity-25 flex flex-col gap-2 pt-4 pointer-events-none select-none">
            {heroPosterRows.map((row, ri) => (
              <div key={ri} className="flex gap-2 px-4">
                {row.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="h-40 w-28 object-cover rounded flex-shrink-0"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Heavy dark overlay so text is readable */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0d14]/70 via-[#0a0d14]/50 to-[#0a0d14]/80" />
          {/* Red glow bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-brand-red/20 to-transparent" />
        </div>

        {/* Hero content — centered */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-20 pb-48">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6 max-w-4xl">
            <span className="text-white">The Ultimate 4K IPTV</span>
            <br />
            <span className="text-white">Experience </span>
            <span className="text-brand-red">in the USA</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-2xl">
            Live TV, sports, movies and series in HD and 4K, on every device you own.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link
              to="/pricing"
              className="px-8 py-4 gradient-red text-white font-bold text-lg rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-brand-red/40 min-w-[200px] text-center"
            >
              See IPTV Pricing
            </Link>
            <a
              href="https://wa.me/1234567890"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-white/40 text-white font-bold text-lg rounded-lg hover:border-white hover:bg-white/10 transition-all min-w-[200px]"
            >
              <MessageCircle size={20} />
              Start Free Trial
            </a>
          </div>
        </div>

        {/* Stats bar — pinned at bottom of hero */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          {/* Red curved wave */}
          <div className="relative">
            <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block -mb-1">
              <path d="M0 80 C360 0 1080 0 1440 80 L1440 80 L0 80Z" fill="#E8322A"/>
            </svg>
            <div className="bg-brand-red py-8">
              <div className="max-w-4xl mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  {stats.map(s => (
                    <div key={s.label}>
                      <div className="text-3xl md:text-4xl font-black text-white">{s.value}</div>
                      <div className="text-red-200 text-sm font-medium mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ FEATURES ═══════════════════════════════════════ */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-brand-red text-sm font-bold uppercase tracking-widest">Why StreamPlay4K?</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-3">
            Everything You Need to <span className="text-brand-red">Cut the Cord</span>
          </h2>
          <p className="text-gray-400 text-lg mt-4 max-w-2xl mx-auto">
            Premium 4K streaming without the cable price. Get more channels, more content, for a fraction of the cost.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(f => (
            <div key={f.title} className="bg-[#0d1117] border border-white/10 rounded-2xl p-6 card-hover">
              <div className="w-12 h-12 gradient-red rounded-xl flex items-center justify-center mb-4">
                <f.icon size={22} className="text-white" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════ CHANNEL SECTIONS ═══════════════════════════════════════ */}
      {[
        { label: 'Live Sports', title: 'Every Game. Every Sport. Live.', list: sportChannels },
        { label: 'News', title: 'Stay Informed 24/7', list: newsChannels },
        { label: 'Entertainment', title: 'Top TV Networks Included', list: entertainmentChannels },
        { label: 'Kids', title: 'Safe & Fun Kids Channels', list: kidsChannels },
      ].map(section => (
        <section key={section.label} className="py-16 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-brand-red text-xs font-bold uppercase tracking-widest">{section.label}</span>
                <h2 className="text-2xl md:text-3xl font-black text-white mt-1">{section.title}</h2>
              </div>
              <Link to="/channels" className="text-brand-red text-sm font-medium hover:underline flex items-center gap-1">
                View All <ChevronRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-10 gap-3">
              {section.list.slice(0, 20).map(ch => (
                <div
                  key={ch.name}
                  className="bg-[#0d1117] border border-white/10 rounded-xl p-2.5 flex flex-col items-center gap-2 hover:border-brand-red hover:scale-105 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                    <img
                      src={ch.logo}
                      alt={ch.name}
                      className="w-8 h-8 object-contain"
                      onError={e => {
                        const el = e.target as HTMLImageElement;
                        el.style.display = 'none';
                        el.parentElement!.innerHTML = `<span class="text-gray-700 font-black text-[8px] text-center px-1 leading-tight">${ch.name.slice(0, 6)}</span>`;
                      }}
                    />
                  </div>
                  <span className="text-gray-400 text-[10px] text-center font-medium leading-tight group-hover:text-white transition-colors line-clamp-2">{ch.name}</span>
                  {ch.uhd && <span className="text-[8px] bg-brand-orange/20 text-brand-orange px-1 rounded font-bold">4K</span>}
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* ═══════════════════════════════════════ MOVIES ═══════════════════════════════════════ */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-brand-red text-xs font-bold uppercase tracking-widest">VOD Library</span>
              <h2 className="text-3xl md:text-4xl font-black text-white mt-1">Latest Blockbuster Movies</h2>
            </div>
            <Link to="/channels" className="text-brand-red text-sm font-medium hover:underline flex items-center gap-1">
              Full Library <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {featuredMovies.map(movie => (
              <div key={movie.title} className="group relative bg-[#0d1117] border border-white/10 rounded-xl overflow-hidden card-hover cursor-pointer">
                <div className="aspect-[2/3] relative overflow-hidden bg-[#1a1d26]">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                  {movie.badge && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-brand-red text-white text-[9px] font-black rounded">
                      {movie.badge}
                    </span>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <p className="text-white font-bold text-xs leading-tight">{movie.title}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-brand-orange text-[10px] font-bold">★ {movie.score}</span>
                      <span className="text-gray-400 text-[10px]">{movie.year}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ PRICING PREVIEW ═══════════════════════════════════════ */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-brand-red text-sm font-bold uppercase tracking-widest">Pricing</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-3">
              Simple & Transparent <span className="text-brand-red">Plans</span>
            </h2>
            <p className="text-gray-400 text-lg mt-4">No hidden fees. Cancel anytime. Instant activation.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map(plan => (
              <div
                key={plan.id}
                className={`relative bg-[#0d1117] border rounded-2xl p-6 flex flex-col card-hover ${plan.popular ? 'border-brand-red shadow-lg shadow-brand-red/20' : 'border-white/10'}`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 gradient-red text-white text-xs font-black rounded-full whitespace-nowrap">
                    🔥 {plan.badge}
                  </div>
                )}
                <h3 className="text-white font-bold text-lg mb-1">{plan.name}</h3>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-4xl font-black text-white">${plan.price}</span>
                </div>
                {plan.originalPrice && (
                  <p className="text-xs text-gray-500 line-through mb-1">${plan.originalPrice}</p>
                )}
                <p className="text-brand-orange text-xs font-bold mb-5">≈ ${plan.pricePerMonth}/mo</p>
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.slice(0, 5).map(f => (
                    <li key={f} className="flex items-start gap-2 text-xs text-gray-300">
                      <Check size={12} className="text-green-400 mt-0.5 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/pricing"
                  className={`block text-center py-3 rounded-xl font-bold text-sm transition-all ${plan.popular ? 'gradient-red text-white hover:opacity-90' : 'bg-white/10 text-white hover:bg-brand-red border border-white/10'}`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/pricing" className="inline-flex items-center gap-1 text-brand-red font-medium hover:underline">
              See full plan details <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ TESTIMONIALS ═══════════════════════════════════════ */}
      <section id="reviews" className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-brand-red text-sm font-bold uppercase tracking-widest">Reviews</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-3">
              Trusted by <span className="text-brand-red">50,000+ Subscribers</span>
            </h2>
            <div className="flex items-center justify-center gap-2 mt-4">
              {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="#F5A623" className="text-brand-orange" />)}
              <span className="text-white font-bold ml-1">4.9/5</span>
              <span className="text-gray-400 text-sm">· 2,847 reviews</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.name} className="bg-[#0d1117] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} size={13} fill="#F5A623" className="text-brand-orange" />)}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="text-white font-bold text-sm">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ FAQ ═══════════════════════════════════════ */}
      <section id="faq" className="py-24 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-brand-red text-sm font-bold uppercase tracking-widest">FAQs</span>
            <h2 className="text-4xl font-black text-white mt-3">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map(faq => (
              <details key={faq.q} className="group bg-[#0d1117] border border-white/10 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer text-white font-semibold text-sm select-none list-none">
                  {faq.q}
                  <ChevronRight size={16} className="text-brand-red shrink-0 ml-3 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-5 pb-5 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ CONTACT ═══════════════════════════════════════ */}
      <section id="contact" className="py-24 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-br from-brand-red/20 to-brand-orange/10 border border-brand-red/30 rounded-3xl p-12">
            <Award size={48} className="text-brand-orange mx-auto mb-4" />
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Ready to Start Streaming?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
              Join 50,000+ customers streaming in 4K today. Setup in under 5 minutes. No contract required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/pricing"
                className="flex items-center justify-center gap-2 px-10 py-4 gradient-red text-white font-black text-lg rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-brand-red/30"
              >
                <Play size={20} fill="white" /> Get Started Now
              </Link>
              <a
                href="https://wa.me/1234567890"
                className="flex items-center justify-center gap-2 px-10 py-4 bg-green-500/20 border border-green-500/40 text-green-400 font-bold text-lg rounded-xl hover:bg-green-500/30 transition-all"
              >
                <MessageCircle size={20} /> WhatsApp Us
              </a>
            </div>
            <p className="text-gray-500 text-xs mt-6">30-Day Money-Back Guarantee · Secure Payment · Instant Activation</p>
          </div>
        </div>
      </section>

    </div>
  );
}
