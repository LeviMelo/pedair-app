import React from 'react';
import { PiGearDuotone, PiUserDuotone, PiBellDuotone, PiPaletteDuotone } from 'react-icons/pi';

const SettingsPage: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 space-y-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 min-h-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2">Settings</h1>
        <p className="text-slate-600 dark:text-slate-300 text-lg">Manage your CREST profile, preferences, and application settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Profile Card */}
        <section className="card-colorful p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 flex items-center mb-4 relative z-10">
            <PiUserDuotone className="mr-3 text-2xl text-blue-600 dark:text-blue-400" /> User Profile
          </h2>
          <div className="space-y-3 relative z-10">
            <p className="text-slate-600 dark:text-slate-300">Edit your profile information, contact details, and professional credentials.</p>
            <div className="pt-3 space-y-2">
              <div className="flex justify-between items-center py-2 border-b border-slate-200/50 dark:border-slate-700/50">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Name</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">Dr. João Silva</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-200/50 dark:border-slate-700/50">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Email</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">joao.silva@hospital.com</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Institution</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">Hospital Universitário</span>
              </div>
            </div>
          </div>
        </section>

        {/* Preferences Card */}
        <section className="card-colorful p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400 flex items-center mb-4 relative z-10">
            <PiPaletteDuotone className="mr-3 text-2xl text-purple-600 dark:text-purple-400" /> Appearance
          </h2>
          <div className="space-y-3 relative z-10">
            <p className="text-slate-600 dark:text-slate-300">Customize your interface appearance and theme settings.</p>
            <div className="pt-3 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Theme</span>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">Light</button>
                  <button className="px-3 py-1 text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full">Dark</button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Language</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">Portuguese (BR)</span>
              </div>
            </div>
          </div>
        </section>

        {/* Notifications Card */}
        <section className="card-colorful p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-emerald-600 dark:text-emerald-400 flex items-center mb-4 relative z-10">
            <PiBellDuotone className="mr-3 text-2xl text-emerald-600 dark:text-emerald-400" /> Notifications
          </h2>
          <div className="space-y-3 relative z-10">
            <p className="text-slate-600 dark:text-slate-300">Configure when and how you receive notifications from CREST.</p>
            <div className="pt-3 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Email Notifications</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Follow-up Reminders</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* System Information Card */}
        <section className="card-colorful p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-slate-600 dark:text-slate-400 flex items-center mb-4 relative z-10">
            <PiGearDuotone className="mr-3 text-2xl text-slate-600 dark:text-slate-400" /> System Information
          </h2>
          <div className="space-y-3 relative z-10">
            <p className="text-slate-600 dark:text-slate-300">Information about your CREST installation and current session.</p>
            <div className="pt-3 space-y-2">
              <div className="flex justify-between items-center py-2 border-b border-slate-200/50 dark:border-slate-700/50">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Version</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">1.0.0-beta</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-200/50 dark:border-slate-700/50">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Last Login</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">2024-01-15 09:30</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Session Status</span>
                <span className="text-xs px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full">Active</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage; 