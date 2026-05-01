import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 240;
const frameSrc = (i) =>
    `/frames/ezgif-frame-${(i + 1).toString().padStart(3, '0')}.jpg`;

// Narrative copy for the right-side overlay panels
const SLIDES = [
    {
        id: 's1',
        eyebrow: 'The Origin',
        headline: 'Ethically\nSourced',
        body: 'Hand-selected from single-origin farms across Ethiopia, Colombia, and Sumatra — traceable from harvest to cup.',
    },
    {
        id: 's2',
        eyebrow: 'The Roast',
        headline: 'Roasted to\n200 °C',
        body: 'Our master roasters lock in peak flavour at a precise 200 °C, drawing out notes of dark chocolate and toasted hazelnut.',
    },
    {
        id: 's3',
        eyebrow: 'The Blend',
        headline: 'Signature\nBlend',
        body: 'A proprietary 70 / 30 Arabica–Robusta ratio delivers a full-bodied espresso with a velvety crema that lingers.',
    },
    {
        id: 's4',
        eyebrow: 'The Craft',
        headline: 'Handcrafted\nDaily',
        body: 'Each cup is pulled fresh to order — no shortcuts, no batching. Perfection on demand, every single time.',
    },
];

/* ─── Object-fit cover for canvas ──────────────────────────────────────────── */
const drawCover = (ctx, img) => {
    const cW = ctx.canvas.width;
    const cH = ctx.canvas.height;
    const iR = img.width / img.height;
    const cR = cW / cH;
    let dW, dH, dX, dY;
    if (iR > cR) { dH = cH; dW = cH * iR; dX = (cW - dW) / 2; dY = 0; }
    else          { dW = cW; dH = cW / iR; dX = 0; dY = (cH - dH) / 2; }
    ctx.clearRect(0, 0, cW, cH);
    ctx.drawImage(img, dX, dY, dW, dH);
};

/* ──────────────────────────────────────────────────────────────────────────── */

const Hero = () => {
    const canvasRef  = useRef(null);
    const images     = useRef([]);
    const curIdx     = useRef(0);
    const rafId      = useRef(null);

    const [loadPct, setLoadPct] = useState(0);
    const [ready,   setReady]   = useState(false);

    /* ── Phase 1: pre-load ALL 240 frames ─────────────────────────────────── */
    useEffect(() => {
        let loaded = 0;
        images.current = new Array(FRAME_COUNT);

        for (let i = 0; i < FRAME_COUNT; i++) {
            const img = new Image();
            img.src = frameSrc(i);
            img.onload = img.onerror = () => {
                images.current[i] = img;
                loaded++;
                setLoadPct(Math.round((loaded / FRAME_COUNT) * 100));
                if (loaded === FRAME_COUNT) setReady(true);
            };
        }
    }, []);

    /* ── Phase 2: GSAP — runs ONLY after loading === false ────────────────── */
    useEffect(() => {
        if (!ready) return;

        const canvas = canvasRef.current;
        const ctx    = canvas.getContext('2d');

        /* Canvas always fills the full viewport */
        const syncSize = () => {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        syncSize();
        drawCover(ctx, images.current[0]);

        /* rAF-batched draw — at most one paint per browser frame */
        const drawFrame = (idx) => {
            const img = images.current[idx];
            if (!img) return;
            curIdx.current = idx;
            cancelAnimationFrame(rafId.current);
            rafId.current = requestAnimationFrame(() => drawCover(ctx, img));
        };

        const onResize = () => { syncSize(); drawFrame(curIdx.current); };
        window.addEventListener('resize', onResize);

        /* ── Main pinned timeline ──────────────────────────────────────────── */
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.hero-scroll-container',
                start:   'top top',
                end:     '+=500%',   // 5 × 100vh = 500vh of pinned scroll room
                scrub:   1.5,
                pin:     true,
                anticipatePin: 1,
            },
        });

        /* Frame scrubber */
        tl.to({}, {
            duration: 1,
            ease: 'none',
            onUpdate: function () {
                drawFrame(Math.min(
                    Math.floor(this.progress() * (FRAME_COUNT - 1)),
                    FRAME_COUNT - 1
                ));
            },
        });

        /* ── Slide panels: blur + y entrance / exit ─────────────────────── */
        // 4 slides × 25% each, timed across the full timeline (0 → 1)
        SLIDES.forEach((slide, i) => {
            const sel  = `.hero-slide-${slide.id}`;
            const s    = i * 0.25;          // segment start (0, .25, .5, .75)
            const peak = s + 0.10;          // fully visible
            const out  = s + 0.22;          // begin fade out
            const end  = s + 0.25;          // fully gone

            tl.fromTo(sel,
                { opacity: 0, y: 50, filter: 'blur(14px)' },
                { opacity: 1, y: 0,  filter: 'blur(0px)', ease: 'power3.out', duration: peak - s },
                s
            );
            tl.to(sel,
                { opacity: 0, y: -30, filter: 'blur(10px)', ease: 'power2.in', duration: end - out },
                out
            );
        });

        return () => {
            window.removeEventListener('resize', onResize);
            cancelAnimationFrame(rafId.current);
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, [ready]);

    /* ── Render ─────────────────────────────────────────────────────────── */
    return (
        <>
            {/* ── Loading screen — blocks scroll until every frame is cached ── */}
            {!ready && (
                <div className="hero-loader">
                    <p className="hero-loader-label">Preparing your experience</p>
                    <div className="hero-loader-track">
                        <div className="hero-loader-fill" style={{ width: `${loadPct}%` }} />
                    </div>
                    <span className="hero-loader-pct">{loadPct}&thinsp;/&thinsp;100</span>
                </div>
            )}

            {/* ── hero-scroll-container: what GSAP pins ── */}
            <div className="hero-scroll-container">

                {/* Full-screen fixed canvas (behind everything) */}
                <canvas ref={canvasRef} className="hero-canvas-fixed" />

                {/* Full-screen darkening gradient so text stays legible */}
                <div className="hero-gradient-overlay" />

                {/* Branding — top-left, always visible */}
                <div className="hero-brand">
                    <span className="hero-brand-eyebrow">Artisan Coffee Works</span>
                    <div className="hero-brand-rule" />
                </div>

                {/* Right-side narrative slides */}
                <div className="hero-slides-col">
                    {SLIDES.map((slide, i) => (
                        <div
                            key={slide.id}
                            className={`hero-slide hero-slide-${slide.id}`}
                            /* first slide visible, rest hidden */
                            style={{ opacity: i === 0 ? 1 : 0 }}
                        >
                            <span className="slide-eyebrow">{slide.eyebrow}</span>
                            <h2 className="slide-headline">
                                {slide.headline.split('\n').map((line, j) => (
                                    <span key={j}>{line}<br /></span>
                                ))}
                            </h2>
                            <p className="slide-body">{slide.body}</p>
                            <div className="slide-rule" />
                        </div>
                    ))}
                </div>

                {/* Scroll cue — bottom centre */}
                <div className="hero-scroll-cue">
                    <span>Scroll</span>
                    <div className="hero-scroll-line" />
                </div>
            </div>
        </>
    );
};

export default Hero;