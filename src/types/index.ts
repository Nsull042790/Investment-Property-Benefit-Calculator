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
  maintenancePercent: number; // % of rent
  propertyManagementPercent: number; // % of rent
  utilitiesMonthly: number;
  capexReservePercent: number; // % of rent for capital expenditures
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
  // Loan Details
  loanAmount: number;
  downPaymentAmount: number;
  monthlyMortgagePayment: number;

  // Income
  grossMonthlyIncome: number;
  effectiveGrossIncome: number; // After vacancy
  annualGrossIncome: number;

  // Expenses
  totalMonthlyExpenses: number;
  totalAnnualExpenses: number;

  // Cash Flow
  monthlyNetOperatingIncome: number;
  annualNetOperatingIncome: number;
  monthlyCashFlow: number;
  annualCashFlow: number;

  // Closing Costs
  totalClosingCosts: number;
  totalCashNeeded: number; // Down payment + closing costs

  // Investment Metrics
  capRate: number;
  cashOnCashReturn: number;
  debtServiceCoverageRatio: number;
  grossRentMultiplier: number;
  breakEvenRatio: number;

  // Return Analysis
  totalROI: number;
  monthlyPrincipalPayment: number;
  monthlyInterestPayment: number;
}

export interface AffordabilityAssessment {
  isAffordable: boolean;
  cashFlowStatus: 'positive' | 'negative' | 'break-even';
  dscrStatus: 'excellent' | 'good' | 'acceptable' | 'poor';
  capRateStatus: 'excellent' | 'good' | 'fair' | 'poor';
  recommendations: string[];
  warnings: string[];
}

export interface PropertyAnalysis {
  property: PropertyDetails;
  income: IncomeDetails;
  expenses: ExpenseDetails;
  closingCosts: ClosingCosts;
  metrics: CalculatedMetrics;
  assessment: AffordabilityAssessment;
}
