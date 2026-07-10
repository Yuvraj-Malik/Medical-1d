import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { predictPOPF } from '../services/api';

export default function Assessment() {
  const navigate = useNavigate();
  
  // State maps directly to the features extracted in the model
  const [formData, setFormData] = useState({
    // Required (Set A - Important Features)
    dfa1: '',
    dfa3: '',
    rtDays: '',
    pancreasTexture: '',
    cbdDiameter: '',
    age: '',
    jaundice: '',
    weightLoss: '',
    recentDiabetes: '',
    fever: '',
    hb: '',
    comorbidity: '',
    ca199: '',
    
    // Optional (Set C - Secondary/Rescued Features)
    tumorSize: '',
    bloodLoss: '',
    otTime: '',
    neoadjuvant: '',
    albumin: '',
    bill: '',
    alp: '',
    hba1c: '',
    cea: '',

    // UI-only helper fields for date/time pickers
    surgeryDate: '',
    assessmentDate: '',
    otTimeClock: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    const nextState = { ...formData, [name]: value };

    if (nextState.surgeryDate && nextState.assessmentDate) {
      const [sy, sm, sd] = nextState.surgeryDate.split('-').map(Number);
      const [ay, am, ad] = nextState.assessmentDate.split('-').map(Number);

      const surgery = Date.UTC(sy, sm - 1, sd);
      const assessment = Date.UTC(ay, am - 1, ad);
      const diffDays = (assessment - surgery) / (1000 * 60 * 60 * 24);

      nextState.rtDays = diffDays >= 0 ? String(diffDays) : '';
    }

    setFormData(nextState);
  };

  const handleTimeChange = (e) => {
    const { value } = e.target;

    if (!value) {
      setFormData({ ...formData, otTimeClock: '', otTime: '' });
      return;
    }

    const [hours, minutes] = value.split(':').map(Number);
    const totalMinutes = (hours * 60) + minutes;

    setFormData({
      ...formData,
      otTimeClock: value,
      otTime: String(totalMinutes)
    });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    console.log("Submitting to API...", formData);
    
    try {
      const result = await predictPOPF(formData);
      navigate('/results', { 
        state: { 
          prediction: result.prediction, 
          riskLevel: result.riskLevel, 
          features: formData 
        } 
      });
    } catch (err) {
      console.error(err);
      setError("Failed to connect to the prediction server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="assessment-page">
      <div className="container">
        <section className="assessment-shell">
          <div className="assessment-header">
            <h1>POPF Clinical Assessment</h1>
            <p>Please input the patient clinical markers below.</p>
          </div>

          <form onSubmit={handleSubmit} className="assessment-form">
            <section className="field-section">
              <h2>
                Primary Predictive Markers
                <span>* Required</span>
              </h2>

              <div className="fields-grid three-col">
                <div className="field-group">
                  <label>DFA 1 *</label>
                  <input required type="number" min="0" step="any" name="dfa1" onChange={handleChange} />
                </div>

                <div className="field-group">
                  <label>DFA 3 *</label>
                  <input required type="number" min="0" step="any" name="dfa3" onChange={handleChange} />
                </div>

                <div className="field-group">
                  <label>RT Days *</label>
                  <input required type="number" min="0" step="any" name="rtDays" value={formData.rtDays} onChange={handleChange} />
                </div>

                <div className="field-group">
                  <label>Surgery Date (Calendar)</label>
                  <input type="date" name="surgeryDate" value={formData.surgeryDate} onChange={handleDateChange} />
                </div>

                <div className="field-group">
                  <label>Assessment Date (Calendar)</label>
                  <input type="date" name="assessmentDate" value={formData.assessmentDate} onChange={handleDateChange} />
                </div>

                <div className="field-group">
                  <label>Pancreas Texture *</label>
                  <select required name="pancreasTexture" onChange={handleChange}>
                    <option value="">Select...</option>
                    <option value="1">Soft (1)</option>
                    <option value="2">Hard/Firm (2)</option>
                  </select>
                </div>

                <div className="field-group">
                  <label>CBD Diameter (mm) *</label>
                  <input required type="number" min="0" step="0.1" name="cbdDiameter" onChange={handleChange} />
                </div>

                <div className="field-group">
                  <label>Patient Age *</label>
                  <input required type="number" min="0" step="1" name="age" onChange={handleChange} />
                </div>

                <div className="field-group">
                  <label>Obstructive Jaundice *</label>
                  <select required name="jaundice" onChange={handleChange}>
                    <option value="">Select...</option>
                    <option value="1">Yes (1)</option>
                    <option value="0">No (0)</option>
                  </select>
                </div>

                <div className="field-group">
                  <label>Pre-op Weight Loss *</label>
                  <select required name="weightLoss" onChange={handleChange}>
                    <option value="">Select...</option>
                    <option value="1">Yes (1)</option>
                    <option value="0">No (0)</option>
                  </select>
                </div>

                <div className="field-group">
                  <label>Recent Diabetes *</label>
                  <select required name="recentDiabetes" onChange={handleChange}>
                    <option value="">Select...</option>
                    <option value="1">Yes (1)</option>
                    <option value="0">No (0)</option>
                  </select>
                </div>

                <div className="field-group">
                  <label>Pre-op Fever *</label>
                  <select required name="fever" onChange={handleChange}>
                    <option value="">Select...</option>
                    <option value="1">Yes (1)</option>
                    <option value="0">No (0)</option>
                  </select>
                </div>

                <div className="field-group">
                  <label>Haemoglobin (g/dL) *</label>
                  <input required type="number" min="0" step="0.1" name="hb" onChange={handleChange} />
                </div>

                <div className="field-group">
                  <label>Comorbidity *</label>
                  <select required name="comorbidity" onChange={handleChange}>
                    <option value="">Select...</option>
                    <option value="1">Yes (1)</option>
                    <option value="0">No (0)</option>
                  </select>
                </div>

                <div className="field-group">
                  <label>CA 19-9 (U/mL) *</label>
                  <input required type="number" min="0" step="0.1" name="ca199" onChange={handleChange} />
                </div>
              </div>
            </section>

            <section className="field-section">
              <h2>
                Secondary Markers
                <span>(Optional)</span>
              </h2>

              <div className="fields-grid three-col">
                <div className="field-group">
                  <label>Tumor Size</label>
                  <input type="number" min="0" step="0.1" name="tumorSize" onChange={handleChange} />
                </div>

                <div className="field-group">
                  <label>Intra-op Blood Loss (mL)</label>
                  <input type="number" min="0" step="1" name="bloodLoss" onChange={handleChange} />
                </div>

                <div className="field-group">
                  <label>OT Time (Clock)</label>
                  <input type="time" name="otTimeClock" value={formData.otTimeClock} onChange={handleTimeChange} />
                </div>

                <div className="field-group">
                  <label>Neoadjuvant Treatment</label>
                  <select name="neoadjuvant" onChange={handleChange}>
                    <option value="">Select...</option>
                    <option value="1">Yes (1)</option>
                    <option value="0">No (0)</option>
                  </select>
                </div>

                <div className="field-group">
                  <label>Serum Albumin (g/dL)</label>
                  <input type="number" min="0" step="0.1" name="albumin" onChange={handleChange} />
                </div>

                <div className="field-group">
                  <label>Serum Bilirubin (mg/dL)</label>
                  <input type="number" min="0" step="0.1" name="bill" onChange={handleChange} />
                </div>

                <div className="field-group">
                  <label>Alkaline Phosphatase (U/L)</label>
                  <input type="number" min="0" step="0.1" name="alp" onChange={handleChange} />
                </div>

                <div className="field-group">
                  <label>HbA1c (%)</label>
                  <input type="number" min="0" step="0.1" name="hba1c" onChange={handleChange} />
                </div>

                <div className="field-group">
                  <label>CEA (ng/mL)</label>
                  <input type="number" min="0" step="0.1" name="cea" onChange={handleChange} />
                </div>
              </div>
            </section>

            {error && <div className="error-message" style={{color: 'red', marginTop: '10px'}}>{error}</div>}
            
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Analyzing...' : 'Analyze Risk Parameters'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}