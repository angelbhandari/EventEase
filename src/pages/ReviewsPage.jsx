import { useState, useEffect, useMemo } from 'react';
import {
  Star,
  CheckCircle2,
  Sparkles,
  Send,
} from 'lucide-react';
import { reviewsData as initialReviews } from '../data/reviewsData';
import ReviewCard from '../components/ReviewCard';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import './ReviewsPage.css';

const REVIEWS_STORAGE_KEY = 'eventease_reviews';

const ReviewsPage = () => {
  const { addToast } = useToast();
  const { user } = useAuth();

  // Load reviews from localStorage or fallback to initial data
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem(REVIEWS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return initialReviews;
  });

  // Review Form State
  const [authorName, setAuthorName] = useState(user?.name || '');
  const [selectedEvent, setSelectedEvent] = useState('Birthday Party (Barbie Theme)');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Save reviews to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
    } catch (e) {
      console.error(e);
    }
  }, [reviews]);

  // Derived Average Rating
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  // Rating Distribution breakdown
  const ratingDistribution = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(Number(r.rating) || 5)));
      counts[star] = (counts[star] || 0) + 1;
    });
    return counts;
  }, [reviews]);

  // Form Validation
  const validateForm = () => {
    const errors = {};
    if (!authorName.trim()) {
      errors.name = 'Your name is required';
    } else if (authorName.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!rating || rating < 1 || rating > 5) {
      errors.rating = 'Please choose a rating between 1 and 5 stars';
    }

    if (!reviewText.trim()) {
      errors.review = 'Please write a brief description of your experience';
    } else if (reviewText.trim().length < 10) {
      errors.review = 'Review must be at least 10 characters long';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form Submission
  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const newReview = {
      id: Date.now(),
      name: authorName.trim(),
      event: selectedEvent,
      avatar:
        user?.avatar ||
        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(authorName.trim())}`,
      rating: Number(rating),
      date: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      review: reviewText.trim(),
      helpful: 1,
    };

    setReviews((prev) => [newReview, ...prev]);
    addToast('Your review has been shared successfully!', 'success');

    // Reset Form
    setReviewText('');
    setRating(5);
    setFormErrors({});
    setIsSubmitting(false);
  };

  const handleVoteHelpful = (id) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, helpful: (r.helpful || 0) + 1 } : r))
    );
  };

  return (
    <div className="reviews-page page-section">
      <div className="container">
        {/* Page Header */}
        <div className="reviews-header text-center">
          <span className="badge-gold">Client Experience</span>
          <h1 className="section-title font-serif">Customer Reviews & Celebration Stories</h1>
          <p className="section-subtitle">
            Read authentic reviews shared by our hosts, and share your own experience celebrating
            milestones with EventEase.
          </p>
        </div>

        {/* STATS HIGHLIGHT & DISTRIBUTION */}
        <div className="reviews-summary-card">
          <div className="summary-stat-box">
            <h2 className="summary-big-rating font-serif">{averageRating}</h2>
            <div className="stars-row">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  fill={i < Math.round(Number(averageRating)) ? '#C5A059' : 'none'}
                  color="#C5A059"
                />
              ))}
            </div>
            <span className="summary-stat-sub">Based on {reviews.length} Verified Reviews</span>
          </div>

          <div className="summary-distribution-box">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = ratingDistribution[stars] || 0;
              const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
              return (
                <div key={stars} className="dist-row">
                  <span className="dist-label">{stars} ★</span>
                  <div className="dist-bar-track">
                    <div className="dist-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="dist-count">{count}</span>
                </div>
              );
            })}
          </div>

          <div className="summary-perks">
            <div className="perk-item">
              <CheckCircle2 size={18} className="perk-icon" />
              <span>100% On-Time Setup Guarantee</span>
            </div>
            <div className="perk-item">
              <CheckCircle2 size={18} className="perk-icon" />
              <span>99.8% Guest Satisfaction Score</span>
            </div>
            <div className="perk-item">
              <CheckCircle2 size={18} className="perk-icon" />
              <span>Dedicated Concierge for Every Host</span>
            </div>
          </div>
        </div>

        {/* WRITE A REVIEW FORM SECTION */}
        <div className="submit-review-card glass-card animate-fade-in">
          <div className="submit-header">
            <div className="badge-gold mb-8">
              <Sparkles size={14} />
              <span>Share Your Story</span>
            </div>
            <h3 className="submit-title font-serif">Leave a Review</h3>
            <p className="submit-sub">
              Your feedback inspires our creative team and guides future event hosts.
            </p>
          </div>

          <form onSubmit={handleSubmitReview} className="review-form">
            <div className="review-form-row">
              {/* Reviewer Name */}
              <div className="form-group flex-1">
                <label htmlFor="rev-author">Your Name / Display Name *</label>
                <input
                  type="text"
                  id="rev-author"
                  placeholder="e.g. Priya Patel"
                  value={authorName}
                  onChange={(e) => {
                    setAuthorName(e.target.value);
                    if (formErrors.name) setFormErrors((prev) => ({ ...prev, name: null }));
                  }}
                  className={formErrors.name ? 'input-error' : ''}
                />
                {formErrors.name && <span className="field-error-msg">{formErrors.name}</span>}
              </div>

              {/* Event Category / Theme */}
              <div className="form-group flex-1">
                <label htmlFor="rev-event">Celebration / Event Theme *</label>
                <select
                  id="rev-event"
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                >
                  <option value="Birthday Party (Barbie Dream)">Birthday Party (Barbie Dream)</option>
                  <option value="Birthday Party (Pastel Party)">Birthday Party (Pastel Party)</option>
                  <option value="Birthday Party (Luxury Gold)">Birthday Party (Luxury Gold)</option>
                  <option value="Wedding (Royal Palace Mandap)">Wedding (Royal Palace Mandap)</option>
                  <option value="Wedding (Floral Romance)">Wedding (Floral Romance)</option>
                  <option value="Wedding (Traditional Heritage)">Wedding (Traditional Heritage)</option>
                  <option value="Prom Night (Black & Gold Glam)">Prom Night (Black & Gold Glam)</option>
                  <option value="Prom Night (Red Carpet Gala)">Prom Night (Red Carpet Gala)</option>
                  <option value="Diwali Festival Setup">Diwali Festival Setup</option>
                  <option value="Christmas Wonderland Gala">Christmas Wonderland Gala</option>
                  <option value="Corporate / Custom Gathering">Corporate / Custom Gathering</option>
                </select>
              </div>
            </div>

            {/* Star Rating Selector */}
            <div className="form-group">
              <label>Your Overall Rating *</label>
              <div className="interactive-star-row" role="radiogroup" aria-label="Rating">
                {[1, 2, 3, 4, 5].map((starNum) => (
                  <button
                    key={starNum}
                    type="button"
                    className="star-pick-btn"
                    onMouseEnter={() => setHoverRating(starNum)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => {
                      setRating(starNum);
                      if (formErrors.rating) setFormErrors((prev) => ({ ...prev, rating: null }));
                    }}
                    aria-label={`${starNum} stars`}
                  >
                    <Star
                      size={28}
                      fill={
                        starNum <= (hoverRating || rating) ? '#f59e0b' : 'none'
                      }
                      color={
                        starNum <= (hoverRating || rating) ? '#f59e0b' : '#cbd5e1'
                      }
                    />
                  </button>
                ))}
                <span className="star-rating-text">
                  {rating === 5 && 'Outstanding! (5/5)'}
                  {rating === 4 && 'Very Good (4/5)'}
                  {rating === 3 && 'Good Experience (3/5)'}
                  {rating === 2 && 'Needs Improvement (2/5)'}
                  {rating === 1 && 'Disappointing (1/5)'}
                </span>
              </div>
              {formErrors.rating && <span className="field-error-msg">{formErrors.rating}</span>}
            </div>

            {/* Review Description */}
            <div className="form-group">
              <div className="label-with-counter">
                <label htmlFor="rev-text">Your Review Experience *</label>
                <span className="char-count">{reviewText.length} characters</span>
              </div>
              <textarea
                id="rev-text"
                rows="4"
                placeholder="Share specific details about the decor, floral arrangements, setup speed, and overall guest impression..."
                value={reviewText}
                onChange={(e) => {
                  setReviewText(e.target.value);
                  if (formErrors.review) setFormErrors((prev) => ({ ...prev, review: null }));
                }}
                className={formErrors.review ? 'input-error' : ''}
              />
              {formErrors.review && <span className="field-error-msg">{formErrors.review}</span>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary review-submit-btn"
            >
              <Send size={16} />
              <span>Submit Review</span>
            </button>
          </form>
        </div>

        {/* REVIEWS GRID */}
        <div className="reviews-section-header">
          <h3 className="section-title font-serif">Host Feedback ({reviews.length})</h3>
        </div>

        {reviews.length === 0 ? (
          <div className="empty-reviews text-center">
            <p>No reviews submitted yet. Be the first to share your celebration experience!</p>
          </div>
        ) : (
          <div className="reviews-grid">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} onVoteHelpful={handleVoteHelpful} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;
