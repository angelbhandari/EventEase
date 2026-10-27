import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  AlertTriangle,
  Wallet,
  CheckCircle2,
  Calendar,
  User,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectCartItems,
  selectCartSubtotal,
  selectCartTax,
  selectCartGrandTotal,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} from '../store/cartSlice';
import CartItemCard from '../components/CartItemCard';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { staticBudgetMetrics } from '../data/eventsData';
import './CartPage.css';

const BUDGET_STORAGE_KEY = 'eventease_budget';
const BOOKINGS_STORAGE_KEY = 'eventease_bookings';

const CartPage = () => {
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const { user } = useAuth();

  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const serviceTax = useSelector(selectCartTax);
  const grandTotal = useSelector(selectCartGrandTotal);

  // Budget comparison state
  //is code ka purpose saved budget ko read karna hai
  //initial budget calculate karne ke liye
  const [targetBudget] = useState(() => {
    try {
      const saved = localStorage.getItem(BUDGET_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.totalBudget || 50000;
      }
    } catch (e) {
      console.error(e);
    }
    return staticBudgetMetrics.totalBudget || 50000;
  });

  // Checkout modal state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  //false ka matlab modal intially hidden hai,aur null ka malab abhi confirmef order object nahi hai

  // Checkout form fields
  //yha pe optional chaining use hui hai
  //: agar user undefined ya null to bhi error nhi ata, ye expression undefined hai to '' set ho jata hai
  const [hostName, setHostName] = useState(user?.name || '');
  const [hostEmail, setHostEmail] = useState(user?.email || '');
  const [hostPhone, setHostPhone] = useState(user?.phone || '');
  const [venueAddress, setVenueAddress] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [paymentMethod] = useState('demo-invoice');

  // Budget remaining calculation
  const remainingBudget = targetBudget - grandTotal;
  const isOverBudget = remainingBudget < 0;

  const handleAction = (action, id) => {
    if (action === 'increase') {
      dispatch(increaseQuantity(id));
      addToast('Item quantity increased', 'info', 1500);
    } else if (action === 'decrease') {
      dispatch(decreaseQuantity(id));
      addToast('Item quantity updated', 'info', 1500);
    } else if (action === 'remove') {
      dispatch(removeFromCart(id));
      addToast('Item removed from cart', 'info', 2000);
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear all items from your cart?')) {
      dispatch(clearCart());
      addToast('Your cart has been cleared', 'info');
    }
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      addToast('Your cart is empty. Add a theme before checking out.', 'error');
      return;
    }
    setIsCheckoutOpen(true);
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();

    if (!eventDate) {
      addToast('Please select your celebration date', 'error');
      return;
    }

    const orderData = {
      id: `EE-ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      items: cartItems,
      grandTotal,
      subtotal,
      serviceTax,
      hostName: hostName || 'Guest Host',
      hostEmail: hostEmail || 'guest@example.com',
      hostPhone,
      venueAddress: venueAddress || 'To be specified by host',
      eventDate,
      paymentMethod,
      orderDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      status: 'Confirmed & Scheduled',
    };

    // Save as demo booking
    try {
      const existing = localStorage.getItem(BOOKINGS_STORAGE_KEY);
      const bookings = existing ? JSON.parse(existing) : [];
      bookings.unshift({
        id: orderData.id,
        themeName: cartItems.map((i) => i.themeName).join(', '),
        category: cartItems[0]?.category || 'Celebration',
        package: cartItems[0]?.selectedPackage || 'Curated Setup',
        date: eventDate,
        guests: '50-100',
        totalPrice: grandTotal,
        status: 'Confirmed',
        createdAt: orderData.orderDate,
      });
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
    } catch (err) {
      console.error(err);
    }

    setConfirmedOrder(orderData);
    setOrderConfirmed(true);
    dispatch(clearCart());
    addToast('Reservation order placed successfully!', 'success');
  };

  return (
    <div className="cart-page page-section">
      <div className="container">
        {/* Header */}
        <div className="cart-header text-center">
          <span className="badge-gold">Event Reservations</span>
          <h1 className="section-title font-serif">Selected Themes & Order Summary</h1>
          <p className="section-subtitle">
            Review your selected event aesthetics, adjust quantities, verify your budget, and
            confirm your reservation dates.
          </p>
        </div>

        {/* OVER-BUDGET ALERT BANNER */}
        {/* conditional rendering */}
        {cartItems.length > 0 && isOverBudget && (
          <div className="budget-warning-banner animate-fade-in">
            <AlertTriangle className="warning-icon" size={24} />
            <div className="warning-text">
              <h4 className="warning-title">Budget Limit Exceeded!</h4>
              <p className="warning-desc">
                Your total cart investment of <strong>₹{grandTotal.toLocaleString('en-IN')}</strong> exceeds your target budget of <strong>₹{targetBudget.toLocaleString('en-IN')}</strong> by{' '}
                <strong className="text-danger">₹{Math.abs(remainingBudget).toLocaleString('en-IN')}</strong>.
              </p>
            </div>
            <Link to="/budget" className="btn-secondary btn-sm warning-action-btn">
              <Wallet size={16} />
              <span>Adjust Budget</span>
            </Link>
          </div>
        )}

        {/* Cart Content */}
        {cartItems.length === 0 && !orderConfirmed ? (
          <div className="cart-empty-state glass-card text-center animate-fade-in">
            <ShoppingBag size={56} className="empty-cart-icon" />
            <h2 className="empty-cart-title font-serif">Your Cart is Currently Empty</h2>
            <p className="empty-cart-desc">
              You haven't reserved any event decor packages yet. Discover our tailored themes for
              birthdays, royal weddings, prom nights, and festive galas.
            </p>
            <div className="empty-cart-actions">
              <Link to="/events" className="btn-primary">
                <span>Explore Event Catalog</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/budget" className="btn-secondary">
                <span>Check Budget Tracker</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="cart-content-grid">
            {/* Cart Items Column */}
            <div className="cart-items-col">
              <div className="cart-table-card">
                <div className="cart-table-header">
                  <div>
                    <h3 className="cart-table-title font-serif">
                      Selected Themes ({cartItems.length})
                    </h3>
                    <span className="cart-table-sub">
                      Items saved securely in your demo session
                    </span>
                  </div>

                  <button
                    onClick={handleClearCart}
                    className="clear-cart-link"
                    title="Remove all items"
                  >
                    <Trash2 size={16} />
                    <span>Clear Cart</span>
                  </button>
                </div>

                <div className="cart-items-list">
                  {cartItems.map((item) => (
                    <CartItemCard
                      key={item.id}
                      item={item}
                      onAction={handleAction}
                    />
                  ))}
                </div>

                <div className="cart-table-footer">
                  <Link to="/events" className="btn-secondary">
                    <span>+ Add More Event Themes</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Order Summary & Budget Overview Column */}
            <div className="cart-summary-col">
              {/* Order Summary Card */}
              <div className="summary-card">
                <h3 className="summary-title font-serif">Investment Summary</h3>

                <div className="summary-row">
                  <span>Subtotal ({cartItems.length} Themes)</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                <div className="summary-row">
                  <span>Estimated Service Tax (5%)</span>
                  <span>₹{serviceTax.toLocaleString('en-IN')}</span>
                </div>

                <div className="summary-row">
                  <span>Lead Designer & Venue Lead</span>
                  <span className="text-green font-semibold">Included FREE</span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-total-row">
                  <span className="total-title font-serif">Grand Total</span>
                  <span className="total-amount font-serif">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Real-time Budget Check Widget */}
                <div className="budget-check-widget">
                  <div className="budget-check-header">
                    <span className="budget-check-title">
                      <Wallet size={16} />
                      <span>Target Budget Check</span>
                    </span>
                    <span className="budget-target-val">
                      ₹{targetBudget.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="budget-indicator-row">
                    <span>Remaining Balance:</span>
                    <span
                      className={`font-semibold ${
                        isOverBudget ? 'text-danger' : 'text-green'
                      }`}
                    >
                      {isOverBudget ? '-' : '+'}₹{Math.abs(remainingBudget).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="mini-progress-track">
                    <div
                      className={`mini-progress-fill ${isOverBudget ? 'over' : ''}`}
                      style={{
                        width: `${Math.min(100, Math.round((grandTotal / targetBudget) * 100))}%`,
                      }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-primary checkout-btn"
                  onClick={handleProceedToCheckout}
                >
                  <span>Proceed to Demo Checkout</span>
                  <ArrowRight size={18} />
                </button>

                <div className="summary-trust-badge">
                  <ShieldCheck size={18} className="trust-icon" />
                  <span>100% Date Protection & Satisfaction Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DEMO CHECKOUT MODAL */}
        {isCheckoutOpen && (
          <div className="modal-backdrop animate-fade-in" onClick={() => setIsCheckoutOpen(false)}>
            <div
              className="modal-card checkout-modal-card glass-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header-row">
                <div className="modal-title-group">
                  <span className="badge-gold mb-8">Reservation Confirmation</span>
                  <h2 className="modal-title font-serif">Finalize Event Reservation</h2>
                </div>
                <button
                  type="button"
                  className="modal-close-x"
                  onClick={() => setIsCheckoutOpen(false)}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCheckoutSubmit} className="checkout-modal-form">
                <div className="checkout-form-grid">
                  <div className="form-group">
                    <label htmlFor="chk-host">
                      <User size={16} />
                      <span>Host Full Name *</span>
                    </label>
                    <input
                      type="text"
                      id="chk-host"
                      required
                      placeholder="e.g. Ananya Sharma"
                      value={hostName}
                      onChange={(e) => setHostName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="chk-email">Email Address *</label>
                    <input
                      type="email"
                      id="chk-email"
                      required
                      placeholder="name@example.com"
                      value={hostEmail}
                      onChange={(e) => setHostEmail(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="chk-phone">Contact Phone *</label>
                    <input
                      type="tel"
                      id="chk-phone"
                      required
                      placeholder="+91 98765 43210"
                      value={hostPhone}
                      onChange={(e) => setHostPhone(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="chk-date">
                      <Calendar size={16} />
                      <span>Celebration Date *</span>
                    </label>
                    <input
                      type="date"
                      id="chk-date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                    />
                  </div>

                  <div className="form-group full-col">
                    <label htmlFor="chk-venue">
                      <MapPin size={16} />
                      <span>Celebration Venue Address / City *</span>
                    </label>
                    <input
                      type="text"
                      id="chk-venue"
                      required
                      placeholder="e.g. Grand Heritage Palace, Banquet Hall A, New Delhi"
                      value={venueAddress}
                      onChange={(e) => setVenueAddress(e.target.value)}
                    />
                  </div>
                </div>

                {/* Items Summary in Modal */}
                <div className="modal-items-summary">
                  <span className="summary-title-sm">Reserved Packages ({cartItems.length}):</span>
                  {cartItems.map((item) => (
                    <div key={item.id} className="modal-item-line">
                      <span>
                        {item.themeName} ({item.quantity}×)
                      </span>
                      <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                  <div className="modal-item-line total-line">
                    <strong>Grand Total:</strong>
                    <strong className="text-gold">₹{grandTotal.toLocaleString('en-IN')}</strong>
                  </div>
                </div>

                <div className="modal-actions-group">
                  <button type="submit" className="btn-primary w-full py-16">
                    <Sparkles size={18} />
                    <span>Confirm & Schedule Reservation</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCheckoutOpen(false)}
                    className="btn-secondary w-full"
                  >
                    <span>Back to Cart</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ORDER SUCCESS MODAL */}
        {orderConfirmed && confirmedOrder && (
          <div className="modal-backdrop animate-fade-in" onClick={() => setOrderConfirmed(false)}>
            <div className="modal-card glass-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-icon-badge">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="modal-title font-serif">Order Successfully Placed!</h2>
              <p className="modal-sub">
                Congratulations, your reservation has been registered with EventEase Concierge.
              </p>

              <div className="modal-details-box">
                <div className="modal-detail-row">
                  <span>Order Reference:</span>
                  <strong className="text-gold">{confirmedOrder.id}</strong>
                </div>
                <div className="modal-detail-row">
                  <span>Host Name:</span>
                  <strong>{confirmedOrder.hostName}</strong>
                </div>
                <div className="modal-detail-row">
                  <span>Event Date:</span>
                  <strong>{confirmedOrder.eventDate}</strong>
                </div>
                <div className="modal-detail-row">
                  <span>Total Amount:</span>
                  <strong className="text-gold">
                    ₹{confirmedOrder.grandTotal.toLocaleString('en-IN')}
                  </strong>
                </div>
                <div className="modal-detail-row">
                  <span>Status:</span>
                  <strong className="text-green">{confirmedOrder.status}</strong>
                </div>
              </div>

              <div className="modal-actions-row">
                <Link to="/dashboard" className="btn-primary w-full">
                  <span>View in Dashboard</span>
                </Link>
                <Link to="/events" className="btn-secondary w-full">
                  <span>Browse More Events</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;