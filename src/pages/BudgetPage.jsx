import { useState, useEffect, useMemo } from 'react';
import {
  Wallet,
  PieChart,
  TrendingUp,
  Plus,
  RotateCcw,
  AlertTriangle,
  Edit2,
  Sparkles,
} from 'lucide-react';
import BudgetCard from '../components/BudgetCard';
import { staticBudgetMetrics } from '../data/eventsData';
import { useSelector } from 'react-redux';
import { selectCartGrandTotal, selectCartItems } from '../store/cartSlice';
import { useToast } from '../context/ToastContext';
import './BudgetPage.css';

const BUDGET_STORAGE_KEY = 'eventease_budget';

const DEFAULT_CATEGORY_ICONS = ['🏛️', '🌸', '🍷', '📸', '🎶', '💌', '🎂', '✨', '🚗', '👗'];

const BudgetPage = () => {
  const { addToast } = useToast();
  const cartGrandTotal = useSelector(selectCartGrandTotal);
  const cartItems = useSelector(selectCartItems);

  // Budget data state initialized from localStorage
  const [budgetData, setBudgetData] = useState(() => {
    try {
      const saved = localStorage.getItem(BUDGET_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.expenses && Array.isArray(parsed.expenses)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return staticBudgetMetrics;
  });

  // Include Cart Commitment toggle
  const [includeCartCommitment, setIncludeCartCommitment] = useState(true);

  // Edit target budget modal
  const [isEditingTotal, setIsEditingTotal] = useState(false);
  const [tempTotalBudget, setTempTotalBudget] = useState(budgetData.totalBudget);

  // Add / Edit Category Modal state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryIcon, setCategoryIcon] = useState('✨');
  const [categoryAllocated, setCategoryAllocated] = useState('');
  const [categorySpent, setCategorySpent] = useState('');
  const [categoryColor, setCategoryColor] = useState('#E91E63');

  // Persist to localStorage whenever budgetData changes
  useEffect(() => {
    try {
      localStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(budgetData));
    } catch (e) {
      console.error('Failed to persist budget data:', e);
    }
  }, [budgetData]);

  // Derived calculations
  const totalAllocated = useMemo(() => {
    return budgetData.expenses.reduce((sum, item) => sum + (Number(item.allocated) || 0), 0);
  }, [budgetData.expenses]);

  const directExpensesSpent = useMemo(() => {
    return budgetData.expenses.reduce((sum, item) => sum + (Number(item.spent) || 0), 0);
  }, [budgetData.expenses]);

  const totalEffectiveSpent = useMemo(() => {
    return directExpensesSpent + (includeCartCommitment ? cartGrandTotal : 0);
  }, [directExpensesSpent, includeCartCommitment, cartGrandTotal]);

  const remainingBudget = budgetData.totalBudget - totalEffectiveSpent;
  const isOverBudget = remainingBudget < 0;
  const spentPercentage = budgetData.totalBudget > 0
    ? Math.round((totalEffectiveSpent / budgetData.totalBudget) * 100)
    : 0;

  // Handle Target Budget Update
  const handleSaveTotalBudget = (e) => {
    e.preventDefault();
    const val = Number(tempTotalBudget);
    if (val <= 0 || isNaN(val)) {
      addToast('Please enter a valid positive budget amount', 'error');
      return;
    }
    setBudgetData((prev) => ({ ...prev, totalBudget: val }));
    setIsEditingTotal(false);
    addToast(`Target budget updated to ₹${val.toLocaleString('en-IN')}`, 'success');
  };

  // Open modal to add category
  const openAddCategoryModal = () => {
    setEditingCategoryId(null);
    setCategoryName('');
    setCategoryIcon('✨');
    setCategoryAllocated('');
    setCategorySpent('');
    setCategoryColor('#E91E63');
    setIsCategoryModalOpen(true);
  };

  // Open modal to edit existing category
  const openEditCategoryModal = (cat) => {
    setEditingCategoryId(cat.id);
    setCategoryName(cat.category || cat.name);
    setCategoryIcon(cat.icon || '✨');
    setCategoryAllocated(cat.allocated.toString());
    setCategorySpent(cat.spent.toString());
    setCategoryColor(cat.color || '#E91E63');
    setIsCategoryModalOpen(true);
  };

  // Save (Add or Update) Category
  const handleSaveCategory = (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      addToast('Category name is required', 'error');
      return;
    }
    const allocatedNum = Number(categoryAllocated) || 0;
    const spentNum = Number(categorySpent) || 0;

    if (editingCategoryId) {
      // Update existing
      setBudgetData((prev) => ({
        ...prev,
        expenses: prev.expenses.map((item) =>
          item.id === editingCategoryId
            ? {
                ...item,
                category: categoryName.trim(),
                name: categoryName.trim(),
                icon: categoryIcon,
                allocated: allocatedNum,
                spent: spentNum,
                color: categoryColor,
              }
            : item
        ),
      }));
      addToast(`Category "${categoryName}" updated!`, 'success');
    } else {
      // Add new
      const newCat = {
        id: Date.now(),
        category: categoryName.trim(),
        name: categoryName.trim(),
        icon: categoryIcon,
        allocated: allocatedNum,
        spent: spentNum,
        color: categoryColor,
        status: spentNum >= allocatedNum ? 'Paid' : 'Pending',
      };
      setBudgetData((prev) => ({
        ...prev,
        expenses: [...prev.expenses, newCat],
      }));
      addToast(`New category "${categoryName}" added!`, 'success');
    }

    setIsCategoryModalOpen(false);
  };

  // Delete Category
  const handleDeleteCategory = (id) => {
    if (window.confirm('Are you sure you want to delete this expense category?')) {
      setBudgetData((prev) => ({
        ...prev,
        expenses: prev.expenses.filter((item) => item.id !== id),
      }));
      addToast('Expense category removed', 'info');
    }
  };

  // Reset to Defaults
  const handleResetDefaults = () => {
    if (window.confirm('Reset all budget numbers and categories to default settings?')) {
      setBudgetData(staticBudgetMetrics);
      setTempTotalBudget(staticBudgetMetrics.totalBudget);
      addToast('Budget reset to default values', 'info');
    }
  };

  return (
    <div className="budget-page page-section">
      <div className="container">
        {/* Header */}
        <div className="budget-header text-center">
          <span className="badge-gold">Interactive Financial Tracker</span>
          <h1 className="section-title font-serif">Budget Management & Calculator</h1>
          <p className="section-subtitle">
            Plan, customize, and balance your celebration expenses. Track vendor allocations,
            account for cart packages, and ensure your celebration stays within financial targets.
          </p>
        </div>

        {/* OVER-BUDGET ALERT BANNER */}
        {isOverBudget && (
          <div className="budget-warning-banner animate-fade-in">
            <AlertTriangle className="warning-icon" size={24} />
            <div className="warning-text">
              <h4 className="warning-title">Budget Limit Exceeded!</h4>
              <p className="warning-desc">
                Your committed expenses of{' '}
                <strong>₹{totalEffectiveSpent.toLocaleString('en-IN')}</strong> exceed your allocated
                target budget of{' '}
                <strong>₹{budgetData.totalBudget.toLocaleString('en-IN')}</strong> by{' '}
                <strong className="text-danger">
                  ₹{Math.abs(remainingBudget).toLocaleString('en-IN')}
                </strong>
                . Consider increasing your budget or adjusting categories below.
              </p>
            </div>
            <button
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

        {/* METRICS DASHBOARD CARDS */}
        <div className="metrics-cards-grid">
          {/* Total Budget Card */}
          <div className="metric-card total-card">
            <div className="metric-card-top">
              <div className="metric-icon-wrap gold">
                <Wallet size={22} />
              </div>
              <button
                type="button"
                className="edit-budget-btn"
                onClick={() => {
                  setTempTotalBudget(budgetData.totalBudget);
                  setIsEditingTotal(true);
                }}
                title="Change total budget"
              >
                <Edit2 size={14} />
                <span>Edit Target</span>
              </button>
            </div>

            <span className="metric-label">Target Event Budget</span>
            <h2 className="metric-amount font-serif">
              ₹{budgetData.totalBudget.toLocaleString('en-IN')}
            </h2>
            <span className="metric-sub">Allocated Categories: ₹{totalAllocated.toLocaleString('en-IN')}</span>
          </div>

          {/* Total Committed Spent */}
          <div className="metric-card spent-card">
            <div className="metric-card-top">
              <div className="metric-icon-wrap rose">
                <TrendingUp size={22} />
              </div>
              <span className="metric-tag">{spentPercentage}% Utilized</span>
            </div>

            <span className="metric-label">Total Committed Expenses</span>
            <h2 className="metric-amount font-serif">
              ₹{totalEffectiveSpent.toLocaleString('en-IN')}
            </h2>
            <span className="metric-sub">
              Direct: ₹{directExpensesSpent.toLocaleString('en-IN')}
              {includeCartCommitment && cartGrandTotal > 0
                ? ` + Cart: ₹${cartGrandTotal.toLocaleString('en-IN')}`
                : ''}
            </span>
          </div>

          {/* Remaining Balance Card */}
          <div className={`metric-card remaining-card ${isOverBudget ? 'card-deficit' : ''}`}>
            <div className="metric-card-top">
              <div className="metric-icon-wrap green">
                <PieChart size={22} />
              </div>
              <span className="metric-tag">
                {isOverBudget ? 'Deficit' : 'Available Balance'}
              </span>
            </div>

            <span className="metric-label">Remaining Safe Budget</span>
            <h2 className={`metric-amount font-serif ${isOverBudget ? 'text-danger' : 'text-green'}`}>
              {isOverBudget ? '-' : ''}₹{Math.abs(remainingBudget).toLocaleString('en-IN')}
            </h2>
            <span className="metric-sub">
              {isOverBudget ? 'Exceeded target budget limit' : 'Safe reserve for unexpected costs'}
            </span>
          </div>
        </div>

        {/* PROGRESS BAR & CONTROLS BOX */}
        <div className="budget-progress-box">
          <div className="progress-header">
            <span className="progress-title font-serif">Budget Utilization Breakdown</span>
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
            <span>Spent / Committed: ₹{totalEffectiveSpent.toLocaleString('en-IN')}</span>
            <span>Target Budget: ₹{budgetData.totalBudget.toLocaleString('en-IN')}</span>
          </div>

          {/* Cart Integration Switch */}
          <div className="cart-sync-toggle-row">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={includeCartCommitment}
                onChange={(e) => setIncludeCartCommitment(e.target.checked)}
              />
              <span className="checkmark"></span>
              <span className="sync-text">
                Include Active Cart Reserved Packages (
                <strong>
                  {cartItems.length} items • ₹{cartGrandTotal.toLocaleString('en-IN')}
                </strong>
                ) in budget calculations
              </span>
            </label>
          </div>
        </div>

        {/* EXPENSE CATEGORIES SECTION */}
        <div className="expense-section">
          <div className="expense-header">
            <div>
              <h2 className="expense-section-title font-serif">Expense Allocation by Category</h2>
              <p className="expense-section-sub">
                Customize allocated and spent amounts for every celebration department.
              </p>
            </div>

            <div className="expense-header-actions">
              <button
                type="button"
                onClick={handleResetDefaults}
                className="btn-outline btn-sm reset-btn"
                title="Reset to defaults"
              >
                <RotateCcw size={14} />
                <span>Reset Defaults</span>
              </button>

              <button
                type="button"
                onClick={openAddCategoryModal}
                className="btn-primary btn-sm"
              >
                <Plus size={16} />
                <span>Add Expense Category</span>
              </button>
            </div>
          </div>

          <div className="expense-cards-grid">
            {budgetData.expenses.map((exp) => (
              <BudgetCard
                key={exp.id}
                category={{
                  id: exp.id,
                  name: exp.category || exp.name,
                  spent: exp.spent,
                  allocated: exp.allocated,
                  icon: exp.icon,
                  color: exp.color,
                }}
                onEdit={openEditCategoryModal}
                onDelete={handleDeleteCategory}
              />
            ))}
          </div>
        </div>

        {/* EDIT TARGET BUDGET MODAL */}
        {isEditingTotal && (
          <div className="modal-backdrop animate-fade-in" onClick={() => setIsEditingTotal(false)}>
            <div className="modal-card glass-card" onClick={(e) => e.stopPropagation()}>
              <h3 className="modal-title font-serif">Update Target Budget</h3>
              <p className="modal-sub">Enter the total budget ceiling for your celebration event.</p>

              <form onSubmit={handleSaveTotalBudget}>
                <div className="form-group mb-20 text-left">
                  <label htmlFor="target-budget-input">Total Target Budget (₹)</label>
                  <input
                    type="number"
                    id="target-budget-input"
                    value={tempTotalBudget}
                    onChange={(e) => setTempTotalBudget(e.target.value)}
                    required
                    min="1000"
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

        {/* ADD / EDIT CATEGORY MODAL */}
        {isCategoryModalOpen && (
          <div
            className="modal-backdrop animate-fade-in"
            onClick={() => setIsCategoryModalOpen(false)}
          >
            <div className="modal-card glass-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-row">
                <h3 className="modal-title font-serif">
                  {editingCategoryId ? 'Edit Expense Category' : 'Add Expense Category'}
                </h3>
                <button
                  type="button"
                  className="modal-close-x"
                  onClick={() => setIsCategoryModalOpen(false)}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="category-form text-left">
                <div className="form-group mb-16">
                  <label htmlFor="cat-name">Category Name *</label>
                  <input
                    type="text"
                    id="cat-name"
                    required
                    placeholder="e.g. Stage Floral Arch, DJ & Sound, Return Favors"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                  />
                </div>

                <div className="form-group mb-16">
                  <label>Select Category Icon</label>
                  <div className="icon-picker-row">
                    {DEFAULT_CATEGORY_ICONS.map((ico) => (
                      <button
                        key={ico}
                        type="button"
                        className={`icon-choice-btn ${categoryIcon === ico ? 'active' : ''}`}
                        onClick={() => setCategoryIcon(ico)}
                      >
                        {ico}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="category-amounts-row mb-20">
                  <div className="form-group flex-1">
                    <label htmlFor="cat-allocated">Allocated Budget (₹) *</label>
                    <input
                      type="number"
                      id="cat-allocated"
                      required
                      min="0"
                      step="500"
                      placeholder="15000"
                      value={categoryAllocated}
                      onChange={(e) => setCategoryAllocated(e.target.value)}
                    />
                  </div>

                  <div className="form-group flex-1">
                    <label htmlFor="cat-spent">Already Spent (₹)</label>
                    <input
                      type="number"
                      id="cat-spent"
                      min="0"
                      step="500"
                      placeholder="5000"
                      value={categorySpent}
                      onChange={(e) => setCategorySpent(e.target.value)}
                    />
                  </div>
                </div>

                <div className="modal-actions-row">
                  <button type="submit" className="btn-primary w-full">
                    <span>{editingCategoryId ? 'Save Changes' : 'Add Category'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(false)}
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
