import React from 'react';

interface FormBuilderToolbarProps {
  onNewForm: () => void;
  onLoadForm: () => void; // Placeholder
  onSaveForm: () => void; // Placeholder
}

const FormBuilderToolbar: React.FC<FormBuilderToolbarProps> = ({ onNewForm, onLoadForm, onSaveForm }) => {
  return (
    <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-md shadow mb-4 flex items-center space-x-2 print:hidden">
      <button 
        onClick={onNewForm}
        className="px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm transition-colors duration-150"
      >
        New Blank Form
      </button>
      <button 
        onClick={onLoadForm}
        className="px-3 py-1.5 text-sm bg-slate-500 hover:bg-slate-600 dark:bg-slate-600 dark:hover:bg-slate-700 text-white font-semibold rounded-md shadow-sm transition-colors duration-150"
      >
        Load Form (Placeholder)
      </button>
      <button 
        onClick={onSaveForm}
        className="px-3 py-1.5 text-sm bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-semibold rounded-md shadow-sm transition-colors duration-150"
      >
        Save Form (Placeholder)
      </button>
      {/* Add more controls like form settings, preview later */}
    </div>
  );
};

export default FormBuilderToolbar; 