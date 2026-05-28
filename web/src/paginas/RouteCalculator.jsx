/* Bolivia Insight — Route Calculator page (TSP planner for La Paz) */
import React, { useEffect, useMemo, useState } from 'react';
import { useI18n } from '../data/translations.jsx';
import I from '../ui/iconos.jsx';
import Btn from '../ui/Boton.jsx';
import { fetchPois, fetchGraph, calculateRoute } from '../calculador/api.js';
import PoiSelector from '../componentes/calculador/PoiSelector.jsx';
import LiveSummary from '../componentes/calculador/LiveSummary.jsx';
import ProfilePicker from '../componentes/calculador/ProfilePicker.jsx';
import RouteMap from '../componentes/calculador/RouteMap.jsx';
import RouteResult from '../componentes/calculador/RouteResult.jsx';

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
    Promise.all([fetchPois('la-paz'), fetchGraph('la-paz')])
      .then(([p, g]) => { if (alive) { setPois(p); setGraph(g); } })
      .catch((err) => { if (alive) setBootError(err.message || 'network'); })
      .finally(() => { if (alive) setLoadingBoot(false); });
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
      const res = await calculateRoute(body);
      setResult(res);
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
        <p className="body">{t('planner.error.bootDesc', 'Verifica que el backend esté corriendo en localhost:3000 y vuelve a intentar.')}</p>
        <p className="caption" style={{ marginTop: 8, color: 'var(--rust-600)' }}>{bootError}</p>
        <Btn kind="primary" onClick={() => window.location.reload()} style={{ marginTop: 16 }}>
          {t('planner.error.retry', 'Reintentar')}
        </Btn>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 90 }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: isMobile ? '16px 18px 80px' : '24px 32px 100px' }}>

        {/* Back link */}
        <button onClick={onBack} style={{
          background: 'transparent', border: 0, cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color: 'var(--fg2)', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13,
          padding: '6px 0', marginBottom: 12,
        }}>
          <I.ArrowL size={14}/> {t('planner.back', 'Volver al inicio')}
        </button>

        {/* Header */}
        <header style={{ marginBottom: isMobile ? 20 : 32, maxWidth: 760 }}>
          <div className="eyebrow">{t('planner.eyebrow', 'Herramienta 04 · Planificación')}</div>
          <h1 className="display" style={{
            fontSize: isMobile ? 'clamp(2rem, 8vw, 3rem)' : 'clamp(2.5rem, 5vw, 4rem)',
            marginTop: 6, marginBottom: 12,
          }}>{t('planner.title', 'Planifica tu día en La Paz')}</h1>
          <p className="lead">{t('planner.desc', 'Elige los lugares que quieres visitar y tu estilo de viaje. Calculamos el mejor orden, qué medios de transporte usar y cuánto tiempo te tomará — incluyendo cuánto pasarás en cada lugar.')}</p>
        </header>

        {loadingBoot ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--fg2)' }}>
            <p>{t('planner.loading', 'Cargando puntos de interés…')}</p>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 32 : 24,
            alignItems: 'start',
          }}>
            {/* LEFT: Panel */}
            <section style={{
              display: 'flex', flexDirection: 'column', gap: 16,
              width: isMobile ? '100%' : 'min(420px, 40%)',
              flexShrink: 0,
              position: isMobile ? 'static' : 'sticky',
              top: isMobile ? 'auto' : 90,
              maxHeight: isMobile ? 'none' : 'calc(100vh - 110px)',
              overflowY: isMobile ? 'visible' : 'auto',
              paddingRight: isMobile ? 0 : 8,
            }}>
              <ProfilePicker value={profile} onChange={(p) => { setProfile(p); setResult(null); }}/>

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
                  background: 'var(--rust-50, #fbe5df)', color: 'var(--rust-700)',
                  padding: '12px 14px', borderRadius: 'var(--r-md)',
                  fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600,
                }}>{calcError}</div>
              )}

              <div style={{
                position: isMobile ? 'sticky' : 'static',
                bottom: isMobile ? 0 : 'auto',
                background: isMobile ? 'var(--bg)' : 'transparent',
                paddingTop: isMobile ? 12 : 0,
                paddingBottom: isMobile ? 12 : 0,
                paddingRight: isMobile ? 76 : 0, // avoid chat bubble
                marginTop: 4,
                zIndex: 10,
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
                    ? t('planner.calculating', 'Calculando…')
                    : t('planner.calculate', 'Calcular ruta')}
                  <I.ArrowR size={15}/>
                </Btn>
              </div>
            </section>

            {/* RIGHT: Map + Result */}
            <section style={{ 
              display: 'flex', flexDirection: 'column', gap: 0,
              flex: 1, width: '100%', minWidth: 0
            }}>
              <div style={{
                height: isMobile ? '40vh' : 'min(60vh, 560px)',
                minHeight: 320,
                borderRadius: 'var(--r-xl)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--border)',
                background: 'var(--bg-elevated)',
              }}>
                <RouteMap pois={pois} graph={graph} selected={selected} result={result}/>
              </div>

              {result && (
                <RouteResult result={result} onModify={() => setResult(null)}/>
              )}

              {!result && (
                <div style={{
                  marginTop: 16, padding: 20,
                  background: 'var(--bg-elevated)', border: '1px dashed var(--border-strong)',
                  borderRadius: 'var(--r-lg)', color: 'var(--fg3)',
                  fontFamily: 'var(--font-sans)', fontSize: 13.5, textAlign: 'center',
                }}>
                  {t('planner.placeholder', 'Selecciona tus lugares y aprieta "Calcular ruta" para ver el itinerario aquí.')}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

export default RouteCalculator;
