import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { api } from '../../services/api';
import {
  Bot,
  ShieldAlert,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  History,
  FileText,
  Eye,
  Sliders,
  Send,
} from 'lucide-react';

export const FacultyAiReview: React.FC = () => {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Inspector Drawer State
  const [inspectItem, setInspectItem] = useState<any | null>(null);

  // Disposition Modal State
  const [dispositionItem, setDispositionItem] = useState<any | null>(null);
  const [disposition, setDisposition] = useState('CONFIRMED_ORIGINAL');
  const [facultyNotes, setFacultyNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const fetchWorkspace = async () => {
    setLoading(true);
    try {
      const res = await api.faculty.getAiReviewWorkspace();
      if (res.success && res.assessments) {
        setAssessments(res.assessments);
      }
    } catch (err) {
      console.warn('AI workspace fallback');
      setAssessments([
        {
          id: 'ai-1',
          submissionId: 'sub-rohit',
          studentName: 'Rohit Kumar',
          studentId: 'STU2026CS089',
          courseCode: 'CS301',
          assignmentTitle: 'Lab Exercise 1: Asymptotic Analysis',
          submittedAt: '2026-03-22T10:00:00Z',
          aiLikelihoodScore: 0.76,
          confidence: 'HIGH',
          signals: {
            shannonEntropy: 6.58,
            sentenceLengthStdDev: 3.2,
            typeTokenRatio: 0.46,
            markerDensityPer100Words: 3.8,
            detectedMarkers: [{ marker: 'in conclusion', count: 1 }, { marker: 'furthermore', count: 1 }, { marker: 'delves into', count: 1 }],
          },
          disclaimer: 'Heuristic stylometric decision-support only. Faculty retains final authority.',
          processingTimeMs: 55,
          modelVersion: 'stylometry-nlp-v1.2',
          textContentPreview: 'In conclusion, it is crucial to recognize the multifaceted importance of recurrence relations in computer algorithms. Furthermore, the divide and conquer paradigm serves as a beacon of optimization. Moreover, asymptotic analysis delves into efficiency metrics.',
          dispositions: [
            {
              id: 'disp-1',
              disposition: 'CONFIRMED_ORIGINAL',
              notes: 'Conducted interactive oral defense in Lab 304. Student explained all proof steps and graph code fluently. High AI index was caused by formulaic academic phrasing template.',
              decidedBy: 'Prof. Rajesh Sharma',
              timestamp: '2026-03-24T15:00:00Z',
            },
          ],
        },
        {
          id: 'ai-2',
          submissionId: 'sub-ayush',
          studentName: 'Ayush Srivastava',
          studentId: 'STU2026CS042',
          courseCode: 'CS301',
          assignmentTitle: 'Project 2: Dynamic Programming',
          submittedAt: '2026-03-24T14:30:00Z',
          aiLikelihoodScore: 0.19,
          confidence: 'LOW',
          signals: {
            shannonEntropy: 7.02,
            sentenceLengthStdDev: 7.8,
            typeTokenRatio: 0.62,
            markerDensityPer100Words: 0.4,
          },
          disclaimer: 'Heuristic stylometric decision-support only.',
          processingTimeMs: 48,
          modelVersion: 'stylometry-nlp-v1.2',
          textContentPreview: 'Dynamic Programming Optimization: Floyd-Warshall implementation with memoization matrix and predecessor path reconstruction. Empirical results demonstrate O(V^3) runtime scaling across dense adjacency matrices.',
          dispositions: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspace();
  }, []);

  const handleOpenDisposition = (item: any) => {
    setDispositionItem(item);
    setDisposition('CONFIRMED_ORIGINAL');
    setFacultyNotes('Conducted oral viva in department lab. Verified student authentic comprehension and mathematical proof ownership.');
  };

  const handleSaveDisposition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispositionItem) return;
    setSubmitting(true);
    try {
      await api.faculty.submitReviewDisposition({
        assessmentId: dispositionItem.id,
        disposition,
        facultyNotes,
      });

      setSuccessBanner(`Faculty disposition recorded permanently in audit log for ${dispositionItem.studentName}.`);
      setDispositionItem(null);
      await fetchWorkspace();
      setTimeout(() => setSuccessBanner(null), 5000);
    } catch (err: any) {
      alert(err.message || 'Failed to record disposition');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="AI Validation Review Workspace" subtitle="Decision support and stylometric profiling for student coursework">
      {/* Success Notification */}
      {successBanner && (
        <div className="p-4 rounded-xl bg-[#E7F8F2] border border-[#BAEEDC] text-xs font-bold text-brand-emerald flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{successBanner}</span>
          </div>
          <button onClick={() => setSuccessBanner(null)} className="text-brand-emerald">
            ✕
          </button>
        </div>
      )}

      {/* Mandatory Institutional Disclaimer Banner */}
      <Card variant="white" padding="md" className="border-l-4 border-l-brand-amber space-y-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-brand-amber" />
          <h3 className="text-sm font-bold text-brand-text">Faculty Advisory Decision Support Notice</h3>
        </div>
        <p className="text-xs text-brand-muted leading-relaxed">
          AI stylometric indicators are probabilistic signals (evaluating token entropy, burstiness, and formulaic
          academic syntax). They <strong>never</strong> justify automated penalties, grade deductions, or accusations of
          misconduct. Faculty members possess exclusive authority and must conduct oral vivas or discussions before
          reaching any determination.
        </p>
      </Card>

      {/* Main Submissions Table */}
      <Card variant="white" padding="md" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-brand-text flex items-center gap-2">
              <Cpu className="w-5 h-5 text-brand-primary" />
              Coursework Stylometric Ledger
            </h3>
            <p className="text-xs text-brand-muted">Assessed submissions across assigned CS301 and CS303 classes</p>
          </div>
          <Badge variant="indigo">CPU NLP v1.2</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-brand-border text-brand-muted text-[11px] uppercase tracking-wider">
                <th className="pb-3 font-semibold">Student</th>
                <th className="pb-3 font-semibold">Course & Task</th>
                <th className="pb-3 font-semibold">AI Likelihood</th>
                <th className="pb-3 font-semibold">Contributing Signal</th>
                <th className="pb-3 font-semibold">Faculty Disposition</th>
                <th className="pb-3 font-semibold text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {assessments.map((item) => {
                const isHigh = item.confidence === 'HIGH' || item.aiLikelihoodScore >= 0.65;
                const latestDisposition = item.dispositions?.[0];

                return (
                  <tr key={item.id} className="hover:bg-brand-bg/50 transition-colors">
                    <td className="py-3">
                      <strong className="text-brand-text block">{item.studentName}</strong>
                      <span className="font-mono text-[10px] text-brand-muted">{item.studentId}</span>
                    </td>
                    <td className="py-3">
                      <span className="text-[11px] font-bold text-brand-primary block">{item.courseCode}</span>
                      <span className="text-brand-text">{item.assignmentTitle}</span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <Badge variant={isHigh ? 'amber' : 'emerald'} size="sm">
                          {Math.round(item.aiLikelihoodScore * 100)}% ({item.confidence})
                        </Badge>
                      </div>
                    </td>
                    <td className="py-3 text-brand-muted font-mono text-[11px]">
                      Entropy: {item.signals?.shannonEntropy || '6.9'}b • Burstiness: {item.signals?.sentenceLengthStdDev || '8.2'}
                    </td>
                    <td className="py-3">
                      {latestDisposition ? (
                        <Badge variant="emerald" size="sm">
                          {latestDisposition.disposition.replace(/_/g, ' ')}
                        </Badge>
                      ) : (
                        <Badge variant={isHigh ? 'amber' : 'gray'} size="sm">
                          {isHigh ? 'Pending Viva Defense' : 'Standard Submission'}
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => setInspectItem(item)}>
                          Inspect
                        </Button>
                        <Button size="sm" onClick={() => handleOpenDisposition(item)}>
                          Record Disposition
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Inspect Stylometric Signals Modal */}
      <Modal
        isOpen={!!inspectItem}
        onClose={() => setInspectItem(null)}
        title="Stylometric Signal Inspector"
        description={`${inspectItem?.studentName} (${inspectItem?.studentId}) • ${inspectItem?.assignmentTitle}`}
        maxWidth="xl"
      >
        <div className="space-y-4 text-xs">
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-brand-bg border border-brand-border">
              <span className="text-[10px] text-brand-muted block font-semibold uppercase">AI Likelihood</span>
              <strong className="text-sm font-black text-brand-text">
                {Math.round((inspectItem?.aiLikelihoodScore || 0) * 100)}%
              </strong>
            </div>
            <div className="p-3 rounded-xl bg-brand-bg border border-brand-border">
              <span className="text-[10px] text-brand-muted block font-semibold uppercase">Shannon Entropy</span>
              <strong className="text-sm font-black text-brand-primary">
                {inspectItem?.signals?.shannonEntropy || '7.0'} bits
              </strong>
            </div>
            <div className="p-3 rounded-xl bg-brand-bg border border-brand-border">
              <span className="text-[10px] text-brand-muted block font-semibold uppercase">Sentence Variance</span>
              <strong className="text-sm font-black text-brand-text">
                {inspectItem?.signals?.sentenceLengthStdDev || '7.5'} std
              </strong>
            </div>
            <div className="p-3 rounded-xl bg-brand-bg border border-brand-border">
              <span className="text-[10px] text-brand-muted block font-semibold uppercase">Vocabulary (TTR)</span>
              <strong className="text-sm font-black text-brand-text">
                {inspectItem?.signals?.typeTokenRatio || '0.65'}
              </strong>
            </div>
          </div>

          {/* Over-indexed markers */}
          {inspectItem?.signals?.detectedMarkers && inspectItem.signals.detectedMarkers.length > 0 && (
            <div className="p-3 rounded-xl bg-[#FEF6EC] border border-[#FDDFBC] space-y-1">
              <span className="font-bold text-brand-amber block">Over-Indexed Transition Markers:</span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {inspectItem.signals.detectedMarkers.map((m: any, idx: number) => (
                  <Badge key={idx} variant="amber" size="sm">
                    "{m.marker}" ({m.count}x)
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Extracted Text Preview */}
          <div>
            <span className="font-bold text-brand-text block mb-1">Extracted Submission Text:</span>
            <div className="p-3.5 rounded-xl border border-brand-border bg-[#FBFBFE] font-mono text-[11px] text-brand-text max-h-48 overflow-y-auto leading-relaxed">
              {inspectItem?.textContentPreview || 'No raw text extract available.'}
            </div>
          </div>

          {/* Existing Dispositions */}
          {inspectItem?.dispositions && inspectItem.dispositions.length > 0 && (
            <div className="p-3 rounded-xl bg-[#E7F8F2] border border-[#BAEEDC] space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-brand-emerald">Recorded Faculty Disposition:</span>
                <span className="text-[10px] text-brand-muted">
                  {new Date(inspectItem.dispositions[0].timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-brand-text italic">"{inspectItem.dispositions[0].notes}"</p>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button size="sm" onClick={() => setInspectItem(null)}>
              Close Inspector
            </Button>
          </div>
        </div>
      </Modal>

      {/* Record Disposition Modal */}
      <Modal
        isOpen={!!dispositionItem}
        onClose={() => setDispositionItem(null)}
        title="Record Formal Faculty Disposition"
        description={`${dispositionItem?.studentName} • ${dispositionItem?.assignmentTitle}`}
      >
        <form onSubmit={handleSaveDisposition} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-brand-text mb-1">Select Academic Disposition</label>
            <select
              value={disposition}
              onChange={(e) => setDisposition(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-brand-border bg-[#FBFBFE] text-brand-text font-bold"
            >
              <option value="CONFIRMED_ORIGINAL">Confirmed Original (Student Comprehension Verified)</option>
              <option value="FLAGGED_FOR_ORAL_DEFENSE">Flag for Oral Viva / Defense in Department Lab</option>
              <option value="REVISION_REQUESTED">Request Sectional Revision / Rewriting</option>
              <option value="DISMISSED">Dismiss Signal as Formulaic Academic Syntax</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-brand-text mb-1">Faculty Review Justification & Notes</label>
            <textarea
              rows={4}
              required
              value={facultyNotes}
              onChange={(e) => setFacultyNotes(e.target.value)}
              placeholder="Record notes from your discussion with the student, lab verification, or review rationale..."
              className="w-full p-2.5 rounded-xl border border-brand-border bg-[#FBFBFE] text-brand-text"
            />
          </div>

          <p className="text-[11px] text-brand-muted">
            This disposition is permanently signed by your faculty credentials and stored in the institutional audit log.
          </p>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setDispositionItem(null)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={submitting} rightIcon={<Send className="w-3.5 h-3.5" />}>
              Save Disposition to Audit Log
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};
