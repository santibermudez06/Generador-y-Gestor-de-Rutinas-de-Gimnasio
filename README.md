# FORGE — Gym Performance Platform

Plataforma web full-stack de alto rendimiento deportivo para la planificación, ejecución y análisis biomecánico de entrenamientos de gimnasio, construida con **React + Vite**, **Node.js + Express**, **Prisma ORM** y **PostgreSQL**.

La interfaz reproduce fielmente el diseño de **Google Stitch** (*High-Contrast Athletic Brutalism*), con tonos Obsidian, acentos Volt Lime de alta visibilidad, tipografía deportiva `Barlow Condensed` e iconografía `Material Symbols Outlined`.

---

## 1. Características Principales

### 🏋️‍♂️ Gestión de Protocolos y Rutinas
- Creación, edición, duplicación y eliminación de rutinas con confirmación modal.
- Configuración de ejercicios con reordenamiento intuitivo de posición.
- Parámetros por ejercicio: series objetivo, repeticiones meta, peso propuesto y tiempo de descanso sugerido.
- Filtrado rápido por nivel de dificultad (*Principiante*, *Intermedio*, *Avanzado*, *Élite*).

### ⚡ Entrenamiento Activo en Tiempo Real
- Inicio inmediato desde una rutina predefinida o como **Entrenamiento Libre**.
- Cronómetro de sesión en vivo sincronizado con el servidor.
- **Temporizador de descanso interactivo** con alertas visuales y sonoras (Web Audio API), botones para añadir tiempo (+30s / +60s) o saltar.
- Matriz de series con registro instantáneo de peso, repeticiones y verificación de completitud.
- Cálculo en tiempo real del tonelaje acumulado (`peso × repeticiones`).
- Recuperación automática de la sesión activa en caso de recargar el navegador.

### 📚 Biblioteca Biomecánica de Ejercicios
- Catálogo de 30 ejercicios canónicos distribuidos en 9 grupos musculares:
  - *Pecho, Espalda, Hombros, Bíceps, Tríceps, Cuádriceps, Isquiotibiales, Glúteos y Core/Abdomen*.
  - *Ficha técnica con instrucciones detalladas, músculos secundarios, equipamiento y nivel de dificultad*.
- Buscador omnibox y filtros por categoría muscular y tipo de equipo (*Barra, Mancuernas, Polea, Máquina, Peso Corporal*).

### 📊 Telemetría y Analíticas Deportivas
- Dashboard atlético con 4 tarjetas de rendimiento clave (entrenamientos completados, tonelaje semanal, racha y fuerza 1RM).
- Gráfico telemétrico de distribución de carga semanal (Lunes a Domingo).
- Estimación de 1RM histórica basada en la **fórmula de Brzycki**:
  $$\text{1RM} = \frac{\text{Peso}}{1.0278 - (0.0278 \times \text{Repeticiones})}$$
- Soporte para unidades de peso configurables (**Kilogramos `kg`** o **Libras `lb`**).

### 🔒 Autenticación y Seguridad
- Registro con onboarding biométrico y calibración en 3 fases.
- Hash de contraseñas con `bcryptjs` (salt rounds = 10).
- Emisión de tokens **JWT** con expiración de 7 días.
- Almacenamiento seguro en cookies `HttpOnly` y soporte para cabeceras `Authorization: Bearer <token>`.
- Control de propiedad de datos: ningún usuario puede ver o modificar recursos de otro atleta.

---

## 2. Tecnologías Utilizadas

| Capa | Tecnologías |
| :--- | :--- |
| **Frontend** | React 18, Vite 6, Tailwind CSS v3, React Router DOM v6, Recharts, Lucide React, Axios |
| **Diseño** | Google Stitch Design System (`Barlow Condensed`, `Inter`, `Material Symbols Outlined`, Obsidian `#090B0A`/`#121413`, Volt Lime `#BEF500`/`#C6FF00`) |
| **Backend** | Node.js 20+, Express 4 (ES Modules), Prisma ORM v6, bcryptjs, jsonwebtoken, cookie-parser, cors, dotenv |
| **Base de Datos** | PostgreSQL 18 (Relacional, persistente) |
| **Administración DB** | DBeaver, pgAdmin |
| **Pruebas** | Node.js Test Runner (`node:test`, `node:assert`) |

---

## 3. Estructura del Proyecto

