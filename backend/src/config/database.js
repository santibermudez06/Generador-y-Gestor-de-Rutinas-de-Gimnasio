import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error('\n[FATAL] La variable DATABASE_URL no está definida en backend/.env');
  console.error('Ejemplo: DATABASE_URL="postgresql://postgres:admin@localhost:5432/forge_gym?schema=public"\n');
  process.exit(1);
}

// Instancia singleton de Prisma Client
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error']
});

/**
 * Conexión estricta a PostgreSQL mediante Prisma ORM
 */
export async function connectDatabase() {
  try {
    await prisma.$connect();
    // Test query rápida
    await prisma.$queryRaw`SELECT 1 as connected`;
    console.log('[PostgreSQL / Prisma] Conexión establecida con éxito en PostgreSQL.');
    return prisma;
  } catch (error) {
    console.error('[PostgreSQL / Prisma] Error crítico de conexión:', error.message);
    throw error;
  }
}

/**
 * Cierre ordenado de la conexión Prisma
 */
export async function disconnectDatabase() {
  try {
    await prisma.$disconnect();
    console.log('[PostgreSQL / Prisma] Conexión cerrada de forma segura.');
  } catch (error) {
    console.error('[PostgreSQL / Prisma] Error al desconectar:', error.message);
  }
}
