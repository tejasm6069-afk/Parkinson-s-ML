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

      // Check if the file is a CSV
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
        'http://127.0.0.1:8000/upload_and_predict',
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
          {/* New Template Download Button */}
          <a href="http://127.0.0.1:8000/download_template" className="template-download" download>
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

        {/* Result */}
        {result && !loading && (
          <section className="result-card">

            <div className="result-label">
              ANALYSIS COMPLETE
            </div>

            <h2>{result.diagnosis}</h2>

            <div className="confidence">
              <div className="confidence-value">
                {result.confidence}%
              </div>

              <div className="confidence-label">
                Diagnostic Confidence
              </div>
            </div>

            {/* Optional additional result information */}
            {result.message && (
              <p className="result-message">
                {result.message}
              </p>
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