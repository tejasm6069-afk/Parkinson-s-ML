import pandas as pd
from supabase import create_client, Client

# 1. Your Supabase Credentials (Get these from Project Settings -> API)
SUPABASE_URL = "https://ljbewfgynceovzgwyyme.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqYmV3Zmd5bmNlb3Z6Z3d5eW1lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDM4NDMyMywiZXhwIjoyMDk5OTYwMzIzfQ.1i2wKqXC30DiGMDYuPce96h7wUjdWgmLsCsLjYVogOA"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

print("Reading and filtering the local data...")
# Read the cleaned Excel file we generated earlier
df = pd.read_excel("Parkinsons_Perturbation_MFCC_Features.xlsx")

# Ensure column names map perfectly to the PostgreSQL double-quoted structure
# Replace NaN values with None (which translates to NULL in SQL)
df = df.where(pd.notnull(df), None)

# 2. Convert the rows into JSON payloads
records = df.to_dict(orient="records")

print(f"Starting upload of {len(records)} patient voice records to Supabase...")

# 3. Batch insert records (Supabase allows chunked insertions for performance)
chunk_size = 100
for i in range(0, len(records), chunk_size):
    chunk = records[i:i + chunk_size]
    try:
        response = supabase.table("voice_records").insert(chunk).execute()
        print(f"Successfully uploaded rows {i} to {i + len(chunk)}")
    except Exception as e:
        print(f"Error uploading chunk starting at index {i}: {e}")
        break

print("\nDatabase seeding complete! Check your Supabase Table Editor.")