```
forge-gym/
├── frontend/                     # Cliente Web React + Vite + Tailwind
│   ├── public/                   # Activos estáticos
│   ├── src/
│   │   ├── assets/               # Imagen biomechanical-avatar.png (Stitch 3D scan)
│   │   ├── components/           # Componentes reutilizables
│   │   │   ├── common/           # Sidebar, Navbar, Modal, Badge, LoadingSpinner
│   │   │   ├── dashboard/        # Tarjetas de estadísticas y listas
│   │   │   ├── exercises/        # Tarjetas y modal de ejercicios
│   │   │   ├── routines/         # RoutineCard y modales
│   │   │   └── workout/          # RestTimerBanner y controles
│   │   ├── context/              # AuthContext, ActiveWorkoutContext
│   │   ├── layouts/              # MainLayout con barra lateral de 72px
│   │   ├── pages/                # Vistas principales (Login, Register, Dashboard, Rutinas, etc.)
│   │   ├── services/             # Clientes de API REST (Axios)
│   │   └── styles/               # index.css con utilidades de Tailwind
│   ├── index.html                # Fuentes Barlow Condensed, Inter y Material Symbols
│   ├── tailwind.config.js        # Tokens de color y tipografía de Stitch
│   ├── postcss.config.js
│   └── package.json
│
├── backend/                      # Servidor API REST Node.js + Express + Prisma
│   ├── prisma/
│   │   └── schema.prisma         # Modelos relacionales de PostgreSQL
│   ├── src/
│   │   ├── config/               # database.js (Singleton de Prisma y conexión)
│   │   ├── controllers/          # Controladores (auth, routines, workouts, exercises, stats)
│   │   ├── middleware/           # auth.js, errorHandler.js, validateObjectId.js
│   │   ├── routes/               # Enrutadores modulares de la API (/api/*)
│   │   ├── app.js                # Configuración de Express, CORS y middlewares
│   │   └── server.js             # Punto de entrada y Graceful Shutdown
│   ├── scripts/
│   │   ├── seed.js               # Semilla idempotente (9 grupos musculares + 30 ejercicios)
│   │   └── verify-connection.js  # Diagnóstico en vivo de conexión con PostgreSQL
│   ├── tests/
│   │   └── api.test.js           # Suite de pruebas automatizadas
│   ├── .env.example              # Variables de entorno de ejemplo
│   ├── .env                      # Configuración activa con DATABASE_URL
│   └── package.json
│
├── PLAN.md                       # Plan de implementación y arquitectura
├── TASKS.md                      # Seguimiento detallado de tareas completadas
└── README.md                     # Documentación principal
```

---

## 4. Datos de Conexión para DBeaver / pgAdmin

Para visualizar, consultar y administrar directamente las tablas de la base de datos desde **DBeaver** o **pgAdmin**, utiliza los siguientes parámetros de conexión:

### 🔌 Parámetros de Conexión

| Parámetro | Valor |
| :--- | :--- |
| **Tipo de Conexión / Driver** | `PostgreSQL` |
| **Host / Servidor** | `localhost` *(o `127.0.0.1`)* |
| **Puerto** | `5432` |
| **Base de Datos (Database)** | `forge_gym` |
| **Usuario (Username)** | `postgres` |
| **Contraseña (Password)** | `admin` |
| **Esquema (Schema)** | `public` |
| **URL de Conexión Completa** | `postgresql://postgres:admin@localhost:5432/forge_gym?schema=public` |

### 🛠️ Pasos para Conectar en DBeaver

1. Abre **DBeaver**.
2. Haz clic en **Nueva conexión** (icono de enchufe con `+` o menú *Database* > *New Database Connection*).
3. Selecciona **PostgreSQL** de la lista y haz clic en **Next**.
4. En la pestaña **General / Main**:
   - **Host**: `localhost`
   - **Port**: `5432`
   - **Database**: `forge_gym`
   - **Username**: `postgres`
   - **Password**: `admin`
5. Haz clic en el botón **Test Connection** (Probar conexión). DBeaver descargará el driver de PostgreSQL automáticamente si es la primera vez y mostrará un mensaje de éxito (*Connected*).
6. Haz clic en **Finish**.
7. En el panel izquierdo (*Database Navigator*), despliega:
   `forge_gym` &rarr; `Databases` &rarr; `forge_gym` &rarr; `Schemas` &rarr; `public` &rarr; `Tables`.
8. Podrás ver e inspeccionar las tablas del sistema:
   - `User` (Usuarios registrados y preferencias)
   - `MuscleGroup` (9 grupos musculares canónicos)
   - `Exercise` (30 ejercicios canónicos con instrucciones)
   - `Routine` (Rutinas de entrenamiento creadas)
   - `RoutineExercise` (Ejercicios asignados a cada rutina)
   - `WorkoutSession` (Sesiones activas e historial)
   - `WorkoutSet` (Series registradas con peso y repeticiones)

