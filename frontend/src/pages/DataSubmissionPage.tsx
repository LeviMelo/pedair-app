// src/pages/DataSubmissionPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { PiFileTextDuotone, PiArrowLeft, PiArrowRight, PiPaperPlaneTilt, PiUser, PiEye, PiCheckCircle, PiCircleDashed } from 'react-icons/pi';

import DynamicFormRenderer from '../components/forms/DynamicFormRenderer';
// CORRECTED IMPORT: Using the barrel file
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Button, InputField, PageHeader } from '../components/ui';
import useSubmissionStore, { FormDefinition } from '../stores/submissionStore';
import { cn } from '@/lib/utils';

// MOCK: This would come from the project's configuration in a real scenario
const MOCK_FORM_SEQUENCE: FormDefinition[] = [
  { key: 'preanest', name: 'Pré-Anestesia', version: '1.0.3', schemaPath: '../schemas/preAnestesia.schema.json', uiSchemaPath: '../schemas/preAnestesia.uiSchema.json' },
  { key: 'intraop', name: 'Intraoperatório', version: '1.1.1', schemaPath: '../schemas/intraoperatoria.schema.json', uiSchemaPath: '../schemas/intraoperatoria.uiSchema.json' },
  { key: 'recuperacao', name: 'Recuperação Pós-Anestésica', version: '1.2.2', schemaPath: '../schemas/recuperacaoPosAnestesica.schema.json', uiSchemaPath: '../schemas/recuperacaoPosAnestesica.uiSchema.json' },
];

