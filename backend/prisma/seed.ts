import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seed for AcademiaERP...');

  // 1. Clean existing records in reverse dependency order
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.facultyReviewDisposition.deleteMany();
  await prisma.aiAssessment.deleteMany();
  await prisma.rewardRedemption.deleteMany();
  await prisma.rewardItem.deleteMany();
  await prisma.studentAchievement.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.xpTransaction.deleteMany();
  await prisma.xpRule.deleteMany();
  await prisma.notice.deleteMany();
  await prisma.timetableEntry.deleteMany();
  await prisma.attendanceRecord.deleteMany();
  await prisma.attendanceSession.deleteMany();
  await prisma.grade.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.course.deleteMany();
  await prisma.academicTerm.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.facultyProfile.deleteMany();
  await prisma.user.deleteMany();

  // 2. Hash default passwords
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('Admin@123', salt);
  const facultyPassword = await bcrypt.hash('Faculty@123', salt);
  const studentPassword = await bcrypt.hash('Student@123', salt);

  // 3. Create Admin User
  const admin = await prisma.user.create({
    data: {
      email: 'admin@academia.edu',
      passwordHash: adminPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
      firstName: 'Dr. Vikram',
      lastName: 'Sethi',
      department: 'Academic Affairs & Institutional Governance',
      phone: '+91 98110 23456',
    },
  });

  // 4. Create Faculty Users
  const facultySharma = await prisma.user.create({
    data: {
      email: 'prof.sharma@academia.edu',
      passwordHash: facultyPassword,
      role: 'FACULTY',
      status: 'ACTIVE',
      firstName: 'Prof. Rajesh',
      lastName: 'Sharma',
      department: 'Computer Science & Engineering',
      phone: '+91 98220 34567',
      facultyProfile: {
        create: {
          facultyId: 'FAC2026CS01',
          designation: 'Professor & Head of Department',
          officeRoom: 'Tech Block 3 - Room 304',
          specialization: 'Algorithms, Data Structures & Optimization',
        },
      },
    },
    include: { facultyProfile: true },
  });

  const facultyAnanya = await prisma.user.create({
    data: {
      email: 'prof.ananya@academia.edu',
      passwordHash: facultyPassword,
      role: 'FACULTY',
      status: 'ACTIVE',
      firstName: 'Dr. Ananya',
      lastName: 'Mukherjee',
      department: 'Computer Science & Engineering',
      phone: '+91 98330 45678',
      facultyProfile: {
        create: {
          facultyId: 'FAC2026CS02',
          designation: 'Associate Professor',
          officeRoom: 'Tech Block 2 - Room 218',
          specialization: 'Distributed Systems & Cloud Computing',
        },
      },
    },
    include: { facultyProfile: true },
  });

  // 5. Create Students
  const ayushUser = await prisma.user.create({
    data: {
      email: 'ayush.student@academia.edu',
      passwordHash: studentPassword,
      role: 'STUDENT',
      status: 'ACTIVE',
      firstName: 'Ayush',
      lastName: 'Srivastava',
      department: 'Computer Science & Engineering',
      phone: '+91 98440 56789',
      studentProfile: {
        create: {
          studentId: 'STU2026CS042',
          semester: 6,
          section: 'A',
          enrollmentYear: 2023,
          lifetimeXp: 1420,
          monthlyXp: 380,
          semesterXp: 890,
          currentStreak: 12,
          longestStreak: 18,
          lastActivityDate: new Date(),
        },
      },
    },
    include: { studentProfile: true },
  });

  const priyaUser = await prisma.user.create({
    data: {
      email: 'priya.verma@academia.edu',
      passwordHash: studentPassword,
      role: 'STUDENT',
      status: 'ACTIVE',
      firstName: 'Priya',
      lastName: 'Verma',
      department: 'Computer Science & Engineering',
      phone: '+91 98550 67890',
      studentProfile: {
        create: {
          studentId: 'STU2026CS015',
          semester: 6,
          section: 'A',
          enrollmentYear: 2023,
          lifetimeXp: 1850,
          monthlyXp: 460,
          semesterXp: 1120,
          currentStreak: 16,
          longestStreak: 22,
          lastActivityDate: new Date(),
        },
      },
    },
    include: { studentProfile: true },
  });

  const rohitUser = await prisma.user.create({
    data: {
      email: 'rohit.kumar@academia.edu',
      passwordHash: studentPassword,
      role: 'STUDENT',
      status: 'ACTIVE',
      firstName: 'Rohit',
      lastName: 'Kumar',
      department: 'Computer Science & Engineering',
      phone: '+91 98660 78901',
      studentProfile: {
        create: {
          studentId: 'STU2026CS089',
          semester: 6,
          section: 'B',
          enrollmentYear: 2023,
          lifetimeXp: 1100,
          monthlyXp: 390,
          semesterXp: 720,
          currentStreak: 8,
          longestStreak: 10,
          lastActivityDate: new Date(),
        },
      },
    },
    include: { studentProfile: true },
  });

  const snehaUser = await prisma.user.create({
    data: {
      email: 'sneha.patel@academia.edu',
      passwordHash: studentPassword,
      role: 'STUDENT',
      status: 'ACTIVE',
      firstName: 'Sneha',
      lastName: 'Patel',
      department: 'Computer Science & Engineering',
      phone: '+91 98770 89012',
      studentProfile: {
        create: {
          studentId: 'STU2026CS033',
          semester: 6,
          section: 'A',
          enrollmentYear: 2023,
          lifetimeXp: 1340,
          monthlyXp: 320,
          semesterXp: 840,
          currentStreak: 10,
          longestStreak: 14,
          lastActivityDate: new Date(),
        },
      },
    },
    include: { studentProfile: true },
  });

  // 6. Academic Term
  const currentTerm = await prisma.academicTerm.create({
    data: {
      name: 'Spring 2026',
      startDate: new Date('2026-01-15T00:00:00.000Z'),
      endDate: new Date('2026-05-30T23:59:59.000Z'),
      isCurrent: true,
    },
  });

  // 7. Courses
  const cs301 = await prisma.course.create({
    data: {
      code: 'CS301',
      name: 'Design & Analysis of Algorithms',
      credits: 4,
      department: 'Computer Science & Engineering',
      semester: 6,
      termId: currentTerm.id,
      facultyId: facultySharma.facultyProfile!.id,
      syllabus: 'Asymptotic Analysis, Divide & Conquer, Dynamic Programming, Greedy Methods, Graph Algorithms, NP-Completeness.',
    },
  });

  const cs302 = await prisma.course.create({
    data: {
      code: 'CS302',
      name: 'Distributed Systems & Cloud Computing',
      credits: 4,
      department: 'Computer Science & Engineering',
      semester: 6,
      termId: currentTerm.id,
      facultyId: facultyAnanya.facultyProfile!.id,
      syllabus: 'Clock Synchronization, Consensus Protocols (Paxos, Raft), RPCs, Microservices, Kubernetes, Fault Tolerance.',
    },
  });

  const cs303 = await prisma.course.create({
    data: {
      code: 'CS303',
      name: 'Machine Learning & AI Ethics',
      credits: 3,
      department: 'Computer Science & Engineering',
      semester: 6,
      termId: currentTerm.id,
      facultyId: facultySharma.facultyProfile!.id,
      syllabus: 'Supervised & Unsupervised Learning, Stylometric NLP, Evaluation Metrics, Bias & Fairness in AI Systems.',
    },
  });

  // 8. Enrollments
  const students = [ayushUser, priyaUser, rohitUser, snehaUser];
  const courses = [cs301, cs302, cs303];

  for (const st of students) {
    for (const cr of courses) {
      await prisma.enrollment.create({
        data: {
          studentId: st.studentProfile!.id,
          courseId: cr.id,
          status: 'ENROLLED',
        },
      });
    }
  }

  // 9. Assignments
  const now = new Date();
  const pastDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const futureDate1 = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
  const futureDate2 = new Date(now.getTime() + 9 * 24 * 60 * 60 * 1000);
  const futureDate3 = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

  // CS301 Past Assignment
  const cs301Assign1 = await prisma.assignment.create({
    data: {
      courseId: cs301.id,
      title: 'Lab Exercise 1: Asymptotic Analysis & Recurrence Relations',
      description: 'Solve the Master Theorem recurrence proofs and provide formal big-O asymptotic bounds for the 5 given algorithms.',
      maxMarks: 100,
      dueDate: pastDate,
      permittedTypes: 'PDF,DOCX',
      status: 'CLOSED',
      allowLateSubmissions: true,
    },
  });

  // CS301 Active Assignment
  const cs301Assign2 = await prisma.assignment.create({
    data: {
      courseId: cs301.id,
      title: 'Project 2: Dynamic Programming & All-Pairs Shortest Path',
      description: 'Implement Floyd-Warshall and Johnson algorithm in C++/Python. Submit benchmark comparative analysis and formal proof of correctness.',
      maxMarks: 100,
      dueDate: futureDate1,
      permittedTypes: 'PDF,DOCX',
      status: 'PUBLISHED',
      allowLateSubmissions: true,
    },
  });

  // CS302 Active Assignment
  const cs302Assign1 = await prisma.assignment.create({
    data: {
      courseId: cs302.id,
      title: 'Milestone 1: Raft Consensus Protocol Implementation',
      description: 'Build a 3-node Raft leader election simulation with heartbeat timer and RPC exchange log.',
      maxMarks: 100,
      dueDate: futureDate2,
      permittedTypes: 'PDF,DOCX',
      status: 'PUBLISHED',
      allowLateSubmissions: false,
    },
  });

  // CS303 Active Assignment
  const cs303Assign1 = await prisma.assignment.create({
    data: {
      courseId: cs303.id,
      title: 'Case Study: Algorithmic Fairness & Stylometric Detection Bias',
      description: 'Evaluate statistical stylometric signals on technical writing versus creative humanities text. Highlight limitations and false-positive implications.',
      maxMarks: 100,
      dueDate: futureDate3,
      permittedTypes: 'PDF,DOCX',
      status: 'PUBLISHED',
      allowLateSubmissions: true,
    },
  });

  // 10. Submissions, Grades & AI Assessments
  // Ayush's submission to CS301 Assign 1 (Graded)
  const ayushSub1 = await prisma.submission.create({
    data: {
      assignmentId: cs301Assign1.id,
      studentId: ayushUser.studentProfile!.id,
      fileUrl: '/uploads/submissions/ayush_cs301_lab1.pdf',
      originalFileName: 'Ayush_Srivastava_CS301_Lab1.pdf',
      fileSizeBytes: 421800,
      fileType: 'PDF',
      textContent: 'Asymptotic Analysis Proofs: We evaluate T(n) = 4T(n/2) + n^2. Using Master Theorem Case 2, since log2(4) = 2, we deduce Theta(n^2 log n). Detailed inductive steps and benchmark plots are included below.',
      status: 'GRADED',
      isLate: false,
      submittedAt: new Date(pastDate.getTime() - 2 * 24 * 60 * 60 * 1000), // submitted 2 days early!
    },
  });

  await prisma.grade.create({
    data: {
      submissionId: ayushSub1.id,
      facultyId: facultySharma.facultyProfile!.id,
      marksObtained: 94.0,
      maxMarks: 100.0,
      feedback: 'Outstanding mathematical rigor. Clear step-by-step substitution proofs and excellent code commentary.',
      rubricBreakdown: JSON.stringify({
        correctness: 48,
        rigor: 28,
        documentation: 18,
      }),
    },
  });

  const aiSub1 = await prisma.aiAssessment.create({
    data: {
      submissionId: ayushSub1.id,
      status: 'COMPLETED',
      aiLikelihoodScore: 0.14,
      confidence: 'LOW',
      signalsJson: JSON.stringify({
        typeTokenRatio: 0.68,
        rootTypeTokenRatio: 7.2,
        shannonEntropy: 6.94,
        meanSentenceLength: 17.4,
        sentenceLengthStdDev: 8.6,
        hapaxLegomenaRatio: 0.58,
        markerDensityPer100Words: 0.0,
      }),
      disclaimer: 'Heuristic stylometric decision-support only. Faculty retains final authority.',
      processingTimeMs: 42,
      modelVersion: 'stylometry-nlp-v1.2',
    },
  });

  // Ayush submitted CS301 Assign 2 (Pending grading)
  const ayushSub2 = await prisma.submission.create({
    data: {
      assignmentId: cs301Assign2.id,
      studentId: ayushUser.studentProfile!.id,
      fileUrl: '/uploads/submissions/ayush_cs301_proj2.pdf',
      originalFileName: 'Ayush_Srivastava_DP_Optimization.pdf',
      fileSizeBytes: 512400,
      fileType: 'PDF',
      textContent: 'Dynamic Programming Optimization: Floyd-Warshall implementation with memoization matrix and predecessor path reconstruction. Empirical results demonstrate O(V^3) runtime scaling across dense adjacency matrices.',
      status: 'SUBMITTED',
      isLate: false,
      submittedAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
    },
  });

  await prisma.aiAssessment.create({
    data: {
      submissionId: ayushSub2.id,
      status: 'COMPLETED',
      aiLikelihoodScore: 0.19,
      confidence: 'LOW',
      signalsJson: JSON.stringify({
        typeTokenRatio: 0.62,
        rootTypeTokenRatio: 6.8,
        shannonEntropy: 7.02,
        meanSentenceLength: 19.1,
        sentenceLengthStdDev: 7.8,
        hapaxLegomenaRatio: 0.52,
        markerDensityPer100Words: 0.4,
      }),
      disclaimer: 'Heuristic stylometric decision-support only. Faculty retains final authority.',
      processingTimeMs: 48,
      modelVersion: 'stylometry-nlp-v1.2',
    },
  });

  // Rohit's submission to CS301 Assign 1 (Flagged for review, defended & verified)
  const rohitSub1 = await prisma.submission.create({
    data: {
      assignmentId: cs301Assign1.id,
      studentId: rohitUser.studentProfile!.id,
      fileUrl: '/uploads/submissions/rohit_cs301_lab1.docx',
      originalFileName: 'Rohit_Kumar_Algorithms_Lab1.docx',
      fileSizeBytes: 218900,
      fileType: 'DOCX',
      textContent: 'In conclusion, it is crucial to recognize the multifaceted importance of recurrence relations in computer algorithms. Furthermore, the divide and conquer paradigm serves as a beacon of optimization. Moreover, asymptotic analysis delves into efficiency metrics.',
      status: 'GRADED',
      isLate: false,
      submittedAt: pastDate,
    },
  });

  await prisma.grade.create({
    data: {
      submissionId: rohitSub1.id,
      facultyId: facultySharma.facultyProfile!.id,
      marksObtained: 82.0,
      maxMarks: 100.0,
      feedback: 'Good technical understanding verified during viva. Work accepted as original.',
      rubricBreakdown: JSON.stringify({
        correctness: 42,
        rigor: 22,
        documentation: 18,
      }),
    },
  });

  const rohitAi = await prisma.aiAssessment.create({
    data: {
      submissionId: rohitSub1.id,
      status: 'COMPLETED',
      aiLikelihoodScore: 0.76,
      confidence: 'HIGH',
      signalsJson: JSON.stringify({
        typeTokenRatio: 0.46,
        rootTypeTokenRatio: 5.1,
        shannonEntropy: 6.58,
        meanSentenceLength: 22.4,
        sentenceLengthStdDev: 3.2,
        hapaxLegomenaRatio: 0.38,
        markerDensityPer100Words: 3.8,
        detectedMarkers: [
          { marker: 'in conclusion', count: 1 },
          { marker: 'furthermore', count: 1 },
          { marker: 'delves into', count: 1 },
        ],
      }),
      disclaimer: 'Heuristic stylometric decision-support only. Faculty retains final authority.',
      processingTimeMs: 55,
      modelVersion: 'stylometry-nlp-v1.2',
    },
  });

  await prisma.facultyReviewDisposition.create({
    data: {
      assessmentId: rohitAi.id,
      submissionId: rohitSub1.id,
      facultyId: facultySharma.facultyProfile!.id,
      disposition: 'CONFIRMED_ORIGINAL',
      facultyNotes: 'Conducted interactive oral defense in Lab 304. Student explained all proof steps and graph code fluently. High AI index was caused by formulaic academic phrasing template.',
    },
  });

  // 11. Attendance Sessions & Records
  const sessionDates = [
    new Date('2026-03-02T09:00:00Z'),
    new Date('2026-03-05T09:00:00Z'),
    new Date('2026-03-09T09:00:00Z'),
    new Date('2026-03-12T09:00:00Z'),
    new Date('2026-03-16T09:00:00Z'),
    new Date('2026-03-19T09:00:00Z'),
    new Date('2026-03-23T09:00:00Z'),
    new Date('2026-03-26T09:00:00Z'),
  ];

  for (let i = 0; i < sessionDates.length; i++) {
    const session = await prisma.attendanceSession.create({
      data: {
        courseId: cs301.id,
        date: sessionDates[i],
        title: `Lecture ${i + 1}: Algorithm Design Principles`,
      },
    });

    for (const st of students) {
      // Ayush is present in all except one excused
      let status = 'PRESENT';
      if (st.id === ayushUser.id && i === 4) status = 'EXCUSED';
      if (st.id === rohitUser.id && (i === 2 || i === 6)) status = 'ABSENT';
      if (st.id === snehaUser.id && i === 3) status = 'LATE';

      await prisma.attendanceRecord.create({
        data: {
          sessionId: session.id,
          studentId: st.studentProfile!.id,
          status,
          xpAwarded: status === 'PRESENT',
        },
      });
    }
  }

  // 12. Timetable Entries
  const timetableItems = [
    { courseId: cs301.id, dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '10:00', roomNo: 'Lecture Hall 401', sessionType: 'LECTURE' },
    { courseId: cs302.id, dayOfWeek: 'MONDAY', startTime: '11:15', endTime: '12:15', roomNo: 'Tech Block 202', sessionType: 'LECTURE' },
    { courseId: cs301.id, dayOfWeek: 'TUESDAY', startTime: '10:00', endTime: '12:00', roomNo: 'Computing Lab 3', sessionType: 'LAB' },
    { courseId: cs303.id, dayOfWeek: 'WEDNESDAY', startTime: '09:00', endTime: '10:00', roomNo: 'Lecture Hall 401', sessionType: 'LECTURE' },
    { courseId: cs302.id, dayOfWeek: 'WEDNESDAY', startTime: '14:00', endTime: '16:00', roomNo: 'Cloud Systems Lab', sessionType: 'LAB' },
    { courseId: cs301.id, dayOfWeek: 'THURSDAY', startTime: '11:15', endTime: '12:15', roomNo: 'Lecture Hall 401', sessionType: 'LECTURE' },
    { courseId: cs303.id, dayOfWeek: 'FRIDAY', startTime: '10:00', endTime: '11:00', roomNo: 'Seminar Hall 1', sessionType: 'TUTORIAL' },
  ];

  for (const item of timetableItems) {
    await prisma.timetableEntry.create({ data: item });
  }

  // 13. Gamification Engine: XP Rules
  const xpRules = [
    { ruleKey: 'ON_TIME_SUBMISSION', title: 'On-Time Assignment Submission', description: 'Awarded when an assignment is submitted prior to the official deadline.', basePoints: 50, ruleVersion: 1 },
    { ruleKey: 'EARLY_SUBMISSION_BONUS', title: 'Early Bird Submission', description: 'Awarded for submissions delivered 24+ hours ahead of deadline.', basePoints: 25, ruleVersion: 1 },
    { ruleKey: 'ATTENDANCE_SESSION', title: 'Verified Lecture Attendance', description: 'Awarded automatically for marked presence in regular lectures.', basePoints: 15, ruleVersion: 1 },
    { ruleKey: 'WEEKLY_PERFECT_ATTENDANCE', title: 'Weekly Attendance Milestone', description: 'Awarded for 100% attendance across all enrolled courses in a week.', basePoints: 40, ruleVersion: 1 },
    { ruleKey: 'STREAK_MILESTONE_7', title: '7-Day Academic Activity Streak', description: 'Maintained active daily engagement with the ERP platform for 7 consecutive days.', basePoints: 50, ruleVersion: 1 },
    { ruleKey: 'SEMINAR_PARTICIPATION', title: 'Academic Workshop / Seminar', description: 'Participation in approved university academic colloquiums.', basePoints: 35, ruleVersion: 1 },
  ];

  for (const rule of xpRules) {
    await prisma.xpRule.create({ data: rule });
  }

  // 14. XP Transactions for Ayush (Auditable History)
  const xpEvents = [
    { eventType: 'ON_TIME_SUBMISSION', sourceEntity: 'submission', sourceId: ayushSub1.id, amount: 50, ruleKey: 'ON_TIME_SUBMISSION', idempotencyKey: `sub_${ayushSub1.id}_ontime` },
    { eventType: 'EARLY_SUBMISSION_BONUS', sourceEntity: 'submission', sourceId: ayushSub1.id, amount: 25, ruleKey: 'EARLY_SUBMISSION_BONUS', idempotencyKey: `sub_${ayushSub1.id}_early` },
    { eventType: 'ON_TIME_SUBMISSION', sourceEntity: 'submission', sourceId: ayushSub2.id, amount: 50, ruleKey: 'ON_TIME_SUBMISSION', idempotencyKey: `sub_${ayushSub2.id}_ontime` },
    { eventType: 'STREAK_MILESTONE_7', sourceEntity: 'streak', sourceId: 'streak_week_10', amount: 50, ruleKey: 'STREAK_MILESTONE_7', idempotencyKey: `streak_ayush_wk10` },
    { eventType: 'WEEKLY_PERFECT_ATTENDANCE', sourceEntity: 'attendance_week', sourceId: 'week_11', amount: 40, ruleKey: 'WEEKLY_PERFECT_ATTENDANCE', idempotencyKey: `att_ayush_wk11` },
    { eventType: 'SEMINAR_PARTICIPATION', sourceEntity: 'event', sourceId: 'ai_ethics_symposium', amount: 35, ruleKey: 'SEMINAR_PARTICIPATION', idempotencyKey: `event_ayush_symp26` },
  ];

  for (const xp of xpEvents) {
    await prisma.xpTransaction.create({
      data: {
        studentId: ayushUser.studentProfile!.id,
        ...xp,
      },
    });
  }

  // 15. Achievements & Badges
  const achievements = [
    { code: 'FIRST_SUBMISSION', title: 'First Flight', description: 'Submitted your first assignment on time.', icon: 'CheckCircle2', category: 'ASSIGNMENT', xpThreshold: 50, tier: 'BRONZE' },
    { code: 'EARLY_BIRD', title: 'Early Bird', description: 'Submitted 24 hours ahead of the scheduled deadline.', icon: 'Clock', category: 'ASSIGNMENT', xpThreshold: 100, tier: 'BRONZE' },
    { code: 'STREAK_7_DAYS', title: 'Consistency Champion', description: 'Maintained 7 consecutive days of active academic engagement.', icon: 'Flame', category: 'CONSISTENCY', xpThreshold: 200, tier: 'SILVER' },
    { code: 'STREAK_14_DAYS', title: 'Unstoppable Momentum', description: 'Achieved a 14-day continuous academic streak.', icon: 'Zap', category: 'CONSISTENCY', xpThreshold: 450, tier: 'GOLD' },
    { code: 'PERFECT_ATTENDANCE', title: 'Perfect Presence', description: 'Achieved 100% attendance in all enrolled courses for a month.', icon: 'ShieldCheck', category: 'ATTENDANCE', xpThreshold: 350, tier: 'GOLD' },
    { code: 'SCHOLAR_ELITE', title: 'Academic Luminary', description: 'Accumulated over 1,000 Lifetime XP through verified efforts.', icon: 'Award', category: 'ENGAGEMENT', xpThreshold: 1000, tier: 'PLATINUM' },
  ];

  const createdAchievements: any[] = [];
  for (const ach of achievements) {
    const item = await prisma.achievement.create({ data: ach });
    createdAchievements.push(item);
  }

  // Award unlocked achievements to Ayush
  for (let i = 0; i < 4; i++) {
    await prisma.studentAchievement.create({
      data: {
        studentId: ayushUser.studentProfile!.id,
        achievementId: createdAchievements[i].id,
      },
    });
  }

  // Award achievements to Priya
  for (let i = 0; i < 5; i++) {
    await prisma.studentAchievement.create({
      data: {
        studentId: priyaUser.studentProfile!.id,
        achievementId: createdAchievements[i].id,
      },
    });
  }

  // 16. Simulated Reward Items & Redemptions
  const rewards = [
    { title: 'Quiet Study Pod Reservation', description: 'Exclusive 3-hour priority booking in the central library quiet zone.', xpCost: 200, category: 'ACADEMIC_PERK', icon: 'BookOpen', stock: 45 },
    { title: 'Campus Cafe Artisan Coffee', description: 'Redeemable for 1 hot beverage at the Central Campus Cafe.', xpCost: 150, category: 'CAMPUS_PRIVILEGE', icon: 'Coffee', stock: 120 },
    { title: 'Research Colloquium Fast-Pass', description: 'Guaranteed front-row reserved seating at guest researcher seminars.', xpCost: 300, category: 'ACADEMIC_PERK', icon: 'Ticket', stock: 20 },
    { title: 'Dean’s Honor Roll Digital Certificate', description: 'Verified cryptographic credential celebrating top consistency.', xpCost: 600, category: 'MERCHANDISE', icon: 'Award', stock: 50 },
  ];

  const createdRewards: any[] = [];
  for (const r of rewards) {
    const item = await prisma.rewardItem.create({ data: r });
    createdRewards.push(item);
  }

  // Ayush redeemed one coffee
  await prisma.rewardRedemption.create({
    data: {
      studentId: ayushUser.studentProfile!.id,
      rewardItemId: createdRewards[1].id,
      xpSpent: 150,
      status: 'CLAIMED',
      claimedAt: new Date(),
    },
  });

  // 17. Notices & Announcements
  await prisma.notice.create({
    data: {
      title: 'Spring 2026 Mid-Semester Project Presentation Schedule Released',
      content: 'All 6th-semester Computer Science students must review the oral defense schedule. Presentations will be conducted between April 10 and April 18 in Tech Block Labs.',
      authorId: admin.id,
      targetRole: 'ALL',
      priority: 'HIGH',
    },
  });

  await prisma.notice.create({
    data: {
      title: 'CS301: Additional Office Hours for Dynamic Programming',
      content: 'Prof. Sharma will hold extra consulting hours this Thursday from 14:00 to 16:30 in Room 304 to assist with the All-Pairs Shortest Path assignment.',
      authorId: facultySharma.id,
      courseId: cs301.id,
      targetRole: 'STUDENT',
      priority: 'NORMAL',
    },
  });

  await prisma.notice.create({
    data: {
      title: 'Campus Network Maintenance Window Announcement',
      content: 'Scheduled maintenance on core institutional switches will take place on Saturday from 02:00 AM to 05:00 AM IST. ERP access will remain unaffected.',
      authorId: admin.id,
      targetRole: 'ALL',
      priority: 'NORMAL',
    },
  });

  // 18. Audit Logs
  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      role: 'ADMIN',
      action: 'SYSTEM_INITIALIZATION',
      entityType: 'System',
      detailsJson: JSON.stringify({ message: 'Academic Term Spring 2026 configured and active.' }),
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: facultySharma.id,
      role: 'FACULTY',
      action: 'AI_DISPOSITION_CONFIRMED',
      entityType: 'AiAssessment',
      entityId: rohitAi.id,
      detailsJson: JSON.stringify({
        disposition: 'CONFIRMED_ORIGINAL',
        reason: 'Oral viva defense verified authentic student comprehension.',
      }),
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    },
  });

  console.log('✅ Database seed completed successfully!');
  console.log('----------------------------------------------------');
  console.log('Demo Credentials:');
  console.log('👑 Admin:   admin@academia.edu        / Admin@123');
  console.log('👨‍🏫 Faculty: prof.sharma@academia.edu  / Faculty@123');
  console.log('🎓 Student: ayush.student@academia.edu / Student@123');
  console.log('----------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
