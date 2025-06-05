import React, { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  PiGaugeDuotone,
  PiListChecksDuotone,
  PiSquaresFourDuotone,
  PiUsersDuotone,
  PiMagnifyingGlassDuotone,
  PiBellDuotone,
  PiGearDuotone,
  PiList as PiMenuIcon,
  PiCaretLeftDuotone,
  PiCaretDownDuotone,
  PiSunDuotone,
  PiMoonDuotone,
  PiSignInDuotone,
  PiSignOutDuotone,
  PiPlusCircleDuotone,
  PiFilePlusDuotone,
  PiArchiveDuotone,
  PiPlayCircleDuotone,
  PiHouseDuotone,
  PiFloppyDiskDuotone,
  PiUserPlusDuotone,
  PiTextAaDuotone,
  PiUserCircleDuotone,
  PiCompassDuotone
} from 'react-icons/pi';
import useAuthStore, { mockLogin, mockLogout } from '../../stores/authStore';
import useProjectStore from '../../stores/projectStore';
import useSubmissionStore, { PatientInputData } from '../../stores/submissionStore';
import Button from '../ui/Button';

const baseNavItems = [
  { id: 'dashboard', path: '/', label: 'Dashboard', icon: PiGaugeDuotone },
  { id: 'settings', path: '/settings', label: 'Settings', icon: PiGearDuotone },
];

const projectNavItems = [
  { id: 'overview', path: '', label: 'Project Overview', icon: PiHouseDuotone, requiredRoles: [] },
  { id: "forms", path: "/submission", label: "Data Submission", icon: PiListChecksDuotone, requiredRoles: ["Researcher", "ProjectLead", "DataEntry"] },
  { id: "builder", path: "/builder", label: "Form Builder", icon: PiSquaresFourDuotone, requiredRoles: ["ProjectLead", "FormDesigner"] },
  { id: "roles", path: "/roles", label: "Role Editor", icon: PiUsersDuotone, requiredRoles: ["ProjectLead"] },
  { id: "search", path: "/search", label: "Patient Search", icon: PiMagnifyingGlassDuotone, requiredRoles: ["Researcher", "ProjectLead", "Clinician"] },
  { id: "scheduler", path: "/notifications", label: "Notifications", icon: PiBellDuotone, requiredRoles: ["ProjectLead", "Coordinator"] },
];

const getPageTitle = (pathname: string, activeProjectName?: string | null, activeProjectId?: string | null) => {
  if (pathname === '/') return 'Dashboard';
  if (pathname === '/settings') return 'Settings';
  if (pathname.startsWith('/dashboard/create-project')) return 'Create New Project';
  
  if (activeProjectId && activeProjectName) {
    if (pathname === `/project/${activeProjectId}`) {
      return `Project Overview - ${activeProjectName}`;
    }
    const projectNavItem = projectNavItems.slice(1).find(item => pathname === `/project/${activeProjectId}${item.path}`);
    if (projectNavItem) {
      return `${projectNavItem.label} - ${activeProjectName}`;
    }
  }

  if (pathname.startsWith('/test/')) {
    const testName = pathname.split('/').pop();
    return `Test: ${testName?.charAt(0).toUpperCase()}${testName?.slice(1).replace(/([A-Z])/g, ' $1').trim() || 'Form'}`;
  }
  return activeProjectName ? `Project: ${activeProjectName}` : 'CREST Application';
};

