// frontend/src/components/ui/QuickSelectButtons.tsx
import React from 'react';

// Expects options similar to checkboxes but will render buttons
interface QuickSelectOption {
  value: string;
  label: string;
}

interface QuickSelectButtonsProps {
  options: QuickSelectOption[];
  selectedValues: string[]; // Array of currently selected values
  onToggle: (value: string) => void; // Function to call when a button is clicked
  className?: string; // Class for the container div
}

const QuickSelectButtons: React.FC<QuickSelectButtonsProps> = ({
  options,
  selectedValues,
  onToggle,
  className = '',
}) => {
  return (
    // Use flex-wrap for button layout
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {options.map((option) => {
        const isSelected = selectedValues.includes(option.value);
        return (
          <button
            key={option.value}
            type="button" // Important: Prevent form submission if inside a form
            onClick={() => onToggle(option.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800
                        ${isSelected
                          ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:text-white dark:border-blue-500 dark:hover:bg-blue-400 focus:ring-blue-500 dark:focus:ring-blue-500' // Selected style
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-500 dark:hover:bg-slate-600 focus:ring-blue-500 dark:focus:ring-slate-400' // Default style
                        }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default QuickSelectButtons;