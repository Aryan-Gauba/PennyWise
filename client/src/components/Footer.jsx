import React from 'react';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer shadow-sm mt-auto">
      <div className="container footer-content">
        <div className="footer-text">
          <span className="fw-bold text-success">PennyWise</span>
          <span className="ms-2 text-muted">© {currentYear} All Rights Reserved.</span>
        </div>
        
        <div className="footer-icons">
          <a href="https://www.linkedin.com/in/aryan-gauba-01a8902ab/?original_referer=https%3A%2F%2Fwww%2Egoogle%2Ecom%2F&originalSubdomain=in" target="_blank" rel="noreferrer" className="footer-link">
            <FaLinkedin size={22} />
          </a>
          <a href="https://github.com/Aryan-Gauba" target="_blank" rel="noreferrer" className="footer-link">
            <FaGithub size={22} />
          </a>
          <a href="mailto:aryangauba42@gmail.com" className="footer-link">
            <FaEnvelope size={22} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;