// src/components/PreAnestesia.tsx
import React, { useState } from 'react';
import SectionCard from './ui/SectionCard';
import InputField from './ui/InputField';
import SelectField from './ui/SelectField';
import CheckboxGroupField from './ui/CheckboxGroupField'; // Import CheckboxGroupField

// --- Options Data --- (Moved outside component for clarity)
const sexoOptions = [
  { value: 'F', label: 'Feminino' },
  { value: 'M', label: 'Masculino' },
];

const diagnosticoOptions = [
  { value: 'estenose_traqueal_pos_intubacao', label: 'Estenose traqueal pós intubação' },
  { value: 'laringomalacia', label: 'Laringomalácia' },
  { value: 'fistula_traqueoesofagica', label: 'Fístula traqueoesofágica' },
  { value: 'cleft_laringeo', label: 'Cleft laríngeo' },
  { value: 'estenose_subglotica_congenita', label: 'Estenose subglótica congênita' },
  { value: 'colapso_traqueal_congenito', label: 'Colapso traqueal congênito' },
  { value: 'fibroma_epifaringeo', label: 'Fibroma epifaringeo' },
  { value: 'estreitamento_arvore_bronquica', label: 'Estreitamento da árvore brônquica' },
  { value: 'anel_vascular', label: 'Anel vascular' },
  { value: 'cisto_broncogenico', label: 'Cisto broncogênico' },
  { value: 'cisto_paravalecular', label: 'Cisto paravalecular' },
  { value: 'fistula_traqueopleural', label: 'Fístula traqueopleural' },
  { value: 'paralisia_bilateral_cordas_vocais', label: 'Paralisia bilateral de cordas vocais' },
  { value: 'papilomatose_respiratoria_recorrente', label: 'Papilomatose respiratória recorrente' },
  { value: 'hemangioma_subglotico', label: 'Hemangioma subglótico' },
  { value: 'corpo_estranho', label: 'Corpo estranho' },
];

const comorbidadeOptions = [
    { value: 'prematuridade', label: 'Prematuridade'},
    { value: 'cardiopatia_congenita', label: 'Cardiopatia congênita'},
    { value: 'sindrome_pierre_robin', label: 'Síndrome de Pierre Robin'},
    { value: 'asma', label: 'Asma'},
    { value: 'fibrose_cistica', label: 'Fibrose cística'},
    { value: 'tuberculose', label: 'Tuberculose'},
    { value: 'malformacao_pulmonar', label: 'Malformação pulmonar'},
    { value: 'imunodeficiencia', label: 'Imunodeficiência'},
    { value: 'doenca_neurologica', label: 'Doença Neurológica'},
    { value: 'disturbio_metabolico', label: 'Distúrbio metabólico'},
];

const queixaOptions = [
    { value: 'tosse_cronica', label: 'Tosse crônica'},
    { value: 'sibilancia', label: 'Sibilância'},
    { value: 'estridor', label: 'Estridor'},
    { value: 'sangramento', label: 'Sangramento'},
    { value: 'infeccoes_respiratorias_recorrentes', label: 'Infecções respiratórias recorrentes'},
    { value: 'atelectasia', label: 'Atelectasia'},
]

const PreAnestesia: React.FC = () => {
  // --- State ---
  const [idade, setIdade] = useState<string>('');
  const [peso, setPeso] = useState<string>('');
  const [sexo, setSexo] = useState<string>('');
  // State for multi-select fields (arrays of selected values)
  const [diagnosticosSelecionados, setDiagnosticosSelecionados] = useState<string[]>([]);
  const [comorbidadesSelecionadas, setComorbidadesSelecionadas] = useState<string[]>([]);
  const [queixasSelecionadas, setQueixasSelecionadas] = useState<string[]>([]);


  // --- Event Handlers ---
  const handleIdadeChange = (event: React.ChangeEvent<HTMLInputElement>) => setIdade(event.target.value);
  const handlePesoChange = (event: React.ChangeEvent<HTMLInputElement>) => setPeso(event.target.value);
  const handleSexoChange = (event: React.ChangeEvent<HTMLSelectElement>) => setSexo(event.target.value);

  // Generic handler for checkbox groups
  // Takes the current state array, the setter function, and the toggled value
  const handleCheckboxChange = (
    currentSelection: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    value: string
  ) => {
    if (currentSelection.includes(value)) {
      // If already selected, remove it
      setter(currentSelection.filter(item => item !== value));
    } else {
      // If not selected, add it
      setter([...currentSelection, value]);
    }
  };

  // Specific handlers calling the generic one
  const handleDiagnosticoChange = (value: string) => handleCheckboxChange(diagnosticosSelecionados, setDiagnosticosSelecionados, value);
  const handleComorbidadeChange = (value: string) => handleCheckboxChange(comorbidadesSelecionadas, setComorbidadesSelecionadas, value);
  const handleQueixaChange = (value: string) => handleCheckboxChange(queixasSelecionadas, setQueixasSelecionadas, value);


  // --- Rendering ---
  return (
    <SectionCard title="Avaliação Pré-Anestésica">
      {/* Basic Info Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <InputField label="Idade" id="idade" type="number" placeholder="Ex: 3" value={idade} onChange={handleIdadeChange} required />
        <InputField label="Peso (kg)" id="peso" type="number" placeholder="Ex: 14.5" value={peso} onChange={handlePesoChange} required />
        <SelectField label="Sexo" id="sexo" value={sexo} onChange={handleSexoChange} options={sexoOptions} required placeholder="Selecione..." />
      </div>

      {/* Multi-Select Rows/Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4"> {/* Use grid for layout */}
        {/* Diagnóstico */}
        <CheckboxGroupField
          label="Diagnóstico(s)"
          idPrefix="diag" // Prefix for checkbox IDs
          options={diagnosticoOptions}
          selectedValues={diagnosticosSelecionados}
          onChange={handleDiagnosticoChange}
          className="md:col-span-1" // Span one column on medium screens
        />

        {/* Comorbidades */}
        <CheckboxGroupField
          label="Comorbidade(s)"
          idPrefix="como"
          options={comorbidadeOptions}
          selectedValues={comorbidadesSelecionadas}
          onChange={handleComorbidadeChange}
          className="md:col-span-1"
        />

        {/* Queixas */}
        <CheckboxGroupField
          label="Queixa(s)"
          idPrefix="quei"
          options={queixaOptions}
          selectedValues={queixasSelecionadas}
          onChange={handleQueixaChange}
          className="md:col-span-1"
        />
      </div>

      {/* Allow adding custom diagnoses/comorbidities/complaints */}
       {/* TODO: Implement input fields for custom entries */}
       <div className="mt-4 text-sm text-slate-500">
         (Campos para adicionar Diagnóstico/Comorbidade/Queixa não listados serão adicionados aqui)
       </div>


      {/* Temporary state display */}
      <div className="mt-6 p-3 bg-slate-100 rounded text-xs overflow-x-auto">
        <strong className='block mb-1'>Dados do Estado (Temporário):</strong>
        Idade: {idade}, Peso: {peso}, Sexo: {sexo} <br />
        Diagnósticos: {JSON.stringify(diagnosticosSelecionados)} <br />
        Comorbidades: {JSON.stringify(comorbidadesSelecionadas)} <br />
        Queixas: {JSON.stringify(queixasSelecionadas)}
      </div>
    </SectionCard>
  );
};

export default PreAnestesia;