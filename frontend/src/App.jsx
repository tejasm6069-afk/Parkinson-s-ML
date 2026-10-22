import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

const API_BASE = 'https://parkinson-s-ml.onrender.com';

// --- ANIMATION VARIANTS ---
const pageAnimation = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.3, ease: 'easeIn' } },
};

const staggerCards = {
  initial: {},
  animate: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const cardPop = {
  initial: { opacity: 0, y: 24, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 110, damping: 16 } },
};

// --- SMALL REUSABLE PIECES ---
function ConfidenceRing({ value, alert }) {
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className="ring">
      <svg viewBox="0 0 150 150">
        <circle className="track" cx="75" cy="75" r={radius} fill="none" strokeWidth="11" />
        <motion.circle
          className={`value ${alert ? 'coral' : 'teal'}`}
          cx="75" cy="75" r={radius} fill="none" strokeWidth="11"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - (pct / 100) * circumference }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        />
      </svg>
      <div className="ring-label">
        <b>{pct}%</b>
        <span>CONFIDENCE</span>
      </div>
    </div>
  );
}

function PageHero({ eyebrow, title, text }) {
  return (
    <div className="page-hero">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

// --- MAIN DIAGNOSTIC TOOL COMPONENT ---
function DiagnosticTool() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragging, setDragging] = useState(false);

  const acceptFile = (selectedFile) => {
    if (!selectedFile) return;
    if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
      setError('Please select a CSV file.');
      setFile(null);
      setResult(null);
      return;
    }
    setFile(selectedFile);
    setError(null);
    setResult(null);
  };

  const handleFileChange = (e) => acceptFile(e.target.files && e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    acceptFile(e.dataTransfer.files && e.dataTransfer.files[0]);
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
      const response = await fetch(`${API_BASE}/upload_and_predict`, { method: 'POST', body: formData });
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

  const isAlert = result && result.prediction_code === 1;

  return (
    <motion.div variants={pageAnimation} initial="initial" animate="animate" exit="exit" className="narrow">
      <header className="header">
        <motion.div
          className="badge"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 150, delay: 0.2 }}
        >
          <span className="dot" /> DIAGNOSTIC AI
        </motion.div>
        <h1>
          Acoustic Parkinson's<span>Evaluation</span>
        </h1>
        <p>AI-powered analysis of acoustic voice features to support early Parkinson's disease screening.</p>

        <div className="steps">
          <span className="step-pill"><b>1</b> Download template</span>
          <span className="step-pill"><b>2</b> Upload CSV</span>
          <span className="step-pill"><b>3</b> Get analysis</span>
        </div>
      </header>

      <section className="upload-card">
        <div className="upload-icon">🎙️</div>
        <h2>Upload Patient Data</h2>
        <p>Select the patient's acoustic feature CSV file to begin the analysis.</p>

        <a href={`${API_BASE}/download_template`} className="template-download" download>
          <span>📄</span> Download Blank Feature Template
        </a>

        <label
          className="file-input"
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <input type="file" accept=".csv" onChange={handleFileChange} />
          <div className={`dropzone ${dragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}>
            <span style={{ fontSize: '1.6rem' }}>{file ? '✅' : '⬆️'}</span>
            <strong>{file ? file.name : 'Click to select or drag & drop'}</strong>
            <small>{file ? 'Ready to analyze — click to change file' : 'CSV files only'}</small>
          </div>
        </label>

        {error && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="error">
            ⚠️ {error}
          </motion.div>
        )}

        <motion.button
          whileTap={{ scale: 0.97 }}
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
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 80, damping: 15 }}
          className="result-dashboard"
        >
          <div className={`diagnosis-header ${isAlert ? 'is-alert' : ''}`}>
            <div>
              <span className={`status-badge ${isAlert ? 'alert' : 'safe'}`}>ANALYSIS COMPLETE</span>
              <h2>{result.diagnosis}</h2>
              <p>
                Model confidence: <strong>{result.confidence}%</strong>
              </p>
            </div>
            <ConfidenceRing value={result.confidence} alert={isAlert} />
          </div>

          <motion.div variants={staggerCards} initial="initial" animate="animate" className="action-plan">
            <h3>{isAlert ? 'Recommended Next Steps' : 'Proactive Wellness & Prevention'}</h3>
            <p className="subtitle">
              {isAlert
                ? 'Please consult a medical professional for clinical verification.'
                : 'Maintain your neurological health with these evidence-based practices.'}
            </p>

            <div className="card-grid">
              {isAlert ? (
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
                    <a
                      href="https://www.google.com/maps/search/neurologist+Parkinsons+specialist+near+me"
                      target="_blank"
                      rel="noreferrer"
                      className="secondary-btn link-btn"
                    >
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

// --- PAGE COMPONENTS ---
function DietPlans() {
  const plans = [
    {
      icon: '🫐',
      title: 'Antioxidant-rich foods',
      text: 'Colourful plants help counter oxidative stress in the brain.',
      items: ['Berries, spinach and kale', 'Beetroot and bell peppers', 'Green tea in moderation', 'Nuts and seeds'],
    },
    {
      icon: '🐟',
      title: 'Omega-3 sources',
      text: 'Healthy fats support neuron membranes and reduce inflammation.',
      items: ['Salmon, sardines and mackerel', 'Walnuts and flaxseed', 'Chia seeds', 'Olive oil as the main fat'],
    },
    {
      icon: '🫒',
      title: 'Mediterranean pattern',
      text: 'A well-studied eating pattern linked with better brain health.',
      items: ['Whole grains and legumes', 'Plenty of vegetables and fruit', 'Fish over red meat', 'Limit ultra-processed food'],
    },
    {
      icon: '💧',
      title: 'Hydration & fibre',
      text: 'Good hydration and fibre help with digestion and overall energy.',
      items: ['6–8 glasses of water daily', 'Fibre from vegetables and oats', 'Spread protein across the day', 'Cut back on added sugar'],
    },
  ];

  return (
    <motion.div variants={pageAnimation} initial="initial" animate="animate" exit="exit">
      <PageHero
        eyebrow="Nutrition"
        title="Neuro-protective diet plans"
        text="Everyday food choices that support long-term brain health, based on general nutrition guidance."
      />
      <motion.div variants={staggerCards} initial="initial" animate="animate" className="info-grid">
        {plans.map((p) => (
          <motion.div key={p.title} variants={cardPop} className="info-card">
            <div className="card-icon">{p.icon}</div>
            <h3>{p.title}</h3>
            <p>{p.text}</p>
            <ul>{p.items.map((i) => <li key={i}>{i}</li>)}</ul>
          </motion.div>
        ))}
      </motion.div>
      <div className="note-banner">
        ℹ️ General wellness information only. Consult a doctor or registered dietitian before making major diet changes.
      </div>
    </motion.div>
  );
}

function Telehealth() {
  return (
    <motion.div variants={pageAnimation} initial="initial" animate="animate" exit="exit">
      <PageHero
        eyebrow="Telehealth"
        title="Book a clinical review"
        text="Select an available time slot below to book a preliminary clinical review with a certified specialist."
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25, duration: 0.5 }}
        className="booking-frame"
      >
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
  const habits = [
    {
      icon: '🏃',
      title: 'Aerobic exercise',
      text: 'Regular movement is one of the most consistently supported habits for brain health.',
      items: ['Brisk walking or cycling', 'Aim for 150 minutes per week', 'Add balance work such as tai chi', 'Start gently and build up'],
    },
    {
      icon: '😴',
      title: 'Sleep hygiene',
      text: 'Consistent, quality sleep helps the brain clear waste and consolidate memory.',
      items: ['Fixed sleep and wake times', 'Screens off an hour before bed', 'Cool, dark bedroom', 'Limit late caffeine'],
    },
    {
      icon: '🧘',
      title: 'Stress management',
      text: 'Chronic stress affects both mood and neurological wellbeing.',
      items: ['Breathing exercises or meditation', 'Time outdoors', 'Gentle yoga', 'Talk to someone you trust'],
    },
    {
      icon: '🗣️',
      title: 'Voice & social health',
      text: 'Staying vocally and socially active keeps speech and mood strong.',
      items: ['Reading aloud daily', 'Singing or humming', 'Regular conversations', 'Join community groups'],
    },
  ];

  return (
    <motion.div variants={pageAnimation} initial="initial" animate="animate" exit="exit">
      <PageHero
        eyebrow="Lifestyle"
        title="Habits that protect your brain"
        text="Simple, sustainable routines covering exercise, sleep, stress and voice health."
      />
      <motion.div variants={staggerCards} initial="initial" animate="animate" className="info-grid">
        {habits.map((h) => (
          <motion.div key={h.title} variants={cardPop} className="info-card">
            <div className="card-icon">{h.icon}</div>
            <h3>{h.title}</h3>
            <p>{h.text}</p>
            <ul>{h.items.map((i) => <li key={i}>{i}</li>)}</ul>
          </motion.div>
        ))}
      </motion.div>
      <div className="note-banner">
        ℹ️ General wellness information only. It is not a substitute for professional medical advice.
      </div>
    </motion.div>
  );
}

// --- ANIMATED ROUTER WRAPPER ---
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
            <Link to="/">
              <span className="logo-mark">
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round">
                  <path d="M3 12h3l2-6 4 12 3-9 2 3h4" />
                </svg>
              </span>
              <span className="logo-text">NeuroVoice <em>AI</em></span>
            </Link>
          </div>
          <div className="nav-links">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>Diagnosis</NavLink>
            <NavLink to="/diet-plans" className={({ isActive }) => (isActive ? 'active' : '')}>Diet</NavLink>
            <NavLink to="/lifestyle" className={({ isActive }) => (isActive ? 'active' : '')}>Lifestyle</NavLink>
            <NavLink to="/telehealth" className={({ isActive }) => (isActive ? 'active' : '')}>Telehealth</NavLink>
          </div>
        </nav>

        <div className="container">
          <AnimatedRoutes />

          <footer>
            <p>AI-assisted evaluation • For research purposes only • Not a medical diagnosis</p>
          </footer>
        </div>
      </div>
    </Router>
  );
}
