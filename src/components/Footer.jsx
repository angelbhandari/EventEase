import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-wrapper">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Col */}
          <div className="footer-col brand-col">
            <Link to="/" className="footer-logo">
              <div className="logo-icon-wrap">
                <Sparkles className="logo-icon" />
              </div>
              <span className="logo-text font-serif">EventEase</span>
            </Link>
            <p className="footer-about">
              EventEase is your premier event planning destination. We design, curate, and execute extraordinary celebrations with bespoke aesthetics and flawless luxury precision.
            </p>
            <div className="footer-socials">
              <a href="#instagram" className="social-icon" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#facebook" className="social-icon" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#twitter" className="social-icon" aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading font-serif">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/events">Events & Themes</Link></li>
              <li><Link to="/budget">Budget Management</Link></li>
              <li><Link to="/reviews">Customer Reviews</Link></li>
              <li><Link to="/cart">Cart Summary</Link></li>
            </ul>
          </div>

          {/* Event Categories */}
          <div className="footer-col">
            <h4 className="footer-heading font-serif">Event Categories</h4>
            <ul className="footer-links">
              <li><Link to="/events?category=birthday">Birthday Celebrations 🎂</Link></li>
              <li><Link to="/events?category=wedding">Luxury Weddings 💍</Link></li>
              <li><Link to="/events?category=prom-night">Prom Night Galas ✨</Link></li>
              <li><Link to="/events?category=festivals">Festive Gatherings 🎉</Link></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="footer-col">
            <h4 className="footer-heading font-serif">Contact Us</h4>
            <ul className="footer-contact-list">
              <li>
                <MapPin size={18} className="contact-icon" />
                <span>100 Concierge Boulevard, Suite 400, NY</span>
              </li>
              <li>
                <Phone size={18} className="contact-icon" />
                <span>+1 (800) 555-EASE</span>
              </li>
              <li>
                <Mail size={18} className="contact-icon" />
                <span>concierge@eventease.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} EventEase Inc. All rights reserved. Crafting Extraordinary Celebrations.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
