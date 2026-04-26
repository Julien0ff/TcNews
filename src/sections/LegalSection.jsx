import React, { useEffect } from 'react';

const LegalSection = ({ type, onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const content = {
    legal: {
      title: "Mentions Légales",
      sections: [
        {
          h: "Développement",
          p: "Ce site a été conçu et développé par l'équipe TCNews. Tous droits réservés 2026."
        },
        {
          h: "Hébergement",
          p: "Plateforme hébergée sur l'infrastructure moderne de Vercel. Données persistantes gérées par Supabase."
        },
        {
          h: "Source des données",
          p: "Les données de transport en temps réel proviennent exclusivement de l'API Île-de-France Mobilités (IDFM). TCNews n'est pas responsable des retards ou erreurs de données sources."
        }
      ]
    },
    privacy: {
      title: "Confidentialité",
      sections: [
        {
          h: "Données personnelles",
          p: "Nous ne collectons aucune donnée personnelle sur nos visiteurs sans leur consentement explicite. Votre navigation est anonyme."
        },
        {
          h: "Cookies",
          p: "TCNews utilise uniquement des tokens techniques nécessaires à la synchronisation avec Supabase et à la mémorisation de vos préférences de navigation."
        }
      ]
    },
    contact: {
      title: "Contact",
      sections: [
        {
          h: "Support Editorial",
          p: "Pour toute suggestion d'article ou correction, contactez notre équipe éditoriale."
        },
        {
          h: "Email",
          p: "contact@tcnews.net"
        }
      ]
    }
  }[type] || { title: "Section", sections: [] };

  return (
    <section style={{ padding: '100px 0 120px', animation: 'fade-in 0.6s ease' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px' }}>
        <button 
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            color: 'var(--text-accent)', fontSize: 13, fontWeight: 700,
            background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)',
            padding: '8px 16px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)',
            cursor: 'pointer', marginBottom: 40, transition: 'all 200ms',
            textTransform: 'uppercase', letterSpacing: '0.05em'
          }}
        >
          ← Retour
        </button>

        <h1 style={{ 
          fontFamily: "'Array', sans-serif", 
          fontSize: 'clamp(32px, 6vw, 64px)', 
          fontWeight: 700, 
          letterSpacing: '-0.03em', 
          color: 'var(--text-primary)', 
          marginBottom: 60,
          lineHeight: 1
        }}>
          {content.title}
        </h1>

        <div style={{ display: 'grid', gap: 48 }}>
          {content.sections.map((sec, i) => (
            <div key={i} style={{ 
              padding: '32px', 
              borderRadius: 'var(--r-lg)', 
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <h2 style={{ 
                fontFamily: "'Array', sans-serif", 
                fontSize: 16, 
                fontWeight: 700, 
                letterSpacing: '0.1em', 
                textTransform: 'uppercase',
                color: 'var(--text-accent)',
                marginBottom: 16
              }}>
                {sec.h}
              </h2>
              <p style={{ 
                fontSize: 16, 
                color: 'var(--text-secondary)', 
                lineHeight: 1.6,
                fontFamily: "'Switzer', sans-serif"
              }}>
                {sec.p}
              </p>
            </div>
          ))}
        </div>

        {type === 'contact' && (
          <div style={{ marginTop: 60, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 20 }}>📬</div>
            <a href="mailto:contact@tcnews.net" style={{
              display: 'inline-block',
              padding: '16px 40px',
              borderRadius: 'var(--r-md)',
              background: 'var(--text-accent)',
              color: 'var(--bg-void)',
              fontWeight: 800,
              fontSize: 18,
              fontFamily: "'Array', sans-serif",
              transition: 'transform 200ms'
            }} onMouseEnter={e => e.target.style.transform = 'scale(1.05)'} onMouseLeave={e => e.target.style.transform = 'scale(1)'}>
              Envoyer un message
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default LegalSection;
