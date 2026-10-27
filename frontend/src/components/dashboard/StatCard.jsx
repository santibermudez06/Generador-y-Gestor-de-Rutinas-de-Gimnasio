import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({
  title,
  value,
  unit = '',
  icon: Icon,
  trend = null,
  trendText = '',
  subtitle = ''
}) {
  const isPositive = trend > 0;
  const isNegative = trend < 0;

  return (
    <div className="forge-card" style={{ position: 'relative', overflow: 'hidden' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '0.75rem'
        }}
      >
        <span
          style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
        >
          {title}
        </span>
        {Icon && (
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent)',
              border: '1px solid var(--border-color)'
            }}
          >
            <Icon size={18} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '0.4rem' }}>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2.4rem',
            lineHeight: 1,
            color: 'var(--text-primary)',
            fontWeight: 700
          }}
        >
          {value}
        </span>
        {unit && (
          <span style={{ fontSize: '1rem', color: 'var(--accent)', fontWeight: 600 }}>
            {unit}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
        {trend !== null && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.2rem',
              fontWeight: 700,
              color: isPositive ? 'var(--success)' : isNegative ? 'var(--danger)' : 'var(--text-secondary)'
            }}
          >
            {isPositive ? <TrendingUp size={14} /> : isNegative ? <TrendingDown size={14} /> : null}
            {isPositive ? `+${trend}%` : `${trend}%`}
          </span>
        )}
        <span style={{ color: 'var(--text-muted)' }}>{trendText || subtitle}</span>
      </div>
    </div>
  );
}

