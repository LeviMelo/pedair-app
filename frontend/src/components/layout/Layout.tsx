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
  PiBriefcaseDuotone,
  PiPlusCircleDuotone,
} from 'react-icons/pi';
import useAuthStore, { mockLogin, mockLogout } from '../../stores/authStore';
import useProjectStore from '../../stores/projectStore';
import Button from '../ui/Button';

const navItemsBase = [
  { path: '/', label: 'Dashboard', icon: PiGaugeDuotone, requiresProject: false },
  { path: '/forms', label: 'Data Submission', icon: PiListChecksDuotone, requiresProject: true },
  { path: '/builder', label: 'Form Builder', icon: PiSquaresFourDuotone, requiresProject: true },
  { path: '/roles', label: 'Role Editor', icon: PiUsersDuotone, requiresProject: true },
  { path: '/search', label: 'Patient Search', icon: PiMagnifyingGlassDuotone, requiresProject: true },
  { path: '/scheduler', label: 'Notifications', icon: PiBellDuotone, requiresProject: true },
  { path: '/settings', label: 'Settings', icon: PiGearDuotone, requiresProject: false },
];

// Helper function to get page title from path
const getPageTitle = (pathname: string, activeProjectName?: string | null) => {
  const item = navItemsBase.find(navItem => navItem.path === pathname);
  if (item) {
    return item.requiresProject && activeProjectName ? `${item.label} - ${activeProjectName}` : item.label;
  }
  if (pathname.startsWith('/test/')) {
    const testName = pathname.split('/').pop();
    return `Test: ${testName?.charAt(0).toUpperCase()}${testName?.slice(1).replace(/([A-Z])/g, ' $1').trim() || 'Form'}`;
  }
  return activeProjectName ? `Project: ${activeProjectName}` : 'PedAir Application'; // Default title
};

