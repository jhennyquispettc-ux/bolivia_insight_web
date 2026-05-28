function TalkToExpert({ onBack }) {
  const [step, setStep] = useState(0); 
  const [duration, setDuration] = useState(30);
  const [expert, setExpert] = useState(null);
  const [slot, setSlot] = useState(null);
  const [weekStart, setWeekStart] = useState(() => {
    
    const d = new Date('2026-04-27T00:00:00');
    return d;
  });
  const [briefOpen, setBriefOpen] = useState(false);
  const [brief, setBrief] = useState({ dates: '', route: '', questions: '', location: '' });

  const experts = [
    { id: 'carla', name: 'Carla Viscarra',  city: 'La Paz',       tag: 'Altiplano · Salar · Treks',   years: 11, rating: 4.9, sessions: 312, lang: ['ES', 'EN'],       bio: 'Born in El Alto, mountain guide on Huayna Potosí for a decade. Best for: salar logistics, altitude, Cordillera Real treks, photography windows.', color: 'var(--rust-500)',  initials: 'CV' },
    { id: 'mateo', name: 'Mateo Rojas',     city: 'Copacabana',   tag: 'Titicaca · Aymara culture',    years: 8,  rating: 5.0, sessions: 187, lang: ['ES', 'EN', 'AY'], bio: 'Aymara-speaking community organizer on Isla del Sol. Best for: lake logistics, homestays, Tiwanaku, Yampupata trail, ceremonial dates.',         color: 'var(--mystic-700)', initials: 'MR' },
    { id: 'lucia', name: 'Lucía Mendoza',   city: 'Sucre',        tag: 'Colonial cities · Food · Markets', years: 6, rating: 4.8, sessions: 246, lang: ['ES', 'EN', 'PT'], bio: 'Food writer and historian. Best for: Sucre/Potosí itineraries, market routes, vegetarian-friendly Bolivia, Tarabuco textile day.',                color: 'var(--amber-600)',  initials: 'LM' },
    { id: 'dani',  name: 'Daniel Vaca',     city: 'Rurrenabaque', tag: 'Amazon · Pampas · Wildlife',   years: 9,  rating: 4.9, sessions: 142, lang: ['ES', 'EN'],       bio: 'Madidi-licensed naturalist guide. Best for: jungle vs pampas decision, gear lists, malaria zones, season pick, ethical operators.',          color: 'var(--green-500)',  initials: 'DV' },
  ];

  const price = duration === 15 ? 12 : 22;
  const priceBs = duration === 15 ? 84 : 153;

  const tz = (() => {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone; }
    catch { return 'your local time'; }
  })();

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {}
      <section style={{ background: 'linear-gradient(135deg, var(--navy-700), var(--mystic-700))', color: '#fff', padding: '80px 0 160px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,183,3,0.18) 0%, transparent 70%)' }}/>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', position: 'relative' }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', padding: '8px 14px', borderRadius: 999, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, marginBottom: 24 }}><I.ArrowL size={13}/> Back</button>
          <div className="eyebrow" style={{ color: 'var(--amber-300)' }}>Talk to a local · Video consultation</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(44px,6vw,84px)', lineHeight: 1, color: '#fff', margin: '12px 0 0', fontWeight: 600, letterSpacing: '-0.03em' }}>
            Specific question?<br/><em style={{ fontStyle: 'normal', fontWeight: 800, color: 'var(--amber-300)' }}>Ask a Bolivian.</em>
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.85)', marginTop: 18, maxWidth: 620, lineHeight: 1.55 }}>
            For when the guide and the AI run out. Book a 15- or 30-minute video call with a local writer who actually walks the routes — they answer your trip plan in plain language.
          </p>
          <div style={{ display: 'flex', gap: 24, marginTop: 32, flexWrap: 'wrap' }}>
            {[
              { k: '4',    v: 'Local experts' },
              { k: '~24h', v: 'Avg confirm time' },
              { k: '4.9',  v: 'Avg rating · 887 calls' },
            ].map(s => (
              <div key={s.k}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 500, color: 'var(--amber-300)' }}>{s.k}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', letterSpacing: 0.4, fontWeight: 600, textTransform: 'uppercase' }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {}
      <section style={{ marginTop: -100, paddingBottom: 80, position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ background: '#fff', borderRadius: 20, boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border)', overflow: 'hidden' }}>

            {}
            {step < 3 && (
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }} className="bi-stepper">
                {['Pick an expert', 'Choose duration', 'Pick a time'].map((s, i) => {
                  const disabled = (i === 1 && !expert) || (i === 2 && !expert);
                  return (
                    <button key={i} onClick={() => !disabled && setStep(i)} disabled={disabled} style={{
                      flex: 1, padding: '20px 18px',
                      background: step === i ? 'var(--stone-50)' : '#fff',
                      border: 0, borderBottom: step === i ? '3px solid var(--rust-500)' : '3px solid transparent',
                      cursor: disabled ? 'not-allowed' : 'pointer', textAlign: 'left',
                      opacity: disabled ? 0.4 : 1,
                    }}>
                      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.4, color: step >= i ? 'var(--rust-500)' : 'var(--fg3)' }}>STEP {i+1}</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: step === i ? 'var(--fg1)' : 'var(--fg2)', marginTop: 2 }}>{s}</div>
                    </button>
                  );
                })}
              </div>
            )}

            {}
            {step === 0 && (
              <div style={{ padding: 40 }}>
                <div style={{ fontSize: 14, color: 'var(--fg2)', marginBottom: 22 }}>
                  Each writes parts of this guide. Pick whoever covers your region.
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                  {experts.map(e => {
                    const selected = expert?.id === e.id;
                    return (
                      <button key={e.id} onClick={() => setExpert(e)} style={{
                        textAlign: 'left',
                        background: selected ? 'var(--stone-50)' : '#fff',
                        border: selected ? `2px solid ${e.color}` : '2px solid var(--border)',
                        borderRadius: 14, padding: 20, cursor: 'pointer',
                        transition: 'all 160ms',
                      }}>
                        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                          <div style={{ width: 56, height: 56, borderRadius: 14, background: e.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, flexShrink: 0 }}>{e.initials}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 500, lineHeight: 1.1 }}>{e.name}</div>
                            <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--fg3)', marginTop: 4, letterSpacing: 0.3 }}>{e.city.toUpperCase()} · {e.years} YRS</div>
                          </div>
                          {selected && <div style={{ width: 24, height: 24, borderRadius: '50%', background: e.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><I.Check size={13}/></div>}
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--fg2)', marginTop: 14, lineHeight: 1.55 }}>{e.bio}</div>
                        <div style={{ display: 'flex', gap: 14, marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--fg3)', alignItems: 'center', flexWrap: 'wrap' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--amber-600)' }}><I.Star size={13}/><strong>{e.rating}</strong></span>
                          <span>{e.sessions} calls</span>
                          <span style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>{e.lang.map(l => <span key={l} style={{ padding: '2px 7px', background: 'var(--stone-100)', borderRadius: 4, fontWeight: 700, fontSize: 10, letterSpacing: 0.4 }}>{l}</span>)}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {}
            {step === 1 && expert && (
              <div style={{ padding: 40 }}>
                <SelectedExpertBar expert={expert} onChange={() => setStep(0)}/>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                  {[
                    { mins: 15, usd: 12, bs: 84,  label: 'Quick question', desc: 'One topic, sharp answer. Best when you already know what you want to ask.' },
                    { mins: 30, usd: 22, bs: 153, label: 'Trip review',     desc: 'Walk through your full plan. They\'ll catch mistakes and add local stops.' },
                  ].map(o => {
                    const selected = duration === o.mins;
                    return (
                      <button key={o.mins} onClick={() => setDuration(o.mins)} style={{
                        textAlign: 'left',
                        background: selected ? 'var(--stone-50)' : '#fff',
                        border: selected ? '2px solid var(--rust-500)' : '2px solid var(--border)',
                        borderRadius: 14, padding: 24, cursor: 'pointer', position: 'relative',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                          <div style={{ fontFamily: 'var(--font-display)', fontSize: 56, fontWeight: 500, color: selected ? 'var(--rust-500)' : 'var(--fg1)', lineHeight: 1 }}>{o.mins}</div>
                          <div style={{ fontSize: 14, color: 'var(--fg3)', fontWeight: 700 }}>min</div>
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 700, marginTop: 8 }}>{o.label}</div>
                        <div style={{ fontSize: 13, color: 'var(--fg2)', marginTop: 6, lineHeight: 1.55 }}>{o.desc}</div>
                        <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'baseline', gap: 8 }}>
                          <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 500, color: 'var(--rust-500)' }}>${o.usd}</div>
                          <div style={{ fontSize: 12, color: 'var(--fg3)', fontFamily: 'var(--font-mono)' }}>≈ Bs {o.bs}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div style={{ marginTop: 22, padding: 16, background: 'var(--amber-50, #fff8e7)', border: '1px solid var(--amber-200, #ffe7a8)', borderRadius: 10, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <I.Sparkle size={18}/>
                  <div style={{ fontSize: 13, color: 'var(--fg2)', lineHeight: 1.55 }}>
                    <strong style={{ color: 'var(--fg1)' }}>Send your trip notes ahead.</strong> Once you book, you'll get a form to share dates, route, and what you're stuck on — so the call gets straight to the answers.
                  </div>
                </div>
              </div>
            )}

            {}
            {step === 2 && expert && (
              <div style={{ padding: 40 }}>
                <SelectedExpertBar expert={expert} onChange={() => setStep(0)}/>
                <CalendarPicker
                  expert={expert}
                  weekStart={weekStart}
                  setWeekStart={setWeekStart}
                  slot={slot}
                  setSlot={setSlot}
                  tz={tz}
                />
              </div>
            )}

            {}
            {step === 3 && expert && slot && (
              <Confirmation
                expert={expert}
                slot={slot}
                duration={duration}
                price={price}
                priceBs={priceBs}
                briefOpen={briefOpen}
                setBriefOpen={setBriefOpen}
                brief={brief}
                setBrief={setBrief}
                onClose={onBack}
              />
            )}

            {}
            {step < 3 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 32px', borderTop: '1px solid var(--border)', background: 'var(--stone-25)', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--fg3)' }}>
                  <I.Shield size={14}/>
                  <span>Secure checkout · Stripe · Refundable up to 12h before</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  {step > 0 && (
                    <div style={{ fontSize: 13, color: 'var(--fg2)' }}>
                      {expert && <span><strong style={{ color: 'var(--fg1)' }}>{expert.name.split(' ')[0]}</strong> · {duration} min</span>}
                      {step === 2 && <span> · <strong style={{ color: 'var(--rust-500)', fontFamily: 'var(--font-display)', fontSize: 16 }}>${price}</strong></span>}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 10 }}>
                    {step > 0 && <Btn kind="ghost" size="md" onClick={() => setStep(step - 1)}>Back</Btn>}
                    {step < 2 && (
                      <Btn kind="primary" size="md"
                        onClick={() => setStep(step + 1)}
                        style={{ opacity: (step === 0 && !expert) ? 0.4 : 1, pointerEvents: (step === 0 && !expert) ? 'none' : 'auto' }}>
                        Continue <I.ArrowR size={14}/>
                      </Btn>
                    )}
                    {step === 2 && (
                      <Btn kind="primary" size="md"
                        onClick={() => window.location.hash = '#booking'}
                        style={{ opacity: !slot ? 0.4 : 1, pointerEvents: !slot ? 'none' : 'auto' }}>
                        Book Session <I.ArrowR size={14}/>
                      </Btn>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {}
          {step < 3 && (
            <div style={{ marginTop: 56 }}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>How it works</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
                {[
                  { n: '01', t: 'Pick & pay',     d: 'Choose an expert, duration, and slot. Pay by card. You get a confirmation + brief form.' },
                  { n: '02', t: 'Send your plan', d: 'Fill out a 2-min brief: dates, rough route, your top 3 questions. They review before the call.' },
                  { n: '03', t: 'Hop on the call', d: 'Google Meet link arrives 1h before. Bring questions. Get a written summary by email after.' },
                ].map(s => (
                  <div key={s.n} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--rust-500)', fontWeight: 700, letterSpacing: 0.4 }}>STEP {s.n}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginTop: 8, fontWeight: 500 }}>{s.t}</div>
                    <div style={{ fontSize: 13, color: 'var(--fg2)', marginTop: 8, lineHeight: 1.6 }}>{s.d}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <style>{`
        @media (max-width: 720px) {
          .bi-stepper { flex-direction: column; }
          .bi-stepper button { border-bottom: 1px solid var(--border) !important; border-left: 3px solid transparent !important; }
        }
      `}</style>
    </div>
  );
}

function SelectedExpertBar({ expert, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, padding: '12px 16px', background: 'var(--stone-50)', borderRadius: 10, flexWrap: 'wrap' }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: expert.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13 }}>{expert.initials}</div>
      <div style={{ flex: 1, minWidth: 200 }}><strong>{expert.name}</strong> · {expert.tag}</div>
      <button onClick={onChange} style={{ background: 'transparent', border: 0, color: 'var(--rust-500)', fontWeight: 700, fontSize: 13, cursor: 'pointer', padding: '6px 8px' }}>Change</button>
    </div>
  );
}

function CalendarPicker({ expert, weekStart, setWeekStart, slot, setSlot, tz }) {
  
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    days.push(d);
  }

  
  const slotsForDay = (date) => {
    const key = date.toISOString().slice(0, 10);
    const seed = (key + expert.id).split('').reduce((s, c) => s + c.charCodeAt(0), 0);
    const candidates = ['09:00', '10:30', '14:00', '15:30', '17:00'];
    return candidates.filter((_, i) => (seed + i * 13) % 5 !== 0);
  };

  const fmtMonthDay = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const fmtDayShort = (d) => d.toLocaleDateString('en-US', { weekday: 'short' });
  const rangeLabel = `${fmtMonthDay(days[0])} – ${fmtMonthDay(days[6])}`;

  const shiftWeek = (delta) => {
    const next = new Date(weekStart);
    next.setDate(weekStart.getDate() + delta * 7);
    setWeekStart(next);
  };

  const today = new Date('2026-04-29');
  const isPast = (d) => d < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const isToday = (d) => d.toDateString() === today.toDateString();

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, gap: 12, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 500 }}>{rangeLabel}, {days[0].getFullYear()}</div>
          <div style={{ fontSize: 12, color: 'var(--fg3)', marginTop: 2 }}>
            All times Bolivia (UTC −4) · Your timezone: <span style={{ fontFamily: 'var(--font-mono)' }}>{tz}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => shiftWeek(-1)} aria-label="Previous week" style={navBtnStyle}><I.ChevronL size={16}/></button>
          <button onClick={() => setWeekStart(new Date('2026-04-27T00:00:00'))} style={{ ...navBtnStyle, width: 'auto', padding: '0 16px', fontSize: 13, fontWeight: 700 }}>Today</button>
          <button onClick={() => shiftWeek(1)} aria-label="Next week" style={navBtnStyle}><I.ChevronR size={16}/></button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: 8 }} className="bi-calendar">
        {days.map(d => {
          const slots = slotsForDay(d);
          const past = isPast(d);
          return (
            <div key={d.toISOString()} style={{
              background: past ? 'var(--stone-25)' : '#fff',
              border: '1px solid var(--border)', borderRadius: 12,
              padding: 12, opacity: past ? 0.5 : 1,
              minHeight: 220,
              display: 'flex', flexDirection: 'column', gap: 6,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.4, textTransform: 'uppercase', color: isToday(d) ? 'var(--rust-500)' : 'var(--fg3)' }}>{fmtDayShort(d)}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 500, color: 'var(--fg1)', marginTop: 2 }}>{d.getDate()}</div>
                </div>
                {isToday(d) && <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 0.3, color: 'var(--rust-500)', textTransform: 'uppercase' }}>Today</span>}
              </div>
              {slots.length === 0 && !past && (
                <div style={{ fontSize: 11, color: 'var(--fg3)', padding: '8px 4px', fontStyle: 'italic' }}>None</div>
              )}
              {slots.map(time => {
                const selected = slot && slot.dateISO === d.toISOString().slice(0,10) && slot.time === time;
                return (
                  <button key={time} onClick={() => !past && setSlot({ dateISO: d.toISOString().slice(0,10), date: d, time })}
                    disabled={past}
                    aria-pressed={selected}
                    style={{
                      padding: '10px 8px', borderRadius: 8,
                      background: selected ? 'var(--rust-500)' : 'var(--stone-50)',
                      color: selected ? '#fff' : 'var(--fg1)',
                      border: selected ? '1px solid var(--rust-500)' : '1px solid var(--border)',
                      fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, letterSpacing: 0.3,
                      cursor: past ? 'not-allowed' : 'pointer',
                      transition: 'all 140ms', textAlign: 'center', minHeight: 36,
                    }}>{time}</button>
                );
              })}
            </div>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 880px) {
          .bi-calendar { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
        }
        @media (max-width: 520px) {
          .bi-calendar { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        }
      `}</style>
    </>
  );
}

const navBtnStyle = {
  width: 36, height: 36, borderRadius: 10,
  background: '#fff', border: '1px solid var(--border)',
  color: 'var(--fg1)', cursor: 'pointer',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  transition: 'all 140ms',
};

function Confirmation({ expert, slot, duration, price, priceBs, briefOpen, setBriefOpen, brief, setBrief, onClose }) {
  const fmtFullDate = slot.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const downloadIcs = () => {
    const start = new Date(slot.date);
    const [h, m] = slot.time.split(':').map(Number);
    start.setHours(h - (-4), m, 0, 0); 
    const end = new Date(start.getTime() + duration * 60 * 1000);
    const fmt = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Bolivia Insight//EN',
      'BEGIN:VEVENT',
      `UID:${Date.now()}@boliviainsight.com`,
      `DTSTAMP:${fmt(new Date())}`,
      `DTSTART:${fmt(start)}`,
      `DTEND:${fmt(end)}`,
      `SUMMARY:Bolivia Insight call · ${expert.name}`,
      `DESCRIPTION:${duration}-min video consultation. Google Meet link arrives 1h before.`,
      'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'bolivia-insight-call.ics'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: 0 }}>
      {}
      <div style={{
        background: 'linear-gradient(135deg, var(--green-500) 0%, #1f5f3e 100%)',
        color: '#fff', padding: '40px 40px 36px', textAlign: 'center',
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.18)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
        }}><I.Check size={32}/></div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,40px)', margin: 0, fontWeight: 600, letterSpacing: '-0.02em' }}>
          You're booked with {expert.name.split(' ')[0]}.
        </h2>
        <p style={{ marginTop: 10, fontSize: 14, color: 'rgba(255,255,255,0.85)' }}>
          Confirmation sent to your email. We'll notify {expert.name.split(' ')[0]} now.
        </p>
      </div>

      {}
      <div style={{ padding: 32 }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 18,
          padding: '20px 22px', background: 'var(--stone-25)', border: '1px solid var(--border)',
          borderRadius: 14, alignItems: 'center',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14, background: expert.color, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18,
          }}>{expert.initials}</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 500, lineHeight: 1.2 }}>{fmtFullDate}</div>
            <div style={{ fontSize: 14, color: 'var(--fg2)', marginTop: 4 }}>
              <strong>{slot.time}</strong> Bolivia time · {duration} min · ${price} <span style={{ color: 'var(--fg3)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>≈ Bs {priceBs}</span>
            </div>
          </div>
        </div>

        {}
        <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
          <Btn kind="primary" size="md" onClick={downloadIcs}>
            <I.Calendar size={14}/> Add to calendar
          </Btn>
          <Btn kind="ghost" size="md" onClick={() => setBriefOpen(true)}>
            <I.Sparkle size={14}/> Send brief now
          </Btn>
        </div>

        {}
        <div style={{
          marginTop: 22, padding: '14px 18px',
          background: 'var(--amber-50, #fff8e7)', border: '1px solid var(--amber-200, #ffe7a8)', borderRadius: 12,
          display: 'flex', gap: 12, alignItems: 'flex-start',
        }}>
          <I.Sparkle size={18}/>
          <div style={{ fontSize: 13, color: 'var(--fg2)', lineHeight: 1.55 }}>
            <strong style={{ color: 'var(--fg1)' }}>You'll get a Google Meet link one hour before the call.</strong> If you sent the brief, {expert.name.split(' ')[0]} will have read it before joining.
          </div>
        </div>

        {}
        <details open={briefOpen} style={{
          marginTop: 22, background: '#fff',
          border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden',
        }}>
          <summary onClick={(e) => { e.preventDefault(); setBriefOpen(!briefOpen); }} style={{
            padding: '18px 22px', cursor: 'pointer', listStyle: 'none',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
            background: briefOpen ? 'var(--stone-50)' : '#fff',
            borderBottom: briefOpen ? '1px solid var(--border)' : 0,
          }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 500 }}>2-minute trip brief</div>
              <div style={{ fontSize: 12, color: 'var(--fg3)', marginTop: 4 }}>Optional. Helps the call go straight to answers.</div>
            </div>
            {briefOpen ? <I.X size={18}/> : <I.ArrowR size={18}/>}
          </summary>
          <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <BriefField label="Travel dates"           hint="e.g. May 12 – May 28"                    value={brief.dates}     onChange={v => setBrief({ ...brief, dates: v })}/>
            <BriefField label="Rough route"            hint="La Paz → Uyuni → Sucre → Santa Cruz"      value={brief.route}     onChange={v => setBrief({ ...brief, route: v })} multiline/>
            <BriefField label="Top 3 questions"        hint="One per line — what you really want answered." value={brief.questions} onChange={v => setBrief({ ...brief, questions: v })} multiline/>
            <BriefField label="Where you are now"      hint="So they know your timezone and connection."   value={brief.location} onChange={v => setBrief({ ...brief, location: v })}/>
            <Btn kind="navy" size="md" style={{ alignSelf: 'flex-start', marginTop: 4 }} onClick={() => setBriefOpen(false)}>
              Save brief
            </Btn>
          </div>
        </details>

        {}
        <div style={{
          marginTop: 22, paddingTop: 22, borderTop: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap',
        }}>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--fg3)', fontFamily: 'var(--font-mono)', letterSpacing: 0.3 }}>
            CANCEL UP TO 12H BEFORE FOR A FULL REFUND · STRIPE RECEIPT IN EMAIL
          </p>
          <button onClick={onClose} style={{
            background: 'transparent', border: 0, cursor: 'pointer',
            color: 'var(--rust-500)', fontWeight: 700, fontSize: 13,
            display: 'inline-flex', alignItems: 'center', gap: 4,
          }}>Back to home <I.ArrowR size={14}/></button>
        </div>
      </div>
    </div>
  );
}

function BriefField({ label, hint, value, onChange, multiline }) {
  const Tag = multiline ? 'textarea' : 'input';
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.3, textTransform: 'uppercase', color: 'var(--fg3)' }}>{label}</span>
      <Tag value={value} onChange={e => onChange(e.target.value)} placeholder={hint}
        rows={multiline ? 3 : undefined}
        style={{
          fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--fg1)',
          padding: '10px 14px', borderRadius: 10,
          border: '1px solid var(--border-strong)', background: '#fff', outline: 'none',
          minHeight: 44, resize: multiline ? 'vertical' : 'none',
        }}/>
    </label>
  );
}

window.TalkToExpert = TalkToExpert;
