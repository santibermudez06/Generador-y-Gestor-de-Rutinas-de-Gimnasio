import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { generateToken, getCookieOptions } from '../src/middleware/auth.js';
import { ApiError } from '../src/middleware/errorHandler.js';

describe('FORGE — Gym Performance: Test Suite de Backend (PostgreSQL + Prisma)', () => {

  describe('1. Seguridad y Autenticación', () => {
    test('Debe generar un hash seguro con bcrypt y compararlo correctamente', async () => {
      const password = 'SecretPassword123!';
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      assert.notEqual(hash, password);
      assert.ok(hash.startsWith('$2'));

      const isMatch = await bcrypt.compare(password, hash);
      assert.equal(isMatch, true);

      const isWrongMatch = await bcrypt.compare('WrongPassword', hash);
      assert.equal(isWrongMatch, false);
    });

    test('Debe generar y verificar tokens JWT con expiración configurada', () => {
      process.env.JWT_SECRET = 'test_jwt_secret_key_at_least_32_characters';
      const fakeUserId = 'c1234567-89ab-cdef-0123-456789abcdef';

      const token = generateToken(fakeUserId);
      assert.ok(typeof token === 'string');
      assert.ok(token.length > 20);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      assert.equal(decoded.id, fakeUserId);
      assert.ok(decoded.exp > decoded.iat);
    });

    test('getCookieOptions debe retornar configuración HttpOnly y SameSite segura', () => {
      const options = getCookieOptions();
      assert.equal(options.httpOnly, true);
      assert.ok(['lax', 'none'].includes(options.sameSite));
      assert.ok(options.maxAge > 0);
    });
  });

  describe('2. Cálculos de Volumen y Métricas Deportivas', () => {
    test('Cálculo de volumen debe sumar peso x repeticiones sólo en series completadas', () => {
      const sets = [
        { setNumber: 1, weight: 100, repetitions: 10, completed: true },
        { setNumber: 2, weight: 100, repetitions: 8, completed: true },
        { setNumber: 3, weight: 120, repetitions: 6, completed: false }, // no completada
        { setNumber: 4, weight: 0, repetitions: 15, completed: true }     // calistenia
      ];

      const totalVolume = sets.reduce((sum, s) => {
        return s.completed && s.weight > 0 && s.repetitions > 0
          ? sum + s.weight * s.repetitions
          : sum;
      }, 0);

      const completedCount = sets.filter((s) => s.completed).length;

      // Serie 1: 1000 + Serie 2: 800 = 1800
      assert.equal(totalVolume, 1800);
      assert.equal(completedCount, 3);
    });

    test('Fórmula de 1RM estimada (Brzycki) debe ser matemáticamente consistente', () => {
      const calculateBrzycki1RM = (weight, reps) => {
        if (reps === 1) return weight;
        return Math.round((weight / (1.0278 - 0.0278 * reps)) * 10) / 10;
      };

      assert.equal(calculateBrzycki1RM(100, 1), 100);
      const rm10 = calculateBrzycki1RM(100, 10);
      assert.ok(rm10 > 130 && rm10 < 135);

      const rm5 = calculateBrzycki1RM(100, 5);
      assert.ok(rm10 > rm5);
    });
  });

  describe('3. Gestión de Errores y Excepciones HTTP', () => {
    test('ApiError debe formatear códigos y mensajes HTTP adecuados', () => {
      const notFoundErr = ApiError.notFound('Rutina inexistente');
      assert.equal(notFoundErr.statusCode, 404);
      assert.equal(notFoundErr.message, 'Rutina inexistente');

      const badReqErr = ApiError.badRequest('Datos inválidos', ['Campo requerido']);
      assert.equal(badReqErr.statusCode, 400);
      assert.equal(badReqErr.errors.length, 1);

      const forbiddenErr = ApiError.forbidden();
      assert.equal(forbiddenErr.statusCode, 403);
    });
  });
});
