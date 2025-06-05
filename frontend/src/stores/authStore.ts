import { create } from 'zustand';

// Define the types for the store's state and actions
interface User {
  id: string;
  name: string;
  email: string;
  // Add other relevant user properties as needed
}

// Roles can be project-specific, so we might store them per project
// For now, a simple array for the active project context
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  jwtToken: string | null;
  activeProjectRoles: string[]; // e.g., ['ProjectLead', 'Researcher'] for the current project
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (userData: User, token: string, roles: string[]) => void;
  logout: () => void;
  setProjectRoles: (roles: string[]) => void; // To update roles when project context changes
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Create the store
const useAuthStore = create<AuthState & AuthActions>((set) => ({
  // Initial state
  isAuthenticated: false,
  user: null,
  jwtToken: null,
  activeProjectRoles: [],
  isLoading: false,
  error: null,

  // Actions
  login: (userData, token, roles) =>
    set({
      isAuthenticated: true,
      user: userData,
      jwtToken: token,
      activeProjectRoles: roles,
      isLoading: false,
      error: null,
    }),
  logout: () =>
    set({
      isAuthenticated: false,
      user: null,
      jwtToken: null,
      activeProjectRoles: [],
      isLoading: false,
      error: null,
    }),
  setProjectRoles: (roles) => set({ activeProjectRoles: roles }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error: error, isLoading: false }),
}));

// Mock login action for demonstration - in a real app, this would involve API calls
export const mockLogin = (userId: string, projectRoles: string[] = ['Researcher']) => {
  const { login } = useAuthStore.getState();
  const mockUser: User = {
    id: userId,
    name: `Dr. User ${userId.substring(0, 4)}`,
    email: `user.${userId.substring(0,4)}@example.com`,
  };
  const mockToken = `mock-jwt-token-for-${userId}`;
  login(mockUser, mockToken, projectRoles);
  console.log(`Mock login successful for ${mockUser.name} with roles: ${projectRoles.join(', ')}`);
};

export const mockLogout = () => {
  const { logout } = useAuthStore.getState();
  logout();
  console.log('Mock logout successful.');
};


export default useAuthStore; 