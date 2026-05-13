import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();

    return (
        <nav className="site-navbar">
            <div className="navbar-inner">
                <Link to="/" className="navbar-brand">
                    Artisan Coffee Works
                </Link>
                <div className="navbar-links">
                    <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
                    <Link to="/menu" className={`nav-link ${location.pathname === '/menu' ? 'active' : ''}`}>Menu</Link>
                    <Link to="/story" className={`nav-link ${location.pathname === '/story' ? 'active' : ''}`}>Bean Story</Link>
                    <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>Contact</Link>
                    <Link to="/order" className="nav-btn">Order Now</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
