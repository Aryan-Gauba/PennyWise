import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const TrendChart = ({ expenses }) => {
  const [trendFilter, setTrendFilter] = useState('monthly');

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

  return (
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
  );
};

export default TrendChart;