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
  | 'loadingFormSequence' // Combines previous resume and initial loading indication
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
  } = useSubmissionStore();

  // Local UI State
  const [currentProcessStep, setCurrentProcessStep] = useState<ProcessStep>('initialPatientInput');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFormLoading, setIsFormLoading] = useState(false); // <-- ADDED: Flag to prevent re-entrant loading
  
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
  const [isResuming, setIsResuming] = useState(false); // Local flag for resume flow

  // --- Effects --- 

  // Effect to set initial state based on store (e.g., on page load/refresh)
  useEffect(() => {
    if (isEncounterActive && storePatientData) {
      console.log("Store indicates active encounter. Patient:", storePatientData);
      setLocalPatientInput(storePatientData);
      setIsResuming(true); // Indicate that we should try to resume
      setCurrentProcessStep('loadingFormSequence'); 
    } else {
      setCurrentProcessStep('initialPatientInput');
      setIsResuming(false);
    }
  }, [isEncounterActive, storePatientData]); 

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
    setIsResuming(false);
  };
  
  const loadFormDefinition = useCallback(async (formIndexToLoad: number, sequenceToUse: FormDefinition[], allDataFromStore: { [key: string]: any }) => {
    if (formIndexToLoad < 0 || formIndexToLoad >= sequenceToUse.length) {
      setErrorMessage("Invalid form index.");
      setCurrentProcessStep('submissionError');
      return;
    }

    const formDef = sequenceToUse[formIndexToLoad];
    if (!formDef) {
      setErrorMessage(`Form definition not found for index: ${formIndexToLoad}`);
      setCurrentProcessStep('submissionError');
      return;
    }
    
    console.log(`loadFormDefinition: Loading schema for ${formDef.name} (index ${formIndexToLoad})`);
    setCurrentProcessStep('loadingFormSchema');
    setIsFormLoading(true); // <-- SET LOADING FLAG
    resetLocalUiStateForNewForm();

    try {
      const schemaModule = await import(/* @vite-ignore */ formDef.schemaPath);
      const uiSchemaModule = await import(/* @vite-ignore */ formDef.uiSchemaPath);
      const loadedSchema = schemaModule.default;
      const loadedUiSchema = uiSchemaModule.default;

      setCurrentFormSchema(loadedSchema);
      setCurrentFormUiSchema(loadedUiSchema);

      let initialDataForCurrentForm = allDataFromStore[formDef.key] || {};
      if (Object.keys(initialDataForCurrentForm).length === 0 && loadedSchema?.properties) {
         Object.keys(loadedSchema.properties).forEach(key => {
          const property = loadedSchema.properties[key];
          if (property?.default !== undefined) {
            initialDataForCurrentForm[key] = JSON.parse(JSON.stringify(property.default));
          } else if (property?.type === 'array') {
            initialDataForCurrentForm[key] = [];
          } else if (property?.type === 'object') {
             if (property.properties?.selectedDrugs !== undefined && property.properties?.drugValues !== undefined) {
              initialDataForCurrentForm[key] = { 
                selectedDrugs: property.properties.selectedDrugs.default !== undefined ? JSON.parse(JSON.stringify(property.properties.selectedDrugs.default)) : {},
                drugValues: property.properties.drugValues.default !== undefined ? JSON.parse(JSON.stringify(property.properties.drugValues.default)) : {}
              };
            } else {
              initialDataForCurrentForm[key] = {};
            }
          } 
        });
      }
      setCurrentFormData(initialDataForCurrentForm);
      setCurrentProcessStep('fillingFormInSequence');
    } catch (error) {
      console.error(`Error loading schemas for ${formDef.name}:`, error);
      setErrorMessage(`Error loading form '${formDef.name}'. Please try again.`);
      setCurrentProcessStep('submissionError');
    } finally {
      setIsFormLoading(false); // <-- RESET LOADING FLAG
    }
  }, []); 

  // Moved up to be defined before useEffect that uses it
  const handleStartSubmissionSequence = useCallback(async (resuming = false) => {
    if (!resuming) { 
      if (!localPatientInput.initials || !localPatientInput.gender || !localPatientInput.dob) {
        alert('Please fill in all patient identification details.');
        return;
      }
      if (!localPatientInput.projectConsent) {
        alert('Project consent is required to proceed.');
        return;
      }
    }
    
    console.log("handleStartSubmissionSequence called. Resuming:", resuming);
    setCurrentProcessStep('loadingFormSequence');
    setErrorMessage(null);
    try {
      const sequence = await fetchFormSequenceForEncounter();
      if (!resuming || (resuming && storeFormSequence.length === 0)) {
          console.log("Starting new encounter in store with fetched sequence.");
          startNewEncounter(localPatientInput, sequence);
          setIsResuming(false); 
      } else if (resuming && storeFormSequence.length > 0) {
          console.log("Resuming existing encounter; sequence already in store. Form loading will be triggered by useEffect.");
      }
    } catch (error) {
      console.error("Error fetching form sequence:", error);
      setErrorMessage("Failed to load the sequence of forms for submission.");
      setCurrentProcessStep('submissionError');
    }
  }, [localPatientInput, startNewEncounter, storeFormSequence.length]);


  // Effect to trigger form loading when the target form index or sequence changes in the store.
  useEffect(() => {
    if (isFormLoading) { 
      console.log("useEffect[formIndexChange]: Currently loading, skipping.");
      return;
    }

    if (isEncounterActive && storeFormSequence.length > 0 && storeCurrentFormIndex >= 0 && storeCurrentFormIndex < storeFormSequence.length) {
      console.log(`useEffect[formIndexChange]: storeCurrentFormIndex is ${storeCurrentFormIndex}.`);
      loadFormDefinition(storeCurrentFormIndex, storeFormSequence, storeAllFormsData);
    } else if (isEncounterActive && storeFormSequence.length === 0 && isResuming) {
        console.log("useEffect[formIndexChange]: Resuming, but no sequence in store. Attempting to fetch sequence.");
        handleStartSubmissionSequence(true); 
    }
  }, [isEncounterActive, storeCurrentFormIndex, storeFormSequence, loadFormDefinition, storeAllFormsData, isResuming, isFormLoading, handleStartSubmissionSequence]); 
  
  const handlePatientInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = event.target;
    const checked = (event.target as HTMLInputElement).checked;
    const updatedValue = type === 'checkbox' ? checked : value;
    setLocalPatientInput((prev: PatientInputData) => ({ ...prev, [id]: updatedValue as any }));
    updatePatientData({ [id]: updatedValue }); 
  };

  const handleCurrentFormChange = (updatedData: any) => {
    setCurrentFormData(updatedData);
  };

  const persistCurrentFormProgress = () => {
    if (storeFormSequence.length > 0 && storeCurrentFormIndex < storeFormSequence.length) {
      const currentFormKey = storeFormSequence[storeCurrentFormIndex].key;
      savePartialFormProgress(currentFormKey, { ...currentFormData });
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
      console.log("End of form sequence.");
      alert("You have reached the end of the form sequence. Review and Submit All Data.");
    }
  };

  const handleSaveAndExit = () => {
    persistCurrentFormProgress();
    alert('Progress Saved!');
    console.log("Save and Exit triggered. Data persisted to store.");
  };

  const handleSubmitAllData = () => {
    persistCurrentFormProgress(); 
    console.log("Submitting all form data:", storeAllFormsData, "for patient:", storePatientData);
    alert('All form data submitted successfully (Simulated)!');
    completeAndClearEncounter(); 
    resetEntirePageToStart(); 
  };

  const handleClearPersistedDataForDev = () => {
    clearPersistedSubmission();
    alert('Persisted submission data cleared. Please refresh.');
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
              <input id="projectConsent" name="projectConsent" type="checkbox" checked={localPatientInput.projectConsent} onChange={handlePatientInputChange} className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 mr-2" />
              <label htmlFor="projectConsent" className="form-label mb-0">I consent to this project's data usage terms.</label>
            </div>
            <div className="flex items-center">
              <input id="recontactConsent" name="recontactConsent" type="checkbox" checked={localPatientInput.recontactConsent} onChange={handlePatientInputChange} className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 mr-2" />
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
            disabled={currentProcessStep === 'loadingFormSequence' || !localPatientInput.initials || !localPatientInput.gender || !localPatientInput.dob || !localPatientInput.projectConsent}
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
              disabled={currentProcessStep === 'loadingFormSequence'}
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
    if (!storeFormSequence || storeFormSequence.length === 0 || storeCurrentFormIndex < 0 || storeCurrentFormIndex >= storeFormSequence.length) {
        return renderLoading("Preparing form display...");
    }
    const currentFormDef = storeFormSequence[storeCurrentFormIndex];
    if (!currentFormDef) return renderLoading("Form definition missing...");

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
        <div className="card-base card-body">
          {currentFormSchema && currentFormUiSchema ? (
            <DynamicFormRenderer
              schema={currentFormSchema}
              uiSchema={currentFormUiSchema}
              formData={currentFormData}
              onFormDataChange={handleCurrentFormChange}
            />
          ) : (
            renderLoading("Loading form contents...")
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
      content = renderInitialPatientInput();
      break;
    case 'loadingFormSequence':
    case 'loadingFormSchema': 
      content = renderLoading(currentProcessStep === 'loadingFormSequence' ? 'Loading form sequence...' : `Loading schema for ${storeFormSequence[storeCurrentFormIndex]?.name || 'form'}...`);
      break;
    case 'fillingFormInSequence':
      content = renderFormNavigation();
      break;
    case 'submissionError':
      content = renderError();
      break;
    default:
      const exhaustiveCheck: never = currentProcessStep;
      content = <p>Unknown submission state: {exhaustiveCheck}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <header className="mb-8">
        <h1 className="page-header">Clinical Data Submission</h1>
        <p className="page-subheader mt-1">Follow the steps to submit clinical data for a patient encounter.</p>
      </header>
      
      {content}

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