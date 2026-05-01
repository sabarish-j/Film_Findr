import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clapperboard, Menu, X, LogOut, Home, Search, Bookmark, User } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useScrollLock } from '../hooks/useScrollLock';
import './Navbar.css';

const navLinks = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Search', path: '/search', icon: Search },
  { label: 'Watchlist', path: '/watchlist', icon: Bookmark },
  { label: 'Profile', path: '/profile', icon: User },
];

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useScrollLock(mobileMenuOpen);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const userInitials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || '?';

  return (
    <>
      <motion.nav
        className="navbar"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="navbar__container">
          {/* Logo */}
          <Link to="/" className="navbar__logo">
            <Clapperboard size={28} className="navbar__logo-icon" />
            <span className="navbar__logo-text">FlimFindr</span>
          </Link>

          {/* Desktop Navigation */}
          {user ? (
            <div className="navbar__desktop">
              <div className="navbar__links">
                {navLinks.map(({ label, path, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`navbar__link ${isActive(path) ? 'navbar__link--active' : ''}`}
                  >
                    {label}
                  </Link>
                ))}
              </div>

              <div className="navbar__user">
                <div className="navbar__avatar">{userInitials}</div>
                <span className="navbar__username">{user.name}</span>
              </div>

              <button className="navbar__logout" onClick={handleLogout} aria-label="Logout">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="navbar__desktop">
              <Link to="/login" className="navbar__link">
                Login
              </Link>
              <Link to="/signup" className="navbar__link navbar__link--primary">
                Sign up
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="navbar__menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      {user && mobileMenuOpen && (
        <motion.div
          className="navbar__mobile-menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <motion.div
            className="navbar__mobile-content"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="navbar__mobile-header">
              <div className="navbar__mobile-avatar">{userInitials}</div>
              <span className="navbar__mobile-username">{user.name}</span>
            </div>

            <div className="navbar__mobile-links">
              {navLinks.map(({ label, path, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`navbar__mobile-link ${isActive(path) ? 'navbar__mobile-link--active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon size={20} />
                  {label}
                </Link>
              ))}
            </div>

            <button
              className="navbar__mobile-logout"
              onClick={handleLogout}
              aria-label="Logout"
            >
              <LogOut size={20} />
              Logout
            </button>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};
