export interface HeroInsight {
  headline: string;
  subheadline: string;
}

export interface Summary {
  totalVolume: number;
  totalInefficiency: number;
  annualInefficiency: number;
  dailyInefficiency: number;
  avgInefficiencyPct: number;
  largestIssue: string;
  largestIssuePct: number;
  activeFlows: number;
  potentialSavings: number;
  annualPotentialSavings: number;
}

export interface MoneyJourneyStep {
  type: string;
  label: string;
  value: string;
  isInefficient: boolean;
  issue?: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  severity: string;
  estLoss: number;
}

export interface Recommendation {
  title: string;
  description: string;
  provider: string;
  estimatedSavings: number;
}

export interface OptimizedFlowStep {
  type: string;
  value: string;
}

export interface OptimizedFlow {
  name: string;
  steps: OptimizedFlowStep[];
  benefit: string;
  estimatedSavings: number;
}

export interface AnalysisData {
  fromCountry: string;
  toCountry: string;
  heroInsight: HeroInsight;
  summary: Summary;
  moneyJourney: MoneyJourneyStep[];
  issues: Issue[];
  recommendations: Recommendation[];
  optimizedFlows: OptimizedFlow[];
  breakdowns: {
    byProvider: { provider: string; value: number }[];
    byRoute: { route: string; value: number }[];
    byFlowType: { flow_type: string; value: number }[];
    byEntity: { entity: string; value: number }[];
  };
  simulations: any[];
}