const Layout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [showProjectSelector] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const { isAuthenticated, user, activeProjectRoles, setProjectRoles } = useAuthStore();
  const { 
    availableProjects,
    activeProjectId, 
    activeProjectDetails, 
    fetchAvailableProjects, 
    setActiveProject,
    clearActiveProject 
  } = useProjectStore();
  const { patientData: submissionPatientData, startNewEncounter } = useSubmissionStore();

  const pageTitle = getPageTitle(location.pathname, activeProjectDetails?.name, activeProjectId);
  const sidebarRef = useRef<HTMLElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', JSON.stringify(true));
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', JSON.stringify(false));
    }
  }, [isDarkMode]);

  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarCollapsed(true);
      }
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    fetchAvailableProjects();
    if(!isAuthenticated && !user) { 
      mockLogin('userLead123'); 
    }
  }, [fetchAvailableProjects, isAuthenticated, user]);

  useEffect(() => {
    if (activeProjectId && user && availableProjects.length > 0) {
      const currentProject = availableProjects.find(p => p.id === activeProjectId);
      if (currentProject) {
        const memberInfo = currentProject.members.find(m => m.userId === user.id);
        if (memberInfo) {
          setProjectRoles(memberInfo.roles);
        } else {
          setProjectRoles([]);
        }
      } else {
        setProjectRoles([]);
      }
    } else if (!activeProjectId || !user) {
      setProjectRoles([]);
    }
  }, [activeProjectId, user, availableProjects, setProjectRoles]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleAuthAction = () => {
    if (isAuthenticated) {
      mockLogout();
      navigate('/');
    } else {
      mockLogin('userLead123');
    }
  };

  const handleProjectSelect = (projectId: string) => {
    setActiveProject(projectId);
    navigate(`/project/${projectId}`); 
  };
  
  const mainNavItems = baseNavItems.map(item => ({...item, disabled: false, tooltip: item.label, visible: true}));

  const projectContextMenuItems = activeProjectId ? projectNavItems.map(item => {
    let isDisabled = false;
    let itemTooltip = item.label;
    
    if (item.requiredRoles.length > 0) {
      const hasRequiredRole = item.requiredRoles.some(role => activeProjectRoles.includes(role));
      if (!hasRequiredRole) {
        isDisabled = true;
        itemTooltip = 'You do not have the required role for this feature.';
      }
    }

    return {
      ...item,
      path: `/project/${activeProjectId}${item.path}`,
      disabled: isDisabled,
      tooltip: itemTooltip,
      visible: true,
    };
  }).filter(item => item.visible) : [];

  const sidebarBottomActions = [
    {
      label: isDarkMode ? 'Light Mode' : 'Dark Mode',
      icon: isDarkMode ? <PiSunDuotone /> : <PiMoonDuotone />,
      action: toggleDarkMode,
      title: isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
    },
    {
      label: isAuthenticated ? 'Sign Out' : 'Sign In',
      icon: isAuthenticated ? <PiSignOutDuotone /> : <PiSignInDuotone />,
      action: handleAuthAction,
      title: isAuthenticated ? (user ? `Sign Out ${user.name}` : 'Sign Out') : "Sign In"
    }
  ];

  const renderHeaderActions = () => {
    const { pathname } = useLocation();
    
    const isEncounterEffectivelyActive = submissionPatientData && submissionPatientData.initials;

    const defaultPatientData: PatientInputData = {
      initials: '', gender: '', dob: '', projectConsent: false, recontactConsent: false,
    };

    interface ContextAction {
      key: string;
      label: string;
      icon: React.ReactElement;
      onClick: () => void;
      variant: 'primary' | 'secondary' | 'outline-primary' | 'outline-slate';
      priority?: 'high' | 'medium' | 'low';
    }

    let contextActions: ContextAction[] = [];

    if (pathname === '/' || pathname === '/dashboard') {
      contextActions.push({
        key: 'create-project',
        label: 'New Project',
        icon: <PiPlusCircleDuotone/>,
        onClick: () => navigate('/dashboard/create-project'),
        variant: 'primary',
        priority: 'high'
      });
    }

    if (pathname.startsWith('/project/') && pathname.endsWith('/submission')) {
      contextActions.push({
        key: 'new-encounter',
        label: 'New Encounter',
        icon: <PiFilePlusDuotone/>,
        onClick: () => {
          if (isEncounterEffectivelyActive) {
              if (window.confirm('You have an active encounter. Starting a new one will clear the current progress. Continue?')) {
                  startNewEncounter(defaultPatientData, []); 
                  navigate(`/project/${activeProjectId}/submission`);
              }
          } else {
               startNewEncounter(defaultPatientData, []);
               navigate(`/project/${activeProjectId}/submission`);
          }
        },
        variant: 'primary',
        priority: 'high'
      });
      
      if (isEncounterEffectivelyActive) {
        contextActions.push({
          key: 'resume-encounter',
          label: 'Resume Encounter',
          icon: <PiPlayCircleDuotone/>,
          onClick: () => navigate(`/project/${activeProjectId}/submission`),
          variant: 'outline-primary',
          priority: 'high'
        });
      }
    }
    
    if (pathname.startsWith('/project/') && pathname.endsWith('/builder')) {
      contextActions.push(
        {
          key: 'new-form',
          label: 'New Form',
          icon: <PiTextAaDuotone />,
          onClick: () => alert('New Blank Form (TBD)'),
          variant: 'primary',
          priority: 'high'
        },
        {
          key: 'load-form',
          label: 'Load Form',
          icon: <PiArchiveDuotone />,
          onClick: () => alert('Load Existing Form (TBD)'),
          variant: 'outline-slate',
          priority: 'medium'
        }
      );
    }

    if (pathname.startsWith('/project/') && pathname.endsWith('/roles')) {
       contextActions.push({
        key: 'new-role',
        label: 'New Role',
        icon: <PiUserPlusDuotone />,
        onClick: () => alert('Create New Role (TBD)'),
        variant: 'primary',
        priority: 'high'
       });
    }
    
    if (pathname.startsWith('/project/') && activeProjectId) {
        contextActions.push({
          key: 'quick-save',
          label: 'Quick Save',
          icon: <PiFloppyDiskDuotone />,
          onClick: () => alert('Quick Save Project Details (TBD)'),
          variant: 'outline-slate',
          priority: 'low'
        });
    }

    if (contextActions.length === 0) return null;

    // Render context action buttons with distinctive styling
    return contextActions.map((action) => (
      <div key={action.key} className="group/context-action relative">
        {/* Context Action Button */}
        <button
          onClick={action.onClick}
          className={`
            context-action-btn flex items-center justify-center
            transition-all duration-300 ease-out
            relative overflow-hidden
            ${action.variant === 'primary' 
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-500 dark:hover:to-blue-600 text-white shadow-lg dark:shadow-blue-500/25' 
              : action.variant === 'outline-primary'
                ? 'bg-white dark:bg-slate-800 border-2 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 shadow-md'
                : 'bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 shadow-md'
            }
            
            /* Responsive sizing */
            h-10 sm:h-11
            w-10 sm:w-auto
            rounded-xl sm:rounded-lg
            px-0 sm:px-4
            
            /* Hover effects */
            hover:scale-105 hover:shadow-xl
            active:scale-95
            
            /* Focus states */
            focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800
          `}
          title={action.label}
        >
          {/* Icon */}
          <span className="flex items-center justify-center text-lg sm:text-base transition-transform duration-200 group-hover/context-action:scale-110">
{action.icon}
          </span>
          
          {/* Text - hidden on small screens, visible on larger screens */}
          <span className="hidden sm:inline-block ml-2 font-medium text-sm whitespace-nowrap">
            {action.label}
          </span>
          
          {/* Animated background overlay on hover */}
          <div className="absolute inset-0 bg-white/20 dark:bg-white/10 opacity-0 group-hover/context-action:opacity-100 transition-opacity duration-300 rounded-xl sm:rounded-lg"></div>
        </button>
        
        {/* Tooltip for small screens - appears on hover */}
        <div className="sm:hidden absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded-md opacity-0 group-hover/context-action:opacity-100 transition-all duration-200 delay-500 pointer-events-none whitespace-nowrap z-50">
          {action.label}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 dark:bg-slate-700 rotate-45"></div>
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-purple-50/40 dark:from-slate-900 dark:via-indigo-950/50 dark:to-slate-900">
      {/* Enhanced Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-gradient-to-b from-white via-slate-50/80 to-white dark:from-slate-800 dark:via-slate-900/90 dark:to-slate-800 backdrop-blur-xl border-r-2 border-slate-200/60 dark:border-slate-700/60 shadow-xl dark:shadow-slate-900/20 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        
        {/* Enhanced Logo/Brand Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-r from-blue-50/50 via-white to-purple-50/50 dark:from-slate-800/50 dark:via-slate-700/50 dark:to-slate-800/50">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <PiCompassDuotone className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient">CREST</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Clinical Research Tool</p>
            </div>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <PiCaretLeftDuotone className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Enhanced Active Project Display */}
        {activeProjectDetails && (
          <div className="px-4 py-3 mx-3 mt-4 rounded-xl bg-gradient-to-r from-blue-50/60 via-indigo-50/40 to-purple-50/60 dark:from-blue-900/20 dark:via-indigo-900/15 dark:to-purple-900/20 border border-blue-200/50 dark:border-blue-800/30">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Active Project</p>
            <p className="text-sm font-bold text-gradient truncate mt-0.5">{activeProjectDetails.name}</p>
          </div>
        )}

        {/* Enhanced Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {mainNavItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className="group flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02] text-slate-700 dark:text-slate-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 hover:shadow-md"
            >
              <item.icon className="mr-3 flex-shrink-0 transition-colors w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Enhanced User Section */}
        <div className="p-4 border-t-2 border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-r from-slate-50/50 via-white to-slate-50/50 dark:from-slate-800/50 dark:via-slate-700/50 dark:to-slate-800/50">
          {user && (
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-emerald-50/60 to-teal-50/60 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200/50 dark:border-emerald-800/30">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=10b981&color=fff&size=40&font-size=0.40&bold=true`}
                alt={user.name}
                className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-600 shadow-md"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{user.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Enhanced Main Content */}
      <div className="lg:pl-64">
        {/* Enhanced Header */}
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b-2 border-slate-200/60 dark:border-slate-700/60 shadow-lg">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/50 dark:border-blue-800/30 hover:shadow-md transition-all duration-200"
            >
              <PiMenuIcon className="w-6 h-6 text-slate-600 dark:text-slate-400" />
            </button>

            {/* Enhanced Right side controls */}
            <div className="flex items-center space-x-3">
              {/* Enhanced Theme toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200/50 dark:border-amber-800/30 hover:shadow-lg transition-all duration-200 hover:scale-105"
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? (
                  <PiSunDuotone className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                ) : (
                  <PiMoonDuotone className="w-5 h-5 text-slate-600" />
                )}
              </button>

              {/* Enhanced User menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600 border border-slate-200/50 dark:border-slate-600/50 hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  <PiUserCircleDuotone className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                  <PiCaretDownDuotone className={`w-4 h-4 text-slate-600 dark:text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Enhanced User dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-xl overflow-hidden z-50">
                    <div className="p-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 border-b border-slate-200/60 dark:border-slate-700/60">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{user?.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                    </div>
                    <button
                      onClick={handleAuthAction}
                      className="w-full flex items-center px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 dark:hover:from-red-900/20 dark:hover:to-rose-900/20 transition-all duration-200"
                    >
                      <PiSignOutDuotone className="w-4 h-4 mr-3" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Enhanced Main content area */}
        <main className="min-h-screen bg-gradient-to-br from-slate-50/50 via-blue-50/30 to-purple-50/50 dark:from-slate-900/50 dark:via-indigo-950/30 dark:to-slate-900/50">
          <div className="animation-fade-in">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Enhanced Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout; 