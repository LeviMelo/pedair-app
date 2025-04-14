// frontend/src/components/ui/CheckboxGroupField.tsx
import React from 'react';

interface CheckboxOption {
  value: string;
  label: string;
}

interface CheckboxGroupFieldProps {
  label: string;
  idPrefix: string;
  options: CheckboxOption[];
  selectedValues: string[];
  onChange: (value: string) => void;
  className?: string;
  columns?: 1 | 2 | 3; // Number of columns for the grid layout (default 1)
  // Required prop is noted but not enforced via HTML attribute here
}

const CheckboxGroupField: React.FC<CheckboxGroupFieldProps> = ({
  label,
  idPrefix,
  options,
  selectedValues,
  onChange,
  className = '',
  columns = 1, // Default to 1 column if not specified
}) => {
  // Determine grid column class based on the columns prop
  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'sm:grid-cols-2', // Use 2 columns on small screens and up
    3: 'sm:grid-cols-2 md:grid-cols-3', // Use 2 on small, 3 on medium and up
  }[columns];

  return (
    <fieldset className={`mb-4 ${className}`}>
      <legend className="block text-sm font-medium text-slate-700 mb-2">{label}</legend>
      {/* Apply dynamic grid classes */}
      <div className={`grid ${gridColsClass} gap-x-4 gap-y-2`}> {/* Added gap-x */}
        {options.map((option) => {
          const fieldId = `${idPrefix}-${option.value}`;
          const isChecked = selectedValues.includes(option.value);

          return (
            <div key={option.value} className="flex items-center">
              <input
                id={fieldId}
                name={fieldId}
                type="checkbox"
                value={option.value}
                checked={isChecked}
                onChange={() => onChange(option.value)}
                className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 flex-shrink-0" // Added flex-shrink-0
              />
              <label htmlFor={fieldId} className="ml-2 block text-sm text-slate-900 break-words"> {/* Added break-words */}
                {option.label}
              </label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
};

export default CheckboxGroupField;