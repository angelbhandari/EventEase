import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './Auth.css';

const LoginPage = () => {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Where to redirect after login (e.g. if arriving from protected route)
  const fromDestination = location.state?.from?.pathname || '/dashboard';

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
    const result = await login(email, password, rememberMe);
    setIsLoading(false);

    if (result.success) {
      addToast(`Welcome back, ${result.user.name}!`, 'success');
      navigate(fromDestination, { replace: true });
    } else {
      setErrorMessage(result.error);
    }
  };

  // Quick Demo Autofill Helper
  const handleQuickDemoFill = () => {
    setEmail('demo@eventease.com');
    setPassword('password123');
    setFieldErrors({});
    setErrorMessage('');
    addToast('Demo credentials populated (demo@eventease.com)', 'info');
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

          {/* DEMO NOTICE BADGE */}
          <div className="demo-auth-banner">
            <div className="demo-banner-content">
              <span className="demo-tag">College Viva Frontend Demo</span>
              <p className="demo-hint">
                Quick test? Click below to autofill our ready-to-test host account:
              </p>
              <button
                type="button"
                className="btn-quick-demo"
                onClick={handleQuickDemoFill}
              >
                <KeyRound size={14} />
                <span>Quick Fill: demo@eventease.com / password123</span>
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="auth-alert-error animate-fade-in">
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
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
                    if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: null }));
                  }}
                  className={fieldErrors.email ? 'input-error' : ''}
                />
              </div>
              {fieldErrors.email && <span className="field-error-msg">{fieldErrors.email}</span>}
            </div>

            <div className="form-group">
              <div className="password-label-row">
                <label htmlFor="password">Password</label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    addToast('For this viva demo, use password123 with demo@eventease.com', 'info');
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
              {fieldErrors.password && (
                <span className="field-error-msg">{fieldErrors.password}</span>
              )}
            </div>

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

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary auth-submit-btn"
            >
              <span>{isLoading ? 'Signing In...' : 'Sign In to Account'}</span>
              <ArrowRight size={18} />
            </button>
          </form>

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
