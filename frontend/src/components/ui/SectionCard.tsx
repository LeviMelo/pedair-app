// src/components/ui/SectionCard.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import { cn } from '@/lib/utils';

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

// Use a named export
export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  children,
  className,
  contentClassName,
}) => {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className={contentClassName}>
        {children}
      </CardContent>
    </Card>
  );
};