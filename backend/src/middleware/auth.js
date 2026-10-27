import jwt from 'jsonwebtoken';
import { prisma } from '../config/database.js';
import { ApiError } from './errorHandler.js';

export function generateToken(userId) {
  const secret = process.env.JWT_SECRET || 'forge_jwt_fallback_secret_32_characters';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ id: userId }, secret, { expiresIn });
}

export function getCookieOptions() {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
  };
}

export async function authenticate(req, res, next) {
  try {
    let token = null;

    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw ApiError.unauthorized('No autenticado. Por favor inicie sesión');
    }

    const secret = process.env.JWT_SECRET || 'forge_jwt_fallback_secret_32_characters';
    const decoded = jwt.verify(token, secret);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        preferredWeightUnit: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      throw ApiError.unauthorized('Usuario no encontrado o sesión inválida');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}
