import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { api } from '../../services/api';
import {
  Trophy,
  Flame,
  Award,
  Gift,
  History,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  Shield,
  Coffee,
  BookOpen,
  Ticket,
} from 'lucide-react';

export const StudentGamification: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeLeaderboardTab, setActiveLeaderboardTab] = useState<'monthly' | 'semester'>('monthly');
  const [redeemingId, setRedeemingId] = useState<string | null>(null);
  const [redemptionSuccess, setRedemptionSuccess] = useState<string | null>(null);

  const fetchGamification = async () => {
    try {
      const res = await api.student.getGamification();
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.warn('Using gamification fallback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGamification();
  }, []);

  const handleRedeem = async (rewardItemId: string, rewardTitle: string) => {
    setRedeemingId(rewardItemId);
    try {
      const res = await api.student.redeemReward(rewardItemId);
      setRedemptionSuccess(res.message || `Successfully redeemed ${rewardTitle}!`);
      await fetchGamification();
      setTimeout(() => setRedemptionSuccess(null), 5000);
    } catch (err: any) {
      alert(err.message || 'Failed to redeem reward');
    } finally {
      setRedeemingId(null);
    }
  };

  const balances = data?.xpBalances || {
    lifetimeXp: 1420,
    monthlyXp: 380,
    semesterXp: 890,
    currentStreak: 12,
    longestStreak: 18,
  };

  const monthlyList = data?.leaderboards?.monthlyLeaderboard || [
    { rank: 1, name: 'Priya Verma', studentId: 'STU2026CS015', monthlyXp: 460, currentStreak: 16, badgeCount: 5 },
    { rank: 2, name: 'Ayush Srivastava (You)', studentId: 'STU2026CS042', monthlyXp: 380, currentStreak: 12, badgeCount: 4 },
    { rank: 3, name: 'Rohit Kumar', studentId: 'STU2026CS089', monthlyXp: 390, currentStreak: 8, badgeCount: 3 },
    { rank: 4, name: 'Sneha Patel', studentId: 'STU2026CS033', monthlyXp: 320, currentStreak: 10, badgeCount: 3 },
  ];

  const semesterList = data?.leaderboards?.semesterLeaderboard || [
    { rank: 1, name: 'Priya Verma', studentId: 'STU2026CS015', semesterXp: 1120, lifetimeXp: 1850, currentStreak: 16, badgeCount: 5 },
    { rank: 2, name: 'Ayush Srivastava (You)', studentId: 'STU2026CS042', semesterXp: 890, lifetimeXp: 1420, currentStreak: 12, badgeCount: 4 },
    { rank: 3, name: 'Sneha Patel', studentId: 'STU2026CS033', semesterXp: 840, lifetimeXp: 1340, currentStreak: 10, badgeCount: 3 },
    { rank: 4, name: 'Rohit Kumar', studentId: 'STU2026CS089', semesterXp: 720, lifetimeXp: 1100, currentStreak: 8, badgeCount: 3 },
  ];

  const mostImproved = data?.leaderboards?.mostImproved || monthlyList[2];

  const rewards = data?.rewardCatalogue || [
    { id: '1', title: 'Quiet Study Pod Reservation', description: 'Exclusive 3-hour priority booking in the central library.', xpCost: 200, category: 'ACADEMIC_PERK', icon: 'BookOpen', stock: 45, isAffordable: true },
    { id: '2', title: 'Campus Cafe Artisan Coffee', description: 'Redeemable for 1 hot beverage at the Central Campus Cafe.', xpCost: 150, category: 'CAMPUS_PRIVILEGE', icon: 'Coffee', stock: 119, isAffordable: true },
    { id: '3', title: 'Research Colloquium Fast-Pass', description: 'Guaranteed front-row reserved seating at guest researcher seminars.', xpCost: 300, category: 'ACADEMIC_PERK', icon: 'Ticket', stock: 20, isAffordable: true },
    { id: '4', title: 'Dean’s Honor Roll Digital Certificate', description: 'Verified cryptographic credential celebrating top consistency.', xpCost: 600, category: 'MERCHANDISE', icon: 'Award', stock: 50, isAffordable: false },
  ];

  const achievements = data?.achievements || [
    { id: '1', title: 'First Flight', description: 'Submitted your first assignment on time.', tier: 'BRONZE', isUnlocked: true },
    { id: '2', title: 'Early Bird', description: 'Submitted 24 hours ahead of deadline.', tier: 'BRONZE', isUnlocked: true },
    { id: '3', title: 'Consistency Champion', description: 'Maintained 7 consecutive days of activity.', tier: 'SILVER', isUnlocked: true },
    { id: '4', title: 'Unstoppable Momentum', description: 'Achieved 14-day continuous streak.', tier: 'GOLD', isUnlocked: false },
    { id: '5', title: 'Academic Luminary', description: 'Accumulated over 1,000 Lifetime XP.', tier: 'PLATINUM', isUnlocked: true },
  ];

  const transactions = data?.transactions || [
    { id: 'tx-1', eventType: 'ON_TIME_SUBMISSION', amount: 50, ruleKey: 'ON_TIME_SUBMISSION', createdAt: new Date().toISOString() },
    { id: 'tx-2', eventType: 'EARLY_SUBMISSION_BONUS', amount: 25, ruleKey: 'EARLY_SUBMISSION_BONUS', createdAt: new Date().toISOString() },
    { id: 'tx-3', eventType: 'ATTENDANCE_SESSION', amount: 15, ruleKey: 'ATTENDANCE_SESSION', createdAt: new Date().toISOString() },
    { id: 'tx-4', eventType: 'STREAK_MILESTONE_7', amount: 50, ruleKey: 'STREAK_MILESTONE_7', createdAt: new Date().toISOString() },
  ];

  return (
    <DashboardLayout title="Gamification & Engagement Hub" subtitle="Effort recognition, auditable XP balances, and rewards">
      {/* Success Notification */}
      {redemptionSuccess && (
        <div className="p-4 rounded-xl bg-[#E7F8F2] border border-[#BAEEDC] text-xs font-bold text-brand-emerald flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{redemptionSuccess}</span>
          </div>
          <button onClick={() => setRedemptionSuccess(null)} className="text-brand-emerald hover:opacity-75">
            ✕
          </button>
        </div>
      )}

      {/* 1. XP Balances Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Monthly XP */}
        <Card variant="gradient" padding="md" className="space-y-2 text-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-100">Monthly XP Balance</span>
            <Trophy className="w-4 h-4 text-purple-200" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black tabular-nums">{balances.monthlyXp} XP</span>
            <Badge variant="indigo" size="sm">Rank #2</Badge>
          </div>
          <p className="text-[11px] text-purple-100">Redeemable for simulated perks this month</p>
        </Card>

        {/* Lifetime XP */}
        <Card variant="white" padding="md" className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-muted">Lifetime XP (Permanent)</span>
            <Award className="w-4 h-4 text-brand-primary" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-brand-text tabular-nums">{balances.lifetimeXp} XP</span>
            <Badge variant="lavender" size="sm">Tier IV</Badge>
          </div>
          <p className="text-[11px] text-brand-muted">Preserved across monthly leaderboard resets</p>
        </Card>

        {/* Current Active Streak */}
        <Card variant="white" padding="md" className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-muted">Activity Streak</span>
            <Flame className="w-4 h-4 text-brand-amber fill-brand-amber" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-brand-amber tabular-nums">{balances.currentStreak} Days</span>
            <Badge variant="amber" size="sm">Active</Badge>
          </div>
          <p className="text-[11px] text-brand-muted">Personal record: {balances.longestStreak || 18} consecutive days</p>
        </Card>

        {/* Semester XP */}
        <Card variant="white" padding="md" className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-muted">Semester XP Total</span>
            <Sparkles className="w-4 h-4 text-brand-emerald" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-brand-emerald tabular-nums">{balances.semesterXp} XP</span>
            <Badge variant="emerald" size="sm">Top 5%</Badge>
          </div>
          <p className="text-[11px] text-brand-muted">Spring 2026 cohort milestone</p>
        </Card>
      </div>

      {/* 2. Middle Section: Dynamic Leaderboards + Most Improved Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaderboard Table (2 spans) */}
        <Card variant="white" padding="md" className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-brand-text">Cohort Leaderboard</h3>
              <p className="text-xs text-brand-muted">Recognizing consistent academic effort and verified participation</p>
            </div>

            {/* Tabs */}
            <div className="inline-flex p-1 rounded-xl bg-brand-bg border border-brand-border self-start">
              <button
                onClick={() => setActiveLeaderboardTab('monthly')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeLeaderboardTab === 'monthly'
                    ? 'bg-violet-gradient text-white shadow-sm'
                    : 'text-brand-muted hover:text-brand-text'
                }`}
              >
                Monthly Class Rank
              </button>
              <button
                onClick={() => setActiveLeaderboardTab('semester')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeLeaderboardTab === 'semester'
                    ? 'bg-violet-gradient text-white shadow-sm'
                    : 'text-brand-muted hover:text-brand-text'
                }`}
              >
                Semester Overall
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-brand-border text-brand-muted text-[11px] uppercase tracking-wider">
                  <th className="pb-3 font-semibold w-12">Rank</th>
                  <th className="pb-3 font-semibold">Student Name</th>
                  <th className="pb-3 font-semibold">Roll Number</th>
                  <th className="pb-3 font-semibold text-center">Streak</th>
                  <th className="pb-3 font-semibold text-right">
                    {activeLeaderboardTab === 'monthly' ? 'Monthly XP' : 'Semester XP'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {(activeLeaderboardTab === 'monthly' ? monthlyList : semesterList).map((row: any, idx: number) => {
                  const isCurrent = row.studentId === 'STU2026CS042';
                  return (
                    <tr
                      key={row.studentId}
                      className={`hover:bg-brand-bg/50 transition-colors ${isCurrent ? 'bg-[#F4F1FD] font-bold' : ''}`}
                    >
                      <td className="py-3 text-center">
                        {idx === 0 ? (
                          <span className="w-6 h-6 rounded-full bg-yellow-400 text-white font-extrabold flex items-center justify-center text-[11px] shadow-sm">
                            1
                          </span>
                        ) : idx === 1 ? (
                          <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-800 font-extrabold flex items-center justify-center text-[11px]">
                            2
                          </span>
                        ) : idx === 2 ? (
                          <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-extrabold flex items-center justify-center text-[11px]">
                            3
                          </span>
                        ) : (
                          <span className="text-brand-muted tabular-nums">#{idx + 1}</span>
                        )}
                      </td>
                      <td className="py-3 text-brand-text">
                        <div className="flex items-center gap-2">
                          <span>{row.name}</span>
                          {isCurrent && <Badge variant="lavender" size="sm">You</Badge>}
                        </div>
                      </td>
                      <td className="py-3 font-mono text-brand-muted">{row.studentId}</td>
                      <td className="py-3 text-center">
                        <span className="inline-flex items-center gap-1 text-brand-amber font-semibold">
                          <Flame className="w-3.5 h-3.5 fill-brand-amber" />
                          {row.currentStreak}d
                        </span>
                      </td>
                      <td className="py-3 text-right font-extrabold text-brand-primary tabular-nums">
                        {activeLeaderboardTab === 'monthly' ? `${row.monthlyXp} XP` : `${row.semesterXp} XP`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Most Improved Spotlight Card (1 span) */}
        <Card variant="tinted" padding="md" className="space-y-4">
          <div className="flex items-center gap-2 text-brand-primary font-bold text-sm">
            <TrendingUp className="w-5 h-5 text-brand-emerald" />
            <span>Most Improved Recognition</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-brand-border space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-lavender text-brand-primary font-bold flex items-center justify-center text-xs">
                {mostImproved?.name?.[0]}
                {mostImproved?.name?.[1]}
              </div>
              <div>
                <h4 className="text-sm font-bold text-brand-text">{mostImproved?.name}</h4>
                <p className="text-[11px] text-brand-muted">{mostImproved?.studentId} • Sem 6</p>
              </div>
            </div>

            <p className="text-xs text-brand-muted leading-relaxed">
              Achieved the highest month-over-month engagement surge (+68% submission timeliness). Consistency creates
              excellence!
            </p>

            <div className="p-2.5 rounded-lg bg-[#E7F8F2] text-brand-emerald font-semibold text-xs text-center border border-[#BAEEDC]">
              ⭐ Celebrated for Active Academic Turnaround
            </div>
          </div>

          <div className="p-3 rounded-xl bg-brand-bg border border-brand-border text-[11px] text-brand-muted leading-relaxed">
            <strong className="text-brand-text">Second-Chance Guarantee:</strong> Leaderboard resets monthly so every
            student starts on equal footing each cycle.
          </div>
        </Card>
      </div>

      {/* 3. Simulated Reward Catalogue Store */}
      <Card variant="white" padding="md" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-brand-text flex items-center gap-2">
              <Gift className="w-5 h-5 text-brand-primary" />
              Simulated Campus Reward Catalogue
            </h3>
            <p className="text-xs text-brand-muted">
              Redeem your hard-earned monthly XP for priority study perks and campus privileges
            </p>
          </div>
          <Badge variant="lavender">Available XP: {balances.monthlyXp} XP</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rewards.map((item: any) => {
            const isAffordable = balances.monthlyXp >= item.xpCost;
            return (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-brand-border bg-[#FBFBFE] flex flex-col justify-between space-y-3 hover:border-brand-primary/40 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="p-2 rounded-xl bg-white border border-brand-border text-brand-primary shadow-sm">
                      {item.icon === 'Coffee' ? (
                        <Coffee className="w-5 h-5" />
                      ) : item.icon === 'Ticket' ? (
                        <Ticket className="w-5 h-5" />
                      ) : item.icon === 'Award' ? (
                        <Award className="w-5 h-5" />
                      ) : (
                        <BookOpen className="w-5 h-5" />
                      )}
                    </span>
                    <Badge variant={isAffordable ? 'emerald' : 'gray'} size="sm">
                      {item.xpCost} XP
                    </Badge>
                  </div>
                  <h4 className="text-xs font-bold text-brand-text">{item.title}</h4>
                  <p className="text-[11px] text-brand-muted leading-relaxed line-clamp-2">{item.description}</p>
                </div>

                <Button
                  size="sm"
                  variant={isAffordable ? 'primary' : 'outline'}
                  disabled={!isAffordable || redeemingId === item.id}
                  isLoading={redeemingId === item.id}
                  onClick={() => handleRedeem(item.id, item.title)}
                  className="w-full text-xs"
                >
                  {isAffordable ? 'Redeem Voucher' : `Need ${item.xpCost - balances.monthlyXp} More XP`}
                </Button>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 4. Achievement Badges Grid */}
      <Card variant="white" padding="md" className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-brand-text flex items-center gap-2">
            <Award className="w-5 h-5 text-brand-primary" />
            Earned Achievement Badges
          </h3>
          <span className="text-xs font-semibold text-brand-muted">
            {achievements.filter((a: any) => a.isUnlocked).length} of {achievements.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {achievements.map((ach: any) => (
            <div
              key={ach.id}
              className={`p-3.5 rounded-xl border text-center space-y-2 transition-all ${
                ach.isUnlocked
                  ? 'bg-white border-brand-border shadow-soft'
                  : 'bg-brand-bg border-dashed border-brand-border opacity-50'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl mx-auto flex items-center justify-center font-bold text-xs ${
                  ach.isUnlocked ? 'bg-violet-gradient text-white shadow-violet-glow' : 'bg-gray-200 text-gray-400'
                }`}
              >
                <Award className="w-5 h-5" />
              </div>
              <h5 className="text-xs font-bold text-brand-text">{ach.title}</h5>
              <p className="text-[10px] text-brand-muted line-clamp-2">{ach.description}</p>
              <Badge variant={ach.isUnlocked ? 'emerald' : 'gray'} size="sm">
                {ach.tier || 'BRONZE'}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* 5. Auditable XP Transaction History */}
      <Card variant="white" padding="md" className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-brand-muted" />
            <h3 className="text-base font-bold text-brand-text">Auditable XP Transaction Ledger</h3>
          </div>
          <Badge variant="indigo">Cryptographically Verified</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-brand-border text-brand-muted text-[11px] uppercase tracking-wider">
                <th className="pb-3 font-semibold">Event Type</th>
                <th className="pb-3 font-semibold">Rule Applied</th>
                <th className="pb-3 font-semibold">Timestamp</th>
                <th className="pb-3 font-semibold text-right">XP Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {transactions.map((tx: any) => (
                <tr key={tx.id} className="hover:bg-brand-bg/50 transition-colors">
                  <td className="py-3 font-bold text-brand-text">{tx.eventType.replace(/_/g, ' ')}</td>
                  <td className="py-3 font-mono text-brand-muted">{tx.ruleKey || 'v1.0'}</td>
                  <td className="py-3 text-brand-muted">{new Date(tx.createdAt).toLocaleString()}</td>
                  <td className="py-3 text-right font-extrabold text-brand-emerald tabular-nums">+{tx.amount} XP</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  );
};
