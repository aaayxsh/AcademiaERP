import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  FileCheck2,
  CalendarCheck2,
  Trophy,
  Calendar,
  Bell,
  Users,
  Settings,
  Sparkles,
  ClipboardList,
  Shield,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Flame,
  Bot,
} from 'lucide-react';
import { Badge } from '../ui/Badge';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavLinks = () => {
    if (!user) return [];

    if (user.role === 'STUDENT') {
      return [
        { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/student/courses', icon: BookOpen, label: 'My Courses' },
        { to: '/student/assignments', icon: FileCheck2, label: 'Assignments' },
        { to: '/student/attendance', icon: CalendarCheck2, label: 'Attendance' },
        { to: '/student/gamification', icon: Trophy, label: 'Gamification & XP' },
        { to: '/student/timetable', icon: Calendar, label: 'Timetable' },
      ];
    }

    if (user.role === 'FACULTY') {
      return [
        { to: '/faculty/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/faculty/courses', icon: BookOpen, label: 'My Courses' },
        { to: '/faculty/assignments', icon: FileCheck2, label: 'Assignments' },
        { to: '/faculty/attendance', icon: CalendarCheck2, label: 'Attendance' },
        { to: '/faculty/ai-review', icon: Bot, label: 'AI Review Desk' },
      ];
    }

    if (user.role === 'ADMIN') {
      return [
        { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Institutional KPI' },
        { to: '/admin/users', icon: Users, label: 'User Directory' },
        { to: '/admin/xp-rules', icon: Sparkles, label: 'XP Rule Engine' },
        { to: '/admin/ai-governance', icon: Bot, label: 'AI Governance' },
        { to: '/admin/audit-logs', icon: Shield, label: 'Security Audit' },
      ];
    }

    return [];
  };

  const navLinks = getNavLinks();

  return (
    <aside
      className={`relative flex flex-col bg-brand-surface border-r border-brand-border h-screen transition-all duration-300 z-30 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between p-5 border-b border-brand-border">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-violet-gradient flex items-center justify-center text-white shadow-violet-glow flex-shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-base font-extrabold text-brand-text tracking-tight flex items-center gap-1.5">
                Academia<span className="text-brand-primary">ERP</span>
              </h1>
              <p className="text-[10px] text-brand-muted font-medium uppercase tracking-wider">
                Gamified Academic SaaS
              </p>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-brand-muted hover:text-brand-text hover:bg-brand-bg transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Role Badge Indicator */}
      {!collapsed && user && (
        <div className="px-5 pt-4 pb-2">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F4F1FD] border border-[#E4DEF9]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse" />
              <span className="text-xs font-semibold text-brand-text uppercase tracking-wide">
                {user.role} Workspace
              </span>
            </div>
            {user.role === 'STUDENT' && (
              <span className="flex items-center gap-1 text-xs font-bold text-brand-primary">
                <Flame className="w-3.5 h-3.5 text-brand-amber fill-brand-amber" />
                Streak
              </span>
            )}
          </div>
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navLinks.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-violet-gradient text-white shadow-sm'
                  : 'text-brand-muted hover:text-brand-text hover:bg-brand-bg'
              }`
            }
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer User Profile & Logout */}
      <div className="p-4 border-t border-brand-border">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-brand-lavender text-brand-primary font-bold flex items-center justify-center flex-shrink-0 text-xs">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-xs font-bold text-brand-text truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[11px] text-brand-muted truncate">{user?.email}</p>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-2 text-brand-muted hover:text-brand-red hover:bg-[#FDEEEF] rounded-lg transition-colors flex-shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
