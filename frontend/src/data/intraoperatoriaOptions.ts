// frontend/src/data/intraoperatoriaOptions.ts

// Option Info Interface (Generic)
export interface OptionInfo { value: string; label: string; }

// Drug Info Interface
export interface DrugInfo {
    name: string;
    id: string;
    unit: string;
    inputType?: 'text' | 'number' | 'stepper';
    colorClass?: string; 
}

// --- Options & Data Structures --- (Copied from Intraoperatoria.tsx)
export const procedimentoOptions: OptionInfo[] = [ { value: 'broncoscopia_flexivel', label: 'Broncoscopia flexível' }, { value: 'broncoscopia_rigida', label: 'Broncoscopia rígida' }, { value: 'traqueoscopia', label: 'Traqueoscopia' }, { value: 'dilatacao_traqueal', label: 'Dilatação Traqueal' }, { value: 'traqueoplastia', label: 'Traqueoplastia' }, ];
export const anestesiaOptions: OptionInfo[] = [ { value: 'geral', label: 'Geral' }, { value: 'sedacao_profunda', label: 'Sedação Profunda' }, ];

// --- Drug Definitions with Color Placeholders ---
const drugColorClasses = {
    opioid: 'bg-blue-500',
    benzo: 'bg-orange-500',
    induction: 'bg-yellow-400',
    localAnesthetic: 'bg-gray-500',
    volatile: 'bg-purple-500',
    nmba: 'bg-red-500',
    alpha2Agonist: 'bg-green-500',
    other: 'bg-slate-500',
    antiemetic: 'bg-teal-500',
    analgesic: 'bg-pink-500',
    bronchodilator: 'bg-sky-500',
    steroid: 'bg-amber-700',
    electrolyte: 'bg-indigo-500',
};

export const inductionDrugsList: DrugInfo[] = [
  { name: 'Lidocaína', id: 'lido', unit: 'mg', colorClass: drugColorClasses.localAnesthetic },
  { name: 'Fentanil', id: 'fenta', unit: 'mcg', colorClass: drugColorClasses.opioid },
  { name: 'Sufentanil', id: 'sufenta', unit: 'mcg', colorClass: drugColorClasses.opioid },
  { name: 'Alfentanil', id: 'alfenta', unit: 'mcg', colorClass: drugColorClasses.opioid },
  { name: 'Dexmedetomidina', id: 'dexme_ind', unit: 'mcg', colorClass: drugColorClasses.alpha2Agonist },
  { name: 'Cetamina', id: 'keta', unit: 'mg', colorClass: drugColorClasses.induction },
  { name: 'Midazolam', id: 'mida', unit: 'mg', colorClass: drugColorClasses.benzo },
  { name: 'Propofol', id: 'propo_ind', unit: 'mg', colorClass: drugColorClasses.induction },
  { name: 'Etomidato', id: 'etomi', unit: 'mg', colorClass: drugColorClasses.induction },
  { name: 'Sevoflurano', id: 'sevo_ind', unit: '%', inputType: 'text', colorClass: drugColorClasses.volatile },
];
export const maintenanceDrugsList: DrugInfo[] = [
    { name: 'Remifentanil', id: 'remi', unit: 'mcg/kg/min', colorClass: drugColorClasses.opioid },
    { name: 'Propofol', id: 'propo_maint', unit: 'mcg/kg/min', colorClass: drugColorClasses.induction },
    { name: 'Dexmedetomidina', id: 'dexme_maint', unit: 'mcg/kg/h', colorClass: drugColorClasses.alpha2Agonist },
    { name: 'Sevoflurano', id: 'sevo_maint', unit: '%', inputType: 'text', colorClass: drugColorClasses.volatile },
];
export const adjuvantDrugsList: DrugInfo[] = [
    { name: 'Clonidina', id: 'clon', unit: 'mcg', colorClass: drugColorClasses.alpha2Agonist },
    { name: 'Sulfato de Magnésio', id: 'mgso4', unit: 'mg', colorClass: drugColorClasses.electrolyte },
];
export const symptomaticDrugsList: DrugInfo[] = [
    { name: 'Dipirona', id: 'dipi', unit: 'mg', colorClass: drugColorClasses.analgesic },
    { name: 'Ondansentrona', id: 'onda', unit: 'mg', colorClass: drugColorClasses.antiemetic },
    { name: 'Salbutamol', id: 'salbu', unit: 'puffs', inputType: 'stepper', colorClass: drugColorClasses.bronchodilator },
    { name: 'Dexametasona', id: 'dexa', unit: 'mg', colorClass: drugColorClasses.steroid },
];

// Other options...
export const oxigenioOptions: OptionInfo[] = [ { value: 'cateter_nasal', label: 'Cateter nasal'}, { value: 'sonda_aspiracao_periglotica', label: 'Sonda de aspiração periglótica'}, ];
export const ventilatorioOptions: OptionInfo[] = [ { value: 'mascara_laringea', label: 'Máscara laríngea'}, { value: 'tubo_orotraqueal', label: 'Tubo orotraqueal'}, ];
export const dessaturacaoOptions: OptionInfo[] = [ { value: 'dessaturacao_85_92', label: 'Dessaturação (85-92%)'}, { value: 'dessaturacao_75_85', label: 'Dessaturação (75-85%)'}, { value: 'dessaturacao_lt_70', label: 'Dessaturação (<70%)'}, ];
export const outrasIntercorrenciasOptions: OptionInfo[] = [ { value: 'broncoespasmo', label: 'Broncoespasmo'}, { value: 'laringoespasmo', label: 'Laringoespasmo'}, { value: 'sangramento', label: 'Sangramento'}, { value: 'reflexo_tosse_nao_abolido', label: 'Reflexo de tosse não abolido'}, ];

// For easier access in the widget
export const intraOpDataSources = {
    procedimentoOptions,
    anestesiaOptions,
    inductionDrugsList,
    maintenanceDrugsList,
    adjuvantDrugsList,
    symptomaticDrugsList,
    oxigenioOptions,
    ventilatorioOptions,
    dessaturacaoOptions,
    outrasIntercorrenciasOptions
}; 