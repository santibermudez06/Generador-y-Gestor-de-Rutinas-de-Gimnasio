import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Dumbbell,
  Clock,
  Layers,
  Search,
  Check
} from 'lucide-react';
import { routineService } from '../services/routineService';
import { exerciseService } from '../services/exerciseService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';

export default function RoutineEditorPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [estimatedDuration, setEstimatedDuration] = useState(60);
  const [exercises, setExercises] = useState([]);

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Selector de ejercicios en modal
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [catalogExercises, setCatalogExercises] = useState([]);
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [modalSearch, setModalSearch] = useState('');
  const [modalMuscleFilter, setModalMuscleFilter] = useState('');
  const [loadingCatalog, setLoadingCatalog] = useState(false);

  // Cargar rutina existente si estamos editando
  useEffect(() => {
    if (isEditing) {
      async function loadRoutine() {
        try {
          setLoading(true);
          const res = await routineService.getRoutineById(id);
          const r = res.data;
          setName(r.name || '');
          setDescription(r.description || '');
          setDifficulty(r.difficulty || 'intermediate');
          setEstimatedDuration(r.estimatedDuration || 60);

          if (r.exercises) {
            setExercises(
              r.exercises.map((item, idx) => ({
                exercise: item.exercise,
                order: item.order ?? idx,
                targetSets: item.targetSets || 3,
                targetReps: item.targetReps || 10,
                targetWeight: item.targetWeight || 0,
                restSeconds: item.restSeconds || 90
              }))
            );
          }
        } catch (err) {
          setErrorMsg('No se pudo cargar la rutina');
        } finally {
          setLoading(false);
        }
      }
      loadRoutine();
    }
  }, [id, isEditing]);

  // Cargar catálogo de ejercicios para el selector modal
  useEffect(() => {
    if (isExerciseModalOpen) {
      async function loadCatalog() {
        try {
          setLoadingCatalog(true);
          const [exRes, mgRes] = await Promise.all([
            exerciseService.getExercises({
              search: modalSearch,
              muscleGroup: modalMuscleFilter
            }),
            exerciseService.getMuscleGroups()
          ]);
          setCatalogExercises(exRes.data || []);
          setMuscleGroups(mgRes.data || []);
        } catch (err) {
          console.error('Error al cargar catálogo:', err.message);
        } finally {
          setLoadingCatalog(false);
        }
      }
      loadCatalog();
    }
  }, [isExerciseModalOpen, modalSearch, modalMuscleFilter]);

  // Añadir ejercicio a la lista de la rutina
  const handleAddExerciseToRoutine = (ex) => {
    // Si ya está, permitir añadir serie o notificar
    const exId = ex.id || ex._id;
    const alreadyExists = exercises.some((item) => {
      const itemExId = item.exercise?.id || item.exercise?._id || item.exercise;
      return itemExId === exId;
    });

    if (alreadyExists) {
      // Evitar duplicar el mismo ejercicio en la misma rutina
      return;
    }

    setExercises((prev) => [
      ...prev,
      {
        exercise: ex,
        order: prev.length,
        targetSets: 3,
        targetReps: 10,
        targetWeight: 0,
        restSeconds: 90
      }
    ]);
  };

  // Reordenar ejercicios
  const handleMoveExercise = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= exercises.length) return;

    const updated = [...exercises];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // Actualizar orden
    updated.forEach((item, idx) => {
      item.order = idx;
    });

    setExercises(updated);
  };

  // Remover ejercicio
  const handleRemoveExercise = (index) => {
    const updated = exercises.filter((_, idx) => idx !== index);
    updated.forEach((item, idx) => {
      item.order = idx;
    });
    setExercises(updated);
  };

  // Modificar atributos de un ejercicio en la lista
  const handleUpdateExerciseField = (index, field, value) => {
    setExercises((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: Number(value) };
      return copy;
    });
  };

  // Guardar en backend / PostgreSQL
  const handleSaveRoutine = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('El nombre de la rutina es obligatorio');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name: name.trim(),
        description: description.trim(),
        difficulty,
        estimatedDuration: Number(estimatedDuration),
        exercises: exercises.map((item, idx) => ({
          exercise: item.exercise?.id || item.exercise?._id || item.exercise,
          order: idx,
          targetSets: Number(item.targetSets) || 3,
          targetReps: Number(item.targetReps) || 10,
          targetWeight: Number(item.targetWeight) || 0,
          restSeconds: Number(item.restSeconds) || 90
        }))
      };

      if (isEditing) {
        await routineService.updateRoutine(id, payload);
      } else {
        await routineService.createRoutine(payload);
      }

      navigate('/routines');
    } catch (err) {
      setErrorMsg(err.message || 'Error al guardar la rutina');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Cargando configuración de rutina..." />;
  }

  const unit = user?.preferredWeightUnit || 'kg';

  return (
    <div>
      {/* Botón Volver y Título */}
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          onClick={() => navigate('/routines')}
          className="forge-btn forge-btn-ghost"
          style={{ marginBottom: '0.75rem', padding: '0.4rem 0.6rem' }}
        >
          <ArrowLeft size={16} /> Volver a Rutinas
        </button>
        <h1 className="display-title">
          {isEditing ? 'EDITAR RUTINA' : 'NUEVA RUTINA'}
        </h1>
        <p className="page-subtitle">
          Configura tus ejercicios, series, repeticiones y tiempos de descanso.
        </p>
      </div>

      {errorMsg && (
        <div
          style={{
            backgroundColor: 'var(--danger-muted)',
            border: '1px solid var(--danger)',
            color: 'var(--danger)',
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            fontSize: '0.9rem'
          }}
        >
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSaveRoutine}>
        {/* Parámetros Generales de la Rutina */}
        <div className="forge-card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Información General
          </h3>

          <div className="forge-grid-2">
            <div className="forge-input-group">
              <label className="forge-label">Nombre de la Rutina *</label>
              <input
                type="text"
                required
                placeholder="Ej. Pecho y Tríceps - Hipertrofia"
                className="forge-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="forge-input-group">
                <label className="forge-label">Nivel de Dificultad</label>
                <select
                  className="forge-select"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option value="beginner">Principiante</option>
                  <option value="intermediate">Intermedio</option>
                  <option value="advanced">Avanzado</option>
                </select>
              </div>

              <div className="forge-input-group">
                <label className="forge-label">Duración Est. (min)</label>
                <input
                  type="number"
                  min="5"
                  max="300"
                  className="forge-input"
                  value={estimatedDuration}
                  onChange={(e) => setEstimatedDuration(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="forge-input-group" style={{ marginBottom: 0 }}>
            <label className="forge-label">Descripción u Objetivos</label>
            <textarea
              rows="2"
              placeholder="Enfocada en ganar fuerza e hipertrofia en torso..."
              className="forge-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        {/* Sección de Ejercicios y Series */}
        <div className="forge-card" style={{ marginBottom: '2rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                Ejercicios ({exercises.length})
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Establece el orden de ejecución y las metas de cada ejercicio.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsExerciseModalOpen(true)}
              className="forge-btn forge-btn-secondary"
            >
              <Plus size={16} />
              Añadir Ejercicio desde Catálogo
            </button>
          </div>

          {exercises.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '3rem 1.5rem',
                border: '1px dashed var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-secondary)'
              }}
            >
              <Dumbbell size={36} color="var(--accent)" style={{ margin: '0 auto 0.75rem' }} />
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                Aún no has agregado ejercicios a esta rutina
              </p>
              <p style={{ fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                Haz clic en el botón superior para seleccionar ejercicios del catálogo.
              </p>
              <button
                type="button"
                onClick={() => setIsExerciseModalOpen(true)}
                className="forge-btn forge-btn-primary"
              >
                <Plus size={16} /> Explorar Ejercicios
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {exercises.map((item, index) => {
                const exName = item.exercise?.name || 'Ejercicio';
                const muscleName =
                  item.exercise?.muscleGroup?.name ||
                  (typeof item.exercise?.muscleGroup === 'string'
                    ? item.exercise.muscleGroup
                    : 'Músculo');

                return (
                  <div
                    key={item.exercise?._id || index}
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.25rem'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1rem',
                        flexWrap: 'wrap',
                        gap: '0.75rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.4rem',
                            color: 'var(--accent)',
                            width: '26px'
                          }}
                        >
                          #{index + 1}
                        </span>
                        <div>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
                            {exName}
                          </h4>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            {muscleName} • {item.exercise?.equipment || 'Equipamiento'}
                          </span>
                        </div>
                      </div>

                      {/* Botones de orden y eliminar */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <button
                          type="button"
                          onClick={() => handleMoveExercise(index, -1)}
                          disabled={index === 0}
                          className="forge-btn-ghost"
                          style={{ padding: '0.35rem', opacity: index === 0 ? 0.3 : 1 }}
                          title="Mover arriba"
                        >
                          <ArrowUp size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveExercise(index, 1)}
                          disabled={index === exercises.length - 1}
                          className="forge-btn-ghost"
                          style={{
                            padding: '0.35rem',
                            opacity: index === exercises.length - 1 ? 0.3 : 1
                          }}
                          title="Mover abajo"
                        >
                          <ArrowDown size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveExercise(index)}
                          className="forge-btn-ghost"
                          style={{ padding: '0.35rem', color: 'var(--danger)' }}
                          title="Eliminar de la rutina"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Inputs de configuración del ejercicio */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                        gap: '1rem',
                        paddingTop: '0.5rem',
                        borderTop: '1px solid rgba(255, 255, 255, 0.05)'
                      }}
                    >
                      <div>
                        <label className="forge-label" style={{ fontSize: '0.75rem' }}>
                          Series
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          className="forge-input"
                          style={{ padding: '0.5rem 0.75rem' }}
                          value={item.targetSets}
                          onChange={(e) =>
                            handleUpdateExerciseField(index, 'targetSets', e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <label className="forge-label" style={{ fontSize: '0.75rem' }}>
                          Repeticiones
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          className="forge-input"
                          style={{ padding: '0.5rem 0.75rem' }}
                          value={item.targetReps}
                          onChange={(e) =>
                            handleUpdateExerciseField(index, 'targetReps', e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <label className="forge-label" style={{ fontSize: '0.75rem' }}>
                          Peso Sugerido ({unit})
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          className="forge-input"
                          style={{ padding: '0.5rem 0.75rem' }}
                          value={item.targetWeight}
                          onChange={(e) =>
                            handleUpdateExerciseField(index, 'targetWeight', e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <label className="forge-label" style={{ fontSize: '0.75rem' }}>
                          Descanso (segundos)
                        </label>
                        <input
                          type="number"
                          min="15"
                          max="600"
                          step="15"
                          className="forge-input"
                          style={{ padding: '0.5rem 0.75rem' }}
                          value={item.restSeconds}
                          onChange={(e) =>
                            handleUpdateExerciseField(index, 'restSeconds', e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Botones Finales de Guardado */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button
            type="button"
            onClick={() => navigate('/routines')}
            className="forge-btn forge-btn-ghost"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="forge-btn forge-btn-primary"
            style={{ padding: '0.75rem 2rem' }}
          >
            <Save size={18} />
            {saving ? 'Guardando en Atlas...' : 'Guardar Rutina'}
          </button>
        </div>
      </form>

      {/* Modal Selector de Ejercicios del Catálogo */}
      <Modal
        isOpen={isExerciseModalOpen}
        onClose={() => setIsExerciseModalOpen(false)}
        title="Catálogo de Ejercicios"
        maxWidth="700px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
              <input
                type="text"
                placeholder="Buscar ejercicio..."
                value={modalSearch}
                onChange={(e) => setModalSearch(e.target.value)}
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

            <select
              value={modalMuscleFilter}
              onChange={(e) => setModalMuscleFilter(e.target.value)}
              className="forge-select"
              style={{ minWidth: '180px' }}
            >
              <option value="">Todos los músculos</option>
              {muscleGroups.map((mg) => {
                const mgId = mg.id || mg._id;
                return (
                  <option key={mgId} value={mgId}>
                    {mg.name}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {loadingCatalog ? (
          <LoadingSpinner text="Cargando catálogo..." size="sm" />
        ) : (
          <div
            style={{
              maxHeight: '380px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              paddingRight: '0.5rem'
            }}
          >
            {catalogExercises.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
                No se encontraron ejercicios con ese criterio.
              </p>
            ) : (
              catalogExercises.map((ex) => {
                const exId = ex.id || ex._id;
                const isSelected = exercises.some((item) => {
                  const itemExId = item.exercise?.id || item.exercise?._id || item.exercise;
                  return itemExId === exId;
                });

                return (
                  <div
                    key={exId}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isSelected ? 'var(--accent-muted)' : 'var(--bg-surface)',
                      border: isSelected ? '1px solid var(--accent)' : '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <div>
                      <h5 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.2rem 0' }}>
                        {ex.name}
                      </h5>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {ex.muscleGroup?.name || 'Músculo'} • {ex.equipment}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddExerciseToRoutine(ex)}
                      disabled={isSelected}
                      className={`forge-btn ${isSelected ? 'forge-btn-ghost' : 'forge-btn-primary'}`}
                      style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                    >
                      {isSelected ? (
                        <>
                          <Check size={14} color="var(--accent)" /> Agregado
                        </>
                      ) : (
                        <>
                          <Plus size={14} /> Agregar
                        </>
                      )}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}

        <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
          <button
            type="button"
            onClick={() => setIsExerciseModalOpen(false)}
            className="forge-btn forge-btn-secondary"
          >
            Listo
          </button>
        </div>
      </Modal>
    </div>
  );
}

