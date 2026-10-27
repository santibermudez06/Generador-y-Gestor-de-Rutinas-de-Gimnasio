import dotenv from 'dotenv';
import { prisma, connectDatabase, disconnectDatabase } from '../src/config/database.js';

dotenv.config();

async function verifyDatabase() {
  console.log('='.repeat(60));
  console.log(' FORGE: DIAGNÓSTICO DE CONEXIÓN CON POSTGRESQL');
  console.log('='.repeat(60));

  try {
    await connectDatabase();
    console.log('✔ Conexión con PostgreSQL validada.');

    const [userCount, groupCount, exerciseCount, routineCount, workoutCount] = await Promise.all([
      prisma.user.count(),
      prisma.muscleGroup.count(),
      prisma.exercise.count(),
      prisma.routine.count(),
      prisma.workoutSession.count()
    ]);

    console.log('\n--- Estado Actual de Registros en PostgreSQL (forge_gym) ---');
    console.log(`- Usuarios: ${userCount}`);
    console.log(`- Grupos Musculares: ${groupCount}`);
    console.log(`- Ejercicios en Catálogo: ${exerciseCount}`);
    console.log(`- Rutinas Creadas: ${routineCount}`);
    console.log(`- Entrenamientos Registrados: ${workoutCount}`);

    console.log('\n✔ Verificación finalizada con éxito. PostgreSQL listo para operar con FORGE.');
  } catch (error) {
    console.error('\n✖ Falló la prueba de conexión con PostgreSQL:');
    console.error('  Detalle:', error.message);
    process.exitCode = 1;
  } finally {
    await disconnectDatabase();
  }
}

verifyDatabase();
