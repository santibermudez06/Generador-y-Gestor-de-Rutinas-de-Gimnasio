import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { routineService } from '../services/routineService';
import { useActiveWorkout } from '../context/ActiveWorkoutContext';
import Modal from '../components/common/Modal';

export default function RoutinesPage() {
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('ALL');
  
  const [deletingRoutine, setDeletingRoutine] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { startWorkout } = useActiveWorkout();
  const navigate = useNavigate();

  const fetchRoutines = async () => {
    try {
      setLoading(true);
      const params = {};
      if (difficultyFilter !== 'ALL') params.difficulty = difficultyFilter;
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const res = await routineService.getRoutines(params);
      setRoutines(res.data || []);
    } catch (err) {
      console.error('Error al cargar rutinas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutines();
  }, [difficultyFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRoutines();
  };

  const handleStartWorkout = async (routine) => {
    try {
      const routineId = routine.id || routine._id;
      await startWorkout({ routineId, name: routine.name });
      navigate('/active-workout');
    } catch (err) {
      console.error('Error al iniciar entrenamiento:', err);
    }
  };

  const handleDuplicateRoutine = async (id) => {
    try {
      await routineService.duplicateRoutine(id);
      fetchRoutines();
    } catch (err) {
      console.error('Error al duplicar rutina:', err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingRoutine) return;
    try {
      setIsDeleting(true);
      const id = deletingRoutine.id || deletingRoutine._id;
      await routineService.deleteRoutine(id);
      setDeletingRoutine(null);
      fetchRoutines();
    } catch (err) {
      console.error('Error al eliminar rutina:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-space-lg w-full">
      {/* Top Section Header & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
        <div className="space-y-space-xs">
          <div className="flex items-center gap-space-xs">
            <span className="w-2 h-2 rounded-DEFAULT bg-primary-fixed"></span>
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary-fixed">
              PROGRAMACIÓN &amp; PROTOCOLOS
            </span>
            <span className="text-outline text-label-sm font-label-sm">/ POSTGRESQL &bull; PRISMA</span>
          </div>
          <h1 className="font-display-lg text-display-lg text-primary uppercase tracking-tight leading-none">
            MIS RUTINAS
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
            Crea, programa y optimiza tus planes de entrenamiento con telemetría de carga y sobrecarga progresiva.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-space-sm">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-80">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="BUSCAR RUTINA O ENFOQUE..."
              className="w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm pl-10 pr-4 py-2.5 rounded-DEFAULT placeholder:text-outline focus:bg-surface-container focus:outline-none uppercase tracking-wider border border-outline-variant/30"
            />
          </form>

          <button
            onClick={() => navigate('/routines/new')}
            className="flex items-center gap-2 px-space-md py-2.5 rounded-DEFAULT bg-primary-fixed text-on-primary-fixed hover:bg-primary-fixed-dim font-headline-sm text-headline-sm uppercase tracking-wider transition-all transform active:scale-95 shadow-lg shadow-primary-fixed/10"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>CREAR RUTINA</span>
          </button>
        </div>
      </div>

      {/* Telemetry Summary Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-space-sm">
        <div className="bg-surface-container-low p-space-md rounded-DEFAULT flex items-center justify-between border border-outline-variant/30">
          <div className="space-y-0.5">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-outline">
              RUTINAS REGISTRADAS
            </span>
            <div className="font-metric-val text-metric-val text-primary leading-none">
              {String(routines.length).padStart(2, '0')}
            </div>
          </div>
          <div className="w-10 h-10 rounded-DEFAULT bg-surface-container-high flex items-center justify-center text-primary-fixed">
            <span className="material-symbols-outlined text-[22px]">folder_special</span>
          </div>
        </div>

        <div className="bg-surface-container-low p-space-md rounded-DEFAULT flex items-center justify-between border border-outline-variant/30">
          <div className="space-y-0.5">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-outline">
              PROTOCOLOS ACTIVOS
            </span>
            <div className="font-metric-val text-metric-val text-primary-fixed leading-none">
              {String(Math.min(routines.length, 3)).padStart(2, '0')}
            </div>
          </div>
          <div className="w-10 h-10 rounded-DEFAULT bg-surface-container-high flex items-center justify-center text-primary-fixed">
            <span className="material-symbols-outlined text-[22px]">bolt</span>
          </div>
        </div>

        <div className="bg-surface-container-low p-space-md rounded-DEFAULT flex items-center justify-between border border-outline-variant/30">
          <div className="space-y-0.5">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-outline">
              EJERCICIOS ASIGNADOS
            </span>
            <div className="font-metric-val text-metric-val text-primary leading-none">
              {routines.reduce((acc, r) => acc + (r.exercises?.length || 0), 0)}
            </div>
          </div>
          <div className="w-10 h-10 rounded-DEFAULT bg-surface-container-high flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[22px]">fitness_center</span>
          </div>
        </div>

        <div className="bg-surface-container-low p-space-md rounded-DEFAULT flex items-center justify-between border border-outline-variant/30">
          <div className="space-y-0.5">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-outline">
              DISPONIBILIDAD
            </span>
            <div className="font-metric-val text-metric-val text-primary leading-none">100%</div>
          </div>
          <div className="w-10 h-10 rounded-DEFAULT bg-surface-container-high flex items-center justify-center text-primary-fixed">
            <span className="material-symbols-outlined text-[22px]">check_circle</span>
          </div>
        </div>
      </div>

      {/* Filter Control Module */}
      <div className="bg-surface-container-low p-space-md rounded-DEFAULT flex flex-col md:flex-row md:items-center justify-between gap-space-sm border border-outline-variant/30">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-outline text-[18px]">filter_alt</span>
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-outline">NIVEL / DIFICULTAD:</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {['ALL', 'PRINCIPIANTE', 'INTERMEDIO', 'AVANZADO'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setDifficultyFilter(lvl)}
              className={`px-space-sm py-1 rounded-DEFAULT font-label-md text-label-md uppercase tracking-wider transition-all ${
                difficultyFilter === lvl
                  ? 'bg-primary-fixed text-on-primary-fixed font-bold'
                  : 'bg-surface-container text-on-surface-variant hover:text-primary hover:bg-surface-container-high'
              }`}
            >
              {lvl === 'ALL' ? 'Todos los Niveles' : lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Routine Grid (3 Columns) */}
      {loading ? (
        <div className="text-center py-12 text-on-surface-variant">
          <span className="material-symbols-outlined animate-spin text-3xl text-primary-fixed">progress_activity</span>
          <p className="mt-2 font-label-md uppercase">Cargando protocolos de entrenamiento...</p>
        </div>
      ) : routines.length === 0 ? (
        <div className="bg-surface-container-low p-12 text-center rounded-DEFAULT border border-outline-variant/30">
          <span className="material-symbols-outlined text-5xl text-outline mb-2">folder_open</span>
          <h3 className="font-headline-md text-headline-md uppercase text-primary">No se encontraron rutinas</h3>
          <p className="font-body-md text-on-surface-variant max-w-md mx-auto mt-1 mb-4">
            Comienza creando una rutina estructurada por grupos musculares y ejercicios clave.
          </p>
          <button
            onClick={() => navigate('/routines/new')}
            className="px-6 py-3 bg-primary-fixed text-on-primary-fixed font-headline-sm uppercase tracking-wider rounded-DEFAULT hover:bg-primary-fixed-dim transition-all"
          >
            + CREAR PRIMERA RUTINA
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-space-md">
          {routines.map((routine) => {
            const id = routine.id || routine._id;
            const exCount = routine.exercises?.length || 0;
            return (
              <div
                key={id}
                className="group bg-surface-container-low rounded-DEFAULT flex flex-col justify-between overflow-hidden hover:bg-surface-container transition-all border border-outline-variant/30 shadow-lg"
              >
                {/* Header Strip */}
                <div className="p-space-md pb-0 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-DEFAULT bg-surface-container-high text-primary-fixed font-label-sm text-[10px] uppercase tracking-widest font-bold">
                      {routine.difficulty || 'GENERAL'}
                    </span>
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
                      {exCount} EJERCICIOS
                    </span>
                  </div>
                  <h3 className="font-headline-lg text-headline-lg uppercase text-primary tracking-wide mt-1">
                    {routine.name}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 min-h-[36px]">
                    {routine.description || 'Rutina diseñada para el estímulo muscular óptimo.'}
                  </p>
                </div>

                {/* Exercises Preview */}
                <div className="p-space-md py-space-sm flex flex-col gap-1.5 border-t border-b border-outline-variant/20 my-space-sm bg-surface-container-lowest/60">
                  {routine.exercises && routine.exercises.length > 0 ? (
                    routine.exercises.slice(0, 3).map((item, idx) => {
                      const exName = item.exercise?.name || item.name || 'Ejercicio';
                      return (
                        <div key={idx} className="flex items-center justify-between text-body-sm">
                          <span className="text-primary truncate max-w-[200px]">{exName}</span>
                          <span className="font-label-sm text-[11px] text-secondary font-mono">
                            {item.targetSets || 4} &times; {item.targetReps || '8-12'}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <span className="text-outline font-label-sm uppercase py-1">Sin ejercicios asignados</span>
                  )}
                  {exCount > 3 && (
                    <span className="font-label-sm text-[10px] text-outline uppercase">
                      + {exCount - 3} ejercicios adicionales
                    </span>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="p-space-md pt-0 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleStartWorkout(routine)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-primary-fixed text-on-primary-fixed hover:bg-primary-fixed-dim font-headline-sm text-headline-sm uppercase tracking-wider rounded-DEFAULT transition-all shadow-md shadow-primary-fixed/20"
                  >
                    <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                    <span>ENTRENAR</span>
                  </button>

                  <button
                    onClick={() => navigate(`/routines/edit/${id}`)}
                    title="Editar rutina"
                    className="p-2.5 bg-surface-container-high hover:bg-surface-bright text-on-surface rounded-DEFAULT transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>

                  <button
                    onClick={() => handleDuplicateRoutine(id)}
                    title="Duplicar rutina"
                    className="p-2.5 bg-surface-container-high hover:bg-surface-bright text-on-surface rounded-DEFAULT transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">content_copy</span>
                  </button>

                  <button
                    onClick={() => setDeletingRoutine(routine)}
                    title="Eliminar rutina"
                    className="p-2.5 bg-surface-container-high hover:bg-error-container text-on-surface hover:text-error rounded-DEFAULT transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Modal Confirmation */}
      {deletingRoutine && (
        <Modal
          isOpen={!!deletingRoutine}
          onClose={() => setDeletingRoutine(null)}
          title="CONFIRMAR ELIMINACIÓN DE PROTOCOLO"
        >
          <div className="p-4 flex flex-col gap-4">
            <p className="font-body-md text-on-surface">
              ¿Estás seguro de que deseas eliminar la rutina{' '}
              <strong className="text-secondary">{deletingRoutine.name}</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingRoutine(null)}
                className="px-4 py-2 bg-surface-container-high rounded text-on-surface uppercase font-label-md"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-error text-on-error rounded uppercase font-headline-sm font-bold"
              >
                {isDeleting ? 'ELIMINANDO...' : 'ELIMINAR DEFINITIVAMENTE'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
