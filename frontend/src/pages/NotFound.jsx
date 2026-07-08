import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="container not-found-wrap">
        <p className="error-code">404</p>
        <h1>Page Not Found</h1>
        <p>The page you are looking for does not exist or may have been moved.</p>
        <div className="not-found-actions">
          <Link to="/" className="primary-btn">Return Home</Link>
          <Link to="/assessment" className="secondary-btn">Go to Assessment</Link>
        </div>
      </div>
    </div>
  );
}