import { prisma } from '../config/database.js';
import { ApiError } from '../middleware/errorHandler.js';

export async function getDashboardStats(req, res, next) {
  try {
    const userId = req.user.id;
    const preferredUnit = req.user.preferredWeightUnit || 'kg';

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // 1. Entrenamientos semanales completados
    const [weeklyWorkouts, previousWeekWorkouts] = await Promise.all([
      prisma.workoutSession.count({
        where: {
          userId,
          status: 'completed',
          startedAt: { gte: sevenDaysAgo }
        }
      }),
      prisma.workoutSession.count({
        where: {
          userId,
          status: 'completed',
          startedAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo }
        }
      })
    ]);

    // 2. Sesiones de esta semana con series completadas
    const [thisWeekSessions, lastWeekSessions] = await Promise.all([
      prisma.workoutSession.findMany({
        where: {
          userId,
          status: 'completed',
          startedAt: { gte: sevenDaysAgo }
        },
        include: { sets: true }
      }),
      prisma.workoutSession.findMany({
        where: {
          userId,
          status: 'completed',
          startedAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo }
        },
        include: { sets: true }
      })
    ]);

    let weeklyVolume = 0;
    let weeklySets = 0;
    let weeklyMinutes = 0;

    for (const s of thisWeekSessions) {
      weeklyMinutes += Math.round((s.durationSeconds || 0) / 60);
      for (const set of s.sets) {
        if (set.completed && set.weight > 0 && set.repetitions > 0) {
          weeklyVolume += set.weight * set.repetitions;
          weeklySets++;
        }
      }
    }

    let lastWeekVolume = 0;
    for (const s of lastWeekSessions) {
      for (const set of s.sets) {
        if (set.completed && set.weight > 0 && set.repetitions > 0) {
          lastWeekVolume += set.weight * set.repetitions;
        }
      }
    }

    const weeklyVolumeChangePercent =
      lastWeekVolume > 0
        ? Math.round(((weeklyVolume - lastWeekVolume) / lastWeekVolume) * 100)
        : weeklyVolume > 0
        ? 100
        : 0;

    // 3. Entrenamientos recientes
    const recent = await prisma.workoutSession.findMany({
      where: { userId, status: 'completed' },
      include: {
        routine: true,
        sets: {
          include: { exercise: true }
        }
      },
      orderBy: { startedAt: 'desc' },
      take: 5
    });

    const recentWorkouts = recent.map((w) => {
      const vol = w.sets.reduce((sum, s) => {
        return s.completed ? sum + (s.weight || 0) * (s.repetitions || 0) : sum;
      }, 0);

      const exerciseNames = [
        ...new Set(
          w.sets
            .filter((s) => s.exercise && s.exercise.name)
            .map((s) => s.exercise.name)
        )
      ];

      return {
        _id: w.id,
        id: w.id,
        name: w.name,
        routineName: w.routine ? w.routine.name : 'Entrenamiento Libre',
        date: w.startedAt,
        durationMinutes: Math.round((w.durationSeconds || 60) / 60),
        totalVolume: vol,
        unit: preferredUnit,
        exercisesCount: exerciseNames.length,
        completedSets: w.sets.filter((s) => s.completed).length
      };
    });

    // 4. Récords personales (top cargas completadas)
    const completedSets = await prisma.workoutSet.findMany({
      where: {
        workoutSession: { userId, status: 'completed' },
        completed: true,
        weight: { gt: 0 }
      },
      include: { exercise: true },
      orderBy: { weight: 'desc' },
      take: 20
    });

    const prMap = new Map();
    for (const s of completedSets) {
      if (!prMap.has(s.exerciseId)) {
        prMap.set(s.exerciseId, {
          exerciseId: s.exerciseId,
          exerciseName: s.exercise.name,
          maxWeight: s.weight,
          repetitions: s.repetitions
        });
      }
      if (prMap.size >= 4) break;
    }

    return res.status(200).json({
      success: true,
      data: {
        preferredUnit,
        summary: {
          weeklyWorkouts,
          previousWeekWorkouts,
          weeklyVolume,
          weeklyVolumeChangePercent,
          weeklySets,
          weeklyMinutes
        },
        recentWorkouts,
        personalRecords: Array.from(prMap.values())
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function getProgressStats(req, res, next) {
  try {
    const userId = req.user.id;
    const preferredUnit = req.user.preferredWeightUnit || 'kg';
    const { days = 30 } = req.query;

    const startDate = new Date(Date.now() - Number(days) * 24 * 60 * 60 * 1000);

    const sessions = await prisma.workoutSession.findMany({
      where: {
        userId,
        status: 'completed',
        startedAt: { gte: startDate }
      },
      include: {
        sets: {
          include: {
            exercise: {
              include: { muscleGroup: true }
            }
          }
        }
      },
      orderBy: { startedAt: 'asc' }
    });

    // 1. Evolución diaria
    const dailyMap = new Map();
    const dayOfWeekCounts = [0, 0, 0, 0, 0, 0, 0]; // Dom a Sáb
    const muscleMap = new Map();

    for (const s of sessions) {
      const dateKey = s.startedAt.toISOString().split('T')[0];
      const dayIdx = s.startedAt.getDay(); // 0 = Domingo
      dayOfWeekCounts[dayIdx]++;

      let sessionVol = 0;
      let sessionSets = 0;

      for (const set of s.sets) {
        if (set.completed && set.weight > 0 && set.repetitions > 0) {
          const vol = set.weight * set.repetitions;
          sessionVol += vol;
          sessionSets++;

          const mName = set.exercise?.muscleGroup?.name || 'Otro';
          const existingM = muscleMap.get(mName) || { sets: 0, volume: 0 };
          muscleMap.set(mName, {
            sets: existingM.sets + 1,
            volume: existingM.volume + vol
          });
        }
      }

      const existingDay = dailyMap.get(dateKey) || { volume: 0, sets: 0 };
      dailyMap.set(dateKey, {
        date: dateKey,
        volume: existingDay.volume + sessionVol,
        sets: existingDay.sets + sessionSets
      });
    }

    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const frequencyChart = dayNames.map((name, idx) => ({
      day: name,
      workouts: dayOfWeekCounts[idx]
    }));

    const muscleDistribution = Array.from(muscleMap.entries()).map(([muscle, d]) => ({
      muscle,
      sets: d.sets,
      volume: d.volume
    }));

    return res.status(200).json({
      success: true,
      data: {
        preferredUnit,
        dailyVolume: Array.from(dailyMap.values()),
        frequencyChart,
        muscleDistribution
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function getExerciseStats(req, res, next) {
  try {
    const userId = req.user.id;
    const { id: exerciseId } = req.params;

    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
      include: { muscleGroup: true }
    });

    if (!exercise) {
      throw ApiError.notFound('Ejercicio no encontrado');
    }

    const sets = await prisma.workoutSet.findMany({
      where: {
        exerciseId,
        workoutSession: { userId, status: 'completed' },
        completed: true,
        weight: { gt: 0 }
      },
      include: { workoutSession: true },
      orderBy: { recordedAt: 'asc' }
    });

    // Agrupar por fecha
    const progressionMap = new Map();

    for (const s of sets) {
      const dateKey = s.workoutSession.startedAt.toISOString().split('T')[0];
      const weight = s.weight;
      const reps = s.repetitions;
      const est1RM = reps === 1 ? weight : Math.round((weight / (1.0278 - 0.0278 * reps)) * 10) / 10;
      const volume = weight * reps;

      const existing = progressionMap.get(dateKey) || {
        date: dateKey,
        maxWeight: 0,
        estimated1RM: 0,
        volume: 0
      };

      progressionMap.set(dateKey, {
        date: dateKey,
        maxWeight: Math.max(existing.maxWeight, weight),
        estimated1RM: Math.max(existing.estimated1RM, est1RM),
        volume: existing.volume + volume
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        exercise: {
          _id: exercise.id,
          id: exercise.id,
          name: exercise.name,
          muscleGroup: exercise.muscleGroup ? exercise.muscleGroup.name : 'N/A',
          equipment: exercise.equipment
        },
        progression: Array.from(progressionMap.values())
      }
    });
  } catch (error) {
    next(error);
  }
}
