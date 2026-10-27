import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import apiRouter from './routes/index.js';
import { errorHandler, ApiError } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Configuración de CORS permitiendo credenciales (cookies HttpOnly)
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173'
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir peticiones sin origen (por ejemplo Postman, curl o mobile)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // En desarrollo permitir origen
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
);

// Middlewares para parsing de JSON y Cookies
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// Montaje de la API REST
app.use('/api', apiRouter);

// Manejador para rutas no encontradas (404)
app.use('*', (req, res, next) => {
  next(ApiError.notFound(`La ruta ${req.originalUrl} no existe en este servidor`));
});

// Manejador centralizado de errores
app.use(errorHandler);

export default app;

