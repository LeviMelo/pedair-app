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
  PiCaretRightDuotone,
  PiSunDuotone,
  PiMoonDuotone,
  PiSignOutDuotone,
  PiHouseDuotone,
  PiCompassDuotone,
  PiEyeDuotone,
  PiChartBarDuotone,
  PiChatCircleDuotone,
  PiGearSixDuotone,
  PiEyeSlashDuotone,
  PiCaretDoubleLeftDuotone,
  PiCaretDoubleRightDuotone
} from 'react-icons/pi';
import useAuthStore, { mockLogin, mockLogout } from '../../stores/authStore';
import useProjectStore from '../../stores/projectStore';

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

// Sidebar state enum
type SidebarState = 'hidden' | 'collapsed' | 'full';

const Layout: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [showProjectSelector, setShowProjectSelector] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarState, setSidebarState] = useState<SidebarState>('full');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const { isAuthenticated, user, activeProjectRoles, setProjectRoles } = useAuthStore();
  const { 
    availableProjects,
    activeProjectId, 
    activeProjectDetails, 
    fetchAvailableProjects, 
    setActiveProject
  } = useProjectStore();

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
        setSidebarState('collapsed');
      } else if (window.innerWidth < 1024) {
        setSidebarState('collapsed');
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

  const toggleSidebar = () => {
    setSidebarState(prev => {
      switch (prev) {
        case 'hidden': return 'collapsed';
        case 'collapsed': return 'full';
        case 'full': return 'collapsed';
        default: return 'full';
      }
    });
  };

  const expandSidebar = () => setSidebarState('full');
  const collapseSidebar = () => setSidebarState('collapsed');
  const hideSidebar = () => setSidebarState('hidden');
  const showSidebar = () => setSidebarState('full');

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

  const getContextNavItems = () => {
    const { pathname } = location;
    
    if (pathname === '/' || pathname === '/dashboard') {
      return [
        { key: 'projects', label: 'Projects', icon: PiHouseDuotone, path: '/', active: true },
        { key: 'analytics', label: 'Analytics', icon: PiChartBarDuotone, path: '/analytics', active: false },
      ];
    }

    if (pathname.startsWith('/project/') && activeProjectId) {
      const contextItems = [
        { key: 'overview', label: 'Overview', icon: PiHouseDuotone, path: `/project/${activeProjectId}`, active: pathname === `/project/${activeProjectId}` },
        { key: 'data', label: 'Enter Data', icon: PiListChecksDuotone, path: `/project/${activeProjectId}/submission`, active: pathname.includes('/submission') },
        { key: 'reports', label: 'View Reports', icon: PiEyeDuotone, path: `/project/${activeProjectId}/reports`, active: pathname.includes('/reports') },
        { key: 'discussions', label: 'Discussions', icon: PiChatCircleDuotone, path: `/project/${activeProjectId}/discussions`, active: pathname.includes('/discussions') },
        { key: 'settings', label: 'Project Settings', icon: PiGearSixDuotone, path: `/project/${activeProjectId}/settings`, active: pathname.includes('/settings') },
      ];
      
      // Add form builder if user has permission
      if (activeProjectRoles.includes('ProjectLead') || activeProjectRoles.includes('FormDesigner')) {
        contextItems.splice(2, 0, { 
          key: 'builder', 
          label: 'Form Builder', 
          icon: PiSquaresFourDuotone, 
          path: `/project/${activeProjectId}/builder`, 
          active: pathname.includes('/builder') 
        });
      }
      
      return contextItems;
    }

    return [];
  };

  // Auto-initialize mock data for development
  useEffect(() => {
    if (!isAuthenticated) {
      console.log('Auto-logging in mock user for development...');
      mockLogin('userLead123');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && availableProjects.length > 0 && !activeProjectId) {
      console.log('Auto-selecting first project for development...');
      setActiveProject(availableProjects[0].id);
    }
  }, [isAuthenticated, availableProjects, activeProjectId, setActiveProject]);

  const getSidebarWidth = () => {
    switch (sidebarState) {
      case 'hidden': return 'w-0';
      case 'collapsed': return 'w-16';
      case 'full': return 'w-64';
      default: return 'w-64';
    }
  };

  const getContentPadding = () => {
    switch (sidebarState) {
      case 'hidden': return 'lg:pl-0';
      case 'collapsed': return 'lg:pl-16';
      case 'full': return 'lg:pl-64';
      default: return 'lg:pl-64';
    }
  };

  const renderSidebarToggle = () => {
    if (sidebarState === 'full') {
      return (
        <div className="p-4 border-t border-slate-200/60 dark:border-slate-700/60">
          <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 p-1 shadow-inner">
            <div className="flex relative">
              {/* Collapse Button */}
              <button
                onClick={collapseSidebar}
                className="flex-1 relative z-10 flex items-center justify-center px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 group"
                title="Collapse sidebar"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 opacity-0 group-hover:opacity-100 rounded-lg transition-all duration-300 shadow-lg"></div>
                <div className="relative flex items-center space-x-2 text-slate-700 dark:text-slate-300 group-hover:text-white transition-colors duration-300">
                  <PiCaretDoubleLeftDuotone className="w-4 h-4" />
                  <span>Collapse</span>
                </div>
              </button>
              
              {/* Hide Button */}
              <button
                onClick={hideSidebar}
                className="flex-1 relative z-10 flex items-center justify-center px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 group"
                title="Hide sidebar"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 opacity-0 group-hover:opacity-100 rounded-lg transition-all duration-300 shadow-lg"></div>
                <div className="relative flex items-center space-x-2 text-slate-700 dark:text-slate-300 group-hover:text-white transition-colors duration-300">
                  <PiEyeSlashDuotone className="w-4 h-4" />
                  <span>Hide</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      );
    } else if (sidebarState === 'collapsed') {
      return (
        <div className="p-4 border-t border-slate-200/60 dark:border-slate-700/60 space-y-2">
          {/* Expand Button */}
          <button
            onClick={expandSidebar}
            className="w-full relative group flex items-center justify-center p-3 rounded-xl transition-all duration-300 overflow-hidden"
            title="Expand sidebar"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            <PiCaretDoubleRightDuotone className="w-5 h-5 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
          </button>
          
          {/* Hide Button */}
          <button
            onClick={hideSidebar}
            className="w-full relative group flex items-center justify-center p-3 rounded-xl transition-all duration-300 overflow-hidden"
            title="Hide sidebar"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-pink-500 to-purple-500 opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            <PiEyeSlashDuotone className="w-5 h-5 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
          </button>
        </div>
      );
    }
    return null;
  };

  const sidebarWidth = getSidebarWidth();
  const contentPadding = getContentPadding();

  const getLogoContent = () => {
    if (window.innerWidth < 640) {
      // Mobile: Icon only
      return (
        <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 shadow-lg">
          <PiCompassDuotone className="w-6 h-6 text-white" />
        </div>
      );
    } else if (window.innerWidth < 1024) {
      // Tablet: Icon + Name
      return (
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 shadow-lg">
            <PiCompassDuotone className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gradient">CREST</h1>
        </div>
      );
    } else {
      // Desktop: Icon + Name + Subtitle
      return (
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 shadow-lg">
            <PiCompassDuotone className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gradient">CREST</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Clinical Research Tool</p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-purple-50/40 dark:from-slate-900 dark:via-indigo-950/50 dark:to-slate-900">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 ${sidebarWidth} transform bg-gradient-to-b from-white via-slate-50/80 to-white dark:from-slate-800 dark:via-slate-900/90 dark:to-slate-800 backdrop-blur-xl border-r-2 border-slate-200/60 dark:border-slate-700/60 shadow-xl dark:shadow-slate-900/20 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : sidebarState === 'hidden' ? '-translate-x-full' : 'translate-x-0'} lg:translate-x-0 ${sidebarState === 'hidden' ? 'lg:-translate-x-full' : ''} overflow-hidden`}>
        
        {/* Mobile Header - Close Button */}
        <div className={`flex items-center justify-between p-4 border-b-2 border-slate-200/60 dark:border-slate-700/60 lg:hidden sidebar-header-height`}>
          <span className="text-lg font-semibold text-slate-800 dark:text-slate-200">Menu</span>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <PiCaretLeftDuotone className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Active Project Display */}
        {activeProjectDetails && sidebarState === 'full' && (
          <div className="px-4 py-3 mx-3 mt-4">
            <div className="relative group">
              <button
                onClick={() => setShowProjectSelector(!showProjectSelector)}
                className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-blue-50/60 via-indigo-50/40 to-purple-50/60 dark:from-blue-900/20 dark:via-indigo-900/15 dark:to-purple-900/20 border border-blue-200/50 dark:border-blue-800/30 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Active Project</p>
                    <p className="text-sm font-bold text-gradient truncate mt-0.5">{activeProjectDetails.name}</p>
                  </div>
                  <PiCaretDownDuotone className={`w-4 h-4 text-slate-500 dark:text-slate-400 transition-transform ${showProjectSelector ? 'rotate-180' : ''}`} />
                </div>
              </button>
              
              {/* Project Selector Dropdown */}
              {showProjectSelector && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto">
                  {availableProjects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => {
                        handleProjectSelect(project.id);
                        setShowProjectSelector(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                        project.id === activeProjectId ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' : ''
                      }`}
                    >
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{project.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{project.description}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-2">
          {/* Main Navigation */}
          <div className="space-y-1">
            {mainNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`group flex items-center ${sidebarState === 'collapsed' ? 'justify-center px-2' : 'px-3'} py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'scale-105 bg-gradient-to-r from-blue-500/20 via-indigo-500/15 to-purple-500/20 dark:from-blue-400/25 dark:via-indigo-400/20 dark:to-purple-400/25 text-blue-700 dark:text-blue-300 shadow-lg dark:shadow-blue-400/20 border border-blue-200/50 dark:border-blue-700/50'
                      : 'hover:scale-[1.02] text-slate-700 dark:text-slate-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 hover:shadow-md'
                  }`}
                  title={sidebarState === 'collapsed' ? item.label : undefined}
                >
                  <item.icon className={`${sidebarState === 'collapsed' ? '' : 'mr-3'} flex-shrink-0 transition-colors w-5 h-5 ${
                    isActive
                      ? 'text-blue-700 dark:text-blue-300'
                      : 'text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                  }`} />
                  {sidebarState === 'full' && item.label}
                </Link>
              );
            })}
          </div>

          {/* Project Navigation */}
          {projectContextMenuItems.length > 0 && (
            <div className="pt-3">
              {sidebarState === 'full' && (
                <div className="px-3 py-2">
                  <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Project Tools</h3>
                </div>
              )}
              <div className="space-y-1">
                {projectContextMenuItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.id}
                      to={item.path}
                      className={`group flex items-center ${sidebarState === 'collapsed' ? 'justify-center px-2' : 'px-3'} py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        item.disabled
                          ? 'text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-50'
                          : isActive
                          ? 'scale-105 bg-gradient-to-r from-purple-500/20 via-pink-500/15 to-orange-500/20 dark:from-purple-400/25 dark:via-pink-400/20 dark:to-orange-400/25 text-purple-700 dark:text-purple-300 shadow-lg dark:shadow-purple-400/20 border border-purple-200/50 dark:border-purple-700/50'
                          : 'hover:scale-[1.02] text-slate-700 dark:text-slate-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 hover:shadow-md'
                      }`}
                      title={sidebarState === 'collapsed' ? item.label : item.tooltip}
                      onClick={item.disabled ? (e) => e.preventDefault() : undefined}
                    >
                      <item.icon className={`${sidebarState === 'collapsed' ? '' : 'mr-3'} flex-shrink-0 transition-colors w-5 h-5 ${
                        item.disabled
                          ? 'text-slate-400 dark:text-slate-600'
                          : isActive
                          ? 'text-purple-700 dark:text-purple-300'
                          : 'text-slate-500 dark:text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400'
                      }`} />
                      {sidebarState === 'full' && item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </nav>

        {/* Sidebar Toggle Controls */}
        {renderSidebarToggle()}
      </aside>

      {/* Floating show button when hidden */}
      {sidebarState === 'hidden' && (
        <div className="fixed top-6 left-6 z-50">
          <button 
            onClick={showSidebar}
            className="p-3 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            title="Show sidebar"
          >
            <PiCaretRightDuotone className="w-5 h-5 text-white" />
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className={contentPadding}>
        {/* Fixed Topbar - Superimposed over sidebar */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60 shadow-sm header-height">
          <div className="flex items-center h-full px-6">
            {/* Left: Mobile menu button + Logo */}
            <div className="flex items-center space-x-4 flex-shrink-0">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/50 dark:border-blue-800/30 hover:shadow-md transition-all duration-200"
              >
                <PiMenuIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
              
              {/* Logo - Responsive */}
              <Link to="/" className="hidden lg:flex group hover:scale-105 transition-transform duration-200">
                {getLogoContent()}
              </Link>
            </div>

            {/* Center: Scrollable Context Navigation */}
            <div className="flex-1 mx-4 min-w-0">
              <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide pb-1">
                {getContextNavItems().map((item) => (
                  <div
                    key={item.key}
                    className={`context-nav-item ${item.active ? 'active' : ''} flex-shrink-0`}
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon className="icon" />
                    <span className="hidden sm:inline whitespace-nowrap">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Fixed User Controls */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              {/* Sidebar Toggle for Desktop */}
              <button
                onClick={toggleSidebar}
                className="hidden lg:flex p-3 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 border border-slate-200/50 dark:border-slate-700/30 hover:shadow-lg transition-all duration-200 hover:scale-105"
                title="Toggle sidebar"
              >
                {sidebarState === 'full' ? (
                  <PiCaretDoubleLeftDuotone className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                ) : sidebarState === 'collapsed' ? (
                  <PiCaretDoubleRightDuotone className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                ) : (
                  <PiCaretRightDuotone className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                )}
              </button>

              {/* Theme toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200/50 dark:border-amber-800/30 hover:shadow-lg transition-all duration-200 hover:scale-105"
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? (
                  <PiSunDuotone className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                ) : (
                  <PiMoonDuotone className="w-4 h-4 text-slate-600" />
                )}
              </button>

              {/* User menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 pr-3 rounded-xl bg-gradient-to-r from-emerald-50/80 to-teal-50/80 dark:from-emerald-900/30 dark:to-teal-900/30 border border-emerald-200/50 dark:border-emerald-800/50 hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  {user && (
                    <>
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=10b981&color=fff&size=32&font-size=0.40&bold=true`}
                        alt={user.name}
                        className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-600 shadow-md"
                      />
                      <div className="hidden sm:block text-left">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate max-w-[120px]">{user.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[120px]">{user.email}</p>
                      </div>
                      <PiCaretDownDuotone className={`w-4 h-4 text-slate-600 dark:text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    </>
                  )}
                </button>

                {/* User dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-xl overflow-hidden z-50">
                    <div className="p-4 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-900/20 dark:to-teal-900/20 border-b border-slate-200/60 dark:border-slate-700/60">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{user?.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                      {activeProjectRoles.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-slate-600 dark:text-slate-400">Roles:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {activeProjectRoles.map((role) => (
                              <span
                                key={role}
                                className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-md"
                              >
                                {role}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
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

        {/* Main content area - with top padding for fixed header */}
        <main className="pt-[72px] min-h-screen bg-gradient-to-br from-slate-50/50 via-blue-50/30 to-purple-50/50 dark:from-slate-900/50 dark:via-indigo-950/30 dark:to-slate-900/50">
          <div className="animation-fade-in">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout; 