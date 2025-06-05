import React from 'react';

interface SchemaEditorProps {
  id: string;
  title: string;
  jsonString: string;
  onJsonStringChange: (newJsonString: string) => void;
  error: string | null;
  height?: string; // e.g., '300px' or '50vh'
  textareaClassName?: string; // Allow passing additional classes to textarea
}

const SchemaEditor: React.FC<SchemaEditorProps> = ({
  id,
  title,
  jsonString,
  onJsonStringChange,
  error,
  height = '400px',
  textareaClassName = '',
}) => {

  const finalTextAreaClassName = [
    'textarea-base',
    'w-full', // Keep existing layout/sizing classes
    'flex-grow',
    'font-mono', // Keep specific font style
    'shadow-inner', // Keep specific shadow style
    error ? 'border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500 dark:focus:ring-red-400' : '',
    textareaClassName, // Allow external override/extension
  ].filter(Boolean).join(' ');

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-md shadow flex flex-col h-full">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">{title}</h3>
      <textarea
        id={id}
        value={jsonString}
        onChange={(e) => onJsonStringChange(e.target.value)}
        className={finalTextAreaClassName}
        placeholder='Enter JSON schema here...'
        spellCheck="false"
        style={{ height: height }}
      />
      {error && (
        <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-2 rounded-md">
          <strong className="font-semibold">Parsing Error:</strong> {error}
        </p>
      )}
    </div>
  );
};

export default SchemaEditor; 