/* Bolivia Insight — Cluster cards (4 large interactive) */
function Clusters({ onSelect }) {
  const [hover, setHover] = useState(null);
  return (
    <section style={{ background: 'var(--bg)', padding: '120px 0 80px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 24 }}>
          <div style={{ maxWidth: 720 }}>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Four clusters · 34 routes in season</div>
            <h2 style={{ margin: 0, fontSize: 'clamp(36px,4vw,56px)', lineHeight: 1.04 }}>
              Bolivia, by region.
            </h2>
            <p style={{ fontSize: 18, color: 'var(--fg2)', marginTop: 16, maxWidth: 580 }}>
              Each cluster is a self-contained journey — high altiplano, urban metropolitan, colonial valley, or Amazon basin.
            </p>
          </div>
          <Btn kind="ghost">View all destinations <I.ArrowR size={15}/></Btn>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
          {CLUSTERS.map((c, i) => (
            <article key={c.id}
              onClick={() => onSelect(c)}
              onMouseEnter={() => setHover(c.id)}
              onMouseLeave={() => setHover(null)}
              style={{
                position: 'relative', height: 460,
                borderRadius: 18, overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: hover === c.id ? 'var(--shadow-xl)' : 'var(--shadow-md)',
                transform: hover === c.id ? 'translateY(-6px)' : 'translateY(0)',
                transition: 'all 320ms var(--ease-out)',
              }}>
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: c.img,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transform: hover === c.id ? 'scale(1.08)' : 'scale(1.0)',
                transition: 'transform 700ms var(--ease-out)',
              }}/>
              {/* Iconographic glyph silhouette for visual depth */}
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
              <div style={{
                position: 'absolute', inset: 0,
                background: `linear-gradient(180deg, rgba(13,18,30,0.15) 0%, rgba(13,18,30,0.0) 35%, rgba(13,18,30,0.55) 70%, rgba(13,18,30,0.92) 100%)`,
              }}/>
              {/* Glyph chip */}
              <div style={{
                position: 'absolute', top: 18, left: 18,
                width: 52, height: 52, borderRadius: 14,
                background: c.color, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 24px -6px rgba(0,0,0,0.4)',
              }}>{c.glyph}</div>
              {/* Count badge */}
              <div style={{
                position: 'absolute', top: 22, right: 18,
                padding: '5px 12px', borderRadius: 999,
                background: 'rgba(13,18,30,0.55)', color: '#fff',
                border: '1px solid rgba(255,255,255,0.25)',
                backdropFilter: 'blur(10px)',
                fontSize: 11, fontWeight: 700, letterSpacing: 0.4,
                textShadow: '0 1px 2px rgba(0,0,0,0.4)',
              }}>{c.count} routes</div>
              {/* Highlights peek (revealed on hover) */}
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
                  <div style={{ fontWeight: 800, letterSpacing: 0.3, textTransform: 'uppercase', fontSize: 10, color: 'var(--amber-300)', marginBottom: 6 }}>Top picks</div>
                  {c.highlights.slice(0, 3).map(h => (
                    <div key={h} style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                      <span style={{ color: 'var(--amber-300)' }}>›</span><span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Body */}
              <div style={{ position: 'absolute', left: 22, right: 22, bottom: 22, color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--amber-300)' }}>{`Cluster 0${i+1}`}</div>
                <h3 style={{
                  margin: '8px 0 6px',
                  fontFamily: 'var(--font-display)',
                  fontSize: 30, lineHeight: 1.05,
                  letterSpacing: '-0.02em', fontWeight: 700,
                  color: '#fff',
                }}>{c.title}</h3>
                <div style={{ fontSize: 13, opacity: 0.95, lineHeight: 1.45, marginBottom: 14 }}>{c.sub}</div>

                {/* Tourist info row */}
                <div style={{
                  display: 'flex', flexWrap: 'wrap', gap: '6px 14px',
                  fontSize: 11, fontFamily: 'var(--font-mono)',
                  color: 'rgba(255,255,255,0.85)', letterSpacing: 0.3,
                  paddingTop: 12, marginBottom: 14,
                  borderTop: '1px solid rgba(255,255,255,0.18)',
                }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <I.Mountain size={11}/> {c.altitude}
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <I.Calendar size={11}/> {c.bestTime}
                  </span>
                </div>

                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontSize: 12, fontWeight: 700, letterSpacing: 0.4,
                  textTransform: 'uppercase',
                  color: hover === c.id ? 'var(--amber-300)' : '#fff',
                  transition: 'color 220ms',
                }}>Explore highlights <I.ArrowR size={14}/></div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
window.Clusters = Clusters;
