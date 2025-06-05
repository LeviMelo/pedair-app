// frontend/src/components/ui/AutocompleteInput.tsx
import React, { useState, useEffect, useRef } from 'react';

// Structure for the data items we are searching
export interface AutocompleteOption {
  value: string;
  label: string;
  // Include other relevant data, like icd10 for diagnoses
  [key: string]: any; // Allow other properties like icd10
}

interface AutocompleteInputProps {
  label: string;
  id: string;
  placeholder?: string;
  options: AutocompleteOption[]; // The *full* list of searchable options (for simulation)
  onSelect: (selectedOption: AutocompleteOption | null) => void; // Callback when an item is selected
  className?: string; // For the main container div
  labelClassName?: string; // For the label element
  inputClassName?: string; // For the input element
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  label,
  id,
  placeholder = "Digite para buscar...",
  options,
  onSelect,
  className = '',
  labelClassName = '',
  inputClassName = '',
}) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<AutocompleteOption[]>([]);
  const [isListVisible, setIsListVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null); // Ref for detecting clicks outside

  // Filter options based on input value
  useEffect(() => {
    if (inputValue.length > 1) { // Start filtering after 2+ characters
      const lowerCaseInput = inputValue.toLowerCase();
      setFilteredOptions(
        options.filter(option =>
          option.label.toLowerCase().includes(lowerCaseInput) ||
          (option.value && option.value.toLowerCase().includes(lowerCaseInput)) ||
          (option.icd10 && option.icd10.toLowerCase().includes(lowerCaseInput)) // Also search ICD code if present
        ).slice(0, 10) // Limit results for performance/UI
      );
      setIsListVisible(true);
    } else {
      setFilteredOptions([]);
      setIsListVisible(false);
    }
  }, [inputValue, options]);

  // Handle clicks outside the component to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsListVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleOptionClick = (option: AutocompleteOption) => {
    setInputValue(''); // Clear input after selection
    setFilteredOptions([]);
    setIsListVisible(false);
    onSelect(option); // Call the parent's onSelect handler
  };

  const finalLabelClassName = ['form-label', labelClassName].filter(Boolean).join(' ');
  const finalInputClassName = ['input-base', inputClassName].filter(Boolean).join(' ');

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <label htmlFor={id} className={finalLabelClassName}>{label}</label>
      <input
        type="text"
        id={id}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => { if (inputValue.length > 1) setIsListVisible(true); }} // Show list on focus if input exists
        placeholder={placeholder}
        className={finalInputClassName}
        autoComplete="off" // Prevent browser autocomplete interfering
      />
      {/* Suggestions List */}
      {isListVisible && filteredOptions.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-700 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black dark:ring-slate-600 ring-opacity-5 dark:ring-opacity-100 overflow-auto focus:outline-none sm:text-sm">
          {filteredOptions.map((option) => (
            <li
              key={option.value}
              onClick={() => handleOptionClick(option)}
              className="text-slate-900 dark:text-slate-200 cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50 dark:hover:bg-slate-600"
            >
              {/* Display label and potentially other info like ICD10 */}
              <span className="block truncate font-normal">
                {option.label}
                {option.icd10 && <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">({option.icd10})</span>}
              </span>
            </li>
          ))}
        </ul>
      )}
       {isListVisible && inputValue.length > 1 && filteredOptions.length === 0 && (
         <div className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-700 shadow-lg rounded-md p-3 text-sm text-slate-500 dark:text-slate-400">
             Nenhum resultado encontrado.
         </div>
       )}
    </div>
  );
};

export default AutocompleteInput;

// Define the type for selected diagnosis objects
export interface SelectedDiagnosis {
  value: string;
  label: string;
  icd10?: string; // ICD10 code is optional for now
}