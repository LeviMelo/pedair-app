import React from 'react';

const DataSubmissionPage: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Data Submission</h1>
      <p className="text-slate-600 dark:text-slate-300">Users will select and fill out clinical forms here. This page might list available forms or directly load a specific form.</p>
      {/* Placeholder for form listing or rendering */}
      <div className="mt-4 p-6 border border-dashed border-gray-300 dark:border-slate-700 rounded-lg min-h-[300px]">
        <p className="text-gray-500 dark:text-slate-400">Form selection/rendering area. Links to dynamically rendered forms will appear here.</p>
        <p className="mt-2 dark:text-slate-400">For example, direct links to:</p>
        <ul className="list-disc list-inside ml-4 dark:text-slate-400">
          <li>Pre-Anestesia Form (Test)</li>
          <li>Intraoperatoria Form (Test)</li>
          <li>Recuperacao Pos Anestesica Form (Test)</li>
        </ul>
      </div>
    </div>
  );
};

export default DataSubmissionPage; 