import React, { useState, useEffect } from 'react';
import ArticleCard from '../components/ArticleCard';
import ArticleDetail from './ArticleDetail';
import { supabase, fetchArticles } from '../services/supabase';

const STORAGE_KEY = 'tcnews_articles';

const JournalSection = () => {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      setLoading(true);
      const data = await fetchArticles();
      setArticles(data || []);
      setLoading(false);
    };
    loadArticles();
  }, []);

  const heroArticle = articles.find(a => a.featured) || articles[0];
  const restArticles = articles.filter(a => a.id !== heroArticle?.id);

  if (selectedArticle) {
    return <ArticleDetail article={selectedArticle} onBack={() => setSelectedArticle(null)} />;
  }

  return (
    <section style={{ padding: '100px 0 80px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>

        <header style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ width: 3, height: 24, background: 'var(--text-accent)', borderRadius: 2, boxShadow: '0 0 8px rgba(200,208,232,0.4)' }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontFamily: "'Switzer', sans-serif" }}>
              Journal
            </span>
          </div>
          <h1 style={{ fontFamily: "'Array', sans-serif", fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1.1 }}>
            Actualités & Mobilités<br />Mondiales
          </h1>
          {loading && <div style={{ marginTop: 20, color: 'var(--text-tertiary)', fontSize: 13 }}>Synchronisation Supabase...</div>}
        </header>

        {!loading && articles.length === 0 && (
          <div style={{
            padding: '100px 24px',
            textAlign: 'center',
            borderRadius: 24,
            background: 'rgba(255,255,255,0.02)',
            border: '1px dashed rgba(255,255,255,0.1)',
            color: 'var(--text-tertiary)',
            fontFamily: "'Switzer', sans-serif"
          }}>
            <div style={{ fontSize: 40, marginBottom: 20 }}>🗞️</div>
            <h3 style={{ fontSize: 18, color: 'var(--text-primary)', marginBottom: 8 }}>Aucun article publié</h3>
            <p style={{ fontSize: 14 }}>Les dernières actualités des transports arriveront bientôt.</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {heroArticle && (
            <ArticleCard
              key={heroArticle.id}
              article={heroArticle}
              variant="hero"
              onClick={setSelectedArticle}
            />
          )}

          {restArticles.map((article, idx) => (
            <ArticleCard
              key={article.id}
              article={article}
              variant="standard"
              onClick={setSelectedArticle}
              style={{ animationDelay: `${idx * 0.05}s` }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default JournalSection;
