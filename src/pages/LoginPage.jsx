
import { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import {
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext.js';

import { useToast } from '../context/ToastContext';

import './Auth.css';

const LoginPage = () => {
  const { login } = useAuth();

  const { addToast } = useToast();


  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [rememberMe, setRememberMe] = useState(true);

  const [errorMessage, setErrorMessage] = useState('');

  const [fieldErrors, setFieldErrors] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const errors = {};

    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email format';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 4) {
      errors.password = 'Password must be at least 4 characters';
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage('');

    if (!validate()) return;

    setIsLoading(true);

    try {
      const result = await login(email, password, rememberMe);

      if (result.success) {
        addToast(`Welcome back, ${result.user.name}!`, 'success');

        // No automatic dashboard redirect after login.
      } else {
        setErrorMessage(result.error);
      }
    } catch (error) {
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page page-section">
      <div className="container">
        <div className="auth-card animate-fade-in">

          <div className="auth-header text-center">
            <div className="auth-logo-badge">
              <Sparkles size={16} />
            </div>

            <h1 className="auth-title font-serif">
              Welcome Back to EventEase
            </h1>

            <p className="auth-sub">
              Sign in to access your event dashboard and saved themes.
            </p>
          </div>

          {errorMessage && (
            <div className="auth-alert-error animate-fade-in">
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="auth-form"
            noValidate
          >

            {/* EMAIL FIELD */}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>

              <div className="input-input-wrap">
                <Mail size={18} className="input-icon" />

                <input
                  type="email"
                  id="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);

                    if (fieldErrors.email) {
                      setFieldErrors((p) => ({
                        ...p,
                        email: null,
                      }));
                    }
                  }}
                  className={fieldErrors.email ? 'input-error' : ''}
                />
              </div>

              {fieldErrors.email && (
                <span className="field-error-msg">
                  {fieldErrors.email}
                </span>
              )}
            </div>

            {/* PASSWORD FIELD */}

            <div className="form-group">
              <div className="password-label-row">
                <label htmlFor="password">Password</label>

                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();

                    addToast(
                      'Please use the password associated with your account.',
                      'info'
                    );
                  }}
                  className="forgot-link"
                >
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
                  onChange={(e) => {
                    setPassword(e.target.value);

                    if (fieldErrors.password) {
                      setFieldErrors((p) => ({
                        ...p,
                        password: null,
                      }));
                    }
                  }}
                  className={
                    fieldErrors.password ? 'input-error' : ''
                  }
                />

                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {fieldErrors.password && (
                <span className="field-error-msg">
                  {fieldErrors.password}
                </span>
              )}
            </div>

            {/* REMEMBER ME */}

            <div className="remember-row">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />

                <span className="checkmark"></span>

                <span>Remember me on this browser session</span>
              </label>
            </div>

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary auth-submit-btn"
            >
              <span>
                {isLoading ? 'Signing In...' : 'Sign In to Account'}
              </span>

              <ArrowRight size={18} />
            </button>

          </form>

          {/* SIGN UP LINK */}

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
