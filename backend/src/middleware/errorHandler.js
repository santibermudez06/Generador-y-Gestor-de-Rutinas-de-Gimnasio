export class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(msg = 'Petición inválida', errors = []) {
    return new ApiError(400, msg, errors);
  }

  static unauthorized(msg = 'No autorizado') {
    return new ApiError(401, msg);
  }

  static forbidden(msg = 'Acceso denegado a este recurso') {
    return new ApiError(403, msg);
  }

  static notFound(msg = 'Recurso no encontrado') {
    return new ApiError(404, msg);
  }

  static conflict(msg = 'Conflicto con recurso existente') {
    return new ApiError(409, msg);
  }

  static internal(msg = 'Error interno del servidor') {
    return new ApiError(500, msg);
  }
}

export function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Error interno del servidor';
  let errors = err.errors || [];

  // Error de clave única en Prisma (código P2002)
  if (err.code === 'P2002') {
    statusCode = 409;
    const targets = Array.isArray(err.meta?.target) ? err.meta.target.join(', ') : 'campo';
    message = `Ya existe un registro con ese valor para: ${targets}`;
    errors = [`El campo '${targets}' ya se encuentra registrado`];
  }

  // Registro no encontrado en Prisma (código P2025)
  if (err.code === 'P2025') {
    statusCode = 404;
    message = 'El registro solicitado no existe en la base de datos';
  }

  // Error de clave foránea en Prisma (código P2003)
  if (err.code === 'P2003') {
    statusCode = 400;
    message = 'Referencia inválida a un recurso relacionado';
  }

  // Errores de JWT
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token de autenticación inválido';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'La sesión ha expirado. Por favor inicie sesión nuevamente';
  }

  if (process.env.NODE_ENV !== 'production' && statusCode === 500) {
    console.error('[Unhandled Exception]:', err);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errors: errors.length > 0 ? errors : undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}
