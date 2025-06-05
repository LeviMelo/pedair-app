import React from 'react';
import { Link, Outlet } from 'react-router-dom';

// Placeholder for icons - in a real app, you'd use an icon library like react-icons
const IconPlaceholder = ({ name, className }: { name: string, className?: string }) => (
  <span className={`inline-block w-5 h-5 mr-2 ${className}`}>{name.substring(0,1).toUpperCase()}</span>
);

const Layout: React.FC = () => {
  // TODO: Implement dark mode toggle functionality
  // const [isDarkMode, setIsDarkMode] = React.useState(false);
  // const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // Navigation items
  const navItems = [
    { path: '/', label: 'Dashboard', icon: 'D' },
    { path: '/forms', label: 'Data Submission', icon: 'S' },
    { path: '/builder', label: 'Form Builder', icon: 'B' },
    { path: '/roles', label: 'Role Editor', icon: 'R' },
    { path: '/search', label: 'Patient Search', icon: 'P' },
    { path: '/scheduler', label: 'Notifications', icon: 'N' },
    { path: '/settings', label: 'Settings', icon: 'S' },
  ];

  return (
    <div className={`flex h-screen bg-gray-100 dark:bg-gray-900`}> {/* Apply dark mode class here later */}
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-4 space-y-2 shadow-lg">
        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-6">PedAir</div>
        <nav>
          <ul>
            {navItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className="flex items-center px-3 py-2.5 text-sm font-medium rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-300 transition-colors duration-150"
                >
                  <IconPlaceholder name={item.icon} />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {/* Dark mode toggle placeholder - to be implemented */}
        <div className="mt-auto pt-4">
          <button 
            // onClick={toggleDarkMode}
            className="w-full flex items-center justify-center px-3 py-2.5 text-sm font-medium rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-150"
          >
            {/* <IconPlaceholder name={isDarkMode ? 'Sun' : 'Moon'} /> Toggle Dark Mode */}
            Toggle Dark Mode (NYI)
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header/Toolbar placeholder */}
        <header className="bg-white dark:bg-gray-800 shadow p-4">
          <h1 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Page Title (Dynamic)</h1>
          {/* User profile, notifications icon etc. can go here */}
        </header>
        
        {/* Content - pages will be rendered here */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-gray-850"> {/* Added a slightly different bg for content area in dark mode */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout; 