import { useState } from 'react';
import type { ApprovalRoadmap as ApprovalRoadmapType, ApprovalRecommendation } from '../types';
import { SectionCard } from './SectionCard';

interface ApprovalRoadmapProps {
  roadmap: ApprovalRoadmapType;
}

function StatusBadge({ status }: { status: ApprovalRoadmapType['overallStatus'] }) {
  const styles = {
    'approved': 'bg-green-100 text-green-800 border-green-300',
    'likely': 'bg-blue-100 text-blue-800 border-blue-300',
    'possible': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'unlikely': 'bg-orange-100 text-orange-800 border-orange-300',
    'not-qualified': 'bg-red-100 text-red-800 border-red-300',
  };

  const labels = {
    'approved': 'Ready to Apply',
    'likely': 'Likely Approval',
    'possible': 'Possible with Changes',
    'unlikely': 'Unlikely',
    'not-qualified': 'Not Qualified',
  };

  return (
    <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: ApprovalRecommendation['priority'] }) {
  const styles = {
    'critical': 'bg-red-100 text-red-700',
    'high': 'bg-orange-100 text-orange-700',
    'medium': 'bg-yellow-100 text-yellow-700',
    'low': 'bg-gray-100 text-gray-700',
  };

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase ${styles[priority]}`}>
      {priority}
    </span>
  );
}

function RecommendationCard({ rec, showTalkingPoints }: { rec: ApprovalRecommendation; showTalkingPoints: boolean }) {
  return (
    <div className={`p-4 rounded-lg border-l-4 ${rec.isDealBreaker ? 'bg-red-50 border-red-500' : 'bg-gray-50 border-gray-300'}`}>
      <div className="flex items-start justify-between gap-4 mb-2">
        <h4 className="font-semibold text-gray-900">{rec.title}</h4>
        <PriorityBadge priority={rec.priority} />
      </div>

      <p className="text-gray-600 text-sm mb-3">{rec.issue}</p>

      <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
        <div>
          <span className="text-gray-500">Current:</span>
          <span className="ml-2 font-medium text-red-600">{rec.currentValue}</span>
        </div>
        <div>
          <span className="text-gray-500">Target:</span>
          <span className="ml-2 font-medium text-green-600">{rec.targetValue}</span>
        </div>
      </div>

      <div className="bg-white rounded p-3 border mb-3">
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wide">Action Required</span>
            <p className="text-gray-800 font-medium">{rec.action}</p>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500 mb-2">
        <span className="font-medium">Impact:</span> {rec.impact}
      </p>

      {showTalkingPoints && (
        <div className="mt-3 pt-3 border-t border-dashed">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <div>
              <span className="text-xs text-purple-600 font-medium">Loan Officer Talking Point:</span>
              <p className="text-gray-600 text-sm italic">"{rec.loanOfficerTalkingPoint}"</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function ApprovalRoadmap({ roadmap }: ApprovalRoadmapProps) {
  const [showTalkingPoints, setShowTalkingPoints] = useState(true);

  return (
    <div className="space-y-6">
      {/* Overall Status Header */}
      <SectionCard
        title="Approval Roadmap"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        }
        variant={
          roadmap.overallStatus === 'approved' ? 'success' :
          roadmap.overallStatus === 'likely' ? 'highlight' :
          roadmap.overallStatus === 'possible' ? 'warning' : 'error'
        }
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <StatusBadge status={roadmap.overallStatus} />
            <p className="mt-3 text-gray-700">{roadmap.statusMessage}</p>
            <p className="mt-1 text-sm text-gray-500">{roadmap.estimatedTimeToApproval}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Recommended Loan Product</div>
            <div className="font-semibold text-gray-900">{roadmap.bestLoanOption}</div>
          </div>
        </div>

        {/* Toggle for talking points */}
        <div className="flex items-center gap-2 mb-4">
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={showTalkingPoints}
              onChange={(e) => setShowTalkingPoints(e.target.checked)}
              className="rounded border-gray-300"
            />
            Show loan officer talking points
          </label>
        </div>

        {/* Strengths */}
        {roadmap.strengths.length > 0 && (
          <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Strengths
            </h3>
            <ul className="space-y-1">
              {roadmap.strengths.map((strength, i) => (
                <li key={i} className="text-green-700 text-sm flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {strength}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Deal Breakers */}
        {roadmap.dealBreakers.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Critical Issues (Must Fix)
            </h3>
            <div className="space-y-4">
              {roadmap.dealBreakers.map((rec) => (
                <RecommendationCard key={rec.id} rec={rec} showTalkingPoints={showTalkingPoints} />
              ))}
            </div>
          </div>
        )}

        {/* High Priority Items */}
        {roadmap.highPriorityItems.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              High Priority (Recommended)
            </h3>
            <div className="space-y-4">
              {roadmap.highPriorityItems.map((rec) => (
                <RecommendationCard key={rec.id} rec={rec} showTalkingPoints={showTalkingPoints} />
              ))}
            </div>
          </div>
        )}

        {/* Other Improvements */}
        {roadmap.improvements.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Optional Improvements
            </h3>
            <div className="space-y-4">
              {roadmap.improvements.map((rec) => (
                <RecommendationCard key={rec.id} rec={rec} showTalkingPoints={showTalkingPoints} />
              ))}
            </div>
          </div>
        )}

        {/* No Issues */}
        {roadmap.dealBreakers.length === 0 && roadmap.highPriorityItems.length === 0 && roadmap.improvements.length === 0 && (
          <div className="text-center py-8">
            <svg className="w-16 h-16 mx-auto text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-green-800">All Systems Go!</h3>
            <p className="text-gray-600 mt-2">This property meets all approval criteria. Ready to proceed with loan application.</p>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
