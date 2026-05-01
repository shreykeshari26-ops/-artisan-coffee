import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';

/* ── Generate a short order ID ──────────────────────────────────────────── */
const genOrderId = () =>
    'ACW-' + Date.now().toString(36).toUpperCase().slice(-5) +
    Math.random().toString(36).toUpperCase().slice(2, 5);

const Order = () => {
    const { state } = useLocation();
    const navigate  = useNavigate();

    const [name,    setName]    = useState('');
    const [mobile,  setMobile]  = useState('');
    const [done,    setDone]    = useState(false);
    const [orderId, setOrderId] = useState('');

    /* Scroll to top when page mounts */
    useEffect(() => { window.scrollTo(0, 0); }, []);

    /* If someone lands on /order without state, redirect home */
    if (!state?.name) {
        return (
            <div className="order-page">
                <div className="order-empty">
                    <p className="order-empty-text">No item selected.</p>
                    <button className="order-back-btn" onClick={() => navigate('/')}>
                        ← Back to Menu
                    </button>
                </div>
            </div>
        );
    }

    const { name: coffeeName, price, img } = state;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim() || !mobile.trim()) return;
        setOrderId(genOrderId());
        setDone(true);
    };

    const handleReset = () => {
        setName('');
        setMobile('');
        setDone(false);
        setOrderId('');
    };

    /* ── Success state ──────────────────────────────────────────────────── */
    if (done) {
        return (
            <div className="order-page">
                <div className="order-success-card">
                    <div className="order-success-icon">✓</div>
                    <h2 className="order-success-title">Order Confirmed</h2>
                    <p className="order-success-id">
                        Order ID: <span>{orderId}</span>
                    </p>

                    <div className="order-success-summary">
                        <span className="order-success-coffee">{coffeeName}</span>
                        <span className="order-success-price">{price}</span>
                    </div>

                    <div className="order-success-divider" />

                    <p className="order-success-body">
                        Thank you, <strong>{name}</strong>. Your artisan coffee is being prepared.
                        We'll notify you at <strong>{mobile}</strong> when it's ready.
                    </p>

                    <div className="order-success-actions">
                        <button className="order-primary-btn" onClick={() => navigate('/')}>
                            Back to Menu
                        </button>
                        <button className="order-ghost-btn" onClick={handleReset}>
                            Place Another Order
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    /* ── Main order form ────────────────────────────────────────────────── */
    return (
        <div className="order-page">
            {/* Back link */}
            <button className="order-back-link" onClick={() => navigate('/')}>
                ← Back to Menu
            </button>

            <div className="order-container">
                {/* ── Left: Coffee summary card ── */}
                <div className="order-item-card">
                    <div className="order-item-img-wrap">
                        {img && <img src={img} alt={coffeeName} className="order-item-img" />}
                    </div>
                    <div className="order-item-details">
                        <span className="order-item-eyebrow">Your Selection</span>
                        <h2 className="order-item-name">{coffeeName}</h2>
                        <span className="order-item-price">{price}</span>
                    </div>
                    <div className="order-item-divider" />

                    {/* QR Code placeholder */}
                    <div className="order-qr-section">
                        <span className="order-qr-label">Scan to Pay</span>
                        <div className="order-qr-canvas">
                            <QRCodeCanvas
                                value={`upi://pay?pa=artisancoffee@upi&pn=Artisan Coffee&am=${price.replace(/[^\d.]/g, '')}&tn=Order-${coffeeName}`}
                                size={160}
                                bgColor="#000000"
                                fgColor="#D4AF37"
                                level="M"
                                includeMargin={false}
                            />
                        </div>
                        <span className="order-qr-hint">Or pay at the counter</span>
                    </div>
                </div>

                {/* ── Right: Order form ── */}
                <form className="order-form" onSubmit={handleSubmit}>
                    <h2 className="order-form-title">Complete Your Order</h2>
                    <p className="order-form-subtitle">
                        Fill in your details below and we'll have your order ready in minutes.
                    </p>

                    <div className="order-field">
                        <label htmlFor="order-name" className="order-label">Full Name</label>
                        <input
                            id="order-name"
                            type="text"
                            className="order-input"
                            placeholder="e.g. Shreyansh Keshari"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="order-field">
                        <label htmlFor="order-mobile" className="order-label">Mobile Number</label>
                        <input
                            id="order-mobile"
                            type="tel"
                            className="order-input"
                            placeholder="+91 98765 43210"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="order-submit-btn">
                        Complete Order
                        <span className="order-submit-arrow">→</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Order;
