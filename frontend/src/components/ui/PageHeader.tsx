import React from 'react';
import { IconType } from 'react-icons';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: IconType;
  gradient?: 'primary' | 'secondary' | 'accent' | 'warm' | 'cool';
  children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon: Icon,
  gradient = 'primary',
  children
}) => {
  const gradientClasses = {
    primary: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600',
    secondary: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500',
    accent: 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500',
    warm: 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500',
    cool: 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500'
  };

  const iconColors = {
    primary: 'text-blue-500 dark:text-blue-400',
    secondary: 'text-emerald-500 dark:text-emerald-400',
    accent: 'text-orange-500 dark:text-orange-400',
    warm: 'text-amber-500 dark:text-amber-400',
    cool: 'text-cyan-500 dark:text-cyan-400'
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50/80 to-white dark:from-slate-800 dark:via-slate-700/80 dark:to-slate-800 border-b-2 border-slate-200/60 dark:border-slate-700/60 shadow-lg mb-6">
      {/* Decorative background elements */}
      <div className={`absolute inset-0 opacity-10 dark:opacity-5 ${gradientClasses[gradient]}`}></div>
      <div className="absolute -top-1/2 -right-1/4 w-1/2 h-full bg-gradient-to-l from-white/20 to-transparent dark:from-slate-700/20 rounded-full transform rotate-12"></div>
      
      <div className="relative z-10 px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {Icon && (
                <div className="p-2 rounded-xl bg-white/80 dark:bg-slate-700/80 shadow-lg">
                  <Icon className={`w-6 h-6 ${iconColors[gradient]}`} />
                </div>
              )}
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">
                {title}
              </h1>
            </div>
            {subtitle && (
              <p className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl">
                {subtitle}
              </p>
            )}
          </div>
          
          {children && (
            <div className="flex-shrink-0">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader; 