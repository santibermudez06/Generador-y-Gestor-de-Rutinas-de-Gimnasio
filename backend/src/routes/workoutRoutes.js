import { Router } from 'express';
import {
  getWorkouts,
  getActiveWorkout,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  addSetToWorkout,
  updateSetInWorkout,
  deleteSetFromWorkout,
  finishWorkout
} from '../controllers/workoutController.js';
import { authenticate } from '../middleware/auth.js';
import { validateObjectId } from '../middleware/validateObjectId.js';

const router = Router();

// Todas las rutas de entrenamientos requieren autenticación
router.use(authenticate);

router.get('/active', getActiveWorkout);
router.get('/', getWorkouts);
router.post('/', createWorkout);

router.get('/:id', validateObjectId('id'), getWorkoutById);
router.put('/:id', validateObjectId('id'), updateWorkout);

router.post('/:id/sets', validateObjectId('id'), addSetToWorkout);
router.put('/:id/sets/:setId', validateObjectId('id', 'setId'), updateSetInWorkout);
router.delete('/:id/sets/:setId', validateObjectId('id', 'setId'), deleteSetFromWorkout);

router.post('/:id/finish', validateObjectId('id'), finishWorkout);

export default router;

