import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useProjectStore, { Project } from '../stores/projectStore';
import useAuthStore from '../stores/authStore';
import { PiPlusCircleDuotone, PiFolderOpenDuotone, PiBriefcaseDuotone, PiArrowSquareOut } from 'react-icons/pi';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    availableProjects, 
    activeProjectId, 
    activeProjectDetails, 
    fetchAvailableProjects, 
    setActiveProject,
    isLoading: projectsLoading,
    error: projectsError
  } = useProjectStore();
  
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) { // Only fetch if authenticated (or adjust logic as needed)
        fetchAvailableProjects();
    }
  }, [fetchAvailableProjects, isAuthenticated]);

  const handleSelectProject = (projectId: string) => {
    setActiveProject(projectId);
    // Optionally navigate to a project-specific dashboard or view
    // navigate(`/project/${projectId}`); 
  };

  const handleCreateNewProject = () => {
    // Placeholder: navigate to a form builder or project creation page
    console.log("Navigate to create new project page - TBD");
    // navigate('/builder/new-project');
    alert("Project creation functionality is not yet implemented.")
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-slate-200 dark:border-slate-700/60">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">
            {activeProjectDetails ? activeProjectDetails.name : 'Dashboard'}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            {user ? `Welcome back, ${user.name}!` : 'Welcome to PedAir.'} 
            {activeProjectDetails ? ` You are viewing the ${activeProjectDetails.name} project.` : 'Select a project to get started.'}
          </p>
        </div>
        <button 
            onClick={handleCreateNewProject}
            className="mt-3 sm:mt-0 flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-70"
        >
          <PiPlusCircleDuotone className="mr-2" size={20}/> Create New Project
        </button>
      </div>

      {projectsLoading && <p className="text-slate-600 dark:text-slate-400">Loading projects...</p>}
      {projectsError && <p className="text-red-500 dark:text-red-400">Error loading projects: {projectsError}</p>}

      {activeProjectDetails && (
        <div className="mb-8 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg dark:shadow-[0_0_25px_rgba(255,255,255,0.07)]">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-1">Current Project Overview</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{activeProjectDetails.description || 'No description available for this project.'}</p>
                </div>
                <button 
                    onClick={() => navigate('/forms')} // Example: navigate to data submission for this project
                    className="ml-4 flex items-center text-sm px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md shadow-sm transition-colors"
                >
                    <PiArrowSquareOut className="mr-1.5"/> Go to Data Entry
                </button>
            </div>
           
            {/* Placeholder for project-specific metrics */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                    <h3 className="text-md font-medium text-slate-600 dark:text-slate-300">Total Submissions</h3>
                    <p className="mt-1 text-2xl font-semibold text-slate-700 dark:text-slate-100">152</p> {/* Placeholder */}
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                    <h3 className="text-md font-medium text-slate-600 dark:text-slate-300">Pending Sync</h3>
                    <p className="mt-1 text-2xl font-semibold text-slate-700 dark:text-slate-100">8</p> {/* Placeholder */}
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                    <h3 className="text-md font-medium text-slate-600 dark:text-slate-300">Active Users</h3>
                    <p className="mt-1 text-2xl font-semibold text-slate-700 dark:text-slate-100">4</p> {/* Placeholder */}
                </div>
            </div>
        </div>
      )}

      <div className="mt-2">
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-1">
            {activeProjectId ? 'Switch Project' : 'Available Projects'}
        </h2>
         <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            {activeProjectId ? 'You can also select another project from the list below.' : 'Please select a project to view its details and start working.'}
        </p>
        {availableProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {availableProjects.map((project: Project) => (
              <button 
                key={project.id} 
                onClick={() => handleSelectProject(project.id)}
                disabled={project.id === activeProjectId}
                className={`p-5 text-left bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-xl dark:shadow-[0_0_15px_rgba(255,255,255,0.05)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 
                            ${project.id === activeProjectId 
                                ? 'ring-2 ring-blue-500 dark:ring-blue-400 bg-blue-50 dark:bg-blue-900/30 cursor-default' 
                                : 'hover:bg-slate-50 dark:hover:bg-slate-700/70 focus:ring-blue-500'}`}
              >
                <div className="flex items-center mb-2">
                    <PiBriefcaseDuotone className={`mr-2.5 text-xl ${project.id === activeProjectId ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`} />
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 truncate" title={project.name}>{project.name}</h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 h-8">
                  {project.description || 'No description available.'}
                </p>
                <div className={`text-xs font-medium ${project.id === activeProjectId ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-300'}`}>
                    {project.id === activeProjectId ? 'Currently Active' : 'Select Project'}
                </div>
              </button>
            ))}
          </div>
        ) : (
          !projectsLoading && <p className="text-slate-500 dark:text-slate-400 mt-4">No projects found. You might need to create one or check your permissions.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage; 