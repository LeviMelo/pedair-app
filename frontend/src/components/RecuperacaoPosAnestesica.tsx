// frontend/src/components/RecuperacaoPosAnestesica.tsx
import React, { useState } from 'react';
import SectionCard from './ui/SectionCard';
import RadioButtonGroupField from './ui/RadioButtonGroupField';
import CheckboxGroupField from './ui/CheckboxGroupField';

// --- Options Data ---
interface OptionInfo { value: string; label: string; }

const tempoRecuperacaoOptions: OptionInfo[] = [ { value: 'ate_30', label: 'Até 30 minutos' }, { value: 'ate_45', label: 'Até 45 minutos' }, { value: 'entre_45_60', label: 'Entre 45-60 minutos' }, { value: 'mais_60', label: '> 60 minutos' }, ];
const posDessaturacaoOptions: OptionInfo[] = [ { value: 'dessaturacao_85_92', label: 'Dessaturação (85-92%)'}, { value: 'dessaturacao_75_85', label: 'Dessaturação (75-85%)'}, { value: 'dessaturacao_lt_70', label: 'Dessaturação (<70%)'}, ];
const outrasQueixasPosOptions: OptionInfo[] = [ { value: 'broncoespasmo', label: 'Broncoespasmo'}, { value: 'laringoespasmo', label: 'Laringoespasmo'}, { value: 'sangramento', label: 'Sangramento'}, { value: 'tosse', label: 'Tosse'}, { value: 'dor', label: 'Dor'}, { value: 'vomitos', label: 'Vômitos'}, { value: 'prurido', label: 'Prurido'}, { value: 'sialorreia', label: 'Sialorreia'}, ];

// State types
type SelectedOptions = string[];
type SelectedRadio = string | number | null;

const RecuperacaoPosAnestesica: React.FC = () => {
  // --- State ---
  const [tempoRecuperacao, setTempoRecuperacao] = useState<SelectedRadio>(null);
  const [nivelDessaturacaoPos, setNivelDessaturacaoPos] = useState<SelectedRadio>(null);
  const [outrasQueixasPos, setOutrasQueixasPos] = useState<SelectedOptions>([]);

  // --- Event Handlers ---
  const handleTempoRecuperacaoChange = (value: string | number) => setTempoRecuperacao(value);
  const handleDessaturacaoPosChange = (value: string | number) => setNivelDessaturacaoPos(value);
  const handleCheckboxChange = (sel: string[], setSel: React.Dispatch<React.SetStateAction<string[]>>, val: string) => { if (sel.includes(val)) { setSel(sel.filter(i => i !== val)); } else { setSel([...sel, val]); } };
  const handleOutrasQueixasPosChange = (value: string) => handleCheckboxChange(outrasQueixasPos, setOutrasQueixasPos, value);

  // --- Rendering ---
  return (
    <SectionCard title="Recuperação Pós-Anestésica">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Intercorrências / Queixas Column */}
            <fieldset className="border border-slate-200 p-4 rounded-md md:col-span-1 bg-white space-y-4"> {/* Added bg and spacing */}
                <legend className="text-base font-semibold text-slate-800 px-2 -mb-2">Intercorrências / Queixas</legend> {/* Adjusted margin */}
                {/* Desaturation Radio Group - now visually grouped */}
                <RadioButtonGroupField
                    label="Nível de Dessaturação (se ocorrido)"
                    idPrefix="pos-dessat"
                    options={posDessaturacaoOptions}
                    selectedValue={nivelDessaturacaoPos}
                    onChange={handleDessaturacaoPosChange}
                    className="pt-2" // Add padding top for spacing from legend
                />
                 {/* Divider or just space */}
                 <hr className="border-slate-200" />
                {/* Other Complaints Checkbox Group */}
                <CheckboxGroupField
                    label="Outras Ocorrências/Queixas"
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
                    required
                    className="border border-slate-200 p-4 rounded-md bg-white h-full" // Added style to match fieldset
                />
             </div>

        </div>

      {/* Temporary state display */}
      <div className="mt-6 p-3 bg-slate-100 rounded text-xs overflow-x-auto">
        <strong className='block mb-1'>Dados do Estado (Temporário):</strong>
        Tempo Rec: {JSON.stringify(tempoRecuperacao)} |
        Dessat Pós: {JSON.stringify(nivelDessaturacaoPos)} |
        Outras Queixas: {JSON.stringify(outrasQueixasPos)}
      </div>
    </SectionCard>
  );
};

export default RecuperacaoPosAnestesica;