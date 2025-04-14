// src/components/ui/InputField.tsx
import React from 'react'; // Import the React library, necessary for creating components

// Define the structure (shape) of the properties (props) this component expects to receive
// 'interface' is a TypeScript feature for defining object structures.
interface InputFieldProps {
  label: string; // The text to display above the input field (e.g., "Idade") - must be a string
  id: string; // A unique identifier for the input, linking label and input for accessibility - must be a string
  type: 'text' | 'number' | 'email' | 'password'; // The type of input (restricts browser behavior) - must be one of these specific strings
  placeholder?: string; // Optional hint text displayed inside the input when empty - string or undefined
  value: string | number; // The current value of the input field - string or number
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // A function to call when the input value changes - takes an event object and returns nothing (void)
  required?: boolean; // Optional flag to mark the field as required - boolean or undefined
  className?: string; // Optional additional CSS classes for the container div
}

// Define the InputField component as a Functional Component (FC) using TypeScript generics
// React.FC<InputFieldProps> means this function is a React Functional Component that accepts props matching the InputFieldProps interface.
const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  type,
  placeholder,
  value,
  onChange,
  required = false, // Set default value for required to false if not provided
  className = '', // Set default value for className to empty string if not provided
}) => {
  // The component returns JSX (HTML-like syntax) to be rendered
  return (
    // Use a div to group the label and input, apply optional additional classes
    <div className={`mb-4 ${className}`}>
      {/* Create the label element */}
      <label
        htmlFor={id} // The 'htmlFor' attribute links this label to the input field with the matching 'id'
        className="block text-sm font-medium text-slate-700 mb-1" // Tailwind classes for styling the label
      >
        {label} {/* Display the label text passed via props */}
        {required && <span className="text-red-500 ml-1">*</span>} {/* If 'required' is true, display a red asterisk */}
      </label>
      {/* Create the input element */}
      <input
        type={type} // Set the input type (e.g., 'text', 'number') from props
        id={id} // Set the unique ID from props
        name={id} // Set the name attribute (often same as id, useful for form submission)
        value={value} // Bind the input's displayed value to the 'value' prop received from the parent
        onChange={onChange} // Attach the 'onChange' function prop to the input's onChange event listener
        placeholder={placeholder} // Set the placeholder text from props
        required={required} // Set the HTML 'required' attribute based on the prop
        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                   focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                   disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none" // Tailwind classes for styling the input field, including focus states
      />
    </div>
  );
};

export default InputField; // Make the component available for import in other files