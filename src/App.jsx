import { useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navbar from './Navbar';
import Home from './Home';
import BeanStory from './BeanStory';
import Menu from './Menu';
import Order from './Order';
import Contact from './Contact';

gsap.registerPlugin(ScrollTrigger);

/* ── App: Lenis + routing ─────────────────────────────────────────────── */
function App() {
  const lenisRef  = useRef(null);
  const rafRef    = useRef(null);
  const location  = useLocation();

  /* ── Tear down GSAP ScrollTrigger pins on every route change ─────────
       GSAP pin: true wraps elements in extra DOM nodes that React doesn't
       own. We MUST kill them before React tries to unmount the tree,
       otherwise React throws "removeChild: node is not a child".         */
  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
      ScrollTrigger.clearMatchMedia();
    };
  }, [location.pathname]);

  /* ── Lenis: reinitialize on every route change ────────────────────── */
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,             // low lerp = heavy inertia smoothing for trackpad
      wheelMultiplier: 1.0,   // no velocity amplification from wheel/trackpad
      touchMultiplier: 1.5,
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time) => {
      lenis.raf(time * 1000);
    };
    rafRef.current = raf;
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [location.pathname]);

  return (
    <main style={{ background: '#000', margin: 0, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div className="page-wrapper" style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/story" element={<BeanStory />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/order" element={<Order />} />
        </Routes>
      </div>
      <footer className="site-footer">
        <div className="footer-inner">
          <span className="footer-brand">Artisan Coffee Works</span>
          <p className="footer-copy">
            © 2026 Artisan Coffee Works. Crafted by Shreyansh Keshari.
          </p>
        </div>
      </footer>
    </main>
  );
}

export default App;