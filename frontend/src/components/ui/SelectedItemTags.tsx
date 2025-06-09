// src/components/ui/SelectedItemTags.tsx
import React from 'react';
import { SelectedDiagnosis } from './AutocompleteInput';
import { Button } from './Button'; // <-- Corrected import
import { PiX } from 'react-icons/pi';

// ... rest of the file is correct
interface SelectedItemTagsProps {
  items: SelectedDiagnosis[];
  onRemove: (valueToRemove: string) => void;
  className?: string;
  noItemsText?: string;
  tagClassName?: string;
  removeButtonClassName?: string;
}
const SelectedItemTags: React.FC<SelectedItemTagsProps> = ({ items, onRemove, className = '', noItemsText = 'Nenhum item selecionado.', tagClassName = '', removeButtonClassName = '', }) => {
  if (!items || items.length === 0) {
    return <p className={`text-sm text-slate-500 dark:text-slate-400 italic ${className}`}>{noItemsText}</p>;
  }
  const baseTagClasses = "flex items-center bg-blue-100 dark:bg-slate-600 text-blue-800 dark:text-slate-100 text-sm font-medium px-3 py-1 rounded-full";
  const finalTagClassName = [baseTagClasses, tagClassName].filter(Boolean).join(' ');
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
            variant="ghost"
            size="sm"
            onClick={() => onRemove(item.value)}
            iconLeft={<PiX size={14}/>}
            className={finalRemoveButtonClassName}
            aria-label={`Remover ${item.label}`}
          >{null}</Button> 
        </div>
      ))}
    </div>
  );
};
export default SelectedItemTags;