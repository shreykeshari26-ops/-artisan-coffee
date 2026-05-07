import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const storyBlocks = [
  '9th Century Discovery — Legend says goats in Ethiopia first discovered the energy of coffee cherries.',
  'Masterfully Roasted — We coax out hidden flavors through fire, time, and precision.',
  'The Perfect Grind — Every particle is sized to ensure the ultimate aromatic extraction.',
];

const BeanStory = () => {
  const sectionRef = useRef(null);
  const blockRefs = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const ctx = gsap.context(() => {
      const blocks = blockRefs.current.filter(Boolean);
      gsap.set(blocks, { autoAlpha: 0, y: 30, filter: 'blur(14px)' });

      // 1. Slide-up effect
      gsap.fromTo(section,
        { y: 100, opacity: 0 },
        {
          y: 0, opacity: 1,
          scrollTrigger: {
            trigger: '.bean-story-container',
            start: 'top bottom',
            end: 'top top',
            scrub: true,
          }
        }
      );

      // 2. Pin and text effects
      const pinTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: '.bean-story-container',
          start: 'top top',
          end: '+=3000',
          scrub: 1,
          pin: true,
          pinSpacing: true,
        },
      });

      blocks.forEach((block, index) => {
        // Simple sequential timeline within the pinned space
        pinTimeline
          .fromTo(block, 
            { autoAlpha: 0, y: 30 }, 
            { autoAlpha: 1, y: 0, duration: 1 }
          )
          .to(block, 
            { autoAlpha: 0, y: -30, duration: 1 }, 
            "+=1" // Hold for a distance
          );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="bean-story bean-story-container" ref={sectionRef}>
      <div className="bean-story-stage">
        <video
          className="bean-story-video"
          src="/assets/video/beans-bg.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        <div className="bean-story-overlay" />

        <div className="bean-story-text-wrapper">
          {storyBlocks.map((copy, index) => (
            <h2
              key={copy}
              className="bean-story-block"
              ref={(el) => {
                blockRefs.current[index] = el;
              }}
            >
              {copy}
            </h2>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeanStory;