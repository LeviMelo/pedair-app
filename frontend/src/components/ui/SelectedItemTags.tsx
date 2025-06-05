// frontend/src/components/ui/SelectedItemTags.tsx
import React from 'react';
import { SelectedDiagnosis } from './AutocompleteInput'; // Import the type
import Button from './Button'; // Import the Button component
import { PiX } from 'react-icons/pi'; // Import an X icon

interface SelectedItemTagsProps {
  items: SelectedDiagnosis[]; // Array of selected items (using the exported type)
  onRemove: (valueToRemove: string) => void; // Function to call when removing an item
  className?: string; // Class for the container div
  noItemsText?: string; // Text to display when no items are selected
  tagClassName?: string; // Custom class for each tag pill
  removeButtonClassName?: string; // Custom class for the remove button
}

const SelectedItemTags: React.FC<SelectedItemTagsProps> = ({
  items,
  onRemove,
  className = '',
  noItemsText = 'Nenhum item selecionado.',
  tagClassName = '',
  removeButtonClassName = '',
}) => {
  if (!items || items.length === 0) {
    return <p className={`text-sm text-slate-500 dark:text-slate-400 italic ${className}`}>{noItemsText}</p>;
  }

  const baseTagClasses = "flex items-center bg-blue-100 dark:bg-slate-600 text-blue-800 dark:text-slate-100 text-sm font-medium px-3 py-1 rounded-full";
  const finalTagClassName = [baseTagClasses, tagClassName].filter(Boolean).join(' ');
  
  // Specific styling for the small 'x' button within a tag
  const baseRemoveButtonClasses = "p-0.5 -mr-2 ml-1.5 rounded-full hover:bg-blue-200 dark:hover:bg-slate-500";
  const finalRemoveButtonClassName = [baseRemoveButtonClasses, removeButtonClassName].filter(Boolean).join(' ');

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((item) => (
        <div
          key={item.value}
          className={finalTagClassName}
        >
          <span>
            {item.label}
            {item.icd10 && <span className="text-xs text-blue-600 dark:text-slate-300 ml-1">({item.icd10})</span>}
          </span>
          <Button
            type="button"
            variant="ghost" // Ghost variant is suitable for an icon-only button inside a tag
            size="sm" // Small size
            onClick={() => onRemove(item.value)}
            iconLeft={<PiX size={14}/>} // Use the PiX icon
            className={finalRemoveButtonClassName}
            aria-label={`Remover ${item.label}`}
          >{null}</Button> 
        </div>
      ))}
    </div>
  );
};

export default SelectedItemTags;