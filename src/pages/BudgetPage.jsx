

import { useState, useEffect } from 'react';
import {
  Wallet,
  PieChart,
  TrendingUp,
  AlertTriangle,
  Edit2,
  Sparkles,
} from 'lucide-react';
import { staticBudgetMetrics } from '../data/eventsData';
import { useSelector } from 'react-redux';
import { selectCartGrandTotal, selectCartItems } from '../store/cartSlice';
import { useToast } from '../context/ToastContext';
import './BudgetPage.css';

const BUDGET_STORAGE_KEY = 'eventease_budget';

const BudgetPage = () => {
  const { addToast } = useToast();
  const cartGrandTotal = useSelector(selectCartGrandTotal);
  const cartItems = useSelector(selectCartItems);

  const [totalBudget, setTotalBudget] = useState(() => {
    try {
      const saved = localStorage.getItem(BUDGET_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Number(parsed.totalBudget) > 0) {
          return Number(parsed.totalBudget);
        }
      }
    } catch (error) {
      console.error('Failed to load budget:', error);
    }
    return Number(staticBudgetMetrics.totalBudget) || 0;
  });

  const [isEditingTotal, setIsEditingTotal] = useState(false);
  const [tempTotalBudget, setTempTotalBudget] = useState(totalBudget);

  // Save the overall budget in localStorage.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(BUDGET_STORAGE_KEY);
      const previousData = saved ? JSON.parse(saved) : {};
      localStorage.setItem(
        BUDGET_STORAGE_KEY,
        JSON.stringify({ ...previousData, totalBudget })
      );
    } catch (error) {
      console.error('Failed to save budget:', error);
    }
  }, [totalBudget]);

  // Budget spending now comes only from the cart, not expense categories.
  const totalEffectiveSpent = cartGrandTotal;
  const remainingBudget = totalBudget - totalEffectiveSpent;
  const isOverBudget = remainingBudget < 0;
  const spentPercentage = totalBudget > 0
    ? Math.round((totalEffectiveSpent / totalBudget) * 100)
    : 0;

  const handleSaveTotalBudget = (event) => {
    event.preventDefault();
    const value = Number(tempTotalBudget);

    if (!Number.isFinite(value) || value <= 0) {
      addToast('Please enter a valid positive budget amount', 'error');
      return;
    }

    setTotalBudget(value);
    setIsEditingTotal(false);
    addToast(`Target budget updated to ₹${value.toLocaleString('en-IN')}`, 'success');
  };

  const openBudgetEditor = () => {
    setTempTotalBudget(totalBudget);
    setIsEditingTotal(true);
  };

  return (
    <div className="budget-page page-section">
      <div className="container">
        <div className="budget-header text-center">
          <span className="badge-gold">Interactive Financial Tracker</span>
          <h1 className="section-title font-serif">Budget Management & Calculator</h1>
          <p className="section-subtitle">
            Set your event budget, track cart reservations, and see how much budget remains.
          </p>
        </div>

        {isOverBudget && (
          <div className="budget-warning-banner animate-fade-in">
            <AlertTriangle className="warning-icon" size={24} />
            <div className="warning-text">
              <h4 className="warning-title">Budget Limit Exceeded!</h4>
              <p className="warning-desc">
                Your committed expenses of{' '}
                <strong>₹{totalEffectiveSpent.toLocaleString('en-IN')}</strong> exceed your target
                budget of <strong>₹{totalBudget.toLocaleString('en-IN')}</strong> by{' '}
                <strong className="text-danger">
                  ₹{Math.abs(remainingBudget).toLocaleString('en-IN')}
                </strong>.
                Consider increasing your target budget or removing items from your cart.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setTempTotalBudget(totalEffectiveSpent);
                setIsEditingTotal(true);
              }}
              className="btn-secondary btn-sm warning-action-btn"
            >
              <Sparkles size={16} />
              <span>Match Budget</span>
            </button>
          </div>
        )}

        <div className="metrics-cards-grid">
          <div className="metric-card total-card">
            <div className="metric-card-top">
              <div className="metric-icon-wrap gold">
                <Wallet size={22} />
              </div>
              <button
                type="button"
                className="edit-budget-btn"
                onClick={openBudgetEditor}
                title="Change total budget"
              >
                <Edit2 size={14} />
                <span>Edit Target</span>
              </button>
            </div>
            <span className="metric-label">Target Event Budget</span>
            <h2 className="metric-amount font-serif">
              ₹{totalBudget.toLocaleString('en-IN')}
            </h2>
            <span className="metric-sub">Your total spending limit</span>
          </div>

          <div className="metric-card spent-card">
            <div className="metric-card-top">
              <div className="metric-icon-wrap rose">
                <TrendingUp size={22} />
              </div>
              <span className="metric-tag">{spentPercentage}% Utilized</span>
            </div>
            <span className="metric-label">Total Cart Expenses</span>
            <h2 className="metric-amount font-serif">
              ₹{totalEffectiveSpent.toLocaleString('en-IN')}
            </h2>
            <span className="metric-sub">
              {`${cartItems.length} cart item(s) included`}
            </span>
          </div>

          <div className={`metric-card remaining-card ${isOverBudget ? 'card-deficit' : ''}`}>
            <div className="metric-card-top">
              <div className="metric-icon-wrap green">
                <PieChart size={22} />
              </div>
              <span className="metric-tag">
                {isOverBudget ? 'Deficit' : 'Available Balance'}
              </span>
            </div>
            <span className="metric-label">Remaining Budget</span>
            <h2 className={`metric-amount font-serif ${isOverBudget ? 'text-danger' : 'text-green'}`}>
              {isOverBudget ? '-' : ''}₹{Math.abs(remainingBudget).toLocaleString('en-IN')}
            </h2>
            <span className="metric-sub">
              {isOverBudget ? 'Target budget exceeded' : 'Available for your event'}
            </span>
          </div>
        </div>

        <div className="budget-progress-box">
          <div className="progress-header">
            <span className="progress-title font-serif">Budget Utilization</span>
            <span className={`progress-percent font-serif ${isOverBudget ? 'text-danger' : ''}`}>
              {spentPercentage}% Utilized
            </span>
          </div>

          <div className="progress-track">
            <div
              className={`progress-fill ${isOverBudget ? 'progress-fill-over' : ''}`}
              style={{ width: `${Math.min(spentPercentage, 100)}%` }}
            />
          </div>

          <div className="progress-labels">
            <span>Cart Total: ₹{totalEffectiveSpent.toLocaleString('en-IN')}</span>
            <span>Target Budget: ₹{totalBudget.toLocaleString('en-IN')}</span>
          </div>

        </div>

        {/* Edit Target Budget Modal: only the total budget amount can be changed. */}
        {isEditingTotal && (
          <div className="modal-backdrop animate-fade-in" onClick={() => setIsEditingTotal(false)}>
            <div className="modal-card glass-card" onClick={(event) => event.stopPropagation()}>
              <h3 className="modal-title font-serif">Update Target Budget</h3>
              <p className="modal-sub">Enter the total budget for your event.</p>

              <form onSubmit={handleSaveTotalBudget}>
                <div className="form-group mb-20 text-left">
                  <label htmlFor="target-budget-input">Total Target Budget (₹)</label>
                  <input
                    type="number"
                    id="target-budget-input"
                    value={tempTotalBudget}
                    onChange={(event) => setTempTotalBudget(event.target.value)}
                    required
                  
                    step="1000"
                  />
                </div>

                <div className="modal-actions-row">
                  <button type="submit" className="btn-primary w-full">
                    <span>Save Target Budget</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingTotal(false)}
                    className="btn-secondary w-full"
                  >
                    <span>Cancel</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetPage;
