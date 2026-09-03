import { useState, useEffect, useMemo } from 'react';
import { expenseService, userService } from '../services/api';

const ExpenseForm = ({ onExpenseAdded, selectedDate }) => {
  // Form States
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");

  // Income & Budget States
  const [income, setIncome] = useState({ monthly_income: 0, annual_income: 0, monthly_budget: 0 });
  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const [incomeFormData, setIncomeFormData] = useState({ monthlyIncome: '', annualIncome: '', monthlyBudget: '' });
  
  // Expenses State (needed to calculate monthly total)
  const [allExpenses, setAllExpenses] = useState([]);

  // Fetch initial data
  const fetchData = async () => {
    try {
      const [profileRes, expensesRes] = await Promise.all([
        userService.getProfile(),
        expenseService.getAll()
      ]);
      
      setIncome(profileRes.data);
      setIncomeFormData({ 
        monthlyIncome: profileRes.data.monthly_income || '', 
        annualIncome: profileRes.data.annual_income || '',
        monthlyBudget: profileRes.data.monthly_budget || ''
      });
      setAllExpenses(expensesRes.data);
    } catch (err) {
      console.error("Error loading profile or expenses:", err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate current month's total spending
  const spentThisMonth = useMemo(() => {
    const today = new Date();
    return allExpenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === today.getMonth() && expDate.getFullYear() === today.getFullYear();
    }).reduce((sum, curr) => sum + Number(curr.amount), 0);
  }, [allExpenses]);

  // Calculate Progress Bar metrics
  const budgetLimit = Number(income.monthly_budget) || 0;
  const progressPercentage = budgetLimit > 0 ? (spentThisMonth / budgetLimit) * 100 : 0;
  const clampedProgress = Math.min(progressPercentage, 100);
  
  // Dynamic color logic
  let progressColor = 'var(--primary)';
  if (progressPercentage >= 85) progressColor = '#ef4444';
  else if (progressPercentage >= 50) progressColor = '#f59e0b';

  // Handlers
  const handleIncomeUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await userService.updateIncome(incomeFormData);
      setIncome({ 
        monthly_income: res.data.monthly_income, 
        annual_income: res.data.annual_income,
        monthly_budget: res.data.monthly_budget 
      });
      setIsEditingIncome(false);
    } catch (err) {
      console.error("Error updating profile details:", err.message);
      alert("Error updating profile details.");
    }
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = { description, amount: Number(amount), category, date: selectedDate };
      await expenseService.add(body);
      
      onExpenseAdded(); 
      fetchData();
      
      setDescription("");
      setAmount("");
    } catch (err) {
      console.error("Error adding expense:", err.message);
    }
  };

  return (
    <div className="expense-form-wrapper">
      {/* 💰 Profile & Budget Section */}
      <div className="profile-card">
        <div className="profile-header">
          <div>
            <h3 className="profile-title">💰 Financial Profile</h3>
            {!isEditingIncome && (
              <p className="profile-income-text">
                Income: <span className="income-amount">₹{income.monthly_income || 0}</span> / mo
              </p>
            )}
          </div>
          {!isEditingIncome && (
            <button 
              type="button" 
              onClick={() => setIsEditingIncome(true)} 
              className="edit-profile-btn"
            >
              Edit
            </button>
          )}
        </div>

        {isEditingIncome ? (
          <form onSubmit={handleIncomeUpdate} className="profile-edit-form">
            <div className="profile-inputs-row">
              <div className="input-field-group">
                <label className="input-label">Monthly Income (₹)</label>
                <input 
                  type="number" 
                  value={incomeFormData.monthlyIncome} 
                  onChange={(e) => setIncomeFormData({ ...incomeFormData, monthlyIncome: e.target.value })} 
                  required 
                />
              </div>
              <div className="input-field-group">
                <label className="input-label">Monthly Budget (₹)</label>
                <input 
                  type="number" 
                  value={incomeFormData.monthlyBudget} 
                  onChange={(e) => setIncomeFormData({ ...incomeFormData, monthlyBudget: e.target.value })} 
                  placeholder="Target spending limit" 
                  required 
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="save-btn">Save</button>
              <button 
                type="button" 
                onClick={() => setIsEditingIncome(false)} 
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          /* The Dynamic Progress Bar */
          budgetLimit > 0 && (
            <div className="budget-container">
              <div className="budget-header">
                <div className="budget-labels">
                  <span className="budget-title">Monthly Budget</span>
                  <div className="budget-amounts">
                    ₹{spentThisMonth.toFixed(0)} <span className="budget-limit-text">/ ₹{budgetLimit}</span>
                  </div>
                </div>
                <span className="budget-percent" style={{ color: progressColor }}>
                  {progressPercentage.toFixed(0)}%
                </span>
              </div>
              
              <div className="progress-track">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${clampedProgress}%`, 
                    backgroundColor: progressColor 
                  }} 
                />
              </div>

              {progressPercentage >= 85 && (
                <div className="budget-warning" style={{ color: progressColor }}>
                  {progressPercentage >= 100 ? "⚠️ You have exceeded your monthly budget." : "⚠️ You are nearing your budget limit."}
                </div>
              )}
            </div>
          )
        )}
      </div>

      <hr className="form-divider" />

      {/* 🧾 Expense Entry Form */}
      <form onSubmit={onSubmitForm} className="add-expense-form">
        <input 
          type="text" 
          placeholder="Description" 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
          required 
        />
        <input 
          type="number" 
          placeholder="Amount" 
          value={amount} 
          onChange={e => setAmount(e.target.value)} 
          required 
        />
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Shopping">Shopping</option>
          <option value="Other">Other</option>
        </select>
        <button type="submit" className="submit-expense-btn">Add Expense</button>
      </form>
    </div>
  );
};

export default ExpenseForm;