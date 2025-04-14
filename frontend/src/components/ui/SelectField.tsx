// src/components/ui/SelectField.tsx
import React from 'react';

// Define structure for individual dropdown options
interface SelectOption {
  value: string | number; // The actual value sent when selected
  label: string;         // The text displayed in the dropdown
}

// Define props for the SelectField component
interface SelectFieldProps {
  label: string;
  id: string;
  value: string | number; // Currently selected value
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void; // Handler for selection change
  options: SelectOption[]; // Array of available options
  required?: boolean;
  className?: string;
  placeholder?: string; // Optional placeholder text (for the default disabled option)
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  id,
  value,
  onChange,
  options,
  required = false,
  className = '',
  placeholder = 'Selecione...', // Default placeholder
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {/* Label */}
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {/* Select Dropdown */}
      <select
        id={id}
        name={id}
        value={value} // Bind displayed selection to the 'value' prop
        onChange={onChange} // Attach the onChange handler
        required={required}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white disabled:bg-slate-50 disabled:text-slate-500" // Base styling + select-specific padding
      >
        {/* Default Placeholder Option */}
        <option value="" disabled hidden={!placeholder}>
          {placeholder}
        </option>
        {/* Dynamically create options from the 'options' prop array */}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;