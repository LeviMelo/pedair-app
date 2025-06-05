export interface AutocompleteOption {
  value: string;
  label: string;
  [key: string]: any; // Allow other properties like icd10
}

// --- Diagnoses Data ---
export const commonDiagnoses: AutocompleteOption[] = [
  { value: 'laringomalacia', label: 'Laringomalácia', icd10: 'J38.5' },
  { value: 'estenose_subglotica_congenita', label: 'Estenose subglótica congênita', icd10: 'Q31.1' },
  { value: 'fistula_traqueoesofagica', label: 'Fístula traqueoesofágica', icd10: 'Q39.2' },
  { value: 'cleft_laringeo', label: 'Cleft laríngeo', icd10: 'Q31.8' },
  { value: 'paralisia_bilateral_cordas_vocais', label: 'Paralisia bilateral de cordas vocais', icd10: 'J38.0' },
];
export const allDiagnosesSample: AutocompleteOption[] = [
  ...commonDiagnoses,
  { value: 'estenose_traqueal_pos_intubacao', label: 'Estenose traqueal pós intubação', icd10: 'J95.5' }, 
  { value: 'colapso_traqueal_congenito', label: 'Colapso traqueal congênito', icd10: 'Q32.1' }, 
  { value: 'fibroma_epifaringeo', label: 'Fibroma epifaringeo', icd10: 'D10.6' }, 
  { value: 'estreitamento_arvore_bronquica', label: 'Estreitamento da árvore brônquica', icd10: 'Q32.4' }, 
  { value: 'anel_vascular', label: 'Anel vascular', icd10: 'Q25.7' }, 
  { value: 'cisto_broncogenico', label: 'Cisto broncogênico', icd10: 'Q32.4' }, 
  { value: 'cisto_paravalecular', label: 'Cisto paravalecular', icd10: 'J38.6' }, 
  { value: 'fistula_traqueopleural', label: 'Fístula traqueopleural', icd10: 'J86.0' }, 
  { value: 'papilomatose_respiratoria_recorrente', label: 'Papilomatose respiratória recorrente', icd10: 'D14.1' }, 
  { value: 'hemangioma_subglotico', label: 'Hemangioma subglótico', icd10: 'D18.03' }, 
  { value: 'corpo_estranho', label: 'Corpo estranho', icd10: 'T17._' },
];

// --- Comorbidities Data ---
export const commonComorbidades: AutocompleteOption[] = [
    { value: 'prematuridade', label: 'Prematuridade' }, 
    { value: 'cardiopatia_congenita', label: 'Cardiopatia congênita' },
    { value: 'asma', label: 'Asma' }, 
    { value: 'sindrome_pierre_robin', label: 'Síndrome de Pierre Robin'},
    { value: 'doenca_neurologica', label: 'Doença Neurológica'},
];
export const allComorbidadesSample: AutocompleteOption[] = [
    ...commonComorbidades,
    { value: 'fibrose_cistica', label: 'Fibrose cística'}, 
    { value: 'tuberculose', label: 'Tuberculose'},
    { value: 'malformacao_pulmonar', label: 'Malformação pulmonar'}, 
    { value: 'imunodeficiencia', label: 'Imunodeficiência'},
    { value: 'disturbio_metabolico', label: 'Distúrbio metabólico'}
];

// --- Queixas Data ---
export const commonQueixas: AutocompleteOption[] = [
    { value: 'tosse_cronica', label: 'Tosse crônica'}, 
    { value: 'estridor', label: 'Estridor'},
    { value: 'infeccoes_respiratorias_recorrentes', label: 'Infecções respiratórias recorrentes'},
    { value: 'sibilancia', label: 'Sibilância'}, 
    { value: 'sangramento', label: 'Sangramento'},
];
export const allQueixasSample: AutocompleteOption[] = [
    ...commonQueixas, 
    { value: 'atelectasia', label: 'Atelectasia'}
];

// For easier access in the widget
export const dataOptionSources = {
    commonDiagnoses,
    allDiagnosesSample,
    commonComorbidades,
    allComorbidadesSample,
    commonQueixas,
    allQueixasSample
}; 