import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Phone,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './Auth.css';

const SignupPage = () => {
  const { signup } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!password) return { label: '', color: '', score: 0 };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password) || /[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) return { label: 'Weak', color: 'var(--color-coral-dark)', score: 25 };
    if (score <= 2) return { label: 'Moderate', color: '#f59e0b', score: 60 };
    return { label: 'Strong', color: 'var(--color-mint-dark)', score: 100 };
  }, [password]);

  const validate = () => {
    const errors = {};
    if (!fullName.trim()) {
      errors.fullName = 'Full name is required';
    } else if (fullName.trim().length < 2) {
      errors.fullName = 'Name must be at least 2 characters';
    }

    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!agreeTerms) {
      errors.terms = 'You must agree to the Terms of Service';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
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
            <h1 className="auth-title font-serif">Create Your EventEase Account</h1>
            <p className="auth-sub">
              Join thousands of event hosts creating extraordinary bespoke celebrations.
            </p>
          </div>

          {generalError && (
            <div className="auth-alert-error animate-fade-in">
              <AlertCircle size={18} />
              <span>{generalError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="fullName">Full Name *</label>
              <div className="input-input-wrap">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  id="fullName"
                  placeholder="e.g. Rohan Verma"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (fieldErrors.fullName) setFieldErrors((p) => ({ ...p, fullName: null }));
                  }}
                  className={fieldErrors.fullName ? 'input-error' : ''}
                />
              </div>
              {fieldErrors.fullName && (
                <span className="field-error-msg">{fieldErrors.fullName}</span>
              )}
            </div>

            {/* Email Address */}
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <div className="input-input-wrap">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  id="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: null }));
                  }}
                  className={fieldErrors.email ? 'input-error' : ''}
                />
              </div>
              {fieldErrors.email && <span className="field-error-msg">{fieldErrors.email}</span>}
            </div>

            {/* Phone Number */}
            <div className="form-group">
              <label htmlFor="phone">Phone Number (Optional)</label>
              <div className="input-input-wrap">
                <Phone size={18} className="input-icon" />
                <input
                  type="tel"
                  id="phone"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password">Password (Minimum 6 characters) *</label>
              <div className="input-input-wrap">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Create a secure password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: null }));
                  }}
                  className={fieldErrors.password ? 'input-error' : ''}
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Strength Meter Bar */}
              {password && (
                <div className="strength-meter-wrap">
                  <div className="strength-track">
                    <div
                      className="strength-fill"
                      style={{
                        width: `${passwordStrength.score}%`,
                        backgroundColor: passwordStrength.color,
                      }}
                    />
                  </div>
                  <span className="strength-label" style={{ color: passwordStrength.color }}>
                    Strength: {passwordStrength.label}
                  </span>
                </div>
              )}

              {fieldErrors.password && (
                <span className="field-error-msg">{fieldErrors.password}</span>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <div className="input-input-wrap">
                <Lock size={18} className="input-icon" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (fieldErrors.confirmPassword)
                      setFieldErrors((p) => ({ ...p, confirmPassword: null }));
                  }}
                  className={fieldErrors.confirmPassword ? 'input-error' : ''}
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <span className="field-error-msg">{fieldErrors.confirmPassword}</span>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="remember-row">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => {
                    setAgreeTerms(e.target.checked);
                    if (fieldErrors.terms) setFieldErrors((p) => ({ ...p, terms: null }));
                  }}
                />
                <span className="checkmark"></span>
                <span>I agree to the EventEase Terms of Service & Privacy Policy</span>
              </label>
              {fieldErrors.terms && <span className="field-error-msg">{fieldErrors.terms}</span>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary auth-submit-btn"
            >
              <span>{isLoading ? 'Creating Account...' : 'Create Free Account'}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="auth-footer text-center">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-switch-link">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
