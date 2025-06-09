// src/components/ui/QuickSelectButtons.tsx
import React from 'react';
import { Button } from './Button'; // <-- Corrected import

// ... rest of the file is correct
interface QuickSelectOption {
  value: string;
  label: string;
}
interface QuickSelectButtonsProps {
  options: QuickSelectOption[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  className?: string;
  buttonClassName?: string;
  selectedVariant?: 'primary' | 'secondary' | 'success';
  defaultVariant?: 'outline' | 'ghost' | 'secondary';
}
const QuickSelectButtons: React.FC<QuickSelectButtonsProps> = ({ options, selectedValues, onToggle, className = '', buttonClassName = '', selectedVariant = 'primary', defaultVariant = 'outline', }) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {options.map((option) => {
        const isSelected = selectedValues.includes(option.value);
        return (
          <Button
            key={option.value}
            type="button"
            onClick={() => onToggle(option.value)}
            variant={isSelected ? selectedVariant : defaultVariant}
            size="sm"
            className={`rounded-full ${buttonClassName}`}
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  );
};
export default QuickSelectButtons;