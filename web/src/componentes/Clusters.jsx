import React, { useState, useEffect } from 'react';
import { useI18n } from '../data/translations.jsx';
import { CLUSTERS } from '../data/destinos.jsx';
import I from '../ui/iconos.jsx';
import Btn from '../ui/Boton.jsx';

function Clusters({ onSelect }) {
  const { t } = useI18n();
  const [hover, setHover] = useState(null);
  const [vw, setVw] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isMobile = vw < 768;
  const isTablet = vw >= 768 && vw < 1024;

  
  const gridCols = isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)';
  const cardHeight = isMobile ? 220 : isTablet ? 360 : 460;

  return (
    <section style={{ background: 'var(--bg)', padding: isMobile ? '72px 0 56px' : '120px 0 80px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: isMobile ? '0 20px' : '0 32px' }}>

        {}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'flex-end',
          marginBottom: isMobile ? 28 : 48,
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 16 : 24,
        }}>
          <div style={{ maxWidth: 720 }}>
            <div className="eyebrow" style={{ marginBottom: 12 }}>{t('clusters.eyebrow', 'Cuatro destinos principales · 34 rutas en temporada')}</div>
            <h2 style={{ margin: 0, fontSize: isMobile ? 'clamp(28px,8vw,40px)' : 'clamp(36px,4vw,56px)', lineHeight: 1.04 }}>
              {t('clusters.title', 'Explora los destinos de Bolivia.')}
            </h2>
            {!isMobile && (
              <p style={{ fontSize: 18, color: 'var(--fg2)', marginTop: 16, maxWidth: 580 }}>
                {t('clusters.desc', 'Explora las regiones más icónicas: el inmenso altiplano, los majestuosos valles, la vibrante zona metropolitana y la profunda amazonía.')}
              </p>
            )}
          </div>
          <Btn kind="ghost">{t('clusters.viewAll', 'View all destinations')} <I.ArrowR size={15}/></Btn>
        </div>

        {}
        <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: isMobile ? 12 : 18 }}>
          {CLUSTERS.map((c, i) => (
            <article key={c.id}
              onClick={() => onSelect(c)}
              onMouseEnter={() => setHover(c.id)}
              onMouseLeave={() => setHover(null)}
              style={{
                position: 'relative', height: cardHeight,
                borderRadius: isMobile ? 14 : 18, overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: hover === c.id ? 'var(--shadow-xl)' : 'var(--shadow-md)',
                transform: hover === c.id ? 'translateY(-6px)' : 'translateY(0)',
                transition: 'all 320ms var(--ease-out)',
              }}>

              {}
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: c.img,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transform: hover === c.id ? 'scale(1.08)' : 'scale(1.0)',
                transition: 'transform 700ms var(--ease-out)',
              }}/>

              {}
              {!isMobile && (
                <div style={{
                  position: 'absolute', top: -40, right: -40,
                  width: 280, height: 280,
                  color: 'rgba(255,255,255,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transform: hover === c.id ? 'scale(1.1) rotate(-6deg)' : 'scale(1) rotate(0deg)',
                  transition: 'transform 600ms var(--ease-out)',
                }}>
                  {React.cloneElement(c.glyph, { size: 280 })}
                </div>
              )}

              {}
              <div style={{
                position: 'absolute', inset: 0,
                background: isMobile
                  ? 'linear-gradient(180deg, rgba(13,18,30,0.05) 0%, rgba(13,18,30,0.75) 60%, rgba(13,18,30,0.95) 100%)'
                  : 'linear-gradient(180deg, rgba(13,18,30,0.15) 0%, rgba(13,18,30,0.0) 35%, rgba(13,18,30,0.55) 70%, rgba(13,18,30,0.92) 100%)',
              }}/>

              {}
              <div style={{
                position: 'absolute', top: isMobile ? 12 : 18, left: isMobile ? 12 : 18,
                width: isMobile ? 38 : 52, height: isMobile ? 38 : 52, borderRadius: isMobile ? 10 : 14,
                background: c.color, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 24px -6px rgba(0,0,0,0.4)',
              }}>
                {React.cloneElement(c.glyph, { size: isMobile ? 18 : 28 })}
              </div>

              {}
              {!isMobile && (
                <div style={{
                  position: 'absolute', top: 22, right: 18,
                  padding: '5px 12px', borderRadius: 999,
                  background: 'rgba(13,18,30,0.55)', color: '#fff',
                  border: '1px solid rgba(255,255,255,0.25)',
                  backdropFilter: 'blur(10px)',
                  fontSize: 11, fontWeight: 700, letterSpacing: 0.4,
                  textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                }}>{c.count} {t('clusters.routes', 'rutas')}</div>
              )}

              {}
              {!isMobile && (
                <div style={{
                  position: 'absolute', top: 80, right: 18,
                  width: 200,
                  opacity: hover === c.id ? 1 : 0,
                  transform: hover === c.id ? 'translateX(0)' : 'translateX(8px)',
                  transition: 'all 280ms var(--ease-out)',
                  pointerEvents: 'none',
                }}>
                  <div style={{
                    background: 'rgba(13,18,30,0.7)',
                    border: '1px solid rgba(255,255,255,0.22)',
                    backdropFilter: 'blur(14px)',
                    borderRadius: 12, padding: '12px 14px',
                    color: '#fff', fontSize: 11, lineHeight: 1.6,
                  }}>
                    <div style={{ fontWeight: 800, letterSpacing: 0.3, textTransform: 'uppercase', fontSize: 10, color: 'var(--amber-300)', marginBottom: 6 }}>{t('clusters.topPicks', 'Top picks')}</div>
                    {c.highlights.slice(0, 3).map((h, idx) => (
                      <div key={h} style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                        <span style={{ color: 'var(--amber-300)' }}>›</span><span>{t('cluster.' + c.id + '.highlights.' + idx, h)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {}
              <div style={{
                position: 'absolute',
                left: isMobile ? 12 : 22,
                right: isMobile ? 12 : 22,
                bottom: isMobile ? 12 : 22,
                color: '#fff',
                textShadow: '0 1px 4px rgba(0,0,0,0.4)',
              }}>
                {!isMobile && (
                  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--amber-300)' }}>{`Destino 0${i+1}`}</div>
                )}
                <h3 style={{
                  margin: isMobile ? '0 0 2px' : '8px 0 6px',
                  fontFamily: 'var(--font-display)',
                  fontSize: isMobile ? 20 : 30, lineHeight: 1.05,
                  letterSpacing: '-0.02em', fontWeight: 700,
                  color: '#fff',
                }}>{t('cluster.' + c.id + '.title', c.title)}</h3>
                <div style={{ fontSize: isMobile ? 11 : 13, opacity: 0.9, lineHeight: 1.45, marginBottom: isMobile ? 0 : 14 }}>
                  {t('cluster.' + c.id + '.sub', c.sub)}
                </div>

                {}
                {!isMobile && (
                  <div style={{
                    display: 'flex', flexWrap: 'wrap', gap: '6px 14px',
                    fontSize: 11, fontFamily: 'var(--font-mono)',
                    color: 'rgba(255,255,255,0.85)', letterSpacing: 0.3,
                    paddingTop: 12, marginBottom: 14,
                    borderTop: '1px solid rgba(255,255,255,0.18)',
                  }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <I.Mountain size={11}/> {t('cluster.' + c.id + '.altitude', c.altitude || '3,650 – 4,200m')}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <I.Calendar size={11}/> {t('cluster.' + c.id + '.bestTime', c.bestTime || 'May – Oct (dry)')}
                    </span>
                  </div>
                )}

                {!isMobile && (
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    fontSize: 12, fontWeight: 700, letterSpacing: 0.4,
                    textTransform: 'uppercase',
                    color: hover === c.id ? 'var(--amber-300)' : '#fff',
                    transition: 'color 220ms',
                  }}>{t('clusters.exploreHighlights', 'Explore highlights')} <I.ArrowR size={14}/></div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
export default Clusters;
