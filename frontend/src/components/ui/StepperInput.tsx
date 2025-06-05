// frontend/src/components/ui/StepperInput.tsx
import React from 'react';

interface StepperInputProps {
    id: string;
    label: string;
    labelClassName?: string; // ADDED: For the label element
    value: number;
    onChange: (newValue: number) => void;
    min?: number;
    max?: number;
    step?: number;
    className?: string; // For the container div
    // Add props for onKeyDown/onBlur if needed for the inner input
    onInputKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    onInputBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

const StepperInput: React.FC<StepperInputProps> = ({
    id,
    label,
    // Default label class, apply prop if provided
    labelClassName = "block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1",
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    className = '',
    onInputKeyDown, // Destructure
    onInputBlur,    // Destructure
}) => {

    const handleIncrement = () => {
        const newValue = Math.min(value + step, max);
        onChange(newValue);
    };

    const handleDecrement = () => {
        const newValue = Math.max(value - step, min);
        onChange(newValue);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let numValue = parseInt(event.target.value, 10);
        if (isNaN(numValue)) {
             // Handle non-numeric input, maybe reset to min or keep current value?
             // For now, let's clamp based on min/max or fallback to min
             numValue = min; // Or potentially do nothing: onChange(value); return;
        }
        // Clamp value within min/max
        numValue = Math.max(min, Math.min(numValue, max));
        onChange(numValue);
    };

    return (
        <div className={`mb-4 ${className}`}>
             {/* Apply labelClassName here */}
            <label htmlFor={id} className={labelClassName}>
                {label}
            </label>
            <div className="flex items-center mt-1">
                <button
                    type="button" onClick={handleDecrement} disabled={value <= min}
                    className="px-2.5 py-1 border border-slate-300 dark:border-slate-500 rounded-l-md bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 disabled:opacity-50 dark:disabled:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500"
                    aria-label="Diminuir"
                > - </button>
                <input
                    type="text" id={id} value={value} onChange={handleInputChange}
                    onKeyDown={onInputKeyDown} // Pass down
                    onBlur={onInputBlur}       // Pass down
                    className="w-12 px-2 py-1 border-t border-b border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-center text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500"
                    inputMode="numeric" pattern="[0-9]*"
                />
                <button
                    type="button" onClick={handleIncrement} disabled={value >= max}
                    className="px-2.5 py-1 border border-slate-300 dark:border-slate-500 rounded-r-md bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 disabled:opacity-50 dark:disabled:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500"
                    aria-label="Aumentar"
                > + </button>
            </div>
        </div>
    );
};

export default StepperInput;