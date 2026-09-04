import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Newsletter from './components/Newsletter';
import { PlanProvider } from './hooks/usePlan';
import { useScrollTop } from './hooks/useScrollTop';
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import Setup from './pages/Setup';
import Channels from './pages/Channels';
import Reviews from './pages/Reviews';
import Contact from './pages/Contact';

function NotFound() {
  return (
    <section className="grid min-h-[60vh] place-items-center px-7 text-center">
      <div>
        <h1 className="font-display text-[72px] font-extrabold leading-none text-accent">404</h1>
        <p className="mt-4 text-[18px] text-ink-3">That page does not exist.</p>
        <Link to="/" className="btn-accent mt-7">Back home</Link>
      </div>
    </section>
  );
}

/** Routed shell — nav and footer are shared by every page. */
function Shell() {
  useScrollTop();
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/channels" element={<Channels />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Newsletter />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <PlanProvider>
        <Shell />
      </PlanProvider>
    </BrowserRouter>
  );
}
