import React from 'react';
import DrugInputField from '../ui/DrugInputField';
import { intraOpDataSources, DrugInfo } from '../../data/intraoperatoriaOptions';

export interface DrugSectionValue {
  selectedDrugs: { [drugId: string]: boolean };
  drugValues: { [drugId: string]: string | number | null };
}

interface DrugSectionWidgetProps {
  id: string; // Base ID for the section
  value: DrugSectionValue;
  onChange: (newValue: DrugSectionValue) => void;
  uiOptions: {
    drugListKey: keyof typeof intraOpDataSources;
    sectionTitle: string;
  };
  required?: boolean; // For the fieldset legend, if needed
}

const DrugSectionWidget: React.FC<DrugSectionWidgetProps> = ({
  id,
  value, // Expected to be { selectedDrugs: {}, drugValues: {} }
  onChange,
  uiOptions,
  required,
}) => {
  const { drugListKey, sectionTitle } = uiOptions;
  
  // Ensure value and its properties are initialized if undefined
  const currentSelectedDrugs = value?.selectedDrugs || {};
  const currentDrugValues = value?.drugValues || {};

  // Type assertion is okay here because drugListKey should be validated by its type
  const drugList = intraOpDataSources[drugListKey] as DrugInfo[] | undefined;

  if (!drugList) {
    return <p>Error: Drug list not found for key: {drugListKey}</p>;
  }

  const handleDrugSelectToggle = (drugId: string) => {
    const newSelectedDrugs = {
      ...value.selectedDrugs,
      [drugId]: !value.selectedDrugs[drugId]
    };

    const newDrugValues = { ...value.drugValues };
    if (!newSelectedDrugs[drugId]) {
      // Remove value if drug is deselected
      delete newDrugValues[drugId];
    }

    onChange({
      selectedDrugs: newSelectedDrugs,
      drugValues: newDrugValues
    });
  };

  const handleDrugValueChange = (drugId: string, newValue: string | number) => {
    // The DrugInputField passes string for steppers, or event for others.
    // We assume DrugInputField's onValueChange has already processed the event to a simple value if necessary.
    const processedValue = typeof newValue === 'object' && newValue !== null && 'target' in newValue 
                         ? (newValue as React.ChangeEvent<HTMLInputElement>).target.value 
                         : newValue;

    const newDrugValues = { ...currentDrugValues, [drugId]: processedValue };
    onChange({ selectedDrugs: currentSelectedDrugs, drugValues: newDrugValues });
  };

  return (
    <fieldset className="border border-slate-200 dark:border-slate-600 p-4 rounded-md bg-white dark:bg-slate-800 mb-6" id={id}>
      <legend className="text-base font-semibold text-slate-800 dark:text-slate-100 px-2">
        {sectionTitle}
        {required && <span className="text-red-500 ml-1">*</span>} 
      </legend>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3 mt-2">
        {drugList.map((drug) => (
          <DrugInputField
            key={drug.id}
            drugName={drug.name}
            drugId={drug.id}
            unit={drug.unit}
            isSelected={currentSelectedDrugs[drug.id] || false}
            value={String(currentDrugValues[drug.id] || '')} // Ensure value is string for DrugInputField
            onSelectToggle={() => handleDrugSelectToggle(drug.id)}
            onValueChange={(eventOrValue) => handleDrugValueChange(drug.id, eventOrValue as string | number)} // Cast as DrugInputField expects string for stepper
            inputType={drug.inputType}
            colorClass={drug.colorClass}
          />
        ))}
      </div>
    </fieldset>
  );
};

export default DrugSectionWidget; 