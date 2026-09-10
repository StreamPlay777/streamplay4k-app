import { site } from './site';
import { MAX_DEVICES } from './pricing';

/**
 * Legal page content.
 *
 * WRITTEN FROM SCRATCH for StreamPlay4K against the business facts in
 * data/site.ts. No wording is copied from another provider.
 *
 * DELIBERATELY NOT STATED, because nobody has supplied them and inventing them
 * would be worse than omitting them:
 *   - a registered company name or number (site.legalName is the brand, not a
 *     registered entity — the postal address below is a real one, but an
 *     address without an entity is still only half an identity)
 *   - a governing law / jurisdiction clause. The address is in New York, which
 *     points at US and New York law, but which law governs a contract is a
 *     decision for the business and its lawyer, not an inference from a ZIP
 *     code, so it stays unstated.
 *   - a named DMCA designated agent. Note that a US-facing service that wants
 *     the DMCA safe harbour has to register an agent with the US Copyright
 *     Office; naming one here without that registration would claim a
 *     protection that does not exist.
 *   - named payment processors or sub-processors
 *   - any content licensing or studio relationship
 *
 * SUPPLIED: the postal address (site.address), added to the contact sections
 * of every document below.
 *
 * TODO(client): supply the rest and they can be added. Until then the pages
 * read as complete documents that simply do not make those claims, rather than
 * showing placeholder text to customers.
 *
 * `updated` drives the "Last updated" line and should be bumped whenever the
 * substance of a document changes.
 */

export interface LegalBlock {
  /** Paragraphs and lists, in order. */
  kind: 'p' | 'ul';
  text?: string;
  items?: string[];
}

export interface LegalSection {
  id: string;
  heading: string;
  blocks: LegalBlock[];
}

export interface LegalDoc {
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
}

const UPDATED = '7 September 2026';
const p = (text: string): LegalBlock => ({ kind: 'p', text });
const ul = (items: string[]): LegalBlock => ({ kind: 'ul', items });

/* ── Terms of Service ─────────────────────────────────────────────────────── */

