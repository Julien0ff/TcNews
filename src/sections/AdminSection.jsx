import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '../components/ArticleCard';
import { generateArticleSuggestion } from '../services/ai';
import { fetchArticles, saveArticle, updateArticle, deleteArticle } from '../services/supabase';

const STORAGE_KEY = 'tcnews_articles';

const EMPTY_FORM = {
  title: '',
  excerpt: '',
  content: '',
  category: 'Réseau',
  read_time: '3 min',
  images: [],
};

const AI_SUGGESTIONS = [
  {
    title: "Le Shinkansen Alpha-X atteint 400 km/h lors d'essais nocturnes",
    excerpt: "Le futur fleuron du rail japonais préfigure une nouvelle ère de très haute vitesse, avec une aérodynamique révolutionnaire testée entre Sendai et Aomori.",
    category: "Innovation",
    image: "https://images.unsplash.com/photo-1542105956690-6656daacc531?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Berlin : un tramway 100% autonome en zone urbaine dense",
    excerpt: "La BVG franchit une étape historique avec le lancement d'un service régulier s'appuyant sur des capteurs LiDAR de pointe et une IA de navigation certifiée.",
    category: "Réseau",
    image: "https://images.unsplash.com/photo-1556121176-50360343ef71?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Hyperloop : une première liaison fret validée à Dubaï",
    excerpt: "DP World confirme la faisabilité technique d'un tube pressurisé pour le transport de marchandises à haute valeur ajoutée entre Jebel Ali et le hub logistique.",
    category: "Innovation",
    image: "https://images.unsplash.com/photo-1474487022152-5a98e890de02?auto=format&fit=crop&q=80&w=800"
  }
];