---

## 5. Instalación y Puesta en Marcha

### Prerrequisitos
- **Node.js**: Versión 20 o superior instalada.
- **PostgreSQL**: Servicio en ejecución en el puerto 5432.
- **DBeaver** o **pgAdmin**: Para inspección visual de datos.

### 5.1 Configuración del Backend

1. Ingresa al directorio del backend:
   ```bash
   cd backend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Verifica el archivo `.env`:
   ```env
   PORT=4000
   NODE_ENV=development
   DATABASE_URL="postgresql://postgres:admin@localhost:5432/forge_gym?schema=public"
   JWT_SECRET="forge_jwt_super_secret_production_key_2026_at_least_32_characters"
   JWT_EXPIRES_IN="7d"
   CLIENT_URL="http://localhost:3000"
   ```
4. Sincroniza el esquema relacional con PostgreSQL:
   ```bash
   npx prisma db push
   ```
5. Ejecuta la semilla de datos inicial (idempotente):
   ```bash
   npm run seed
   ```
6. Diagnostica la conexión y los registros:
   ```bash
   npm run verify
   ```
7. Ejecuta los tests de backend:
   ```bash
   npm test
   ```
8. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   *El backend estará escuchando en `http://localhost:4000`*.

### 5.2 Configuración del Frontend

1. En una nueva terminal, ingresa al directorio del frontend:
   ```bash
   cd frontend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Verifica el archivo `.env`:
   ```env
   VITE_API_URL=http://localhost:4000/api
   ```
4. Compila para validar el bundle:
   ```bash
   npm run build
   ```
5. Inicia el servidor de desarrollo con Vite:
   ```bash
   npm run dev
   ```
   *Abre tu navegador en `http://localhost:3000`*.

---

## 6. Endpoints Principales de la API REST

### Autenticación (`/api/auth`)
- `POST /register`: Registro de nuevo atleta con unidad de peso preferida.
- `POST /login`: Inicio de sesión (retorna token JWT y establece cookie `HttpOnly`).
- `POST /logout`: Cierre de sesión y limpieza de cookies.
- `GET /me`: Obtiene el perfil del usuario autenticado.
- `PATCH /preferences`: Actualiza la unidad de peso (`kg` / `lb`).

### Grupos Musculares y Ejercicios
- `GET /api/muscle-groups`: Lista los 9 grupos musculares canónicos.
- `GET /api/exercises`: Consulta el catálogo de ejercicios con soporte para búsqueda (`?search=`), grupo muscular (`?muscleGroup=`), equipo (`?equipment=`) y dificultad (`?difficulty=`).
- `GET /api/exercises/:id`: Detalle técnico de un ejercicio con instrucciones paso a paso.

### Rutinas (`/api/routines`)
- `GET /api/routines`: Lista las rutinas creadas por el usuario autenticado.
- `POST /api/routines`: Crea una nueva rutina estructurada con ejercicios ordenados.
- `GET /api/routines/:id`: Obtiene el detalle de una rutina.
- `PUT /api/routines/:id`: Actualiza título, descripción, dificultad y ejercicios.
- `POST /api/routines/:id/duplicate`: Duplica una rutina existente.
- `DELETE /api/routines/:id`: Elimina una rutina y sus relaciones asociadas.

### Entrenamientos (`/api/workouts`)
- `GET /api/workouts/active`: Obtiene la sesión que se encuentra actualmente en progreso.
- `POST /api/workouts`: Inicia un nuevo entrenamiento (desde una rutina o como entrenamiento libre).
- `POST /api/workouts/:id/sets`: Agrega una serie a la sesión activa.
- `PATCH /api/workouts/:id/sets/:setId`: Actualiza peso, repeticiones, RPE o marca la serie como completada.
- `DELETE /api/workouts/:id/sets/:setId`: Elimina una serie.
- `POST /api/workouts/:id/finish`: Finaliza la sesión, calculando duración y tonelaje total levantado.
- `GET /api/workouts/history`: Historial paginado de entrenamientos completados.

### Estadísticas y Analíticas (`/api/stats`)
- `GET /api/stats/dashboard`: Resumen de métricas semanales (tonelaje, entrenamientos, racha de regularidad, series).
- `GET /api/stats/progress`: Datos temporales para las gráficas Recharts (volumen acumulado, distribución muscular).
- `GET /api/stats/exercises/:id`: Progresión histórica de cargas y cálculo de 1RM estimado por ejercicio.
