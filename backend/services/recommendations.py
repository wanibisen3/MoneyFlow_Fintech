from typing import List, Dict, Any
import pandas as pd
from backend.services.corridor_config import get_corridor_config

def generate_recommendations(df: pd.DataFrame, issues: List[Dict], from_country: str, to_country: str) -> List[Dict[str, Any]]:
    recommendations = []
    corridor_cfg = get_corridor_config(from_country, to_country)
    
    for issue in issues:
        if "Double conversion" in issue['title']:
            recommendations.append({
                "title": "Avoid SGD -> USD -> IDR route",
                "description": "Double conversion creates avoidable FX loss by converting twice.",
                "action": "Configure your payout engine to convert directly from SGD to IDR.",
                "estimatedSavings": round(issue['impact'] * 0.8, 2),
                "confidence": "high",
                "providersInvolved": ["Wise", "Airwallex"]
            })
        
        if "High FX spread via Stripe" in issue['title']:
            recommendations.append({
                "title": "Move FX from Stripe to Wise",
                "description": "Stripe is efficient for collection but suboptimal for FX in this flow.",
                "action": "Keep Stripe for collection and route conversion via Wise before payout.",
                "estimatedSavings": round(issue['impact'] * 0.6, 2),
                "confidence": "high",
                "providersInvolved": ["Stripe", "Wise"]
            })

    if corridor_cfg and corridor_cfg.get('likely_local_settlement_benefit'):
        recommendations.append({
            "title": f"Use Local Rails for {to_country}",
            "description": f"Local rails in {to_country} are significantly cheaper than SWIFT/International rails.",
            "action": f"Integrate with Airwallex or a LocalBank in {to_country} for domestic settlement.",
            "estimatedSavings": 5000.0, # Baseline estimate
            "confidence": "medium",
            "providersInvolved": ["Airwallex", "LocalBank"]
        })

    return recommendations

def generate_optimized_flows(from_country: str, to_country: str) -> List[Dict[str, Any]]:
    return [
        {
            "name": "Recommended Flow",
            "steps": [
                {"type": "country", "value": from_country},
                {"type": "provider", "value": "Stripe"},
                {"type": "provider", "value": "Wise"},
                {"type": "provider", "value": "Airwallex"},
                {"type": "country", "value": to_country}
            ],
            "benefit": "Reduces FX inefficiency and improves local settlement",
            "estimatedSavings": 18000.0
        }
    ]
