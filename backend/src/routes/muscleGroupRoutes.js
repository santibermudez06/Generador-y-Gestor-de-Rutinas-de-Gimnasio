import { Router } from 'express';
import { getMuscleGroups } from '../controllers/muscleGroupController.js';

const router = Router();

router.get('/', getMuscleGroups);

export default router;

