import { Router } from 'express';
import {
  getDashboardStats,
  getProgressStats,
  getExerciseStats
} from '../controllers/statsController.js';
import { authenticate } from '../middleware/auth.js';
import { validateObjectId } from '../middleware/validateObjectId.js';

const router = Router();

router.use(authenticate);

router.get('/dashboard', getDashboardStats);
router.get('/progress', getProgressStats);
router.get('/exercises/:id', validateObjectId('id'), getExerciseStats);

export default router;

