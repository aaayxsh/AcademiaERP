import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { api } from '../../services/api';
import { FacultyDashboardData } from '../../types';
import {
  BookOpen,
  Users,
  FileCheck2,
  AlertTriangle,
  CalendarCheck2,
  ArrowRight,
  Bot,
  TrendingUp,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useNavigate } from 'react-router-dom';

export const FacultyDashboard: React.FC = () => {
  const [data, setData] = useState<FacultyDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.faculty.getDashboard();
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.warn('Using faculty dashboard fallback');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const profile = data?.profile || {
    name: 'Prof. Rajesh Sharma',
    facultyId: 'FAC2026CS01',
    designation: 'Professor & Head of Department',
    department: 'Computer Science & Engineering',
    officeRoom: 'Tech Block 3 - Room 304',
  };

  const kpis = data?.kpis || {
    assignedCoursesCount: 2,
    totalEnrolledStudents: 4,
    pendingEvaluationsCount: 2,
    flaggedAiReviewsCount: 1,
  };

  const trends = data?.submissionTrends || [
    { day: 'Mon', submissions: 12, evaluated: 8 },
    { day: 'Tue', submissions: 19, evaluated: 15 },
    { day: 'Wed', submissions: 14, evaluated: 12 },
    { day: 'Thu', submissions: 25, evaluated: 20 },
    { day: 'Fri', submissions: 8, evaluated: 7 },
  ];

  return (
    <DashboardLayout title="Faculty Academic Workspace" subtitle={`Logged in as ${profile.name}`}>
      {/* 1. Header Banner */}
      <Card variant="gradient" padding="lg" className="rounded-card-lg relative overflow-hidden text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <Badge variant="indigo" size="sm">
              Faculty Instruction Desk • {profile.designation}
            </Badge>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {profile.name}
            </h2>
            <p className="text-xs text-purple-100 leading-relaxed font-normal">
              {profile.department} • Office: {profile.officeRoom}. You have{' '}
              <strong className="text-white">{kpis.pendingEvaluationsCount} submissions</strong> awaiting grading and{' '}
              <strong className="text-white">{kpis.flaggedAiReviewsCount} AI-assisted review task</strong> flagged for advisory inspection.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate('/faculty/assignments')}
              leftIcon={<FileCheck2 className="w-4 h-4" />}
            >
              Assignments
            </Button>
            <Button
              variant="outline"
              size="md"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              onClick={() => navigate('/faculty/attendance')}
              leftIcon={<CalendarCheck2 className="w-4 h-4" />}
            >
              Mark Attendance
            </Button>
          </div>
        </div>
      </Card>

      {/* 2. KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="white" padding="md" hoverEffect className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-muted">Assigned Courses</span>
            <div className="w-8 h-8 rounded-xl bg-brand-lavender text-brand-primary flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-brand-text tabular-nums">{kpis.assignedCoursesCount}</span>
            <span className="text-xs font-semibold text-brand-muted">Active Courses</span>
          </div>
          <p className="text-[11px] text-brand-muted">CS301 (Algorithms), CS303 (ML Ethics)</p>
        </Card>

        <Card variant="white" padding="md" hoverEffect className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-muted">Total Students</span>
            <div className="w-8 h-8 rounded-xl bg-[#E7F8F2] text-brand-emerald flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-brand-emerald tabular-nums">{kpis.totalEnrolledStudents}</span>
            <span className="text-xs font-semibold text-brand-muted">Enrolled</span>
          </div>
          <p className="text-[11px] text-brand-muted">Semester 6 Cohort (Section A & B)</p>
        </Card>

        <Card variant="white" padding="md" hoverEffect className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-muted">Pending Evaluations</span>
            <div className="w-8 h-8 rounded-xl bg-[#FEF6EC] text-brand-amber flex items-center justify-center">
              <Clock className="w-4 h-4 text-brand-amber" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-brand-amber tabular-nums">{kpis.pendingEvaluationsCount}</span>
            <span className="text-xs font-semibold text-brand-amber">Awaiting Feedback</span>
          </div>
          <p className="text-[11px] text-brand-muted">Grades are independent of gamification XP</p>
        </Card>

        <Card variant="white" padding="md" hoverEffect className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-muted">AI Review Advisory</span>
            <div className="w-8 h-8 rounded-xl bg-brand-indigo text-[#A78BFA] flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-brand-primary tabular-nums">{kpis.flaggedAiReviewsCount}</span>
            <span className="text-xs font-semibold text-brand-primary">Advisory Notice</span>
          </div>
          <p className="text-[11px] text-brand-muted">Elevated formulaic phrasing flag</p>
        </Card>
      </div>

      {/* 3. Middle Section: Pending Submissions Queue + Submission Trends Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submissions Queue (2 spans) */}
        <Card variant="white" padding="md" className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-brand-text">Pending Submissions Queue</h3>
              <p className="text-xs text-brand-muted">Review student work, enter marks, and provide formative rubric feedback</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => navigate('/faculty/assignments')}>
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {data?.pendingSubmissions && data.pendingSubmissions.length > 0 ? (
              data.pendingSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-3.5 rounded-xl border border-brand-border bg-[#FBFBFE] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-brand-primary">{sub.courseCode}</span>
                      <span className="text-xs font-bold text-brand-text">• {sub.studentName} ({sub.studentId})</span>
                    </div>
                    <p className="text-xs text-brand-muted line-clamp-1">{sub.assignmentTitle}</p>
                    <p className="text-[11px] text-brand-muted">
                      Submitted: {new Date(sub.submittedAt).toLocaleDateString()} {new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {sub.aiLikelihoodScore >= 0.5 && (
                      <Badge variant="amber" size="sm">
                        AI Signal {Math.round(sub.aiLikelihoodScore * 100)}%
                      </Badge>
                    )}
                    <Button
                      size="sm"
                      onClick={() => navigate('/faculty/assignments')}
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Grade Work
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-brand-muted text-center py-6">All submitted assignments have been evaluated!</p>
            )}
          </div>
        </Card>

        {/* Weekly Submission Trends Chart (1 span) */}
        <Card variant="white" padding="md" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-brand-text">Submission Trends</h3>
            <Badge variant="lavender">Past 5 Days</Badge>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0ECFF" vertical={false} />
                <XAxis dataKey="day" stroke="#77768E" fontSize={11} tickLine={false} axisLine={false} />
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
                <Bar dataKey="submissions" fill="#6547F5" radius={[6, 6, 0, 0]} name="Received" />
                <Bar dataKey="evaluated" fill="#16A579" radius={[6, 6, 0, 0]} name="Graded" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* 4. Flagged AI Review Spotlight */}
      <Card variant="white" padding="md" className="space-y-3 border-l-4 border-l-brand-amber">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-brand-amber" />
            <h3 className="text-base font-bold text-brand-text">AI-Assisted Assignment Stylometric Desk</h3>
          </div>
          <Button size="sm" variant="outline" onClick={() => navigate('/faculty/ai-review')}>
            Open AI Review Desk
          </Button>
        </div>

        <p className="text-xs text-brand-muted leading-relaxed">
          The CPU-friendly stylometric engine detects elevated formulaic phrasing and low sentence length variance.
          Remember that non-native writers or technical lab reports often trigger higher scores. Faculty oral defense is
          recommended before making any academic integrity determination.
        </p>
      </Card>
    </DashboardLayout>
  );
};
