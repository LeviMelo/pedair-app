import React from 'react';

interface SchemaEditorProps {
  id: string;
  title: string;
  jsonString: string;
  onJsonStringChange: (newJsonString: string) => void;
  error: string | null;
  height?: string; // e.g., '300px' or '50vh'
}

const SchemaEditor: React.FC<SchemaEditorProps> = ({
  id,
  title,
  jsonString,
  onJsonStringChange,
  error,
  height = '400px',
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-md shadow flex flex-col h-full">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">{title}</h3>
      <textarea
        id={id}
        value={jsonString}
        onChange={(e) => onJsonStringChange(e.target.value)}
        className={`w-full flex-grow p-2.5 border rounded-md font-mono text-sm shadow-inner 
                   bg-slate-50 dark:bg-slate-900/70 
                   text-slate-900 dark:text-slate-100 
                   border-slate-300 dark:border-slate-600 
                   focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 
                   dark:focus:border-blue-500 dark:focus:ring-blue-500 
                   ${error ? 'border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500 dark:focus:ring-red-400' : ''}`}
        placeholder='Enter JSON schema here...'
        spellCheck="false"
        style={{ height: height }} // Apply dynamic height
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