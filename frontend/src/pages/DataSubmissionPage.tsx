import React, { useState, useEffect, useCallback } from 'react';
import DynamicFormRenderer from '../components/forms/DynamicFormRenderer';
import InputField from '../components/ui/InputField';
import SectionCard from '../components/ui/SectionCard';
import Button from '../components/ui/Button';
import { FaSpinner, FaExclamationTriangle, FaArrowLeft, FaArrowRight, FaSave, FaPaperPlane, FaUndo, FaPlay, FaRedoAlt, FaUserEdit, FaClipboardCheck, FaEye, FaFileMedical, FaCheckCircle, FaEllipsisH } from 'react-icons/fa';
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
  | 'reviewAndSubmit'
  | 'submissionError';

// Helper component for Stepper UI
const SubmissionStepper: React.FC<{
  currentOverallStep: ProcessStep;
  currentFormIndexInSequence: number; // from store
  formSequence: FormDefinition[]; // from store
  patientInputComplete: boolean; // derived from localPatientInput
}> = ({ currentOverallStep, currentFormIndexInSequence, formSequence, patientInputComplete }) => {
  
  const getStepStatus = (
    stepKey: string, 
    currentKey: string 
  ): 'completed' | 'current' | 'upcoming' => {
    const stepsOrder = ['patientInput', ...(formSequence || []).map(f => f.key), 'review'];
    const currentIndex = stepsOrder.indexOf(currentKey);
    const stepIndex = stepsOrder.indexOf(stepKey);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  let activeDisplayStepKey = 'patientInput';
  if (currentOverallStep === 'fillingFormInSequence' && formSequence && formSequence.length > 0 && formSequence[currentFormIndexInSequence]) {
    activeDisplayStepKey = formSequence[currentFormIndexInSequence].key;
  } else if (currentOverallStep === 'reviewAndSubmit') {
    activeDisplayStepKey = 'review';
  } else if (
    currentOverallStep === 'initialPatientInput' || 
    (currentOverallStep === 'loadingFormSequence' && !patientInputComplete) || 
    (currentOverallStep === 'loadingFormSchema' && !patientInputComplete && (!formSequence || formSequence.length === 0))
  ) {
    activeDisplayStepKey = 'patientInput';
  }

  const stepsToDisplay = [
    { key: 'patientInput', label: 'Patient Info & Consent', icon: FaUserEdit },
    ...(formSequence || []).map(formDef => ({ key: formDef.key, label: formDef.name, icon: FaFileMedical })),
    { key: 'review', label: 'Review & Submit', icon: FaEye }
  ];

  const getListItemClassName = (status: 'completed' | 'current' | 'upcoming', isLastStep: boolean): string => {
    let baseClasses = 'flex md:w-full items-center';
    if (status === 'current') baseClasses += ' text-blue-600 dark:text-blue-400';
    if (status === 'completed') baseClasses += ' text-green-600 dark:text-green-400';
    if (!isLastStep) {
      baseClasses += " sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-slate-200 dark:after:border-slate-700 after:border-1 sm:after:inline-block after:mx-2 xl:after:mx-4";
    }
    return baseClasses;
  };

  const getIconContainerClassName = (isLastStep: boolean): string => {
    let baseClasses = 'flex items-center shrink-0';
    if (!isLastStep) {
      baseClasses += ' sm:after:hidden';
    }
    return baseClasses;
  };

  return (
    <div className="mb-8 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg shadow print:hidden">
      <ol className="flex items-center w-full text-sm font-medium text-center text-slate-500 dark:text-slate-400 sm:text-base">
        {stepsToDisplay.map((step, index) => {
          const status = getStepStatus(step.key, activeDisplayStepKey);
          const IconComponent = step.icon;
          const isLastStep = index === stepsToDisplay.length - 1;

          return (
            <li
              key={step.key}
              className={getListItemClassName(status, isLastStep)}
            >
              <span className={getIconContainerClassName(isLastStep)}>
                {status === 'completed' ? (
                  <FaCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                ) : status === 'current' ? (
                  <FaEllipsisH className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 animate-pulse" />
                ) : (
                  <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 opacity-70" />
                )}
                <span className="hidden sm:inline-block whitespace-nowrap">{step.label}</span>
                <span className="sm:hidden whitespace-nowrap text-xs">{step.label.length > 15 ? step.label.substring(0,12) + '...' : step.label}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

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
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [currentlyLoadedFormKey, setCurrentlyLoadedFormKey] = useState<string | null>(null);
  
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

  // Helper to check if initial patient mandatory fields are filled
  const isPatientInputDataComplete = useCallback(() => {
    return !!(localPatientInput.initials && localPatientInput.gender && localPatientInput.dob && localPatientInput.projectConsent);
  }, [localPatientInput]);

  // --- Effects --- 

  // Effect to set initial state based on store (e.g., on page load/refresh)
  useEffect(() => {
    if (isEncounterActive && storePatientData) {
      console.log("Store indicates active encounter. Patient:", storePatientData);
      setLocalPatientInput(storePatientData);
      setIsResuming(true);
      // If patient data is complete, move to loading sequence, otherwise stay on input page to complete it
      if (storePatientData.initials && storePatientData.gender && storePatientData.dob && storePatientData.projectConsent) {
        setCurrentProcessStep('loadingFormSequence'); 
      } else {
        setCurrentProcessStep('initialPatientInput');
      }
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
    setCurrentlyLoadedFormKey(null);
  };
  
  const loadFormDefinition = useCallback(async (formIndexToLoad: number, sequenceToUse: FormDefinition[], allDataFromStore: { [key: string]: any }) => {
    if (formIndexToLoad < 0 || formIndexToLoad >= sequenceToUse.length) {
      // This condition means we've completed all forms in the sequence
      if (formIndexToLoad >= sequenceToUse.length && sequenceToUse.length > 0) {
        console.log("All forms in sequence completed. Moving to review step.");
        setCurrentProcessStep('reviewAndSubmit');
        setIsFormLoading(false); // Ensure loading is false
        setCurrentlyLoadedFormKey(null); // No single form is "current" on review page
        resetLocalUiStateForNewForm(); // Clear any single form schema/data
        return;
      }
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
    setIsFormLoading(true);
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
      setCurrentlyLoadedFormKey(formDef.key);
    } catch (error) {
      console.error(`Error loading schemas for ${formDef.name}:`, error);
      setErrorMessage(`Error loading form '${formDef.name}'. Please try again.`);
      setCurrentProcessStep('submissionError');
      setCurrentlyLoadedFormKey(null);
    } finally {
      setIsFormLoading(false);
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
      // Persist localPatientInput to store immediately when starting
      updatePatientData(localPatientInput);
    }
    
    console.log("handleStartSubmissionSequence called. Resuming:", resuming);
    setCurrentlyLoadedFormKey(null);
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
      console.log("useEffect[formLoadTrigger]: Form is currently loading, skipping.");
      return;
    }

    if (isEncounterActive && storeFormSequence.length > 0 && storeCurrentFormIndex >= 0 && storeCurrentFormIndex < storeFormSequence.length) {
      const targetFormKey = storeFormSequence[storeCurrentFormIndex].key;
      if (targetFormKey === currentlyLoadedFormKey) {
        console.log(`useEffect[formLoadTrigger]: Form ${targetFormKey} (index ${storeCurrentFormIndex}) is already marked as loaded. Ensuring correct step.`);
        if(currentProcessStep !== 'fillingFormInSequence' && currentProcessStep !== 'loadingFormSchema') {
             setCurrentProcessStep('fillingFormInSequence');
        }
        return;
      }
      
      console.log(`useEffect[formLoadTrigger]: Target form key ${targetFormKey} (index ${storeCurrentFormIndex}) is different from loaded key ${currentlyLoadedFormKey}. Attempting load.`);
      loadFormDefinition(storeCurrentFormIndex, storeFormSequence, storeAllFormsData);
    } else if (isEncounterActive && storeFormSequence.length === 0 && isResuming) {
        console.log("useEffect[formLoadTrigger]: Resuming, but no sequence in store. Attempting to fetch sequence.");
        setCurrentlyLoadedFormKey(null);
        handleStartSubmissionSequence(true); 
    } else {
      if (currentlyLoadedFormKey !== null) {
        setCurrentlyLoadedFormKey(null);
      }
    }
  }, [
    isEncounterActive, 
    storeCurrentFormIndex, 
    storeFormSequence, 
    storeAllFormsData, 
    isResuming, 
    isFormLoading, 
    handleStartSubmissionSequence,
    loadFormDefinition,
    currentlyLoadedFormKey,
    currentProcessStep
  ]); 
  
  const handlePatientInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = event.target;
    const checked = type === 'checkbox' ? (event.target as HTMLInputElement).checked : undefined;

    setLocalPatientInput(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));
    // We will call updatePatientData explicitly when moving away from this step or resuming
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

    if (direction === 'next') {
      const nextIndex = storeCurrentFormIndex + 1;
      // The loadFormDefinition function will handle transitioning to 'reviewAndSubmit'
      // if nextIndex >= storeFormSequence.length.
      // So, we just update the index here.
      if (storeFormSequence && storeFormSequence.length > 0) { 
        setCurrentFormIndex(nextIndex);
      } else {
        setCurrentProcessStep('reviewAndSubmit'); 
      }
    } else { // direction === 'previous'
      if (storeCurrentFormIndex > 0) {
        setCurrentFormIndex(storeCurrentFormIndex - 1);
      } else {
        // At the first form, navigating previous goes back to patient input
        setCurrentProcessStep('initialPatientInput');
        setCurrentlyLoadedFormKey(null); 
        resetLocalUiStateForNewForm(); 
      }
    }
  };

  const handleSaveAndExit = () => {
    persistCurrentFormProgress();
    alert('Progress Saved!');
    console.log("Save and Exit triggered. Data persisted to store.");
  };

  const handleSubmitAllData = () => {
    persistCurrentFormProgress(); // Ensure last form's data is saved to store
    console.log("Submitting all data for encounter...");
    console.log("Patient Data:", storePatientData);
    console.log("Forms Data:", storeAllFormsData);
    alert("Encounter data submitted (mock)! Check console. Clearing encounter state.");
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
    <SectionCard title="Patient Identification & Consent">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200 mb-3">Patient Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              label="Patient Initials"
              id="initials"
              type="text"
              placeholder="e.g., JS"
              value={localPatientInput.initials || ''} 
              onChange={handlePatientInputChange}
              required
            />
            <InputField
              label="Gender"
              id="gender" 
              type="text" 
              placeholder="e.g., M or F"
              value={localPatientInput.gender || ''} 
              onChange={handlePatientInputChange}
              required
            />
            <InputField
              label="Date of Birth"
              id="dob"
              type="date"
              value={localPatientInput.dob || ''} 
              onChange={handlePatientInputChange}
              required
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200 mb-3">Consent Information</h3>
          <div className="space-y-3 bg-slate-50 dark:bg-slate-700/30 p-4 rounded-md border border-slate-200 dark:border-slate-600">
            <div className="flex items-start">
              <input
                id="projectConsent"
                type="checkbox"
                checked={localPatientInput.projectConsent || false} 
                onChange={handlePatientInputChange}
                className="h-5 w-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 dark:bg-slate-700 dark:border-slate-600 mt-0.5 shrink-0"
              />
              <label htmlFor="projectConsent" className="ml-2.5 text-sm text-slate-700 dark:text-slate-200">
                I confirm that project-specific consent has been obtained from the patient/guardian for participation in this study and data collection as per protocol <span className="font-semibold">[Project Name/ID Placeholder]</span>.
                <span className="text-red-500 ml-1">*</span>
              </label>
            </div>
            <div className="flex items-start">
              <input
                id="recontactConsent"
                type="checkbox"
                checked={localPatientInput.recontactConsent || false} 
                onChange={handlePatientInputChange}
                className="h-5 w-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 dark:bg-slate-700 dark:border-slate-600 mt-0.5 shrink-0"
              />
              <label htmlFor="recontactConsent" className="ml-2.5 text-sm text-slate-700 dark:text-slate-200">
                Patient/guardian consents to potential re-contact for follow-up information or future related studies, if applicable.
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button 
            variant="outline-slate" 
            onClick={resetEntirePageToStart} 
            iconLeft={<FaUndo />}
            disabled={isFormLoading || currentProcessStep === 'loadingFormSequence'}
          >
            Cancel & Reset
          </Button>
          <Button 
            variant="primary" 
            onClick={() => handleStartSubmissionSequence(isResuming && isEncounterActive)} 
            iconRight={<FaArrowRight />}
            isLoading={isFormLoading || currentProcessStep === 'loadingFormSequence'}
            disabled={!isPatientInputDataComplete()}
          >
            {isResuming && isEncounterActive ? 'Resume Encounter' : 'Start Data Collection'}
          </Button>
        </div>
      </div>
    </SectionCard>
  );

  const renderLoading = (message: string) => (
    <div className="flex flex-col items-center justify-center p-10 bg-white dark:bg-slate-800 rounded-lg shadow-md min-h-[300px]">
      <FaSpinner className="animate-spin text-4xl text-blue-500 mb-4" />
      <p className="text-slate-600 dark:text-slate-300">{message}</p>
    </div>
  );

  const renderError = () => (
    <SectionCard title="Error">
      <div className="flex flex-col items-center justify-center p-6">
        <FaExclamationTriangle className="text-5xl text-red-500 mb-4" />
        <p className="text-red-600 dark:text-red-400 text-center mb-4">{errorMessage || "An unexpected error occurred."}</p>
        <Button variant="outline-primary" onClick={resetEntirePageToStart} iconLeft={<FaRedoAlt />}>
          Try Again from Start
        </Button>
      </div>
    </SectionCard>
  );

  const renderFormNavigation = () => {
    const currentFormDef = storeFormSequence && storeFormSequence.length > storeCurrentFormIndex && storeCurrentFormIndex >= 0 ? storeFormSequence[storeCurrentFormIndex] : null;
    const isLastForm = storeFormSequence && storeFormSequence.length > 0 ? storeCurrentFormIndex === storeFormSequence.length - 1 : false;

    return (
      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 print:hidden">
        <Button 
          variant="outline-slate" 
          onClick={() => handleNavigateForm('previous')} 
          iconLeft={<FaArrowLeft />}
          disabled={isFormLoading || (storeCurrentFormIndex === 0 && currentProcessStep === 'fillingFormInSequence')}
        >
          {storeCurrentFormIndex === 0 ? 'Back to Patient Info' : 'Previous Form'}
        </Button>
        
        <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-500 dark:text-slate-400">
                Form {storeCurrentFormIndex + 1} of {storeFormSequence.length}: {currentFormDef?.name || 'N/A'}
            </span>
        </div>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <Button 
            variant="ghost" 
            onClick={handleSaveAndExit} 
            iconLeft={<FaSave />}
            disabled={isFormLoading}
            className="text-slate-600 dark:text-slate-300"
          >
            Save & Exit (Later)
          </Button>
          <Button 
            variant="primary" 
            onClick={() => handleNavigateForm('next')} 
            iconRight={<FaArrowRight />}
            isLoading={isFormLoading}
          >
            {isLastForm ? 'Proceed to Review' : 'Next Form'}
          </Button>
        </div>
      </div>
    );
  };
  
  const renderFillingFormInSequence = () => {
    if (!currentFormSchema || !currentFormUiSchema) {
      return renderLoading("Preparing form...");
    }
    const currentFormDef = storeFormSequence && storeFormSequence.length > storeCurrentFormIndex && storeCurrentFormIndex >=0 ? storeFormSequence[storeCurrentFormIndex] : null;

    return (
      <SectionCard title={currentFormDef?.name || "Data Form"} className="animation-fade-in">
        <DynamicFormRenderer
          schema={currentFormSchema}
          uiSchema={currentFormUiSchema}
          formData={currentFormData}
          onFormDataChange={handleCurrentFormChange}
        />
        {renderFormNavigation()}
      </SectionCard>
    );
  };

  const renderReviewAndSubmit = () => {
    return (
      <SectionCard title="Review Encounter Data" className="animation-fade-in">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2 border-b pb-1">Patient Information</h3>
            <pre className="text-xs bg-slate-100 dark:bg-slate-700 p-3 rounded overflow-x-auto">
              {JSON.stringify(storePatientData || {message: "Patient data not available."}, null, 2)}
            </pre>
          </div>

          {(storeFormSequence || []).map(formDef => (
            <div key={formDef.key}>
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2 border-b pb-1">{formDef.name} (v{formDef.version})</h3>
              <pre className="text-xs bg-slate-100 dark:bg-slate-700 p-3 rounded overflow-x-auto">
                {JSON.stringify(storeAllFormsData[formDef.key] || {message: "No data recorded for this form."}, null, 2)}
              </pre>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
           <Button 
            variant="outline-slate" 
            onClick={() => {
                if (storeFormSequence && storeFormSequence.length > 0) {
                    setCurrentFormIndex(storeFormSequence.length - 1);
                } else {
                    setCurrentProcessStep('initialPatientInput'); 
                }
            }} 
            iconLeft={<FaArrowLeft />}
            disabled={isFormLoading || !storeFormSequence || storeFormSequence.length === 0}
          >
            Back to Edit Last Form
          </Button>
          <Button 
            variant="success" 
            onClick={handleSubmitAllData} 
            iconLeft={<FaPaperPlane />}
            isLoading={isFormLoading} 
          >
            Confirm & Submit All Data
          </Button>
        </div>
      </SectionCard>
    );
  };


  // Main Render Logic
  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20 dark:from-slate-900 dark:via-emerald-950/20 dark:to-slate-900">
      {/* Enhanced Colorful Page Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white via-emerald-50/50 to-teal-50/30 dark:from-slate-800 dark:via-slate-700/80 dark:to-slate-800 border-b-2 border-emerald-200/60 dark:border-emerald-800/30 shadow-xl mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-cyan-500/10 dark:from-emerald-500/5 dark:via-teal-500/3 dark:to-cyan-500/5"></div>
        <div className="absolute -top-1/2 -right-1/4 w-1/2 h-full bg-gradient-to-l from-white/20 to-transparent dark:from-slate-700/20 rounded-full transform rotate-12"></div>
        <div className="relative z-10 px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
              <FaFileMedical className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Data Submission
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-lg">
            Collect and submit clinical research data for your active project
          </p>
        </div>
      </div>
      
      <div className="p-4 sm:p-6 space-y-4">
      { (currentProcessStep === 'initialPatientInput' || 
         currentProcessStep === 'fillingFormInSequence' || 
         currentProcessStep === 'reviewAndSubmit' ||
         (currentProcessStep === 'loadingFormSequence' && isPatientInputDataComplete()) ||
         (currentProcessStep === 'loadingFormSchema' && isPatientInputDataComplete() && storeFormSequence && storeFormSequence.length > 0)
        ) && (
        <SubmissionStepper 
          currentOverallStep={currentProcessStep}
          currentFormIndexInSequence={storeCurrentFormIndex}
          formSequence={storeFormSequence}
          patientInputComplete={isPatientInputDataComplete()}
        />
      )}

      {currentProcessStep === 'initialPatientInput' && renderInitialPatientInput()}
      {currentProcessStep === 'loadingFormSequence' && renderLoading("Loading submission sequence...")}
      {currentProcessStep === 'loadingFormSchema' && renderLoading("Loading form definition...")}
      {currentProcessStep === 'fillingFormInSequence' && renderFillingFormInSequence()}
      {currentProcessStep === 'reviewAndSubmit' && renderReviewAndSubmit()}
      {currentProcessStep === 'submissionError' && renderError()}
      
       <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-md print:hidden">
        <p className="text-sm text-amber-700 dark:text-amber-300 font-semibold mb-2">Developer Tools:</p>
        <Button variant="warning" size="sm" onClick={handleClearPersistedDataForDev}>
          Clear Persisted Encounter Data (Dev Only)
        </Button>
      </div>
    </div>
  );
};

export default DataSubmissionPage; 