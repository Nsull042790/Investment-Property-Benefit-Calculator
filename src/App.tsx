import { useState, useMemo } from 'react';
import type {
  PropertyDetails,
  IncomeDetails,
  ExpenseDetails,
  ClosingCosts,
  BorrowerProfile,
  QualificationChecklistItem,
} from './types';
import {
  PropertyInput,
  IncomeInput,
  ExpenseInput,
  ClosingCostsInput,
  CashFlowAnalysis,
  InvestmentMetrics,
  AffordabilityAssessment,
  BorrowerProfileInput,
  ReserveAnalysis,
  CreditScoreAnalysis,
  LoanComparisonTable,
  QualificationChecklist,
  defaultChecklist,
  ScenarioAnalysis,
  PrintReport,
} from './components';
import {
  calculateMetrics,
  generateAssessment,
  calculateReserveRequirements,
  calculateCreditScoreImpact,
  generateLoanComparisons,
} from './utils/calculations';

// Default values
const defaultProperty: PropertyDetails = {
  purchasePrice: 350000,
  downPaymentPercent: 25,
  interestRate: 7.5,
  loanTermYears: 30,
  propertyType: 'single-family',
};

const defaultIncome: IncomeDetails = {
  monthlyRent: 2500,
  otherMonthlyIncome: 0,
  vacancyRatePercent: 8,
};

const defaultExpenses: ExpenseDetails = {
  propertyTaxAnnual: 4200,
  insuranceAnnual: 1800,
  hoaMonthly: 0,
  maintenancePercent: 8,
  propertyManagementPercent: 10,
  utilitiesMonthly: 0,
  capexReservePercent: 5,
};

const defaultClosingCosts: ClosingCosts = {
  loanOriginationPercent: 1,
  appraisalFee: 500,
  inspectionFee: 450,
  titleInsurance: 1500,
  escrowFee: 500,
  attorneyFee: 500,
  recordingFee: 150,
  otherFees: 500,
};

const defaultBorrower: BorrowerProfile = {
  creditScore: 720,
  numberOfFinancedProperties: 1,
  liquidAssets: 150000,
  annualIncome: 120000,
  monthlyDebts: 2000,
  isFirstTimeInvestor: false,
  isSelfEmployed: false,
};

