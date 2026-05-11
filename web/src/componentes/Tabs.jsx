/* Bolivia Insight — Top 5 attractions section */
function TabsSection() {
  const top5 = [
    {
      n: '01',
      name: 'Salar de Uyuni',
      region: 'Potosí · Altiplano',
      blurb: 'The world\'s largest salt flat — 10,582 km². In the wet season it becomes a perfect mirror of the sky; in the dry, an infinite hexagonal plain. Cactus islands, lithium reserves, salt hotels.',
      stat: '3,656 m',
      statLabel: 'Elevation',
      img: IMG.photoUyuni,
      tags: ['UNESCO tentative', 'Wet & dry season', '4×4 tours from Uyuni'],
    },
    {
      n: '02',
      name: 'Lake Titicaca & Isla del Sol',
      region: 'La Paz Dept · Altiplano',
      blurb: 'Highest navigable lake on earth, sacred to the Inca creation myth. Take the boat from Copacabana to Isla del Sol — Inca ruins, terraced villages, no cars, homestays bookable on arrival.',
      stat: '3,812 m',
      statLabel: 'Elevation',
      img: IMG.photoTiticaca,
      tags: ['Cultural site', 'Boat from Copacabana', 'Aymara culture'],
    },
    {
      n: '03',
      name: 'La Paz & Death Road',
      region: 'La Paz · Yungas',
      blurb: 'A canyon city wrapped around the world\'s highest cable-car network. Drop 3,500 m down the legendary Yungas Road on a mountain bike — jungle, waterfalls, switchbacks, all in one ride.',
      stat: '3,640 m',
      statLabel: 'City elevation',
      img: IMG.photoYungas,
      tags: ['Mi Teleférico', 'Witches\' Market', 'MTB Death Road'],
    },
    {
      n: '04',
      name: 'Madidi National Park',
      region: 'Beni · Amazon',
      blurb: 'One of the most biodiverse parks on the planet — over 1,000 bird species and 200 mammals. Reach via Rurrenabaque from La Paz; eco-lodges run by Indigenous Tacana communities.',
      stat: '18,958 km²',
      statLabel: 'Park area',
      img: IMG.photoMadidi,
      tags: ['Wildlife', 'Indigenous-run lodges', 'Rurrenabaque gateway'],
    },
    {
      n: '05',
      name: 'Sucre & Potosí',
      region: 'Chuquisaca · Potosí',
      blurb: 'Two UNESCO colonial cities. Sucre is whitewashed, walkable, and home to the country\'s textile heritage. Potosí — once the richest city in the Americas — sits at the foot of Cerro Rico\'s silver mines.',
      stat: '2 UNESCO sites',
      statLabel: 'World heritage',
      img: IMG.photoPotosi,
      tags: ['Colonial architecture', 'Tarabuco textiles', 'Silver mine tours'],
    },
  ];

  const [active, setActive] = useState(0);
  const item = top5[active];

  return (
    <section style={{ background: 'var(--navy-700)', color: '#fff', padding: '120px 0' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ maxWidth: 760, marginBottom: 56 }}>
          <div className="eyebrow" style={{ color: 'var(--amber-300)', marginBottom: 12 }}>The list · most-visited landmarks</div>
          <h2 style={{ margin: 0, color: '#fff', fontSize: 'clamp(36px,4vw,60px)', lineHeight: 1.04, letterSpacing: '-0.025em', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
            Bolivia's <em style={{ fontStyle: 'normal', fontWeight: 800, color: 'var(--amber-300)' }}>five greats.</em>
          </h2>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.72)', marginTop: 18, maxWidth: 600, lineHeight: 1.6 }}>
            If you only have two weeks, this is the shortlist. Everything else is a bonus — and you'll find plenty in the regional guides.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 40, alignItems: 'start' }}>
          {/* LEFT — list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {top5.map((t, i) => {
              const selected = active === i;
              return (
                <button key={t.n} onClick={() => setActive(i)} style={{
                  textAlign: 'left',
                  background: selected ? 'rgba(255,183,3,0.10)' : 'transparent',
                  border: 0, borderLeft: selected ? '3px solid var(--amber-300)' : '3px solid rgba(255,255,255,0.10)',
                  padding: '20px 24px',
                  cursor: 'pointer', color: '#fff',
                  display: 'flex', alignItems: 'center', gap: 18,
                  transition: 'all 180ms',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 500,
                    color: selected ? 'var(--amber-300)' : 'rgba(255,255,255,0.35)',
                    minWidth: 56, lineHeight: 1,
                  }}>{t.n}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 500, color: selected ? '#fff' : 'rgba(255,255,255,0.78)', lineHeight: 1.15 }}>{t.name}</div>
                    <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', letterSpacing: 0.4, color: selected ? 'var(--amber-300)' : 'rgba(255,255,255,0.45)', marginTop: 4, textTransform: 'uppercase' }}>{t.region}</div>
                  </div>
                  {selected && <I.ArrowR size={16}/>}
                </button>
              );
            })}
          </div>

          {/* RIGHT — feature card */}
          <article key={item.n} style={{
            background: '#fff', color: 'var(--fg1)',
            borderRadius: 20, overflow: 'hidden',
            boxShadow: '0 30px 60px -20px rgba(0,0,0,0.4)',
            position: 'relative',
            animation: 'bi-fadeup 360ms var(--ease-out)',
          }}>
            <div style={{ height: 380, backgroundImage: item.img, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.55) 100%)' }}/>
              <div style={{ position: 'absolute', top: 20, left: 20, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {item.tags.map(t => (
                  <span key={t} style={{ padding: '5px 11px', background: 'rgba(255,255,255,0.92)', borderRadius: 999, fontSize: 11, fontWeight: 700, color: 'var(--navy-700)', letterSpacing: 0.2 }}>{t}</span>
                ))}
              </div>
              <div style={{ position: 'absolute', bottom: 20, right: 20, padding: '10px 14px', background: 'rgba(27,42,65,0.85)', backdropFilter: 'blur(10px)', borderRadius: 10, color: '#fff', textAlign: 'right' }}>
                <div style={{ fontSize: 10, letterSpacing: 0.4, color: 'var(--amber-300)', fontWeight: 700, textTransform: 'uppercase' }}>{item.statLabel}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 500, marginTop: 2 }}>{item.stat}</div>
              </div>
            </div>
            <div style={{ padding: '32px 36px 36px' }}>
              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: 0.4, color: 'var(--rust-500)', fontWeight: 700, textTransform: 'uppercase' }}>No. {item.n} · {item.region}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 3.5vw, 44px)', lineHeight: 1.05, fontWeight: 600, margin: '8px 0 0', letterSpacing: '-0.02em' }}>{item.name}</h3>
              <p style={{ fontSize: 16, color: 'var(--fg2)', lineHeight: 1.65, marginTop: 16 }}>{item.blurb}</p>
              <div style={{ marginTop: 24, display: 'flex', gap: 10 }}>
                <Btn kind="navy" size="md">Read the guide <I.ArrowR size={14}/></Btn>
                <Btn kind="ghost" size="md">View on map <I.Pin size={14}/></Btn>
              </div>
            </div>
          </article>
        </div>
      </div>

      <style>{`@keyframes bi-fadeup { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </section>
  );
}
window.TabsSection = TabsSection;
