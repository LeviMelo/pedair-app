// src/components/RecuperacaoPosAnestesica.tsx
import React from 'react';
import SectionCard from './ui/SectionCard'; // Adjust import path

const RecuperacaoPosAnestesica: React.FC = () => {
  return (
    // Use SectionCard, passing the title via prop
    <SectionCard title="Recuperação Pós-Anestésica">
      {/* Form content will go here */}
      <p className="text-slate-600">Formulário de recuperação...</p>
    </SectionCard>
  );
};

export default RecuperacaoPosAnestesica;