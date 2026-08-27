
import React from 'react';
import {
  Wallet,
  PieChart,
  TrendingUp,
  Plus
} from 'lucide-react';
import BudgetCard from '../components/BudgetCard';

import { staticBudgetMetrics } from '../data/eventsData';
import './BudgetPage.css';

const BudgetPage = () => {
  const { totalBudget, spent, remaining, expenses } = staticBudgetMetrics;


  const spentPercentage = Math.round((spent / totalBudget) * 100);

  return (
    <div className="budget-page page-section">
      <div className="container">

        {/* Header */}
        <div className="budget-header text-center">
          <span className="badge-gold">Financial Overview</span>

          <h1 className="section-title font-serif">
            Budget Management
          </h1>

          <p className="section-subtitle">
            Track allocated funds, vendor payments, and remaining balances
            for your celebration.
          </p>
        </div>

        {/* Metrics Dashboard Cards */}
        <div className="metrics-cards-grid">

          {/* Total Budget */}
          <div className="metric-card total-card">
            <div className="metric-card-top">
              <div className="metric-icon-wrap gold">
                <Wallet size={22} />
              </div>

              <span className="metric-tag">
                Allocated
              </span>
            </div>

            <span className="metric-label">
              Total Budget
            </span>

            <h2 className="metric-amount font-serif">
              ₹{totalBudget.toLocaleString('en-IN')}
            </h2>

            <span className="metric-sub">
              Base Target Budget
            </span>
          </div>

          {/* Total Spent */}
          <div className="metric-card spent-card">
            <div className="metric-card-top">
              <div className="metric-icon-wrap rose">
                <TrendingUp size={22} />
              </div>

              <span className="metric-tag">
                Utilized
              </span>
            </div>

            <span className="metric-label">
              Total Spent
            </span>

            <h2 className="metric-amount font-serif">
              ₹{spent.toLocaleString('en-IN')}
            </h2>

            <span className="metric-sub">
              {spentPercentage}% of allocated budget
            </span>
          </div>

          {/* Remaining Budget */}
          <div className="metric-card remaining-card">
            <div className="metric-card-top">
              <div className="metric-icon-wrap green">
                <PieChart size={22} />
              </div>

              <span className="metric-tag">
                Available
              </span>
            </div>

            <span className="metric-label">
              Remaining Budget
            </span>

            <h2 className="metric-amount font-serif">
              ₹{remaining.toLocaleString('en-IN')}
            </h2>

            <span className="metric-sub">
              Safe balance remaining
            </span>
          </div>

        </div>

        {/* Spending Progress Bar */}
        <div className="budget-progress-box">

          <div className="progress-header">
            <span className="progress-title font-serif">
              Budget Utilization Breakdown
            </span>

            <span className="progress-percent font-serif">
              {spentPercentage}% Spent
            </span>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${spentPercentage}%` }}
            />
          </div>

          <div className="progress-labels">
            <span>
              Spent: ₹{spent.toLocaleString('en-IN')}
            </span>

            <span>
              Total Target: ₹{totalBudget.toLocaleString('en-IN')}
            </span>
          </div>

        </div>

        {/* Expense Categories */}
        <div className="expense-section">

          <div className="expense-header">

            <div>
              <h2 className="expense-section-title font-serif">
                Expense Allocation by Category
              </h2>

              <p className="expense-section-sub">
                Static preview of vendor cost distributions
              </p>
            </div>

            <button className="btn-secondary static-btn">
              <Plus size={16} />
              <span>Add Expense</span>
            </button>

          </div>

          <div className="expense-cards-grid">

            {expenses.map((exp) => (
              <BudgetCard
                key={exp.id}
                category={{
                  name: exp.category,
                  spent: exp.spent,
                  allocated: exp.allocated,
                  icon: exp.icon,
                  color: exp.color,
                }}
              />
            ))}

          </div>

        </div>

      </div>
    </div>
  );
};

export default BudgetPage;
