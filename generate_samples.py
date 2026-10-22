import pandas as pd
import os

print("Loading original dataset...")
# Load the original dataset
df = pd.read_csv('pd_speech_features.csv', header=1)

# Create a folder to store the sample files
output_dir = "mentor_presentation_samples"
os.makedirs(output_dir, exist_ok=True)

# Select 3 distinct Healthy patients (class 0)
healthy_samples = df[df['class'] == 0].sample(n=3, random_state=42)

# Select 3 distinct Parkinson's patients (class 1)
parkinsons_samples = df[df['class'] == 1].sample(n=3, random_state=100)

print(f"\nGenerating CSV files in the '{output_dir}' folder...\n")

# Save Healthy Patients
for i, (index, row) in enumerate(healthy_samples.iterrows(), 1):
    patient_id = int(row['id'])
    filename = f"{output_dir}/patient_{patient_id}_healthy_control.csv"
    pd.DataFrame([row]).to_csv(filename, index=False)
    print(f"✅ Saved: {filename}")

# Save Parkinson's Patients
for i, (index, row) in enumerate(parkinsons_samples.iterrows(), 1):
    patient_id = int(row['id'])
    filename = f"{output_dir}/patient_{patient_id}_parkinsons_detected.csv"
    pd.DataFrame([row]).to_csv(filename, index=False)
    print(f"⚠️ Saved: {filename}")

print("\nDone! You now have 6 new patient files to test in the UI.")