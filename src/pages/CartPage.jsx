

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';

import { staticCartItems } from '../data/eventsData';
import CartItemCard from '../components/CartItemCard';

import './CartPage.css';

const CartPage = () => {
  const subtotal = staticCartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const serviceTax = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + serviceTax;

  const handleStaticAction = (action) => {
  alert(`${action} feature is currently unavailable.`);
};
  return (
    <div className="cart-page page-section">
      <div className="container">

        {/* Header */}
        <div className="cart-header text-center">
          <span className="badge-gold">Selected Packages</span>

          <h1 className="section-title font-serif">
            Add to Cart & Order Summary
          </h1>

          <p className="section-subtitle">
            Review your chosen event themes before reserving your event dates.
          </p>
        </div>

        {/* Cart Content */}
        <div className="cart-content-grid">

          {/* Cart Items */}
          <div className="cart-items-col">
            <div className="cart-table-card">

              <div className="cart-table-header">
                <h3 className="cart-table-title font-serif">
                  Theme Items ({staticCartItems.length})
                </h3>

                <span className="cart-table-sub">
                  Static Reservation List
                </span>
              </div>

              <div className="cart-items-list">

                {staticCartItems.map((item) => (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    onAction={handleStaticAction}
                  />
                ))}

              </div>

              <div className="cart-table-footer">
                <Link to="/events" className="btn-secondary">
                  <span>Continue Browsing Themes</span>
                </Link>
              </div>

            </div>
          </div>

          {/* Order Summary */}
          <div className="cart-summary-col">
            <div className="summary-card">

              <h3 className="summary-title font-serif">
                Order Summary
              </h3>

              <div className="summary-row">
                <span>
                  Subtotal ({staticCartItems.length} Themes)
                </span>

                <span className="font-semibold">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="summary-row">
                <span>Estimated Service Tax (5%)</span>

                <span>
                  ₹{serviceTax.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="summary-row">
                <span>On-Site Designer & Setup</span>

                <span className="text-green font-semibold">
                  Included FREE
                </span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total-row">
                <span className="total-title font-serif">
                  Grand Total
                </span>

                <span className="total-amount font-serif">
                  ₹{grandTotal.toLocaleString('en-IN')}
                </span>
              </div>

              <button
                className="btn-primary checkout-btn"
                onClick={() => handleStaticAction('Checkout')}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={18} />
              </button>

              <div className="summary-trust-badge">
                <ShieldCheck size={18} className="trust-icon" />

                <span>
                  100% Date Protection & Satisfaction Guarantee
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CartPage;