import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define the types for projects
export interface ProjectMember {
  userId: string;
  roles: string[];
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  members: ProjectMember[]; // Added members array
  // Add other project-specific details, e.g., form definitions, roles, etc.
  // For now, keeping it simple
}

// Mock data - replace with actual API calls later
const mockProjects: Project[] = [
  {
    id: 'proj_pedair_001',
    name: 'PedAir - Estudo Piloto Alagoas',
    description: 'Coleta de dados para o projeto Respirar em cirurgias pediátricas de via aérea no estado de Alagoas.',
    members: [
      { userId: 'userLead123', roles: ['ProjectLead', 'Researcher', 'FormDesigner'] },
      { userId: 'user456', roles: ['DataEntry'] },
      { userId: 'user789', roles: ['Researcher'] },
    ],
  },
  {
    id: 'proj_eras_002',
    name: 'ERAS Pediátrico - Hospital Central',
    description: 'Implementação e avaliação de protocolos ERAS em cirurgia torácica pediátrica no Hospital Central.',
    members: [
      { userId: 'userLead123', roles: ['Researcher'] },
      { userId: 'anotherLeadUser', roles: ['ProjectLead'] },
      { userId: 'user456', roles: ['DataEntry', 'Clinician'] },
    ],
  },
  {
    id: 'proj_followup_003',
    name: 'Estudo de Coorte - Follow-up 30 Dias',
    description: 'Acompanhamento de pacientes 30 dias após alta para avaliação de desfechos tardios.',
    members: [
      { userId: 'userLead123', roles: ['ProjectLead', 'Coordinator'] },
      { userId: 'user789', roles: ['Researcher'] },
    ],
  },
  {
    id: 'proj_locked_004',
    name: 'Projeto Confidencial X',
    description: 'Um projeto ao qual o userLead123 não tem acesso direto.',
    members: [
      { userId: 'anotherLeadUser', roles: ['ProjectLead'] },
      { userId: 'user456', roles: ['Researcher'] },
    ],
  }
];

interface ProjectState {
  availableProjects: Project[];
  activeProjectId: string | null;
  activeProjectDetails: Project | null;
  isLoading: boolean;
  error: string | null;
}

interface ProjectActions {
  fetchAvailableProjects: () => Promise<void>;
  setActiveProject: (projectId: string) => void;
  clearActiveProject: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Create the store
const useProjectStore = create<ProjectState & ProjectActions>()(
  persist(
    (set, get) => ({
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
          // Filter projects to only show those the hardcoded 'userLead123' is part of for now
          // This is a temporary measure for the mock. In reality, backend would filter.
          // const userProjects = mockProjects.filter(p => p.members.some(m => m.userId === 'userLead123'));
          // For now, let's return all projects, roles will gate access.
          set({ availableProjects: mockProjects, isLoading: false });
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
    }),
    {
      name: 'pedair-project-storage', 
      storage: createJSONStorage(() => localStorage), 
      partialize: (state) => ({ activeProjectId: state.activeProjectId }), // Only persist activeProjectId
    }
  )
);

export default useProjectStore; 