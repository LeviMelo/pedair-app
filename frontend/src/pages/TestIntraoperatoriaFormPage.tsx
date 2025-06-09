import React, { useState } from 'react';
import DynamicFormRenderer from '../components/forms/DynamicFormRenderer';
import { SectionCard } from '../components/ui/SectionCard'; // Assuming SectionCard can be used for layout

// Import the schemas
import intraoperatoriaSchema from '../schemas/intraoperatoria.schema.json';
import intraoperatoriaUiSchema from '../schemas/intraoperatoria.uiSchema.json';

const initialIntraOpFormData = {
  procedimento: null,
  tipoAnestesia: null,
  farmacosInducao: { selectedDrugs: {}, drugValues: {} },
  farmacosManutencao: { selectedDrugs: {}, drugValues: {} },
  farmacosAdjuvantes: { selectedDrugs: {}, drugValues: {} },
  sintomaticos: { selectedDrugs: {}, drugValues: {} }, // Matches schema key
  suporteOxigenioSelecionado: [],
  suporteVentilatorioSelecionado: [],
  nivelDessaturacao: null,
  outrasIntercorrencias: [],
};

const TestIntraoperatoriaFormPage: React.FC = () => {
  const [formData, setFormData] = useState<any>(initialIntraOpFormData);

  const handleFormDataChange = (updatedData: any) => {
    setFormData(updatedData);
  };

  return (
    <div className="container mx-auto p-4">
      <SectionCard title="Test Dynamic Form - Intraoperatória">
        <DynamicFormRenderer
          schema={intraoperatoriaSchema}
          uiSchema={intraoperatoriaUiSchema}
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

export default TestIntraoperatoriaFormPage; 