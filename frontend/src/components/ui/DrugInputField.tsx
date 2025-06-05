// frontend/src/components/ui/DrugInputField.tsx
import React, { useState, useEffect, useRef } from 'react';
import InputField from './InputField';
import StepperInput from './StepperInput'; // Ensure this path is correct

interface DrugInputFieldProps {
  drugName: string;
  drugId: string;
  unit: string;
  isSelected: boolean; // Controlled from parent: whether the drug *was used*
  value: string; // Controlled from parent: the *saved* value
  onSelectToggle: () => void;
  onValueChange: (eventOrValue: React.ChangeEvent<HTMLInputElement> | string) => void; // Can accept event or direct string value
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
  const [isEditing, setIsEditing] = useState(false); // Internal state: is the input currently active?
  const inputRef = useRef<HTMLInputElement>(null); // Ref to focus input when editing starts

  // Effect to start editing when the drug is selected AND has no value yet,
  // or to stop editing if the drug is deselected externally.
  useEffect(() => {
    if (isSelected && !isEditing) {
        // If selected but not editing (e.g., just checked), start editing
        // Optionally, only start editing if value is empty: if (isSelected && !value && !isEditing)
         setIsEditing(true);
    } else if (!isSelected && isEditing) {
        // If deselected externally while editing, stop editing
         setIsEditing(false);
    }
  }, [isSelected]); // Rerun only when isSelected changes

  // Effect to focus the input when editing begins
   useEffect(() => {
       if (isEditing && inputRef.current) {
           inputRef.current.focus();
           // For text/number inputs, select the content
           if (inputType !== 'stepper') {
                inputRef.current.select();
           }
       }
   }, [isEditing, inputType]);

  const checkboxId = `select-${drugId}`;
  const inputId = `value-${drugId}`;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange(event); // Pass the raw event up
  };

  const handleStepperChange = (newValue: number) => {
    onValueChange(String(newValue)); // Pass the string value up
  };

  // Function to handle finishing editing (Enter or Blur)
  const finishEditing = () => {
      setIsEditing(false);
      // Optionally: trigger a 'save' or validation action here if needed later
  };

   const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
       if (event.key === 'Enter') {
           event.preventDefault(); // Prevent form submission if applicable
           finishEditing();
       } else if (event.key === 'Escape') {
           finishEditing(); // Allow escape to cancel/close edit
           // Optionally revert value here if needed: onValueChange(initialValue)
       }
   };

   const handleBlur = () => {
       setTimeout(() => {
            finishEditing();
       }, 100);
   };


  return (
    <div className={`border rounded-md ${isSelected ? 'bg-blue-50 dark:bg-slate-750 border-blue-300 dark:border-blue-500 shadow-sm' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600'} transition-all duration-150 overflow-hidden`}>
       <div className="flex">
            <div className={`w-1.5 flex-shrink-0 ${colorClass}`}></div>
            <div className="p-3 flex-grow min-w-0"> {/* Added min-w-0 for flex constraints */}
                 <div className="flex items-center justify-between mb-1">
                     <div className="flex items-center mr-2 min-w-0"> {/* Added min-w-0 */}
                         <input
                             id={checkboxId} type="checkbox" checked={isSelected} onChange={onSelectToggle}
                             className="h-4 w-4 text-blue-600 dark:text-blue-500 border-slate-300 dark:border-slate-500 rounded focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-offset-0 dark:focus:ring-offset-slate-800 mr-2 flex-shrink-0"
                         />
                         <label htmlFor={checkboxId} className="font-medium text-sm text-slate-800 dark:text-slate-100 cursor-pointer break-words truncate"> {/* Added truncate */}
                             {drugName}
                         </label>
                     </div>
                     {/* Display Value OR Unit when not editing */}
                     <div className="text-xs text-slate-600 dark:text-slate-400 font-medium flex-shrink-0 ml-2">
                        {isSelected && !isEditing && value ? (
                            // Show value when selected, not editing, and value exists
                            <span className='px-1.5 py-0.5 bg-slate-200 dark:bg-slate-600 dark:text-slate-200 rounded'>{value} {unit}</span>
                        ) : (
                             // Otherwise show only the unit
                            <span className='italic'>{unit}</span>
                        )}
                     </div>
                 </div>

                 {/* Conditional Input Field / Stepper - Render based on isEditing */}
                 {isSelected && isEditing && (
                     <div className="mt-1 pl-6 animation-fade-in"> {/* Added fade-in animation (needs definition in index.css) */}
                         {inputType === 'stepper' ? (
                             <StepperInput
                                 id={inputId} label={`Valor para ${drugName}`} labelClassName="sr-only"
                                 value={parseInt(value || '0', 10)}
                                 onChange={handleStepperChange}
                                 min={0}
                                 // Pass down keyboard/blur handlers to inner input
                                 onInputKeyDown={handleKeyDown}
                                 onInputBlur={handleBlur}
                                 className="mb-0" // Remove margin from stepper container
                             />
                         ) : (
                             <InputField
                                 // Use ref here for focusing standard input
                                 ref={inputRef as React.RefObject<HTMLInputElement>} // Cast ref type
                                 label={`Valor para ${drugName}`} labelClassName="sr-only"
                                 id={inputId} type={inputType === 'text' ? 'text' : 'number'}
                                 value={value}
                                 onChange={handleInputChange}
                                 onKeyDown={handleKeyDown} // Attach keydown handler
                                 onBlur={handleBlur}       // Attach blur handler
                                 placeholder={`Valor (${unit})`}
                                 className="mb-0" // Remove container margin
                                 inputClassName="py-1 text-sm" // Adjust input padding/size
                             />
                         )}
                     </div>
                 )}
            </div>
       </div>
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