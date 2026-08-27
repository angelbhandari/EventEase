import React, { useState } from 'react';
import { Link} from 'react-router-dom';
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import './Auth.css';

const LoginPage = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

  };

  return (
    <div className="auth-page page-section">
      <div className="container">
        <div className="auth-card animate-fade-in">
          <div className="auth-header text-center">
            <div className="auth-logo-badge">
              <Sparkles size={16} />
            </div>
            <h1 className="auth-title font-serif">Welcome Back to EventEase</h1>
            <p className="auth-sub">Sign in to access your event dashboard and saved themes.</p>
          </div>




          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-input-wrap">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  id="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="password-label-row">
                <label htmlFor="password">Password</label>
                <a href="#forgot" onClick={(e) => {
                  e.preventDefault();
                  alert('Password reset feature is currently unavailable.');

                }} className="forgot-link">
                  Forgot password?
                </a>
              </div>
              <div className="input-input-wrap">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          

            <div className="remember-row">
              <label className="checkbox-container">
                <input type="checkbox" defaultChecked />
                <span className="checkmark"></span>
                <span>Remember me on this device</span>
              </label>
            </div>

            <button type="submit" className="btn-primary auth-submit-btn">
              <span>Sign In to Account</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="auth-divider">
            <span>or sign in with</span>
          </div>

          <div className="social-auth-grid">
            <button
              type="button"
              className="btn-secondary social-auth-btn"
              onClick={() => alert('Google Sign-in not availablle yet')}
            >
              <span>Google</span>
            </button>
            <button
              type="button"
              className="btn-secondary social-auth-btn"
              onClick={() => alert('Apple Sign-in not available yet')}
            >
              <span>Apple</span>
            </button>
          </div>

          <div className="auth-footer text-center">
            <p>
              Don't have an account?{' '}
              <Link to="/signup" className="auth-switch-link">
                Sign Up for Free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
