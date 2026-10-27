import React from 'react';
import { Dumbbell } from 'lucide-react';

export default function EmptyState({
  title = 'No hay datos registrados',
  description = 'Comienza agregando elementos o iniciando un nuevo entrenamiento.',
  icon: Icon = Dumbbell,
  actionButton = null
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3.5rem 1.5rem',
        textAlign: 'center',
        background: 'var(--bg-panel)',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--border-color)',
        margin: '1.5rem 0'
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'var(--bg-surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
          color: 'var(--accent)',
          border: '1px solid var(--border-color)'
        }}
      >
        <Icon size={28} />
      </div>

      <h4
        style={{
          fontSize: '1.15rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '0.4rem'
        }}
      >
        {title}
      </h4>

      <p
        style={{
          color: 'var(--text-secondary)',
          fontSize: '0.9rem',
          maxWidth: '420px',
          marginBottom: actionButton ? '1.5rem' : '0'
        }}
      >
        {description}
      </p>

      {actionButton && <div>{actionButton}</div>}
    </div>
  );
}

