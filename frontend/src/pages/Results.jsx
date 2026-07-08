import React from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function Results() {
  const location = useLocation();
  const { prediction, riskLevel } = location.state || { prediction: 0, riskLevel: 'Unknown' };
  const hasResult = Boolean(location.state);
  const highRisk = prediction > 0.5;

  return (
    <div className="results-page">
      <div className="container">
        <section className="results-shell">
          <h1>Assessment Results</h1>

          {!hasResult && (
            <div className="results-empty">
              <p>No assessment result found yet.</p>
              <Link to="/assessment" className="primary-btn">
                Start New Assessment
              </Link>
            </div>
          )}

          {hasResult && (
            <>
              <div className="results-ring-wrap">
                <div className={`results-ring ${highRisk ? 'high-risk' : 'low-risk'}`}>
                  {(prediction * 100).toFixed(1)}%
                </div>
                <p className="results-label">
                  Prediction Classification:
                  <strong>{riskLevel}</strong>
                </p>
              </div>

              <div className="results-note">
                <h2>Clinical Interpretation</h2>
                <p>
                  Based on the provided parameters, the model indicates a{' '}
                  {highRisk ? 'high' : 'low'} probability of Postoperative Pancreatic Fistula.
                  Continue monitoring major predictive features such as pancreas texture and
                  DFA levels as part of post-op planning.
                </p>
              </div>

              <Link to="/assessment" className="results-link">
                Run another assessment
              </Link>
            </>
          )}
        </section>
          </div>
    </div>
  );
}