import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Player } from '@remotion/player';
import { FloatingFactsComp } from './FloatingFacts';

gsap.registerPlugin(ScrollTrigger);

const historyMilestones = [
    {
        year: '850 AD',
        title: 'The Ethiopian Discovery',
        desc: 'Legend tells of a goat herder named Kaldi who discovered the energizing effects of coffee cherries on the Ethiopian plateau.'
    },
    {
        year: '15th Century',
        title: 'Middle Eastern Trade',
        desc: 'Coffee cultivation and trade began on the Arabian Peninsula, becoming a staple in public coffee houses known as qahveh khaneh.'
    },
    {
        year: '17th Century',
        title: 'Arrival in Europe',
        desc: 'Coffee made its way to Europe, where it quickly became popular across the continent, replacing the common breakfast drink of the time.'
    },
    {
        year: 'Modern Era',
        title: 'Artisan Roasting',
        desc: 'Today, we honor the ancient traditions by meticulously sourcing single-origin beans and roasting them to exact precision to unlock their deepest flavor profiles.'
    }
];

const BeanStory = () => {
  const sectionRef = useRef(null);
  const timelineRefs = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const ctx = gsap.context(() => {
      // 1. Slide-up effect for the whole stage
      gsap.fromTo('.bean-story-stage',
        { y: 100, opacity: 0 },
        {
          y: 0, opacity: 1,
          scrollTrigger: {
            trigger: '.bean-story-stage',
            start: 'top bottom',
            end: 'top center',
            scrub: true,
          }
        }
      );

      // 2. Timeline reveal on scroll
      const items = timelineRefs.current.filter(Boolean);
      items.forEach((item) => {
          gsap.fromTo(item, 
              { opacity: 0, y: 50, filter: 'blur(10px)' },
              {
                  opacity: 1, y: 0, filter: 'blur(0px)',
                  duration: 1,
                  ease: 'power2.out',
                  scrollTrigger: {
                      trigger: item,
                      start: 'top 85%',
                      toggleActions: 'play none none reverse'
                  }
              }
          );
      });

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="bean-story" ref={sectionRef}>
      <div className="bean-story-stage" style={{ position: 'relative', height: '100vh', width: '100vw', overflow: 'hidden' }}>
        <video
          className="bean-story-video"
          src="/assets/video/beans-bg.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div className="bean-story-overlay" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)' }} />

        {/* Remotion Player as an overlay */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10 }}>
            <Player
              component={FloatingFactsComp}
              durationInFrames={900}
              compositionWidth={1920}
              compositionHeight={1080}
              fps={30}
              style={{ width: '100%', height: '100%' }}
              autoPlay
              loop
            />
        </div>
      </div>

      {/* History Timeline */}
      <div className="history-timeline" style={{ background: '#1B1411', padding: '8rem 2rem' }}>
          <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div className="contact-header" style={{ textAlign: 'center', marginBottom: '5rem' }}>
                  <span className="section-eyebrow" style={{ color: '#D4AF37', letterSpacing: '0.2em', textTransform: 'uppercase', display: 'block', fontSize: '0.85rem' }}>Our Journey</span>
                  <h2 className="section-title" style={{ color: '#F5E6D3', fontFamily: "'Playfair Display', serif", fontSize: '3rem', margin: '1rem 0' }}>History of Artisan Roasting</h2>
                  <div className="section-rule" style={{ width: '40px', height: '1px', background: '#D4AF37', margin: '0 auto' }} />
              </div>

              <div className="timeline-items">
                  {historyMilestones.map((item, index) => (
                      <div 
                          key={index} 
                          className="timeline-item" 
                          ref={el => timelineRefs.current[index] = el}
                          style={{ 
                              display: 'flex', 
                              gap: '2rem', 
                              marginBottom: '4rem',
                              position: 'relative'
                          }}
                      >
                          <div className="timeline-year" style={{ color: '#D4AF37', fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', flex: '0 0 160px', textAlign: 'right', fontWeight: 'bold' }}>
                              {item.year}
                          </div>
                          <div className="timeline-content" style={{ flex: 1, paddingLeft: '2rem', borderLeft: '1px solid rgba(212, 175, 55, 0.3)' }}>
                              <h3 style={{ color: '#F5E6D3', fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', marginTop: 0, marginBottom: '1rem' }}>{item.title}</h3>
                              <p style={{ color: 'rgba(245, 230, 211, 0.8)', fontSize: '1.1rem', lineHeight: 1.8, margin: 0 }}>{item.desc}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>
    </section>
  );
};

export default BeanStory;