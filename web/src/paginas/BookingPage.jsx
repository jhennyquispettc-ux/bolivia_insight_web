import React, { useState, useEffect } from 'react';
import I from '../ui/iconos.jsx';
import Btn from '../ui/Boton.jsx';
import PayPalButton from '../componentes/PayPalButton.jsx';
import Modal from '../ui/Modal.jsx';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { apiUrl, API_BASE } from '../data/api.js';
import { EXPERT } from '../data/experto.js';
import { useI18n } from '../data/translations.jsx';

function BookingPage({ onBack, onProfile, user }) {
  const { t } = useI18n();
  const [vw, setVw] = React.useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  React.useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isMobile = vw < 640;
  // Steps: 0 duration · 1 time · 2 brief (required) · 3 payment · 4 confirmation
  const [step, setStep] = useState(0);
  const [duration, setDuration] = useState(30);
  const [slot, setSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', message: '', type: 'info' });
  const [booking, setBooking] = useState(null);

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
        const res = await fetch(`${API_BASE}/bookings/availability?t=${Date.now()}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const data = await res.json();

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

  // Mandatory trip brief — collected BEFORE payment so the expert can prepare.
  const [brief, setBrief] = useState({ phone: '', origin: '', companions: '', startDate: '', endDate: '', route: [], questions: '' });
  const [errors, setErrors] = useState({});

  const briefComplete =
    brief.phone && brief.startDate && brief.endDate && brief.route.length > 0 && brief.questions.trim() && brief.origin.trim() && brief.companions.trim();

  const price = duration === 15 ? 12 : 22;
  const priceBs = duration === 15 ? 84 : 153;

  const tz = (() => {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone; }
    catch { return 'your local time'; }
  })();

  const defaultExpert = EXPERT;

  // The booking endpoints require an app JWT (saved at login). Without it the
  // PayPal capture would 401, so we gate the payment step on being logged in.
  const isLoggedIn = !!(user || (typeof localStorage !== 'undefined' && localStorage.getItem('bolivia_insight_token')));

  const steps = ['Choose duration', 'Pick a time', 'Trip brief', 'Payment'];

  // Can the user jump to step `i`? Forward navigation is gated by prerequisites.
  const canGoTo = (i) => {
    if (i <= 0) return true;
    if (i === 1) return true;            // duration has a default
    if (i === 2) return !!slot;          // a slot must be picked
    if (i === 3) return !!slot && !!briefComplete; // brief must be complete
    return false;
  };

  // Whether the "Continue" button at the current step is enabled.
  const canContinue =
    (step === 0) ||
    (step === 1 && !!slot) ||
    (step === 2 && !!briefComplete);

  const handlePaid = (createdBooking) => {
    setBooking(createdBooking);
    setStep(4);
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Modal 
        isOpen={modalConfig.isOpen} 
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
      />
      {/* Hero section */}
      <section style={{ background: 'linear-gradient(135deg, var(--navy-700), var(--mystic-700))', color: '#fff', padding: isMobile ? '56px 0 140px' : '80px 0 160px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,183,3,0.18) 0%, transparent 70%)' }}/>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 20px' : '0 32px', position: 'relative' }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', padding: '8px 14px', borderRadius: 999, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, marginBottom: 24 }}><I.ArrowL size={13}/> Volver</button>
          <div className="eyebrow" style={{ color: 'var(--amber-300)' }}>Habla con un local · Videollamada</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? 'clamp(36px,9vw,52px)' : 'clamp(44px,6vw,84px)', lineHeight: 1, color: '#fff', margin: '12px 0 0', fontWeight: 600, letterSpacing: '-0.03em' }}>
            ¿Tienes una duda concreta?<br/><em style={{ fontStyle: 'normal', fontWeight: 800, color: 'var(--amber-300)' }}>Pregúntale a alguien de acá.</em>
          </h1>
          <p style={{ fontSize: isMobile ? 16 : 18, color: 'var(--on-dark-1)', marginTop: 18, maxWidth: 620, lineHeight: 1.55 }}>
            Para cuando la guía y la IA se quedan cortas. Agenda una videollamada de 15 o 30 minutos con una guía que recorre estas rutas y conoce el terreno.
          </p>
        </div>
      </section>

      {}
      <section style={{ marginTop: -100, paddingBottom: 80, position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 16px' : '0 32px' }}>
          <div style={{ background: '#fff', borderRadius: 20, boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border)', overflow: 'hidden' }}>

            {}
            {step < 4 && (
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }} className="bi-stepper">
                {steps.map((s, i) => {
                  const reachable = canGoTo(i);
                  return (
                    <button key={i} onClick={() => reachable && setStep(i)} disabled={!reachable} style={{
                      flex: 1, padding: '20px 18px',
                      background: step === i ? 'var(--stone-50)' : '#fff',
                      border: 0, borderBottom: step === i ? '3px solid var(--rust-500)' : '3px solid transparent',
                      cursor: reachable ? 'pointer' : 'not-allowed', textAlign: 'left',
                      opacity: reachable ? 1 : 0.45,
                    }}>
                      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.4, color: step >= i ? 'var(--rust-500)' : 'var(--fg3)' }}>STEP {i+1}</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: step === i ? 'var(--fg1)' : 'var(--fg2)', marginTop: 2 }}>{s}</div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Error display removed in favor of modal */}

            {}
            {step === 0 && (
              <div style={{ padding: isMobile ? '24px 20px' : 40 }}>
                {/* Who you are actually talking to. */}
                <div style={{
                  display: 'flex', gap: isMobile ? 16 : 22, alignItems: 'flex-start',
                  padding: isMobile ? 18 : 24, marginBottom: 24,
                  background: 'var(--stone-25)', border: '1px solid var(--border)', borderRadius: 16,
                  flexWrap: 'wrap',
                }}>
                  <ExpertAvatar size={isMobile ? 64 : 88} />
                  <div style={{ flex: 1, minWidth: 220 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? 20 : 24, fontWeight: 600, color: 'var(--fg1)' }}>{EXPERT.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--fg3)', marginTop: 3, fontFamily: 'var(--font-mono)', letterSpacing: 0.3 }}>
                      {EXPERT.city} · {EXPERT.languages.join(" · ")}
                    </div>
                    <p style={{ fontSize: isMobile ? 14 : 15, color: 'var(--fg2)', lineHeight: 1.6, margin: '12px 0 0' }}>{EXPERT.bio}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
                      {EXPERT.credentials.map((c) => (
                        <span key={c} style={{
                          fontSize: 11, fontWeight: 700, letterSpacing: 0.3,
                          padding: '5px 11px', borderRadius: 999,
                          background: 'var(--rust-50)', color: 'var(--rust-600)',
                        }}>{c}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                  {[
                    { mins: 15, usd: 12, bs: 84,  label: 'Consulta puntual', desc: 'Un tema, una respuesta clara. Ideal si ya sabes qué necesitas preguntar.' },
                    { mins: 30, usd: 22, bs: 153, label: 'Revisión del viaje', desc: 'Repasamos tu plan completo: se corrigen errores y se suman paradas locales.' },
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
                <div style={{ marginTop: 22, padding: 16, background: 'var(--amber-50, #fff8e1)', border: '1px solid var(--amber-200, #ffe07a)', borderRadius: 10, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <I.Sparkle size={18}/>
                  <div style={{ fontSize: 13, color: 'var(--fg2)', lineHeight: 1.55 }}>
                    <strong style={{ color: 'var(--fg1)' }}>Antes de pagar completas un resumen breve de tu viaje.</strong> Fechas, ruta y en qué estás trabado — así Jhenny llega preparada y la llamada va directo a las respuestas.
                  </div>
                </div>
              </div>
            )}

            {}
            {step === 1 && (
              <div style={{ padding: isMobile ? '24px 20px' : 40 }}>
                <CalendarPicker
                  expert={defaultExpert}
                  weekStart={weekStart}
                  setWeekStart={setWeekStart}
                  slot={slot}
                  setSlot={setSlot}
                  tz={tz}
                  unavailable={unavailable}
                  isMobile={isMobile}
                />
              </div>
            )}

            {}
            {step === 2 && (
              <BriefStep brief={brief} setBrief={setBrief} isMobile={isMobile} errors={errors} setErrors={setErrors} />
            )}

            {}
            {step === 3 && slot && (
              <PaymentStep
                slot={slot}
                duration={duration}
                price={price}
                priceBs={priceBs}
                brief={brief}
                isLoggedIn={isLoggedIn}
                onPaid={handlePaid}
                onError={(m) => setModalConfig({ isOpen: true, type: 'error', title: 'Error en el pago', message: m })}
                isMobile={isMobile}
              />
            )}

            {}
            {step === 4 && slot && (
              <Confirmation
                expert={defaultExpert}
                slot={slot}
                duration={duration}
                price={price}
                priceBs={priceBs}
                brief={brief}
                booking={booking}
                onProfile={onProfile}
                isMobile={isMobile}
              />
            )}

            {}
            {step < 3 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isMobile ? '16px 20px' : '20px 32px', borderTop: '1px solid var(--border)', background: 'var(--stone-25)', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--fg3)' }}>
                  <I.Shield size={14}/>
                  <span>Secure checkout · PayPal · Refundable up to 12h before</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  {step > 0 && (
                    <div style={{ fontSize: 13, color: 'var(--fg2)' }}>
                      {<span>{duration} min</span>}
                      <span> · <strong style={{ color: 'var(--rust-500)', fontFamily: 'var(--font-display)', fontSize: 16 }}>${price}</strong></span>
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 10 }}>
                    {step > 0 && <Btn kind="ghost" size="md" onClick={() => setStep(step - 1)}>Back</Btn>}
                    <Btn kind="primary" size="md"
                      onClick={() => {
                        if (step === 2) {
                          const newErrors = {};
                          if (!brief.origin.trim()) newErrors.origin = 'Por favor selecciona tu país de origen.';
                          if (!brief.companions.trim()) newErrors.companions = 'Por favor indica con quién viajas.';
                          if (!brief.startDate) newErrors.startDate = 'Selecciona tu fecha de llegada.';
                          if (!brief.endDate) newErrors.endDate = 'Selecciona tu fecha de salida.';
                          else if (new Date(brief.startDate) > new Date(brief.endDate)) newErrors.endDate = 'La salida debe ser después de la llegada.';
                          if (brief.route.length === 0) newErrors.route = 'Selecciona al menos un destino.';
                          if (brief.questions.trim().length < 15) newErrors.questions = 'Tus preguntas deben tener al menos 15 caracteres.';
                          if (!brief.phone || !isValidPhoneNumber(brief.phone)) newErrors.phone = 'Ingresa un número de celular válido.';

                          if (Object.keys(newErrors).length > 0) {
                            setErrors(newErrors);
                            // Scroll to first error roughly
                            window.scrollBy({ top: -100, behavior: 'smooth' });
                            return;
                          }
                          setErrors({});
                        }
                        if (canContinue || step === 2) setStep(step + 1);
                      }}
                      style={{ opacity: canContinue || step === 2 ? 1 : 0.4, pointerEvents: canContinue || step === 2 ? 'auto' : 'none' }}>
                      {step === 2 ? 'Continue to payment' : 'Continue'} <I.ArrowR size={14}/>
                    </Btn>
                  </div>
                </div>
              </div>
            )}

            {}
            {step === 3 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isMobile ? '16px 20px' : '20px 32px', borderTop: '1px solid var(--border)', background: 'var(--stone-25)', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--fg3)' }}>
                  <I.Shield size={14}/>
                  <span>Secure checkout · PayPal · Refundable up to 12h before</span>
                </div>
                <Btn kind="ghost" size="md" onClick={() => setStep(2)}>Back</Btn>
              </div>
            )}
          </div>

          {}
          {step < 3 && (
            <div style={{ marginTop: isMobile ? 40 : 56 }}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>{t('bk.howItWorks', 'How it works')}</div>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
                {[
                  { n: '01', t: t('bk.s1t', 'Pick and brief'), d: t('bk.s1d', 'Choose a duration and slot, then fill a short brief.') },
                  { n: '02', t: t('bk.s2t', 'Pay securely'), d: t('bk.s2d', 'Pay with PayPal. Booking is confirmed once payment goes through.') },
                  { n: '03', t: t('bk.s3t', 'Join the call'), d: t('bk.s3d', 'The Google Meet link arrives by email.') },
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
        .PhoneInputInput {
          border: none;
          outline: none;
          font-family: var(--font-sans);
          font-size: 14px;
          color: var(--fg1);
          background: transparent;
        }
        .PhoneInputInput::placeholder {
          color: var(--fg3);
        }
        .PhoneInput {
          display: flex;
          align-items: center;
          width: 100%;
        }
        .PhoneInputCountry {
          margin-right: 12px;
        }
      `}</style>
    </div>
  );
}

