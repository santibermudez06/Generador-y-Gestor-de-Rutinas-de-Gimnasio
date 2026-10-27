import { prisma } from '../config/database.js';
import { ApiError } from '../middleware/errorHandler.js';

function formatRoutine(r) {
  return {
    ...r,
    _id: r.id,
    exercises: (r.exercises || []).map((item) => ({
      ...item,
      _id: item.id,
      exercise: item.exercise
        ? {
            ...item.exercise,
            _id: item.exercise.id,
            muscleGroup: item.exercise.muscleGroup
              ? {
                  ...item.exercise.muscleGroup,
                  _id: item.exercise.muscleGroup.id
                }
              : null
          }
        : null
    }))
  };
}

export async function getRoutines(req, res, next) {
  try {
    const { difficulty, search } = req.query;
    const where = { userId: req.user.id };

    if (difficulty && ['beginner', 'intermediate', 'advanced'].includes(difficulty)) {
      where.difficulty = difficulty;
    }

    if (search && typeof search === 'string' && search.trim()) {
      where.name = { contains: search.trim(), mode: 'insensitive' };
    }

    const routines = await prisma.routine.findMany({
      where,
      include: {
        exercises: {
          orderBy: { order: 'asc' },
          include: {
            exercise: {
              include: { muscleGroup: true }
            }
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    const formatted = routines.map(formatRoutine);

    return res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted
    });
  } catch (error) {
    next(error);
  }
}

export async function getRoutineById(req, res, next) {
  try {
    const routine = await prisma.routine.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: {
        exercises: {
          orderBy: { order: 'asc' },
          include: {
            exercise: {
              include: { muscleGroup: true }
            }
          }
        }
      }
    });

    if (!routine) {
      throw ApiError.notFound('Rutina no encontrada o no pertenece al usuario');
    }

    return res.status(200).json({
      success: true,
      data: formatRoutine(routine)
    });
  } catch (error) {
    next(error);
  }
}

export async function createRoutine(req, res, next) {
  try {
    const { name, description, difficulty, estimatedDuration, exercises } = req.body;

    if (!name || !name.trim()) {
      throw ApiError.badRequest('El nombre de la rutina es obligatorio');
    }

    const routine = await prisma.routine.create({
      data: {
        userId: req.user.id,
        name: name.trim(),
        description: description ? description.trim() : '',
        difficulty: difficulty || 'intermediate',
        estimatedDuration: Number(estimatedDuration) || 60,
        exercises: {
          create: Array.isArray(exercises)
            ? exercises.map((item, idx) => ({
                exerciseId: item.exercise?._id || item.exercise?.id || item.exercise,
                order: typeof item.order === 'number' ? item.order : idx,
                targetSets: Number(item.targetSets) || 3,
                targetReps: Number(item.targetReps) || 10,
                targetWeight: Number(item.targetWeight) || 0,
                restSeconds: Number(item.restSeconds) || 90
              }))
            : []
        }
      },
      include: {
        exercises: {
          orderBy: { order: 'asc' },
          include: {
            exercise: {
              include: { muscleGroup: true }
            }
          }
        }
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Rutina creada con éxito en FORGE (PostgreSQL)',
      data: formatRoutine(routine)
    });
  } catch (error) {
    next(error);
  }
}

export async function updateRoutine(req, res, next) {
  try {
    const { name, description, difficulty, estimatedDuration, exercises } = req.body;
    const { id } = req.params;

    const existing = await prisma.routine.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!existing) {
      throw ApiError.notFound('Rutina no encontrada');
    }

    // Actualizar campos base y reconstruir ejercicios si se envían
    await prisma.$transaction(async (tx) => {
      await tx.routine.update({
        where: { id },
        data: {
          name: name !== undefined ? name.trim() : undefined,
          description: description !== undefined ? description.trim() : undefined,
          difficulty: difficulty !== undefined ? difficulty : undefined,
          estimatedDuration: estimatedDuration !== undefined ? Number(estimatedDuration) : undefined
        }
      });

      if (Array.isArray(exercises)) {
        await tx.routineExercise.deleteMany({ where: { routineId: id } });
        if (exercises.length > 0) {
          await tx.routineExercise.createMany({
            data: exercises.map((item, idx) => ({
              routineId: id,
              exerciseId: item.exercise?._id || item.exercise?.id || item.exercise,
              order: typeof item.order === 'number' ? item.order : idx,
              targetSets: Number(item.targetSets) || 3,
              targetReps: Number(item.targetReps) || 10,
              targetWeight: Number(item.targetWeight) || 0,
              restSeconds: Number(item.restSeconds) || 90
            }))
          });
        }
      }
    });

    const updated = await prisma.routine.findUnique({
      where: { id },
      include: {
        exercises: {
          orderBy: { order: 'asc' },
          include: {
            exercise: {
              include: { muscleGroup: true }
            }
          }
        }
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Rutina actualizada correctamente',
      data: formatRoutine(updated)
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteRoutine(req, res, next) {
  try {
    const { id } = req.params;

    const existing = await prisma.routine.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!existing) {
      throw ApiError.notFound('Rutina no encontrada');
    }

    await prisma.routine.delete({ where: { id } });

    return res.status(200).json({
      success: true,
      message: 'Rutina eliminada correctamente'
    });
  } catch (error) {
    next(error);
  }
}

export async function duplicateRoutine(req, res, next) {
  try {
    const { id } = req.params;

    const original = await prisma.routine.findFirst({
      where: { id, userId: req.user.id },
      include: { exercises: true }
    });

    if (!original) {
      throw ApiError.notFound('Rutina original no encontrada');
    }

    const duplicated = await prisma.routine.create({
      data: {
        userId: req.user.id,
        name: `${original.name} (Copia)`,
        description: original.description,
        difficulty: original.difficulty,
        estimatedDuration: original.estimatedDuration,
        exercises: {
          create: original.exercises.map((item) => ({
            exerciseId: item.exerciseId,
            order: item.order,
            targetSets: item.targetSets,
            targetReps: item.targetReps,
            targetWeight: item.targetWeight,
            restSeconds: item.restSeconds
          }))
        }
      },
      include: {
        exercises: {
          orderBy: { order: 'asc' },
          include: {
            exercise: {
              include: { muscleGroup: true }
            }
          }
        }
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Rutina duplicada con éxito',
      data: formatRoutine(duplicated)
    });
  } catch (error) {
    next(error);
  }
}

export async function addExerciseToRoutine(req, res, next) {
  try {
    const { exerciseId, targetSets, targetReps, targetWeight, restSeconds } = req.body;
    const { id: routineId } = req.params;

    if (!exerciseId) {
      throw ApiError.badRequest('El exerciseId es obligatorio');
    }

    const routine = await prisma.routine.findFirst({
      where: { id: routineId, userId: req.user.id },
      include: { exercises: true }
    });

    if (!routine) {
      throw ApiError.notFound('Rutina no encontrada');
    }

    const nextOrder = routine.exercises.length;

    await prisma.routineExercise.create({
      data: {
        routineId,
        exerciseId,
        order: nextOrder,
        targetSets: Number(targetSets) || 3,
        targetReps: Number(targetReps) || 10,
        targetWeight: Number(targetWeight) || 0,
        restSeconds: Number(restSeconds) || 90
      }
    });

    const populated = await prisma.routine.findUnique({
      where: { id: routineId },
      include: {
        exercises: {
          orderBy: { order: 'asc' },
          include: {
            exercise: {
              include: { muscleGroup: true }
            }
          }
        }
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Ejercicio añadido a la rutina',
      data: formatRoutine(populated)
    });
  } catch (error) {
    next(error);
  }
}

export async function updateRoutineExercise(req, res, next) {
  try {
    const { targetSets, targetReps, targetWeight, restSeconds, order } = req.body;
    const { id: routineId, exerciseId } = req.params;

    const routine = await prisma.routine.findFirst({
      where: { id: routineId, userId: req.user.id }
    });

    if (!routine) {
      throw ApiError.notFound('Rutina no encontrada');
    }

    const item = await prisma.routineExercise.findFirst({
      where: {
        routineId,
        OR: [{ id: exerciseId }, { exerciseId }]
      }
    });

    if (!item) {
      throw ApiError.notFound('El ejercicio no se encuentra en la rutina');
    }

    await prisma.routineExercise.update({
      where: { id: item.id },
      data: {
        targetSets: targetSets !== undefined ? Number(targetSets) : undefined,
        targetReps: targetReps !== undefined ? Number(targetReps) : undefined,
        targetWeight: targetWeight !== undefined ? Number(targetWeight) : undefined,
        restSeconds: restSeconds !== undefined ? Number(restSeconds) : undefined,
        order: order !== undefined ? Number(order) : undefined
      }
    });

    const populated = await prisma.routine.findUnique({
      where: { id: routineId },
      include: {
        exercises: {
          orderBy: { order: 'asc' },
          include: {
            exercise: {
              include: { muscleGroup: true }
            }
          }
        }
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Configuración de ejercicio actualizada',
      data: formatRoutine(populated)
    });
  } catch (error) {
    next(error);
  }
}

export async function removeExerciseFromRoutine(req, res, next) {
  try {
    const { id: routineId, exerciseId } = req.params;

    const routine = await prisma.routine.findFirst({
      where: { id: routineId, userId: req.user.id }
    });

    if (!routine) {
      throw ApiError.notFound('Rutina no encontrada');
    }

    const item = await prisma.routineExercise.findFirst({
      where: {
        routineId,
        OR: [{ id: exerciseId }, { exerciseId }]
      }
    });

    if (!item) {
      throw ApiError.notFound('El ejercicio no estaba presente en esta rutina');
    }

    await prisma.routineExercise.delete({ where: { id: item.id } });

    // Reordenar
    const remaining = await prisma.routineExercise.findMany({
      where: { routineId },
      orderBy: { order: 'asc' }
    });

    for (let i = 0; i < remaining.length; i++) {
      if (remaining[i].order !== i) {
        await prisma.routineExercise.update({
          where: { id: remaining[i].id },
          data: { order: i }
        });
      }
    }

    const populated = await prisma.routine.findUnique({
      where: { id: routineId },
      include: {
        exercises: {
          orderBy: { order: 'asc' },
          include: {
            exercise: {
              include: { muscleGroup: true }
            }
          }
        }
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Ejercicio removido de la rutina',
      data: formatRoutine(populated)
    });
  } catch (error) {
    next(error);
  }
}
