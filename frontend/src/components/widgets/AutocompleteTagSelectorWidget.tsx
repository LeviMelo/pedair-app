import React from 'react';
import QuickSelectButtons from '../ui/QuickSelectButtons';
import AutocompleteInput, { AutocompleteOption as UISpecificAutocompleteOption } from '../ui/AutocompleteInput'; // Renaming to avoid conflict if any
import SelectedItemTags from '../ui/SelectedItemTags';
import { dataOptionSources, AutocompleteOption as DataAutocompleteOption } from '../../data/preAnestesiaOptions'; // Data source

// This type should match the structure defined in the schema's items (e.g., for diagnosticos)
export interface SelectedItemType {
  value: string;
  label: string;
  icd10?: string; // Example, make it flexible or specific as needed by schemas
  [key: string]: any; // Allow other properties
}

interface AutocompleteTagSelectorWidgetProps {
  id: string;
  label: string; // Main field label, e.g., "Diagnóstico(s)"
  value: SelectedItemType[]; // Current array of selected items
  onChange: (newValue: SelectedItemType[]) => void; // To update formData
  uiOptions: {
    commonOptionsKey: keyof typeof dataOptionSources; // Ensures key exists in our data
    allOptionsKey: keyof typeof dataOptionSources;
    placeholder?: string;
    quickSelectLabel?: string;
    searchLabel?: string;
    selectedLabel?: string;
  };
  required?: boolean;
  // schema_item_definition?: any; // For future use if needed
}

const AutocompleteTagSelectorWidget: React.FC<AutocompleteTagSelectorWidgetProps> = ({
  id,
  label: mainFieldLabel,
  value = [], // Default to empty array if undefined
  onChange,
  uiOptions,
  required,
}) => {

  // Type assertion as the keys are validated by `keyof typeof dataOptionSources`
  const commonDataList = dataOptionSources[uiOptions.commonOptionsKey] as DataAutocompleteOption[];
  const allDataList = dataOptionSources[uiOptions.allOptionsKey] as DataAutocompleteOption[];

  // --- Event Handlers (to be implemented) ---
  const handleQuickToggle = (selectedValue: string) => {
    // Find the full object from commonDataList or allDataList
    const itemToAddOrRemove = [...commonDataList, ...allDataList].find(opt => opt.value === selectedValue);
    if (!itemToAddOrRemove) return;

    const existingIndex = value.findIndex(item => item.value === selectedValue);
    let newValueArray;
    if (existingIndex > -1) {
      newValueArray = value.filter(item => item.value !== selectedValue); // Remove
    } else {
      // Ensure we add an object matching SelectedItemType structure
      const newItem: SelectedItemType = { ...itemToAddOrRemove }; 
      newValueArray = [...value, newItem]; // Add
    }
    onChange(newValueArray);
  };

  const handleAutocompleteSelect = (selectedOption: UISpecificAutocompleteOption | null) => {
    if (selectedOption && !value.some(item => item.value === selectedOption.value)) {
       // Ensure we add an object matching SelectedItemType structure
      const newItem: SelectedItemType = { ...selectedOption }; 
      onChange([...value, newItem]);
    }
  };

  const handleTagRemove = (valueToRemove: string) => {
    onChange(value.filter(item => item.value !== valueToRemove));
  };

  return (
    <fieldset className="mb-4 p-4 border border-slate-200 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 space-y-4">
      <legend className="text-base font-semibold text-slate-800 dark:text-slate-100 px-2 -mb-2">
        {mainFieldLabel}
        {required && <span className="text-red-500 ml-1">*</span>}
      </legend>

      <div className='mt-2'> {/* Added mt-2 for spacing from legend */} 
        <label className='form-label'>{uiOptions.quickSelectLabel || 'Quick Select:'}</label>
        <QuickSelectButtons
          options={commonDataList.map(opt => ({ value: opt.value, label: opt.label }))} // Adapt to QuickSelectOption if needed
          selectedValues={value.map(item => item.value)}
          onToggle={handleQuickToggle}
        />
      </div>

      <div>
        <AutocompleteInput
          id={`${id}-autocomplete`}
          label={uiOptions.searchLabel || 'Search:'}
          options={allDataList} // AutocompleteInput expects AutocompleteOption[]
          onSelect={handleAutocompleteSelect}
          placeholder={uiOptions.placeholder}
        />
      </div>

      <div>
        <label className='form-label'>{uiOptions.selectedLabel || 'Selected:'}</label>
        <SelectedItemTags
          items={value} // SelectedItemTags expects SelectedDiagnosis[] which should be compatible with SelectedItemType
          onRemove={handleTagRemove}
          noItemsText="-"
        />
      </div>
    </fieldset>
  );
};

export default AutocompleteTagSelectorWidget; 