export const terms: LegalDoc = {
  title: 'Terms of Service',
  updated: UPDATED,
  intro: `These terms apply when you order or use a ${site.name} subscription. Please read them before placing an order. By placing an order you accept the terms set out below.`,
  sections: [
    {
      id: 'service',
      heading: '1. What we provide',
      blocks: [
        p(`${site.name} resells access to IPTV subscription services. A subscription gives you login credentials that you use in a compatible third-party player application on your own device. We do not produce, own or licence the channels or on-demand titles that a subscription can reach; that content is supplied by third-party providers.`),
        p('We do not supply hardware. You use your own television, streaming stick, phone, tablet or computer.'),
      ],
    },
    {
      id: 'eligibility',
      heading: '2. Eligibility',
      blocks: [
        p('You must be of legal age to enter into a contract in the place where you live, and you must be ordering for your own personal, household use. Subscriptions are not sold for commercial or public display.'),
        p('You are responsible for making sure that using an IPTV service is lawful where you are, and for how you use the content you reach through it.'),
      ],
    },
    {
      id: 'credentials',
      heading: '3. Your access credentials',
      blocks: [
        p('After payment is confirmed, we send you the details needed to log in. Those details are personal to you.'),
        ul([
          'Keep your credentials private. Do not publish, share or resell them.',
          'Tell us as soon as possible if you believe someone else has them.',
          'We may reset credentials that appear to be shared or abused.',
        ]),
      ],
    },
    {
      id: 'devices',
      heading: '4. Devices and simultaneous use',
      blocks: [
        p(`Every plan includes one device. You may add more when you order, up to ${MAX_DEVICES} in total. The number you choose is the number of streams that may play at the same time.`),
        p('Attempting to exceed the number of devices on your plan may cause streams to stop, and repeated attempts may lead to suspension.'),
      ],
    },
    {
      id: 'ordering',
      heading: '5. Ordering and payment',
      blocks: [
        p('No payment is taken on this website. When you submit the order form you are asking us for an invoice; you are not being charged at that moment.'),
        p(`After you place an order we send an invoice and payment instructions to the email address and WhatsApp number you gave us. Your subscription begins once that payment is confirmed.`),
        p('Prices shown on this site are in US dollars and are for the term and device count you select. We may change our prices at any time, but a change never affects an order already invoiced.'),
      ],
    },
    {
      id: 'activation',
      heading: '6. Activation',
      blocks: [
        p(`Once payment is confirmed, access is ${site.activation}. This is our normal turnaround rather than a guaranteed time, and it can take longer outside that window if we need to check something with you.`),
      ],
    },
    {
      id: 'responsibilities',
      heading: '7. Your responsibilities',
      blocks: [
        ul([
          'Provide accurate contact details, so we can send your invoice and credentials.',
          'Supply your own internet connection and equipment.',
          'Install and maintain the player application on your own devices.',
          'Use the service lawfully and only for personal use.',
        ]),
      ],
    },
    {
      id: 'availability',
      heading: '8. Service availability',
      blocks: [
        p('We work to keep the service running continuously, but we cannot promise it will be uninterrupted or error-free. Availability depends on third-party providers, on your internet connection and on your own equipment, none of which we control.'),
        p('Channel line-ups and on-demand catalogues are provided by third parties and can change without notice. We do not guarantee that any particular channel, event or title will remain available for the length of your subscription.'),
      ],
    },
    {
      id: 'ip',
      heading: '9. Intellectual property',
      blocks: [
        p(`The ${site.name} name, logo, site design and written content belong to us. You may not copy or reuse them without our permission.`),
        p('Network names and logos shown on this website belong to their respective owners. They are used to describe what a subscription may give access to. Their appearance does not indicate any partnership, sponsorship or endorsement.'),
      ],
    },
    {
      id: 'prohibited',
      heading: '10. Prohibited use',
      blocks: [
        p('You may not:'),
        ul([
          'resell, sublicense or redistribute your subscription or credentials',
          'use the service in a public venue, business premises or for any commercial screening',
          'record, rebroadcast or make available any content you reach through the service',
          'attempt to interfere with, probe or circumvent our systems or those of our providers',
          'use the service for anything unlawful',
        ]),
      ],
    },
    {
      id: 'suspension',
      heading: '11. Suspension and termination',
      blocks: [
        p('We may suspend or end a subscription without refund if these terms are broken, in particular where credentials are shared or resold, or where the service is used commercially or unlawfully.'),
        p(`You may stop using the service at any time. If you want a refund, see our Refund Policy.`),
      ],
    },
    {
      id: 'refunds',
      heading: '12. Refunds',
      blocks: [
        p(`We offer a ${site.refundDays}-day money-back guarantee. The conditions and the process are set out in full in our Refund Policy, which forms part of these terms.`),
      ],
    },
    {
      id: 'liability',
      heading: '13. Limitation of liability',
      blocks: [
        p('To the extent the law allows, our liability to you in connection with the service is limited to the amount you paid for the subscription in question.'),
        p('We are not responsible for loss or damage caused by things outside our reasonable control, including your internet connection, your equipment, or the acts of third-party content and infrastructure providers.'),
        p('Nothing in these terms limits any right you have that cannot be limited by law.'),
      ],
    },
    {
      id: 'changes',
      heading: '14. Changes to these terms',
      blocks: [
        p('We may update these terms from time to time. The version published on this page is the one that applies, and the date it was last changed is shown at the top.'),
      ],
    },
    {
      id: 'contact',
      heading: '15. Contact',
      blocks: [
        p(`Questions about these terms can be sent to ${site.email}, or to us on WhatsApp at ${site.whatsapp}.`),
        p(`Postal address: ${site.address}.`),
      ],
    },
  ],
};

/* ── Privacy Policy ───────────────────────────────────────────────────────── */