// ----- Stepper Component (for UI clarity) -----
const SubmissionStepper: React.FC = () => {
    // ... (This component remains the same)
    const { currentFormIndex, formSequence } = useSubmissionStore();
    const steps = [
      { key: 'patient', label: 'Patient Info', icon: PiUser },
      ...formSequence.map(f => ({ key: f.key, label: f.name, icon: PiFileTextDuotone })),
      { key: 'review', label: 'Review', icon: PiEye }
    ];
    const activeIndex = currentFormIndex + 1;
  
    return (
      <div className="mb-8 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg shadow-inner">
        <ol className="flex items-center w-full">
          {steps.map((step, index) => {
            const isCompleted = index < activeIndex;
            const isCurrent = index === activeIndex;
            return (
              <li key={step.key} className={cn("flex w-full items-center", { "text-blue-600 dark:text-blue-400": isCurrent, "text-emerald-600 dark:text-emerald-400": isCompleted },
                index < steps.length - 1 ? "after:content-[''] after:w-full after:h-1 after:border-b after:border-dashed after:border-slate-300 dark:after:border-slate-700 after:mx-4" : "")}>
                <span className="flex items-center justify-center">
                  {isCompleted ? <PiCheckCircle className="w-5 h-5 mr-2" /> : isCurrent ? <PiCircleDashed className="w-5 h-5 mr-2 animate-spin" /> : <step.icon className="w-5 h-5 mr-2 opacity-60" />}
                  <span className="font-medium text-sm hidden sm:inline">{step.label}</span>
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    );
};

// ----- Main Page Component -----
const DataSubmissionPage: React.FC = () => {
    // ... (This logic remains the same)
    const {
        isEncounterActive,
        patientData,
        formSequence,
        currentFormIndex,
        allFormsData,
        startNewEncounter,
        saveCurrentForm,
        setCurrentFormIndex,
        updatePatientData,
        completeAndClearEncounter,
    } = useSubmissionStore();
    
    const [currentDynamicFormData, setCurrentDynamicFormData] = useState<any>({});
    const [currentFormSchema, setCurrentFormSchema] = useState<any>(null);
    const [currentFormUiSchema, setCurrentFormUiSchema] = useState<any>(null);
    const [isLoadingForm, setIsLoadingForm] = useState(false);
    
    const loadFormDefinition = useCallback(async (formDef: FormDefinition) => {
      setIsLoadingForm(true);
      try {
        const schemaModule = await import(/* @vite-ignore */ formDef.schemaPath);
        const uiSchemaModule = await import(/* @vite-ignore */ formDef.uiSchemaPath);
        setCurrentFormSchema(schemaModule.default);
        setCurrentFormUiSchema(uiSchemaModule.default);
        const initialData = allFormsData[formDef.key] || {};
        setCurrentDynamicFormData(initialData);
      } catch (error) {
        console.error(`Error loading schemas for ${formDef.name}:`, error);
      } finally {
        setIsLoadingForm(false);
      }
    }, [allFormsData]);
    
    useEffect(() => {
      const isFormStep = currentFormIndex >= 0 && currentFormIndex < formSequence.length;
      if (isFormStep) {
        const formDef = formSequence[currentFormIndex];
        loadFormDefinition(formDef);
      } else {
        setCurrentFormSchema(null);
        setCurrentFormUiSchema(null);
      }
    }, [currentFormIndex, formSequence, loadFormDefinition]);
    
    const handleStart = () => {
      if (patientData && patientData.initials && patientData.gender && patientData.dob && patientData.projectConsent) {
        startNewEncounter(patientData, MOCK_FORM_SEQUENCE);
      } else {
        alert("Please fill all required patient fields and provide consent.");
      }
    };
    
    const handleNavigate = (direction: 'next' | 'previous') => {
      const isFormStep = currentFormIndex >= 0 && currentFormIndex < formSequence.length;
      if (isFormStep) {
        saveCurrentForm(formSequence[currentFormIndex].key, currentDynamicFormData);
      }
      setCurrentFormIndex(currentFormIndex + (direction === 'next' ? 1 : -1));
    };
      
    const handleSubmit = () => {
        const isLastFormStep = currentFormIndex >= 0 && currentFormIndex < formSequence.length;
        if(isLastFormStep) {
            saveCurrentForm(formSequence[currentFormIndex].key, currentDynamicFormData);
        }
        
        setTimeout(() => {
            const finalPatientData = useSubmissionStore.getState().patientData;
            const finalAllFormsData = useSubmissionStore.getState().allFormsData;
            console.log("Submitting all data for encounter...");
            console.log("Patient Data:", finalPatientData);
            console.log("Forms Data:", finalAllFormsData);
            alert("Encounter data submitted (mock)! Check console. Clearing encounter state.");
            completeAndClearEncounter();
        }, 100);
    };

    const handlePatientFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value, type, checked } = e.target;
      updatePatientData({ [id]: type === 'checkbox' ? checked : value });
    };

    const renderPatientInput = () => (
        <Card>
        <CardHeader><CardTitle>Patient Identification & Consent</CardTitle></CardHeader>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* NO ERRORS SHOULD APPEAR HERE NOW */}
            <InputField label="Patient Initials" id="initials" type="text" value={patientData?.initials || ''} onChange={handlePatientFieldChange} required />
            <InputField label="Gender" id="gender" type="text" value={patientData?.gender || ''} onChange={handlePatientFieldChange} required />
            <InputField label="Date of Birth" id="dob" type="date" value={patientData?.dob || ''} onChange={handlePatientFieldChange} required />
            </div>
            <div className="space-y-3 pt-4 border-t">
                <div className="flex items-start space-x-2">
                    <input type="checkbox" id="projectConsent" checked={patientData?.projectConsent || false} onChange={handlePatientFieldChange} className="h-4 w-4 mt-1 accent-primary" />
                    <label htmlFor="projectConsent" className="text-sm text-muted-foreground">Confirm project-specific consent has been obtained. <span className="text-red-500">*</span></label>
                </div>
                <div className="flex items-start space-x-2">
                    <input type="checkbox" id="recontactConsent" checked={patientData?.recontactConsent || false} onChange={handlePatientFieldChange} className="h-4 w-4 mt-1 accent-primary" />
                    <label htmlFor="recontactConsent" className="text-sm text-muted-foreground">Patient/guardian consents to potential re-contact for follow-up.</label>
                </div>
            </div>
        </CardContent>
        <CardFooter>
            <Button onClick={handleStart} className="ml-auto">Start Data Collection</Button>
        </CardFooter>
        </Card>
    );

    const renderFormStep = () => {
        if (isLoadingForm || !currentFormSchema) {
            return <div className="text-center p-10"><PiCircleDashed className="animate-spin text-4xl text-blue-500 mx-auto" /></div>;
        }
        const formDef = formSequence[currentFormIndex];
        return (
        <Card>
            <CardHeader><CardTitle>{formDef.name}</CardTitle></CardHeader>
            <CardContent>
            <DynamicFormRenderer
                schema={currentFormSchema}
                uiSchema={currentFormUiSchema}
                formData={currentDynamicFormData}
                onFormDataChange={setCurrentDynamicFormData}
            />
            </CardContent>
            <CardFooter className="justify-between">
            <Button variant="outline" onClick={() => handleNavigate('previous')} iconLeft={<PiArrowLeft />}>Previous</Button>
            <Button onClick={() => handleNavigate('next')} iconRight={<PiArrowRight />}>Next</Button>
            </CardFooter>
        </Card>
        );
    };
  
    const renderReviewStep = () => (
        <Card>
        <CardHeader><CardTitle>Review & Submit</CardTitle></CardHeader>
        <CardContent className="space-y-4">
            <div>
                <h3 className="font-semibold mb-2">Patient Information</h3>
                <pre className="text-xs bg-slate-100 dark:bg-slate-800 p-3 rounded-md overflow-x-auto">{JSON.stringify(patientData, null, 2)}</pre>
            </div>
            {formSequence.map(formDef => (
                <div key={formDef.key}>
                    <h3 className="font-semibold mb-2">{formDef.name}</h3>
                    <pre className="text-xs bg-slate-100 dark:bg-slate-800 p-3 rounded-md overflow-x-auto">{JSON.stringify(allFormsData[formDef.key] || { message: "No data." }, null, 2)}</pre>
                </div>
            ))}
        </CardContent>
        <CardFooter className="justify-between">
            <Button variant="outline" onClick={() => handleNavigate('previous')} iconLeft={<PiArrowLeft />}>Back</Button>
            <Button variant="success" onClick={handleSubmit} iconLeft={<PiPaperPlaneTilt />}>Submit All Data</Button>
        </CardFooter>
        </Card>
    );
  
    return (
        <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
        <PageHeader
            title="Data Submission"
            subtitle="Collect and submit clinical research data for your active project."
            icon={PiFileTextDuotone}
            gradient='secondary'
        />
        
        {!isEncounterActive ? (
            renderPatientInput()
        ) : (
            <>
                <SubmissionStepper />
                {currentFormIndex === -1 && renderPatientInput()}
                {currentFormIndex >= 0 && currentFormIndex < formSequence.length && renderFormStep()}
                {currentFormIndex === formSequence.length && renderReviewStep()}
            </>
        )}
        </div>
    );
};

export default DataSubmissionPage;