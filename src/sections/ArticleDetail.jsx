import React, { useEffect } from 'react';
import { hexToRgb, CATEGORY_COLORS } from '../components/ArticleCard';

const ArticleDetail = ({ article, onBack }) => {
  const catColor = CATEGORY_COLORS[article.category] || '#7A8496';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ animation: 'fade-in 0.6s ease' }}>
      {/* Hero Header */}
      <header style={{ 
        position: 'relative', 
        height: '60vh', 
        minHeight: 400, 
        width: '100%',
        overflow: 'hidden',
        background: 'var(--bg-void)'
      }}>
        {article.images && article.images.length > 0 ? (
          <img 
            src={article.images[0]} 
            alt={article.title} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}
          />
        ) : (
          <div style={{ 
            width: '100%', height: '100%', 
            background: `radial-gradient(circle at 50% 50%, rgba(${hexToRgb(catColor)}, 0.4), var(--bg-void))` 
          }} />
        )}
        
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: 'linear-gradient(to bottom, transparent 20%, var(--bg-void) 95%)' 
        }} />

        <div style={{ 
          position: 'absolute', 
          bottom: 40, width: '100%', 
          padding: '0 24px', 
          maxWidth: 900, 
          left: '50%', transform: 'translateX(-50%)' 
        }}>
          <button 
            onClick={onBack}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600,
              background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)',
              padding: '8px 16px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer', marginBottom: 24, transition: 'all 200ms'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            ← Retour au journal
          </button>

          <span style={{
            display: 'inline-block',
            padding: '4px 12px', borderRadius: 6,
            background: `rgba(${hexToRgb(catColor)}, 0.15)`,
            border: `1px solid rgba(${hexToRgb(catColor)}, 0.4)`,
            fontSize: 12, fontWeight: 800, color: catColor,
            textTransform: 'uppercase', letterSpacing: '0.05em',
            marginBottom: 16, fontFamily: "'Switzer', sans-serif"
          }}>
            {article.category}
          </span>
          
          <h1 style={{ 
            fontFamily: "'Array', sans-serif", 
            fontSize: 'clamp(32px, 5vw, 56px)', 
            lineHeight: 1,
            color: 'var(--text-primary)',
            letterSpacing: '-0.04em',
            marginBottom: 20
          }}>
            {article.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20, color: 'var(--text-tertiary)', fontSize: 14 }}>
            <span>{article.date}</span>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'currentColor' }} />
            <span>Temps de lecture : {article.read_time}</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main style={{ 
        maxWidth: 900, 
        margin: '0 auto', 
        padding: '60px 24px 100px', 
        display: 'grid', 
        gridTemplateColumns: '1fr', 
        gap: 60 
      }}>
        <div style={{ fontSize: 18, color: 'var(--text-accent)', lineHeight: 1.6, fontWeight: 500 }}>
          {article.excerpt}
        </div>

        <div style={{ 
          fontSize: 17, 
          color: 'var(--text-secondary)', 
          lineHeight: 1.8, 
          whiteSpace: 'pre-wrap',
          fontFamily: "'Switzer', sans-serif"
        }}>
          {article.content || "Faites défiler pour voir plus d'images..."}
        </div>

        {/* Gallery */}
        {article.images && article.images.length > 1 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginTop: 40 }}>
            {article.images.slice(1).map((img, idx) => (
              <div key={idx} style={{ 
                borderRadius: 'var(--r-lg)', 
                overflow: 'hidden', 
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)'
              }}>
                <img src={img} alt="" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer CTA */}
      <footer style={{ 
        padding: '60px 24px', 
        textAlign: 'center', 
        borderTop: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(255,255,255,0.02)'
      }}>
          <button 
            onClick={onBack}
            style={{
              color: 'var(--bg-void)', 
              fontSize: 15, 
              fontWeight: 700,
              background: 'var(--text-accent)',
              padding: '12px 32px', 
              borderRadius: 'var(--r-md)', 
              border: 'none',
              cursor: 'pointer', 
              transition: 'transform 200ms',
              fontFamily: "'Array', sans-serif"
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            Retourner au journal
          </button>
      </footer>
    </div>
  );
};

export default ArticleDetail;
