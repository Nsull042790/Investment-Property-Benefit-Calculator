import type {
  PropertyDetails,
  IncomeDetails,
  ExpenseDetails,
  ClosingCosts,
  CalculatedMetrics,
  AffordabilityAssessment,
} from '../types';

/**
 * Calculate monthly mortgage payment using standard amortization formula
 */
export function calculateMonthlyMortgage(
  principal: number,
  annualRate: number,
  termYears: number
): number {
  if (principal <= 0 || termYears <= 0) return 0;
  if (annualRate <= 0) return principal / (termYears * 12);

  const monthlyRate = annualRate / 100 / 12;
  const numPayments = termYears * 12;

  const payment =
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);

  return payment;
}

/**
 * Calculate the interest portion of a mortgage payment for a given month
 */
export function calculateMonthlyInterest(
  remainingBalance: number,
  annualRate: number
): number {
  return remainingBalance * (annualRate / 100 / 12);
}

/**
 * Calculate total closing costs
 */
export function calculateTotalClosingCosts(
  loanAmount: number,
  closingCosts: ClosingCosts
): number {
  const originationFee = loanAmount * (closingCosts.loanOriginationPercent / 100);

  return (
    originationFee +
    closingCosts.appraisalFee +
    closingCosts.inspectionFee +
    closingCosts.titleInsurance +
    closingCosts.escrowFee +
    closingCosts.attorneyFee +
    closingCosts.recordingFee +
    closingCosts.otherFees
  );
}

/**
 * Calculate all investment metrics
 */
export function calculateMetrics(
  property: PropertyDetails,
  income: IncomeDetails,
  expenses: ExpenseDetails,
  closingCosts: ClosingCosts
): CalculatedMetrics {
  // Loan calculations
  const downPaymentAmount = property.purchasePrice * (property.downPaymentPercent / 100);
  const loanAmount = property.purchasePrice - downPaymentAmount;
  const monthlyMortgagePayment = calculateMonthlyMortgage(
    loanAmount,
    property.interestRate,
    property.loanTermYears
  );

  // Monthly interest/principal breakdown (for first month)
  const monthlyInterestPayment = calculateMonthlyInterest(loanAmount, property.interestRate);
  const monthlyPrincipalPayment = monthlyMortgagePayment - monthlyInterestPayment;

  // Income calculations
  const grossMonthlyIncome = income.monthlyRent + income.otherMonthlyIncome;
  const vacancyLoss = grossMonthlyIncome * (income.vacancyRatePercent / 100);
  const effectiveGrossIncome = grossMonthlyIncome - vacancyLoss;
  const annualGrossIncome = effectiveGrossIncome * 12;

  // Expense calculations (monthly)
  const propertyTaxMonthly = expenses.propertyTaxAnnual / 12;
  const insuranceMonthly = expenses.insuranceAnnual / 12;
  const maintenanceMonthly = income.monthlyRent * (expenses.maintenancePercent / 100);
  const propertyManagementMonthly = income.monthlyRent * (expenses.propertyManagementPercent / 100);
  const capexReserveMonthly = income.monthlyRent * (expenses.capexReservePercent / 100);

  const totalMonthlyExpenses =
    propertyTaxMonthly +
    insuranceMonthly +
    expenses.hoaMonthly +
    maintenanceMonthly +
    propertyManagementMonthly +
    expenses.utilitiesMonthly +
    capexReserveMonthly;

  const totalAnnualExpenses = totalMonthlyExpenses * 12;

  // NOI (Net Operating Income) - before debt service
  const monthlyNetOperatingIncome = effectiveGrossIncome - totalMonthlyExpenses;
  const annualNetOperatingIncome = monthlyNetOperatingIncome * 12;

  // Cash Flow - after debt service
  const monthlyCashFlow = monthlyNetOperatingIncome - monthlyMortgagePayment;
  const annualCashFlow = monthlyCashFlow * 12;

  // Closing costs
  const totalClosingCosts = calculateTotalClosingCosts(loanAmount, closingCosts);
  const totalCashNeeded = downPaymentAmount + totalClosingCosts;

  // Investment metrics
  const capRate = property.purchasePrice > 0
    ? (annualNetOperatingIncome / property.purchasePrice) * 100
    : 0;

  const cashOnCashReturn = totalCashNeeded > 0
    ? (annualCashFlow / totalCashNeeded) * 100
    : 0;

  // DSCR - Debt Service Coverage Ratio (key metric for loan approval)
  const annualDebtService = monthlyMortgagePayment * 12;
  const debtServiceCoverageRatio = annualDebtService > 0
    ? annualNetOperatingIncome / annualDebtService
    : 0;

  // Gross Rent Multiplier
  const grossRentMultiplier = annualGrossIncome > 0
    ? property.purchasePrice / annualGrossIncome
    : 0;

  // Break-Even Ratio
  const breakEvenRatio = effectiveGrossIncome > 0
    ? ((totalMonthlyExpenses + monthlyMortgagePayment) / effectiveGrossIncome) * 100
    : 0;

  // Total ROI (simplified - first year)
  const equityGain = monthlyPrincipalPayment * 12;
  const totalReturn = annualCashFlow + equityGain;
  const totalROI = totalCashNeeded > 0 ? (totalReturn / totalCashNeeded) * 100 : 0;

  return {
    loanAmount,
    downPaymentAmount,
    monthlyMortgagePayment,
    grossMonthlyIncome,
    effectiveGrossIncome,
    annualGrossIncome,
    totalMonthlyExpenses,
    totalAnnualExpenses,
    monthlyNetOperatingIncome,
    annualNetOperatingIncome,
    monthlyCashFlow,
    annualCashFlow,
    totalClosingCosts,
    totalCashNeeded,
    capRate,
    cashOnCashReturn,
    debtServiceCoverageRatio,
    grossRentMultiplier,
    breakEvenRatio,
    totalROI,
    monthlyPrincipalPayment,
    monthlyInterestPayment,
  };
}

