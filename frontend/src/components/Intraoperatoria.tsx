// frontend/src/components/Intraoperatoria.tsx
import React, { useState } from 'react';
import SectionCard from './ui/SectionCard';
import SelectField from './ui/SelectField';
import DrugInputField from './ui/DrugInputField';
import CheckboxGroupField from './ui/CheckboxGroupField';
import RadioButtonGroupField from './ui/RadioButtonGroupField';

// --- Options & Data Structures ---
const procedimentoOptions = [ { value: 'broncoscopia_flexivel', label: 'Broncoscopia flexível' }, { value: 'broncoscopia_rigida', label: 'Broncoscopia rígida' }, { value: 'traqueoscopia', label: 'Traqueoscopia' }, { value: 'dilatacao_traqueal', label: 'Dilatação Traqueal' }, { value: 'traqueoplastia', label: 'Traqueoplastia' }, ];
const anestesiaOptions = [ { value: 'geral', label: 'Geral' }, { value: 'sedacao_profunda', label: 'Sedação Profunda' }, ];
interface OptionInfo { value: string; label: string; }

// --- Drug Definitions with Color Placeholders ---
// Placeholder colors based on common international associations - REQUIRES LOCAL VALIDATION
const drugColorClasses = {
    opioid: 'bg-blue-500',
    benzo: 'bg-orange-500',
    induction: 'bg-yellow-400', // Propofol often yellow/white
    localAnesthetic: 'bg-gray-500',
    volatile: 'bg-purple-500', // Volatiles often purple vaporizers
    nmba: 'bg-red-500', // Often red stripes/labels for relaxants
    alpha2Agonist: 'bg-green-500', // Clonidine/Dexmed
    other: 'bg-slate-500',
    antiemetic: 'bg-teal-500',
    analgesic: 'bg-pink-500', // Dipyrone
    bronchodilator: 'bg-sky-500', // Salbutamol often blue inhaler
    steroid: 'bg-amber-700', // Dexamethasone
    electrolyte: 'bg-indigo-500', // Magnesium
};

interface DrugInfo {
    name: string;
    id: string;
    unit: string;
    inputType?: 'text' | 'number' | 'stepper'; // Added 'stepper' type
    colorClass?: string; // Optional color class from mapping above
}

const inductionDrugsList: DrugInfo[] = [
  { name: 'Lidocaína', id: 'lido', unit: 'mg', colorClass: drugColorClasses.localAnesthetic },
  { name: 'Fentanil', id: 'fenta', unit: 'mcg', colorClass: drugColorClasses.opioid },
  { name: 'Sufentanil', id: 'sufenta', unit: 'mcg', colorClass: drugColorClasses.opioid },
  { name: 'Alfentanil', id: 'alfenta', unit: 'mcg', colorClass: drugColorClasses.opioid },
  { name: 'Dexmedetomidina', id: 'dexme_ind', unit: 'mcg', colorClass: drugColorClasses.alpha2Agonist },
  { name: 'Cetamina', id: 'keta', unit: 'mg', colorClass: drugColorClasses.induction }, // Different class
  { name: 'Midazolam', id: 'mida', unit: 'mg', colorClass: drugColorClasses.benzo },
  { name: 'Propofol', id: 'propo_ind', unit: 'mg', colorClass: drugColorClasses.induction },
  { name: 'Etomidato', id: 'etomi', unit: 'mg', colorClass: drugColorClasses.induction },
  { name: 'Sevoflurano', id: 'sevo_ind', unit: '%', inputType: 'text', colorClass: drugColorClasses.volatile },
];
const maintenanceDrugsList: DrugInfo[] = [
    { name: 'Remifentanil', id: 'remi', unit: 'mcg/kg/min', colorClass: drugColorClasses.opioid },
    { name: 'Propofol', id: 'propo_maint', unit: 'mcg/kg/min', colorClass: drugColorClasses.induction },
    { name: 'Dexmedetomidina', id: 'dexme_maint', unit: 'mcg/kg/h', colorClass: drugColorClasses.alpha2Agonist },
    { name: 'Sevoflurano', id: 'sevo_maint', unit: '%', inputType: 'text', colorClass: drugColorClasses.volatile },
];
const adjuvantDrugsList: DrugInfo[] = [
    { name: 'Clonidina', id: 'clon', unit: 'mcg', colorClass: drugColorClasses.alpha2Agonist },
    { name: 'Sulfato de Magnésio', id: 'mgso4', unit: 'mg', colorClass: drugColorClasses.electrolyte },
];
const symptomaticDrugsList: DrugInfo[] = [
    { name: 'Dipirona', id: 'dipi', unit: 'mg', colorClass: drugColorClasses.analgesic },
    { name: 'Ondansentrona', id: 'onda', unit: 'mg', colorClass: drugColorClasses.antiemetic },
    { name: 'Salbutamol', id: 'salbu', unit: 'puffs', inputType: 'stepper', colorClass: drugColorClasses.bronchodilator }, // Use stepper
    { name: 'Dexametasona', id: 'dexa', unit: 'mg', colorClass: drugColorClasses.steroid },
];

