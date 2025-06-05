import React from 'react';

const DashboardPage: React.FC = () => {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-300">Welcome to the PedAir Dashboard.</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
          + Create New Project (Placeholder)
        </button>
      </div>
      <p className="text-slate-600 dark:text-slate-300 mb-6">Project overview and quick metrics will be displayed here.</p>
      {/* Placeholder content */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md dark:shadow-[0_0_15px_rgba(255,255,255,0.05)]">
          <h2 className="text-xl font-medium text-slate-700 dark:text-slate-100">Active Projects</h2>
          <p className="mt-2 text-3xl font-semibold text-slate-700 dark:text-slate-200">3</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md dark:shadow-[0_0_15px_rgba(255,255,255,0.05)]">
          <h2 className="text-xl font-medium text-slate-700 dark:text-slate-100">Forms Pending Review</h2>
          <p className="mt-2 text-3xl font-semibold text-slate-700 dark:text-slate-200">12</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md dark:shadow-[0_0_15px_rgba(255,255,255,0.05)]">
          <h2 className="text-xl font-medium text-slate-700 dark:text-slate-100">Upcoming Follow-ups</h2>
          <p className="mt-2 text-3xl font-semibold text-slate-700 dark:text-slate-200">5</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 