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
  labelClassName?: string; // Added for consistency
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
  labelClassName = "block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1", // Added dark mode
  placeholder = 'Selecione...', // Default placeholder
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {/* Label */}
      <label htmlFor={id} className={labelClassName}>
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
        className={`mt-1 block w-full pl-3 pr-10 py-2 text-base rounded-md shadow-sm 
                   bg-white dark:bg-slate-700/50 
                   border border-slate-300 dark:border-slate-600 
                   text-slate-900 dark:text-slate-100 
                   focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                   dark:focus:ring-blue-500 dark:focus:border-blue-500 
                   sm:text-sm 
                   disabled:bg-slate-50 dark:disabled:bg-slate-600/50 
                   disabled:text-slate-500 dark:disabled:text-slate-400 
                   dark:disabled:border-slate-700`}
      >
        {/* Default Placeholder Option */}
        <option value="" disabled hidden={!placeholder} className="text-slate-500 dark:text-slate-400 dark:bg-slate-700">
          {placeholder}
        </option>
        {/* Dynamically create options from the 'options' prop array */}
        {options.map((option) => (
          <option key={option.value} value={option.value} className="text-slate-900 dark:text-slate-200 dark:bg-slate-700">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;