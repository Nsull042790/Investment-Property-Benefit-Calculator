import type { CreditScoreImpact } from '../types';
import { SectionCard } from './SectionCard';
import { formatPercent } from '../utils/calculations';

interface CreditScoreAnalysisProps {
  creditImpact: CreditScoreImpact;
}

export function CreditScoreAnalysis({ creditImpact }: CreditScoreAnalysisProps) {
  const CreditIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  const getApprovalColor = (likelihood: string) => {
    switch (likelihood) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-orange-600';
      default: return 'text-red-600';
    }
  };

  const getScoreBarWidth = (score: number) => {
    return Math.min(100, Math.max(0, ((score - 300) / 550) * 100));
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 760) return 'bg-green-500';
    if (score >= 700) return 'bg-blue-500';
    if (score >= 660) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <SectionCard title="Credit Score Impact" icon={<CreditIcon />}>
      <div className="space-y-4">
        {/* Score Display */}
        <div className="text-center">
          <p className="text-4xl font-bold text-gray-800">{creditImpact.score}</p>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getTierColor(creditImpact.tier)}`}>
            {creditImpact.tier.charAt(0).toUpperCase() + creditImpact.tier.slice(1)}
          </span>
        </div>

        {/* Score Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>300</span>
            <span>850</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${getScoreBarColor(creditImpact.score)} transition-all duration-500`}
              style={{ width: `${getScoreBarWidth(creditImpact.score)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>Poor</span>
            <span>Fair</span>
            <span>Good</span>
            <span>Excellent</span>
          </div>
        </div>

        {/* Impact Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500">Max LTV</p>
            <p className="text-lg font-bold text-gray-800">{creditImpact.maxLTV}%</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500">Rate Adjustment</p>
            <p className="text-lg font-bold text-gray-800">
              {creditImpact.rateAdjustment > 0 ? '+' : ''}{formatPercent(creditImpact.rateAdjustment)}
            </p>
          </div>
        </div>

        {/* Approval Likelihood */}
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600">Approval Likelihood</p>
          <p className={`text-xl font-bold ${getApprovalColor(creditImpact.approvalLikelihood)}`}>
            {creditImpact.approvalLikelihood.toUpperCase()}
          </p>
        </div>

        {/* Recommendations */}
        {creditImpact.recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-700">Recommendations</h4>
            <ul className="space-y-1">
              {creditImpact.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </SectionCard>
  );
}
