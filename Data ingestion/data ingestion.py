import os
import re
import time
from datetime import datetime
import pandas as pd
from sqlalchemy import create_engine, text
from sqlalchemy.engine import URL

# ==========================================
# DATABASE CONNECTION SETTINGS
# ==========================================
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "cms_analytics")

# Create the SQLAlchemy engine connection

connection_url = URL.create(
    drivername="postgresql+psycopg2",
    username=DB_USER,
    password=DB_PASSWORD,
    host=DB_HOST,
    port=int(DB_PORT),
    database=DB_NAME
)

engine = create_engine(connection_url)

# ==========================================
# FILE TO TABLE MAPPING
# ==========================================
# This tells the script which file goes to which database table.
FILE_TABLE_MAP = {
    "NH_ProviderInfo": "cleaned_nh_providerinfo",
    "NH_StateUSAverages": "cleaned_nh_stateusaverages",
    "NH_DataCollectionIntervals": "cleaned_nh_datacollectionintervals",
    "NH_SurveyDates": "cleaned_nh_surveydates",
    "NH_FireSafetyCitations": "cleaned_nh_firesafetycitations",
    "NH_HealthCitations": "cleaned_nh_healthcitations",
    "NH_CitationDescriptions": "cleaned_nh_citationdescriptions",
    "NH_HlthInspecCutpointsState": "cleaned_nh_hlthinspeccutpointsstate",
    "NH_SurveySummary": "cleaned_nh_surveysummary",
    "NH_QualityMsr_MDS": "cleaned_nh_qualitymsr_mds",
    "NH_QualityMsr_Claims": "cleaned_nh_qualitymsr_claims",
    "NH_Ownership": "cleaned_nh_ownership",
    "NH_Penalties": "cleaned_nh_penalties",
    "Skilled_Nursing_Facility_Quality_Reporting_Program_National_Data": "cleaned_snf_qrp_national_data",
    "Skilled_Nursing_Facility_Quality_Reporting_Program_Provider_Data": "cleaned_snf_qrp_provider_data",
    "Swing_Bed_SNF_data": "cleaned_swing_bed_snf_data",
    "FY_2026_SNF_VBP_Facility_Performance": "cleaned_fy_2026_snf_vbp_facility_performance",
    "FY_2026_SNF_VBP_Aggregate_Performance": "cleaned_fy_2026_snf_vbp_aggregate_performance"
}

def extract_month_from_filename(filename):
    """
    Extracts the month and year from filenames like 'NH_ProviderInfo_Feb2026.csv',
    or handles Fiscal Year filenames like 'FY_2026_SNF_VBP_Facility_Performance.csv'.
    """
    match = re.search(r'([A-Za-z]{3})(\d{4})', filename)
    if match:
        month_str, year_str = match.groups()
        try:
            date_obj = datetime.strptime(f"{month_str} {year_str}", "%b %Y")
            return date_obj.strftime("%Y-%m-%d")
        except ValueError:
            pass
            
    fy_match = re.search(r'FY_?(\d{4})', filename, re.IGNORECASE)
    if fy_match:
        year_str = fy_match.group(1)
        return f"{year_str}-01-01"

    raise ValueError(f"Could not find a valid date pattern in the filename: {filename}")

def get_target_table(filename):
    """Matches a filename to its corresponding database table."""
    for file_keyword, table_name in FILE_TABLE_MAP.items():
        if file_keyword in filename:
            return table_name
    return None

def clean_and_upload_cms_files():
    start_time = time.time()
    
    current_dir = os.path.dirname(os.path.abspath(__file__)) if '__file__' in locals() else os.getcwd()
    csv_files = [f for f in os.listdir(current_dir) if f.endswith('.csv') and not f.startswith('cleaned_')]
    
    if not csv_files:
        print(f"❌ No CSV files found in {current_dir}.")
        return

    print(f"📂 Found {len(csv_files)} CSV files to process.\n" + "="*40)
    success_count = 0
    
    for filename in csv_files:
        input_path = os.path.join(current_dir, filename)
        target_table = get_target_table(filename)
        
        print(f"\n⏳ Processing: {filename}...")
        
        if not target_table:
            print(f"   ⚠️ Skipping: Could not map '{filename}' to a database table.")
            continue
            
        try:
            # 1. Extract exact date
            report_month = extract_month_from_filename(filename)
            
            # 2. Read file as pure text
            df = pd.read_csv(
                input_path, 
                dtype=str, 
                encoding='utf-8', 
                keep_default_na=False, 
                na_values=['']
            )
            
            # 3. Add the report month column
            df.insert(0, 'report_month', report_month)

            # 4. Connect to database to prep the upload
            with engine.connect() as conn:
                # A. Fetch exact column names from the PostgreSQL table to bypass the 63-character limit
                query = text(f"SELECT column_name FROM information_schema.columns WHERE table_name = '{target_table}' ORDER BY ordinal_position")
                db_columns = [row[0] for row in conn.execute(query)]
                
                # --- NEW SCHEMA DRIFT HANDLER ---
                if len(df.columns) != len(db_columns):
                    print(f"   ⚠️ Schema Drift Detected: CSV has {len(df.columns)} columns, DB expects {len(db_columns)}.")
                    
                    if len(df.columns) > len(db_columns):
                        extra_count = len(df.columns) - len(db_columns)
                        print(f"   ✂️  Clipping off the last {extra_count} extra columns from the CSV...")
                        # Keep only the columns up to the database limit
                        df = df.iloc[:, :len(db_columns)]
                    else:
                        print(f"   ❌ Error: CSV is missing columns. It only has {len(df.columns)}. Cannot safely upload.")
                        continue
                
                # Overwrite the dataframe columns with the exact names expected by the database
                df.columns = db_columns
                # ---------------------------------
                
                # B. Execute the "Delete and Append" logic for this specific month
                print(f"   🗑️  Deleting any existing data for {report_month} from '{target_table}'...")
                delete_query = text(f"DELETE FROM {target_table} WHERE report_month = :month")
                conn.execute(delete_query, {"month": report_month})
                conn.commit()

            # 5. Upload the cleaned data
            print(f"   ⬆️  Uploading {len(df):,} rows to '{target_table}'...")
            df.to_sql(
                name=target_table, 
                con=engine, 
                if_exists='append', 
                index=False,
                chunksize=2000 # Uploads in batches to keep memory usage low
            )
            
            print(f"   ✅ Success.")
            success_count += 1
            
        except Exception as e:
            print(f"   ❌ Failed to process {filename}. Error: {e}")
            
    # Calculate runtime
    end_time = time.time()
    elapsed_time = round(end_time - start_time, 2)
    
    print("\n" + "="*40)
    print(f"🎉 Done! Successfully uploaded {success_count} out of {len(csv_files)} files in {elapsed_time} seconds.")

if __name__ == "__main__":
    clean_and_upload_cms_files()