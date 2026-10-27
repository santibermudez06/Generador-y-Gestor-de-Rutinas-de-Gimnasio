import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = '550px' }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="forge-modal-overlay" onClick={onClose}>
      <div
        className="forge-modal-content"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid var(--border-color)'
          }}
        >
          <h3
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-sans)',
              letterSpacing: '-0.02em'
            }}
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            className="forge-btn-ghost"
            style={{
              padding: '0.4rem',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
}

