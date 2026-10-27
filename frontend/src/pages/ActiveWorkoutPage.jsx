import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlayCircle,
  CheckCircle2,
  Plus,
  Trash2,
  Clock,
  Flame,
  Layers,
  StopCircle,
  Dumbbell,
  ArrowRight,
  Search,
  Check
} from 'lucide-react';
import { useActiveWorkout } from '../context/ActiveWorkoutContext';
import { useAuth } from '../context/AuthContext';
import { workoutService } from '../services/workoutService';
import { routineService } from '../services/routineService';
import { exerciseService } from '../services/exerciseService';
import RestTimerBanner from '../components/workout/RestTimerBanner';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';

export default function ActiveWorkoutPage() {
  const {
    activeWorkout,
    setActiveWorkout,
    loadingActive,
    startWorkout,
    finishActiveWorkout,
    startRestTimer
  } = useActiveWorkout();

  const { user } = useAuth();
  const navigate = useNavigate();

  // Cronómetro de la sesión activa
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Estados para inicio de sesión si no hay activa
  const [routines, setRoutines] = useState([]);
  const [freeWorkoutName, setFreeWorkoutName] = useState('Entrenamiento Libre');
  const [loadingRoutines, setLoadingRoutines] = useState(false);

  // Modales
  const [isAddExerciseModalOpen, setIsAddExerciseModalOpen] = useState(false);
  const [catalogExercises, setCatalogExercises] = useState([]);
  const [searchCatalog, setSearchCatalog] = useState('');
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
  const [finishing, setFinishing] = useState(false);

  // Sincronizar cronómetro
  useEffect(() => {
    if (!activeWorkout || activeWorkout.status !== 'in_progress') return;

    const startTime = new Date(activeWorkout.startedAt).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diffInSeconds = Math.max(0, Math.floor((now - startTime) / 1000));
      setElapsedSeconds(diffInSeconds);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeWorkout]);

  // Si no hay sesión activa, cargar rutinas para ofrecer iniciar una
  useEffect(() => {
    if (!activeWorkout) {
      async function loadRoutines() {
        try {
          setLoadingRoutines(true);
          const res = await routineService.getRoutines();
          setRoutines(res.data || []);
        } catch (err) {
          console.error('Error al cargar rutinas:', err.message);
        } finally {
          setLoadingRoutines(false);
        }
      }
      loadRoutines();
    }
  }, [activeWorkout]);

  // Cargar catálogo para modal de añadir ejercicio
  useEffect(() => {
    if (isAddExerciseModalOpen) {
      async function loadCatalog() {
        try {
          const res = await exerciseService.getExercises({ search: searchCatalog });
          setCatalogExercises(res.data || []);
        } catch (err) {
          console.error('Error al cargar catálogo:', err.message);
        }
      }
      loadCatalog();
    }
  }, [isAddExerciseModalOpen, searchCatalog]);

  const formatTimer = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Iniciar sesión desde rutina
  const handleStartFromRoutine = async (routine) => {
    try {
      const routineId = routine.id || routine._id;
      await startWorkout({ routineId, name: routine.name });
    } catch (err) {
      console.error('Error al iniciar:', err.message);
    }
  };

  // Iniciar sesión libre
  const handleStartFree = async () => {
    try {
      await startWorkout({ name: freeWorkoutName || 'Entrenamiento Libre' });
    } catch (err) {
      console.error('Error al iniciar libre:', err.message);
    }
  };

  // Marcar o desmarcar serie completada
  const handleToggleSetCompleted = async (setId, currentStatus) => {
    if (!activeWorkout) return;
    const newStatus = !currentStatus;
    const workoutId = activeWorkout.id || activeWorkout._id;

    // Actualización optimista local
    const updatedSets = activeWorkout.sets.map((s) =>
      (s.id === setId || s._id === setId) ? { ...s, completed: newStatus } : s
    );
    setActiveWorkout({ ...activeWorkout, sets: updatedSets });

    // Si se completó, disparar temporizador de descanso automáticamente (90 seg por defecto)
    if (newStatus) {
      startRestTimer(90);
    }

    // Persistir en backend
    try {
      const res = await workoutService.updateSet(workoutId, setId, {
        completed: newStatus
      });
      setActiveWorkout(res.data);
    } catch (err) {
      console.error('Error al actualizar serie:', err.message);
    }
  };

  // Modificar peso o repeticiones de una serie
  const handleUpdateSetValue = async (setId, field, value) => {
    if (!activeWorkout) return;
    const numVal = Math.max(0, Number(value) || 0);
    const workoutId = activeWorkout.id || activeWorkout._id;

    // Actualización local
    const updatedSets = activeWorkout.sets.map((s) =>
      (s.id === setId || s._id === setId) ? { ...s, [field]: numVal } : s
    );
    setActiveWorkout({ ...activeWorkout, sets: updatedSets });

    // Guardar en backend
    try {
      await workoutService.updateSet(workoutId, setId, {
        [field]: numVal
      });
    } catch (err) {
      console.error('Error al actualizar valor de serie:', err.message);
    }
  };

  // Añadir una nueva serie a un ejercicio
  const handleAddSetToExercise = async (exerciseId) => {
    if (!activeWorkout) return;
    try {
      const workoutId = activeWorkout.id || activeWorkout._id;
      // Buscar última serie para sugerir peso y repeticiones
      const existing = activeWorkout.sets.filter(
        (s) => (s.exercise?.id || s.exercise?._id || s.exercise) === exerciseId
      );
      const lastSet = existing[existing.length - 1];

      const res = await workoutService.addSet(workoutId, {
        exerciseId,
        weight: lastSet ? lastSet.weight : 0,
        repetitions: lastSet ? lastSet.repetitions : 10,
        completed: false
      });
      setActiveWorkout(res.data);
    } catch (err) {
      console.error('Error al añadir serie:', err.message);
    }
  };

  // Eliminar una serie
  const handleDeleteSet = async (setId) => {
    if (!activeWorkout) return;
    try {
      const workoutId = activeWorkout.id || activeWorkout._id;
      const res = await workoutService.deleteSet(workoutId, setId);
      setActiveWorkout(res.data);
    } catch (err) {
      console.error('Error al eliminar serie:', err.message);
    }
  };

  // Añadir ejercicio del catálogo a la sesión activa
  const handleAddExerciseToSession = async (exercise) => {
    if (!activeWorkout) return;
    try {
      const workoutId = activeWorkout.id || activeWorkout._id;
      const exId = exercise.id || exercise._id;
      // Añadir la primera serie de este ejercicio
      const res = await workoutService.addSet(workoutId, {
        exerciseId: exId,
        setNumber: 1,
        weight: 0,
        repetitions: 10,
        completed: false
      });
      setActiveWorkout(res.data);
      setIsAddExerciseModalOpen(false);
    } catch (err) {
      console.error('Error al agregar ejercicio a la sesión:', err.message);
    }
  };

  // Confirmar y finalizar entrenamiento
  const handleConfirmFinish = async () => {
    try {
      setFinishing(true);
      await finishActiveWorkout(elapsedSeconds);
      setIsFinishModalOpen(false);
      navigate('/history');
    } catch (err) {
      console.error('Error al finalizar entrenamiento:', err.message);
    } finally {
      setFinishing(false);
    }
  };

  if (loadingActive) {
    return <LoadingSpinner text="Recuperando estado de la sesión activa..." />;
  }

  const unit = user?.preferredWeightUnit || 'kg';

  // =========================================================================
  // VISTA: NO HAY SESIÓN ACTIVA (SELECTOR PARA INICIAR)
  // =========================================================================
  if (!activeWorkout) {
    return (
      <div>
        <div className="page-header">
          <div>
            <span
              style={{
                fontSize: '0.8rem',
                color: 'var(--accent)',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}
            >
              Sala de Entrenamiento
            </span>
            <h1 className="display-title">INICIAR SESIÓN DE ENTRENAMIENTO</h1>
            <p className="page-subtitle">
              Selecciona una de tus rutinas programadas o comienza un entrenamiento libre.
            </p>
          </div>
        </div>

        {/* Entrenamiento Libre Rápido */}
        <div
          className="forge-card"
          style={{
            marginBottom: '2.5rem',
            background: 'linear-gradient(135deg, var(--bg-panel) 0%, rgba(198, 255, 0, 0.05) 100%)',
            border: '1px solid rgba(198, 255, 0, 0.3)'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.25rem'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <Flame size={20} color="var(--accent)" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Entrenamiento Libre</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '520px' }}>
                Sin estructura previa. Añade ejercicios, series y pesos sobre la marcha conforme entrenes.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <input
                type="text"
                className="forge-input"
                style={{ width: '220px' }}
                value={freeWorkoutName}
                onChange={(e) => setFreeWorkoutName(e.target.value)}
                placeholder="Nombre de la sesión..."
              />
              <button onClick={handleStartFree} className="forge-btn forge-btn-primary">
                <PlayCircle size={18} /> Iniciar Ahora
              </button>
            </div>
          </div>
        </div>

        {/* Iniciar desde Rutina */}
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          O Inicia con una Rutina Programada
        </h3>

        {loadingRoutines ? (
          <LoadingSpinner text="Cargando tus rutinas..." size="sm" />
        ) : routines.length === 0 ? (
          <div
            style={{
              padding: '2.5rem',
              backgroundColor: 'var(--bg-panel)',
              borderRadius: 'var(--radius-lg)',
              border: '1px dashed var(--border-color)',
              textAlign: 'center'
            }}
          >
            <Dumbbell size={32} color="var(--accent)" style={{ margin: '0 auto 0.5rem' }} />
            <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              No tienes rutinas creadas todavía
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Crea una rutina con tus series y descansos favoritos para acelerar tus sesiones.
            </p>
            <button
              onClick={() => navigate('/routines/new')}
              className="forge-btn forge-btn-secondary"
            >
              Crear mi primera rutina
            </button>
          </div>
        ) : (
          <div className="forge-grid-3">
            {routines.map((r) => (
              <div
                key={r._id}
                className="forge-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.5rem'
                    }}
                  >
                    <Badge variant="lime">{r.difficulty}</Badge>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {r.estimatedDuration || 60} min
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                    {r.name}
                  </h4>
                  <p
                    style={{
                      fontSize: '0.82rem',
                      color: 'var(--text-secondary)',
                      marginBottom: '0.75rem'
                    }}
                  >
                    {r.exercises?.length || 0} ejercicios programados
                  </p>
                </div>

                <button
                  onClick={() => handleStartFromRoutine(r)}
                  className="forge-btn forge-btn-primary"
                  style={{ width: '100%', padding: '0.65rem' }}
                >
                  <PlayCircle size={16} /> Iniciar Sesión
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VISTA: SESIÓN ACTIVA EN EJECUCIÓN
  // =========================================================================

  // Agrupar las series de la sesión activa por ejercicio
  const groupedSets = {};
  if (activeWorkout.sets && Array.isArray(activeWorkout.sets)) {
    activeWorkout.sets.forEach((set) => {
      const ex = set.exercise;
      const exId = ex?._id || ex || 'unknown';
      if (!groupedSets[exId]) {
        groupedSets[exId] = {
          exerciseInfo: typeof ex === 'object' ? ex : { name: 'Ejercicio' },
          sets: []
        };
      }
      groupedSets[exId].sets.push(set);
    });
  }

  const completedSetsCount = activeWorkout.sets?.filter((s) => s.completed).length || 0;
  const totalSetsCount = activeWorkout.sets?.length || 0;

  // Cálculo en vivo del volumen acumulado
  const currentTotalVolume =
    activeWorkout.sets?.reduce((acc, s) => {
      return s.completed ? acc + (s.weight || 0) * (s.repetitions || 0) : acc;
    }, 0) || 0;

  return (
    <div>
      {/* Banner flotante de temporizador de descanso */}
      <RestTimerBanner />

      {/* Header de la Sesión Activa */}
      <div
        className="forge-card"
        style={{
          marginBottom: '2rem',
          backgroundColor: 'var(--bg-panel)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent)'
              }}
              className="pulse-lime"
            />
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--accent)',
                fontWeight: 800,
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}
            >
              Sesión en Curso
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.4rem',
              lineHeight: 1.1,
              margin: 0
            }}
          >
            {activeWorkout.name}
          </h1>
        </div>

        {/* Métricas en vivo del entrenamiento */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem', flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Tiempo Transcurrido
            </span>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2.2rem',
                color: 'var(--text-primary)',
                lineHeight: 1
              }}
            >
              {formatTimer(elapsedSeconds)}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Volumen Acumulado
            </span>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2.2rem',
                color: 'var(--accent)',
                lineHeight: 1
              }}
            >
              {currentTotalVolume.toLocaleString()}{' '}
              <small style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>{unit}</small>
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Progreso de Series
            </span>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2.2rem',
                color: 'var(--text-primary)',
                lineHeight: 1
              }}
            >
              {completedSetsCount}{' '}
              <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>
                / {totalSetsCount}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsFinishModalOpen(true)}
            className="forge-btn forge-btn-primary"
            style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}
          >
            <CheckCircle2 size={20} /> Finalizar Sesión
          </button>
        </div>
      </div>

      {/* Botón para añadir ejercicios a la sesión activa */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}
      >
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Ejercicios y Series</h3>

        <button
          onClick={() => setIsAddExerciseModalOpen(true)}
          className="forge-btn forge-btn-secondary"
        >
          <Plus size={16} /> Añadir Ejercicio
        </button>
      </div>

      {/* Lista de Ejercicios y Tablas de Series */}
      {Object.keys(groupedSets).length === 0 ? (
        <div
          style={{
            padding: '3rem',
            textAlign: 'center',
            backgroundColor: 'var(--bg-panel)',
            borderRadius: 'var(--radius-lg)',
            border: '1px dashed var(--border-color)'
          }}
        >
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            No hay ejercicios en esta sesión aún.
          </p>
          <button
            onClick={() => setIsAddExerciseModalOpen(true)}
            className="forge-btn forge-btn-primary"
          >
            <Plus size={16} /> Añadir Primer Ejercicio
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {Object.entries(groupedSets).map(([exId, group]) => {
            const exInfo = group.exerciseInfo;
            const muscleName =
              exInfo.muscleGroup?.name ||
              (typeof exInfo.muscleGroup === 'string' ? exInfo.muscleGroup : 'General');

            return (
              <div key={exId} className="forge-card" style={{ padding: '1.5rem' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 0.2rem 0' }}>
                      {exInfo.name || 'Ejercicio'}
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>
                      {muscleName} {exInfo.equipment ? `• ${exInfo.equipment}` : ''}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddSetToExercise(exId)}
                    className="forge-btn forge-btn-secondary"
                    style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}
                  >
                    <Plus size={14} /> Añadir Serie
                  </button>
                </div>

                {/* Tabla de Series */}
                <div style={{ overflowX: 'auto' }}>
                  <table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      fontSize: '0.88rem',
                      textAlign: 'left'
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          color: 'var(--text-muted)',
                          fontSize: '0.75rem',
                          textTransform: 'uppercase',
                          borderBottom: '1px solid var(--border-color)'
                        }}
                      >
                        <th style={{ padding: '0.5rem 0.75rem', width: '60px' }}>Serie</th>
                        <th style={{ padding: '0.5rem 0.75rem' }}>Peso ({unit})</th>
                        <th style={{ padding: '0.5rem 0.75rem' }}>Repeticiones</th>
                        <th style={{ padding: '0.5rem 0.75rem', textAlign: 'center', width: '120px' }}>
                          Completada
                        </th>
                        <th style={{ padding: '0.5rem 0.75rem', textAlign: 'right', width: '60px' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.sets.map((set, setIndex) => {
                        const isSetDone = set.completed;
                        const setId = set.id || set._id;

                        return (
                          <tr
                            key={setId}
                            style={{
                              backgroundColor: isSetDone
                                ? 'rgba(198, 255, 0, 0.04)'
                                : 'transparent',
                              borderBottom: '1px solid rgba(255, 255, 255, 0.04)'
                            }}
                          >
                            <td style={{ padding: '0.65rem 0.75rem', fontWeight: 700 }}>
                              #{set.setNumber || setIndex + 1}
                            </td>

                            <td style={{ padding: '0.65rem 0.75rem' }}>
                              <input
                                type="number"
                                min="0"
                                step="0.5"
                                defaultValue={set.weight}
                                onBlur={(e) =>
                                  handleUpdateSetValue(setId, 'weight', e.target.value)
                                }
                                className="forge-input"
                                style={{
                                  width: '90px',
                                  padding: '0.4rem 0.6rem',
                                  textAlign: 'center',
                                  fontWeight: 600
                                }}
                              />
                            </td>

                            <td style={{ padding: '0.65rem 0.75rem' }}>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                defaultValue={set.repetitions}
                                onBlur={(e) =>
                                  handleUpdateSetValue(setId, 'repetitions', e.target.value)
                                }
                                className="forge-input"
                                style={{
                                  width: '80px',
                                  padding: '0.4rem 0.6rem',
                                  textAlign: 'center',
                                  fontWeight: 600
                                }}
                              />
                            </td>

                            <td style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>
                              <button
                                type="button"
                                onClick={() => handleToggleSetCompleted(setId, isSetDone)}
                                style={{
                                  width: '34px',
                                  height: '34px',
                                  borderRadius: 'var(--radius-md)',
                                  backgroundColor: isSetDone
                                    ? 'var(--accent)'
                                    : 'var(--bg-surface)',
                                  border: isSetDone
                                    ? '1px solid var(--accent)'
                                    : '1px solid var(--border-color)',
                                  color: isSetDone ? '#090B0A' : 'var(--text-muted)',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  transition: 'all var(--transition-fast)'
                                }}
                                title={isSetDone ? 'Completada' : 'Marcar como completada'}
                              >
                                <Check size={18} strokeWidth={isSetDone ? 3 : 2} />
                              </button>
                            </td>

                            <td style={{ padding: '0.65rem 0.75rem', textAlign: 'right' }}>
                              <button
                                onClick={() => handleDeleteSet(setId)}
                                className="forge-btn-ghost"
                                style={{
                                  padding: '0.35rem',
                                  color: 'var(--text-muted)',
                                  transition: 'color var(--transition-fast)'
                                }}
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.color = 'var(--danger)')
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.color = 'var(--text-muted)')
                                }
                                title="Eliminar serie"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal para añadir ejercicio a la sesión */}
      <Modal
        isOpen={isAddExerciseModalOpen}
        onClose={() => setIsAddExerciseModalOpen(false)}
        title="Añadir Ejercicio a la Sesión Activa"
        maxWidth="650px"
      >
        <div style={{ marginBottom: '1rem', position: 'relative' }}>
          <input
            type="text"
            placeholder="Buscar ejercicio..."
            value={searchCatalog}
            onChange={(e) => setSearchCatalog(e.target.value)}
            className="forge-input"
            style={{ width: '100%', paddingLeft: '2.4rem' }}
          />
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '0.85rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }}
          />
        </div>

        <div
          style={{
            maxHeight: '350px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
        >
          {catalogExercises.map((ex) => (
            <div
              key={ex._id}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <h5 style={{ margin: '0 0 0.2rem 0', fontSize: '0.95rem', fontWeight: 700 }}>
                  {ex.name}
                </h5>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {ex.muscleGroup?.name || 'Músculo'} • {ex.equipment}
                </span>
              </div>

              <button
                onClick={() => handleAddExerciseToSession(ex)}
                className="forge-btn forge-btn-primary"
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
              >
                <Plus size={14} /> Seleccionar
              </button>
            </div>
          ))}
        </div>
      </Modal>

      {/* Modal de Finalización y Resumen del Entrenamiento */}
      <Modal
        isOpen={isFinishModalOpen}
        onClose={() => setIsFinishModalOpen(false)}
        title="Finalizar Entrenamiento"
      >
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          ¡Excelente esfuerzo! Tu sesión será calculada y guardada permanentemente
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.75rem',
            marginBottom: '1.75rem',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              padding: '1rem 0.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)'
            }}
          >
            <Clock size={18} color="var(--accent)" style={{ margin: '0 auto 0.25rem' }} />
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--text-primary)' }}>
              {Math.round(elapsedSeconds / 60)} min
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Duración
            </span>
          </div>

          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              padding: '1rem 0.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)'
            }}
          >
            <Flame size={18} color="var(--accent)" style={{ margin: '0 auto 0.25rem' }} />
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--accent)' }}>
              {currentTotalVolume.toLocaleString()}
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Volumen ({unit})
            </span>
          </div>

          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              padding: '1rem 0.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)'
            }}
          >
            <CheckCircle2 size={18} color="var(--accent)" style={{ margin: '0 auto 0.25rem' }} />
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--text-primary)' }}>
              {completedSetsCount}
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Series Efectivas
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            onClick={() => setIsFinishModalOpen(false)}
            className="forge-btn forge-btn-ghost"
            disabled={finishing}
          >
            Seguir Entrenando
          </button>
          <button
            onClick={handleConfirmFinish}
            disabled={finishing}
            className="forge-btn forge-btn-primary"
            style={{ padding: '0.75rem 1.75rem' }}
          >
            {finishing ? 'Guardando en Atlas...' : 'Confirmar y Guardar'}
          </button>
        </div>
      </Modal>
    </div>
  );
}

