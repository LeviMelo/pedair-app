// src/pages/DashboardPage.tsx
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
import { Button } from '../components/ui/Button'; // <-- THE CRITICAL FIX
import DashboardGreetingCard from '../components/ui/DashboardGreetingCard';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import { cn } from '@/lib/utils';


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
    alert('Navigate to full profile page - TBD');
  };

  const getUserRolesForProject = (project: Project): string[] => {
    if (!user) return [];
    const memberInfo = project.members.find(m => m.userId === user.id);
    return memberInfo ? memberInfo.roles : [];
  };

  if (projectsLoading && !availableProjects.length) {
    return <div className="p-6 text-center"><p className="text-muted-foreground">Loading dashboard...</p></div>;
  }

  if (projectsError) {
    return <div className="p-6 text-center text-destructive">Error loading projects: {projectsError}</div>;
  }
  
  const userProjects = availableProjects.filter(p => p.members.some(m => m.userId === user?.id));

  return (
    <div className="p-4 sm:p-6 space-y-8 max-w-7xl mx-auto w-full">
      <DashboardGreetingCard 
        onCreateNewProject={handleCreateNewProject} 
        onViewProfile={handleViewProfile} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center">
              <PiBriefcaseDuotone className="mr-3 text-2xl text-primary" /> My Projects
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            {userProjects.length > 0 ? (
              <div className="space-y-3">
                {userProjects.map((project) => {
                  const userRolesInProject = getUserRolesForProject(project);
                  const isProjectActive = project.id === activeProjectId;
                  return (
                    <div 
                      key={project.id} 
                      className={cn(`p-4 rounded-lg transition-all duration-300 cursor-pointer border`, 
                        isProjectActive 
                          ? 'ring-2 ring-primary bg-secondary' 
                          : 'bg-background hover:bg-accent'
                      )}
                      onClick={() => handleSelectProject(project)}
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-md font-semibold text-foreground mb-0.5 truncate">{project.name}</h3>
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2 leading-relaxed">
                            {project.description || 'No description available.'}
                          </p>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            {userRolesInProject.length > 0 && (
                                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                                  Role: {userRolesInProject.join(', ')}
                                </span>
                            )}
                          </div>
                          <div className="mt-3 pt-3 border-t flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 text-xs">
                            <div className="flex items-center text-muted-foreground"><PiFileTextDuotone className="mr-1.5" /> 3 Forms Pending (Mock)</div>
                            <div className="flex items-center text-muted-foreground"><PiCalendarCheckDuotone className="mr-1.5" /> 2 Follow-ups (Mock)</div>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={(e) => { e.stopPropagation(); handleSelectProject(project); }} 
                          iconRight={<PiArrowSquareOutDuotone/>}
                          className="shrink-0 mt-2 sm:mt-0"
                        >
                          Details
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <PiBriefcaseDuotone className="text-4xl text-muted-foreground mb-3" />
                <p className="text-muted-foreground">You are not a member of any project yet.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-1 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><PiBellSimpleRingingDuotone className="mr-3 text-2xl text-purple-500" /> News & Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>Platform Update v1.2 Released! <span className="text-xs">(Mock)</span></li>
                <li>Scheduled maintenance on Sunday @ 2 AM. <span className="text-xs">(Mock)</span></li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><PiListChecksDuotone className="mr-3 text-2xl text-emerald-500" /> Quick Tasks</CardTitle>
            </CardHeader>
            <CardContent>
               <p className="text-sm text-muted-foreground">No urgent tasks at the moment. (Placeholder)</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;