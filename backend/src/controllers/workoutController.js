import { prisma } from '../config/database.js';
import { ApiError } from '../middleware/errorHandler.js';

function formatWorkout(w) {
  if (!w) return null;
  const sets = (w.sets || []).map((s) => ({
    ...s,
    _id: s.id,
    exercise: s.exercise
      ? {
          ...s.exercise,
          _id: s.exercise.id,
          muscleGroup: s.exercise.muscleGroup
            ? {
                ...s.exercise.muscleGroup,
                _id: s.exercise.muscleGroup.id
              }
            : null
        }
      : null
  }));

  const totalVol = sets.reduce((sum, s) => {
    return s.completed ? sum + (s.weight || 0) * (s.repetitions || 0) : sum;
  }, 0);

  return {
    ...w,
    _id: w.id,
    routine: w.routine ? { ...w.routine, _id: w.routine.id } : null,
    sets,
    totalVolume: totalVol,
    completedSetsCount: sets.filter((s) => s.completed).length
  };
}

export async function getActiveWorkout(req, res, next) {
  try {
    const active = await prisma.workoutSession.findFirst({
      where: {
        userId: req.user.id,
        status: 'in_progress'
      },
      include: {
        routine: true,
        sets: {
          orderBy: { setNumber: 'asc' },
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
      data: formatWorkout(active)
    });
  } catch (error) {
    next(error);
  }
}

export async function getWorkouts(req, res, next) {
  try {
    const { status, limit = 20, page = 1 } = req.query;
    const where = { userId: req.user.id };

    if (status && ['in_progress', 'completed'].includes(status)) {
      where.status = status;
    }

    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    const [workouts, total] = await Promise.all([
      prisma.workoutSession.findMany({
        where,
        include: {
          routine: true,
          sets: {
            orderBy: { setNumber: 'asc' },
            include: {
              exercise: {
                include: { muscleGroup: true }
              }
            }
          }
        },
        orderBy: { startedAt: 'desc' },
        take,
        skip
      }),
      prisma.workoutSession.count({ where })
    ]);

    const formatted = workouts.map(formatWorkout);

    return res.status(200).json({
      success: true,
      count: formatted.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / take),
      data: formatted
    });
  } catch (error) {
    next(error);
  }
}

export async function getWorkoutById(req, res, next) {
  try {
    const workout = await prisma.workoutSession.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: {
        routine: true,
        sets: {
          orderBy: { setNumber: 'asc' },
          include: {
            exercise: {
              include: { muscleGroup: true }
            }
          }
        }
      }
    });

    if (!workout) {
      throw ApiError.notFound('Sesión de entrenamiento no encontrada');
    }

    return res.status(200).json({
      success: true,
      data: formatWorkout(workout)
    });
  } catch (error) {
    next(error);
  }
}

