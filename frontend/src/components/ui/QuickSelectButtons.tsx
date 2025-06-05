// frontend/src/components/ui/QuickSelectButtons.tsx
import React from 'react';
import Button from './Button'; // Import the Button component

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
  buttonClassName?: string; // Optional class for individual buttons
  selectedVariant?: 'primary' | 'secondary' | 'success'; // Allow customizing selected variant
  defaultVariant?: 'outline-slate' | 'ghost' | 'outline-primary'; // Allow customizing default variant
}

const QuickSelectButtons: React.FC<QuickSelectButtonsProps> = ({
  options,
  selectedValues,
  onToggle,
  className = '',
  buttonClassName = '',
  selectedVariant = 'primary',
  defaultVariant = 'outline-slate',
}) => {
  return (
    // Use flex-wrap for button layout
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {options.map((option) => {
        const isSelected = selectedValues.includes(option.value);
        return (
          <Button
            key={option.value}
            type="button" // Important: Prevent form submission if inside a form
            onClick={() => onToggle(option.value)}
            variant={isSelected ? selectedVariant : defaultVariant}
            size="sm" // Defaulting to small size, suitable for quick select
            className={`rounded-full ${buttonClassName}`} // Apply rounded-full and any custom class
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  );
};

export default QuickSelectButtons;