export const privacy: LegalDoc = {
  title: 'Privacy Policy',
  updated: UPDATED,
  intro: `This policy explains what information ${site.name} collects, why we collect it, how long we keep it and what you can ask us to do with it.`,
  sections: [
    {
      id: 'what',
      heading: '1. Information you give us',
      blocks: [
        p('When you place an order we ask for:'),
        ul([
          'your email address, so we can send your invoice and login details',
          'your phone or WhatsApp number, so we can send the same information there and help with setup',
        ]),
        p('If you contact us for support, we also hold whatever you choose to tell us in that conversation — typically your device type and a description of the problem.'),
        p('If you enter a phone number in the order form and then leave without completing the order, we keep that number so we can offer to help you finish. We record it only once the number is complete and you have moved on to the next field — nothing is stored while you are still typing, and a number that is never completed is never stored. We do not keep any other detail from an unfinished order. Ask us and we will delete it.'),
        p('We do not ask for, and do not want, your card or bank details on this website. No payment is taken here.'),
      ],
    },
    {
      id: 'order',
      heading: '2. Order information',
      blocks: [
        p('Alongside your contact details, an order record holds the plan and term you chose, the number of devices, the total to be invoiced, the page you ordered from, and any campaign parameters present in the link you arrived through.'),
        p('Payment, when you make one, happens on our payment provider\u2019s own secure checkout page, not on this website. They receive your email address and the amount, and they handle your card details — we never see or store them. Your order record notes that a payment succeeded and for how much, nothing more.'),
      ],
    },
    {
      id: 'technical',
      heading: '3. Technical information',
      blocks: [
        p('Our hosting provider records standard server logs when a page is requested, which can include an IP address, browser type and the page requested. These are used to keep the site running and secure.'),
        p('The site itself stores a small amount of information in your own browser: your order summary is held in session storage so the confirmation page can show it, and it is cleared when you close the tab. See our Cookie Policy for the detail.'),
      ],
    },
    {
      id: 'why',
      heading: '4. Why we process it',
      blocks: [
        ul([
          'To prepare and send your invoice, and to activate your subscription.',
          'To provide support, including setup help and troubleshooting.',
          'To handle refund requests.',
          'To keep the website secure and working.',
          'To meet obligations the law places on us.',
        ]),
        p('We do not sell your information, and we do not share it for anyone else’s marketing.'),
      ],
    },
    {
      id: 'sharing',
      heading: '5. Who we share it with',
      blocks: [
        p('We share the minimum necessary with the providers who help us run the service: our hosting provider, our email provider, and the upstream subscription provider who activates your line. Each acts on our instructions.'),
        p('We will also disclose information if we are legally required to.'),
      ],
    },
    {
      id: 'payments',
      heading: '6. Payments and invoices',
      blocks: [
        p('Payment happens away from this website, through the instructions on your invoice. We receive confirmation that an invoice has been paid. We do not receive or store your full card number.'),
      ],
    },
    {
      id: 'security',
      heading: '7. Security',
      blocks: [
        p('The site is served over an encrypted connection. Access to order and support records is limited to the people who need it to do their job. No system is completely secure, but we take reasonable steps to protect what we hold.'),
      ],
    },
    {
      id: 'retention',
      heading: '8. How long we keep it',
      blocks: [
        p('We keep order and support records for as long as your subscription is active and for a reasonable period afterwards, so that we can handle renewals, refunds and any dispute. After that we delete them or reduce them to anonymous records.'),
      ],
    },
    {
      id: 'rights',
      heading: '9. Your requests',
      blocks: [
        p(`You can ask us for a copy of the information we hold about you, ask us to correct it, or ask us to delete it. Write to ${site.email} and we will respond.`),
        p('If you ask us to delete information we need in order to keep your subscription running, we will explain what that means before acting.'),
      ],
    },
    {
      id: 'analytics',
      heading: '10. Analytics',
      blocks: [
        p('At the time this policy was last updated, no analytics or advertising service is loaded on this website. If we add one, this policy and our Cookie Policy will be updated before it goes live.'),
      ],
    },
    {
      id: 'contact',
      heading: '11. Contact',
      blocks: [
        p(`Privacy questions can be sent to ${site.email}.`),
        p(`Postal address: ${site.address}.`),
      ],
    },
  ],
};

/* ── Refund Policy ────────────────────────────────────────────────────────── */

export const refund: LegalDoc = {
  title: 'Refund Policy',
  updated: UPDATED,
  intro: `${site.name} offers a ${site.refundDays}-day money-back guarantee. This page explains what that covers and how to use it.`,
  sections: [
    {
      id: 'guarantee',
      heading: `1. The ${site.refundDays}-day guarantee`,
      blocks: [
        p(`If the service is not right for you, tell us within ${site.refundDays} days of your subscription being activated and we will refund what you paid for it.`),
        p('The window runs from activation — the moment your login details are delivered — not from the day you placed the order.'),
      ],
    },
    {
      id: 'how',
      heading: '2. How to request a refund',
      blocks: [
        p('There is no form to fill in and no set of hoops to jump through.'),
        ul([
          `Message us on WhatsApp at ${site.whatsapp}, or email ${site.email}.`,
          'Tell us the email address you used to order, so we can find your subscription.',
          'Tell us briefly what went wrong. You do not have to, but it often lets us fix the problem in a couple of minutes instead.',
        ]),
      ],
    },
    {
      id: 'process',
      heading: '3. What happens next',
      blocks: [
        p('We will confirm your request and stop the subscription. The refund is returned by the same method you used to pay the invoice. How long it then takes to appear depends on your bank or payment provider rather than on us.'),
      ],
    },
    {
      id: 'troubleshoot',
      heading: '4. We would rather fix it',
      blocks: [
        p('Most problems people ask to be refunded for turn out to be setup issues — the wrong login format, a player that does not support the feed, or a connection problem. If you are willing, let us try first. If we cannot solve it, the guarantee still stands and the clock does not run out while we are working on it.'),
      ],
    },
    {
      id: 'exceptions',
      heading: '5. When the guarantee does not apply',
      blocks: [
        ul([
          `Requests made more than ${site.refundDays} days after activation.`,
          'Subscriptions suspended or ended because our Terms of Service were broken, including sharing or reselling credentials.',
          'Renewals of a subscription that has already run past a previous guarantee period.',
        ]),
      ],
    },
    {
      id: 'contact',
      heading: '6. Contact',
      blocks: [
        p(`Refund questions: ${site.email}, or WhatsApp ${site.whatsapp}.`),
        p(`Postal address: ${site.address}.`),
      ],
    },
  ],
};

