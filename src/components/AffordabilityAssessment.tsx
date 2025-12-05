import type { AffordabilityAssessment as Assessment } from '../types';
import { SectionCard } from './SectionCard';

interface AffordabilityAssessmentProps {
  assessment: Assessment;
}

export function AffordabilityAssessment({ assessment }: AffordabilityAssessmentProps) {
  const ShieldIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );

  const CheckIcon = () => (
    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );

  const AlertIcon = () => (
    <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );

  const XIcon = () => (
    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      // Cash flow
      positive: 'bg-green-100 text-green-800',
      negative: 'bg-red-100 text-red-800',
      'break-even': 'bg-yellow-100 text-yellow-800',
      // DSCR & Cap Rate
      excellent: 'bg-green-100 text-green-800',
      good: 'bg-blue-100 text-blue-800',
      acceptable: 'bg-yellow-100 text-yellow-800',
      fair: 'bg-yellow-100 text-yellow-800',
      poor: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <SectionCard
      title="Loan Approval Assessment"
      icon={<ShieldIcon />}
      variant={assessment.isAffordable ? 'success' : 'error'}
    >
      <div className="space-y-6">
        {/* Overall Verdict */}
        <div className={`rounded-lg p-6 text-center ${assessment.isAffordable ? 'bg-green-100' : 'bg-red-100'}`}>
          <div className="flex justify-center mb-3">
            {assessment.isAffordable ? (
              <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
          </div>
          <h3 className={`text-2xl font-bold ${assessment.isAffordable ? 'text-green-800' : 'text-red-800'}`}>
            {assessment.isAffordable ? 'LIKELY TO QUALIFY' : 'MAY NOT QUALIFY'}
          </h3>
          <p className={`mt-2 ${assessment.isAffordable ? 'text-green-700' : 'text-red-700'}`}>
            {assessment.isAffordable
              ? 'This investment property shows strong fundamentals for loan approval.'
              : 'This property may face challenges in the loan approval process.'}
          </p>
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-2">Cash Flow</p>
            {getStatusBadge(assessment.cashFlowStatus)}
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-2">DSCR</p>
            {getStatusBadge(assessment.dscrStatus)}
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-2">Cap Rate</p>
            {getStatusBadge(assessment.capRateStatus)}
          </div>
        </div>

        {/* Recommendations */}
        {assessment.recommendations.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-green-800 mb-2 flex items-center gap-2">
              <CheckIcon />
              Strengths
            </h4>
            <ul className="space-y-2">
              {assessment.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-green-500 mt-0.5">+</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Warnings */}
        {assessment.warnings.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-yellow-800 mb-2 flex items-center gap-2">
              <AlertIcon />
              Concerns
            </h4>
            <ul className="space-y-2">
              {assessment.warnings.map((warning, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-yellow-500 mt-0.5">!</span>
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Loan Officer Tips */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Loan Officer Checklist</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              {assessment.dscrStatus !== 'poor' ? <CheckIcon /> : <XIcon />}
              <span className={assessment.dscrStatus !== 'poor' ? 'text-gray-700' : 'text-red-600'}>
                DSCR meets minimum requirements (≥1.0)
              </span>
            </div>
            <div className="flex items-center gap-2">
              {assessment.dscrStatus === 'excellent' || assessment.dscrStatus === 'good' ? <CheckIcon /> : <AlertIcon />}
              <span className="text-gray-700">
                DSCR meets preferred threshold (≥1.25)
              </span>
            </div>
            <div className="flex items-center gap-2">
              {assessment.cashFlowStatus === 'positive' ? <CheckIcon /> : <XIcon />}
              <span className={assessment.cashFlowStatus === 'positive' ? 'text-gray-700' : 'text-red-600'}>
                Property generates positive cash flow
              </span>
            </div>
            <div className="flex items-center gap-2">
              {assessment.capRateStatus !== 'poor' ? <CheckIcon /> : <AlertIcon />}
              <span className="text-gray-700">
                Cap rate indicates reasonable return potential
              </span>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
