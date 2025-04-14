// frontend/src/components/PreAnestesia.tsx
import React, { useState } from 'react';
import SectionCard from './ui/SectionCard';
import InputField from './ui/InputField';
import SelectField from './ui/SelectField';
import QuickSelectButtons from './ui/QuickSelectButtons';
import AutocompleteInput, { AutocompleteOption } from './ui/AutocompleteInput';
import SelectedItemTags from './ui/SelectedItemTags';

// --- Options Data ---
const sexoOptions = [ { value: 'F', label: 'Feminino' }, { value: 'M', label: 'Masculino' }, ];

// Using a more generic type for selected items now
interface SelectedItem { value: string; label: string; [key: string]: any; }

// --- Diagnoses Data ---
const commonDiagnoses: AutocompleteOption[] = [
  { value: 'laringomalacia', label: 'Laringomalácia', icd10: 'J38.5' },
  { value: 'estenose_subglotica_congenita', label: 'Estenose subglótica congênita', icd10: 'Q31.1' },
  { value: 'fistula_traqueoesofagica', label: 'Fístula traqueoesofágica', icd10: 'Q39.2' },
  { value: 'cleft_laringeo', label: 'Cleft laríngeo', icd10: 'Q31.8' },
  { value: 'paralisia_bilateral_cordas_vocais', label: 'Paralisia bilateral de cordas vocais', icd10: 'J38.0' },
];
const allDiagnosesSample: AutocompleteOption[] = [
  ...commonDiagnoses,
  { value: 'estenose_traqueal_pos_intubacao', label: 'Estenose traqueal pós intubação', icd10: 'J95.5' }, { value: 'colapso_traqueal_congenito', label: 'Colapso traqueal congênito', icd10: 'Q32.1' }, { value: 'fibroma_epifaringeo', label: 'Fibroma epifaringeo', icd10: 'D10.6' }, { value: 'estreitamento_arvore_bronquica', label: 'Estreitamento da árvore brônquica', icd10: 'Q32.4' }, { value: 'anel_vascular', label: 'Anel vascular', icd10: 'Q25.7' }, { value: 'cisto_broncogenico', label: 'Cisto broncogênico', icd10: 'Q32.4' }, { value: 'cisto_paravalecular', label: 'Cisto paravalecular', icd10: 'J38.6' }, { value: 'fistula_traqueopleural', label: 'Fístula traqueopleural', icd10: 'J86.0' }, { value: 'papilomatose_respiratoria_recorrente', label: 'Papilomatose respiratória recorrente', icd10: 'D14.1' }, { value: 'hemangioma_subglotico', label: 'Hemangioma subglótico', icd10: 'D18.03' }, { value: 'corpo_estranho', label: 'Corpo estranho', icd10: 'T17._' },
];

// --- Comorbidities Data ---
const commonComorbidades: AutocompleteOption[] = [ // No ICD codes needed here generally
    { value: 'prematuridade', label: 'Prematuridade' }, { value: 'cardiopatia_congenita', label: 'Cardiopatia congênita' },
    { value: 'asma', label: 'Asma' }, { value: 'sindrome_pierre_robin', label: 'Síndrome de Pierre Robin'}, { value: 'doenca_neurologica', label: 'Doença Neurológica'},
];
const allComorbidadesSample: AutocompleteOption[] = [
    ...commonComorbidades,
    { value: 'fibrose_cistica', label: 'Fibrose cística'}, { value: 'tuberculose', label: 'Tuberculose'},
    { value: 'malformacao_pulmonar', label: 'Malformação pulmonar'}, { value: 'imunodeficiencia', label: 'Imunodeficiência'},
    { value: 'disturbio_metabolico', label: 'Distúrbio metabólico'}
];

