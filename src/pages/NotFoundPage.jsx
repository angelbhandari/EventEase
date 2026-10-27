import { Link } from 'react-router-dom';
import { Sparkles, Home, Calendar } from 'lucide-react';
import './NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-page page-section">
      <div className="container">
        <div className="not-found-card animate-fade-in">
          <div className="not-found-badge">
            <Sparkles size={16} />
            <span>404 Error</span>
          </div>

          <h1 className="not-found-code font-serif">404</h1>
          <h2 className="not-found-title font-serif">Page Not Found</h2>
          <p className="not-found-desc">
            The celebration or page you are looking for doesn't exist or may have been relocated.
            Let's guide you back to our curated catalog of event themes.
          </p>

          <div className="not-found-actions">
            <Link to="/" className="btn-primary">
              <Home size={18} />
              <span>Back to Home</span>
            </Link>
            <Link to="/events" className="btn-secondary">
              <Calendar size={18} />
              <span>Browse Event Catalog</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