type TabType = 'property' | 'analysis' | 'borrower' | 'tools';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('property');
  const [property, setProperty] = useState<PropertyDetails>(defaultProperty);
  const [income, setIncome] = useState<IncomeDetails>(defaultIncome);
  const [expenses, setExpenses] = useState<ExpenseDetails>(defaultExpenses);
  const [closingCosts, setClosingCosts] = useState<ClosingCosts>(defaultClosingCosts);
  const [borrower, setBorrower] = useState<BorrowerProfile>(defaultBorrower);
  const [checklist, setChecklist] = useState<QualificationChecklistItem[]>(defaultChecklist);

  // Calculate all metrics
  const metrics = useMemo(
    () => calculateMetrics(property, income, expenses, closingCosts),
    [property, income, expenses, closingCosts]
  );

  const assessment = useMemo(() => generateAssessment(metrics), [metrics]);

  const reserves = useMemo(
    () => calculateReserveRequirements(metrics, borrower),
    [metrics, borrower]
  );

  const creditImpact = useMemo(
    () => calculateCreditScoreImpact(borrower, property),
    [borrower, property]
  );

  const loanComparisons = useMemo(
    () => generateLoanComparisons(property, metrics, borrower),
    [property, metrics, borrower]
  );

  const resetToDefaults = () => {
    setProperty(defaultProperty);
    setIncome(defaultIncome);
    setExpenses(defaultExpenses);
    setClosingCosts(defaultClosingCosts);
    setBorrower(defaultBorrower);
    setChecklist(defaultChecklist);
  };

  const tabs = [
    { id: 'property' as TabType, label: 'Property & Income', icon: '🏠' },
    { id: 'analysis' as TabType, label: 'Analysis', icon: '📊' },
    { id: 'borrower' as TabType, label: 'Borrower', icon: '👤' },
    { id: 'tools' as TabType, label: 'Tools', icon: '🔧' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 print:bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Investment Property Calculator
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Comprehensive analysis for loan officers and investors
              </p>
            </div>
            <button
              onClick={resetToDefaults}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset All
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="mt-4 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:hidden">
        {/* Property & Income Tab */}
        {activeTab === 'property' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <PropertyInput property={property} onChange={setProperty} />
              <IncomeInput income={income} onChange={setIncome} />
              <ExpenseInput expenses={expenses} onChange={setExpenses} />
              <ClosingCostsInput closingCosts={closingCosts} onChange={setClosingCosts} />
            </div>
            <div className="space-y-6">
              <AffordabilityAssessment assessment={assessment} />
              <InvestmentMetrics metrics={metrics} />
              <CashFlowAnalysis metrics={metrics} />
            </div>
          </div>
        )}

        {/* Analysis Tab */}
        {activeTab === 'analysis' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <AffordabilityAssessment assessment={assessment} />
              <InvestmentMetrics metrics={metrics} />
            </div>
            <div className="space-y-6">
              <CashFlowAnalysis metrics={metrics} />
              <ScenarioAnalysis
                baseProperty={property}
                income={income}
                expenses={expenses}
                closingCosts={closingCosts}
                baseMetrics={metrics}
              />
            </div>
          </div>
        )}

        {/* Borrower Tab */}
        {activeTab === 'borrower' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <BorrowerProfileInput borrower={borrower} onChange={setBorrower} />
              <CreditScoreAnalysis creditImpact={creditImpact} />
            </div>
            <div className="space-y-6">
              <ReserveAnalysis reserves={reserves} />
              <LoanComparisonTable comparisons={loanComparisons} />
            </div>
          </div>
        )}

        {/* Tools Tab */}
        {activeTab === 'tools' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <QualificationChecklist items={checklist} onChange={setChecklist} />
            </div>
            <div className="space-y-6">
              <ScenarioAnalysis
                baseProperty={property}
                income={income}
                expenses={expenses}
                closingCosts={closingCosts}
                baseMetrics={metrics}
              />
              <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Export Report
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Generate a printable PDF report with all analysis details to share with clients or for your records.
                </p>
                <PrintReport
                  property={property}
                  income={income}
                  expenses={expenses}
                  metrics={metrics}
                  assessment={assessment}
                  borrower={borrower}
                  reserves={reserves}
                  creditImpact={creditImpact}
                  loanComparisons={loanComparisons}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Quick Stats Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg print:hidden">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm">
            <div className="text-center">
              <p className="text-gray-500 text-xs">Cash Flow</p>
              <p className={`font-bold ${metrics.monthlyCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${metrics.monthlyCashFlow.toFixed(0)}/mo
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs">DSCR</p>
              <p className={`font-bold ${metrics.debtServiceCoverageRatio >= 1.25 ? 'text-green-600' : metrics.debtServiceCoverageRatio >= 1 ? 'text-yellow-600' : 'text-red-600'}`}>
                {metrics.debtServiceCoverageRatio.toFixed(2)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs">Cap Rate</p>
              <p className="font-bold text-gray-800">{metrics.capRate.toFixed(2)}%</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs">Cash Needed</p>
              <p className="font-bold text-gray-800">${(metrics.totalCashNeeded / 1000).toFixed(0)}k</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              assessment.isAffordable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {assessment.isAffordable ? 'Likely Qualifies' : 'May Not Qualify'}
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for fixed bottom bar */}
      <div className="h-20 print:hidden" />

      {/* Print Report Component */}
      <PrintReport
        property={property}
        income={income}
        expenses={expenses}
        metrics={metrics}
        assessment={assessment}
        borrower={borrower}
        reserves={reserves}
        creditImpact={creditImpact}
        loanComparisons={loanComparisons}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p className="mb-2">
              <strong>Disclaimer:</strong> This calculator provides estimates for informational purposes only.
            </p>
            <p>
              Actual loan approval depends on credit score, debt-to-income ratio, property appraisal, and lender requirements.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
