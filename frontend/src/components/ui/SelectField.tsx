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
  className?: string; // For the container div
  selectClassName?: string; // For the select element itself
  labelClassName?: string; // For the label element
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
  selectClassName = '', // Added for select specific classes
  labelClassName = '',
  placeholder = 'Selecione...', // Default placeholder
}) => {
  const containerClasses = ['form-field', className].filter(Boolean).join(' ');
  const labelClasses = ['form-label', labelClassName].filter(Boolean).join(' ');
  // Select elements have some specific default styling, so we might need to be careful here.
  // .input-base provides border, bg, text color, focus, disabled states.
  // We might need to add back pr-10 for the arrow icon space if .input-base doesn't account for it.
  const selectBaseClasses = 'input-base pr-10'; // Added pr-10 for select arrow
  const finalSelectClasses = [selectBaseClasses, selectClassName].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {/* Label */}
      <label htmlFor={id} className={labelClasses}>
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
        className={finalSelectClasses} // Removed mt-1, uses .input-base + specific select needs
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