import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'white' | 'tinted' | 'gradient' | 'indigo';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'white',
  padding = 'md',
  hoverEffect = false,
  ...props
}) => {
  const baseStyles = 'rounded-card border transition-all duration-200';

  const variants = {
    white: 'bg-brand-surface border-brand-border shadow-soft',
    tinted: 'bg-brand-card-gradient border-brand-border shadow-soft',
    gradient: 'bg-violet-gradient text-white border-transparent shadow-violet-glow',
    indigo: 'bg-dark-indigo-gradient text-white border-[#2A2B47] shadow-elevated',
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hoverStyles = hoverEffect ? 'hover:shadow-elevated hover:-translate-y-0.5' : '';

  return (
    <div
      className={twMerge(clsx(baseStyles, variants[variant], paddings[padding], hoverStyles, className))}
      {...props}
    >
      {children}
    </div>
  );
};
