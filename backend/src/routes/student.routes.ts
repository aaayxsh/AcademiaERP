import { Router } from 'express';
import { StudentController } from '../controllers/student.controller';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';

const router = Router();

// Protect all student routes: require authenticated user with role STUDENT
router.use(authenticate, requireRole('STUDENT'));

router.get('/dashboard', StudentController.getDashboard);
router.get('/courses', StudentController.getCourses);
router.get('/assignments', StudentController.getAssignments);
router.post('/assignments/:assignmentId/submit', StudentController.submitAssignment);
router.get('/attendance', StudentController.getAttendance);
router.get('/gamification', StudentController.getGamificationHub);
router.post('/rewards/redeem', StudentController.redeemReward);

export default router;
