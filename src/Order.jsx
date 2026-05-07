import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

const parsePrice = (value) => Number(String(value ?? '').replace(/[^\d.]/g, '')) || 0;
const formatRupees = (value) => `₹ ${Number(value || 0).toFixed(2)}`;

const Order = () => {
    const { state } = useLocation();
    const navigate  = useNavigate();

    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [done, setDone] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    /* Scroll to top when page mounts */
    useEffect(() => { window.scrollTo(0, 0); }, []);

    const selectedItem = state?.coffee_item
        ? state.coffee_item
        : state?.name
            ? { name: state.name, price: state.price, img: state.img }
            : null;
    const quantity = Number(state?.quantity ?? 1);
    const totalPrice = Number(state?.total_price ?? parsePrice(state?.price));

    /* If someone lands on /order without state, redirect home */
    if (!selectedItem?.name) {
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

    const coffeeName = selectedItem.name;
    const img = selectedItem.img;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !mobile.trim()) return;

        if (!supabase) {
            setSubmitError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
            return;
        }

        setSubmitError('');
        setIsSubmitting(true);

        const orderPayload = {
            coffee_item: coffeeName,
            quantity,
            total_price: totalPrice,
            customer_name: name.trim(),
            mobile_number: mobile.trim(),
        };

        const { data, error } = await supabase
            .from('orders')
            .insert([orderPayload])
            .select()
            .single();

        setIsSubmitting(false);

        if (error) {
            setSubmitError(error.message);
            return;
        }

        const serialNo = data?.id ?? data?.order_id ?? data?.serial_no ?? '';
        setOrderId(String(serialNo));
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
                    <h2 className="order-success-title">Order #{orderId} Confirmed</h2>

                    <div className="order-success-summary">
                        <span className="order-success-coffee">{coffeeName}</span>
                        <span className="order-success-price">{formatRupees(totalPrice)}</span>
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
                        <span className="order-item-price">{formatRupees(totalPrice)}</span>
                        <span className="order-item-quantity">Qty: {quantity}</span>
                    </div>
                    <div className="order-item-divider" />

                    {/* QR Code placeholder */}
                    <div className="order-qr-section">
                        <span className="order-qr-label">Scan to Pay</span>
                        <div className="order-qr-canvas">
                            <QRCodeCanvas
                                value={`upi://pay?pa=artisancoffee@upi&pn=Artisan Coffee&am=${totalPrice.toFixed(2)}&tn=Order-${coffeeName}`}
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

                    <button type="submit" className="order-submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Complete Order'}
                        <span className="order-submit-arrow">→</span>
                    </button>
                    {submitError && <p className="order-form-error">{submitError}</p>}
                </form>
            </div>
        </div>
    );
};

export default Order;
