import type { CalculatedMetrics } from '../types';
import { SectionCard } from './SectionCard';
import { formatCurrency } from '../utils/calculations';

interface CashFlowAnalysisProps {
  metrics: CalculatedMetrics;
}

export function CashFlowAnalysis({ metrics }: CashFlowAnalysisProps) {
  const ChartIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );

  const cashFlowPositive = metrics.monthlyCashFlow >= 0;

  return (
    <SectionCard
      title="Cash Flow Analysis"
      icon={<ChartIcon />}
      variant={cashFlowPositive ? 'success' : 'error'}
    >
      <div className="space-y-6">
        {/* Monthly Breakdown */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Monthly Breakdown</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Gross Rental Income</span>
              <span className="font-medium text-green-600">+{formatCurrency(metrics.grossMonthlyIncome)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Less: Vacancy</span>
              <span className="font-medium text-red-600">
                -{formatCurrency(metrics.grossMonthlyIncome - metrics.effectiveGrossIncome)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200 bg-gray-50 px-2 -mx-2">
              <span className="font-medium text-gray-700">Effective Gross Income</span>
              <span className="font-semibold text-gray-900">{formatCurrency(metrics.effectiveGrossIncome)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Less: Operating Expenses</span>
              <span className="font-medium text-red-600">-{formatCurrency(metrics.totalMonthlyExpenses)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200 bg-blue-50 px-2 -mx-2">
              <span className="font-medium text-blue-700">Net Operating Income (NOI)</span>
              <span className="font-semibold text-blue-900">{formatCurrency(metrics.monthlyNetOperatingIncome)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Less: Mortgage Payment</span>
              <span className="font-medium text-red-600">-{formatCurrency(metrics.monthlyMortgagePayment)}</span>
            </div>
            <div className={`flex justify-between items-center py-3 px-2 -mx-2 rounded-lg ${cashFlowPositive ? 'bg-green-100' : 'bg-red-100'}`}>
              <span className={`font-semibold ${cashFlowPositive ? 'text-green-800' : 'text-red-800'}`}>
                Monthly Cash Flow
              </span>
              <span className={`text-xl font-bold ${cashFlowPositive ? 'text-green-700' : 'text-red-700'}`}>
                {formatCurrency(metrics.monthlyCashFlow)}
              </span>
            </div>
          </div>
        </div>

        {/* Annual Summary */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Annual Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">Annual NOI</p>
              <p className="text-lg font-bold text-blue-700">{formatCurrency(metrics.annualNetOperatingIncome)}</p>
            </div>
            <div className={`rounded-lg p-4 text-center ${cashFlowPositive ? 'bg-green-50' : 'bg-red-50'}`}>
              <p className="text-sm text-gray-600">Annual Cash Flow</p>
              <p className={`text-lg font-bold ${cashFlowPositive ? 'text-green-700' : 'text-red-700'}`}>
                {formatCurrency(metrics.annualCashFlow)}
              </p>
            </div>
          </div>
        </div>

        {/* Mortgage Breakdown */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Mortgage Payment Breakdown</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">Principal</p>
              <p className="text-lg font-bold text-gray-700">{formatCurrency(metrics.monthlyPrincipalPayment)}</p>
              <p className="text-xs text-gray-500">Building equity</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">Interest</p>
              <p className="text-lg font-bold text-gray-700">{formatCurrency(metrics.monthlyInterestPayment)}</p>
              <p className="text-xs text-gray-500">Cost of borrowing</p>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
