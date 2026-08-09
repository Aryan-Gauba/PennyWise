import React, { useState, useEffect } from 'react';
import { expenseService } from '../../services/api';
import TrendChart from './TrendChart';
import CategoryCharts from './CategoryCharts';
import AIInsights from './AIInsights';
import '../../App.css'; // Ensure the CSS is still imported

const Analysis = () => {
  const [expenses, setExpenses] = useState([]);

  // Fetch the data once at the top level
  useEffect(() => {
    expenseService.getAll()
      .then(res => setExpenses(res.data))
      .catch(err => console.error("Error fetching analysis data:", err.message));
  }, []);

  return (
    <div className="analysis-page">
      <h2 style={{ marginBottom: '24px', color: 'var(--text-main)' }}>Financial Dashboard</h2>
      
      {/* Pass the data down to the specialized components */}
      <TrendChart expenses={expenses} />
      <CategoryCharts expenses={expenses} />
      <AIInsights expenses={expenses} />
    </div>
  );
};

export default Analysis;