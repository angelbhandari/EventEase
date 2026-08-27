import React from 'react';
import { Star, Quote, CheckCircle2, ThumbsUp } from 'lucide-react';
import './ReviewCard.css';


const ReviewCard = ({ review }) => {
  return (
    <div className="review-card glass-card">
      <div className="review-header">
        <img src={review.avatar} alt={review.name} className="review-avatar" />
        <div className="review-user-info">
          <h4 className="review-user-name">{review.name}</h4>
          <span className="review-event-tag">{review.event}</span>
        </div>
        <Quote className="quote-icon" size={28} />
      </div>

      <div className="review-rating">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            fill={i < review.rating ? "#f59e0b" : "none"}
            color={i < review.rating ? "#f59e0b" : "#475569"}
          />
        ))}
        <span className="review-date">{review.date}</span>
      </div>

      <p className="review-text">{review.review}</p>

      <div className="review-footer">

        <div className="verified-badge">
          <CheckCircle2 size={14} className="check-icon" />
          <span>Verified Client</span>
        </div>

        <button
          className="helpful-btn"
          onClick={() =>
            alert('Thanks for your feedback! Helpful voting will be available soon.')
          }
        >
          <ThumbsUp size={14} />
          <span>Helpful (14)</span>
        </button>

      </div>
    </div>
  );
};

export default ReviewCard;
