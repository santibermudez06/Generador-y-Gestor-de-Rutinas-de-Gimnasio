import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Clock,
  Flame,
  Layers,
  ChevronRight,
  Dumbbell,
  History,
  CheckCircle2
} from 'lucide-react';
import { workoutService } from '../services/workoutService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';

export default function HistoryPage() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const { user } = useAuth();

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const res = await workoutService.getWorkouts({ status: 'completed' });
      setWorkouts(res.data || []);
    } catch (err) {
      console.error('Error al cargar historial:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const unit = user?.preferredWeightUnit || 'kg';

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
            Registro Histórico
          </span>
          <h1 className="display-title">HISTORIAL DE ENTRENAMIENTOS</h1>
          <p className="page-subtitle">
            Consulta todas las sesiones completadas y revisa tus cargas pasadas.
          </p>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Consultando historial de entrenamientos..." />
      ) : workouts.length === 0 ? (
        <EmptyState
          title="No hay entrenamientos completados"
          description="Tus sesiones finalizadas aparecerán aquí con el desglose exacto de peso y repeticiones."
          icon={History}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {workouts.map((w) => {
            const formattedDate = new Date(w.startedAt).toLocaleDateString('es-ES', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            });

            const completedSets = w.sets?.filter((s) => s.completed).length || 0;
            const totalVol =
              w.totalVolume ??
              w.sets?.reduce((sum, s) => {
                return s.completed ? sum + (s.weight || 0) * (s.repetitions || 0) : sum;
              }, 0) ??
              0;

            const durationMin = Math.round((w.durationSeconds || 60) / 60);

            // Extraer nombres de ejercicios únicos
            const uniqueExercises = [
              ...new Set(
                w.sets
                  ?.filter((s) => s.exercise?.name)
                  .map((s) => s.exercise.name)
              )
            ];

            return (
              <div
                key={w.id || w._id}
                onClick={() => setSelectedWorkout(w)}
                className="forge-card"
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1.25rem',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(198, 255, 0, 0.4)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-surface)',
                      color: 'var(--accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <Dumbbell size={22} />
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                        {w.name}
                      </h3>
                      {w.routine && <Badge variant="gray">{w.routine.name}</Badge>}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)',
                        flexWrap: 'wrap'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Calendar size={13} /> {formattedDate}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={13} /> {durationMin} min
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Layers size={13} /> {completedSets} series completadas
                      </span>
                    </div>

                    {uniqueExercises.length > 0 && (
                      <div
                        style={{
                          fontSize: '0.78rem',
                          color: 'var(--text-muted)',
                          marginTop: '0.4rem'
                        }}
                      >
                        {uniqueExercises.join(' • ')}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '2rem',
                        lineHeight: 1,
                        color: 'var(--accent)'
                      }}
                    >
                      {totalVol.toLocaleString()}
                    </div>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase'
                      }}
                    >
                      Volumen Total ({unit})
                    </span>
                  </div>

                  <ChevronRight size={20} color="var(--text-muted)" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Detalle de la Sesión Completada */}
      <Modal
        isOpen={Boolean(selectedWorkout)}
        onClose={() => setSelectedWorkout(null)}
        title={selectedWorkout?.name || 'Detalle del Entrenamiento'}
        maxWidth="700px"
      >
        {selectedWorkout && (
          <div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem',
                marginBottom: '1.5rem',
                textAlign: 'center'
              }}
            >
              <div
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  padding: '0.85rem 0.5rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <Clock size={16} color="var(--accent)" style={{ margin: '0 auto 0.2rem' }} />
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>
                  {Math.round((selectedWorkout.durationSeconds || 60) / 60)} min
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>DURACIÓN</span>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  padding: '0.85rem 0.5rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <Flame size={16} color="var(--accent)" style={{ margin: '0 auto 0.2rem' }} />
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--accent)' }}>
                  {(
                    selectedWorkout.totalVolume ??
                    selectedWorkout.sets?.reduce((sum, s) => {
                      return s.completed ? sum + (s.weight || 0) * (s.repetitions || 0) : sum;
                    }, 0) ??
                    0
                  ).toLocaleString()}
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  VOLUMEN ({unit})
                </span>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  padding: '0.85rem 0.5rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <CheckCircle2 size={16} color="var(--accent)" style={{ margin: '0 auto 0.2rem' }} />
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>
                  {selectedWorkout.sets?.filter((s) => s.completed).length || 0}
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  SERIES COMPLETADAS
                </span>
              </div>
            </div>

            {/* Listado de series ejecutadas */}
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--accent)' }}>
              SERIES REGISTRADAS
            </h4>

            <div
              style={{
                maxHeight: '350px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}
            >
              {selectedWorkout.sets?.map((s, idx) => (
                <div
                  key={s._id || idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      {s.exercise?.name || 'Ejercicio'}
                    </span>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Serie #{s.setNumber || idx + 1}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: 700, color: 'var(--accent)', fontSize: '1.05rem' }}>
                      {s.weight} {unit} × {s.repetitions} reps
                    </span>
                    <div style={{ fontSize: '0.7rem', color: s.completed ? 'var(--success)' : 'var(--danger)' }}>
                      {s.completed ? '✓ Completada' : '✗ No completada'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
              <button
                onClick={() => setSelectedWorkout(null)}
                className="forge-btn forge-btn-secondary"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
