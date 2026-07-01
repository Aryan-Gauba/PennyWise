// import { useState } from 'react';
// import axios from 'axios';

// const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// // Destructure selectedDate from props here
// const ExpenseForm = ({ onExpenseAdded, selectedDate }) => {
//   const [description, setDescription] = useState("");
//   const [amount, setAmount] = useState("");
//   const [category, setCategory] = useState("Food");

//   const onSubmitForm = async (e) => {
//     e.preventDefault();
//     try {
//       const body = { 
//         description, 
//         amount: Number(amount), 
//         category, 
//         date: selectedDate // Now this variable is properly defined
//       };
      
//       // Post to the backend
//       await axios.post(`${API_BASE_URL}/api/expenses`, body);
      
//       onExpenseAdded(); 
//       setDescription("");
//       setAmount("");
//     } catch (err) {
//       console.error("Error adding expense:", err.message);
//     }
//   };

//   return (
//     <form className="expense-form" onSubmit={onSubmitForm}>
//       <input 
//         type="text" 
//         placeholder="Description" 
//         value={description} 
//         onChange={e => setDescription(e.target.value)} 
//         required 
//       />
//       <input 
//         type="number" 
//         placeholder="Amount" 
//         value={amount} 
//         onChange={e => setAmount(e.target.value)} 
//         required 
//       />
//       <select value={category} onChange={e => setCategory(e.target.value)}>
//         <option value="Food">Food</option>
//         <option value="Transport">Transport</option>
//         <option value="Entertainment">Entertainment</option>
//         <option value="Shopping">Shopping</option>
//         <option value="Other">Other</option>
//       </select>
//       <button type="submit">Add</button>
//     </form>
//   );
// };

// export default ExpenseForm;

import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Ensure axios passes along session cookies for passport authentication
const axiosConfig = { credentials: true };

// Destructure selectedDate from props here
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
        date: selectedDate // Now this variable is properly defined
      };
      
      // Post to the backend
      await axios.post(`${API_BASE_URL}/api/expenses`, body, axiosConfig);
      
      onExpenseAdded(); 
      setDescription("");
      setAmount("");
    } catch (err) {
      console.error("Error adding expense:", err.message);
    }
  };

  return (
    <div className="expense-form-container" style={{ width: '100%', marginBottom: '20px' }}>
      
      {/* 💰 Income Profile Section Card */}
      <div style={{
        background: '#fff',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        borderTop: '4px solid #22c55e',
        marginBottom: '20px',
        color: '#333'
      }}>
        <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ flexGrow: 1 }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>💰 Your Income Profile</h3>
            {!isEditingIncome && (
              <p style={{ margin: '4px 0 0 0', color: '#666' }}>
                Monthly: <span style={{ fontWeight: '600', color: '#16a34a' }}>₹{income.monthly_income}</span> | 
                Annual: <span style={{ fontWeight: '600', color: '#16a34a' }}>₹{income.annual_income}</span>
              </p>
            )}
          </div>
          {!isEditingIncome && (
            <button 
              type="button"
              onClick={() => setIsEditingIncome(true)} 
              style={{
                padding: '6px 12px',
                background: '#3b82f6',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Edit Income
            </button>
          )}
        </div>

        {isEditingIncome && (
          <form onSubmit={handleIncomeUpdate} style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '150px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '4px' }}>Monthly Income (₹)</label>
                <input 
                  type="number" 
                  value={incomeFormData.monthlyIncome}
                  onChange={(e) => setIncomeFormData({ ...incomeFormData, monthlyIncome: e.target.value })}
                  style={{ width: '100%', padding: '6px', border: '1px solid #ccc', borderRadius: '4px', color: '#000' }} 
                  required
                />
              </div>
              <div style={{ flex: 1, minWidth: '150px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '4px' }}>Annual Income (₹)</label>
                <input 
                  type="number" 
                  value={incomeFormData.annualIncome}
                  onChange={(e) => setIncomeFormData({ ...incomeFormData, annualIncome: e.target.value })}
                  style={{ width: '100%', padding: '6px', border: '1px solid #ccc', borderRadius: '4px', color: '#000' }} 
                  placeholder="Optional (Auto-calculates)"
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button type="submit" style={{ padding: '6px 12px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
              <button type="button" onClick={() => setIsEditingIncome(false)} style={{ padding: '6px 12px', background: '#e5e7eb', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </form>
        )}
      </div>

      <hr style={{ border: '0', height: '1px', background: '#e5e7eb', marginBottom: '20px' }} />

      {/* 🧾 Original Expense Form */}
      <form className="expense-form" onSubmit={onSubmitForm}>
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
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default ExpenseForm;