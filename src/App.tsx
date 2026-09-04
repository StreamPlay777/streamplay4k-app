import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Channels from './pages/Channels';
import Pricing from './pages/Pricing';
import Setup from './pages/Setup';
import Devices from './pages/Devices';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/channels" element={<Channels />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/devices" element={<Devices />} />
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center text-center pt-24">
              <div>
                <h1 className="text-6xl font-black text-brand-red mb-4">404</h1>
                <p className="text-white text-xl mb-6">Page not found</p>
                <a href="/" className="px-6 py-3 gradient-red text-white font-bold rounded-xl">Go Home</a>
              </div>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
