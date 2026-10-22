import React, { useState } from 'react';
import './App.css';

export default function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
        setError('Please select a CSV file.');
        setFile(null);
        setResult(null);
        return;
      }

      setFile(selectedFile);
      setError(null);
      setResult(null);
    }
  };

  const handleRunAnalysis = async () => {
    if (!file) {
      setError('Please select a CSV file first.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(
        'https://parkinson-s-ml.onrender.com/upload_and_predict',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(
          `Server error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
    } catch (err) {
      setError(
        err.message || 'Failed to connect to backend server.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="container">

        {/* Header */}
        <header className="header">
          <div className="badge">DIAGNOSTIC AI</div>

          <h1>
            Acoustic Parkinson's
            <span> Evaluation</span>
          </h1>

          <p>
            AI-powered analysis of acoustic voice features
            for Parkinson's disease evaluation.
          </p>
        </header>

        {/* Upload Section */}
        <section className="upload-card">
          <div className="upload-icon">🎙️</div>

          <h2>Upload Patient Data</h2>

          <p>
            Select the patient's acoustic feature CSV file
            to begin the analysis.
          </p>
          
          <a href="https://parkinson-s-ml.onrender.com/download_template" className="template-download" download>
            <span className="template-icon">📄</span>
            Download Blank Feature Template
          </a>

          <label className="file-input">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
            />

            <span>
              {file
                ? file.name
                : 'Click to select patient CSV'}
            </span>
          </label>

          {/* Error */}
          {error && (
            <div className="error">
              {error}
            </div>
          )}

          {/* Run Analysis Button */}
          <button
            className="analyze-button"
            onClick={handleRunAnalysis}
            disabled={loading}
          >
            {loading
              ? 'Processing Acoustic Vector...'
              : 'Run Neural Analysis'}
          </button>
        </section>

        {/* Loading */}
        {loading && (
          <div className="loading">
            <div className="loader"></div>
            <p>
              Extracting acoustic features and
              evaluating the diagnostic model...
            </p>
          </div>
        )}

        {/* Result Dashboard */}
        {result && !loading && (
          <section className="result-dashboard fade-in">
            <div className="diagnosis-header">
              <span className={`status-badge ${result.prediction_code === 1 ? 'alert' : 'safe'}`}>
                ANALYSIS COMPLETE
              </span>
              <h2>{result.diagnosis}</h2>
              <div className="confidence-bar-container">
                <div 
                  className={`confidence-bar ${result.prediction_code === 1 ? 'bg-red' : 'bg-green'}`} 
                  style={{ width: `${result.confidence}%` }}
                ></div>
              </div>
              <p>Diagnostic Confidence: <strong>{result.confidence}%</strong></p>
            </div>

            {/* --- CONDITIONAL UI BASED ON DIAGNOSIS --- */}
            {result.prediction_code === 1 ? (
              <div className="action-plan slide-up">
                <h3>Recommended Next Steps</h3>
                <p className="subtitle">Please consult a medical professional for clinical verification.</p>
                
                <div className="card-grid">
                  <div className="med-card">
                    <div className="card-icon">🩺</div>
                    <h4>Telehealth Check-up</h4>
                    <p>Connect with a certified neurologist online for a preliminary clinical review and guidance.</p>
                    <button className="secondary-btn">Book Online</button>
                  </div>

                  <div className="med-card">
                    <div className="card-icon">🏥</div>
                    <h4>Find Local Specialists</h4>
                    <p>Locate top-rated hospitals and movement disorder clinics in your immediate area.</p>
                    <a href="https://www.google.com/maps/search/neurologist+Parkinsons+specialist+near+me" target="_blank" rel="noreferrer" className="secondary-btn link-btn">
                      Search Nearby
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="action-plan slide-up">
                <h3>Proactive Wellness & Prevention</h3>
                <p className="subtitle">Maintain your neurological health with these evidence-based practices.</p>
                
                <div className="card-grid">
                  <div className="med-card">
                    <div className="card-icon">🥗</div>
                    <h4>Neuro-protective Diet</h4>
                    <p>Explore diets rich in antioxidants, Omega-3s, and Mediterranean guidelines to protect brain health.</p>
                    <button className="secondary-btn">View Diet Plan</button>
                  </div>

                  <div className="med-card">
                    <div className="card-icon">🏃</div>
                    <h4>Lifestyle & Exercise</h4>
                    <p>Learn how aerobic exercise, stress management, and sleep hygiene protect cognitive function.</p>
                    <button className="secondary-btn">Explore Habits</button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Footer */}
        <footer>
          <p>
            AI-assisted evaluation • For research purposes only
          </p>
        </footer>

      </div>
    </div>
  );
}