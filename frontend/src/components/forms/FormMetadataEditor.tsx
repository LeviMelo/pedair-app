// src/components/forms/FormMetadataEditor.tsx
import React from 'react';
import { InputField } from '../ui/InputField';

interface FormMetadataEditorProps {
  title: string;
  onTitleChange: (newTitle: string) => void;
  description: string;
  onDescriptionChange: (newDescription: string) => void;
  version: string;
}

const FormMetadataEditor: React.FC<FormMetadataEditorProps> = ({
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  version,
}) => {
  return (
    <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-md shadow mb-4">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3 border-b border-slate-300 dark:border-slate-600 pb-2">Form Metadata</h3>
      <div className="space-y-3">
        <InputField
          id="formBuilderTitle"
          label="Form Title"
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          containerClassName="mb-0"
        />
        <div>
          <label htmlFor="formBuilderDescription" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
            Form Description
          </label>
          <textarea
            id="formBuilderDescription"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            rows={3}
            className="mt-1 block w-full px-3 py-2 border rounded-md text-sm shadow-sm bg-white dark:bg-slate-800/50 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="Enter a brief description of the form..."
          />
        </div>
        <InputField
          id="formBuilderVersion"
          label="Form Version (Read-only)"
          type="text"
          value={version}
          onChange={() => {}}
          containerClassName="mb-0"
          readOnly
          // FIX: Use `className` to style the input itself
          className="bg-slate-200 dark:bg-slate-600 cursor-not-allowed"
        />
      </div>
    </div>
  );
};

export default FormMetadataEditor;