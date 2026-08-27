import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, Lock, User, Eye, EyeOff, ArrowRight,  Phone } from 'lucide-react';
import './Auth.css';

const SignupPage = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
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
            <h1 className="auth-title font-serif">Create Your EventEase Account</h1>
            <p className="auth-sub">Join thousands of hosts creating extraordinary celebrations.</p>
          </div>

          

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <div className="input-input-wrap">
                <User size={18} className="input-icon" />
                <input 
                  type="text" 
                  id="fullName" 
                  placeholder="e.g. Ananya Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>

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
              <label htmlFor="phone">Phone Number</label>
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

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-input-wrap">
                <Lock size={18} className="input-icon" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  id="password" 
                  placeholder="Create a strong password"
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
                <input type="checkbox" required defaultChecked />
                <span className="checkmark"></span>
                <span>I agree to the Terms of Service & Privacy Policy</span>
              </label>
            </div>

            <button type="submit" className="btn-primary auth-submit-btn">
              <span>Create Free Account</span>
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
