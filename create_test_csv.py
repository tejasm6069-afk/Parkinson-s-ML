import pandas as pd
import joblib

# 1. Load your trained model
print("Loading model to extract feature names...")
model = joblib.load("parkinsons_model.joblib")

# Extract the exact column names your model was trained on
# scikit-learn stores these in the 'feature_names_in_' attribute
feature_names = model.feature_names_in_

# 2. Create Dummy Data for a Healthy Patient (Lower variance/jitter values)
# We fill the row with baseline values like 0.001
healthy_data = {feature: [0.001] for feature in feature_names}
df_healthy = pd.DataFrame(healthy_data)
df_healthy.to_csv("healthy_patient.csv", index=False)
print("✅ Created 'healthy_patient.csv'")

# 3. Create Dummy Data for a Parkinson's Patient (Higher variance/jitter values)
# We fill the row with higher dummy values like 1.5 to trigger a different prediction
pd_data = {feature: [1.5] for feature in feature_names}
df_pd = pd.DataFrame(pd_data)
df_pd.to_csv("parkinsons_patient.csv", index=False)
print("✅ Created 'parkinsons_patient.csv'")

print("You can now upload these files to your React frontend!")