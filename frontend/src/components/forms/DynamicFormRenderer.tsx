import React from 'react';
import RadioButtonGroupField from '../ui/RadioButtonGroupField';
import CheckboxGroupField from '../ui/CheckboxGroupField';
import InputField from '../ui/InputField';
import SelectField from '../ui/SelectField';
import AutocompleteTagSelectorWidget, { SelectedItemType } from '../widgets/AutocompleteTagSelectorWidget';
import DrugSectionWidget, { DrugSectionValue } from '../widgets/DrugSectionWidget';
// Import the data source for IntraOp options
import { intraOpDataSources, OptionInfo as IntraOpOptionInfo } from '../../data/intraoperatoriaOptions';
// We will import schema types and UI components later

// Define expected prop types (will expand later)
interface DynamicFormRendererProps {
  schema: any; // Replace 'any' with a proper JSON Schema type definition later
  uiSchema: any; // Replace 'any' with a proper UI Schema type definition later
  formData: any;
  onFormDataChange: (updatedData: any) => void;
  // We can add a widget registry prop later if we go that route
  // widgets?: { [widgetName: string]: React.ComponentType<any> };
}

// Helper type for widget options
interface WidgetOption {
  value: string | number;
  label: string;
}

interface CheckboxWidgetOption {
  value: string;
  label: string;
}

