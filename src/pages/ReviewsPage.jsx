import React from 'react';
import { Star, MessageSquareQuote, CheckCircle2, ThumbsUp, Sparkles, AlertCircle } from 'lucide-react';

import { reviewsData } from '../data/reviewsData';
import './ReviewsPage.css';
import ReviewCard from '../components/ReviewCard';
const ReviewsPage = () => {
  return (
    <div className="reviews-page page-section">
      <div className="container">
        {/* Page Header */}
        <div className="reviews-header text-center">
          <span className="badge-gold">Client Experience</span>
          <h1 className="section-title font-serif">Customer Reviews & Stories</h1>
          <p className="section-subtitle">
            Read authentic reviews and memories shared by our hosts from recent weddings, birthdays, and galas.
          </p>
        </div>



        {/* STATS HIGHLIGHT */}
        <div className="reviews-summary-card">
          <div className="summary-stat-box">
            <h2 className="summary-big-rating font-serif">4.9</h2>
            <div className="stars-row">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} fill="#C5A059" color="#C5A059" />
              ))}
            </div>
            <span className="summary-stat-sub">Based on 120+ Event Hosts</span>
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
        {/* REVIEWS GRID */}
        <div className="reviews-grid">
          {reviewsData.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
            />
          ))}
        </div>
        
      </div>
    </div>
  );
};

export default ReviewsPage;
