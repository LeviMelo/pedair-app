import React from 'react';

const DataSubmissionPage: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold">Data Submission</h1>
      <p>Users will select and fill out clinical forms here. This page might list available forms or directly load a specific form.</p>
      {/* Placeholder for form listing or rendering */}
      <div className="mt-4 p-6 border border-dashed border-gray-300 rounded-lg min-h-[300px]">
        <p className="text-gray-500">Form selection/rendering area. Links to dynamically rendered forms will appear here.</p>
        <p className="mt-2">For example, direct links to:</p>
        <ul className="list-disc list-inside ml-4">
          <li>Pre-Anestesia Form (Test)</li>
          <li>Intraoperatoria Form (Test)</li>
          <li>Recuperacao Pos Anestesica Form (Test)</li>
        </ul>
      </div>
    </div>
  );
};

export default DataSubmissionPage; 