const DynamicFormRenderer: React.FC<DynamicFormRendererProps> = ({
  schema,
  uiSchema,
  formData,
  onFormDataChange,
}) => {
  if (!schema || !schema.properties) {
    return <p className="text-red-500 dark:text-red-400">Schema not provided or is invalid.</p>;
  }

  const renderField = (propertyName: string, propertySchema: any) => {
    const widgetName = uiSchema[propertyName]?.['ui:widget'];
    const fieldTitle = propertySchema.title || propertyName;
    const fieldUiOptions = uiSchema[propertyName]?.['ui:options'] || {};
    const isRequired = schema.required?.includes(propertyName) || fieldUiOptions.required || false;

    const baseProps = {
      id: propertyName,
      label: fieldTitle,
      required: isRequired,
    };

    if (widgetName === 'DrugSectionWidget') {
      const currentDrugSectionValue = formData[propertyName] || { selectedDrugs: {}, drugValues: {} };
      return (
        <DrugSectionWidget
          id={propertyName}
          value={currentDrugSectionValue as DrugSectionValue}
          onChange={(newValue: DrugSectionValue) =>
            onFormDataChange({ ...formData, [propertyName]: newValue })
          }
          uiOptions={fieldUiOptions}
          required={isRequired}
        />
      );
    }

    if (widgetName === 'AutocompleteTagSelectorWidget') {
      return (
        <AutocompleteTagSelectorWidget
          {...baseProps}
          value={formData[propertyName] as SelectedItemType[] || []}
          onChange={(newValue: SelectedItemType[]) => 
            onFormDataChange({ ...formData, [propertyName]: newValue })
          }
          uiOptions={fieldUiOptions}
        />
      );
    }

    if (widgetName === 'InputFieldWidget') {
      const inputType = fieldUiOptions.inputType || 'text';
      return (
        <InputField
          {...baseProps}
          type={inputType as 'text' | 'number' | 'email' | 'password' | 'date'}
          placeholder={fieldUiOptions.placeholder || ''}
          value={formData[propertyName] || ''}
          onChange={(event) => {
            let newValue: string | number = event.target.value;
            if (inputType === 'number') {
              newValue = event.target.value === '' ? '' : parseFloat(event.target.value);
              if (isNaN(newValue as number) && event.target.value !== '') newValue = formData[propertyName];
            }
            onFormDataChange({ ...formData, [propertyName]: newValue });
          }}
        />
      );
    }

    if (widgetName === 'SelectFieldWidget') {
      let selectOptions: WidgetOption[] = [];
      if (fieldUiOptions.optionsSourceKey && intraOpDataSources[fieldUiOptions.optionsSourceKey as keyof typeof intraOpDataSources]) {
        selectOptions = (intraOpDataSources[fieldUiOptions.optionsSourceKey as keyof typeof intraOpDataSources] as IntraOpOptionInfo[]).map(opt => ({...opt}));
      } else if (propertySchema.enum && propertySchema.enumNames) {
        selectOptions = propertySchema.enum.map((enumValue: string | number, index: number) => ({
          value: enumValue,
          label: propertySchema.enumNames[index] || String(enumValue),
        }));
      }
      return (
        <SelectField
          {...baseProps}
          options={selectOptions}
          value={formData[propertyName] || ''}
          onChange={(event) => onFormDataChange({ ...formData, [propertyName]: event.target.value })}
          placeholder={fieldUiOptions.placeholder}
        />
      );
    }

    if (widgetName === 'RadioButtonGroupField') {
      let radioOptions: WidgetOption[] | undefined = undefined;
      if (fieldUiOptions.optionsSourceKey && intraOpDataSources[fieldUiOptions.optionsSourceKey as keyof typeof intraOpDataSources]) {
        radioOptions = (intraOpDataSources[fieldUiOptions.optionsSourceKey as keyof typeof intraOpDataSources] as IntraOpOptionInfo[]).map(opt => ({...opt}));
      } else if (propertySchema.enum && propertySchema.enumNames) {
        radioOptions = propertySchema.enum.map((enumValue: string | number, index: number) => ({
          value: enumValue,
          label: propertySchema.enumNames[index] || String(enumValue),
        }));
      }
      if (radioOptions) {
        return (
          <RadioButtonGroupField
            idPrefix={propertyName}
            label={fieldTitle}
            required={isRequired}
            options={radioOptions}
            selectedValue={formData[propertyName] || null}
            onChange={(value) => onFormDataChange({ ...formData, [propertyName]: value })}
          />
        );
      }
    }

    if (widgetName === 'CheckboxGroupField') {
      let checkboxOptions: CheckboxWidgetOption[] | undefined = undefined;
      if (fieldUiOptions.optionsSourceKey && intraOpDataSources[fieldUiOptions.optionsSourceKey as keyof typeof intraOpDataSources]) {
        checkboxOptions = (intraOpDataSources[fieldUiOptions.optionsSourceKey as keyof typeof intraOpDataSources] as IntraOpOptionInfo[]).map(opt => ({ value: String(opt.value), label: opt.label }));
      } else if (propertySchema.items?.enum && propertySchema.items?.enumNames) {
        checkboxOptions = propertySchema.items.enum.map((enumValue: any, index: number) => ({
          value: String(enumValue),
          label: propertySchema.items.enumNames[index] || String(enumValue),
        }));
      }
      if (checkboxOptions) {
        return (
          <CheckboxGroupField
            idPrefix={propertyName}
            label={fieldTitle}
            options={checkboxOptions}
            selectedValues={formData[propertyName] || []}
            onChange={(toggledValue) => {
              const currentArray = formData[propertyName] || [];
              const newArray = currentArray.includes(toggledValue)
                ? currentArray.filter((item: string) => item !== toggledValue)
                : [...currentArray, toggledValue];
              onFormDataChange({ ...formData, [propertyName]: newArray });
            }}
          />
        );
      }
    }

    return (
      <div style={{ marginBottom: '1rem', padding: '0.5rem', border: '1px dashed #ccc' }}>
        <p><strong>Field:</strong> {fieldTitle} (<code>{propertyName}</code>)</p>
        <p><strong>Widget:</strong> {widgetName || 'Default (Unhandled)'}</p>
        <p><strong>Schema Type:</strong> {propertySchema.type}</p>
        <p><strong>Current Value:</strong> {JSON.stringify(formData[propertyName])}</p>
      </div>
    );
  };

  const sectionKeys = Object.keys(schema.properties);

  return (
    <form className="space-y-6">
      {/* Overall Form Title and Description - always show */}
      {schema.title && (
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
          {schema.title}
        </h2>
      )}
      {schema.description && (
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
          {schema.description}
        </p>
      )}

      {/* Always render all fields */}
      {sectionKeys.map((propertyName) => {
        const propertySchema = schema.properties[propertyName];
        if (!propertySchema) {
          console.warn(`DynamicFormRenderer: Schema definition missing for property: ${propertyName}`);
          return <p key={propertyName} className="text-red-500 dark:text-red-400">Error: Missing schema for {propertyName}</p>;
        }
        return <div key={propertyName}>{renderField(propertyName, propertySchema)}</div>;
      })}
      {/* We might add a submit button or other form-level actions here later */}
    </form>
  );
};

export default DynamicFormRenderer; 