import React from 'react';
import { useI18n } from '../../data/translations.jsx';
import I from '../../ui/iconos.jsx';

const PROFILES = [
  { key: 'balanced',   icon: 'Sparkle' },
  { key: 'backpacker', icon: 'Boot' },
  { key: 'comfort',    icon: 'Coffee' },
  { key: 'cable-only', icon: 'Tram' },
  { key: 'no-cable',   icon: 'X' },
];

function ProfilePicker({ value, onChange }) {
  const { t } = useI18n();

  return (
    <div>
      <div style={{
        fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 700,
        letterSpacing: 'var(--ls-wider)', textTransform: 'uppercase',
        color: 'var(--rust-500)', marginBottom: 8,
      }}>
        {t('planner.profile.label', 'Estilo de viaje')}
      </div>
      <div style={{
        display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4,
        scrollbarWidth: 'thin',
      }}>
        {PROFILES.map((p) => {
          const active = value === p.key;
          const Icon = I[p.icon] || I.Sparkle;
          return (
            <button
              key={p.key}
              onClick={() => onChange(p.key)}
              aria-pressed={active}
              style={{
                flex: '0 0 auto',
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 14px',
                background: active ? 'var(--amber-100)' : 'var(--bg-elevated)',
                color: active ? 'var(--navy-700)' : 'var(--fg2)',
                border: active ? '1px solid var(--amber-500)' : '1px solid var(--border)',
                borderRadius: 999, cursor: 'pointer',
                fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600,
                whiteSpace: 'nowrap',
                transition: 'all 160ms var(--ease-out)',
              }}
            >
              <Icon size={15}/>
              <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ lineHeight: 1.1 }}>{t(`planner.profile.${p.key}`, p.key)}</span>
                <span style={{
                  fontSize: 10.5, fontWeight: 500, color: active ? 'var(--navy-500)' : 'var(--fg3)',
                  lineHeight: 1.1, marginTop: 2,
                }}>{t(`planner.profile.${p.key}.subtitle`, '')}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ProfilePicker;
