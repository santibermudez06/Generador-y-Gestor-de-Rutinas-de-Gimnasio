import { prisma } from '../config/database.js';
import { ApiError } from '../middleware/errorHandler.js';

export async function getExercises(req, res, next) {
  try {
    const { search, muscleGroup, equipment, difficulty } = req.query;
    const where = {};

    if (search && typeof search === 'string' && search.trim()) {
      where.OR = [
        { name: { contains: search.trim(), mode: 'insensitive' } },
        { description: { contains: search.trim(), mode: 'insensitive' } }
      ];
    }

    if (muscleGroup) {
      where.muscleGroupId = muscleGroup;
    }

    if (equipment) {
      where.equipment = equipment;
    }

    if (difficulty && ['beginner', 'intermediate', 'advanced'].includes(difficulty)) {
      where.difficulty = difficulty;
    }

    const exercises = await prisma.exercise.findMany({
      where,
      include: {
        muscleGroup: {
          select: { id: true, name: true, description: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    const formatted = exercises.map((ex) => {
      let secondary = [];
      let instructions = [];
      try {
        secondary = JSON.parse(ex.secondaryMuscles || '[]');
      } catch (e) {
        secondary = [];
      }
      try {
        instructions = JSON.parse(ex.instructions || '[]');
      } catch (e) {
        instructions = [];
      }

      return {
        ...ex,
        _id: ex.id,
        secondaryMuscles: secondary,
        instructions,
        muscleGroup: ex.muscleGroup
          ? {
              ...ex.muscleGroup,
              _id: ex.muscleGroup.id
            }
          : null
      };
    });

    return res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted
    });
  } catch (error) {
    next(error);
  }
}

export async function getExerciseById(req, res, next) {
  try {
    const exercise = await prisma.exercise.findUnique({
      where: { id: req.params.id },
      include: {
        muscleGroup: {
          select: { id: true, name: true, description: true }
        }
      }
    });

    if (!exercise) {
      throw ApiError.notFound('Ejercicio no encontrado en PostgreSQL');
    }

    let secondary = [];
    let instructions = [];
    try {
      secondary = JSON.parse(exercise.secondaryMuscles || '[]');
    } catch (e) {
      secondary = [];
    }
    try {
      instructions = JSON.parse(exercise.instructions || '[]');
    } catch (e) {
      instructions = [];
    }

    const formatted = {
      ...exercise,
      _id: exercise.id,
      secondaryMuscles: secondary,
      instructions,
      muscleGroup: exercise.muscleGroup
        ? {
            ...exercise.muscleGroup,
            _id: exercise.muscleGroup.id
          }
        : null
    };

    return res.status(200).json({
      success: true,
      data: formatted
    });
  } catch (error) {
    next(error);
  }
}
