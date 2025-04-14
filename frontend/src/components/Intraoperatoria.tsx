// frontend/src/components/Intraoperatoria.tsx
import React, { useState } from 'react';
import SectionCard from './ui/SectionCard';
import SelectField from './ui/SelectField';
import DrugInputField from './ui/DrugInputField'; // Import DrugInputField

// --- Options & Data Structures ---

// Options for Procedimento dropdown
const procedimentoOptions = [
  { value: 'broncoscopia_flexivel', label: 'Broncoscopia flexível' },
  { value: 'broncoscopia_rigida', label: 'Broncoscopia rígida' },
  { value: 'traqueoscopia', label: 'Traqueoscopia' },
  { value: 'dilatacao_traqueal', label: 'Dilatação Traqueal' },
  { value: 'traqueoplastia', label: 'Traqueoplastia' },
];

// Options for Anestesia dropdown
const anestesiaOptions = [
  { value: 'geral', label: 'Geral' },
  { value: 'sedacao_profunda', label: 'Sedação Profunda' },
];

// Define structure for drug list items
interface DrugInfo {
    name: string;
    id: string;
    unit: string;
    inputType?: 'text' | 'number'; // Optional specific input type
}

// Define drug lists
const inductionDrugsList: DrugInfo[] = [
  { name: 'Lidocaína', id: 'lido', unit: 'mg' },
  { name: 'Fentanil', id: 'fenta', unit: 'mcg' },
  { name: 'Sufentanil', id: 'sufenta', unit: 'mcg' },
  { name: 'Alfentanil', id: 'alfenta', unit: 'mcg' },
  { name: 'Dexmedetomidina', id: 'dexme_ind', unit: 'mcg' },
  { name: 'Cetamina', id: 'keta', unit: 'mg' },
  { name: 'Midazolam', id: 'mida', unit: 'mg' },
  { name: 'Propofol', id: 'propo_ind', unit: 'mg' },
  { name: 'Etomidato', id: 'etomi', unit: 'mg' },
  { name: 'Sevoflurano', id: 'sevo_ind', unit: '%', inputType: 'text'},
];

const maintenanceDrugsList: DrugInfo[] = [
    { name: 'Remifentanil', id: 'remi', unit: 'mcg/kg/min' },
    { name: 'Propofol', id: 'propo_maint', unit: 'mcg/kg/min' }, // Unique ID
    { name: 'Dexmedetomidina', id: 'dexme_maint', unit: 'mcg/kg/h' }, // Unique ID
    { name: 'Sevoflurano', id: 'sevo_maint', unit: '%', inputType: 'text' }, // Unique ID
];

// Interface for drug state values (dose/rate)
interface DrugValues {
  [drugId: string]: string;
}

// Interface for selected drugs state
interface SelectedDrugs {
    [drugId: string]: boolean;
}

