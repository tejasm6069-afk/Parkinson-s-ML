from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import pandas as pd
import numpy as np
import joblib

app = FastAPI(title="NeuroVoice AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model artifacts
model = joblib.load("parkinsons_model.joblib")
scaler = joblib.load("scaler.joblib")
feature_columns = joblib.load("feature_columns.joblib")

@app.get("/")
async def serve_frontend():
    return FileResponse("index.html")

@app.post("/upload_and_predict")
async def upload_and_predict(file: UploadFile = File(...), patient_id: str = Form("PATIENT_802")):
    try:
        # 1. Load uploaded file
        if file.filename.endswith(".csv"):
            df = pd.read_csv(file.file)
        else:
            df = pd.read_excel(file.file)

        df.columns = df.columns.str.strip()

        # 2. Re-align columns to match training features exactly
        for col in feature_columns:
            if col not in df.columns:
                df[col] = 0.0

        # Extract only the exact feature columns in order
        X_df = df[feature_columns].apply(pd.to_numeric, errors='coerce').fillna(0)

        # 3. Scale features
        X_scaled = scaler.transform(X_df)

        # 4. Predict
        raw_pred = int(model.predict(X_scaled)[0])
        probs = model.predict_proba(X_scaled)[0]

        # --- FIX: Inverted Label Mapping ---
        # If raw_pred == 1 corresponds to Parkinson's in your dataset:
        # Swap these two lines if your dataset uses 0 for Parkinson's!
        if raw_pred == 1:
            status_label = "Parkinson's Detected"
            status = 1
            confidence = round(float(probs[1]) * 100, 2)
        else:
            status_label = "Healthy Control"
            status = 0
            confidence = round(float(probs[0]) * 100, 2)

        return {
            "patient_id": patient_id,
            "status": status,
            "status_label": status_label,
            "confidence": confidence,
            "probabilities": {
                "healthy": round(float(probs[0]) * 100, 2),
                "parkinsons": round(float(probs[1]) * 100, 2)
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))