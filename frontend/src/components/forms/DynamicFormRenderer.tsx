// src/components/forms/DynamicFormRenderer.tsx
import React from 'react';

// Import all possible widgets
import RadioButtonGroupField from '../ui/RadioButtonGroupField';
import CheckboxGroupField from '../ui/CheckboxGroupField';
import { InputField } from '../ui/InputField'; // <-- Corrected import
import SelectField from '../ui/SelectField';
import AutocompleteTagSelectorWidget from '../widgets/AutocompleteTagSelectorWidget';
import DrugSectionWidget from '../widgets/DrugSectionWidget';

// Import data sources that widgets might need
import { intraOpDataSources } from '../../data/intraoperatoriaOptions';
import { dataOptionSources as preAnestesiaDataSources } from '../../data/preAnestesiaOptions';

// ... rest of the file is correct
interface DynamicFormRendererProps {
  schema: any;
  uiSchema: any;
  formData: any;
  onFormDataChange: (updatedData: any) => void;
}
const widgetRegistry = {
  InputFieldWidget: InputField,
  SelectFieldWidget: SelectField,
  RadioButtonGroupField,
  CheckboxGroupField,
  AutocompleteTagSelectorWidget,
  DrugSectionWidget,
};
const UnhandledWidget = ({ propertyName, widgetName, schemaType, value }: any) => (
  <div className="mb-4 p-2 border border-dashed border-red-300 dark:border-red-600 text-sm text-red-600 dark:text-red-300 rounded-md bg-red-50 dark:bg-red-900/20">
    <p><strong>Unhandled Widget</strong></p>
    <p><strong>Field:</strong> <code>{propertyName}</code></p>
    <p><strong>Widget Type:</strong> <code>{widgetName || 'Default'}</code></p>
    <p><strong>Schema Type:</strong> <code>{schemaType}</code></p>
    <p><strong>Current Value:</strong> {JSON.stringify(value)}</p>
  </div>
);
const DynamicFormRenderer: React.FC<DynamicFormRendererProps> = ({ schema, uiSchema, formData, onFormDataChange, }) => {
  if (!schema || !schema.properties) {
    return <p className="text-red-500">Schema not provided or is invalid.</p>;
  }
  const renderField = (propertyName: string, propertySchema: any) => {
    const uiOptions = uiSchema[propertyName] || {};
    const widgetName = uiOptions['ui:widget'];
    const WidgetComponent = widgetName ? (widgetRegistry as any)[widgetName] : null;
    if (!WidgetComponent) {
      return (
        <UnhandledWidget
          key={propertyName}
          propertyName={propertyName}
          widgetName={widgetName}
          schemaType={propertySchema.type}
          value={formData[propertyName]}
        />
      );
    }
    const fieldUiOptions = uiOptions['ui:options'] || {};
    const commonProps = {
      id: propertyName,
      label: propertySchema.title || propertyName,
      required: schema.required?.includes(propertyName) || fieldUiOptions.required,
      value: formData[propertyName],
      onChange: (valueOrEvent: any) => {
        const newValue = valueOrEvent?.target ? valueOrEvent.target.value : valueOrEvent;
        onFormDataChange({ ...formData, [propertyName]: newValue });
      },
    };
    let specificProps: any = {
        ...fieldUiOptions
    };
    if (widgetName === 'SelectFieldWidget') {
      let options = [];
      if (propertySchema.enum && propertySchema.enumNames) {
        options = propertySchema.enum.map((val: any, i: number) => ({ value: val, label: propertySchema.enumNames[i] }));
      }
      specificProps.options = options;
    }
    if (widgetName === 'RadioButtonGroupField' || widgetName === 'CheckboxGroupField') {
        let options = [];
        if (fieldUiOptions.optionsSourceKey) {
            const allDataSources = {...intraOpDataSources, ...preAnestesiaDataSources};
            options = (allDataSources as any)[fieldUiOptions.optionsSourceKey] || [];
        } else if (propertySchema.enum && propertySchema.enumNames) {
            options = propertySchema.enum.map((val: any, i: number) => ({ value: val, label: propertySchema.enumNames[i] }));
        } else if (propertySchema.items?.enum) {
            options = propertySchema.items.enum.map((val: any, i: number) => ({ value: val, label: propertySchema.items.enumNames[i] }));
        }
        specificProps.options = options;
        specificProps.selectedValue = commonProps.value;
        specificProps.selectedValues = commonProps.value || [];
        specificProps.onChange = (toggledValue: any) => {
            if (widgetName === 'CheckboxGroupField') {
                const currentArray = formData[propertyName] || [];
                const newArray = currentArray.includes(toggledValue)
                    ? currentArray.filter((item: string) => item !== toggledValue)
                    : [...currentArray, toggledValue];
                onFormDataChange({ ...formData, [propertyName]: newArray });
            } else {
                 onFormDataChange({ ...formData, [propertyName]: toggledValue });
            }
        };
    }
    if (widgetName === 'InputFieldWidget') {
        specificProps.type = fieldUiOptions.inputType || 'text';
    }
    if(widgetName === 'AutocompleteTagSelectorWidget' || widgetName === 'DrugSectionWidget'){
        specificProps.uiOptions = fieldUiOptions;
    }
    return <WidgetComponent key={propertyName} {...commonProps} {...specificProps} />;
  };
  return (
    <form className="space-y-8">
      {Object.keys(schema.properties).map((propertyName) => 
        renderField(propertyName, schema.properties[propertyName])
      )}
    </form>
  );
};
export default DynamicFormRenderer;