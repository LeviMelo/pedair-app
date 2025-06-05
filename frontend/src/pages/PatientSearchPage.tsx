import React from 'react';

const PatientSearchPage: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold">Patient Search (Pseudonymized)</h1>
      <p>Interface for searching patient records using pseudonymized identifiers.</p>
      {/* Placeholder for patient search UI */}
      <div className="mt-4 p-6 border border-dashed border-gray-300 rounded-lg ">
        <p className="text-gray-500">Search input for initials, gender, DOB, project ID will be here.</p>
        <p className="text-gray-500 mt-2">Results will display linked, pseudonymized submissions.</p>
      </div>
    </div>
  );
};

export default PatientSearchPage; 