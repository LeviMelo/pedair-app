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
  PiLockKeyDuotone,
  PiFilePlusDuotone,
  PiArchiveDuotone,
  PiPlayCircleDuotone,
  PiHouseDuotone,
} from 'react-icons/pi';
import useAuthStore, { mockLogin, mockLogout } from '../../stores/authStore';
import useProjectStore from '../../stores/projectStore';
import useSubmissionStore from '../../stores/submissionStore';
import Button from '../ui/Button';

const baseNavItems = [
  { id: 'dashboard', path: '/', label: 'Dashboard', icon: PiGaugeDuotone, requiresProject: false, requiredRoles: [] },
  { id: 'forms', path: '/forms', label: 'Data Submission', icon: PiListChecksDuotone, requiresProject: true, requiredRoles: ['Researcher', 'ProjectLead', 'DataEntry'] },
  { id: 'builder', path: '/builder', label: 'Form Builder', icon: PiSquaresFourDuotone, requiresProject: true, requiredRoles: ['ProjectLead', 'FormDesigner'] },
  { id: 'roles', path: '/roles', label: 'Role Editor', icon: PiUsersDuotone, requiresProject: true, requiredRoles: ['ProjectLead'] },
  { id: 'search', path: '/search', label: 'Patient Search', icon: PiMagnifyingGlassDuotone, requiresProject: true, requiredRoles: ['Researcher', 'ProjectLead', 'Clinician'] },
  { id: 'scheduler', path: '/scheduler', label: 'Notifications', icon: PiBellDuotone, requiresProject: true, requiredRoles: ['ProjectLead', 'Coordinator'] },
  { id: 'settings', path: '/settings', label: 'Settings', icon: PiGearDuotone, requiresProject: false, requiredRoles: [] },
];

