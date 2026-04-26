import React from 'react';
import Logo from './Logo';

const NAV_ITEMS = [
  {
    id: 'journal',
    label: 'Journal',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
        <path d="M18 14h-8M15 18h-5M10 6h8v4h-8V6Z" />
      </svg>
    ),
  },
  {
    id: 'service',
    label: 'Infos',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="2" />
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
  },
  {
    id: 'admin',
    label: 'Admin',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
];

const Dock = ({ active, onNavigate, showAdmin = false }) => {
  const filteredItems = NAV_ITEMS.filter(item => item.id !== 'admin' || showAdmin);

  return (
    <nav
      style={{
        position: 'fixed',
        top: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        padding: '10px 12px',
        borderRadius: '20px',
        background: 'rgba(18, 22, 31, 0.72)',
        backdropFilter: 'blur(28px) saturate(200%)',
        WebkitBackdropFilter: 'blur(28px) saturate(200%)',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), 0 8px 48px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.5)',
        animation: 'fade-down 0.5s cubic-bezier(0.4,0,0.2,1) both',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '6px 16px 6px 8px', borderRight: '1px solid rgba(255,255,255,0.08)', marginRight: 8, display: 'flex', alignItems: 'center' }}>
        <Logo variant="icon" style={{ height: 28, width: 28 }} />
      </div>

      {/* Nav buttons */}
      {filteredItems.map((item) => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '10px 20px',
              borderRadius: 12,
              color: isActive ? '#eef0f5' : 'rgba(138,144,160,0.8)',
              background: isActive ? 'rgba(255,255,255,0.09)' : 'transparent',
              border: isActive ? '1px solid rgba(255,255,255,0.14)' : '1px solid transparent',
              boxShadow: isActive
                ? 'inset 0 1px 0 rgba(255,255,255,0.15), 0 2px 8px rgba(0,0,0,0.3)'
                : 'none',
              transition: 'all 200ms cubic-bezier(0.4,0,0.2,1)',
              fontFamily: "'Switzer', sans-serif",
              fontSize: 13,
              fontWeight: isActive ? 600 : 400,
              lineHeight: 1,
              letterSpacing: '0.01em',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = '#c8d0e8';
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = 'rgba(138,144,160,0.8)';
                e.currentTarget.style.background = 'transparent';
              }
            }}
            aria-label={`Naviguer vers ${item.label}`}
            aria-current={isActive ? 'page' : undefined}
          >
            <span style={{ 
              opacity: isActive ? 1 : 0.7, 
              transition: 'opacity 200ms',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {item.icon}
            </span>
            <span style={{ display: 'flex', alignItems: 'center' }}>{item.label}</span>

            {/* Active indicator dot */}
            {isActive && (
              <span style={{
                position: 'absolute',
                bottom: 5,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: 'var(--line-color, #c8d0e8)',
                boxShadow: '0 0 6px var(--line-color, #c8d0e8)',
                animation: 'pulse-dot 2s ease-in-out infinite',
              }} />
            )}
          </button>
        );
      })}
    </nav>
  );
};


export default Dock;
