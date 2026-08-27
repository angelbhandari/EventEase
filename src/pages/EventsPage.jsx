import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShoppingBag, Eye, Sparkles, Filter } from 'lucide-react';
import { categoriesData, themesData } from '../data/eventsData';
import './EventsPage.css';

const EventsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategoryParam = searchParams.get('category') || 'all';
  const [activeCategory, setActiveCategory] = useState(selectedCategoryParam);

  useEffect(() => {
    setActiveCategory(selectedCategoryParam);
  }, [selectedCategoryParam]);

  const handleTabChange = (categoryId) => {
    setActiveCategory(categoryId);
    if (categoryId === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: categoryId });
    }
  };

  const filteredThemes = activeCategory === 'all'
    ? themesData
    : themesData.filter((theme) => theme.categoryId === activeCategory);

  return (
    <div className="events-page page-section">
      <div className="container">
        {/* Page Header */}
        <div className="events-page-header text-center">
          <span className="badge-gold">Bespoke Catalog</span>
          <h1 className="section-title font-serif">Event Themes & Decor Packages</h1>
          <p className="section-subtitle">
            Select a theme to explore high-definition decor details, lighting concepts, flower arrangements, and table setups.
          </p>
        </div>

        {/* Category Tabs Filter */}
        <div className="category-tabs-wrapper">
          <div className="category-tabs-container">
            <button
              className={`category-tab-btn ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => handleTabChange('all')}
            >
              <Sparkles size={16} />
              <span>All Events ({themesData.length})</span>
            </button>
            {categoriesData.map((cat) => (
              <button
                key={cat.id}
                className={`category-tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => handleTabChange(cat.id)}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Themes Grid */}
        <div className="themes-grid">
          {filteredThemes.map((theme) => (
            <div key={theme.id} className="theme-card animate-fade-in">
              <div className="theme-card-image-wrap">
                <img src={theme.image} alt={theme.name} className="theme-card-image" />
                <span className="theme-category-tag">{theme.categoryName}</span>
              </div>

              <div className="theme-card-body">
                <div className="theme-card-header">
                  <h3 className="theme-name font-serif">{theme.name}</h3>
                  <span className="theme-price">{theme.startingPrice}</span>
                </div>

                <p className="theme-tagline">{theme.tagline}</p>
                <p className="theme-description">{theme.description}</p>

                <div className="theme-card-actions">
                  <button
                    className="btn-primary theme-btn-view"
                  >
                    <Eye size={16} />
                    <span>View Theme</span>
                  </button>

                  <button
                    className="btn-secondary theme-btn-cart"
                    title="Add to Cart"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`"${theme.name} added to cart"`);
                    }}
                  >
                    <ShoppingBag size={16} />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
              </div>
    </div>
  );
};

export default EventsPage;