// ── Step 2: mandatory trip brief ───────────────────────────────────────────────
function BriefStep({ brief, setBrief, isMobile, errors, setErrors }) {
  const { t } = useI18n();
  const COUNTRIES = [
    "Alemania", "Argentina", "Australia", "Austria", "Bélgica", "Bolivia", "Brasil", "Canadá", "Chile", "China", 
    "Colombia", "Corea del Sur", "Costa Rica", "Cuba", "Dinamarca", "Ecuador", "Egipto", "El Salvador", "España", 
    "Estados Unidos", "Francia", "Grecia", "Guatemala", "Honduras", "India", "Irlanda", "Israel", "Italia", 
    "Japón", "México", "Nicaragua", "Noruega", "Nueva Zelanda", "Países Bajos", "Panamá", "Paraguay", "Perú", 
    "Polonia", "Portugal", "Reino Unido", "República Dominicana", "Rusia", "Suecia", "Suiza", "Uruguay", "Venezuela"
  ];
  const COUNTRY_ISO_MAP = {
    "Alemania": "DE", "Argentina": "AR", "Australia": "AU", "Austria": "AT", "Bélgica": "BE", "Bolivia": "BO", "Brasil": "BR", "Canadá": "CA", "Chile": "CL", "China": "CN", 
    "Colombia": "CO", "Corea del Sur": "KR", "Costa Rica": "CR", "Cuba": "CU", "Dinamarca": "DK", "Ecuador": "EC", "Egipto": "EG", "El Salvador": "SV", "España": "ES", 
    "Estados Unidos": "US", "Francia": "FR", "Grecia": "GR", "Guatemala": "GT", "Honduras": "HN", "India": "IN", "Irlanda": "IE", "Israel": "IL", "Italia": "IT", 
    "Japón": "JP", "México": "MX", "Nicaragua": "NI", "Noruega": "NO", "Nueva Zelanda": "NZ", "Países Bajos": "NL", "Panamá": "PA", "Paraguay": "PY", "Perú": "PE", 
    "Polonia": "PL", "Portugal": "PT", "Reino Unido": "GB", "República Dominicana": "DO", "Rusia": "RU", "Suecia": "SE", "Suiza": "CH", "Uruguay": "UY", "Venezuela": "VE"
  };

  const DESTINATIONS = ["La Paz", "Salar de Uyuni", "Lago Titicaca", "Sucre", "Potosí", "Rurrenabaque (Amazonía)", "Santa Cruz"];

  let days = 0;
  if (brief.startDate && brief.endDate) {
    const diff = new Date(brief.endDate) - new Date(brief.startDate);
    days = Math.max(0, diff / (1000 * 60 * 60 * 24));
  }

  return (
    <div style={{ padding: isMobile ? '24px 20px' : 40 }}>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? 22 : 26, fontWeight: 500 }}>{t('bk.briefTitle', 'Tell us about your trip')}</div>
        <div style={{ fontSize: 13, color: 'var(--fg2)', marginTop: 6, lineHeight: 1.55, maxWidth: 560 }}>
          {t('bk.briefDesc', 'This helps her prepare for the call.')}
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
        
        {/* Origen */}
        <div style={{ gridColumn: isMobile ? '1 / -1' : 'auto' }}>
          <BriefField
            label={t('bk.fOrigin', 'Where are you visiting from?')}
            hint={t('bk.fOriginHint', 'Type to find your country…')}
            type="country"
            options={COUNTRIES}
            required
            error={errors?.origin}
            value={brief.origin}
            onChange={v => {
              setBrief({ ...brief, origin: v });
              if (errors?.origin) setErrors({ ...errors, origin: null });
            }}
          />
        </div>

        {/* Acompañantes */}
        <div style={{ gridColumn: isMobile ? '1 / -1' : 'auto' }}>
          <BriefField
            label={t('bk.fCompany', 'Who are you travelling with?')}
            type="select"
            options={['', 'Solo', 'Pareja', 'Familia', 'Amigos', 'Grupo Guiado']}
            required
            error={errors?.companions}
            value={brief.companions}
            onChange={v => {
              setBrief({ ...brief, companions: v });
              if (errors?.companions) setErrors({ ...errors, companions: null });
            }}
          />
        </div>

        {/* Fechas */}
        <div style={{ gridColumn: '1 / -1', marginTop: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.3, textTransform: 'uppercase', color: 'var(--fg3)', display: 'block', marginBottom: 6 }}>
            Travel Window<span style={{ color: 'var(--rust-500)', marginLeft: 4 }}>*</span>
            {days > 0 && <span style={{ marginLeft: 8, background: 'var(--stone-100)', padding: '2px 8px', borderRadius: 99, color: 'var(--fg1)', fontWeight: 600 }}>Viaje de {days} días</span>}
          </span>
          <div style={{ display: 'flex', gap: 12, flexDirection: isMobile ? 'column' : 'row', padding: 16, background: 'var(--stone-50)', border: `1px solid ${errors?.startDate || errors?.endDate ? 'var(--rust-500)' : 'var(--border)'}`, borderRadius: 14 }}>
            <div style={{ flex: 1 }}>
              <BriefField
                label={t('bk.fStart', 'Arrival in Bolivia')}
                type="date"
                required
                value={brief.startDate}
                onChange={v => { setBrief({ ...brief, startDate: v }); if (errors?.startDate) setErrors({ ...errors, startDate: null }); }}
              />
              {errors?.startDate && <div style={{ fontSize: 12, color: 'var(--rust-500)', marginTop: 4, fontWeight: 500 }}>{errors.startDate}</div>}
            </div>
            <div style={{ flex: 1 }}>
              <BriefField
                label={t('bk.fEnd', 'Departure from Bolivia')}
                type="date"
                required
                value={brief.endDate}
                onChange={v => { setBrief({ ...brief, endDate: v }); if (errors?.endDate) setErrors({ ...errors, endDate: null }); }}
              />
              {errors?.endDate && <div style={{ fontSize: 12, color: 'var(--rust-500)', marginTop: 4, fontWeight: 500 }}>{errors.endDate}</div>}
            </div>
          </div>
        </div>
        
        {/* Destinos */}
        <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.3, textTransform: 'uppercase', color: 'var(--fg3)' }}>
            Destinos que deseas visitar<span style={{ color: 'var(--rust-500)', marginLeft: 4 }}>*</span>
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {DESTINATIONS.map(d => {
              const isSelected = brief.route.includes(d);
              return (
                <button key={d} onClick={() => {
                  if (isSelected) setBrief({ ...brief, route: brief.route.filter(x => x !== d) });
                  else setBrief({ ...brief, route: [...brief.route, d] });
                  if (errors?.route) setErrors({ ...errors, route: null });
                }} style={{
                  padding: '8px 14px', borderRadius: 99, fontSize: 13, fontWeight: 600,
                  background: isSelected ? 'var(--rust-500)' : '#fff',
                  color: isSelected ? '#fff' : 'var(--fg2)',
                  border: isSelected ? '1px solid var(--rust-500)' : `1px solid ${errors?.route ? 'var(--rust-300)' : 'var(--border)'}`,
                  cursor: 'pointer', transition: 'all 0.2s'
                }}>
                  {d}
                </button>
              );
            })}
          </div>
          {errors?.route && <div style={{ fontSize: 12, color: 'var(--rust-500)', fontWeight: 500 }}>{errors.route}</div>}
        </div>

        {/* Preguntas */}
        <div style={{ gridColumn: '1 / -1', marginTop: 12 }}>
          <BriefField
            label={t('bk.fQuestions', 'Your top 3 questions')}
            hint={t('bk.fQuestionsHint', 'What do you most need to resolve on the call?')}
            multiline={true}
            required
            error={errors?.questions}
            value={brief.questions}
            onChange={v => { setBrief({ ...brief, questions: v }); if (errors?.questions) setErrors({ ...errors, questions: null }); }}
          />
        </div>

        {/* Teléfono */}
        <div style={{ gridColumn: '1 / -1', marginTop: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.3, textTransform: 'uppercase', color: 'var(--fg3)', display: 'block', marginBottom: 6 }}>
            WhatsApp / Celular<span style={{ color: 'var(--rust-500)', marginLeft: 4 }}>*</span>
          </span>
          <div style={{
            padding: '4px 14px', borderRadius: 10, background: '#fff',
            border: `1px solid ${errors?.phone ? 'var(--rust-500)' : 'var(--border-strong)'}`
          }}>
            <PhoneInput
              international
              defaultCountry={brief.origin && COUNTRY_ISO_MAP[brief.origin] ? COUNTRY_ISO_MAP[brief.origin] : 'BO'}
              value={brief.phone}
              onChange={v => { setBrief({ ...brief, phone: v }); if (errors?.phone) setErrors({ ...errors, phone: null }); }}
              style={{ minHeight: 36 }}
            />
          </div>
          {errors?.phone && <div style={{ fontSize: 12, color: 'var(--rust-500)', marginTop: 4, fontWeight: 500 }}>{errors.phone}</div>}
        </div>

      </div>
      <div style={{ marginTop: 24, fontSize: 12, color: 'var(--fg3)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <I.Alert size={14}/> Todos los campos son obligatorios para continuar al pago.
      </div>
    </div>
  );
}

