import type { PropertyDetails } from '../types';
import { SectionCard } from './SectionCard';
import { InputField } from './InputField';
import { SelectField } from './SelectField';

interface PropertyInputProps {
  property: PropertyDetails;
  onChange: (property: PropertyDetails) => void;
}

const propertyTypes = [
  { value: 'single-family', label: 'Single Family Home' },
  { value: 'multi-family', label: 'Multi-Family (2-4 Units)' },
  { value: 'condo', label: 'Condominium' },
  { value: 'townhouse', label: 'Townhouse' },
];

export function PropertyInput({ property, onChange }: PropertyInputProps) {
  const updateField = <K extends keyof PropertyDetails>(
    field: K,
    value: PropertyDetails[K]
  ) => {
    onChange({ ...property, [field]: value });
  };

  const HomeIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );

  return (
    <SectionCard title="Property & Loan Details" icon={<HomeIcon />}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <SelectField
            label="Property Type"
            value={property.propertyType}
            onChange={(v) => updateField('propertyType', v as PropertyDetails['propertyType'])}
            options={propertyTypes}
          />
        </div>

        <InputField
          label="Purchase Price"
          value={property.purchasePrice}
          onChange={(v) => updateField('purchasePrice', v)}
          type="currency"
          step={1000}
          helpText="Total purchase price of the property"
        />

        <InputField
          label="Down Payment"
          value={property.downPaymentPercent}
          onChange={(v) => updateField('downPaymentPercent', v)}
          type="percent"
          min={0}
          max={100}
          step={0.5}
          helpText="Investment properties typically require 20-25%"
        />

        <InputField
          label="Interest Rate"
          value={property.interestRate}
          onChange={(v) => updateField('interestRate', v)}
          type="percent"
          min={0}
          max={20}
          step={0.125}
          helpText="Annual interest rate"
        />

        <InputField
          label="Loan Term"
          value={property.loanTermYears}
          onChange={(v) => updateField('loanTermYears', v)}
          type="years"
          min={1}
          max={40}
          helpText="Common terms: 15, 20, or 30 years"
        />
      </div>
    </SectionCard>
  );
}
