import { Router } from 'express';
import { getExercises, getExerciseById } from '../controllers/exerciseController.js';
import { validateObjectId } from '../middleware/validateObjectId.js';

const router = Router();

router.get('/', getExercises);
router.get('/:id', validateObjectId('id'), getExerciseById);

export default router;

