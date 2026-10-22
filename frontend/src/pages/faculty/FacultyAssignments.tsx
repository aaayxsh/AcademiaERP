import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { api } from '../../services/api';
import {
  FileCheck2,
  Plus,
  Clock,
  CheckCircle2,
  Users,
  Eye,
  Award,
  BookOpen,
} from 'lucide-react';

export const FacultyAssignments: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Create Assignment Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    courseId: '',
    title: '',
    description: '',
    maxMarks: '100',
    dueDate: '',
    permittedTypes: 'PDF,DOCX',
    allowLateSubmissions: true,
  });

  // Review Submissions Modal State
  const [selectedAssignment, setSelectedAssignment] = useState<any | null>(null);
  const [submissionsList, setSubmissionsList] = useState<any[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  // Grade Submission Modal State
  const [gradingSubmission, setGradingSubmission] = useState<any | null>(null);
  const [marks, setMarks] = useState<string>('90');
  const [feedback, setFeedback] = useState<string>('');
  const [rubric, setRubric] = useState({ correctness: 45, rigor: 25, documentation: 20 });
  const [savingGrade, setSavingGrade] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const fetchFacultyData = async () => {
    setLoading(true);
    try {
      const res = await api.faculty.getCourses();
      if (res.success && res.courses) {
        setCourses(res.courses);
        if (res.courses.length > 0 && !createForm.courseId) {
          setCreateForm((prev) => ({ ...prev, courseId: res.courses[0].id }));
        }

        // Aggregate assignments
        const list: any[] = [];
        for (const c of res.courses) {
          list.push(
            {
              id: `${c.id}-a1`,
              courseId: c.id,
              courseCode: c.code,
              courseName: c.name,
              title: c.code === 'CS301' ? 'Lab 1: Asymptotic Analysis & Recurrences' : 'Case Study: AI Fairness',
              description: 'Rigorous analysis and proof of algorithmic complexity models.',
              dueDate: '2026-03-30T23:59:59Z',
              maxMarks: 100,
              permittedTypes: 'PDF,DOCX',
              status: 'PUBLISHED',
              submissionsCount: 4,
              gradedCount: 3,
            },
            {
              id: `${c.id}-a2`,
              courseId: c.id,
              courseCode: c.code,
              courseName: c.name,
              title: c.code === 'CS301' ? 'Project 2: Dynamic Programming & All-Pairs Shortest Path' : 'Milestone 2',
              description: 'Implementation and comparative runtime benchmarking.',
              dueDate: '2026-04-12T23:59:59Z',
              maxMarks: 100,
              permittedTypes: 'PDF,DOCX',
              status: 'PUBLISHED',
              submissionsCount: 2,
              gradedCount: 0,
            }
          );
        }
        setAssignments(list);
      }
    } catch (err) {
      console.warn('Using faculty assignment fallback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacultyData();
  }, []);

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.faculty.createAssignment(createForm);
      setNotification('New assignment published successfully!');
      setIsCreateOpen(false);
      await fetchFacultyData();
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to create assignment');
    }
  };

  const handleOpenReview = async (assignment: any) => {
    setSelectedAssignment(assignment);
    setLoadingSubmissions(true);
    try {
      const res = await api.faculty.getSubmissions(assignment.id);
      if (res.success && res.submissions) {
        setSubmissionsList(res.submissions);
      } else {
        // Sample demo submissions
        setSubmissionsList([
          {
            id: 'sub-1',
            studentName: 'Ayush Srivastava',
            studentId: 'STU2026CS042',
            submittedAt: '2026-03-24T14:30:00Z',
            status: 'GRADED',
            grade: { marksObtained: 94, maxMarks: 100, feedback: 'Outstanding mathematical rigor.' },
            aiAssessment: { aiLikelihoodScore: 0.14, confidence: 'LOW' },
          },
          {
            id: 'sub-2',
            studentName: 'Rohit Kumar',
            studentId: 'STU2026CS089',
            submittedAt: '2026-03-25T16:15:00Z',
            status: 'SUBMITTED',
            grade: null,
            aiAssessment: { aiLikelihoodScore: 0.72, confidence: 'HIGH' },
          },
          {
            id: 'sub-3',
            studentName: 'Priya Verma',
            studentId: 'STU2026CS015',
            submittedAt: '2026-03-23T11:00:00Z',
            status: 'GRADED',
            grade: { marksObtained: 98, maxMarks: 100, feedback: 'Flawless execution.' },
            aiAssessment: { aiLikelihoodScore: 0.08, confidence: 'LOW' },
          },
        ]);
      }
    } catch (err) {
      // Fallback roster
      setSubmissionsList([
        {
          id: 'sub-1',
          studentName: 'Ayush Srivastava',
          studentId: 'STU2026CS042',
          submittedAt: '2026-03-24T14:30:00Z',
          status: 'GRADED',
          grade: { marksObtained: 94, maxMarks: 100, feedback: 'Outstanding mathematical rigor.' },
          aiAssessment: { aiLikelihoodScore: 0.14, confidence: 'LOW' },
        },
        {
          id: 'sub-2',
          studentName: 'Rohit Kumar',
          studentId: 'STU2026CS089',
          submittedAt: '2026-03-25T16:15:00Z',
          status: 'SUBMITTED',
          grade: null,
          aiAssessment: { aiLikelihoodScore: 0.72, confidence: 'HIGH' },
        },
      ]);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleOpenGrade = (sub: any) => {
    setGradingSubmission(sub);
    setMarks(sub.grade ? String(sub.grade.marksObtained) : '85');
    setFeedback(sub.grade ? sub.grade.feedback : 'Solid algorithmic structure and clear comments.');
  };

  const handleSaveGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission) return;
    setSavingGrade(true);
    try {
      await api.faculty.gradeSubmission(gradingSubmission.id, {
        marksObtained: parseFloat(marks),
        feedback,
        rubricBreakdown: rubric,
      });

      setNotification(`Official marks recorded for ${gradingSubmission.studentName}. (XP untouched).`);
      setGradingSubmission(null);
      if (selectedAssignment) await handleOpenReview(selectedAssignment);
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to save grade');
    } finally {
      setSavingGrade(false);
    }
  };

  return (
    <DashboardLayout title="Coursework & Assignment Management" subtitle="Create assignments, review submissions, and enter rubric grades">
      {/* Notification Banner */}
      {notification && (
        <div className="p-4 rounded-xl bg-[#E7F8F2] border border-[#BAEEDC] text-xs font-bold text-brand-emerald flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-brand-emerald">
            ✕
          </button>
        </div>
      )}

      {/* Action Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-brand-text">Active Coursework Portfolio</h3>
          <p className="text-xs text-brand-muted">Manage assignments for CS301 and CS303 cohorts</p>
        </div>
        <Button
          size="md"
          onClick={() => {
            setCreateForm({
              courseId: courses[0]?.id || '',
              title: '',
              description: '',
              maxMarks: '100',
              dueDate: '2026-04-20T23:59',
              permittedTypes: 'PDF,DOCX',
              allowLateSubmissions: true,
            });
            setIsCreateOpen(true);
          }}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Create Assignment
        </Button>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {assignments.map((a) => (
          <Card key={a.id} variant="white" padding="md" hoverEffect className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-lavender text-brand-primary flex items-center justify-center font-bold text-xs flex-shrink-0">
                  {a.courseCode}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-brand-text">{a.title}</h4>
                  <p className="text-xs text-brand-muted mt-0.5">{a.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <Badge variant={a.status === 'PUBLISHED' ? 'emerald' : 'gray'}>{a.status}</Badge>
                <Button size="sm" onClick={() => handleOpenReview(a)} leftIcon={<Eye className="w-3.5 h-3.5" />}>
                  Review Submissions
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-brand-border text-xs text-brand-muted">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Due: {new Date(a.dueDate).toLocaleDateString()}
                </span>
                <span>Max: {a.maxMarks} Marks</span>
                <span>Submissions: {a.submissionsCount || 2} Enrolled</span>
              </div>
              <span className="text-brand-emerald font-semibold">
                Evaluation: {a.gradedCount || 1} Evaluated
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Assignment Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Author New Coursework Assignment"
        description="Publish instructions, deadlines, and permitted document types"
      >
        <form onSubmit={handleCreateAssignment} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-brand-text mb-1">Target Course</label>
            <select
              value={createForm.courseId}
              onChange={(e) => setCreateForm({ ...createForm, courseId: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-brand-border bg-[#FBFBFE] text-brand-text"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} • {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-brand-text mb-1">Assignment Title</label>
            <input
              type="text"
              required
              value={createForm.title}
              onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
              placeholder="e.g. Lab Exercise 3: Greedy Minimum Spanning Tree"
              className="w-full p-2.5 rounded-xl border border-brand-border bg-[#FBFBFE] text-brand-text"
            />
          </div>

          <div>
            <label className="block font-bold text-brand-text mb-1">Instructions & Problem Statement</label>
            <textarea
              rows={4}
              required
              value={createForm.description}
              onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
              placeholder="Provide clear problem prompts, submission guidelines, and rubric criteria..."
              className="w-full p-2.5 rounded-xl border border-brand-border bg-[#FBFBFE] text-brand-text"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-brand-text mb-1">Maximum Marks</label>
              <input
                type="number"
                value={createForm.maxMarks}
                onChange={(e) => setCreateForm({ ...createForm, maxMarks: e.target.value })}
                className="w-full p-2 rounded-xl border border-brand-border bg-[#FBFBFE] text-brand-text"
              />
            </div>
            <div>
              <label className="block font-bold text-brand-text mb-1">Due Date & Time</label>
              <input
                type="datetime-local"
                value={createForm.dueDate}
                onChange={(e) => setCreateForm({ ...createForm, dueDate: e.target.value })}
                className="w-full p-2 rounded-xl border border-brand-border bg-[#FBFBFE] text-brand-text"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="allowLate"
              checked={createForm.allowLateSubmissions}
              onChange={(e) => setCreateForm({ ...createForm, allowLateSubmissions: e.target.checked })}
              className="rounded text-brand-primary"
            />
            <label htmlFor="allowLate" className="text-brand-text font-medium">
              Allow late submissions with penalty flag (students forfeit on-time XP)
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Publish Assignment
            </Button>
          </div>
        </form>
      </Modal>

      {/* Review Submissions Modal */}
      <Modal
        isOpen={!!selectedAssignment}
        onClose={() => setSelectedAssignment(null)}
        title={`Submissions: ${selectedAssignment?.title}`}
        description={`${selectedAssignment?.courseCode} • Max ${selectedAssignment?.maxMarks} Marks`}
        maxWidth="2xl"
      >
        <div className="space-y-4 text-xs">
          {loadingSubmissions ? (
            <div className="h-32 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-brand-primary border-t-transparent animate-spin rounded-full" />
            </div>
          ) : submissionsList.length === 0 ? (
            <p className="text-center text-brand-muted py-6">No submissions recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-brand-border text-brand-muted uppercase text-[10px]">
                    <th className="pb-2">Student</th>
                    <th className="pb-2">Submitted</th>
                    <th className="pb-2">AI Indicator</th>
                    <th className="pb-2">Evaluation Status</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {submissionsList.map((sub) => (
                    <tr key={sub.id} className="hover:bg-brand-bg/50">
                      <td className="py-2.5">
                        <strong className="text-brand-text block">{sub.studentName}</strong>
                        <span className="font-mono text-[10px] text-brand-muted">{sub.studentId}</span>
                      </td>
                      <td className="py-2.5 text-brand-muted">
                        {new Date(sub.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="py-2.5">
                        {sub.aiAssessment ? (
                          <Badge
                            variant={sub.aiAssessment.confidence === 'HIGH' ? 'amber' : 'emerald'}
                            size="sm"
                          >
                            AI: {Math.round(sub.aiAssessment.aiLikelihoodScore * 100)}%
                          </Badge>
                        ) : (
                          <Badge variant="gray" size="sm">Unanalyzed</Badge>
                        )}
                      </td>
                      <td className="py-2.5">
                        {sub.grade ? (
                          <span className="font-bold text-brand-emerald">
                            {sub.grade.marksObtained} / {sub.grade.maxMarks || 100}
                          </span>
                        ) : (
                          <Badge variant="amber" size="sm">Pending</Badge>
                        )}
                      </td>
                      <td className="py-2.5 text-right">
                        <Button size="sm" onClick={() => handleOpenGrade(sub)}>
                          {sub.grade ? 'Revise Grade' : 'Grade'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Modal>

      {/* Grade Submission Drawer Modal */}
      <Modal
        isOpen={!!gradingSubmission}
        onClose={() => setGradingSubmission(null)}
        title={`Evaluate: ${gradingSubmission?.studentName}`}
        description={`Roll: ${gradingSubmission?.studentId} • Official Academic Record`}
      >
        <form onSubmit={handleSaveGrade} className="space-y-4 text-xs">
          <div className="p-3 rounded-xl bg-brand-bg border border-brand-border text-brand-muted">
            <strong className="text-brand-text block mb-1">Academic Separation Guarantee:</strong>
            Official marks recorded here update the student transcript. Gamification XP is strictly independent and
            never altered by this evaluation.
          </div>

          <div>
            <label className="block font-bold text-brand-text mb-1">Marks Obtained (Max 100)</label>
            <input
              type="number"
              required
              min={0}
              max={100}
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-brand-border bg-[#FBFBFE] text-brand-text font-bold text-base"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] font-bold text-brand-muted block">Correctness (50)</label>
              <input
                type="number"
                value={rubric.correctness}
                onChange={(e) => setRubric({ ...rubric, correctness: parseInt(e.target.value) || 0 })}
                className="w-full p-1.5 rounded-lg border border-brand-border text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-brand-muted block">Proof Rigor (30)</label>
              <input
                type="number"
                value={rubric.rigor}
                onChange={(e) => setRubric({ ...rubric, rigor: parseInt(e.target.value) || 0 })}
                className="w-full p-1.5 rounded-lg border border-brand-border text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-brand-muted block">Doc & Style (20)</label>
              <input
                type="number"
                value={rubric.documentation}
                onChange={(e) => setRubric({ ...rubric, documentation: parseInt(e.target.value) || 0 })}
                className="w-full p-1.5 rounded-lg border border-brand-border text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-brand-text mb-1">Faculty Formative Feedback</label>
            <textarea
              rows={3}
              required
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Constructive feedback for the student..."
              className="w-full p-2.5 rounded-xl border border-brand-border bg-[#FBFBFE] text-brand-text"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setGradingSubmission(null)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={savingGrade}>
              Save Official Grade
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};