/**
 * Generate affordability assessment
 */
export function generateAssessment(metrics: CalculatedMetrics): AffordabilityAssessment {
  const recommendations: string[] = [];
  const warnings: string[] = [];

  // Cash flow status
  let cashFlowStatus: 'positive' | 'negative' | 'break-even';
  if (metrics.monthlyCashFlow > 50) {
    cashFlowStatus = 'positive';
  } else if (metrics.monthlyCashFlow < -50) {
    cashFlowStatus = 'negative';
    warnings.push('Property has negative cash flow - you will lose money monthly.');
  } else {
    cashFlowStatus = 'break-even';
    warnings.push('Property barely breaks even - consider if this is worth the risk.');
  }

  // DSCR status (critical for loan approval)
  let dscrStatus: 'excellent' | 'good' | 'acceptable' | 'poor';
  if (metrics.debtServiceCoverageRatio >= 1.50) {
    dscrStatus = 'excellent';
    recommendations.push('Excellent DSCR - strong candidate for loan approval.');
  } else if (metrics.debtServiceCoverageRatio >= 1.25) {
    dscrStatus = 'good';
    recommendations.push('Good DSCR - should meet most lender requirements.');
  } else if (metrics.debtServiceCoverageRatio >= 1.0) {
    dscrStatus = 'acceptable';
    warnings.push('DSCR is marginal - some lenders may require additional reserves or higher down payment.');
  } else {
    dscrStatus = 'poor';
    warnings.push('DSCR below 1.0 - property income does not cover debt service. Loan unlikely to be approved.');
  }

  // Cap Rate status
  let capRateStatus: 'excellent' | 'good' | 'fair' | 'poor';
  if (metrics.capRate >= 10) {
    capRateStatus = 'excellent';
    recommendations.push('Excellent cap rate - strong potential return on investment.');
  } else if (metrics.capRate >= 7) {
    capRateStatus = 'good';
    recommendations.push('Good cap rate - solid investment opportunity.');
  } else if (metrics.capRate >= 5) {
    capRateStatus = 'fair';
    warnings.push('Cap rate is fair - typical for stable markets but may limit cash flow.');
  } else {
    capRateStatus = 'poor';
    warnings.push('Low cap rate - returns may not justify investment risk.');
  }

  // Additional recommendations based on other metrics
  if (metrics.cashOnCashReturn >= 12) {
    recommendations.push('Strong cash-on-cash return indicates efficient use of invested capital.');
  } else if (metrics.cashOnCashReturn < 5 && metrics.cashOnCashReturn >= 0) {
    warnings.push('Low cash-on-cash return - consider if returns justify the effort.');
  }

  if (metrics.breakEvenRatio > 85) {
    warnings.push('High break-even ratio - limited margin for unexpected expenses or vacancies.');
  }

  if (metrics.grossRentMultiplier > 15) {
    warnings.push('High GRM suggests property may be overpriced relative to rental income.');
  }

  // Overall affordability
  const isAffordable =
    cashFlowStatus !== 'negative' &&
    dscrStatus !== 'poor' &&
    capRateStatus !== 'poor';

  return {
    isAffordable,
    cashFlowStatus,
    dscrStatus,
    capRateStatus,
    recommendations,
    warnings,
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format percentage for display
 */
export function formatPercent(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format ratio for display
 */
export function formatRatio(value: number): string {
  return value.toFixed(2);
}