// ── Step 3: payment via PayPal ─────────────────────────────────────────────────
function PaymentStep({ slot, duration, price, priceBs, brief, isLoggedIn, onPaid, onError, isMobile }) {
  const { t } = useI18n();
  const localD = new Date(Date.UTC(slot.date.getFullYear(), slot.date.getMonth(), slot.date.getDate(), Number(slot.time.split(':')[0]) + 4, Number(slot.time.split(':')[1])));
  const fmtFullDate = localD.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const fmtTime = localD.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{ padding: isMobile ? '24px 20px' : 40 }}>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 24 : 40 }}>
        {/* Order summary */}
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? 22 : 26, fontWeight: 500, marginBottom: 16 }}>{t('bk.orderSummary', 'Order summary')}</div>
          <div style={{ background: 'var(--stone-25)', border: '1px solid var(--border)', borderRadius: 14, padding: 22 }}>
            <Row label={t('bk.rowSession', 'Session')} value={`${duration} min`} />
            <Row label={t('bk.rowWhen', 'When')} value={`${fmtFullDate}, ${fmtTime}`} />
            <Row label={t('bk.rowBoliviaTime', 'Bolivia time')} value={`${slot.time} (UTC −4)`} />
            <div style={{ borderTop: '1px solid var(--border)', margin: '14px 0' }} />
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg1)' }}>{t('bk.total', 'Total')}</span>
              <span>
                <strong style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--rust-500)' }}>${price}</strong>
                <span style={{ fontSize: 12, color: 'var(--fg3)', fontFamily: 'var(--font-mono)', marginLeft: 8 }}>≈ Bs {priceBs}</span>
              </span>
            </div>
          </div>
          <div style={{ marginTop: 14, fontSize: 12, color: 'var(--fg3)', lineHeight: 1.55, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <I.Shield size={14}/>
            <span>{t('bk.secureNote', 'Your booking is created only after PayPal confirms the payment.')}</span>
          </div>
        </div>

        {/* PayPal */}
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? 22 : 26, fontWeight: 500, marginBottom: 16 }}>{t('bk.payWithPaypal', 'Pay with PayPal')}</div>
          {isLoggedIn ? (
            <PayPalButton
              durationMin={duration}
              slot={slot}
              brief={brief}
              onPaid={onPaid}
              onError={onError}
            />
          ) : (
            <div style={{
              background: 'var(--rust-50)', border: '1px solid var(--rust-200)',
              borderRadius: 12, padding: '16px 18px', fontSize: 14, color: 'var(--rust-700)', lineHeight: 1.55,
            }}>
              <strong>Inicia sesión para pagar.</strong> Debes entrar con Google antes de pagar y agendar la cita, así la reserva queda asociada a tu cuenta y recibes la confirmación por correo.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '6px 0', fontSize: 14 }}>
      <span style={{ color: 'var(--fg3)' }}>{label}</span>
      <span style={{ color: 'var(--fg1)', fontWeight: 600, textAlign: 'right' }}>{value}</span>
    </div>
  );
}

