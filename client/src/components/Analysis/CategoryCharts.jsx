import React, { useState, useMemo } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ALL_CATEGORIES = ["Food", "Transport", "Entertainment", "Shopping", "Other"];
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const CategoryCharts = ({ expenses }) => {
  const [barFilter, setBarFilter] = useState('all');
  const [pieFilter, setPieFilter] = useState('all');

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

  const categoryDataBar = useMemo(() => {
    const timeFiltered = filterByTimeframe(expenses, barFilter);
    return ALL_CATEGORIES.map(cat => ({
      name: cat,
      value: timeFiltered.filter(e => e.category.toLowerCase() === cat.toLowerCase())
                         .reduce((sum, curr) => sum + Number(curr.amount), 0)
    }));
  }, [expenses, barFilter]);

  const categoryDataPie = useMemo(() => {
    const timeFiltered = filterByTimeframe(expenses, pieFilter);
    return ALL_CATEGORIES.map(cat => ({
      name: cat,
      value: timeFiltered.filter(e => e.category.toLowerCase() === cat.toLowerCase())
                         .reduce((sum, curr) => sum + Number(curr.amount), 0)
    }));
  }, [expenses, pieFilter]);

  return (
    <div className="analysis-grid">
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
            <Tooltip formatter={(value) => `₹${Number(value).toFixed(2)}`} contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }} />
            <Bar dataKey="value" fill="var(--primary)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

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
  );
};

export default CategoryCharts;