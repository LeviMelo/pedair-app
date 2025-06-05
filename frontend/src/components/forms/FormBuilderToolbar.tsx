import React from 'react';

interface FormBuilderToolbarProps {
  onNewForm: () => void;
  onLoadForm: () => void; // Placeholder
  onSaveForm: () => void; // Placeholder
}

const FormBuilderToolbar: React.FC<FormBuilderToolbarProps> = ({ onNewForm, onLoadForm, onSaveForm }) => {
  return (
    <div className="bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 dark:from-slate-700 dark:via-slate-700 dark:to-slate-700 p-3 rounded-xl shadow-lg mb-4 flex items-center space-x-2 print:hidden border border-slate-200/50 dark:border-slate-600/50">
      <button 
        onClick={onNewForm}
        className="px-3 py-1.5 text-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-500 dark:hover:to-blue-600 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/25 transition-all duration-150 hover:scale-105"
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