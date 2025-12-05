interface InputFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  type?: 'currency' | 'percent' | 'number' | 'years';
  min?: number;
  max?: number;
  step?: number;
  helpText?: string;
}

export function InputField({
  label,
  value,
  onChange,
  type = 'number',
  min = 0,
  max,
  step = 1,
  helpText,
}: InputFieldProps) {
  const prefix = type === 'currency' ? '$' : '';
  const suffix = type === 'percent' ? '%' : type === 'years' ? ' yrs' : '';

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          min={min}
          max={max}
          step={step}
          className={`
            w-full px-3 py-2 border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            text-gray-900 text-sm
            ${prefix ? 'pl-7' : ''}
            ${suffix ? 'pr-12' : ''}
          `}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
            {suffix}
          </span>
        )}
      </div>
      {helpText && <p className="text-xs text-gray-500">{helpText}</p>}
    </div>
  );
}
