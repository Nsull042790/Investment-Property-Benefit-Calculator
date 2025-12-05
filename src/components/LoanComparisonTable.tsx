import type { LoanComparison } from '../types';
import { SectionCard } from './SectionCard';
import { formatPercent } from '../utils/calculations';

interface LoanComparisonTableProps {
  comparisons: LoanComparison[];
}

export function LoanComparisonTable({ comparisons }: LoanComparisonTableProps) {
  const CompareIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
    </svg>
  );

  const CheckIcon = () => (
    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );

  const XIcon = () => (
    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  return (
    <SectionCard title="Loan Type Comparison" icon={<CompareIcon />}>
      <div className="space-y-4">
        {comparisons.map((loan) => (
          <div
            key={loan.loanType}
            className={`rounded-lg border-2 p-4 ${
              loan.qualifies
                ? 'border-green-200 bg-green-50'
                : 'border-red-200 bg-red-50'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">{loan.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                loan.qualifies
                  ? 'bg-green-200 text-green-800'
                  : 'bg-red-200 text-red-800'
              }`}>
                {loan.qualifies ? 'Qualifies' : 'Does Not Qualify'}
              </span>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-4 gap-2 mb-3 text-center">
              <div className="bg-white rounded p-2">
                <p className="text-xs text-gray-500">Min Down</p>
                <p className="font-semibold text-sm">{loan.minDownPayment}%</p>
              </div>
              <div className="bg-white rounded p-2">
                <p className="text-xs text-gray-500">Est. Rate</p>
                <p className="font-semibold text-sm">{formatPercent(loan.estimatedRate)}</p>
              </div>
              <div className="bg-white rounded p-2">
                <p className="text-xs text-gray-500">Min Score</p>
                <p className="font-semibold text-sm">{loan.minCreditScore}</p>
              </div>
              <div className="bg-white rounded p-2">
                <p className="text-xs text-gray-500">Max Props</p>
                <p className="font-semibold text-sm">
                  {loan.maxProperties === 'unlimited' ? '∞' : loan.maxProperties}
                </p>
              </div>
            </div>

            {/* Income Verification */}
            <div className="flex items-center gap-2 mb-3 text-sm">
              {loan.incomeVerification ? <XIcon /> : <CheckIcon />}
              <span className={loan.incomeVerification ? 'text-gray-600' : 'text-green-700'}>
                {loan.incomeVerification ? 'Requires Income Verification' : 'No Income Verification'}
              </span>
            </div>

            {/* Disqualify Reasons */}
            {!loan.qualifies && loan.disqualifyReasons.length > 0 && (
              <div className="bg-red-100 rounded p-2 mb-3">
                <p className="text-xs font-semibold text-red-800 mb-1">Why Not Qualified:</p>
                <ul className="text-xs text-red-700 space-y-1">
                  {loan.disqualifyReasons.map((reason, idx) => (
                    <li key={idx}>• {reason}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Pros and Cons */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="font-semibold text-green-700 mb-1">Pros</p>
                <ul className="space-y-1 text-gray-600">
                  {loan.pros.slice(0, 3).map((pro, idx) => (
                    <li key={idx} className="flex items-start gap-1">
                      <span className="text-green-500">+</span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-semibold text-red-700 mb-1">Cons</p>
                <ul className="space-y-1 text-gray-600">
                  {loan.cons.slice(0, 3).map((con, idx) => (
                    <li key={idx} className="flex items-start gap-1">
                      <span className="text-red-500">-</span>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
