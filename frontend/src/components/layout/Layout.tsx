import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  PiGaugeDuotone,
  PiListChecksDuotone,
  PiSquaresFourDuotone,
  PiUsersDuotone,
  PiMagnifyingGlassDuotone,
  PiBellDuotone,
  PiGearDuotone,
  PiSidebarSimpleDuotone,
  PiSunDuotone,
  PiMoonDuotone,
  PiSignInDuotone,
  PiSignOutDuotone
} from 'react-icons/pi'; // Using Phosphor Icons

const navItems = [
  { path: '/', label: 'Dashboard', icon: PiGaugeDuotone },
  { path: '/forms', label: 'Data Submission', icon: PiListChecksDuotone },
  { path: '/builder', label: 'Form Builder', icon: PiSquaresFourDuotone },
  { path: '/roles', label: 'Role Editor', icon: PiUsersDuotone },
  { path: '/search', label: 'Patient Search', icon: PiMagnifyingGlassDuotone },
  { path: '/scheduler', label: 'Notifications', icon: PiBellDuotone },
  { path: '/settings', label: 'Settings', icon: PiGearDuotone },
];

// Helper function to get page title from path
const getPageTitle = (pathname: string) => {
  const item = navItems.find(navItem => navItem.path === pathname);
  if (item) return item.label;
  if (pathname.startsWith('/test/')) {
    const testName = pathname.split('/').pop();
    return `Test: ${testName?.charAt(0).toUpperCase()}${testName?.slice(1).replace(/([A-Z])/g, ' $1').trim() || 'Form'}`;
  }
  // Add more specific titles for other routes if needed
  return 'PedAir Application'; // Default title
};

const Layout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check local storage for saved preference
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', JSON.stringify(true));
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', JSON.stringify(false));
    }
  }, [isDarkMode]);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // Placeholder for authentication state
  const isAuthenticated = true; // Replace with actual auth logic later

  return (
    <div className={`flex h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-300`}>
      {/* Sidebar */}
      <aside 
        className={`transition-all duration-300 ease-in-out bg-white dark:bg-slate-850 shadow-lg flex flex-col space-y-2 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}
      >
        <div className={`flex items-center p-4 border-b border-slate-200 dark:border-slate-700 ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isSidebarCollapsed && <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">PedAir</span>}
          <button 
            onClick={toggleSidebar} 
            className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <PiSidebarSimpleDuotone size={24} />
          </button>
        </div>
        
        <nav className="flex-grow px-2 py-4 space-y-1">
          <ul>
            {navItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  title={item.label}
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-md hover:bg-blue-100 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-300 transition-colors duration-150 group ${isSidebarCollapsed ? 'justify-center' : ''}`}
                >
                  <item.icon size={isSidebarCollapsed ? 28 : 22} className={`group-hover:scale-110 transition-transform ${!isSidebarCollapsed ? 'mr-3' : ''}`} />
                  {!isSidebarCollapsed && <span>{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
          <button 
            onClick={toggleDarkMode}
            className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-150 group ${isSidebarCollapsed ? 'justify-center' : ''}`}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <PiSunDuotone size={isSidebarCollapsed ? 28 : 22} className={`group-hover:scale-110 transition-transform ${!isSidebarCollapsed ? 'mr-3' : ''}`} /> : <PiMoonDuotone size={isSidebarCollapsed ? 28 : 22} className={`group-hover:scale-110 transition-transform ${!isSidebarCollapsed ? 'mr-3' : ''}`} />}
            {!isSidebarCollapsed && <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>
          
          {/* Placeholder Authentication Button */}
           <button 
            className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-150 group ${isSidebarCollapsed ? 'justify-center' : ''}`}
            title={isAuthenticated ? "Sign Out" : "Sign In"}
          >
            {isAuthenticated ? <PiSignOutDuotone size={isSidebarCollapsed ? 28 : 22} className={`group-hover:scale-110 transition-transform ${!isSidebarCollapsed ? 'mr-3' : ''}`} /> : <PiSignInDuotone size={isSidebarCollapsed ? 28 : 22} className={`group-hover:scale-110 transition-transform ${!isSidebarCollapsed ? 'mr-3' : ''}`} />}
            {!isSidebarCollapsed && <span>{isAuthenticated ? 'Sign Out' : 'Sign In'}</span>}
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-slate-850 shadow-md p-4 border-b dark:border-slate-700">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-slate-700 dark:text-slate-200">{pageTitle}</h1>
            {/* User profile, notifications icon etc. can go here */}
            <div className="flex items-center space-x-4">
                <PiBellDuotone size={24} className="text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-300 cursor-pointer" title="Notifications"/>
                <img src="https://via.placeholder.com/40" alt="User Avatar" className="w-8 h-8 rounded-full cursor-pointer" title="User Profile"/>
            </div>
          </div>
        </header>
        
        <div className="flex-1 p-6 overflow-y-auto bg-slate-50 dark:bg-slate-900">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout; 