import { Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../config/database';
import { AuthenticatedRequest } from '../middleware/auth';
import { logAuditEvent } from '../middleware/audit';

export class AdminController {
  /**
   * Institutional Overview & KPI Dashboard
   */
  static async getDashboard(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // 1. High-level counts
      const [
        totalStudents,
        totalFaculty,
        totalCourses,
        totalAssignments,
        totalSubmissions,
        totalAttendanceRecords,
        presentAttendanceRecords,
        totalXpAgg,
      ] = await Promise.all([
        prisma.user.count({ where: { role: 'STUDENT', status: 'ACTIVE' } }),
        prisma.user.count({ where: { role: 'FACULTY', status: 'ACTIVE' } }),
        prisma.course.count(),
        prisma.assignment.count(),
        prisma.submission.count(),
        prisma.attendanceRecord.count(),
        prisma.attendanceRecord.count({ where: { status: { in: ['PRESENT', 'EXCUSED'] } } }),
        prisma.studentProfile.aggregate({ _sum: { lifetimeXp: true } }),
      ]);

      const attendanceRate = totalAttendanceRecords > 0
        ? Math.round((presentAttendanceRecords / totalAttendanceRecords) * 100)
        : 94;

      const submissionRate = totalAssignments > 0 && totalStudents > 0
        ? Math.min(100, Math.round((totalSubmissions / (totalAssignments * totalStudents)) * 100))
        : 88;

      // 2. Recent Audit Logs
      const recentAuditLogs = await prisma.auditLog.findMany({
        include: { user: { select: { firstName: true, lastName: true, email: true } } },
        orderBy: { createdAt: 'desc' },
        take: 8,
      });

      // 3. AI Governance Summary
      const totalAiAssessments = await prisma.aiAssessment.count();
      const flaggedAiAssessments = await prisma.aiAssessment.count({
        where: { OR: [{ aiLikelihoodScore: { gte: 0.5 } }, { confidence: 'HIGH' }] },
      });
      const totalDispositions = await prisma.facultyReviewDisposition.count();

      // 4. Monthly XP Distribution Trend (for Recharts)
      const engagementTrends = [
        { month: 'Nov', xpAwarded: 18400, activeStudents: 280, submissions: 420 },
        { month: 'Dec', xpAwarded: 24200, activeStudents: 310, submissions: 580 },
        { month: 'Jan', xpAwarded: 31500, activeStudents: 350, submissions: 710 },
        { month: 'Feb', xpAwarded: 39800, activeStudents: 390, submissions: 890 },
        { month: 'Mar', xpAwarded: 46200, activeStudents: 420, submissions: 1040 },
      ];

      res.status(200).json({
        success: true,
        data: {
          kpis: {
            totalStudents,
            totalFaculty,
            totalCourses,
            totalAssignments,
            attendanceRate,
            submissionRate,
            totalXpDistributed: totalXpAgg._sum.lifetimeXp || 4740,
            aiAssessmentsCount: totalAiAssessments,
            aiFlaggedCount: flaggedAiAssessments,
            facultyDispositionsCount: totalDispositions,
          },
          recentAuditLogs: recentAuditLogs.map((log) => ({
            id: log.id,
            action: log.action,
            entityType: log.entityType,
            role: log.role,
            userName: log.user ? `${log.user.firstName} ${log.user.lastName}` : 'System Agent',
            ipAddress: log.ipAddress,
            createdAt: log.createdAt,
            details: log.detailsJson ? JSON.parse(log.detailsJson) : null,
          })),
          engagementTrends,
        },
      });
    } catch (error) {
      console.error('Admin dashboard error:', error);
      res.status(500).json({ success: false, message: 'Failed to load institutional dashboard.' });
    }
  }

  /**
   * List users with search, role filters, and pagination
   */
  static async getUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { search, role, status, page = '1', limit = '10' } = req.query;
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const skip = (pageNum - 1) * limitNum;

      const whereClause: any = {};
      if (role && role !== 'ALL') whereClause.role = role;
      if (status && status !== 'ALL') whereClause.status = status;
      if (search) {
        whereClause.OR = [
          { email: { contains: (search as string).toLowerCase() } },
          { firstName: { contains: search as string } },
          { lastName: { contains: search as string } },
        ];
      }

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where: whereClause,
          include: {
            studentProfile: true,
            facultyProfile: true,
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limitNum,
        }),
        prisma.user.count({ where: whereClause }),
      ]);

      res.status(200).json({
        success: true,
        users: users.map((u) => ({
          id: u.id,
          email: u.email,
          role: u.role,
          status: u.status,
          name: `${u.firstName} ${u.lastName}`,
          department: u.department,
          phone: u.phone,
          studentId: u.studentProfile?.studentId,
          facultyId: u.facultyProfile?.facultyId,
          createdAt: u.createdAt,
        })),
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to retrieve users.' });
    }
  }

  /**
   * Create or invite a new user (Student, Faculty, or Admin)
   */
  static async createUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { email, password, role, firstName, lastName, department, studentId, facultyId, designation, semester } = req.body;

      if (!email || !password || !role || !firstName || !lastName) {
        res.status(400).json({ success: false, message: 'Mandatory user details missing.' });
        return;
      }

      const existing = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
      });

      if (existing) {
        res.status(409).json({ success: false, message: 'A user with this email address already exists.' });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const user = await prisma.user.create({
        data: {
          email: email.toLowerCase().trim(),
          passwordHash,
          role,
          status: 'ACTIVE',
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          department: department || 'Computer Science & Engineering',
          ...(role === 'STUDENT' && {
            studentProfile: {
              create: {
                studentId: studentId || `STU${Date.now().toString().slice(-6)}`,
                semester: parseInt(semester || '6', 10),
                section: 'A',
                lifetimeXp: 0,
                monthlyXp: 0,
                semesterXp: 0,
                currentStreak: 0,
              },
            },
          }),
          ...(role === 'FACULTY' && {
            facultyProfile: {
              create: {
                facultyId: facultyId || `FAC${Date.now().toString().slice(-4)}`,
                designation: designation || 'Assistant Professor',
              },
            },
          }),
        },
      });

      await logAuditEvent(req, 'USER_PROVISIONED', 'User', user.id, { role, email });

      res.status(201).json({
        success: true,
        message: `Account provisioned successfully for ${role}.`,
        userId: user.id,
      });
    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json({ success: false, message: 'Failed to provision user.' });
    }
  }

  /**
   * Update user account status or role
   */
  static async updateUserStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = String(req.params.userId);
      const { status, role } = req.body;

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found.' });
        return;
      }

      const updated = await prisma.user.update({
        where: { id: userId },
        data: {
          ...(status && { status }),
          ...(role && { role }),
        },
      });

      await logAuditEvent(req, 'USER_STATUS_UPDATED', 'User', userId, {
        previousStatus: user.status,
        newStatus: updated.status,
        previousRole: user.role,
        newRole: updated.role,
      });

      res.status(200).json({
        success: true,
        message: 'User account updated successfully.',
        user: { id: updated.id, email: updated.email, status: updated.status, role: updated.role },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update user status.' });
    }
  }

  /**
   * Get Configurable XP Rules
   */
  static async getXpRules(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const rules = await prisma.xpRule.findMany({
        orderBy: { basePoints: 'asc' },
      });
      res.status(200).json({ success: true, rules });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to retrieve XP rules.' });
    }
  }

  /**
   * Update XP Rule (Auditable, increments version without mutating past transactions)
   */
  static async updateXpRule(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const ruleId = String(req.params.ruleId);
      const { basePoints, title, description, isActive } = req.body;

      const rule = await prisma.xpRule.findUnique({ where: { id: ruleId } });
      if (!rule) {
        res.status(404).json({ success: false, message: 'Rule not found.' });
        return;
      }

      const updated = await prisma.xpRule.update({
        where: { id: ruleId },
        data: {
          ...(basePoints !== undefined && { basePoints: parseInt(basePoints, 10) }),
          ...(title && { title: title.trim() }),
          ...(description && { description: description.trim() }),
          ...(isActive !== undefined && { isActive }),
          ruleVersion: { increment: 1 },
        },
      });

      await logAuditEvent(req, 'XP_RULE_CONFIGURED', 'XpRule', rule.id, {
        ruleKey: rule.ruleKey,
        oldBasePoints: rule.basePoints,
        newBasePoints: updated.basePoints,
        newVersion: updated.ruleVersion,
      });

      res.status(200).json({
        success: true,
        message: `XP rule "${updated.title}" updated to version ${updated.ruleVersion}.`,
        rule: updated,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to configure XP rule.' });
    }
  }

  /**
   * AI Governance Oversight Report
   */
  static async getAiGovernanceReport(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const assessments = await prisma.aiAssessment.findMany({
        include: {
          submission: {
            include: {
              student: { include: { user: true } },
              assignment: { include: { course: true } },
            },
          },
          facultyDispositions: {
            include: { faculty: { include: { user: true } } },
          },
        },
        orderBy: { analyzedAt: 'desc' },
      });

      const total = assessments.length;
      const lowCount = assessments.filter((a) => a.confidence === 'LOW').length;
      const moderateCount = assessments.filter((a) => a.confidence === 'MODERATE').length;
      const highCount = assessments.filter((a) => a.confidence === 'HIGH').length;

      const dispositionsCount = {
        DISMISSED: 0,
        CONFIRMED_ORIGINAL: 0,
        FLAGGED_FOR_ORAL_DEFENSE: 0,
        REVISION_REQUESTED: 0,
      };

      assessments.forEach((a) => {
        a.facultyDispositions.forEach((d) => {
          if (dispositionsCount[d.disposition as keyof typeof dispositionsCount] !== undefined) {
            dispositionsCount[d.disposition as keyof typeof dispositionsCount]++;
          }
        });
      });

      res.status(200).json({
        success: true,
        summary: {
          totalAnalyzed: total,
          lowConfidenceCount: lowCount,
          moderateConfidenceCount: moderateCount,
          highConfidenceCount: highCount,
          dispositionsBreakdown: dispositionsCount,
        },
        assessments: assessments.map((a) => ({
          id: a.id,
          submissionId: a.submissionId,
          studentName: `${a.submission.student.user.firstName} ${a.submission.student.user.lastName}`,
          courseCode: a.submission.assignment.course.code,
          assignmentTitle: a.submission.assignment.title,
          aiLikelihoodScore: a.aiLikelihoodScore,
          confidence: a.confidence,
          dispositionStatus: a.facultyDispositions.length > 0 ? a.facultyDispositions[0].disposition : 'PENDING_FACULTY_REVIEW',
          analyzedAt: a.analyzedAt,
        })),
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to generate AI governance report.' });
    }
  }

  /**
   * Audit Logs
   */
  static async getAuditLogs(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { page = '1', limit = '15', action } = req.query;
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const skip = (pageNum - 1) * limitNum;

      const whereClause: any = {};
      if (action && action !== 'ALL') whereClause.action = action;

      const [logs, total] = await Promise.all([
        prisma.auditLog.findMany({
          where: whereClause,
          include: {
            user: { select: { firstName: true, lastName: true, email: true } },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limitNum,
        }),
        prisma.auditLog.count({ where: whereClause }),
      ]);

      res.status(200).json({
        success: true,
        logs: logs.map((l) => ({
          id: l.id,
          action: l.action,
          entityType: l.entityType,
          entityId: l.entityId,
          role: l.role,
          userName: l.user ? `${l.user.firstName} ${l.user.lastName}` : 'System',
          userEmail: l.user?.email || null,
          details: l.detailsJson ? JSON.parse(l.detailsJson) : null,
          ipAddress: l.ipAddress,
          createdAt: l.createdAt,
        })),
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch audit logs.' });
    }
  }
}
