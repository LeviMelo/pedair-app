import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// --- Interfaces (should match those in DataSubmissionPage.tsx or be imported) ---
export interface PatientInputData {
  initials: string;
  gender: string;
  dob: string; // YYYY-MM-DD
  projectConsent: boolean;
  recontactConsent: boolean;
}

export interface FormDefinition {
  key: string; 
  name: string;
  version: string;
  schemaPath: string;
  uiSchemaPath: string;
}

interface SubmissionState {
  // State of an active or paused submission encounter
  isEncounterActive: boolean;
  patientData: PatientInputData | null;
  formSequence: FormDefinition[];
  currentFormIndex: number; // Index in the formSequence
  allFormsData: { [formKey: string]: any }; // Data for all forms in the sequence, keyed by formDef.key
  lastUpdateTimestamp: number | null;
}

interface SubmissionActions {
  startNewEncounter: (patientData: PatientInputData, sequence: FormDefinition[]) => void;
  savePartialFormProgress: (formKey: string, data: any) => void;
  setCurrentFormIndex: (index: number) => void;
  updatePatientData: (patientData: Partial<PatientInputData>) => void;
  completeAndClearEncounter: () => void; // Called after successful backend submission
  resumeEncounter: (encounterState: SubmissionState) => void; // To load a paused encounter
  // Could add actions for updating a specific form's data, etc.
}

const initialPatientData: PatientInputData = {
  initials: '',
  gender: '',
  dob: '',
  projectConsent: false,
  recontactConsent: false,
};

const initialSubmissionState: SubmissionState = {
  isEncounterActive: false,
  patientData: null, 
  formSequence: [],
  currentFormIndex: 0,
  allFormsData: {},
  lastUpdateTimestamp: null,
};

// Create the store with persistence middleware
const useSubmissionStore = create<SubmissionState & SubmissionActions>()(
  persist(
    (set, get) => ({
      ...initialSubmissionState,

      startNewEncounter: (patientData, sequence) => {
        set({
          isEncounterActive: true,
          patientData: { ...patientData }, 
          formSequence: [...sequence],
          currentFormIndex: 0,
          allFormsData: {}, // Reset data for new encounter
          lastUpdateTimestamp: Date.now(),
        });
        console.log('New submission encounter started:', get());
      },

      savePartialFormProgress: (formKey, data) => {
        set(state => ({
          allFormsData: {
            ...state.allFormsData,
            [formKey]: data,
          },
          lastUpdateTimestamp: Date.now(),
        }));
        console.log('Form progress saved:', formKey, data, get().allFormsData);
      },

      setCurrentFormIndex: (index) => {
        if (index >= 0 && index < get().formSequence.length) {
          set({ currentFormIndex: index, lastUpdateTimestamp: Date.now() });
        } else {
          console.warn('Attempted to set invalid form index:', index);
        }
      },
      
      updatePatientData: (updatedPatientData) => {
        set(state => ({
            patientData: state.patientData ? { ...state.patientData, ...updatedPatientData } : null,
            lastUpdateTimestamp: Date.now(),
        }));
      },

      completeAndClearEncounter: () => {
        set({ ...initialSubmissionState }); // Reset to initial empty state
        console.log('Submission encounter completed and cleared.');
      },
      
      resumeEncounter: (encounterState) => {
        set({ ...encounterState, isEncounterActive: true }); // Ensure it's marked active
        console.log('Submission encounter resumed:', encounterState);
      },
    }),
    {
      name: 'pedair-submission-storage', // name of the item in storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) => ({
        // Persist only these parts of the state to avoid storing functions or very large non-serializable objects
        isEncounterActive: state.isEncounterActive,
        patientData: state.patientData,
        formSequence: state.formSequence,
        currentFormIndex: state.currentFormIndex,
        allFormsData: state.allFormsData,
        lastUpdateTimestamp: state.lastUpdateTimestamp,
      }),
    }
  )
);

export const clearPersistedSubmission = () => {
    useSubmissionStore.persist.clearStorage(); // Clears from localStorage
    // Reset the in-memory state to initial values. 
    // Actions are part of the store definition and remain.
    useSubmissionStore.setState(initialSubmissionState);
    console.log('Persisted submission data cleared and store reset to initial values.');
}

export default useSubmissionStore; 