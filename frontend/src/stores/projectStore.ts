import { create } from 'zustand';

// Define the types for projects
export interface Project {
  id: string;
  name: string;
  description?: string;
  // Add other project-specific details, e.g., form definitions, roles, etc.
  // For now, keeping it simple
}

interface ProjectState {
  availableProjects: Project[];
  activeProjectId: string | null;
  activeProjectDetails: Project | null;
  isLoading: boolean;
  error: string | null;
}

interface ProjectActions {
  fetchAvailableProjects: () => Promise<void>; // Simulate API call
  setActiveProject: (projectId: string) => void;
  clearActiveProject: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Mock project data
const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj_pedair_001',
    name: 'PedAir - Estudo Piloto Alagoas',
    description: 'Coleta de dados para o projeto Respirar em cirurgias pediátricas de via aérea no estado de Alagoas.',
  },
  {
    id: 'proj_eras_002',
    name: 'ERAS Pediátrico - Hospital Central',
    description: 'Implementação e avaliação de protocolos ERAS em cirurgia torácica pediátrica no Hospital Central.',
  },
  {
    id: 'proj_followup_003',
    name: 'Estudo de Coorte - Follow-up 30 Dias',
    description: 'Acompanhamento de pacientes 30 dias após alta para avaliação de desfechos tardios.',
  },
];

// Create the store
const useProjectStore = create<ProjectState & ProjectActions>((set, get) => ({
  // Initial state
  availableProjects: [],
  activeProjectId: null,
  activeProjectDetails: null,
  isLoading: false,
  error: null,

  // Actions
  fetchAvailableProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ availableProjects: MOCK_PROJECTS, isLoading: false });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch projects';
      set({ error: errorMessage, isLoading: false });
      console.error("Error fetching projects:", errorMessage);
    }
  },
  setActiveProject: (projectId) => {
    const project = get().availableProjects.find(p => p.id === projectId);
    if (project) {
      set({ activeProjectId: projectId, activeProjectDetails: project, error: null });
      console.log(`Active project set to: ${project.name}`);
    } else {
      set({ error: `Project with ID ${projectId} not found.`, activeProjectId: null, activeProjectDetails: null });
      console.warn(`Attempted to set active project to non-existent ID: ${projectId}`);
    }
  },
  clearActiveProject: () => {
    set({ activeProjectId: null, activeProjectDetails: null });
    console.log('Active project cleared.');
  },
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error: error, isLoading: false }),
}));

export default useProjectStore; 