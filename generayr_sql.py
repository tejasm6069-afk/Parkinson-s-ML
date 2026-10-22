import joblib

print("Generating Supabase SQL command...")
# Load the model to get the exact 105 column names
model = joblib.load("parkinsons_model.joblib")
features = model.feature_names_in_

# Build the SQL query
sql = "CREATE TABLE patient_data (\n"
sql += "  id SERIAL PRIMARY KEY,\n"
sql += "  created_at TIMESTAMPTZ DEFAULT NOW(),\n"

# Add all 105 ML features as FLOAT columns
for f in features:
    sql += f'  "{f}" FLOAT,\n'

# Add our extra tracking columns
sql += "  ai_prediction INTEGER,\n"
sql += "  status TEXT\n"
sql += ");"

print("\n👇 COPY EVERYTHING BETWEEN THESE LINES 👇\n")
print(sql)
print("\n👆 COPY EVERYTHING BETWEEN THESE LINES 👆\n")