import React from 'react';
import { useI18n } from '../../data/translations.jsx';

import Btn from '../../ui/Boton.jsx';
import I from '../../ui/iconos.jsx';

function modeIcon(mode) {
  if (mode === 'caminata')  return <I.Boot size={13}/>;
  if (mode === 'teleferico') return <I.Tram size={13}/>;
  if (mode === 'taxi')       return <I.Route size={13}/>;
  return <I.ArrowR size={13}/>;
}

const CATEGORY_META = {
  attraction:  { emoji: '🏛️', color: '#1a73e8' },
  nature:      { emoji: '🏞️', color: '#2e9d4a' },
  viewpoint:   { emoji: '🔭', color: '#16a34a' },
  restaurant:  { emoji: '🍽️', color: '#e87722' },
  plaza:       { emoji: '⛲', color: '#0d9488' },
  station:     { emoji: '🚡', color: '#dc2626' },
  airport:     { emoji: '✈️', color: '#4f46e5' },
  reference:   { emoji: '📍', color: '#64748b' },
};

const TELEFERICO_COLORS = {
  Roja: '#E31837', Amarilla: '#FFD100', Verde: '#009640',
  Azul: '#0055A5', Celeste: '#00A1E4', Naranja: '#FF7F00',
  Blanca: '#FFFFFF', Cafe: '#7A411B', Morada: '#6C217E', Plateada: '#A0A0A0',
};

const MODE_COLORS = {
  caminata:   '#334155',
  teleferico: '#d22d2d',
  taxi:       '#2266dd',
};

function formatDuration(minutes) {
  if (minutes < 1) return '0 min';
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${m} min`;
}


function ModeChip({ mode, line }) {
  const color = (mode === 'teleferico' && line) ? (TELEFERICO_COLORS[line] || MODE_COLORS.teleferico) : (MODE_COLORS[mode] || '#888');
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 8px', borderRadius: 999,
      background: color, color: line === 'Amarilla' || line === 'Blanca' ? '#1B2A41' : '#fff',
      fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 700,
    }}>{modeIcon(mode)} {mode}{line ? ` · ${line}` : ''}</span>
  );
}

function RouteResult({ result, onModify }) {
  const { t } = useI18n();
  if (!result) return null;

  return (
    <div style={{
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-xl)',
      padding: 20, marginTop: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
        <h3 style={{ margin: 0 }}>{t('planner.result.title', 'Tu itinerario óptimo')}</h3>
        <Btn kind="ghost" size="sm" onClick={onModify}>
          {t('planner.modify', 'Modificar selección')}
        </Btn>
      </div>

      <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {result.order.map((p, i) => {
          const seg = result.segments[i];
          const meta = CATEGORY_META[p.category] || { emoji: '📍', color: '#64748b' };
          return (
            <li key={`${p.slug}-${i}`} style={{ position: 'relative', paddingBottom: seg ? 18 : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{
                  width: 30, height: 30, borderRadius: 999,
                  background: 'var(--amber-500)', color: 'var(--navy-700)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 13,
                  flexShrink: 0,
                }}>{i + 1}</span>
                <span style={{ fontSize: 18 }}>{meta.emoji}</span>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <strong style={{
                    fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--fg1)',
                  }}>{p.name}</strong>
                  {p.visitMinutes > 0 && (
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg3)',
                    }}>~{p.visitMinutes} min {t('planner.result.atSpot', 'en el lugar')}</span>
                  )}
                </div>
              </div>

              {seg && seg.hops.length > 0 && (
                <ul style={{
                  listStyle: 'none', padding: '8px 0 0 42px', margin: 0,
                  borderLeft: '2px dashed var(--border-strong)', marginLeft: 14,
                  paddingLeft: 18,
                }}>
                  {seg.hops.map((h, j) => (
                    <li key={`hop-${i}-${j}`} style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '4px 0',
                      fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--fg2)',
                    }}>
                      <ModeChip mode={h.mode} line={h.line}/>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600 }}>{h.minutes} min</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ol>

      <div style={{
        marginTop: 20, padding: 16,
        background: 'var(--navy-700)', borderRadius: 'var(--r-lg)',
        color: '#fff', display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontFamily: 'var(--font-sans)', fontSize: 13, color: 'rgba(255,255,255,0.75)',
          }}><I.Boot size={14}/> {t('planner.result.travel', 'Traslados')}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 14 }}>{formatDuration(result.travelMinutes)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontFamily: 'var(--font-sans)', fontSize: 13, color: 'rgba(255,255,255,0.75)',
          }}><I.Clock size={14}/> {t('planner.result.stay', 'Estadía')}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 14 }}>{formatDuration(result.stayMinutes)}</span>
        </div>
        <div style={{ height: 1, background: 'rgba(255,255,255,0.15)' }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700, color: '#fff',
          }}><I.Flag size={15}/> {t('planner.result.total', 'Tiempo total estimado')}</span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 18,
            color: 'var(--amber-400)',
          }}>{formatDuration(result.totalMinutes)}</span>
        </div>
      </div>
    </div>
  );
}

export default RouteResult;
