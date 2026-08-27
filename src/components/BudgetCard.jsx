import React from 'react';
import './BudgetCard.css';

const BudgetCard = ({ category }) => {
    const percentage = category.allocated > 0
        ? Math.round((category.spent / category.allocated) * 100)
        : 0;

    return (
        <div className="budget-card glass-card">
            <div className="budget-card-header">
                <div className="budget-icon-bg" style={{ backgroundColor: `${category.color}20`, borderColor: category.color }}>
                    <span className="budget-icon">{category.icon}</span>
                </div>
                <div className="budget-title-area">
                    <h4 className="budget-name">{category.name}</h4>
                    <span className="budget-percentage" style={{ color: category.color }}>
                        {percentage}% spent
                    </span>
                </div>
            </div>
            {/* Progress Bar Container */}
            <div className="progress-bar-container">
                <div
                    className="progress-bar-fill"
                    style={{
                        width: `${Math.min(percentage, 100)}%`,
                        backgroundColor: category.color
                    }}
                ></div>
            </div>

            <div className="budget-figures">
                <div className="figure-box">
                    <span className="figure-label">Spent</span>
                    <span className="figure-value spent">₹{category.spent.toLocaleString('en-IN')}</span>
                </div>
                <div className="figure-divider">/</div>
                <div className="figure-box">
                    <span className="figure-label">Allocated</span>
                    <span className="figure-value allocated">₹{category.allocated.toLocaleString('en-IN')}</span>
                </div>
            </div>


        </div>
    );
};

export default BudgetCard;