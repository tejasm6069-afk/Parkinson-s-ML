import os
import pandas as pd
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables from .env file
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

EXCEL_FILE = "Parkinsons_Perturbation_MFCC_Features.xlsx"
TABLE_NAME = "voice_features"

def wipe_and_upload():
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("❌ Error: SUPABASE_URL or SUPABASE_KEY missing in .env file!")
        return

    print("🚀 Connecting to Supabase...")
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

    # 1. Wipe existing records from the table
    print(f"🧹 Clearing existing records in '{TABLE_NAME}'...")
    try:
        supabase.table(TABLE_NAME).delete().neq("patient_id", "FORCE_DELETE_ALL").execute()
        print("✅ Table cleared successfully.")
    except Exception as e:
        print(f"⚠️ Note during table wipe: {e}")

    # 2. Read the Excel file
    print(f"📖 Reading dataset '{EXCEL_FILE}'...")
    try:
        df = pd.read_excel(EXCEL_FILE, sheet_name=0)
        print(f"✅ Loaded {len(df)} rows and {len(df.columns)} columns.")
    except Exception as e:
        print(f"❌ Failed to load Excel file: {e}")
        return

    # Clean headers
    df.columns = df.columns.str.strip()

    # Separate metadata columns from feature columns
    root_cols = ['id', 'class', 'gender', 'Gender']
    feature_cols = [c for c in df.columns if c not in root_cols]

    records = []

    print("🔄 Structuring records into JSON payloads...")
    for idx, row in df.iterrows():
        # Derive Patient ID & Target Status (0 = Healthy, 1 = Parkinson's)
        patient_id = f"PATIENT_{int(row['id'])}" if 'id' in row and pd.notna(row['id']) else f"PATIENT_{idx + 1}"
        status = int(row['class']) if 'class' in row and pd.notna(row['class']) else 0

        # Pack feature columns into a dictionary for JSONB storage
        features_dict = {}
        for f_col in feature_cols:
            val = row[f_col]
            if pd.isna(val):
                features_dict[f_col] = None
            else:
                features_dict[f_col] = float(val) if isinstance(val, (int, float)) else str(val)

        record = {
            "patient_id": patient_id,
            "status": status,
            "confidence": 100.0,
            "is_pseudo": False,
            "is_verified": True,
            "features": features_dict
        }
        records.append(record)

    # 3. Batch Upload to Supabase
    batch_size = 50
    total_records = len(records)
    print(f"⚡ Uploading {total_records} records in batches of {batch_size}...")

    for i in range(0, total_records, batch_size):
        batch = records[i : i + batch_size]
        try:
            supabase.table(TABLE_NAME).insert(batch).execute()
            print(f"   Uploaded rows {i + 1} to {min(i + batch_size, total_records)}...")
        except Exception as e:
            print(f"❌ Error inserting batch starting at row {i + 1}: {e}")

    print("🎉 Dataset successfully ingested into Supabase!")

if __name__ == "__main__":
    wipe_and_upload()