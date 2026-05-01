import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 240;
const BATCH_SIZE   = 20;    // concurrent fetches per batch — saturates HTTP/2 without overwhelming the decoder

const frameSrc = (i) =>
    `/frames/ezgif-frame-${(i + 1).toString().padStart(3, '0')}.jpg`;

// ─── Global image buffer ────────────────────────────────────────────────
const images = [];

// ─── Single-frame blob pre-fetch ─────────────────────────────────────────
//     fetch → blob → ObjectURL → img.decode()
//     cache: 'force-cache' tells the browser to use a cached response
//     if available — so on repeat visits, loading is near-instant.
const prefetchFrame = (index) =>
    fetch(frameSrc(index), { cache: 'force-cache' })
        .then(res => res.blob())
        .then(blob => {
            const url = URL.createObjectURL(blob);
            const img = new Image();
            img.src = url;
            return new Promise((resolve) => {
                if (img.decode) {
                    img.decode().then(() => { images[index] = img; resolve(index); });
                } else {
                    img.onload = () => { images[index] = img; resolve(index); };
                }
            });
        });

// ─── Batched loader: resolves BATCH_SIZE frames concurrently, then moves
//     to the next batch. This keeps 20 connections saturated at all times
//     without flooding the browser’s connection pool or image decoder.
const loadAllFrames = (onProgress) => {
    images.length = 0;
    let totalLoaded = 0;

    const loadBatch = async (startIdx) => {
        const end = Math.min(startIdx + BATCH_SIZE, FRAME_COUNT);
        const batch = [];
        for (let i = startIdx; i < end; i++) {
            batch.push(
                prefetchFrame(i).then((idx) => {
                    totalLoaded++;
                    onProgress(Math.round((totalLoaded / FRAME_COUNT) * 100));
                    return idx;
                })
            );
        }
        await Promise.all(batch);
        if (end < FRAME_COUNT) await loadBatch(end);
    };

    return loadBatch(0);
};

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

/* ─── Object-fit: cover math ───────────────────────────────────────────────── */
const coverParams = (canvas, img) => {
    const cW = canvas.width;
    const cH = canvas.height;
    const iR = img.width / img.height;
    const cR = cW / cH;
    if (iR > cR) {
        const dH = cH, dW = cH * iR;
        return { dX: (cW - dW) / 2, dY: 0, dW, dH };
    }
    const dW = cW, dH = cW / iR;
    return { dX: 0, dY: (cH - dH) / 2, dW, dH };
};

/* ──────────────────────────────────────────────────────────────────────────── */

const Hero = () => {
    const canvasRef    = useRef(null);
    const offscreenRef = useRef(null);  // double-buffer: hidden canvas
    const curIdx       = useRef(0);
    const rafId        = useRef(null);

    const [loadPct, setLoadPct] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    /* ── Phase 1: Batched blob pre-fetch ─────────────────────────────────
         Loads 20 frames concurrently, waits for that batch to finish,
         then fires the next 20. This keeps the connection pool fully
         saturated without the head-of-line blocking that occurs when
         240 fetches are fired simultaneously.                              */
    useEffect(() => {
        loadAllFrames(setLoadPct).then(() => setIsLoaded(true));
    }, []);

    /* ── Phase 2: GSAP — runs ONLY after isLoaded === true ─────────────────
         ScrollTrigger is never created until Promise.all has resolved.      */
    useEffect(() => {
        if (!isLoaded) return;

        const canvas = canvasRef.current;
        const ctx    = canvas.getContext('2d');

        // ── Double-buffer: create a hidden off-screen canvas ──────────────
        //    We render each frame here FIRST, then blit to the visible
        //    canvas in one operation. This eliminates any flickering
        //    or 'stuck frame' artifacts caused by clearing + drawing
        //    on the same surface within a single rAF.
        const offscreen    = document.createElement('canvas');
        const offCtx       = offscreen.getContext('2d');
        offscreenRef.current = offscreen;

        /* Both canvases always match the viewport */
        const syncSize = () => {
            canvas.width      = window.innerWidth;
            canvas.height     = window.innerHeight;
            offscreen.width   = window.innerWidth;
            offscreen.height  = window.innerHeight;
        };
        syncSize();

        // Paint frame 0 immediately
        const { dX, dY, dW, dH } = coverParams(canvas, images[0]);
        ctx.drawImage(images[0], dX, dY, dW, dH);

        /* ── Double-buffered, rAF-guarded draw ─────────────────────────────
           1. Compute cover params from global images[] (O(1) lookup).
           2. Render onto the HIDDEN off-screen canvas.
           3. Inside requestAnimationFrame, blit the off-screen canvas
              onto the visible canvas in one drawImage call.
           This guarantees the main thread only touches the visible canvas
           when the display is ready to refresh (60Hz / 120Hz).            */
        const drawFrame = (idx) => {
            const img = images[idx];
            if (!img) return;
            curIdx.current = idx;

            // Render to off-screen buffer
            const p = coverParams(offscreen, img);
            offCtx.clearRect(0, 0, offscreen.width, offscreen.height);
            offCtx.drawImage(img, p.dX, p.dY, p.dW, p.dH);

            // Blit to visible canvas on next display refresh
            cancelAnimationFrame(rafId.current);
            rafId.current = requestAnimationFrame(() => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(offscreen, 0, 0);
            });
        };

        const onResize = () => { syncSize(); drawFrame(curIdx.current); };
        window.addEventListener('resize', onResize);

        /* ── Main pinned timeline ──────────────────────────────────────────── */
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.hero-scroll-container',
                start:   'top top',
                end:     '+=500%',
                scrub:   true,       // locked 1:1 to scroll — Lenis handles momentum
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
            // Kill the specific timeline + its ScrollTrigger (revert removes pin-spacer nodes)
            tl.kill();
            ScrollTrigger.getAll().forEach(t => { t.kill(true); });
        };
    }, [isLoaded]);

    /* ── Render ─────────────────────────────────────────────────────────── */
    return (
        <>
            {/* ── Loading screen — blocks scroll until every onload has fired ── */}
            {!isLoaded && (
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