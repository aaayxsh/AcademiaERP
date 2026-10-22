import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { GraduationCap, ShieldCheck, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const QuickRoleSwitcher: React.FC = () => {
  const { user, switchDemoRole, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSwitch = async (role: UserRole) => {
    await switchDemoRole(role);
    if (role === 'STUDENT') navigate('/student/dashboard');
    else if (role === 'FACULTY') navigate('/faculty/dashboard');
    else if (role === 'ADMIN') navigate('/admin/dashboard');
  };

  const roles: Array<{ role: UserRole; label: string; icon: any; email: string }> = [
    { role: 'STUDENT', label: 'Student', icon: GraduationCap, email: 'ayush.student' },
    { role: 'FACULTY', label: 'Faculty', icon: UserCheck, email: 'prof.sharma' },
    { role: 'ADMIN', label: 'Admin', icon: ShieldCheck, email: 'admin' },
  ];

  return (
    <div className="flex items-center gap-1.5 bg-[#EEEAFE] p-1 rounded-xl border border-brand-border">
      <span className="text-[11px] font-semibold text-brand-primary px-2 hidden sm:inline uppercase tracking-wider">
        Demo Persona:
      </span>
      {roles.map((r) => {
        const Icon = r.icon;
        const isActive = user?.role === r.role;
        return (
          <button
            key={r.role}
            disabled={isLoading}
            onClick={() => handleSwitch(r.role)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-150 ${
              isActive
                ? 'bg-violet-gradient text-white shadow-sm'
                : 'text-brand-muted hover:text-brand-primary hover:bg-white/70'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{r.label}</span>
          </button>
        );
      })}
    </div>
  );
};
