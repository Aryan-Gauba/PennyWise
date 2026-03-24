import React from 'react';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-card shadow-sm">
        <h1 className="about-title">About PennyWise</h1>
        <p className="about-subtitle">
          Smart expense tracking for a better financial future. Built for precision, designed for clarity.
        </p>

        <div className="about-grid">
          <div className="about-section">
            <h4>🚀 The Mission</h4>
            <p>To provide users with a seamless way to track daily spending and receive AI-powered coaching to optimize savings.</p>
          </div>
          
          <div className="about-section">
            <h4>🛠️ Tech Stack</h4>
            <p>Powered by the <strong>PERN Stack</strong> (Postgres, Express, React, Node) and <strong>Groq AI</strong> for real-time analysis.</p>
          </div>
        </div>

        <div className="about-footer">
          <span className="dev-label">Developed By</span>
          <h3>Aryan Gauba</h3>
          <p className="dev-info">Electronics & Communication Engineer | MSIT</p>
        </div>
      </div>
    </div>
  );
};

export default About;