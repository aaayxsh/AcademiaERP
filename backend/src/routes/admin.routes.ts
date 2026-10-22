import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';

const router = Router();

// Protect all admin routes: require role ADMIN
router.use(authenticate, requireRole('ADMIN'));

router.get('/dashboard', AdminController.getDashboard);
router.get('/users', AdminController.getUsers);
router.post('/users', AdminController.createUser);
router.patch('/users/:userId/status', AdminController.updateUserStatus);
router.get('/xp-rules', AdminController.getXpRules);
router.put('/xp-rules/:ruleId', AdminController.updateXpRule);
router.get('/ai-governance', AdminController.getAiGovernanceReport);
router.get('/audit-logs', AdminController.getAuditLogs);

export default router;
