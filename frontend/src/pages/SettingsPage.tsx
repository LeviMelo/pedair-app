import React from 'react';

const SettingsPage: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Settings</h1>
      <p className="text-slate-600 dark:text-slate-300">Application settings, user profile, and preferences will be managed here.</p>
      {/* Placeholder for settings UI */}
      <div className="mt-4 p-6 border border-dashed border-gray-300 dark:border-slate-700 rounded-lg">
        <h2 className="text-xl font-medium text-slate-700 dark:text-slate-200">User Profile</h2>
        <p className="text-gray-500 dark:text-slate-400 mt-2">Edit profile information...</p>
        <h2 className="text-xl font-medium text-slate-700 dark:text-slate-200 mt-4">Preferences</h2>
        <p className="text-gray-500 dark:text-slate-400 mt-2">Theme (Light/Dark), notifications preferences...</p>
      </div>
    </div>
  );
};

export default SettingsPage; 