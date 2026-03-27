from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class HeroInsight(BaseModel):
    headline: str
    subheadline: str

class Summary(BaseModel):
    totalVolume: float
    totalInefficiency: float
    avgInefficiencyPct: float
    largestIssue: str

class MoneyJourneyStep(BaseModel):
    step: str
    type: str
    issue: Optional[str] = None

class Issue(BaseModel):
    title: str
    description: str
    impact: float
    severity: str

class Recommendation(BaseModel):
    title: str
    description: str
    action: str
    estimatedSavings: float
    confidence: str
    providersInvolved: List[str]

class OptimizedFlowStep(BaseModel):
    type: str
    value: str

class OptimizedFlow(BaseModel):
    name: str
    steps: List[OptimizedFlowStep]
    benefit: str
    estimatedSavings: float

class AnalysisResponse(BaseModel):
    fromCountry: str
    toCountry: str
    heroInsight: HeroInsight
    summary: Summary
    moneyJourney: List[MoneyJourneyStep]
    issues: List[Issue]
    recommendations: List[Recommendation]
    optimizedFlows: List[OptimizedFlow]
    breakdowns: Dict[str, List[Any]]
    simulations: List[Any]
