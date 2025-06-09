import React, { useState } from 'react';
import DynamicFormRenderer from '../components/forms/DynamicFormRenderer';
import { SectionCard } from '../components/ui/SectionCard'; // Assuming SectionCard can be used for layout

// Import the schemas
import recuperacaoSchema from '../schemas/recuperacaoPosAnestesica.schema.json';
import recuperacaoUiSchema from '../schemas/recuperacaoPosAnestesica.uiSchema.json';

const TestRecuperacaoFormPage: React.FC = () => {
  const [formData, setFormData] = useState<any>({
    tempoRecuperacao: null,       // Initial value from schema (or default)
    nivelDessaturacaoPos: null,   // Initial value from schema (or default)
    outrasQueixasPos: [],         // Initial value for array type
  });

  const handleFormDataChange = (updatedData: any) => {
    setFormData(updatedData);
  };

  return (
    <div className="container mx-auto p-4">
      <SectionCard title="Test Dynamic Form - Recuperação Pós-Anestésica">
        <DynamicFormRenderer
          schema={recuperacaoSchema}
          uiSchema={recuperacaoUiSchema}
          formData={formData}
          onFormDataChange={handleFormDataChange}
        />
        <div className="mt-6 p-3 bg-slate-100 rounded text-xs overflow-x-auto">
          <strong className='block mb-1'>Live FormData State:</strong>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
      </SectionCard>
    </div>
  );
};

export default TestRecuperacaoFormPage; 