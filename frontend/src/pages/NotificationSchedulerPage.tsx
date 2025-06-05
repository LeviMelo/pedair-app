import React from 'react';

const NotificationSchedulerPage: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold">Notification Scheduler</h1>
      <p>Configure automated email reminders and notifications for patient follow-ups or other events.</p>
      {/* Placeholder for notification scheduling UI */}
      <div className="mt-4 p-6 border border-dashed border-gray-300 rounded-lg min-h-[300px]">
        <p className="text-gray-500">Interface for setting up notification rules (e.g., '30 days post-op to send follow-up email') will be here.</p>
      </div>
    </div>
  );
};

export default NotificationSchedulerPage; 