// Other options...
const oxigenioOptions: OptionInfo[] = [ { value: 'cateter_nasal', label: 'Cateter nasal'}, { value: 'sonda_aspiracao_periglotica', label: 'Sonda de aspiração periglótica'}, ];
const ventilatorioOptions: OptionInfo[] = [ { value: 'mascara_laringea', label: 'Máscara laríngea'}, { value: 'tubo_orotraqueal', label: 'Tubo orotraqueal'}, ];
const dessaturacaoOptions: OptionInfo[] = [ { value: 'dessaturacao_85_92', label: 'Dessaturação (85-92%)'}, { value: 'dessaturacao_75_85', label: 'Dessaturação (75-85%)'}, { value: 'dessaturacao_lt_70', label: 'Dessaturação (<70%)'}, ];
const outrasIntercorrenciasOptions: OptionInfo[] = [ { value: 'broncoespasmo', label: 'Broncoespasmo'}, { value: 'laringoespasmo', label: 'Laringoespasmo'}, { value: 'sangramento', label: 'Sangramento'}, { value: 'reflexo_tosse_nao_abolido', label: 'Reflexo de tosse não abolido'}, ];

// Interfaces for state
interface DrugValues { [drugId: string]: string; } // Stepper value will also be stored as string
interface SelectedDrugs { [drugId: string]: boolean; }
type SelectedOptions = string[];
type SelectedRadio = string | number | null;

