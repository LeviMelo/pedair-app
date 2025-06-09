// src/components/ui/StepperInput.tsx
import React from 'react';
import { Button } from './Button'; // <-- CORRECTED IMPORT

interface StepperInputProps {
    id: string;
    label: string;
    labelClassName?: string;
    value: number;
    onChange: (newValue: number) => void;
    min?: number;
    max?: number;
    step?: number;
    className?: string;
    inputClassName?: string;
    onInputKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    onInputBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

const StepperInput: React.FC<StepperInputProps> = ({
    id,
    label,
    labelClassName = "block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1",
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    className = '',
    inputClassName = '',
    onInputKeyDown,
    onInputBlur,
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
             numValue = min;
        }
        numValue = Math.max(min, Math.min(numValue, max));
        onChange(numValue);
    };

    const containerClasses = ['form-field', className].filter(Boolean).join(' ');
    const finalLabelClassName = ['form-label', labelClassName].filter(Boolean).join(' ');
    const stepperInputSpecificClasses = 'w-12 text-center border-l-0 border-r-0 rounded-none z-10';
    const finalInputClassName = ['input-base', stepperInputSpecificClasses, inputClassName].filter(Boolean).join(' ');

    return (
        <div className={containerClasses}>
            <label htmlFor={id} className={finalLabelClassName}>
                {label}
            </label>
            <div className="flex items-center mt-1">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDecrement} 
                    disabled={value <= min}
                    className="rounded-r-none py-1 px-2.5"
                    aria-label="Diminuir"
                > - </Button>
                <input
                    type="text"
                    id={id} 
                    value={String(value)}
                    onChange={handleInputChange}
                    onKeyDown={onInputKeyDown}
                    onBlur={onInputBlur}
                    className={finalInputClassName}
                    inputMode="numeric" pattern="[0-9]*"
                />
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleIncrement} 
                    disabled={value >= max}
                    className="rounded-l-none py-1 px-2.5"
                    aria-label="Aumentar"
                > + </Button>
            </div>
        </div>
    );
};

export default StepperInput;