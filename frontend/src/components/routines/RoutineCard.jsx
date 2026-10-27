import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlayCircle,
  Clock,
  Dumbbell,
  Copy,
  Trash2,
  Edit,
  ChevronRight,
  Flame
} from 'lucide-react';
import Badge from '../common/Badge';

export default function RoutineCard({
  routine,
  onStart,
  onDuplicate,
  onDelete
}) {
  const navigate = useNavigate();

  const difficultyVariant = {
    beginner: 'success',
    intermediate: 'warning',
    advanced: 'danger'
  }[routine.difficulty] || 'lime';

  const difficultyLabel = {
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    advanced: 'Avanzado'
  }[routine.difficulty] || routine.difficulty;

  const exerciseCount = routine.exercises?.length || 0;

  return (
    <div
      className="forge-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '1.25rem',
        height: '100%'
      }}
    >
      <div>
        {/* Header con dificultad y duración */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.75rem'
          }}
        >
          <Badge variant={difficultyVariant}>{difficultyLabel}</Badge>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: 'var(--text-secondary)',
              fontSize: '0.8rem'
            }}
          >
            <Clock size={14} />
            <span>{routine.estimatedDuration || 60} min</span>
          </div>
        </div>

        {/* Título y descripción */}
        <h3
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '0.4rem',
            lineHeight: 1.2
          }}
        >
          {routine.name}
        </h3>
        {routine.description && (
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.85rem',
              marginBottom: '1rem',
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {routine.description}
          </p>
        )}

        {/* Resumen de ejercicios */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1rem',
            border: '1px solid var(--border-color)',
            marginBottom: '0.5rem'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.5rem',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              fontWeight: 600
            }}
          >
            <span>Ejercicios Programados</span>
            <span style={{ color: 'var(--accent)' }}>{exerciseCount} total</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {routine.exercises?.slice(0, 3).map((item, idx) => (
              <div
                key={item._id || idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.82rem'
                }}
              >
                <span
                  style={{
                    color: 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '190px'
                  }}
                >
                  {item.exercise?.name || 'Ejercicio'}
                </span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', flexShrink: 0 }}>
                  {item.targetSets} × {item.targetReps}
                </span>
              </div>
            ))}
            {exerciseCount > 3 && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                +{exerciseCount - 3} ejercicio(s) más...
              </span>
            )}
            {exerciseCount === 0 && (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Sin ejercicios asignados aún.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        <button
          onClick={() => onStart(routine)}
          className="forge-btn forge-btn-primary"
          style={{ width: '100%', padding: '0.75rem' }}
        >
          <PlayCircle size={18} />
          Iniciar Entrenamiento
        </button>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => navigate(`/routines/${routine._id}/edit`)}
            className="forge-btn forge-btn-secondary"
            style={{ flex: 1, padding: '0.5rem' }}
            title="Editar rutina"
          >
            <Edit size={15} />
            Editar
          </button>
          <button
            onClick={() => onDuplicate(routine._id)}
            className="forge-btn forge-btn-secondary"
            style={{ padding: '0.5rem 0.75rem' }}
            title="Duplicar rutina"
          >
            <Copy size={15} />
          </button>
          <button
            onClick={() => onDelete(routine)}
            className="forge-btn forge-btn-danger"
            style={{ padding: '0.5rem 0.75rem' }}
            title="Eliminar rutina"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

