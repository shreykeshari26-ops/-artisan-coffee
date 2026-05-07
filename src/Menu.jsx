import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

import coffee1 from './assets/coffee-1.jpeg';
import coffee2 from './assets/coffee-2.jpeg';
import coffee3 from './assets/coffee-3.jpeg';
import coffee4 from './assets/coffee-4.jpeg';
import coffee5 from './assets/coffee-5.jpeg';

const products = [
    { id: 1, name: 'Belgium Chocolate Latte', price: '₹ 414.75', desc: 'Decadent Belgian chocolate meets our signature double-shot espresso for a cup that feels indulgent without compromise.', img: coffee1, tag: 'Fan Favourite' },
    { id: 2, name: 'Cappuccino',              price: '₹ 385.00', desc: 'A time-honoured balance of velvety steamed milk and bold espresso, finished with a perfect microfoam crown.',             img: coffee2, tag: 'Classic' },
    { id: 3, name: 'Caffè Americano',         price: '₹ 295.00', desc: 'Full-bodied espresso extended with hot water — clean, bold, and endlessly satisfying at any hour of the day.',            img: coffee3, tag: 'Everyday' },
    { id: 4, name: 'Iced Caffè Mocha',        price: '₹ 445.50', desc: 'Bittersweet mocha sauce, rich espresso, and cold milk over ice — a dessert in a glass that never overdoes it.',           img: coffee4, tag: 'Summer Pick' },
    { id: 5, name: 'Iced Hazelnut Latte',     price: '₹ 462.00', desc: 'Our creamy iced latte laced with a touch of sweet hazelnut — smooth, aromatic, and impossible to put down.',              img: coffee5, tag: 'Signature' },
];

const Menu = () => {
    const cardsRef = useRef([]);
    const navigate = useNavigate();
    const [quantities, setQuantities] = useState(() =>
        Object.fromEntries(products.map((item) => [item.id, 1]))
    );

    const updateQuantity = (id, delta) => {
        setQuantities((current) => ({
            ...current,
            [id]: Math.max(1, (current[id] ?? 1) + delta),
        }));
    };

    const parsePrice = (price) => Number(price.replace(/[^\d.]/g, '')) || 0;

    useEffect(() => {
        cardsRef.current.forEach((card, i) => {
            if (!card) return;
            gsap.fromTo(card,
                { opacity: 0, y: 60 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.9,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 88%',
                        toggleActions: 'play none none none',
                    },
                    delay: i * 0.08,
                }
            );
        });

        return () => ScrollTrigger.getAll().forEach(t => t.kill());
    }, []);

    return (
        <section className="menu-section">
            {/* ── Section header ── */}
            <div className="menu-header">
                <span className="menu-eyebrow">The Menu</span>
                <h2 className="menu-title">Our Selection</h2>
                <p className="menu-subtitle">
                    Every cup is crafted to order. No exceptions, no shortcuts.
                </p>
                <div className="menu-header-rule" />
            </div>

            {/* ── Single-column card list ── */}
            <ul className="menu-list">
                {products.map((item, i) => (
                    <li
                        key={item.id}
                        className="menu-card"
                        ref={el => (cardsRef.current[i] = el)}
                    >
                        {/* Circular image */}
                        <div className="menu-card-img-wrap">
                            <img src={item.img} alt={item.name} className="menu-card-img" />
                            <div className="menu-card-img-ring" />
                        </div>

                        {/* Body */}
                        <div className="menu-card-body">
                            <div className="menu-card-meta">
                                <span className="menu-card-tag">{item.tag}</span>
                            </div>
                            <h3 className="menu-card-name">{item.name}</h3>
                            <p className="menu-card-desc">{item.desc}</p>
                        </div>

                        <div className="menu-card-right">
                            <span className="menu-card-price">{item.price}</span>
                            <div className="menu-card-quantity" aria-label={`${item.name} quantity selector`}>
                                <button
                                    type="button"
                                    className="menu-qty-btn"
                                    onClick={() => updateQuantity(item.id, -1)}
                                    aria-label={`Decrease ${item.name} quantity`}
                                >
                                    −
                                </button>
                                <span className="menu-qty-value">{quantities[item.id] ?? 1}</span>
                                <button
                                    type="button"
                                    className="menu-qty-btn"
                                    onClick={() => updateQuantity(item.id, 1)}
                                    aria-label={`Increase ${item.name} quantity`}
                                >
                                    +
                                </button>
                            </div>
                            <button
                                className="menu-card-btn"
                                onClick={() => {
                                    // Kill GSAP ScrollTrigger pins BEFORE React Router
                                    // swaps the component tree — prevents removeChild crash
                                    ScrollTrigger.getAll().forEach(t => t.kill(true));
                                    const quantity = quantities[item.id] ?? 1;
                                    const unitPrice = parsePrice(item.price);
                                    const totalPrice = Number((unitPrice * quantity).toFixed(2));
                                    navigate('/order', {
                                        state: {
                                            coffee_item: {
                                                ...item,
                                                unit_price: unitPrice,
                                            },
                                            quantity,
                                            total_price: totalPrice,
                                            price: item.price,
                                            img: item.img,
                                        },
                                    });
                                }}
                            >
                                Order Now
                                <span className="menu-card-btn-arrow">→</span>
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default Menu;