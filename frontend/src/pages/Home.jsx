import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="hero-tag">
                  AI-Powered Clinical Precision
            </span>

            <h1>
              Empowering healing through
              <span>predictive foresight.</span>
            </h1>

            <p>
              Postoperative Pancreatic Fistula (POPF) is a critical challenge in pancreatic surgery.
              Our optimized XGBoost model combines traditional and non-traditional markers to provide
              accurate and personalized risk stratification.
            </p>

            <div className="hero-actions">
              <Link to="/assessment" className="primary-btn">
                Start Patient Assessment
              </Link>
              <Link to="/methodology" className="secondary-btn">
                View Model Science
              </Link>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="orb orb-one"></div>
            <div className="orb orb-two"></div>
            <div className="stats-card">
              <p className="stats-title">Model Test AUC</p>
              <p className="stats-value">90.7%</p>
              <p className="stats-meta">Validated on held-out cohort</p>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container features-grid">
          <article className="feature-card">
            <h3>Optimized XGBoost Engine</h3>
            <p>
              Built on a highly tuned gradient boosting framework achieving a 90.7% AUC. It
              utilizes SMOTE data augmentation to handle imbalanced clinical datasets, ensuring
              reliable predictions even for rare fistula cases.
            </p>
          </article>

          <article className="feature-card">
            <h3>Explainable AI (XAI)</h3>
            <p>
              Moving beyond black-box algorithms. Integrated SHAP value analysis provides surgical
              teams with transparent insights, highlighting exactly which patient-specific
              parameters are driving the risk score.
            </p>
          </article>

          <article className="feature-card">
            <h3>Critical Marker Focus</h3>
            <p>
              Evaluates 13 high-impact traditional indicators, such as Pancreas Texture, Drain
              Fluid Amylase (DFA), and CBD Diameter, alongside secondary physiological markers for
              a complete risk profile.
            </p>
          </article>

          <article className="feature-card">
            <h3>Proactive Surgical Strategy</h3>
            <p>
              Empowers surgical teams to make data-backed intraoperative decisions. High-risk
              predictions allow for preemptive adjustments in anastomotic techniques and tailored
              drain placement.
            </p>
          </article>

          <article className="feature-card">
            <h3>Optimized Patient Recovery</h3>
            <p>
              By identifying potential leakage scenarios early, healthcare providers can customize
              post-operative care pathways, reducing intensive care readmissions and overall
              hospital stays.
            </p>
          </article>

          <article className="feature-card accent-card">
            <h3>Ready To Assess?</h3>
            <p>Run a patient profile now and move directly from observation to informed action.</p>
            <Link to="/assessment">Open Assessment</Link>
          </article>
        </div>
      </section>
    </div>
  );
}