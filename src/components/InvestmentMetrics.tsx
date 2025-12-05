import type { CalculatedMetrics } from '../types';
import { SectionCard } from './SectionCard';
import { formatCurrency, formatPercent, formatRatio } from '../utils/calculations';

interface InvestmentMetricsProps {
  metrics: CalculatedMetrics;
}

export function InvestmentMetrics({ metrics }: InvestmentMetricsProps) {
  const TrendingIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );

  const getCapRateColor = (rate: number) => {
    if (rate >= 10) return 'text-green-600 bg-green-50';
    if (rate >= 7) return 'text-blue-600 bg-blue-50';
    if (rate >= 5) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getDscrColor = (dscr: number) => {
    if (dscr >= 1.5) return 'text-green-600 bg-green-50';
    if (dscr >= 1.25) return 'text-blue-600 bg-blue-50';
    if (dscr >= 1.0) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getCocColor = (coc: number) => {
    if (coc >= 12) return 'text-green-600 bg-green-50';
    if (coc >= 8) return 'text-blue-600 bg-blue-50';
    if (coc >= 5) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <SectionCard title="Investment Metrics" icon={<TrendingIcon />} variant="highlight">
      <div className="space-y-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {/* DSCR - Most important for loan approval */}
          <div className={`rounded-lg p-4 text-center ${getDscrColor(metrics.debtServiceCoverageRatio)}`}>
            <p className="text-xs font-medium uppercase tracking-wide opacity-75">DSCR</p>
            <p className="text-2xl font-bold mt-1">{formatRatio(metrics.debtServiceCoverageRatio)}</p>
            <p className="text-xs mt-1">Debt Service Coverage</p>
          </div>

          {/* Cap Rate */}
          <div className={`rounded-lg p-4 text-center ${getCapRateColor(metrics.capRate)}`}>
            <p className="text-xs font-medium uppercase tracking-wide opacity-75">Cap Rate</p>
            <p className="text-2xl font-bold mt-1">{formatPercent(metrics.capRate)}</p>
            <p className="text-xs mt-1">NOI / Purchase Price</p>
          </div>

          {/* Cash-on-Cash Return */}
          <div className={`rounded-lg p-4 text-center ${getCocColor(metrics.cashOnCashReturn)}`}>
            <p className="text-xs font-medium uppercase tracking-wide opacity-75">Cash-on-Cash</p>
            <p className="text-2xl font-bold mt-1">{formatPercent(metrics.cashOnCashReturn)}</p>
            <p className="text-xs mt-1">Annual Return on Cash</p>
          </div>

          {/* Total ROI */}
          <div className="rounded-lg p-4 text-center bg-purple-50 text-purple-600">
            <p className="text-xs font-medium uppercase tracking-wide opacity-75">Total ROI</p>
            <p className="text-2xl font-bold mt-1">{formatPercent(metrics.totalROI)}</p>
            <p className="text-xs mt-1">Including Equity</p>
          </div>

          {/* GRM */}
          <div className="rounded-lg p-4 text-center bg-gray-50 text-gray-600">
            <p className="text-xs font-medium uppercase tracking-wide opacity-75">GRM</p>
            <p className="text-2xl font-bold mt-1">{formatRatio(metrics.grossRentMultiplier)}</p>
            <p className="text-xs mt-1">Gross Rent Multiplier</p>
          </div>

          {/* Break-Even */}
          <div className={`rounded-lg p-4 text-center ${metrics.breakEvenRatio > 85 ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600'}`}>
            <p className="text-xs font-medium uppercase tracking-wide opacity-75">Break-Even</p>
            <p className="text-2xl font-bold mt-1">{formatPercent(metrics.breakEvenRatio, 1)}</p>
            <p className="text-xs mt-1">Occupancy Required</p>
          </div>
        </div>

        {/* DSCR Explanation - Critical for loan officers */}
        <div className="bg-white border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">DSCR (Debt Service Coverage Ratio)</h4>
          <p className="text-sm text-gray-600 mb-3">
            The DSCR measures the property's ability to cover its debt obligations. Most lenders require:
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span>&ge; 1.50: Excellent</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <span>1.25-1.49: Good</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              <span>1.00-1.24: Marginal</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span>&lt; 1.00: Insufficient</span>
            </div>
          </div>
        </div>

        {/* Investment Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Total Cash Needed</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(metrics.totalCashNeeded)}</p>
            <p className="text-xs text-gray-500 mt-1">
              Down Payment: {formatCurrency(metrics.downPaymentAmount)}
            </p>
            <p className="text-xs text-gray-500">
              Closing Costs: {formatCurrency(metrics.totalClosingCosts)}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Loan Amount</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(metrics.loanAmount)}</p>
            <p className="text-xs text-gray-500 mt-1">
              Monthly Payment: {formatCurrency(metrics.monthlyMortgagePayment)}
            </p>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