/* ── Cookie Policy ────────────────────────────────────────────────────────── */

export const cookies: LegalDoc = {
  title: 'Cookie Policy',
  updated: UPDATED,
  intro: `This page lists what ${site.name} stores in your browser. It is short, because we store very little.`,
  sections: [
    {
      id: 'what',
      heading: '1. What we currently use',
      blocks: [
        p('At the time this policy was last updated, this website sets no advertising cookies and no third-party tracking cookies. Nothing on the site profiles you or follows you to other websites.'),
        p('We use browser storage in one place:'),
        ul([
          'Session storage — after you place an order, a summary of it (your plan, device count and contact details) is kept in your own browser so the confirmation page can display it. It is held only in that tab and disappears when you close it. It is never sent anywhere.',
        ]),
      ],
    },
    {
      id: 'essential',
      heading: '2. Strictly necessary',
      blocks: [
        p('The item above is strictly necessary for the ordering process to work, so it does not require consent. It contains no identifier we can use to recognise you later.'),
      ],
    },
    {
      id: 'future',
      heading: '3. If we add analytics',
      blocks: [
        p('We may add website analytics in future to understand which pages are useful. If we do, we will list the cookies it sets on this page, and we will not enable it until this page has been updated and any consent required has been asked for.'),
      ],
    },
    {
      id: 'control',
      heading: '4. Controlling browser storage',
      blocks: [
        p('You can clear or block cookies and site data in your browser settings, usually under Privacy. Blocking storage for this site will not stop you browsing it, but the order confirmation page may not be able to show your order summary.'),
      ],
    },
    {
      id: 'contact',
      heading: '5. Contact',
      blocks: [p(`Questions: ${site.email}.`), p(`Postal address: ${site.address}.`)],
    },
  ],
};

/* ── DMCA / Copyright ─────────────────────────────────────────────────────── */

export const dmca: LegalDoc = {
  title: 'DMCA & Copyright',
  updated: UPDATED,
  intro: `${site.name} respects copyright. This page explains our position and how to send us a notice.`,
  sections: [
    {
      id: 'position',
      heading: '1. Our position',
      blocks: [
        p(`${site.name} is a reseller of IPTV subscription services. We do not host, stream, store, upload, record or transmit any audio or video content, and we do not operate the servers that deliver it. Content reached through a subscription is supplied by third-party providers.`),
        p('Because of this, we are usually not the right party to remove a specific stream or title. We can, however, pass a notice to the upstream provider and act on subscriptions used in breach of our terms.'),
      ],
    },
    {
      id: 'notice',
      heading: '2. Sending a copyright notice',
      blocks: [
        p(`If you own a copyright, or are authorised to act for the owner, and you believe material reachable through our service infringes it, email ${site.email} with the subject line "Copyright Notice".`),
        p('So that we can act on it, please include:'),
        ul([
          'your full name, and the rights holder you represent if that is not you',
          'contact details we can reply to — email, and a postal address or phone number',
          'a clear identification of the work you say is infringed',
          'a clear identification of the material you are complaining about, and enough detail for us to locate it',
          'a statement that you believe in good faith that the use is not authorised by the rights holder, its agent or the law',
          'a statement that the information in your notice is accurate, and that you are the rights holder or authorised to act for them',
          'your physical or electronic signature',
        ]),
      ],
    },
    {
      id: 'response',
      heading: '3. What we do with it',
      blocks: [
        p('We review every notice we receive. Where the complaint concerns a subscription we supplied, we may suspend or terminate it. Where it concerns content carried by an upstream provider, we forward the notice to them.'),
        p('We will confirm receipt and tell you what action we have taken.'),
      ],
    },
    {
      id: 'counter',
      heading: '4. Counter-notice',
      blocks: [
        p(`If your subscription was suspended over a copyright complaint and you believe that was a mistake, email ${site.email} with an explanation and any evidence. We will review it and restore access if the complaint does not stand up.`),
      ],
    },
    {
      id: 'repeat',
      heading: '5. Repeat infringers',
      blocks: [
        p('Subscriptions that are the subject of repeated, substantiated copyright complaints are terminated without refund.'),
      ],
    },
    {
      id: 'contact',
      heading: '6. Contact',
      blocks: [
        p(`Copyright notices: ${site.email}.`),
        p(`Postal address: ${site.address}.`),
      ],
    },
  ],
};

export const legalDocs = { terms, privacy, refund, cookies, dmca };
