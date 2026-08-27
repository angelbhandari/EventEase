
import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';

import './CartItemCard.css';

const CartItemCard = ({ item, onAction }) => {
  return (
    <div className="cart-item-card glass-card">

      {/* Image */}
      <div className="cart-item-image-box">
        <img
          src={item.image}
          alt={item.themeName}
          className="cart-item-image"
        />
      </div>

      {/* Item Information */}
      <div className="cart-item-info">
        <span className="cart-item-event">
          {item.eventName}
        </span>

        <h4 className="cart-item-theme">
          {item.themeName}
        </h4>

        <span className="cart-item-unit-price">
          ₹{item.price.toLocaleString('en-IN')} / package
        </span>

      </div>

      {/* Quantity */}
      <div className="cart-item-qty">

        <button
          className="qty-btn"
          onClick={() => onAction('Decrease Quantity')}
        >
          <Minus size={14} />
        </button>

        <span className="qty-value">
          {item.quantity}
        </span>

        <button
          className="qty-btn"
          onClick={() => onAction('Increase Quantity')}
        >
          <Plus size={14} />
        </button>

      </div>

      {/* Total Price */}
      <div className="cart-item-subtotal">

        <span className="subtotal-label">
          Total
        </span>

        <span className="subtotal-amount">
          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
        </span>

      </div>

      {/* Remove */}
      <button
        className="cart-remove-btn"
        title="Remove item"
        onClick={() => onAction('Remove Item')}
      >
        <Trash2 size={18} />
      </button>

    </div>
  );
};

export default CartItemCard;
