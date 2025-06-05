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
  className?: string; // Optional class for the fieldset container
  // itemClassName?: string; // Less needed with grid auto-fit
}

const CheckboxGroupField: React.FC<CheckboxGroupFieldProps> = ({
  label,
  idPrefix,
  options,
  selectedValues,
  onChange,
  className = '',
  // itemClassName = '',
}) => {
  return (
    <fieldset className={`mb-4 ${className}`}>
      <legend className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">{label}</legend>
      {/* Use CSS Grid with auto-fit for dynamic columns */}
      {/* Adjust minmax(200px, 1fr) as needed for desired minimum item width */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-x-4 gap-y-2">
        {options.map((option) => {
          const fieldId = `${idPrefix}-${option.value}`;
          const isChecked = selectedValues.includes(option.value);

          return (
            // Container for each item
            <div key={option.value} className={`flex items-center`}> {/* Removed itemClassName - less relevant */}
              <input
                id={fieldId}
                name={fieldId}
                type="checkbox"
                value={option.value}
                checked={isChecked}
                onChange={() => onChange(option.value)}
                className="h-4 w-4 text-blue-600 dark:text-blue-500 border-slate-300 dark:border-slate-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-offset-0 dark:focus:ring-offset-slate-800 flex-shrink-0"
              />
              <label htmlFor={fieldId} className="ml-2 block text-sm text-slate-900 dark:text-slate-300 break-words cursor-pointer">
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