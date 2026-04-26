import React from 'react';

const STATUS_CONFIG = {
  normal: {
    label: 'Normal',
    color: 'var(--status-ok)',
    glowColor: 'var(--status-ok-glow)',
    bg: 'rgba(45, 184, 125, 0.10)',
    border: 'rgba(45, 184, 125, 0.25)',
  },
  disrupted: {
    label: 'Perturbé',
    color: 'var(--status-warn)',
    glowColor: 'var(--status-warn-glow)',
    bg: 'rgba(245, 166, 35, 0.10)',
    border: 'rgba(245, 166, 35, 0.25)',
  },
  interrupted: {
    label: 'Interrompu',
    color: 'var(--status-err)',
    glowColor: 'var(--status-err-glow)',
    bg: 'rgba(232, 68, 90, 0.10)',
    border: 'rgba(232, 68, 90, 0.25)',
  },
  works: {
    label: 'Travaux',
    color: '#3498db',
    glowColor: 'rgba(52, 152, 219, 0.25)',
    bg: 'rgba(52, 152, 219, 0.10)',
    border: 'rgba(52, 152, 219, 0.25)',
  },
};


const StatusBadge = ({ status = 'normal', size = 'md' }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.normal;
  const isSmall = size === 'sm';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isSmall ? 5 : 6,
        padding: isSmall ? '3px 8px' : '5px 11px',
        borderRadius: 6,
        background: config.bg,
        border: `1px solid ${config.border}`,
        fontSize: isSmall ? 11 : 12,
        fontWeight: 600,
        color: config.color,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        fontFamily: "'Switzer', sans-serif",
      }}
    >
      <span
        style={{
          width: isSmall ? 6 : 7,
          height: isSmall ? 6 : 7,
          borderRadius: '50%',
          background: config.color,
          boxShadow: `0 0 8px ${config.glowColor}`,
          flexShrink: 0,
          animation: status !== 'normal' ? 'pulse-dot 1.5s ease-in-out infinite' : 'pulse-dot 3s ease-in-out infinite',
        }}
      />
      {config.label}
    </span>
  );
};

export default StatusBadge;
