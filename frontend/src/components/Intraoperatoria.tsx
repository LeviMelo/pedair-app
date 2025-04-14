// frontend/src/components/Intraoperatoria.tsx
import React, { useState } from 'react';
import SectionCard from './ui/SectionCard';
import SelectField from './ui/SelectField';
import DrugInputField from './ui/DrugInputField';
import CheckboxGroupField from './ui/CheckboxGroupField';
import RadioButtonGroupField from './ui/RadioButtonGroupField'; // Import RadioButtonGroupField

// --- Options & Data Structures ---
const procedimentoOptions = [ { value: 'broncoscopia_flexivel', label: 'Broncoscopia flexível' }, { value: 'broncoscopia_rigida', label: 'Broncoscopia rígida' }, { value: 'traqueoscopia', label: 'Traqueoscopia' }, { value: 'dilatacao_traqueal', label: 'Dilatação Traqueal' }, { value: 'traqueoplastia', label: 'Traqueoplastia' }, ];
const anestesiaOptions = [ { value: 'geral', label: 'Geral' }, { value: 'sedacao_profunda', label: 'Sedação Profunda' }, ];
interface DrugInfo { name: string; id: string; unit: string; inputType?: 'text' | 'number'; }
interface OptionInfo { value: string; label: string; }

const inductionDrugsList: DrugInfo[] = [ { name: 'Lidocaína', id: 'lido', unit: 'mg' }, { name: 'Fentanil', id: 'fenta', unit: 'mcg' }, { name: 'Sufentanil', id: 'sufenta', unit: 'mcg' }, { name: 'Alfentanil', id: 'alfenta', unit: 'mcg' }, { name: 'Dexmedetomidina', id: 'dexme_ind', unit: 'mcg' }, { name: 'Cetamina', id: 'keta', unit: 'mg' }, { name: 'Midazolam', id: 'mida', unit: 'mg' }, { name: 'Propofol', id: 'propo_ind', unit: 'mg' }, { name: 'Etomidato', id: 'etomi', unit: 'mg' }, { name: 'Sevoflurano', id: 'sevo_ind', unit: '%', inputType: 'text'}, ];
const maintenanceDrugsList: DrugInfo[] = [ { name: 'Remifentanil', id: 'remi', unit: 'mcg/kg/min' }, { name: 'Propofol', id: 'propo_maint', unit: 'mcg/kg/min' }, { name: 'Dexmedetomidina', id: 'dexme_maint', unit: 'mcg/kg/h' }, { name: 'Sevoflurano', id: 'sevo_maint', unit: '%', inputType: 'text' }, ];
const adjuvantDrugsList: DrugInfo[] = [ { name: 'Clonidina', id: 'clon', unit: 'mcg' }, { name: 'Sulfato de Magnésio', id: 'mgso4', unit: 'mg' }, ];
const symptomaticDrugsList: DrugInfo[] = [ { name: 'Dipirona', id: 'dipi', unit: 'mg' }, { name: 'Ondansentrona', id: 'onda', unit: 'mg' }, { name: 'Salbutamol', id: 'salbu', unit: 'puffs', inputType: 'number' }, { name: 'Dexametasona', id: 'dexa', unit: 'mg' }, ];
const oxigenioOptions: OptionInfo[] = [ { value: 'cateter_nasal', label: 'Cateter nasal'}, { value: 'sonda_aspiracao_periglotica', label: 'Sonda de aspiração periglótica'}, ];
const ventilatorioOptions: OptionInfo[] = [ { value: 'mascara_laringea', label: 'Máscara laríngea'}, { value: 'tubo_orotraqueal', label: 'Tubo orotraqueal'}, ];
const dessaturacaoOptions: OptionInfo[] = [ { value: 'dessaturacao_85_92', label: 'Dessaturação (85-92%)'}, { value: 'dessaturacao_75_85', label: 'Dessaturação (75-85%)'}, { value: 'dessaturacao_lt_70', label: 'Dessaturação (<70%)'}, ];
const outrasIntercorrenciasOptions: OptionInfo[] = [ { value: 'broncoespasmo', label: 'Broncoespasmo'}, { value: 'laringoespasmo', label: 'Laringoespasmo'}, { value: 'sangramento', label: 'Sangramento'}, { value: 'reflexo_tosse_nao_abolido', label: 'Reflexo de tosse não abolido'}, ];

