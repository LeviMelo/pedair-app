import React, { useState, useEffect, useCallback } from 'react';
import DynamicFormRenderer from '../components/forms/DynamicFormRenderer';
import InputField from '../components/ui/InputField';
import SectionCard from '../components/ui/SectionCard';
import Button from '../components/ui/Button';
import { FaSpinner, FaExclamationTriangle, FaArrowLeft, FaArrowRight, FaSave, FaPaperPlane, FaUndo, FaPlay, FaRedoAlt } from 'react-icons/fa';
import useSubmissionStore, { PatientInputData, FormDefinition, clearPersistedSubmission } from '../stores/submissionStore';

// --- Interfaces & Mock Data (some might be redundant if store types are comprehensive) ---
// Use StorePatientInputData and StoreFormDefinition directly where possible

// Mock data for a sequence of forms for a patient encounter - this could come from project config
const MOCK_FORM_SEQUENCE: FormDefinition[] = [
  { key: 'preanest', name: 'Formulário de Pré-Anestesia', version: '1.0.3', schemaPath: '../schemas/preAnestesia.schema.json', uiSchemaPath: '../schemas/preAnestesia.uiSchema.json' },
  { key: 'intraop', name: 'Formulário Intraoperatório', version: '1.1.1', schemaPath: '../schemas/intraoperatoria.schema.json', uiSchemaPath: '../schemas/intraoperatoria.uiSchema.json' },
  { key: 'recuperacao', name: 'Formulário de Recuperação Pós-Anestésica', version: '1.2.2', schemaPath: '../schemas/recuperacaoPosAnestesica.schema.json', uiSchemaPath: '../schemas/recuperacaoPosAnestesica.uiSchema.json' },
];

// Simulate fetching this sequence (e.g., based on project or protocol)
const fetchFormSequenceForEncounter = (): Promise<FormDefinition[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_FORM_SEQUENCE);
    }, 300);
  });
};

type ProcessStep =
  | 'initialPatientInput'
  | 'resumingEncounter' // New step for clarity during resume
  | 'loadingFormSequence'
  | 'loadingFormSchema'
  | 'fillingFormInSequence'
  | 'submissionError';

