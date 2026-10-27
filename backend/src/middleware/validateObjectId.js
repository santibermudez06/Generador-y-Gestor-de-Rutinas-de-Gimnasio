import { ApiError } from './errorHandler.js';

/**
 * Valida que los parámetros de identificadores en la URL sean cadenas válidas
 */
export function validateObjectId(...paramNames) {
  const paramsToCheck = paramNames.length > 0 ? paramNames : ['id'];

  return (req, res, next) => {
    for (const param of paramsToCheck) {
      const value = req.params[param];
      if (value !== undefined && (typeof value !== 'string' || value.trim().length === 0)) {
        return next(
          ApiError.badRequest(
            `El identificador '${param}' con valor '${value}' no es un ID válido.`
          )
        );
      }
    }
    next();
  };
}
