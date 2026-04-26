import React, { useState, useEffect, useCallback, useRef } from 'react';
import { METRO_LINES, RER_LINES, ALL_LINES, fetchLineReport, parseSeverity } from '../services/idfm';
import LineStatusCard, { hexToRgb } from '../components/LineStatusCard';
import StatusBadge from '../components/StatusBadge';

const ALL_LINE_KEYS = [
  ...Object.keys(METRO_LINES),
  ...Object.keys(RER_LINES),
];

const REFRESH_INTERVAL = 90000; // 90 secondes

const ServiceSection = () => {
  const [selectedKey, setSelectedKey] = useState('A');
  const [lineStatuses, setLineStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const timerRef = useRef(null);

  const selectedLineInfo = ALL_LINES[selectedKey];
  const selectedStatus = lineStatuses[selectedKey] || { status: 'normal', disruptions: [] };

  // Apply line color CSS variable dynamically
  useEffect(() => {
    if (selectedLineInfo) {
      document.documentElement.style.setProperty('--line-color', selectedLineInfo.color);
      document.documentElement.style.setProperty('--line-color-glow', `rgba(${hexToRgb(selectedLineInfo.color)}, 0.35)`);
      document.documentElement.style.setProperty('--line-color-dim', `rgba(${hexToRgb(selectedLineInfo.color)}, 0.12)`);
    }
    return () => {
      document.documentElement.style.removeProperty('--line-color');
      document.documentElement.style.removeProperty('--line-color-glow');
      document.documentElement.style.removeProperty('--line-color-dim');
    };
  }, [selectedKey, selectedLineInfo]);

  // Fetch statuses for all visible lines (batch)
  const fetchAllStatuses = useCallback(async () => {
    // Fetch RER + first few metro lines for overview
    const keysToFetch = [...Object.keys(RER_LINES), ...Object.keys(METRO_LINES)];
    const results = {};

    await Promise.all(keysToFetch.map(async (key) => {
      const lineInfo = ALL_LINES[key];
      const data = await fetchLineReport(lineInfo.id);
      if (data) {
        const lineReports = data.line_reports || [];
        const disruptions = lineReports.flatMap((r) => r.disruptions || []);
        results[key] = { status: parseSeverity(lineReports[0] || {}), disruptions };
      } else {
        results[key] = { status: 'normal', disruptions: [] };
      }
    }));

    // Fill remaining with normal
    ALL_LINE_KEYS.forEach((key) => {
      if (!results[key]) results[key] = { status: 'normal', disruptions: [] };
    });

    setLineStatuses(results);
    setLastUpdated(new Date());
    setLoading(false);
  }, []);

  // Fetch detail for selected line
  const fetchDetail = useCallback(async (key) => {
    setDetailLoading(true);
    const lineInfo = ALL_LINES[key];
    const data = await fetchLineReport(lineInfo.id);
    if (data) {
      const lineReports = data.line_reports || [];
      const disruptions = lineReports.flatMap((r) => r.disruptions || []);
      setDetailData({ disruptions, lineReports });
    } else {
      setDetailData(null);
    }
    setDetailLoading(false);
  }, []);

  useEffect(() => {
    fetchAllStatuses();
    timerRef.current = setInterval(fetchAllStatuses, REFRESH_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [fetchAllStatuses]);

  useEffect(() => {
    fetchDetail(selectedKey);
  }, [selectedKey, fetchDetail]);

  const formatTime = (date) => {
    if (!date) return '—';
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const isRER = !(/^\d/.test(selectedKey));
  const lineStatus = lineStatuses[selectedKey] || { status: 'normal', disruptions: [] };

  return (
    <section style={{ padding: '100px 0 80px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>

        <header style={{ marginBottom: 40, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{
                width: 3, height: 24,
                background: 'var(--line-color)',
                borderRadius: 2,
                boxShadow: '0 0 12px var(--line-color-glow)',
                transition: 'background 400ms, box-shadow 400ms',
              }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontFamily: "'Switzer', sans-serif" }}>
                Service
              </span>
            </div>
            <h1 style={{
              fontFamily: "'Array', sans-serif",
              fontSize: 'clamp(28px, 4vw, 42px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              lineHeight: 1.1,
            }}>
              État du réseau<br />
              <span style={{ color: 'var(--line-color)', transition: 'color 400ms' }}>
                en temps réel
              </span>
            </h1>
          </div>

          {/* Last update */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 10, 
            color: 'var(--text-tertiary)', 
            fontSize: 12, 
            fontFamily: "'Switzer', sans-serif",
            padding: '8px 16px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 20,
            border: '1px solid rgba(255,255,255,0.05)',
            marginBottom: 6
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--status-ok)',
              boxShadow: '0 0 8px var(--status-ok-glow)',
              animation: 'pulse-dot 2s ease infinite',
            }} />
            {loading ? 'Chargement…' : `Mis à jour à ${formatTime(lastUpdated)}`}
            <span style={{ marginLeft: 4, padding: '2px 6px', borderRadius: 4, background: 'rgba(255,255,255,0.06)', fontSize: 10, fontWeight: 700, letterSpacing: '0.05em' }}>RÉSEAU IDFM</span>
          </div>
        </header>

        <div className="service-layout" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'minmax(0, 1fr) 380px', 
          gap: 24, 
          alignItems: 'start' 
        }}>
          <style>{`
            @media (max-width: 1100px) {
              .service-layout {
                grid-template-columns: 1fr !important;
              }
              .detail-panel {
                position: relative !important;
                top: 0 !important;
              }
            }
          `}</style>

          {/* LEFT: Line grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* RER */}
            <div>
              <h2 style={{ fontFamily: "'Array', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 12 }}>
                RER
              </h2>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', 
                gap: 12,
                transition: 'all 300ms'
              }}>
                {Object.entries(RER_LINES).map(([key, info]) => (
                  <LineStatusCard
                    key={key}
                    lineKey={key}
                    lineInfo={info}
                    status={loading ? 'normal' : (lineStatuses[key]?.status || 'normal')}
                    disruptions={lineStatuses[key]?.disruptions || []}
                    isSelected={selectedKey === key}
                    onClick={() => setSelectedKey(key)}
                  />
                ))}
              </div>
            </div>

            {/* Métro */}
            <div>
              <h2 style={{ fontFamily: "'Array', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 12 }}>
                Métro
              </h2>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', 
                gap: 12,
                transition: 'all 300ms'
              }}>
                {Object.entries(METRO_LINES).map(([key, info]) => (
                  <LineStatusCard
                    key={key}
                    lineKey={key}
                    lineInfo={info}
                    status={loading ? 'normal' : (lineStatuses[key]?.status || 'normal')}
                    disruptions={lineStatuses[key]?.disruptions || []}
                    isSelected={selectedKey === key}
                    onClick={() => setSelectedKey(key)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="detail-panel" style={{
            position: 'sticky',
            top: 100,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}>
            {/* Line hero */}
            <div style={{
              padding: '28px',
              borderRadius: 'var(--r-xl)',
              background: `linear-gradient(135deg, rgba(${hexToRgb(selectedLineInfo?.color || '#ffffff')}, 0.15), rgba(${hexToRgb(selectedLineInfo?.color || '#ffffff')}, 0.04))`,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: `1px solid rgba(${hexToRgb(selectedLineInfo?.color || '#ffffff')}, 0.35)`,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.12), 0 0 40px rgba(${hexToRgb(selectedLineInfo?.color || '#ffffff')}, 0.15)`,
              transition: 'all 400ms cubic-bezier(0.4,0,0.2,1)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                {/* Big line disc */}
                <div style={{
                  width: isRER ? 64 : 60,
                  height: isRER ? 64 : 60,
                  borderRadius: isRER ? 14 : '50%',
                  background: selectedLineInfo?.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: isRER ? 26 : 28,
                  fontWeight: 800,
                  color: selectedLineInfo?.textColor,
                  fontFamily: "'Array', sans-serif",
                  boxShadow: `0 0 40px rgba(${hexToRgb(selectedLineInfo?.color || '#ffffff')}, 0.5)`,
                  transition: 'all 400ms',
                  flexShrink: 0,
                }}>
                  {selectedKey}
                </div>
                <div>
                  <h3 style={{ 
                    fontFamily: "'Array', sans-serif", 
                    fontSize: 32, 
                    fontWeight: 700, 
                    letterSpacing: '-0.02em', 
                    color: 'var(--text-primary)',
                    marginTop: 0
                  }}>
                    {selectedLineInfo?.label}
                  </h3>
                </div>
              </div>

              <StatusBadge status={lineStatus.status} />
            </div>

            {/* Disruption detail */}
            <div style={{
              padding: '22px',
              borderRadius: 'var(--r-lg)',
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.07)',
              maxHeight: 360,
              overflowY: 'auto',
            }}>
              <h4 style={{ fontFamily: "'Array', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 14 }}>
                État du trafic
              </h4>

              {detailLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[1, 2].map((n) => (
                    <div key={n} className="skeleton" style={{ height: 60, borderRadius: 8 }} />
                  ))}
                </div>
              ) : lineStatus.disruptions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div style={{ fontSize: 42, marginBottom: 12 }}>👍</div>
                  <p style={{ fontSize: 14, color: 'var(--status-ok)', fontWeight: 700, fontFamily: "'Array', sans-serif", textTransform: 'uppercase', letterSpacing: '0.05em' }}>Trafic normal</p>
                  <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>Aucune perturbation signalée</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {lineStatus.disruptions.map((d, idx) => (
                    <div key={idx} style={{
                      padding: '14px 16px',
                      borderRadius: 8,
                      background: 'rgba(245,166,35,0.07)',
                      border: '1px solid rgba(245,166,35,0.2)',
                    }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--status-warn)', marginBottom: 4, fontFamily: "'Array', sans-serif" }}>
                        {d.header || d.severity?.name || 'Perturbation'}
                      </p>
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                        {d.messages?.[0]?.text || d.header || 'Service perturbé. Consultez les affichages en station.'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Refresh button */}
            <button
              onClick={() => { fetchAllStatuses(); fetchDetail(selectedKey); }}
              style={{
                padding: '12px 20px',
                borderRadius: 'var(--r-md)',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'var(--text-secondary)',
                fontSize: 13,
                fontFamily: "'Switzer', sans-serif",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                cursor: 'pointer',
                transition: 'all 200ms',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                <path d="M21 3v5h-5"/>
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                <path d="M8 16H3v5"/>
              </svg>
              Actualiser
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
