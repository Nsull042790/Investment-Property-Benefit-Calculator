import type { IncomeDetails } from '../types';
import { SectionCard } from './SectionCard';
import { InputField } from './InputField';

interface IncomeInputProps {
  income: IncomeDetails;
  onChange: (income: IncomeDetails) => void;
}

export function IncomeInput({ income, onChange }: IncomeInputProps) {
  const updateField = <K extends keyof IncomeDetails>(
    field: K,
    value: IncomeDetails[K]
  ) => {
    onChange({ ...income, [field]: value });
  };

  const DollarIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  return (
    <SectionCard title="Rental Income" icon={<DollarIcon />}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Monthly Rent"
          value={income.monthlyRent}
          onChange={(v) => updateField('monthlyRent', v)}
          type="currency"
          step={50}
          helpText="Expected monthly rental income"
        />

        <InputField
          label="Other Monthly Income"
          value={income.otherMonthlyIncome}
          onChange={(v) => updateField('otherMonthlyIncome', v)}
          type="currency"
          step={25}
          helpText="Parking, laundry, storage, etc."
        />

        <div className="md:col-span-2">
          <InputField
            label="Vacancy Rate"
            value={income.vacancyRatePercent}
            onChange={(v) => updateField('vacancyRatePercent', v)}
            type="percent"
            min={0}
            max={50}
            step={1}
            helpText="Estimated vacancy rate (typically 5-10%)"
          />
        </div>
      </div>
    </SectionCard>
  );
}
