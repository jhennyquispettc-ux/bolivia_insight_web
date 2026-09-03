import React, { useEffect, useMemo, useState } from 'react';
import { useI18n } from '../data/translations.jsx';
import I from '../ui/iconos.jsx';
import IMG from '../ui/imagenes.jsx';
import Btn from '../ui/Boton.jsx';
import PoiSelector from '../componentes/calculador/PoiSelector.jsx';
import LiveSummary from '../componentes/calculador/LiveSummary.jsx';
import ProfilePicker from '../componentes/calculador/ProfilePicker.jsx';
import RouteMap from '../componentes/calculador/RouteMap.jsx';
import RouteResult from '../componentes/calculador/RouteResult.jsx';
import { apiUrl } from '../data/api.js';

const MAX_POIS = 10;
const MIN_POIS = 2;

function RouteCalculator({ onBack }) {
  const { t } = useI18n();
  const [vw, setVw] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [pois, setPois] = useState([]);
  const [graph, setGraph] = useState(null);
  const [bootError, setBootError] = useState(null);
  const [loadingBoot, setLoadingBoot] = useState(true);

  const [selected, setSelected] = useState(() => new Set());
  const [startSlug, setStartSlug] = useState(null);
  const [profile, setProfile] = useState('balanced');
  const [circuit, setCircuit] = useState(false);

  const [result, setResult] = useState(null);
  const [calcLoading, setCalcLoading] = useState(false);
  const [calcError, setCalcError] = useState(null);

  const isMobile = vw < 960;

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    let alive = true;
    setLoadingBoot(true);

    const loadData = async () => {
      try {
        const [resPois, resGraph] = await Promise.all([
          fetch(apiUrl('/routes/pois?city=la-paz')),
          fetch(apiUrl('/routes/graph?city=la-paz'))
        ]);

        if (!resPois.ok || !resGraph.ok) throw new Error('Request failed');

        const p = await resPois.json();
        const g = await resGraph.json();

        if (alive) { setPois(p); setGraph(g); }
      } catch (err) {
        if (alive) setBootError(err.message || 'network');
      } finally {
        if (alive) setLoadingBoot(false);
      }
    };

    loadData();
    return () => { alive = false; };
  }, []);

  const poisBySlug = useMemo(() => {
    const m = new Map();
    for (const p of pois) m.set(p.slug, p);
    return m;
  }, [pois]);

  const stayMinutes = useMemo(() => {
    let s = 0;
    for (const slug of selected) {
      const p = poisBySlug.get(slug);
      if (p) s += p.visitMinutes;
    }
    return s;
  }, [selected, poisBySlug]);

  const toggleSelected = (slug) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
        if (startSlug === slug) setStartSlug(null);
      } else {
        next.add(slug);
      }
      return next;
    });
    setResult(null);
  };

  const handleStartChange = (slug) => {
    setStartSlug(slug);
    setSelected((prev) => {
      if (prev.has(slug)) return prev;
      const next = new Set(prev);
      next.add(slug);
      return next;
    });
    setResult(null);
  };

  const canCalculate =
    selected.size >= MIN_POIS &&
    selected.size <= MAX_POIS &&
    startSlug &&
    selected.has(startSlug);

  const handleCalculate = async () => {
    setCalcLoading(true);
    setCalcError(null);
    try {
      const body = {
        poiSlugs: Array.from(selected),
        startSlug,
        profile,
        circuit,
        city: 'la-paz',
      };

      const res = await fetch(apiUrl('/routes/calculate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        let detail = 'Request failed';
        try { const j = await res.json(); detail = j.message || detail; } catch { }
        throw new Error(detail);
      }

      const data = await res.json();
      setResult(data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setCalcError(err.message || t('planner.error.network', 'No pudimos calcular la ruta. Intenta de nuevo.'));
    } finally {
      setCalcLoading(false);
    }
  };

  if (bootError) {
    return (
      <main style={{ paddingTop: 120, paddingInline: 24, maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        <h1>{t('planner.error.bootTitle', 'No pudimos cargar el planificador')}</h1>
        <p className="body">{t('planner.error.bootDesc', 'No pudimos conectar con el servidor. Vuelve a intentarlo en unos segundos.')}</p>
        <p className="caption" style={{ marginTop: 8, color: 'var(--rust-600)' }}>{bootError}</p>
        <Btn kind="primary" onClick={() => window.location.reload()} style={{ marginTop: 16 }}>
          {t('planner.error.retry', 'Reintentar')}
        </Btn>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ═══════════════════════════════════════════ HERO */}
      <section style={{
        color: '#fff',
        padding: isMobile ? '56px 0 64px' : '80px 0 96px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Photo background */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: IMG.photoMetro,
          backgroundSize: 'cover', backgroundPosition: 'center 40%',
        }} />
        {/* Overlay gradient */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(15,23,42,0.88) 0%, rgba(179,63,46,0.70) 55%, rgba(13,18,30,0.92) 100%)',
        }} />
        {/* Amber glow top-right */}
        <div style={{ position: 'absolute', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,183,3,0.18) 0%, transparent 65%)', pointerEvents: 'none' }} />
        {/* Blue glow bottom-left */}
        <div style={{ position: 'absolute', bottom: -100, left: -80, width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(29,78,216,0.15) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 20px' : '0 32px', position: 'relative' }}>

          {/* Back button */}
          <button onClick={onBack} style={{
            background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)',
            color: '#fff', padding: '8px 14px', borderRadius: 999, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 12, fontWeight: 700, marginBottom: 24, fontFamily: 'var(--font-sans)',
          }}>
            <I.ArrowL size={13} /> {t('planner.back', 'Volver al inicio')}
          </button>

          {/* Eyebrow */}
          <div className="eyebrow" style={{ color: 'var(--amber-300)', marginBottom: 12 }}>
            {t('planner.eyebrow', 'Herramienta 04 · Planificación')}
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: isMobile ? 'clamp(36px,9vw,48px)' : 'clamp(48px,6vw,80px)',
            lineHeight: 0.95, color: '#fff', margin: '0 0 0', fontWeight: 600,
            letterSpacing: '-0.035em', maxWidth: 900,
          }}>
            {t('planner.title', 'Planifica tu día')}<br />
            <em style={{ fontStyle: 'normal', fontWeight: 800, color: 'var(--amber-300)' }}>en La Paz.</em>
          </h1>

          {/* Description */}
          <p style={{
            fontSize: isMobile ? 15 : 18, color: 'rgba(255,255,255,0.82)',
            marginTop: 20, maxWidth: 620, lineHeight: 1.6,
            fontFamily: 'var(--font-sans)',
          }}>
            {t('planner.descBefore', 'Pick the places you want to see and build, in seconds, the')}{' '}
            <strong style={{ color: '#fff' }}>{t('planner.descStrong', 'most efficient order')}</strong>{' '}
            {t('planner.descAfter', 'to visit them.')}
          </p>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: isMobile ? 20 : 40, marginTop: isMobile ? 28 : 36, flexWrap: 'wrap' }}>
            {[
              { k: t('planner.statPlacesK', 'Up to 10'),     v: t('planner.statPlacesV', 'places per route') },
              { k: t('planner.statProfilesK', '5 profiles'), v: t('planner.statProfilesV', 'Backpacker · Balanced · Comfort · Cable only · No cable') },
              { k: t('planner.statModesK', '3 modes'),       v: t('planner.statModesV', 'Walking · Cable car · Taxi') },
            ].map(s => (
              <div key={s.k}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? 22 : 28, fontWeight: 500, color: 'var(--amber-300)', lineHeight: 1 }}>{s.k}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', letterSpacing: 0.4, fontWeight: 600, textTransform: 'uppercase', marginTop: 5 }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ PLANNER CONTENT */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: isMobile ? '24px 18px 80px' : '40px 64px 100px' }}>


        {loadingBoot ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--fg2)' }}>
            <p>{t('planner.loading', 'Cargando puntos de interés…')}</p>
          </div>
        ) : (
          <>
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 32 : 24,
            alignItems: 'start',
          }}>
            {/* LEFT COLUMN: Controls, POIs, and Results */}
            <section style={{
              display: 'flex', flexDirection: 'column', gap: 16,
              width: isMobile ? '100%' : 'min(460px, 42%)',
              flexShrink: 0,
            }}>
              <ProfilePicker value={profile} onChange={(p) => { setProfile(p); setResult(null); }} />

              <label style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 14px',
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                borderRadius: 'var(--r-lg)', cursor: 'pointer',
                fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 600, color: 'var(--fg1)',
              }}>
                <input type="checkbox" checked={circuit}
                  onChange={(e) => { setCircuit(e.target.checked); setResult(null); }}
                  style={{ width: 18, height: 18, accentColor: 'var(--rust-500)' }}
                />
                <span style={{ flex: 1 }}>{t('planner.circuit', 'Volver al punto de partida (circuito)')}</span>
              </label>

              <LiveSummary
                count={selected.size}
                stayMinutes={stayMinutes}
                startSet={startSlug && selected.has(startSlug)}
              />

              <PoiSelector
                pois={pois}
                selected={selected}
                onToggle={toggleSelected}
                startSlug={startSlug}
                onStartChange={handleStartChange}
              />

              {calcError && (
                <div style={{
                  background: 'var(--rust-50, #fbf0ed)', color: 'var(--rust-700)',
                  padding: '12px 14px', borderRadius: 'var(--r-md)',
                  fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600,
                }}>{calcError}</div>
              )}

              <div style={{
                position: 'sticky',
                bottom: 0,
                background: 'var(--bg)',
                paddingTop: 16,
                paddingBottom: isMobile ? 12 : 16,
                paddingRight: isMobile ? 76 : 0,
                marginTop: 8,
                zIndex: 10,
                borderTop: '1px solid var(--border)',
              }}>
                <Btn
                  kind="primary"
                  size="lg"
                  onClick={handleCalculate}
                  disabled={!canCalculate || calcLoading}
                  style={{
                    width: '100%', justifyContent: 'center',
                    opacity: (!canCalculate || calcLoading) ? 0.5 : 1,
                    cursor: (!canCalculate || calcLoading) ? 'not-allowed' : 'pointer',
                  }}
                >
                  {calcLoading
                    ? t('planner.calculating', 'Calculando...')
                    : t('planner.calculate', 'Calcular ruta')}
                  <I.ArrowR size={15} />
                </Btn>
              </div>


              {!result && (
                <div style={{
                  marginTop: 8, padding: 20,
                  background: 'var(--bg-elevated)', border: '1px dashed var(--border-strong)',
                  borderRadius: 'var(--r-lg)', color: 'var(--fg3)',
                  fontFamily: 'var(--font-sans)', fontSize: 13.5, textAlign: 'center',
                }}>
                  {t('planner.placeholder', 'Selecciona tus lugares y aprieta "Calcular ruta" para ver el itinerario aquí.')}
                </div>
              )}
            </section>

            {/* RIGHT COLUMN: Map (Sticky) */}
            <section style={{
              display: 'flex', flexDirection: 'column', gap: 0,
              flex: 1, width: '100%', minWidth: 0,
              position: isMobile ? 'static' : 'sticky',
              top: isMobile ? 'auto' : 110,
              alignSelf: 'start', // Required for sticky in flexbox
            }}>
              <div style={{
                height: isMobile ? '40vh' : 'calc(100vh - 140px)',
                minHeight: 320,
                borderRadius: 'var(--r-xl)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--border)',
                background: 'var(--bg-elevated)',
                position: 'relative',
                zIndex: 1, // Creates a new stacking context to prevent Leaflet from overlapping the navbar
              }}>
                <RouteMap pois={pois} graph={graph} selected={selected} result={result} />
              </div>
            </section>
          </div>

          {/* The itinerary gets the full width: it is the answer, not a sidebar. */}
          {result && (
            <div style={{ marginTop: isMobile ? 24 : 32 }}>
              <RouteResult result={result} onModify={() => setResult(null)} />
            </div>
          )}
          </>
        )}
      </div>
    </main>
  );
}

export default RouteCalculator;
