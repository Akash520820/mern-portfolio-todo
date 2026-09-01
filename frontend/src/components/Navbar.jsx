import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'goals', label: 'Goals' },
  { id: 'contact', label: 'Contact' },
];

const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // We use plain section IDs (not "#id" hrefs) and scroll manually via JS.
  // With HashRouter, the URL's # is reserved for routing (e.g. #/login) —
  // letting the browser's native "#about" anchor jump fire would collide
  // with that and misfire the router instead of scrolling the page.
  const goToSection = (id) => (e) => {
    e.preventDefault();
    setOpen(false);
    if (location.pathname !== '/') {
      // Navigate home first, then scroll once Home has mounted (see Home.jsx).
      navigate('/', { state: { scrollTo: id } });
    } else {
      scrollToId(id);
    }
  };

  return (
    <header className="site-nav">
      <div className="site-nav__inner">
        <Link to="/" className="site-nav__brand">
          <span className="site-nav__brand-icon"></span>
          Akash Chakraborty
        </Link>

        <button
          className="site-nav__toggle"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`site-nav__links ${open ? 'is-open' : ''}`}>
          {NAV_LINKS.map((link) => (
            <button key={link.id} type="button" className="site-nav__link" onClick={goToSection(link.id)}>
              {link.label}
            </button>
          ))}
          {user ? (
            <>
              {user.role === 'admin' && (
                <>
                  <Link to="/todos" className="site-nav__link site-nav__link--outline" onClick={() => setOpen(false)}>
                    Todo App
                  </Link>
                  <Link to="/admin" className="site-nav__link site-nav__link--outline" onClick={() => setOpen(false)}>
                    Admin
                  </Link>
                </>
              )}
              <span className="site-nav__user">{user.name}</span>
              <button className="site-nav__link site-nav__logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="site-nav__link" onClick={() => setOpen(false)}>
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
