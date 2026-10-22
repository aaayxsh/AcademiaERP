import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { api } from '../../services/api';
import { BookOpen, User, CalendarCheck2, FileText, CheckCircle2 } from 'lucide-react';

export const StudentCourses: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.student.getCourses();
        if (res.success && res.courses) {
          setCourses(res.courses);
        }
      } catch (err) {
        console.warn('Using courses fallback');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const defaultCourses = [
    {
      id: 'cs301',
      code: 'CS301',
      name: 'Design & Analysis of Algorithms',
      credits: 4,
      semester: 6,
      department: 'Computer Science & Engineering',
      syllabus: 'Asymptotic Analysis, Divide & Conquer, Dynamic Programming, Greedy Methods, Graph Algorithms, NP-Completeness.',
      faculty: { name: 'Prof. Rajesh Sharma', designation: 'Professor & HOD', office: 'Tech Block 3 - Room 304' },
      stats: { attendancePercentage: 90, totalAssignments: 2, totalSessions: 10 },
    },
    {
      id: 'cs302',
      code: 'CS302',
      name: 'Distributed Systems & Cloud Computing',
      credits: 4,
      semester: 6,
      department: 'Computer Science & Engineering',
      syllabus: 'Clock Synchronization, Consensus Protocols (Paxos, Raft), RPCs, Microservices, Kubernetes, Fault Tolerance.',
      faculty: { name: 'Dr. Ananya Mukherjee', designation: 'Associate Professor', office: 'Tech Block 2 - Room 218' },
      stats: { attendancePercentage: 100, totalAssignments: 1, totalSessions: 8 },
    },
    {
      id: 'cs303',
      code: 'CS303',
      name: 'Machine Learning & AI Ethics',
      credits: 3,
      semester: 6,
      department: 'Computer Science & Engineering',
      syllabus: 'Supervised & Unsupervised Learning, Stylometric NLP, Evaluation Metrics, Bias & Fairness in AI Systems.',
      faculty: { name: 'Prof. Rajesh Sharma', designation: 'Professor & HOD', office: 'Tech Block 3 - Room 304' },
      stats: { attendancePercentage: 88, totalAssignments: 1, totalSessions: 8 },
    },
  ];

  const courseList = courses.length > 0 ? courses : defaultCourses;

  return (
    <DashboardLayout title="My Enrolled Courses" subtitle="Academic term Spring 2026 course registrations">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courseList.map((c) => (
          <Card key={c.code} variant="white" padding="md" hoverEffect className="space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-12 h-12 rounded-xl bg-violet-gradient text-white flex items-center justify-center font-black text-xs shadow-violet-glow">
                  {c.code}
                </span>
                <Badge variant="lavender">{c.credits} Credits</Badge>
              </div>

              <div>
                <h3 className="text-base font-bold text-brand-text">{c.name}</h3>
                <p className="text-xs text-brand-muted mt-0.5">{c.department}</p>
              </div>

              <div className="p-3 rounded-xl bg-brand-bg border border-brand-border space-y-1">
                <span className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">Course Syllabus:</span>
                <p className="text-xs text-brand-text leading-relaxed line-clamp-3">{c.syllabus}</p>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-brand-border">
              {c.faculty && (
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-brand-lavender text-brand-primary flex items-center justify-center font-bold text-xs flex-shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-brand-text truncate">{c.faculty.name}</p>
                    <p className="text-[11px] text-brand-muted truncate">{c.faculty.designation}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-xs font-semibold pt-1">
                <span className="text-brand-muted">Attendance:</span>
                <span className="text-brand-emerald">{c.stats?.attendancePercentage || 92}% Verified</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};