const DataSubmissionPage: React.FC = () => {
  // Zustand Store Integration
  const {
    isEncounterActive,
    patientData: storePatientData,
    formSequence: storeFormSequence,
    currentFormIndex: storeCurrentFormIndex,
    allFormsData: storeAllFormsData,
    startNewEncounter,
    savePartialFormProgress,
    setCurrentFormIndex,
    updatePatientData,
    completeAndClearEncounter,
    // resumeEncounter, // Not directly used, persist handles rehydration
  } = useSubmissionStore();

  // Local UI State
  const [currentProcessStep, setCurrentProcessStep] = useState<ProcessStep>('initialPatientInput');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Local state for the patient input form fields, synchronized with storePatientData
  const [localPatientInput, setLocalPatientInput] = useState<PatientInputData>({
    initials: '',
    gender: '',
    dob: '',
    projectConsent: false,
    recontactConsent: false,
  });

  // State for the currently active form being rendered by DynamicFormRenderer
  const [currentFormSchema, setCurrentFormSchema] = useState<any>(null);
  const [currentFormUiSchema, setCurrentFormUiSchema] = useState<any>(null);
  const [currentFormData, setCurrentFormData] = useState<any>({}); // Data for the *current* form being edited

  // --- Effects --- 

  // Effect to handle resuming an active encounter from the store
  useEffect(() => {
    if (isEncounterActive && storePatientData) {
      console.log("Resuming active encounter from store...", storePatientData, storeFormSequence, storeCurrentFormIndex);
      setLocalPatientInput(storePatientData); // Sync local input fields
      setCurrentProcessStep('resumingEncounter'); // Indicate we are resuming
      // Directly trigger form loading for the stored index
      if (storeFormSequence.length > 0 && storeCurrentFormIndex >= 0 && storeCurrentFormIndex < storeFormSequence.length) {
        // loadFormDefinition will be called by the other useEffect based on currentProcessStep and storeCurrentFormIndex
      } else if (storeFormSequence.length === 0 && storePatientData) {
        // Edge case: encounter started, patient data saved, but sequence not yet loaded/saved
        handleStartSubmissionSequence(true); // true indicates it's a resume attempt
      }
    } else {
        setCurrentProcessStep('initialPatientInput'); // Default if no active encounter
    }
  }, [isEncounterActive]); // Run only when isEncounterActive changes (e.g. on page load)

  const resetLocalUiStateForNewForm = () => {
    setCurrentFormSchema(null);
    setCurrentFormUiSchema(null);
    setCurrentFormData({}); 
    setErrorMessage(null);
  };

  const resetEntirePageToStart = () => {
    setCurrentProcessStep('initialPatientInput');
    setErrorMessage(null);
    setLocalPatientInput({ initials: '', gender: '', dob: '', projectConsent: false, recontactConsent: false });
    resetLocalUiStateForNewForm();
  };
  
  const loadFormDefinition = useCallback(async (formIndex: number, sequenceToUse: FormDefinition[], allData: { [key: string]: any }) => {
    if (formIndex < 0 || formIndex >= sequenceToUse.length) {
      setErrorMessage("Invalid form index.");
      setCurrentProcessStep('submissionError');
      return;
    }

    const formDef = sequenceToUse[formIndex];
    if (!formDef) {
      setErrorMessage(`Form definition not found for index: ${formIndex}`);
      setCurrentProcessStep('submissionError');
      return;
    }

    setCurrentProcessStep('loadingFormSchema');
    resetLocalUiStateForNewForm(); // Clear previous form state before loading new

    try {
      const schemaModule = await import(/* @vite-ignore */ formDef.schemaPath);
      const uiSchemaModule = await import(/* @vite-ignore */ formDef.uiSchemaPath);
      
      const loadedSchema = schemaModule.default;
      const loadedUiSchema = uiSchemaModule.default;

      setCurrentFormSchema(loadedSchema);
      setCurrentFormUiSchema(loadedUiSchema);

      let initialDataForCurrentForm = allData[formDef.key] || {};
      // Initialize with default values from schema if no data exists for this form yet
      if (Object.keys(initialDataForCurrentForm).length === 0 && loadedSchema?.properties) {
         Object.keys(loadedSchema.properties).forEach(key => {
          const property = loadedSchema.properties[key];
          if (property?.default !== undefined) {
            initialDataForCurrentForm[key] = JSON.parse(JSON.stringify(property.default));
          } else if (property?.type === 'array') {
            initialDataForCurrentForm[key] = [];
          } else if (property?.type === 'object') {
             // Special handling for DrugSectionWidget-like structures
             if (property.properties?.selectedDrugs !== undefined && property.properties?.drugValues !== undefined) {
              initialDataForCurrentForm[key] = { 
                selectedDrugs: property.properties.selectedDrugs.default !== undefined ? JSON.parse(JSON.stringify(property.properties.selectedDrugs.default)) : {},
                drugValues: property.properties.drugValues.default !== undefined ? JSON.parse(JSON.stringify(property.properties.drugValues.default)) : {}
              };
            } else {
              initialDataForCurrentForm[key] = {}; // Default for other objects
            }
          } 
          // Other types (string, number, boolean) will be empty/undefined by default if not specified
        });
      }
      setCurrentFormData(initialDataForCurrentForm);
      setCurrentProcessStep('fillingFormInSequence');

    } catch (error) {
      console.error(`Error loading schemas for ${formDef.name}:`, error);
      setErrorMessage(`Error loading form '${formDef.name}'. Please try again.`);
      setCurrentProcessStep('submissionError');
    }
  }, []);

  // Effect to load form definition when currentFormIndex from store changes OR when resuming
  useEffect(() => {
    if (currentProcessStep === 'fillingFormInSequence' || currentProcessStep === 'resumingEncounter') {
      if (storeFormSequence.length > 0 && storeCurrentFormIndex >=0 && storeCurrentFormIndex < storeFormSequence.length) {
        loadFormDefinition(storeCurrentFormIndex, storeFormSequence, storeAllFormsData);
      } 
    } else if (currentProcessStep === 'loadingFormSequence' && storeFormSequence.length > 0) {
        // This case handles after fetchFormSequenceForEncounter sets the sequence in store
        // and we need to load the first form (index 0)
        loadFormDefinition(0, storeFormSequence, storeAllFormsData);
    }
  }, [storeCurrentFormIndex, storeFormSequence, storeAllFormsData, loadFormDefinition, currentProcessStep]);
  
  const handlePatientInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = event.target;
    const checked = (event.target as HTMLInputElement).checked;
    const updatedValue = type === 'checkbox' ? checked : value;
    setLocalPatientInput((prev: PatientInputData) => ({ ...prev, [id]: updatedValue as any }));
    // Update store DEBOUNCED or on blur in a real app, for now, direct update:
    updatePatientData({ [id]: updatedValue }); 
  };

  const handleStartSubmissionSequence = async (isResumingFlow = false) => {
    if (!isResumingFlow) { 
      if (!localPatientInput.initials || !localPatientInput.gender || !localPatientInput.dob) {
        alert('Please fill in all patient identification details.');
        return;
      }
      if (!localPatientInput.projectConsent) {
        alert('Project consent is required to proceed.');
        return;
      }
    }

    setCurrentProcessStep('loadingFormSequence');
    setErrorMessage(null);
    try {
      const sequence = await fetchFormSequenceForEncounter();
      if (!isEncounterActive || !isResumingFlow || (isResumingFlow && storeFormSequence.length === 0) ) { 
          startNewEncounter(localPatientInput, sequence); // This will set patient data, sequence, index 0, and clear allFormsData
      } else if (isResumingFlow && storeFormSequence.length > 0) {
          // If resuming and sequence already exists in store, do nothing here, useEffect will load definition.
          // This branch might not be strictly needed if useEffect for resume is robust.
          console.log("Resuming flow, sequence already in store.");
      }
    } catch (error) {
      console.error("Error fetching form sequence:", error);
      setErrorMessage("Failed to load the sequence of forms for submission.");
      setCurrentProcessStep('submissionError');
    }
  };

  const handleCurrentFormChange = (updatedData: any) => {
    setCurrentFormData(updatedData);
  };

  const persistCurrentFormProgress = () => {
    if (storeFormSequence.length > 0 && storeCurrentFormIndex < storeFormSequence.length) {
      const currentFormKey = storeFormSequence[storeCurrentFormIndex].key;
      savePartialFormProgress(currentFormKey, { ...currentFormData }); // Save a copy
      console.log('Progress for', currentFormKey, 'saved to store');
    }
  };

  const handleNavigateForm = (direction: 'next' | 'previous') => {
    persistCurrentFormProgress(); 
    const newIndex = direction === 'next' 
      ? storeCurrentFormIndex + 1 
      : storeCurrentFormIndex - 1;

    if (newIndex >= 0 && newIndex < storeFormSequence.length) {
      setCurrentFormIndex(newIndex);
    } else if (direction === 'next' && newIndex >= storeFormSequence.length) {
      console.log("End of form sequence. Consider review or finalize step.");
      alert("You have reached the end of the form sequence. Review and Submit All Data.");
    }
  };

  const handleSaveAndExit = () => {
    persistCurrentFormProgress();
    alert('Progress Saved! You can close the page or navigate away.\n(Note: In a real app, this might navigate to a dashboard or show a persistent success message)');
    console.log("Save and Exit triggered. Data persisted to store.");
  };

  const handleSubmitAllData = () => {
    persistCurrentFormProgress(); 
    console.log("Submitting all form data:", storeAllFormsData, "for patient:", storePatientData);
    alert(
      'All form data submitted successfully (Simulated)!\n' + 
      `Patient: ${storePatientData?.initials}\n` + 
      `Total Forms: ${storeFormSequence.length}\n` +
      'Data: ' + JSON.stringify(storeAllFormsData, null, 2)
    );
    completeAndClearEncounter(); 
    resetEntirePageToStart(); 
  };

  const handleClearPersistedDataForDev = () => {
    clearPersistedSubmission();
    alert('Persisted submission data has been cleared from localStorage. Please refresh the page.');
    resetEntirePageToStart(); 
  };

  // --- RENDER FUNCTIONS FOR EACH STEP ---
  const renderInitialPatientInput = () => (
    <SectionCard title="Step 1: Patient Identification & Consent">
      <div className="space-y-4">
        <InputField label="Patient Initials" id="initials" type="text" value={localPatientInput.initials} onChange={handlePatientInputChange} required />
        <InputField label="Gender" id="gender" type="text" value={localPatientInput.gender} onChange={handlePatientInputChange} required />
        <InputField label="Date of Birth" id="dob" type="date" value={localPatientInput.dob} onChange={handlePatientInputChange} required />
        <div className="form-field pt-2">
          <label className="form-label">Consent</label>
          <div className="space-y-2 mt-1">
            <div className="flex items-center">
              <input id="projectConsent" type="checkbox" checked={localPatientInput.projectConsent} onChange={handlePatientInputChange} className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 mr-2" />
              <label htmlFor="projectConsent" className="form-label mb-0">I consent to this project's data usage terms.</label>
            </div>
            <div className="flex items-center">
              <input id="recontactConsent" type="checkbox" checked={localPatientInput.recontactConsent} onChange={handlePatientInputChange} className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 mr-2" />
              <label htmlFor="recontactConsent" className="form-label mb-0">I consent to be recontacted for follow-up.</label>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button 
            variant="primary" 
            onClick={() => handleStartSubmissionSequence(false)} 
            iconLeft={<FaPlay />} 
            fullWidth 
            className="sm:flex-1"
            disabled={!localPatientInput.initials || !localPatientInput.gender || !localPatientInput.dob || !localPatientInput.projectConsent}
          >
            Start New Submission
          </Button>
          {isEncounterActive && (
            <Button 
              variant="outline-slate" 
              onClick={() => handleStartSubmissionSequence(true)} 
              iconLeft={<FaRedoAlt />} 
              fullWidth 
              className="sm:flex-1"
            >
              Resume Last Encounter
            </Button>
          )}
        </div>
      </div>
    </SectionCard>
  );

  const renderLoading = (message: string) => (
    <SectionCard title="Loading...">
      <div className="flex flex-col items-center justify-center p-8 text-slate-600 dark:text-slate-400">
        <FaSpinner className="animate-spin text-4xl mb-3" />
        <p className="text-lg">{message}</p>
      </div>
    </SectionCard>
  );

  const renderError = () => (
    <SectionCard title="Error">
      <div className="flex flex-col items-center justify-center p-8 text-red-600 dark:text-red-400">
        <FaExclamationTriangle className="text-4xl mb-3" />
        <p className="text-lg font-semibold">An Error Occurred</p>
        <p className="text-center mb-4">{errorMessage || "Something went wrong."}</p>
        <Button variant="outline-primary" onClick={resetEntirePageToStart} iconLeft={<FaUndo />}>
          Start Over
        </Button>
      </div>
    </SectionCard>
  );

  const renderFormNavigation = () => {
    const currentFormDef = storeFormSequence[storeCurrentFormIndex];
    if (!currentFormDef) return null;

    return (
      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
        <div className="flex justify-between items-center mb-2">
            <h3 className="card-title">
                Form: {currentFormDef.name} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">(v{currentFormDef.version})</span>
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Form {storeCurrentFormIndex + 1} of {storeFormSequence.length}
            </p>
        </div>
        {/* Apply card-base and card-body to the DynamicFormRenderer container */}
        <div className="card-base card-body">
          {currentFormSchema && currentFormUiSchema ? (
            <DynamicFormRenderer
              schema={currentFormSchema}
              uiSchema={currentFormUiSchema}
              formData={currentFormData}
              onFormDataChange={handleCurrentFormChange}
            />
          ) : (
            renderLoading("Loading form contents...") // Re-use loading component
          )}
        </div>
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <Button 
            variant="outline-slate" 
            onClick={() => handleNavigateForm('previous')} 
            disabled={storeCurrentFormIndex === 0}
            iconLeft={<FaArrowLeft />}
          >
            Previous Form
          </Button>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <Button variant="secondary" onClick={handleSaveAndExit} iconLeft={<FaSave />}>
              Save Progress & Exit
            </Button>
            {storeCurrentFormIndex === storeFormSequence.length - 1 ? (
              <Button variant="success" onClick={handleSubmitAllData} iconLeft={<FaPaperPlane />}>
                Submit All Data
              </Button>
            ) : (
              <Button variant="primary" onClick={() => handleNavigateForm('next')} iconLeft={<FaArrowRight />}>
                Next Form
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  // Main Page Return Logic
  let content;
  switch (currentProcessStep) {
    case 'initialPatientInput':
    case 'resumingEncounter': // Also use patient input for resuming, it will show resume button if active
      content = renderInitialPatientInput();
      break;
    case 'loadingFormSequence':
      content = renderLoading('Loading form sequence...');
      break;
    case 'loadingFormSchema':
      content = renderLoading(`Loading schema for ${storeFormSequence[storeCurrentFormIndex]?.name || 'form'}...`);
      break;
    case 'fillingFormInSequence':
      content = renderFormNavigation();
      break;
    case 'submissionError':
      content = renderError();
      break;
    default:
      content = <p>Unknown submission state.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {/* Page Header */}
      <header className="mb-8">
        <h1 className="page-header">Clinical Data Submission</h1>
        <p className="page-subheader mt-1">Follow the steps to submit clinical data for a patient encounter.</p>
      </header>
      
      {content}

      {/* Developer Utility: Clear Persisted Data */}
      {import.meta.env.DEV && (
        <div className="mt-10 pt-6 border-t border-dashed border-slate-300 dark:border-slate-700">
          <SectionCard title="Developer Utilities">
            <div className="flex flex-col items-start gap-2">
                <p className="text-sm text-slate-500 dark:text-slate-400">Current process step: <code className="bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-xs">{currentProcessStep}</code></p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Store active: <code className="bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-xs">{isEncounterActive ? 'Yes' : 'No'}</code></p>
                <Button variant="warning" size="sm" onClick={handleClearPersistedDataForDev} iconLeft={<FaUndo />}>
                    Clear Persisted Submission Data (Dev)
                </Button>
            </div>
          </SectionCard>
        </div>
      )}
    </div>
  );
};

export default DataSubmissionPage; 