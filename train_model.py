import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report

def train():
    print("🚀 Training model with balanced class weights...")

    df = pd.read_excel("Parkinsons_Perturbation_MFCC_Features.xlsx")
    df.columns = df.columns.str.strip()

    target_col = 'class' if 'class' in df.columns else df.columns[-1]
    y = df[target_col].astype(int)

    ignore_cols = [target_col, 'id', 'ID', 'gender', 'Gender']
    feature_cols = [c for c in df.columns if c not in ignore_cols]
    X = df[feature_cols].apply(pd.to_numeric, errors='coerce').fillna(0)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Balanced weight tree ensemble prevents majority class bias
    model = RandomForestClassifier(
        n_estimators=300, 
        max_depth=15, 
        class_weight='balanced', 
        random_state=42
    )
    model.fit(X_train_scaled, y_train)

    joblib.dump(feature_cols, "feature_columns.joblib")
    joblib.dump(model, "parkinsons_model.joblib")
    joblib.dump(scaler, "scaler.joblib")

    acc = accuracy_score(y_test, model.predict(X_test_scaled))
    print(f"🎯 Model Accuracy: {acc * 100:.2f}%")
    print("✅ Saved parkinsons_model.joblib, scaler.joblib, and feature_columns.joblib")

if __name__ == "__main__":
    train()