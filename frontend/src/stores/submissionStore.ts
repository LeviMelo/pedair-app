// src/stores/submissionStore.ts
// FIX: Corrected logic in updatePatientData to handle initial null state gracefully.

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// --- Interfaces ---
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
  isEncounterActive: boolean;
  patientData: PatientInputData | null;
  formSequence: FormDefinition[];
  currentFormIndex: number; // -1: patient input, 0 to n-1: forms, n: review
  allFormsData: { [formKey: string]: any };
  lastUpdateTimestamp: number | null;
}

interface SubmissionActions {
  startNewEncounter: (patientData: PatientInputData, sequence: FormDefinition[]) => void;
  saveCurrentForm: (formKey: string, data: any) => void;
  setCurrentFormIndex: (index: number) => void;
  updatePatientData: (patientData: Partial<PatientInputData>) => void;
  completeAndClearEncounter: () => void;
}

const initialPatientState: PatientInputData = {
    initials: '',
    gender: '',
    dob: '',
    projectConsent: false,
    recontactConsent: false,
}

const initialState: SubmissionState = {
  isEncounterActive: false,
  patientData: null,
  formSequence: [],
  currentFormIndex: -1, // -1 means we are at the patient input stage
  allFormsData: {},
  lastUpdateTimestamp: null,
};

const useSubmissionStore = create<SubmissionState & SubmissionActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      startNewEncounter: (patientData, sequence) => {
        set({
          isEncounterActive: true,
          patientData: { ...patientData },
          formSequence: [...sequence],
          currentFormIndex: 0,
          allFormsData: {},
          lastUpdateTimestamp: Date.now(),
        });
      },

      saveCurrentForm: (formKey, data) => {
        set(state => ({
          allFormsData: { ...state.allFormsData, [formKey]: data },
          lastUpdateTimestamp: Date.now(),
        }));
      },

      setCurrentFormIndex: (index) => {
        const sequenceLength = get().formSequence.length;
        if (index >= -1 && index <= sequenceLength) {
          set({ currentFormIndex: index, lastUpdateTimestamp: Date.now() });
        } else {
          console.warn('Attempted to set invalid form index:', index);
        }
      },
      
      updatePatientData: (updatedPatientData) => {
        set(state => ({
            // This logic correctly handles merging with a null or existing state
            patientData: {
                ...(state.patientData || initialPatientState),
                ...updatedPatientData
            },
            lastUpdateTimestamp: Date.now(),
        }));
      },

      completeAndClearEncounter: () => {
        set({ ...initialState });
      },
    }),
    {
      name: 'crest-submission-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const clearPersistedSubmission = () => {
    useSubmissionStore.persist.clearStorage();
    useSubmissionStore.setState(initialState);
    console.log('Persisted submission data cleared.');
}

export default useSubmissionStore;