const Intraoperatoria: React.FC = () => {
  // --- State ---
  const [procedimento, setProcedimento] = useState<string>('');
  const [tipoAnestesia, setTipoAnestesia] = useState<string>('');

  // State for Induction Drugs
  const [selectedInductionDrugs, setSelectedInductionDrugs] = useState<SelectedDrugs>({});
  const [inductionDrugValues, setInductionDrugValues] = useState<DrugValues>({});

  // State for Maintenance Drugs
  const [selectedMaintenanceDrugs, setSelectedMaintenanceDrugs] = useState<SelectedDrugs>({});
  const [maintenanceDrugValues, setMaintenanceDrugValues] = useState<DrugValues>({});

  // TODO: Add state for Adjuvant, Symptomatic drugs

  // --- Event Handlers ---
  const handleProcedimentoChange = (event: React.ChangeEvent<HTMLSelectElement>) => setProcedimento(event.target.value);
  const handleTipoAnestesiaChange = (event: React.ChangeEvent<HTMLSelectElement>) => setTipoAnestesia(event.target.value);

  // Generic handler for Toggling Drug Selection state
  const handleDrugSelectToggle = (
    drugId: string,
    currentSelected: SelectedDrugs,
    setterSelected: React.Dispatch<React.SetStateAction<SelectedDrugs>>,
    setterValues: React.Dispatch<React.SetStateAction<DrugValues>> // Pass value setter to clear on deselect
   ) => {
    const isCurrentlySelected = !!currentSelected[drugId];
    setterSelected(prevSelected => ({
      ...prevSelected,
      [drugId]: !isCurrentlySelected
    }));

    // Clear value if it was previously selected and now being deselected
    if (isCurrentlySelected) {
        setterValues(prevValues => {
            const newValues = {...prevValues};
            delete newValues[drugId];
            return newValues;
        });
    }
  };

  // Generic handler for Changing Drug Value state
   const handleDrugValueChange = (
       drugId: string,
       value: string,
       setterValues: React.Dispatch<React.SetStateAction<DrugValues>>
   ) => {
       setterValues(prevValues => ({
           ...prevValues,
           [drugId]: value
       }));
   };

  // --- Specific Drug Handlers ---

  // Induction
  const handleInductionDrugSelectToggle = (drugId: string) => handleDrugSelectToggle(drugId, selectedInductionDrugs, setSelectedInductionDrugs, setInductionDrugValues);
  const handleInductionDrugValueChange = (drugId: string, value: string) => handleDrugValueChange(drugId, value, setInductionDrugValues);

  // Maintenance
  const handleMaintenanceDrugSelectToggle = (drugId: string) => handleDrugSelectToggle(drugId, selectedMaintenanceDrugs, setSelectedMaintenanceDrugs, setMaintenanceDrugValues);
  const handleMaintenanceDrugValueChange = (drugId: string, value: string) => handleDrugValueChange(drugId, value, setMaintenanceDrugValues);

  // TODO: Add specific handlers for Adjuvant, Symptomatic drugs

  // --- Rendering ---
  return (
    <SectionCard title="Intraoperatória">
      {/* Procedure and Anesthesia Type Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <SelectField label="Procedimento" id="procedimento" value={procedimento} onChange={handleProcedimentoChange} options={procedimentoOptions} placeholder="Selecione..." required />
        <SelectField label="Anestesia" id="anestesia" value={tipoAnestesia} onChange={handleTipoAnestesiaChange} options={anestesiaOptions} placeholder="Selecione..." required />
      </div>

      {/* Induction Drugs Section */}
      <fieldset className="mb-6 border border-slate-200 p-4 rounded-md">
        <legend className="text-base font-semibold text-slate-800 px-2">Fármacos para Indução</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
          {inductionDrugsList.map((drug) => (
            <DrugInputField
              key={drug.id}
              drugName={drug.name}
              drugId={drug.id}
              unit={drug.unit}
              isSelected={!!selectedInductionDrugs[drug.id]}
              value={inductionDrugValues[drug.id] || ''}
              onSelectToggle={() => handleInductionDrugSelectToggle(drug.id)}
              onValueChange={(e) => handleInductionDrugValueChange(drug.id, e.target.value)}
              inputType={drug.inputType}
            />
          ))}
        </div>
      </fieldset>

       {/* Maintenance Drugs Section */}
      <fieldset className="mb-6 border border-slate-200 p-4 rounded-md">
        <legend className="text-base font-semibold text-slate-800 px-2">Fármacos para Manutenção</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
          {maintenanceDrugsList.map((drug) => (
            <DrugInputField
              key={drug.id}
              drugName={drug.name}
              drugId={drug.id}
              unit={drug.unit}
              isSelected={!!selectedMaintenanceDrugs[drug.id]}
              value={maintenanceDrugValues[drug.id] || ''}
              onSelectToggle={() => handleMaintenanceDrugSelectToggle(drug.id)}
              onValueChange={(e) => handleMaintenanceDrugValueChange(drug.id, e.target.value)}
              inputType={drug.inputType}
            />
          ))}
        </div>
      </fieldset>


      {/* Placeholders for other sections */}
       <div className="space-y-4">
          {/* Placeholders are now reduced as we implement sections */}
          <div className="p-4 bg-slate-100 rounded text-slate-500"> (Fármacos adjuvantes aqui...) </div>
          <div className="p-4 bg-slate-100 rounded text-slate-500"> (Sintomáticos aqui...) </div>
          <div className="p-4 bg-slate-100 rounded text-slate-500"> (Suporte de oxigênio aqui...) </div>
          <div className="p-4 bg-slate-100 rounded text-slate-500"> (Suporte ventilatório aqui...) </div>
          <div className="p-4 bg-slate-100 rounded text-slate-500"> (Intercorrências aqui...) </div>
      </div>


      {/* Temporary state display */}
      <div className="mt-6 p-3 bg-slate-100 rounded text-xs overflow-x-auto">
        <strong className='block mb-1'>Dados do Estado (Temporário):</strong>
        Procedimento: {procedimento}, Anestesia: {tipoAnestesia} <br />
        Indução Selecionados: {JSON.stringify(selectedInductionDrugs)} | Valores: {JSON.stringify(inductionDrugValues)} <br />
        Manutenção Selecionados: {JSON.stringify(selectedMaintenanceDrugs)} | Valores: {JSON.stringify(maintenanceDrugValues)}
        {/* TODO: Display state for other drug categories */}
      </div>
    </SectionCard>
  );
};

export default Intraoperatoria