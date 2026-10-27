import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '5rem 1rem',
        textAlign: 'center'
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: 'var(--bg-surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent)',
          marginBottom: '1.5rem',
          border: '1px solid var(--border-color)'
        }}
      >
        <Dumbbell size={36} />
      </div>

      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '4rem',
          lineHeight: 1,
          color: 'var(--text-primary)',
          margin: 0
        }}
      >
        404
      </h1>

      <p
        style={{
          color: 'var(--text-secondary)',
          fontSize: '1.1rem',
          marginTop: '0.5rem',
          marginBottom: '2rem'
        }}
      >
        Página o ruta no encontrada en FORGE.
      </p>

      <Link to="/" className="forge-btn forge-btn-primary">
        <ArrowLeft size={18} /> Regresar al Dashboard
      </Link>
    </div>
  );
}

