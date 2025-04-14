// frontend/src/components/RecuperacaoPosAnestesica.tsx
import React, { useState } from 'react';
import SectionCard from './ui/SectionCard';
import RadioButtonGroupField from './ui/RadioButtonGroupField'; // Use for exclusive choices
import CheckboxGroupField from './ui/CheckboxGroupField';    // Use for multi-select choices

// --- Options Data ---
interface OptionInfo { value: string; label: string; }

// Options for Recovery Time (Exclusive Choice)
const tempoRecuperacaoOptions: OptionInfo[] = [
    { value: 'ate_30', label: 'Até 30 minutos' },
    { value: 'ate_45', label: 'Até 45 minutos' },
    { value: 'entre_45_60', label: 'Entre 45-60 minutos' },
    { value: 'mais_60', label: '> 60 minutos' },
];

// Options for Post-Anesthetic Intercurrences/Complaints
// Split into exclusive (desaturation) and multi-select (others)
const posDessaturacaoOptions: OptionInfo[] = [ // For Radio Buttons
    { value: 'dessaturacao_85_92', label: 'Dessaturação (85-92%)'},
    { value: 'dessaturacao_75_85', label: 'Dessaturação (75-85%)'},
    { value: 'dessaturacao_lt_70', label: 'Dessaturação (<70%)'},
];

const outrasQueixasPosOptions: OptionInfo[] = [ // For Checkboxes
    { value: 'broncoespasmo', label: 'Broncoespasmo'},
    { value: 'laringoespasmo', label: 'Laringoespasmo'},
    { value: 'sangramento', label: 'Sangramento'},
    { value: 'tosse', label: 'Tosse'},
    { value: 'dor', label: 'Dor'},
    { value: 'vomitos', label: 'Vômitos'},
    { value: 'prurido', label: 'Prurido'},
    { value: 'sialorreia', label: 'Sialorreia'},
];

// State types
type SelectedOptions = string[];
type SelectedRadio = string | number | null;

const RecuperacaoPosAnestesica: React.FC = () => {
  // --- State ---
  const [tempoRecuperacao, setTempoRecuperacao] = useState<SelectedRadio>(null);
  const [nivelDessaturacaoPos, setNivelDessaturacaoPos] = useState<SelectedRadio>(null);
  const [outrasQueixasPos, setOutrasQueixasPos] = useState<SelectedOptions>([]);

  // --- Event Handlers ---
  const handleTempoRecuperacaoChange = (value: string | number) => {
    setTempoRecuperacao(value);
  };

  const handleDessaturacaoPosChange = (value: string | number) => {
    setNivelDessaturacaoPos(value);
  };

  // Reusing generic handler logic from Intraoperatoria (could be extracted to a hook later)
  const handleCheckboxChange = (
    currentSelection: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    value: string
   ) => {
    if (currentSelection.includes(value)) {
      setter(currentSelection.filter(item => item !== value));
    } else {
      setter([...currentSelection, value]);
    }
  };

  const handleOutrasQueixasPosChange = (value: string) => {
    handleCheckboxChange(outrasQueixasPos, setOutrasQueixasPos, value);
  };

  // --- Rendering ---
  return (
    <SectionCard title="Recuperação Pós-Anestésica">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Two columns layout */}

            {/* Intercorrências / Queixas Column */}
            <fieldset className="border border-slate-200 p-4 rounded-md md:col-span-1">
                <legend className="text-base font-semibold text-slate-800 px-2 mb-3">Intercorrências / Queixas</legend>
                {/* Desaturation Radio Group */}
                <RadioButtonGroupField
                    label="Nível de Dessaturação (se ocorrido)"
                    idPrefix="pos-dessat"
                    options={posDessaturacaoOptions}
                    selectedValue={nivelDessaturacaoPos}
                    onChange={handleDessaturacaoPosChange}
                    className="mb-4" // Space below radio group
                />
                {/* Other Complaints Checkbox Group */}
                <CheckboxGroupField
                    label="Outras"
                    idPrefix="pos-queixa"
                    options={outrasQueixasPosOptions}
                    selectedValues={outrasQueixasPos}
                    onChange={handleOutrasQueixasPosChange}
                />
            </fieldset>

             {/* Recovery Time Column */}
             <div className="md:col-span-1">
                <RadioButtonGroupField
                    label="Tempo de Recuperação (Aldrette > 9)"
                    idPrefix="tempo-rec"
                    options={tempoRecuperacaoOptions}
                    selectedValue={tempoRecuperacao}
                    onChange={handleTempoRecuperacaoChange}
                    required // Assuming this is required information
                />
             </div>

        </div>

      {/* Temporary state display */}
      <div className="mt-6 p-3 bg-slate-100 rounded text-xs overflow-x-auto">
        <strong className='block mb-1'>Dados do Estado (Temporário):</strong>
        Tempo Recuperação: {JSON.stringify(tempoRecuperacao)} <br />
        Dessaturação Pós: {JSON.stringify(nivelDessaturacaoPos)} <br />
        Outras Queixas Pós: {JSON.stringify(outrasQueixasPos)}
      </div>
    </SectionCard>
  );
};

export default RecuperacaoPosAnestesica;