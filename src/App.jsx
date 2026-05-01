import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Hero from './Hero';
import Menu from './Menu';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const lenisRef = useRef(null);

  useEffect(() => {
    // ── Lenis: premium momentum-based smooth scrolling ──────────────
    const lenis = new Lenis({
      duration: 1.2,          // scroll deceleration curve
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),  // easeOutExpo
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    // ── Bridge Lenis → GSAP ScrollTrigger ──────────────────────────
    //    Lenis drives the actual scroll position; on every Lenis tick
    //    we tell ScrollTrigger to re-evaluate. This keeps the canvas
    //    frame animation perfectly locked to the Lenis scroll value.
    lenis.on('scroll', ScrollTrigger.update);

    // ── Lenis raf loop ─────────────────────────────────────────────
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);   // Lenis expects ms, GSAP ticker gives seconds
    });
    gsap.ticker.lagSmoothing(0); // prevent GSAP from throttling on tab-switch

    return () => {
      gsap.ticker.remove(lenis.raf);
      lenis.destroy();
    };
  }, []);

  return (
    <main style={{ background: '#000', margin: 0 }}>
      {/* ── Cinematic scroll animation ── */}
      <Hero />

      {/* ── Solid black bridge — prevents any transparency seam ── */}
      <div style={{
        width: '100%',
        height: '8rem',
        background: '#000',
        position: 'relative',
        zIndex: 20,
      }} />

      {/* ── Product menu ── */}
      <Menu />

      {/* ── Footer ── */}
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