import React from 'react';
import { Trophy, Award } from 'lucide-react';

export default function PersonalRecordsCard({ records = [], unit = 'kg' }) {
  if (!records || records.length === 0) {
    return (
      <div className="forge-card" style={{ height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <Trophy size={20} color="var(--accent)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Récords Personales</h3>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Aún no se han registrado récords personales. Completa series en tus entrenamientos para ver tus cargas máximas aquí.
        </p>
      </div>
    );
  }

  return (
    <div className="forge-card" style={{ height: '100%' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Trophy size={20} color="var(--accent)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Récords Personales</h3>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600 }}>
          Top Cargas
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {records.map((r, index) => (
          <div
            key={r.exerciseId || index}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: index === 0 ? 'var(--accent)' : 'var(--bg-panel)',
                  color: index === 0 ? '#090B0A' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.75rem'
                }}
              >
                #{index + 1}
              </div>
              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                {r.exerciseName}
              </span>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.4rem',
                  lineHeight: 1,
                  color: 'var(--accent)'
                }}
              >
                {r.maxWeight}{' '}
                <small style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{unit}</small>
              </span>
              {r.repetitions && (
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  a {r.repetitions} rep{r.repetitions > 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

