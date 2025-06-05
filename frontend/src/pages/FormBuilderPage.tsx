import React from 'react';

// Placeholder components for Form Builder sections
const FormBuilderToolbar: React.FC = () => (
  <div className="bg-slate-200 dark:bg-slate-700 p-3 rounded-md shadow mb-4">
    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Form Builder Toolbar (Save, Form Settings, Preview)</p>
  </div>
);

const FieldPalette: React.FC = () => (
  <div className="bg-slate-200 dark:bg-slate-700 p-4 rounded-md shadow h-full">
    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3">Field Palette</h3>
    <p className="text-sm text-slate-600 dark:text-slate-300">Draggable field types will appear here (Text, Number, Select, Custom Widgets, etc.).</p>
    {/* Example of a draggable item placeholder */}
    <div className="my-2 p-2 border border-dashed border-slate-400 dark:border-slate-500 rounded-md bg-white dark:bg-slate-600">
      <p className="text-xs text-slate-700 dark:text-slate-200">Text Input Field</p>
    </div>
    <div className="my-2 p-2 border border-dashed border-slate-400 dark:border-slate-500 rounded-md bg-white dark:bg-slate-600">
      <p className="text-xs text-slate-700 dark:text-slate-200">Drug Section Widget</p>
    </div>
  </div>
);

const FormCanvas: React.FC = () => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-md shadow-lg h-full overflow-y-auto">
    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3 border-b dark:border-slate-700 pb-2">Form Canvas</h3>
    <p className="text-sm text-slate-600 dark:text-slate-300">Drag fields here to build the form. A live-ish preview or list of fields will be shown.</p>
    <div className="mt-4 p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg min-h-[200px] flex items-center justify-center">
      <p className="text-slate-400 dark:text-slate-500">Drop Zone</p>
    </div>
  </div>
);

const PropertyInspector: React.FC = () => (
  <div className="bg-slate-200 dark:bg-slate-700 p-4 rounded-md shadow h-full">
    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3">Property Inspector</h3>
    <p className="text-sm text-slate-600 dark:text-slate-300">When a field is selected on the canvas, its properties (schema & UI schema options) will be editable here.</p>
    <div className="mt-4 p-2 border border-dashed border-slate-400 dark:border-slate-500 rounded-md bg-white dark:bg-slate-600 min-h-[100px]">
      <p className="text-xs text-slate-700 dark:text-slate-200">Field Properties...</p>
    </div>
  </div>
);

const FormBuilderPage: React.FC = () => {
  return (
    <div className="p-0 flex flex-col h-[calc(100vh-var(--header-height,4rem)-var(--page-padding,3rem))] max-h-[calc(100vh-var(--header-height,4rem)-var(--page-padding,3rem))]">
      {/* Assuming header height is 4rem (h-16) and page padding is 1.5rem top/bottom (p-6 from Layout.tsx) */}
      {/* Adjust --header-height and --page-padding if Layout.tsx main content padding changes */}
      <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4">Form Builder</h1>
      <FormBuilderToolbar />
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
        {/* Palette - takes 3 columns on large screens */}
        <div className="lg:col-span-3 min-h-0">
          <FieldPalette />
        </div>
        {/* Canvas - takes 6 columns on large screens */}
        <div className="lg:col-span-6 min-h-0">
          <FormCanvas />
        </div>
        {/* Inspector - takes 3 columns on large screens */}
        <div className="lg:col-span-3 min-h-0">
          <PropertyInspector />
        </div>
      </div>
    </div>
  );
};

export default FormBuilderPage; 