export async function createWorkout(req, res, next) {
  try {
    const { routineId, name } = req.body;

    // Verificar si ya existe una sesión en curso
    const existing = await prisma.workoutSession.findFirst({
      where: {
        userId: req.user.id,
        status: 'in_progress'
      },
      include: {
        routine: true,
        sets: {
          orderBy: { setNumber: 'asc' },
          include: {
            exercise: {
              include: { muscleGroup: true }
            }
          }
        }
      }
    });

    if (existing) {
      return res.status(200).json({
        success: true,
        message: 'Ya existe una sesión de entrenamiento activa',
        data: formatWorkout(existing),
        alreadyActive: true
      });
    }

    let workoutName = name || 'Entrenamiento Libre';
    let routineRef = null;
    const initialSetsData = [];

    if (routineId) {
      const routine = await prisma.routine.findFirst({
        where: { id: routineId, userId: req.user.id },
        include: {
          exercises: {
            orderBy: { order: 'asc' }
          }
        }
      });

      if (!routine) {
        throw ApiError.notFound('La rutina seleccionada no existe o no pertenece al usuario');
      }

      routineRef = routine.id;
      workoutName = name || routine.name;

      for (const item of routine.exercises) {
        const count = item.targetSets || 3;
        for (let s = 1; s <= count; s++) {
          initialSetsData.push({
            exerciseId: item.exerciseId,
            setNumber: s,
            weight: item.targetWeight || 0,
            repetitions: item.targetReps || 10,
            completed: false
          });
        }
      }
    }

    const session = await prisma.workoutSession.create({
      data: {
        userId: req.user.id,
        routineId: routineRef,
        name: workoutName,
        status: 'in_progress',
        startedAt: new Date(),
        sets: {
          create: initialSetsData
        }
      },
      include: {
        routine: true,
        sets: {
          orderBy: { setNumber: 'asc' },
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
      message: 'Sesión de entrenamiento iniciada en FORGE (PostgreSQL)',
      data: formatWorkout(session)
    });
  } catch (error) {
    next(error);
  }
}

export async function updateWorkout(req, res, next) {
  try {
    const { name, durationSeconds } = req.body;
    const { id } = req.params;

    const existing = await prisma.workoutSession.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!existing) {
      throw ApiError.notFound('Sesión de entrenamiento no encontrada');
    }

    const updated = await prisma.workoutSession.update({
      where: { id },
      data: {
        name: name !== undefined ? name.trim() : undefined,
        durationSeconds: durationSeconds !== undefined ? Number(durationSeconds) : undefined
      },
      include: {
        routine: true,
        sets: {
          orderBy: { setNumber: 'asc' },
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
      data: formatWorkout(updated)
    });
  } catch (error) {
    next(error);
  }
}

export async function addSetToWorkout(req, res, next) {
  try {
    const { exerciseId, setNumber, weight, repetitions, completed } = req.body;
    const { id: workoutSessionId } = req.params;

    const workout = await prisma.workoutSession.findFirst({
      where: { id: workoutSessionId, userId: req.user.id },
      include: { sets: true }
    });

    if (!workout) {
      throw ApiError.notFound('Sesión de entrenamiento no encontrada');
    }

    const existingSets = workout.sets.filter((s) => s.exerciseId === exerciseId);
    const calculatedNumber = setNumber || existingSets.length + 1;

    await prisma.workoutSet.create({
      data: {
        workoutSessionId,
        exerciseId,
        setNumber: calculatedNumber,
        weight: Number(weight) || 0,
        repetitions: Number(repetitions) || 0,
        completed: Boolean(completed)
      }
    });

    const populated = await prisma.workoutSession.findUnique({
      where: { id: workoutSessionId },
      include: {
        routine: true,
        sets: {
          orderBy: { setNumber: 'asc' },
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
      message: 'Serie registrada exitosamente',
      data: formatWorkout(populated)
    });
  } catch (error) {
    next(error);
  }
}

export async function updateSetInWorkout(req, res, next) {
  try {
    const { id: workoutSessionId, setId } = req.params;
    const { weight, repetitions, completed, rpe } = req.body;

    const workout = await prisma.workoutSession.findFirst({
      where: { id: workoutSessionId, userId: req.user.id }
    });

    if (!workout) {
      throw ApiError.notFound('Sesión de entrenamiento no encontrada');
    }

    const setItem = await prisma.workoutSet.findFirst({
      where: { id: setId, workoutSessionId }
    });

    if (!setItem) {
      throw ApiError.notFound('Serie no encontrada dentro de esta sesión');
    }

    await prisma.workoutSet.update({
      where: { id: setId },
      data: {
        weight: weight !== undefined ? Math.max(0, Number(weight)) : undefined,
        repetitions: repetitions !== undefined ? Math.max(0, Number(repetitions)) : undefined,
        completed: completed !== undefined ? Boolean(completed) : undefined,
        rpe: rpe !== undefined ? Number(rpe) : undefined,
        recordedAt: completed ? new Date() : undefined
      }
    });

    const populated = await prisma.workoutSession.findUnique({
      where: { id: workoutSessionId },
      include: {
        routine: true,
        sets: {
          orderBy: { setNumber: 'asc' },
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
      message: 'Serie actualizada correctamente',
      data: formatWorkout(populated)
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteSetFromWorkout(req, res, next) {
  try {
    const { id: workoutSessionId, setId } = req.params;

    const workout = await prisma.workoutSession.findFirst({
      where: { id: workoutSessionId, userId: req.user.id }
    });

    if (!workout) {
      throw ApiError.notFound('Sesión de entrenamiento no encontrada');
    }

    const setItem = await prisma.workoutSet.findFirst({
      where: { id: setId, workoutSessionId }
    });

    if (!setItem) {
      throw ApiError.notFound('Serie no encontrada');
    }

    const exerciseId = setItem.exerciseId;
    await prisma.workoutSet.delete({ where: { id: setId } });

    // Renumerar
    const remaining = await prisma.workoutSet.findMany({
      where: { workoutSessionId, exerciseId },
      orderBy: { setNumber: 'asc' }
    });

    for (let i = 0; i < remaining.length; i++) {
      if (remaining[i].setNumber !== i + 1) {
        await prisma.workoutSet.update({
          where: { id: remaining[i].id },
          data: { setNumber: i + 1 }
        });
      }
    }

    const populated = await prisma.workoutSession.findUnique({
      where: { id: workoutSessionId },
      include: {
        routine: true,
        sets: {
          orderBy: { setNumber: 'asc' },
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
      message: 'Serie eliminada de la sesión',
      data: formatWorkout(populated)
    });
  } catch (error) {
    next(error);
  }
}

export async function finishWorkout(req, res, next) {
  try {
    const { id: workoutSessionId } = req.params;
    const { durationSeconds } = req.body;

    const workout = await prisma.workoutSession.findFirst({
      where: { id: workoutSessionId, userId: req.user.id }
    });

    if (!workout) {
      throw ApiError.notFound('Sesión de entrenamiento no encontrada');
    }

    const now = new Date();
    let duration = Number(durationSeconds) || 0;
    if (duration <= 0) {
      duration = Math.max(
        Math.round((now.getTime() - new Date(workout.startedAt).getTime()) / 1000),
        60
      );
    }

    const finished = await prisma.workoutSession.update({
      where: { id: workoutSessionId },
      data: {
        status: 'completed',
        completedAt: now,
        durationSeconds: duration
      },
      include: {
        routine: true,
        sets: {
          orderBy: { setNumber: 'asc' },
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
      message: '¡Entrenamiento finalizado con éxito! Datos guardados en PostgreSQL',
      data: formatWorkout(finished)
    });
  } catch (error) {
    next(error);
  }
}
