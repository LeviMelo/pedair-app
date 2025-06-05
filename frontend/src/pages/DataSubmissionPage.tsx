import React, { useState, useEffect } from 'react';
import DynamicFormRenderer from '../components/forms/DynamicFormRenderer';
import InputField from '../components/ui/InputField'; // For patient input
import SectionCard from '../components/ui/SectionCard';

// Removed direct schema imports, will use dynamic imports

interface PatientInputData {
  initials: string;
  gender: string;
  dob: string; // YYYY-MM-DD
}

interface FormDefinition {
  key: string;
  name: string;
  version: string; // Added version
  schemaPath: string; // Relative path for dynamic import
  uiSchemaPath: string; // Relative path for dynamic import
}

// This will be replaced by an API call
// const MOCKED_AVAILABLE_FORMS: FormDefinition[] = [
//   { key: 'intraop', name: 'Intraoperatória', version: '1.1', schemaPath: '../schemas/intraoperatoria.schema.json', uiSchemaPath: '../schemas/intraoperatoria.uiSchema.json' },
//   { key: 'preanest', name: 'Pré-Anestesia', version: '1.0', schemaPath: '../schemas/preAnestesia.schema.json', uiSchemaPath: '../schemas/preAnestesia.uiSchema.json' },
//   { key: 'recuperacao', name: 'Recuperação Pós-Anestésica', version: '1.2', schemaPath: '../schemas/recuperacaoPosAnestesica.schema.json', uiSchemaPath: '../schemas/recuperacaoPosAnestesica.uiSchema.json' },
// ];

// Mock API function to fetch available forms
const fetchAvailableForms = (): Promise<FormDefinition[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { key: 'intraop', name: 'Intraoperatória', version: '1.1.0', schemaPath: '../schemas/intraoperatoria.schema.json', uiSchemaPath: '../schemas/intraoperatoria.uiSchema.json' },
        { key: 'preanest', name: 'Pré-Anestesia', version: '1.0.2', schemaPath: '../schemas/preAnestesia.schema.json', uiSchemaPath: '../schemas/preAnestesia.uiSchema.json' },
        { key: 'recuperacao', name: 'Recuperação Pós-Anestésica', version: '1.2.1', schemaPath: '../schemas/recuperacaoPosAnestesica.schema.json', uiSchemaPath: '../schemas/recuperacaoPosAnestesica.uiSchema.json' },
      ]);
    }, 500); // Simulate network delay, reduced for quicker testing
  });
};

type ProcessStep = 'loadingFormList' | 'formSelection' | 'loadingSchema' | 'fillingForm';