const CalendarPicker = React.memo(function CalendarPicker({ expert, weekStart, setWeekStart, slot, setSlot, tz, unavailable, isMobile }) {
  const { t } = useI18n();

  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    days.push(d);
  }


  const slotsForDay = (date) => {
    const key = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
    let candidates = ['09:00', '10:30', '14:00', '15:30', '17:00'];

    candidates = candidates.filter(time => !unavailable.some(u => u.dateISO === key && (u.timeSlot === time || u.timeSlot === 'ALL')));

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
          <div style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? 20 : 24, fontWeight: 500 }}>{rangeLabel}, {days[0].getFullYear()}</div>
          <div style={{ fontSize: 12, color: 'var(--fg3)', marginTop: 2 }}>
            All times Bolivia (UTC −4) · Your timezone: <span style={{ fontFamily: 'var(--font-mono)' }}>{tz}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => shiftWeek(-1)} aria-label={t('bk.prevWeek', 'Previous week')} style={navBtnStyle}><I.ChevronL size={16}/></button>
          <button onClick={() => {
            const d = new Date();
            d.setHours(0, 0, 0, 0);
            const day = d.getDay();
            const diff = d.getDate() - day + (day === 0 ? -6 : 1);
            setWeekStart(new Date(d.setDate(diff)));
          }} style={{ ...navBtnStyle, width: 'auto', padding: '0 16px', fontSize: 13, fontWeight: 700 }}>Today</button>
          <button onClick={() => shiftWeek(1)} aria-label={t('bk.nextWeek', 'Next week')} style={navBtnStyle}><I.ChevronR size={16}/></button>
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
});

