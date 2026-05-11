/* Bolivia Insight — Emergency SOS Hub
   Calm, scannable, mobile-first. Optimized for stress-state usage. */
function EmergencyHub({ onBack }) {
  const [city, setCity] = useState('lapaz');

  const cities = [
    { id: 'lapaz',       label: 'La Paz' },
    { id: 'sucre',       label: 'Sucre' },
    { id: 'santacruz',   label: 'Santa Cruz' },
    { id: 'cochabamba',  label: 'Cochabamba' },
    { id: 'uyuni',       label: 'Uyuni' },
    { id: 'copacabana',  label: 'Copacabana' },
    { id: 'rurrenabaque',label: 'Rurrenabaque' },
    { id: 'potosi',      label: 'Potosí' },
  ];

  const critical = [
    { id: 'police',  label: 'Police',         number: '110', icon: <I.Shield size={28}/>,   note: 'National emergency line' },
    { id: 'medical', label: 'Medical / SAR',  number: '118', icon: <I.Heart size={28}/>,    note: 'Ambulance and search & rescue' },
    { id: 'tourist', label: 'Tourist Police', number: '800-14-0081', icon: <I.Flag size={28}/>, note: 'English-speaking, tourist-focused' },
  ];

  // Per-city directories. Real numbers/addresses; verify monthly.
  const directories = {
    lapaz: {
      hospitals: [
        { name: 'Clínica Alemana',         addr: 'Av. 6 de Agosto 2821, Sopocachi',   phone: '+591 2 244-8400', hours: '24h',          note: 'Best-equipped private hospital' },
        { name: 'Hospital del Tórax',      addr: 'Plaza Antofagasta, San Pedro',       phone: '+591 2 248-9015', hours: '24h',          note: 'Public, altitude specialists' },
        { name: 'Centro Médico Boliviano-Belga', addr: 'Av. Saavedra 2384, Miraflores', phone: '+591 2 222-2155', hours: '24h',         note: 'Mid-range, English staff' },
      ],
      pharmacies: [
        { name: 'Farmacorp Sopocachi',     addr: 'Av. 20 de Octubre 2002',             phone: '+591 2 211-9988', hours: '24h',          note: 'Largest 24-hour chain' },
        { name: 'Chávez El Prado',         addr: 'Av. 16 de Julio 1571',               phone: '+591 2 233-7676', hours: '24h',          note: 'Central, English signage' },
      ],
      embassies: [
        { name: 'United States Embassy',   addr: 'Av. Arce 2780, San Jorge',           phone: '+591 2 216-8000', hours: 'Mon–Fri 8–17',  note: 'After-hours emergency line on website' },
        { name: 'British Embassy',         addr: 'Av. Arce 2732',                      phone: '+591 2 243-3424', hours: 'Mon–Fri 9–13',  note: 'Consular emergencies 24h' },
        { name: 'German Embassy',          addr: 'Av. Arce 2395',                      phone: '+591 2 244-0606', hours: 'Mon–Fri 8–12',  note: '' },
        { name: 'Embajada de Argentina',   addr: 'Aspiazu 497, Sopocachi',             phone: '+591 2 241-7737', hours: 'Mon–Fri 9–14',  note: '' },
      ],
      banks: [
        { name: 'Banco Bisa Sopocachi',    addr: 'Av. 20 de Octubre 2300',             phone: '+591 2 234-3232', hours: 'Mon–Fri 8:30–17', note: 'USD exchange, traveler\'s checks' },
        { name: 'BCP Calacoto',            addr: 'Calle 17, Calacoto',                 phone: '+591 2 277-5000', hours: 'Mon–Fri 8:30–17', note: 'Largest ATM network' },
      ],
      taxis: [
        { name: 'InDriver',                addr: 'App-based, citywide',                phone: 'app',             hours: '24h',           note: 'Cheapest, set your own price' },
        { name: 'Cabify',                  addr: 'App-based, citywide',                phone: 'app',             hours: '24h',           note: 'Highest safety rating' },
        { name: 'Radio Móvil',             addr: 'Dispatch — citywide',                phone: '+591 2 235-0000', hours: '24h',           note: 'Phone-dispatched, fixed rates' },
      ],
      tourist: [
        { name: 'Infotur La Paz',          addr: 'Plaza del Estudiante (Prado)',       phone: '+591 2 237-1044', hours: 'Daily 9–18',    note: 'Free maps, route advice' },
      ],
    },
    sucre: {
      hospitals: [
        { name: 'Hospital Santa Bárbara',  addr: 'Calle Ravelo, centro',                phone: '+591 4 645-1900', hours: '24h',          note: 'Public, central' },
        { name: 'Clínica Los Olivos',      addr: 'Calle Aniceto Arce 8',               phone: '+591 4 645-3800', hours: '24h',          note: 'Private, mid-range' },
      ],
      pharmacies: [
        { name: 'Farmacia Bolivia',        addr: 'Calle España 75',                    phone: '+591 4 645-3142', hours: 'Daily 8–22',    note: '' },
      ],
      embassies: [],
      banks: [
        { name: 'BCP Sucre',               addr: 'Plaza 25 de Mayo',                   phone: '+591 4 645-1011', hours: 'Mon–Fri 8:30–17', note: 'USD exchange' },
      ],
      taxis: [
        { name: 'Radio Taxi Sucre',        addr: 'Citywide',                           phone: '+591 4 645-1414', hours: '24h',          note: '' },
      ],
      tourist: [
        { name: 'Casa de Turismo',         addr: 'Plaza 25 de Mayo, esquina Argentina', phone: '+591 4 643-1640', hours: 'Daily 8:30–18', note: '' },
      ],
    },
    santacruz: {
      hospitals: [
        { name: 'Hospital Foianini',       addr: 'Av. Irala 468',                      phone: '+591 3 336-2211', hours: '24h',          note: 'Best private in eastern lowlands' },
        { name: 'Hospital Japonés',        addr: 'Av. Japón 3er Anillo',                phone: '+591 3 346-2031', hours: '24h',          note: 'Public reference hospital' },
      ],
      pharmacies: [
        { name: 'Farmacorp Equipetrol',    addr: 'Av. San Martín 100',                 phone: '+591 3 343-4000', hours: '24h',          note: '' },
      ],
      embassies: [
        { name: 'Brazilian Consulate',     addr: 'Av. Busch 330',                      phone: '+591 3 333-4400', hours: 'Mon–Fri 9–13',  note: '' },
      ],
      banks: [
        { name: 'BCP Equipetrol',          addr: 'Av. San Martín y 4to Anillo',         phone: '+591 3 354-0900', hours: 'Mon–Fri 8:30–17', note: '' },
      ],
      taxis: [
        { name: 'Yango',                   addr: 'App-based, citywide',                phone: 'app',             hours: '24h',           note: 'Most active in Santa Cruz' },
      ],
      tourist: [
        { name: 'Infotur Santa Cruz',      addr: 'Plaza 24 de Septiembre',             phone: '+591 3 339-0205', hours: 'Mon–Sat 8–18',  note: '' },
      ],
    },
    cochabamba: {
      hospitals: [
        { name: 'Clínica Belga',           addr: 'Av. Antezana 455',                   phone: '+591 4 425-9100', hours: '24h',          note: '' },
      ],
      pharmacies: [{ name: 'Farmacorp Recoleta', addr: 'Av. América', phone: '+591 4 411-4600', hours: '24h', note: '' }],
      embassies: [],
      banks: [{ name: 'BCP El Prado', addr: 'Plaza Colón', phone: '+591 4 425-0000', hours: 'Mon–Fri 8:30–17', note: '' }],
      taxis: [{ name: 'Radio Taxi Líder', addr: 'Citywide', phone: '+591 4 411-1111', hours: '24h', note: '' }],
      tourist: [{ name: 'Infotur Cochabamba', addr: 'Plaza 14 de Septiembre', phone: '+591 4 425-8030', hours: 'Mon–Sat 8–18', note: '' }],
    },
    uyuni: {
      hospitals: [
        { name: 'Hospital Mario Mercado',  addr: 'Av. Ferroviaria',                    phone: '+591 2 693-2025', hours: '24h',          note: 'Basic care · serious cases evac to Potosí or La Paz' },
      ],
      pharmacies: [{ name: 'Farmacia Salar', addr: 'Av. Potosí', phone: '+591 2 693-2099', hours: 'Daily 8–22', note: '' }],
      embassies: [],
      banks: [{ name: 'Banco Unión',     addr: 'Av. Potosí esq. Bolívar',     phone: '+591 2 693-2188', hours: 'Mon–Fri 8:30–16:30', note: 'Only ATM in town — bring backup cash' }],
      taxis: [{ name: 'Radio Taxi Uyuni', addr: 'Plaza Arce dispatch', phone: '+591 2 693-2700', hours: '24h', note: '' }],
      tourist: [{ name: 'Infotur Uyuni', addr: 'Plaza Arce', phone: '+591 2 693-2060', hours: 'Mon–Sat 9–18', note: 'Tour operators verified here' }],
    },
    copacabana: {
      hospitals: [{ name: 'Hospital Copacabana', addr: 'Av. 6 de Agosto', phone: '+591 2 862-2104', hours: '24h', note: 'Basic · evac to La Paz for serious cases' }],
      pharmacies: [{ name: 'Farmacia Virgen', addr: 'Av. 6 de Agosto', phone: '+591 2 862-2200', hours: 'Daily 8–21', note: '' }],
      embassies: [],
      banks: [{ name: 'Banco Unión Copacabana', addr: 'Av. 6 de Agosto', phone: '+591 2 862-2300', hours: 'Mon–Fri 8:30–16', note: 'Single ATM in town' }],
      taxis: [{ name: 'Trufi Copacabana → La Paz', addr: 'Av. 16 de Julio', phone: '+591 2 862-2080', hours: 'Daily 6–18', note: '' }],
      tourist: [{ name: 'Casa de Turismo', addr: 'Av. 16 de Julio', phone: '+591 2 862-2103', hours: 'Daily 9–18', note: '' }],
    },
    rurrenabaque: {
      hospitals: [{ name: 'Hospital Rurrenabaque', addr: 'Av. Bolívar', phone: '+591 3 892-2052', hours: '24h', note: 'Basic · malaria & dengue care' }],
      pharmacies: [{ name: 'Farmacia Madidi', addr: 'Calle Comercio', phone: '+591 3 892-2114', hours: 'Daily 8–22', note: '' }],
      embassies: [],
      banks: [{ name: 'BancoSol Rurre', addr: 'Calle Comercio', phone: '+591 3 892-2099', hours: 'Mon–Fri 8:30–16', note: '' }],
      taxis: [{ name: 'Moto-taxi dispatch', addr: 'Plaza principal', phone: 'on-site', hours: '24h', note: '' }],
      tourist: [{ name: 'Infotur Rurrenabaque', addr: 'Av. Bolívar y Vaca Diez', phone: '+591 3 892-2300', hours: 'Daily 9–18', note: 'Verifies Madidi operators' }],
    },
    potosi: {
      hospitals: [{ name: 'Hospital Daniel Bracamonte', addr: 'Calle Bustillos', phone: '+591 2 622-7100', hours: '24h', note: 'Public · altitude trained' }],
      pharmacies: [{ name: 'Farmacia Potosí', addr: 'Calle Lanza', phone: '+591 2 622-3088', hours: 'Daily 8–22', note: '' }],
      embassies: [],
      banks: [{ name: 'BCP Potosí', addr: 'Plaza 10 de Noviembre', phone: '+591 2 622-2120', hours: 'Mon–Fri 8:30–17', note: '' }],
      taxis: [{ name: 'Radio Taxi Potosí', addr: 'Citywide', phone: '+591 2 622-3300', hours: '24h', note: '' }],
      tourist: [{ name: 'Infotur Potosí', addr: 'Plaza 6 de Agosto', phone: '+591 2 622-7405', hours: 'Mon–Sat 8:30–18', note: '' }],
    },
  };

  const dir = directories[city] || directories.lapaz;
  const today = new Date('2026-04-29');
  const dateStr = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const altitudeAlts = {
    lapaz: 'Coroico (1,700 m, 2.5h drive via RN-3)',
    potosi: 'Sucre (2,810 m, 3h drive via RN-6)',
    uyuni: 'Tupiza (2,950 m, 4h drive)',
    copacabana: 'Coroico (1,700 m, via La Paz · 5h)',
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* HERO — calm, no decorative orbs */}
      <section style={{ background: 'var(--navy-800)', color: '#fff', padding: '80px 0 88px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <button onClick={onBack} style={{
            background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)',
            color: '#fff', padding: '8px 14px', borderRadius: 999, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, marginBottom: 24,
          }}><I.ArrowL size={13}/> Back to home</button>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div className="eyebrow" style={{ color: 'var(--rust-300)' }}>SOS · Emergency Hub</div>
              <h1 style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(40px,5.5vw,72px)', lineHeight: 0.98,
                color: '#fff', margin: '12px 0 0', fontWeight: 600, letterSpacing: '-0.03em',
              }}>SOS · Bolivia.</h1>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.78)', marginTop: 14, maxWidth: 580, lineHeight: 1.55 }}>
                Real numbers, current as of {dateStr}. Save this page offline before you leave the hotel wifi.
              </p>
            </div>
            <Btn kind="glass" size="md" onClick={() => window.print()} style={{ flexShrink: 0 }}>
              <I.Download size={14}/> Save offline
            </Btn>
          </div>
        </div>
      </section>

      {/* CRITICAL ROW — biggest tap targets, top of page for stress state */}
      <section style={{ background: 'var(--bg)', padding: '32px 0 8px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
          {critical.map(c => (
            <a key={c.id} href={`tel:${c.number.replace(/[\s-]/g, '')}`} style={{
              display: 'flex', alignItems: 'center', gap: 18,
              background: 'var(--rust-500)', color: '#fff',
              padding: '20px 24px', borderRadius: 16, textDecoration: 'none',
              boxShadow: '0 12px 28px -10px rgba(179,63,46,0.5)',
              minHeight: 96, cursor: 'pointer',
              transition: 'transform 160ms var(--ease-out)',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                background: 'rgba(255,255,255,0.18)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>{c.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.4, textTransform: 'uppercase', color: 'rgba(255,255,255,0.82)' }}>{c.label}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 500, marginTop: 2, lineHeight: 1.1, letterSpacing: '-0.01em' }}>{c.number}</div>
                <div style={{ fontSize: 12, marginTop: 4, color: 'rgba(255,255,255,0.78)' }}>{c.note}</div>
              </div>
              <I.Phone size={22}/>
            </a>
          ))}
        </div>
      </section>

      {/* CITY SELECTOR */}
      <section style={{ padding: '32px 0 8px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Select your city</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {cities.map(c => {
              const active = city === c.id;
              return (
                <button key={c.id} onClick={() => setCity(c.id)}
                  aria-pressed={active}
                  style={{
                    padding: '10px 18px', borderRadius: 999,
                    border: active ? '1px solid var(--navy-700)' : '1px solid var(--border-strong)',
                    background: active ? 'var(--navy-700)' : '#fff',
                    color: active ? '#fff' : 'var(--fg1)',
                    fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600,
                    cursor: 'pointer', transition: 'all 160ms', minHeight: 44,
                  }}>{c.label}</button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ALTITUDE CALLOUT — only relevant for high-altitude cities */}
      {altitudeAlts[city] && (
        <section style={{ padding: '20px 0 8px', background: 'var(--bg)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
            <div style={{
              display: 'flex', gap: 16, padding: '20px 22px',
              background: 'var(--amber-50, #fff8e7)', border: '1px solid var(--amber-200, #ffe7a8)',
              borderRadius: 14, alignItems: 'flex-start',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10, background: 'var(--amber-500)',
                color: 'var(--navy-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}><I.Mountain size={22}/></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.4, textTransform: 'uppercase', color: 'var(--rust-600)' }}>Altitude red flags — get to lower ground</div>
                <p style={{ fontSize: 14, color: 'var(--fg1)', marginTop: 6, lineHeight: 1.55 }}>
                  Vomiting, blue lips, can't walk straight, persistent headache after 24h. Don't wait it out — descend.
                </p>
                <p style={{ fontSize: 13, color: 'var(--fg2)', marginTop: 6 }}>
                  Nearest lower-altitude town: <strong style={{ color: 'var(--fg1)' }}>{altitudeAlts[city]}</strong>.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CATEGORIES */}
      <section style={{ padding: '40px 0 80px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20 }}>
          <CategoryBlock title="Hospitals"           icon={<I.Hospital size={18}/>}  items={dir.hospitals}/>
          <CategoryBlock title="24-hour pharmacies"  icon={<I.Heart size={18}/>}     items={dir.pharmacies}/>
          <CategoryBlock title="Embassies"           icon={<I.Flag size={18}/>}      items={dir.embassies}    empty="No consular presence in this city. Nearest in La Paz."/>
          <CategoryBlock title="Banks · USD exchange" icon={<I.Building size={18}/>} items={dir.banks}/>
          <CategoryBlock title="Verified taxis"      icon={<I.Route size={18}/>}     items={dir.taxis}/>
          <CategoryBlock title="Tourist information" icon={<I.Pin size={18}/>}       items={dir.tourist}/>
        </div>
      </section>

      {/* FOOTER NOTE */}
      <section style={{ background: 'var(--stone-50)', padding: '28px 0', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px',
          display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
          fontSize: 13, color: 'var(--fg2)' }}>
          <I.Shield size={16}/>
          <span>We verify these numbers monthly. Spotted a change? <a href="mailto:hello@boliviainsight.com" style={{ color: 'var(--rust-600)', fontWeight: 700 }}>Email us</a> — we'll update within 48 hours.</span>
        </div>
      </section>
    </div>
  );
}

function CategoryBlock({ title, icon, items, empty }) {
  return (
    <section style={{
      background: '#fff', borderRadius: 16, border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-xs)', overflow: 'hidden',
    }}>
      <header style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '16px 22px', borderBottom: '1px solid var(--border)',
        background: 'var(--stone-25)',
      }}>
        <span style={{
          width: 32, height: 32, borderRadius: 8, background: 'var(--navy-700)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{icon}</span>
        <h3 style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 800, letterSpacing: 0.3, textTransform: 'uppercase', color: 'var(--fg1)' }}>{title}</h3>
      </header>
      {items.length === 0 ? (
        <div style={{ padding: '20px 22px', fontSize: 13, color: 'var(--fg3)', fontStyle: 'italic' }}>{empty || 'Not available in this city.'}</div>
      ) : (
        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
          {items.map((it, i) => {
            const tel = typeof it.phone === 'string' && it.phone.startsWith('+') ? it.phone.replace(/[\s-]/g, '') : null;
            return (
              <li key={i} style={{
                padding: '16px 22px',
                borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 0,
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 500, lineHeight: 1.2 }}>{it.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--fg3)', marginTop: 4 }}>{it.addr}</div>
                  </div>
                  {tel ? (
                    <a href={`tel:${tel}`} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '8px 14px', borderRadius: 999,
                      background: 'var(--navy-700)', color: '#fff',
                      fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, letterSpacing: 0.3,
                      textDecoration: 'none', minHeight: 36,
                    }}><I.Phone size={13}/> {it.phone}</a>
                  ) : (
                    <span style={{
                      padding: '6px 12px', borderRadius: 999,
                      background: 'var(--stone-50)', color: 'var(--fg2)',
                      fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, letterSpacing: 0.3,
                    }}>{it.phone}</span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 14, marginTop: 8, fontSize: 12, color: 'var(--fg2)', flexWrap: 'wrap' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><I.Clock size={12}/> {it.hours}</span>
                  {it.note && <span>· {it.note}</span>}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

window.EmergencyHub = EmergencyHub;
