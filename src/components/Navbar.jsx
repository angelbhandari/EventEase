import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Sparkles, ShoppingBag, Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        {/* Logo */}
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
            Events
          </NavLink>
          <NavLink to="/budget" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Budget Management
          </NavLink>
          <NavLink to="/reviews" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Reviews
          </NavLink>
        </nav>

        {/* Desktop Action Buttons */}
        <div className="navbar-actions">
          <Link to="/cart" className="cart-badge-link" title="Cart (Static UI)">
            <ShoppingBag className="cart-icon" />
            <span className="cart-badge-count">2</span>
          </Link>
          
          <div className="auth-buttons-group">
            <Link to="/login" className="btn-nav-login">
              Login
            </Link>
            <Link to="/signup" className="btn-nav-signup">
              Sign Up
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button className="mobile-toggle-btn" onClick={toggleMobileMenu} aria-label="Toggle Navigation">
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
          <NavLink to="/cart" className="mobile-nav-link cart-mobile-link" onClick={closeMobileMenu}>
            <ShoppingBag size={18} />
            <span>Add to Cart</span>
            <span className="mobile-cart-count">2</span>
          </NavLink>
          <div className="mobile-auth-divider"></div>
          <div className="mobile-auth-buttons">
            <Link to="/login" className="btn-outline mobile-btn" onClick={closeMobileMenu}>
              Login
            </Link>
            <Link to="/signup" className="btn-primary mobile-btn" onClick={closeMobileMenu}>
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
