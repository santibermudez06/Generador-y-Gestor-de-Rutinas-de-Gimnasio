import React from 'react';

export default function LoadingSpinner({ text = 'Cargando datos...', size = 'md' }) {
  const sizeMap = {
    sm: '20px',
    md: '36px',
    lg: '48px'
  };

  const spinnerSize = sizeMap[size] || sizeMap.md;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1rem',
        gap: '1rem',
        color: 'var(--text-secondary)'
      }}
    >
      <div
        style={{
          width: spinnerSize,
          height: spinnerSize,
          border: '3px solid rgba(198, 255, 0, 0.15)',
          borderTopColor: 'var(--accent)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}
      />
      {text && <span style={{ fontSize: '0.9rem', letterSpacing: '0.02em' }}>{text}</span>}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

