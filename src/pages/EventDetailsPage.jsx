import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowLeft,
  ShoppingBag,
  Calendar,
  Clock,
  Check,
  Users,
  ShieldCheck,
  HeartHandshake,
  CheckCircle2,
} from 'lucide-react';
import { themesData } from '../data/eventsData';
import { reviewsData } from '../data/reviewsData';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import ReviewCard from '../components/ReviewCard';
import './EventDetailsPage.css';

const generateBookingId = () => `EE-BK-${Date.now().toString().slice(-4)}${Math.floor(10 + Math.random() * 90)}`;

const BOOKINGS_STORAGE_KEY = 'eventease_bookings';

const PACKAGE_TIERS = [
  {
    id: 'standard',
    name: 'Signature Package',
    multiplier: 1.0,
    tagline: 'Essential aesthetic decor, ambient lighting & backdrop setup',
    features: [
      'Thematic centerpiece backdrop & photo wall',
      'Ambient LED warm uplighting & spotlights',
      'Table runner setup & entrance easel board',
      'Dedicated setup lead on event morning',
    ],
  },
  {
    id: 'deluxe',
    name: 'Grand Deluxe Curation',
    multiplier: 1.35,
    tagline: 'Enhanced floral architecture, custom signage & ceiling drapery',
    features: [
      'Everything in Signature Package',
      'Cascading fresh/silk floral arches',
      'Custom neon initials or laser-cut calligraphy signage',
      'Canopy ceiling fairy lights or velvet drapery',
      'On-site decor technician on standby',
    ],
  },
  {
    id: 'royal',
    name: 'Royal VIP Masterpiece',
    multiplier: 1.75,
    tagline: 'Bespoke luxury transformation with crystal chandeliers & entrance tunnel',
    features: [
      'Everything in Grand Deluxe Curation',
      'Grand 30ft ceremonial entrance tunnel or mandap/stage',
      'Imported crystal chandeliers & mirror tablescapes',
      'Dry-ice smoke or cold-pyro sparkler entrance effect',
      'Lead event designer on-site from start to celebration end',
    ],
  },
];

const EventDetailsPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const { user } = useAuth();

  // Find theme from themesData
  const theme = useMemo(() => {
    return themesData.find((t) => t.id === eventId);
  }, [eventId]);

  // Selected package tier
  const [selectedTier, setSelectedTier] = useState('standard');
  const [selectedDate, setSelectedDate] = useState('');
  const [guestCount, setGuestCount] = useState('50-100');
  const [eventTime, setEventTime] = useState('Evening (6:00 PM - 11:00 PM)');
  const [specialNotes, setSpecialNotes] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [confirmedBookingData, setConfirmedBookingData] = useState(null);

  // Parse base price from string e.g. "₹35,000" -> 35000
  const basePriceNum = useMemo(() => {
    if (!theme) return 0;
    const cleanStr = theme.price.replace(/[^0-9]/g, '');
    return Number(cleanStr) || 30000;
  }, [theme]);

  // Active package details
  const activePackage = PACKAGE_TIERS.find((p) => p.id === selectedTier) || PACKAGE_TIERS[0];

  // Calculated package price
  const calculatedPrice = Math.round(basePriceNum * activePackage.multiplier);

  // Event-specific reviews (filter reviews matching category/name or show related)
  const eventReviews = useMemo(() => {
    if (!theme) return [];
    const matched = reviewsData.filter(
      (r) =>
        r.event.toLowerCase().includes(theme.categoryId.toLowerCase()) ||
        r.event.toLowerCase().includes(theme.name.toLowerCase())
    );
    return matched.length > 0 ? matched : reviewsData.slice(0, 2);
  }, [theme]);

  if (!theme) {
    return (
      <div className="event-details-page page-section">
        <div className="container text-center not-found-event">
          <span className="badge-rose mb-16">Event Catalog</span>
          <h2 className="section-title font-serif">Event Theme Not Found</h2>
          <p className="section-subtitle">
            We couldn't locate the theme you requested ("{eventId}"). It may have been renamed or updated.
          </p>
          <div className="mt-32">
            <Link to="/events" className="btn-primary">
              <ArrowLeft size={18} />
              <span>Return to Event Catalog</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Handle Add to Cart
  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: `cart-${theme.id}-${selectedTier}`,
        themeId: theme.id,
        themeName: theme.name,
        eventName: theme.categoryName,
        category: theme.categoryName,
        image: theme.image,
        price: calculatedPrice,
        quantity: 1,
        selectedPackage: activePackage.name,
        eventDate: selectedDate,
        guests: guestCount,
      })
    );
    addToast(`"${theme.name} (${activePackage.name})" added to cart!`, 'success');
  };

  // Handle Instant Demo Booking
  const handleBookingSubmit = (e) => {
    e.preventDefault();

    if (!selectedDate) {
      addToast('Please select your preferred celebration date', 'error');
      return;
    }

    const bookingPayload = {
      id: generateBookingId(),
      themeId: theme.id,
      themeName: theme.name,
      category: theme.categoryName,
      package: activePackage.name,
      date: selectedDate,
      time: eventTime,
      guests: guestCount,
      notes: specialNotes,
      totalPrice: calculatedPrice,
      status: 'Confirmed',
      hostName: user?.name || 'Valued Client',
      hostEmail: user?.email || 'guest@eventease.com',
      createdAt: new Date().toISOString().split('T')[0],
    };

    try {
      const existing = localStorage.getItem(BOOKINGS_STORAGE_KEY);
      const bookings = existing ? JSON.parse(existing) : [];
      bookings.unshift(bookingPayload);
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
    } catch (err) {
      console.error(err);
    }

    setConfirmedBookingData(bookingPayload);
    setBookingConfirmed(true);
    addToast('Celebration reservation confirmed!', 'success');
  };

  return (
    <div className="event-details-page page-section">
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div className="details-nav-row">
          <button
            onClick={() => navigate(-1)}
            className="back-btn"
            title="Go back"
          >
            <ArrowLeft size={18} />
            <span>Back to Catalog</span>
          </button>
          <span className="details-category-pill">{theme.categoryName}</span>
        </div>

        {/* HERO SHOWCASE GRID */}
        <div className="details-hero-grid">
          {/* Main Visual showcase */}
          <div className="details-visual-col">
            <div className="details-main-img-card">
              <img src={theme.image} alt={theme.name} className="details-main-img" />
              <div className="details-img-overlay">
                <span className="badge-gold">Bespoke Design</span>
              </div>
            </div>

            {/* Quality Guarantees */}
            <div className="guarantees-grid">
              <div className="guarantee-item">
                <ShieldCheck size={20} className="guarantee-icon" />
                <div>
                  <h5 className="guarantee-title">Turnkey Setup</h5>
                  <p className="guarantee-desc">Delivered and styled 3 hours prior to celebration start.</p>
                </div>
              </div>
              <div className="guarantee-item">
                <HeartHandshake size={20} className="guarantee-icon" />
                <div>
                  <h5 className="guarantee-title">Customizable Details</h5>
                  <p className="guarantee-desc">Color accents & floral arrangements tailored to your venue.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Details & Customizer Sidebar */}
          <div className="details-info-col">
            <div className="details-header-card glass-card">
              <span className="badge-rose details-tag">Exclusive Concept</span>
              <h1 className="details-title font-serif">{theme.name}</h1>
              <p className="details-tagline">{theme.tagline}</p>

              <div className="details-price-badge">
                <span className="price-label">Package Investment:</span>
                <span className="details-price-num font-serif">
                  ₹{calculatedPrice.toLocaleString('en-IN')}
                </span>
                <span className="price-sub">all-inclusive on-site curation</span>
              </div>

              <p className="details-description">{theme.description}</p>

              {/* TIER PACKAGE SELECTION */}
              <div className="tier-selection-section">
                <h3 className="tier-section-title font-serif">1. Choose Your Package Tier</h3>
                <div className="tier-cards-row">
                  {PACKAGE_TIERS.map((tier) => (
                    <div
                      key={tier.id}
                      className={`tier-choice-card ${selectedTier === tier.id ? 'active' : ''}`}
                      onClick={() => setSelectedTier(tier.id)}
                    >
                      <div className="tier-header">
                        <span className="tier-name">{tier.name}</span>
                        <span className="tier-price-diff">
                          ₹{Math.round(basePriceNum * tier.multiplier).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <p className="tier-desc">{tier.tagline}</p>
                      <ul className="tier-feature-list">
                        {tier.features.map((feat, idx) => (
                          <li key={idx}>
                            <Check size={14} className="check-ico" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* BOOKING / DATE CUSTOMIZATION FORM */}
              <form onSubmit={handleBookingSubmit} className="booking-config-form">
                <h3 className="tier-section-title font-serif">2. Event Schedule & Logistics</h3>

                <div className="form-fields-grid">
                  <div className="form-field-item">
                    <label htmlFor="event-date">
                      <Calendar size={16} />
                      <span>Celebration Date *</span>
                    </label>
                    <input
                      type="date"
                      id="event-date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  <div className="form-field-item">
                    <label htmlFor="guest-count">
                      <Users size={16} />
                      <span>Estimated Guests</span>
                    </label>
                    <select
                      id="guest-count"
                      value={guestCount}
                      onChange={(e) => setGuestCount(e.target.value)}
                    >
                      <option value="20-50">Intimate Gathering (20 - 50)</option>
                      <option value="50-100">Classic Celebration (50 - 100)</option>
                      <option value="100-250">Grand Gala (100 - 250)</option>
                      <option value="250+">Royal Gathering (250+)</option>
                    </select>
                  </div>

                  <div className="form-field-item full-width">
                    <label htmlFor="event-time">
                      <Clock size={16} />
                      <span>Preferred Time Window</span>
                    </label>
                    <select
                      id="event-time"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                    >
                      <option value="Morning (9:00 AM - 2:00 PM)">Morning / Brunch (9:00 AM - 2:00 PM)</option>
                      <option value="Afternoon (2:00 PM - 6:00 PM)">Afternoon Sundowner (2:00 PM - 6:00 PM)</option>
                      <option value="Evening (6:00 PM - 11:00 PM)">Evening Grand Reception (6:00 PM - 11:00 PM)</option>
                      <option value="Full Day (8:00 AM - Midnight)">Full Day Celebration (8:00 AM - Midnight)</option>
                    </select>
                  </div>

                  <div className="form-field-item full-width">
                    <label htmlFor="special-notes">
                      <span>Venue Notes or Custom Requests</span>
                    </label>
                    <textarea
                      id="special-notes"
                      rows="2"
                      placeholder="e.g. Specific color accents, indoor ballroom vs garden lawn, custom signage initials..."
                      value={specialNotes}
                      onChange={(e) => setSpecialNotes(e.target.value)}
                    />
                  </div>
                </div>

                {/* Price Total & CTA Buttons */}
                <div className="booking-summary-strip">
                  <div className="summary-calc-info">
                    <span className="summary-tier-tag">{activePackage.name}</span>
                    <h4 className="summary-calculated-total font-serif">
                      ₹{calculatedPrice.toLocaleString('en-IN')}
                    </h4>
                    <span className="summary-date-tag">
                      {selectedDate ? `Reserved for ${selectedDate}` : 'Select date to reserve'}
                    </span>
                  </div>

                  <div className="booking-actions-row">
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="btn-secondary add-cart-btn"
                    >
                      <ShoppingBag size={18} />
                      <span>Add to Cart</span>
                    </button>

                    <button
                      type="submit"
                      className="btn-primary reserve-now-btn"
                    >
                      <Sparkles size={18} />
                      <span>Confirm Demo Booking</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* BOOKING CONFIRMATION MODAL */}
        {bookingConfirmed && confirmedBookingData && (
          <div className="modal-backdrop animate-fade-in" onClick={() => setBookingConfirmed(false)}>
            <div className="modal-card glass-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-icon-badge">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="modal-title font-serif">Celebration Reserved!</h2>
              <p className="modal-sub">
                Your reservation demo for <strong>{confirmedBookingData.themeName}</strong> has been
                successfully created.
              </p>

              <div className="modal-details-box">
                <div className="modal-detail-row">
                  <span>Booking Reference:</span>
                  <strong className="text-gold">{confirmedBookingData.id}</strong>
                </div>
                <div className="modal-detail-row">
                  <span>Selected Package:</span>
                  <strong>{confirmedBookingData.package}</strong>
                </div>
                <div className="modal-detail-row">
                  <span>Event Date:</span>
                  <strong>{confirmedBookingData.date}</strong>
                </div>
                <div className="modal-detail-row">
                  <span>Estimated Total:</span>
                  <strong className="text-gold">
                    ₹{confirmedBookingData.totalPrice.toLocaleString('en-IN')}
                  </strong>
                </div>
              </div>

              <div className="modal-actions-row">
                <Link to="/dashboard" className="btn-primary w-full">
                  <span>View in My Dashboard</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setBookingConfirmed(false)}
                  className="btn-secondary w-full"
                >
                  <span>Close Window</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* REVIEWS SECTION FOR THIS EVENT */}
        <section className="event-reviews-section mt-56">
          <div className="section-header text-center">
            <span className="badge-gold">Host Feedback</span>
            <h2 className="section-title font-serif">Reviews for {theme.name}</h2>
            <p className="section-subtitle">
              Verified photos and feedback from clients who booked this signature aesthetic.
            </p>
          </div>

          <div className="reviews-grid">
            {eventReviews.map((rev) => (
              <ReviewCard key={rev.id} review={rev} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default EventDetailsPage;
