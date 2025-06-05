import { create } from 'zustand';
import useProjectStore from './projectStore'; // Import project store to access project details

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
  login: (userData: User, token: string) => void;
  logout: () => void;
  setProjectRoles: (roles: string[]) => void; // To update roles when project context changes
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  internal_setUserForMock: (user: User) => void;
}

// Create the store
const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  // Initial state
  isAuthenticated: false,
  user: null,
  jwtToken: null,
  activeProjectRoles: [],
  isLoading: false,
  error: null,

  // Actions
  login: (userData, token) => {
    set({
      isAuthenticated: true,
      user: userData,
      jwtToken: token,
      isLoading: false,
      error: null,
      activeProjectRoles: [], // Reset roles, will be set by project context
    });
  },
  logout: () => {
    set({
      isAuthenticated: false,
      user: null,
      jwtToken: null,
      activeProjectRoles: [],
      isLoading: false,
      error: null,
    });
    // Also clear active project from project store on logout
    useProjectStore.getState().clearActiveProject(); 
  },
  setProjectRoles: (roles) => set({ activeProjectRoles: roles }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error: error, isLoading: false }),
  internal_setUserForMock: (user: User) => set({ user, isAuthenticated: true }),
}));

// Mock login action for demonstration - in a real app, this would involve API calls
export const mockLogin = (userIdToLogin: string) => {
  // Simulate fetching user details and a token
  const mockUser: User = {
    id: userIdToLogin, // Use the provided userId
    name: userIdToLogin === 'userLead123' ? 'Dr. User Lead' : 'Mock User',
    email: userIdToLogin === 'userLead123' ? 'dr.lead@example.com' : 'mock.user@example.com',
  };
  const mockToken = 'mock-jwt-token-' + Date.now();

  // useAuthStore.getState().login(mockUser, mockToken, initialProjectRoles);
  // Instead of passing roles directly, login sets the user, and Layout will derive roles.
  useAuthStore.getState().login(mockUser, mockToken);
  console.log(`Mock login for ${userIdToLogin}. Active project roles will be set based on project selection.`);
};

export const mockLogout = () => {
  useAuthStore.getState().logout();
  console.log('Mock logout executed.');
};

export default useAuthStore; 