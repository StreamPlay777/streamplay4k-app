import { site } from './site';
import { MAX_DEVICES } from './pricing';

/**
 * FAQ content, shared by the homepage accordion, /pricing and /faq.
 *
 * Every answer here is also the source for FAQPage structured data, so the
 * visible text and the schema can never drift apart — see data/seo.ts.
 *
 * Claims removed in the final content pass: "instantly", "three to six
 * minutes", "one to four" simultaneous screens, American Express, and
 * "payment is taken over a secure connection" (no payment is taken on this
 * site at all).
 */
export const faqs = [
  {
    q: 'What is IPTV and how does it work?',
    a: 'IPTV delivers television over an internet connection rather than traditional cable or satellite. After activation, you receive login details that you can use with a compatible app or device.',
  },
  {
    q: 'Which devices are supported?',
    a: `StreamPlay4K works with Amazon Fire TV and Firestick, Android TV and Google TV, Apple TV, Samsung and LG smart TVs, Android phones and tablets, iPhone and iPad, Windows and macOS, and Android boxes. You can choose up to ${MAX_DEVICES} devices when you select your plan.`,
  },
  {
    q: 'How quickly will my account be activated?',
    a: `Access is usually ready within ${site.activationWindow} after payment confirmation.`,
  },
  {
    q: `Can I use ${site.name} on more than one device?`,
    a: `Yes. Choose the number of devices you need when selecting your plan, up to ${MAX_DEVICES} devices.`,
  },
  {
    q: 'How does payment work?',
    a: 'No payment is taken directly on the order form. After you place your order, we send your invoice and payment instructions by email and WhatsApp.',
  },
  {
    q: 'What happens after I pay?',
    a: `Once payment is confirmed, your login details are usually delivered within ${site.activationWindow}.`,
  },
  {
    q: `Can I try ${site.name} before ordering?`,
    a: `Yes. Contact us on WhatsApp or at ${site.email} to request a trial, and we will set one up for you. No payment details are needed to ask.`,
  },
  {
    q: 'What is the refund policy?',
    a: `${site.name} offers a ${site.refundDays}-day money-back guarantee, subject to the conditions in the Refund Policy.`,
  },
  {
    q: 'How can I contact support?',
    a: `Support is available through WhatsApp on ${site.whatsapp} and by email at ${site.email}.`,
  },
  {
    q: 'What internet speed do I need?',
    a: 'Around 15 Mbps is comfortable for HD and 25 Mbps or more for 4K. A wired connection is steadier than Wi-Fi for live sport, but most home broadband handles it without trouble.',
  },
];
