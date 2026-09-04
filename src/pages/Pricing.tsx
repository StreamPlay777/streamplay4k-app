import { Check, Star, Shield, Zap, ChevronRight } from 'lucide-react';
import { plans } from '../data/pricing';

const faqs = [
  { q: 'What devices does StreamPlay4K work on?', a: 'StreamPlay4K works on Amazon Firestick, Android TV, Apple TV, Smart TVs, Windows PC, Mac, iPhone, iPad, Android phones, Roku, MAG Box, and more. If it connects to the internet, it likely works.' },
  { q: 'How quickly will I receive my login credentials?', a: 'Instantly! After payment is confirmed, your credentials are automatically sent to your email within 60 seconds. Setup takes less than 5 minutes.' },
  { q: 'Can I try before I buy?', a: 'Yes! We offer a 24-hour free trial. Contact our support team via WhatsApp or live chat to request yours before purchasing a full plan.' },
  { q: 'How many devices can I use simultaneously?', a: 'Depends on your plan. Our monthly plan allows 1 connection, 3-month allows 2, 6-month allows 2, and the 12-month plan allows 3 simultaneous connections.' },
  { q: 'What payment methods do you accept?', a: 'We accept Visa, Mastercard, PayPal, American Express, and multiple cryptocurrencies (Bitcoin, USDT, ETH). All payments are secure and encrypted.' },
  { q: 'Is there a money-back guarantee?', a: 'Absolutely. We offer a 30-day money-back guarantee if you\'re not satisfied for any reason. No questions asked.' },
  { q: 'Will it work in my country?', a: 'StreamPlay4K works worldwide. Our servers are optimized for the USA, Canada, UK, and over 150 countries globally.' },
  { q: 'What internet speed do I need?', a: 'For HD streaming: 10 Mbps. For 4K streaming: 25 Mbps or higher. Most modern home internet connections work perfectly.' },
];

const paymentMethods = ['Visa', 'Mastercard', 'PayPal', 'American Express', 'Bitcoin', 'USDT', 'Ethereum'];

export default function Pricing() {
  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <section className="bg-brand-darker border-b border-brand-border py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-brand-red text-sm font-bold uppercase tracking-widest">Pricing Plans</span>
          <h1 className="text-5xl font-black text-white mt-2 mb-4">
            Simple, Transparent <span className="text-gradient">Pricing</span>
          </h1>
          <p className="text-gray-400 text-lg">No hidden fees. Cancel anytime. Start streaming in minutes.</p>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-400">
            <Shield size={14} className="text-green-400" />
            30-Day Money-Back Guarantee
            <span className="mx-2">•</span>
            <Zap size={14} className="text-brand-orange" />
            Instant Activation
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map(plan => (
            <div
              key={plan.id}
              className={`relative bg-brand-card border rounded-2xl p-6 flex flex-col ${plan.popular ? 'border-brand-red shadow-2xl shadow-brand-red/20 scale-105' : 'border-brand-border'}`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 gradient-red text-white text-xs font-black rounded-full whitespace-nowrap shadow-lg">
                  🔥 {plan.badge}
                </div>
              )}
              <div className="mb-6">
                <h2 className="text-white font-black text-xl mb-3">{plan.name}</h2>
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-black text-white">${plan.price}</span>
                </div>
                {plan.originalPrice && (
                  <p className="text-gray-500 text-sm mt-1">
                    <span className="line-through">${plan.originalPrice}</span>
                    <span className="text-green-400 ml-2">You save ${(plan.originalPrice - plan.price).toFixed(2)}</span>
                  </p>
                )}
                <p className="text-brand-orange text-sm font-bold mt-1">≈ ${plan.pricePerMonth}/month</p>
                <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                  <span>🖥 {plan.devices} devices</span>
                  <span>📡 {plan.connections} connections</span>
                </div>
              </div>

              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check size={14} className="text-green-400 mt-0.5 shrink-0" />
                    <span className="text-gray-300">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-4 rounded-xl font-black text-sm transition-all ${plan.popular ? 'gradient-red text-white hover:opacity-90 shadow-lg shadow-brand-red/30' : 'bg-white/10 text-white hover:bg-brand-red hover:text-white border border-brand-border'}`}
              >
                Get {plan.name} Plan
              </button>
            </div>
          ))}
        </div>

        {/* Payment methods */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm mb-4">Secure payment via</p>
          <div className="flex flex-wrap justify-center gap-3">
            {paymentMethods.map(p => (
              <span key={p} className="px-4 py-2 bg-brand-card border border-brand-border rounded-lg text-gray-300 text-sm font-medium">
                {p}
              </span>
            ))}
          </div>
          <p className="text-gray-500 text-xs mt-4">🔒 256-bit SSL encryption. Your payment information is 100% secure.</p>
        </div>
      </section>

      {/* What's Included */}
      <section className="bg-brand-darker border-y border-brand-border py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-white text-center mb-12">Every Plan Includes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ['10,000+ Live Channels', 'Sports, news, entertainment, kids, international & more'],
              ['4K Ultra HD & HD Quality', 'Crystal-clear streams on all supported channels'],
              ['60,000+ VOD Movies & Shows', 'The largest on-demand library of any IPTV service'],
              ['Electronic Program Guide (EPG)', 'See what\'s on now and what\'s coming up'],
              ['Anti-Freeze Technology', 'Our servers are optimized for zero-buffer streaming'],
              ['Works on All Devices', 'Firestick, Android, Apple TV, PC, Smart TV & more'],
              ['Instant Setup', 'Get your credentials in 60 seconds and start watching'],
              ['24/7 Customer Support', 'Expert help via live chat, WhatsApp, and email anytime'],
            ].map(([title, desc]) => (
              <div key={title} className="flex items-start gap-3 bg-brand-card border border-brand-border rounded-xl p-4">
                <div className="w-6 h-6 gradient-red rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={12} className="text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{title}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-black text-white text-center mb-12">What Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Tom B.', text: 'Switched from cable and saving $120/month. Every channel I had before plus thousands more. No regrets.', stars: 5 },
            { name: 'Aisha M.', text: 'The 4K quality during NFL Sunday is unreal. Better than my old cable provider in every way.', stars: 5 },
            { name: 'Kevin L.', text: 'Setup was insanely easy on my Firestick. Was watching within 5 minutes of payment. Love it.', stars: 5 },
          ].map(t => (
            <div key={t.name} className="bg-brand-card border border-brand-border rounded-2xl p-6">
              <div className="flex gap-1 mb-3">
                {[...Array(t.stars)].map((_, i) => <Star key={i} size={14} fill="#F5A623" className="text-brand-orange" />)}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">"{t.text}"</p>
              <p className="text-white font-bold text-sm">{t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-brand-darker border-t border-brand-border py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-white text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map(faq => (
              <details key={faq.q} className="group bg-brand-card border border-brand-border rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer text-white font-semibold text-sm select-none">
                  {faq.q}
                  <ChevronRight size={16} className="text-brand-red group-open:rotate-90 transition-transform shrink-0 ml-2" />
                </summary>
                <div className="px-5 pb-5 text-gray-400 text-sm leading-relaxed border-t border-brand-border pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
