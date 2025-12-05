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
  ApprovalRecommendation,
  ApprovalRoadmap,
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
 * Generate approval roadmap with prioritized recommendations
 */
export function generateApprovalRoadmap(
  property: PropertyDetails,
  income: IncomeDetails,
  expenses: ExpenseDetails,
  metrics: CalculatedMetrics,
  borrower: BorrowerProfile,
  reserves: ReserveRequirements,
  creditImpact: CreditScoreImpact,
  loanComparisons: LoanComparison[]
): ApprovalRoadmap {
  const recommendations: ApprovalRecommendation[] = [];
  const strengths: string[] = [];

  // Helper to generate unique IDs
  let idCounter = 0;
  const nextId = () => `rec-${++idCounter}`;

  // Analyze DSCR
  if (metrics.debtServiceCoverageRatio < 1.0) {
    const targetDSCR = 1.25;
    const currentDebtService = metrics.monthlyMortgagePayment * 12;
    const requiredNOI = currentDebtService * targetDSCR;
    const noiShortfall = requiredNOI - metrics.annualNetOperatingIncome;
    const monthlyRentIncrease = Math.ceil(noiShortfall / 12);

    // Calculate down payment to reach target DSCR
    const targetMonthlyPayment = metrics.annualNetOperatingIncome / targetDSCR / 12;
    const currentPayment = metrics.monthlyMortgagePayment;
    const paymentReductionNeeded = currentPayment - targetMonthlyPayment;
    const additionalDownPayment = paymentReductionNeeded > 0
      ? Math.ceil((paymentReductionNeeded / currentPayment) * metrics.loanAmount)
      : 0;

    recommendations.push({
      id: nextId(),
      category: 'dscr',
      priority: 'critical',
      title: 'DSCR Below Minimum',
      issue: 'Debt Service Coverage Ratio is below 1.0, meaning the property income does not cover the debt payments.',
      currentValue: metrics.debtServiceCoverageRatio.toFixed(2),
      targetValue: '1.25 (preferred)',
      action: `Increase monthly rent by $${monthlyRentIncrease.toLocaleString()} OR add $${additionalDownPayment.toLocaleString()} to down payment`,
      impact: 'Critical for loan approval - most lenders require minimum 1.0 DSCR',
      loanOfficerTalkingPoint: 'The property\'s rental income needs to cover the mortgage payment. Let\'s look at either increasing the rent expectation based on market comps, or putting more money down to reduce the monthly payment.',
      isDealBreaker: true,
    });
  } else if (metrics.debtServiceCoverageRatio < 1.25) {
    const targetDSCR = 1.25;
    const rentIncrease = Math.ceil(
      ((targetDSCR * metrics.monthlyMortgagePayment * 12) - metrics.annualNetOperatingIncome) / 12
    );

    recommendations.push({
      id: nextId(),
      category: 'dscr',
      priority: 'high',
      title: 'DSCR Below Preferred Level',
      issue: 'DSCR is acceptable but below the preferred 1.25 threshold.',
      currentValue: metrics.debtServiceCoverageRatio.toFixed(2),
      targetValue: '1.25+',
      action: `Increase monthly rent by $${rentIncrease.toLocaleString()} to reach 1.25 DSCR`,
      impact: 'Better rates and easier approval with DSCR above 1.25',
      loanOfficerTalkingPoint: 'The numbers work, but we\'re on the lower end. If we can justify a slightly higher rent or reduce some expenses, it will strengthen the application.',
      isDealBreaker: false,
    });
  } else {
    strengths.push(`Strong DSCR of ${metrics.debtServiceCoverageRatio.toFixed(2)} exceeds lender requirements`);
  }

  // Analyze Cash Flow
  if (metrics.monthlyCashFlow < 0) {
    const breakEvenRent = Math.ceil(income.monthlyRent - metrics.monthlyCashFlow);

    recommendations.push({
      id: nextId(),
      category: 'cash-flow',
      priority: 'critical',
      title: 'Negative Cash Flow',
      issue: 'Property will lose money each month after all expenses and mortgage.',
      currentValue: `$${metrics.monthlyCashFlow.toFixed(0)}/month`,
      targetValue: '$200+/month positive',
      action: `Increase rent to $${breakEvenRent.toLocaleString()}/month to break even, or reduce purchase price`,
      impact: 'Negative cash flow means ongoing out-of-pocket costs',
      loanOfficerTalkingPoint: 'At this price point, you\'ll be covering some costs out of pocket each month. Let\'s see if we can negotiate the price down or find a property with better rent potential.',
      isDealBreaker: true,
    });
  } else if (metrics.monthlyCashFlow < 200) {
    recommendations.push({
      id: nextId(),
      category: 'cash-flow',
      priority: 'medium',
      title: 'Thin Cash Flow Margins',
      issue: 'Cash flow is positive but leaves little buffer for unexpected expenses.',
      currentValue: `$${metrics.monthlyCashFlow.toFixed(0)}/month`,
      targetValue: '$200+/month',
      action: 'Consider negotiating lower purchase price or identifying expense reductions',
      impact: 'Limited margin for vacancies or repairs',
      loanOfficerTalkingPoint: 'The property cash flows, but the margin is thin. One unexpected repair or vacancy month could wipe out several months of profit.',
      isDealBreaker: false,
    });
  } else {
    strengths.push(`Healthy monthly cash flow of $${metrics.monthlyCashFlow.toFixed(0)}`);
  }

  // Analyze Reserves
  if (!reserves.meetsRequirements) {
    recommendations.push({
      id: nextId(),
      category: 'reserves',
      priority: 'critical',
      title: 'Insufficient Reserves',
      issue: 'Liquid assets do not meet lender reserve requirements.',
      currentValue: `$${reserves.currentLiquidAssets.toLocaleString()}`,
      targetValue: `$${reserves.totalReserveRequired.toLocaleString()}`,
      action: `Need additional $${reserves.reserveShortfall.toLocaleString()} in liquid assets before closing`,
      impact: 'Loan will be denied without adequate reserves',
      loanOfficerTalkingPoint: 'Lenders require you to have 6 months of payments in reserve after closing. You\'ll need to show these funds in your account.',
      isDealBreaker: true,
    });
  } else {
    const excessReserves = reserves.currentLiquidAssets - reserves.totalReserveRequired;
    if (excessReserves > reserves.totalReserveRequired) {
      strengths.push(`Strong reserves with $${excessReserves.toLocaleString()} excess liquidity`);
    }
  }

  // Analyze Credit Score
  if (borrower.creditScore < 620) {
    recommendations.push({
      id: nextId(),
      category: 'credit',
      priority: 'critical',
      title: 'Credit Score Below Minimum',
      issue: 'Most investment property lenders require minimum 620 credit score.',
      currentValue: borrower.creditScore.toString(),
      targetValue: '660+ (preferred)',
      action: 'Focus on credit repair: pay down balances, dispute errors, wait for negative items to age',
      impact: 'Loan denial likely without credit improvement',
      loanOfficerTalkingPoint: 'Your credit score is currently below most lender minimums. Let\'s discuss a timeline to improve your score before applying.',
      isDealBreaker: true,
    });
  } else if (borrower.creditScore < 700) {
    const potentialSavings = Math.ceil(metrics.loanAmount * (creditImpact.rateAdjustment / 100) / 12);

    recommendations.push({
      id: nextId(),
      category: 'credit',
      priority: 'medium',
      title: 'Credit Score Affecting Rate',
      issue: 'Credit score qualifies but results in higher interest rate.',
      currentValue: borrower.creditScore.toString(),
      targetValue: '740+',
      action: `Improving to 740+ could save approximately $${potentialSavings}/month`,
      impact: `Current rate adjustment: +${creditImpact.rateAdjustment}%`,
      loanOfficerTalkingPoint: 'You qualify, but a higher credit score would get you a better rate. Even a 40-point improvement could save you thousands over the life of the loan.',
      isDealBreaker: false,
    });
  } else if (borrower.creditScore >= 760) {
    strengths.push('Excellent credit score qualifies for best rates');
  }

  // Analyze Down Payment
  if (property.downPaymentPercent < 20) {
    const additionalNeeded = (20 - property.downPaymentPercent) / 100 * property.purchasePrice;

    recommendations.push({
      id: nextId(),
      category: 'down-payment',
      priority: 'critical',
      title: 'Down Payment Below Minimum',
      issue: 'Investment properties require minimum 20% down payment.',
      currentValue: `${property.downPaymentPercent}%`,
      targetValue: '20-25%',
      action: `Need additional $${additionalNeeded.toLocaleString()} for 20% down payment`,
      impact: 'Loan will be denied without adequate down payment',
      loanOfficerTalkingPoint: 'Investment property loans require at least 20% down, sometimes 25%. This reduces the lender\'s risk since investment properties have higher default rates.',
      isDealBreaker: true,
    });
  } else if (property.downPaymentPercent < 25 && borrower.creditScore < 700) {
    const benefitOf25 = Math.ceil(
      calculateMonthlyMortgage(
        property.purchasePrice * 0.8,
        property.interestRate,
        property.loanTermYears
      ) - calculateMonthlyMortgage(
        property.purchasePrice * 0.75,
        property.interestRate,
        property.loanTermYears
      )
    );

    recommendations.push({
      id: nextId(),
      category: 'down-payment',
      priority: 'high',
      title: 'Consider Higher Down Payment',
      issue: 'With credit score below 700, 25% down payment provides better terms.',
      currentValue: `${property.downPaymentPercent}%`,
      targetValue: '25%',
      action: `Increasing to 25% down would reduce payment by ~$${benefitOf25}/month and improve approval odds`,
      impact: 'Better rates and improved DSCR',
      loanOfficerTalkingPoint: 'Given your credit score, putting 25% down instead of 20% will help offset the rate and give you a stronger application.',
      isDealBreaker: false,
    });
  } else if (property.downPaymentPercent >= 25) {
    strengths.push('Strong down payment of 25%+ improves approval likelihood');
  }

  // Analyze expenses for potential reductions
  if (expenses.propertyManagementPercent > 0 && metrics.monthlyCashFlow < 200) {
    const pmSavings = income.monthlyRent * (expenses.propertyManagementPercent / 100);

    recommendations.push({
      id: nextId(),
      category: 'expenses',
      priority: 'low',
      title: 'Self-Management Option',
      issue: 'Property management fees reduce cash flow.',
      currentValue: `${expenses.propertyManagementPercent}% ($${pmSavings.toFixed(0)}/month)`,
      targetValue: '0% (self-manage)',
      action: `Self-managing would add $${pmSavings.toFixed(0)}/month to cash flow`,
      impact: 'Improves cash flow and DSCR',
      loanOfficerTalkingPoint: 'If you\'re willing and able to manage the property yourself, you\'d save the management fee and improve your cash flow.',
      isDealBreaker: false,
    });
  }

  // Check vacancy rate assumption
  if (income.vacancyRatePercent > 8) {
    recommendations.push({
      id: nextId(),
      category: 'income',
      priority: 'low',
      title: 'High Vacancy Assumption',
      issue: 'Vacancy rate may be higher than typical for the market.',
      currentValue: `${income.vacancyRatePercent}%`,
      targetValue: '5-8%',
      action: 'Research local vacancy rates - typical markets are 5-8%',
      impact: 'Lower vacancy assumption improves projected cash flow',
      loanOfficerTalkingPoint: 'Your vacancy assumption is conservative. If the local market supports a lower rate, your actual returns may be better.',
      isDealBreaker: false,
    });
  }

  // Suggest best loan product
  const qualifiedLoans = loanComparisons.filter(l => l.qualifies);
  let bestLoanOption = 'No loan products currently qualify';

  if (qualifiedLoans.length > 0) {
    // Prefer conventional if qualified, then DSCR for self-employed
    if (qualifiedLoans.some(l => l.loanType === 'conventional')) {
      bestLoanOption = borrower.isSelfEmployed
        ? 'DSCR Loan (no income verification needed for self-employed)'
        : 'Conventional Investment Loan (best rates)';
    } else if (qualifiedLoans.some(l => l.loanType === 'dscr')) {
      bestLoanOption = 'DSCR Loan (no income verification required)';
    } else {
      bestLoanOption = 'Portfolio Loan (flexible underwriting)';
    }
  } else {
    recommendations.push({
      id: nextId(),
      category: 'loan-product',
      priority: 'critical',
      title: 'No Loan Products Qualify',
      issue: 'Current profile does not qualify for standard loan products.',
      currentValue: 'Not qualified',
      targetValue: 'Qualified for at least one product',
      action: 'Address the critical issues above to qualify for financing',
      impact: 'Cannot proceed without qualification',
      loanOfficerTalkingPoint: 'We need to address some items before we can move forward with financing. Let\'s work through these one by one.',
      isDealBreaker: true,
    });
  }

  // Determine overall status
  const dealBreakers = recommendations.filter(r => r.isDealBreaker);
  const highPriorityItems = recommendations.filter(r => r.priority === 'high' && !r.isDealBreaker);
  const improvements = recommendations.filter(r => (r.priority === 'medium' || r.priority === 'low') && !r.isDealBreaker);

  let overallStatus: ApprovalRoadmap['overallStatus'];
  let statusMessage: string;
  let estimatedTimeToApproval: string;

  if (dealBreakers.length === 0 && highPriorityItems.length === 0) {
    overallStatus = 'approved';
    statusMessage = 'This deal is ready for loan application. All key metrics meet lender requirements.';
    estimatedTimeToApproval = 'Ready to apply - typically 30-45 days to close';
  } else if (dealBreakers.length === 0) {
    overallStatus = 'likely';
    statusMessage = 'Strong candidate for approval with minor improvements possible.';
    estimatedTimeToApproval = 'Can apply now - address improvements for better terms';
  } else if (dealBreakers.length === 1) {
    overallStatus = 'possible';
    statusMessage = 'One critical issue needs resolution before applying.';
    estimatedTimeToApproval = 'Address the critical issue first';
  } else if (dealBreakers.length <= 3) {
    overallStatus = 'unlikely';
    statusMessage = 'Multiple issues need resolution. Focus on critical items first.';
    estimatedTimeToApproval = 'Significant work needed before application';
  } else {
    overallStatus = 'not-qualified';
    statusMessage = 'This deal requires substantial restructuring to be viable.';
    estimatedTimeToApproval = 'Consider alternative properties or terms';
  }

  return {
    overallStatus,
    statusMessage,
    dealBreakers,
    highPriorityItems,
    improvements,
    strengths,
    bestLoanOption,
    estimatedTimeToApproval,
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
