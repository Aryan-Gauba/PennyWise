import React from 'react';

const About = () => {
  return (
    <div className="about-wrapper">
      <div className="about-page about-container-box">
        <h1 className="about-title">About PennyWise</h1>
        <p className="about-subtitle">
          Smart expense tracking for a better financial future. Built for precision, designed for clarity.
        </p>

        <div className="about-grid">
          <div className="about-card">
            <h4 className="about-card-title">🚀 The Mission</h4>
            <p className="about-card-text">
              To provide users with a seamless way to track daily spending and receive AI-powered coaching to optimize savings.
            </p>
          </div>
          
          <div className="about-card">
            <h4 className="about-card-title">🛠️ Tech Stack</h4>
            <p className="about-card-text">
              Powered by the <strong className="highlight-text">PERN Stack</strong> (Postgres, Express, React, Node) and <strong className="highlight-text">Groq AI</strong> for real-time analysis.
            </p>
          </div>
        </div>

        <div className="about-author-section">
          <span className="author-label">Developed By</span>
          <h3 className="author-name">Aryan Gauba</h3>
          <p className="author-title">Electronics & Communication Engineer | MSIT</p>
        </div>
      </div>
    </div>
  );
};

export default About;