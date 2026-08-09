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
  const clampedProgress = Math.min(progressPercentage, 100); // Prevents bar from overflowing
  
  // Dynamic color logic
  let progressColor = 'var(--primary)'; // Green
  if (progressPercentage >= 85) progressColor = '#ef4444'; // Red
  else if (progressPercentage >= 50) progressColor = '#f59e0b'; // Yellow/Orange

  // Handlers
  const handleIncomeUpdate = async (e) => {
    e.preventDefault();
    try {
      // Ensure your backend /api/user/update-income route is updated to save monthlyBudget!
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
      fetchData(); // Refresh all expenses to update the progress bar instantly
      
      setDescription("");
      setAmount("");
    } catch (err) {
      console.error("Error adding expense:", err.message);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      
      {/* 💰 Profile & Budget Section */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.5)', padding: '20px', borderRadius: '12px',
        border: '1px solid var(--border-light)', borderLeft: '4px solid var(--primary)', marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-main)' }}>💰 Financial Profile</h3>
            {!isEditingIncome && (
              <p style={{ margin: '8px 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Income: <span style={{ fontWeight: '600', color: 'var(--primary)' }}>₹{income.monthly_income || 0}</span> / mo
              </p>
            )}
          </div>
          {!isEditingIncome && (
            <button type="button" onClick={() => setIsEditingIncome(true)} style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
              Edit
            </button>
          )}
        </div>

        {isEditingIncome ? (
          <form onSubmit={handleIncomeUpdate} style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '140px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Monthly Income (₹)</label>
                <input type="number" value={incomeFormData.monthlyIncome} onChange={(e) => setIncomeFormData({ ...incomeFormData, monthlyIncome: e.target.value })} required />
              </div>
              <div style={{ flex: 1, minWidth: '140px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Monthly Budget (₹)</label>
                <input type="number" value={incomeFormData.monthlyBudget} onChange={(e) => setIncomeFormData({ ...incomeFormData, monthlyBudget: e.target.value })} placeholder="Target spending limit" required />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button type="submit" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Save</button>
              <button type="button" onClick={() => setIsEditingIncome(false)} style={{ padding: '8px 16px', fontSize: '0.9rem', background: 'transparent', border: '1px solid var(--border-light)', color: 'var(--text-main)' }}>Cancel</button>
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
                    ₹{spentThisMonth.toFixed(0)} <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>/ ₹{budgetLimit}</span>
                  </div>
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: '600', color: progressColor }}>
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

      <hr style={{ border: '0', height: '1px', background: 'var(--border-light)', marginBottom: '24px' }} />

      {/* 🧾 Expense Entry Form */}
      <form onSubmit={onSubmitForm} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />
        <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} required />
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Shopping">Shopping</option>
          <option value="Other">Other</option>
        </select>
        <button type="submit" style={{ marginTop: '8px' }}>Add Expense</button>
      </form>
    </div>
  );
};

export default ExpenseForm;