import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-wrap">
        <p className="footer-note">
          &copy; 2026 PancreaGuard AI. For clinical research and assistive purposes.
        </p>

        <div className="footer-links">
          <Link to="/assessment">Assessment</Link>
          <Link to="/methodology">Methodology</Link>
        </div>
      </div>
    </footer>
  );
}