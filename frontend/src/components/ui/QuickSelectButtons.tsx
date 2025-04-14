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
            // Dynamic styling based on selection state
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                        ${isSelected
                          ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' // Selected style
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50' // Default style
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