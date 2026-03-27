from typing import List, Dict, Any
import pandas as pd
from backend.services.provider_config import PROVIDER_CONFIG

def simulate_savings(df: pd.DataFrame, issues: List[Dict]) -> List[Dict[str, Any]]:
    simulations = []
    
    # 1. Double Conversion Simulation
    double_conv_df = df[df['route'].str.count('-') >= 2]
    if not double_conv_df.empty:
        current_loss = float(double_conv_df['inefficiency_amount'].sum())
        # Assume direct conversion reduces loss by 70%
        savings = current_loss * 0.7
        simulations.append({
            "title": "Direct Conversion Optimization",
            "currentFlow": f"Route: {double_conv_df['route'].iloc[0]}",
            "optimizedFlow": "Direct SGD-IDR conversion via Wise/Airwallex",
            "estimatedSavings": round(savings, 2),
            "rationale": "Direct conversion avoids multiple FX spreads and intermediary bank fees."
        })
    
    # 2. Provider Optimization Simulation
    stripe_df = df[df['provider'] == 'Stripe']
    if not stripe_df.empty:
        current_loss = float(stripe_df['inefficiency_amount'].sum())
        # Assume moving FX-heavy flows to Wise saves 50% of the current loss
        savings = current_loss * 0.5
        simulations.append({
            "title": "FX Provider Optimization",
            "currentFlow": "Stripe for collection and payout",
            "optimizedFlow": "Stripe for collection, Wise for FX and payout",
            "estimatedSavings": round(savings, 2),
            "rationale": "Stripe is excellent for collection but Wise offers significantly lower FX spreads for payouts."
        })

    return simulations
