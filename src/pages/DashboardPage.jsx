import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Wallet,
  Calendar,
  LogOut,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useSelector } from 'react-redux';
import { selectCartItems, selectCartGrandTotal } from '../store/cartSlice';
import { staticBudgetMetrics } from '../data/eventsData';
import './DashboardPage.css';

const BOOKINGS_STORAGE_KEY = 'eventease_bookings';
const BUDGET_STORAGE_KEY = 'eventease_budget';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const cartItems = useSelector(selectCartItems);
  const cartGrandTotal = useSelector(selectCartGrandTotal);

  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem(BOOKINGS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    // Default seed booking for demonstration
    return [
      {
        id: 'EE-BK-8821',
        themeName: 'Barbie Dream Celebration',
        category: 'Birthday 🎂',
        package: 'Royal VIP Masterpiece',
        date: '2026-11-15',
        guests: '50-100',
        totalPrice: 42000,
        status: 'Confirmed',
        createdAt: '2026-10-20',
      },
    ];
  });

  const [budgetData] = useState(() => {
    try {
      const saved = localStorage.getItem(BUDGET_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return staticBudgetMetrics;
  });

  useEffect(() => {
    try {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
    } catch (e) {
      console.error(e);
    }
  }, [bookings]);

  const handleCancelBooking = (id) => {
    if (window.confirm('Are you sure you want to cancel this reservation demo?')) {
      setBookings((prev) => prev.filter((b) => b.id !== id));
      addToast('Reservation cancelled successfully', 'info');
    }
  };

  const handleLogout = () => {
    logout();
    addToast('You have been logged out of the demo account', 'info');
    navigate('/');
  };

  const remainingBudget = Math.max(0, budgetData.totalBudget - budgetData.spent);

  return (
    <div className="dashboard-page page-section">
      <div className="container">
        {/* Profile Welcome Banner */}
        <div className="dashboard-welcome-banner glass-card animate-fade-in">
          <div className="user-profile-header">
            <img src={user?.avatar} alt={user?.name} className="dashboard-avatar" />
            <div className="user-profile-info">
              <div className="badge-gold dashboard-role-badge">
                <Sparkles size={14} />
                <span>{user?.role || 'Event Host'}</span>
              </div>
              <h1 className="user-greeting font-serif">Welcome back, {user?.name}</h1>
              <p className="user-email-meta">
                {user?.email} • Member since {user?.memberSince || '2026'}
              </p>
            </div>
          </div>

          <div className="dashboard-banner-actions">
            <Link to="/events" className="btn-primary">
              <Calendar size={16} />
              <span>Browse Themes</span>
            </Link>
            <button onClick={handleLogout} className="btn-outline logout-btn">
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Quick Metrics Row */}
        <div className="dashboard-metrics-grid">
          <div className="dash-metric-card">
            <div className="dash-metric-icon gold">
              <Calendar size={22} />
            </div>
            <div className="dash-metric-content">
              <span className="dash-metric-label">Active Bookings</span>
              <h3 className="dash-metric-value font-serif">{bookings.length}</h3>
              <span className="dash-metric-sub">Scheduled Celebrations</span>
            </div>
          </div>

          <div className="dash-metric-card">
            <div className="dash-metric-icon rose">
              <ShoppingBag size={22} />
            </div>
            <div className="dash-metric-content">
              <span className="dash-metric-label">Cart Packages</span>
              <h3 className="dash-metric-value font-serif">{cartItems.length}</h3>
              <span className="dash-metric-sub">
                ₹{cartGrandTotal.toLocaleString('en-IN')} total in cart
              </span>
            </div>
          </div>

          <div className="dash-metric-card">
            <div className="dash-metric-icon green">
              <Wallet size={22} />
            </div>
            <div className="dash-metric-content">
              <span className="dash-metric-label">Remaining Safe Budget</span>
              <h3 className="dash-metric-value font-serif">
                ₹{remainingBudget.toLocaleString('en-IN')}
              </h3>
              <span className="dash-metric-sub">
                Out of ₹{budgetData.totalBudget.toLocaleString('en-IN')} target
              </span>
            </div>
          </div>
        </div>

        {/* Main Dashboard Columns */}
        <div className="dashboard-content-grid">
          {/* Confirmed Bookings Section */}
          <div className="dashboard-main-col">
            <div className="dashboard-card">
              <div className="dashboard-card-header">
                <div>
                  <h3 className="card-title font-serif">My Reserved Celebrations</h3>
                  <p className="card-sub">All active and upcoming demo bookings</p>
                </div>
                <Link to="/events" className="btn-outline btn-sm">
                  <span>+ New Event</span>
                </Link>
              </div>

              {bookings.length === 0 ? (
                <div className="empty-bookings-box text-center">
                  <Calendar size={48} className="empty-icon" />
                  <h4 className="font-serif">No Reserved Events Yet</h4>
                  <p>Explore our bespoke themes and reserve your celebration dates today.</p>
                  <Link to="/events" className="btn-primary mt-16">
                    <span>Explore Event Themes</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              ) : (
                <div className="bookings-list">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="booking-item-card">
                      <div className="booking-status-tag">
                        <CheckCircle2 size={14} />
                        <span>{booking.status}</span>
                      </div>

                      <div className="booking-details-grid">
                        <div>
                          <span className="booking-ref">Ref: {booking.id}</span>
                          <h4 className="booking-theme-title font-serif">{booking.themeName}</h4>
                          <span className="booking-package-badge">{booking.package}</span>
                        </div>

                        <div className="booking-info-pill">
                          <span className="info-label">Reserved Date</span>
                          <span className="info-val">{booking.date || 'TBD'}</span>
                        </div>

                        <div className="booking-info-pill">
                          <span className="info-label">Est. Guests</span>
                          <span className="info-val">{booking.guests}</span>
                        </div>

                        <div className="booking-price-col">
                          <span className="info-label">Estimated Cost</span>
                          <span className="booking-price font-serif">
                            ₹{Number(booking.totalPrice).toLocaleString('en-IN')}
                          </span>
                        </div>

                        <button
                          className="cancel-booking-btn"
                          title="Cancel reservation demo"
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Shortcuts & Cart Teaser */}
          <div className="dashboard-side-col">
            {/* Cart Preview Card */}
            <div className="dashboard-card">
              <div className="dashboard-card-header">
                <h3 className="card-title font-serif">Active Cart ({cartItems.length})</h3>
                <Link to="/cart" className="view-link">
                  View All
                </Link>
              </div>

              {cartItems.length === 0 ? (
                <div className="empty-side-box">
                  <p>Your shopping cart is currently empty.</p>
                  <Link to="/events" className="btn-secondary btn-sm mt-8">
                    Browse Themes
                  </Link>
                </div>
              ) : (
                <div className="cart-preview-list">
                  {cartItems.slice(0, 3).map((item) => (
                    <div key={item.id} className="cart-preview-item">
                      <img src={item.image} alt={item.themeName} className="cart-preview-img" />
                      <div className="cart-preview-info">
                        <h5 className="preview-name">{item.themeName}</h5>
                        <span className="preview-meta">
                          {item.quantity} × ₹{item.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <span className="preview-subtotal font-semibold">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}

                  <div className="cart-preview-footer">
                    <div className="preview-total-row">
                      <span>Total:</span>
                      <span className="preview-grand-total font-serif">
                        ₹{cartGrandTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <Link to="/cart" className="btn-primary w-full mt-12">
                      <span>Proceed to Cart & Checkout</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions Shortcuts */}
            <div className="dashboard-card shortcuts-card">
              <h3 className="card-title font-serif mb-16">Quick Actions</h3>
              <div className="shortcuts-list">
                <Link to="/budget" className="shortcut-btn">
                  <Wallet size={18} />
                  <span>Interactive Budget Tracker</span>
                </Link>
                <Link to="/reviews" className="shortcut-btn">
                  <Sparkles size={18} />
                  <span>Share a Review & Rating</span>
                </Link>
                <Link to="/events?category=wedding" className="shortcut-btn">
                  <Calendar size={18} />
                  <span>Luxury Wedding Packages</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