// --- Queixas Data ---
const commonQueixas: AutocompleteOption[] = [
    { value: 'tosse_cronica', label: 'Tosse crônica'}, { value: 'estridor', label: 'Estridor'},
    { value: 'infeccoes_respiratorias_recorrentes', label: 'Infecções respiratórias recorrentes'},
    { value: 'sibilancia', label: 'Sibilância'}, { value: 'sangramento', label: 'Sangramento'},
];
const allQueixasSample: AutocompleteOption[] = [
    ...commonQueixas, { value: 'atelectasia', label: 'Atelectasia'}
];


const PreAnestesia: React.FC = () => {
  // --- State ---
  const [idade, setIdade] = useState<string>('');
  const [peso, setPeso] = useState<string>('');
  const [sexo, setSexo] = useState<string>('');
  const [diagnosticos, setDiagnosticos] = useState<SelectedItem[]>([]); // Use generic SelectedItem type
  const [comorbidades, setComorbidades] = useState<SelectedItem[]>([]);
  const [queixas, setQueixas] = useState<SelectedItem[]>([]);


  // --- Event Handlers ---
  const handleIdadeChange = (event: React.ChangeEvent<HTMLInputElement>) => setIdade(event.target.value);
  const handlePesoChange = (event: React.ChangeEvent<HTMLInputElement>) => setPeso(event.target.value);
  const handleSexoChange = (event: React.ChangeEvent<HTMLSelectElement>) => setSexo(event.target.value);

  // --- Generic Handlers for Tag Selection System ---
  const handleQuickToggle = (
    value: string,
    currentSelection: SelectedItem[],
    setter: React.Dispatch<React.SetStateAction<SelectedItem[]>>,
    sourceList: AutocompleteOption[] // Need the source to get the full object
  ) => {
    const existingIndex = currentSelection.findIndex(item => item.value === value);
    if (existingIndex > -1) {
      setter(currentSelection.filter(item => item.value !== value)); // Remove
    } else {
      const itemToAdd = sourceList.find(item => item.value === value); // Find object
      if (itemToAdd) {
        setter([...currentSelection, itemToAdd]); // Add object
      }
    }
  };

  const handleAutocompleteSelect = (
    selectedOption: AutocompleteOption | null,
    currentSelection: SelectedItem[],
    setter: React.Dispatch<React.SetStateAction<SelectedItem[]>>
  ) => {
    // Add only if selected and not already in the list
    if (selectedOption && !currentSelection.some(item => item.value === selectedOption.value)) {
      setter([...currentSelection, selectedOption]);
    }
  };

  const handleTagRemove = (
    valueToRemove: string,
    setter: React.Dispatch<React.SetStateAction<SelectedItem[]>>
  ) => {
    setter(currentSelection => currentSelection.filter(item => item.value !== valueToRemove));
  };

  // --- Specific Handlers ---
  const handleDiagnosisToggle = (value: string) => handleQuickToggle(value, diagnosticos, setDiagnosticos, allDiagnosesSample);
  const handleDiagnosisSelect = (sel: AutocompleteOption | null) => handleAutocompleteSelect(sel, diagnosticos, setDiagnosticos);
  const handleDiagnosisRemove = (value: string) => handleTagRemove(value, setDiagnosticos);

  const handleComorbidityToggle = (value: string) => handleQuickToggle(value, comorbidades, setComorbidades, allComorbidadesSample);
  const handleComorbiditySelect = (sel: AutocompleteOption | null) => handleAutocompleteSelect(sel, comorbidades, setComorbidades);
  const handleComorbidityRemove = (value: string) => handleTagRemove(value, setComorbidades);

  const handleQueixaToggle = (value: string) => handleQuickToggle(value, queixas, setQueixas, allQueixasSample);
  const handleQueixaSelect = (sel: AutocompleteOption | null) => handleAutocompleteSelect(sel, queixas, setQueixas);
  const handleQueixaRemove = (value: string) => handleTagRemove(value, setQueixas);


  // --- Rendering ---
  return (
    <SectionCard title="Avaliação Pré-Anestésica">
      {/* Basic Info Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <InputField label="Idade" id="idade" type="number" placeholder="Ex: 3" value={idade} onChange={handleIdadeChange} required />
        <InputField label="Peso (kg)" id="peso" type="number" placeholder="Ex: 14.5" value={peso} onChange={handlePesoChange} required />
        <SelectField label="Sexo" id="sexo" value={sexo} onChange={handleSexoChange} options={sexoOptions} required placeholder="Selecione..." />
      </div>

      {/* Grid for Multi-Select Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"> {/* 3 columns on large screens */}

        {/* Diagnosis Section */}
        <div className="lg:col-span-1"> {/* Takes 1 of 3 columns */}
          <h3 className="text-sm font-medium text-slate-700 mb-2">Diagnóstico(s)</h3>
          <div className='p-4 border border-slate-200 rounded-md space-y-4 bg-white'> {/* Container with background */}
            <div>
              <label className='block text-xs font-medium text-slate-500 mb-1'>Comuns:</label>
              <QuickSelectButtons options={commonDiagnoses} selectedValues={diagnosticos.map(d => d.value)} onToggle={handleDiagnosisToggle}/>
            </div>
            <AutocompleteInput label="Buscar Outro Diagnóstico (Simulado):" id="diag-search" options={allDiagnosesSample} onSelect={handleDiagnosisSelect} placeholder='Digite nome ou código ICD...' />
            <div>
              <label className='block text-xs font-medium text-slate-500 mb-1'>Selecionados:</label>
              <SelectedItemTags items={diagnosticos} onRemove={handleDiagnosisRemove} noItemsText="-" />
            </div>
          </div>
        </div>

        {/* Comorbidities Section */}
        <div className="lg:col-span-1">
           <h3 className="text-sm font-medium text-slate-700 mb-2">Comorbidade(s)</h3>
           <div className='p-4 border border-slate-200 rounded-md space-y-4 bg-white'>
             <div>
               <label className='block text-xs font-medium text-slate-500 mb-1'>Comuns:</label>
               <QuickSelectButtons options={commonComorbidades} selectedValues={comorbidades.map(d => d.value)} onToggle={handleComorbidityToggle}/>
             </div>
             <AutocompleteInput label="Buscar Outra Comorbidade (Simulada):" id="como-search" options={allComorbidadesSample} onSelect={handleComorbiditySelect} placeholder='Digite para buscar...' />
             <div>
               <label className='block text-xs font-medium text-slate-500 mb-1'>Selecionadas:</label>
               <SelectedItemTags items={comorbidades} onRemove={handleComorbidityRemove} noItemsText="-" />
             </div>
           </div>
         </div>

        {/* Queixas Section */}
        <div className="lg:col-span-1">
           <h3 className="text-sm font-medium text-slate-700 mb-2">Queixa(s)</h3>
           <div className='p-4 border border-slate-200 rounded-md space-y-4 bg-white'>
             <div>
               <label className='block text-xs font-medium text-slate-500 mb-1'>Comuns:</label>
               <QuickSelectButtons options={commonQueixas} selectedValues={queixas.map(d => d.value)} onToggle={handleQueixaToggle}/>
             </div>
             <AutocompleteInput label="Buscar Outra Queixa (Simulada):" id="quei-search" options={allQueixasSample} onSelect={handleQueixaSelect} placeholder='Digite para buscar...' />
             <div>
               <label className='block text-xs font-medium text-slate-500 mb-1'>Selecionadas:</label>
               <SelectedItemTags items={queixas} onRemove={handleQueixaRemove} noItemsText="-" />
             </div>
           </div>
         </div>
      </div>


      {/* Temporary state display */}
      <div className="mt-6 p-3 bg-slate-100 rounded text-xs overflow-x-auto">
        <strong className='block mb-1'>Dados do Estado (Temporário):</strong>
        Idade: {idade}, Peso: {peso}, Sexo: {sexo} <br />
        Diagnósticos: {JSON.stringify(diagnosticos)} <br />
        Comorbidades: {JSON.stringify(comorbidades)} <br />
        Queixas: {JSON.stringify(queixas)}
      </div>
    </SectionCard>
  );
};

export default PreAnestesia;