const DataSubmissionPage: React.FC = () => {
  const [currentProcessStep, setCurrentProcessStep] = useState<ProcessStep>('loadingFormList');
  const [availableForms, setAvailableForms] = useState<FormDefinition[]>([]);
  const [formListError, setFormListError] = useState<string | null>(null);
  
  const [selectedFormKey, setSelectedFormKey] = useState<string | null>(null);
  const [selectedFormDefinition, setSelectedFormDefinition] = useState<FormDefinition | null>(null);

  const [patientInputData, setPatientInputData] = useState<PatientInputData>({ initials: '', gender: '', dob: '' });
  
  const [formSchema, setFormSchema] = useState<any>(null);
  const [formUiSchema, setFormUiSchema] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [formTitle, setFormTitle] = useState('Data Submission');

  useEffect(() => {
    const loadFormList = async () => {
      setCurrentProcessStep('loadingFormList');
      setFormListError(null);
      try {
        const forms = await fetchAvailableForms();
        setAvailableForms(forms);
        setCurrentProcessStep('formSelection');
      } catch (error) {
        console.error("Error fetching available forms:", error);
        setFormListError("Failed to load the list of available forms. Please try again later.");
      }
    };
    loadFormList();
  }, []);

  const resetFormStateAndPatientInput = () => {
    setFormSchema(null);
    setFormUiSchema(null);
    setFormData({});
    setFormTitle('Data Submission');
    setSelectedFormKey(null);
    setSelectedFormDefinition(null);
    setPatientInputData({ initials: '', gender: '', dob: '' }); // Also reset patient input
  };
  
  const loadFormSchemas = async (formKey: string) => {
    const formDef = availableForms.find(f => f.key === formKey);
    if (!formDef) {
      console.error(`Form definition not found for key: ${formKey}`);
      alert(`Error: Could not find form definition for ${formKey}.`);
      setCurrentProcessStep('formSelection'); 
      return;
    }
    
    resetFormStateAndPatientInput(); // Reset everything before loading new form
    setSelectedFormKey(formKey); 
    setSelectedFormDefinition(formDef);
    setCurrentProcessStep('loadingSchema');

    try {
      const schemaModule = await import(/* @vite-ignore */ formDef.schemaPath);
      const uiSchemaModule = await import(/* @vite-ignore */ formDef.uiSchemaPath);
      
      const loadedSchema = schemaModule.default;
      const loadedUiSchema = uiSchemaModule.default;

      setFormSchema(loadedSchema);
      setFormUiSchema(loadedUiSchema);

      if (loadedSchema?.properties) {
        const keys = Object.keys(loadedSchema.properties);
        const initialData: { [key: string]: any } = {};
        keys.forEach(key => {
          const property = loadedSchema.properties[key];
          if (property?.default !== undefined) {
            initialData[key] = JSON.parse(JSON.stringify(property.default));
          } else if (property?.type === 'array') {
            initialData[key] = [];
          } else if (property?.type === 'object') {
            if (property.properties?.selectedDrugs !== undefined && property.properties?.drugValues !== undefined) {
              initialData[key] = { 
                selectedDrugs: property.properties.selectedDrugs.default !== undefined ? JSON.parse(JSON.stringify(property.properties.selectedDrugs.default)) : {},
                drugValues: property.properties.drugValues.default !== undefined ? JSON.parse(JSON.stringify(property.properties.drugValues.default)) : {}
              };
            } else {
              initialData[key] = {};
            }
          } else {
            initialData[key] = null; 
          }
        });
        setFormData(initialData);
        setFormTitle(loadedSchema.title || formDef.name);
        setCurrentProcessStep('fillingForm'); // Directly to filling form (patient input + form content)
      } else {
        throw new Error('Loaded schema is invalid or has no properties.');
      }
    } catch (error) {
      console.error(`Error loading schemas for ${formKey}:`, error);
      alert(`Error loading form '${formDef.name}'. Please try again or select a different form.`);
      resetFormStateAndPatientInput();
      setCurrentProcessStep('formSelection');
    } 
  };

  const handlePatientInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setPatientInputData(prev => ({ ...prev, [id]: value }));
  };

  const handleFormChange = (updatedData: any) => {
    setFormData(updatedData);
  };

  const handleSubmitForm = () => {
    if (!patientInputData.initials || !patientInputData.gender || !patientInputData.dob) {
      alert('Please fill in all patient details before submitting.');
      // Potentially scroll to patient input section or highlight fields
      return;
    }
    // Add any other form-level validation here if needed
    console.log("Submitting Form Data:", { 
      formKey: selectedFormKey, 
      formVersion: selectedFormDefinition?.version,
      patientInputData, 
      formData 
    });
    alert('Form submitted! Check console for data.');
    
    // Reset to form selection for a new submission
    resetFormStateAndPatientInput();
    setCurrentProcessStep('formSelection');
    // Optionally, re-fetch form list if it could change, for now just go to selection
    // const loadFormList = async () => { ... }; loadFormList();
  };

  const handleBackToFormSelection = () => {
    resetFormStateAndPatientInput();
    setCurrentProcessStep('formSelection');
  };

  // --- Render Logic based on currentProcessStep ---

  if (currentProcessStep === 'loadingFormList') {
    return (
      <SectionCard title="Loading Forms">
        <div className="flex justify-center items-center p-8 min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
          <p className="ml-4 text-slate-600 dark:text-slate-400 text-lg">Loading available forms...</p>
        </div>
      </SectionCard>
    );
  }

  if (formListError) {
    return (
      <SectionCard title="Error Loading Forms">
        <p className="text-red-500 dark:text-red-400 text-center p-8">{formListError}</p>
        <button 
            onClick={() => { 
                const loadFormList = async () => {
                  setCurrentProcessStep('loadingFormList');
                  setFormListError(null);
                  try {
                    const forms = await fetchAvailableForms();
                    setAvailableForms(forms);
                    setCurrentProcessStep('formSelection');
                  } catch (error) {
                    console.error("Error fetching available forms:", error);
                    setFormListError("Failed to load the list of available forms. Please try again later.");
                  }
                };
                loadFormList();
            }}
            className="mt-4 mx-auto block px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition-colors"
        >
            Retry Loading Forms
        </button>
      </SectionCard>
    );
  }
  
  if (currentProcessStep === 'formSelection') {
    return (
      <SectionCard title="Select a Form">
        <div className="space-y-3 max-w-md mx-auto">
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">Please choose which form you would like to fill out:</p>
          {availableForms.length === 0 && !formListError && (
            <p className="text-slate-500 dark:text-slate-400 text-center">No forms available at the moment.</p>
          )}
          {availableForms.map(formDef => (
            <button
              key={formDef.key}
              onClick={() => loadFormSchemas(formDef.key)}
              className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 focus:ring-opacity-75 flex justify-between items-center"
            >
              <span>{formDef.name}</span>
              <span className="text-xs bg-blue-400 dark:bg-blue-500 px-1.5 py-0.5 rounded">v{formDef.version}</span>
            </button>
          ))}
        </div>
      </SectionCard>
    );
  }
  
  if (currentProcessStep === 'loadingSchema') {
     return (
      <SectionCard title={`Loading ${selectedFormDefinition?.name || 'Form'}...`}>
        <div className="flex justify-center items-center p-8 min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
          <p className="ml-4 text-slate-600 dark:text-slate-400 text-lg">Preparing form...</p>
        </div>
      </SectionCard>
    );
  }

  if (currentProcessStep === 'fillingForm') {
    if (!formSchema || !formUiSchema) { // Check if schemas are loaded
      return (
        <SectionCard title="Error Processing Form">
          <p className="text-red-500 dark:text-red-400 text-center p-8">There was an issue preparing the form. Please try selecting the form again.</p>
           <button 
              onClick={handleBackToFormSelection}
              className="mt-4 mx-auto block px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition-colors"
          >
              Back to Form Selection
          </button>
        </SectionCard>
      );
    }

    return (
      <SectionCard title={`${selectedFormDefinition?.name || 'Form'} (v${selectedFormDefinition?.version || ''}) - Entry`}>
        {/* Patient Identification Section always on top */}
        <div className="mb-8 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/30">
            <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200 mb-3">Patient Identification</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                    label="Patient Initials" id="initials" type="text"
                    value={patientInputData.initials} onChange={handlePatientInputChange} required
                    className="mb-0 md:mb-0" // Adjust margin for grid layout
                />
                <InputField 
                    label="Gender" id="gender" type="text" placeholder="M / F / Other"
                    value={patientInputData.gender} onChange={handlePatientInputChange} required
                    className="mb-0 md:mb-0"
                />
                <InputField
                    label="Date of Birth" id="dob" type="date"
                    value={patientInputData.dob} onChange={handlePatientInputChange} required
                    className="mb-0 md:mb-0"
                />
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/60">
                 <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1">Project Consent (Placeholder)</p>
                 <label className="flex items-center space-x-2 text-sm text-slate-700 dark:text-slate-300">
                     <input type="checkbox" className="rounded dark:bg-slate-900 dark:border-slate-600 focus:ring-blue-500 dark:focus:ring-offset-slate-800" /> 
                     <span>I agree to the project terms and conditions.</span>
                 </label>
            </div>
        </div>

        {/* Dynamic Form Renderer for the entire form */}
        <DynamicFormRenderer
          schema={formSchema}
          uiSchema={formUiSchema}
          formData={formData}
          onFormDataChange={handleFormChange}
          // No currentStepIndex needed as DynamicFormRenderer renders the whole form
        />

        {/* Placeholder for Recontact Consent - only if applicable or last section */}
        <div className="mt-6 mb-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/30">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1">Recontact Consent (Placeholder)</p>
            <label className="flex items-center space-x-2 text-sm text-slate-700 dark:text-slate-300">
                <input type="checkbox" className="rounded dark:bg-slate-900 dark:border-slate-600 focus:ring-blue-500 dark:focus:ring-offset-slate-800" /> 
                <span>I agree to be recontacted for follow-up studies or information.</span>
            </label>
        </div>

        <div className="mt-8 flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-700">
          <button 
            onClick={handleBackToFormSelection} 
            className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-200 font-semibold rounded-md shadow-sm transition-colors"
          >
            Cancel & Select Different Form
          </button>
          <button 
            onClick={handleSubmitForm} 
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-md shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-70"
          >
            Submit Form Data
          </button>
        </div>
      </SectionCard>
    );
  }

  return <SectionCard title="Unexpected State"><p>An unexpected error occurred. Please refresh or select a form.</p></SectionCard>;
};

export default DataSubmissionPage; 