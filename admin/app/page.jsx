'use client';

import { useEffect, useMemo, useState } from 'react';
import MeetingCard from '@/components/MeetingCard';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
const TOKEN_KEY = 'bi_admin_token';

// Meeting instant in Bolivia time (UTC−4), from UTC-midnight date + "HH:MM" slot.
function slotInstant(meeting) {
  const ymd = (meeting.date || '').substring(0, 10);
  const [y, m, d] = ymd.split('-').map(Number);
  const [h, min] = (meeting.timeSlot || '00:00').split(':').map(Number);
  return Date.UTC(y, m - 1, d, h + 4, min);
}

export default function AdminPage() {
  const [phase, setPhase] = useState('loading'); // loading | login | denied | dashboard
  const [token, setToken] = useState(null);
  const [adminEmail, setAdminEmail] = useState('');
  const [meetings, setMeetings] = useState([]);
  const [tab, setTab] = useState('upcoming'); // upcoming | past | all
  const [error, setError] = useState('');
  const [loadingMeetings, setLoadingMeetings] = useState(false);

  // On mount: if we already have a token, verify it's an admin.
  useEffect(() => {
    const t = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
    if (!t) { setPhase('login'); return; }
    setToken(t);
    verifyAdmin(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function verifyAdmin(t) {
    try {
      const res = await fetch(`${API}/admin/check`, { headers: { Authorization: `Bearer ${t}` } });
      if (res.status === 403) { setPhase('denied'); return; }
      if (!res.ok) { localStorage.removeItem(TOKEN_KEY); setPhase('login'); return; }
      const data = await res.json();
      setAdminEmail(data.email || '');
      setPhase('dashboard');
      loadMeetings(t);
    } catch {
      setPhase('login');
      setError('No se pudo conectar con el servidor. ¿Está el backend encendido?');
    }
  }

  async function loadMeetings(t) {
    setLoadingMeetings(true);
    try {
      const res = await fetch(`${API}/admin/meetings`, { headers: { Authorization: `Bearer ${t}` } });
      if (!res.ok) throw new Error('No se pudieron cargar los meetings');
      setMeetings(await res.json());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoadingMeetings(false);
    }
  }

  function handleGoogleLogin() {
    setError('');
    if (typeof window === 'undefined' || !window.google?.accounts?.oauth2) {
      setError('El SDK de Google aún no carga. Espera un segundo e intenta de nuevo.');
      return;
    }
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'email profile',
      callback: async (response) => {
        if (response.error) { setError('Error en el login de Google: ' + response.error); return; }
        try {
          const res = await fetch(`${API}/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accessToken: response.access_token }),
          });
          if (!res.ok) throw new Error('Fallo en la autenticación del servidor');
          const data = await res.json();
          localStorage.setItem(TOKEN_KEY, data.accessToken);
          setToken(data.accessToken);
          verifyAdmin(data.accessToken);
        } catch (e) {
          setError(e.message || 'No se pudo iniciar sesión.');
        }
      },
    });
    client.requestAccessToken();
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setAdminEmail('');
    setMeetings([]);
    setPhase('login');
  }

  // Split meetings by upcoming/past for tab counts.
  const { upcoming, past } = useMemo(() => {
    const now = Date.now();
    const up = [], pa = [];
    for (const m of meetings) (slotInstant(m) >= now ? up : pa).push(m);
    // upcoming: soonest first; past: most recent first
    up.sort((a, b) => slotInstant(a) - slotInstant(b));
    pa.sort((a, b) => slotInstant(b) - slotInstant(a));
    return { upcoming: up, past: pa };
  }, [meetings]);

  const allSorted = useMemo(
    () => [...meetings].sort((a, b) => slotInstant(b) - slotInstant(a)),
    [meetings],
  );

  const visible = tab === 'upcoming' ? upcoming : tab === 'past' ? past : allSorted;

  // ── Render ────────────────────────────────────────────────────────────────
  if (phase === 'loading') {
    return <Centered><div style={{ color: 'var(--fg3)' }}>Cargando…</div></Centered>;
  }

  if (phase === 'login' || phase === 'denied') {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
        background: 'linear-gradient(160deg, var(--navy-800) 0%, var(--mystic-800) 60%, var(--navy-900) 100%)',
      }}>
        <div style={{
          width: '100%', maxWidth: 440, background: 'rgba(13,18,30,0.6)',
          border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(20px)',
          borderRadius: 24, padding: '44px 36px', boxShadow: 'var(--shadow-xl)',
        }}>
          <div className="eyebrow" style={{ color: 'var(--amber-300)', textAlign: 'center' }}>Panel administrativo</div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,5vw,40px)', color: '#fff',
            textAlign: 'center', margin: '12px 0 8px', fontWeight: 600, letterSpacing: '-0.02em',
          }}>
            Bolivia<span style={{ color: 'var(--amber-300)' }}>Insight</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', textAlign: 'center', fontSize: 15, margin: '0 0 28px', lineHeight: 1.5 }}>
            Acceso restringido a administradores. Inicia sesión con tu cuenta de Google autorizada.
          </p>

          {phase === 'denied' && (
            <div style={{ background: 'rgba(181,66,46,0.22)', color: '#fca5a5', border: '1px solid rgba(181,66,46,0.4)', borderRadius: 10, padding: 12, fontSize: 13, textAlign: 'center', marginBottom: 16 }}>
              Tu cuenta no está autorizada como administrador.
            </div>
          )}
          {error && (
            <div style={{ background: 'rgba(181,66,46,0.22)', color: '#fca5a5', border: '1px solid rgba(181,66,46,0.4)', borderRadius: 10, padding: 12, fontSize: 13, textAlign: 'center', marginBottom: 16 }}>
              {error}
            </div>
          )}

          <button onClick={handleGoogleLogin} style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            background: '#fff', border: 'none', borderRadius: 12, padding: '14px 20px',
            fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 600, color: 'var(--navy-800)',
            cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            {phase === 'denied' ? 'Probar con otra cuenta' : 'Continuar con Google'}
          </button>
        </div>
      </div>
    );
  }

  // Dashboard
  const tabs = [
    { key: 'upcoming', label: 'Próximas', count: upcoming.length },
    { key: 'past', label: 'Pasadas', count: past.length },
    { key: 'all', label: 'Todas', count: meetings.length },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, var(--navy-700), var(--mystic-700))',
        color: '#fff', padding: '28px 0',
      }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="eyebrow" style={{ color: 'var(--amber-300)' }}>Panel administrativo</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em' }}>
              Bolivia<span style={{ color: 'var(--amber-300)' }}>Insight</span> · Meetings
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>{adminEmail}</span>
            <button onClick={logout} style={{
              background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff',
              padding: '8px 14px', borderRadius: 999, cursor: 'pointer', fontSize: 13, fontWeight: 700,
            }}>Cerrar sesión</button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1120, margin: '0 auto', padding: '28px 24px 80px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {tabs.map((t) => {
            const active = tab === t.key;
            return (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: active ? 'var(--navy-700)' : '#fff',
                color: active ? '#fff' : 'var(--fg2)',
                border: `1px solid ${active ? 'var(--navy-700)' : 'var(--border)'}`,
                padding: '9px 16px', borderRadius: 999, cursor: 'pointer', fontSize: 14, fontWeight: 700,
              }}>
                {t.label}
                <span style={{
                  fontSize: 12, fontWeight: 800, padding: '1px 8px', borderRadius: 999,
                  background: active ? 'rgba(255,255,255,0.2)' : 'var(--stone-50)',
                  color: active ? '#fff' : 'var(--fg3)',
                }}>{t.count}</span>
              </button>
            );
          })}
          <button onClick={() => loadMeetings(token)} style={{
            marginLeft: 'auto', background: '#fff', border: '1px solid var(--border)', color: 'var(--fg2)',
            padding: '9px 16px', borderRadius: 999, cursor: 'pointer', fontSize: 14, fontWeight: 700,
          }}>↻ Refrescar</button>
        </div>

        {error && (
          <div style={{ background: 'var(--rust-50)', color: 'var(--rust-700)', border: '1px solid var(--border)', borderRadius: 12, padding: 14, fontSize: 14, marginBottom: 20 }}>
            {error}
          </div>
        )}

        {loadingMeetings ? (
          <div style={{ color: 'var(--fg3)', padding: '40px 0', textAlign: 'center' }}>Cargando meetings…</div>
        ) : visible.length === 0 ? (
          <div style={{
            background: '#fff', border: '1px dashed var(--border-strong)', borderRadius: 16,
            padding: '48px 24px', textAlign: 'center', color: 'var(--fg3)',
          }}>
            No hay meetings en esta vista.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 18 }}>
            {visible.map((m) => <MeetingCard key={m.id} meeting={m} />)}
          </div>
        )}
      </main>
    </div>
  );
}

function Centered({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {children}
    </div>
  );
}
