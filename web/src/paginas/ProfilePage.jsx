import React from 'react';
import I from '../ui/iconos.jsx';

function ProfilePage({ onBack, user }) {
  const [bookings, setBookings] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('bolivia_insight_token');
        const res = await fetch('http://localhost:3000/bookings/mine', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setBookings(data);
        }
      } catch (err) {
        console.error('Failed to fetch bookings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 80 }}>
      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, var(--navy-700), var(--mystic-700))', color: '#fff', padding: '80px 0 160px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,183,3,0.18) 0%, transparent 70%)' }}/>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 32px', position: 'relative', display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
          
          <div style={{ flex: 1, minWidth: 300 }}>
            <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', padding: '8px 14px', borderRadius: 999, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, marginBottom: 24 }}><I.ArrowL size={13}/> Back</button>
            <div className="eyebrow" style={{ color: 'var(--amber-300)' }}>Client Portal</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px,5vw,56px)', lineHeight: 1.1, color: '#fff', margin: '12px 0 0', fontWeight: 600, letterSpacing: '-0.02em' }}>
              Welcome back,<br/><em style={{ fontStyle: 'normal', fontWeight: 800, color: 'var(--amber-300)' }}>{user?.name?.split(' ')[0] || 'Traveler'}.</em>
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16 }}>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-mono)' }}>{user?.email}</span>
            </div>
          </div>
          
          <div style={{ position: 'relative' }}>
            <img src={user?.picture || 'https://via.placeholder.com/150'} alt="Profile" style={{ width: 120, height: 120, borderRadius: '50%', border: '4px solid rgba(255,255,255,0.2)', boxShadow: '0 12px 40px rgba(0,0,0,0.3)' }}/>
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRadius: '50%', background: 'var(--green-500)', border: '3px solid var(--navy-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <I.Check size={16}/>
            </div>
          </div>

        </div>
      </section>

      {/* MAIN CARD */}
      <section style={{ marginTop: -100, position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ background: '#fff', borderRadius: 20, boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border)', overflow: 'hidden', padding: 40 }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 20, marginBottom: 32 }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, margin: '0 0 4px', color: 'var(--navy-700)' }}>My Sessions</h2>
                <div style={{ fontSize: 13, color: 'var(--fg3)' }}>Upcoming and past expert consultations</div>
              </div>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--stone-50)', color: 'var(--fg2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <I.Calendar size={24}/>
              </div>
            </div>

            {loading ? (
              <div style={{ padding: 60, textAlign: 'center', color: 'var(--fg3)', fontSize: 14 }}>
                <I.Activity size={32} style={{ opacity: 0.5, marginBottom: 12 }} />
                <div>Loading your itinerary...</div>
              </div>
            ) : bookings.length === 0 ? (
              <div style={{ background: 'var(--stone-25)', borderRadius: 16, border: '1px dashed var(--border)', padding: '60px 40px', textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#fff', color: 'var(--fg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: 'var(--shadow-sm)' }}>
                  <I.Route size={32}/>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, margin: '0 0 10px', color: 'var(--fg1)' }}>No trips planned yet</h3>
                <p style={{ fontSize: 14, color: 'var(--fg2)', margin: '0 auto 24px', maxWidth: 400, lineHeight: 1.5 }}>
                  Book a 1-on-1 session with a local expert to start designing your perfect Bolivia itinerary.
                </p>
                <button onClick={() => window.location.hash = '#booking'} style={{
                  background: 'var(--navy-600)', color: '#fff', padding: '12px 24px', borderRadius: 999,
                  border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8
                }}>
                  Book a Session <I.ArrowR size={16}/>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {bookings.map(b => {
                  const dateStr = b.date.substring(0, 10);
                  const [y, m, dNum] = dateStr.split('-');
                  const [h, min] = b.timeSlot.split(':');
                  // Bolivia is UTC-4. Time in UTC = Bolivia time + 4 hours.
                  const localDateObj = new Date(Date.UTC(Number(y), Number(m)-1, Number(dNum), Number(h) + 4, Number(min)));
                  const isConfirmed = b.status === 'confirmed';
                  
                  return (
                    <article key={b.id} style={{ 
                      background: '#fff', borderRadius: 16, border: '1px solid var(--border)', 
                      padding: 24, display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap',
                      boxShadow: 'var(--shadow-sm)', transition: 'transform 0.2s, box-shadow 0.2s'
                    }}>
                      {/* Date Block */}
                      <div style={{ 
                        background: isConfirmed ? 'var(--navy-50)' : 'var(--stone-50)', 
                        color: isConfirmed ? 'var(--navy-700)' : 'var(--fg3)', 
                        padding: '16px', borderRadius: 14, textAlign: 'center', minWidth: 90, flexShrink: 0
                      }}>
                        <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>{localDateObj.toLocaleDateString('en-US', { month: 'short' })}</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 600, lineHeight: 1 }}>{localDateObj.getDate()}</div>
                      </div>
                      
                      {/* Details */}
                      <div style={{ flex: 1, minWidth: 240 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 18, margin: 0, color: 'var(--fg1)' }}>{b.topic}</h4>
                          <span style={{ 
                            fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5,
                            background: isConfirmed ? 'var(--green-100)' : 'var(--stone-100)', 
                            color: isConfirmed ? 'var(--green-700)' : 'var(--fg3)', 
                            padding: '4px 8px', borderRadius: 6 
                          }}>
                            {b.status}
                          </span>
                        </div>
                        <div style={{ fontSize: 14, color: 'var(--fg2)', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500 }}>
                          <I.Clock size={16}/> {localDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (Your time)
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--fg3)', marginTop: 4 }}>
                          Original: {b.timeSlot} (Bolivia Time)
                        </div>
                      </div>

                      {/* Action */}
                      {b.calendarLink && (
                        <div style={{ flexShrink: 0 }}>
                          <a href={b.calendarLink} target="_blank" rel="noreferrer" style={{ 
                            display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, 
                            color: 'var(--navy-600)', textDecoration: 'none', background: '#fff', 
                            border: '1px solid var(--border)', padding: '10px 16px', borderRadius: 999,
                            transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                          }}>
                            <I.Video size={15}/> Join Google Meet
                          </a>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}

          </div>
        </div>
      </section>
    </div>
  );
}

export default ProfilePage;
