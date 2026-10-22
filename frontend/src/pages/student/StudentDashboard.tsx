import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { api } from '../../services/api';
import { StudentDashboardData } from '../../types';
import {
  Trophy,
  Flame,
  CalendarCheck2,
  Clock,
  BookOpen,
  ArrowRight,
  Award,
  Calendar,
  AlertCircle,
  FileCheck2,
  TrendingUp,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useNavigate } from 'react-router-dom';

export const StudentDashboard: React.FC = () => {
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.student.getDashboard();
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.warn('Using student dashboard fallback');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Student Workspace" subtitle="Loading your academic profile...">
        <div className="h-64 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-brand-primary border-t-transparent animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  // Fallback demo defaults if needed
  const profile = data?.profile || {
    name: 'Ayush Srivastava',
    studentId: 'STU2026CS042',
    semester: 6,
    section: 'A',
    lifetimeXp: 1420,
    monthlyXp: 380,
    semesterXp: 890,
    currentStreak: 12,
    currentRank: 2,
    totalStudents: 4,
  };

  const kpis = data?.kpis || {
    attendancePercentage: 92,
    presentSessions: 11,
    totalSessions: 12,
    enrolledCoursesCount: 3,
    pendingAssignmentsCount: 2,
    completedSubmissionsCount: 2,
  };

  const weeklyActivity = data?.weeklyActivity || [
    { day: 'Mon', xp: 65, hours: 4.5 },
    { day: 'Tue', xp: 90, hours: 6.0 },
    { day: 'Wed', xp: 45, hours: 5.2 },
    { day: 'Thu', xp: 30, hours: 3.8 },
    { day: 'Fri', xp: 120, hours: 7.1 },
    { day: 'Sat', xp: 30, hours: 2.0 },
    { day: 'Sun', xp: 0, hours: 1.5 },
  ];

  return (
    <DashboardLayout title="Student Dashboard" subtitle={`Welcome back, ${profile.name}`}>
      {/* 1. Personalized Welcome & Highlight Banner */}
      <Card variant="gradient" padding="lg" className="rounded-card-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-white">
            <Badge variant="indigo" size="sm">
              Spring 2026 • Semester {profile.semester} (Sec {profile.section})
            </Badge>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Ready to learn today, {profile.name.split(' ')[0]}?
            </h2>
            <p className="text-xs text-purple-100 leading-relaxed font-normal">
              You are currently ranked <strong className="text-white">#{profile.currentRank}</strong> in your monthly
              class cohort with a <strong className="text-white">{profile.currentStreak}-day continuous streak</strong>.
              Keep up consistent submissions to unlock the Academic Luminary badge!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate('/student/assignments')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              View Assignments
            </Button>
            <Button
              variant="outline"
              size="md"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              onClick={() => navigate('/student/gamification')}
            >
              XP Statement
            </Button>
          </div>
        </div>
      </Card>

      {/* 2. Key Performance Indicators Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance KPI */}
        <Card variant="white" padding="md" hoverEffect className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-muted">Overall Attendance</span>
            <div className="w-8 h-8 rounded-xl bg-[#E7F8F2] text-brand-emerald flex items-center justify-center">
              <CalendarCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-brand-text tabular-nums">{kpis.attendancePercentage}%</span>
            <span className="text-xs font-semibold text-brand-emerald">Eligible for Exam</span>
          </div>
          <p className="text-[11px] text-brand-muted">
            {kpis.presentSessions} of {kpis.totalSessions} verified lectures attended
          </p>
        </Card>

        {/* Current Activity Streak */}
        <Card variant="white" padding="md" hoverEffect className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-muted">Active Streak</span>
            <div className="w-8 h-8 rounded-xl bg-[#FEF6EC] text-brand-amber flex items-center justify-center">
              <Flame className="w-4 h-4 fill-brand-amber text-brand-amber" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-brand-amber tabular-nums">{profile.currentStreak} Days</span>
            <span className="text-xs font-semibold text-brand-muted">Active</span>
          </div>
          <p className="text-[11px] text-brand-muted">Maintained 12 days continuous academic engagement</p>
        </Card>

        {/* Monthly Academic XP */}
        <Card variant="white" padding="md" hoverEffect className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-muted">Monthly Academic XP</span>
            <div className="w-8 h-8 rounded-xl bg-brand-lavender text-brand-primary flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-brand-primary tabular-nums">{profile.monthlyXp} XP</span>
            <Badge variant="lavender">Rank #{profile.currentRank}</Badge>
          </div>
          <p className="text-[11px] text-brand-muted">
            Lifetime XP: <strong className="text-brand-text">{profile.lifetimeXp} XP</strong> (Preserved)
          </p>
        </Card>

        {/* Enrolled Courses / Pending Tasks */}
        <Card variant="white" padding="md" hoverEffect className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-muted">Pending Deadlines</span>
            <div className="w-8 h-8 rounded-xl bg-[#FDEEEF] text-brand-red flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-brand-text tabular-nums">{kpis.pendingAssignmentsCount}</span>
            <span className="text-xs font-semibold text-brand-red">Active Tasks</span>
          </div>
          <p className="text-[11px] text-brand-muted">Deliver on-time to claim +50 XP reward</p>
        </Card>
      </div>

      {/* 3. Middle Section: Weekly Activity Chart + Pending Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Column (2 spans) */}
        <Card variant="white" padding="md" className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-brand-text">Weekly Academic Activity & XP Gains</h3>
              <p className="text-xs text-brand-muted">Study hours and event-driven XP accumulation over the past 7 days</p>
            </div>
            <Badge variant="lavender">Real-time Metrics</Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6547F5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6547F5" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
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
                <Area type="monotone" dataKey="xp" stroke="#6547F5" strokeWidth={3} fillOpacity={1} fill="url(#colorXp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Pending Deadlines Column (1 span) */}
        <Card variant="white" padding="md" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-brand-text">Upcoming Deadlines</h3>
            <button
              onClick={() => navigate('/student/assignments')}
              className="text-xs font-semibold text-brand-primary hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {data?.pendingDeadlines && data.pendingDeadlines.length > 0 ? (
              data.pendingDeadlines.map((task) => (
                <div key={task.id} className="p-3.5 rounded-xl bg-brand-bg border border-brand-border space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-brand-primary">{task.courseCode}</span>
                    <Badge variant="amber" size="sm">
                      {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </Badge>
                  </div>
                  <h4 className="text-xs font-bold text-brand-text line-clamp-1">{task.title}</h4>
                  <div className="flex items-center justify-between text-[11px] text-brand-muted pt-1">
                    <span>Max {task.maxMarks} Marks</span>
                    <span className="text-brand-emerald font-semibold">+50 XP On-time</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-brand-muted">
                <FileCheck2 className="w-8 h-8 text-brand-emerald mx-auto mb-2" />
                All current assignments submitted! Excellent work.
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* 4. Bottom Grid: Today's Timetable + Recent Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card variant="white" padding="md" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-primary" />
              <h3 className="text-base font-bold text-brand-text">Today's Class Schedule</h3>
            </div>
            <button
              onClick={() => navigate('/student/timetable')}
              className="text-xs font-semibold text-brand-primary hover:underline"
            >
              Full Timetable
            </button>
          </div>

          <div className="space-y-2.5">
            {data?.todayTimetable && data.todayTimetable.length > 0 ? (
              data.todayTimetable.map((slot) => (
                <div
                  key={slot.id}
                  className="p-3 rounded-xl border border-brand-border bg-white flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 py-1 rounded-lg bg-brand-lavender text-center text-[11px] font-bold text-brand-primary">
                      {slot.startTime}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-brand-text">{slot.courseName}</p>
                      <p className="text-[11px] text-brand-muted">
                        {slot.roomNo} • {slot.faculty}
                      </p>
                    </div>
                  </div>
                  <Badge variant="indigo" size="sm">
                    {slot.sessionType}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-xs text-brand-muted text-center py-4">No scheduled lectures today.</p>
            )}
          </div>
        </Card>

        {/* Recent Submissions & Feedback */}
        <Card variant="white" padding="md" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-brand-text">Recent Evaluated Submissions</h3>
            <button
              onClick={() => navigate('/student/assignments')}
              className="text-xs font-semibold text-brand-primary hover:underline"
            >
              View Submissions
            </button>
          </div>

          <div className="space-y-3">
            {data?.recentSubmissions && data.recentSubmissions.length > 0 ? (
              data.recentSubmissions.map((sub) => (
                <div key={sub.id} className="p-3.5 rounded-xl border border-brand-border bg-[#FAF9FD] space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-brand-primary">{sub.courseCode}</span>
                      <h4 className="text-xs font-bold text-brand-text">{sub.assignmentTitle}</h4>
                    </div>
                    {sub.marksObtained !== null ? (
                      <span className="text-xs font-extrabold text-brand-emerald bg-[#E7F8F2] px-2.5 py-1 rounded-lg border border-[#BAEEDC]">
                        {sub.marksObtained} / {sub.maxMarks}
                      </span>
                    ) : (
                      <Badge variant="amber">Under Faculty Evaluation</Badge>
                    )}
                  </div>
                  {sub.feedback && (
                    <p className="text-[11px] text-brand-muted italic bg-white p-2 rounded-lg border border-brand-border">
                      "{sub.feedback}"
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-brand-muted text-center py-4">No recent submissions evaluated.</p>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};
