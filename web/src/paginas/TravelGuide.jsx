/* Bolivia Insight — Travel Guide page (essentials for flashpackers) */
function TravelGuide({ onBack, onExpert, initialTab }) {
  const [tab, setTab] = useState(initialTab || 'arrive');

  const sections = {
    arrive: {
      label: 'Arrive',
      title: 'Getting in.',
      sub: 'No agency, no hand-holding — just what you need to know on day one.',
      cards: [
        { k: 'Main airport', v: 'El Alto (LPB)', n: '4,061 m · 35 min from La Paz centro' },
        { k: 'Visa', v: 'Free 30 days', n: 'Most EU/UK/CA/AU/Mercosur. USA pays $160 on arrival.' },
        { k: 'Currency', v: 'Boliviano (Bs)', n: '≈ 6.96 Bs / USD · ATMs in every city' },
        { k: 'eSIM', v: 'Tigo or Entel', n: '20 Bs/day · 4G everywhere except Madidi' },
        { k: 'Spanish', v: 'Essential', n: 'English in hostels only. Aymara & Quechua audible.' },
        { k: 'Cash culture', v: 'Bring small bills', n: 'Outside La Paz/SCZ, cards are rare. Bs 10–50 daily.' },
      ],
    },
    altitude: {
      label: 'Altitude',
      title: 'The 3,600 m question.',
      sub: 'La Paz sits higher than most ski resorts. Here\'s how locals handle it.',
      cards: [
        { k: 'Day 1', v: 'Walk slow', n: 'No alcohol. Mate de coca all day. Sleep early.' },
        { k: 'Day 2', v: 'Mostly flat', n: 'Mercado Lanza, Witches\' Market. No teleférico cardio.' },
        { k: 'Day 3+', v: 'Trek-ready', n: 'Now you can do Valle de la Luna, Cumbre, El Alto.' },
        { k: 'Pills', v: 'Soroche pills', n: 'Sold OTC at any farmacia · Bs 30 / 12 tablets' },
        { k: 'Red flags', v: 'Get to lower ground', n: 'Vomiting, can\'t walk straight, blue lips → Coroico (1,700m)' },
        { k: 'Worst city', v: 'Potosí (4,067 m)', n: 'Even acclimatized travelers feel it. Plan 1 night max.' },
      ],
    },
    money: {
      label: 'Money & costs',
      title: 'What things actually cost.',
      sub: 'Real numbers from April 2026 — flashpacker baseline, not luxury.',
      cards: [
        { k: 'Hostel dorm', v: 'Bs 70 – 110', n: '$10 – $16 · Wild Rover, Loki, Adventure Brew' },
        { k: 'Private room', v: 'Bs 180 – 320', n: '$26 – $46 · boutique in Sopocachi, La Recoleta' },
        { k: 'Set lunch', v: 'Bs 25 – 45', n: '$3.50 – $6.50 · "almuerzo" with soup + main + drink' },
        { k: 'Salar 3D/2N', v: 'Bs 1,400 – 1,800', n: '$200 – $260 · group jeep from Uyuni, all-in' },
        { k: 'La Paz → Uyuni bus', v: 'Bs 200 – 350', n: 'Overnight semi-cama · 10 hours' },
        { k: 'Teleférico ride', v: 'Bs 3', n: '~$0.45 · 9 lines, runs 6am–11pm' },
      ],
    },
    safe: {
      label: 'Safety & scams',
      title: 'What to actually watch for.',
      sub: 'Bolivia is among the safer Andean countries. The risks are specific.',
      cards: [
        { k: 'Fake police', v: 'Always ask for ID', n: 'Real cops never ask for your passport on the street.' },
        { k: 'Express kidnapping', v: 'Use Cabify in La Paz', n: 'Avoid hailed taxis after 22:00 in Sopocachi.' },
        { k: 'Strikes (paros)', v: 'Check bloqueos.bo', n: 'Routes can close overnight. Buffer +1 day in itinerary.' },
        { k: 'Death Road', v: 'Use insured operators', n: 'Gravity Bolivia, Barracuda · ~Bs 600 / $85, helmets + radio' },
        { k: 'Solo women', v: 'Generally fine', n: 'Stick to El Prado, Sopocachi at night. Catcalling, not assault.' },
        { k: 'Tap water', v: 'Don\'t', n: 'Filter or boil. Bottled Bs 5/L. Hostels usually filter.' },
      ],
    },
    dictionary: {
      label: 'Dictionary',
      title: 'The words that aren\'t in the phrasebook.',
      sub: 'Bolivian Spanish, Aymara, Quechua — searchable, with examples and pronunciation.',
      cards: [],
    },
    when: {
      label: 'When to go',
      title: 'Reading the seasons.',
      sub: 'Two windows. Pick by what you came for.',
      cards: [
        { k: 'May – Oct', v: 'Dry season', n: 'Best for trekking, salar (dry hexagons), city walking. Cold nights.' },
        { k: 'Nov – Apr', v: 'Wet season', n: 'Salar mirror reflection, lush altiplano, cheaper. Roads can close.' },
        { k: 'Apr – May', v: 'Sweet spot', n: 'Mirror is fading but visible · trails open · Carnaval just past' },
        { k: 'Jun 21', v: 'Aymara new year', n: 'Tiwanaku at dawn · sun ceremony · the most local thing you\'ll see' },
        { k: 'Feb', v: 'Carnaval de Oruro', n: 'UNESCO heritage. Book 6 weeks ahead. Folk dance + foam wars.' },
        { k: 'Aug', v: 'Driest, coldest', n: 'Sub-zero nights in Uyuni, perfect Milky Way, brutal mornings' },
      ],
    },
  };

  const active = sections[tab];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* HERO */}
      <section style={{ color: '#fff', padding: '80px 0 88px', position: 'relative', overflow: 'hidden' }}>
        {/* Background photo */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: IMG.photoEssentials,
          backgroundSize: 'cover', backgroundPosition: 'center',
        }}/>
        {/* Color overlay — rust/navy (essentials/practical domain) */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(20,32,53,0.85) 0%, rgba(122,40,28,0.78) 60%, rgba(13,18,30,0.92) 100%)',
        }}/>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,183,3,0.2) 0%, transparent 70%)' }}/>
        <div style={{ position: 'absolute', bottom: -150, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(179,63,46,0.18) 0%, transparent 70%)' }}/>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', position: 'relative' }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', padding: '8px 14px', borderRadius: 999, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, marginBottom: 24 }}><I.ArrowL size={13}/> Back to home</button>
          <div className="eyebrow" style={{ color: 'var(--amber-300)' }}>Travel Guide · For independent travelers</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(48px,7vw,96px)', lineHeight: 0.95, color: '#fff', margin: '12px 0 0', fontWeight: 600, letterSpacing: '-0.035em', maxWidth: 1100 }}>
            Bolivia, the<br/><em style={{ fontStyle: 'normal', fontWeight: 800, color: 'var(--amber-300)' }}>essentials.</em>
          </h1>
          <p style={{ fontSize: 19, color: 'rgba(255,255,255,0.85)', marginTop: 20, maxWidth: 640, lineHeight: 1.55 }}>
            No bookings, no commission. Just what we wish we'd known on day one — pulled together by people who actually live here.
          </p>
        </div>
      </section>

      {/* TAB NAV */}
      <section style={{ background: '#fff', borderBottom: '1px solid var(--border)', position: 'sticky', top: 64, zIndex: 20, backdropFilter: 'blur(12px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', display: 'flex', gap: 4, overflowX: 'auto' }}>
          {Object.entries(sections).map(([id, s]) => (
            <button key={id} onClick={() => setTab(id)} style={{
              padding: '20px 22px', background: 'transparent',
              border: 0, borderBottom: tab === id ? '3px solid var(--rust-500)' : '3px solid transparent',
              cursor: 'pointer', whiteSpace: 'nowrap',
              fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 700,
              color: tab === id ? 'var(--fg1)' : 'var(--fg3)',
              transition: 'all 180ms',
            }}>{s.label}</button>
          ))}
        </div>
      </section>

      {/* CONTENT */}
      {tab === 'dictionary' ? (
        <Dictionary embedded onExpert={onExpert}/>
      ) : (
      <section style={{ padding: '72px 0 100px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ maxWidth: 720, marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(32px,4vw,52px)', margin: 0, lineHeight: 1.05 }}>{active.title}</h2>
            <p style={{ fontSize: 18, color: 'var(--fg2)', marginTop: 16, lineHeight: 1.6 }}>{active.sub}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            {active.cards.map((c, i) => (
              <article key={i} style={{
                background: '#fff', borderRadius: 14,
                padding: 24, border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-xs)',
              }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.4, textTransform: 'uppercase', color: 'var(--fg3)' }}>{c.k}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 500, color: 'var(--rust-500)', marginTop: 6, lineHeight: 1.15 }}>{c.v}</div>
                <div style={{ fontSize: 13, color: 'var(--fg2)', marginTop: 10, lineHeight: 1.55, fontFamily: 'var(--font-sans)' }}>{c.n}</div>
              </article>
            ))}
          </div>

          <div style={{
            marginTop: 56, padding: 32, borderRadius: 16,
            background: 'var(--navy-700)', color: '#fff',
            display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap',
          }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--amber-500)', color: 'var(--navy-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <I.Sparkle size={26}/>
            </div>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.4, textTransform: 'uppercase', color: 'var(--amber-300)' }}>Need a person, not a page?</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginTop: 6, fontWeight: 500 }}>Book a 15- or 30-min video call with a local writer who knows your route — from $12.</div>
            </div>
            <Btn kind="amber" size="md" onClick={onExpert}>Talk to a local <I.ArrowR size={14}/></Btn>
          </div>
        </div>
      </section>
      )}
    </div>
  );
}
window.TravelGuide = TravelGuide;