const navBtnStyle = {
  width: 36, height: 36, borderRadius: 10,
  background: '#fff', border: '1px solid var(--border)',
  color: 'var(--fg1)', cursor: 'pointer',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  transition: 'all 140ms',
};

function Confirmation({ expert, slot, duration, price, priceBs, brief, booking, onProfile, isMobile }) {
  const { t } = useI18n();
  const localD = new Date(Date.UTC(slot.date.getFullYear(), slot.date.getMonth(), slot.date.getDate(), Number(slot.time.split(':')[0]) + 4, Number(slot.time.split(':')[1])));
  const fmtFullDate = localD.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const fmtTime = localD.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{ padding: 0 }}>
      {}
      <div style={{
        background: 'linear-gradient(135deg, var(--green-500) 0%, var(--green-700) 100%)',
        color: '#fff', padding: isMobile ? '32px 20px' : '40px 40px 36px', textAlign: 'center',
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.18)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
        }}><I.Check size={32}/></div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,40px)', margin: 0, fontWeight: 600, letterSpacing: '-0.02em' }}>
          ¡Pago recibido — sesión confirmada!
        </h2>
        <p style={{ marginTop: 10, fontSize: 14, color: 'var(--on-dark-1)' }}>
          La agendamos en tu Google Calendar y te enviamos un correo de confirmación con tu resumen.
        </p>
      </div>

      {}
      <div style={{ padding: isMobile ? '24px 20px' : 32 }}>
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
              Original: {slot.time} (Bolivia Time) · Paid ${price} <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>≈ Bs {priceBs}</span>
            </div>
          </div>
        </div>

        {}
        <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
          <Btn kind="primary" size="md" onClick={onProfile}>
             Go to My Profile <I.ArrowR size={14}/>
          </Btn>
          {booking?.calendarLink && (
            <Btn kind="ghost" size="md" onClick={() => window.open(booking.calendarLink, '_blank')}>
              <I.Calendar size={14}/> View in Calendar
            </Btn>
          )}
        </div>

        {}
        <div style={{
          marginTop: 22, padding: '14px 18px',
          background: 'var(--amber-50, #fff8e1)', border: '1px solid var(--amber-200, #ffe07a)', borderRadius: 12,
          display: 'flex', gap: 12, alignItems: 'flex-start',
        }}>
          <I.Sparkle size={18}/>
          <div style={{ fontSize: 13, color: 'var(--fg2)', lineHeight: 1.55 }}>
            <strong style={{ color: 'var(--fg1)' }}>You'll get a Google Meet link one hour before the call.</strong> We've received your brief and will prepare the right maps and materials.
          </div>
        </div>

        {}
        <div style={{
          marginTop: 22, background: '#fff',
          border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden',
        }}>
          <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border)', background: 'var(--stone-50)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 500 }}>{t('bk.yourBrief', 'Your trip brief')}</div>
            <div style={{ fontSize: 12, color: 'var(--fg3)', marginTop: 4 }}>Se comparte con Jhenny para que pueda prepararse.</div>
          </div>
          <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <BriefReadOnly label={t('bk.rPhone', 'WhatsApp / Phone')} value={brief.phone} />
              <BriefReadOnly label="From" value={brief.origin} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <BriefReadOnly label={t('bk.rDates', 'Travel dates')} value={`${brief.startDate} to ${brief.endDate}`} />
              <BriefReadOnly label={t('bk.rWith', 'Travelling with')} value={brief.companions} />
            </div>
            <BriefReadOnly label={t('bk.rDestinations', 'Destinations')}      value={Array.isArray(brief.route) ? brief.route.join(' · ') : brief.route} />
            <BriefReadOnly label={t('bk.rQuestions', 'Main questions')}   value={brief.questions} />
          </div>
        </div>
      </div>
    </div>
  );
}

