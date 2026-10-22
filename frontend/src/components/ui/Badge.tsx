import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'emerald' | 'amber' | 'red' | 'lavender' | 'indigo' | 'gray';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'lavender',
  size = 'md',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full select-none';

  const variants = {
    emerald: 'bg-[#E7F8F2] text-brand-emerald border border-[#BAEEDC]',
    amber: 'bg-[#FEF6EC] text-brand-amber border border-[#FDDFBC]',
    red: 'bg-[#FDEEEF] text-brand-red border border-[#F9C3C9]',
    lavender: 'bg-brand-lavender text-brand-primary border border-[#D5C7FF]',
    indigo: 'bg-[#252642] text-white border border-[#3A3B61]',
    gray: 'bg-[#F2F1F8] text-brand-muted border border-brand-border',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-0.5 gap-1',
    md: 'text-xs px-3 py-1 gap-1.5',
  };

  return (
    <span className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))} {...props}>
      {children}
    </span>
  );
};
