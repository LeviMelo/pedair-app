import React from 'react';

const DashboardPage: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p>Welcome to the PedAir Dashboard. Project overview and quick metrics will be displayed here.</p>
      {/* Placeholder content */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-medium">Active Projects</h2>
          <p className="mt-2 text-3xl">3</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-medium">Forms Pending Review</h2>
          <p className="mt-2 text-3xl">12</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-medium">Upcoming Follow-ups</h2>
          <p className="mt-2 text-3xl">5</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 