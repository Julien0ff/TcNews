import React, { useState } from 'react';
import Logo from '../components/Logo';
import { supabase } from '../services/supabase';

const LoginSection = () => {
  const [loading, setLoading] = useState(false);

  const handleDiscordLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) {
      console.error('Login error:', error.message);
      setLoading(false);
    }
  };

  return (
    <section style={{ 
      minHeight: '80vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '100px 24px' 
    }}>
      <div style={{
        width: '100%',
        maxWidth: 400,
        padding: '40px',
        borderRadius: 'var(--r-xl)',
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.09)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), 0 8px 40px rgba(0,0,0,0.5)',
        textAlign: 'center',
        animation: 'fade-up 0.5s ease-out'
      }}>
        <Logo variant="full" style={{ justifyContent: 'center', marginBottom: 32 }} />
        
        <h2 style={{ 
          fontFamily: "'Array', sans-serif", 
          fontSize: 22, 
          fontWeight: 700, 
          color: 'var(--text-primary)', 
          marginBottom: 12 
        }}>
          Accès Restreint
        </h2>
        <p style={{ 
          fontSize: 14, 
          color: 'var(--text-secondary)', 
          marginBottom: 32,
          fontFamily: "'Switzer', sans-serif" 
        }}>
          Veuillez vous connecter avec Discord pour gérer les actualités.
        </p>

        <button
          onClick={handleDiscordLogin}
          disabled={loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            width: '100%',
            padding: '14px',
            borderRadius: 8,
            background: '#5865F2',
            border: 'none',
            color: 'white',
            fontSize: 15,
            fontWeight: 600,
            fontFamily: "'Switzer', sans-serif",
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 250ms',
            opacity: loading ? 0.7 : 1
          }}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.background = '#4752C4';
          }}
          onMouseLeave={(e) => {
            if (!loading) e.currentTarget.style.background = '#5865F2';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037 19.736 19.736 0 0 0-4.885 1.515.069.069 0 0 0-.032.027C.533 9.048-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
          {loading ? 'Connexion…' : 'Se connecter avec Discord'}
        </button>

        <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ fontSize: 11, color: 'var(--text-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Système Intranet TCNews v2.5
          </p>
        </div>
      </div>
    </section>
  );
};


export default LoginSection;

