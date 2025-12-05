import type {
  PropertyDetails,
  IncomeDetails,
  ExpenseDetails,
  ClosingCosts,
  CalculatedMetrics,
  AffordabilityAssessment,
  BorrowerProfile,
  ReserveRequirements,
  CreditScoreImpact,
  LoanComparison,
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

  // PITIA - Principal, Interest, Taxes, Insurance, Association (HOA)
  const monthlyPITIA = monthlyMortgagePayment + propertyTaxMonthly + insuranceMonthly + expenses.hoaMonthly;

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

  // DSCR - Debt Service Coverage Ratio
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
    monthlyPITIA,
  };
}

/**
 * Generate affordability assessment
 */
export function generateAssessment(metrics: CalculatedMetrics): AffordabilityAssessment {
  const recommendations: string[] = [];
  const warnings: string[] = [];

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
 * Calculate reserve requirements based on borrower profile and property
 */
export function calculateReserveRequirements(
  metrics: CalculatedMetrics,
  borrower: BorrowerProfile
): ReserveRequirements {
  // Base reserve: 6 months of PITIA for investment properties
  const monthsRequired = 6;
  const baseReserveRequired = metrics.monthlyPITIA * monthsRequired;

  // Additional reserves based on number of financed properties (Fannie Mae guidelines)
  let additionalReservePercent = 0;
  if (borrower.numberOfFinancedProperties >= 7) {
    additionalReservePercent = 6;
  } else if (borrower.numberOfFinancedProperties >= 5) {
    additionalReservePercent = 4;
  } else if (borrower.numberOfFinancedProperties >= 2) {
    additionalReservePercent = 2;
  }

  // Calculate additional reserves on aggregate unpaid balance
  // Simplified: assume average loan balance of current loan amount
  const additionalReserveRequired = metrics.loanAmount * (additionalReservePercent / 100);

  const totalReserveRequired = baseReserveRequired + additionalReserveRequired;
  const reserveShortfall = Math.max(0, totalReserveRequired - borrower.liquidAssets);
  const meetsRequirements = borrower.liquidAssets >= totalReserveRequired;

  return {
    monthsRequired,
    monthlyPITIA: metrics.monthlyPITIA,
    baseReserveRequired,
    additionalReservePercent,
    additionalReserveRequired,
    totalReserveRequired,
    currentLiquidAssets: borrower.liquidAssets,
    reserveShortfall,
    meetsRequirements,
  };
}

/**
 * Calculate credit score impact on loan terms
 */
export function calculateCreditScoreImpact(
  borrower: BorrowerProfile,
  property: PropertyDetails
): CreditScoreImpact {
  const score = borrower.creditScore;
  const recommendations: string[] = [];

  let tier: 'excellent' | 'good' | 'fair' | 'poor';
  let maxLTV: number;
  let rateAdjustment: number;
  let approvalLikelihood: 'high' | 'medium' | 'low' | 'unlikely';

  if (score >= 760) {
    tier = 'excellent';
    maxLTV = 80;
    rateAdjustment = 0;
    approvalLikelihood = 'high';
    recommendations.push('Excellent credit score qualifies for best available rates.');
  } else if (score >= 700) {
    tier = 'good';
    maxLTV = 80;
    rateAdjustment = 0.25;
    approvalLikelihood = 'high';
    recommendations.push('Good credit score should qualify for competitive rates.');
  } else if (score >= 660) {
    tier = 'fair';
    maxLTV = 75;
    rateAdjustment = 0.75;
    approvalLikelihood = 'medium';
    recommendations.push('Consider improving credit score to get better rates.');
    if (property.downPaymentPercent < 25) {
      recommendations.push('A larger down payment (25%+) may improve approval odds.');
    }
  } else {
    tier = 'poor';
    maxLTV = 70;
    rateAdjustment = 1.5;
    approvalLikelihood = score >= 620 ? 'low' : 'unlikely';
    recommendations.push('Credit score may limit loan options. Consider credit repair.');
    recommendations.push('DSCR loans may be more accessible with lower credit scores.');
    if (score < 620) {
      recommendations.push('Most conventional lenders require minimum 620 score.');
    }
  }

  // Check if current LTV exceeds max for credit tier
  const currentLTV = 100 - property.downPaymentPercent;
  if (currentLTV > maxLTV) {
    recommendations.push(`Current LTV (${currentLTV}%) exceeds max for credit tier (${maxLTV}%). Increase down payment.`);
  }

  return {
    score,
    tier,
    maxLTV,
    rateAdjustment,
    approvalLikelihood,
    recommendations,
  };
}

/**
 * Generate loan comparison for different loan types
 */
export function generateLoanComparisons(
  property: PropertyDetails,
  metrics: CalculatedMetrics,
  borrower: BorrowerProfile
): LoanComparison[] {
  const comparisons: LoanComparison[] = [];
  const currentLTV = 100 - property.downPaymentPercent;

  // Conventional Loan
  const conventionalReasons: string[] = [];
  let conventionalQualifies = true;

  if (borrower.creditScore < 620) {
    conventionalQualifies = false;
    conventionalReasons.push('Credit score below 620 minimum');
  }
  if (currentLTV > 80) {
    conventionalQualifies = false;
    conventionalReasons.push('LTV exceeds 80% maximum');
  }
  if (borrower.numberOfFinancedProperties > 10) {
    conventionalQualifies = false;
    conventionalReasons.push('Exceeds 10 financed property limit');
  }

  comparisons.push({
    loanType: 'conventional',
    name: 'Conventional Investment Loan',
    minDownPayment: 20,
    estimatedRate: property.interestRate + (borrower.creditScore < 740 ? 0.5 : 0),
    minCreditScore: 620,
    minDSCR: 0,
    maxLTV: 80,
    incomeVerification: true,
    reserveMonths: 6,
    maxProperties: 10,
    pros: [
      'Typically lower interest rates',
      'No prepayment penalties',
      'Can be used for primary or investment',
    ],
    cons: [
      'Requires income verification (tax returns, W-2s)',
      'DTI ratio limits apply',
      'Limited to 10 financed properties',
      'Stricter credit requirements',
    ],
    qualifies: conventionalQualifies,
    disqualifyReasons: conventionalReasons,
  });

  // DSCR Loan
  const dscrReasons: string[] = [];
  let dscrQualifies = true;

  if (borrower.creditScore < 620) {
    dscrQualifies = false;
    dscrReasons.push('Credit score below 620 minimum');
  }
  if (metrics.debtServiceCoverageRatio < 0.75) {
    dscrQualifies = false;
    dscrReasons.push('DSCR below 0.75 minimum');
  }
  if (currentLTV > 80) {
    dscrQualifies = false;
    dscrReasons.push('LTV exceeds 80% maximum');
  }

  comparisons.push({
    loanType: 'dscr',
    name: 'DSCR Loan',
    minDownPayment: 20,
    estimatedRate: property.interestRate + 0.5,
    minCreditScore: 620,
    minDSCR: 0.75,
    maxLTV: 80,
    incomeVerification: false,
    reserveMonths: 6,
    maxProperties: 'unlimited',
    pros: [
      'No personal income verification required',
      'No DTI ratio limits',
      'Unlimited number of properties',
      'Faster closing process',
      'Great for self-employed investors',
    ],
    cons: [
      'Slightly higher interest rates',
      'Property must generate sufficient income',
      'May have prepayment penalties',
      'Higher reserve requirements possible',
    ],
    qualifies: dscrQualifies,
    disqualifyReasons: dscrReasons,
  });

  // Portfolio Loan
  const portfolioReasons: string[] = [];
  let portfolioQualifies = true;

  if (borrower.creditScore < 600) {
    portfolioQualifies = false;
    portfolioReasons.push('Credit score below typical 600 minimum');
  }

  comparisons.push({
    loanType: 'portfolio',
    name: 'Portfolio Loan',
    minDownPayment: 25,
    estimatedRate: property.interestRate + 1.0,
    minCreditScore: 600,
    minDSCR: 0,
    maxLTV: 75,
    incomeVerification: true,
    reserveMonths: 6,
    maxProperties: 'unlimited',
    pros: [
      'More flexible underwriting',
      'Can finance unique properties',
      'Local bank relationships matter',
      'May allow lower credit scores',
      'No property count limits',
    ],
    cons: [
      'Higher interest rates',
      'Often requires banking relationship',
      'May have balloon payments',
      'Less standardized terms',
      'Higher down payment typically required',
    ],
    qualifies: portfolioQualifies,
    disqualifyReasons: portfolioReasons,
  });

  return comparisons;
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