const Layout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [showProjectSelector, setShowProjectSelector] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Zustand store integration
  const { isAuthenticated, user, activeProjectRoles } = useAuthStore();
  const { 
    availableProjects, 
    activeProjectId, 
    activeProjectDetails, 
    fetchAvailableProjects, 
    setActiveProject,
    clearActiveProject 
  } = useProjectStore();

  const pageTitle = getPageTitle(location.pathname, activeProjectDetails?.name);
  const sidebarRef = useRef<HTMLElement>(null);

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
    // Fetch available projects when component mounts (if user is authenticated, for example)
    // For now, always fetch. Add auth check if needed.
    fetchAvailableProjects();
    // Simulate initial login for demonstration
    if(!isAuthenticated) mockLogin('user123', ['ProjectLead']); 
  }, [fetchAvailableProjects, isAuthenticated]);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleAuthAction = () => {
    if (isAuthenticated) {
      mockLogout();
      clearActiveProject(); // Also clear active project on logout
      navigate('/'); // Navigate to dashboard or a public page
    } else {
      mockLogin('user123', ['Researcher']); // Simulate login
    }
  };

  const handleProjectSelect = (projectId: string) => {
    setActiveProject(projectId);
    setShowProjectSelector(false);
    // Potentially navigate to dashboard or last project-specific page
    navigate('/'); 
  };
  
  const navItems = navItemsBase.map(item => ({
    ...item,
    disabled: item.requiresProject && !activeProjectId,
    tooltip: item.requiresProject && !activeProjectId ? 'Select a project to access this feature' : item.label
  }));

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

  return (
    <div className={`flex h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-300 transition-colors duration-300`}>
      {/* Sidebar */}
      <aside 
        ref={sidebarRef}
        className={`transition-all duration-300 ease-in-out bg-white dark:bg-slate-800 flex flex-col print:hidden 
                    ${isSidebarCollapsed ? 'w-16' : 'w-72'}
                    border-r border-slate-200 dark:border-slate-700/80 shadow-lg dark:shadow-none`}
      >
        <div className={`h-16 flex items-center shrink-0 px-4 border-b border-slate-200 dark:border-slate-700/80 ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isSidebarCollapsed && (
            <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-500 hover:opacity-80 transition-opacity">
              PedAir
            </Link>
          )}
          <Button 
            variant='ghost' 
            size='sm' 
            onClick={toggleSidebar} 
            iconLeft={isSidebarCollapsed ? <PiMenuIcon size={22}/> : <PiCaretLeftDuotone size={22}/>}
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className='p-0.5'
          >{null}</Button>
        </div>

        <div className={`px-2 py-3 border-b border-slate-200 dark:border-slate-700/80 shrink-0 ${isSidebarCollapsed ? 'px-1' : 'px-3'}`}>
            {isAuthenticated && (
                 <div className={`${isSidebarCollapsed ? 'relative group' : ''}`}>
                    <Button 
                        variant='outline-slate'
                        fullWidth
                        onClick={() => !isSidebarCollapsed && setShowProjectSelector(!showProjectSelector)}
                        title={activeProjectDetails ? `Current Project: ${activeProjectDetails.name}` : "Select Project"}
                        iconLeft={<PiBriefcaseDuotone />}
                        iconRight={!isSidebarCollapsed ? <PiCaretDownDuotone className={`transform transition-transform duration-200 ${showProjectSelector ? 'rotate-180' : ''}`} /> : undefined}
                        className={`dark:bg-slate-700/60 dark:hover:bg-slate-600/80 ${isSidebarCollapsed ? 'justify-center' : ''}`}
                        aria-expanded={showProjectSelector}
                    >
                        {!isSidebarCollapsed && (
                            <span className="truncate flex-1 text-left">
                                {activeProjectDetails ? activeProjectDetails.name : "Select Project"}
                            </span>
                        )}
                    </Button>
                    {isSidebarCollapsed && (
                        <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-slate-700 dark:bg-slate-600 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity delay-300 pointer-events-none">
                           {activeProjectDetails ? activeProjectDetails.name : "Select Project"}
                        </span>
                    )}
                 </div>
            )}
            {showProjectSelector && !isSidebarCollapsed && (
                <div className="mt-1.5 p-1.5 bg-slate-50 dark:bg-slate-700/40 rounded-md shadow-inner max-h-48 overflow-y-auto space-y-0.5">
                    {availableProjects.length > 0 ? (
                        availableProjects.map(proj => (
                            <Button 
                                key={proj.id} 
                                variant={activeProjectId === proj.id ? 'primary' : 'ghost'} 
                                fullWidth 
                                onClick={() => handleProjectSelect(proj.id)}
                                className='text-left justify-start'
                                size='sm'
                            >
                                {proj.name}
                            </Button>
                        ))
                    ) : (
                        <p className="text-xs text-slate-500 dark:text-slate-400 p-2 text-center">No projects available.</p>
                    )}
                     <Button 
                        variant='link' 
                        iconLeft={<PiPlusCircleDuotone />}
                        onClick={() => console.log("TODO: Navigate to New Project Page")}
                        className='w-full justify-start mt-1 text-blue-600 dark:text-blue-400'
                        size='sm'
                    >
                        New Project...
                    </Button>
                </div>
            )}
        </div>
        
        <nav className="flex-grow px-2 py-3 space-y-0.5 overflow-y-auto">
          <ul>
            {navItems.map((item, index) => (
              <li key={item.path} className={`${index > 0 ? 'border-t border-slate-200/60 dark:border-slate-700/50' : ''}`}>
                <Link 
                  to={item.disabled ? '#' : item.path} 
                  title={item.tooltip}
                  className={`flex items-center h-10 px-2.5 text-sm rounded-md transition-colors duration-150 group 
                              ${isSidebarCollapsed ? 'justify-center' : ''}
                              ${item.disabled 
                                ? 'text-slate-400 dark:text-slate-500 cursor-not-allowed' 
                                : `text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 
                                   ${location.pathname === item.path ? 'bg-slate-100 dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-semibold' : 'font-medium'}`}
                            `}
                  onClick={(e) => item.disabled && e.preventDefault()}
                  aria-disabled={item.disabled}
                >
                  <item.icon size={isSidebarCollapsed ? 21 : 18} className={`transition-all duration-200 group-hover:scale-105 shrink-0 ${!isSidebarCollapsed ? 'mr-2.5' : 'mr-0'}`} />
                  <span 
                    className={`whitespace-nowrap transition-all duration-200 overflow-hidden 
                                ${isSidebarCollapsed ? 'opacity-0 w-0 ml-0' : 'opacity-100 w-auto ml-2.5 delay-100'}`}>
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-2 border-t border-slate-200 dark:border-slate-700/80 space-y-1 shrink-0">
          {sidebarBottomActions.map(btnInfo => (
            <Button 
              key={btnInfo.label}
              variant='ghost' 
              fullWidth
              onClick={btnInfo.action}
              title={btnInfo.title}
              iconLeft={btnInfo.icon} 
              className={`justify-start ${isSidebarCollapsed ? 'justify-center' : ''}`}
              size='sm'
            >
              {!isSidebarCollapsed && <span className="whitespace-nowrap">{btnInfo.label}</span>}
            </Button>
          ))}
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 flex items-center justify-between bg-white dark:bg-slate-800 shadow-sm dark:shadow-none dark:border-b dark:border-slate-700/80 dark:shadow-[0_2px_8px_-1px_rgba(0,0,0,0.1)] p-4 print:hidden">
            <div className="flex flex-col">
              <h1 className="page-header truncate">{pageTitle}</h1>
              {activeProjectDetails && <p className="page-subheader">Project: {activeProjectDetails.name}</p>}
            </div>
            <div className="flex items-center space-x-3">
                <Button 
                    variant="ghost" 
                    className="btn-icon" 
                    title="Notifications" 
                    iconLeft={<PiBellDuotone size={20} />}
                >{null}</Button>
                {isAuthenticated && user ? (
                     <div title={`${user.name} (${user.email})`} className="flex items-center space-x-2 cursor-default">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300 hidden sm:inline truncate max-w-xs">{user.name}</span> 
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&size=32&color=fff&font-size=0.40`} alt={user.name} className="w-8 h-8 rounded-full ring-1 ring-slate-200 dark:ring-slate-600"/>
                    </div>
                ) : (
                     <img src="https://via.placeholder.com/32?text=?" alt="User Avatar" className="w-8 h-8 rounded-full ring-1 ring-slate-200 dark:ring-slate-600"/>
                )}
            </div>
        </header>
        
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-slate-100 dark:bg-slate-900">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout; 