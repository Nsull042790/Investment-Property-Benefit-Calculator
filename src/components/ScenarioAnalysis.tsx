import { useState } from 'react';
import type { PropertyDetails, IncomeDetails, ExpenseDetails, ClosingCosts, CalculatedMetrics } from '../types';
import { SectionCard } from './SectionCard';
import { calculateMetrics, generateAssessment, formatCurrency, formatPercent, formatRatio } from '../utils/calculations';

interface ScenarioAnalysisProps {
  baseProperty: PropertyDetails;
  income: IncomeDetails;
  expenses: ExpenseDetails;
  closingCosts: ClosingCosts;
  baseMetrics: CalculatedMetrics;
}

interface Scenario {
  name: string;
  changes: Partial<PropertyDetails>;
  metrics: CalculatedMetrics;
}

export function ScenarioAnalysis({
  baseProperty,
  income,
  expenses,
  closingCosts,
  baseMetrics,
}: ScenarioAnalysisProps) {
  const [customDownPayment, setCustomDownPayment] = useState(baseProperty.downPaymentPercent + 5);
  const [customRate, setCustomRate] = useState(baseProperty.interestRate - 0.5);
  const [customRent, setCustomRent] = useState(income.monthlyRent + 200);

  const LabIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  );

  // Pre-defined scenarios
  const scenarios: Scenario[] = [
    {
      name: 'Higher Down Payment (25%)',
      changes: { downPaymentPercent: 25 },
      metrics: calculateMetrics({ ...baseProperty, downPaymentPercent: 25 }, income, expenses, closingCosts),
    },
    {
      name: 'Higher Down Payment (30%)',
      changes: { downPaymentPercent: 30 },
      metrics: calculateMetrics({ ...baseProperty, downPaymentPercent: 30 }, income, expenses, closingCosts),
    },
    {
      name: 'Lower Interest Rate (-0.5%)',
      changes: { interestRate: Math.max(0, baseProperty.interestRate - 0.5) },
      metrics: calculateMetrics({ ...baseProperty, interestRate: Math.max(0, baseProperty.interestRate - 0.5) }, income, expenses, closingCosts),
    },
    {
      name: '15-Year Loan Term',
      changes: { loanTermYears: 15 },
      metrics: calculateMetrics({ ...baseProperty, loanTermYears: 15 }, income, expenses, closingCosts),
    },
  ];

  // Custom scenario
  const customPropertyScenario = { ...baseProperty, downPaymentPercent: customDownPayment, interestRate: customRate };
  const customIncomeScenario = { ...income, monthlyRent: customRent };
  const customMetrics = calculateMetrics(customPropertyScenario, customIncomeScenario, expenses, closingCosts);
  const customAssessment = generateAssessment(customMetrics);

  const getChangeIndicator = (base: number, compare: number, higherIsBetter: boolean) => {
    const diff = compare - base;
    if (Math.abs(diff) < 0.01) return <span className="text-gray-400">—</span>;
    const isPositive = higherIsBetter ? diff > 0 : diff < 0;
    return (
      <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
        {diff > 0 ? '↑' : '↓'} {Math.abs(diff).toFixed(2)}
      </span>
    );
  };

  return (
    <SectionCard title="Scenario Analysis (What-If)" icon={<LabIcon />}>
      <div className="space-y-6">
        {/* Pre-built Scenarios */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Quick Scenarios</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 font-medium text-gray-600">Scenario</th>
                  <th className="text-right p-2 font-medium text-gray-600">Cash Flow</th>
                  <th className="text-right p-2 font-medium text-gray-600">DSCR</th>
                  <th className="text-right p-2 font-medium text-gray-600">CoC Return</th>
                  <th className="text-right p-2 font-medium text-gray-600">Cash Needed</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 bg-blue-50">
                  <td className="p-2 font-medium text-blue-800">Current</td>
                  <td className="p-2 text-right">{formatCurrency(baseMetrics.monthlyCashFlow)}</td>
                  <td className="p-2 text-right">{formatRatio(baseMetrics.debtServiceCoverageRatio)}</td>
                  <td className="p-2 text-right">{formatPercent(baseMetrics.cashOnCashReturn)}</td>
                  <td className="p-2 text-right">{formatCurrency(baseMetrics.totalCashNeeded)}</td>
                </tr>
                {scenarios.map((scenario, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-2">{scenario.name}</td>
                    <td className="p-2 text-right">
                      {formatCurrency(scenario.metrics.monthlyCashFlow)}
                      <div className="text-xs">
                        {getChangeIndicator(baseMetrics.monthlyCashFlow, scenario.metrics.monthlyCashFlow, true)}
                      </div>
                    </td>
                    <td className="p-2 text-right">
                      {formatRatio(scenario.metrics.debtServiceCoverageRatio)}
                      <div className="text-xs">
                        {getChangeIndicator(baseMetrics.debtServiceCoverageRatio, scenario.metrics.debtServiceCoverageRatio, true)}
                      </div>
                    </td>
                    <td className="p-2 text-right">
                      {formatPercent(scenario.metrics.cashOnCashReturn)}
                      <div className="text-xs">
                        {getChangeIndicator(baseMetrics.cashOnCashReturn, scenario.metrics.cashOnCashReturn, true)}
                      </div>
                    </td>
                    <td className="p-2 text-right">
                      {formatCurrency(scenario.metrics.totalCashNeeded)}
                      <div className="text-xs">
                        {getChangeIndicator(baseMetrics.totalCashNeeded, scenario.metrics.totalCashNeeded, false)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Custom Scenario Builder */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Custom Scenario</h4>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Down Payment %</label>
              <input
                type="number"
                value={customDownPayment}
                onChange={(e) => setCustomDownPayment(Number(e.target.value))}
                min={0}
                max={100}
                step={1}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Interest Rate %</label>
              <input
                type="number"
                value={customRate}
                onChange={(e) => setCustomRate(Number(e.target.value))}
                min={0}
                max={20}
                step={0.125}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Monthly Rent $</label>
              <input
                type="number"
                value={customRent}
                onChange={(e) => setCustomRent(Number(e.target.value))}
                min={0}
                step={50}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>

          {/* Custom Results */}
          <div className={`rounded-lg p-4 ${customAssessment.isAffordable ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-800">Custom Scenario Results</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                customAssessment.isAffordable ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
              }`}>
                {customAssessment.isAffordable ? 'Likely Qualifies' : 'May Not Qualify'}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-white rounded p-2">
                <p className="text-xs text-gray-500">Cash Flow</p>
                <p className={`font-bold ${customMetrics.monthlyCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(customMetrics.monthlyCashFlow)}
                </p>
              </div>
              <div className="bg-white rounded p-2">
                <p className="text-xs text-gray-500">DSCR</p>
                <p className="font-bold text-gray-800">{formatRatio(customMetrics.debtServiceCoverageRatio)}</p>
              </div>
              <div className="bg-white rounded p-2">
                <p className="text-xs text-gray-500">CoC Return</p>
                <p className="font-bold text-gray-800">{formatPercent(customMetrics.cashOnCashReturn)}</p>
              </div>
              <div className="bg-white rounded p-2">
                <p className="text-xs text-gray-500">Cash Needed</p>
                <p className="font-bold text-gray-800">{formatCurrency(customMetrics.totalCashNeeded)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
