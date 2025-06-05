// frontend/src/components/ui/SelectedItemTags.tsx
import React from 'react';
import { SelectedDiagnosis } from './AutocompleteInput'; // Import the type

interface SelectedItemTagsProps {
  items: SelectedDiagnosis[]; // Array of selected items (using the exported type)
  onRemove: (valueToRemove: string) => void; // Function to call when removing an item
  className?: string; // Class for the container div
  noItemsText?: string; // Text to display when no items are selected
}

const SelectedItemTags: React.FC<SelectedItemTagsProps> = ({
  items,
  onRemove,
  className = '',
  noItemsText = 'Nenhum item selecionado.',
}) => {
  if (!items || items.length === 0) {
    return <p className={`text-sm text-slate-500 dark:text-slate-400 italic ${className}`}>{noItemsText}</p>;
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((item) => (
        <div
          key={item.value}
          className="flex items-center bg-blue-100 dark:bg-slate-600 text-blue-800 dark:text-slate-100 text-sm font-medium px-3 py-1 rounded-full"
        >
          <span>
            {item.label}
            {item.icd10 && <span className="text-xs text-blue-600 dark:text-slate-300 ml-1">({item.icd10})</span>}
          </span>
          <button
            type="button"
            onClick={() => onRemove(item.value)}
            className="ml-2 text-blue-600 dark:text-slate-400 hover:text-blue-800 dark:hover:text-slate-200 focus:outline-none"
            aria-label={`Remover ${item.label}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

export default SelectedItemTags;