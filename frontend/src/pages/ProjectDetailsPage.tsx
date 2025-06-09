// src/pages/ProjectDetailsPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useProjectStore, { Project } from '../stores/projectStore';
import {
  PiArrowLeftDuotone, PiUsersDuotone, PiUserCirclePlusDuotone, 
  PiFileTextDuotone, PiChartLineUpDuotone, PiChatDotsDuotone, PiGearDuotone,
  PiClipboardTextDuotone, PiHourglassDuotone, PiMegaphoneDuotone,
  PiFlagDuotone
} from 'react-icons/pi';
import { Button } from '../components/ui/Button'; // Corrected import

const ProjectDetailsPage: React.FC = () => {
    // ... logic remains the same
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const { availableProjects, setActiveProject, activeProjectDetails, isLoading } = useProjectStore();
    const [currentProject, setCurrentProject] = useState<Project | null | undefined>(undefined);
  
    useEffect(() => {
      if (projectId) {
        if (activeProjectDetails && activeProjectDetails.id === projectId) {
          setCurrentProject(activeProjectDetails);
        } else {
          const project = availableProjects.find(p => p.id === projectId);
          if (project) {
            setActiveProject(projectId);
            setCurrentProject(project);
          } else if (!isLoading) {
            setCurrentProject(null);
          }
        }
      }
    }, [projectId, availableProjects, activeProjectDetails, setActiveProject, isLoading]);
  
    if (isLoading && currentProject === undefined) {
      return <div className="p-6 text-center"><p className="text-muted-foreground">Loading project details...</p></div>;
    }
  
    if (currentProject === null) {
      return (
        <div className="p-6 text-center">
          <h1 className="text-xl font-semibold text-destructive">Project Not Found</h1>
          <p className="text-muted-foreground mt-2">The project ID '{projectId}' does not exist or you may not have access.</p>
          <Button variant="outline" onClick={() => navigate('/')} iconLeft={<PiArrowLeftDuotone />} className="mt-6">Back to Dashboard</Button>
        </div>
      );
    }
    
    if (!currentProject) {
       return <div className="p-6 text-center"><p className="text-muted-foreground">Loading project information...</p></div>;
    }
  
    const projectActions = [
      { id: 'enterData', label: 'Enter Data', icon: PiClipboardTextDuotone, path: `/project/${projectId}/submission`, variant: 'primary' as const, className: "dark:shadow-blue-500/30" },
      { id: 'reports', label: 'View Reports', icon: PiChartLineUpDuotone, path: `/project/${projectId}/reports`, variant: 'outline' as const },
      { id: 'discussions', label: 'Discussions', icon: PiChatDotsDuotone, path: `/project/${projectId}/discussions`, variant: 'outline' as const },
      { id: 'settings', label: 'Project Settings', icon: PiGearDuotone, path: `/project/${projectId}/settings`, variant: 'outline' as const },
    ];
  
    return (
      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')} iconLeft={<PiArrowLeftDuotone />} className="text-muted-foreground hover:text-foreground -ml-2">Back to Dashboard</Button>
  
        <section className="relative bg-card p-6 sm:p-8 rounded-lg shadow-sm border overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gradient">{currentProject.name}</h1>
            <p className="mt-2 text-muted-foreground text-lg max-w-3xl">{currentProject.description || 'No detailed description provided.'}</p>
            <div className="mt-6 pt-6 border-t flex flex-wrap gap-3 items-center">
              {projectActions.map(action => (
                <Button key={action.id} variant={action.variant} size='md' onClick={() => navigate(action.path)} iconLeft={<action.icon />}>
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        </section>
  
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section id="team-members" className="lg:col-span-2 bg-card p-6 rounded-lg border shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-foreground flex items-center"><PiUsersDuotone className="mr-2.5 text-2xl text-sky-500"/> Team Members</h2>
              <Button variant='outline-primary' size='sm' iconLeft={<PiUserCirclePlusDuotone/>}>Manage Team</Button>
            </div>
            <div className="space-y-4">
              {currentProject?.members?.length > 0 ? (
                currentProject.members.map(member => (
                  <div key={member.userId} className={`p-4 rounded-md border flex items-start space-x-4 bg-background`}>
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.userId)}&background=random&size=48&color=fff&font-size=0.40&bold=true`} alt={member.userId} className="w-12 h-12 rounded-full flex-shrink-0 object-cover ring-1 ring-border shadow-sm"/>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-md font-semibold text-foreground">User ID: {member.userId}</h3>
                      <p className={`text-xs font-medium px-1.5 py-0.5 rounded-full inline-block mt-0.5 mb-1 bg-secondary text-secondary-foreground`}>
                        Roles: {member.roles.join(', ') || 'No roles assigned'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No team members listed for this project yet.</p>
              )}
            </div>
          </section>
  
          <aside className="lg:col-span-1 space-y-6">
            <section id="project-status" className="bg-card p-6 rounded-lg border shadow-sm">
              <h2 className="text-xl font-semibold text-foreground flex items-center mb-3"><PiHourglassDuotone className="mr-2.5 text-2xl text-amber-500"/> Project Status</h2>
              <p className="text-sm text-muted-foreground">Details about project milestones, current phase, etc. (Placeholder)</p>
            </section>
            <section id="recent-activity" className="bg-card p-6 rounded-lg border shadow-sm">
              <h2 className="text-xl font-semibold text-foreground flex items-center mb-3"><PiMegaphoneDuotone className="mr-2.5 text-2xl text-teal-500"/> Recent Activity</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>User 'Dr. Alice' updated project description.</li>
                <li>Form 'Pre-Op Assessment v2' was activated.</li>
              </ul>
            </section>
            <section id="project-goals" className="bg-card p-6 rounded-lg border shadow-sm">
              <h2 className="text-xl font-semibold text-foreground flex items-center mb-4"><PiFlagDuotone className="mr-2.5 text-2xl text-green-500" /> Project Goals</h2>
              <p className="text-sm text-muted-foreground">{currentProject?.goals || 'No goals specified.'}</p>
            </section>
          </aside>
        </div>
      </div>
    );
};

export default ProjectDetailsPage;