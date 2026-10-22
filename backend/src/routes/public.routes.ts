import { Router } from 'express';
import { PublicController } from '../controllers/public.controller';
import { GamificationService } from '../services/gamification.service';

const router = Router();

router.get('/stats', PublicController.getLandingStats);
router.get('/health', PublicController.healthCheck);
router.get('/leaderboard', async (req, res) => {
  try {
    const data = await GamificationService.getLeaderboards();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch public leaderboard.' });
  }
});

export default router;
