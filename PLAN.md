# PLAN DE IMPLEMENTACIÓN — FORGE: GYM PERFORMANCE (POSTGRESQL + PRISMA + STITCH DESIGN)

## 1. Visión y Alcance del Proyecto
**FORGE — Gym Performance** es una plataforma web full-stack de alto rendimiento deportivo para la planificación, ejecución y análisis biomecánico de entrenamientos de gimnasio. Permite a los atletas programar rutinas por grupos musculares, ejecutar sesiones en vivo con cronómetro y temporizador de descanso automatizado, registrar series con control de repeticiones y peso, y monitorear la sobrecarga progresiva mediante analíticas avanzadas de volumen y cálculo de 1RM (Brzycki).

La arquitectura se fundamenta en un backend desacoplado con **Node.js 20+, Express y Prisma ORM** conectado a una base de datos relacional persistente **PostgreSQL**, y un frontend reactivo desarrollado en **React, Vite y React Router**, estilizado con fidelidad absoluta al diseño de **Google Stitch** (Athletic High-Contrast Brutalism con Obsidian, Volt Lime, tipografía `Barlow Condensed`, `Inter` y `Material Symbols Outlined`).

---

## 2. Arquitectura del Sistema

### 2.1 Base de Datos Relacional (PostgreSQL + Prisma ORM)
- **Motor de Base de Datos**: PostgreSQL 18 local (Puerto 5432, base de datos `forge_gym`).
- **ORM**: Prisma ORM v6 con tipado estricto y generación de cliente optimizado (`@prisma/client`).
- **Esquema Relacional (`backend/prisma/schema.prisma`)**:
  - `User`: Gestión de cuenta, correo único indexado, contraseña hasheada con bcrypt, unidad de peso preferida (`kg` / `lb`) y marcas de tiempo (`createdAt`, `updatedAt`).
  - `MuscleGroup`: Taxonomía muscular canónica (Pecho, Espalda, Hombros, Bíceps, Tríceps, Cuádriceps, Isquiotibiales, Glúteos, Core/Abdomen).
  - `Exercise`: Catálogo canónico con clave foránea a `MuscleGroup`, descripción, músculos secundarios (JSON array), equipamiento, dificultad e instrucciones técnicas paso a paso.
  - `Routine`: Rutinas del usuario con título, descripción, dificultad y duración estimada.
  - `RoutineExercise`: Tabla intermedia con orden de ejecución (`order`), series meta (`targetSets`), repeticiones objetivo (`targetReps`), peso propuesto (`targetWeight`) y descanso recomendado (`restSeconds`).
  - `WorkoutSession`: Sesiones activas y completadas vinculadas al atleta, con duración real en segundos, estado (`in_progress` o `completed`), RPE percibido y notas.
  - `WorkoutSet`: Registro atómico de cada serie ejecutada (`setNumber`, `weight`, `repetitions`, `rpe`, `type`, `completed`, `recordedAt`).
- **Integridad y Transaccionalidad**:
  - Manejo de borrado en cascada (`onDelete: Cascade`) en tablas hijas.
  - Operaciones compuestas (ej. reordenamiento y guardado de rutinas) ejecutadas en transacciones atómicas con `prisma.$transaction`.
  - Manejo de códigos de error Prisma (`P2002` violación de unicidad, `P2025` registro no encontrado, `P2003` violación de clave foránea).
- **Semilla Idempotente (`seed.js`)**:
  - Poblado inicial de los 9 grupos musculares y 30 ejercicios con verificación previa `findUnique` / `upsert` para evitar duplicidad de registros.

### 2.2 Backend (Node.js + Express)
- **Módulo de Configuración**: Singleton de Prisma Client en `backend/src/config/database.js` con verificación al arranque y `graceful shutdown` al recibir señales `SIGINT`/`SIGTERM`.
- **Seguridad y Autenticación**:
  - Hash de contraseñas con `bcryptjs` (salt rounds = 10).
  - Emisión de tokens **JWT** con 7 días de validez.
  - Autenticación en cookies `HttpOnly` y soporte para cabeceras `Authorization: Bearer <token>`.
  - Middlewares de autenticación, validación de schemas de entrada y manejo centralizado de excepciones con la clase `ApiError`.
