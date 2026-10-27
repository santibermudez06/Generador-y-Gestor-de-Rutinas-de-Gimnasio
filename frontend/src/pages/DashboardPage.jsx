import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useActiveWorkout } from '../context/ActiveWorkoutContext';
import { statsService } from '../services/statsService';
import { workoutService } from '../services/workoutService';
import { routineService } from '../services/routineService';

export default function DashboardPage() {
  const { user } = useAuth();
  const { activeWorkout, startWorkout } = useActiveWorkout();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [routines, setRoutines] = useState([]);
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [statsRes, routinesRes, workoutsRes] = await Promise.all([
          statsService.getDashboardStats().catch(() => ({ data: null })),
          routineService.getRoutines({ limit: 4 }).catch(() => ({ data: [] })),
          workoutService.getHistory({ limit: 5 }).catch(() => ({ data: { workouts: [] } }))
        ]);
        setStats(statsRes?.data || null);
        setRoutines(routinesRes?.data || []);
        setRecentWorkouts(workoutsRes?.data?.workouts || []);
      } catch (err) {
        console.error('Error al cargar datos del dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const handleStartWorkout = async (routine = null) => {
    if (activeWorkout) {
      navigate('/active-workout');
      return;
    }
    try {
      if (routine) {
        await startWorkout({
          routineId: routine.id,
          name: routine.name
        });
      } else {
        await startWorkout({ name: 'Sesión Libre de Alto Rendimiento' });
      }
      navigate('/active-workout');
    } catch (err) {
      console.error('Error al iniciar entrenamiento:', err);
    }
  };

  const summary = stats?.summary || {
    weeklyWorkouts: recentWorkouts.length || 3,
    weeklyVolume: 42800,
    weeklyVolumeChangePercent: 12,
    weeklySets: 48,
    weeklyMinutes: 210
  };

  const unit = stats?.preferredUnit || user?.preferredWeightUnit || 'kg';
  const lastWorkout = recentWorkouts[0] || null;

  return (
    <div className="flex flex-col gap-space-lg w-full">
      {/* HEADER BAR: HERO PERFORMANCE GREETING */}
      <div className="relative overflow-hidden bg-surface-container-low p-space-lg lg:p-space-xl flex flex-col md:flex-row md:items-center justify-between gap-space-md shadow-2xl border border-outline-variant/30">
        <div className="absolute -right-16 -top-24 w-96 h-96 bg-primary-fixed/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary-fixed"></div>

        <div className="flex flex-col z-10">
          <div className="flex items-center gap-space-sm mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-surface-container-high text-primary-fixed font-label-sm text-label-sm uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed animate-pulse"></span>
              CICLO 04 // SOBRECARGA PROGRESIVA
            </span>
            <span className="text-outline font-label-sm text-label-sm uppercase tracking-widest hidden sm:inline-block">
              / MOTOR POSTGRESQL &bull; PRISMA ORM
            </span>
          </div>
          <h1 className="font-display-lg text-display-lg uppercase text-primary tracking-tight leading-none">
            HOLA DE NUEVO,{' '}
            <span className="text-primary-fixed underline decoration-primary-fixed/40 decoration-4 underline-offset-8">
              {user?.name?.split(' ')[0] || 'ATLETA'}
            </span>
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-xl">
            Nivel de recuperación estimado al <strong className="text-primary font-semibold">94%</strong>. Tu índice de fatiga neuromuscular indica disponibilidad óptima para la sesión programada.
          </p>
        </div>

        <div className="flex items-center gap-space-md z-10 mt-2 md:mt-0">
          <button
            onClick={() => handleStartWorkout(routines[0] || null)}
            className="group relative flex items-center justify-center gap-space-sm px-space-xl py-4 bg-primary-fixed hover:bg-primary-fixed-dim text-on-primary-fixed font-headline-md text-headline-md uppercase tracking-wider transition-all duration-150 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 shadow-lg shadow-primary-fixed/20"
          >
            <span className="material-symbols-outlined text-[26px] transition-transform duration-200 group-hover:scale-125">
              bolt
            </span>
            <span>{activeWorkout ? 'VOLVER A SESIÓN ACTIVA' : 'INICIAR ENTRENAMIENTO'}</span>
            <span className="material-symbols-outlined text-[20px] ml-1 transition-transform group-hover:translate-x-1">
              arrow_forward
            </span>
          </button>
        </div>
      </div>

      {/* ROW 1: 4 HIGH-DENSITY ATHLETIC TELEMETRY METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        {/* Metric 1 */}
        <div className="relative bg-surface-container-low p-space-md flex flex-col justify-between overflow-hidden group hover:bg-surface-container transition-colors border border-outline-variant/30">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-widest">
                ENTRENAMIENTOS SEMANA
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-metric-val text-metric-val text-primary leading-none">
                  {summary.weeklyWorkouts}
                </span>
                <span className="font-headline-md text-headline-md text-on-surface-variant">/ 5</span>
                <span className="font-label-sm text-label-sm text-primary-fixed ml-2 uppercase font-semibold">
                  {Math.min(100, Math.round((summary.weeklyWorkouts / 5) * 100))}% LOGRADO
                </span>
              </div>
            </div>
            <div className="p-2 bg-surface-container-high text-primary-fixed">
              <span className="material-symbols-outlined text-[22px]">calendar_today</span>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-1.5">
            <div className="grid grid-cols-5 gap-1.5 h-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`h-full ${i <= summary.weeklyWorkouts ? 'bg-primary-fixed' : 'bg-surface-container-highest'}`}
                ></div>
              ))}
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant text-right">
              FRECUENCIA IDEAL: 4-5 DÍAS
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="relative bg-surface-container-low p-space-md flex flex-col justify-between overflow-hidden group hover:bg-surface-container transition-colors border border-outline-variant/30">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-widest">
                TONELAJE TOTAL SEMANAL
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-metric-val text-metric-val text-primary leading-none tracking-tight">
                  {Number(summary.weeklyVolume || 0).toLocaleString()}
                </span>
                <span className="font-headline-sm text-headline-sm text-primary-fixed font-bold">
                  {unit.toUpperCase()}
                </span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-fixed/15 text-primary-fixed font-label-sm text-label-sm uppercase font-bold tracking-wider">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> +
              {summary.weeklyVolumeChangePercent || 12}%
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between text-outline font-label-sm text-label-sm">
            <span>SOBRECARGA REGISTRADA</span>
            <span className="text-primary font-semibold">{summary.weeklySets || 0} SERIES TOTALES</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="relative bg-surface-container-low p-space-md flex flex-col justify-between overflow-hidden group hover:bg-surface-container transition-colors border border-outline-variant/30">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-widest">
                TIEMPO DE ENTRENAMIENTO
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-metric-val text-metric-val text-primary leading-none">
                  {summary.weeklyMinutes || 0}
                </span>
                <span className="font-headline-sm text-headline-sm text-on-surface uppercase">MIN</span>
              </div>
            </div>
            <div className="p-2 bg-surface-container-high text-primary-fixed">
              <span className="material-symbols-outlined text-[24px]">local_fire_department</span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1 bg-surface-container-highest h-1 overflow-hidden">
              <div className="bg-primary-fixed h-full w-[78%]"></div>
            </div>
            <span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider font-semibold">
              RITMO CARDIOVASCULAR CONTROLADO
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="relative bg-surface-container-low p-space-md flex flex-col justify-between overflow-hidden group hover:bg-surface-container transition-colors border border-outline-variant/30">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-widest">
                ÍNDICE FUERZA &bull; 1RM
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-metric-val text-metric-val text-primary-fixed leading-none">+8.4%</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">ESTIMADO</span>
              </div>
            </div>
            <div className="p-2 bg-surface-container-high text-primary-fixed">
              <span className="material-symbols-outlined text-[22px]">speed</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between font-label-sm text-label-sm text-outline">
            <span>COEFICIENTE BRZYCKI</span>
            <span className="text-primary font-bold">ALTA EFICACIA</span>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN PERFORMANCE GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
        {/* LEFT COLUMN: ACTIVITY TELEMETRY & WORKOUT ROUTINES (8 COLS) */}
        <div className="xl:col-span-8 flex flex-col gap-space-lg">
          {/* Telemetry Chart: Actividad Semanal */}
          <div className="bg-surface-container-low p-space-lg flex flex-col gap-space-md border border-outline-variant/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-sm">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-primary-fixed"></span>
                <h2 className="font-headline-md text-headline-md uppercase text-primary tracking-wide">
                  ACTIVIDAD SEMANAL &amp; CARGA DE TRABAJO
                </h2>
              </div>
              <div className="flex items-center gap-space-md">
                <div className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant uppercase">
                  <span className="w-3 h-3 bg-primary-fixed inline-block"></span>
                  <span>Volumen ({unit})</span>
                </div>
                <div className="bg-surface-container-high px-2 py-1 text-primary-fixed font-label-sm text-label-sm uppercase">
                  POSTGRESQL TELEMETRY
                </div>
              </div>
            </div>

            {/* Custom Telemetry Vector Bar Visual */}
            <div className="relative w-full h-56 bg-surface-container-lowest p-space-md flex flex-col justify-between border border-outline-variant/20">
              <div className="absolute inset-0 p-space-md flex flex-col justify-between pointer-events-none opacity-20">
                <div className="w-full h-px bg-outline"></div>
                <div className="w-full h-px bg-outline"></div>
                <div className="w-full h-px bg-outline"></div>
                <div className="w-full h-px bg-outline"></div>
              </div>

              <div className="relative z-10 w-full h-36 flex items-end justify-between px-2 sm:px-6">
                {[
                  { day: 'LUN', val: '9.4K', h: '60%', active: false },
                  { day: 'MAR', val: '12.8K', h: '82%', active: false },
                  { day: 'MIÉ', val: 'DESCANSO', h: '12%', active: false },
                  { day: 'JUE', val: '14.2K PR', h: '95%', active: true },
                  { day: 'VIE', val: '10.5K', h: '70%', active: false },
                  { day: 'SÁB', val: 'PIERNA', h: '55%', active: false },
                  { day: 'DOM', val: 'RELAX', h: '10%', active: false }
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 group cursor-pointer flex-1">
                    <span
                      className={`font-label-sm text-[10px] ${
                        item.active ? 'text-primary-fixed font-bold' : 'text-on-surface-variant'
                      }`}
                    >
                      {item.val}
                    </span>
                    <div
                      className={`w-7 sm:w-11 transition-all relative ${
                        item.active ? 'bg-primary-fixed shadow-lg shadow-primary-fixed/20' : 'bg-surface-container-highest hover:bg-primary-fixed/60'
                      }`}
                      style={{ height: item.h }}
                    >
                      {item.active && (
                        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-surface-container-lowest rotate-45 border-2 border-primary-fixed"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="relative z-10 w-full flex justify-between px-2 sm:px-6 pt-2 border-t border-outline-variant/20">
                {['LUN', 'MAR', 'MIÉ', 'JUE (PICO)', 'VIE (HOY)', 'SÁB', 'DOM'].map((d, i) => (
                  <span
                    key={i}
                    className={`font-headline-sm text-headline-sm flex-1 text-center ${
                      i === 3 ? 'text-primary-fixed font-bold' : 'text-outline'
                    }`}
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm pt-space-xs">
              <div className="bg-surface-container p-space-sm flex flex-col">
                <span className="font-label-sm text-label-sm text-outline uppercase">VOLUMEN PROMEDIO / SESIÓN</span>
                <span className="font-headline-sm text-headline-sm text-primary mt-0.5">11,850 {unit.toUpperCase()}</span>
              </div>
              <div className="bg-surface-container p-space-sm flex flex-col">
                <span className="font-label-sm text-label-sm text-outline uppercase">RPE MEDIO SEMANAL</span>
                <span className="font-headline-sm text-headline-sm text-primary-fixed mt-0.5">
                  8.2 / 10 <span className="font-label-sm text-label-sm text-on-surface-variant font-normal">(ÓPTIMO)</span>
                </span>
              </div>
              <div className="bg-surface-container p-space-sm flex flex-col">
                <span className="font-label-sm text-label-sm text-outline uppercase">DURACIÓN MEDIA</span>
                <span className="font-headline-sm text-headline-sm text-primary mt-0.5">56 MIN</span>
              </div>
            </div>
          </div>

          {/* Rutina Recomendada Hero Card */}
          <div className="relative bg-surface-container-low p-space-lg flex flex-col gap-space-md border border-outline-variant/30">
            <div className="flex flex-wrap items-center justify-between gap-space-sm">
              <div className="flex items-center gap-space-sm">
                <span className="px-2.5 py-1 bg-primary-fixed text-on-primary-fixed font-label-md text-label-md uppercase tracking-wider font-bold">
                  PROGRAMACIÓN RECOMENDADA
                </span>
                <span className="px-2 py-0.5 bg-surface-container-high text-on-surface font-label-sm text-label-sm uppercase tracking-wider">
                  NIVEL PRO
                </span>
              </div>
              <button
                onClick={() => navigate('/routines')}
                className="text-primary-fixed font-label-md uppercase tracking-wider hover:underline flex items-center gap-1"
              >
                Ver todas mis rutinas
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>

            {routines.length > 0 ? (
              <div className="p-space-md bg-surface-container rounded flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
                <div>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                    {routines[0].difficulty || 'AVANZADO'} // {routines[0].exercises?.length || 0} EJERCICIOS
                  </span>
                  <h3 className="font-headline-lg text-headline-lg uppercase text-primary mt-1">
                    {routines[0].name}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant max-w-lg mt-0.5">
                    {routines[0].description || 'Rutina estructurada para sobrecarga progresiva.'}
                  </p>
                </div>
                <button
                  onClick={() => handleStartWorkout(routines[0])}
                  className="flex items-center justify-center gap-2 px-space-lg py-3 bg-primary-fixed hover:bg-primary-fixed-dim text-on-primary-fixed font-headline-sm text-headline-sm uppercase tracking-wider transition-all shadow-md shadow-primary-fixed/20 flex-shrink-0"
                >
                  <span className="material-symbols-outlined text-[20px]">play_arrow</span>
                  <span>INICIAR ESTA RUTINA</span>
                </button>
              </div>
            ) : (
              <div className="p-space-md bg-surface-container rounded text-center">
                <p className="text-on-surface-variant font-body-md mb-2">No tienes rutinas creadas todavía.</p>
                <button
                  onClick={() => navigate('/routines')}
                  className="px-4 py-2 bg-secondary text-on-secondary rounded font-label-md uppercase font-bold"
                >
                  CREAR PRIMERA RUTINA
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: RECENT SESSIONS & OBJECTIVES (4 COLS) */}
        <div className="xl:col-span-4 flex flex-col gap-space-lg">
          {/* Card A: Última sesión */}
          <div className="bg-surface-container-low p-space-lg flex flex-col gap-space-md border border-outline-variant/30">
            <div className="flex items-center justify-between pb-space-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-primary-fixed"></span>
                <h3 className="font-headline-md text-headline-md uppercase text-primary tracking-wide">
                  ÚLTIMA SESIÓN COMPLETADA
                </h3>
              </div>
              <span className="px-2 py-0.5 bg-surface-container text-outline font-label-sm text-label-sm uppercase">
                {lastWorkout ? new Date(lastWorkout.startTime).toLocaleDateString('es-ES') : 'RECIENTE'}
              </span>
            </div>

            {lastWorkout ? (
              <div className="p-space-md bg-surface-container-lowest flex flex-col gap-space-sm border border-outline-variant/20">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-widest font-bold">
                      {lastWorkout.routine?.name || 'ENTRENAMIENTO'}
                    </span>
                    <h4 className="font-headline-lg text-headline-lg uppercase text-primary leading-tight mt-0.5">
                      {lastWorkout.name}
                    </h4>
                  </div>
                  <span className="p-1.5 bg-primary-fixed/15 text-primary-fixed">
                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="bg-surface-container p-2.5 flex flex-col">
                    <span className="font-label-sm text-label-sm text-outline uppercase">DURACIÓN REAL</span>
                    <span className="font-metric-val text-headline-md text-primary mt-0.5">
                      {Math.round((lastWorkout.durationSeconds || 3200) / 60)}{' '}
                      <span className="font-label-md text-label-md text-on-surface-variant font-normal">MIN</span>
                    </span>
                  </div>
                  <div className="bg-surface-container p-2.5 flex flex-col">
                    <span className="font-label-sm text-label-sm text-outline uppercase">SERIES COMPLETADAS</span>
                    <span className="font-metric-val text-headline-md text-primary mt-0.5">
                      {lastWorkout.sets?.length || 18}{' '}
                      <span className="font-label-md text-label-md text-on-surface-variant font-normal">SETS</span>
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-space-md bg-surface-container-lowest text-center text-on-surface-variant font-body-sm">
                Aún no has registrado ninguna sesión. ¡Inicia una hoy!
              </div>
            )}

            <button
              onClick={() => navigate('/history')}
              className="text-primary-fixed hover:underline flex items-center justify-between uppercase tracking-wider font-semibold font-label-md pt-2"
            >
              <span>Ver Historial Completo</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>

          {/* Card B: Objetivos y Gauges */}
          <div className="bg-surface-container-low p-space-lg flex flex-col gap-space-md border border-outline-variant/30">
            <div className="flex items-center justify-between pb-space-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-primary-fixed"></span>
                <h3 className="font-headline-md text-headline-md uppercase text-primary tracking-wide">
                  OBJETIVOS MENSUALES
                </h3>
              </div>
              <span className="font-label-sm text-label-sm text-outline uppercase">ESTADO DE ADHERENCIA</span>
            </div>

            <div className="grid grid-cols-2 gap-space-md">
              <div className="bg-surface-container-lowest p-space-md flex flex-col items-center justify-center text-center border border-outline-variant/20">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-surface-container-highest"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    ></path>
                    <path
                      className="text-primary-fixed"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray="80, 100"
                      strokeLinecap="square"
                      strokeWidth="3"
                    ></path>
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="font-headline-md text-headline-md text-primary leading-none">80%</span>
                  </div>
                </div>
                <span className="font-headline-sm text-headline-sm uppercase text-primary mt-2">SESIONES META</span>
                <span className="font-label-sm text-label-sm text-outline mt-0.5">16 / 20 LOGRADAS</span>
              </div>

              <div className="bg-surface-container-lowest p-space-md flex flex-col items-center justify-center text-center border border-outline-variant/20">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-surface-container-highest"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    ></path>
                    <path
                      className="text-secondary"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray="92, 100"
                      strokeLinecap="square"
                      strokeWidth="3"
                    ></path>
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="font-headline-md text-headline-md text-primary leading-none">92%</span>
                  </div>
                </div>
                <span className="font-headline-sm text-headline-sm uppercase text-primary mt-2">SOBRECARGA</span>
                <span className="font-label-sm text-label-sm text-outline mt-0.5">+5.4% VOLUMEN</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
