PROVIDER_CONFIG = {
    "Stripe": {
        "strengths": ["collection", "cards"],
        "weaknesses": ["FX-heavy flows", "payout FX cost"],
        "fx_threshold": 0.015
    },
    "Wise": {
        "strengths": ["direct FX", "cross-border payout"],
        "weaknesses": ["not collection-first"],
        "fx_threshold": 0.005
    },
    "Revolut": {
        "strengths": ["FX", "treasury", "multi-currency holding"],
        "weaknesses": ["not always primary collection layer"],
        "fx_threshold": 0.005
    },
    "Airwallex": {
        "strengths": ["local rails", "multi-currency infrastructure"],
        "weaknesses": ["may not always be best for every FX hop"],
        "fx_threshold": 0.008
    },
    "LocalBank": {
        "strengths": ["local settlement", "domestic rails"],
        "weaknesses": ["limited cross-border optimization"],
        "fx_threshold": 0.02
    }
}
