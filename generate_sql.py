import pandas as pd

# 1. Read your exact local dataset
df = pd.read_excel("Parkinsons_Perturbation_MFCC_Features.xlsx")

# 2. Start building the SQL command
sql = "DROP TABLE IF EXISTS voice_records;\n\n"
sql += "CREATE TABLE voice_records (\n"
sql += "    record_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n"
sql += "    created_at TIMESTAMPTZ DEFAULT NOW(),\n"

# 3. Loop through every column in your file and assign the right data type
for col in df.columns:
    if col in ['id', 'gender', 'class']:
        sql += f'    "{col}" INT NOT NULL,\n'
    else:
        sql += f'    "{col}" REAL,\n'

# 4. Clean up the formatting and close the command
sql = sql.rstrip(",\n") + "\n);\n"

print("--- COPY EVERYTHING BELOW THIS LINE ---")
print(sql)