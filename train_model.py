import pandas as pd
<<<<<<< HEAD
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
import joblib

print("1. Loading unified dataset...")
df = pd.read_csv('pd_speech_features.csv', header=1)

# Extract specific feature families
mfcc_cols = [c for c in df.columns if 'mfcc' in c.lower()]
delta_cols = [c for c in df.columns if 'delta' in c.lower() and 'delta_delta' not in c.lower()]
delta_delta_cols = [c for c in df.columns if 'delta_delta' in c.lower()]
tkeo_cols = [c for c in df.columns if 'tkeo' in c.lower()]

selected_features = mfcc_cols + delta_cols + delta_delta_cols + tkeo_cols
X = df[selected_features]
y = df['class']

# Split into 80% train / 20% test
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

print("2. Scaling features...")
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

print("3. Striving for best accuracy (Hyperparameter Tuning)...")
# Define the combinations we want the computer to test
param_grid = {
    'n_estimators': [100, 200, 300],
    'max_depth': [None, 10, 20, 30],
    'min_samples_split': [2, 5, 10]
}

# Run the grid search (tests every combination using 5-fold cross validation)
rf = RandomForestClassifier(random_state=42)
grid_search = GridSearchCV(rf, param_grid, cv=5, scoring='accuracy', n_jobs=-1)
grid_search.fit(X_train_scaled, y_train)

best_model = grid_search.best_estimator_

print("\n=== TRAINING RESULTS ===")
print(f"Optimal Parameters Found: {grid_search.best_params_}")
print(f"Test Set Accuracy: {best_model.score(X_test_scaled, y_test) * 100:.2f}%")

print("\n4. Saving model and scaler...")
joblib.dump(best_model, 'unified_parkinsons_model.joblib')
joblib.dump(scaler, 'unified_scaler.joblib')
joblib.dump(selected_features, 'unified_features.joblib') # Save feature list to enforce order
print("Success! New model ready for FastAPI.")
=======
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
>>>>>>> 8ccaef2f9a1e1c32c7516f79a98ce70dbf3fcc70
