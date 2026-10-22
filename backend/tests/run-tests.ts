import assert from 'assert';
import prisma from '../src/config/database';
import bcrypt from 'bcryptjs';
import { signToken, verifyToken } from '../src/utils/tokens';
import { GamificationService } from '../src/services/gamification.service';
import { AiValidationService } from '../src/services/ai.service';

async function runTestSuite() {
  console.log('🧪 Starting AcademiaERP Backend Automated Test Suite...');
  let passed = 0;
  let failed = 0;

  async function test(name: string, fn: () => Promise<void>) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     Error: ${err.message}`);
      failed++;
    }
  }

  // 1. Database & Seed Verification
  await test('Database contains seeded admin, faculty, and student records', async () => {
    const admin = await prisma.user.findUnique({ where: { email: 'admin@academia.edu' } });
    const faculty = await prisma.user.findUnique({ where: { email: 'prof.sharma@academia.edu' } });
    const student = await prisma.user.findUnique({ where: { email: 'ayush.student@academia.edu' } });

    assert.ok(admin, 'Admin user should exist');
    assert.strictEqual(admin?.role, 'ADMIN');
    assert.ok(faculty, 'Faculty user should exist');
    assert.strictEqual(faculty?.role, 'FACULTY');
    assert.ok(student, 'Student user should exist');
    assert.strictEqual(student?.role, 'STUDENT');
  });

  // 2. Authentication & Password Hashing
  await test('Password hashing and verification with bcrypt', async () => {
    const student = await prisma.user.findUnique({ where: { email: 'ayush.student@academia.edu' } });
    assert.ok(student);
    const valid = await bcrypt.compare('Student@123', student.passwordHash);
    const invalid = await bcrypt.compare('WrongPassword', student.passwordHash);
    assert.strictEqual(valid, true, 'Valid password should verify');
    assert.strictEqual(invalid, false, 'Invalid password should fail verification');
  });

  // 3. JWT Signing & Verification
  await test('JWT signing and claims decoding', async () => {
    const token = signToken({
      userId: 'test-user-id',
      email: 'test@academia.edu',
      role: 'STUDENT',
    });
    assert.ok(typeof token === 'string' && token.length > 20);
    const decoded = verifyToken(token);
    assert.strictEqual(decoded.userId, 'test-user-id');
    assert.strictEqual(decoded.role, 'STUDENT');
  });

  // 4. Gamification Engine: Idempotent XP Awarding
  await test('Gamification Engine prevents duplicate XP awards (idempotency key)', async () => {
    const student = await prisma.studentProfile.findFirst();
    assert.ok(student);
    const uniqueKey = `test_idempotency_${Date.now()}`;

    // First award
    const award1 = await GamificationService.awardXp({
      studentProfileId: student.id,
      eventType: 'ON_TIME_SUBMISSION',
      sourceEntity: 'test_submission',
      sourceId: 'sub_test_01',
      idempotencyKey: uniqueKey,
      customAmount: 50,
    });
    assert.strictEqual(award1.awarded, true, 'First attempt should award XP');
    assert.strictEqual(award1.amount, 50);

    // Second award with identical key
    const award2 = await GamificationService.awardXp({
      studentProfileId: student.id,
      eventType: 'ON_TIME_SUBMISSION',
      sourceEntity: 'test_submission',
      sourceId: 'sub_test_01',
      idempotencyKey: uniqueKey,
      customAmount: 50,
    });
    assert.strictEqual(award2.awarded, false, 'Duplicate attempt with same key must be rejected');
  });

  // 5. Leaderboard Calculation
  await test('Leaderboards calculate accurately with stable ranking', async () => {
    const leaderboards = await GamificationService.getLeaderboards(6);
    assert.ok(Array.isArray(leaderboards.monthlyLeaderboard));
    assert.ok(Array.isArray(leaderboards.semesterLeaderboard));
    assert.ok(leaderboards.monthlyLeaderboard.length > 0);

    // Verify ordering
    for (let i = 0; i < leaderboards.monthlyLeaderboard.length - 1; i++) {
      assert.ok(
        leaderboards.monthlyLeaderboard[i].monthlyXp >= leaderboards.monthlyLeaderboard[i + 1].monthlyXp,
        'Leaderboard must be sorted in descending order of monthly XP'
      );
    }
  });

  // 6. AI Offline Resilience & Fallback
  await test('AI Validation Service falls back gracefully when external microservice is offline', async () => {
    const sampleText =
      'Dynamic Programming guarantees optimal substructure by caching subproblem solutions in a memoization table. Asymptotic runtime scales efficiently compared to naive recursion.';
    const result = await AiValidationService.analyzeSubmissionText('test_sub_offline', sampleText);

    assert.ok(result);
    assert.ok(['COMPLETED', 'INSUFFICIENT_EVIDENCE'].includes(result.status));
    assert.ok(typeof result.aiLikelihoodScore === 'number');
    assert.ok(result.disclaimer.length > 0);
  });

  // 7. Academic Integrity & Marks Independence
  await test('Academic grades and marks remain independent of gamification XP', async () => {
    const submission = await prisma.submission.findFirst({
      where: { grade: { isNot: null } },
      include: { grade: true, student: true },
    });
    assert.ok(submission);
    assert.ok(submission.grade);
    const marks = submission.grade.marksObtained;
    const initialXp = submission.student.lifetimeXp;

    // Simulate an XP transaction
    await GamificationService.awardXp({
      studentProfileId: submission.studentId,
      eventType: 'ATTENDANCE_SESSION',
      sourceEntity: 'attendance_record',
      sourceId: `att_test_${Date.now()}`,
      idempotencyKey: `att_test_${Date.now()}`,
      customAmount: 15,
    });

    // Re-query grade
    const refreshedGrade = await prisma.grade.findUnique({
      where: { id: submission.grade.id },
    });
    assert.strictEqual(refreshedGrade?.marksObtained, marks, 'Official academic marks must never be altered by XP transactions');
  });

  console.log('----------------------------------------------------');
  console.log(`📊 Test Results: ${passed} Passed, ${failed} Failed`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite()
  .catch((err) => {
    console.error('Fatal test error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
