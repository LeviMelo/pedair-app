// src/components/ui/PageHeader.tsx
import React from 'react';
import { IconType } from 'react-icons';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: IconType;
  gradient?: 'primary' | 'secondary' | 'accent' | 'warm' | 'cool';
  children?: React.ReactNode;
  className?: string; // Add className to the props interface
}

// Use a named export
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon: Icon,
  gradient = 'primary',
  children,
  className, // Destructure className from the props
}) => {
  const gradientClasses = {
    primary: 'from-blue-600 via-indigo-600 to-purple-600',
    secondary: 'from-emerald-500 via-teal-500 to-cyan-500',
    accent: 'from-orange-500 via-red-500 to-pink-500',
    warm: 'from-amber-500 via-orange-500 to-red-500',
    cool: 'from-cyan-500 via-blue-500 to-indigo-500'
  };

  const iconColors = {
    primary: 'text-blue-500 dark:text-blue-400',
    secondary: 'text-emerald-500 dark:text-emerald-400',
    accent: 'text-orange-500 dark:text-orange-400',
    warm: 'text-amber-500 dark:text-amber-400',
    cool: 'text-cyan-500 dark:text-cyan-400'
  };

  return (
    // The `className` variable is now defined and can be used here
    <div className={cn("relative overflow-hidden bg-card border-b-2 shadow-lg mb-6", className)}>
      <div className={cn("absolute inset-0 opacity-10 dark:opacity-5 bg-gradient-to-r", gradientClasses[gradient])}></div>
      
      <div className="relative z-10 px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {Icon && (
                <div className="p-2 rounded-xl bg-background/80 shadow-lg">
                  <Icon className={cn("w-6 h-6", iconColors[gradient])} />
                </div>
              )}
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                {title}
              </h1>
            </div>
            {subtitle && (
              <p className="text-muted-foreground text-lg max-w-2xl">
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