const AdminSection = ({ user, onLogout }) => {
  const [articles, setArticles] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [saved, setSaved] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);

  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchArticles();
      setArticles(data || []);
    } catch (err) {
      console.error('[Admin] Load error:', err);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAIHelp = async () => {
    setLoadingAI(true);
    const suggestion = await generateArticleSuggestion();
    
    if (suggestion) {
      setForm({
        ...suggestion,
        read_time: suggestion.read_time || '3 min'
      });
    } else {
      // Fallback local suggestions (mock)
      const random = AI_SUGGESTIONS[Math.floor(Math.random() * AI_SUGGESTIONS.length)];
      setForm({
        ...random,
        content: "Contenu de l'article généré automatiquement...",
        read_time: '4 min',
        images: [random.image]
      });
      alert("Note : Groq n'est pas configuré. Utilisation des suggestions locales.");
    }
    setLoadingAI(false);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    if (form.images.length + files.length > 8) {
      alert("Limite de 8 images maximum par article pour préserver l'espace de stockage.");
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({
          ...prev,
          images: [...prev.images, reader.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setLoading(true);

    try {
      if (editId !== null) {
        await updateArticle(editId, {
          ...form,
          date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) + ' (Modifié)'
        });
        setEditId(null);
      } else {
        await saveArticle(form);
      }
      
      await loadData();
      setForm(EMPTY_FORM);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error('[Admin] Submit error:', err);
      alert("Erreur lors de l'enregistrement sur Supabase.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (article) => {
    setEditId(article.id);
    setForm({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content || '',
      category: article.category,
      read_time: article.read_time || '5 min',
      images: article.images || (article.image ? [article.image] : []),
    });
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer cet article sur Supabase ?')) {
      setLoading(true);
      try {
        await deleteArticle(id);
        await loadData();
      } catch (err) {
        console.error('[Admin] Delete error:', err);
        alert("Erreur lors de la suppression.");
      } finally {
        setLoading(false);
      }
    }
  };

  const inputStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 8,
    color: 'var(--text-primary)',
    fontFamily: "'Switzer', sans-serif",
    fontSize: 14,
    padding: '11px 14px',
    width: '100%',
    outline: 'none',
    transition: 'border-color 200ms, box-shadow 200ms',
  };

  const labelStyle = {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: 'var(--text-tertiary)',
    display: 'block',
    marginBottom: 6,
    fontFamily: "'Switzer', sans-serif",
  };

  return (
    <section style={{ padding: '100px 0 80px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        
        <header className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{ width: 3, height: 24, background: 'var(--status-err)', borderRadius: 2 }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontFamily: "'Switzer', sans-serif" }}>
                Admin
              </span>
            </div>
            <h1 style={{ fontFamily: "'Array', sans-serif", fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1.1 }}>
              Gestion du Journal
            </h1>
          </div>

          <div className="admin-user-info" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 14px', borderRadius: 100, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {user.avatar ? (
                  <img src={user.avatar} alt="" style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }} />
                ) : (
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>?</div>
                )}
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', fontFamily: "'Switzer', sans-serif" }}>
                  {user.pseudo}
                </span>
              </div>
            )}
            <button 
              onClick={onLogout}
              style={{ 
                padding: '10px 20px', 
                borderRadius: 8, 
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid rgba(255,255,255,0.1)', 
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "'Switzer', sans-serif",
                transition: 'all 200ms'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            >
              Déconnexion
            </button>
          </div>
        </header>


        <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 400px', gap: 32, alignItems: 'start' }}>
          
          <div className="admin-list-container">
            <style>{`
              @media (max-width: 1024px) {
                .admin-grid { grid-template-columns: 1fr !important; }
                .admin-form-sticky { position: relative !important; top: 0 !important; order: -1; }
              }
              @media (max-width: 768px) {
                .admin-header { flex-direction: column !important; align-items: flex-start !important; gap: 24px !important; }
                .admin-user-info { width: 100%; justify-content: space-between; }
              }
            `}</style>

            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {articles.length === 0 ? (
                <div style={{ padding: '60px', textAlign: 'center', borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', color: 'var(--text-tertiary)' }}>
                  <p>Aucun article publié.</p>
                </div>
              ) : (
                articles.map((article) => (
                  <div key={article.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '16px 20px',
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}>
                    {article.images && article.images.length > 0 && (
                      <img src={article.images[0]} alt="" style={{ width: 60, height: 40, borderRadius: 4, objectFit: 'cover' }} />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>{article.category}</span>
                      <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{article.title}</h3>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => handleEdit(article)} style={{ background: 'none', border: 'none', color: 'var(--text-accent)', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Éditer</button>
                      <button onClick={() => handleDelete(article.id)} style={{ background: 'none', border: 'none', color: 'var(--status-err)', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Suppr.</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="admin-form-sticky" style={{ position: 'sticky', top: 100 }}>
            <div style={{
              padding: '28px',
              borderRadius: 'var(--r-xl)',
              background: 'rgba(255,255,255,0.02)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.09)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontFamily: "'Array', sans-serif", fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {editId ? 'Éditer l\'article' : 'Nouvel article'}
                </h2>
                <button 
                  onClick={handleAIHelp}
                  disabled={loadingAI}
                  style={{ 
                    padding: '6px 12px', 
                    borderRadius: 20, 
                    background: loadingAI ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: loadingAI ? 'var(--text-tertiary)' : 'var(--text-primary)',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: loadingAI ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 200ms',
                  }}
                >
                  <span style={{ animation: loadingAI ? 'pulse-dot 1s infinite' : 'none' }}>✦</span>
                  {loadingAI ? 'Recherche…' : 'Aide IA'}
                </button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div>
                  <label style={labelStyle} htmlFor="title">Titre</label>
                  <input id="title" type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Titre de l'article" required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Images (fichiers)</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                    {form.images.map((img, idx) => (
                      <div key={idx} style={{ position: 'relative', width: 64, height: 64 }}>
                        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)' }} />
                        <button 
                          type="button"
                          onClick={() => removeImage(idx)}
                          style={{ position: 'absolute', top: -5, right: -5, background: 'var(--status-err)', color: 'white', border: 'none', borderRadius: '50%', width: 16, height: 16, fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >✕</button>
                      </div>
                    ))}
                    <label style={{ 
                      width: 64, height: 64, borderRadius: 4, border: '1px dashed rgba(255,255,255,0.2)', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                      fontSize: 20, color: 'var(--text-tertiary)', background: 'rgba(255,255,255,0.02)'
                    }}>
                      +
                      <input type="file" multiple accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                    </label>
                  </div>
                </div>
                <div>
                  <label style={labelStyle} htmlFor="excerpt">Résumé (pour la carte)</label>
                  <textarea id="excerpt" value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} placeholder="Bref résumé…" rows={2} required style={{ ...inputStyle, resize: 'vertical' }} />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="content">Contenu de l'article</label>
                  <textarea id="content" value={form.content} onChange={e => setForm({...form, content: e.target.value})} placeholder="Texte complet de l'article…" rows={8} required style={{ ...inputStyle, resize: 'vertical' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={labelStyle} htmlFor="cat">Catégorie</label>
                    <select id="cat" value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={inputStyle}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle} htmlFor="time">Lecture</label>
                    <input
                      id="time"
                      type="text"
                      value={form.read_time}
                      onChange={(e) => setForm({ ...form, read_time: e.target.value })}
                      placeholder="Ex: 5 min"
                      style={inputStyle}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, paddingTop: 6 }}>
                  <button type="submit" style={{ flex: 1, padding: '12px', borderRadius: 8, background: saved ? 'var(--status-ok)' : 'var(--text-accent)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', border: 'none' }}>
                    {saved ? '✓ Publié' : (editId ? 'Mettre à jour' : 'Publier')}
                  </button>
                  {editId && <button type="button" onClick={() => { setEditId(null); setForm(EMPTY_FORM); }} style={{ padding: '12px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer', border: 'none' }}>Annuler</button>}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminSection;
