import React, { useState } from 'react';
import { aiService } from '../../services/api';

const AIInsights = ({ expenses }) => {
  const [userPrompt, setUserPrompt] = useState("");
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);

  const getAIAdvice = async () => {
    if (expenses.length === 0) {
      setAdvice("Please add some expenses first!");
      return;
    }
    setLoading(true);
    try {
      const res = await aiService.getAdvice({ expenses, prompt: userPrompt });
      setAdvice(res.data.advice);
    } catch (err) { 
      setAdvice("Couldn't reach PennyWise AI. Check your server terminal."); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
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
  );
};

export default AIInsights;