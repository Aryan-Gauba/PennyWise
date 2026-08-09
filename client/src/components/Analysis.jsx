import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, CartesianGrid, LineChart, Line, Legend 
} from 'recharts';
import '../App.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Analysis = () => {
  const [expenses, setExpenses] = useState([]);
  
  // Independent filters for each chart
  const [trendFilter, setTrendFilter] = useState('monthly'); // Line Chart (Groups data)
  const [barFilter, setBarFilter] = useState('all');         // Bar Chart (Filters data range)
  const [pieFilter, setPieFilter] = useState('all');         // Pie Chart (Filters data range)
  
  const [userPrompt, setUserPrompt] = useState("");
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/expenses`).then(res => setExpenses(res.data));
  }, []);

  const ALL_CATEGORIES = ["Food", "Transport", "Entertainment", "Shopping", "Other"];
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  // --- UTILITY: Filter Expenses by Timeframe ---
  const filterByTimeframe = (expensesList, timeframe) => {
    if (timeframe === 'all') return expensesList;
    
    const today = new Date();
    return expensesList.filter(exp => {
      const expDate = new Date(exp.date);
      
      if (timeframe === 'weekly') {
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);
        return expDate >= lastWeek;
      }
      if (timeframe === 'monthly') {
        return expDate.getMonth() === today.getMonth() && expDate.getFullYear() === today.getFullYear();
      }
      if (timeframe === 'yearly') {
        return expDate.getFullYear() === today.getFullYear();
      }
      return true;
    });
  };

  // --- CHART DATA PROCESSING ---

  // 1. Bar Chart Data (Filtered by barFilter)
  const categoryDataBar = useMemo(() => {
    const timeFilteredExpenses = filterByTimeframe(expenses, barFilter);
    return ALL_CATEGORIES.map(category => {
      const categoryExpenses = timeFilteredExpenses.filter(
        (expense) => expense.category.toLowerCase() === category.toLowerCase()
      );
      return {
        name: category,
        value: categoryExpenses.reduce((sum, current) => sum + Number(current.amount), 0)
      };
    });
  }, [expenses, barFilter]);

  // 2. Pie Chart Data (Filtered by pieFilter)
  const categoryDataPie = useMemo(() => {
    const timeFilteredExpenses = filterByTimeframe(expenses, pieFilter);
    return ALL_CATEGORIES.map(category => {
      const categoryExpenses = timeFilteredExpenses.filter(
        (expense) => expense.category.toLowerCase() === category.toLowerCase()
      );
      return {
        name: category,
        value: categoryExpenses.reduce((sum, current) => sum + Number(current.amount), 0)
      };
    });
  }, [expenses, pieFilter]);

  // 3. Line Chart Data (Grouped by trendFilter)
  const filteredDateData = useMemo(() => {
    const groups = expenses.reduce((acc, curr) => {
      const d = new Date(curr.date);
      let label = "";
      if (trendFilter === 'weekly') {
        const startOfWeek = new Date(d.setDate(d.getDate() - d.getDay())).toLocaleDateString();
        label = `Week of ${startOfWeek}`;
      } else if (trendFilter === 'yearly') {
        label = d.getFullYear().toString();
      } else {
        label = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      }
      acc[label] = (acc[label] || 0) + Number(curr.amount);
      return acc;
    }, {});
    return Object.keys(groups).map(key => ({ date: key, amount: groups[key] }));
  }, [expenses, trendFilter]);

  // --- AI HANDLER ---
  const getAIAdvice = async () => {
    if (expenses.length === 0) {
      setAdvice("Please add some expenses first!");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/ai-advice`, { 
        expenses, prompt: userPrompt 
      });
      setAdvice(res.data.advice);
    } catch (err) { 
      setAdvice("Couldn't reach PennyWise AI. Check your server terminal."); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="analysis-page">
      <h2 style={{ marginBottom: '24px', color: 'var(--text-main)' }}>Financial Dashboard</h2>

      {/* Line Chart */}
      <div className="chart-card" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h4 style={{ color: 'var(--text-main)' }}>Spending Trends</h4>
          <select 
            value={trendFilter} 
            onChange={(e) => setTrendFilter(e.target.value)}
            style={{ width: 'auto', padding: '8px 16px', background: 'var(--bg-color)' }}
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={filteredDateData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
            <XAxis dataKey="date" stroke="var(--text-muted)" />
            <YAxis stroke="var(--text-muted)" />
            <Tooltip 
              formatter={(value) => `₹${Number(value).toFixed(2)}`} 
              contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }} 
            />
            <Line type="monotone" dataKey="amount" stroke="var(--primary)" strokeWidth={3} dot={{r: 6}} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="analysis-grid">
        {/* Bar Chart */}
        <div className="chart-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h4 style={{ color: 'var(--text-main)' }}>Expenses by Category</h4>
            <select 
              value={barFilter} 
              onChange={(e) => setBarFilter(e.target.value)}
              style={{ width: 'auto', padding: '6px 12px', fontSize: '0.85rem', background: 'var(--bg-color)' }}
            >
              <option value="all">All Time</option>
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
              <option value="yearly">This Year</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryDataBar}>
              <XAxis dataKey="name" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" />
              <Tooltip 
                formatter={(value) => `₹${Number(value).toFixed(2)}`}
                contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}
              />
              <Bar dataKey="value" fill="var(--primary)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="chart-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h4 style={{ color: 'var(--text-main)' }}>Spending Share</h4>
            <select 
              value={pieFilter} 
              onChange={(e) => setPieFilter(e.target.value)}
              style={{ width: 'auto', padding: '6px 12px', fontSize: '0.85rem', background: 'var(--bg-color)' }}
            >
              <option value="all">All Time</option>
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
              <option value="yearly">This Year</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={categoryDataPie.filter(d => d.value > 0)} dataKey="value" nameKey="name" outerRadius={100} label>
                {categoryDataPie.filter(d => d.value > 0).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(value) => `₹${Number(value).toFixed(2)}`} />
              <Legend wrapperStyle={{ color: 'var(--text-muted)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insights */}
      <div className="chart-card" style={{ marginTop: '32px' }}>
        <h3 style={{ textAlign: 'center', color: 'var(--primary)', marginBottom: '10px' }}>🤖 PennyWise AI Insights</h3>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '20px' }}>Ask a specific question or get a general analysis.</p>
        
        <div className="ai-section">
          <textarea 
            rows="3"
            placeholder="e.g., 'How can I reduce my food spending?'"
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            style={{ width: '100%', marginBottom: '16px' }}
          />
          <button onClick={getAIAdvice} disabled={loading} style={{ width: '100%' }}>
            {loading ? "PennyWise is Thinking..." : "Generate AI Advice"}
          </button>
        </div>

        {advice && (
          <div className="advice-box" style={{ marginTop: '24px' }}>
            <span className="advice-header">📊 PennyWise Analysis Report</span>
            <div className="advice-content">{advice}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analysis;