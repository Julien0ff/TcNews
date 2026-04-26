import React, { useState } from 'react';
import logo from '../assets/logo text without bg.svg';

const LandingSection = ({ onEnter }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(() => {
      onEnter();
    }, 800); // Wait for animation
  };
  return (
    <section style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--bg-void)',
      color: 'var(--text-primary)',
      fontFamily: "'Switzer', sans-serif"
    }}>
      {/* Subtle Grid Background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: isExiting ? 0 : 1,
        transition: 'opacity 0.8s ease'
      }} />

      {/* Grain / Noise Texture */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.04,
        pointerEvents: 'none',
        zIndex: 1,
        background: 'url("https://grains.vercel.app/grain.png") repeat'
      }} />

      {/* Hero Content */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 60,
        animation: 'fade-up 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: isExiting ? 0 : 1,
        transform: isExiting ? 'scale(1.05) translateY(-20px)' : 'scale(1) translateY(0)',
        transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20
        }}>
          <img
            src={logo}
            alt="TCNEWS"
            style={{
              width: 'clamp(280px, 60vw, 800px)',
              height: 'auto',
              filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.1)) brightness(1.2)'
            }}
          />
          <p style={{
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: '0.6em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)',
            margin: 0
          }}>
            L'actu des mobilités
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={handleEnter}
          className="landing-cta"
          style={{
            padding: '20px 48px',
            borderRadius: 40,
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.15)',
            color: 'var(--text-primary)',
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <span style={{ position: 'relative', zIndex: 1 }}>Accéder aux news</span>
          <span style={{
            fontSize: 20,
            transition: 'transform 400ms',
            display: 'inline-block'
          }} className="arrow">→</span>

          <style>{`
            .landing-cta:hover {
              background: rgba(255,255,255,1);
              color: #000;
              border-color: #fff;
              transform: translateY(-4px);
              box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 0 100px rgba(255,255,255,0.1);
            }
            .landing-cta:hover .arrow {
              transform: translateX(6px);
            }
            .landing-cta:active {
              transform: translateY(0);
            }
            @keyframes fade-up {
              from { opacity: 0; transform: translateY(40px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </button>
      </div>

      {/* Decorative Bottom Tag */}
      <div style={{
        position: 'absolute',
        bottom: 40,
        left: 40,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.2em',
        color: 'rgba(255,255,255,0.15)',
        textTransform: 'uppercase',
        zIndex: 2
      }}>
        Edition Mondiale 2026
      </div>
    </section>
  );
};

export default LandingSection;
