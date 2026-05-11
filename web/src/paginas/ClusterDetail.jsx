/* Bolivia Insight — Destination Detail Page */
function ClusterDetail({ cluster, onBack, onBook }) {
  const c = cluster || CLUSTERS[0];
  const itineraries = [
    { id: 'salt-sky', title: 'Salt & Sky', days: 4, level: 'Easy', author: 'Carla V.', img: IMG.uyuniDay,
      desc: 'Tunupa side, Incahuasi sunrise, San Pedro de Quemes village stay. Local jeep operators run this loop daily.' },
    { id: 'titi-deep', title: 'Titicaca, deep', days: 3, level: 'Moderate', author: 'Mateo R.', img: IMG.altiplano,
      desc: 'Copacabana → Isla del Sol → Yampupata. Community homestays bookable on arrival, no reservation needed.' },
    { id: 'tiwanaku', title: 'Tiwanaku → Sun Gate', days: 2, level: 'Easy', author: 'Aymara F.', img: IMG.altiplano,
      desc: 'Pre-Inca site reachable by public minibus from La Paz cemetery terminal. Bs 25, 1.5h each way.' },
  ];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* HERO */}
      <section style={{ position: 'relative', height: 540, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: c.img }}/>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(27,42,65,0.3) 0%, rgba(27,42,65,0) 30%, rgba(27,42,65,0.85) 100%)' }}/>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1400, margin: '0 auto', padding: '140px 32px 48px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <button onClick={onBack} style={{
            background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)',
            color: '#fff', padding: '8px 14px', borderRadius: 999, cursor: 'pointer',
            backdropFilter: 'blur(10px)', display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 12, fontWeight: 700, alignSelf: 'flex-start', marginBottom: 24,
          }}><I.ArrowL size={13}/> All destinations</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: c.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 24px -8px rgba(0,0,0,0.4)' }}>{c.glyph}</div>
            <div className="eyebrow" style={{ color: 'var(--amber-300)' }}>Region · Altiplano</div>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(48px,7vw,96px)', lineHeight: 0.95, color: '#fff', margin: 0, fontWeight: 500, letterSpacing: '-0.035em', maxWidth: 900 }}>{c.title}.</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 20, marginTop: 18, maxWidth: 640, fontWeight: 300 }}>{c.sub}</p>
        </div>
      </section>

      {/* QUICK FACTS BAR */}
      <section style={{ background: 'var(--navy-700)', color: '#fff', padding: '28px 0', borderBottom: '4px solid var(--amber-500)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 32px', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 24 }}>
          {[
            { k: 'Best season', v: 'May – Oct (dry)' },
            { k: 'Altitude', v: '3,650 – 4,200 m' },
            { k: 'Time needed', v: '3 – 5 days' },
            { k: 'Getting there', v: 'La Paz · 3.5h drive' },
            { k: 'Local guides', v: 'Plenty in town' },
          ].map(s => (
            <div key={s.k}>
              <div style={{ fontSize: 11, color: 'var(--amber-300)', fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase' }}>{s.k}</div>
              <div style={{ fontSize: 18, fontFamily: 'var(--font-display)', marginTop: 6 }}>{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SUGGESTED ROUTES */}
      <section style={{ padding: '100px 0' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 32px' }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Suggested routes · No booking required</div>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', margin: 0, marginBottom: 16 }}>Three ways into the altiplano.</h2>
          <p style={{ fontSize: 17, color: 'var(--fg2)', maxWidth: 640, marginBottom: 40, lineHeight: 1.6 }}>
            Loops compiled from local writers who walk these regions. Arrange transport and stays on arrival — every town has agencies and homestays.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {itineraries.map((it) => (
              <article key={it.id} style={{
                background: '#fff', borderRadius: 18, overflow: 'hidden',
                boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)',
              }}>
                <div style={{ height: 200, backgroundImage: it.img, position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 14, left: 14, padding: '6px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.95)', fontSize: 11, fontWeight: 800, letterSpacing: 0.4, color: 'var(--navy-700)' }}>
                    {it.days} DAYS · {it.level.toUpperCase()}
                  </div>
                </div>
                <div style={{ padding: 24 }}>
                  <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 26, lineHeight: 1.1, fontWeight: 500 }}>{it.title}</h3>
                  <p style={{ color: 'var(--fg2)', fontSize: 14, lineHeight: 1.55, marginTop: 10 }}>{it.desc}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 18, paddingTop: 18, borderTop: '1px solid var(--border)' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 999, background: 'var(--mystic-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12, color: 'var(--mystic-700)' }}>{it.author.charAt(0)}</div>
                    <div style={{ flex: 1, fontSize: 12, color: 'var(--fg2)' }}>Written by <strong style={{ color: 'var(--fg1)' }}>{it.author}</strong></div>
                  </div>
                  <Btn kind="navy" size="md" style={{ width: '100%', justifyContent: 'center', marginTop: 16 }} onClick={onBook}>Read full route <I.ArrowR size={14}/></Btn>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* JOURNAL TEASER */}
      <section style={{ background: 'var(--stone-50)', padding: '100px 0' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div style={{ height: 460, borderRadius: 18, backgroundImage: IMG.uyuniNight, boxShadow: 'var(--shadow-lg)' }}/>
          <div>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Journal · From the field</div>
            <h2 style={{ margin: 0, fontSize: 'clamp(32px, 4vw, 48px)', lineHeight: 1.06 }}>"The salar is two countries. We sleep in one and wake in another."</h2>
            <p style={{ fontSize: 17, color: 'var(--fg2)', lineHeight: 1.6, marginTop: 22 }}>
              Carla writes about the wet-season mirror — a thin film that turns 10,000 km² of salt into the largest reflection on earth. The right night to visit changes every year; here's how to read the conditions.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 24 }}>
              <div style={{ width: 44, height: 44, borderRadius: 999, background: 'var(--mystic-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--mystic-700)' }}>CV</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>Carla Viscarra</div>
                <div style={{ fontSize: 12, color: 'var(--fg3)' }}>Altiplano writer · La Paz native</div>
              </div>
              <Btn kind="ghost" size="sm" style={{ marginLeft: 'auto' }}>Read essay <I.ArrowR size={14}/></Btn>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
window.ClusterDetail = ClusterDetail;
