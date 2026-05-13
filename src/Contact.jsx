import { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { Input } from './components/ui/Input';
import { Textarea } from './components/ui/Textarea';
import { Button } from './components/ui/Button';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email address is invalid';
        }
        if (!formData.message.trim()) newErrors.message = 'Message is required';
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formErrors = validate();
        if (Object.keys(formErrors).length === 0) {
            setErrors({});
            
            // Construct WhatsApp URL
            const phoneNumber = "917042249976";
            const whatsappMessage = `Hello Artisan Coffee Works! My name is ${formData.name} (${formData.email}). I have a question: ${formData.message}`;
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
            
            // Open WhatsApp in a new tab
            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
            
            // Show success state
            setIsSubmitted(true);
            setFormData({ name: '', email: '', message: '' });
        } else {
            setErrors(formErrors);
        }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        if (errors[id]) {
            setErrors(prev => ({ ...prev, [id]: undefined }));
        }
    };

    return (
        <div className="contact-page fade-up" style={{ padding: '8rem 0' }}>
            <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem' }}>
                <div className="contact-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <span className="section-eyebrow" style={{ color: '#D4AF37', letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.85rem' }}>Get in Touch</span>
                    <h1 className="section-title" style={{ color: '#F5E6D3', fontFamily: "'Playfair Display', serif", fontSize: '3rem', margin: '1rem 0' }}>Contact Us</h1>
                    <div className="section-rule" style={{ width: '40px', height: '1px', background: '#D4AF37', margin: '0 auto 2rem' }} />
                    <p className="contact-desc" style={{ color: 'rgba(245, 230, 211, 0.8)', fontSize: '1.1rem', lineHeight: 1.6 }}>
                        Have a question about our beans, want to book an event, or just want to say hi? Drop us a line below.
                    </p>
                </div>

                <div className="contact-content glass-card" style={{ padding: '3rem', borderRadius: '1rem', background: 'rgba(212, 175, 55, 0.03)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
                    {isSubmitted ? (
                        <div className="success-state" style={{ textAlign: 'center', padding: '2rem 0' }}>
                            <CheckCircle2 size={48} color="#D4AF37" style={{ margin: '0 auto 1rem' }} />
                            <h3 style={{ color: '#F5E6D3', fontFamily: "'Playfair Display', serif", fontSize: '2rem', marginBottom: '1rem' }}>Message Sent!</h3>
                            <p style={{ color: 'rgba(245, 230, 211, 0.8)', fontSize: '1.1rem', marginBottom: '2rem' }}>Our head roaster will contact you soon.</p>
                            <Button variant="rounded-full" onClick={() => setIsSubmitted(false)}>
                                Send Another Message
                            </Button>
                        </div>
                    ) : (
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label htmlFor="name" style={{ display: 'block', color: '#F5E6D3', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Full Name</label>
                                <Input 
                                    type="text" 
                                    id="name" 
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe" 
                                    style={{ width: '100%', padding: '0.8rem 1rem', background: 'rgba(0,0,0,0.2)', border: errors.name ? '1px solid red' : '1px solid rgba(212, 175, 55, 0.2)', color: '#F5E6D3', borderRadius: '0.5rem' }}
                                />
                                {errors.name && <span style={{ color: '#ff6b6b', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.name}</span>}
                            </div>
                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label htmlFor="email" style={{ display: 'block', color: '#F5E6D3', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email Address</label>
                                <Input 
                                    type="email" 
                                    id="email" 
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="john@example.com" 
                                    style={{ width: '100%', padding: '0.8rem 1rem', background: 'rgba(0,0,0,0.2)', border: errors.email ? '1px solid red' : '1px solid rgba(212, 175, 55, 0.2)', color: '#F5E6D3', borderRadius: '0.5rem' }}
                                />
                                {errors.email && <span style={{ color: '#ff6b6b', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.email}</span>}
                            </div>
                            <div className="form-group" style={{ marginBottom: '2rem' }}>
                                <label htmlFor="message" style={{ display: 'block', color: '#F5E6D3', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Message</label>
                                <Textarea 
                                    id="message" 
                                    rows="5" 
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="How can we help you?" 
                                    style={{ width: '100%', padding: '0.8rem 1rem', background: 'rgba(0,0,0,0.2)', border: errors.message ? '1px solid red' : '1px solid rgba(212, 175, 55, 0.2)', color: '#F5E6D3', borderRadius: '0.5rem', resize: 'vertical' }}
                                ></Textarea>
                                {errors.message && <span style={{ color: '#ff6b6b', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.message}</span>}
                            </div>
                            <Button type="submit" variant="rounded-full" style={{ width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: '1px solid #D4AF37', color: '#D4AF37', cursor: 'pointer', transition: 'all 0.3s ease' }}>
                                Send Message <Send size={16} />
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Contact;
