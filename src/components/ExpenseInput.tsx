import type { ExpenseDetails } from '../types';
import { SectionCard } from './SectionCard';
import { InputField } from './InputField';

interface ExpenseInputProps {
  expenses: ExpenseDetails;
  onChange: (expenses: ExpenseDetails) => void;
}

export function ExpenseInput({ expenses, onChange }: ExpenseInputProps) {
  const updateField = <K extends keyof ExpenseDetails>(
    field: K,
    value: ExpenseDetails[K]
  ) => {
    onChange({ ...expenses, [field]: value });
  };

  const ReceiptIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
    </svg>
  );

  return (
    <SectionCard title="Operating Expenses" icon={<ReceiptIcon />}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Annual Property Tax"
          value={expenses.propertyTaxAnnual}
          onChange={(v) => updateField('propertyTaxAnnual', v)}
          type="currency"
          step={100}
          helpText="Yearly property tax amount"
        />

        <InputField
          label="Annual Insurance"
          value={expenses.insuranceAnnual}
          onChange={(v) => updateField('insuranceAnnual', v)}
          type="currency"
          step={100}
          helpText="Landlord insurance (not homeowner's)"
        />

        <InputField
          label="Monthly HOA"
          value={expenses.hoaMonthly}
          onChange={(v) => updateField('hoaMonthly', v)}
          type="currency"
          step={25}
          helpText="Homeowner's association fees"
        />

        <InputField
          label="Monthly Utilities"
          value={expenses.utilitiesMonthly}
          onChange={(v) => updateField('utilitiesMonthly', v)}
          type="currency"
          step={25}
          helpText="If landlord pays any utilities"
        />

        <InputField
          label="Maintenance Reserve"
          value={expenses.maintenancePercent}
          onChange={(v) => updateField('maintenancePercent', v)}
          type="percent"
          min={0}
          max={20}
          step={0.5}
          helpText="% of rent (typically 5-10%)"
        />

        <InputField
          label="Property Management"
          value={expenses.propertyManagementPercent}
          onChange={(v) => updateField('propertyManagementPercent', v)}
          type="percent"
          min={0}
          max={20}
          step={0.5}
          helpText="% of rent (typically 8-12%)"
        />

        <div className="md:col-span-2">
          <InputField
            label="CapEx Reserve"
            value={expenses.capexReservePercent}
            onChange={(v) => updateField('capexReservePercent', v)}
            type="percent"
            min={0}
            max={20}
            step={0.5}
            helpText="Capital expenditures reserve % (roof, HVAC, etc.)"
          />
        </div>
      </div>
    </SectionCard>
  );
}
