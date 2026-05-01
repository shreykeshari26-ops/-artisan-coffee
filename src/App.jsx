import Hero from './Hero';
import Menu from './Menu';

function App() {
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