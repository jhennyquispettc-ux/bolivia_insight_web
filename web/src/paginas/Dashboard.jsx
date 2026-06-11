import React from 'react';
import I from '../ui/iconos.jsx';
import Btn from '../ui/Boton.jsx';
import IMG from '../ui/imagenes.jsx';
import StatusDot from '../ui/StatusDot.jsx';
import { CLUSTERS } from '../data/destinos.jsx';
import { BO_VIEWBOX, BO_DEPARTMENTS } from '../data/boliviaDepartments.js';

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
    
    { code: 'RN-1',  name: 'La Paz → Oruro',          depts: ['LA PAZ', 'ORURO'],        region: 'altiplano', ok: true, note: 'Loading...', km: 230 },
    { code: 'RN-1',  name: 'Oruro → Potosí',          depts: ['ORURO', 'POTOSI'],        region: 'altiplano', ok: true, note: 'Loading...', km: 312 },
    { code: 'RN-30', name: 'Oruro → Uyuni',           depts: ['ORURO', 'POTOSI'],        region: 'altiplano', ok: true, note: 'Loading...', km: 314 },
    { code: 'RN-5',  name: 'Potosí → Uyuni',          depts: ['POTOSI'],                 region: 'altiplano', ok: true, note: 'Loading...', km: 204 },
    { code: 'RN-2',  name: 'La Paz → Copacabana',     depts: ['LA PAZ'],                 region: 'altiplano', ok: true, note: 'Loading...', km: 158 },
    { code: 'RN-1',  name: 'La Paz → Tiwanaku',       depts: ['LA PAZ'],                 region: 'altiplano', ok: true, note: 'Loading...', km: 72 },
    
    
    { code: 'RN-5',  name: 'Sucre → Potosí',          depts: ['CHUQUISACA', 'POTOSI'],   region: 'valles',    ok: true, note: 'Loading...', km: 156 },
    { code: 'RN-4',  name: 'Cochabamba → Santa Cruz', depts: ['COCHABAMBA', 'SANTA CRUZ'], region: 'valles',    ok: true, note: 'Loading...', km: 473 },
    { code: 'RN-4',  name: 'Oruro → Cochabamba',      depts: ['ORURO', 'COCHABAMBA'],    region: 'valles',    ok: true, note: 'Loading...', km: 212 },

    
    { code: 'RN-3',  name: 'La Paz → Coroico',        depts: ['LA PAZ'],                 region: 'yungas',    ok: true, note: 'Loading...', km: 96 },
    { code: 'RN-3',  name: 'La Paz → Rurrenabaque',   depts: ['LA PAZ', 'BENI'],         region: 'oriente',   ok: true, note: 'Loading...', km: 422 },
    { code: 'RN-9',  name: 'Santa Cruz → Trinidad',   depts: ['SANTA CRUZ', 'BENI'],     region: 'oriente',   ok: true, note: 'Loading...', km: 543 },
  ]);

  React.useEffect(() => {
    async function fetchAbcRoads() {
      try {
        const res = await fetch('https://transitabilidad.abc.gob.bo/api/v1/data');
        const apiData = await res.json();

        
        const abcEN = {
          
          'TRANSITABLE CON PRECAUCIÓN':          'Passable with caution',
          'TRANSITABLE CON PRECAUCION':          'Passable with caution',
          'NO TRANSITABLE POR CONFLICTOS SOCIALES': 'Blocked — social conflict',
          'BLOQUEO':                             'Road blocked',
          'BLOQUEO POR MOTIVOS SOCIALES':        'Blocked — social protest',
          'BLOQUEO POR DEMANDAS LOCALES':        'Blocked — local demands',
          'NO TRANSITABLE, TRAFICO CERRADO':     'Road closed — no traffic',
          
          'TRAMO EN CONSTRUCCION':               'Section under construction',
          'TRAMO EN CONSTRUCCIÓN':               'Section under construction',
          'REHABILITACION':                      'Road rehabilitation works',
          'REHABILITACIÓN':                      'Road rehabilitation works',
          'REPOSICION DE PLATAFORMA':            'Road surface restoration',
          'REPOSICIÓN DE PLATAFORMA':            'Road surface restoration',
          
          'FALLA DE PLATAFORMA':                 'Road surface failure',
          'PERDIDA DE PLATAFORMA':               'Road surface loss',
          'PÉRDIDA DE PLATAFORMA':               'Road surface loss',
          'PLATAFORMA HUMEDA':                   'Wet / muddy road surface',
          'PLATAFORMA HÚMEDA':                   'Wet / muddy road surface',
          'AHUELLAMIENTOS PROFUNDOS EN PLATAFORMA': 'Deep rutting on road surface',
          'AHUELLAMIENTO EN PLATAFORMA':         'Rutting on road surface',
          
          'TRANSITABLE CON DESVIOS':             'Passable via detour',
          'TRANSITABLE CON DESVÃOS':             'Passable via detour',
          'RESTRICCION VEHICULAR':               'Vehicle restriction in effect',
          'RESTRICCIÓN VEHICULAR':               'Vehicle restriction in effect',
          'RESTRICCION VEHICULAR, ESPECIAL':     'Special vehicle restriction',
          
          'DERRUMBE':                            'Landslide',
          'DERRUMBES MENORES':                   'Minor landslides',
          'CAIDA DE ROCAS':                      'Rockfall',
          'CAÃDA DE ROCAS':                      'Rockfall',
          'FLUJO DE BARRO':                      'Mudflow / debris flow',
          'INUNDACION':                          'Flooding',
          'INUNDACIÓN':                          'Flooding',
          
          'AFECTACION DE PUENTE':                'Bridge affected / damaged',
          'AFECTACIÓN DE PUENTE':                'Bridge affected / damaged',
          
          'ACCIDENTE DE TRANSITO':               'Traffic accident',
          'ACCIDENTE DE TRÃNSITO':               'Traffic accident',
          
          'NINGUN EVENTO':                       'No incidents',
          'NINGÚN EVENTO':                       'No incidents',
        };

        const translateABC = (raw) => {
          if (!raw) return 'Incident reported';
          const key = raw.trim().toUpperCase();
          if (abcEN[key]) return abcEN[key];
          
          for (const [es, en] of Object.entries(abcEN)) {
            if (key.includes(es)) return en;
          }
          
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
        console.error('Failed to fetch ABC roads, using mock fallback', err);
        setRoads(prev => prev.map(r => {
          if (r.code === 'RN-2' && r.name.includes('Copacabana')) return { ...r, ok: false, note: 'Road blocked — social conflict' };
          if (r.code === 'RN-4' && r.name.includes('Cochabamba')) return { ...r, ok: true, note: 'Caution: section under construction' };
          return { ...r, ok: true, note: 'Clear' };
        }));
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
    { line: 'Azul',     stations: 'Río Seco → UPEA → Plaza La Paz → 16 de Julio',         hex: '#1565c0', ok: true, wait: '~7 min', duration: 20, km: 5.0, tourTip: 'Main El Alto â†” La Paz corridor' },
    { line: 'Naranja',  stations: 'Central → Armentia → Periférica → Villarroel',          hex: '#e65100', ok: true, wait: '~5 min', duration: 10, km: 2.8, tourTip: 'Northern La Paz districts' },
    { line: 'Blanca',   stations: 'Plaza Villarroel → Busch → Av. Poeta',                  hex: '#546e7a', ok: true, wait: '~6 min', duration: 13, km: 3.5, tourTip: 'Connects to the Celeste line' },
    { line: 'Celeste',  stations: 'Prado → Teatro al Aire Libre → Av. Poeta → Libertad',   hex: '#0288d1', ok: true, wait: '~5 min', duration: 15, km: 3.9, tourTip: 'Heart of the Prado to the south' },
    { line: 'Morada',   stations: '6 de Marzo → Faro Murillo → San José',                  hex: '#6a1b9a', ok: true, wait: '~4 min', duration: 17, km: 4.4, tourTip: 'Northern zone, popular neighbourhoods' },
    { line: 'Café',     stations: 'Monumento Busch → Villa Copacabana',                    hex: '#5d4037', ok: true, wait: '~6 min', duration: 6,  km: 1.5, tourTip: 'Short line — El Alto gateway' },
    { line: 'Plateada', stations: '16 de Julio → Faro Murillo → Mirador',                  hex: '#78909c', ok: true, wait: '~5 min', duration: 10, km: 2.6, tourTip: 'Closes the ring — spectacular views' },
  ]);

  React.useEffect(() => {
    
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
  }, []); 

  const alerts = [
    { id: 1, level: 'high',   title: 'Sindical block on RN-2 · La Paz → Copacabana',
      body: 'Driver guild action started 06:00. Pass through Tiquina expected to reopen by 18:00. Use Achacachi alt route (+45 min).',
      time: '08:12', source: 'ABC' },
    { id: 2, level: 'medium', title: 'Mi Teleférico Sky line maintenance',
      body: 'Scheduled cabin inspection until 14:00 today. Use Blue line to El Alto, transfer at 16 de Julio.',
      time: '07:00', source: 'Mi Teleférico' },
    { id: 3, level: 'low',    title: 'Cruz Festival · Tarija',
      body: 'Light traffic disruption in Tarija city centre today and tomorrow. Folklore parades 15:00â€“22:00.',
      time: 'Yesterday', source: 'Cultura BO' },
    { id: 4, level: 'low',    title: 'Cold front · Altiplano',
      body: 'Overnight temperatures drop to âˆ’5Â°C in Uyuni and Potosí through Friday. Bring a 0Â°C-rated sleeping bag.',
      time: 'Yesterday', source: 'SENAMHI' },
  ];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {}
      <section style={{
        color: '#fff', padding: '80px 0 88px', position: 'relative', overflow: 'hidden',
      }}>
        {}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: IMG.photoDashboard,
          backgroundSize: 'cover', backgroundPosition: 'center',
        }}/>
        {}
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

      {}
      <section style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)', padding: '32px 0' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 32px',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18 }}>
          <KpiTile label="Roads clear"        value={`${clear}/${roads.length}`}            tone={blocked > 1 ? 'warn' : 'ok'} note={`${blocked} blocked or restricted`}/>
          <KpiTile label="Cable car lines" value={`${teleferico.filter(t => t.ok).length}/${teleferico.length}`} tone="ok" note="All lines operational"/>
          <KpiTile label="Avg altiplano temp" 
                   value={(() => {
                     const altCities = citiesData.filter(c => ['La Paz', 'Uyuni', 'Copacabana'].includes(c.city));
                     const valid = altCities.filter(c => typeof c.temp === 'number').map(c => c.temp);
                     return valid.length > 0 ? `${Math.round(valid.reduce((a,b)=>a+b,0)/valid.length)}Â°C` : '--Â°C';
                   })()}
                   tone="ok" note="Live data from Open-Meteo"/>
          <KpiTile label="Active alerts"      value={String(alerts.length)}                 tone={alerts.find(a => a.level === 'high') ? 'warn' : 'ok'} note="1 high · 1 medium"/>
        </div>
      </section>

      {}
      <section style={{ padding: '72px 0', background: 'var(--stone-25)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 32px' }}>
          <SectionHeader eyebrow="Geography · Regions by altitude"
            title="Bolivia, region by region."
            sub="Hover a zone (or tap a chip) to see its altitude band and what defines it — from the 180 m Amazon basin to the 4,000 m+ Altiplano."/>
          <ClusterMap/>
        </div>
      </section>

      {}
      <section style={{ padding: '72px 0', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 32px' }}>
          <SectionHeader eyebrow="ABC · Administradora Boliviana de Carreteras" title="Roads & blockades."
            sub="Live status across the trunk network. Click a route to highlight on the map."/>

          {}
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
            {}
            <div style={{
              background: 'var(--bg-elevated)', borderRadius: 16, border: '1px solid var(--border)',
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

            {}
            <div style={{
              background: 'var(--bg-elevated)', borderRadius: 16, border: '1px solid var(--border)',
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

      {}
      <section style={{ padding: '80px 0', background: 'var(--stone-25)' }}>
        <div style={{ maxWidth: isXlarge ? 1800 : 1600, margin: '0 auto', padding: isLarge ? '0 48px' : '0 24px' }}>
          <SectionHeader eyebrow="Mi Teleférico · La Paz & El Alto"
            title="Cable network."
            sub="The world's longest urban cable car system. 10 lines · Bs 3 per ride · Cabins every ~12 sec"/>

          {}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 28,
            padding: '14px 18px', borderRadius: 12,
            background: 'var(--bg)', border: '1px solid var(--border)',
            fontSize: 12, color: 'var(--fg2)',
          }}>
            <span>ðŸ• <strong>Monâ€“Sat</strong> 06:30â€“22:30</span>
            <span style={{ opacity: 0.35 }}>|</span>
            <span>ðŸ• <strong>Sun & holidays</strong> 07:00â€“21:00</span>
            <span style={{ opacity: 0.35 }}>|</span>
            <span>ðŸ’³ Standard <strong>Bs 3.00</strong> · Discounted <strong>Bs 1.50</strong></span>
            <span style={{ opacity: 0.35 }}>|</span>
            <span>ðŸ”„ Transfer <strong>Bs 2.00</strong> / <strong>Bs 1.00</strong></span>
            <span style={{ opacity: 0.35 }}>|</span>
            <span>ðŸ“± App <strong>YALA</strong> (QR top-up)</span>
            <span style={{ opacity: 0.35 }}>|</span>
            <span>ðŸ“ž WhatsApp <strong>71554749</strong></span>
          </div>

          {}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isLarge
              ? `1fr ${isXlarge ? '520px' : '440px'}`
              : '1fr',
            gap: isLarge ? 28 : 20,
            alignItems: 'start',
          }}>

            {}
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
                  background: 'var(--bg-elevated)', borderRadius: 14,
                  border: `1px solid ${t.ok ? 'var(--border)' : '#fca5a5'}`,
                  padding: '16px 18px', display: 'flex', alignItems: 'flex-start', gap: 14,
                  boxShadow: t.ok ? 'var(--shadow-xs)' : '0 0 0 2px rgba(220,38,38,0.08)',
                }}>
                  {}
                  <div style={{
                    width: 44, height: 44, borderRadius: 13, background: t.hex, flexShrink: 0,
                    boxShadow: `0 6px 16px -4px ${t.hex}99`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {}
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

                    {}
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
                        {t.ok ? `â— ${t.wait}` : 'âš  Maintenance'}
                      </div>
                    </div>

                    {t.tourTip && (
                      <div style={{ marginTop: 6, fontSize: 10.5, color: 'var(--fg3)', fontStyle: 'italic', lineHeight: 1.35 }}>ðŸ’¡ {t.tourTip}</div>
                    )}
                  </div>
                </article>
              ))}
            </div>

            {}
            <div style={{
              background: 'var(--bg-elevated)', borderRadius: 16, border: '1px solid var(--border)',
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
                      {}
                      <polyline points={l.pts} fill="none" stroke="transparent" strokeWidth="18"/>
                      {}
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
                        <span>â± <strong>{l.duration} min</strong></span>
                        <span>ðŸ“ <strong>{l.km} km</strong></span>
                      </div>
                    </>
                  ) : null; })()}
                </div>
              ) : (
                <div style={{ fontSize: 10, color: 'var(--fg3)', marginTop: 8, textAlign: 'center' }}>
                  Click a line to see details · <button onClick={() => setMapFullscreen(true)}
                    style={{ background: 'none', border: 'none', color: 'var(--amber-500)', fontWeight: 700, fontSize: 10, cursor: 'pointer' }}>
                    Full map â†—
                  </button>
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: 16, fontSize: 12, color: 'var(--fg3)', textAlign: 'center' }}>
            âš¡ No real-time public API available — status verified via
            <a href="https://www.miteleferico.bo" target="_blank" rel="noreferrer"
              style={{ color: 'var(--amber-500)', marginLeft: 4, textDecoration: 'none', fontWeight: 600 }}>
              miteleferico.bo
            </a> and official social media.
          </div>
        </div>
      </section>

      {}
      <section style={{ padding: '72px 0', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 32px' }}>
          <SectionHeader eyebrow="Open-Meteo · Live Data"
            title="Weather across Bolivia."
            sub="Seven cities, three altitude bands. Pack the layers the data tells you to."/>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
            {citiesData.map(c => (
              <article key={c.city} style={{
                background: 'var(--bg-elevated)', borderRadius: 14, border: '1px solid var(--border)',
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
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 500, lineHeight: 1, color: 'var(--fg1)' }}>{c.temp}Â°</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg3)' }}>{c.lo}Â° / {c.hi}Â°</div>
                </div>
                <div style={{ marginTop: 10, fontSize: 13, color: 'var(--fg2)' }}>{c.conditions}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {}
      <section style={{ padding: '72px 0', background: 'var(--stone-25)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px' }}>
          <SectionHeader eyebrow="Alerts feed" title="What changed today."
            sub="Triaged from official channels and field reports. Most recent first."/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {alerts.map(a => <AlertRow key={a.id} alert={a}/>)}
          </div>
        </div>
      </section>

      {}
      <section style={{ background: 'var(--stone-50)', padding: '24px 0', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 32px',
          display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
          fontSize: 12, color: 'var(--fg3)', fontFamily: 'var(--font-mono)', letterSpacing: 0.3 }}>
          <I.Shield size={14}/> Data from ABC, Mi Teleférico, SENAMHI, OpenWeather. Refreshed every 5 min · 6:00â€“22:00 BOT.
        </div>
      </section>

      {}
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

      {}
      {mapFullscreen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(10,14,28,0.92)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} onClick={() => { setMapFullscreen(false); setActiveMapLine(null); }}>
          <div style={{
            background: 'var(--bg-elevated)', borderRadius: 20, boxShadow: '0 32px 80px -16px rgba(0,0,0,0.6)',
            width: 'min(96vw, 1300px)', maxHeight: '92vh',
            display: 'flex', overflow: 'hidden',
          }} onClick={e => e.stopPropagation()}>

            {}
            <div style={{ flex: 1, padding: 32, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--fg1)' }}>Red de Integración Metropolitana</div>
                  <div style={{ fontSize: 13, color: 'var(--fg2)', marginTop: 2 }}>Mi Teleférico · La Paz & El Alto · 10 líneas</div>
                </div>
                <button onClick={() => { setMapFullscreen(false); setActiveMapLine(null); }}
                  style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid var(--border)',
                    background: 'var(--bg-sunken)', cursor: 'pointer', fontSize: 18, lineHeight: 1, color: 'var(--fg2)' }}>âœ•</button>
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

            {}
            <div style={{ width: 280, background: 'var(--bg-sunken)', borderLeft: '1px solid var(--border)',
              padding: 28, display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase', color: 'var(--fg3)', marginBottom: 4 }}>
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
                        <div style={{ fontSize: 12, color: 'var(--fg2)' }}>Mi Teleférico</div>
                      </div>
                    </div>
                    <div style={{ background: 'var(--bg-elevated)', borderRadius: 12, padding: '14px 16px', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg3)', marginBottom: 8 }}>ESTACIONES</div>
                      {l.stations.split(' · ').map((s,i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--bg-elevated)', border: `2px solid ${l.color}`, flexShrink: 0 }}/>
                          <span style={{ fontSize: 13, color: 'var(--fg1)' }}>{s}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      {[['â±', 'Duración', `${l.duration} min`],['ðŸ“', 'Distancia', `${l.km} km`]].map(([ic,lb,vl]) => (
                        <div key={lb} style={{ background: 'var(--bg-elevated)', borderRadius: 10, padding: '12px 14px', border: '1px solid var(--border)' }}>
                          <div style={{ fontSize: 18 }}>{ic}</div>
                          <div style={{ fontSize: 10, color: 'var(--fg3)', fontWeight: 700, marginTop: 4 }}>{lb}</div>
                          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--fg1)', marginTop: 2 }}>{vl}</div>
                        </div>
                      ))}
                    </div>
                    {t && <div style={{ background: t.ok ? '#f0fdf4' : '#fef2f2', borderRadius: 10, padding: '10px 14px',
                      border: `1px solid ${t.ok ? '#bbf7d0' : '#fecaca'}` }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: t.ok ? '#15803d' : '#dc2626' }}>
                        {t.ok ? `â— Operativa · espera ${t.wait}` : `âš  ${t.note || 'En mantenimiento'}`}
                      </div>
                      {t.tourTip && <div style={{ fontSize: 11, color: 'var(--fg2)', marginTop: 4, fontStyle: 'italic' }}>ðŸ’¡ {t.tourTip}</div>}
                    </div>}
                    <button onClick={() => setActiveMapLine(null)} style={{
                      padding: '10px 0', borderRadius: 10, border: '1px solid var(--border)',
                      background: 'var(--bg-elevated)', cursor: 'pointer', fontSize: 12, color: 'var(--fg2)', fontWeight: 600,
                    }}>â† Volver a todas las líneas</button>
                  </>
                );
              })() : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {svgLines.map(l => (
                    <button key={l.name} onClick={() => setActiveMapLine(l.name)} style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                      borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-elevated)',
                      cursor: 'pointer', textAlign: 'left',
                    }}>
                      <div style={{ width: 14, height: 14, borderRadius: 4, background: l.color, flexShrink: 0 }}/>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg1)' }}>Line {l.name}</div>
                        <div style={{ fontSize: 10, color: 'var(--fg3)' }}>{l.duration} min · {l.km} km</div>
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
      background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 14,
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
      background: 'var(--bg-elevated)', borderRadius: 14, border: '1px solid var(--border)',
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

function BoliviaMap({ roads, highlighted }) {
  // City positions mapped to the real BO_VIEWBOX coordinate system ("74 21 852 958")
  const cities = {
    'La Paz':       { x: 194, y: 404 },
    'Oruro':        { x: 235, y: 653 },
    'Potosí':       { x: 289, y: 777 },
    'Sucre':        { x: 475, y: 746 },
    'Uyuni':        { x: 200, y: 820 },
    'Cochabamba':   { x: 365, y: 554 },
    'Santa Cruz':   { x: 660, y: 541 },
    'Trinidad':     { x: 433, y: 299 },
    'Copacabana':   { x: 130, y: 320 },
    'Coroico':      { x: 230, y: 430 },
    'Rurrenabaque': { x: 260, y: 200 },
  };

  const segMap = {
    'La Paz → Oruro':           ['La Paz', 'Oruro'],
    'Oruro → Potosí':           ['Oruro', 'Potosí'],
    'Oruro → Uyuni':            ['Oruro', 'Uyuni'],
    'Potosí → Uyuni':           ['Potosí', 'Uyuni'],
    'La Paz → Copacabana':      ['La Paz', 'Copacabana'],
    'La Paz → Tiwanaku':        ['La Paz', 'Copacabana'],
    'La Paz → Coroico':         ['La Paz', 'Coroico'],
    'Sucre → Potosí':           ['Sucre', 'Potosí'],
    'Cochabamba → Santa Cruz':  ['Cochabamba', 'Santa Cruz'],
    'Oruro → Cochabamba':       ['Oruro', 'Cochabamba'],
    'Santa Cruz → Trinidad':    ['Santa Cruz', 'Trinidad'],
    'La Paz → Rurrenabaque':    ['La Paz', 'Rurrenabaque'],
  };

  return (
    <svg viewBox={BO_VIEWBOX} role="img" aria-label="Bolivia road network status"
      style={{ width: '100%', height: 'auto', display: 'block' }}>
      <defs>
        <linearGradient id="biRoadMapBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8f4f0"/>
          <stop offset="100%" stopColor="#dde8e4"/>
        </linearGradient>
      </defs>

      {/* Bolivia silhouette using real department outlines */}
      {BO_DEPARTMENTS.map(dp => (
        <path key={dp.id} d={dp.d}
          fill="url(#biRoadMapBg)"
          stroke="#c8d8d2" strokeWidth="4" strokeLinejoin="round"/>
      ))}

      {/* Roads */}
      {roads.map((r, i) => {
        const seg = segMap[r.name];
        if (!seg) return null;
        const a = cities[seg[0]];
        const b = cities[seg[1]];
        if (!a || !b) return null;
        const isHi = highlighted === `${r.code}-${i}`;
        const stroke = r.ok ? '#15803d' : '#dc2626';
        return (
          <line key={`${r.code}-${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
            stroke={stroke}
            strokeWidth={isHi ? 14 : 8}
            strokeLinecap="round"
            opacity={isHi ? 1 : 0.7}
            strokeDasharray={r.ok ? undefined : '20 12'}/>
        );
      })}

      {/* City dots */}
      {Object.entries(cities).map(([name, p]) => (
        <g key={name}>
          <circle cx={p.x} cy={p.y} r="10" fill="var(--navy-700, #1e3a5f)" opacity="0.85"/>
          <text x={p.x + 14} y={p.y + 5} fontSize="22" fill="#1e3a5f"
            fontFamily="system-ui, sans-serif" fontWeight="600"
            style={{ letterSpacing: '0.3px' }}>
            {name}
          </text>
        </g>
      ))}
    </svg>
  );
}

const ATTRACTIONS = [
  { id: 'uyuni',     name: 'Salar de Uyuni',       alt: 3656, x: 248, y: 754, emoji: '🧂', region: 'Altiplano',
    type: 'Maravilla Natural', temp: '-5°C a 15°C', img: IMG.photoUyuni || IMG.altiplano,
    tip: 'El espejo natural más grande del mundo. En temporada de lluvias (nov–mar) el agua crea el famoso efecto reflejo, un paraíso para la fotografía. Evita el invierno extremo si sufres de frío.',
    best: 'Nov – Mar' },
  { id: 'titicaca',  name: 'Lago Titicaca',         alt: 3810, x: 133, y: 390, emoji: '🌊', region: 'Altiplano',
    type: 'Lago Sagrado', temp: '0°C a 14°C', img: IMG.photoTiticaca || IMG.altiplano,
    tip: 'El lago navegable más alto del mundo. Visita la Isla del Sol y Copacabana para entender los orígenes de la cultura andina.',
    best: 'May – Oct' },
  { id: 'tiwanaku',  name: 'Tiwanaku',              alt: 3840, x: 146, y: 426, emoji: '🏛️', region: 'Altiplano',
    type: 'Sitio Arqueológico', temp: '-2°C a 17°C', img: IMG.altiplano,
    tip: 'Ruinas de una de las civilizaciones precolombinas más avanzadas de América. Su Puerta del Sol es un imperdible.',
    best: 'Abr – Oct' },
  { id: 'lapaz',     name: 'La Paz',                alt: 3640, x: 194, y: 420, emoji: '🏙️', region: 'Metro',
    type: 'Ciudad Principal', temp: '1°C a 16°C', img: IMG.laPaz,
    tip: 'La sede de gobierno más alta del mundo. Explora su red de Mi Teleférico, el Mercado de las Brujas y disfruta su vibrante gastronomía.',
    best: 'Todo el año' },
  { id: 'elalto',    name: 'El Alto',               alt: 4150, x: 186, y: 422, emoji: '⛪', region: 'Metro',
    type: 'Ciudad Aymara', temp: '-4°C a 14°C', img: IMG.photoMetro || IMG.laPaz,
    tip: 'La metrópoli aymara. Descubre la arquitectura de los Cholets y el inmenso Mercado 16 de Julio los jueves y domingos.',
    best: 'Todo el año' },
  { id: 'sajama',    name: 'Sajama',                alt: 6542, x: 128, y: 568, emoji: '🌋', region: 'Altiplano',
    type: 'Parque Nacional', temp: '-15°C a 10°C', img: IMG.altiplano,
    tip: 'Dominado por el volcán Sajama, el pico más alto de Bolivia. Relájate en sus aguas termales rodeado de alpacas y géiseres.',
    best: 'May – Sep' },
  { id: 'colorada',  name: 'Laguna Colorada',       alt: 4278, x: 224, y: 942, emoji: '🦩', region: 'Altiplano',
    type: 'Reserva Natural', temp: '-10°C a 12°C', img: IMG.altiplano,
    tip: 'Famosa por sus intensos tonos rojizos y por albergar miles de flamencos de James en sus aguas poco profundas.',
    best: 'Nov – Mar' },
  { id: 'verde',     name: 'Laguna Verde',          alt: 4400, x: 220, y: 997, emoji: '💚', region: 'Altiplano',
    type: 'Reserva Natural', temp: '-12°C a 10°C', img: IMG.altiplano,
    tip: 'Espectacular laguna color esmeralda a los pies del imponente volcán Licancabur, cerca de la frontera con Chile.',
    best: 'Nov – Mar' },
  { id: 'potosi',    name: 'Potosí',                alt: 3967, x: 397, y: 702, emoji: '⛏️', region: 'Altiplano',
    type: 'Ciudad Colonial', temp: '-3°C a 15°C', img: IMG.photoPotosi || IMG.valles,
    tip: 'Patrimonio UNESCO. Explora las históricas minas del Cerro Rico y la emblemática Casa de la Moneda colonial.',
    best: 'Abr – Oct' },
  { id: 'sucre',     name: 'Sucre',                 alt: 2810, x: 439, y: 654, emoji: '⚖️', region: 'Valles',
    type: 'Ciudad Capital', temp: '8°C a 23°C', img: IMG.photoValles || IMG.valles,
    tip: 'La "Ciudad Blanca" y capital constitucional. Sus calles coloniales invitan a caminar y probar el famoso chocolate local.',
    best: 'May – Oct' },
  { id: 'tarija',    name: 'Tarija',                alt: 1850, x: 485, y: 882, emoji: '🍷', region: 'Valles',
    type: 'Ruta del Vino', temp: '10°C a 28°C', img: IMG.valles,
    tip: 'El centro vinícola de Bolivia. Disfruta vinos de altura, singani, y la hospitalidad cálida de los chapacos.',
    best: 'Abr – Nov' },
  { id: 'torotoro',  name: 'Toro Toro',             alt: 2700, x: 396, y: 570, emoji: '🦕', region: 'Valles',
    type: 'Parque Nacional', temp: '5°C a 24°C', img: IMG.valles,
    tip: 'Un paraíso paleontológico. Camina entre miles de huellas de dinosaurio auténticas y desciende a la caverna Umajalanta.',
    best: 'May – Oct' },
  { id: 'samaipata', name: 'Samaipata / El Fuerte', alt: 1950, x: 563, y: 575, emoji: '🗿', region: 'Oriente',
    type: 'Sitio Arqueológico', temp: '12°C a 26°C', img: IMG.photoAmazon || IMG.amazon,
    tip: 'El Fuerte es la roca tallada más grande de América. Un santuario místico preinca con vistas espectaculares del valle.',
    best: 'Abr – Nov' },
  { id: 'muerte',    name: 'Camino de la Muerte',   alt: 1500, x: 219, y: 401, emoji: '🚵', region: 'Yungas',
    type: 'Aventura / Ciclismo', temp: '15°C a 25°C', img: IMG.photoYungas || IMG.trek,
    tip: 'Asciende desde las nieves de La Paz para lanzarte en bicicleta montaña abajo por la selva subtropical de los Yungas.',
    best: 'Jun – Nov' },
  { id: 'misiones',  name: 'Misiones Jesuíticas',   alt: 300,  x: 717, y: 387, emoji: '⛪', region: 'Oriente',
    type: 'Patrimonio Cultural', temp: '20°C a 32°C', img: IMG.amazon,
    tip: 'Seis impresionantes iglesias barrocas que mantienen viva la fusión de la cultura jesuita e indígena de la Chiquitania.',
    best: 'Abr – Oct' },
  { id: 'madidi',    name: 'Madidi / Rurrenabaque', alt: 180,  x: 245, y: 232, emoji: '🐒', region: 'Amazonía',
    type: 'Selva Amazónica', temp: '22°C a 33°C', img: IMG.photoMadidi || IMG.amazon,
    tip: 'Uno de los parques con mayor biodiversidad del mundo. Camina por la jungla buscando jaguares o realiza tours de supervivencia.',
    best: 'Jun – Nov' },
  { id: 'pampas',    name: 'Pampas del Yacuma',     alt: 200,  x: 301, y: 207, emoji: '🐊', region: 'Amazonía',
    type: 'Humedales / Vida Silvestre', temp: '21°C a 34°C', img: IMG.amazon,
    tip: 'Safaris en bote ideales para ver fácilmente caimanes, capibaras, anacondas y los raros delfines rosados de río (bufeos).',
    best: 'Jun – Oct' },
];

// Color by altitude band
function altColor(alt) {
  if (alt > 5000) return '#94a3b8'; // Glaciar
  if (alt > 3500) return '#7c6f5b'; // Altiplano
  if (alt > 2000) return '#6b7c4e'; // Valles altos
  if (alt > 800)  return '#4a7a3a'; // Valles bajos
  return '#2d6a4f';                  // Tierras bajas
}

const BANDS = [
  { label: 'Tierras bajas', sub: '< 800 m',       color: '#2d6a4f' },
  { label: 'Valles',        sub: '800–2,000 m',    color: '#4a7a3a' },
  { label: 'Valles altos',  sub: '2,000–3,500 m',  color: '#6b7c4e' },
  { label: 'Altiplano',     sub: '3,500–5,000 m',  color: '#7c6f5b' },
  { label: 'Cumbres',       sub: '> 5,000 m',      color: '#94a3b8' },
];

function ClusterMap({ onExplore }) {
  const winW = useWindowWidth();
  const isMobile = winW < 920;
  const [hovered, setHovered] = React.useState(null);
  const [selected, setSelected] = React.useState(ATTRACTIONS[0].id);
  const activeId = hovered || selected;
  const active = ATTRACTIONS.find(a => a.id === activeId) || ATTRACTIONS[0];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 340px',
      gap: isMobile ? 20 : 24, alignItems: 'start',
    }}>
      {/* ── Map card ─────────────────────────────────────────────────────────── */}
      <div style={{
        background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 18,
        boxShadow: 'var(--shadow-xs)', padding: isMobile ? 14 : 20, position: 'relative',
        height: 'fit-content'
      }}>
        <svg viewBox={BO_VIEWBOX} role="img" aria-label="Mapa orográfico de Bolivia"
          style={{ width: '100%', height: 'auto', display: 'block', maxWidth: 700, margin: '0 auto' }}>
          <defs>
            <linearGradient id="oroGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#c8d8b0"/>
              <stop offset="55%" stopColor="#a89070"/>
              <stop offset="100%" stopColor="#e8e0d0"/>
            </linearGradient>
            
            {/* Salar de Uyuni pattern (white salt) */}
            <pattern id="salarPattern" width="4" height="4" patternUnits="userSpaceOnUse">
              <rect width="4" height="4" fill="#ffffff"/>
              <circle cx="2" cy="2" r="1" fill="#f1f5f9"/>
            </pattern>
          </defs>

          {/* Bolivia silhouette — orographic tones by department altitude WITHOUT borders */}
          {BO_DEPARTMENTS.map(dp => {
            const deptAlt = { BOL: 3400, BOO: 3700, BOP: 3800, BOT: 1800, BOS: 400, BOH: 2600, BON: 300, BOB: 250, BOC: 2500 };
            const a = deptAlt[dp.id] || 1000;
            return (
              <path key={dp.id} d={dp.d}
                fill={altColor(a)} fillOpacity="0.55"
                stroke="none" strokeWidth="0" strokeLinejoin="round"/>
            );
          })}
          
          {/* Uyuni White Patch (Approximation) */}
          <path d="M 210 750 Q 240 730 270 760 Q 280 800 230 810 Q 180 790 210 750 Z" 
                fill="url(#salarPattern)" opacity="0.95" />

          {/* Attraction markers */}
          {ATTRACTIONS.map(att => {
            const isActive = att.id === activeId;
            const c = altColor(att.alt);
            return (
              <g key={att.id}
                style={{ cursor: 'pointer' }}
                onClick={() => setSelected(att.id)}
                onMouseEnter={() => setHovered(att.id)}
                onMouseLeave={() => setHovered(null)}>
                {/* Pulse ring on active */}
                {isActive && (
                  <circle cx={att.x} cy={att.y} r="32"
                    fill="none" stroke={c} strokeWidth="6" opacity="0.35"/>
                )}
                {/* Marker */}
                <circle cx={att.x} cy={att.y}
                  r={isActive ? 20 : 14}
                  fill={c} stroke="#fff" strokeWidth={isActive ? 5 : 3}
                  style={{ transition: 'all 180ms', filter: isActive ? `drop-shadow(0 3px 8px ${c}99)` : 'none' }}/>
                {/* Altitude label on active */}
                {isActive && (
                  <>
                    <rect x={att.x + 24} y={att.y - 22} width="220" height="42" rx="12"
                      fill="rgba(13,18,30,0.82)"/>
                    <text x={att.x + 34} y={att.y - 4} fontSize="20" fill="#fff" fontWeight="700"
                      fontFamily="system-ui, sans-serif">
                      {att.name}
                    </text>
                    <text x={att.x + 34} y={att.y + 14} fontSize="16" fill="#fbbf24" fontWeight="600"
                      fontFamily="system-ui, monospace">
                      {att.alt.toLocaleString()} m.s.n.m.
                    </text>
                  </>
                )}
                {!isActive && (
                  <text x={att.x} y={att.y + 6} fontSize="18" textAnchor="middle" fill="#fff">
                    {att.emoji}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Altitude band legend */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12, justifyContent: 'center' }}>
          {BANDS.map(b => (
            <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--fg2)' }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: b.color }}/>
              <span><strong>{b.label}</strong> {b.sub}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Detail Card (Ficha) ──────────────────────────────────────────────── */}
      <div style={{
        background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 18,
        boxShadow: 'var(--shadow-md)', position: 'sticky', top: 24,
        display: 'flex', flexDirection: 'column', overflow: 'hidden'
      }}>
        {/* Attraction Image Header */}
        <div style={{
          height: 180, background: active.img || 'var(--stone-200)',
          backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative'
        }}>
          <div style={{
            position: 'absolute', top: 12, right: 12, background: 'rgba(13,18,30,0.85)',
            color: '#fbbf24', padding: '6px 12px', borderRadius: 999, fontSize: 11, fontWeight: 800,
            letterSpacing: 0.5, backdropFilter: 'blur(4px)'
          }}>
            {active.type}
          </div>
          <div style={{
            position: 'absolute', bottom: -20, left: 20,
            width: 56, height: 56, borderRadius: 16,
            background: altColor(active.alt), color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
            boxShadow: `0 6px 16px -4px ${altColor(active.alt)}99`, border: '3px solid var(--bg-elevated)'
          }}>
            {active.emoji}
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '26px 20px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Title and Region */}
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, lineHeight: 1.1, color: 'var(--fg1)' }}>{active.name}</div>
            <div style={{ fontSize: 12, color: 'var(--fg3)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.4px', fontWeight: 800 }}>
              {active.region}
            </div>
          </div>

          {/* Description Tip */}
          <div style={{ fontSize: 14, color: 'var(--fg2)', lineHeight: 1.6 }}>
            {active.tip}
          </div>

          {/* Info Grid (Altitud, Temp, Temporada) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ background: 'var(--stone-25)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 14px' }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.4, textTransform: 'uppercase', color: 'var(--fg3)', marginBottom: 4 }}>Altitud</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: altColor(active.alt), fontFamily: 'var(--font-display)' }}>{active.alt.toLocaleString()} <span style={{fontSize:12, fontWeight:600}}>msnm</span></div>
            </div>
            <div style={{ background: 'var(--stone-25)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 14px' }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.4, textTransform: 'uppercase', color: 'var(--fg3)', marginBottom: 4 }}>Temperatura</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg1)' }}>{active.temp}</div>
            </div>
            <div style={{ background: 'var(--stone-25)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 14px', gridColumn: '1 / -1' }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.4, textTransform: 'uppercase', color: 'var(--fg3)', marginBottom: 4 }}>Mejor época</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg1)' }}>{active.best}</div>
            </div>
          </div>

          {/* Action Button */}
          <div style={{ marginTop: 8 }}>
            <Btn kind="amber" size="lg" onClick={() => onExplore ? onExplore(active.id) : null} style={{ width: '100%', justifyContent: 'center' }}>
              Ver detalles del destino <I.ArrowR size={15}/>
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