- **Controladores REST**:
  - `authController`: Registro, login, verificación de sesión (`/me`), logout y actualización de preferencias.
  - `muscleGroupController` y `exerciseController`: Consulta y filtrado de taxonomía y ejercicios.
  - `routineController`: CRUD de rutinas, duplicación y gestión atómica de ejercicios.
  - `workoutController`: Control de sesión activa en curso, registro en tiempo real de series y finalización de entrenamiento.
  - `statsController`: Telemetría del dashboard, cálculo de volumen semanal, radar de grupos musculares y evolución de 1RM con la fórmula de Brzycki.

### 2.3 Frontend (React + Vite + Tailwind CSS + Stitch Design System)
- **Fidelidad al Prototipo Google Stitch**:
  - Extracción y mapeo completo de las pantallas exportadas en `stitch_forge_gym_performance_platform.zip`.
  - Estética *Athletic Brutalism*: Obsidian `#090B0A` / `#121413`, acentos Volt Lime `#BEF500` / `#C6FF00` / `#AADD2F`, bordes hairline `#282A29`.
  - Tipografías cargadas desde Google Fonts: `Barlow Condensed` (titulares y métricas deportivas), `Inter` (cuerpo técnico y etiquetas) e iconografía `Material Symbols Outlined`.
  - HUD biomecánico en pantallas de autenticación con escaneo anatómico 3D de alta resolución.
- **Pantallas Implementadas**:
  1. `LoginPage`: Cabecera de telemetría TLS 1.3, visor kinético con vista anterior/posterior, selector de credenciales / código QR y formulario con validación.
  2. `RegisterPage`: Onboarding en 3 pasos con calibración EMG, selector biométrico de peso corporal, altura, nivel de entrenamiento y aceptación de términos.
  3. `DashboardPage`: Saludo hero personalizado, cinta de 4 métricas de alto impacto (sesiones, tonelaje, racha, índice de fuerza 1RM), gráfico de barras de carga semanal y tarjeta de sesión recomendada.
  4. `RoutinesPage`: Catálogo de protocolos, cintas de resumen telemétrico, filtros por nivel y botones de acción rápida (iniciar, editar, duplicar, eliminar).
  5. `ExercisesPage`: Catálogo con buscador omnibox, píldoras por grupo muscular, filtros por equipo/dificultad y modal de técnica biomecánica.
  6. `ActiveWorkoutPage`: Cronómetro en vivo, barra de estado de series, temporizador de descanso interactivo con alerta sonora, matriz de series y finalización con cálculo de tonelaje.
  7. `HistoryPage`: Registro cronológico detallado de sesiones anteriores.
  8. `ProgressPage`: Gráficas interactivas con Recharts para volumen acumulado, frecuencia y cálculo de fuerza 1RM.

---

## 3. Criterios de Aceptación Cumplidos

1. **Persistencia Real**: Todos los datos se almacenan en la base de datos PostgreSQL local (`forge_gym`) a través de Prisma ORM. No se utilizan arreglos en memoria ni `localStorage` para la lógica de datos.
2. **Seguridad y Control de Acceso**: Contraseñas hasheadas con bcrypt, sesiones protegidas con JWT, rutas autenticadas y verificación estricta de propiedad de recursos (`403 Forbidden` / `404 Not Found`).
3. **Flujo de Entrenamiento Activo Robusto**: Iniciar sesión desde rutina o libre, añadir/actualizar/eliminar series en tiempo real, cronómetro sincronizado y cálculo de volumen total.
4. **Fidelidad Visual Stitch**: Interfaz idéntica al diseño exportado de Google Stitch, con paleta de colores, tipografías oficiales, escaneo anatómico 3D y componentes responsivos.
5. **Pruebas y Verificación**: Suite de pruebas backend automatizadas aprobadas al 100% y build de frontend con Vite exitoso sin errores.
6. **Administración Visual con DBeaver y pgAdmin**: Documentación completa con credenciales y parámetros de conexión para inspeccionar tablas relacionales.
