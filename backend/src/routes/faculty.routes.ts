import { Router } from 'express';
import { FacultyController } from '../controllers/faculty.controller';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';

const router = Router();

// Protect all faculty routes: require role FACULTY
router.use(authenticate, requireRole('FACULTY'));

router.get('/dashboard', FacultyController.getDashboard);
router.get('/courses', FacultyController.getCourses);
router.post('/assignments', FacultyController.createAssignment);
router.get('/assignments/:assignmentId/submissions', FacultyController.getSubmissions);
router.post('/submissions/:submissionId/grade', FacultyController.gradeSubmission);
router.get('/attendance', FacultyController.getAttendanceSheet);
router.post('/attendance', FacultyController.saveAttendanceSheet);
router.get('/ai-review', FacultyController.getAiReviewWorkspace);
router.post('/ai-review/disposition', FacultyController.submitReviewDisposition);

export default router;
