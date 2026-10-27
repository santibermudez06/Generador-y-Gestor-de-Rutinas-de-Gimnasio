import dotenv from 'dotenv';
import app from './app.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';

dotenv.config();

const PORT = process.env.PORT || 4000;

let server = null;

async function startServer() {
  try {
    console.log('='.repeat(55));
    console.log('   FORGE — GYM PERFORMANCE SERVER');
    console.log('   Iniciando verificación y conexión con PostgreSQL...');
    console.log('='.repeat(55));

    // Conexión obligatoria a PostgreSQL mediante Prisma antes de abrir el puerto
    await connectDatabase();

    server = app.listen(PORT, () => {
      console.log(`[FORGE API] Servidor activo y escuchando en el puerto ${PORT}`);
      console.log(`[FORGE API] Base URL: http://localhost:${PORT}/api`);
      console.log(`[FORGE API] Base de Datos: PostgreSQL (Prisma ORM)`);
      console.log(`[FORGE API] Entorno: ${process.env.NODE_ENV || 'development'}`);
      console.log('='.repeat(55));
    });
  } catch (error) {
    console.error('\n' + '!'.repeat(55));
    console.error(' [ERROR CRÍTICO] NO SE PUDO INICIAR EL SERVIDOR DE FORGE');
    console.error(' Motivo:', error.message);
    console.error('!'.repeat(55));
    console.error('\nPara conectar el backend con PostgreSQL, asegúrese de:');
    console.error('1. Tener PostgreSQL iniciado en su equipo o servidor.');
    console.error('2. Especificar una cadena de conexión válida en backend/.env:');
    console.error('   DATABASE_URL="postgresql://postgres:admin@localhost:5432/forge_gym?schema=public"');
    console.error('3. Ejecutar `npx prisma db push` para asegurar que las tablas existan.');
    console.error('!'.repeat(55) + '\n');

    process.exit(1);
  }
}

// Cierre ordenado del servidor y de la base de datos (Graceful Shutdown)
async function gracefulShutdown(signal) {
  console.log(`\n[FORGE API] Recibida señal ${signal}. Cerrando servidor ordenadamente...`);
  if (server) {
    server.close(async () => {
      console.log('[FORGE API] Conexiones HTTP entrantes finalizadas.');
      await disconnectDatabase();
      console.log('[FORGE API] Proceso terminado limpiamente.');
      process.exit(0);
    });
  } else {
    await disconnectDatabase();
    process.exit(0);
  }
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

startServer();
