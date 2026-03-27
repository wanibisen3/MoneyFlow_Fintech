from typing import Dict, List, Optional

CORRIDOR_CONFIGS = {
    "Singapore-Indonesia": {
        "from_country": "Singapore",
        "to_country": "Indonesia",
        "common_inefficiencies": ["Double conversion via USD", "Card-led payout cost"],
        "preferred_routes": ["SGD-IDR"],
        "local_rails_important": True,
        "likely_local_settlement_benefit": True,
        "double_conversion_paths": ["SGD-USD-IDR"]
    },
    "Singapore-Malaysia": {
        "from_country": "Singapore",
        "to_country": "Malaysia",
        "common_inefficiencies": ["High FX spread", "Intermediary bank fees"],
        "preferred_routes": ["SGD-MYR"],
        "local_rails_important": True,
        "likely_local_settlement_benefit": True,
        "double_conversion_paths": ["SGD-USD-MYR"]
    }
}

def get_corridor_config(from_country: str, to_country: str) -> Optional[Dict]:
    key = f"{from_country}-{to_country}"
    return CORRIDOR_CONFIGS.get(key)
