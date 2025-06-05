// frontend/src/components/ui/InputField.tsx
import React, { forwardRef } from 'react'; // Import forwardRef

interface InputFieldProps {
  label: string;
  id: string;
  type: 'text' | 'number' | 'email' | 'password' | 'date';
  placeholder?: string;
  value: string | number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string; // For the container div
  inputClassName?: string; // For the input element itself
  labelClassName?: string; // For the label element
}

// Define the type for the ref (will be an HTMLInputElement)
type Ref = HTMLInputElement;

// Wrap the component definition with forwardRef
const InputField = forwardRef<Ref, InputFieldProps>(({
  // Props remain the same
  label,
  id,
  type,
  placeholder,
  value,
  onChange,
  onKeyDown,
  onBlur,
  required = false,
  className = '',
  inputClassName = '',
  labelClassName = '',
}, ref // Add the ref as the second argument provided by forwardRef
) => {
  // Combine base global classes with user-provided classes
  const containerClasses = ['form-field', className].filter(Boolean).join(' ');
  const labelClasses = ['form-label', labelClassName].filter(Boolean).join(' ');
  const inputClasses = ['input-base', inputClassName].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      <label htmlFor={id} className={labelClasses}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        // Pass the received ref directly to the underlying input element
        ref={ref}
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        className={inputClasses} // Removed mt-1 as form-label provides mb-1
      />
    </div>
  );
});

// Optional: Set a display name for better debugging
InputField.displayName = 'InputField';

export default InputField;