// frontend/src/components/ui/DrugInputField.tsx
import React, { useState, useEffect, useRef } from 'react';
import InputField from './InputField';
import StepperInput from './StepperInput'; // Ensure this path is correct

interface DrugInputFieldProps {
  drugName: string;
  drugId: string;
  unit: string;
  isSelected: boolean; // Controlled from parent: whether the drug *was used*
  value: string | number; // Parent should manage if it's string or number internally
  onSelectToggle: () => void;
  onValueChange: (value: string) => void; // Standardize to string for this component's output
  inputType?: 'text' | 'number' | 'stepper';
  colorClass?: string;
}

const DrugInputField: React.FC<DrugInputFieldProps> = ({
  drugName,
  drugId,
  unit,
  isSelected, // Prop indicating if drug is selected (checked)
  value,      // Prop holding the saved value from parent state
  onSelectToggle,
  onValueChange,
  inputType = 'number',
  colorClass = 'bg-transparent',
}) => {
  const [internalEditorValue, setInternalEditorValue] = useState(String(value));
  const inputRef = useRef<HTMLInputElement>(null);

  const uniqueCheckboxId = `drug-select-${drugId}`;
  const uniqueValueInputId = `drug-value-${drugId}`;

  // Sync local editor state if prop `value` changes from parent
  useEffect(() => {
    setInternalEditorValue(String(value));
  }, [value]);

  const handleEditorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInternalEditorValue(event.target.value);
  };

  const processAndCommitChange = () => {
    let processedValue = internalEditorValue;
    if (inputType === 'number' || inputType === 'stepper') {
      const num = parseFloat(internalEditorValue);
      processedValue = isNaN(num) ? '' : String(num); // Convert valid number to string, or empty string
    }
    onValueChange(processedValue);
  };

  const handleEditorBlur = () => {
    processAndCommitChange();
  };

  const handleEditorKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      processAndCommitChange();
      inputRef.current?.blur();
    }
    if (event.key === 'Escape') {
      setInternalEditorValue(String(value)); // Revert to original value from prop
      inputRef.current?.blur();
    }
  };

  return (
    <div className={`drug-input-field p-2 rounded-md border ${isSelected ? 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700' : 'border-transparent'} ${colorClass} transition-all duration-150`}>
      <div className="flex items-center mb-1">
        <input
          type="checkbox"
          id={uniqueCheckboxId}
          checked={isSelected}
          onChange={onSelectToggle}
          className="h-4 w-4 text-blue-600 dark:text-blue-500 border-slate-300 dark:border-slate-500 focus:ring-blue-500 dark:focus:ring-blue-600 rounded mr-2 shrink-0"
        />
        <label htmlFor={uniqueCheckboxId} className="ml-0.5 flex-1 text-sm font-medium text-slate-700 dark:text-slate-200 truncate cursor-pointer select-none">
          {drugName}
        </label>
      </div>
      {isSelected && (
        <div className="flex items-center mt-1.5 space-x-1.5 pl-6"> {/* Indent value input slightly */}
          <input
            id={uniqueValueInputId}
            type={(inputType === 'stepper' || inputType === 'number') ? 'number' : 'text'}
            value={internalEditorValue}
            onChange={handleEditorChange}
            onBlur={handleEditorBlur}
            onKeyDown={handleEditorKeyDown}
            ref={inputRef}
            placeholder="Dose"
            className="input-base input-sm w-full flex-grow"
            aria-label={`Value for ${drugName}`}
            step={(inputType === 'stepper' || inputType === 'number') ? 'any' : undefined}
          />
          <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap pl-1 shrink-0">{unit}</span>
        </div>
      )}
    </div>
  );
};

export default DrugInputField;

// Helper type for ref casting, if needed elsewhere or causing issues
// type InputRefType = React.RefObject<HTMLInputElement>;

// Add simple fade-in animation to index.css if desired:
/*
@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
.animation-fade-in { animation: fadeIn 0.2s ease-out forwards; }
*/