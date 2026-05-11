/* Bolivia Insight — Hero with Day/Night transition + floating widgets */

function Hero({ variant = 'A', onCtaClick }) {
  const [night, setNight] = useState(false);

  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
    }}>
      {/* DAY layer — Salar at sunset (real photo) */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(assets/logos/uyuni-sunset.png)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        opacity: night ? 0 : 1,
        transition: 'opacity 1500ms var(--ease-in-out)',
      }} />

      {/* NIGHT layer — Milky way over Salar (real photo) */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(assets/logos/uyuni-night.png)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        opacity: night ? 1 : 0,
        transition: 'opacity 1500ms var(--ease-in-out)',
      }} />

      {/* Bottom dark gradient for text legibility — stronger for sunset */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
        background: night
          ? 'linear-gradient(180deg, rgba(5,8,19,0.2) 0%, rgba(5,8,19,0) 30%, rgba(5,8,19,0.5) 70%, rgba(5,8,19,0.85) 100%)'
          : 'linear-gradient(180deg, rgba(27,42,65,0.45) 0%, rgba(27,42,65,0.15) 25%, rgba(27,42,65,0.55) 70%, rgba(27,42,65,0.85) 100%)',
        transition: 'background 1500ms',
      }} />
      {/* Left vignette to lift left-aligned text */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(90deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 35%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 5,
        maxWidth: 1400, margin: '0 auto',
        padding: '120px 32px 140px',
        width: '100%',
      }}>
        {variant === 'A' ? (
          <>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '7px 14px', borderRadius: 999,
              background: 'rgba(0,0,0,0.32)',
              border: '1px solid rgba(255,255,255,0.32)',
              backdropFilter: 'blur(10px)',
              color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              <I.Sparkle size={13} /> {night ? 'Salar at 04:32 a.m.' : 'Salar at 18:42, sunset'}
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(40px, 6vw, 84px)',
              lineHeight: 1,
              letterSpacing: '-0.035em',
              fontWeight: 600,
              color: '#fff',
              margin: '24px 0 0', maxWidth: 1100,
              textWrap: 'balance',
              textShadow: night ? '0 4px 40px rgba(106,76,147,0.5), 0 2px 12px rgba(0,0,0,0.6)' : '0 4px 30px rgba(0,0,0,0.6), 0 2px 10px rgba(0,0,0,0.5)',
            }}>
              Bolivia, in <em style={{ fontStyle: 'normal', fontWeight: 800, color: night ? 'var(--mystic-200)' : 'var(--amber-300)', textShadow: night ? '0 2px 20px rgba(106,76,147,0.6)' : '0 2px 18px rgba(179,63,46,0.7), 0 2px 10px rgba(0,0,0,0.5)' }}>{night ? 'silver light' : 'last light'}</em>.
            </h1>
            <p style={{
              color: 'rgba(255,255,255,0.95)',
              fontSize: 19, lineHeight: 1.55,
              maxWidth: 580, marginTop: 20, fontWeight: 400,
              textShadow: '0 2px 14px rgba(0,0,0,0.7), 0 1px 4px rgba(0,0,0,0.5)',
            }}>
              The salt flats keep two faces. An independent travel guide for flashpackers crossing Bolivia on their own — by day and by night.
            </p>
            <div style={{ marginTop: 36, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Btn kind="primary" size="lg" onClick={onCtaClick}>Open the guide <I.ArrowR size={16} /></Btn>
              <Btn kind="glass" size="lg">Browse destinations</Btn>
            </div>
          </>
        ) : (
          /* VARIANT B — centered editorial */
          <div style={{ textAlign: 'center', maxWidth: 1100, margin: '0 auto' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '7px 14px', borderRadius: 999,
              background: 'rgba(255,255,255,0.14)',
              border: '1px solid rgba(255,255,255,0.28)',
              backdropFilter: 'blur(10px)',
              color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
              textTransform: 'uppercase',
            }}>Salar de Uyuni · 10,582 km²</div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(48px, 7vw, 100px)',
              lineHeight: 0.98, letterSpacing: '-0.04em',
              fontWeight: 600, color: '#fff', margin: '24px 0 0',
              textShadow: '0 4px 40px rgba(0,0,0,0.4)',
            }}>
              The country<br />
              <em style={{ fontStyle: 'normal', fontWeight: 800, color: night ? 'var(--mystic-200)' : 'var(--amber-300)', display: 'inline-block' }}>worth slowing for.</em>
            </h1>
            <div style={{ marginTop: 40, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Btn kind="primary" size="lg" onClick={onCtaClick}>Open the guide <I.ArrowR size={16} /></Btn>
              <Btn kind="glass" size="lg">Watch the altiplano →</Btn>
            </div>
          </div>
        )}
      </div>

      {/* Day/Night toggle */}
      <button onClick={() => setNight(!night)} aria-label="Toggle day/night" style={{
        position: 'absolute', top: 110, right: 32, zIndex: 10,
        width: 64, height: 32, borderRadius: 999,
        background: night ? 'rgba(106,76,147,0.4)' : 'rgba(255,183,3,0.32)',
        border: '1px solid rgba(255,255,255,0.35)',
        backdropFilter: 'blur(10px)', cursor: 'pointer',
        padding: 3, display: 'flex', alignItems: 'center',
        transition: 'background 280ms',
      }}>
        <div style={{
          width: 26, height: 26, borderRadius: '50%',
          background: night ? '#1b2a41' : '#fff',
          color: night ? '#FFB703' : '#FFB703',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: night ? 'translateX(32px)' : 'translateX(0)',
          transition: 'transform 280ms var(--ease-spring), background 280ms',
          boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
        }}>
          {night ? <I.Moon size={14} /> : <I.Sun size={14} />}
        </div>
      </button>

      {/* Floating widgets */}
      <WeatherWidget night={night} />

      <style>{`
        @keyframes bi-twinkle { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
        @keyframes bi-parallax-0 { from { transform: translateX(0); } to { transform: translateX(-30px); } }
        @keyframes bi-parallax-1 { from { transform: translateX(0); } to { transform: translateX(-60px); } }
        @keyframes bi-parallax-2 { from { transform: translateX(0); } to { transform: translateX(-100px); } }
        @keyframes bi-drift { from { transform: rotate(-18deg) translateX(0); } to { transform: rotate(-18deg) translateX(8%); } }
        @keyframes bi-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </section>
  );
}

function RoadStatusWidget({ night }) {
  const [open, setOpen] = useState(true);
  const [roads, setRoads] = useState([
    { code: 'RN-1', name: 'La Paz → Oruro', depts: ['LA PAZ', 'ORURO'], ok: true, note: 'Loading...' },
    { code: 'RN-30', name: 'Oruro → Uyuni', depts: ['ORURO', 'POTOSI'], ok: true, note: 'Loading...' },
    { code: 'RN-2', name: 'La Paz → Copacabana', depts: ['LA PAZ'], ok: true, note: 'Loading...' },
    { code: 'RN-3', name: 'La Paz → Rurrenabaque', depts: ['LA PAZ', 'BENI'], ok: true, note: 'Loading...' },
  ]);

  React.useEffect(() => {
    async function fetchAbcData() {
      try {
        const res = await fetch('https://transitabilidad.abc.gob.bo/api/v1/data');
        const apiData = await res.json();
        
        setRoads(prev => prev.map(road => {
          const routeNum = parseInt(road.code.replace('RN-', ''), 10);
          
          const incidents = apiData.filter(d => 
            parseInt(d.ruta, 10) === routeNum && 
            road.depts.includes(d.departamento)
          );
          
          if (incidents.length === 0) return { ...road, ok: true, note: 'Expedito' };

          const severe = incidents.find(d => d.estado && d.estado.id_estado >= 4);
          if (severe) {
            let n = severe.evento?.descripcion_evento || severe.estado.descripcion_estado;
            return { ...road, ok: false, note: n.charAt(0).toUpperCase() + n.slice(1).toLowerCase() };
          }

          const warning = incidents.find(d => d.estado && (d.estado.id_estado === 2 || d.estado.id_estado === 3));
          if (warning) {
            let n = warning.evento?.descripcion_evento || warning.estado.descripcion_estado;
            return { ...road, ok: true, note: `Precaución: ${n.toLowerCase()}` };
          }

          return { ...road, ok: true, note: 'Expedito' };
        }));
      } catch (err) {
        console.error('Failed to fetch ABC road data', err);
        setRoads(prev => prev.map(r => ({ ...r, note: 'Error de conexión' })));
      }
    }
    fetchAbcData();
  }, []);

  return (
    <div style={{
      position: 'absolute', left: 32, bottom: 36, zIndex: 6,
      width: 320,
      background: 'rgba(13,18,30,0.42)',
      border: '1px solid rgba(255,255,255,0.28)',
      backdropFilter: 'blur(20px) saturate(140%)',
      WebkitBackdropFilter: 'blur(20px) saturate(140%)',
      borderRadius: 16, padding: 18,
      color: '#fff',
      boxShadow: '0 10px 40px rgba(0,0,0,0.35)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <I.Route size={16} />
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase' }}>ABC · Road Status</div>
        </div>
        <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', opacity: 0.7, letterSpacing: 0.4 }}>LIVE</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {roads.map(r => (
          <div key={r.code} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
            <StatusDot ok={r.ok} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, opacity: 0.95, width: 40 }}>{r.code}</span>
            <span style={{ flex: 1, opacity: 1 }}>{r.name}</span>
            <span style={{ fontSize: 12, opacity: 0.85, color: r.ok ? 'inherit' : 'var(--rust-300)' }}>{r.note}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.22)', fontSize: 11, fontFamily: 'var(--font-mono)', opacity: 0.75, letterSpacing: 0.4 }}>
        API TRANSITABILIDAD · ABC.GOB.BO
      </div>
    </div>
  );
}

function WeatherWidget({ night }) {
  const [citiesData, setCitiesData] = React.useState([
    { city: 'La Paz', lat: -16.5000, lon: -68.1500, alt: '3,640m', tempDay: '--', tempNight: '--', weathercode: undefined },
    { city: 'Uyuni', lat: -20.4597, lon: -66.8250, alt: '3,656m', tempDay: '--', tempNight: '--', weathercode: undefined },
  ]);

  React.useEffect(() => {
    async function fetchWeather() {
      try {
        const lats = citiesData.map(c => c.lat).join(',');
        const lons = citiesData.map(c => c.lon).join(',');
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=America%2FLa_Paz`;
        const res = await fetch(url);
        const data = await res.json();

        const updated = citiesData.map((city, i) => {
          const f = data[i];
          if (!f || !f.current_weather) return city;

          return {
            ...city,
            tempDay: Math.round(f.daily.temperature_2m_max[0]),
            tempNight: Math.round(f.daily.temperature_2m_min[0]),
            weathercode: f.current_weather.weathercode
          };
        });
        setCitiesData(updated);
      } catch (err) {
        console.error('Failed to fetch weather for hero:', err);
      }
    }
    fetchWeather();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getCondition = (code, isNight) => {
    if (code === undefined) return { text: 'Loading...', icon: <I.Cloud size={22} /> };
    if (code === 0) return { text: isNight ? 'Clear, freezing' : 'Sun, dry', icon: isNight ? <I.Moon size={22} /> : <I.Sun size={22} /> };
    if (code === 1 || code === 2 || code === 3) return { text: 'Partly cloudy', icon: <I.Cloud size={22} /> };
    if (code >= 45 && code <= 48) return { text: 'Fog', icon: <I.Cloud size={22} /> };
    if (code >= 51 && code <= 67) return { text: 'Rain', icon: <I.Cloud size={22} /> };
    if (code >= 71 && code <= 77) return { text: 'Snow', icon: <I.Cloud size={22} /> };
    if (code >= 95) return { text: 'Thunderstorm', icon: <I.Cloud size={22} /> };
    return { text: 'Variable', icon: <I.Wind size={22} /> };
  };

  return (
    <div style={{
      position: 'absolute', right: 32, bottom: 36, zIndex: 6,
      width: 280,
      background: 'rgba(13,18,30,0.42)',
      border: '1px solid rgba(255,255,255,0.28)',
      backdropFilter: 'blur(20px) saturate(140%)',
      WebkitBackdropFilter: 'blur(20px) saturate(140%)',
      borderRadius: 16, padding: 18,
      color: '#fff',
      boxShadow: '0 10px 40px rgba(0,0,0,0.35)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <I.Cloud size={16} />
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Live Weather</div>
        </div>
        <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', opacity: 0.7, letterSpacing: 0.4 }}>Open-Meteo</div>
      </div>
      {citiesData.map(c => {
        const cond = getCondition(c.weathercode, night);
        return (
          <div key={c.city} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0' }}>
            <div style={{ color: 'var(--amber-300)' }}>{cond.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{c.city}</div>
              <div style={{ fontSize: 12, opacity: 0.8, fontFamily: 'var(--font-mono)' }}>{c.alt} · {cond.text}</div>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, lineHeight: 1, fontWeight: 500 }}>
              {night ? c.tempNight : c.tempDay}<span style={{ fontSize: 14, opacity: 0.7 }}>°C</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

window.Hero = Hero;
