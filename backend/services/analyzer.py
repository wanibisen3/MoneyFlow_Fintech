import pandas as pd
import numpy as np
from typing import Dict, Any, List
from backend.services.corridor_config import get_corridor_config
from backend.services.provider_config import PROVIDER_CONFIG

def run_analysis(df: pd.DataFrame, from_country: str, to_country: str) -> Dict[str, Any]:
    # Core Analysis Logic
    df['expected_target_amount'] = df['source_amount'] * df['reference_fx_rate']
    df['inefficiency_amount'] = (df['expected_target_amount'] - df['target_amount']).clip(lower=0)
    df['inefficiency_pct'] = df['inefficiency_amount'] / df['expected_target_amount']
    
    total_volume = float(df['source_amount'].sum())
    total_inefficiency = float(df['inefficiency_amount'].sum())
    avg_inefficiency_pct = float(df['inefficiency_pct'].mean()) * 100
    
    # Issue Detection
    issues = []
    corridor_cfg = get_corridor_config(from_country, to_country)
    
    # 1. Double Conversion
    double_conv_df = df[df['route'].str.count('-') >= 2]
    if not double_conv_df.empty:
        impact = float(double_conv_df['inefficiency_amount'].sum())
        issues.append({
            "title": "Double conversion detected",
            "description": f"SGD -> USD -> IDR creates avoidable FX loss",
            "impact": impact,
            "severity": "high" if impact > total_inefficiency * 0.3 else "medium"
        })
    
    # 2. High FX Inefficiency by Provider
    provider_stats = df.groupby('provider')['inefficiency_pct'].mean()
    for provider, pct in provider_stats.items():
        threshold = PROVIDER_CONFIG.get(provider, {}).get('fx_threshold', 0.01)
        if pct > threshold:
            issues.append({
                "title": f"High FX spread via {provider}",
                "description": f"{provider} is charging {pct*100:.2f}% which is above the optimal threshold.",
                "impact": float(df[df['provider'] == provider]['inefficiency_amount'].sum()),
                "severity": "medium"
            })

    # 3. Local Rail Opportunity
    if corridor_cfg and corridor_cfg.get('local_rails_important'):
        non_local_df = df[~df['flow_type'].str.contains('Local', case=False)]
        if not non_local_df.empty:
            issues.append({
                "title": "Local rail opportunity",
                "description": f"Using international rails for {to_country} settlement increases costs.",
                "impact": float(non_local_df['inefficiency_amount'].sum() * 0.4),
                "severity": "medium"
            })

    # Breakdowns
    breakdowns = {
        "byProvider": df.groupby('provider')['inefficiency_amount'].sum().reset_index().rename(columns={'inefficiency_amount': 'value'}).to_dict('records'),
        "byRoute": df.groupby('route')['inefficiency_amount'].sum().reset_index().rename(columns={'inefficiency_amount': 'value'}).to_dict('records'),
        "byFlowType": df.groupby('flow_type')['inefficiency_amount'].sum().reset_index().rename(columns={'inefficiency_amount': 'value'}).to_dict('records'),
        "byEntity": df.groupby('entity')['inefficiency_amount'].sum().reset_index().rename(columns={'inefficiency_amount': 'value'}).to_dict('records')
    }
    
    largest_issue = issues[0]['title'] if issues else "No major issues"
    
    return {
        "summary": {
            "totalVolume": total_volume,
            "totalInefficiency": total_inefficiency,
            "avgInefficiencyPct": avg_inefficiency_pct,
            "largestIssue": largest_issue
        },
        "issues": issues,
        "breakdowns": breakdowns,
        "df": df
    }
