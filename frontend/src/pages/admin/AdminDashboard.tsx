import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { api } from '../../services/api';
import { AdminDashboardData } from '../../types';
import {
  Users,
  GraduationCap,
  BookOpen,
  CalendarCheck2,
  Trophy,
  Bot,
  Shield,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useNavigate } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await api.admin.getDashboard();
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.warn('Admin dashboard fallback');
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, []);

  const kpis = data?.kpis || {
    totalStudents: 454,
    totalFaculty: 37,
    totalCourses: 31,
    attendanceRate: 94,
    submissionRate: 88,
    totalXpDistributed: 4740,
    aiAssessmentsCount: 3,
    aiFlaggedCount: 1,
    facultyDispositionsCount: 1,
  };

  const trends = data?.engagementTrends || [
    { month: 'Nov', xpAwarded: 18400, activeStudents: 280, submissions: 420 },
    { month: 'Dec', xpAwarded: 24200, activeStudents: 310, submissions: 580 },
    { month: 'Jan', xpAwarded: 31500, activeStudents: 350, submissions: 710 },
    { month: 'Feb', xpAwarded: 39800, activeStudents: 390, submissions: 890 },
    { month: 'Mar', xpAwarded: 46200, activeStudents: 420, submissions: 1040 },
  ];

  const recentLogs = data?.recentAuditLogs || [
    { id: 'log-1', action: 'AI_DISPOSITION_CONFIRMED', role: 'FACULTY', userName: 'Prof. Rajesh Sharma', createdAt: new Date().toISOString() },
    { id: 'log-2', action: 'SYSTEM_INITIALIZATION', role: 'ADMIN', userName: 'Dr. Vikram Sethi', createdAt: new Date().toISOString() },
    { id: 'log-3', action: 'ATTENDANCE_MARKED', role: 'FACULTY', userName: 'Prof. Rajesh Sharma', createdAt: new Date().toISOString() },
    { id: 'log-4', action: 'GRADE_RECORDED', role: 'FACULTY', userName: 'Prof. Rajesh Sharma', createdAt: new Date().toISOString() },
  ];

  return (
    <DashboardLayout title="Institutional Governance Panel" subtitle="Administrator KPI metrics, user provisioning, and audit logs">
      {/* 1. Header Banner */}
      <Card variant="gradient" padding="lg" className="rounded-card-lg text-white space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <Badge variant="indigo" size="sm">
              University System Administration • Spring 2026 Term
            </Badge>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Institutional Overview & Health
            </h2>
            <p className="text-xs text-purple-100 leading-relaxed font-normal">
              Supervising academic delivery, engagement XP distributions, and AI assessment governance across all
              enrolled cohorts and departments.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate('/admin/users')}
              leftIcon={<Users className="w-4 h-4" />}
            >
              Manage Users
            </Button>
            <Button
              variant="outline"
              size="md"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              onClick={() => navigate('/admin/xp-rules')}
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Configure XP Rules
            </Button>
          </div>
        </div>
      </Card>

      {/* 2. Institutional KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="white" padding="md" hoverEffect className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-muted">Active Students</span>
            <div className="w-8 h-8 rounded-xl bg-brand-lavender text-brand-primary flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-brand-text tabular-nums">{kpis.totalStudents}</span>
            <span className="text-xs font-semibold text-brand-emerald">+12% YoY</span>
          </div>
          <p className="text-[11px] text-brand-muted">Enrolled across 8 undergraduate semesters</p>
        </Card>

        <Card variant="white" padding="md" hoverEffect className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-muted">Faculty Members</span>
            <div className="w-8 h-8 rounded-xl bg-[#E7F8F2] text-brand-emerald flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-brand-emerald tabular-nums">{kpis.totalFaculty}</span>
            <span className="text-xs font-semibold text-brand-muted">Active</span>
          </div>
          <p className="text-[11px] text-brand-muted">All assigned courses staffed</p>
        </Card>

        <Card variant="white" padding="md" hoverEffect className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-muted">Attendance Rate</span>
            <div className="w-8 h-8 rounded-xl bg-[#FEF6EC] text-brand-amber flex items-center justify-center">
              <CalendarCheck2 className="w-4 h-4 text-brand-amber" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-brand-amber tabular-nums">{kpis.attendanceRate}%</span>
            <span className="text-xs font-semibold text-brand-emerald">Above 75% Min</span>
          </div>
          <p className="text-[11px] text-brand-muted">Campus-wide verified lecture average</p>
        </Card>

        <Card variant="white" padding="md" hoverEffect className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-muted">Total XP Distributed</span>
            <div className="w-8 h-8 rounded-xl bg-violet-gradient text-white flex items-center justify-center shadow-sm">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-brand-primary tabular-nums">
              {kpis.totalXpDistributed.toLocaleString()} XP
            </span>
          </div>
          <p className="text-[11px] text-brand-muted">Idempotently generated through academic effort</p>
        </Card>
      </div>

      {/* 3. Middle Section: Institutional XP Growth Chart + Recent Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Engagement Trend Chart (2 spans) */}
        <Card variant="white" padding="md" className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-brand-text">Gamified Engagement & XP Velocity</h3>
              <p className="text-xs text-brand-muted">Campus-wide XP distribution correlating with assignment submission volume</p>
            </div>
            <Badge variant="lavender">Monthly Cohort Trends</Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="adminXp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6547F5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6547F5" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0ECFF" vertical={false} />
                <XAxis dataKey="month" stroke="#77768E" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#77768E" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#191A2E',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="xpAwarded" stroke="#6547F5" strokeWidth={3} fillOpacity={1} fill="url(#adminXp)" name="XP Awarded" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Security Audit Activity (1 span) */}
        <Card variant="white" padding="md" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-brand-primary" />
              <h3 className="text-base font-bold text-brand-text">Recent Audit Trail</h3>
            </div>
            <button
              onClick={() => navigate('/admin/audit-logs')}
              className="text-xs font-semibold text-brand-primary hover:underline"
            >
              View Full Logs
            </button>
          </div>

          <div className="space-y-3">
            {recentLogs.map((log: any) => (
              <div key={log.id} className="p-3 rounded-xl bg-brand-bg border border-brand-border space-y-1">
                <div className="flex items-center justify-between">
                  <Badge variant={log.role === 'ADMIN' ? 'indigo' : 'lavender'} size="sm">
                    {log.role}
                  </Badge>
                  <span className="text-[10px] text-brand-muted">
                    {new Date(log.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs font-bold text-brand-text">{log.action.replace(/_/g, ' ')}</p>
                <p className="text-[11px] text-brand-muted">{log.userName}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 4. Quick Governance Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card variant="tinted" padding="md" hoverEffect className="space-y-2 cursor-pointer" onClick={() => navigate('/admin/users')}>
          <h4 className="text-sm font-bold text-brand-text">User Provisioning & Roles</h4>
          <p className="text-xs text-brand-muted leading-relaxed">
            Invite, activate, or deactivate accounts across Student, Faculty, and Admin levels.
          </p>
        </Card>

        <Card variant="tinted" padding="md" hoverEffect className="space-y-2 cursor-pointer" onClick={() => navigate('/admin/xp-rules')}>
          <h4 className="text-sm font-bold text-brand-text">Configurable XP Rule Engine</h4>
          <p className="text-xs text-brand-muted leading-relaxed">
            Tune base points for on-time submissions and attendance milestones with versioning.
          </p>
        </Card>

        <Card variant="tinted" padding="md" hoverEffect className="space-y-2 cursor-pointer" onClick={() => navigate('/admin/ai-governance')}>
          <h4 className="text-sm font-bold text-brand-text">AI Governance Oversight</h4>
          <p className="text-xs text-brand-muted leading-relaxed">
            Monitor stylometric distribution curves, confidence indices, and faculty dispositions.
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
};
