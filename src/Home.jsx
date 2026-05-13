import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Coffee, Leaf, ShieldCheck } from 'lucide-react';
import Hero from './Hero';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {

    useEffect(() => {
        // Simple GSAP fade up for sections
        const sections = gsap.utils.toArray('.fade-up');
        sections.forEach((section) => {
            gsap.fromTo(section,
                { opacity: 0, y: 40 },
                {
                    opacity: 1, y: 0, duration: 1, ease: 'power3.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 85%',
                    }
                }
            );
        });
        return () => ScrollTrigger.getAll().forEach(t => t.kill());
    }, []);

    return (
        <div className="home-page">
            <Hero />
            
            {/* Features Section */}
            <section className="features-section fade-up">
                <div className="container">
                    <span className="section-eyebrow">Our Craft</span>
                    <h2 className="section-title">The Artisan Difference</h2>
                    <div className="section-rule" />
                    <div className="features-grid">
                        <div className="feature-item">
                            <Leaf size={32} className="feature-icon" />
                            <h3>Ethically Sourced</h3>
                            <p>Direct from independent farmers, ensuring fair wages and sustainable practices.</p>
                        </div>
                        <div className="feature-item">
                            <Coffee size={32} className="feature-icon" />
                            <h3>Small Batch Roasted</h3>
                            <p>Roasted locally in small batches to guarantee absolute freshness in every cup.</p>
                        </div>
                        <div className="feature-item">
                            <ShieldCheck size={32} className="feature-icon" />
                            <h3>Quality Assured</h3>
                            <p>Every bean is meticulously graded to meet our uncompromising standards.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="why-choose-us fade-up">
                <div className="container">
                    <span className="section-eyebrow">The Experience</span>
                    <h2 className="section-title">Why Choose Us</h2>
                    <div className="section-rule" />
                    
                    <div className="glass-grid">
                        <div className="glass-card">
                            <div className="glass-icon-wrap">
                                <span className="glass-number">01</span>
                            </div>
                            <h3>Master Baristas</h3>
                            <p>Our team trains for months to perfect the art of the pour, mastering both technique and taste.</p>
                        </div>
                        <div className="glass-card">
                            <div className="glass-icon-wrap">
                                <span className="glass-number">02</span>
                            </div>
                            <h3>Cozy Ambiance</h3>
                            <p>Designed for comfort and creativity, our space is your second home for work or relaxation.</p>
                        </div>
                        <div className="glass-card">
                            <div className="glass-icon-wrap">
                                <span className="glass-number">03</span>
                            </div>
                            <h3>Signature Blends</h3>
                            <p>We craft exclusive seasonal blends that you won't find anywhere else.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Visit Us Section (Split Layout) */}
            <section className="visit-us fade-up">
                <div className="split-layout">
                    <div className="split-content">
                        <span className="section-eyebrow">Location</span>
                        <h2 className="section-title">Visit Us</h2>
                        <div className="section-rule" />
                        <p className="visit-desc">
                            Step into our sanctuary of aroma and taste. 
                            We are located in the heart of the artisan district.
                        </p>
                        
                        <div className="contact-info">
                            <div className="info-item">
                                <MapPin size={20} className="info-icon" />
                                <div>
                                    <strong>Artisan Coffee Works</strong>
                                    <p>124 Espresso Lane<br />Creative Quarter, CQ 90210</p>
                                </div>
                            </div>
                        </div>

                        <div className="hours">
                            <h3>Opening Hours</h3>
                            <ul>
                                <li><span>Mon - Fri:</span> <span>7:00 AM - 6:00 PM</span></li>
                                <li><span>Saturday:</span> <span>8:00 AM - 5:00 PM</span></li>
                                <li><span>Sunday:</span> <span>Closed</span></li>
                            </ul>
                        </div>
                    </div>
                    <div className="split-image">
                        {/* Placeholder interior photography */}
                        <div className="image-placeholder">
                            <div className="image-overlay" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
