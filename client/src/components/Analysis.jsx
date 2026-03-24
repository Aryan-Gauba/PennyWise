import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, CartesianGrid, LineChart, Line, Legend 
} from 'recharts';
import '../App.css';

const Analysis = () => {
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState('monthly'); // 'weekly', 'monthly', 'yearly'
  const [userPrompt, setUserPrompt] = useState(""); // State for the new prompt box
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:5000/api/expenses").then(res => setExpenses(res.data));
  }, []);

  // --- DATA PROCESSING LOGIC ---

  // 1. Category Distribution (Pie & Bar)
  const categoryData = useMemo(() => {
    const counts = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);
      return acc;
    }, {});
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  }, [expenses]);

  // 2. Date-Wise Filtered Data
  const filteredDateData = useMemo(() => {
    const groups = expenses.reduce((acc, curr) => {
      const d = new Date(curr.date);
      let label = "";

      if (filter === 'weekly') {
        const startOfWeek = new Date(d.setDate(d.getDate() - d.getDay())).toLocaleDateString();
        label = `Week of ${startOfWeek}`;
      } else if (filter === 'yearly') {
        label = d.getFullYear().toString();
      } else {
        label = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      }

      acc[label] = (acc[label] || 0) + Number(curr.amount);
      return acc;
    }, {});

    return Object.keys(groups).map(key => ({ date: key, amount: groups[key] }));
  }, [expenses, filter]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

  // --- AI HANDLER ---
  const getAIAdvice = async () => {
    if (expenses.length === 0) {
      setAdvice("Please add some expenses first!");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/ai-advice", { 
        expenses,
        prompt: userPrompt // Sending your custom question to the backend
      });
      setAdvice(res.data.advice);
    } catch (err) { 
      setAdvice("Couldn't reach PennyWise AI. Check your server terminal."); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Financial Dashboard</h2>

      {/* Date-Wise Selection */}
      <div className="card p-3 mb-4 shadow-sm border-0">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Spending Trends</h4>
          <select className="form-select w-auto" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={filteredDateData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => `₹${Number(value).toFixed(2)}`} />
            <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={3} dot={{r: 6}} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="row g-4">
        {/* Category Bar Chart */}
        <div className="col-lg-6">
          <div className="card p-3 shadow-sm h-100 border-0">
            <h4>Expenses by Category</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${Number(value).toFixed(2)}`} />
                <Bar dataKey="value" fill="#00C49F" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart Distribution */}
        <div className="col-lg-6">
          <div className="card p-3 shadow-sm h-100 border-0">
            <h4>Spending Share</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={100} label>
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(value) => `₹${Number(value).toFixed(2)}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Section with Prompt Box */}
        <div className="card mt-4 p-4 bg-light shadow-sm border-0">
          <h3 className="text-center">🤖 PennyWise AI Insights</h3>
          <p className="text-muted text-center">Ask a specific question or get a general analysis.</p>
          
          <div className="ai-section max-width-md mx-auto w-100" style={{ maxWidth: '100%' }}>
            <textarea 
              className="form-control mb-3 shadow-sm"
              rows="3"
              placeholder="e.g., 'How can I reduce my food spending?'"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
            />
            
            <button 
              onClick={getAIAdvice} 
              className="btn btn-dark btn-lg w-100 shadow-sm" 
              disabled={loading}
            >
              {loading ? "PennyWise is Thinking..." : "Generate AI Advice"}
            </button>
          </div>

          {/* MOVE THIS OUTSIDE THE CENTERED DIV FOR FULL WIDTH ALIGNMENT */}
          {advice && (
            <div className="advice-box shadow-sm">
              <span className="advice-header">📊 PennyWise Analysis Report</span>
              <div className="advice-content">{advice}</div>
            </div>
          )}
        </div>
        </div>
  );
};

export default Analysis;