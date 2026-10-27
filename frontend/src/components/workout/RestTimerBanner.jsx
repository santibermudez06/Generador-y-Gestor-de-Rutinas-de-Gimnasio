import React from 'react';
import { Clock, Play, Pause, SkipForward, Plus } from 'lucide-react';
import { useActiveWorkout } from '../../context/ActiveWorkoutContext';

export default function RestTimerBanner() {
  const {
    isResting,
    restSecondsLeft,
    totalRestTarget,
    stopRestTimer,
    addRestSeconds,
    startRestTimer
  } = useActiveWorkout();

  if (!isResting && restSecondsLeft === 0) return null;

  const minutes = Math.floor(restSecondsLeft / 60);
  const seconds = restSecondsLeft % 60;
  const progressPercent = totalRestTarget > 0 ? (restSecondsLeft / totalRestTarget) * 100 : 0;

  return (
    <div
      style={{
        position: 'sticky',
        top: '1rem',
        zIndex: 40,
        marginBottom: '1.5rem',
        backgroundColor: 'var(--bg-panel)',
        border: '2px solid var(--accent)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 8px 30px rgba(198, 255, 0, 0.25)',
        overflow: 'hidden'
      }}
      className="pulse-lime"
    >
      {/* Barra de progreso visual superior */}
      <div
        style={{
          height: '4px',
          backgroundColor: 'var(--bg-surface)',
          width: '100%'
        }}
      >
        <div
          style={{
            height: '100%',
            backgroundColor: 'var(--accent)',
            width: `${progressPercent}%`,
            transition: 'width 1s linear'
          }}
        />
      </div>

      <div
        style={{
          padding: '0.85rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent)',
              color: '#090B0A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800
            }}
          >
            <Clock size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase' }}>
              Temporizador de Descanso
            </div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2rem',
                lineHeight: 1,
                color: 'var(--text-primary)'
              }}
            >
              {minutes}:{seconds.toString().padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* Controles de descanso */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => addRestSeconds(15)}
            className="forge-btn forge-btn-secondary"
            style={{ padding: '0.45rem 0.8rem', fontSize: '0.8rem' }}
            title="Añadir 15 segundos"
          >
            <Plus size={14} /> +15s
          </button>

          <button
            onClick={() => {
              if (isResting) {
                stopRestTimer();
              } else {
                startRestTimer(restSecondsLeft || 60);
              }
            }}
            className="forge-btn forge-btn-secondary"
            style={{ padding: '0.45rem 0.8rem' }}
            title={isResting ? 'Pausar' : 'Reanudar'}
          >
            {isResting ? <Pause size={16} /> : <Play size={16} />}
          </button>

          <button
            onClick={stopRestTimer}
            className="forge-btn forge-btn-ghost"
            style={{ padding: '0.45rem 0.8rem', color: 'var(--text-secondary)' }}
            title="Saltar descanso"
          >
            <SkipForward size={16} /> Saltar
          </button>
        </div>
      </div>
    </div>
  );
}

