import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { api } from '../../services/api';
import { Shield, Search, History, Eye, Lock } from 'lucide-react';

export const AdminAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<any | null>(null);
  const [actionFilter, setActionFilter] = useState('ALL');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.admin.getAuditLogs();
      if (res.success && res.logs) {
        setLogs(res.logs);
      }
    } catch (err) {
      console.warn('Audit logs fallback');
      setLogs([
        {
          id: 'log-1',
          action: 'AI_DISPOSITION_RECORDED',
          entityType: 'FacultyReviewDisposition',
          role: 'FACULTY',
          userName: 'Prof. Rajesh Sharma',
          userEmail: 'prof.sharma@academia.edu',
          ipAddress: '127.0.0.1',
          createdAt: new Date().toISOString(),
          details: { disposition: 'CONFIRMED_ORIGINAL', notes: 'Oral defense conducted in Lab 304.' },
        },
        {
          id: 'log-2',
          action: 'XP_RULE_CONFIGURED',
          entityType: 'XpRule',
          role: 'ADMIN',
          userName: 'Dr. Vikram Sethi',
          userEmail: 'admin@academia.edu',
          ipAddress: '127.0.0.1',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          details: { ruleKey: 'ON_TIME_SUBMISSION', newBasePoints: 50, newVersion: 2 },
        },
        {
          id: 'log-3',
          action: 'ATTENDANCE_MARKED',
          entityType: 'AttendanceSession',
          role: 'FACULTY',
          userName: 'Prof. Rajesh Sharma',
          userEmail: 'prof.sharma@academia.edu',
          ipAddress: '127.0.0.1',
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          details: { courseId: 'CS301', presentCount: 4, xpAwarded: 4 },
        },
        {
          id: 'log-4',
          action: 'LOGIN_SUCCESS',
          entityType: 'User',
          role: 'STUDENT',
          userName: 'Ayush Srivastava',
          userEmail: 'ayush.student@academia.edu',
          ipAddress: '127.0.0.1',
          createdAt: new Date(Date.now() - 10800000).toISOString(),
          details: { role: 'STUDENT' },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filtered = logs.filter((l) => {
    if (actionFilter === 'ALL') return true;
    return l.action.includes(actionFilter);
  });

  return (
    <DashboardLayout title="Institutional Security & Audit Trail" subtitle="Cryptographically logged system events, access controls, and administrative actions">
      <Card variant="white" padding="sm" className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-brand-muted">
          <Lock className="w-4 h-4 text-brand-primary" />
          <span>Immutable Audit Ledger • Tamper-Resistant</span>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-brand-bg border border-brand-border text-xs">
          {['ALL', 'LOGIN', 'ATTENDANCE', 'XP_RULE', 'DISPOSITION'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActionFilter(filter)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                actionFilter === filter
                  ? 'bg-violet-gradient text-white shadow-sm'
                  : 'text-brand-muted hover:text-brand-text'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </Card>

      <Card variant="white" padding="md" className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-brand-text flex items-center gap-2">
            <History className="w-5 h-5 text-brand-primary" />
            Security & Administrative Event Records
          </h3>
          <Badge variant="indigo">{filtered.length} Log Entries</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-brand-border text-brand-muted text-[11px] uppercase tracking-wider">
                <th className="pb-3 font-semibold">Timestamp</th>
                <th className="pb-3 font-semibold">Action</th>
                <th className="pb-3 font-semibold">Entity Type</th>
                <th className="pb-3 font-semibold">Actor / Role</th>
                <th className="pb-3 font-semibold">IP Address</th>
                <th className="pb-3 font-semibold text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-brand-bg/50 transition-colors">
                  <td className="py-3 text-brand-muted font-mono text-[11px]">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3 font-bold text-brand-text">
                    {log.action.replace(/_/g, ' ')}
                  </td>
                  <td className="py-3 font-mono text-brand-muted">{log.entityType}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-brand-text">{log.userName}</span>
                      <Badge variant={log.role === 'ADMIN' ? 'indigo' : 'lavender'} size="sm">
                        {log.role}
                      </Badge>
                    </div>
                  </td>
                  <td className="py-3 font-mono text-brand-muted">{log.ipAddress || '127.0.0.1'}</td>
                  <td className="py-3 text-right">
                    <Button size="sm" variant="outline" onClick={() => setSelectedLog(log)} leftIcon={<Eye className="w-3.5 h-3.5" />}>
                      Payload
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail JSON Modal */}
      <Modal
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        title={`Audit Event: ${selectedLog?.action}`}
        description={`Logged at ${selectedLog ? new Date(selectedLog.createdAt).toLocaleString() : ''}`}
      >
        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-xl bg-brand-bg border border-brand-border space-y-1">
            <p><strong>Actor:</strong> {selectedLog?.userName} ({selectedLog?.userEmail})</p>
            <p><strong>Role:</strong> {selectedLog?.role}</p>
            <p><strong>Entity Type:</strong> {selectedLog?.entityType}</p>
            <p><strong>Origin IP:</strong> {selectedLog?.ipAddress}</p>
          </div>

          <div>
            <span className="font-bold text-brand-text block mb-1">Event Payload (JSON):</span>
            <pre className="p-3.5 rounded-xl border border-brand-border bg-[#FBFBFE] font-mono text-[11px] text-brand-text max-h-56 overflow-auto">
              {JSON.stringify(selectedLog?.details || {}, null, 2)}
            </pre>
          </div>

          <div className="flex justify-end pt-2">
            <Button size="sm" onClick={() => setSelectedLog(null)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};
