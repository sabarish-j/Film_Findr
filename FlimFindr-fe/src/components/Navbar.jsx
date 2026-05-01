import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clapperboard,
  Menu,
  X,
  LogOut,
  Home,
  Bookmark,
  User,
  Settings,
  Search as SearchIcon,
  ChevronDown,
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { MovieContext } from '../context/MovieContext';
import { useScrollLock } from '../hooks/useScrollLock';
import { resolveAvatarUrl } from '../constants';
import './Navbar.css';

const navLinks = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Watchlist', path: '/watchlist', icon: Bookmark },
];

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { searchQuery, setSearchQuery } = useContext(MovieContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useScrollLock(mobileMenuOpen);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    if (!profileOpen) return;
    const onDocClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [profileOpen]);

  // Close on route change
  useEffect(() => {
    setProfileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  // Typing in the navbar search jumps to home so results render there
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim() && location.pathname !== '/') {
      navigate('/');
    }
  };

  const handleClearSearch = () => setSearchQuery('');

  const userInitials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || '?';

  const avatarUrl = resolveAvatarUrl(user?.avatar);

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

          {/* Search input — only when logged in */}
          {user && (
            <div className="navbar__search">
              <SearchIcon size={18} className="navbar__search-icon" />
              <input
                type="text"
                className="navbar__search-input"
                placeholder="Search for movies..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {searchQuery && (
                <button
                  className="navbar__search-clear"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                  type="button"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          )}

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

              {/* Profile dropdown */}
              <div className="navbar__profile" ref={profileRef}>
                <button
                  className="navbar__profile-trigger"
                  onClick={() => setProfileOpen((open) => !open)}
                  aria-haspopup="true"
                  aria-expanded={profileOpen}
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={user.name}
                      className="navbar__avatar navbar__avatar--img"
                    />
                  ) : (
                    <div className="navbar__avatar">{userInitials}</div>
                  )}
                  <span className="navbar__username">{user.name}</span>
                  <ChevronDown
                    size={16}
                    className={`navbar__profile-chevron ${
                      profileOpen ? 'navbar__profile-chevron--open' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      className="navbar__dropdown"
                      initial={{ opacity: 0, y: -8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Link
                        to="/profile"
                        className="navbar__dropdown-item"
                        onClick={() => setProfileOpen(false)}
                      >
                        <User size={18} />
                        <span>Profile</span>
                      </Link>
                      <Link
                        to="/settings"
                        className="navbar__dropdown-item"
                        onClick={() => setProfileOpen(false)}
                      >
                        <Settings size={18} />
                        <span>Settings</span>
                      </Link>
                      <div className="navbar__dropdown-divider" />
                      <button
                        className="navbar__dropdown-item navbar__dropdown-item--danger"
                        onClick={handleLogout}
                      >
                        <LogOut size={18} />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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
