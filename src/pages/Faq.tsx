import { Link } from 'react-router-dom';
import Faq from '../components/Faq';
import Seo from '../components/Seo';
import { faqs } from '../data/faqs';
import { routes, site } from '../data/site';
import { pageSeo } from '../data/seo';

/**
 * Standalone FAQ page.
 *
 * This is the page that carries FAQPage structured data — the schema is built
 * from the same `faqs` array the accordion renders, so the marked-up answers
 * and the visible answers are the same strings by construction.
 */
export default function FaqPage() {
  const seo = pageSeo[routes.faq];

  return (
    <>
      <Seo seo={seo} />

      <section className="section amb amb-warm bg-bg">
        <div className="mx-auto max-w-narrow">
          <div className="mx-auto max-w-[720px] text-center">
            <p className="eyebrow">{site.name} FAQ</p>
            <h1
              className="mt-4 font-display font-extrabold leading-[1.04] text-ink"
              style={{ fontSize: 'clamp(32px, 5vw, 50px)' }}
            >
              Questions? <span className="text-grad">We&apos;ve got you.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-[560px] text-[16.5px] leading-relaxed text-ink-3">
              Devices, activation times, how payment works, trials and refunds. If your question is
              not here, message us and we will answer it.
            </p>
          </div>

          <div className="mt-12">
            <Faq items={faqs} />
          </div>

          <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to={routes.pricing} className="btn-accent w-full sm:w-auto">View plans →</Link>
            <Link to={routes.contact} className="btn-outline w-full sm:w-auto">Contact support</Link>
          </div>
        </div>
      </section>
    </>
  );
}
