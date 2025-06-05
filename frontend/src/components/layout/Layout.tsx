import React, { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
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
  PiSunDuotone,
  PiMoonDuotone,
  PiSignInDuotone,
  PiSignOutDuotone
} from 'react-icons/pi';

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

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // Placeholder for authentication state
  const isAuthenticated = true; // Replace with actual auth logic later

  return (
    <div className={`flex h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-300 transition-colors duration-300`}>
      {/* Sidebar */}
      <aside 
        ref={sidebarRef}
        className={`transition-all duration-300 ease-in-out bg-white dark:bg-slate-800 flex flex-col print:hidden 
                    ${isSidebarCollapsed ? 'w-16' : 'w-64'}
                    border-r border-slate-200 dark:border-slate-700/80 
                  `}
      >
        <div className={`h-16 flex items-center shrink-0 px-4 border-b border-slate-200 dark:border-slate-700/80 ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isSidebarCollapsed && <span className="text-2xl font-bold text-blue-600 dark:text-blue-500">PedAir</span>}
          <button 
            onClick={toggleSidebar} 
            className="p-1 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-700/50 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600"
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? <PiMenuIcon size={22} /> : <PiCaretLeftDuotone size={22} /> }
          </button>
        </div>
        
        <nav className="flex-grow px-2 py-3 space-y-0.5 overflow-y-auto">
          <ul>
            {navItems.map((item, index) => (
              <li key={item.path} className={`${index > 0 ? 'border-t border-slate-200/60 dark:border-slate-700/50' : ''}`}>
                <Link 
                  to={item.path} 
                  title={item.label}
                  className={`flex items-center h-10 px-2.5 text-sm rounded-md 
                              text-slate-600 dark:text-slate-300 
                              hover:bg-slate-100 dark:hover:bg-slate-700 
                              hover:text-blue-600 dark:hover:text-blue-400 
                              transition-colors duration-150 group 
                              ${isSidebarCollapsed ? 'justify-center' : ''}
                              ${location.pathname === item.path ? 'bg-slate-100 dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-semibold' : 'font-medium'}
                            `}
                >
                  <item.icon size={isSidebarCollapsed ? 20 : 18} className={`transition-all duration-200 group-hover:scale-105 shrink-0 ${!isSidebarCollapsed ? 'mr-2.5' : 'mr-0'}`} />
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
          {[
            {
              label: isDarkMode ? 'Light Mode' : 'Dark Mode',
              icon: isDarkMode ? PiSunDuotone : PiMoonDuotone,
              action: toggleDarkMode,
              title: isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
            },
            {
              label: isAuthenticated ? 'Sign Out' : 'Sign In',
              icon: isAuthenticated ? PiSignOutDuotone : PiSignInDuotone,
              action: () => console.log('Auth action placeholder'),
              title: isAuthenticated ? "Sign Out" : "Sign In"
            }
          ].map(btn => (
            <button 
              key={btn.label}
              onClick={btn.action}
              className={`w-full flex items-center h-9 px-2.5 text-sm rounded-md 
                          text-slate-600 dark:text-slate-300 
                          hover:bg-slate-100 dark:hover:bg-slate-700 
                          hover:text-blue-600 dark:hover:text-blue-400 
                          transition-colors duration-150 group 
                          ${isSidebarCollapsed ? 'justify-center' : ''}`}
              title={btn.title}
            >
              <btn.icon size={isSidebarCollapsed ? 20 : 16} className={`group-hover:scale-105 transition-transform shrink-0 ${!isSidebarCollapsed ? 'mr-2.5' : 'mr-0'}`} />
              <span 
                className={`whitespace-nowrap transition-all duration-200 overflow-hidden 
                            ${isSidebarCollapsed ? 'opacity-0 w-0 ml-0' : 'opacity-100 w-auto ml-2.5 delay-100'}`}>
                {btn.label}
              </span>
            </button>
          ))}
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 flex items-center justify-between bg-white dark:bg-slate-800 shadow-sm dark:shadow-none p-4 border-b border-slate-200 dark:border-slate-700/80 print:hidden">
            <h1 className="text-lg font-semibold text-slate-700 dark:text-slate-100 truncate">{pageTitle}</h1>
            <div className="flex items-center space-x-3">
                <button className="p-1.5 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" title="Notifications">
                    <PiBellDuotone size={20} />
                </button>
                <img src="https://via.placeholder.com/32" alt="User Avatar" className="w-8 h-8 rounded-full cursor-pointer ring-1 ring-slate-200 dark:ring-slate-600 hover:ring-blue-500 dark:hover:ring-blue-300 transition-shadow" title="User Profile"/>
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