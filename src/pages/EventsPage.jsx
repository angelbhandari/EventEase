import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Eye,
  Sparkles,
  Search,
  X,
  ArrowUpDown,
  FilterX,
} from 'lucide-react';
import { categoriesData, themesData } from '../data/eventsData';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { useToast } from '../context/ToastContext';
import './EventsPage.css';

const EventsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addToast } = useToast();

  const activeCategory = searchParams.get('category') || 'all';
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recommended');

  const handleTabChange = (categoryId) => {
    if (categoryId === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: categoryId });
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSortBy('recommended');
    setSearchParams({});
  };

  // Filter and Sort Themes
  const processedThemes = useMemo(() => {
    let result = themesData;

    // 1. Category Filter
    if (activeCategory !== 'all') {
      result = result.filter((t) => t.categoryId === activeCategory);
    }

    // 2. Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.categoryName.toLowerCase().includes(q) ||
          t.tagline.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    }

    // 3. Sort Filter
    const parsePrice = (priceStr) => Number(priceStr.replace(/[^0-9]/g, '')) || 0;

    const sorted = [...result];
    if (sortBy === 'price-low') {
      sorted.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    } else if (sortBy === 'price-high') {
      sorted.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    } else if (sortBy === 'name-az') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    }

    return sorted;
  }, [activeCategory, searchQuery, sortBy]);

  // Handle direct Add to Cart from catalog card
  const handleDirectAddToCart = (e, theme) => {
    e.stopPropagation();
    const priceNum = Number(theme.price.replace(/[^0-9]/g, '')) || 30000;
    dispatch(
      addToCart({
        themeId: theme.id,
        themeName: theme.name,
        eventName: theme.categoryName,
        category: theme.categoryName,
        image: theme.image,
        price: priceNum,
        quantity: 1,
        selectedPackage: 'Signature Package',
      })
    );
    addToast(`"${theme.name}" added to cart!`, 'success');
  };

  return (
    <div className="events-page page-section">
      <div className="container">
        {/* Page Header */}
        <div className="events-page-header text-center">
          <span className="badge-gold">Bespoke Catalog</span>
          <h1 className="section-title font-serif">Event Themes & Decor Packages</h1>
          <p className="section-subtitle">
            Explore curated decor themes with high-definition styling, flower arrangements,
            ambient lighting, and custom packages tailored for your celebration.
          </p>
        </div>

        {/* SEARCH & FILTER CONTROLS BAR */}
        <div className="catalog-controls-bar">
          {/* Search Input */}
          <div className="search-input-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by theme, keyword, or celebration..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search themes"
            />
            {searchQuery && (
              <button
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search query"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="sort-select-box">
            <ArrowUpDown size={16} className="sort-icon" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort themes by"
            >
              <option value="recommended">Featured & Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-az">Theme Name: A to Z</option>
            </select>
          </div>
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

        {/* Active Filter Metrics */}
        <div className="catalog-status-row">
          <span className="results-count">
            Showing <strong>{processedThemes.length}</strong>{' '}
            {processedThemes.length === 1 ? 'theme' : 'themes'}
            {searchQuery && ` for "${searchQuery}"`}
            {activeCategory !== 'all' && ` in ${activeCategory}`}
          </span>
          {(searchQuery || activeCategory !== 'all' || sortBy !== 'recommended') && (
            <button onClick={handleClearFilters} className="reset-filters-link">
              Reset Filters
            </button>
          )}
        </div>

        {/* Themes Grid or Empty State */}
        {processedThemes.length === 0 ? (
          <div className="empty-catalog-state text-center animate-fade-in">
            <FilterX size={48} className="empty-filter-icon" />
            <h3 className="empty-title font-serif">No Matching Event Themes Found</h3>
            <p className="empty-desc">
              We couldn't find any themes matching your current search or category filters. Try
              adjusting your keywords or reset all filters.
            </p>
            <button onClick={handleClearFilters} className="btn-primary mt-16">
              <span>Show All 19 Signature Themes</span>
            </button>
          </div>
        ) : (
          <div className="themes-grid">
            {processedThemes.map((theme) => (
              <div
                key={theme.id}
                className="theme-card animate-fade-in"
                onClick={() => navigate(`/events/${theme.id}`)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    navigate(`/events/${theme.id}`);
                  }
                }}
              >
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
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/events/${theme.id}`);
                      }}
                    >
                      <Eye size={16} />
                      <span>View Theme</span>
                    </button>

                    <button
                      className="btn-secondary theme-btn-cart"
                      title="Add to Cart"
                      onClick={(e) => handleDirectAddToCart(e, theme)}
                    >
                      <ShoppingBag size={16} />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;