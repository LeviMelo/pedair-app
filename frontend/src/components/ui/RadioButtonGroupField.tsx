// frontend/src/components/ui/RadioButtonGroupField.tsx
import React from 'react';

interface RadioOption {
  value: string | number;
  label: string;
}

interface RadioButtonGroupFieldProps {
  label: string; // Legend text
  idPrefix: string;
  options: RadioOption[];
  selectedValue: string | number | null;
  onChange: (value: string | number) => void;
  className?: string; // For the fieldset container
  legendClassName?: string; // For the legend element
  required?: boolean;
}

const RadioButtonGroupField: React.FC<RadioButtonGroupFieldProps> = ({
  label,
  idPrefix,
  options,
  selectedValue,
  onChange,
  className = '',
  legendClassName = '',
  required = false,
}) => {
  const groupName = `${idPrefix}-radio-group`;
  const fieldsetClasses = ['form-field', className].filter(Boolean).join(' ');
  const finalLegendClassName = ['form-label', legendClassName, 'mb-2'].filter(Boolean).join(' ');

  return (
    <fieldset className={fieldsetClasses}>
      <legend className={finalLegendClassName}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </legend>
      {/* Use CSS Grid with auto-fit */}
      {/* Adjust minmax(180px, 1fr) as needed */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-x-4 gap-y-2">
        {options.map((option, index) => {
          const fieldId = `${idPrefix}-${option.value}`;
          const isChecked = selectedValue === option.value;

          return (
            // Container for each item
            <div key={option.value} className="flex items-center">
              <input
                id={fieldId}
                name={groupName}
                type="radio"
                value={option.value}
                checked={isChecked}
                onChange={() => onChange(option.value)}
                required={required && index === 0} // Only one radio in a group needs to be required for HTML5 validation
                className="h-4 w-4 text-blue-600 dark:text-blue-500 border-slate-300 dark:border-slate-600 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-offset-0 dark:focus:ring-offset-slate-800 flex-shrink-0"
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

export default RadioButtonGroupField;