import { Router } from 'express';
import {
  getRoutines,
  getRoutineById,
  createRoutine,
  updateRoutine,
  deleteRoutine,
  duplicateRoutine,
  addExerciseToRoutine,
  updateRoutineExercise,
  removeExerciseFromRoutine
} from '../controllers/routineController.js';
import { authenticate } from '../middleware/auth.js';
import { validateObjectId } from '../middleware/validateObjectId.js';

const router = Router();

// Todas las rutas de rutinas requieren autenticación
router.use(authenticate);

router.get('/', getRoutines);
router.post('/', createRoutine);

router.get('/:id', validateObjectId('id'), getRoutineById);
router.put('/:id', validateObjectId('id'), updateRoutine);
router.delete('/:id', validateObjectId('id'), deleteRoutine);

router.post('/:id/duplicate', validateObjectId('id'), duplicateRoutine);

// Sub-rutas para ejercicios de la rutina
router.post('/:id/exercises', validateObjectId('id'), addExerciseToRoutine);
router.put(
  '/:id/exercises/:exerciseId',
  validateObjectId('id', 'exerciseId'),
  updateRoutineExercise
);
router.delete(
  '/:id/exercises/:exerciseId',
  validateObjectId('id', 'exerciseId'),
  removeExerciseFromRoutine
);

export default router;

