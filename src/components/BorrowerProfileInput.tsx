import type { BorrowerProfile } from '../types';
import { SectionCard } from './SectionCard';
import { InputField } from './InputField';

interface BorrowerProfileInputProps {
  borrower: BorrowerProfile;
  onChange: (borrower: BorrowerProfile) => void;
}

export function BorrowerProfileInput({ borrower, onChange }: BorrowerProfileInputProps) {
  const updateField = <K extends keyof BorrowerProfile>(
    field: K,
    value: BorrowerProfile[K]
  ) => {
    onChange({ ...borrower, [field]: value });
  };

  const UserIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  return (
    <SectionCard title="Borrower Profile" icon={<UserIcon />}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Credit Score"
          value={borrower.creditScore}
          onChange={(v) => updateField('creditScore', v)}
          type="number"
          min={300}
          max={850}
          helpText="FICO score (300-850)"
        />

        <InputField
          label="Financed Properties"
          value={borrower.numberOfFinancedProperties}
          onChange={(v) => updateField('numberOfFinancedProperties', v)}
          type="number"
          min={0}
          max={20}
          helpText="Number of properties with mortgages"
        />

        <InputField
          label="Liquid Assets"
          value={borrower.liquidAssets}
          onChange={(v) => updateField('liquidAssets', v)}
          type="currency"
          step={1000}
          helpText="Cash, savings, investments, retirement"
        />

        <InputField
          label="Annual Income"
          value={borrower.annualIncome}
          onChange={(v) => updateField('annualIncome', v)}
          type="currency"
          step={1000}
          helpText="Gross annual income"
        />

        <InputField
          label="Monthly Debts"
          value={borrower.monthlyDebts}
          onChange={(v) => updateField('monthlyDebts', v)}
          type="currency"
          step={100}
          helpText="All monthly debt payments"
        />

        <div className="md:col-span-2 space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={borrower.isSelfEmployed}
              onChange={(e) => updateField('isSelfEmployed', e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Self-employed</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={borrower.isFirstTimeInvestor}
              onChange={(e) => updateField('isFirstTimeInvestor', e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">First-time real estate investor</span>
          </label>
        </div>
      </div>
    </SectionCard>
  );
}