function BriefReadOnly({ label, value }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.3, textTransform: 'uppercase', color: 'var(--fg3)' }}>{label}</span>
      <span style={{ fontSize: 14, color: 'var(--fg1)', whiteSpace: 'pre-line', lineHeight: 1.5 }}>{value || '—'}</span>
    </div>
  );
}

function BriefField({ label, hint, value, onChange, multiline, required, type, options, error }) {
  const [localValue, setLocalValue] = useState(value);
  
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const empty = required && !localValue.trim();
  const hasError = !!error;
  const baseStyle = {
    fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--fg1)',
    padding: '10px 14px', borderRadius: 10,
    border: `1px solid ${hasError ? 'var(--rust-500)' : empty ? 'var(--rust-300, #d6816d)' : 'var(--border-strong)'}`, background: '#fff', outline: 'none',
    minHeight: 44, resize: multiline ? 'vertical' : 'none',
    width: '100%', boxSizing: 'border-box'
  };

  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
      {label && (
        <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.3, textTransform: 'uppercase', color: 'var(--fg3)' }}>
          {label}{required && <span style={{ color: 'var(--rust-500)', marginLeft: 4 }}>*</span>}
        </span>
      )}
      {type === 'country' ? (
        <React.Fragment>
          <input list={`${label}-list`} value={localValue} onChange={e => { setLocalValue(e.target.value); onChange(e.target.value); }} onBlur={() => onChange(localValue)} placeholder={hint} style={baseStyle} />
          <datalist id={`${label}-list`}>
            {options.map((opt, i) => <option key={i} value={opt} />)}
          </datalist>
        </React.Fragment>
      ) : type === 'select' ? (
        <select value={localValue} onChange={e => { setLocalValue(e.target.value); onChange(e.target.value); }} style={baseStyle}>
          {options.map((opt, i) => <option key={i} value={opt} disabled={opt === ''}>{opt === '' ? 'Seleccionar...' : opt}</option>)}
        </select>
      ) : multiline ? (
        <textarea value={localValue} onChange={e => setLocalValue(e.target.value)} onBlur={() => onChange(localValue)} placeholder={hint} rows={3} style={baseStyle} />
      ) : (
        <input type={type || 'text'} value={localValue} onChange={e => setLocalValue(e.target.value)} onBlur={() => onChange(localValue)} placeholder={hint} style={baseStyle} min={type === 'number' ? 18 : undefined} />
      )}
      {hasError && <div style={{ fontSize: 12, color: 'var(--rust-500)', marginTop: 2, fontWeight: 500 }}>{error}</div>}
    </label>
  );
}


/* Uses the photo when the file exists, and falls back to initials so the
   page never shows a broken image or a stock placeholder. */
function ExpertAvatar({ size = 64 }) {
  const [failed, setFailed] = React.useState(false);
  const common = {
    width: size, height: size, borderRadius: '50%', flexShrink: 0,
    boxShadow: 'var(--shadow-sm)', objectFit: 'cover',
  };
  if (EXPERT.photo && !failed) {
    return <img src={EXPERT.photo} alt="" style={common} onError={() => setFailed(true)} />;
  }
  return (
    <div aria-hidden="true" style={{
      ...common,
      background: 'var(--navy-600)', color: 'var(--amber-300)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-display)', fontSize: Math.round(size * 0.36), fontWeight: 600,
    }}>{EXPERT.initials}</div>
  );
}

export default BookingPage;
