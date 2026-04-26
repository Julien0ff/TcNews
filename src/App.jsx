import React, { useState, useEffect } from 'react';
import './index.css';
import Dock from './components/Dock';
import JournalSection from './sections/JournalSection';
import ServiceSection from './sections/ServiceSection';
import AdminSection from './sections/AdminSection';
import LegalSection from './sections/LegalSection';
import LoginSection from './sections/LoginSection';
import LandingSection from './sections/LandingSection';
import { supabase } from './services/supabase';

const AUTHORIZED_DISCORD_ID = '1064801165201641592';


const App = () => {
  const [activeSection, setActiveSection] = useState('landing');
  const [user, setUser] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    // Check if ?admin is in the URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('admin')) {
      setActiveSection('admin');
      // Clean up URL without refreshing
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {

      handleAuthChange(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleAuthChange(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthChange = (session) => {
    if (session?.user) {
      const discordId = session.user.user_metadata?.provider_id || session.user.identities?.[0]?.id;
      const isAuthorized = discordId === AUTHORIZED_DISCORD_ID;
      
      setUser({
        id: discordId,
        pseudo: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
        avatar: session.user.user_metadata?.avatar_url,
      });
      setIsAdminAuthenticated(isAuthorized);
    } else {
      setUser(null);
      setIsAdminAuthenticated(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setActiveSection('journal');
  };



  // Subtle ambient background gradient that shifts per section
  const ambientColors = {
    journal: 'radial-gradient(ellipse 80% 50% at 20% -10%, rgba(80, 90, 120, 0.15), transparent)',
    service: 'radial-gradient(ellipse 70% 45% at 80% 0%, rgba(var(--line-r, 90), var(--line-g, 80), var(--line-b, 120), 0.12), transparent)',
    admin:   'radial-gradient(ellipse 60% 40% at 50% -5%, rgba(60, 70, 100, 0.12), transparent)',
  };

  const renderSection = () => {
    if (activeSection === 'admin') {
      return isAdminAuthenticated ? (
        <AdminSection user={user} onLogout={handleLogout} />
      ) : (
        <LoginSection />
      );
    }


    if (activeSection === 'landing') return <LandingSection onEnter={() => setActiveSection('journal')} />;
    if (activeSection === 'journal') return <JournalSection />;
    if (activeSection === 'service') return <ServiceSection />;
    if (['legal', 'privacy', 'contact'].includes(activeSection)) {
      return <LegalSection type={activeSection} onBack={() => setActiveSection('service')} />;
    }
    
    return null;
  };

  return (
    <>
      {/* Ambient background layer */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          background: ambientColors[activeSection] || ambientColors.journal,
          transition: 'background 600ms cubic-bezier(0.4,0,0.2,1)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Main content */}
      <main style={{ position: 'relative', zIndex: 1, minHeight: '100vh', paddingBottom: activeSection === 'landing' ? 0 : 160 }}>
        {renderSection()}
      </main>

      {/* Footer */}
      {activeSection !== 'landing' && (
        <footer style={{ 
          position: 'relative', 
          zIndex: 1, 
          padding: '60px 24px 140px', 
          borderTop: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(0,0,0,0.2)',
          textAlign: 'center'
        }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 24, fontSize: 12, color: 'var(--text-tertiary)' }}>
              <button 
                onClick={() => setActiveSection('legal')} 
                style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', transition: 'color 200ms' }} 
                onMouseEnter={e => e.target.style.color = 'var(--text-secondary)'} 
                onMouseLeave={e => e.target.style.color = 'var(--text-tertiary)'}
              >
                Mentions Légales
              </button>
              <button 
                onClick={() => setActiveSection('privacy')} 
                style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', transition: 'color 200ms' }} 
                onMouseEnter={e => e.target.style.color = 'var(--text-secondary)'} 
                onMouseLeave={e => e.target.style.color = 'var(--text-tertiary)'}
              >
                Confidentialité
              </button>
              <button 
                onClick={() => setActiveSection('contact')} 
                style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', transition: 'color 200ms' }} 
                onMouseEnter={e => e.target.style.color = 'var(--text-secondary)'} 
                onMouseLeave={e => e.target.style.color = 'var(--text-tertiary)'}
              >
                Contact
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <p style={{ 
                fontSize: 13, 
                fontWeight: 700, 
                fontFamily: "'Array', sans-serif", 
                color: 'var(--text-secondary)',
                letterSpacing: '0.05em'
              }}>
                TCNEWS™ — TRANSPORTS FRANCILIENS
              </p>
              <p style={{ fontSize: 11, color: 'var(--text-tertiary)', maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
                © 2026 TCNews. Tous droits réservés. Les données de trafic en temps réel sont fournies par Île-de-France Mobilités (Réseau IDFM). 
                Toute reproduction ou utilisation des marques citées est soumise à autorisation.
              </p>
            </div>
          </div>
        </footer>
      )}

      {/* Floating Dock */}
      {activeSection !== 'landing' && (
        <Dock active={activeSection} onNavigate={setActiveSection} showAdmin={isAdminAuthenticated} />
      )}

    </>
  );
};

export default App;
