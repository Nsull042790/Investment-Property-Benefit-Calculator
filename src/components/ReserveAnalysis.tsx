import type { ReserveRequirements } from '../types';
import { SectionCard } from './SectionCard';
import { formatCurrency } from '../utils/calculations';

interface ReserveAnalysisProps {
  reserves: ReserveRequirements;
}

export function ReserveAnalysis({ reserves }: ReserveAnalysisProps) {
  const BankIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l9-4 9 4v2H3V6zm0 4h18v10H3V10zm3 3v4m4-4v4m4-4v4m4-4v4" />
    </svg>
  );

  return (
    <SectionCard
      title="Reserve Requirements"
      icon={<BankIcon />}
      variant={reserves.meetsRequirements ? 'success' : 'error'}
    >
      <div className="space-y-4">
        {/* Status Banner */}
        <div className={`rounded-lg p-4 text-center ${reserves.meetsRequirements ? 'bg-green-100' : 'bg-red-100'}`}>
          <div className="flex justify-center mb-2">
            {reserves.meetsRequirements ? (
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <p className={`font-semibold ${reserves.meetsRequirements ? 'text-green-800' : 'text-red-800'}`}>
            {reserves.meetsRequirements ? 'Meets Reserve Requirements' : 'Insufficient Reserves'}
          </p>
          {!reserves.meetsRequirements && (
            <p className="text-sm text-red-700 mt-1">
              Shortfall: {formatCurrency(reserves.reserveShortfall)}
            </p>
          )}
        </div>

        {/* Calculation Breakdown */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700">Calculation Breakdown</h4>

          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Monthly PITIA</span>
              <span className="font-medium">{formatCurrency(reserves.monthlyPITIA)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Months Required</span>
              <span className="font-medium">{reserves.monthsRequired} months</span>
            </div>
            <div className="flex justify-between text-sm border-t border-gray-200 pt-2">
              <span className="text-gray-700 font-medium">Base Reserve</span>
              <span className="font-semibold">{formatCurrency(reserves.baseReserveRequired)}</span>
            </div>

            {reserves.additionalReservePercent > 0 && (
              <>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Additional ({reserves.additionalReservePercent}% of loan)</span>
                  <span>+{formatCurrency(reserves.additionalReserveRequired)}</span>
                </div>
              </>
            )}

            <div className="flex justify-between text-sm border-t border-gray-300 pt-2 mt-2">
              <span className="text-gray-800 font-semibold">Total Required</span>
              <span className="font-bold text-blue-700">{formatCurrency(reserves.totalReserveRequired)}</span>
            </div>
          </div>
        </div>

        {/* Current vs Required */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">You Have</p>
            <p className="text-xl font-bold text-gray-800">{formatCurrency(reserves.currentLiquidAssets)}</p>
          </div>
          <div className={`rounded-lg p-4 text-center ${reserves.meetsRequirements ? 'bg-green-50' : 'bg-red-50'}`}>
            <p className="text-xs text-gray-500 mb-1">Required</p>
            <p className={`text-xl font-bold ${reserves.meetsRequirements ? 'text-green-700' : 'text-red-700'}`}>
              {formatCurrency(reserves.totalReserveRequired)}
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
          <p className="text-blue-800">
            <strong>Note:</strong> Reserves must be liquid assets (savings, investments, retirement accounts).
            Gift funds cannot be used for reserves.
          </p>
        </div>
      </div>
    </SectionCard>
  );
}
