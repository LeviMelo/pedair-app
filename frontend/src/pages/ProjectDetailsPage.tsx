import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useProjectStore, { Project } from '../stores/projectStore';
import {
  PiArrowLeftDuotone, PiUsersDuotone, PiUserCirclePlusDuotone, 
  PiFileTextDuotone, PiChartLineUpDuotone, PiChatDotsDuotone, PiGearDuotone,
  PiClipboardTextDuotone, PiArchiveDuotone, PiHourglassDuotone, PiMegaphoneDuotone,
  PiFlagDuotone
} from 'react-icons/pi';
import Button from '../components/ui/Button';
import DashboardGreetingCard from '../components/ui/DashboardGreetingCard'; // For inspiration, not direct use here yet

const ProjectDetailsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { availableProjects, setActiveProject, activeProjectDetails, isLoading } = useProjectStore();
  // const { user } = useAuthStore(); // To check permissions later if needed

  const [currentProject, setCurrentProject] = useState<Project | null | undefined>(undefined); // Initialize as undefined

  useEffect(() => {
    if (projectId) {
      // If activeProjectDetails matches, use it directly (already set by dashboard click)
      if (activeProjectDetails && activeProjectDetails.id === projectId) {
        setCurrentProject(activeProjectDetails);
      } else {
        // Otherwise, try to find it in availableProjects (e.g., direct navigation to URL)
        const project = availableProjects.find(p => p.id === projectId);
        if (project) {
          setActiveProject(projectId); // Set it as active in the store
          setCurrentProject(project);
        } else {
          // If still not found and projects have loaded (or finished loading), it might be an invalid ID
          if (!isLoading && availableProjects.length > 0) {
            setCurrentProject(null); // Mark as not found
          } else if (!isLoading && availableProjects.length === 0 && projectId) {
             // Projects loaded, but none found (e.g. after a refresh and store is initially empty before fetch)
             // or projectId is simply invalid before projects are even fetched.
             // This case might lead to "Not Found" if projects list remains empty.
             // If fetchAvailableProjects is not called, this might be an issue.
             // For now, if availableProjects is empty and not loading, assume not found.
            setCurrentProject(null);
          }
          // If projects are still loading, currentProject remains undefined until loading finishes.
        }
      }
    }
  }, [projectId, availableProjects, activeProjectDetails, setActiveProject, isLoading]);

  if (isLoading && currentProject === undefined) {
    return <div className="p-6 text-center"><p className="text-slate-600 dark:text-slate-400">Loading project details...</p></div>;
  }

  if (currentProject === null) { // Explicitly null means not found after loading or initial check
    return (
      <div className="p-6 text-center">
        <h1 className="text-xl font-semibold text-red-600 dark:text-red-400">Project Not Found</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">The project ID '{projectId}' does not correspond to an existing project or you may not have access.</p>
        <Button variant="outline-slate" onClick={() => navigate('/')} iconLeft={<PiArrowLeftDuotone />} className="mt-6">
          Back to Dashboard
        </Button>
      </div>
    );
  }
  
  if (!currentProject) { // Still undefined or falsy, possibly initial load or error before currentProject is set
     return <div className="p-6 text-center"><p className="text-slate-600 dark:text-slate-400">Loading project information...</p></div>;
  }

  const projectActions = [
    { id: 'enterData', label: 'Enter Data', icon: PiClipboardTextDuotone, path: '/forms', variant: 'primary' as const, className: "dark:shadow-blue-500/30" },
    { id: 'reports', label: 'View Reports', icon: PiChartLineUpDuotone, path: `/project/${projectId}/reports`, variant: 'outline-slate' as const },
    { id: 'discussions', label: 'Discussions', icon: PiChatDotsDuotone, path: `/project/${projectId}/discussions`, variant: 'outline-slate' as const },
    { id: 'settings', label: 'Project Settings', icon: PiGearDuotone, path: `/project/${projectId}/settings`, variant: 'outline-slate' as const },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 min-h-full max-w-6xl mx-auto w-full">
      {/* Back to Dashboard Button - outside the main banner for cleaner separation */}
      <div className="mb-0">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/')} 
          iconLeft={<PiArrowLeftDuotone />} 
          className="text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-slate-100 px-1 py-1"
        >
          Back to Dashboard
        </Button>
      </div>

      {/* Main Project Info Banner Card - Inspired by DashboardGreetingCard */}
      <section 
        className="relative card-base p-6 sm:p-8 rounded-xl shadow-lg 
                   border border-slate-200 dark:border-slate-700/80 overflow-hidden
                   bg-gradient-to-br from-slate-50 via-white to-slate-50 
                   dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 
                   dark:shadow-[0_0_25px_rgba(var(--color-primary-500),0.15)]"
      >
        {/* Optional decorative blurs, can be fine-tuned or removed */}
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-sky-400/20 dark:bg-sky-500/15 rounded-full filter blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-indigo-400/20 dark:bg-indigo-500/15 rounded-full filter blur-3xl opacity-40 animation-delay-2000 animate-pulse"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gradient">
            {currentProject.name}
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300 text-lg max-w-3xl">
            {currentProject.description || 'No detailed description provided for this project.'}
          </p>

          {/* Project Actions Bar */}
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700/60 flex flex-wrap gap-3 items-center">
            {projectActions.map(action => (
              <Button 
                key={action.id}
                variant={action.variant}
                size='md' 
                onClick={() => navigate(action.path)} 
                iconLeft={<action.icon />}
                className={action.className || 'dark:border-slate-600 dark:hover:bg-slate-700 hover:border-slate-400'}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid for Team Members and Other Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section id="team-members" className="lg:col-span-2 card-base p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200 flex items-center">
              <PiUsersDuotone className="mr-2.5 text-2xl text-sky-500 dark:text-sky-400"/> Team Members
            </h2>
            <Button variant='outline-primary' size='sm' iconLeft={<PiUserCirclePlusDuotone/>}>
              Manage Team (TBD)
            </Button>
          </div>
          <div className="space-y-4">
            {currentProject && currentProject.members && currentProject.members.length > 0 ? (
              currentProject.members.map(member => (
                // TODO: Enhance this to show richer member details if available from another store (e.g., userStore)
                // For now, displaying userId and roles.
                <div 
                  key={member.userId} 
                  className={`p-4 rounded-md border dark:border-slate-700 flex items-start space-x-4 
                              bg-white dark:bg-slate-800/60 hover:shadow-sm dark:hover:bg-slate-700/70 
                              border-slate-200 dark:border-slate-700`}
                >
                  <img 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.userId)}&background=random&size=48&color=fff&font-size=0.40&bold=true`}
                    alt={member.userId} 
                    className="w-12 h-12 rounded-full flex-shrink-0 object-cover ring-1 ring-slate-300 dark:ring-slate-600 shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-md font-semibold text-slate-800 dark:text-slate-100">User ID: {member.userId}</h3>
                    <p className={`text-xs font-medium px-1.5 py-0.5 rounded-full inline-block mt-0.5 mb-1 bg-slate-100 text-slate-600 dark:bg-slate-600 dark:text-slate-300`}>
                      Roles: {member.roles.join(', ') || 'No roles assigned'}
                    </p>
                    {/* Placeholder for more details */}
                    {/* <p className="text-sm text-slate-500 dark:text-slate-400 truncate">Additional details (e.g., email) would go here.</p> */}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 dark:text-slate-400">No team members listed for this project yet.</p>
            )}
          </div>
        </section>

        <aside className="lg:col-span-1 space-y-6">
          <section id="project-status" className="card-base p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200 flex items-center mb-3">
                <PiHourglassDuotone className="mr-2.5 text-2xl text-amber-500 dark:text-amber-400"/> Project Status
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Details about project milestones, current phase, data collection progress, etc. (Placeholder)</p>
          </section>

          <section id="recent-activity" className="card-base p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200 flex items-center mb-3">
                <PiMegaphoneDuotone className="mr-2.5 text-2xl text-teal-500 dark:text-teal-400"/> Recent Activity
            </h2>
            <ul className="space-y-2 text-sm">
              <li className="text-slate-600 dark:text-slate-300">User 'Dr. Alice' updated project description. <span className="text-xs text-slate-400 dark:text-slate-500">(Placeholder)</span></li>
              <li className="text-slate-600 dark:text-slate-300">Form 'Pre-Op Assessment v2' was activated. <span className="text-xs text-slate-400 dark:text-slate-500">(Placeholder)</span></li>
            </ul>
          </section>

          <section id="project-goals" className="card-base p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200 flex items-center mb-4">
              <PiFlagDuotone className="mr-2.5 text-2xl text-green-500 dark:text-green-400" /> Project Goals
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {currentProject?.goals || 'Specific research objectives and aims of this project will be detailed here. This section can be populated from project settings.'}
            </p>
            {/* Example: <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-300"><li>Goal 1</li><li>Goal 2</li></ul> */} 
          </section>

          <section id="key-documents" className="card-base p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200 flex items-center mb-3">
                <PiFileTextDuotone className="mr-2.5 text-2xl text-purple-500 dark:text-purple-400"/> Key Documents
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Documents related to this project, such as protocols, consent forms, and project reports.</p>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;