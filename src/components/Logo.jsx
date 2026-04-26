import React from 'react';
import logoSmall from '../assets/logo small.svg';
import logoFull from '../assets/logo text without bg.svg';

// Fallback logo: texte stylisé si les SVG ne sont pas disponibles
const Logo = ({ variant = 'full', style = {}, className = '' }) => {
  const [hasError, setHasError] = React.useState(false);

  if (variant === 'icon') {
    if (logoSmall && !hasError) {
      return (
        <div className={className} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }}>
          <img 
            src={logoSmall} 
            alt="TCNews Icon" 
            style={{ height: '100%', width: 'auto', objectFit: 'contain' }} 
            onError={() => setHasError(true)}
          />
        </div>
      );
    }
    return (
      <div
        className={className}
        style={{
          width: 28, height: 28,
          borderRadius: 6,
          background: 'linear-gradient(135deg, #c8d0e8, #7a8496)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          fontWeight: 800,
          color: '#080a0d',
          fontFamily: "'Array', sans-serif",
          letterSpacing: '-0.04em',
          ...style,
        }}
      >
        TC
      </div>
    );
  }

  if (logoFull && !hasError) {
    return (
      <div className={className} style={{ display: 'flex', alignItems: 'center', ...style }}>
        <img 
          src={logoFull} 
          alt="TCNews" 
          style={{ height: '32px', width: 'auto', objectFit: 'contain' }} 
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        ...style,
      }}
    >
      <div style={{
        width: 26, height: 26,
        borderRadius: 6,
        background: 'linear-gradient(135deg, #c8d0e8, #7a8496)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 11,
        fontWeight: 800,
        color: '#080a0d',
        fontFamily: "'Array', sans-serif",
      }}>
        TC
      </div>
      <span style={{
        fontFamily: "'Array', sans-serif",
        fontSize: 16,
        fontWeight: 700,
        letterSpacing: '-0.03em',
        color: 'var(--text-primary)',
        lineHeight: 1,
      }}>
        TCNews
      </span>
    </div>
  );
};

export default Logo;
