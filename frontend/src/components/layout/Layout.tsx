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
  PiListBulletsDuotone,
  PiFloppyDiskDuotone,
  PiUserPlusDuotone,
  PiTextAaDuotone,
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
  const { patientData: submissionPatientData, startNewEncounter } = useSubmissionStore();

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
    <div className={`flex h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-300 transition-colors duration-300`}>
      <aside 
        ref={sidebarRef}
        className={`transition-all duration-300 ease-in-out bg-white dark:bg-slate-800 flex flex-col print:hidden 
                    ${isSidebarCollapsed ? 'w-16' : 'w-72'}
                    border-r border-slate-200 dark:border-slate-700/80 shadow-lg dark:shadow-none`}
      >
        <div className={`h-16 flex items-center shrink-0 px-4 border-b border-slate-200 dark:border-slate-700/80 ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isSidebarCollapsed && (
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-emerald-500 hover:via-blue-500 hover:to-purple-500 transition-all duration-300">
              CREST
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
            {mainNavItems.map(item => (
               <li key={item.id || item.path}>
                <Link 
                  to={item.path} 
                  title={item.tooltip}
                  className={`flex items-center h-10 px-2.5 text-sm rounded-md transition-colors duration-150 group 
                              ${isSidebarCollapsed ? 'justify-center' : ''}
                              text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 
                              ${location.pathname === item.path ? 'bg-slate-100 dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-semibold' : 'font-medium'}`
                            }
                >
                  <item.icon 
                    size={isSidebarCollapsed ? 21 : 18} 
                    className={`transition-all duration-200 group-hover:scale-105 shrink-0 
                                ${!isSidebarCollapsed ? 'mr-2.5' : 'mr-0'}
                                ${location.pathname === item.path ? 'text-blue-500 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 group-hover:text-blue-500 dark:group-hover:text-blue-400'}
                              `}
                  />
                  <span 
                    className={`whitespace-nowrap transition-all duration-200 overflow-hidden 
                                ${isSidebarCollapsed ? 'opacity-0 w-0 ml-0' : 'opacity-100 w-auto ml-0 delay-100'} `}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {activeProjectId && projectContextMenuItems.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-200/80 dark:border-slate-700/60">
              <div className={`px-2 mb-2 ${isSidebarCollapsed ? 'hidden' : 'block'}`}>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Project Menu</span>
              </div>
              <ul>
                {projectContextMenuItems.map(item => {
                  const isOverview = item.id === 'overview';
                  const isActive = isOverview
                    ? (location.pathname === item.path || location.pathname === `${item.path}/`)
                    : location.pathname === item.path;

                  return (
                  <li key={item.id}>
                    <Link
                      to={item.disabled ? '#' : item.path}
                      title={item.tooltip}
                      className={`flex items-center text-sm rounded-md transition-colors duration-150 group 
                                  ${isSidebarCollapsed 
                                    ? 'h-10 px-2.5 justify-center' 
                                    : isOverview 
                                      ? 'h-10 px-2.5' 
                                      : 'h-9 pl-6 pr-2.5'
                                  }
                                  ${item.disabled 
                                    ? 'text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-70' 
                                    : `text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 
                                       ${isActive ? 'bg-slate-100 dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-semibold' : 'font-medium'}`
                                  }`
                      }
                      onClick={(e) => item.disabled && e.preventDefault()}
                      aria-disabled={item.disabled}
                    >
                      <item.icon 
                        size={isSidebarCollapsed ? 21 : (isOverview ? 18 : 17)} 
                        className={`transition-all duration-200 group-hover:scale-105 shrink-0 
                                    ${!isSidebarCollapsed ? 'mr-2.5' : 'mr-0'}
                                    ${item.disabled 
                                      ? 'text-slate-400 dark:text-slate-500' 
                                      : (isActive 
                                        ? 'text-blue-500 dark:text-blue-400' 
                                        : 'text-slate-500 dark:text-slate-400 group-hover:text-blue-500 dark:group-hover:text-blue-400'
                                      )
                                    }`
                                  }
                      />
                      <span 
                        className={`whitespace-nowrap transition-all duration-200 overflow-hidden 
                                    ${isSidebarCollapsed ? 'opacity-0 w-0 ml-0' : 'opacity-100 w-auto ml-0 delay-100'}`}
                      >
                        {item.label}
                      </span>
                      {item.disabled && isSidebarCollapsed && (
                        <PiLockKeyDuotone size={14} className="absolute right-1 top-1 text-amber-500 dark:text-amber-600 opacity-70" title={item.tooltip}/>
                      )}
                    </Link>
                  </li>
                  );
                })}
              </ul>
            </div>
          )}
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
        <header className="bg-white dark:bg-slate-800 shadow-sm dark:shadow-none dark:border-b dark:border-slate-700/80 dark:shadow-[0_2px_8px_-1px_rgba(0,0,0,0.1)] print:hidden">
          {/* Top row: Page title and user info */}
          <div className="h-16 flex items-center justify-between px-4 sm:px-6">
            <div className="flex-grow min-w-0">
              <h1 className="page-header truncate">{pageTitle}</h1>
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
          </div>
          
          {/* Bottom row: Contextual actions - only show when there are actions */}
          {renderHeaderActions() && (
            <div className="px-4 sm:px-6 py-3 bg-gradient-to-r from-slate-50 via-slate-100/50 to-slate-50 dark:from-slate-800/60 dark:via-slate-800/40 dark:to-slate-800/60 border-t border-slate-200 dark:border-slate-700/60 backdrop-blur-sm">
              <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3">
                {renderHeaderActions()}
              </div>
            </div>
          )}
        </header>
        
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-slate-100 dark:bg-slate-900">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout; 