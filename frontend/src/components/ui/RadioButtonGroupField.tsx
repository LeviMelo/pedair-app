// frontend/src/components/ui/RadioButtonGroupField.tsx
import React from 'react';

// Structure for radio options (same as SelectOption/CheckboxOption)
interface RadioOption {
  value: string | number;
  label: string;
}

// Props for the RadioButtonGroupField component
interface RadioButtonGroupFieldProps {
  label: string;
  idPrefix: string; // Used to generate unique name and IDs
  options: RadioOption[];
  selectedValue: string | number | null; // The single value that is currently selected (or null/empty string if none)
  onChange: (value: string | number) => void; // Function called when selection changes, passing the selected option's value
  className?: string;
  columns?: 1 | 2 | 3; // Layout columns
  required?: boolean;
}

const RadioButtonGroupField: React.FC<RadioButtonGroupFieldProps> = ({
  label,
  idPrefix,
  options,
  selectedValue,
  onChange,
  className = '',
  columns = 1,
  required = false,
}) => {
  // Determine grid column class based on the columns prop
  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 md:grid-cols-3',
  }[columns];

  // Unique name for the entire radio group - essential for them to be mutually exclusive
  const groupName = `${idPrefix}-group`;

  return (
    <fieldset className={`mb-4 ${className}`}>
      <legend className="block text-sm font-medium text-slate-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </legend>
      <div className={`grid ${gridColsClass} gap-x-4 gap-y-2`}>
        {options.map((option) => {
          const fieldId = `${idPrefix}-${option.value}`;
          // Check if this option's value matches the single selectedValue prop
          const isChecked = selectedValue === option.value;

          return (
            <div key={option.value} className="flex items-center">
              <input
                id={fieldId}
                name={groupName} // All radios in the group MUST have the same name
                type="radio"
                value={option.value}
                checked={isChecked}
                onChange={() => onChange(option.value)} // Call onChange with the selected value
                required={required && options.indexOf(option) === 0} // Apply required only to the first radio for validation indication
                className="h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500 flex-shrink-0"
              />
              <label htmlFor={fieldId} className="ml-2 block text-sm text-slate-900 break-words">
                {option.label}
              </label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
};

export default RadioButtonGroupField;