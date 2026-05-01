import { useEffect, useRef, useCallback } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Hero from './Hero';
import Menu from './Menu';
import Order from './Order';

gsap.registerPlugin(ScrollTrigger);

/* ── Home page: Hero + Menu + Footer ──────────────────────────────────── */
function HomePage() {
  return (
    <>
      <Hero />

      <div style={{
        width: '100%',
        height: '8rem',
        background: '#000',
        position: 'relative',
        zIndex: 20,
      }} />

      <Menu />

      <footer className="site-footer">
        <div className="footer-inner">
          <span className="footer-brand">Artisan Coffee Works</span>
          <p className="footer-copy">
            © 2026 Artisan Coffee Works. Crafted by Shreyansh Keshari.
          </p>
        </div>
      </footer>
    </>
  );
}

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
    <main style={{ background: '#000', margin: 0 }}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/order" element={<Order />} />
      </Routes>
    </main>
  );
}

export default App;