import { Router } from 'express';
import authRoutes from './authRoutes.js';
import muscleGroupRoutes from './muscleGroupRoutes.js';
import exerciseRoutes from './exerciseRoutes.js';
import routineRoutes from './routineRoutes.js';
import workoutRoutes from './workoutRoutes.js';
import statsRoutes from './statsRoutes.js';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/muscle-groups', muscleGroupRoutes);
apiRouter.use('/exercises', exerciseRoutes);
apiRouter.use('/routines', routineRoutes);
apiRouter.use('/workouts', workoutRoutes);
apiRouter.use('/stats', statsRoutes);

// Health check endpoint
apiRouter.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'FORGE Gym Performance API',
    timestamp: new Date().toISOString()
  });
});

export default apiRouter;

