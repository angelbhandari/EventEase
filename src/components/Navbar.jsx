import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Sparkles, ShoppingBag, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectCartCount } from '../store/cartSlice';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './Navbar.css';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartCount = useSelector(selectCartCount);
  const { user, isAuthenticated, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMobileMenu();
    addToast('You have logged out of the demo account', 'info');
    navigate('/');
  };

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          <div className="logo-icon-wrap">
            <Sparkles className="logo-icon" />
          </div>
          <span className="logo-text font-serif">EventEase</span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="navbar-desktop-nav">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Home
          </NavLink>
          <NavLink to="/events" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Events & Themes
          </NavLink>
          <NavLink to="/budget" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Budget Management
          </NavLink>
          <NavLink to="/reviews" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Reviews
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Dashboard
            </NavLink>
          )}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="navbar-actions">
          {/* Cart Icon with Live Redux Badge */}
          <Link to="/cart" className="cart-badge-link" title={`Cart (${cartCount} items)`}>
            <ShoppingBag className="cart-icon" />
            {cartCount > 0 && <span className="cart-badge-count">{cartCount}</span>}
          </Link>

          {/* Dynamic Authentication Controls */}
          {isAuthenticated ? (
            <div className="navbar-user-group">
              <Link to="/dashboard" className="nav-user-chip" title="Go to Dashboard">
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="nav-user-avatar"
                />
                <span className="nav-user-name">{user?.name?.split(' ')[0]}</span>
              </Link>
              <button
                type="button"
                className="btn-nav-logout"
                onClick={handleLogout}
                title="Log Out"
                aria-label="Log Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="auth-buttons-group">
              <Link to="/login" className="btn-nav-login">
                Login
              </Link>
              <Link to="/signup" className="btn-nav-signup">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="mobile-toggle-btn"
          onClick={toggleMobileMenu}
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer animate-fade-in">
          <NavLink to="/" className="mobile-nav-link" onClick={closeMobileMenu}>
            Home
          </NavLink>
          <NavLink to="/events" className="mobile-nav-link" onClick={closeMobileMenu}>
            Events & Themes
          </NavLink>
          <NavLink to="/budget" className="mobile-nav-link" onClick={closeMobileMenu}>
            Budget Management
          </NavLink>
          <NavLink to="/reviews" className="mobile-nav-link" onClick={closeMobileMenu}>
            Reviews
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/dashboard" className="mobile-nav-link" onClick={closeMobileMenu}>
              Host Dashboard
            </NavLink>
          )}

          <NavLink to="/cart" className="mobile-nav-link cart-mobile-link" onClick={closeMobileMenu}>
            <ShoppingBag size={18} />
            <span>Shopping Cart</span>
            {cartCount > 0 && <span className="mobile-cart-count">{cartCount}</span>}
          </NavLink>

          <div className="mobile-auth-divider"></div>

          {isAuthenticated ? (
            <div className="mobile-user-actions">
              <div className="mobile-user-info">
                <img src={user?.avatar} alt={user?.name} className="mobile-avatar" />
                <div>
                  <h5 className="mobile-user-name">{user?.name}</h5>
                  <span className="mobile-user-email">{user?.email}</span>
                </div>
              </div>
              <div className="mobile-auth-buttons">
                <Link to="/dashboard" className="btn-outline mobile-btn" onClick={closeMobileMenu}>
                  <LayoutDashboard size={16} />
                  <span>Dashboard</span>
                </Link>
                <button
                  type="button"
                  className="btn-secondary mobile-btn"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="mobile-auth-buttons">
              <Link to="/login" className="btn-outline mobile-btn" onClick={closeMobileMenu}>
                Login
              </Link>
              <Link to="/signup" className="btn-primary mobile-btn" onClick={closeMobileMenu}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
