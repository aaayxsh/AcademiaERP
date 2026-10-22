import prisma from '../config/database';

export interface AwardXpParams {
  studentProfileId: string;
  eventType: string;
  sourceEntity: string;
  sourceId: string;
  idempotencyKey: string;
  customAmount?: number;
}

export class GamificationService {
  /**
   * Awards XP safely and idempotently to a student.
   * Ensures that official grades are never altered by XP.
   */
  static async awardXp(params: AwardXpParams): Promise<{ awarded: boolean; amount: number; message: string }> {
    const { studentProfileId, eventType, sourceEntity, sourceId, idempotencyKey, customAmount } = params;

    // 1. Check idempotency: Has this exact event already been rewarded?
    const existing = await prisma.xpTransaction.findUnique({
      where: { idempotencyKey },
    });

    if (existing) {
      return {
        awarded: false,
        amount: 0,
        message: 'Duplicate event: XP has already been awarded for this academic activity.',
      };
    }

    // 2. Fetch the active XP rule from DB or fallback
    let rule = await prisma.xpRule.findUnique({
      where: { ruleKey: eventType },
    });

    const amount = customAmount !== undefined ? customAmount : (rule?.basePoints || 25);
    const ruleVersion = rule?.ruleVersion || 1;

    // 3. Atomically record transaction and update student profile in a transaction
    await prisma.$transaction(async (tx) => {
      await tx.xpTransaction.create({
        data: {
          studentId: studentProfileId,
          eventType,
          sourceEntity,
          sourceId,
          amount,
          ruleKey: eventType,
          ruleVersion,
          idempotencyKey,
        },
      });

      // Update student XP balances
      const profile = await tx.studentProfile.update({
        where: { id: studentProfileId },
        data: {
          lifetimeXp: { increment: amount },
          monthlyXp: { increment: amount },
          semesterXp: { increment: amount },
          lastActivityDate: new Date(),
        },
      });

      // Check for streak updates
      await this.evaluateStreakAndMilestones(tx, profile);
    });

    return {
      awarded: true,
      amount,
      message: `Successfully awarded +${amount} XP for ${eventType}.`,
    };
  }

  /**
   * Evaluates streaks and unlocks earned achievements.
   */
  private static async evaluateStreakAndMilestones(tx: any, student: any): Promise<void> {
    const studentId = student.id;

    // 1. Check Lifetime XP milestone
    if (student.lifetimeXp >= 1000) {
      const ach = await tx.achievement.findUnique({ where: { code: 'SCHOLAR_ELITE' } });
      if (ach) {
        await tx.studentAchievement.upsert({
          where: { studentId_achievementId: { studentId, achievementId: ach.id } },
          create: { studentId, achievementId: ach.id },
          update: {},
        });
      }
    }

    // 2. Check 7-day streak
    if (student.currentStreak >= 7) {
      const ach = await tx.achievement.findUnique({ where: { code: 'STREAK_7_DAYS' } });
      if (ach) {
        await tx.studentAchievement.upsert({
          where: { studentId_achievementId: { studentId, achievementId: ach.id } },
          create: { studentId, achievementId: ach.id },
          update: {},
        });
      }
    }

    // 3. Check 14-day streak
    if (student.currentStreak >= 14) {
      const ach = await tx.achievement.findUnique({ where: { code: 'STREAK_14_DAYS' } });
      if (ach) {
        await tx.studentAchievement.upsert({
          where: { studentId_achievementId: { studentId, achievementId: ach.id } },
          create: { studentId, achievementId: ach.id },
          update: {},
        });
      }
    }
  }

  /**
   * Computes Leaderboards:
   * - Monthly Class Leaderboard
   * - Semester Course Leaderboard
   * - Most Improved Student Spotlight
   */
  static async getLeaderboards(semester: number = 6, section?: string) {
    const whereClause: any = { semester };
    if (section) whereClause.section = section;

    const students = await prisma.studentProfile.findMany({
      where: whereClause,
      include: {
        user: {
          select: { firstName: true, lastName: true, avatarUrl: true, department: true },
        },
        achievements: {
          include: { achievement: true },
        },
      },
      orderBy: [
        { monthlyXp: 'desc' },
        { lifetimeXp: 'desc' },
      ],
    });

    const monthlyLeaderboard = students.map((s, idx) => ({
      rank: idx + 1,
      studentId: s.studentId,
      name: `${s.user.firstName} ${s.user.lastName}`,
      department: s.user.department,
      semester: s.semester,
      section: s.section,
      monthlyXp: s.monthlyXp,
      lifetimeXp: s.lifetimeXp,
      currentStreak: s.currentStreak,
      badgeCount: s.achievements.length,
    }));

    // Semester leaderboard sorted by semesterXp
    const semesterSorted = [...students].sort((a, b) => b.semesterXp - a.semesterXp);
    const semesterLeaderboard = semesterSorted.map((s, idx) => ({
      rank: idx + 1,
      studentId: s.studentId,
      name: `${s.user.firstName} ${s.user.lastName}`,
      department: s.user.department,
      semesterXp: s.semesterXp,
      lifetimeXp: s.lifetimeXp,
      currentStreak: s.currentStreak,
      badgeCount: s.achievements.length,
    }));

    // Most Improved recognition: student with highest monthly XP to semester XP ratio or highest monthly activity
    const mostImproved = [...monthlyLeaderboard]
      .filter((s) => s.monthlyXp > 0)
      .sort((a, b) => (b.monthlyXp / Math.max(1, b.lifetimeXp - b.monthlyXp)) - (a.monthlyXp / Math.max(1, a.lifetimeXp - a.monthlyXp)))[0] || monthlyLeaderboard[0];

    return {
      monthlyLeaderboard,
      semesterLeaderboard,
      mostImproved,
    };
  }

  /**
   * Resets monthly XP balances for all students at the end of a monthly cycle
   * while strictly preserving lifetime XP and historical transaction records.
   */
  static async resetMonthlyCycle(): Promise<number> {
    const result = await prisma.studentProfile.updateMany({
      data: {
        monthlyXp: 0,
      },
    });
    return result.count;
  }
}
