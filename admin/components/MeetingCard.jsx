'use client';

const STATUS_STYLES = {
  confirmed: { bg: 'var(--green-50)', fg: 'var(--green-700)', border: 'var(--green-200)', label: 'Confirmada' },
  pending:   { bg: 'var(--amber-50)', fg: 'var(--amber-800)', border: 'var(--amber-200)', label: 'Pendiente' },
  cancelled: { bg: 'var(--rust-50)',  fg: 'var(--rust-700)',  border: 'var(--rust-200)',  label: 'Cancelada' },
};

// The booking date is stored at UTC midnight and timeSlot is Bolivia time (UTC−4).
// Format from the Y-M-D parts directly to avoid local-timezone shifts.
function formatDate(iso) {
  const ymd = (iso || '').substring(0, 10);
  const [y, m, d] = ymd.split('-').map(Number);
  if (!y) return ymd;
  const dt = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  return dt.toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  });
}

function initials(name, email) {
  const base = (name || email || '?').trim();
  const parts = base.split(/\s+/);
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || base[0].toUpperCase();
}

function BriefRow({ label, value }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.3, textTransform: 'uppercase', color: 'var(--fg3)' }}>{label}</span>
      <span style={{ fontSize: 13, color: 'var(--fg1)', whiteSpace: 'pre-line', lineHeight: 1.45 }}>{value || '—'}</span>
    </div>
  );
}

export default function MeetingCard({ meeting }) {
  const u = meeting.user || {};
  const st = STATUS_STYLES[meeting.status] || { bg: 'var(--stone-50)', fg: 'var(--fg2)', border: 'var(--border)', label: meeting.status };
  const hasBrief = meeting.briefDates || meeting.briefRoute || meeting.briefQuestions || meeting.briefLocation;

  return (
    <div style={{
      background: '#fff', border: '1px solid var(--border)', borderRadius: 16,
      boxShadow: 'var(--shadow-sm)', overflow: 'hidden',
    }}>
      {/* Header: traveler + status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 20px', borderBottom: '1px solid var(--border)' }}>
        {u.picture
          ? <img src={u.picture} alt="" referrerPolicy="no-referrer" style={{ width: 44, height: 44, borderRadius: 12, objectFit: 'cover' }} />
          : <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--mystic-500)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>{initials(u.name, u.email)}</div>}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, color: 'var(--fg1)', fontSize: 15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name || 'Sin nombre'}</div>
          <div style={{ fontSize: 13, color: 'var(--fg3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.email}</div>
        </div>
        <span style={{
          fontSize: 11, fontWeight: 800, letterSpacing: 0.3, textTransform: 'uppercase',
          padding: '5px 10px', borderRadius: 999, background: st.bg, color: st.fg, border: `1px solid ${st.border}`,
        }}>{st.label}</span>
      </div>

      {/* When + duration + topic */}
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 500, color: 'var(--fg1)', textTransform: 'capitalize' }}>
          {formatDate(meeting.date)}
        </div>
        <div style={{ fontSize: 14, color: 'var(--fg2)' }}>
          <strong style={{ fontFamily: 'var(--font-mono)' }}>{meeting.timeSlot}</strong> (hora Bolivia · UTC−4) · {meeting.durationMin} min
        </div>
        <div style={{ fontSize: 13, color: 'var(--fg3)', marginTop: 2 }}>{meeting.topic}</div>
      </div>

      {/* Payment */}
      <div style={{ padding: '0 20px 14px', display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ fontSize: 14 }}>
          <span style={{ color: 'var(--fg3)' }}>Pago: </span>
          <strong style={{ color: 'var(--rust-500)', fontFamily: 'var(--font-display)', fontSize: 17 }}>${meeting.amount}</strong>
          <span style={{ color: 'var(--fg3)', fontFamily: 'var(--font-mono)', fontSize: 12, marginLeft: 4 }}>{meeting.currency}</span>
        </div>
        {meeting.paypalCaptureId && (
          <div style={{ fontSize: 11, color: 'var(--fg3)', fontFamily: 'var(--font-mono)' }}>
            PayPal: {meeting.paypalCaptureId}
          </div>
        )}
        {meeting.calendarLink && (
          <a href={meeting.calendarLink} target="_blank" rel="noreferrer" style={{
            marginLeft: 'auto', fontSize: 13, fontWeight: 700, color: '#fff', background: 'var(--green-600)',
            padding: '7px 14px', borderRadius: 8, textDecoration: 'none',
          }}>Abrir Google Meet →</a>
        )}
      </div>

      {/* Brief */}
      {hasBrief && (
        <div style={{ background: 'var(--stone-25)', borderTop: '1px solid var(--border)', padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
          <div style={{ gridColumn: '1 / -1', fontSize: 11, fontWeight: 800, letterSpacing: 0.4, textTransform: 'uppercase', color: 'var(--rust-500)' }}>
            Brief del viajero
          </div>
          <BriefRow label="Fechas de viaje" value={meeting.briefDates} />
          <BriefRow label="Ruta aproximada" value={meeting.briefRoute} />
          <BriefRow label="Preguntas" value={meeting.briefQuestions} />
          <BriefRow label="Ubicación actual" value={meeting.briefLocation} />
        </div>
      )}
    </div>
  );
}
