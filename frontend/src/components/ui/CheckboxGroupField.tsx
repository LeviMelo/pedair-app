// src/components/ui/CheckboxGroupField.tsx
import React from 'react';

// Structure for each checkbox option
interface CheckboxOption {
  value: string; // Unique value for this checkbox
  label: string;  // Text displayed next to the checkbox
}

// Props for the CheckboxGroupField component
interface CheckboxGroupFieldProps {
  label: string;
  idPrefix: string; // Base ID, unique ID for each checkbox will be idPrefix + value
  options: CheckboxOption[];
  selectedValues: string[]; // An array of the values that are currently checked
  onChange: (value: string) => void; // Function called when *any* checkbox in the group changes, passing the specific checkbox's value
  className?: string;
  required?: boolean; // Note: HTML 'required' doesn't work well on checkbox groups directly
}

const CheckboxGroupField: React.FC<CheckboxGroupFieldProps> = ({
  label,
  idPrefix,
  options,
  selectedValues,
  onChange,
  className = '',
  // required prop is accepted but not directly applied to inputs
}) => {
  return (
    <fieldset className={`mb-4 ${className}`}> {/* Use fieldset for grouping related controls */}
      {/* Legend acts like a label for the fieldset */}
      <legend className="block text-sm font-medium text-slate-700 mb-2">
        {label}
        {/* Consider visual indication of requirement if needed */}
      </legend>
      {/* Container for the checkboxes */}
      <div className="space-y-2"> {/* Adds vertical space between checkboxes */}
        {options.map((option) => {
          const fieldId = `${idPrefix}-${option.value}`; // Create unique ID for each checkbox
          const isChecked = selectedValues.includes(option.value); // Check if this option's value is in the selected array

          return (
            // Container for each checkbox + label pair
            <div key={option.value} className="flex items-center">
              <input
                id={fieldId}
                name={fieldId} // Can be useful, though often group name is used in traditional forms
                type="checkbox"
                value={option.value} // The value associated with this checkbox
                checked={isChecked} // Determine if checked based on selectedValues array
                onChange={() => onChange(option.value)} // Call the passed onChange handler with this specific checkbox's value
                className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <label htmlFor={fieldId} className="ml-2 block text-sm text-slate-900">
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