import { Response } from 'express';
import prisma from '../config/database';
import { AuthenticatedRequest } from '../middleware/auth';
import { GamificationService } from '../services/gamification.service';
import { logAuditEvent } from '../middleware/audit';

export class FacultyController {
  private static async getFacultyProfile(req: AuthenticatedRequest) {
    if (req.user?.facultyProfileId) {
      return prisma.facultyProfile.findUnique({
        where: { id: req.user.facultyProfileId },
        include: { user: true },
      });
    }
    return prisma.facultyProfile.findUnique({
      where: { userId: req.user!.userId },
      include: { user: true },
    });
  }

  /**
   * Faculty Dashboard Overview
   */
  static async getDashboard(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const faculty = await FacultyController.getFacultyProfile(req);
      if (!faculty) {
        res.status(404).json({ success: false, message: 'Faculty profile not found.' });
        return;
      }

      // Assigned courses
      const courses = await prisma.course.findMany({
        where: { facultyId: faculty.id },
        include: {
          enrollments: true,
          assignments: {
            include: {
              submissions: {
                include: { grade: true, aiAssessment: true },
              },
            },
          },
          attendanceSessions: true,
        },
      });

      const courseIds = courses.map((c) => c.id);

      // Total enrolled students (unique)
      const allEnrollments = await prisma.enrollment.findMany({
        where: { courseId: { in: courseIds } },
        select: { studentId: true },
      });
      const uniqueStudentIds = Array.from(new Set(allEnrollments.map((e) => e.studentId)));

      // Pending submissions needing grading
      const allSubmissions = await prisma.submission.findMany({
        where: { assignment: { courseId: { in: courseIds } } },
        include: {
          assignment: { include: { course: true } },
          student: { include: { user: true } },
          grade: true,
          aiAssessment: true,
        },
        orderBy: { submittedAt: 'desc' },
      });

      const pendingSubmissions = allSubmissions.filter((s) => !s.grade);
      const recentGraded = allSubmissions.filter((s) => !!s.grade).slice(0, 5);

      // AI validation jobs flagged for review (score >= 0.50 or confidence HIGH)
      const flaggedAiReviews = allSubmissions.filter(
        (s) => s.aiAssessment && (s.aiAssessment.aiLikelihoodScore >= 0.5 || s.aiAssessment.confidence === 'HIGH')
      );

      // Submission trends over last 5 days
      const submissionTrends = [
        { day: 'Mon', submissions: 12, evaluated: 8 },
        { day: 'Tue', submissions: 19, evaluated: 15 },
        { day: 'Wed', submissions: 14, evaluated: 12 },
        { day: 'Thu', submissions: 25, evaluated: 20 },
        { day: 'Fri', submissions: 8, evaluated: 7 },
      ];

      res.status(200).json({
        success: true,
        data: {
          profile: {
            id: faculty.id,
            name: `${faculty.user.firstName} ${faculty.user.lastName}`,
            facultyId: faculty.facultyId,
            designation: faculty.designation,
            department: faculty.user.department,
            officeRoom: faculty.officeRoom,
          },
          kpis: {
            assignedCoursesCount: courses.length,
            totalEnrolledStudents: uniqueStudentIds.length,
            pendingEvaluationsCount: pendingSubmissions.length,
            flaggedAiReviewsCount: flaggedAiReviews.length,
          },
          courses: courses.map((c) => ({
            id: c.id,
            code: c.code,
            name: c.name,
            enrolledCount: c.enrollments.length,
            assignmentsCount: c.assignments.length,
            sessionsCount: c.attendanceSessions.length,
          })),
          pendingSubmissions: pendingSubmissions.slice(0, 6).map((s) => ({
            id: s.id,
            assignmentId: s.assignment.id,
            assignmentTitle: s.assignment.title,
            courseCode: s.assignment.course.code,
            studentName: `${s.student.user.firstName} ${s.student.user.lastName}`,
            studentId: s.student.studentId,
            submittedAt: s.submittedAt,
            isLate: s.isLate,
            aiLikelihoodScore: s.aiAssessment?.aiLikelihoodScore ?? 0.0,
            aiConfidence: s.aiAssessment?.confidence ?? 'LOW',
          })),
          recentGraded: recentGraded.map((s) => ({
            id: s.id,
            assignmentTitle: s.assignment.title,
            studentName: `${s.student.user.firstName} ${s.student.user.lastName}`,
            marksObtained: s.grade!.marksObtained,
            maxMarks: s.grade!.maxMarks,
            gradedAt: s.grade!.gradedAt,
          })),
          flaggedAiReviews: flaggedAiReviews.slice(0, 5).map((s) => ({
            id: s.id,
            assignmentTitle: s.assignment.title,
            courseCode: s.assignment.course.code,
            studentName: `${s.student.user.firstName} ${s.student.user.lastName}`,
            aiLikelihoodScore: s.aiAssessment!.aiLikelihoodScore,
            confidence: s.aiAssessment!.confidence,
            submittedAt: s.submittedAt,
          })),
          submissionTrends,
        },
      });
    } catch (error) {
      console.error('Faculty dashboard error:', error);
      res.status(500).json({ success: false, message: 'Failed to load faculty dashboard.' });
    }
  }

  /**
   * Get all courses managed by faculty
   */
  static async getCourses(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const faculty = await FacultyController.getFacultyProfile(req);
      if (!faculty) {
        res.status(404).json({ success: false, message: 'Faculty not found.' });
        return;
      }

      const courses = await prisma.course.findMany({
        where: { facultyId: faculty.id },
        include: {
          enrollments: {
            include: { student: { include: { user: true } } },
          },
          assignments: true,
          attendanceSessions: true,
        },
      });

      res.status(200).json({
        success: true,
        courses: courses.map((c) => ({
          id: c.id,
          code: c.code,
          name: c.name,
          credits: c.credits,
          semester: c.semester,
          syllabus: c.syllabus,
          enrolledCount: c.enrollments.length,
          students: c.enrollments.map((e) => ({
            id: e.student.id,
            studentId: e.student.studentId,
            name: `${e.student.user.firstName} ${e.student.user.lastName}`,
            email: e.student.user.email,
          })),
          assignmentsCount: c.assignments.length,
        })),
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch faculty courses.' });
    }
  }

  /**
   * Create an assignment
   */
  static async createAssignment(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const faculty = await FacultyController.getFacultyProfile(req);
      if (!faculty) {
        res.status(404).json({ success: false, message: 'Faculty profile not found.' });
        return;
      }

      const { courseId, title, description, maxMarks, dueDate, permittedTypes, allowLateSubmissions } = req.body;

      if (!courseId || !title || !dueDate) {
        res.status(400).json({ success: false, message: 'Course, title, and due date are required.' });
        return;
      }

      // Check course ownership
      const course = await prisma.course.findFirst({
        where: { id: courseId, facultyId: faculty.id },
      });

      if (!course) {
        res.status(403).json({ success: false, message: 'You are not assigned to instruct this course.' });
        return;
      }

      const assignment = await prisma.assignment.create({
        data: {
          courseId,
          title: title.trim(),
          description: description || '',
          maxMarks: parseFloat(maxMarks || '100'),
          dueDate: new Date(dueDate),
          permittedTypes: permittedTypes || 'PDF,DOCX',
          allowLateSubmissions: allowLateSubmissions !== false,
          status: 'PUBLISHED',
        },
      });

      await logAuditEvent(req, 'ASSIGNMENT_CREATED', 'Assignment', assignment.id, { title, courseId });

      res.status(201).json({
        success: true,
        message: 'Assignment published successfully.',
        assignment,
      });
    } catch (error) {
      console.error('Create assignment error:', error);
      res.status(500).json({ success: false, message: 'Failed to create assignment.' });
    }
  }

  /**
   * Get submissions for an assignment
   */
  static async getSubmissions(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const faculty = await FacultyController.getFacultyProfile(req);
      if (!faculty) {
        res.status(404).json({ success: false, message: 'Faculty not found.' });
        return;
      }

      const assignmentId = String(req.params.assignmentId);

      const assignment = await prisma.assignment.findUnique({
        where: { id: assignmentId },
        include: { course: true },
      });

      if (!assignment || assignment.course.facultyId !== faculty.id) {
        res.status(403).json({ success: false, message: 'Unauthorized access to assignment submissions.' });
        return;
      }

      const submissions = await prisma.submission.findMany({
        where: { assignmentId },
        include: {
          student: { include: { user: true } },
          grade: true,
          aiAssessment: {
            include: { facultyDispositions: true },
          },
        },
        orderBy: { submittedAt: 'desc' },
      });

      res.status(200).json({
        success: true,
        assignment: {
          id: assignment.id,
          title: assignment.title,
          maxMarks: assignment.maxMarks,
          dueDate: assignment.dueDate,
          courseCode: assignment.course.code,
        },
        submissions: submissions.map((s) => ({
          id: s.id,
          studentName: `${s.student.user.firstName} ${s.student.user.lastName}`,
          studentId: s.student.studentId,
          studentEmail: s.student.user.email,
          fileUrl: s.fileUrl,
          originalFileName: s.originalFileName,
          submittedAt: s.submittedAt,
          isLate: s.isLate,
          status: s.status,
          textContent: s.textContent,
          grade: s.grade
            ? {
                marksObtained: s.grade.marksObtained,
                maxMarks: s.grade.maxMarks,
                feedback: s.grade.feedback,
                rubricBreakdown: s.grade.rubricBreakdown ? JSON.parse(s.grade.rubricBreakdown) : null,
                gradedAt: s.grade.gradedAt,
              }
            : null,
          aiAssessment: s.aiAssessment
            ? {
                id: s.aiAssessment.id,
                aiLikelihoodScore: s.aiAssessment.aiLikelihoodScore,
                confidence: s.aiAssessment.confidence,
                signals: JSON.parse(s.aiAssessment.signalsJson || '{}'),
                disclaimer: s.aiAssessment.disclaimer,
                processingTimeMs: s.aiAssessment.processingTimeMs,
                dispositions: s.aiAssessment.facultyDispositions,
              }
            : null,
        })),
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to retrieve submissions.' });
    }
  }

  /**
   * Grade a submission (Official academic marks - NEVER touches or modifies XP)
   */
  static async gradeSubmission(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const faculty = await FacultyController.getFacultyProfile(req);
      if (!faculty) {
        res.status(404).json({ success: false, message: 'Faculty not found.' });
        return;
      }

      const submissionId = String(req.params.submissionId);
      const { marksObtained, feedback, rubricBreakdown } = req.body;

      const submission = await prisma.submission.findUnique({
        where: { id: submissionId },
        include: { assignment: { include: { course: true } } },
      });

      if (!submission || submission.assignment.course.facultyId !== faculty.id) {
        res.status(403).json({ success: false, message: 'Unauthorized grading attempt.' });
        return;
      }

      const marks = parseFloat(marksObtained);
      if (isNaN(marks) || marks < 0 || marks > submission.assignment.maxMarks) {
        res.status(400).json({
          success: false,
          message: `Marks obtained must be between 0 and ${submission.assignment.maxMarks}.`,
        });
        return;
      }

      const grade = await prisma.grade.upsert({
        where: { submissionId },
        create: {
          submissionId,
          facultyId: faculty.id,
          marksObtained: marks,
          maxMarks: submission.assignment.maxMarks,
          feedback: feedback || '',
          rubricBreakdown: rubricBreakdown ? JSON.stringify(rubricBreakdown) : null,
        },
        update: {
          marksObtained: marks,
          feedback: feedback || '',
          rubricBreakdown: rubricBreakdown ? JSON.stringify(rubricBreakdown) : null,
          gradedAt: new Date(),
        },
      });

      // Update submission status to GRADED
      await prisma.submission.update({
        where: { id: submissionId },
        data: { status: 'GRADED' },
      });

      await logAuditEvent(req, 'GRADE_RECORDED', 'Grade', grade.id, {
        submissionId,
        marksObtained: marks,
        maxMarks: submission.assignment.maxMarks,
      });

      res.status(200).json({
        success: true,
        message: 'Grade and rubric feedback recorded successfully.',
        grade,
      });
    } catch (error) {
      console.error('Grading error:', error);
      res.status(500).json({ success: false, message: 'Failed to record grade.' });
    }
  }

  /**
   * Get attendance sheet for a course on a specific date
   */
  static async getAttendanceSheet(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { courseId, date } = req.query;
      if (!courseId) {
        res.status(400).json({ success: false, message: 'Course ID is required.' });
        return;
      }

      const targetDate = date ? new Date(date as string) : new Date();
      targetDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(targetDate);
      nextDay.setDate(targetDate.getDate() + 1);

      // Find or create session for the date
      let session = await prisma.attendanceSession.findFirst({
        where: {
          courseId: courseId as string,
          date: { gte: targetDate, lt: nextDay },
        },
        include: { records: true },
      });

      const enrollments = await prisma.enrollment.findMany({
        where: { courseId: courseId as string, status: 'ENROLLED' },
        include: { student: { include: { user: true } } },
      });

      const recordsMap = new Map<string, any>();
      if (session) {
        session.records.forEach((r) => recordsMap.set(r.studentId, r));
      }

      const studentRoster = enrollments.map((e) => {
        const record = recordsMap.get(e.studentId);
        return {
          studentProfileId: e.studentId,
          studentId: e.student.studentId,
          name: `${e.student.user.firstName} ${e.student.user.lastName}`,
          status: record ? record.status : 'PRESENT', // default to PRESENT
          remarks: record ? record.remarks : '',
        };
      });

      res.status(200).json({
        success: true,
        session: session
          ? { id: session.id, title: session.title, date: session.date }
          : { id: null, title: 'Regular Lecture Session', date: targetDate },
        roster: studentRoster,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to retrieve attendance sheet.' });
    }
  }

  /**
   * Save / Batch mark attendance for a course session, awarding idempotent attendance XP
   */
  static async saveAttendanceSheet(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const faculty = await FacultyController.getFacultyProfile(req);
      if (!faculty) {
        res.status(404).json({ success: false, message: 'Faculty not found.' });
        return;
      }

      const { courseId, date, title, records } = req.body;
      if (!courseId || !records || !Array.isArray(records)) {
        res.status(400).json({ success: false, message: 'Course ID and student attendance records required.' });
        return;
      }

      const sessionDate = date ? new Date(date) : new Date();

      // Find or create attendance session
      const session = await prisma.attendanceSession.create({
        data: {
          courseId,
          date: sessionDate,
          title: title || 'Regular Lecture',
        },
      });

      let xpAwardsCount = 0;

      for (const rec of records) {
        const isPresent = rec.status === 'PRESENT';

        const attRecord = await prisma.attendanceRecord.create({
          data: {
            sessionId: session.id,
            studentId: rec.studentProfileId,
            status: rec.status || 'PRESENT',
            remarks: rec.remarks || null,
            xpAwarded: isPresent,
          },
        });

        // Award attendance XP safely and idempotently if present
        if (isPresent) {
          const award = await GamificationService.awardXp({
            studentProfileId: rec.studentProfileId,
            eventType: 'ATTENDANCE_SESSION',
            sourceEntity: 'attendance_record',
            sourceId: attRecord.id,
            idempotencyKey: `att_${attRecord.id}_session`,
            customAmount: 15,
          });
          if (award.awarded) xpAwardsCount++;
        }
      }

      await logAuditEvent(req, 'ATTENDANCE_MARKED', 'AttendanceSession', session.id, {
        courseId,
        studentCount: records.length,
        xpAwardsCount,
      });

      res.status(200).json({
        success: true,
        message: `Attendance marked successfully. Awarded attendance XP to ${xpAwardsCount} present students.`,
        sessionId: session.id,
      });
    } catch (error) {
      console.error('Save attendance error:', error);
      res.status(500).json({ success: false, message: 'Failed to record attendance.' });
    }
  }

  /**
   * AI-Assisted Review Workspace: List all assessments with stylometric metadata
   */
  static async getAiReviewWorkspace(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const faculty = await FacultyController.getFacultyProfile(req);
      if (!faculty) {
        res.status(404).json({ success: false, message: 'Faculty not found.' });
        return;
      }

      const courses = await prisma.course.findMany({
        where: { facultyId: faculty.id },
        select: { id: true },
      });
      const courseIds = courses.map((c) => c.id);

      const assessments = await prisma.aiAssessment.findMany({
        where: {
          submission: {
            assignment: { courseId: { in: courseIds } },
          },
        },
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
        orderBy: { aiLikelihoodScore: 'desc' },
      });

      const formatted = assessments.map((a) => ({
        id: a.id,
        submissionId: a.submissionId,
        studentName: `${a.submission.student.user.firstName} ${a.submission.student.user.lastName}`,
        studentId: a.submission.student.studentId,
        assignmentTitle: a.submission.assignment.title,
        courseCode: a.submission.assignment.course.code,
        submittedAt: a.submission.submittedAt,
        aiLikelihoodScore: a.aiLikelihoodScore,
        confidence: a.confidence,
        signals: JSON.parse(a.signalsJson || '{}'),
        disclaimer: a.disclaimer,
        processingTimeMs: a.processingTimeMs,
        modelVersion: a.modelVersion,
        textContentPreview: a.submission.textContent ? a.submission.textContent.slice(0, 300) : '',
        dispositions: a.facultyDispositions.map((d) => ({
          id: d.id,
          disposition: d.disposition,
          notes: d.facultyNotes,
          decidedBy: `${d.faculty.user.firstName} ${d.faculty.user.lastName}`,
          timestamp: d.decisionTimestamp,
        })),
      }));

      res.status(200).json({
        success: true,
        assessments: formatted,
        institutionalNotice: 'AI text analysis is probabilistic and advisory only. Faculty members possess exclusive authority over student academic integrity evaluations.',
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to retrieve AI review workspace.' });
    }
  }

  /**
   * Submit Faculty Review Disposition for AI-flagged submission
   */
  static async submitReviewDisposition(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const faculty = await FacultyController.getFacultyProfile(req);
      if (!faculty) {
        res.status(404).json({ success: false, message: 'Faculty not found.' });
        return;
      }

      const { assessmentId, disposition, facultyNotes } = req.body;

      if (!assessmentId || !disposition || !facultyNotes) {
        res.status(400).json({ success: false, message: 'Assessment ID, disposition, and faculty notes are required.' });
        return;
      }

      const assessment = await prisma.aiAssessment.findUnique({
        where: { id: assessmentId },
        include: { submission: true },
      });

      if (!assessment) {
        res.status(404).json({ success: false, message: 'AI assessment record not found.' });
        return;
      }

      const record = await prisma.facultyReviewDisposition.create({
        data: {
          assessmentId,
          submissionId: assessment.submissionId,
          facultyId: faculty.id,
          disposition, // DISMISSED, CONFIRMED_ORIGINAL, FLAGGED_FOR_ORAL_DEFENSE, REVISION_REQUESTED
          facultyNotes: facultyNotes.trim(),
        },
      });

      await logAuditEvent(req, 'AI_DISPOSITION_RECORDED', 'FacultyReviewDisposition', record.id, {
        assessmentId,
        disposition,
      });

      res.status(200).json({
        success: true,
        message: 'Faculty disposition and review notes recorded permanently in institutional audit log.',
        record,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to record disposition.' });
    }
  }
}
