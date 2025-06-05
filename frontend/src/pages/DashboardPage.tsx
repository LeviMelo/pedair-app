import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useProjectStore, { Project } from '../stores/projectStore';
import useAuthStore from '../stores/authStore';
import {
  PiBriefcaseDuotone,
  PiArrowSquareOutDuotone,
  PiBellSimpleRingingDuotone,
  PiListChecksDuotone,
  PiFileTextDuotone,
  PiCalendarCheckDuotone
} from 'react-icons/pi';
import Button from '../components/ui/Button';
import DashboardGreetingCard from '../components/ui/DashboardGreetingCard';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    availableProjects,
    activeProjectId,
    fetchAvailableProjects,
    setActiveProject,
    isLoading: projectsLoading,
    error: projectsError,
  } = useProjectStore();
  
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchAvailableProjects();
    }
  }, [fetchAvailableProjects, isAuthenticated]);

  const handleSelectProject = (project: Project) => {
    setActiveProject(project.id);
    navigate(`/project/${project.id}`);
  };

  const handleCreateNewProject = () => {
    navigate('/dashboard/create-project');
  };

  const handleViewProfile = () => {
    // Placeholder: Navigation to a full profile page will be implemented later
    alert('Navigate to full profile page - TBD');
  };

  const getUserRolesForProject = (project: Project): string[] => {
    if (!user) return [];
    const memberInfo = project.members.find(m => m.userId === user.id);
    return memberInfo ? memberInfo.roles : [];
  };

  if (projectsLoading && !availableProjects.length) {
    return <div className="p-6 text-center"><p className="text-slate-600 dark:text-slate-400">Loading dashboard...</p></div>;
  }

  if (projectsError) {
    return <div className="p-6 text-center text-red-500 dark:text-red-400">Error loading projects: {projectsError}</div>;
  }

  return (
    <div className="p-4 sm:p-6 space-y-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 min-h-full flex flex-col max-w-6xl mx-auto w-full">
      
      <DashboardGreetingCard 
        onCreateNewProject={handleCreateNewProject} 
        onViewProfile={handleViewProfile} 
      />

      <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: My Projects (Scrollable) */}
        <section className="lg:col-span-2 flex flex-col card-enhanced rounded-xl p-0 overflow-hidden shadow-xl">
          <h2 className="text-2xl font-semibold text-gradient flex items-center p-5 pb-3 border-b border-slate-200 dark:border-slate-700/80 shrink-0">
            <PiBriefcaseDuotone className="mr-3 text-3xl text-blue-500 dark:text-blue-400 animate-pulse-glow" /> My Projects
          </h2>
          {availableProjects.filter(p => p.members.some(m => m.userId === user?.id)).length > 0 ? (
            <div className="overflow-y-auto flex-grow p-5 space-y-3">
              {availableProjects.filter(p => p.members.some(m => m.userId === user?.id)).map((project) => {
                const userRolesInProject = getUserRolesForProject(project);
                const isProjectActive = project.id === activeProjectId;
                return (
                  <div 
                    key={project.id} 
                    className={`p-4 rounded-xl transition-all duration-300 cursor-pointer border dark:border-slate-700 
                                bg-gradient-to-r from-white via-slate-50/50 to-white dark:from-slate-800 dark:via-slate-700/50 dark:to-slate-800 
                                hover:shadow-lg hover:scale-[1.02] dark:hover:bg-slate-700 
                                ${isProjectActive 
                                  ? 'ring-2 ring-blue-500 dark:ring-blue-400 shadow-lg shadow-blue-500/25 dark:shadow-blue-400/20' 
                                  : 'border-slate-200 dark:border-slate-700 hover:border-blue-400/50 dark:hover:border-blue-500/50'}
                              `}
                    onClick={() => handleSelectProject(project)}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-md font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-0.5 truncate">{project.name}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 line-clamp-2 leading-relaxed">
                          {project.description || 'No description available.'}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                          {userRolesInProject.length > 0 && (
                              <div className="flex items-center">
                                  Your role(s): <span className="font-medium text-emerald-600 dark:text-emerald-400 ml-1">{userRolesInProject.join(', ')}</span>
                              </div>
                          )}
                        </div>
                        <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-xs">
                          <div className="flex items-center text-amber-600 dark:text-amber-400">
                            <PiFileTextDuotone className="mr-1.5 text-sm" />
                            <span>3 Formulários Pendentes (Placeholder)</span>
                          </div>
                          <div className="flex items-center text-teal-600 dark:text-teal-400">
                            <PiCalendarCheckDuotone className="mr-1.5 text-sm" />
                            <span>2 Próximos Follow-ups (Placeholder)</span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        onClick={(e) => { e.stopPropagation(); handleSelectProject(project); }} 
                        iconRight={<PiArrowSquareOutDuotone/>}
                        className="shrink-0 mt-1 sm:mt-0 py-1 px-2 text-xs hover:shadow-md transition-all"
                      >
                        Details
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
              <PiBriefcaseDuotone className="text-4xl text-slate-400 dark:text-slate-500 mx-auto mb-3 animate-pulse-glow" />
              <p className="text-slate-500 dark:text-slate-400">No projects found, or you are not yet a member of any project.</p>
              <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Try creating a new one if you have permissions!</p>
            </div>
          )}
        </section>

        {/* Column 2: News & Updates, then Quick Tasks */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <section className="card-colorful p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gradient-warm flex items-center mb-4 relative z-10">
              <PiBellSimpleRingingDuotone className="mr-3 text-2xl text-purple-500 dark:text-purple-400" /> News & Updates
            </h2>
            <ul className="space-y-3 text-sm relative z-10">
              <li className="text-slate-600 dark:text-slate-300">Platform Update v1.2 Released! <span className="text-xs text-slate-400 dark:text-slate-500">(Placeholder)</span></li>
              <li className="text-slate-600 dark:text-slate-300">Scheduled maintenance on Sunday @ 2 AM. <span className="text-xs text-slate-400 dark:text-slate-500">(Placeholder)</span></li>
            </ul>
          </section>

          <section className="card-colorful p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gradient-cool flex items-center mb-4 relative z-10">
              <PiListChecksDuotone className="mr-3 text-2xl text-green-500 dark:text-green-400" /> Quick Tasks
            </h2>
            <ul className="space-y-2 text-sm relative z-10">
              <li className="text-slate-600 dark:text-slate-300">No urgent tasks at the moment. (Placeholder)</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 