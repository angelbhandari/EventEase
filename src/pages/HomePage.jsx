import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Star, ShieldCheck, Award, HeartHandshake } from 'lucide-react';
import { categoriesData } from '../data/eventsData';
import { reviewsData } from '../data/reviewsData';
import HeroSlideshow from '../components/HeroSlideshow';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId) => {
    navigate(`/events?category=${categoryId}`);
  };

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="hero-section">
        <HeroSlideshow />
        <div className="hero-overlay"></div>
        <div className="container hero-container">
          <div className="hero-content animate-fade-in">
            <div className="badge-gold hero-badge">
              <Sparkles size={14} />
              <span>Luxury Event Curation</span>
            </div>
            
            <h1 className="hero-title font-serif">
              Make Every Celebration <br />
              <span className="hero-highlight">Extraordinary</span>
            </h1>

            <p className="hero-description">
              EventEase designs, plans, and delivers magnificent event themes for birthdays, royal weddings, prom nights, and grand cultural festivals. Crafted with passion, elegance, and perfection.
            </p>

            <div className="hero-cta-group">
              <Link to="/events" className="btn-primary hero-btn">
                <span>Explore Events</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/budget" className="btn-secondary hero-btn-secondary">
                <span>View Budget Tracker</span>
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="hero-stats-row">
              <div className="stat-item">
                <span className="stat-number font-serif">500+</span>
                <span className="stat-label">Events Delivered</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number font-serif">19+</span>
                <span className="stat-label">Signature Themes</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number font-serif">4.9 ★</span>
                <span className="stat-label">Client Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EVENT CATEGORIES SECTION */}
      <section className="page-section categories-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="badge-rose">Curated Themes</span>
            <h2 className="section-title font-serif">Explore Event Categories</h2>
            <p className="section-subtitle">
              Select an event category to discover bespoke, hand-crafted decor and setup packages.
            </p>
          </div>

          <div className="categories-grid">
            {categoriesData.map((cat) => (
              <div 
                key={cat.id} 
                className="category-card"
                onClick={() => handleCategoryClick(cat.id)}
              >
                <div className="category-image-wrap">
                  <img src={cat.image} alt={cat.name} className="category-image" />
                  <div className="category-badge">{cat.icon} {cat.themeCount} Themes</div>
                </div>
                <div className="category-card-body">
                  <h3 className="category-name font-serif">{cat.name}</h3>
                  <p className="category-tagline">{cat.tagline}</p>
                  <p className="category-description">{cat.description}</p>
                  <button 
                    className="category-explore-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCategoryClick(cat.id);
                    }}
                  >
                    <span>Explore Themes</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY EVENTEASE (FEATURE HIGHLIGHTS) */}
      <section className="page-section why-section">
        <div className="container">
          <div className="why-grid">
            <div className="why-content">
              <span className="badge-gold">Why Choose Us</span>
              <h2 className="section-title font-serif">
                Unmatched Artisanship & Flawless Execution
              </h2>
              <p className="why-text">
                Every milestone in life deserves a celebration that feels effortless and breathtaking. At EventEase, we handle everything from thematic backdrops and floral arches to ambient lighting and luxury table settings.
              </p>

              <div className="why-features-list">
                <div className="why-feature-item">
                  <div className="feature-icon-box">
                    <Award size={22} />
                  </div>
                  <div>
                    <h4 className="feature-title font-serif">Bespoke Design Aesthetics</h4>
                    <p className="feature-desc">Tailored theme concepts matching your precise aesthetic and color palette.</p>
                  </div>
                </div>

                <div className="why-feature-item">
                  <div className="feature-icon-box">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <h4 className="feature-title font-serif">Turnkey Venue Transformation</h4>
                    <p className="feature-desc">Complete end-to-end setup including floral, lighting, seating, and decor.</p>
                  </div>
                </div>

                <div className="why-feature-item">
                  <div className="feature-icon-box">
                    <HeartHandshake size={22} />
                  </div>
                  <div>
                    <h4 className="feature-title font-serif">Transparent Budget Tracking</h4>
                    <p className="feature-desc">Keep expenses organized with clear static breakdowns across venue, food, and music.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="why-image-card">
              <img 
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80" 
                alt="Event Decoration Showcase" 
                className="why-img"
              />
              <div className="why-floating-card">
                <Sparkles className="floating-card-icon" />
                <div>
                  <h5 className="floating-title">Signature Experience</h5>
                  <p className="floating-sub">Trusted by top wedding planners & hosts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED REVIEWS TEASER */}
      <section className="page-section reviews-teaser-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="badge-gold">Testimonials</span>
            <h2 className="section-title font-serif">Loved by Celebrators</h2>
            <p className="section-subtitle">Real experiences from our recent event hosts.</p>
          </div>

          <div className="teaser-reviews-grid">
            {reviewsData.slice(0, 3).map((review) => (
              <div key={review.id} className="teaser-review-card">
                <div className="stars-row">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#C5A059" color="#C5A059" />
                  ))}
                </div>
                <p className="teaser-review-text">"{review.review}"</p>
                <div className="teaser-user-info">
                  <img src={review.avatar} alt={review.name} className="teaser-avatar" />
                  <div>
                    <h5 className="teaser-user-name">{review.name}</h5>
                    <span className="teaser-event-tag">{review.event}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-48">
            <Link to="/reviews" className="btn-secondary">
              <span>View All Customer Reviews</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* BANNER CTA */}
      <section className="cta-banner-section">
        <div className="container">
          <div className="cta-banner-box">
            <h2 className="cta-heading font-serif">Ready to Host Your Dream Event?</h2>
            <p className="cta-sub">
              Browse our curated themes or talk to our lead event designer today.
            </p>
            <Link to="/events" className="btn-primary cta-btn">
              <span>Browse All Themes</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
