from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from backend.services.csv_parser import parse_csv_file
from backend.services.analyzer import run_analysis
from backend.services.simulator import simulate_savings
from backend.services.recommendations import generate_recommendations, generate_optimized_flows
from backend.services.corridor_config import get_corridor_config
from backend.models.responses import AnalysisResponse
import os
import pandas as pd

router = APIRouter()

def build_full_response(df: pd.DataFrame, from_country: str, to_country: str) -> AnalysisResponse:
    analysis = run_analysis(df, from_country, to_country)
    simulations = simulate_savings(df, analysis['issues'])
    recommendations = generate_recommendations(df, analysis['issues'], from_country, to_country)
    optimized_flows = generate_optimized_flows(from_country, to_country)
    
    # Hero Insight
    total_savings = sum(sim['estimatedSavings'] for sim in simulations)
    headline = f"You could improve efficiency by ${total_savings:,.0f} over the last 90 days"
    subheadline = f"{len(analysis['issues'])} major inefficiencies detected in your {from_country}-{to_country} corridor"
    
    # Money Journey (Simplified representation)
    money_journey = [
        {"step": from_country, "type": "country"},
        {"step": df['provider'].iloc[0], "type": "provider"},
        {"step": df['route'].iloc[0].split('-')[1], "type": "currency", "issue": "double conversion" if '-' in df['route'].iloc[0].split('-')[1] else None},
        {"step": "LocalBank", "type": "rail"},
        {"step": to_country, "type": "country"}
    ]
    
    return {
        "fromCountry": from_country,
        "toCountry": to_country,
        "heroInsight": {"headline": headline, "subheadline": subheadline},
        "summary": analysis['summary'],
        "moneyJourney": money_journey,
        "issues": analysis['issues'],
        "recommendations": recommendations,
        "optimizedFlows": optimized_flows,
        "breakdowns": analysis['breakdowns'],
        "simulations": simulations
    }

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_csv(
    file: UploadFile = File(...),
    fromCountry: str = Form(...),
    toCountry: str = Form(...)
):
    if not get_corridor_config(fromCountry, toCountry):
        raise HTTPException(status_code=400, detail=f"Unsupported corridor: {fromCountry} to {toCountry}")
    
    content = await file.read()
    df = parse_csv_file(content)
    
    if df.empty:
        raise HTTPException(status_code=400, detail="CSV file is empty")
        
    return build_full_response(df, fromCountry, toCountry)

@router.get("/sample-data", response_model=AnalysisResponse)
async def get_sample_data(fromCountry: str = "Singapore", toCountry: str = "Indonesia"):
    if not get_corridor_config(fromCountry, toCountry):
        raise HTTPException(status_code=400, detail=f"Unsupported corridor: {fromCountry} to {toCountry}")
    
    sample_path = os.path.join(os.path.dirname(__file__), "..", "sample_data", "sample_transactions.csv")
    if not os.path.exists(sample_path):
        raise HTTPException(status_code=500, detail="Sample data file not found")
        
    df = pd.read_csv(sample_path)
    # Filter by corridor currencies if needed, but for prototype we assume sample matches
    return build_full_response(df, fromCountry, toCountry)
