import React from 'react';

const NotificationSchedulerPage: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Notification Scheduler</h1>
      <p className="text-slate-600 dark:text-slate-300">Configure automated email reminders and notifications for patient follow-ups or other events.</p>
      {/* Placeholder for notification scheduling UI */}
      <div className="mt-4 p-6 border border-dashed border-gray-300 dark:border-slate-700 rounded-lg min-h-[300px]">
        <p className="text-gray-500 dark:text-slate-400">Interface for setting up notification rules (e.g., '30 days post-op to send follow-up email') will be here.</p>
      </div>
    </div>
  );
};

export default NotificationSchedulerPage; 