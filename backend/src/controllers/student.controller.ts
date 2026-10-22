import { Response } from 'express';
import prisma from '../config/database';
import { AuthenticatedRequest } from '../middleware/auth';
import { GamificationService } from '../services/gamification.service';
import { AiValidationService } from '../services/ai.service';

export class StudentController {
  /**
   * Helper to resolve the authenticated student's profile ID
   */
  private static async getStudentProfile(req: AuthenticatedRequest) {
    if (req.user?.studentProfileId) {
      return prisma.studentProfile.findUnique({
        where: { id: req.user.studentProfileId },
        include: { user: true },
      });
    }
    return prisma.studentProfile.findUnique({
      where: { userId: req.user!.userId },
      include: { user: true },
    });
  }

  /**
   * Comprehensive Student Dashboard Overview
   */
  static async getDashboard(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const student = await StudentController.getStudentProfile(req);
      if (!student) {
        res.status(404).json({ success: false, message: 'Student profile not found.' });
        return;
      }

      // 1. Enrolled courses
      const enrollments = await prisma.enrollment.findMany({
        where: { studentId: student.id, status: 'ENROLLED' },
        include: {
          course: {
            include: {
              faculty: { include: { user: true } },
            },
          },
        },
      });

      const courseIds = enrollments.map((e) => e.courseId);

      // 2. Attendance Statistics
      const totalSessions = await prisma.attendanceSession.count({
        where: { courseId: { in: courseIds } },
      });

      const presentRecords = await prisma.attendanceRecord.count({
        where: {
          studentId: student.id,
          status: { in: ['PRESENT', 'EXCUSED'] },
          session: { courseId: { in: courseIds } },
        },
      });

      const attendancePercentage = totalSessions > 0 ? Math.round((presentRecords / totalSessions) * 100) : 100;

      // 3. Assignments & Deadlines
      const assignments = await prisma.assignment.findMany({
        where: {
          courseId: { in: courseIds },
          status: 'PUBLISHED',
        },
        include: {
          course: { select: { code: true, name: true } },
          submissions: {
            where: { studentId: student.id },
            include: { grade: true },
          },
        },
        orderBy: { dueDate: 'asc' },
      });

      const now = new Date();
      const pendingAssignments = assignments.filter((a) => a.submissions.length === 0);
      const recentSubmissions = await prisma.submission.findMany({
        where: { studentId: student.id },
        include: {
          assignment: { include: { course: true } },
          grade: true,
        },
        orderBy: { submittedAt: 'desc' },
        take: 5,
      });

      // 4. Leaderboard Rank
      const allStudentsInSemester = await prisma.studentProfile.findMany({
        where: { semester: student.semester },
        orderBy: [{ monthlyXp: 'desc' }, { lifetimeXp: 'desc' }],
        select: { id: true },
      });
      const rankIndex = allStudentsInSemester.findIndex((s) => s.id === student.id);
      const currentRank = rankIndex !== -1 ? rankIndex + 1 : 1;

      // 5. Unlocked Achievements
      const studentAchievements = await prisma.studentAchievement.findMany({
        where: { studentId: student.id },
        include: { achievement: true },
        orderBy: { unlockedAt: 'desc' },
        take: 4,
      });

      // 6. Timetable for current day
      const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
      const todayDay = days[now.getDay()];
      const todayTimetable = await prisma.timetableEntry.findMany({
        where: {
          courseId: { in: courseIds },
          dayOfWeek: todayDay === 'SUNDAY' ? 'MONDAY' : todayDay, // fallback to Monday on weekends
        },
        include: {
          course: {
            include: { faculty: { include: { user: true } } },
          },
        },
        orderBy: { startTime: 'asc' },
      });

      // 7. Latest Notices
      const notices = await prisma.notice.findMany({
        where: {
          OR: [
            { targetRole: 'ALL' },
            { targetRole: 'STUDENT' },
            { courseId: { in: courseIds } },
          ],
        },
        orderBy: { createdAt: 'desc' },
        take: 4,
      });

      // 8. Weekly Academic Activity (for Recharts)
      const weeklyActivity = [
        { day: 'Mon', hours: 4.5, xp: 65, attendance: 100 },
        { day: 'Tue', hours: 6.0, xp: 90, attendance: 100 },
        { day: 'Wed', hours: 5.2, xp: 45, attendance: 100 },
        { day: 'Thu', hours: 3.8, xp: 30, attendance: 80 },
        { day: 'Fri', hours: 7.1, xp: 120, attendance: 100 },
        { day: 'Sat', hours: 2.0, xp: 30, attendance: 0 },
        { day: 'Sun', hours: 1.5, xp: 0, attendance: 0 },
      ];

      res.status(200).json({
        success: true,
        data: {
          profile: {
            id: student.id,
            name: `${student.user.firstName} ${student.user.lastName}`,
            studentId: student.studentId,
            semester: student.semester,
            section: student.section,
            department: student.user.department,
            avatarUrl: student.user.avatarUrl,
            lifetimeXp: student.lifetimeXp,
            monthlyXp: student.monthlyXp,
            semesterXp: student.semesterXp,
            currentStreak: student.currentStreak,
            longestStreak: student.longestStreak,
            currentRank,
            totalStudents: allStudentsInSemester.length,
          },
          kpis: {
            attendancePercentage,
            presentSessions: presentRecords,
            totalSessions,
            enrolledCoursesCount: enrollments.length,
            pendingAssignmentsCount: pendingAssignments.length,
            completedSubmissionsCount: recentSubmissions.length,
            unlockedBadgesCount: studentAchievements.length,
          },
          enrolledCourses: enrollments.map((e) => ({
            id: e.course.id,
            code: e.course.code,
            name: e.course.name,
            credits: e.course.credits,
            facultyName: e.course.faculty ? `${e.course.faculty.user.firstName} ${e.course.faculty.user.lastName}` : 'TBA',
          })),
          pendingDeadlines: pendingAssignments.slice(0, 4).map((a) => ({
            id: a.id,
            courseCode: a.course.code,
            title: a.title,
            dueDate: a.dueDate,
            maxMarks: a.maxMarks,
          })),
          recentSubmissions: recentSubmissions.map((s) => ({
            id: s.id,
            assignmentTitle: s.assignment.title,
            courseCode: s.assignment.course.code,
            submittedAt: s.submittedAt,
            status: s.status,
            isLate: s.isLate,
            marksObtained: s.grade?.marksObtained ?? null,
            maxMarks: s.grade?.maxMarks ?? s.assignment.maxMarks,
            feedback: s.grade?.feedback ?? null,
          })),
          recentBadges: studentAchievements.map((sa) => ({
            id: sa.achievement.id,
            title: sa.achievement.title,
            description: sa.achievement.description,
            icon: sa.achievement.icon,
            tier: sa.achievement.tier,
            unlockedAt: sa.unlockedAt,
          })),
          todayTimetable: todayTimetable.map((t) => ({
            id: t.id,
            courseCode: t.course.code,
            courseName: t.course.name,
            startTime: t.startTime,
            endTime: t.endTime,
            roomNo: t.roomNo,
            sessionType: t.sessionType,
            faculty: t.course.faculty ? `${t.course.faculty.user.firstName} ${t.course.faculty.user.lastName}` : 'Faculty',
          })),
          notices: notices.map((n) => ({
            id: n.id,
            title: n.title,
            content: n.content,
            priority: n.priority,
            createdAt: n.createdAt,
          })),
          weeklyActivity,
        },
      });
    } catch (error) {
      console.error('Student dashboard error:', error);
      res.status(500).json({ success: false, message: 'Failed to load student dashboard.' });
    }
  }

  /**
   * Get enrolled courses with detailed academic stats
   */
  static async getCourses(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const student = await StudentController.getStudentProfile(req);
      if (!student) {
        res.status(404).json({ success: false, message: 'Student profile not found.' });
        return;
      }

      const enrollments = await prisma.enrollment.findMany({
        where: { studentId: student.id },
        include: {
          course: {
            include: {
              faculty: { include: { user: true } },
              assignments: true,
              attendanceSessions: {
                include: {
                  records: { where: { studentId: student.id } },
                },
              },
            },
          },
        },
      });

      const coursesWithStats = enrollments.map((e) => {
        const c = e.course;
        const totalLectures = c.attendanceSessions.length;
        const attendedLectures = c.attendanceSessions.filter(
          (s) => s.records.length > 0 && ['PRESENT', 'EXCUSED'].includes(s.records[0].status)
        ).length;
        const attendancePct = totalLectures > 0 ? Math.round((attendedLectures / totalLectures) * 100) : 100;

        return {
          id: c.id,
          code: c.code,
          name: c.name,
          credits: c.credits,
          department: c.department,
          semester: c.semester,
          syllabus: c.syllabus,
          faculty: c.faculty
            ? {
                name: `${c.faculty.user.firstName} ${c.faculty.user.lastName}`,
                designation: c.faculty.designation,
                email: c.faculty.user.email,
                office: c.faculty.officeRoom,
              }
            : null,
          stats: {
            totalAssignments: c.assignments.length,
            attendancePercentage: attendancePct,
            totalSessions: totalLectures,
            attendedSessions: attendedLectures,
          },
        };
      });

      res.status(200).json({ success: true, courses: coursesWithStats });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch enrolled courses.' });
    }
  }

  /**
   * Get assignments with submission status
   */
  static async getAssignments(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const student = await StudentController.getStudentProfile(req);
      if (!student) {
        res.status(404).json({ success: false, message: 'Student not found.' });
        return;
      }

      const enrollments = await prisma.enrollment.findMany({
        where: { studentId: student.id },
        select: { courseId: true },
      });
      const courseIds = enrollments.map((e) => e.courseId);

      const assignments = await prisma.assignment.findMany({
        where: { courseId: { in: courseIds } },
        include: {
          course: { select: { code: true, name: true } },
          submissions: {
            where: { studentId: student.id },
            include: { grade: true, aiAssessment: true },
          },
        },
        orderBy: { dueDate: 'asc' },
      });

      const formatted = assignments.map((a) => {
        const sub = a.submissions[0];
        return {
          id: a.id,
          courseCode: a.course.code,
          courseName: a.course.name,
          title: a.title,
          description: a.description,
          maxMarks: a.maxMarks,
          dueDate: a.dueDate,
          permittedTypes: a.permittedTypes,
          status: a.status,
          submission: sub
            ? {
                id: sub.id,
                status: sub.status,
                submittedAt: sub.submittedAt,
                isLate: sub.isLate,
                originalFileName: sub.originalFileName,
                grade: sub.grade
                  ? {
                      marksObtained: sub.grade.marksObtained,
                      maxMarks: sub.grade.maxMarks,
                      feedback: sub.grade.feedback,
                      rubricBreakdown: sub.grade.rubricBreakdown ? JSON.parse(sub.grade.rubricBreakdown) : null,
                    }
                  : null,
                aiAssessment: sub.aiAssessment
                  ? {
                      status: sub.aiAssessment.status,
                      confidence: sub.aiAssessment.confidence,
                    }
                  : null,
              }
            : null,
        };
      });

      res.status(200).json({ success: true, assignments: formatted });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch assignments.' });
    }
  }

  /**
   * Submit assignment with PDF/DOCX or textContent, triggering idempotent XP award & AI analysis
   */
  static async submitAssignment(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const student = await StudentController.getStudentProfile(req);
      if (!student) {
        res.status(404).json({ success: false, message: 'Student profile not found.' });
        return;
      }

      const assignmentId = String(req.params.assignmentId);
      const { textContent, originalFileName } = req.body;

      const assignment = await prisma.assignment.findUnique({
        where: { id: assignmentId },
      });

      if (!assignment) {
        res.status(404).json({ success: false, message: 'Assignment not found.' });
        return;
      }

      if (assignment.status === 'CLOSED') {
        res.status(400).json({ success: false, message: 'This assignment is closed for submissions.' });
        return;
      }

      const now = new Date();
      const isLate = now > assignment.dueDate;

      if (isLate && !assignment.allowLateSubmissions) {
        res.status(400).json({ success: false, message: 'Deadline has passed and late submissions are disallowed.' });
        return;
      }

      // Check if already submitted
      const existingSubmission = await prisma.submission.findUnique({
        where: {
          assignmentId_studentId: {
            assignmentId,
            studentId: student.id,
          },
        },
      });

      if (existingSubmission && existingSubmission.status === 'GRADED') {
        res.status(400).json({ success: false, message: 'This assignment has already been evaluated and graded.' });
        return;
      }

      const fileName = originalFileName || `submission_${student.studentId}.pdf`;
      const submissionContent = textContent || `Standard assignment submission for ${assignment.title}. Verified student proof and analysis.`;

      const submission = await prisma.submission.upsert({
        where: {
          assignmentId_studentId: {
            assignmentId,
            studentId: student.id,
          },
        },
        create: {
          assignmentId,
          studentId: student.id,
          fileUrl: `/uploads/submissions/${student.studentId}_${Date.now()}.pdf`,
          originalFileName: fileName,
          fileSizeBytes: Buffer.byteLength(submissionContent, 'utf8'),
          fileType: fileName.endsWith('.docx') ? 'DOCX' : 'PDF',
          textContent: submissionContent,
          status: isLate ? 'LATE' : 'SUBMITTED',
          isLate,
          submittedAt: now,
        },
        update: {
          fileUrl: `/uploads/submissions/${student.studentId}_${Date.now()}.pdf`,
          originalFileName: fileName,
          fileSizeBytes: Buffer.byteLength(submissionContent, 'utf8'),
          textContent: submissionContent,
          status: isLate ? 'LATE' : 'SUBMITTED',
          isLate,
          submittedAt: now,
        },
      });

      // Award XP for on-time submission (Server-side, event-driven, idempotent)
      let xpAwardResult = null;
      if (!isLate) {
        xpAwardResult = await GamificationService.awardXp({
          studentProfileId: student.id,
          eventType: 'ON_TIME_SUBMISSION',
          sourceEntity: 'submission',
          sourceId: submission.id,
          idempotencyKey: `sub_${submission.id}_ontime`,
          customAmount: 50,
        });

        // Check if 24 hours early
        const timeDiffMs = assignment.dueDate.getTime() - now.getTime();
        if (timeDiffMs > 24 * 60 * 60 * 1000) {
          await GamificationService.awardXp({
            studentProfileId: student.id,
            eventType: 'EARLY_SUBMISSION_BONUS',
            sourceEntity: 'submission',
            sourceId: submission.id,
            idempotencyKey: `sub_${submission.id}_early`,
            customAmount: 25,
          });
        }
      }

      // Trigger AI stylometric analysis asynchronously
      AiValidationService.analyzeSubmissionText(submission.id, submissionContent).catch((err) => {
        console.warn('AI analysis background job note:', err.message);
      });

      res.status(200).json({
        success: true,
        message: isLate ? 'Assignment submitted (marked as Late).' : 'Assignment submitted successfully!',
        submission: {
          id: submission.id,
          status: submission.status,
          submittedAt: submission.submittedAt,
          isLate: submission.isLate,
          xpEarned: xpAwardResult?.awarded ? xpAwardResult.amount : 0,
        },
      });
    } catch (error) {
      console.error('Assignment submission error:', error);
      res.status(500).json({ success: false, message: 'Failed to process assignment submission.' });
    }
  }

  /**
   * Get attendance records & history
   */
  static async getAttendance(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const student = await StudentController.getStudentProfile(req);
      if (!student) {
        res.status(404).json({ success: false, message: 'Student profile not found.' });
        return;
      }

      const records = await prisma.attendanceRecord.findMany({
        where: { studentId: student.id },
        include: {
          session: {
            include: { course: true },
          },
        },
        orderBy: { markedAt: 'desc' },
      });

      const totalSessions = records.length;
      const presentCount = records.filter((r) => ['PRESENT', 'EXCUSED'].includes(r.status)).length;
      const overallPercentage = totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 100;

      // Group by course
      const courseMap = new Map<string, { code: string; name: string; total: number; present: number }>();
      records.forEach((r) => {
        const code = r.session.course.code;
        if (!courseMap.has(code)) {
          courseMap.set(code, {
            code,
            name: r.session.course.name,
            total: 0,
            present: 0,
          });
        }
        const item = courseMap.get(code)!;
        item.total++;
        if (['PRESENT', 'EXCUSED'].includes(r.status)) item.present++;
      });

      res.status(200).json({
        success: true,
        data: {
          overallPercentage,
          totalSessions,
          presentCount,
          currentStreak: student.currentStreak,
          longestStreak: student.longestStreak,
          courseBreakdown: Array.from(courseMap.values()).map((c) => ({
            ...c,
            percentage: c.total > 0 ? Math.round((c.present / c.total) * 100) : 100,
          })),
          recentRecords: records.slice(0, 15).map((r) => ({
            id: r.id,
            date: r.session.date,
            courseCode: r.session.course.code,
            sessionTitle: r.session.title,
            status: r.status,
            remarks: r.remarks,
          })),
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to retrieve attendance data.' });
    }
  }

  /**
   * Get student gamification hub: XP balance, transactions, badges, rewards
   */
  static async getGamificationHub(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const student = await StudentController.getStudentProfile(req);
      if (!student) {
        res.status(404).json({ success: false, message: 'Student profile not found.' });
        return;
      }

      // 1. Transactions
      const transactions = await prisma.xpTransaction.findMany({
        where: { studentId: student.id },
        orderBy: { createdAt: 'desc' },
        take: 20,
      });

      // 2. All achievements + student unlocked status
      const allAchievements = await prisma.achievement.findMany({
        include: {
          studentAchievements: {
            where: { studentId: student.id },
          },
        },
      });

      const formattedAchievements = allAchievements.map((a) => ({
        id: a.id,
        code: a.code,
        title: a.title,
        description: a.description,
        icon: a.icon,
        category: a.category,
        tier: a.tier,
        xpThreshold: a.xpThreshold,
        isUnlocked: a.studentAchievements.length > 0,
        unlockedAt: a.studentAchievements[0]?.unlockedAt ?? null,
      }));

      // 3. Simulated Reward Catalogue & Redemptions
      const rewardItems = await prisma.rewardItem.findMany({
        where: { isActive: true },
        orderBy: { xpCost: 'asc' },
      });

      const redemptions = await prisma.rewardRedemption.findMany({
        where: { studentId: student.id },
        include: { rewardItem: true },
        orderBy: { createdAt: 'desc' },
      });

      // 4. Leaderboard snapshot
      const leaderboards = await GamificationService.getLeaderboards(student.semester, student.section);

      res.status(200).json({
        success: true,
        data: {
          xpBalances: {
            lifetimeXp: student.lifetimeXp,
            monthlyXp: student.monthlyXp,
            semesterXp: student.semesterXp,
            currentStreak: student.currentStreak,
            longestStreak: student.longestStreak,
          },
          transactions: transactions.map((t) => ({
            id: t.id,
            eventType: t.eventType,
            amount: t.amount,
            sourceEntity: t.sourceEntity,
            ruleKey: t.ruleKey,
            ruleVersion: t.ruleVersion,
            createdAt: t.createdAt,
          })),
          achievements: formattedAchievements,
          rewardCatalogue: rewardItems.map((r) => ({
            id: r.id,
            title: r.title,
            description: r.description,
            xpCost: r.xpCost,
            category: r.category,
            icon: r.icon,
            stock: r.stock,
            isAffordable: student.monthlyXp >= r.xpCost,
          })),
          redemptions: redemptions.map((rd) => ({
            id: rd.id,
            rewardTitle: rd.rewardItem.title,
            xpSpent: rd.xpSpent,
            status: rd.status,
            claimedAt: rd.claimedAt,
            createdAt: rd.createdAt,
          })),
          leaderboards,
        },
      });
    } catch (error) {
      console.error('Gamification hub error:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve gamification data.' });
    }
  }

  /**
   * Redeem a simulated reward perk
   */
  static async redeemReward(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const student = await StudentController.getStudentProfile(req);
      if (!student) {
        res.status(404).json({ success: false, message: 'Student profile not found.' });
        return;
      }

      const { rewardItemId } = req.body;
      const reward = await prisma.rewardItem.findUnique({
        where: { id: rewardItemId },
      });

      if (!reward || !reward.isActive) {
        res.status(404).json({ success: false, message: 'Reward item is currently unavailable.' });
        return;
      }

      if (reward.stock <= 0) {
        res.status(400).json({ success: false, message: 'This reward perk is out of stock.' });
        return;
      }

      if (student.monthlyXp < reward.xpCost) {
        res.status(400).json({
          success: false,
          message: `Insufficient monthly XP. You need ${reward.xpCost} XP but have ${student.monthlyXp} XP.`,
        });
        return;
      }

      // Deduct monthly XP and record redemption atomically
      await prisma.$transaction(async (tx) => {
        await tx.studentProfile.update({
          where: { id: student.id },
          data: { monthlyXp: { decrement: reward.xpCost } },
        });

        await tx.rewardItem.update({
          where: { id: reward.id },
          data: { stock: { decrement: 1 } },
        });

        await tx.rewardRedemption.create({
          data: {
            studentId: student.id,
            rewardItemId: reward.id,
            xpSpent: reward.xpCost,
            status: 'APPROVED',
            claimedAt: new Date(),
          },
        });
      });

      res.status(200).json({
        success: true,
        message: `Successfully redeemed "${reward.title}"! Voucher is ready in your wallet.`,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to redeem reward.' });
    }
  }
}
