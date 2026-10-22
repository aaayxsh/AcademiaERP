import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { api } from '../../services/api';
import { Sparkles, Edit3, Shield, History, CheckCircle2 } from 'lucide-react';

export const AdminXpRules: React.FC = () => {
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editRule, setEditRule] = useState<any | null>(null);
  const [basePoints, setBasePoints] = useState<number>(50);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const fetchRules = async () => {
    setLoading(true);
    try {
      const res = await api.admin.getXpRules();
      if (res.success && res.rules) {
        setRules(res.rules);
      }
    } catch (err) {
      console.warn('XP rules fallback');
      setRules([
        { id: 'r-1', ruleKey: 'ON_TIME_SUBMISSION', title: 'On-Time Assignment Submission', description: 'Awarded when an assignment is submitted prior to deadline.', basePoints: 50, ruleVersion: 1, isActive: true },
        { id: 'r-2', ruleKey: 'EARLY_SUBMISSION_BONUS', title: 'Early Bird Submission', description: 'Awarded for submissions delivered 24+ hours ahead of deadline.', basePoints: 25, ruleVersion: 1, isActive: true },
        { id: 'r-3', ruleKey: 'ATTENDANCE_SESSION', title: 'Verified Lecture Attendance', description: 'Awarded automatically for marked presence in regular lectures.', basePoints: 15, ruleVersion: 1, isActive: true },
        { id: 'r-4', ruleKey: 'WEEKLY_PERFECT_ATTENDANCE', title: 'Weekly Attendance Milestone', description: 'Awarded for 100% attendance across all courses in a week.', basePoints: 40, ruleVersion: 1, isActive: true },
        { id: 'r-5', ruleKey: 'STREAK_MILESTONE_7', title: '7-Day Academic Activity Streak', description: 'Maintained active daily engagement for 7 consecutive days.', basePoints: 50, ruleVersion: 1, isActive: true },
        { id: 'r-6', ruleKey: 'SEMINAR_PARTICIPATION', title: 'Academic Workshop / Colloquium', description: 'Participation in approved university colloquiums.', basePoints: 35, ruleVersion: 1, isActive: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleOpenEdit = (rule: any) => {
    setEditRule(rule);
    setBasePoints(rule.basePoints);
    setTitle(rule.title);
    setDescription(rule.description);
    setIsActive(rule.isActive);
  };

  const handleSaveRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editRule) return;
    setSaving(true);
    try {
      await api.admin.updateXpRule(editRule.id, {
        basePoints,
        title,
        description,
        isActive,
      });

      setNotice(`XP Rule "${title}" updated. Version incremented; past transactions preserved.`);
      setEditRule(null);
      await fetchRules();
      setTimeout(() => setNotice(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to update rule');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout title="Configurable XP Rule Engine" subtitle="Maintain institutional gamification rules with auditable versioning">
      {notice && (
        <div className="p-4 rounded-xl bg-[#E7F8F2] border border-[#BAEEDC] text-xs font-bold text-brand-emerald flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-brand-emerald">
            ✕
          </button>
        </div>
      )}

      {/* Governance Guarantee Notice */}
      <Card variant="white" padding="md" className="border-l-4 border-l-brand-primary space-y-2">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-brand-primary" />
          <h3 className="text-sm font-bold text-brand-text">Historical Transaction Protection</h3>
        </div>
        <p className="text-xs text-brand-muted leading-relaxed">
          Rule modifications increment the rule version (e.g. v1 → v2). The system <strong>never</strong> silently
          rewrites past XP transactions or past leaderboard histories, ensuring complete forensic auditability for
          academic accreditation.
        </p>
      </Card>

      {/* Rules Table */}
      <Card variant="white" padding="md" className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-brand-text flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-primary" />
            Configured Institutional Award Rules
          </h3>
          <Badge variant="lavender">Event-Driven Architecture</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-brand-border text-brand-muted text-[11px] uppercase tracking-wider">
                <th className="pb-3 font-semibold">Rule Key</th>
                <th className="pb-3 font-semibold">Title & Description</th>
                <th className="pb-3 font-semibold text-center">Version</th>
                <th className="pb-3 font-semibold text-center">Status</th>
                <th className="pb-3 font-semibold text-right">Base Award</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {rules.map((rule) => (
                <tr key={rule.id} className="hover:bg-brand-bg/50 transition-colors">
                  <td className="py-3 font-mono font-bold text-brand-primary">{rule.ruleKey}</td>
                  <td className="py-3 max-w-xs">
                    <strong className="text-brand-text block">{rule.title}</strong>
                    <span className="text-brand-muted text-[11px] line-clamp-1">{rule.description}</span>
                  </td>
                  <td className="py-3 text-center">
                    <Badge variant="indigo" size="sm">
                      v{rule.ruleVersion}
                    </Badge>
                  </td>
                  <td className="py-3 text-center">
                    <Badge variant={rule.isActive ? 'emerald' : 'gray'} size="sm">
                      {rule.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </Badge>
                  </td>
                  <td className="py-3 text-right font-black text-brand-emerald text-sm tabular-nums">
                    +{rule.basePoints} XP
                  </td>
                  <td className="py-3 text-right">
                    <Button size="sm" variant="outline" onClick={() => handleOpenEdit(rule)} leftIcon={<Edit3 className="w-3.5 h-3.5" />}>
                      Configure
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit Rule Modal */}
      <Modal
        isOpen={!!editRule}
        onClose={() => setEditRule(null)}
        title={`Configure XP Rule: ${editRule?.ruleKey}`}
        description="Changes increment the rule version and do not rewrite past transactions"
      >
        <form onSubmit={handleSaveRule} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-brand-text mb-1">Rule Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-brand-border bg-[#FBFBFE] text-brand-text"
            />
          </div>

          <div>
            <label className="block font-bold text-brand-text mb-1">Description</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-brand-border bg-[#FBFBFE] text-brand-text"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-brand-text mb-1">Base Award Amount (XP)</label>
              <input
                type="number"
                required
                min={5}
                max={500}
                value={basePoints}
                onChange={(e) => setBasePoints(parseInt(e.target.value) || 0)}
                className="w-full p-2 rounded-xl border border-brand-border bg-[#FBFBFE] text-brand-text font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-brand-text mb-1">Rule Active State</label>
              <select
                value={isActive ? 'true' : 'false'}
                onChange={(e) => setIsActive(e.target.value === 'true')}
                className="w-full p-2 rounded-xl border border-brand-border bg-[#FBFBFE] text-brand-text"
              >
                <option value="true">Active (Qualifies for events)</option>
                <option value="false">Inactive (Suspended)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setEditRule(null)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={saving}>
              Save & Increment Version
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};
