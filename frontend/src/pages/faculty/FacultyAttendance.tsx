import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { api } from '../../services/api';
import {
  CalendarCheck2,
  Calendar,
  CheckCircle2,
  Users,
  Sparkles,
  Save,
  Check,
  X,
  Clock,
  ShieldAlert,
} from 'lucide-react';

export const FacultyAttendance: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [sessionTitle, setSessionTitle] = useState('Lecture 9: Graph Traversals & Shortest Paths');
  const [roster, setRoster] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const loadAttendance = async (courseId: string, date: string) => {
    setLoading(true);
    try {
      const res = await api.faculty.getAttendanceSheet(courseId, date);
      if (res.success && res.roster) {
        setRoster(res.roster);
        if (res.session?.title) setSessionTitle(res.session.title);
      }
    } catch (err) {
      // Fallback demo student roster
      setRoster([
        { studentProfileId: 'stu-p-1', studentId: 'STU2026CS042', name: 'Ayush Srivastava', status: 'PRESENT' },
        { studentProfileId: 'stu-p-2', studentId: 'STU2026CS015', name: 'Priya Verma', status: 'PRESENT' },
        { studentProfileId: 'stu-p-3', studentId: 'STU2026CS089', name: 'Rohit Kumar', status: 'LATE' },
        { studentProfileId: 'stu-p-4', studentId: 'STU2026CS033', name: 'Sneha Patel', status: 'PRESENT' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const res = await api.faculty.getCourses();
        if (res.success && res.courses && res.courses.length > 0) {
          setCourses(res.courses);
          const firstId = res.courses[0].id;
          setSelectedCourseId(firstId);
          await loadAttendance(firstId, selectedDate);
        } else {
          // Fallback courses
          const mock = [{ id: 'cs301-id', code: 'CS301', name: 'Design & Analysis of Algorithms' }];
          setCourses(mock);
          setSelectedCourseId('cs301-id');
          await loadAttendance('cs301-id', selectedDate);
        }
      } catch (err) {
        console.warn('Attendance load fallback');
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleStatusChange = (studentProfileId: string, newStatus: string) => {
    setRoster((prev) =>
      prev.map((s) => (s.studentProfileId === studentProfileId ? { ...s, status: newStatus } : s))
    );
  };

  const handleMarkAll = (status: string) => {
    setRoster((prev) => prev.map((s) => ({ ...s, status })));
  };

  const handleSaveAttendance = async () => {
    setSaving(true);
    try {
      const res = await api.faculty.saveAttendanceSheet({
        courseId: selectedCourseId,
        date: selectedDate,
        title: sessionTitle,
        records: roster,
      });

      setSuccessNotice(res.message || 'Attendance sheet saved. Gamification XP awarded to present students.');
      setTimeout(() => setSuccessNotice(null), 5000);
    } catch (err: any) {
      alert(err.message || 'Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  const presentCount = roster.filter((r) => r.status === 'PRESENT').length;

  return (
    <DashboardLayout title="Attendance Session Register" subtitle="Mark verified lecture presence with automatic XP awarding">
      {/* Success Notification */}
      {successNotice && (
        <div className="p-4 rounded-xl bg-[#E7F8F2] border border-[#BAEEDC] text-xs font-bold text-brand-emerald flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{successNotice}</span>
          </div>
          <button onClick={() => setSuccessNotice(null)} className="text-brand-emerald">
            ✕
          </button>
        </div>
      )}

      {/* Course and Date Controls Bar */}
      <Card variant="white" padding="md" className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-brand-text mb-1">Select Course</label>
            <select
              value={selectedCourseId}
              onChange={(e) => {
                setSelectedCourseId(e.target.value);
                loadAttendance(e.target.value, selectedDate);
              }}
              className="w-full p-2 rounded-xl border border-brand-border bg-[#FAF9FE] text-xs font-bold text-brand-text"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} • {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-text mb-1">Session Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                loadAttendance(selectedCourseId, e.target.value);
              }}
              className="w-full p-2 rounded-xl border border-brand-border bg-[#FAF9FE] text-xs text-brand-text font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-text mb-1">Lecture Session Title</label>
            <input
              type="text"
              value={sessionTitle}
              onChange={(e) => setSessionTitle(e.target.value)}
              className="w-full p-2 rounded-xl border border-brand-border bg-[#FAF9FE] text-xs text-brand-text font-medium"
            />
          </div>
        </div>

        {/* Quick actions & stats */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-brand-border text-xs">
          <div className="flex items-center gap-2">
            <span className="text-brand-muted">Present Roster:</span>
            <strong className="text-brand-emerald">
              {presentCount} of {roster.length} Students
            </strong>
            <span className="text-brand-muted">({Math.round((presentCount / Math.max(1, roster.length)) * 100)}%)</span>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => handleMarkAll('PRESENT')}>
              Mark All Present
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleMarkAll('ABSENT')}>
              Mark All Absent
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={handleSaveAttendance}
              isLoading={saving}
              leftIcon={<Save className="w-3.5 h-3.5" />}
            >
              Save Attendance Sheet
            </Button>
          </div>
        </div>
      </Card>

      {/* Student Roster Table */}
      <Card variant="white" padding="md" className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-brand-text flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-primary" />
            Class Student Roster
          </h3>
          <Badge variant="emerald">+15 XP per Present Student (Idempotent)</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-brand-border text-brand-muted text-[11px] uppercase tracking-wider">
                <th className="pb-3 font-semibold">Student ID</th>
                <th className="pb-3 font-semibold">Full Name</th>
                <th className="pb-3 font-semibold text-center">Status Action</th>
                <th className="pb-3 font-semibold text-right">Current Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {roster.map((student) => (
                <tr key={student.studentProfileId} className="hover:bg-brand-bg/50 transition-colors">
                  <td className="py-3 font-mono font-bold text-brand-primary">{student.studentId}</td>
                  <td className="py-3 font-bold text-brand-text">{student.name}</td>
                  <td className="py-3 text-center">
                    <div className="inline-flex items-center p-1 rounded-xl bg-brand-bg border border-brand-border gap-1">
                      {['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'].map((st) => {
                        const isSelected = student.status === st;
                        return (
                          <button
                            key={st}
                            onClick={() => handleStatusChange(student.studentProfileId, st)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                              isSelected
                                ? st === 'PRESENT'
                                  ? 'bg-brand-emerald text-white'
                                  : st === 'ABSENT'
                                  ? 'bg-brand-red text-white'
                                  : st === 'LATE'
                                  ? 'bg-brand-amber text-white'
                                  : 'bg-brand-primary text-white'
                                : 'text-brand-muted hover:text-brand-text hover:bg-white'
                            }`}
                          >
                            {st}
                          </button>
                        );
                      })}
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <Badge
                      variant={
                        student.status === 'PRESENT'
                          ? 'emerald'
                          : student.status === 'ABSENT'
                          ? 'red'
                          : student.status === 'LATE'
                          ? 'amber'
                          : 'lavender'
                      }
                      size="sm"
                    >
                      {student.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  );
};
