import { Trash2, Plus, Minus } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { increaseQuantity, decreaseQuantity, removeFromCart } from '../store/cartSlice';
import './CartItemCard.css';

const CartItemCard = ({ item, onAction }) => {
  const dispatch = useDispatch();

  const handleDecrease = () => {
    if (onAction) {
      onAction('decrease', item.id);
    } else {
      dispatch(decreaseQuantity(item.id));
    }
  };

  const handleIncrease = () => {
    if (onAction) {
      onAction('increase', item.id);
    } else {
      dispatch(increaseQuantity(item.id));
    }
  };

  const handleRemove = () => {
    if (onAction) {
      onAction('remove', item.id);
    } else {
      dispatch(removeFromCart(item.id));
    }
  };

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
          {item.eventName || item.category}
        </span>

        <h4 className="cart-item-theme">
          {item.themeName}
        </h4>

        {item.selectedPackage && (
          <span className="cart-item-package-tag">
            {item.selectedPackage}
          </span>
        )}

        <span className="cart-item-unit-price">
          ₹{Number(item.price).toLocaleString('en-IN')} / package
        </span>
      </div>

      {/* Quantity Controls */}
      <div className="cart-item-qty">
        <button
          type="button"
          className="qty-btn"
          onClick={handleDecrease}
          aria-label="Decrease quantity"
        >
          <Minus size={14} />
        </button>

        <span className="qty-value">
          {item.quantity}
        </span>

        <button
          type="button"
          className="qty-btn"
          onClick={handleIncrease}
          aria-label="Increase quantity"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Subtotal */}
      <div className="cart-item-subtotal">
        <span className="subtotal-label">
          Subtotal
        </span>
        <span className="subtotal-amount">
          ₹{(Number(item.price) * Number(item.quantity)).toLocaleString('en-IN')}
        </span>
      </div>

      {/* Remove Button */}
      <button
        type="button"
        className="cart-remove-btn"
        title="Remove item from cart"
        onClick={handleRemove}
        aria-label="Remove item"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default CartItemCard;
