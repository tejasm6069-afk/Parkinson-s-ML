import pandas as pd
import joblib

# Load full dataset (header=1 accounts for the descriptive first row)
df = pd.read_csv('pd_speech_features.csv', header=1)
expected_features = joblib.load('unified_features.joblib')

# Keep metadata columns for identification and database logging
cols_to_keep = ['id', 'gender', 'class'] + [c for c in expected_features if c in df.columns]

# Filter one confirmed healthy row (class = 0) and one confirmed Parkinson's row (class = 1)
healthy_sample = df[df['class'] == 0][cols_to_keep].iloc[0:1]
parkinsons_sample = df[df['class'] == 1][cols_to_keep].iloc[0:1]

# Save as test CSVs
healthy_sample.to_csv('unified_healthy_patient.csv', index=False)
parkinsons_sample.to_csv('unified_parkinsons_patient.csv', index=False)

print("Generated 'unified_healthy_patient.csv' and 'unified_parkinsons_patient.csv' successfully!")