// Interfaces for state
interface DrugValues { [drugId: string]: string; }
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


  // --- Event Handlers ---
  const handleProcedimentoChange = (event: React.ChangeEvent<HTMLSelectElement>) => setProcedimento(event.target.value);
  const handleTipoAnestesiaChange = (event: React.ChangeEvent<HTMLSelectElement>) => setTipoAnestesia(event.target.value);
  // Generic Handlers
  const handleDrugSelectToggle = (id: string, sel: SelectedDrugs, setSel: React.Dispatch<React.SetStateAction<SelectedDrugs>>, setVal: React.Dispatch<React.SetStateAction<DrugValues>>) => { const isSel = !!sel[id]; setSel(p => ({ ...p, [id]: !isSel })); if (isSel) { setVal(p => { const n = {...p}; delete n[id]; return n; }); } };
  const handleDrugValueChange = (id: string, val: string, setVal: React.Dispatch<React.SetStateAction<DrugValues>>) => { setVal(p => ({ ...p, [id]: val })); };
  const handleCheckboxChange = (sel: string[], setSel: React.Dispatch<React.SetStateAction<string[]>>, val: string) => { if (sel.includes(val)) { setSel(sel.filter(i => i !== val)); } else { setSel([...sel, val]); } };
  // Specific Drug Handlers
  const handleInductionDrugSelectToggle = (id: string) => handleDrugSelectToggle(id, selectedInductionDrugs, setSelectedInductionDrugs, setInductionDrugValues);
  const handleInductionDrugValueChange = (id: string, val: string) => handleDrugValueChange(id, val, setInductionDrugValues);
  const handleMaintenanceDrugSelectToggle = (id: string) => handleDrugSelectToggle(id, selectedMaintenanceDrugs, setSelectedMaintenanceDrugs, setMaintenanceDrugValues);
  const handleMaintenanceDrugValueChange = (id: string, val: string) => handleDrugValueChange(id, val, setMaintenanceDrugValues);
  const handleAdjuvantDrugSelectToggle = (id: string) => handleDrugSelectToggle(id, selectedAdjuvantDrugs, setSelectedAdjuvantDrugs, setAdjuvantDrugValues);
  const handleAdjuvantDrugValueChange = (id: string, val: string) => handleDrugValueChange(id, val, setAdjuvantDrugValues);
  const handleSymptomaticDrugSelectToggle = (id: string) => handleDrugSelectToggle(id, selectedSymptomaticDrugs, setSelectedSymptomaticDrugs, setSymptomaticDrugValues);
  const handleSymptomaticDrugValueChange = (id: string, val: string) => handleDrugValueChange(id, val, setSymptomaticDrugValues);
  // Specific Checkbox/Radio Handlers
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
        {/* Induction */}
        <fieldset className="border border-slate-200 p-4 rounded-md"> <legend className="text-base font-semibold text-slate-800 px-2">Fármacos para Indução</legend> <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2"> {inductionDrugsList.map((drug) => ( <DrugInputField key={drug.id} drugName={drug.name} drugId={drug.id} unit={drug.unit} isSelected={!!selectedInductionDrugs[drug.id]} value={inductionDrugValues[drug.id] || ''} onSelectToggle={()=> handleInductionDrugSelectToggle(drug.id)} onValueChange={(e)=> handleInductionDrugValueChange(drug.id, e.target.value)} inputType={drug.inputType} /> ))} </div> </fieldset>
        {/* Maintenance */}
        <fieldset className="border border-slate-200 p-4 rounded-md"> <legend className="text-base font-semibold text-slate-800 px-2">Fármacos para Manutenção</legend> <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2"> {maintenanceDrugsList.map((drug) => ( <DrugInputField key={drug.id} drugName={drug.name} drugId={drug.id} unit={drug.unit} isSelected={!!selectedMaintenanceDrugs[drug.id]} value={maintenanceDrugValues[drug.id] || ''} onSelectToggle={()=> handleMaintenanceDrugSelectToggle(drug.id)} onValueChange={(e)=> handleMaintenanceDrugValueChange(drug.id, e.target.value)} inputType={drug.inputType} /> ))} </div> </fieldset>
        {/* Adjuvant */}
        <fieldset className="border border-slate-200 p-4 rounded-md"> <legend className="text-base font-semibold text-slate-800 px-2">Fármacos Adjuvantes</legend> <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2"> {adjuvantDrugsList.map((drug) => ( <DrugInputField key={drug.id} drugName={drug.name} drugId={drug.id} unit={drug.unit} isSelected={!!selectedAdjuvantDrugs[drug.id]} value={adjuvantDrugValues[drug.id] || ''} onSelectToggle={()=> handleAdjuvantDrugSelectToggle(drug.id)} onValueChange={(e)=> handleAdjuvantDrugValueChange(drug.id, e.target.value)} inputType={drug.inputType} /> ))} </div> </fieldset>
        {/* Symptomatic */}
        <fieldset className="border border-slate-200 p-4 rounded-md"> <legend className="text-base font-semibold text-slate-800 px-2">Sintomáticos</legend> <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2"> {symptomaticDrugsList.map((drug) => ( <DrugInputField key={drug.id} drugName={drug.name} drugId={drug.id} unit={drug.unit} isSelected={!!selectedSymptomaticDrugs[drug.id]} value={symptomaticDrugValues[drug.id] || ''} onSelectToggle={()=> handleSymptomaticDrugSelectToggle(drug.id)} onValueChange={(e)=> handleSymptomaticDrugValueChange(drug.id, e.target.value)} inputType={drug.inputType} /> ))} </div> </fieldset>
      </div>

      {/* Support and Intercurrences Sections */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Support Column */}
        <div className="space-y-4">
            {/* REMOVED columns prop */}
            <CheckboxGroupField label="Suporte de Oxigênio" idPrefix="oxi" options={oxigenioOptions} selectedValues={suporteOxigenioSelecionado} onChange={handleOxigenioChange} />
            <CheckboxGroupField label="Suporte Ventilatório" idPrefix="vent" options={ventilatorioOptions} selectedValues={suporteVentilatorioSelecionado} onChange={handleVentilatorioChange} />
        </div>
         {/* Intercurrences Column */}
         <fieldset className="border border-slate-200 p-4 rounded-md">
            <legend className="text-base font-semibold text-slate-800 px-2">Intercorrências</legend>
            {/* REMOVED columns prop */}
            <RadioButtonGroupField
                label="Nível de Dessaturação (se ocorrido)"
                idPrefix="dessat"
                options={dessaturacaoOptions}
                selectedValue={nivelDessaturacao}
                onChange={handleDessaturacaoChange}
                className="mb-4" // Keep margin between groups
            />
             {/* REMOVED columns prop */}
             <CheckboxGroupField
                label="Outras Intercorrências"
                idPrefix="inter"
                options={outrasIntercorrenciasOptions}
                selectedValues={outrasIntercorrencias}
                onChange={handleOutrasIntercorrenciasChange}
            />
         </fieldset>
      </div>


      {/* Temporary state display (Condensed) */}
      <div className="mt-6 p-3 bg-slate-100 rounded text-xs overflow-x-auto">
        <strong className='block mb-1'>Dados do Estado (Temporário):</strong>
        Proc: {procedimento}, Anest: {tipoAnestesia} ||
        Ind S: {JSON.stringify(selectedInductionDrugs)} V: {JSON.stringify(inductionDrugValues)} ||
        Man S: {JSON.stringify(selectedMaintenanceDrugs)} V: {JSON.stringify(maintenanceDrugValues)} ||
        Adj S: {JSON.stringify(selectedAdjuvantDrugs)} V: {JSON.stringify(adjuvantDrugValues)} ||
        Sim S: {JSON.stringify(selectedSymptomaticDrugs)} V: {JSON.stringify(symptomaticDrugValues)} ||
        Oxi: {JSON.stringify(suporteOxigenioSelecionado)} |
        Vent: {JSON.stringify(suporteVentilatorioSelecionado)} |
        Dessat: {JSON.stringify(nivelDessaturacao)} |
        Interc: {JSON.stringify(outrasIntercorrencias)}
      </div>
    </SectionCard>
  );
};

export default Intraoperatoria;