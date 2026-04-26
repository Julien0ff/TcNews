import React, { useState } from 'react';

export const CATEGORIES = ['Réseau', 'Infrastructure', 'Grève', 'Travaux', 'Innovation', 'Institutionnel'];

const CATEGORY_COLORS = {
  'Réseau': '#5191CD',
  'Infrastructure': '#6ECA97',
  'Grève': '#E8445A',
  'Travaux': '#F5A623',
  'Innovation': '#62259D',
  'Institutionnel': '#7A8496',
};

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '255,255,255';
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`;
}

function getCategoryEmoji(cat) {
  const map = {
    'Réseau': '🚉', 'Infrastructure': '🏗️', 'Grève': '✊',
    'Travaux': '🔧', 'Innovation': '⚡', 'Institutionnel': '🏛️',
  };
  return map[cat] || '📰';
}

const ArticleCard = ({ article, variant = 'standard', isLocal = false, onDelete, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const catColor = CATEGORY_COLORS[article.category] || '#7A8496';

  if (variant === 'hero') {
    return (
      <article
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative',
          gridColumn: '1 / -1',
          padding: 0,
          borderRadius: 'var(--r-xl)',
          background: hovered ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: hovered ? '1px solid rgba(255,255,255,0.14)' : '1px solid rgba(255,255,255,0.08)',
          boxShadow: hovered
            ? 'inset 0 1px 0 rgba(255,255,255,0.14), 0 12px 40px rgba(0,0,0,0.5)'
            : 'inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 24px rgba(0,0,0,0.4)',
          cursor: 'pointer',
          transition: 'all 300ms cubic-bezier(0.4,0,0.2,1)',
          animation: 'fade-up 0.5s ease both',
          overflow: 'hidden',
        }}
        onClick={() => onClick && onClick(article)}
      >
        <div style={{ display: 'grid', gridTemplateColumns: (article.images && article.images.length > 0) ? '1fr 400px' : '1fr', minHeight: 320 }}>
          <div style={{ padding: '40px 44px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {/* Meta */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <span style={{
                padding: '4px 10px',
                borderRadius: 6,
                background: `rgba(${hexToRgb(catColor)}, 0.12)`,
                border: `1px solid rgba(${hexToRgb(catColor)}, 0.3)`,
                fontSize: 11,
                fontWeight: 700,
                color: catColor,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                fontFamily: "'Switzer', sans-serif",
              }}>
                {article.category}
              </span>
              {isLocal && (
                <span style={{ fontSize: 11, color: 'var(--status-ok)', fontWeight: 600, letterSpacing: '0.04em' }}>
                  ✦ LOCAL
                </span>
              )}
              <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontFamily: "'Switzer', sans-serif" }}>
                {article.date} · {article.read_time}
              </span>
            </div>

            <h2 style={{
              fontFamily: "'Array', sans-serif",
              fontSize: 'clamp(22px, 3vw, 32px)',
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              marginBottom: 16,
            }}>
              {article.title}
            </h2>

            <p style={{
              fontSize: 15,
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              maxWidth: 640,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {article.excerpt}
            </p>

            <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--text-accent)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}>
                Lire l'article
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </span>
              {onDelete && (
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(article.id); }}
                  style={{ fontSize: 12, color: 'var(--status-err)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  Supprimer
                </button>
              )}
            </div>
          </div>

          {(article.images && article.images.length > 0) ? (
            <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
              <img 
                src={article.images[0]} 
                alt={article.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hovered ? 'scale(1.05)' : 'scale(1)', transition: 'transform 1s ease' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(8,10,13,0.8), transparent 30%, transparent 70%, rgba(8,10,13,0.3))' }} />
            </div>
          ) : (
            /* Category visual accent fallback */
            <div style={{
              width: '100%', height: '100%',
              background: `radial-gradient(circle at 40% 30%, rgba(${hexToRgb(catColor)}, 0.3), rgba(${hexToRgb(catColor)}, 0.05))`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 64,
              opacity: hovered ? 1 : 0.7,
              transition: 'opacity 300ms',
            }}>
              {getCategoryEmoji(article.category)}
            </div>
          )}
        </div>
      </article>
    );
  }

  // Standard card
  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        borderRadius: 'var(--r-lg)',
        background: hovered ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: hovered ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(255,255,255,0.06)',
        boxShadow: hovered
          ? 'inset 0 1px 0 rgba(255,255,255,0.12), 0 6px 24px rgba(0,0,0,0.4)'
          : '0 2px 8px rgba(0,0,0,0.2)',
        cursor: 'pointer',
        transition: 'all 250ms cubic-bezier(0.4,0,0.2,1)',
        animation: 'fade-up 0.5s ease both',
        position: 'relative',
        overflow: 'hidden',
      }}
      onClick={() => onClick && onClick(article)}
    >
      {(article.images && article.images.length > 0) && (
        <div style={{ width: '100%', height: 140, overflow: 'hidden', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <img 
            src={article.images[0]} 
            alt={article.title} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hovered ? 'scale(1.08)' : 'scale(1)', transition: 'transform 0.8s ease' }}
          />
        </div>
      )}

      <div style={{ padding: '20px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{
          position: 'absolute',
          top: 0, left: 0,
          width: 3, height: '100%',
          background: `linear-gradient(180deg, ${catColor}, transparent)`,
        }} />

        {/* Category + date */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 12 }}>
          <span style={{
            padding: '3px 8px',
            borderRadius: 5,
            background: `rgba(${hexToRgb(catColor)}, 0.1)`,
            fontSize: 10,
            fontWeight: 700,
            color: catColor,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            fontFamily: "'Switzer', sans-serif",
          }}>
            {article.category}
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontFamily: "'Switzer', sans-serif", whiteSpace: 'nowrap' }}>
            {article.read_time}
          </span>
        </div>

        <h3 style={{
          fontFamily: "'Array', sans-serif",
          fontSize: 15,
          fontWeight: 700,
          lineHeight: 1.3,
          letterSpacing: '-0.02em',
          color: hovered ? 'var(--text-primary)' : 'var(--text-accent)',
          transition: 'color 250ms',
          marginBottom: 10,
        }}>
          {article.title}
        </h3>

        <p style={{
          fontSize: 13,
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          margin: 0,
          marginBottom: 16,
        }}>
          {article.excerpt}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{article.date}</span>
          {isLocal && (
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ fontSize: 11, color: 'var(--status-ok)', fontWeight: 600 }}>LOCAL</span>
              {onDelete && (
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(article.id); }}
                  style={{ fontSize: 11, color: 'var(--status-err)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  Suppr.
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
export { CATEGORY_COLORS, hexToRgb };
