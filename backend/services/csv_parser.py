import pandas as pd
import io
from fastapi import HTTPException

REQUIRED_COLUMNS = [
    "transaction_id", "date", "source_currency", "source_amount",
    "target_currency", "target_amount", "fx_rate_applied",
    "reference_fx_rate", "provider", "flow_type", "route", "entity"
]

def parse_csv_file(file_content: bytes) -> pd.DataFrame:
    try:
        df = pd.read_csv(io.BytesIO(file_content))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid CSV file: {str(e)}")
    
    missing_cols = [col for col in REQUIRED_COLUMNS if col not in df.columns]
    if missing_cols:
        raise HTTPException(
            status_code=400, 
            detail=f"Missing required columns: {', '.join(missing_cols)}"
        )
    
    return df
