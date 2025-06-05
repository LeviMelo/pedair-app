import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface Project {
  id: string;
  name: string;
  // Add other project-specific details if needed later, e.g., description, lead
}

interface ProjectContextType {
  activeProjectId: string | null;
  activeProjectName: string | null;
  availableProjects: Project[];
  setActiveProject: (projectId: string | null, projectName: string | null) => void;
  isLoadingProjects: boolean; // To simulate async loading of projects
  // projectError: string | null; // For potential errors loading projects
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// Mocked project data
const MOCKED_PROJECTS: Project[] = [
  { id: 'proj_001', name: 'Projeto Respirar Alagoas (ERAS)' },
  { id: 'proj_002', name: 'Estudo de Coorte Cardiopatias Pediátricas' },
  { id: 'proj_003', name: 'Protocolo de Sedação Contínua UTI Neo' },
];

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeProjectId, setActiveProjectIdState] = useState<string | null>(null);
  const [activeProjectName, setActiveProjectNameState] = useState<string | null>(null);
  const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState<boolean>(true);

  // Simulate fetching projects on initial load
  useEffect(() => {
    setIsLoadingProjects(true);
    setTimeout(() => {
      setAvailableProjects(MOCKED_PROJECTS);
      setIsLoadingProjects(false);
    }, 500); // Simulate small delay
  }, []);

  const setActiveProject = (projectId: string | null, projectName: string | null) => {
    setActiveProjectIdState(projectId);
    setActiveProjectNameState(projectName);
    // In a real app, changing project might also trigger fetching user roles for this new project
  };

  return (
    <ProjectContext.Provider value={{
      activeProjectId,
      activeProjectName,
      availableProjects,
      setActiveProject,
      isLoadingProjects
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
}; 