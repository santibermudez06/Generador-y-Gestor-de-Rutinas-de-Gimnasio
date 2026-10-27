import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Dumbbell, ChevronRight } from 'lucide-react';
import EmptyState from '../common/EmptyState';

export default function RecentWorkoutsList({ workouts = [], unit = 'kg' }) {
  const navigate = useNavigate();

  if (!workouts || workouts.length === 0) {
    return (
      <EmptyState
        title="Sin entrenamientos registrados"
        description="Aún no has completado sesiones de entrenamiento. Inicia tu primera sesión hoy."
        actionButton={
          <button
            onClick={() => navigate('/active-workout')}
            className="forge-btn forge-btn-primary"
          >
            Iniciar Entrenamiento
          </button>
        }
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      {workouts.map((w) => {
        const formattedDate = new Date(w.date).toLocaleDateString('es-ES', {
          weekday: 'short',
          day: 'numeric',
          month: 'short'
        });

        return (
          <div
            key={w._id}
            onClick={() => navigate(`/history`)}
            className="forge-card"
            style={{
              padding: '1.1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'transform var(--transition-fast), border-color var(--transition-fast)'
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <Dumbbell size={20} />
              </div>

              <div>
                <h4
                  style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginBottom: '0.25rem'
                  }}
                >
                  {w.name}
                </h4>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                    color: 'var(--text-secondary)',
                    fontSize: '0.8rem'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Calendar size={13} /> {formattedDate}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={13} /> {w.durationMinutes} min
                  </span>
                  <span>{w.completedSets} series</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ textAlign: 'right' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.6rem',
                    lineHeight: 1,
                    color: 'var(--accent)',
                    display: 'block'
                  }}
                >
                  {w.totalVolume.toLocaleString()}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Volumen ({unit})
                </span>
              </div>
              <ChevronRight size={18} color="var(--text-muted)" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

