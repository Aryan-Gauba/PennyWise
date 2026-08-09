import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Ensure axios passes along session cookies for passport authentication
const axiosConfig = { credentials: true };

const ExpenseForm = ({ onExpenseAdded, selectedDate }) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");

  // 💰 Income Tracker States
  const [income, setIncome] = useState({ monthly_income: 0, annual_income: 0 });
  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const [incomeFormData, setIncomeFormData] = useState({ monthlyIncome: '', annualIncome: '' });

  // Fetch current user income profile on component mount
  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/user/profile`, axiosConfig)
      .then(res => {
        setIncome(res.data);
        setIncomeFormData({ 
          monthlyIncome: res.data.monthly_income || '', 
          annualIncome: res.data.annual_income || '' 
        });
      })
      .catch(err => console.error("Error loading income profile:", err.message));
  }, []);

  // Handle Income Update submission
  const handleIncomeUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/user/update-income`, incomeFormData, axiosConfig);
      setIncome({ monthly_income: res.data.monthly_income, annual_income: res.data.annual_income });
      setIsEditingIncome(false);
    } catch (err) {
      console.error("Error updating income profile details:", err.message);
      alert("Error updating income profile details.");
    }
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = { 
        description, 
        amount: Number(amount), 
        category, 
        date: selectedDate 
      };
      
      await axios.post(`${API_BASE_URL}/api/expenses`, body, axiosConfig);
      
      onExpenseAdded(); 
      setDescription("");
      setAmount("");
    } catch (err) {
      console.error("Error adding expense:", err.message);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      
      {/* 💰 Income Profile Section Card */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.5)',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid var(--border-light)',
        borderLeft: '4px solid var(--primary)',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ flexGrow: 1 }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-main)' }}>💰 Your Income Profile</h3>
            {!isEditingIncome && (
              <p style={{ margin: '8px 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Monthly: <span style={{ fontWeight: '600', color: 'var(--primary)' }}>₹{income.monthly_income}</span> | 
                Annual: <span style={{ fontWeight: '600', color: 'var(--primary)' }}>₹{income.annual_income}</span>
              </p>
            )}
          </div>
          {!isEditingIncome && (
            <button 
              type="button"
              onClick={() => setIsEditingIncome(true)} 
              style={{
                padding: '6px 12px',
                fontSize: '0.85rem'
              }}
            >
              Edit Income
            </button>
          )}
        </div>

        {isEditingIncome && (
          <form onSubmit={handleIncomeUpdate} style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '150px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Monthly Income (₹)</label>
                <input 
                  type="number" 
                  value={incomeFormData.monthlyIncome}
                  onChange={(e) => setIncomeFormData({ ...incomeFormData, monthlyIncome: e.target.value })}
                  required
                />
              </div>
              <div style={{ flex: 1, minWidth: '150px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Annual Income (₹)</label>
                <input 
                  type="number" 
                  value={incomeFormData.annualIncome}
                  onChange={(e) => setIncomeFormData({ ...incomeFormData, annualIncome: e.target.value })}
                  placeholder="Auto-calculates if empty"
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button type="submit" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Save</button>
              <button 
                type="button" 
                onClick={() => setIsEditingIncome(false)} 
                style={{ padding: '8px 16px', fontSize: '0.9rem', background: 'transparent', border: '1px solid var(--border-light)', color: 'var(--text-main)' }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <hr style={{ border: '0', height: '1px', background: 'var(--border-light)', marginBottom: '24px' }} />

      {/* 🧾 Original Expense Form */}
      <form onSubmit={onSubmitForm} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
        <button type="submit" style={{ marginTop: '8px' }}>Add Expense</button>
      </form>
    </div>
  );
};

export default ExpenseForm;