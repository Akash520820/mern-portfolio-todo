import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#goals', label: 'Goals' },
  { href: '#contact', label: 'Contact' },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const goHomeAnchor = (hash) => (e) => {
    setOpen(false);
    if (location.pathname !== '/') {
      e.preventDefault();
      navigate('/' + hash);
    }
  };

  return (
    <header className="site-nav">
      <div className="site-nav__inner">
        <Link to="/" className="site-nav__brand">
          <span className="site-nav__brand-icon">{'<>'}</span>
          Your Name
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
            <a key={link.href} href={link.href} className="site-nav__link" onClick={goHomeAnchor(link.href)}>
              {link.label}
            </a>
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
