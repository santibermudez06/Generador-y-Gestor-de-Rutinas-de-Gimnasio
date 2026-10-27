# LISTA DE TAREAS Y SEGUIMIENTO — FORGE: GYM PERFORMANCE

- [x] **Fase 1: Inspección, Planificación y Extracción del Prototipo Stitch**
  - [x] Inspeccionar directorio de trabajo y verificar dependencias
  - [x] Extraer archivo `stitch_forge_gym_performance_platform.zip`
  - [x] Inspeccionar `DESIGN.md` y las 6 pantallas diseñadas en Stitch (`code.html` y capturas)
  - [x] Extraer activo de escaneo anatómico biomecánico (`biomechanical-avatar.png`)
  - [x] Crear y actualizar `PLAN.md` y `TASKS.md`

- [x] **Fase 2: Base de Datos Relacional y Prisma ORM (PostgreSQL)**
  - [x] Detectar servicio local de PostgreSQL 18 activo en puerto 5432
  - [x] Crear base de datos dedicada `forge_gym`
  - [x] Definir esquema relacional en `backend/prisma/schema.prisma` (`User`, `MuscleGroup`, `Exercise`, `Routine`, `RoutineExercise`, `WorkoutSession`, `WorkoutSet`)
  - [x] Sincronizar modelos con la base de datos mediante `npx prisma db push`
  - [x] Generar cliente tipado de Prisma (`@prisma/client`)
  - [x] Crear semilla idempotente (`backend/scripts/seed.js`) con 9 grupos musculares y 30 ejercicios
  - [x] Crear script de diagnóstico `backend/scripts/verify-connection.js` y validar conexión

- [x] **Fase 3: Backend REST con Express y Prisma**
  - [x] Crear singleton de Prisma en `backend/src/config/database.js` con soporte para graceful shutdown
  - [x] Implementar middleware de autenticación JWT y extracción de usuario (`auth.js`)
  - [x] Implementar manejador centralizado de errores con soporte para excepciones Prisma (`P2002`, `P2025`, `P2003`)
  - [x] Implementar middleware de validación de identificadores de clave primaria (`validateObjectId.js`)
  - [x] Implementar controlador de autenticación (`authController.js`) con hash bcrypt
  - [x] Implementar controladores de taxonomía (`muscleGroupController.js` y `exerciseController.js`)
  - [x] Implementar controlador de rutinas (`routineController.js`) con transacciones compuestas
  - [x] Implementar controlador de entrenamientos (`workoutController.js`) para sesiones en vivo y registro de series
  - [x] Implementar controlador de analíticas (`statsController.js`) con cálculo de volumen, frecuencia y 1RM (Brzycki)
  - [x] Crear suite de pruebas de backend (`backend/tests/api.test.js`) con 6/6 tests aprobados

- [x] **Fase 4: Frontend — Integración del Sistema de Diseño Stitch**
  - [x] Instalar y configurar Tailwind CSS v3 con los tokens exactos de Stitch en `tailwind.config.js`
  - [x] Cargar fuentes oficiales en `index.html`: `Barlow Condensed`, `Inter` y `Material Symbols Outlined`
  - [x] Configurar paleta Obsidian (`#090B0A`, `#121413`, `#1A1C1B`) y Volt Lime (`#BEF500`, `#C6FF00`, `#AADD2F`)
  - [x] Implementar `LoginPage.jsx` fiel a `forge_login_biomec_nico_pro`: visor kinético con escaneo 3D, tabs de credenciales / QR y telemetría en vivo
  - [x] Implementar `RegisterPage.jsx` fiel a `forge_registro_calibraci_n_de_atleta`: onboarding en 3 pasos con calibración EMG y campos biométricos
  - [x] Implementar `Sidebar.jsx` y `Navbar.jsx`: barra lateral fija de 72px, badges de estado en vivo y buscador
  - [x] Implementar `DashboardPage.jsx` fiel a `forge_dashboard_principal`: 4 métricas telemétricas, gráfico de carga semanal y tarjeta de sesión recomendada
  - [x] Implementar `RoutinesPage.jsx` fiel a `forge_mis_rutinas`: catálogo de protocolos, cintas de resumen telemétrico y acciones rápidas
  - [x] Implementar `ExercisesPage.jsx` fiel a `forge_biblioteca_de_ejercicios`: buscador omnibox, píldoras por músculo y modal de técnica
  - [x] Adaptar `ActiveWorkoutPage.jsx` con compatibilidad para claves de PostgreSQL y registro de series en vivo
  - [x] Compilar y verificar el bundle de producción en Vite (`npm run build` exitoso sin errores)

- [x] **Fase 5: Documentación y Parámetros de Conexión DBeaver / pgAdmin**
  - [x] Actualizar `PLAN.md` con la arquitectura PostgreSQL + Prisma + Stitch
  - [x] Actualizar `TASKS.md` con el estado final verificado
  - [x] Actualizar `README.md` con instrucciones completas de instalación, ejecución y conexión a PostgreSQL desde DBeaver y pgAdmin
  - [x] Proporcionar al usuario las credenciales exactas de conexión a la base de datos en DBeaver
