import React, { useState } from 'react';
import StatusBadge from './StatusBadge';

const LineStatusCard = ({ lineKey, lineInfo, status = 'normal', disruptions = [], isSelected, onClick }) => {
  const [hovered, setHovered] = useState(false);

  const isRER = !(/^\d/.test(lineKey));

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`Ligne ${lineInfo.label} — statut ${status}`}
      aria-pressed={isSelected}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: '14px 16px',
        borderRadius: 'var(--r-lg)',
        background: isSelected
          ? `rgba(${hexToRgb(lineInfo.color)}, 0.15)`
          : hovered
            ? 'rgba(255,255,255,0.07)'
            : 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: isSelected
          ? `1px solid rgba(${hexToRgb(lineInfo.color)}, 0.5)`
          : hovered
            ? '1px solid rgba(255,255,255,0.14)'
            : '1px solid rgba(255,255,255,0.07)',
        boxShadow: isSelected
          ? `inset 0 1px 0 rgba(255,255,255,0.12), 0 12px 32px rgba(${hexToRgb(lineInfo.color)}, 0.35)`
          : hovered
            ? 'inset 0 1px 0 rgba(255,255,255,0.1), 0 8px 24px rgba(0,0,0,0.5)'
            : '0 2px 12px rgba(0,0,0,0.3)',
        cursor: 'pointer',
        transform: isSelected ? 'scale(1.02)' : hovered ? 'scale(1.01)' : 'scale(1)',
        zIndex: isSelected ? 10 : 1,
        transition: 'all 400ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        textAlign: 'left',
        width: '100%',
        fontFamily: "'Switzer', sans-serif",
      }}
    >
      {/* Header: picto + label */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        {/* Line disc */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, overflow: 'hidden' }}>
          <div style={{
            width: 34,
            height: 34,
            borderRadius: isRER ? 10 : '50%',
            background: lineInfo.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: isRER ? 16 : 17,
            fontWeight: 800,
            color: lineInfo.textColor,
            fontFamily: "'Array', sans-serif",
            letterSpacing: '-0.02em',
            flexShrink: 0,
            boxShadow: isSelected || hovered
              ? `0 0 15px rgba(${hexToRgb(lineInfo.color)}, 0.4)`
              : 'none',
            transition: 'all 250ms',
            lineHeight: 1,
            padding: 0,
            margin: 0,
            border: 'none',
          }}>
            <span style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              transform: 'translateY(-0.5px)' 
            }}>
              {lineKey}
            </span>
          </div>
        </div>

        <div style={{ flexShrink: 0 }}>
          <StatusBadge status={status} size="sm" />
        </div>
      </div>

      {/* Disruption messages */}
      {disruptions.length > 0 && (
        <div style={{
          fontSize: 12,
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: 8,
        }}>
          {disruptions.slice(0, 1).map((d, i) => (
            <p key={i} style={{ margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {d.header || d.messages?.[0]?.text || 'Perturbation en cours'}
            </p>
          ))}
          {disruptions.length > 1 && (
            <p style={{ margin: '4px 0 0', color: 'var(--text-tertiary)', fontSize: 11 }}>
              +{disruptions.length - 1} autre{disruptions.length - 1 > 1 ? 's' : ''} perturbation{disruptions.length - 1 > 1 ? 's' : ''}
            </p>
          )}
        </div>
      )}
    </button>
  );
};

// Helper: convert hex to R,G,B string for rgba()
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '255,255,255';
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`;
}

export default LineStatusCard;
export { hexToRgb };
