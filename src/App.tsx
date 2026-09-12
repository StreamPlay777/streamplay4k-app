import { lazy, Suspense } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import CampaignBanner from './components/CampaignBanner';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import { useScrollTop } from './hooks/useScrollTop';
import { routes } from './data/site';
import Seo from './components/Seo';
import { notFoundSeo } from './data/seo';

import Home from './pages/Home';
import Pricing from './pages/Pricing';
import Setup from './pages/Setup';
import Channels from './pages/Channels';
import Reviews from './pages/Reviews';
import Contact from './pages/Contact';
import ThankYou from './pages/ThankYou';

/**
 * Blog is split out. It is the only route that pulls in markdown-it and the
 * rendered post bodies, and nothing else on the site needs them — keeping it
 * lazy leaves the homepage bundle untouched by the blog's weight.
 */
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));

/**
 * Legal, About and the standalone FAQ are split out too. Between them they hold
 * roughly 15 kB of prose that every visitor was otherwise downloading on the
 * homepage to read a page most of them never open. They are still pre-rendered
 * to static HTML, so the split costs nothing for search or first paint — only a
 * client-side navigation to one of them fetches a chunk.
 */
const About = lazy(() => import('./pages/About'));
const FaqPage = lazy(() => import('./pages/Faq'));
const Terms = lazy(() => import('./pages/legal/Terms'));
const Privacy = lazy(() => import('./pages/legal/Privacy'));
const Refund = lazy(() => import('./pages/legal/Refund'));
const Cookies = lazy(() => import('./pages/legal/Cookies'));
const Dmca = lazy(() => import('./pages/legal/Dmca'));

/**
 * The 404 page.
 *
 * Pre-rendered to dist/404.html and served by Apache's ErrorDocument with a real
 * 404 status. It used to be reachable only after hydration: the server sent the
 * homepage — title, content and canonical included — for every unknown URL,
 * with a 200. To a crawler that was sixty copies of the homepage, and Google
 * declined to index the site accordingly.
 *
 * Client-side it also catches in-app navigation to a bad route, which is why
 * it still sets the document head itself.
 */
function NotFound() {
  return (
    <section className="grid min-h-[60vh] place-items-center px-7 text-center">
      <Seo seo={notFoundSeo} />
      <div>
        <h1 className="font-display text-[72px] font-extrabold leading-none text-accent-ink">404</h1>
        <p className="mt-4 text-[18px] text-ink-3">That page does not exist, or it has moved.</p>
        <Link to={routes.home} className="btn-accent mt-7">Back home</Link>
        <nav aria-label="Popular pages" className="mt-9 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[14.5px]">
          <Link to={routes.pricing} className="text-accent-link hover:underline">Plans &amp; pricing</Link>
          <Link to={routes.channels} className="text-accent-link hover:underline">Channel list</Link>
          <Link to={routes.setup} className="text-accent-link hover:underline">Setup guide</Link>
          <Link to={routes.faq} className="text-accent-link hover:underline">FAQ</Link>
          <Link to={routes.contact} className="text-accent-link hover:underline">Contact</Link>
        </nav>
      </div>
    </section>
  );
}

/**
 * Routed shell — nav, WhatsApp support and footer are shared by every page.
 *
 * The newsletter strip was removed (brief §14): no list provider is connected,
 * and a form that reports success while sending nothing does not belong on a
 * production site. Newsletter.tsx is kept for when one is wired up.
 *
 * React Router v6 ignores trailing slashes when matching, so the paths below
 * without one still match the canonical `/pricing/` style URLs the site links
 * to and the build emits.
 */
export default function App() {
  useScrollTop();
  return (
    <>
      <CampaignBanner />
      <Navbar />
      <main>
        <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/channels" element={<Channels />} />
            <Route path="/setup-guide" element={<Setup />} />
            {/* Old path kept as a client-side redirect; .htaccess sends a 301
                for anyone arriving from outside. */}
            <Route path="/setup" element={<Navigate to={routes.setup} replace />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy-policy" element={<Privacy />} />
            <Route path="/refund-policy" element={<Refund />} />
            <Route path="/cookie-policy" element={<Cookies />} />
            <Route path="/dmca" element={<Dmca />} />
            {/* noindex, excluded from the sitemap — see ThankYou.tsx */}
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <WhatsAppButton />
      <Footer />
    </>
  );
}
