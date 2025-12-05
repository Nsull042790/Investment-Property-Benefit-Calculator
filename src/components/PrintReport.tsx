import type {
  PropertyDetails,
  IncomeDetails,
  ExpenseDetails,
  CalculatedMetrics,
  AffordabilityAssessment,
  BorrowerProfile,
  ReserveRequirements,
  CreditScoreImpact,
  LoanComparison,
} from '../types';
import { formatCurrency, formatPercent, formatRatio } from '../utils/calculations';

interface PrintReportProps {
  property: PropertyDetails;
  income: IncomeDetails;
  expenses: ExpenseDetails;
  metrics: CalculatedMetrics;
  assessment: AffordabilityAssessment;
  borrower: BorrowerProfile;
  reserves: ReserveRequirements;
  creditImpact: CreditScoreImpact;
  loanComparisons: LoanComparison[];
}

export function PrintReport({
  property,
  income,
  expenses,
  metrics,
  assessment,
  borrower,
  reserves,
  creditImpact,
  loanComparisons,
}: PrintReportProps) {
  const handlePrint = () => {
    window.print();
  };

  const PrintIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
    </svg>
  );

  const propertyTypeLabels: Record<string, string> = {
    'single-family': 'Single Family Home',
    'multi-family': 'Multi-Family (2-4 Units)',
    'condo': 'Condominium',
    'townhouse': 'Townhouse',
  };

  return (
    <>
      {/* Print Button */}
      <button
        onClick={handlePrint}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors print:hidden"
      >
        <PrintIcon />
        Print / Export Report
      </button>

      {/* Printable Report (hidden on screen, visible when printing) */}
      <div className="hidden print:block print:text-black print:bg-white p-8">
        <style>{`
          @media print {
            body * { visibility: hidden; }
            .print\\:block, .print\\:block * { visibility: visible; }
            .print\\:block { position: absolute; left: 0; top: 0; width: 100%; }
            @page { margin: 0.5in; }
          }
        `}</style>

        {/* Header */}
        <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
          <h1 className="text-2xl font-bold">Investment Property Analysis Report</h1>
          <p className="text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
        </div>

        {/* Assessment Summary */}
        <div className={`p-4 rounded-lg mb-6 ${assessment.isAffordable ? 'bg-green-100' : 'bg-red-100'}`}>
          <h2 className="text-xl font-bold text-center mb-2">
            {assessment.isAffordable ? '✓ LIKELY TO QUALIFY' : '✗ MAY NOT QUALIFY'}
          </h2>
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <p className="font-medium">Cash Flow</p>
              <p className="capitalize">{assessment.cashFlowStatus}</p>
            </div>
            <div>
              <p className="font-medium">DSCR</p>
              <p className="capitalize">{assessment.dscrStatus}</p>
            </div>
            <div>
              <p className="font-medium">Cap Rate</p>
              <p className="capitalize">{assessment.capRateStatus}</p>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-2 gap-6 text-sm">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Property Details */}
            <div className="border rounded p-3">
              <h3 className="font-bold border-b pb-1 mb-2">Property Details</h3>
              <table className="w-full">
                <tbody>
                  <tr><td className="text-gray-600">Type</td><td className="text-right">{propertyTypeLabels[property.propertyType]}</td></tr>
                  <tr><td className="text-gray-600">Purchase Price</td><td className="text-right">{formatCurrency(property.purchasePrice)}</td></tr>
                  <tr><td className="text-gray-600">Down Payment</td><td className="text-right">{property.downPaymentPercent}% ({formatCurrency(metrics.downPaymentAmount)})</td></tr>
                  <tr><td className="text-gray-600">Loan Amount</td><td className="text-right">{formatCurrency(metrics.loanAmount)}</td></tr>
                  <tr><td className="text-gray-600">Interest Rate</td><td className="text-right">{property.interestRate}%</td></tr>
                  <tr><td className="text-gray-600">Loan Term</td><td className="text-right">{property.loanTermYears} years</td></tr>
                </tbody>
              </table>
            </div>

            {/* Income */}
            <div className="border rounded p-3">
              <h3 className="font-bold border-b pb-1 mb-2">Income</h3>
              <table className="w-full">
                <tbody>
                  <tr><td className="text-gray-600">Monthly Rent</td><td className="text-right">{formatCurrency(income.monthlyRent)}</td></tr>
                  <tr><td className="text-gray-600">Other Income</td><td className="text-right">{formatCurrency(income.otherMonthlyIncome)}</td></tr>
                  <tr><td className="text-gray-600">Vacancy Rate</td><td className="text-right">{income.vacancyRatePercent}%</td></tr>
                  <tr className="font-medium"><td>Effective Income</td><td className="text-right">{formatCurrency(metrics.effectiveGrossIncome)}/mo</td></tr>
                </tbody>
              </table>
            </div>

            {/* Borrower */}
            <div className="border rounded p-3">
              <h3 className="font-bold border-b pb-1 mb-2">Borrower Profile</h3>
              <table className="w-full">
                <tbody>
                  <tr><td className="text-gray-600">Credit Score</td><td className="text-right">{borrower.creditScore} ({creditImpact.tier})</td></tr>
                  <tr><td className="text-gray-600">Financed Properties</td><td className="text-right">{borrower.numberOfFinancedProperties}</td></tr>
                  <tr><td className="text-gray-600">Liquid Assets</td><td className="text-right">{formatCurrency(borrower.liquidAssets)}</td></tr>
                  <tr><td className="text-gray-600">Self-Employed</td><td className="text-right">{borrower.isSelfEmployed ? 'Yes' : 'No'}</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Key Metrics */}
            <div className="border rounded p-3">
              <h3 className="font-bold border-b pb-1 mb-2">Investment Metrics</h3>
              <table className="w-full">
                <tbody>
                  <tr className="font-medium"><td>Monthly Cash Flow</td><td className="text-right">{formatCurrency(metrics.monthlyCashFlow)}</td></tr>
                  <tr className="font-medium"><td>DSCR</td><td className="text-right">{formatRatio(metrics.debtServiceCoverageRatio)}</td></tr>
                  <tr><td className="text-gray-600">Cap Rate</td><td className="text-right">{formatPercent(metrics.capRate)}</td></tr>
                  <tr><td className="text-gray-600">Cash-on-Cash Return</td><td className="text-right">{formatPercent(metrics.cashOnCashReturn)}</td></tr>
                  <tr><td className="text-gray-600">Total ROI (Year 1)</td><td className="text-right">{formatPercent(metrics.totalROI)}</td></tr>
                  <tr><td className="text-gray-600">Break-Even Ratio</td><td className="text-right">{formatPercent(metrics.breakEvenRatio)}</td></tr>
                </tbody>
              </table>
            </div>

            {/* Expenses */}
            <div className="border rounded p-3">
              <h3 className="font-bold border-b pb-1 mb-2">Monthly Expenses</h3>
              <table className="w-full">
                <tbody>
                  <tr><td className="text-gray-600">Mortgage (P&I)</td><td className="text-right">{formatCurrency(metrics.monthlyMortgagePayment)}</td></tr>
                  <tr><td className="text-gray-600">Property Tax</td><td className="text-right">{formatCurrency(expenses.propertyTaxAnnual / 12)}</td></tr>
                  <tr><td className="text-gray-600">Insurance</td><td className="text-right">{formatCurrency(expenses.insuranceAnnual / 12)}</td></tr>
                  <tr><td className="text-gray-600">HOA</td><td className="text-right">{formatCurrency(expenses.hoaMonthly)}</td></tr>
                  <tr><td className="text-gray-600">Operating Expenses</td><td className="text-right">{formatCurrency(metrics.totalMonthlyExpenses)}</td></tr>
                </tbody>
              </table>
            </div>

            {/* Reserves */}
            <div className={`border rounded p-3 ${reserves.meetsRequirements ? 'bg-green-50' : 'bg-red-50'}`}>
              <h3 className="font-bold border-b pb-1 mb-2">Reserve Requirements</h3>
              <table className="w-full">
                <tbody>
                  <tr><td className="text-gray-600">Required</td><td className="text-right">{formatCurrency(reserves.totalReserveRequired)}</td></tr>
                  <tr><td className="text-gray-600">Available</td><td className="text-right">{formatCurrency(reserves.currentLiquidAssets)}</td></tr>
                  <tr className="font-medium">
                    <td>Status</td>
                    <td className="text-right">{reserves.meetsRequirements ? '✓ Meets' : '✗ Shortfall: ' + formatCurrency(reserves.reserveShortfall)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Loan Options */}
        <div className="mt-6 border rounded p-3">
          <h3 className="font-bold border-b pb-1 mb-2">Loan Options</h3>
          <div className="grid grid-cols-3 gap-4 text-xs">
            {loanComparisons.map((loan) => (
              <div key={loan.loanType} className={`p-2 rounded ${loan.qualifies ? 'bg-green-50' : 'bg-red-50'}`}>
                <p className="font-bold">{loan.name}</p>
                <p>{loan.qualifies ? '✓ Qualifies' : '✗ Does not qualify'}</p>
                <p>Min Down: {loan.minDownPayment}%</p>
                <p>Est. Rate: {formatPercent(loan.estimatedRate)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t text-xs text-gray-500 text-center">
          <p>This report is for informational purposes only. Consult with a qualified mortgage professional for specific advice.</p>
        </div>
      </div>
    </>
  );
}
