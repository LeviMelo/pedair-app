import React from 'react';

const PatientSearchPage: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Patient Search (Pseudonymized)</h1>
      <p className="text-slate-600 dark:text-slate-300 mb-4">Interface for searching patient records using pseudonymized identifiers.</p>
      {/* Placeholder for patient search UI */}
      <div className="mt-4 p-6 border border-dashed border-gray-300 dark:border-slate-700 rounded-lg ">
        <p className="text-gray-500 dark:text-slate-400">Search input for: <strong className="font-semibold text-slate-600 dark:text-slate-300">Initials + Gender + DOB + Project ID</strong></p>
        <input 
          type="text" 
          placeholder="Example: JS+M+2017-02-04+project123" 
          className="mt-2 block w-full md:w-1/2 px-3 py-2 bg-white dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        />
        <p className="text-gray-500 dark:text-slate-400 mt-4">Results will display linked, pseudonymized submissions.</p>
      </div>
    </div>
  );
};

export default PatientSearchPage; 