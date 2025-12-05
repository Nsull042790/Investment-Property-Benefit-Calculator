import type { ClosingCosts } from '../types';
import { SectionCard } from './SectionCard';
import { InputField } from './InputField';

interface ClosingCostsInputProps {
  closingCosts: ClosingCosts;
  onChange: (closingCosts: ClosingCosts) => void;
}

export function ClosingCostsInput({ closingCosts, onChange }: ClosingCostsInputProps) {
  const updateField = <K extends keyof ClosingCosts>(
    field: K,
    value: ClosingCosts[K]
  ) => {
    onChange({ ...closingCosts, [field]: value });
  };

  const DocumentIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  return (
    <SectionCard title="Closing Costs & Fees" icon={<DocumentIcon />}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Loan Origination Fee"
          value={closingCosts.loanOriginationPercent}
          onChange={(v) => updateField('loanOriginationPercent', v)}
          type="percent"
          min={0}
          max={5}
          step={0.125}
          helpText="% of loan amount (typically 0.5-1%)"
        />

        <InputField
          label="Appraisal Fee"
          value={closingCosts.appraisalFee}
          onChange={(v) => updateField('appraisalFee', v)}
          type="currency"
          step={50}
          helpText="Property appraisal cost"
        />

        <InputField
          label="Inspection Fee"
          value={closingCosts.inspectionFee}
          onChange={(v) => updateField('inspectionFee', v)}
          type="currency"
          step={50}
          helpText="Home inspection cost"
        />

        <InputField
          label="Title Insurance"
          value={closingCosts.titleInsurance}
          onChange={(v) => updateField('titleInsurance', v)}
          type="currency"
          step={100}
          helpText="Title search and insurance"
        />

        <InputField
          label="Escrow Fee"
          value={closingCosts.escrowFee}
          onChange={(v) => updateField('escrowFee', v)}
          type="currency"
          step={50}
          helpText="Escrow/settlement fee"
        />

        <InputField
          label="Attorney Fee"
          value={closingCosts.attorneyFee}
          onChange={(v) => updateField('attorneyFee', v)}
          type="currency"
          step={50}
          helpText="Legal fees (if applicable)"
        />

        <InputField
          label="Recording Fee"
          value={closingCosts.recordingFee}
          onChange={(v) => updateField('recordingFee', v)}
          type="currency"
          step={25}
          helpText="County recording fees"
        />

        <InputField
          label="Other Fees"
          value={closingCosts.otherFees}
          onChange={(v) => updateField('otherFees', v)}
          type="currency"
          step={50}
          helpText="Any additional closing costs"
        />
      </div>
    </SectionCard>
  );
}
