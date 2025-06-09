import React, { useState } from 'react';
import DynamicFormRenderer from '../components/forms/DynamicFormRenderer';
import schema from '../schemas/preAnestesia.schema.json';
import uiSchema from '../schemas/preAnestesia.uiSchema.json';
import { SectionCard } from '../components/ui/SectionCard';

// formData for PreAnestesia is largely handled by AutocompleteTagSelectorWidget 
// which imports options directly based on uiSchema's 'ui:options': { optionsKey: '...' }
// So, formDataSources prop might not be strictly needed here unless other widgets require it.

const TestPreAnestesiaFormPage: React.FC = () => {
  const [currentFormData, setCurrentFormData] = useState<any>({});

  const handleFormDataChange = (updatedData: any) => {
    setCurrentFormData(updatedData);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Submitting PreAnestesia Form Data:', currentFormData);
    alert('PreAnestesia form submitted! Check console for data.');
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <SectionCard title="Teste do Formulário Dinâmico: Pré-Anestesia">
        <form onSubmit={handleSubmit}>
          <DynamicFormRenderer
            schema={schema as any}
            uiSchema={uiSchema as any}
            formData={currentFormData}
            onFormDataChange={handleFormDataChange}
          />
          <div className="mt-6">
            <button 
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-150"
            >
              Salvar Pré-Anestesia (Teste)
            </button>
          </div>
        </form>
      </SectionCard>
    </div>
  );
};

export default TestPreAnestesiaFormPage; 