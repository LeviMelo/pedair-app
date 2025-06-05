import React from 'react';
import { PiPlusCircleDuotone, PiIdentificationCardDuotone, PiArrowSquareOutDuotone } from 'react-icons/pi';
import Button from './Button'; // Assuming Button is in the same ui directory
import useAuthStore from '../../stores/authStore'; // To get user info

interface DashboardGreetingCardProps {
  onCreateNewProject: () => void;
  onViewProfile: () => void; // Placeholder for now
}

const DashboardGreetingCard: React.FC<DashboardGreetingCardProps> = ({
  onCreateNewProject,
  onViewProfile,
}) => {
  const { user } = useAuthStore();

  return (
    <section
      className="relative card-base p-6 sm:p-8 rounded-xl shadow-xl 
                 border border-slate-200 dark:border-slate-700/80 overflow-hidden
                 bg-gradient-to-br from-slate-100 via-white to-slate-100 
                 dark:from-slate-800 dark:via-slate-850 dark:to-slate-800 
                 dark:shadow-[0_0_30px_rgba(var(--color-primary-500),0.2)] 
                 dark:sm:shadow-[0_0_40px_rgba(var(--color-primary-400),0.25)]"
    >
      <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-400/30 dark:bg-blue-500/20 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
      <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-400/30 dark:bg-purple-500/20 rounded-full filter blur-3xl opacity-50 animation-delay-2000 animate-pulse"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">
            Welcome back, <span className="text-blue-600 dark:text-blue-400">{user?.name || 'User'}</span>!
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300 text-lg">
            Here's your mission control. Manage projects, track progress, and stay updated.
          </p>
        </div>
        <div className="shrink-0">
          <Button
            variant="primary"
            size="lg"
            iconLeft={<PiPlusCircleDuotone />}
            onClick={onCreateNewProject}
            className="shadow-lg dark:shadow-blue-500/30"
          >
            Create New Project
          </Button>
        </div>
      </div>

      <div className="relative z-10 mt-8 p-6 bg-white/60 dark:bg-slate-750/50 backdrop-blur-md rounded-lg shadow-inner border border-slate-200 dark:border-slate-700/60">
        <div className="flex items-center">
          <PiIdentificationCardDuotone className="text-5xl text-blue-500 dark:text-blue-400 mr-5 shrink-0" />
          <div className="flex-1 min-w-0"> {/* Added min-w-0 for potential truncation */}
            <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">Profile Snapshot</h2>
            {user ? (
              <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                {user.email}
              </p>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">User details not available.</p>
            )}
            <Button variant="link" size="sm" className="mt-1 px-0 py-0 text-blue-600 dark:text-blue-400" onClick={onViewProfile}>
              View Full Profile <PiArrowSquareOutDuotone className="ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardGreetingCard; 