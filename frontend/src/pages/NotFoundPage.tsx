import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-slate-900 text-center p-4">
      <h1 className="text-6xl font-bold text-blue-600 dark:text-blue-500">404</h1>
      <h2 className="text-2xl font-semibold mt-4 mb-2 text-slate-800 dark:text-slate-100">Page Not Found</h2>
      <p className="text-gray-700 dark:text-slate-300 mb-6">Sorry, the page you are looking for does not exist.</p>
      <Link 
        to="/"
        className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white dark:text-slate-900 rounded-md hover:bg-blue-700 dark:hover:bg-blue-400 transition-colors duration-300"
      >
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage; 