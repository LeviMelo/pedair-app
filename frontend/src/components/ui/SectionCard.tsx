// src/components/ui/SectionCard.tsx
import React from 'react';

interface SectionCardProps {
  title: string; // The title to display in the card's header
  children: React.ReactNode; // Content to render inside the card body
  className?: string; // Optional additional CSS classes for the outer section element
  headerClassName?: string; // For the header div
  titleClassName?: string; // For the h2 title
  bodyClassName?: string; // For the body div
}

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  children,
  className = '',
  headerClassName = '',
  titleClassName = '',
  bodyClassName = '',
}) => {
  const finalCardClassName = ['card-base', className].filter(Boolean).join(' ');
  const finalHeaderClassName = ['card-header', headerClassName].filter(Boolean).join(' ');
  const finalTitleClassName = ['card-title', titleClassName].filter(Boolean).join(' ');
  const finalBodyClassName = ['card-body', bodyClassName].filter(Boolean).join(' '); // .card-body includes padding

  return (
    <section className={`${finalCardClassName} mb-6`}> {/* Retaining mb-6 for now as it was an outer style */}
      <div className={finalHeaderClassName}>
        <h2 className={finalTitleClassName}>{title}</h2>
      </div>
      <div className={finalBodyClassName}>
        {children}
      </div>
    </section>
  );
};

export default SectionCard;