export type UserRole = 'STUDENT' | 'FACULTY' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  department?: string;
  avatarUrl?: string;
  phone?: string;
  studentId?: string;
  facultyId?: string;
  semester?: number;
  section?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export interface StudentDashboardData {
  profile: {
    id: string;
    name: string;
    studentId: string;
    semester: number;
    section: string;
    department: string;
    avatarUrl?: string;
    lifetimeXp: number;
    monthlyXp: number;
    semesterXp: number;
    currentStreak: number;
    longestStreak: number;
    currentRank: number;
    totalStudents: number;
  };
  kpis: {
    attendancePercentage: number;
    presentSessions: number;
    totalSessions: number;
    enrolledCoursesCount: number;
    pendingAssignmentsCount: number;
    completedSubmissionsCount: number;
    unlockedBadgesCount: number;
  };
  enrolledCourses: Array<{
    id: string;
    code: string;
    name: string;
    credits: number;
    facultyName: string;
  }>;
  pendingDeadlines: Array<{
    id: string;
    courseCode: string;
    title: string;
    dueDate: string;
    maxMarks: number;
  }>;
  recentSubmissions: Array<{
    id: string;
    assignmentTitle: string;
    courseCode: string;
    submittedAt: string;
    status: string;
    isLate: boolean;
    marksObtained: number | null;
    maxMarks: number;
    feedback: string | null;
  }>;
  recentBadges: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    tier: string;
    unlockedAt: string;
  }>;
  todayTimetable: Array<{
    id: string;
    courseCode: string;
    courseName: string;
    startTime: string;
    endTime: string;
    roomNo: string;
    sessionType: string;
    faculty: string;
  }>;
  notices: Array<{
    id: string;
    title: string;
    content: string;
    priority: string;
    createdAt: string;
  }>;
  weeklyActivity: Array<{
    day: string;
    hours: number;
    xp: number;
    attendance: number;
  }>;
}

export interface FacultyDashboardData {
  profile: {
    id: string;
    name: string;
    facultyId: string;
    designation: string;
    department: string;
    officeRoom?: string;
  };
  kpis: {
    assignedCoursesCount: number;
    totalEnrolledStudents: number;
    pendingEvaluationsCount: number;
    flaggedAiReviewsCount: number;
  };
  courses: Array<{
    id: string;
    code: string;
    name: string;
    enrolledCount: number;
    assignmentsCount: number;
    sessionsCount: number;
  }>;
  pendingSubmissions: Array<{
    id: string;
    assignmentId: string;
    assignmentTitle: string;
    courseCode: string;
    studentName: string;
    studentId: string;
    submittedAt: string;
    isLate: boolean;
    aiLikelihoodScore: number;
    aiConfidence: string;
  }>;
  recentGraded: Array<{
    id: string;
    assignmentTitle: string;
    studentName: string;
    marksObtained: number;
    maxMarks: number;
    gradedAt: string;
  }>;
  flaggedAiReviews: Array<{
    id: string;
    assignmentTitle: string;
    courseCode: string;
    studentName: string;
    aiLikelihoodScore: number;
    confidence: string;
    submittedAt: string;
  }>;
  submissionTrends: Array<{
    day: string;
    submissions: number;
    evaluated: number;
  }>;
}

export interface AdminDashboardData {
  kpis: {
    totalStudents: number;
    totalFaculty: number;
    totalCourses: number;
    totalAssignments: number;
    attendanceRate: number;
    submissionRate: number;
    totalXpDistributed: number;
    aiAssessmentsCount: number;
    aiFlaggedCount: number;
    facultyDispositionsCount: number;
  };
  recentAuditLogs: Array<{
    id: string;
    action: string;
    entityType: string;
    role: string;
    userName: string;
    ipAddress?: string;
    createdAt: string;
    details?: any;
  }>;
  engagementTrends: Array<{
    month: string;
    xpAwarded: number;
    activeStudents: number;
    submissions: number;
  }>;
}

export interface LeaderboardEntry {
  rank: number;
  studentId: string;
  name: string;
  department?: string;
  semester?: number;
  section?: string;
  monthlyXp?: number;
  semesterXp?: number;
  lifetimeXp: number;
  currentStreak: number;
  badgeCount: number;
}
