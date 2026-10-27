import React from 'react';
import { Dumbbell, Info, ChevronRight } from 'lucide-react';
import Badge from '../common/Badge';

export default function ExerciseCard({ exercise, onSelect }) {
  const difficultyVariant = {
    beginner: 'success',
    intermediate: 'warning',
    advanced: 'danger'
  }[exercise.difficulty] || 'lime';

  const difficultyLabel = {
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    advanced: 'Avanzado'
  }[exercise.difficulty] || exercise.difficulty;

  const muscleName = exercise.muscleGroup?.name || 'Músculo';

  return (
    <div
      onClick={() => onSelect(exercise)}
      className="forge-card"
      style={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all var(--transition-fast)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(198, 255, 0, 0.4)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-color)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '0.5rem',
            marginBottom: '0.75rem'
          }}
        >
          <Badge variant="lime">{muscleName}</Badge>
          <Badge variant={difficultyVariant}>{difficultyLabel}</Badge>
        </div>

        <h3
          style={{
            fontSize: '1.15rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '0.4rem',
            lineHeight: 1.2
          }}
        >
          {exercise.name}
        </h3>

        {exercise.description && (
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.82rem',
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              marginBottom: '1rem'
            }}
          >
            {exercise.description}
          </p>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border-color)',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Dumbbell size={14} color="var(--accent)" />
          {exercise.equipment}
        </span>
        <span
          style={{
            color: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.2rem',
            fontWeight: 600
          }}
        >
          Ver técnica <ChevronRight size={14} />
        </span>
      </div>
    </div>
  );
}

