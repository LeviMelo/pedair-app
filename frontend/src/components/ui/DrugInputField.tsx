// frontend/src/components/ui/DrugInputField.tsx
import React from 'react';
import InputField from './InputField'; // Reuse InputField for the dose/rate entry

// Props for the DrugInputField component
interface DrugInputFieldProps {
  drugName: string;       // Name of the drug (e.g., "Lidocaína")
  drugId: string;         // Unique identifier for the drug (e.g., "lido")
  unit: string;           // Unit of measurement (e.g., "mg", "mcg/kg/min")
  isSelected: boolean;    // Is this drug currently selected/used?
  value: string;          // The current dose/rate value entered (as string)
  onSelectToggle: () => void; // Function to call when the checkbox is toggled
  onValueChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // Function to call when the dose/rate input changes
  inputType?: 'text' | 'number'; // Input type for dose/rate
}

const DrugInputField: React.FC<DrugInputFieldProps> = ({
  drugName,
  drugId,
  unit,
  isSelected,
  value,
  onSelectToggle,
  onValueChange,
  inputType = 'number', // Default to number input
}) => {
  const checkboxId = `select-${drugId}`; // Unique ID for the checkbox
  const inputId = `value-${drugId}`;    // Unique ID for the input field

  return (
    // Container for the entire drug row
    // Apply conditional background and border based on selection state
    <div className={`p-3 border rounded-md ${isSelected ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-200'} transition-colors duration-150`}>
      <div className="flex items-center justify-between">
        {/* Checkbox and Drug Name */}
        <div className="flex items-center">
          <input
            id={checkboxId}
            type="checkbox"
            checked={isSelected}
            onChange={onSelectToggle} // Toggle selection state
            className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 mr-3 flex-shrink-0" // Added flex-shrink-0
          />
          <label htmlFor={checkboxId} className="font-medium text-sm text-slate-800 cursor-pointer break-words"> {/* Added break-words */}
            {drugName}
          </label>
        </div>
        {/* Unit display (always visible for context) */}
        <span className="text-xs text-slate-500 ml-2 flex-shrink-0">{unit}</span> {/* Added margin and flex-shrink */}
      </div>

      {/* Conditional Input Field */}
      {isSelected && ( // Only render the input field if the drug is selected
        <div className="mt-2 pl-7"> {/* Indent the input slightly (aligned with label text) */}
          {/* Using InputField component, but could be a simple input too */}
          <InputField
            // Using a visually hidden label for accessibility is better than no label
            label={`Valor para ${drugName}`} // Provide specific label
            id={inputId}
            type={inputType}
            value={value}
            onChange={onValueChange} // Update the specific drug's value state
            placeholder={`Valor (${unit})`} // More specific placeholder
            className="mb-0" // Remove default bottom margin from InputField
            // Add aria-label or aria-labelledby if label is visually hidden
            // aria-label={`Valor para ${drugName} em ${unit}`}
            // Consider making label visually hidden instead:
            // labelClassName="sr-only" // Tailwind class to visually hide
          />
           {/* Example of visually hidden label using Tailwind sr-only class */}
           {/* <label htmlFor={inputId} className="sr-only">{`Valor para ${drugName} em ${unit}`}</label>
           <input id={inputId} type={inputType} value={value} onChange={onValueChange} placeholder={`Valor (${unit})`} className="mt-1 block w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-sm shadow-sm ... " /> */}
        </div>
      )}
    </div>
  );
};

export default DrugInputField;