import { Edit2, Trash2 } from 'lucide-react';
import './BudgetCard.css';

const BudgetCard = ({ category, onEdit, onDelete }) => {
  const allocated = Number(category.allocated) || 0;
  const spent = Number(category.spent) || 0;
  const percentage = allocated > 0 ? Math.round((spent / allocated) * 100) : 0;
  const isOver = spent > allocated && allocated > 0;

  return (
    <div className={`budget-card glass-card ${isOver ? 'card-over-budget' : ''}`}>
      <div className="budget-card-header">
        <div
          className="budget-icon-bg"
          style={{
            backgroundColor: `${category.color || '#E91E63'}20`,
            borderColor: category.color || '#E91E63',
          }}
        >
          <span className="budget-icon">{category.icon || '✨'}</span>
        </div>

        <div className="budget-title-area">
          <h4 className="budget-name">{category.name}</h4>
          <span
            className="budget-percentage"
            style={{ color: isOver ? 'var(--color-coral-dark)' : category.color }}
          >
            {percentage}% spent {isOver && '(Over Allocated!)'}
          </span>
        </div>

        <div className="budget-card-actions">
          {onEdit && (
            <button
              type="button"
              className="card-action-btn"
              onClick={() => onEdit(category)}
              title="Edit expense amounts"
            >
              <Edit2 size={14} />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              className="card-action-btn delete-btn"
              onClick={() => onDelete(category.id)}
              title="Delete category"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="progress-bar-container">
        <div
          className="progress-bar-fill"
          style={{
            width: `${Math.min(percentage, 100)}%`,
            backgroundColor: isOver ? 'var(--color-coral-dark)' : category.color || 'var(--color-gold)',
          }}
        />
      </div>

      <div className="budget-figures">
        <div className="figure-box">
          <span className="figure-label">Spent</span>
          <span className="figure-value spent">₹{spent.toLocaleString('en-IN')}</span>
        </div>
        <div className="figure-divider">/</div>
        <div className="figure-box">
          <span className="figure-label">Allocated</span>
          <span className="figure-value allocated">₹{allocated.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;