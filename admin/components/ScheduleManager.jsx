'use client';

import { useState, useEffect, useCallback } from 'react';
import Modal from './Modal.jsx';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function ScheduleManager({ token, meetings = [] }) {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal state — one modal controls everything
  const [modal, setModal] = useState({
    isOpen: false, type: 'info', title: '', message: '',
    primaryAction: null, secondaryAction: null,
  });

  // Form state
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState(''); // empty string means "ALL DAY"
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Calendar view state
  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  });

  const closeModal = () => setModal(m => ({ ...m, isOpen: false }));

  const showError = (message) => setModal({
    isOpen: true, type: 'error',
    title: 'Error', message,
    primaryAction: null, secondaryAction: null,
  });

  const showSuccess = (message) => setModal({
    isOpen: true, type: 'info',
    title: '¡Listo!', message,
    primaryAction: null, secondaryAction: null,
  });

  const loadBlocks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/schedule-blocks?t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Error al cargar los bloqueos (¿El servidor está encendido?)');
      setBlocks(await res.json());
    } catch (e) {
      showError(e.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadBlocks();
  }, [loadBlocks]);

  // Called after user confirms block creation
  const doSubmit = async () => {
    closeModal();
    setSubmitting(true);
    try {
      const payload = { date, timeSlot: timeSlot || null, reason: reason || null };
      const res = await fetch(`${API}/admin/schedule-blocks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al crear el bloqueo');
      }
      setDate('');
      setTimeSlot('');
      setReason('');
      await loadBlocks();
      showSuccess(`El horario ${timeSlot || 'completo'} del ${date} ha sido bloqueado correctamente.`);
    } catch (e) {
      showError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date) {
      setModal({
        isOpen: true, type: 'warning',
        title: 'Selecciona una fecha',
        message: 'Debes elegir una fecha antes de crear un bloqueo.',
        primaryAction: null, secondaryAction: null,
      });
      return;
    }
    // Show confirmation modal instead of window.confirm
    const slotLabel = timeSlot ? `las ${timeSlot}` : 'TODO EL DÍA';
    const reasonText = reason ? ` por "${reason}"` : '';
    setModal({
      isOpen: true, type: 'warning',
      title: 'Confirmar bloqueo',
      message: `¿Estás seguro que deseas bloquear ${slotLabel} el ${date}${reasonText}? Los usuarios no podrán agendar citas en ese horario.`,
      primaryAction: { label: 'Sí, bloquear', onClick: doSubmit },
      secondaryAction: { label: 'Cancelar', onClick: closeModal },
    });
  };

  // Called after user confirms deletion
  const doDelete = async (id) => {
    closeModal();
    try {
      const res = await fetch(`${API}/admin/schedule-blocks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Error al eliminar el bloqueo');
      await loadBlocks();
      showSuccess('El bloqueo fue eliminado y el horario vuelve a estar disponible para los usuarios.');
    } catch (e) {
      showError(e.message);
    }
  };

  const handleDelete = (id) => {
    setModal({
      isOpen: true, type: 'error',
      title: 'Eliminar bloqueo',
      message: '¿Seguro que deseas eliminar este bloqueo? El horario volverá a estar disponible para que los usuarios agenden citas.',
      primaryAction: { label: 'Sí, eliminar', onClick: () => doDelete(id) },
      secondaryAction: { label: 'Cancelar', onClick: closeModal },
    });
  };

  // Calendar helpers
  const shiftWeek = (delta) => {
    const next = new Date(weekStart);
    next.setDate(weekStart.getDate() + delta * 7);
    setWeekStart(next);
  };

  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    days.push(d);
  }

  const allPossibleSlots = ['09:00', '10:30', '14:00', '15:30', '17:00'];

  const getDayStatus = (d) => {
    const key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    const dayBlock = blocks.find(b => b.date.substring(0, 10) === key && !b.timeSlot);
    const slotBlocks = blocks.filter(b => b.date.substring(0, 10) === key && b.timeSlot);
    const dayMeetings = meetings.filter(m => m.date.substring(0, 10) === key);
    return { dayBlock, slotBlocks, dayMeetings, key };
  };

  return (
    <>
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        primaryAction={modal.primaryAction}
        secondaryAction={modal.secondaryAction}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

        {/* Top row: Form + Active Blocks Table */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>

          {/* New Block Form */}
          <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <h3 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: '600' }}>Nuevo bloqueo</h3>
            <p style={{ fontSize: '13px', color: 'var(--fg3)', marginBottom: '20px', lineHeight: '1.5' }}>
              Bloquea un horario específico o un día entero. Si ya hay una cita reservada, el sistema no te dejará bloquear ese espacio.
            </p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: '600' }}>Fecha <span style={{ color: 'var(--rust-500)' }}>*</span></span>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  style={{
                    padding: '10px 12px', borderRadius: '8px',
                    border: `1px solid ${!date ? 'var(--border)' : 'var(--border-strong)'}`,
                    fontFamily: 'inherit', fontSize: '14px',
                  }}
                />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: '600' }}>Horario</span>
                <select
                  value={timeSlot}
                  onChange={e => setTimeSlot(e.target.value)}
                  style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: '#fff', fontFamily: 'inherit', fontSize: '14px' }}
                >
                  <option value="">Todo el día (Bloqueo total)</option>
                  <option value="09:00">09:00</option>
                  <option value="10:30">10:30</option>
                  <option value="14:00">14:00</option>
                  <option value="15:30">15:30</option>
                  <option value="17:00">17:00</option>
                </select>
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: '600' }}>Razón / Motivo <span style={{ fontSize: '11px', color: 'var(--fg3)', fontWeight: '400' }}>(interno)</span></span>
                <input
                  type="text"
                  placeholder="Ej. Feriado, Vacaciones, Agente ocupado"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', fontFamily: 'inherit', fontSize: '14px' }}
                />
              </label>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  background: submitting ? 'var(--fg3)' : 'var(--navy-700, #1e3a5f)',
                  color: '#fff', border: 'none',
                  padding: '12px', borderRadius: '8px',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  fontWeight: '600', fontFamily: 'inherit', fontSize: '14px',
                  transition: 'background 200ms',
                }}
              >
                {submitting ? 'Guardando...' : '+ Añadir bloqueo'}
              </button>
            </form>
          </div>

          {/* Active Blocks Table */}
          <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: '600' }}>Bloqueos activos</h3>
            {loading ? (
              <p style={{ color: 'var(--fg3)', fontSize: '14px' }}>Cargando bloqueos...</p>
            ) : blocks.length === 0 ? (
              <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--fg3)', fontSize: '14px' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
                No hay horarios bloqueados activos.
              </div>
            ) : (
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                      <th style={{ padding: '12px 8px', color: 'var(--fg3)', fontWeight: '600', position: 'sticky', top: 0, background: '#fff' }}>Fecha</th>
                      <th style={{ padding: '12px 8px', color: 'var(--fg3)', fontWeight: '600', position: 'sticky', top: 0, background: '#fff' }}>Horario</th>
                      <th style={{ padding: '12px 8px', color: 'var(--fg3)', fontWeight: '600', position: 'sticky', top: 0, background: '#fff' }}>Motivo</th>
                      <th style={{ padding: '12px 8px', color: 'var(--fg3)', fontWeight: '600', textAlign: 'right', position: 'sticky', top: 0, background: '#fff' }}>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blocks.map(b => {
                      const dateParts = b.date.substring(0, 10).split('-');
                      const localDate = new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2]));
                      // Force UTC timezone so that "2026-06-14T00:00:00Z" doesn't
                      // shift back to June 13 for UTC-4 (Bolivia) users.
                      const dateStr = localDate.toLocaleDateString('es-ES', {
                        weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC'
                      });
                      return (
                        <tr key={b.id} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '12px 8px', whiteSpace: 'nowrap', fontWeight: '500' }}>{dateStr}</td>
                          <td style={{ padding: '12px 8px' }}>
                            {b.timeSlot || (
                              <span style={{ padding: '3px 8px', background: 'var(--rust-50)', color: 'var(--rust-700)', borderRadius: '4px', fontSize: '11px', fontWeight: '800', letterSpacing: '0.3px', textTransform: 'uppercase' }}>
                                Todo el día
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '12px 8px', color: 'var(--fg2)' }}>{b.reason || '—'}</td>
                          <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                            <button
                              onClick={() => handleDelete(b.id)}
                              style={{ background: 'transparent', color: 'var(--rust-600)', border: '1px solid var(--rust-200)', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px', transition: 'all 150ms' }}
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Calendar View */}
        <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: '600' }}>Vista de Calendario</h3>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--fg3)' }}>Visión general de reservas y bloqueos por semana.</p>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--fg2)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--green-100, #cfe7d8)', border: '1px solid var(--green-300, #6db38a)' }} />
                  Cita agendada
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--rust-100, #f3d9d2)', border: '1px solid var(--rust-300, #d6816d)' }} />
                  Bloqueado
                </span>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => shiftWeek(-1)} style={navBtnStyle}>‹</button>
                <button
                  onClick={() => {
                    const d = new Date(); d.setHours(0, 0, 0, 0);
                    const day = d.getDay(); const diff = d.getDate() - day + (day === 0 ? -6 : 1);
                    setWeekStart(new Date(d.setDate(diff)));
                  }}
                  style={{ ...navBtnStyle, width: 'auto', padding: '0 12px', fontSize: '13px', fontWeight: '600' }}
                >
                  Hoy
                </button>
                <button onClick={() => shiftWeek(1)} style={navBtnStyle}>›</button>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: '10px' }}>
            {days.map(d => {
              const { dayBlock, slotBlocks, dayMeetings, key } = getDayStatus(d);
              return (
                <div key={d.toISOString()} style={{
                  border: '1px solid var(--border)', borderRadius: '12px', padding: '12px',
                  background: dayBlock ? 'var(--rust-50, #fbf0ed)' : '#fff',
                  minHeight: '260px', display: 'flex', flexDirection: 'column',
                }}>
                  <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.4px', textTransform: 'uppercase', color: 'var(--fg3)' }}>
                        {d.toLocaleDateString('es-ES', { weekday: 'short' })}
                      </div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: '500', marginTop: '2px' }}>
                        {d.getDate()}
                      </div>
                    </div>
                    {dayBlock && (
                      <span style={{ fontSize: '10px', background: 'var(--rust-600, #b91c1c)', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>
                        CERRADO
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                    {dayBlock ? (
                      <div style={{ fontSize: '12px', color: 'var(--rust-700)', padding: '10px', background: 'rgba(255,255,255,0.6)', borderRadius: '8px', border: '1px dashed var(--rust-300)', textAlign: 'center', margin: 'auto 0' }}>
                        Día completo bloqueado
                        {dayBlock.reason && <div style={{ marginTop: '4px', fontStyle: 'italic', opacity: 0.8 }}>"{dayBlock.reason}"</div>}
                      </div>
                    ) : (
                      allPossibleSlots.map(time => {
                        const meeting = dayMeetings.find(m => m.timeSlot === time);
                        const block = slotBlocks.find(b => b.timeSlot === time);
                        let bg = 'var(--stone-50)';
                        let border = '1px solid var(--border)';
                        let text = time;
                        let textColor = 'var(--fg2)';
                        let tooltip = '';
                        if (meeting) {
                          bg = 'var(--green-50, #ebf5ef)';
                          border = '1px solid var(--green-400, #459a6b)';
                          text = `${time} – CITA`;
                          textColor = 'var(--green-700, #1b4231)';
                          tooltip = `Agendado con ${meeting.user?.name || 'Usuario'}`;
                        } else if (block) {
                          bg = 'var(--rust-50, #fbf0ed)';
                          border = '1px solid var(--rust-300, #d6816d)';
                          text = `${time} – BLOQ.`;
                          textColor = 'var(--rust-700, #7a281c)';
                          tooltip = block.reason || 'Horario bloqueado por admin';
                        }
                        return (
                          <div
                            key={time}
                            title={tooltip}
                            style={{
                              padding: '8px', borderRadius: '6px', fontSize: '11px', fontWeight: '700',
                              background: bg, border, color: textColor,
                              display: 'flex', justifyContent: 'center', alignItems: 'center',
                              cursor: tooltip ? 'help' : 'default',
                            }}
                          >
                            {text}
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Quick Add Button */}
                  {!dayBlock && (
                    <button
                      onClick={() => { setDate(key); setTimeSlot(''); }}
                      style={{ marginTop: '12px', width: '100%', padding: '6px', fontSize: '11px', background: 'transparent', border: '1px dashed var(--border-strong)', color: 'var(--fg3)', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      + Bloquear día
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

const navBtnStyle = {
  width: '32px', height: '32px', borderRadius: '8px',
  background: '#fff', border: '1px solid var(--border)',
  color: 'var(--fg1)', cursor: 'pointer',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
};
