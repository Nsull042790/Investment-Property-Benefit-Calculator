export interface PropertyDetails {
  purchasePrice: number;
  downPaymentPercent: number;
  interestRate: number;
  loanTermYears: number;
  propertyType: 'single-family' | 'multi-family' | 'condo' | 'townhouse';
  address?: string;
}

export interface IncomeDetails {
  monthlyRent: number;
  otherMonthlyIncome: number;
  vacancyRatePercent: number;
}

export interface ExpenseDetails {
  propertyTaxAnnual: number;
  insuranceAnnual: number;
  hoaMonthly: number;
  maintenancePercent: number;
  propertyManagementPercent: number;
  utilitiesMonthly: number;
  capexReservePercent: number;
}

export interface ClosingCosts {
  loanOriginationPercent: number;
  appraisalFee: number;
  inspectionFee: number;
  titleInsurance: number;
  escrowFee: number;
  attorneyFee: number;
  recordingFee: number;
  otherFees: number;
}

export interface CalculatedMetrics {
  loanAmount: number;
  downPaymentAmount: number;
  monthlyMortgagePayment: number;
  grossMonthlyIncome: number;
  effectiveGrossIncome: number;
  annualGrossIncome: number;
  totalMonthlyExpenses: number;
  totalAnnualExpenses: number;
  monthlyNetOperatingIncome: number;
  annualNetOperatingIncome: number;
  monthlyCashFlow: number;
  annualCashFlow: number;
  totalClosingCosts: number;
  totalCashNeeded: number;
  capRate: number;
  cashOnCashReturn: number;
  debtServiceCoverageRatio: number;
  grossRentMultiplier: number;
  breakEvenRatio: number;
  totalROI: number;
  monthlyPrincipalPayment: number;
  monthlyInterestPayment: number;
  monthlyPITIA: number; // Principal, Interest, Taxes, Insurance, HOA
}

export interface AffordabilityAssessment {
  isAffordable: boolean;
  cashFlowStatus: 'positive' | 'negative' | 'break-even';
  dscrStatus: 'excellent' | 'good' | 'acceptable' | 'poor';
  capRateStatus: 'excellent' | 'good' | 'fair' | 'poor';
  recommendations: string[];
  warnings: string[];
}

// New types for enhancements

export interface BorrowerProfile {
  creditScore: number;
  numberOfFinancedProperties: number;
  liquidAssets: number;
  annualIncome: number;
  monthlyDebts: number;
  isFirstTimeInvestor: boolean;
  isSelfEmployed: boolean;
}

export interface ReserveRequirements {
  monthsRequired: number;
  monthlyPITIA: number;
  baseReserveRequired: number;
  additionalReservePercent: number;
  additionalReserveRequired: number;
  totalReserveRequired: number;
  currentLiquidAssets: number;
  reserveShortfall: number;
  meetsRequirements: boolean;
}

export interface CreditScoreImpact {
  score: number;
  tier: 'excellent' | 'good' | 'fair' | 'poor';
  maxLTV: number;
  rateAdjustment: number;
  approvalLikelihood: 'high' | 'medium' | 'low' | 'unlikely';
  recommendations: string[];
}

export interface LoanComparison {
  loanType: 'conventional' | 'dscr' | 'portfolio';
  name: string;
  minDownPayment: number;
  estimatedRate: number;
  minCreditScore: number;
  minDSCR: number;
  maxLTV: number;
  incomeVerification: boolean;
  reserveMonths: number;
  maxProperties: number | 'unlimited';
  pros: string[];
  cons: string[];
  qualifies: boolean;
  disqualifyReasons: string[];
}

export interface QualificationChecklistItem {
  id: string;
  category: 'documentation' | 'financial' | 'property' | 'credit';
  label: string;
  description: string;
  required: boolean;
  completed: boolean;
}

export interface ScenarioAnalysis {
  name: string;
  property: PropertyDetails;
  metrics: CalculatedMetrics;
  assessment: AffordabilityAssessment;
}

export interface PropertyAnalysis {
  property: PropertyDetails;
  income: IncomeDetails;
  expenses: ExpenseDetails;
  closingCosts: ClosingCosts;
  metrics: CalculatedMetrics;
  assessment: AffordabilityAssessment;
  borrower?: BorrowerProfile;
  reserves?: ReserveRequirements;
  creditImpact?: CreditScoreImpact;
  loanComparisons?: LoanComparison[];
}
