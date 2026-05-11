const { useState } = React;

function BookingPage({ onBack, onProfile, user }) {
  const [step, setStep] = useState(0); // 0: duration, 1: calendar, 2: confirmation
  const [duration, setDuration] = useState(30);
  const [slot, setSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [unavailable, setUnavailable] = React.useState([]);

  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    // Find the Monday of this week
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  });

  React.useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const token = localStorage.getItem('bolivia_insight_token');
        const res = await fetch('http://localhost:3000/bookings/availability', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const data = await res.json();
          // Map to local date string 'YYYY-MM-DD' since prisma returns UTC ISO string
          const mapped = data.map(b => ({
            dateISO: b.date.substring(0, 10),
            timeSlot: b.timeSlot
          }));
          setUnavailable(mapped);
        }
      } catch (e) {
        console.error('Failed to fetch availability', e);
      }
    };
    fetchAvailability();
  }, []);
  const [briefOpen, setBriefOpen] = useState(false);
  const [brief, setBrief] = useState({ dates: '', route: '', questions: '', location: '' });

  const price = duration === 15 ? 12 : 22;
  const priceBs = duration === 15 ? 84 : 153;

  const tz = (() => {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone; }
    catch { return 'your local time'; }
  })();

  const defaultExpert = { id: 'default', name: 'Local Guide', initials: 'BI', color: 'var(--rust-500)' };

  const handleBook = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('bolivia_insight_token');
      const googleAccessToken = localStorage.getItem('google_access_token') || 'placeholder';

      const res = await fetch('http://localhost:3000/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          date: slot.dateISO,
          timeSlot: slot.time,
          topic: `${duration}-min Trip Review`,
          notes: '',
          googleAccessToken
        })
      });

      if (!res.ok) throw new Error('Failed to book session');
      
      setStep(2); // Success step
    } catch (err) {
      setError('Could not complete booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* HERO */}
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
        </div>
      </section>

      {/* MAIN CARD */}
      <section style={{ marginTop: -100, paddingBottom: 80, position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ background: '#fff', borderRadius: 20, boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border)', overflow: 'hidden' }}>

            {/* Stepper — hidden on confirmation */}
            {step < 2 && (
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }} className="bi-stepper">
                {['Choose duration', 'Pick a time'].map((s, i) => {
                  return (
                    <button key={i} onClick={() => setStep(i)} style={{
                      flex: 1, padding: '20px 18px',
                      background: step === i ? 'var(--stone-50)' : '#fff',
                      border: 0, borderBottom: step === i ? '3px solid var(--rust-500)' : '3px solid transparent',
                      cursor: 'pointer', textAlign: 'left',
                    }}>
                      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.4, color: step >= i ? 'var(--rust-500)' : 'var(--fg3)' }}>STEP {i+1}</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: step === i ? 'var(--fg1)' : 'var(--fg2)', marginTop: 2 }}>{s}</div>
                    </button>
                  );
                })}
              </div>
            )}

            {error && (
              <div style={{ background: 'var(--rust-50)', color: 'var(--rust-700)', padding: 16, borderBottom: '1px solid var(--rust-200)', fontSize: 14 }}>
                {error}
              </div>
            )}

            {/* Step 0 — duration */}
            {step === 0 && (
              <div style={{ padding: 40 }}>
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

            {/* Step 1 — calendar */}
            {step === 1 && (
              <div style={{ padding: 40 }}>
                <CalendarPicker
                  expert={defaultExpert}
                  weekStart={weekStart}
                  setWeekStart={setWeekStart}
                  slot={slot}
                  setSlot={setSlot}
                  tz={tz}
                  unavailable={unavailable}
                />
              </div>
            )}

            {/* Step 2 — confirmation */}
            {step === 2 && slot && (
              <Confirmation
                expert={defaultExpert}
                slot={slot}
                duration={duration}
                price={price}
                priceBs={priceBs}
                briefOpen={briefOpen}
                setBriefOpen={setBriefOpen}
                brief={brief}
                setBrief={setBrief}
                onProfile={onProfile}
              />
            )}

            {/* Footer bar — hidden on confirmation */}
            {step < 2 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 32px', borderTop: '1px solid var(--border)', background: 'var(--stone-25)', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--fg3)' }}>
                  <I.Shield size={14}/>
                  <span>Secure checkout · Stripe · Refundable up to 12h before</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  {step > 0 && (
                    <div style={{ fontSize: 13, color: 'var(--fg2)' }}>
                      {<span>{duration} min</span>}
                      {step === 1 && <span> · <strong style={{ color: 'var(--rust-500)', fontFamily: 'var(--font-display)', fontSize: 16 }}>${price}</strong></span>}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 10 }}>
                    {step > 0 && <Btn kind="ghost" size="md" onClick={() => setStep(step - 1)}>Back</Btn>}
                    {step < 1 && (
                      <Btn kind="primary" size="md" onClick={() => setStep(step + 1)}>
                        Continue <I.ArrowR size={14}/>
                      </Btn>
                    )}
                    {step === 1 && (
                      <Btn kind="primary" size="md"
                        onClick={handleBook}
                        style={{ opacity: (!slot || loading) ? 0.4 : 1, pointerEvents: (!slot || loading) ? 'none' : 'auto' }}>
                        {loading ? 'Booking...' : `Pay $${price} & confirm`} {!loading && <I.ArrowR size={14}/>}
                      </Btn>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* FAQ strip — hide on confirmation */}
          {step < 2 && (
            <div style={{ marginTop: 56 }}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>How it works</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
                {[
                  { n: '01', t: 'Pick & pay',     d: 'Choose a duration and slot. Pay by card. You get a confirmation + brief form.' },
                  { n: '02', t: 'Send your plan', d: 'Fill out a 2-min brief: dates, rough route, your top 3 questions. We review before the call.' },
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

/* ======================== Calendar ======================== */
function CalendarPicker({ expert, weekStart, setWeekStart, slot, setSlot, tz, unavailable }) {
  // Build 7 days starting at weekStart
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    days.push(d);
  }

  // Real availability checking
  const slotsForDay = (date) => {
    const key = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
    let candidates = ['09:00', '10:30', '14:00', '15:30', '17:00'];
    
    // Filter out already booked slots
    candidates = candidates.filter(time => !unavailable.some(u => u.dateISO === key && u.timeSlot === time));
    
    // Filter out past times if it's today
    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      candidates = candidates.filter(time => {
        const [h, m] = time.split(':').map(Number);
        if (h > currentHour) return true;
        if (h === currentHour && m > currentMinute) return true;
        return false;
      });
    }
    
    return candidates;
  };

  const fmtMonthDay = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const fmtDayShort = (d) => d.toLocaleDateString('en-US', { weekday: 'short' });
  const rangeLabel = `${fmtMonthDay(days[0])} – ${fmtMonthDay(days[6])}`;

  const shiftWeek = (delta) => {
    const next = new Date(weekStart);
    next.setDate(weekStart.getDate() + delta * 7);
    setWeekStart(next);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
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
          <button onClick={() => {
            const d = new Date();
            d.setHours(0, 0, 0, 0);
            const day = d.getDay();
            const diff = d.getDate() - day + (day === 0 ? -6 : 1);
            setWeekStart(new Date(d.setDate(diff)));
          }} style={{ ...navBtnStyle, width: 'auto', padding: '0 16px', fontSize: 13, fontWeight: 700 }}>Today</button>
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
                const dKey = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
                const selected = slot && slot.dateISO === dKey && slot.time === time;
                
                // Convert to user's local time for display
                const [h, min] = time.split(':');
                const localD = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), Number(h) + 4, Number(min)));
                const localTimeStr = localD.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                const boliviaMidnightUTC = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
                const localMidnightUTC = Date.UTC(localD.getFullYear(), localD.getMonth(), localD.getDate());
                const diffDays = Math.round((localMidnightUTC - boliviaMidnightUTC) / 86400000);
                const dayShift = diffDays > 0 ? ' (+1d)' : diffDays < 0 ? ' (-1d)' : '';
                
                return (
                  <button key={time} onClick={() => !past && setSlot({ dateISO: dKey, date: d, time })}
                    disabled={past}
                    aria-pressed={selected}
                    title={`${time} in Bolivia`}
                    style={{
                      padding: '10px 8px', borderRadius: 8,
                      background: selected ? 'var(--rust-500)' : 'var(--stone-50)',
                      color: selected ? '#fff' : 'var(--fg1)',
                      border: selected ? '1px solid var(--rust-500)' : '1px solid var(--border)',
                      fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, letterSpacing: 0.3,
                      cursor: past ? 'not-allowed' : 'pointer',
                      transition: 'all 140ms', textAlign: 'center', minHeight: 44, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <span>{localTimeStr}{dayShift && <span style={{ fontSize: 10, color: selected ? 'rgba(255,255,255,0.7)' : 'var(--fg3)', marginLeft: 2 }}>{dayShift}</span>}</span>
                    </button>
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

/* ======================== Confirmation ======================== */
function Confirmation({ expert, slot, duration, price, priceBs, briefOpen, setBriefOpen, brief, setBrief, onProfile }) {
  const localD = new Date(Date.UTC(slot.date.getFullYear(), slot.date.getMonth(), slot.date.getDate(), Number(slot.time.split(':')[0]) + 4, Number(slot.time.split(':')[1])));
  const fmtFullDate = localD.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const fmtTime = localD.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{ padding: 0 }}>
      {/* Success header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--green-500) 0%, #1f5f3e 100%)',
        color: '#fff', padding: '40px 40px 36px', textAlign: 'center',
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.18)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
        }}><I.Check size={32}/></div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,40px)', margin: 0, fontWeight: 600, letterSpacing: '-0.02em' }}>
          Session Confirmed!
        </h2>
        <p style={{ marginTop: 10, fontSize: 14, color: 'rgba(255,255,255,0.85)' }}>
          We've added it to your Google Calendar and sent a confirmation email.
        </p>
      </div>

      {/* Booking summary */}
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
              <strong>{fmtTime}</strong> (Your local time) · {duration} min
            </div>
            <div style={{ fontSize: 13, color: 'var(--fg3)', marginTop: 2 }}>
              Original: {slot.time} (Bolivia Time) · ${price} <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>≈ Bs {priceBs}</span>
            </div>
          </div>
        </div>

        {/* Primary actions */}
        <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
          <Btn kind="primary" size="md" onClick={onProfile}>
             Go to My Profile <I.ArrowR size={14}/>
          </Btn>
          <Btn kind="ghost" size="md" onClick={() => setBriefOpen(true)}>
            <I.Sparkle size={14}/> Send brief now
          </Btn>
        </div>

        {/* Meet info */}
        <div style={{
          marginTop: 22, padding: '14px 18px',
          background: 'var(--amber-50, #fff8e7)', border: '1px solid var(--amber-200, #ffe7a8)', borderRadius: 12,
          display: 'flex', gap: 12, alignItems: 'flex-start',
        }}>
          <I.Sparkle size={18}/>
          <div style={{ fontSize: 13, color: 'var(--fg2)', lineHeight: 1.55 }}>
            <strong style={{ color: 'var(--fg1)' }}>You'll get a Google Meet link one hour before the call.</strong> We recommend sending your brief beforehand so we can prepare answers.
          </div>
        </div>

        {/* Brief form (collapsible) */}
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
            <BriefField label="Where you are now"      hint="So we know your timezone and connection."   value={brief.location} onChange={v => setBrief({ ...brief, location: v })}/>
            <Btn kind="navy" size="md" style={{ alignSelf: 'flex-start', marginTop: 4 }} onClick={() => setBriefOpen(false)}>
              Save brief
            </Btn>
          </div>
        </details>
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

window.BookingPage = BookingPage;
