import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { api } from '../../services/api';
import {
  FileCheck2,
  Clock,
  UploadCloud,
  FileText,
  Search,
  CheckCircle2,
  Sparkles,
  Award,
  AlertCircle,
  Eye,
} from 'lucide-react';

export const StudentAssignments: React.FC = () => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Submission modal state
  const [selectedAssignment, setSelectedAssignment] = useState<any | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [fileName, setFileName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // View details modal
  const [viewDetails, setViewDetails] = useState<any | null>(null);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await api.student.getAssignments();
      if (res.success && res.assignments) {
        setAssignments(res.assignments);
      }
    } catch (err) {
      console.warn('Using assignments fallback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleOpenSubmit = (assignment: any) => {
    setSelectedAssignment(assignment);
    setSubmissionText(
      `Analysis and implementation for ${assignment.title}:\n\nWe implemented the requested algorithm with comprehensive recurrence proofs and empirical latency benchmarks. Recurrence T(n) = 2T(n/2) + O(n) resolves to Theta(n log n). Detailed complexity proofs and test assertions are provided below.`
    );
    setFileName(`Submission_${assignment.courseCode}_Final.pdf`);
  };

  const handleConfirmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    setSubmitting(true);
    try {
      const res = await api.student.submitAssignment(selectedAssignment.id, {
        textContent: submissionText,
        originalFileName: fileName,
      });

      setSuccessMessage(
        res.message + (res.submission?.xpEarned ? ` (Earned +${res.submission.xpEarned} XP!)` : '')
      );
      setSelectedAssignment(null);
      await fetchAssignments();
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      alert(err.message || 'Failed to submit assignment');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = assignments.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.courseCode.toLowerCase().includes(search.toLowerCase());

    if (filterStatus === 'ALL') return matchesSearch;
    if (filterStatus === 'PENDING') return matchesSearch && !a.submission;
    if (filterStatus === 'SUBMITTED') return matchesSearch && a.submission && !a.submission.grade;
    if (filterStatus === 'GRADED') return matchesSearch && a.submission && a.submission.grade;
    return matchesSearch;
  });

  return (
    <DashboardLayout title="My Assignments" subtitle="Track deadlines, submit coursework, and view faculty feedback">
      {/* Success Notification Banner */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-[#E7F8F2] border border-[#BAEEDC] text-xs font-bold text-brand-emerald flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-brand-emerald hover:opacity-75">
            ✕
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <Card variant="white" padding="sm" className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by course or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-brand-border bg-[#FAF9FE] text-xs text-brand-text placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          />
          <Search className="w-4 h-4 text-brand-muted absolute left-3 top-2.5" />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-brand-bg border border-brand-border self-stretch sm:self-auto overflow-x-auto">
          {['ALL', 'PENDING', 'SUBMITTED', 'GRADED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterStatus === status
                  ? 'bg-violet-gradient text-white shadow-sm'
                  : 'text-brand-muted hover:text-brand-text'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </Card>

      {/* Assignments Table / Cards */}
      <div className="space-y-4">
        {loading ? (
          <div className="h-48 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-4 border-brand-primary border-t-transparent animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <Card variant="white" padding="lg" className="text-center py-12">
            <FileCheck2 className="w-12 h-12 text-brand-muted mx-auto mb-3 opacity-40" />
            <h3 className="text-sm font-bold text-brand-text">No assignments match your criteria</h3>
            <p className="text-xs text-brand-muted mt-1">Try resetting the status filter or search query</p>
          </Card>
        ) : (
          filtered.map((item) => {
            const hasSubmitted = !!item.submission;
            const isGraded = hasSubmitted && !!item.submission.grade;
            const isLate = hasSubmitted && item.submission.isLate;

            return (
              <Card key={item.id} variant="white" padding="md" hoverEffect className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-lavender text-brand-primary flex items-center justify-center flex-shrink-0 font-bold text-xs">
                      {item.courseCode}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-brand-text">{item.title}</h4>
                      <p className="text-xs text-brand-muted mt-0.5 line-clamp-1">{item.description}</p>
                    </div>
                  </div>

                  {/* Badges & Actions */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {isGraded ? (
                      <Badge variant="emerald" size="md">
                        Graded: {item.submission.grade.marksObtained} / {item.maxMarks}
                      </Badge>
                    ) : hasSubmitted ? (
                      <Badge variant={isLate ? 'amber' : 'lavender'} size="md">
                        {isLate ? 'Submitted Late' : 'Submitted (Under Review)'}
                      </Badge>
                    ) : (
                      <Badge variant="amber" size="md">
                        Action Required
                      </Badge>
                    )}

                    {hasSubmitted ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewDetails(item)}
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                      >
                        Details
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleOpenSubmit(item)}
                        leftIcon={<UploadCloud className="w-3.5 h-3.5" />}
                      >
                        Submit
                      </Button>
                    )}
                  </div>
                </div>

                {/* Metadata Row */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-brand-border text-xs text-brand-muted">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-brand-muted" />
                      Due: {new Date(item.dueDate).toLocaleDateString()} {new Date(item.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span>Max: {item.maxMarks} Marks</span>
                    <span>Format: {item.permittedTypes}</span>
                  </div>

                  {!hasSubmitted && (
                    <div className="flex items-center gap-1.5 text-brand-emerald font-semibold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Earn +50 XP for on-time submission</span>
                    </div>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Submission Modal */}
      <Modal
        isOpen={!!selectedAssignment}
        onClose={() => setSelectedAssignment(null)}
        title={`Submit: ${selectedAssignment?.title}`}
        description={`Course: ${selectedAssignment?.courseCode} • Max Marks: ${selectedAssignment?.maxMarks}`}
      >
        <form onSubmit={handleConfirmSubmit} className="space-y-4">
          <div className="p-3 rounded-xl bg-[#F4F1FD] border border-[#E5DEFA] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-brand-primary font-bold">
              <Sparkles className="w-4 h-4" />
              <span>On-Time Reward: +50 XP</span>
            </div>
            <span className="text-brand-muted">Deadline: {selectedAssignment ? new Date(selectedAssignment.dueDate).toLocaleDateString() : ''}</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-text mb-1">Upload Document File (PDF / DOCX)</label>
            <div className="border-2 border-dashed border-brand-border rounded-xl p-4 text-center bg-[#FAF9FE] space-y-2">
              <UploadCloud className="w-8 h-8 text-brand-primary mx-auto opacity-75" />
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full text-center text-xs font-mono border border-brand-border rounded-lg p-1.5 bg-white"
                placeholder="FileName_RollNo.pdf"
              />
              <p className="text-[11px] text-brand-muted">Simulated file upload ready for instant evaluation</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-text mb-1">Submission Text / Executive Summary</label>
            <textarea
              rows={5}
              required
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
              className="w-full p-3 rounded-xl border border-brand-border bg-[#FBFBFE] text-xs text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              placeholder="Paste or write your assignment solution summary..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="outline" size="md" onClick={() => setSelectedAssignment(null)}>
              Cancel
            </Button>
            <Button type="submit" size="md" isLoading={submitting} rightIcon={<FileCheck2 className="w-4 h-4" />}>
              Submit Assignment
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Submission & Evaluation Details Modal */}
      <Modal
        isOpen={!!viewDetails}
        onClose={() => setViewDetails(null)}
        title="Submission Evaluation & Feedback"
        description={`${viewDetails?.courseCode} • ${viewDetails?.title}`}
      >
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-brand-bg border border-brand-border">
            <div>
              <span className="text-brand-muted block">Submitted Timestamp:</span>
              <strong className="text-brand-text">
                {viewDetails?.submission?.submittedAt
                  ? new Date(viewDetails.submission.submittedAt).toLocaleString()
                  : 'N/A'}
              </strong>
            </div>
            <div>
              <span className="text-brand-muted block">Evaluation Status:</span>
              <strong className="text-brand-emerald">
                {viewDetails?.submission?.grade ? 'Official Grade Released' : 'Under Faculty Review'}
              </strong>
            </div>
          </div>

          {viewDetails?.submission?.grade && (
            <div className="p-4 rounded-xl bg-[#E7F8F2] border border-[#BAEEDC] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-brand-emerald text-sm">Official Marks Awarded</span>
                <span className="text-lg font-black text-brand-emerald tabular-nums">
                  {viewDetails.submission.grade.marksObtained} / {viewDetails.submission.grade.maxMarks}
                </span>
              </div>
              {viewDetails.submission.grade.feedback && (
                <div className="pt-2 border-t border-[#BAEEDC]">
                  <span className="text-[11px] font-bold text-brand-emerald block">Faculty Remarks:</span>
                  <p className="text-xs text-brand-text mt-0.5 italic">"{viewDetails.submission.grade.feedback}"</p>
                </div>
              )}
            </div>
          )}

          <div>
            <span className="font-bold text-brand-text block mb-1">Submitted Document:</span>
            <div className="p-3 rounded-xl border border-brand-border bg-white flex items-center justify-between">
              <span className="font-mono text-brand-muted">{viewDetails?.submission?.originalFileName}</span>
              <Badge variant="lavender">Verified PDF</Badge>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="primary" size="sm" onClick={() => setViewDetails(null)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};