const Intraoperatoria: React.FC = () => {
  // --- State ---
  const [procedimento, setProcedimento] = useState<string>('');
  const [tipoAnestesia, setTipoAnestesia] = useState<string>('');
  const [selectedInductionDrugs, setSelectedInductionDrugs] = useState<SelectedDrugs>({});
  const [inductionDrugValues, setInductionDrugValues] = useState<DrugValues>({});
  const [selectedMaintenanceDrugs, setSelectedMaintenanceDrugs] = useState<SelectedDrugs>({});
  const [maintenanceDrugValues, setMaintenanceDrugValues] = useState<DrugValues>({});
  const [selectedAdjuvantDrugs, setSelectedAdjuvantDrugs] = useState<SelectedDrugs>({});
  const [adjuvantDrugValues, setAdjuvantDrugValues] = useState<DrugValues>({});
  const [selectedSymptomaticDrugs, setSelectedSymptomaticDrugs] = useState<SelectedDrugs>({});
  const [symptomaticDrugValues, setSymptomaticDrugValues] = useState<DrugValues>({});
  const [suporteOxigenioSelecionado, setSuporteOxigenioSelecionado] = useState<SelectedOptions>([]);
  const [suporteVentilatorioSelecionado, setSuporteVentilatorioSelecionado] = useState<SelectedOptions>([]);
  const [nivelDessaturacao, setNivelDessaturacao] = useState<SelectedRadio>(null);
  const [outrasIntercorrencias, setOutrasIntercorrencias] = useState<SelectedOptions>([]);

  // --- Event Handlers (Generic handlers remain the same) ---
  const handleProcedimentoChange = (event: React.ChangeEvent<HTMLSelectElement>) => setProcedimento(event.target.value);
  const handleTipoAnestesiaChange = (event: React.ChangeEvent<HTMLSelectElement>) => setTipoAnestesia(event.target.value);
  const handleDrugSelectToggle = (id: string, sel: SelectedDrugs, setSel: React.Dispatch<React.SetStateAction<SelectedDrugs>>, setVal: React.Dispatch<React.SetStateAction<DrugValues>>) => { const isSel = !!sel[id]; setSel(p => ({ ...p, [id]: !isSel })); if (isSel) { setVal(p => { const n = {...p}; delete n[id]; return n; }); } };
  const handleDrugValueChange = (id: string, val: string, setVal: React.Dispatch<React.SetStateAction<DrugValues>>) => { setVal(p => ({ ...p, [id]: val })); };
  const handleCheckboxChange = (sel: string[], setSel: React.Dispatch<React.SetStateAction<string[]>>, val: string) => { if (sel.includes(val)) { setSel(sel.filter(i => i !== val)); } else { setSel([...sel, val]); } };
  // Specific Handlers
  const handleInductionDrugSelectToggle = (id: string) => handleDrugSelectToggle(id, selectedInductionDrugs, setSelectedInductionDrugs, setInductionDrugValues);
  const handleInductionDrugValueChange = (id: string, val: string) => handleDrugValueChange(id, val, setInductionDrugValues);
  const handleMaintenanceDrugSelectToggle = (id: string) => handleDrugSelectToggle(id, selectedMaintenanceDrugs, setSelectedMaintenanceDrugs, setMaintenanceDrugValues);
  const handleMaintenanceDrugValueChange = (id: string, val: string) => handleDrugValueChange(id, val, setMaintenanceDrugValues);
  const handleAdjuvantDrugSelectToggle = (id: string) => handleDrugSelectToggle(id, selectedAdjuvantDrugs, setSelectedAdjuvantDrugs, setAdjuvantDrugValues);
  const handleAdjuvantDrugValueChange = (id: string, val: string) => handleDrugValueChange(id, val, setAdjuvantDrugValues);
  const handleSymptomaticDrugSelectToggle = (id: string) => handleDrugSelectToggle(id, selectedSymptomaticDrugs, setSelectedSymptomaticDrugs, setSymptomaticDrugValues);
  const handleSymptomaticDrugValueChange = (id: string, val: string) => handleDrugValueChange(id, val, setSymptomaticDrugValues); // Stepper value handled as string here
  const handleOxigenioChange = (val: string) => handleCheckboxChange(suporteOxigenioSelecionado, setSuporteOxigenioSelecionado, val);
  const handleVentilatorioChange = (val: string) => handleCheckboxChange(suporteVentilatorioSelecionado, setSuporteVentilatorioSelecionado, val);
  const handleDessaturacaoChange = (val: string | number) => setNivelDessaturacao(val);
  const handleOutrasIntercorrenciasChange = (val: string) => handleCheckboxChange(outrasIntercorrencias, setOutrasIntercorrencias, val);

  // --- Rendering ---
  return (
    <SectionCard title="Intraoperatória">
      {/* Procedure and Anesthesia Type Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <SelectField label="Procedimento" id="procedimento" value={procedimento} onChange={handleProcedimentoChange} options={procedimentoOptions} placeholder="Selecione..." required />
        <SelectField label="Anestesia" id="anestesia" value={tipoAnestesia} onChange={handleTipoAnestesiaChange} options={anestesiaOptions} placeholder="Selecione..." required />
      </div>

      {/* Drug Sections */}
      <div className="space-y-6">
        {/* Render function for drug sections to reduce repetition */}
        {( (title: string, drugList: DrugInfo[], selectedState: SelectedDrugs, valueState: DrugValues, toggleHandler: (id: string)=>void, valueHandler: (id: string, val: string)=> void) => (
            <fieldset className="border border-slate-200 p-4 rounded-md bg-white"> {/* Added bg-white */}
                <legend className="text-base font-semibold text-slate-800 px-2">{title}</legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3 mt-2"> {/* Adjusted gap */}
                    {drugList.map((drug) => (
                        <DrugInputField
                            key={drug.id}
                            drugName={drug.name}
                            drugId={drug.id}
                            unit={drug.unit}
                            colorClass={drug.colorClass} // Pass color class
                            isSelected={!!selectedState[drug.id]}
                            value={valueState[drug.id] || ''}
                            onSelectToggle={() => toggleHandler(drug.id)}
                            // Pass value directly for standard inputs, event for others if needed by DrugInput handling
                            onValueChange={(e) => valueHandler(drug.id, typeof e === 'string' ? e : e.target.value)} // Modified to handle direct value or event
                            inputType={drug.inputType} // Pass inputType hint
                        />
                    ))}
                </div>
            </fieldset>
        ) )( "Fármacos para Indução", inductionDrugsList, selectedInductionDrugs, inductionDrugValues, handleInductionDrugSelectToggle, handleInductionDrugValueChange ) }

        {/* Render Maintenance Drugs */}
        {( (title: string, drugList: DrugInfo[], selectedState: SelectedDrugs, valueState: DrugValues, toggleHandler: (id: string)=>void, valueHandler: (id: string, val: string)=> void) => ( <fieldset className="border border-slate-200 p-4 rounded-md bg-white"> <legend className="text-base font-semibold text-slate-800 px-2">{title}</legend> <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3 mt-2"> {drugList.map((drug) => ( <DrugInputField key={drug.id} drugName={drug.name} drugId={drug.id} unit={drug.unit} colorClass={drug.colorClass} isSelected={!!selectedState[drug.id]} value={valueState[drug.id] || ''} onSelectToggle={()=> toggleHandler(drug.id)} onValueChange={(e)=> valueHandler(drug.id, typeof e === 'string' ? e : e.target.value)} inputType={drug.inputType} /> ))} </div> </fieldset> ) )( "Fármacos para Manutenção", maintenanceDrugsList, selectedMaintenanceDrugs, maintenanceDrugValues, handleMaintenanceDrugSelectToggle, handleMaintenanceDrugValueChange ) }

        {/* Render Adjuvant Drugs */}
        {( (title: string, drugList: DrugInfo[], selectedState: SelectedDrugs, valueState: DrugValues, toggleHandler: (id: string)=>void, valueHandler: (id: string, val: string)=> void) => ( <fieldset className="border border-slate-200 p-4 rounded-md bg-white"> <legend className="text-base font-semibold text-slate-800 px-2">{title}</legend> <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3 mt-2"> {drugList.map((drug) => ( <DrugInputField key={drug.id} drugName={drug.name} drugId={drug.id} unit={drug.unit} colorClass={drug.colorClass} isSelected={!!selectedState[drug.id]} value={valueState[drug.id] || ''} onSelectToggle={()=> toggleHandler(drug.id)} onValueChange={(e)=> valueHandler(drug.id, typeof e === 'string' ? e : e.target.value)} inputType={drug.inputType} /> ))} </div> </fieldset> ) )( "Fármacos Adjuvantes", adjuvantDrugsList, selectedAdjuvantDrugs, adjuvantDrugValues, handleAdjuvantDrugSelectToggle, handleAdjuvantDrugValueChange ) }

        {/* Render Symptomatic Drugs */}
        {( (title: string, drugList: DrugInfo[], selectedState: SelectedDrugs, valueState: DrugValues, toggleHandler: (id: string)=>void, valueHandler: (id: string, val: string)=> void) => ( <fieldset className="border border-slate-200 p-4 rounded-md bg-white"> <legend className="text-base font-semibold text-slate-800 px-2">{title}</legend> <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3 mt-2"> {drugList.map((drug) => ( <DrugInputField key={drug.id} drugName={drug.name} drugId={drug.id} unit={drug.unit} colorClass={drug.colorClass} isSelected={!!selectedState[drug.id]} value={valueState[drug.id] || ''} onSelectToggle={()=> toggleHandler(drug.id)} onValueChange={(e)=> valueHandler(drug.id, typeof e === 'string' ? e : e.target.value)} inputType={drug.inputType} /> ))} </div> </fieldset> ) )( "Sintomáticos", symptomaticDrugsList, selectedSymptomaticDrugs, symptomaticDrugValues, handleSymptomaticDrugSelectToggle, handleSymptomaticDrugValueChange ) }

      </div>

      {/* Support and Intercurrences Sections */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Support Column */}
        <div className="space-y-4">
            <CheckboxGroupField label="Suporte de Oxigênio" idPrefix="oxi" options={oxigenioOptions} selectedValues={suporteOxigenioSelecionado} onChange={handleOxigenioChange} />
            <CheckboxGroupField label="Suporte Ventilatório" idPrefix="vent" options={ventilatorioOptions} selectedValues={suporteVentilatorioSelecionado} onChange={handleVentilatorioChange} />
        </div>
         {/* Intercurrences Column */}
         <fieldset className="border border-slate-200 p-4 rounded-md bg-white"> {/* Added bg */}
            <legend className="text-base font-semibold text-slate-800 px-2">Intercorrências</legend>
            {/* Use a sub-label or just spacing */}
             <label className="block text-sm font-medium text-slate-600 mt-2 mb-1">Nível de Dessaturação (se ocorrido):</label>
            <RadioButtonGroupField
                label="" // Label handled above
                idPrefix="dessat"
                options={dessaturacaoOptions}
                selectedValue={nivelDessaturacao}
                onChange={handleDessaturacaoChange}
                className="mb-4"
            />
             <label className="block text-sm font-medium text-slate-600 mb-1">Outras:</label>
             <CheckboxGroupField
                label="" // Label handled above
                idPrefix="inter"
                options={outrasIntercorrenciasOptions}
                selectedValues={outrasIntercorrencias}
                onChange={handleOutrasIntercorrenciasChange}
            />
         </fieldset>
      </div>

      {/* Temporary state display (Condensed) */}
      <div className="mt-6 p-3 bg-slate-100 rounded text-xs overflow-x-auto"> {/* State Display */} </div>
    </SectionCard>
  );
};

export default Intraoperatoria;