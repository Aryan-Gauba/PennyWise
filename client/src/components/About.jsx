import React from 'react';

const About = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '100%' }}>
      <div className="about-page" style={{ maxWidth: '800px', width: '100%', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--text-main)', marginBottom: '16px', fontSize: '2.5rem' }}>About PennyWise</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '40px', lineHeight: '1.6' }}>
          Smart expense tracking for a better financial future. Built for precision, designed for clarity.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', textAlign: 'left', marginBottom: '40px' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            <h4 style={{ color: 'var(--primary)', marginBottom: '12px', fontSize: '1.2rem' }}>🚀 The Mission</h4>
            <p style={{ color: 'var(--text-main)', lineHeight: '1.6', fontSize: '0.95rem' }}>
              To provide users with a seamless way to track daily spending and receive AI-powered coaching to optimize savings.
            </p>
          </div>
          
          <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            <h4 style={{ color: 'var(--primary)', marginBottom: '12px', fontSize: '1.2rem' }}>🛠️ Tech Stack</h4>
            <p style={{ color: 'var(--text-main)', lineHeight: '1.6', fontSize: '0.95rem' }}>
              Powered by the <strong style={{ color: 'var(--primary)' }}>PERN Stack</strong> (Postgres, Express, React, Node) and <strong style={{ color: 'var(--primary)' }}>Groq AI</strong> for real-time analysis.
            </p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '24px' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Developed By</span>
          <h3 style={{ color: 'var(--text-main)', margin: '8px 0', fontSize: '1.5rem' }}>Aryan Gauba</h3>
          <p style={{ color: 'var(--primary)' }}>Electronics & Communication Engineer | MSIT</p>
        </div>
      </div>
    </div>
  );
};

export default About;