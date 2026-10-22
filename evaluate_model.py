import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
import joblib

print("Loading dataset and unified machine learning assets...")

# 1. Load Data
df = pd.read_csv('pd_speech_features.csv', header=1)

# 2. Extract Features (Same families used in training)
mfcc_cols = [c for c in df.columns if 'mfcc' in c.lower()]
delta_cols = [c for c in df.columns if 'delta' in c.lower() and 'delta_delta' not in c.lower()]
delta_delta_cols = [c for c in df.columns if 'delta_delta' in c.lower()]
tkeo_cols = [c for c in df.columns if 'tkeo' in c.lower()]

selected_features = mfcc_cols + delta_cols + delta_delta_cols + tkeo_cols
X = df[selected_features]
y = df['class']

# 3. Train/Test Split (Must exactly match the 80/20 split and random_state used in training)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# 4. Load your saved model and scaler
model = joblib.load('unified_parkinsons_model.joblib')
scaler = joblib.load('unified_scaler.joblib')

# 5. Scale the Test Data and Predict
X_test_scaled = scaler.transform(X_test)
y_pred = model.predict(X_test_scaled)

# 6. Calculate Metrics
acc = accuracy_score(y_test, y_pred)
cm = confusion_matrix(y_test, y_pred)
cr = classification_report(y_test, y_pred)

# 7. Print Formatted Terminal Output
print("\n" + "="*45)
print(f" 🏆 UNIFIED MODEL ACCURACY: {acc * 100:.2f}%")
print("="*45)

print("\n 🧩 CONFUSION MATRIX:")
print(" --------------------")
print(cm)
print("\n [0, 0]: True Negatives (Healthy predicted as Healthy)")
print(" [0, 1]: False Positives (Healthy predicted as Parkinson's)")
print(" [1, 0]: False Negatives (Parkinson's predicted as Healthy)")
print(" [1, 1]: True Positives (Parkinson's predicted as Parkinson's)")

print("\n 📈 CLASSIFICATION REPORT:")
print(" --------------------------")
print(cr)