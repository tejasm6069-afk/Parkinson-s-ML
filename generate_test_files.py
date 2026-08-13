import pandas as pd

def create_sample_files():
    dataset_path = "Parkinsons_Perturbation_MFCC_Features.xlsx"
    
    try:
        df = pd.read_excel(dataset_path)
        df.columns = df.columns.str.strip()
        print(f"📖 Loaded {dataset_path} successfully.")
    except Exception as e:
        print(f"❌ Error loading dataset: {e}")
        return

    target_col = 'class' if 'class' in df.columns else df.columns[-1]

    # Split dataset into healthy (0) and Parkinson's (1)
    healthy_df = df[df[target_col] == 0]
    parkinsons_df = df[df[target_col] == 1]

    print(f"Found {len(healthy_df)} Healthy records and {len(parkinsons_df)} Parkinson's records.")

    # Generate 3 individual Healthy Excel files
    for i in range(min(3, len(healthy_df))):
        healthy_record = healthy_df.iloc[[i]].copy()
        # Drop the target label so the model evaluates pure features
        if target_col in healthy_record.columns:
            healthy_record = healthy_record.drop(columns=[target_col])
        
        filename = f"healthy_patient_{i+1}.xlsx"
        healthy_record.to_excel(filename, index=False)
        print(f"✅ Generated: {filename}")

    # Generate 3 individual Parkinson's Excel files
    for i in range(min(3, len(parkinsons_df))):
        parkinsons_record = parkinsons_df.iloc[[i]].copy()
        # Drop the target label so the model evaluates pure features
        if target_col in parkinsons_record.columns:
            parkinsons_record = parkinsons_record.drop(columns=[target_col])
        
        filename = f"parkinsons_patient_{i+1}.xlsx"
        parkinsons_record.to_excel(filename, index=False)
        print(f"✅ Generated: {filename}")

if __name__ == "__main__":
    create_sample_files()