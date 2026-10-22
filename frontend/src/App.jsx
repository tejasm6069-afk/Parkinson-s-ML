import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

// --- ANIMATION VARIANTS ---
// These define how elements enter and leave the screen
const pageAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.4, ease: "easeIn" } }
};

const staggerCards = {
  animate: { transition: { staggerChildren: 0.15 } }
};

const cardPop = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100 } }
};

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
    <motion.div variants={pageAnimation} initial="initial" animate="animate" exit="exit">
      <header className="header">
        <motion.div 
          className="badge"
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          transition={{ type: "spring", stiffness: 150, delay: 0.2 }}
        >
          DIAGNOSTIC AI
        </motion.div>
        <h1>Acoustic Parkinson's<span> Evaluation</span></h1>
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

        {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="error">{error}</motion.div>}

        <motion.button 
          whileTap={{ scale: 0.95 }}
          className="analyze-button" 
          onClick={handleRunAnalysis} 
          disabled={loading}
        >
          {loading ? 'Processing Acoustic Vector...' : 'Run Neural Analysis'}
        </motion.button>
      </section>

      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="loading">
          <div className="loader"></div>
          <p>Extracting acoustic features and evaluating the diagnostic model...</p>
        </motion.div>
      )}

      {result && !loading && (
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 80 }}
          className="result-dashboard"
        >
          <div className="diagnosis-header">
            <span className={`status-badge ${result.prediction_code === 1 ? 'alert' : 'safe'}`}>
              ANALYSIS COMPLETE
            </span>
            <h2>{result.diagnosis}</h2>
            <div className="confidence-bar-container">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${result.confidence}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={`confidence-bar ${result.prediction_code === 1 ? 'bg-coral' : 'bg-teal'}`} 
              ></motion.div>
            </div>
            <p>Diagnostic Confidence: <strong>{result.confidence}%</strong></p>
          </div>

          <motion.div variants={staggerCards} initial="initial" animate="animate" className="action-plan">
            <h3>{result.prediction_code === 1 ? 'Recommended Next Steps' : 'Proactive Wellness & Prevention'}</h3>
            <p className="subtitle">
              {result.prediction_code === 1 
                ? 'Please consult a medical professional for clinical verification.' 
                : 'Maintain your neurological health with these evidence-based practices.'}
            </p>
            
            <div className="card-grid">
              {result.prediction_code === 1 ? (
                <>
                  <motion.div variants={cardPop} className="med-card">
                    <div className="card-icon">🩺</div>
                    <h4>Telehealth Check-up</h4>
                    <p>Connect with a certified neurologist online for a preliminary clinical review.</p>
                    <Link to="/telehealth" className="secondary-btn">Book Online</Link>
                  </motion.div>
                  <motion.div variants={cardPop} className="med-card">
                    <div className="card-icon">🏥</div>
                    <h4>Find Local Specialists</h4>
                    <p>Locate top-rated hospitals and movement disorder clinics near you.</p>
                    <a href="https://www.google.com/maps/search/neurologist+Parkinsons+specialist+near+me" target="_blank" rel="noreferrer" className="secondary-btn link-btn">
                      Search Nearby
                    </a>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div variants={cardPop} className="med-card">
                    <div className="card-icon">🥗</div>
                    <h4>Neuro-protective Diet</h4>
                    <p>Explore diets rich in antioxidants, Omega-3s, and Mediterranean guidelines.</p>
                    <Link to="/diet-plans" className="secondary-btn">View Diet Plan</Link>
                  </motion.div>
                  <motion.div variants={cardPop} className="med-card">
                    <div className="card-icon">🏃</div>
                    <h4>Lifestyle & Exercise</h4>
                    <p>Learn how aerobic exercise and sleep hygiene protect cognitive function.</p>
                    <Link to="/lifestyle" className="secondary-btn">Explore Habits</Link>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        </motion.section>
      )}
    </motion.div>
  );
}

// --- NEW PAGE COMPONENTS ---
function DietPlans() {
  return (
    <motion.div variants={pageAnimation} initial="initial" animate="animate" exit="exit" className="page-card">
      <h2>Neuro-protective Diet Plans</h2>
      <p>This section will contain detailed dietary recommendations to support brain health.</p>
    </motion.div>
  );
}

function Telehealth() {
  return (
    <motion.div variants={pageAnimation} initial="initial" animate="animate" exit="exit" className="page-card">
      <h2>Telehealth Portal</h2>
      <p>Select an available time slot below to book a preliminary clinical review with a certified specialist.</p>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        style={{ width: "100%", height: "700px", marginTop: "20px", borderRadius: "12px", overflow: "hidden", border: "1px solid var(--border-light)" }}
      >
        {/* Paste your Cal.com link back into the src here! */}
        <iframe 
          src="https://cal.id/tejas-m" 
          width="100%" 
          height="100%" 
          frameBorder="0" 
          title="Telehealth Booking"
        ></iframe>
      </motion.div>
    </motion.div>
  );
}

function Lifestyle() {
  return (
    <motion.div variants={pageAnimation} initial="initial" animate="animate" exit="exit" className="page-card">
      <h2>Lifestyle & Habits</h2>
      <p>Information on exercise, sleep tracking, and stress management will go here.</p>
    </motion.div>
  );
}

// --- ANIMATED ROUTER WRAPPER ---
// This enables the "exit" animations when switching pages
function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<DiagnosticTool />} />
        <Route path="/diet-plans" element={<DietPlans />} />
        <Route path="/telehealth" element={<Telehealth />} />
        <Route path="/lifestyle" element={<Lifestyle />} />
      </Routes>
    </AnimatePresence>
  );
}

// --- MAIN APP COMPONENT ---
export default function App() {
  return (
    <Router>
      <div className="app">
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
          <AnimatedRoutes />
          
          <footer>
            <p>AI-assisted evaluation • For research purposes only</p>
          </footer>
        </div>
      </div>
    </Router>
  );
}