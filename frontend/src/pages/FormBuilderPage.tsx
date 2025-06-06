import React, { useState } from 'react';
import FormBuilderToolbar from '../components/forms/FormBuilderToolbar';
import FormMetadataEditor from '../components/forms/FormMetadataEditor';
import SchemaEditor from '../components/forms/SchemaEditor'; // Reused for both schemas

const initialSchema = JSON.stringify({
  "title": "My New Form",
  "description": "A description for my new form.",
  "type": "object",
  "properties": {
    "fieldName": {
      "type": "string",
      "title": "My First Field"
    }
  }
}, null, 2);

const initialUiSchema = JSON.stringify({
  "fieldName": {
    "ui:widget": "InputFieldWidget"
  }
}, null, 2);

const FormBuilderPage: React.FC = () => {
  const [formTitle, setFormTitle] = useState('New Form');
  const [formDescription, setFormDescription] = useState('A basic form description.');
  const [formVersion, setFormVersion] = useState('1.0.0'); // Placeholder

  const [schemaJsonString, setSchemaJsonString] = useState<string>(initialSchema);
  const [uiSchemaJsonString, setUiSchemaJsonString] = useState<string>(initialUiSchema);

  const [schemaError, setSchemaError] = useState<string | null>(null);
  const [uiSchemaError, setUiSchemaError] = useState<string | null>(null);

  const handleSchemaChange = (newJsonString: string) => {
    setSchemaJsonString(newJsonString);
    try {
      JSON.parse(newJsonString);
      setSchemaError(null);
    } catch (e: any) {
      setSchemaError(e.message);
    }
  };

  const handleUiSchemaChange = (newJsonString: string) => {
    setUiSchemaJsonString(newJsonString);
    try {
      JSON.parse(newJsonString);
      setUiSchemaError(null);
    } catch (e: any) {
      setUiSchemaError(e.message);
    }
  };

  const handleNewForm = () => {
    setFormTitle('Untitled Form');
    setFormDescription('');
    setFormVersion('1.0.0');
    setSchemaJsonString(JSON.stringify({ type: 'object', properties: {} }, null, 2));
    setUiSchemaJsonString(JSON.stringify({}, null, 2));
    setSchemaError(null);
    setUiSchemaError(null);
    console.log("New Blank Form clicked");
  };

  const handleLoadForm = () => {
    // Placeholder - In future, this would open a modal to select & load form schemas
    console.log("Load Form clicked (Placeholder)");
    alert("Load Form functionality not yet implemented.");
  };

  const handleSaveForm = () => {
    // Placeholder - In future, this would validate and send schemas to backend
    console.log("Save Form clicked (Placeholder)");
    if (schemaError || uiSchemaError) {
      alert("Cannot save: Please fix JSON errors first.");
      return;
    }
    alert("Form save functionality not yet implemented. Check console for current data.");
    console.log("Form Metadata:", { title: formTitle, description: formDescription, version: formVersion });
    console.log("Schema JSON:", schemaJsonString);
    console.log("UI Schema JSON:", uiSchemaJsonString);
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/20 dark:from-slate-900 dark:via-purple-950/20 dark:to-slate-900">
      {/* Enhanced Colorful Page Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white via-purple-50/50 to-indigo-50/30 dark:from-slate-800 dark:via-slate-700/80 dark:to-slate-800 border-b-2 border-purple-200/60 dark:border-purple-800/30 shadow-xl mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-indigo-500/5 to-blue-500/10 dark:from-purple-500/5 dark:via-indigo-500/3 dark:to-blue-500/5"></div>
        <div className="absolute -top-1/2 -right-1/4 w-1/2 h-full bg-gradient-to-l from-white/20 to-transparent dark:from-slate-700/20 rounded-full transform rotate-12"></div>
        <div className="relative z-10 px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 shadow-lg">
              <div className="w-6 h-6 text-white">⚡</div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Form Builder
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-lg">
            Design and customize clinical research forms for your project
          </p>
        </div>
      </div>
      
      <div className="p-0 flex flex-col h-[calc(100vh-var(--header-height,4rem)-var(--page-padding,3rem)-8rem)] max-h-[calc(100vh-var(--header-height,4rem)-var(--page-padding,3rem)-8rem)]">
        <div className="px-4 sm:px-6">
      <FormBuilderToolbar 
        onNewForm={handleNewForm}
        onLoadForm={handleLoadForm}
        onSaveForm={handleSaveForm}
      />
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
        {/* Left Column: Metadata & UI Schema Editor */}
        <div className="lg:col-span-4 flex flex-col gap-4 min-h-0">
          <FormMetadataEditor
            title={formTitle}
            onTitleChange={setFormTitle}
            description={formDescription}
            onDescriptionChange={setFormDescription}
            version={formVersion}
          />
          <div className="flex-grow min-h-0">
            <SchemaEditor
              id="uiSchemaEditor"
              title="UI Schema Editor (.uiSchema.json)"
              jsonString={uiSchemaJsonString}
              onJsonStringChange={handleUiSchemaChange}
              error={uiSchemaError}
              height="100%" // Attempt to fill remaining space
            />
          </div>
        </div>

        {/* Right Column: Main Schema Editor */}
        <div className="lg:col-span-8 min-h-0">
          <SchemaEditor
            id="mainSchemaEditor"
            title="Form Data Schema Editor (.schema.json)"
            jsonString={schemaJsonString}
            onJsonStringChange={handleSchemaChange}
            error={schemaError}
            height="calc(100% - 0px)" // Adjust if FormMetadataEditor has variable height or there are other elements.
          />
        </div>
      </div>
    </div>
    </div>
  </div>
  );
};

export default FormBuilderPage; 