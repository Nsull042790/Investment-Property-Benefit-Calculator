import { useState, useMemo } from 'react';
import type {
  PropertyDetails,
  IncomeDetails,
  ExpenseDetails,
  ClosingCosts,
} from './types';
import {
  PropertyInput,
  IncomeInput,
  ExpenseInput,
  ClosingCostsInput,
  CashFlowAnalysis,
  InvestmentMetrics,
  AffordabilityAssessment,
} from './components';
import { calculateMetrics, generateAssessment } from './utils/calculations';

// Default values for a typical investment property scenario
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

function App() {
  const [property, setProperty] = useState<PropertyDetails>(defaultProperty);
  const [income, setIncome] = useState<IncomeDetails>(defaultIncome);
  const [expenses, setExpenses] = useState<ExpenseDetails>(defaultExpenses);
  const [closingCosts, setClosingCosts] = useState<ClosingCosts>(defaultClosingCosts);

  // Calculate metrics whenever inputs change
  const metrics = useMemo(
    () => calculateMetrics(property, income, expenses, closingCosts),
    [property, income, expenses, closingCosts]
  );

  // Generate assessment based on metrics
  const assessment = useMemo(() => generateAssessment(metrics), [metrics]);

  const resetToDefaults = () => {
    setProperty(defaultProperty);
    setIncome(defaultIncome);
    setExpenses(defaultExpenses);
    setClosingCosts(defaultClosingCosts);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Investment Property Calculator
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Analyze rental properties and determine loan eligibility
              </p>
            </div>
            <button
              onClick={resetToDefaults}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset to Defaults
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section (Left Column) */}
          <div className="space-y-6">
            <PropertyInput property={property} onChange={setProperty} />
            <IncomeInput income={income} onChange={setIncome} />
            <ExpenseInput expenses={expenses} onChange={setExpenses} />
            <ClosingCostsInput closingCosts={closingCosts} onChange={setClosingCosts} />
          </div>

          {/* Results Section (Right Column) */}
          <div className="space-y-6">
            <AffordabilityAssessment assessment={assessment} />
            <InvestmentMetrics metrics={metrics} />
            <CashFlowAnalysis metrics={metrics} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p className="mb-2">
              <strong>Disclaimer:</strong> This calculator provides estimates for informational purposes only.
            </p>
            <p>
              Actual loan approval depends on credit score, debt-to-income ratio, property appraisal, and lender requirements.
              Consult with a qualified mortgage professional for specific advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
