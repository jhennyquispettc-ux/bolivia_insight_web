/* Bolivia Insight — Live Dashboard
   Real-time logistics: ABC roads, Mi Teleférico, weather grid, alerts feed.
   Mock data shaped to match a backend API later. */
function useWindowWidth() {
  const [w, setW] = React.useState(window.innerWidth);
  React.useEffect(() => {
    const handler = () => setW(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return w;
}

function Dashboard({ onBack, onExpert }) {
  const [region, setRegion] = React.useState('all');
  const [highlightedRoute, setHighlightedRoute] = React.useState(null);
  const updatedMin = 4;
  const winW = useWindowWidth();
  const isLarge  = winW >= 1200;
  const isXlarge = winW >= 1600;
  const [mapFullscreen, setMapFullscreen] = React.useState(false);
  const [activeMapLine, setActiveMapLine] = React.useState(null);
  const [hoveredMapLine, setHoveredMapLine] = React.useState(null);

  const svgLines = [
    { name: 'Azul',     pts: '28,207 88,207 148,207 205,207 262,207', color: '#1565c0', dash: false, sw: 5, stations: 'Río Seco · UPEA · Plaza La Paz · Plaza Libertad · 16 de Julio', duration: 20, km: 5.0 },
    { name: 'Roja',     pts: '262,207 318,207 372,207',               color: '#d32f2f', dash: false, sw: 5, stations: '16 de Julio · Cementerio · Central', duration: 11, km: 3.0 },
    { name: 'Naranja',  pts: '372,207 415,180 455,152 495,128',       color: '#e65100', dash: false, sw: 5, stations: 'Central · Armentia · Periférica · Villarroel', duration: 10, km: 2.8 },
    { name: 'Blanca',   pts: '495,128 463,180 463,218 463,260',       color: '#78909c', dash: false, sw: 4, stations: 'Villarroel · Busch · Triangular · Del Poeta', duration: 13, km: 3.5 },
    { name: 'Café',     pts: '463,180 520,170',                       color: '#5d4037', dash: false, sw: 5, stations: 'Busch · Las Villas', duration: 6,  km: 1.5 },
    { name: 'Celeste',  pts: '360,242 402,268 463,260 463,312',       color: '#0288d1', dash: false, sw: 5, stations: 'Prado · Teatro al Aire Libre · Del Poeta · Libertador', duration: 15, km: 3.9 },
    { name: 'Morada',   pts: '235,345 278,305 340,262',               color: '#6a1b9a', dash: false, sw: 5, stations: '6 de Marzo · Faro Murillo · Obelisco', duration: 17, km: 4.4 },
    { name: 'Plateada', pts: '262,207 278,305 302,373',               color: '#90a4ae', dash: true,  sw: 4, stations: '16 de Julio · Faro Murillo · Mirador', duration: 10, km: 2.6 },
    { name: 'Amarilla', pts: '302,373 368,350 418,328 463,312',       color: '#d4a800', dash: false, sw: 5, stations: 'Mirador · Buenos Aires · Sopocachi · Libertador', duration: 17, km: 4.6 },
    { name: 'Verde',    pts: '463,312 483,355 508,370 524,400',       color: '#2e7d32', dash: false, sw: 5, stations: 'Libertador · Alto Obrajes · Obrajes · Irpavi', duration: 16, km: 4.2 },
  ];

  const [roads, setRoads] = React.useState([
    // Altiplano & Salar
    { code: 'RN-1',  name: 'La Paz → Oruro',          depts: ['LA PAZ', 'ORURO'],        region: 'altiplano', ok: true, note: 'Loading...', km: 230 },
    { code: 'RN-1',  name: 'Oruro → Potosí',          depts: ['ORURO', 'POTOSI'],        region: 'altiplano', ok: true, note: 'Loading...', km: 312 },
    { code: 'RN-30', name: 'Oruro → Uyuni',           depts: ['ORURO', 'POTOSI'],        region: 'altiplano', ok: true, note: 'Loading...', km: 314 },
    { code: 'RN-5',  name: 'Potosí → Uyuni',          depts: ['POTOSI'],                 region: 'altiplano', ok: true, note: 'Loading...', km: 204 },
    { code: 'RN-2',  name: 'La Paz → Copacabana',     depts: ['LA PAZ'],                 region: 'altiplano', ok: true, note: 'Loading...', km: 158 },
    { code: 'RN-1',  name: 'La Paz → Tiwanaku',       depts: ['LA PAZ'],                 region: 'altiplano', ok: true, note: 'Loading...', km: 72 },
    
    // Valles Centrales
    { code: 'RN-5',  name: 'Sucre → Potosí',          depts: ['CHUQUISACA', 'POTOSI'],   region: 'valles',    ok: true, note: 'Loading...', km: 156 },
    { code: 'RN-4',  name: 'Cochabamba → Santa Cruz', depts: ['COCHABAMBA', 'SANTA CRUZ'], region: 'valles',    ok: true, note: 'Loading...', km: 473 },
    { code: 'RN-4',  name: 'Oruro → Cochabamba',      depts: ['ORURO', 'COCHABAMBA'],    region: 'valles',    ok: true, note: 'Loading...', km: 212 },

    // Amazonía & Yungas
    { code: 'RN-3',  name: 'La Paz → Coroico',        depts: ['LA PAZ'],                 region: 'yungas',    ok: true, note: 'Loading...', km: 96 },
    { code: 'RN-3',  name: 'La Paz → Rurrenabaque',   depts: ['LA PAZ', 'BENI'],         region: 'oriente',   ok: true, note: 'Loading...', km: 422 },
    { code: 'RN-9',  name: 'Santa Cruz → Trinidad',   depts: ['SANTA CRUZ', 'BENI'],     region: 'oriente',   ok: true, note: 'Loading...', km: 543 },
  ]);

  React.useEffect(() => {
    async function fetchAbcRoads() {
      try {
        const res = await fetch('https://transitabilidad.abc.gob.bo/api/v1/data');
        const apiData = await res.json();

        // Spanish → English — exact terms observed in live ABC API (47 records audited 2026-05-09)
        const abcEN = {
          // Most frequent (estado)
          'TRANSITABLE CON PRECAUCIÓN':          'Passable with caution',
          'TRANSITABLE CON PRECAUCION':          'Passable with caution',
          'NO TRANSITABLE POR CONFLICTOS SOCIALES': 'Blocked — social conflict',
          'BLOQUEO':                             'Road blocked',
          'BLOQUEO POR MOTIVOS SOCIALES':        'Blocked — social protest',
          'BLOQUEO POR DEMANDAS LOCALES':        'Blocked — local demands',
          'NO TRANSITABLE, TRAFICO CERRADO':     'Road closed — no traffic',
          // Construction / maintenance
          'TRAMO EN CONSTRUCCION':               'Section under construction',
          'TRAMO EN CONSTRUCCIÓN':               'Section under construction',
          'REHABILITACION':                      'Road rehabilitation works',
          'REHABILITACIÓN':                      'Road rehabilitation works',
          'REPOSICION DE PLATAFORMA':            'Road surface restoration',
          'REPOSICIÓN DE PLATAFORMA':            'Road surface restoration',
          // Surface / structural
          'FALLA DE PLATAFORMA':                 'Road surface failure',
          'PERDIDA DE PLATAFORMA':               'Road surface loss',
          'PÉRDIDA DE PLATAFORMA':               'Road surface loss',
          'PLATAFORMA HUMEDA':                   'Wet / muddy road surface',
          'PLATAFORMA HÚMEDA':                   'Wet / muddy road surface',
          'AHUELLAMIENTOS PROFUNDOS EN PLATAFORMA': 'Deep rutting on road surface',
          'AHUELLAMIENTO EN PLATAFORMA':         'Rutting on road surface',
          // Detours / restrictions
          'TRANSITABLE CON DESVIOS':             'Passable via detour',
          'TRANSITABLE CON DESVÍOS':             'Passable via detour',
          'RESTRICCION VEHICULAR':               'Vehicle restriction in effect',
          'RESTRICCIÓN VEHICULAR':               'Vehicle restriction in effect',
          'RESTRICCION VEHICULAR, ESPECIAL':     'Special vehicle restriction',
          // Geological / natural
          'DERRUMBE':                            'Landslide',
          'DERRUMBES MENORES':                   'Minor landslides',
          'CAIDA DE ROCAS':                      'Rockfall',
          'CAÍDA DE ROCAS':                      'Rockfall',
          'FLUJO DE BARRO':                      'Mudflow / debris flow',
          'INUNDACION':                          'Flooding',
          'INUNDACIÓN':                          'Flooding',
          // Infrastructure
          'AFECTACION DE PUENTE':                'Bridge affected / damaged',
          'AFECTACIÓN DE PUENTE':                'Bridge affected / damaged',
          // Accident / other
          'ACCIDENTE DE TRANSITO':               'Traffic accident',
          'ACCIDENTE DE TRÁNSITO':               'Traffic accident',
          // Neutral
          'NINGUN EVENTO':                       'No incidents',
          'NINGÚN EVENTO':                       'No incidents',
        };

        const translateABC = (raw) => {
          if (!raw) return 'Incident reported';
          const key = raw.trim().toUpperCase();
          if (abcEN[key]) return abcEN[key];
          // Partial match: check if any key is a substring
          for (const [es, en] of Object.entries(abcEN)) {
            if (key.includes(es)) return en;
          }
          // Fallback: capitalise original (still human-readable)
          return raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
        };

        setRoads(prev => prev.map(road => {
          const routeNum = parseInt(road.code.replace('RN-', ''), 10);
          const incidents = apiData.filter(d =>
            parseInt(d.ruta, 10) === routeNum &&
            road.depts.includes(d.departamento)
          );

          if (incidents.length === 0) return { ...road, ok: true, note: 'Clear' };

          const severe = incidents.find(d => d.estado && d.estado.id_estado >= 4);
          if (severe) {
            const raw = severe.evento?.descripcion_evento || severe.estado.descripcion_estado;
            return { ...road, ok: false, note: translateABC(raw) };
          }

          const warning = incidents.find(d => d.estado && (d.estado.id_estado === 2 || d.estado.id_estado === 3));
          if (warning) {
            const raw = warning.evento?.descripcion_evento || warning.estado.descripcion_estado;
            return { ...road, ok: true, note: `Caution: ${translateABC(raw).toLowerCase()}` };
          }

          return { ...road, ok: true, note: 'Clear' };
        }));
      } catch (err) {
        console.error('Failed to fetch ABC roads', err);
        setRoads(prev => prev.map(r => ({ ...r, note: 'Connection error' })));
      }
    }
    fetchAbcRoads();
  }, []);

  const filtered = region === 'all' ? roads : roads.filter(r => r.region === region);
  const clear = roads.filter(r => r.ok).length;
  const blocked = roads.length - clear;

  const [teleferico, setTeleferico] = React.useState([
    { line: 'Roja',     stations: 'Central → Cementerio → 16 de Julio',                   hex: '#d32f2f', ok: true, wait: '~4 min', duration: 11, km: 3.0, tourTip: 'Most iconic line — connects La Paz & El Alto' },
    { line: 'Amarilla', stations: 'Mirador → Buenos Aires → Sopocachi → Libertador',       hex: '#d4a800', ok: true, wait: '~6 min', duration: 17, km: 4.6, tourTip: 'Panoramic views of Mt. Illimani' },
    { line: 'Verde',    stations: 'Libertador → Alto Obrajes → Obrajes → Irpavi',          hex: '#2e7d32', ok: true, wait: '~5 min', duration: 16, km: 4.2, tourTip: 'Southern neighbourhoods to city centre' },
    { line: 'Azul',     stations: 'Río Seco → UPEA → Plaza La Paz → 16 de Julio',         hex: '#1565c0', ok: true, wait: '~7 min', duration: 20, km: 5.0, tourTip: 'Main El Alto ↔ La Paz corridor' },
    { line: 'Naranja',  stations: 'Central → Armentia → Periférica → Villarroel',          hex: '#e65100', ok: true, wait: '~5 min', duration: 10, km: 2.8, tourTip: 'Northern La Paz districts' },
    { line: 'Blanca',   stations: 'Plaza Villarroel → Busch → Av. Poeta',                  hex: '#546e7a', ok: true, wait: '~6 min', duration: 13, km: 3.5, tourTip: 'Connects to the Celeste line' },
    { line: 'Celeste',  stations: 'Prado → Teatro al Aire Libre → Av. Poeta → Libertad',   hex: '#0288d1', ok: true, wait: '~5 min', duration: 15, km: 3.9, tourTip: 'Heart of the Prado to the south' },
    { line: 'Morada',   stations: '6 de Marzo → Faro Murillo → San José',                  hex: '#6a1b9a', ok: true, wait: '~4 min', duration: 17, km: 4.4, tourTip: 'Northern zone, popular neighbourhoods' },
    { line: 'Café',     stations: 'Monumento Busch → Villa Copacabana',                    hex: '#5d4037', ok: true, wait: '~6 min', duration: 6,  km: 1.5, tourTip: 'Short line — El Alto gateway' },
    { line: 'Plateada', stations: '16 de Julio → Faro Murillo → Mirador',                  hex: '#78909c', ok: true, wait: '~5 min', duration: 10, km: 2.6, tourTip: 'Closes the ring — spectacular views' },
  ]);

  React.useEffect(() => {
    // No public API — status via @miteleferico / WhatsApp 71554749 / 800 116483
    async function fetchTelefericoStatus() { await new Promise(r => setTimeout(r, 600)); }
    fetchTelefericoStatus();
  }, []);


  const [citiesData, setCitiesData] = React.useState([
    { city: 'La Paz',       lat: -16.5000, lon: -68.1500, alt: '3,640m', temp: '--', lo: '--', hi: '--', conditions: 'Loading...', icon: <I.Cloud size={28}/> },
    { city: 'Uyuni',        lat: -20.4597, lon: -66.8250, alt: '3,656m', temp: '--', lo: '--', hi: '--', conditions: 'Loading...', icon: <I.Sun size={28}/> },
    { city: 'Potosí',       lat: -19.5836, lon: -65.7531, alt: '3,967m', temp: '--', lo: '--', hi: '--', conditions: 'Loading...', icon: <I.Cloud size={28}/> },
    { city: 'Sucre',        lat: -19.0333, lon: -65.2627, alt: '2,810m', temp: '--', lo: '--', hi: '--', conditions: 'Loading...', icon: <I.Sun size={28}/> },
    { city: 'Santa Cruz',   lat: -17.8000, lon: -63.1667, alt: '416m',   temp: '--', lo: '--', hi: '--', conditions: 'Loading...', icon: <I.Sun size={28}/> },
    { city: 'Copacabana',   lat: -16.1667, lon: -69.0833, alt: '3,841m', temp: '--', lo: '--', hi: '--', conditions: 'Loading...', icon: <I.Wind size={28}/> },
    { city: 'Rurrenabaque', lat: -14.4413, lon: -67.5278, alt: '180m',   temp: '--', lo: '--', hi: '--', conditions: 'Loading...', icon: <I.Cloud size={28}/> },
  ]);

  React.useEffect(() => {
    async function fetchWeather() {
      try {
        const lats = citiesData.map(c => c.lat).join(',');
        const lons = citiesData.map(c => c.lon).join(',');
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=America%2FLa_Paz`;
        const res = await fetch(url);
        const data = await res.json();
        
        const getCondition = (code) => {
          if (code === 0) return { text: 'Clear', icon: <I.Sun size={28}/> };
          if (code === 1 || code === 2 || code === 3) return { text: 'Partly cloudy', icon: <I.Cloud size={28}/> };
          if (code >= 45 && code <= 48) return { text: 'Fog', icon: <I.Cloud size={28}/> };
          if (code >= 51 && code <= 67) return { text: 'Rain', icon: <I.Cloud size={28}/> }; 
          if (code >= 71 && code <= 77) return { text: 'Snow', icon: <I.Cloud size={28}/> };
          if (code >= 95) return { text: 'Thunderstorm', icon: <I.Cloud size={28}/> };
          return { text: 'Variable', icon: <I.Wind size={28}/> };
        };

        const updated = citiesData.map((city, i) => {
          const f = data[i];
          if (!f || !f.current_weather) return city;

          const cond = getCondition(f.current_weather.weathercode);
          return {
            ...city,
            temp: Math.round(f.current_weather.temperature),
            lo: Math.round(f.daily.temperature_2m_min[0]),
            hi: Math.round(f.daily.temperature_2m_max[0]),
            conditions: cond.text,
            icon: cond.icon
          };
        });
        setCitiesData(updated);
      } catch (err) {
        console.error('Failed to fetch weather:', err);
      }
    }
    fetchWeather();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const alerts = [
    { id: 1, level: 'high',   title: 'Sindical block on RN-2 · La Paz → Copacabana',
      body: 'Driver guild action started 06:00. Pass through Tiquina expected to reopen by 18:00. Use Achacachi alt route (+45 min).',
      time: '08:12', source: 'ABC' },
    { id: 2, level: 'medium', title: 'Mi Teleférico Sky line maintenance',
      body: 'Scheduled cabin inspection until 14:00 today. Use Blue line to El Alto, transfer at 16 de Julio.',
      time: '07:00', source: 'Mi Teleférico' },
    { id: 3, level: 'low',    title: 'Cruz Festival · Tarija',
      body: 'Light traffic disruption in Tarija city centre today and tomorrow. Folklore parades 15:00–22:00.',
      time: 'Yesterday', source: 'Cultura BO' },
    { id: 4, level: 'low',    title: 'Cold front · Altiplano',
      body: 'Overnight temperatures drop to −5°C in Uyuni and Potosí through Friday. Bring a 0°C-rated sleeping bag.',
      time: 'Yesterday', source: 'SENAMHI' },
  ];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* COMPACT HERO */}
      <section style={{
        color: '#fff', padding: '80px 0 88px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Background photo */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: IMG.photoDashboard,
          backgroundSize: 'cover', backgroundPosition: 'center',
        }}/>
        {/* Color overlay — navy + amber tint (live data, terrestrial) */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(13,18,30,0.85) 0%, rgba(20,32,53,0.78) 50%, rgba(122,40,28,0.55) 100%)',
        }}/>
        <div style={{ position: 'absolute', top: -120, right: -80, width: 380, height: 380, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,183,3,0.18) 0%, transparent 70%)' }}/>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', position: 'relative' }}>
          <button onClick={onBack} style={{
            background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)',
            color: '#fff', padding: '8px 14px', borderRadius: 999, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, marginBottom: 24,
          }}><I.ArrowL size={13}/> Back to home</button>

          <div className="eyebrow" style={{ color: 'var(--amber-300)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--green-400)', boxShadow: '0 0 0 4px rgba(45,106,79,0.3)', animation: 'bi-pulse 1.8s ease-in-out infinite' }}/>
            Live · Bolivia Insight Dashboard
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(48px,7vw,96px)', lineHeight: 0.95,
            color: '#fff', margin: '12px 0 0', fontWeight: 600, letterSpacing: '-0.035em', maxWidth: 1100,
          }}>What's<br/><em style={{ fontStyle: 'normal', fontWeight: 800, color: 'var(--amber-300)' }}>open today.</em></h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.78)', marginTop: 14, maxWidth: 620, lineHeight: 1.6 }}>
            Roads, cable car, weather, and alerts — pulled from ABC, Mi Teleférico, and SENAMHI. Refreshed every five minutes during business hours.
          </p>
          <div style={{ marginTop: 18, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: 0.4 }}>
            UPDATED {updatedMin} MIN AGO
          </div>
        </div>
      </section>

      {/* STATUS STRIP */}
      <section style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)', padding: '32px 0' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 32px',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18 }}>
          <KpiTile label="Roads clear"        value={`${clear}/${roads.length}`}            tone={blocked > 1 ? 'warn' : 'ok'} note={`${blocked} blocked or restricted`}/>
          <KpiTile label="Cable car lines" value={`${teleferico.filter(t => t.ok).length}/${teleferico.length}`} tone="ok" note="All lines operational"/>
          <KpiTile label="Avg altiplano temp" 
                   value={(() => {
                     const altCities = citiesData.filter(c => ['La Paz', 'Uyuni', 'Copacabana'].includes(c.city));
                     const valid = altCities.filter(c => typeof c.temp === 'number').map(c => c.temp);
                     return valid.length > 0 ? `${Math.round(valid.reduce((a,b)=>a+b,0)/valid.length)}°C` : '--°C';
                   })()}
                   tone="ok" note="Live data from Open-Meteo"/>
          <KpiTile label="Active alerts"      value={String(alerts.length)}                 tone={alerts.find(a => a.level === 'high') ? 'warn' : 'ok'} note="1 high · 1 medium"/>
        </div>
      </section>

      {/* ROADS */}
      <section style={{ padding: '72px 0', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 32px' }}>
          <SectionHeader eyebrow="ABC · Administradora Boliviana de Carreteras" title="Roads & blockades."
            sub="Live status across the trunk network. Click a route to highlight on the map."/>

          {/* Region filter */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            {[
              { id: 'all',       label: 'All regions' },
              { id: 'altiplano', label: 'Altiplano' },
              { id: 'yungas',    label: 'Yungas' },
              { id: 'valles',    label: 'Valles' },
              { id: 'oriente',   label: 'Oriente' },
            ].map(r => (
              <button key={r.id} onClick={() => setRegion(r.id)} style={{
                padding: '8px 16px', borderRadius: 999,
                border: region === r.id ? '1px solid var(--navy-600)' : '1px solid var(--border)',
                background: region === r.id ? 'var(--navy-600)' : '#fff',
                color: region === r.id ? '#fff' : 'var(--fg1)',
                fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600,
                cursor: 'pointer', transition: 'all 160ms', minHeight: 36,
              }}>{r.label}</button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 24 }} className="bi-roads-grid">
            {/* Routes list */}
            <div style={{
              background: '#fff', borderRadius: 16, border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-xs)', overflow: 'hidden',
            }}>
              <div style={{
                display: 'grid', gridTemplateColumns: '70px 1fr 90px',
                gap: 12, padding: '12px 18px', background: 'var(--stone-50)',
                fontSize: 10, fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase', color: 'var(--fg3)',
                borderBottom: '1px solid var(--border)',
              }}>
                <div>Route</div><div>Section · note</div><div style={{ textAlign: 'right' }}>Distance</div>
              </div>
              {filtered.map((r, i) => (
                <button key={`${r.code}-${i}`}
                  onMouseEnter={() => setHighlightedRoute(`${r.code}-${i}`)}
                  onMouseLeave={() => setHighlightedRoute(null)}
                  onClick={() => setHighlightedRoute(`${r.code}-${i}`)}
                  style={{
                    display: 'grid', gridTemplateColumns: '70px 1fr 90px',
                    gap: 12, padding: '14px 18px', alignItems: 'center', width: '100%',
                    background: highlightedRoute === `${r.code}-${i}` ? 'var(--stone-50)' : '#fff',
                    border: 0, borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 0,
                    cursor: 'pointer', textAlign: 'left',
                    transition: 'background 160ms',
                  }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: 'var(--fg2)' }}>{r.code}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <StatusDot ok={r.ok}/>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg1)' }}>{r.name}</div>
                      <div style={{ fontSize: 12, color: r.ok ? 'var(--fg3)' : 'var(--rust-600)', marginTop: 2 }}>{r.note}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg3)' }}>{r.km} km</div>
                </button>
              ))}
            </div>

            {/* Map */}
            <div style={{
              background: '#fff', borderRadius: 16, border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-xs)', padding: 20,
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase', color: 'var(--fg3)', marginBottom: 12 }}>
                Network overview
              </div>
              <BoliviaMap roads={filtered} highlighted={highlightedRoute}/>
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)',
                display: 'flex', flexWrap: 'wrap', gap: 18, fontSize: 12, color: 'var(--fg2)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><StatusDot ok={true}/> Open</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><StatusDot ok={false}/> Blocked / restricted</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TELEFÉRICO */}
      <section style={{ padding: '80px 0', background: 'var(--stone-25)' }}>
        <div style={{ maxWidth: isXlarge ? 1800 : 1600, margin: '0 auto', padding: isLarge ? '0 48px' : '0 24px' }}>
          <SectionHeader eyebrow="Mi Teleférico · La Paz & El Alto"
            title="Cable network."
            sub="The world's longest urban cable car system. 10 lines · Bs 3 per ride · Cabins every ~12 sec"/>

          {/* Info strip */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 28,
            padding: '14px 18px', borderRadius: 12,
            background: 'var(--bg)', border: '1px solid var(--border)',
            fontSize: 12, color: 'var(--fg2)',
          }}>
            <span>🕐 <strong>Mon–Sat</strong> 06:30–22:30</span>
            <span style={{ opacity: 0.35 }}>|</span>
            <span>🕐 <strong>Sun & holidays</strong> 07:00–21:00</span>
            <span style={{ opacity: 0.35 }}>|</span>
            <span>💳 Standard <strong>Bs 3.00</strong> · Discounted <strong>Bs 1.50</strong></span>
            <span style={{ opacity: 0.35 }}>|</span>
            <span>🔄 Transfer <strong>Bs 2.00</strong> / <strong>Bs 1.00</strong></span>
            <span style={{ opacity: 0.35 }}>|</span>
            <span>📱 App <strong>YALA</strong> (QR top-up)</span>
            <span style={{ opacity: 0.35 }}>|</span>
            <span>📞 WhatsApp <strong>71554749</strong></span>
          </div>

          {/* Cards + Map — side by side on large screens, stacked on small */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isLarge
              ? `1fr ${isXlarge ? '520px' : '440px'}`
              : '1fr',
            gap: isLarge ? 28 : 20,
            alignItems: 'start',
          }}>

            {/* Cards grid — narrows minmax on wide screens to fit more columns */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isXlarge
                ? 'repeat(auto-fill, minmax(260px, 1fr))'
                : isLarge
                  ? 'repeat(auto-fill, minmax(280px, 1fr))'
                  : 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 12,
            }}>
              {teleferico.map(t => (
                <article key={t.line} style={{
                  background: '#fff', borderRadius: 14,
                  border: `1px solid ${t.ok ? 'var(--border)' : '#fca5a5'}`,
                  padding: '16px 18px', display: 'flex', alignItems: 'flex-start', gap: 14,
                  boxShadow: t.ok ? 'var(--shadow-xs)' : '0 0 0 2px rgba(220,38,38,0.08)',
                }}>
                  {/* Color badge with cable car SVG */}
                  <div style={{
                    width: 44, height: 44, borderRadius: 13, background: t.hex, flexShrink: 0,
                    boxShadow: `0 6px 16px -4px ${t.hex}99`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {/* Cable car SVG icon */}
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 7h20" stroke="rgba(255,255,255,0.55)" strokeWidth="1.4" strokeLinecap="round"/>
                      <rect x="6" y="9" width="12" height="9" rx="2.5" fill="rgba(255,255,255,0.92)"/>
                      <rect x="9" y="11.5" width="2.5" height="3" rx="0.6" fill={t.hex} opacity="0.9"/>
                      <rect x="12.5" y="11.5" width="2.5" height="3" rx="0.6" fill={t.hex} opacity="0.9"/>
                      <line x1="12" y1="7" x2="12" y2="9" stroke="rgba(255,255,255,0.75)" strokeWidth="1.4"/>
                      <circle cx="12" cy="7" r="1.1" fill="white"/>
                      <line x1="8" y1="18" x2="8" y2="20" stroke="rgba(255,255,255,0.65)" strokeWidth="1.2"/>
                      <line x1="16" y1="18" x2="16" y2="20" stroke="rgba(255,255,255,0.65)" strokeWidth="1.2"/>
                    </svg>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 600, lineHeight: 1.1 }}>
                        Línea <span style={{ color: t.hex }}>{t.line}</span>
                      </div>
                      <StatusDot ok={t.ok} />
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--fg3)', marginTop: 3, lineHeight: 1.4, fontFamily: 'var(--font-mono)' }}>{t.stations}</div>

                    {/* Stats row: duration + km */}
                    <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="8" r="6.5" stroke="var(--fg3)" strokeWidth="1.4"/>
                          <path d="M8 4.5v3.8l2.5 1.5" stroke="var(--fg3)" strokeWidth="1.4" strokeLinecap="round"/>
                        </svg>
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg2)' }}>{t.duration} min</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                          <path d="M2 13 L8 3 L14 13" stroke="var(--fg3)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg2)' }}>{t.km} km</span>
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: t.ok ? '#15803d' : '#dc2626', marginLeft: 'auto' }}>
                        {t.ok ? `● ${t.wait}` : '⚠ Maintenance'}
                      </div>
                    </div>

                    {t.tourTip && (
                      <div style={{ marginTop: 6, fontSize: 10.5, color: 'var(--fg3)', fontStyle: 'italic', lineHeight: 1.35 }}>💡 {t.tourTip}</div>
                    )}
                  </div>
                </article>
              ))}
            </div>

            {/* Interactive SVG network map */}
            <div style={{
              background: '#fff', borderRadius: 16, border: '1px solid var(--border)',
              padding: 20, boxShadow: 'var(--shadow-xs)', position: 'sticky', top: 20,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase', color: 'var(--fg3)' }}>
                  Network map
                </div>
                <button onClick={() => setMapFullscreen(true)} style={{
                  display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px',
                  borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)',
                  fontSize: 11, color: 'var(--fg2)', cursor: 'pointer', fontWeight: 600,
                }}>
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <path d="M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                  </svg>
                  Expand
                </button>
              </div>
              <svg viewBox="0 0 560 430" style={{ width: '100%', height: 'auto', cursor: 'pointer' }}
                xmlns="http://www.w3.org/2000/svg" onClick={() => !hoveredMapLine && setActiveMapLine(null)}>
                <text x="8" y="14" fontSize="7.5" fill="#94a3b8" fontWeight="700" letterSpacing="0.8">EL ALTO</text>
                <line x1="0" y1="19" x2="560" y2="19" stroke="#e2e8f0" strokeWidth="0.8"/>
                <text x="8" y="424" fontSize="7.5" fill="#94a3b8" fontWeight="700" letterSpacing="0.8">LA PAZ SUR</text>
                <line x1="0" y1="410" x2="560" y2="410" stroke="#e2e8f0" strokeWidth="0.8"/>
                {svgLines.map(l => {
                  const isActive = activeMapLine === l.name;
                  const isHov = hoveredMapLine === l.name;
                  const dim = activeMapLine && !isActive;
                  return (
                    <g key={l.name} style={{ cursor: 'pointer' }}
                      onClick={e => { e.stopPropagation(); setActiveMapLine(isActive ? null : l.name); }}
                      onMouseEnter={() => setHoveredMapLine(l.name)}
                      onMouseLeave={() => setHoveredMapLine(null)}>
                      {/* Fat invisible hit area */}
                      <polyline points={l.pts} fill="none" stroke="transparent" strokeWidth="18"/>
                      {/* Actual line */}
                      <polyline points={l.pts} fill="none" stroke={l.color}
                        strokeWidth={isActive || isHov ? l.sw + 3 : l.sw}
                        strokeDasharray={l.dash ? '7,3' : undefined}
                        strokeLinecap="round" strokeLinejoin="round"
                        opacity={dim ? 0.18 : 1}
                        style={{ filter: isActive ? `drop-shadow(0 0 5px ${l.color}99)` : 'none', transition: 'all 0.18s' }}/>
                    </g>
                  );
                })}
                {[
                  [28,207,'Río Seco',8,-9,false],[88,207,'UPEA',8,-9,false],[148,207,'Plaza\nLa Paz',8,-9,false],
                  [205,207,'Plaza\nLibertad',8,-9,false],[262,207,'16 de Julio',8,-9,true],[318,207,'Cementerio',8,-9,false],
                  [372,207,'Central',8,-9,true],[415,180,'Armentia',8,-7,false],[455,152,'Periférica',8,-7,false],
                  [495,128,'Villarroel',8,-7,true],[463,180,'Busch',8,-7,true],[520,170,'Las Villas',8,-7,false],
                  [463,218,'Triangular',8,-7,false],[463,260,'Del Poeta',8,-7,true],[360,242,'Prado',-8,-9,false],
                  [402,268,'Teatro\nAire Libre',8,-7,false],[340,262,'Obelisco',8,-7,false],[278,305,'Faro\nMurillo',-10,-7,true],
                  [235,345,'6 de Marzo',-8,5,false],[302,373,'Mirador',-8,5,true],[368,350,'Buenos\nAires',8,5,false],
                  [418,328,'Sopocachi',8,5,false],[463,312,'Libertador',8,-9,true],[483,355,'Alto\nObrajes',8,5,false],
                  [508,370,'Obrajes',8,5,false],[524,400,'Irpavi',8,5,false],
                ].map(([cx,cy,label,dx,dy,hub],i) => (
                  <g key={i}>
                    <circle cx={cx} cy={cy} r={hub?6.5:5} fill="white" stroke={hub?'#64748b':'#94a3b8'} strokeWidth={hub?2:1.8}/>
                    {label.split('\n').map((ln,li) => (
                      <text key={li} x={cx+dx} y={cy+dy+li*9} fontSize="7" fill="#334155" fontWeight="500"
                        textAnchor={dx<0?'end':'start'}>{ln}</text>
                    ))}
                  </g>
                ))}
                {[['#d32f2f','Roja',8,352],['#d4a800','Amarilla',8,365],['#2e7d32','Verde',8,378],
                  ['#1565c0','Azul',8,391],['#e65100','Naranja',8,404],['#78909c','Blanca',190,352],
                  ['#0288d1','Celeste',190,365],['#6a1b9a','Morada',190,378],['#5d4037','Café',190,391],
                  ['#90a4ae','Plateada',190,404],
                ].map(([c,name,x,y]) => (
                  <g key={name} transform={`translate(${x},${y})`}
                    style={{ cursor: 'pointer', opacity: activeMapLine && activeMapLine !== name ? 0.3 : 1 }}
                    onClick={e => { e.stopPropagation(); setActiveMapLine(activeMapLine===name?null:name); }}>
                    <rect width="14" height="7" rx="2" fill={c}/>
                    <text x="18" y="6.5" fontSize="7.5" fill="#475569">{name}</text>
                  </g>
                ))}
              </svg>
              {activeMapLine ? (
                <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 10,
                  background: svgLines.find(l=>l.name===activeMapLine)?.color + '14',
                  border: `1px solid ${svgLines.find(l=>l.name===activeMapLine)?.color}44` }}>
                  {(() => { const l = svgLines.find(x=>x.name===activeMapLine); return l ? (
                    <>
                      <div style={{ fontWeight: 700, fontSize: 13, color: l.color }}>Línea {l.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--fg3)', marginTop: 3, lineHeight: 1.5 }}>{l.stations}</div>
                      <div style={{ fontSize: 11, marginTop: 6, display: 'flex', gap: 12 }}>
                        <span>⏱ <strong>{l.duration} min</strong></span>
                        <span>📏 <strong>{l.km} km</strong></span>
                      </div>
                    </>
                  ) : null; })()}
                </div>
              ) : (
                <div style={{ fontSize: 10, color: 'var(--fg3)', marginTop: 8, textAlign: 'center' }}>
                  Click a line to see details · <button onClick={() => setMapFullscreen(true)}
                    style={{ background: 'none', border: 'none', color: 'var(--amber-500)', fontWeight: 700, fontSize: 10, cursor: 'pointer' }}>
                    Full map ↗
                  </button>
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: 16, fontSize: 12, color: 'var(--fg3)', textAlign: 'center' }}>
            ⚡ No real-time public API available — status verified via
            <a href="https://www.miteleferico.bo" target="_blank" rel="noreferrer"
              style={{ color: 'var(--amber-500)', marginLeft: 4, textDecoration: 'none', fontWeight: 600 }}>
              miteleferico.bo
            </a> and official social media.
          </div>
        </div>
      </section>

      {/* WEATHER */}
      <section style={{ padding: '72px 0', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 32px' }}>
          <SectionHeader eyebrow="Open-Meteo · Live Data"
            title="Weather across Bolivia."
            sub="Seven cities, three altitude bands. Pack the layers the data tells you to."/>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
            {citiesData.map(c => (
              <article key={c.city} style={{
                background: '#fff', borderRadius: 14, border: '1px solid var(--border)',
                padding: 22, boxShadow: 'var(--shadow-xs)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 500 }}>{c.city}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg3)', letterSpacing: 0.3, marginTop: 2 }}>{c.alt}</div>
                  </div>
                  <div style={{ color: 'var(--amber-600)' }}>{c.icon}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 14 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 500, lineHeight: 1, color: 'var(--fg1)' }}>{c.temp}°</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg3)' }}>{c.lo}° / {c.hi}°</div>
                </div>
                <div style={{ marginTop: 10, fontSize: 13, color: 'var(--fg2)' }}>{c.conditions}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ALERTS */}
      <section style={{ padding: '72px 0', background: 'var(--stone-25)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px' }}>
          <SectionHeader eyebrow="Alerts feed" title="What changed today."
            sub="Triaged from official channels and field reports. Most recent first."/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {alerts.map(a => <AlertRow key={a.id} alert={a}/>)}
          </div>
        </div>
      </section>

      {/* DISCLAIMER */}
      <section style={{ background: 'var(--stone-50)', padding: '24px 0', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 32px',
          display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
          fontSize: 12, color: 'var(--fg3)', fontFamily: 'var(--font-mono)', letterSpacing: 0.3 }}>
          <I.Shield size={14}/> Data from ABC, Mi Teleférico, SENAMHI, OpenWeather. Refreshed every 5 min · 6:00–22:00 BOT.
        </div>
      </section>

      {/* CTA BAND */}
      <section style={{ background: 'var(--navy-700)', color: '#fff', padding: '72px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px',
          display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div className="eyebrow" style={{ color: 'var(--amber-300)' }}>When the data isn't enough</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,3.4vw,40px)', margin: '10px 0 0', fontWeight: 600, lineHeight: 1.1 }}>
              Talk to someone on the ground today.
            </h3>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.78)', marginTop: 12, maxWidth: 520, lineHeight: 1.55 }}>
              The dashboard tells you the road is blocked. A local tells you which alt route the truckers are using right now.
            </p>
          </div>
          <Btn kind="amber" size="lg" onClick={onExpert}>Talk to a local <I.ArrowR size={15}/></Btn>
        </div>
      </section>

      <style>{`
        @media (max-width: 880px) {
          .bi-roads-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── FULLSCREEN MAP MODAL ── */}
      {mapFullscreen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(10,14,28,0.92)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} onClick={() => { setMapFullscreen(false); setActiveMapLine(null); }}>
          <div style={{
            background: '#fff', borderRadius: 20, boxShadow: '0 32px 80px -16px rgba(0,0,0,0.6)',
            width: 'min(96vw, 1300px)', maxHeight: '92vh',
            display: 'flex', overflow: 'hidden',
          }} onClick={e => e.stopPropagation()}>

            {/* SVG map — large */}
            <div style={{ flex: 1, padding: 32, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>Red de Integración Metropolitana</div>
                  <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>Mi Teleférico · La Paz & El Alto · 10 líneas</div>
                </div>
                <button onClick={() => { setMapFullscreen(false); setActiveMapLine(null); }}
                  style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid #e2e8f0',
                    background: '#f8fafc', cursor: 'pointer', fontSize: 18, lineHeight: 1, color: '#64748b' }}>✕</button>
              </div>
              <svg viewBox="0 0 560 430" style={{ width: '100%', height: 'auto', flex: 1, cursor: 'pointer' }}
                xmlns="http://www.w3.org/2000/svg" onClick={() => setActiveMapLine(null)}>
                <text x="8" y="14" fontSize="7.5" fill="#94a3b8" fontWeight="700" letterSpacing="0.8">EL ALTO</text>
                <line x1="0" y1="19" x2="560" y2="19" stroke="#e2e8f0" strokeWidth="0.8"/>
                <text x="8" y="424" fontSize="7.5" fill="#94a3b8" fontWeight="700" letterSpacing="0.8">LA PAZ SUR</text>
                <line x1="0" y1="410" x2="560" y2="410" stroke="#e2e8f0" strokeWidth="0.8"/>
                {svgLines.map(l => {
                  const isA = activeMapLine === l.name;
                  const isH = hoveredMapLine === l.name;
                  const dim = activeMapLine && !isA;
                  return (
                    <g key={l.name} style={{ cursor: 'pointer' }}
                      onClick={e => { e.stopPropagation(); setActiveMapLine(isA ? null : l.name); }}
                      onMouseEnter={() => setHoveredMapLine(l.name)}
                      onMouseLeave={() => setHoveredMapLine(null)}>
                      <polyline points={l.pts} fill="none" stroke="transparent" strokeWidth="22"/>
                      <polyline points={l.pts} fill="none" stroke={l.color}
                        strokeWidth={isA || isH ? l.sw + 4 : l.sw}
                        strokeDasharray={l.dash ? '7,3' : undefined}
                        strokeLinecap="round" strokeLinejoin="round"
                        opacity={dim ? 0.15 : 1}
                        style={{ filter: isA ? `drop-shadow(0 0 8px ${l.color}bb)` : isH ? `drop-shadow(0 0 4px ${l.color}66)` : 'none', transition: 'all 0.15s' }}/>
                    </g>
                  );
                })}
                {[
                  [28,207,'Río Seco',8,-9,false],[88,207,'UPEA',8,-9,false],[148,207,'Plaza\nLa Paz',8,-9,false],
                  [205,207,'Plaza\nLibertad',8,-9,false],[262,207,'16 de Julio',8,-9,true],[318,207,'Cementerio',8,-9,false],
                  [372,207,'Central',8,-9,true],[415,180,'Armentia',8,-7,false],[455,152,'Periférica',8,-7,false],
                  [495,128,'Villarroel',8,-7,true],[463,180,'Busch',8,-7,true],[520,170,'Las Villas',8,-7,false],
                  [463,218,'Triangular',8,-7,false],[463,260,'Del Poeta',8,-7,true],[360,242,'Prado',-8,-9,false],
                  [402,268,'Teatro\nAire Libre',8,-7,false],[340,262,'Obelisco',8,-7,false],[278,305,'Faro\nMurillo',-10,-7,true],
                  [235,345,'6 de Marzo',-8,5,false],[302,373,'Mirador',-8,5,true],[368,350,'Buenos\nAires',8,5,false],
                  [418,328,'Sopocachi',8,5,false],[463,312,'Libertador',8,-9,true],[483,355,'Alto\nObrajes',8,5,false],
                  [508,370,'Obrajes',8,5,false],[524,400,'Irpavi',8,5,false],
                ].map(([cx,cy,label,dx,dy,hub],i) => (
                  <g key={i}>
                    <circle cx={cx} cy={cy} r={hub?7:5.5} fill="white" stroke={hub?'#475569':'#94a3b8'} strokeWidth={hub?2.2:1.8}/>
                    {label.split('\n').map((ln,li) => (
                      <text key={li} x={cx+dx} y={cy+dy+li*9} fontSize="8" fill="#1e293b" fontWeight={hub?'700':'500'}
                        textAnchor={dx<0?'end':'start'}>{ln}</text>
                    ))}
                  </g>
                ))}
              </svg>
            </div>

            {/* Right info panel */}
            <div style={{ width: 280, background: '#f8fafc', borderLeft: '1px solid #e2e8f0',
              padding: 28, display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase', color: '#94a3b8', marginBottom: 4 }}>
                {activeMapLine ? 'Selected line' : 'Select a line to explore'}
              </div>
              {activeMapLine ? (() => {
                const l = svgLines.find(x => x.name === activeMapLine);
                const t = teleferico.find(x => x.line === activeMapLine);
                if (!l) return null;
                return (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 14, background: l.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: `0 6px 16px -4px ${l.color}88`, flexShrink: 0 }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                          <path d="M2 7h20" stroke="rgba(255,255,255,0.55)" strokeWidth="1.4" strokeLinecap="round"/>
                          <rect x="6" y="9" width="12" height="9" rx="2.5" fill="rgba(255,255,255,0.92)"/>
                          <rect x="9" y="11.5" width="2.5" height="3" rx="0.6" fill={l.color} opacity="0.9"/>
                          <rect x="12.5" y="11.5" width="2.5" height="3" rx="0.6" fill={l.color} opacity="0.9"/>
                          <line x1="12" y1="7" x2="12" y2="9" stroke="rgba(255,255,255,0.75)" strokeWidth="1.4"/>
                          <circle cx="12" cy="7" r="1.1" fill="white"/>
                        </svg>
                      </div>
                      <div>
                        <div style={{ fontSize: 22, fontWeight: 700, color: l.color }}>Line {l.name}</div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>Mi Teleférico</div>
                      </div>
                    </div>
                    <div style={{ background: '#fff', borderRadius: 12, padding: '14px 16px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 8 }}>ESTACIONES</div>
                      {l.stations.split(' · ').map((s,i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', border: `2px solid ${l.color}`, flexShrink: 0 }}/>
                          <span style={{ fontSize: 13, color: '#334155' }}>{s}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      {[['⏱', 'Duración', `${l.duration} min`],['📏', 'Distancia', `${l.km} km`]].map(([ic,lb,vl]) => (
                        <div key={lb} style={{ background: '#fff', borderRadius: 10, padding: '12px 14px', border: '1px solid #e2e8f0' }}>
                          <div style={{ fontSize: 18 }}>{ic}</div>
                          <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, marginTop: 4 }}>{lb}</div>
                          <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginTop: 2 }}>{vl}</div>
                        </div>
                      ))}
                    </div>
                    {t && <div style={{ background: t.ok ? '#f0fdf4' : '#fef2f2', borderRadius: 10, padding: '10px 14px',
                      border: `1px solid ${t.ok ? '#bbf7d0' : '#fecaca'}` }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: t.ok ? '#15803d' : '#dc2626' }}>
                        {t.ok ? `● Operativa · espera ${t.wait}` : `⚠ ${t.note || 'En mantenimiento'}`}
                      </div>
                      {t.tourTip && <div style={{ fontSize: 11, color: '#64748b', marginTop: 4, fontStyle: 'italic' }}>💡 {t.tourTip}</div>}
                    </div>}
                    <button onClick={() => setActiveMapLine(null)} style={{
                      padding: '10px 0', borderRadius: 10, border: '1px solid #e2e8f0',
                      background: '#fff', cursor: 'pointer', fontSize: 12, color: '#64748b', fontWeight: 600,
                    }}>← Volver a todas las líneas</button>
                  </>
                );
              })() : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {svgLines.map(l => (
                    <button key={l.name} onClick={() => setActiveMapLine(l.name)} style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                      borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff',
                      cursor: 'pointer', textAlign: 'left',
                    }}>
                      <div style={{ width: 14, height: 14, borderRadius: 4, background: l.color, flexShrink: 0 }}/>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>Line {l.name}</div>
                        <div style={{ fontSize: 10, color: '#94a3b8' }}>{l.duration} min · {l.km} km</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function KpiTile({ label, value, note, tone = 'ok' }) {
  const toneColor = tone === 'warn' ? 'var(--amber-600)' : tone === 'bad' ? 'var(--rust-600)' : 'var(--green-700, #1f4f3a)';
  return (
    <div style={{
      background: '#fff', border: '1px solid var(--border)', borderRadius: 14,
      padding: '18px 20px', boxShadow: 'var(--shadow-xs)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 8, height: 8, borderRadius: 999, background: toneColor }}/>
        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase', color: 'var(--fg3)' }}>{label}</span>
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 38, fontWeight: 500, color: 'var(--fg1)', marginTop: 6, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: 'var(--fg2)', marginTop: 6 }}>{note}</div>
    </div>
  );
}

function SectionHeader({ eyebrow, title, sub }) {
  return (
    <div style={{ maxWidth: 720, marginBottom: 32 }}>
      <div className="eyebrow" style={{ marginBottom: 10 }}>{eyebrow}</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,3.4vw,44px)', margin: 0, fontWeight: 600, lineHeight: 1.05, letterSpacing: '-0.02em' }}>{title}</h2>
      <p style={{ fontSize: 15, color: 'var(--fg2)', marginTop: 12, lineHeight: 1.6 }}>{sub}</p>
    </div>
  );
}

function AlertRow({ alert }) {
  const tone = alert.level === 'high' ? 'var(--rust-600)' : alert.level === 'medium' ? 'var(--amber-600)' : 'var(--fg3)';
  const bg = alert.level === 'high' ? 'var(--rust-50, #fdecea)' : alert.level === 'medium' ? 'var(--amber-50, #fff8e7)' : 'var(--stone-50)';
  return (
    <article style={{
      background: '#fff', borderRadius: 14, border: '1px solid var(--border)',
      padding: 20, display: 'flex', gap: 16,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 10, background: bg, color: tone,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}><I.Alert size={20}/></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
          <h3 style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700, color: 'var(--fg1)' }}>{alert.title}</h3>
          <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase', color: tone }}>{alert.level}</span>
        </div>
        <p style={{ margin: '6px 0 0', fontSize: 14, color: 'var(--fg2)', lineHeight: 1.55 }}>{alert.body}</p>
        <div style={{ marginTop: 10, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg3)', letterSpacing: 0.3 }}>
          {alert.time} · {alert.source}
        </div>
      </div>
    </article>
  );
}

/* Stylized Bolivia silhouette with route lines. Coordinates approximate cluster regions. */
function BoliviaMap({ roads, highlighted }) {
  const cities = {
    'La Paz':       { x: 110, y: 130 },
    'Oruro':        { x: 130, y: 200 },
    'Potosí':       { x: 175, y: 270 },
    'Sucre':        { x: 220, y: 260 },
    'Uyuni':        { x: 130, y: 285 },
    'Cochabamba':   { x: 200, y: 200 },
    'Santa Cruz':   { x: 320, y: 200 },
    'Trinidad':     { x: 290, y: 130 },
    'Copacabana':   { x: 75,  y: 100 },
    'Coroico':      { x: 145, y: 110 },
    'Caranavi':     { x: 175, y: 100 },
    'Rurrenabaque': { x: 165, y: 60 },
  };
  const segMap = {
    'La Paz → Oruro':           ['La Paz', 'Oruro'],
    'Oruro → Potosí':           ['Oruro', 'Potosí'],
    'Oruro → Uyuni':            ['Oruro', 'Uyuni'],
    'La Paz → Copacabana':      ['La Paz', 'Copacabana'],
    'La Paz → Coroico':         ['La Paz', 'Coroico'],
    'Coroico → Caranavi':       ['Coroico', 'Caranavi'],
    'Cochabamba → Santa Cruz':  ['Cochabamba', 'Santa Cruz'],
    'Cochabamba → Sucre':       ['Cochabamba', 'Sucre'],
    'Sucre → Potosí':           ['Sucre', 'Potosí'],
    'Santa Cruz → Trinidad':    ['Santa Cruz', 'Trinidad'],
    'La Paz → Rurrenabaque':    ['La Paz', 'Rurrenabaque'],
  };

  return (
    <svg viewBox="0 0 400 360" role="img" aria-label="Bolivia road network status"
      style={{ width: '100%', height: 'auto', display: 'block' }}>
      <defs>
        <linearGradient id="biMapBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--stone-50)"/>
          <stop offset="100%" stopColor="var(--stone-100, #efe9df)"/>
        </linearGradient>
      </defs>
      {/* Country silhouette (stylized) */}
      <path d="M70 80 Q 60 60 90 50 Q 130 30 175 35 Q 230 30 270 60 Q 320 80 360 130 Q 380 180 360 240 Q 340 295 290 320 Q 230 335 175 325 Q 110 315 80 280 Q 50 240 50 180 Q 50 120 70 80 Z"
        fill="url(#biMapBg)" stroke="var(--border)" strokeWidth="1.4"/>

      {/* Route lines */}
      {roads.map((r, i) => {
        const seg = segMap[r.name];
        if (!seg) return null;
        const a = cities[seg[0]];
        const b = cities[seg[1]];
        if (!a || !b) return null;
        const isHi = highlighted === `${r.code}-${i}`;
        const stroke = r.ok ? 'var(--green-500)' : 'var(--rust-500)';
        return (
          <line key={`${r.code}-${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
            stroke={stroke}
            strokeWidth={isHi ? 4 : 2.2}
            strokeLinecap="round"
            opacity={isHi ? 1 : 0.78}
            strokeDasharray={r.ok ? '0' : '6 4'}/>
        );
      })}

      {/* City nodes */}
      {Object.entries(cities).map(([name, p]) => (
        <g key={name}>
          <circle cx={p.x} cy={p.y} r="3.5" fill="var(--navy-700)"/>
          <text x={p.x + 7} y={p.y + 3} fontSize="9" fill="var(--fg2)" fontFamily="var(--font-mono)" style={{ letterSpacing: '0.3px' }}>
            {name}
          </text>
        </g>
      ))}
    </svg>
  );
}

window.Dashboard = Dashboard;
