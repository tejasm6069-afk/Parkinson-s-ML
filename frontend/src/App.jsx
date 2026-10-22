
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// --- MAIN DIAGNOSTIC TOOL COMPONENT ---
function DiagnosticTool() {
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
        { method: 'POST', body: formData }
      );

      if (!response.ok) throw new Error(`Server error: ${response.status} ${response.statusText}`);
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="header">
        <div className="badge">DIAGNOSTIC AI</div>
        <h1>
          Acoustic Parkinson's
          <span> Evaluation</span>
        </h1>
        <p>AI-powered analysis of acoustic voice features for Parkinson's disease evaluation.</p>
      </header>

      <section className="upload-card">
        <div className="upload-icon">🎙️</div>
        <h2>Upload Patient Data</h2>
        <p>Select the patient's acoustic feature CSV file to begin the analysis.</p>
        
        <a href="https://parkinson-s-ml.onrender.com/download_template" className="template-download" download>
          <span className="template-icon">📄</span> Download Blank Feature Template
        </a>

        <label className="file-input">
          <input type="file" accept=".csv" onChange={handleFileChange} />
          <span>{file ? file.name : 'Click to select patient CSV'}</span>
        </label>

        {error && <div className="error">{error}</div>}

        <button className="analyze-button" onClick={handleRunAnalysis} disabled={loading}>
          {loading ? 'Processing Acoustic Vector...' : 'Run Neural Analysis'}
        </button>
      </section>

      {loading && (
        <div className="loading">
          <div className="loader"></div>
          <p>Extracting acoustic features and evaluating the diagnostic model...</p>
        </div>
      )}

      {result && !loading && (
        <section className="result-dashboard fade-in">
          <div className="diagnosis-header">
            <span className={`status-badge ${result.prediction_code === 1 ? 'alert' : 'safe'}`}>
              ANALYSIS COMPLETE
            </span>
            <h2>{result.diagnosis}</h2>
            <div className="confidence-bar-container">
              <div 
                className={`confidence-bar ${result.prediction_code === 1 ? 'bg-coral' : 'bg-teal'}`} 
                style={{ width: `${result.confidence}%` }}
              ></div>
            </div>
            <p>Diagnostic Confidence: <strong>{result.confidence}%</strong></p>
          </div>

          {result.prediction_code === 1 ? (
            <div className="action-plan slide-up">
              <h3>Recommended Next Steps</h3>
              <p className="subtitle">Please consult a medical professional for clinical verification.</p>
              <div className="card-grid">
                <div className="med-card">
                  <div className="card-icon">🩺</div>
                  <h4>Telehealth Check-up</h4>
                  <p>Connect with a certified neurologist online for a preliminary clinical review.</p>
                  <Link to="/telehealth" className="secondary-btn">Book Online</Link>
                </div>
                <div className="med-card">
                  <div className="card-icon">🏥</div>
                  <h4>Find Local Specialists</h4>
                  <p>Locate top-rated hospitals and movement disorder clinics near you.</p>
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
                  <p>Explore diets rich in antioxidants, Omega-3s, and Mediterranean guidelines.</p>
                  <Link to="/diet-plans" className="secondary-btn">View Diet Plan</Link>
                </div>
                <div className="med-card">
                  <div className="card-icon">🏃</div>
                  <h4>Lifestyle & Exercise</h4>
                  <p>Learn how aerobic exercise and sleep hygiene protect cognitive function.</p>
                  <Link to="/lifestyle" className="secondary-btn">Explore Habits</Link>
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </>
  );
}

// --- NEW PAGE COMPONENTS ---
function DietPlans() {
  return (
    <div className="page-card fade-in">
      <h2>Neuro-protective Diet Plans</h2>
      <p>This section will contain detailed dietary recommendations to support brain health.</p>
    </div>
  );
}

function Telehealth() {
  return (
    <div className="page-card fade-in">
      <h2>Telehealth Portal</h2>
      <p>Select an available time slot below to book a preliminary clinical review with a certified specialist.</p>
      
      <div style={{ width: "100%", height: "700px", marginTop: "20px", borderRadius: "12px", overflow: "hidden", border: "1px solid var(--border-light)" }}>
        <iframe 
          src="https://cal.id/tejas-m" 
          width="100%" 
          height="100%" 
          frameBorder="0" 
          title="Telehealth Booking"
        ></iframe>
      </div>
    </div>
  );
}

function Lifestyle() {
  return (
    <div className="page-card fade-in">
      <h2>Lifestyle & Habits</h2>
      <p>Information on exercise, sleep tracking, and stress management will go here.</p>
    </div>
  );
}

// --- MAIN APP COMPONENT ---
export default function App() {
  return (
    <Router>
      <div className="app">
        {/* Navigation Bar */}
        <nav className="navbar">
          <div className="nav-logo">
            <Link to="/">NeuroVoice AI</Link>
          </div>
          <div className="nav-links">
            <Link to="/">Diagnosis</Link>
            <Link to="/diet-plans">Diet</Link>
            <Link to="/telehealth">Telehealth</Link>
          </div>
        </nav>

        <div className="container">
          {/* Router handles which component shows up based on the URL */}
          <Routes>
            <Route path="/" element={<DiagnosticTool />} />
            <Route path="/diet-plans" element={<DietPlans />} />
            <Route path="/telehealth" element={<Telehealth />} />
            <Route path="/lifestyle" element={<Lifestyle />} />
          </Routes>

          <footer>
            <p>AI-assisted evaluation • For research purposes only</p>
          </footer>
        </div>
      </div>
    </Router>
  );
}