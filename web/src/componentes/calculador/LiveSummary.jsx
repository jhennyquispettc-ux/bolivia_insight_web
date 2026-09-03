import React from 'react';
import { useI18n } from '../../data/translations.jsx';

import I from '../../ui/iconos.jsx';

function formatDuration(minutes) {
  if (minutes < 1) return '0 min';
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${m} min`;
}

function LiveSummary({ count, stayMinutes, max = 10, min = 2, startSet }) {
  const { t } = useI18n();

  let chip = null;
  if (count > max) {
    chip = { color: 'var(--rust-600)', bg: 'var(--rust-50, #fbf0ed)', text: t('planner.error.max', `Máximo ${max} lugares — quita alguno.`) };
  } else if (count > 0 && count < min) {
    chip = { color: 'var(--warning)', bg: 'var(--warning-soft)', text: t('planner.error.min', `Marca al menos ${min} lugares para calcular.`) };
  } else if (count >= min && !startSet) {
    chip = { color: 'var(--warning)', bg: 'var(--warning-soft)', text: t('planner.error.start', 'Elige el punto de partida con el pin.') };
  }

  return (
    <div style={{
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-lg)',
      padding: '14px 16px',
      display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13,
          color: 'var(--navy-700)',
          background: 'var(--amber-100)', padding: '4px 10px', borderRadius: 999,
        }}>
          {count} {count === 1 ? t('planner.live.place', 'lugar') : t('planner.live.places', 'lugares')}
        </span>
        {count > 0 && stayMinutes > 0 && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--fg2)',
          }}>
            <I.Clock size={14}/>
            <span>{t('planner.live.estimated', 'Estadía estimada')}: <strong style={{ color: 'var(--fg1)' }}>{formatDuration(stayMinutes)}</strong></span>
          </span>
        )}
      </div>
      {chip && (
        <div style={{
          fontFamily: 'var(--font-sans)', fontSize: 12.5, fontWeight: 600,
          color: chip.color, background: chip.bg,
          padding: '8px 12px', borderRadius: 8,
        }}>{chip.text}</div>
      )}
      {count === 0 && (
        <div style={{
          fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--fg3)',
        }}>{t('planner.live.hintEmpty', 'Marca al menos 2 lugares para calcular tu ruta.')}</div>
      )}
    </div>
  );
}

export default LiveSummary;
