// frontend/src/components/ui/InputField.tsx
import React, { forwardRef } from 'react'; // Import forwardRef

interface InputFieldProps {
  label: string;
  id: string;
  type: 'text' | 'number' | 'email' | 'password';
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
  labelClassName = "block text-sm font-medium text-slate-700 mb-1",
}, ref // Add the ref as the second argument provided by forwardRef
) => {

  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={id} className={labelClassName}>
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
        className={`mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                   focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                   disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                   ${inputClassName}`}
      />
    </div>
  );
});

// Optional: Set a display name for better debugging
InputField.displayName = 'InputField';

export default InputField;