const getPageTitle = (pathname: string, activeProjectName?: string | null, activeProjectId?: string | null) => {
  let navItemsForTitle = [...baseNavItems];
  if (activeProjectId) {
    navItemsForTitle.unshift({
      id: 'projectOverview',
      path: `/project/${activeProjectId}`,
      label: 'Project Overview',
      icon: PiHouseDuotone, 
      requiresProject: true,
      requiredRoles: []
    });
  }
  const mainNavItem = navItemsForTitle.find(navItem => navItem.path === pathname);
  if (mainNavItem) {
    return mainNavItem.requiresProject && activeProjectName ? `${mainNavItem.label} - ${activeProjectName}` : mainNavItem.label;
  }
  if (pathname.startsWith('/project/') && activeProjectName) {
    return `Project Details - ${activeProjectName}`;
  }
  if (pathname.startsWith('/dashboard/create-project')) {
    return 'Create New Project';
  }
  if (pathname.startsWith('/test/')) {
    const testName = pathname.split('/').pop();
    return `Test: ${testName?.charAt(0).toUpperCase()}${testName?.slice(1).replace(/([A-Z])/g, ' $1').trim() || 'Form'}`;
  }
  return activeProjectName ? `Project: ${activeProjectName}` : 'PedAir Application';
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

  const { isAuthenticated, user, activeProjectRoles, setProjectRoles } = useAuthStore();
  const { 
    availableProjects,
    activeProjectId, 
    activeProjectDetails, 
    fetchAvailableProjects, 
    setActiveProject,
    clearActiveProject 
  } = useProjectStore();
  const { patientData: submissionPatientData } = useSubmissionStore();

  const pageTitle = getPageTitle(location.pathname, activeProjectDetails?.name, activeProjectId);
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

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

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
    setShowProjectSelector(false);
    navigate('/'); 
  };
  
  const navItems = [
    ...(activeProjectId ? [{
      id: 'projectOverview',
      path: `/project/${activeProjectId}`,
      label: 'Project Overview',
      icon: PiHouseDuotone, 
      requiresProject: true,
      requiredRoles: []
    }] : []),
    ...baseNavItems
  ].map(item => {
    let isDisabled = false;
    let itemTooltip = item.label;
    let isVisible = true; 

    if (item.requiresProject) {
      if (!activeProjectId) {
        isDisabled = true;
        itemTooltip = 'Select a project to access this feature.';
      } else if (item.requiredRoles.length > 0) {
        const hasRequiredRole = item.requiredRoles.some(role => activeProjectRoles.includes(role));
        if (!hasRequiredRole) {
          isDisabled = true;
          itemTooltip = 'You do not have the required role for this feature in the current project.';
        }
      }
    }
    return {
      ...item,
      disabled: isDisabled,
      tooltip: itemTooltip,
      visible: isVisible,
    };
  }).filter(item => item.visible);

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
    if (!activeProjectId && (location.pathname === '/forms' || location.pathname === '/builder')) {
      return <p className="text-xs text-amber-600 dark:text-amber-400 animation-fade-in">Select a project to see actions.</p>;
    }
    if (!activeProjectId && (location.pathname === '/forms' || location.pathname === '/builder' || location.pathname.startsWith('/project/'))) return null;

    switch (location.pathname) {
      case '/forms':
        return (
          <div className="flex items-center space-x-2 animation-fade-in">
            <Button 
              variant="ghost"
              size="sm" 
              iconLeft={<PiPlayCircleDuotone/>}
              onClick={() => navigate('/forms')} 
              title={submissionPatientData ? "Resume current encounter or start new if needed" : "Start a new data collection encounter"}
              className="text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              {submissionPatientData ? 'New/Resume Encounter' : 'New Encounter'}
            </Button>
            <Button 
              variant="ghost"
              size="sm" 
              iconLeft={<PiArchiveDuotone/>}
              onClick={() => navigate('/forms/history')} 
              title="View Past Submissions (Placeholder)"
              className="text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              View Submissions
            </Button>
          </div>
        );
      case '/builder':
        return (
          <div className="flex items-center space-x-2 animation-fade-in">
            <Button 
              variant="ghost" 
              size="sm" 
              iconLeft={<PiFilePlusDuotone/>}
              onClick={() => alert('Trigger New Blank Form in FormBuilderPage - TBD')}
              className="text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              New Form
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              iconLeft={<PiArchiveDuotone/>}
              onClick={() => alert('Trigger Load Project Form in FormBuilderPage - TBD')}
              className="text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              Load Form
            </Button>
          </div>
        );
      default:
        if (activeProjectDetails && location.pathname === `/project/${activeProjectDetails.id}`) {
            return null; 
        }
        return null;
    }
  };

  return (
    <div className={`flex h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-300 transition-colors duration-300`}>
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
                    {availableProjects.map(proj => (
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
                    } 
                    <Button 
                        variant='link' 
                        iconLeft={<PiPlusCircleDuotone />}
                        onClick={() => navigate('/dashboard/create-project')}
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
              <li key={item.id || item.path} 
                  className={`${(index > 0 && !(activeProjectId && index === 0)) ? 'border-t border-slate-200/60 dark:border-slate-700/50' : ''} 
                             ${(activeProjectId && index === 0) ? 'mb-2 border-b border-slate-200/80 dark:border-slate-700/60 pb-2' :'' }`}>
                <Link 
                  to={item.disabled ? '#' : item.path} 
                  title={item.tooltip}
                  className={`flex items-center h-10 px-2.5 text-sm rounded-md transition-colors duration-150 group 
                              ${isSidebarCollapsed ? 'justify-center' : ''}
                              ${item.disabled 
                                ? 'text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-70' 
                                : `text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 
                                   ${(location.pathname === item.path || (item.id === 'projectOverview' && location.pathname.startsWith('/project/'))) ? 'bg-slate-100 dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-semibold' : 'font-medium'}`}
                            `}
                  onClick={(e) => item.disabled && e.preventDefault()}
                  aria-disabled={item.disabled}
                >
                  <item.icon 
                    size={isSidebarCollapsed ? 21 : 18} 
                    className={`transition-all duration-200 group-hover:scale-105 shrink-0 
                                ${!isSidebarCollapsed ? 'mr-2.5' : 'mr-0'}
                                ${item.disabled ? 'text-slate-400 dark:text-slate-500' : ((location.pathname === item.path || (item.id === 'projectOverview' && location.pathname.startsWith('/project/'))) ? 'text-blue-500 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 group-hover:text-blue-500 dark:group-hover:text-blue-400')}
                              `}
                  />
                  <span 
                    className={`whitespace-nowrap transition-all duration-200 overflow-hidden 
                                ${isSidebarCollapsed ? 'opacity-0 w-0 ml-0' : 'opacity-100 w-auto ml-0 delay-100'} 
                                ${isSidebarCollapsed && !item.disabled ? 'group-hover:ml-2.5' : 'ml-2.5'} `}
                  >
                    {item.label}
                  </span>
                   {item.disabled && isSidebarCollapsed && (
                     <PiLockKeyDuotone size={14} className="absolute right-1 top-1 text-amber-500 dark:text-amber-600 opacity-70" title={item.tooltip}/>
                   )}
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

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 flex items-center justify-between bg-white dark:bg-slate-800 shadow-sm dark:shadow-none dark:border-b dark:border-slate-700/80 dark:shadow-[0_2px_8px_-1px_rgba(0,0,0,0.1)] p-4 print:hidden">
            <div className="flex flex-col flex-grow min-w-0">
              <h1 className="page-header truncate">{pageTitle}</h1>
              <div className="mt-0.5 h-6 text-xs">
                {renderHeaderActions()}
              </div>
            </div>
            <div className="flex items-center space-x-3 shrink-0 ml-4">
                <Button 
                    variant="ghost" 
                    size="md"
                    className="btn-icon text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
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