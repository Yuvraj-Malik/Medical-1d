import React from 'react';

export default function Methodology() {
  return (
    <div className="methodology-page">
      <div className="container">
        <header className="page-header">
          <h1>Model Methodology</h1>
          <p>
            The POPF prediction model uses an optimized XGBoost architecture with carefully tuned
            preprocessing, feature selection, and threshold calibration to maximize clinical utility.
          </p>
        </header>

        <section className="methodology-card">
          <h2>Pipeline Architecture</h2>
          <ul>
            <li><strong>Data Imputation:</strong> Missing values are handled via KNN imputation (k=5, distance-weighted).</li>
            <li><strong>Class Balancing:</strong> BorderlineSMOTE augments underrepresented positive cases.</li>
            <li><strong>Algorithm:</strong> XGBoost classifier with threshold optimization using Youden's J statistic.</li>
            <li><strong>Performance:</strong> Test AUC of 0.907 and precision of 88.9% on held-out data.</li>
          </ul>
        </section>

        <section className="methodology-grid">
          <article>
            <h3>Feature Engineering</h3>
            <p>
              Transformations and filtering steps are applied to improve model signal quality across
              heterogeneous lab and perioperative variables.
            </p>
          </article>
          <article>
            <h3>Model Explainability</h3>
            <p>
              SHAP values are used to expose per-feature impact, supporting safer clinical adoption
              and transparent decision support.
            </p>
          </article>
          <article>
            <h3>Clinical Use Case</h3>
            <p>
              Risk output is designed to complement physician judgment, enabling prioritization and
              closer monitoring for vulnerable patients.
            </p>
          </article>
        </section>
      </div>
    </div>
  );
}