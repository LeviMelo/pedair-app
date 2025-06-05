// src/components/ui/SectionCard.tsx
import React from 'react';

interface SectionCardProps {
  title: string; // The title to display in the card's header
  children: React.ReactNode; // Content to render inside the card body
  className?: string; // Optional additional CSS classes for the outer section element
}

const SectionCard: React.FC<SectionCardProps> = ({ title, children, className = '' }) => {
  return (
    // Combine base classes with any additional classes passed via props
    <section className={`p-6 rounded-lg mb-6 
                       bg-white dark:bg-slate-800 
                       shadow-md dark:shadow-[0_0_15px_rgba(255,255,255,0.05)] 
                       ${className}`}>
      {/* Card Header */}
      <h2 className="text-xl font-semibold pb-2 mb-4 
                     text-slate-800 dark:text-slate-100 
                     border-b border-slate-300 dark:border-slate-700">
        {title} {/* Display the title passed via props */}
      </h2>
      {/* Card Body */}
      <div>
        {children} {/* Render the content passed as children */}
      </div>
    </section>
  );
};

export default SectionCard;