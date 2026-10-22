import pandas as pd
import json

# This is the exact data from your previous successful Swagger UI test!
json_data = """{
  "PPE": 0.85, "DFA": 0.72, "RPDE": 0.61, "numPulses": 250, "numPeriodsPulses": 249,
  "meanPeriodPulses": 0.005, "stdDevPeriodPulses": 0.0001, "locPctJitter": 0.002,
  "locAbsJitter": 0.00002, "rapJitter": 0.001, "ppq5Jitter": 0.0015, "ddpJitter": 0.003,
  "locShimmer": 0.02, "locDbShimmer": 0.15, "apq3Shimmer": 0.01, "apq5Shimmer": 0.015,
  "apq11Shimmer": 0.025, "ddaShimmer": 0.03, "meanAutoCorrHarmonicity": 0.95,
  "meanNoiseToHarmHarmonicity": 0.05, "meanHarmToNoiseHarmonicity": 20.5,
  "mean_Log_energy": 10.2, "mean_MFCC_0th_coef": 5.1, "mean_MFCC_1st_coef": 2.2,
  "mean_MFCC_2nd_coef": -1.5, "mean_MFCC_3rd_coef": 0.8, "mean_MFCC_4th_coef": -0.5,
  "mean_MFCC_5th_coef": 0.2, "mean_MFCC_6th_coef": -0.1, "mean_MFCC_7th_coef": 0.05,
  "mean_MFCC_8th_coef": -0.02, "mean_MFCC_9th_coef": 0.01, "mean_MFCC_10th_coef": -0.01,
  "mean_MFCC_11th_coef": 0.005, "mean_MFCC_12th_coef": -0.002, "mean_delta_log_energy": 0.1,
  "mean_0th_delta": 0.05, "mean_1st_delta": -0.02, "mean_2nd_delta": 0.01,
  "mean_3rd_delta": -0.005, "mean_4th_delta": 0.002, "mean_5th_delta": -0.001,
  "mean_6th_delta": 0.0005, "mean_7th_delta": -0.0002, "mean_8th_delta": 0.0001,
  "mean_9th_delta": 0.0, "mean_10th_delta": 0.0, "mean_11th_delta": 0.0, "mean_12th_delta": 0.0,
  "mean_delta_delta_log_energy": 0.01, "mean_delta_delta_0th": 0.005, "mean_1st_delta_delta": -0.002,
  "mean_2nd_delta_delta": 0.001, "mean_3rd_delta_delta": -0.0005, "mean_4th_delta_delta": 0.0002,
  "mean_5th_delta_delta": -0.0001, "mean_6th_delta_delta": 0.0, "mean_7th_delta_delta": 0.0,
  "mean_8th_delta_delta": 0.0, "mean_9th_delta_delta": 0.0, "mean_10th_delta_delta": 0.0,
  "mean_11th_delta_delta": 0.0, "mean_12th_delta_delta": 0.0, "std_Log_energy": 1.5,
  "std_MFCC_0th_coef": 0.5, "std_MFCC_1st_coef": 0.3, "std_MFCC_2nd_coef": 0.2,
  "std_MFCC_3rd_coef": 0.1, "std_MFCC_4th_coef": 0.05, "std_MFCC_5th_coef": 0.02,
  "std_MFCC_6th_coef": 0.01, "std_MFCC_7th_coef": 0.005, "std_MFCC_8th_coef": 0.002,
  "std_MFCC_9th_coef": 0.001, "std_MFCC_10th_coef": 0.0005, "std_MFCC_11th_coef": 0.0002,
  "std_MFCC_12th_coef": 0.0001, "std_delta_log_energy": 0.05, "std_0th_delta": 0.02,
  "std_1st_delta": 0.01, "std_2nd_delta": 0.005, "std_3rd_delta": 0.002, "std_4th_delta": 0.001,
  "std_5th_delta": 0.0005, "std_6th_delta": 0.0002, "std_7th_delta": 0.0001, "std_8th_delta": 0.0,
  "std_9th_delta": 0.0, "std_10th_delta": 0.0, "std_11th_delta": 0.0, "std_12th_delta": 0.0,
  "std_delta_delta_log_energy": 0.005, "std_delta_delta_0th": 0.002, "std_1st_delta_delta": 0.001,
  "std_2nd_delta_delta": 0.0005, "std_3rd_delta_delta": 0.0002, "std_4th_delta_delta": 0.0001,
  "std_5th_delta_delta": 0.0, "std_6th_delta_delta": 0.0, "std_7th_delta_delta": 0.0,
  "std_8th_delta_delta": 0.0, "std_9th_delta_delta": 0.0, "std_10th_delta_delta": 0.0,
  "std_11th_delta_delta": 0.0, "std_12th_delta_delta": 0.0
}"""

# Convert JSON to a Dictionary, then to a Pandas DataFrame
data_dict = json.loads(json_data)
df = pd.DataFrame([data_dict])

# Save as CSV
df.to_csv("real_healthy_patient.csv", index=False)
print("✅ Created 'real_healthy_patient.csv' using actual testing data!")