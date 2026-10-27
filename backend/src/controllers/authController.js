import bcrypt from 'bcryptjs';
import { prisma } from '../config/database.js';
import { ApiError } from '../middleware/errorHandler.js';
import { generateToken, getCookieOptions } from '../middleware/auth.js';

export async function register(req, res, next) {
  try {
    const { name, email, password, preferredWeightUnit } = req.body;

    if (!name || !email || !password) {
      throw ApiError.badRequest('Nombre, correo electrónico y contraseña son obligatorios');
    }

    if (password.length < 6) {
      throw ApiError.badRequest('La contraseña debe tener al menos 6 caracteres');
    }

    const cleanEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail }
    });

    if (existingUser) {
      throw ApiError.conflict('El correo electrónico ya se encuentra registrado');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        passwordHash,
        preferredWeightUnit: preferredWeightUnit === 'lb' ? 'lb' : 'kg'
      },
      select: {
        id: true,
        name: true,
        email: true,
        preferredWeightUnit: true,
        role: true,
        createdAt: true
      }
    });

    const token = generateToken(user.id);
    res.cookie('token', token, getCookieOptions());

    return res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente en FORGE',
      token,
      data: {
        user: {
          _id: user.id,
          id: user.id,
          name: user.name,
          email: user.email,
          preferredWeightUnit: user.preferredWeightUnit,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw ApiError.badRequest('Debe proporcionar correo electrónico y contraseña');
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail }
    });

    if (!user) {
      throw ApiError.unauthorized('Credenciales incorrectas');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw ApiError.unauthorized('Credenciales incorrectas');
    }

    const token = generateToken(user.id);
    res.cookie('token', token, getCookieOptions());

    return res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso',
      token,
      data: {
        user: {
          _id: user.id,
          id: user.id,
          name: user.name,
          email: user.email,
          preferredWeightUnit: user.preferredWeightUnit,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res, next) {
  try {
    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie('token', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax'
    });

    return res.status(200).json({
      success: true,
      message: 'Sesión cerrada correctamente'
    });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req, res, next) {
  try {
    return res.status(200).json({
      success: true,
      data: {
        user: {
          ...req.user,
          _id: req.user.id
        }
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function updatePreferences(req, res, next) {
  try {
    const { name, preferredWeightUnit } = req.body;
    const updates = {};

    if (name && typeof name === 'string' && name.trim().length >= 2) {
      updates.name = name.trim();
    }

    if (preferredWeightUnit && ['kg', 'lb'].includes(preferredWeightUnit)) {
      updates.preferredWeightUnit = preferredWeightUnit;
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: updates,
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

    return res.status(200).json({
      success: true,
      message: 'Preferencias actualizadas',
      data: {
        user: {
          ...updatedUser,
          _id: updatedUser.id
        }
      }
    });
  } catch (error) {
    next(error);
  }
}
