import React from 'react';
import { QuickRoleSwitcher } from '../ui/QuickRoleSwitcher';
import { Bell, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TopNavbarProps {
  title?: string;
  subtitle?: string;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  title = 'Institutional Workspace',
  subtitle = 'Spring 2026 Academic Term',
}) => {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-3.5 bg-brand-surface/90 backdrop-blur-md border-b border-brand-border">
      {/* Title / Breadcrumb */}
      <div>
        <h2 className="text-base font-bold text-brand-text leading-tight">{title}</h2>
        <p className="text-[11px] text-brand-muted font-medium">{subtitle}</p>
      </div>

      {/* Right Action Bar */}
      <div className="flex items-center gap-3">
        {/* Quick Demo Persona Switcher */}
        <QuickRoleSwitcher />

        {/* View Public SaaS Landing Page */}
        <Link
          to="/"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-brand-muted hover:text-brand-primary hover:bg-brand-bg border border-brand-border transition-colors"
        >
          <span>Landing Page</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* Notification Bell */}
        <div className="relative">
          <button className="p-2 rounded-xl text-brand-muted hover:text-brand-text hover:bg-brand-bg transition-colors border border-brand-border">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-primary" />
          </button>
        </div>
      </div>
    </header>
  );
};
