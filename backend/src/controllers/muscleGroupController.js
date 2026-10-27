import { prisma } from '../config/database.js';

export async function getMuscleGroups(req, res, next) {
  try {
    const groups = await prisma.muscleGroup.findMany({
      orderBy: { name: 'asc' }
    });

    const formatted = groups.map((g) => ({
      ...g,
      _id: g.id
    }));

    return res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted
    });
  } catch (error) {
    next(error);
  }
}
