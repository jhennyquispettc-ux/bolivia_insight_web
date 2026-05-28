import React, { useMemo, useState } from 'react';
import { useI18n } from '../../data/translations.jsx';

import I from '../../ui/iconos.jsx';

const CATEGORY_ORDER = ['attraction', 'nature', 'viewpoint', 'restaurant', 'plaza', 'station', 'airport', 'reference'];

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

function PoiSelector({ pois, selected, onToggle, startSlug, onStartChange }) {
  const { t } = useI18n();
  const [openCats, setOpenCats] = useState(() => new Set(['attraction', 'nature', 'viewpoint', 'restaurant']));

  const grouped = useMemo(() => {
    const g = {};
    for (const p of pois) {
      (g[p.category] = g[p.category] || []).push(p);
    }
    return g;
  }, [pois]);

  const toggleCat = (cat) => {
    setOpenCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      return next;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {CATEGORY_ORDER.filter((c) => grouped[c]).map((cat) => {
        const meta = CATEGORY_META[cat] || { emoji: '📍', color: '#64748b' };
        const list = grouped[cat];
        const selectedInCat = list.filter((p) => selected.has(p.slug)).length;
        const open = openCats.has(cat);
        return (
          <div key={cat} style={{
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-lg)',
            background: 'var(--bg-elevated)',
            overflow: 'hidden',
          }}>
            <button onClick={() => toggleCat(cat)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 14px', border: 0, cursor: 'pointer',
              background: open ? 'var(--stone-50)' : 'transparent',
              fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 14,
              color: 'var(--fg1)',
              textAlign: 'left',
            }}>
              <span style={{ fontSize: 18 }}>{meta.emoji}</span>
              <span style={{ flex: 1 }}>{t(`planner.cat.${cat}`, cat)}</span>
              {selectedInCat > 0 && (
                <span style={{
                  background: 'var(--amber-100)', color: 'var(--navy-700)',
                  fontSize: 11, fontWeight: 700, padding: '2px 8px',
                  borderRadius: 999, fontFamily: 'var(--font-mono)',
                }}>{selectedInCat}/{list.length}</span>
              )}
              <span style={{
                transform: open ? 'rotate(90deg)' : 'rotate(0)',
                transition: 'transform 180ms', color: 'var(--fg3)',
              }}><I.ChevronR size={16}/></span>
            </button>

            {open && (
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {list.map((p) => {
                  const isSel = selected.has(p.slug);
                  const isStart = startSlug === p.slug;
                  return (
                    <li key={p.slug} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 14px',
                      borderTop: '1px solid var(--border)',
                      minHeight: 56,
                      background: isStart ? 'rgba(255,183,3,0.10)' : 'transparent',
                    }}>
                      <label style={{
                        display: 'flex', alignItems: 'center', gap: 10, flex: 1,
                        cursor: 'pointer', userSelect: 'none',
                      }}>
                        <input
                          type="checkbox"
                          checked={isSel}
                          onChange={() => onToggle(p.slug)}
                          style={{
                            width: 18, height: 18, accentColor: 'var(--rust-500)',
                            cursor: 'pointer', flexShrink: 0,
                          }}
                        />
                        <span style={{
                          fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 500,
                          color: 'var(--fg1)', lineHeight: 1.3,
                        }}>{p.name}</span>
                      </label>

                      {p.visitMinutes > 0 && (
                        <span style={{
                          fontFamily: 'var(--font-mono)', fontSize: 11,
                          color: 'var(--fg3)', fontWeight: 600,
                          flexShrink: 0, whiteSpace: 'nowrap',
                        }}>~{p.visitMinutes} min</span>
                      )}

                      <button
                        onClick={() => onStartChange(p.slug)}
                        disabled={!isSel}
                        title={t('planner.startHere', 'Empezar aquí')}
                        aria-label={t('planner.startHere', 'Empezar aquí')}
                        style={{
                          width: 30, height: 30, borderRadius: 999,
                          border: isStart ? '2px solid var(--amber-500)' : '1px solid var(--border-strong)',
                          background: isStart ? 'var(--amber-500)' : 'transparent',
                          color: isStart ? '#fff' : (isSel ? 'var(--navy-700)' : 'var(--stone-300)'),
                          cursor: isSel ? 'pointer' : 'not-allowed',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 160ms var(--ease-out)',
                          flexShrink: 0,
                        }}
                      >
                        <I.Pin size={14}/>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default PoiSelector;
