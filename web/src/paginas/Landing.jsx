/* Bolivia Insight — Landing page composition */
import React, { useState, useEffect } from 'react';
import { useI18n } from '../data/translations.jsx';
import Hero from '../componentes/Hero.jsx';
import Clusters from '../componentes/Clusters.jsx';
import TabsSection from '../componentes/Tabs.jsx';
import I from '../ui/iconos.jsx';
import Btn from '../ui/Boton.jsx';

function Landing({ heroVariant, onClusterSelect, onExpress, onDashboard, onDictionary, onSos, onExpert }) {
  return (
    <>
      <Hero variant={heroVariant} onCtaClick={onExpress}/>
      <Clusters onSelect={onClusterSelect}/>
      <TabsSection/>
      <CompanionTriptych onDashboard={onDashboard} onDictionary={onDictionary} onSos={onSos}/>
      <BookingBand onExpert={onExpert}/>
      <Footer onNav={(id) => {
        if (id === 'dashboard') onDashboard?.();
        else if (id === 'dictionary') onDictionary?.();
        else if (id === 'sos') onSos?.();
        else if (id === 'guides') onExpress?.();
        else if (id === 'expert') onExpert?.();
      }}/>
    </>
  );
}

/* ===================== Compañero triptych ===================== */
function CompanionTriptych({ onDashboard, onDictionary, onSos }) {
  const { t } = useI18n();
  const [vw, setVw] = React.useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  React.useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isMobile = vw < 768;

  const tools = [
    {
      n: '01',
      eyebrow: t('companion.tool1Eyebrow', 'Tool 01 · Logistics'),
      title: t('companion.tool1Title', 'Live Dashboard'),
      desc: t('companion.tool1Desc', "Roads, cable car, weather, alerts — the things that change while you're on the road. One screen, refreshed every five minutes."),
      cta: t('companion.tool1Cta', 'Open the dashboard'),
      onClick: onDashboard,
      preview: <DashboardPreview/>,
    },
    {
      n: '02',
      eyebrow: t('companion.tool2Eyebrow', 'Tool 02 · Language'),
      title: t('companion.tool2Title', 'Cultural Dictionary'),
      desc: t('companion.tool2Desc', 'Bolivian-Spanish, Aymara, and Quechua words travelers actually hear — said by people who use them every day.'),
      cta: t('companion.tool2Cta', 'Open the dictionary'),
      onClick: onDictionary,
      preview: <DictionaryPreview/>,
    },
    {
      n: '03',
      eyebrow: t('companion.tool3Eyebrow', 'Tool 03 · Safety'),
      title: t('companion.tool3Title', 'Emergency SOS Hub'),
      desc: t('companion.tool3Desc', 'Numbers, hospitals, embassies, verified taxis — by city. Designed to load fast on a bad connection at the worst moment.'),
      cta: t('companion.tool3Cta', 'Open the SOS hub'),
      onClick: onSos,
      preview: <SosPreview/>,
    },
  ];

  const formatTriptychTitle = (text) => {
    const parts = text.split(/[\[\]]/);
    if (parts.length === 3) {
      return (
        <>
          {parts[0]}
          <em style={{ fontStyle: 'normal', fontWeight: 800, color: 'var(--rust-500)' }}>{parts[1]}</em>
          {parts[2]}
        </>
      );
    }
    return text;
  };

  return (
    <section style={{ background: 'var(--bg)', padding: isMobile ? '72px 0 56px' : '120px 0' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: isMobile ? '0 20px' : '0 32px' }}>
        <div style={{ maxWidth: 760, marginBottom: isMobile ? 32 : 56 }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>{t('companion.eyebrow', 'The Compañero · daily-use tools')}</div>
          <h2 style={{
            margin: 0,
            fontSize: isMobile ? 'clamp(28px,8vw,40px)' : 'clamp(36px,4vw,56px)',
            lineHeight: 1.04, fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '-0.02em',
          }}>
            {formatTriptychTitle(t('companion.title', "Three tools you'll open [every morning]."))}
          </h2>
          {!isMobile && (
            <p style={{ fontSize: 18, color: 'var(--fg2)', marginTop: 16, maxWidth: 600, lineHeight: 1.6 }}>
              {t('companion.desc', 'Free, no login, no commission. The Premium 1-to-1 advisory pays for them — so we can keep these honest.')}
            </p>
          )}
        </div>

        {/* Cards: 1-col mobile, auto-fit tablet+desktop */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: isMobile ? 14 : 20,
        }}>
          {tools.map(tool => (
            <button key={tool.n} onClick={tool.onClick} style={{
              background: '#fff', border: '1px solid var(--border)', borderRadius: isMobile ? 14 : 18,
              padding: 0, cursor: 'pointer', textAlign: 'left',
              boxShadow: 'var(--shadow-sm)', display: 'flex',
              flexDirection: isMobile ? 'row' : 'column',
              transition: 'transform 220ms var(--ease-out), box-shadow 220ms var(--ease-out)',
              overflow: 'hidden',
              alignItems: isMobile ? 'center' : 'stretch',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}>

              {/* Preview area: full-width on desktop, compact square on mobile */}
              <div style={{
                width: isMobile ? 80 : '100%',
                height: isMobile ? 80 : 200,
                minWidth: isMobile ? 80 : undefined,
                background: 'var(--stone-25)',
                borderBottom: isMobile ? 0 : '1px solid var(--border)',
                borderRight: isMobile ? '1px solid var(--border)' : 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', overflow: 'hidden',
                flexShrink: 0,
              }}>
                {/* On mobile just show tool number as big glyph */}
                {isMobile ? (
                  <span style={{
                    fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 500,
                    color: 'var(--rust-500)', opacity: 0.7,
                  }}>{tool.n}</span>
                ) : tool.preview}
              </div>

              {/* Text content */}
              <div style={{ padding: isMobile ? '14px 16px' : '24px 26px 26px', flex: 1 }}>
                <div className="eyebrow" style={{ marginBottom: 6 }}>{tool.eyebrow}</div>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: isMobile ? 18 : 28,
                  margin: 0, fontWeight: 500, lineHeight: 1.1,
                }}>{tool.title}</h3>
                {!isMobile && (
                  <p style={{ fontSize: 14, color: 'var(--fg2)', lineHeight: 1.6, margin: '12px 0 18px' }}>{tool.desc}</p>
                )}
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontSize: 13, fontWeight: 700, color: 'var(--rust-500)',
                  letterSpacing: 0.2,
                  marginTop: isMobile ? 6 : 0,
                }}>{tool.cta} <I.ArrowR size={13}/></span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* SVG previews — static, on-brand, lightweight */
function DashboardPreview() {
  return (
    <svg viewBox="0 0 320 200" width="100%" style={{ display: 'block', maxWidth: 320 }}>
      <rect x="20" y="30" width="280" height="48" rx="10" fill="#fff" stroke="var(--border)"/>
      <circle cx="40" cy="54" r="6" fill="var(--green-500)"/>
      <rect x="56" y="44" width="120" height="8" rx="2" fill="var(--fg1)"/>
      <rect x="56" y="58" width="80" height="6" rx="2" fill="var(--fg3)"/>
      <text x="270" y="58" fontSize="12" fontFamily="var(--font-mono)" fill="var(--fg3)" textAnchor="end">RN-1</text>

      <rect x="20" y="86" width="280" height="48" rx="10" fill="#fff" stroke="var(--border)"/>
      <circle cx="40" cy="110" r="6" fill="var(--rust-500)"/>
      <rect x="56" y="100" width="140" height="8" rx="2" fill="var(--fg1)"/>
      <rect x="56" y="114" width="100" height="6" rx="2" fill="var(--rust-500)" opacity="0.6"/>
      <text x="270" y="114" fontSize="12" fontFamily="var(--font-mono)" fill="var(--fg3)" textAnchor="end">RN-2</text>

      <rect x="20" y="142" width="280" height="48" rx="10" fill="#fff" stroke="var(--border)"/>
      <circle cx="40" cy="166" r="6" fill="var(--green-500)"/>
      <rect x="56" y="156" width="110" height="8" rx="2" fill="var(--fg1)"/>
      <rect x="56" y="170" width="90" height="6" rx="2" fill="var(--fg3)"/>
      <text x="270" y="170" fontSize="12" fontFamily="var(--font-mono)" fill="var(--fg3)" textAnchor="end">RN-4</text>
    </svg>
  );
}

function DictionaryPreview() {
  const words = [
    { w: 'Llajua',   def: 'Spicy locoto + tomato salsa' },
    { w: 'Yapa',     def: 'A small free extra' },
    { w: 'Kencha',   def: 'Bad luck, jinx' },
  ];
  return (
    <svg viewBox="0 0 320 200" width="100%" style={{ display: 'block', maxWidth: 320 }}>
      <rect x="20" y="20" width="280" height="36" rx="18" fill="#fff" stroke="var(--border)"/>
      <circle cx="38" cy="38" r="6" stroke="var(--fg3)" strokeWidth="1.6" fill="none"/>
      <line x1="42" y1="42" x2="48" y2="48" stroke="var(--fg3)" strokeWidth="1.6"/>
      <rect x="60" y="34" width="120" height="6" rx="2" fill="var(--fg3)" opacity="0.5"/>

      {words.map((w, i) => (
        <g key={i}>
          <rect x="20" y={70 + i * 42} width="280" height="36" rx="10" fill="var(--stone-25)" stroke="var(--border)"/>
          <text x="32" y={89 + i * 42} fontSize="14" fontFamily="var(--font-display)" fill="var(--fg1)" fontWeight="500">{w.w}</text>
          <text x="32" y={101 + i * 42} fontSize="9" fontFamily="var(--font-sans)" fill="var(--fg3)" fontWeight="500">{w.def}</text>
          <circle cx="284" cy={88 + i * 42} r="11" fill="var(--rust-500)"/>
          <polygon points={`280,${83 + i * 42} 280,${93 + i * 42} 289,${88 + i * 42}`} fill="#fff"/>
        </g>
      ))}
    </svg>
  );
}

function SosPreview() {
  return (
    <svg viewBox="0 0 320 200" width="100%" style={{ display: 'block', maxWidth: 320 }}>
      <rect x="20" y="22" width="135" height="76" rx="14" fill="var(--rust-500)"/>
      <rect x="36" y="38" width="40" height="40" rx="10" fill="rgba(255,255,255,0.2)"/>
      <path d="M48 50 v8 m-4 -4 h8" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"/>
      <text x="86" y="56" fontSize="9" fontFamily="var(--font-sans)" fill="rgba(255,255,255,0.85)" fontWeight="800" letterSpacing="0.4">POLICE</text>
      <text x="86" y="78" fontSize="22" fontFamily="var(--font-display)" fill="#fff" fontWeight="500">110</text>

      <rect x="165" y="22" width="135" height="76" rx="14" fill="var(--rust-500)"/>
      <rect x="181" y="38" width="40" height="40" rx="10" fill="rgba(255,255,255,0.2)"/>
      <path d="M201 48 c-3 0 -5 2 -5 5 c0 3 5 8 5 8 c0 0 5 -5 5 -8 c0 -3 -2 -5 -5 -5 z" fill="#fff"/>
      <text x="231" y="56" fontSize="9" fontFamily="var(--font-sans)" fill="rgba(255,255,255,0.85)" fontWeight="800" letterSpacing="0.4">MEDICAL</text>
      <text x="231" y="78" fontSize="22" fontFamily="var(--font-display)" fill="#fff" fontWeight="500">118</text>

      <rect x="20" y="110" width="280" height="36" rx="10" fill="#fff" stroke="var(--border)"/>
      <rect x="32" y="122" width="80" height="12" rx="3" fill="var(--navy-700)"/>
      <text x="120" y="132" fontSize="10" fontFamily="var(--font-sans)" fill="var(--fg2)" fontWeight="500">Hospital · Sopocachi</text>

      <rect x="20" y="152" width="280" height="36" rx="10" fill="#fff" stroke="var(--border)"/>
      <rect x="32" y="164" width="80" height="12" rx="3" fill="var(--navy-700)"/>
      <text x="120" y="174" fontSize="10" fontFamily="var(--font-sans)" fill="var(--fg2)" fontWeight="500">Embassy · La Paz</text>
    </svg>
  );
}

/* ===================== Booking band (pre-footer) ===================== */
function BookingBand({ onExpert }) {
  const { t } = useI18n();
  const [vw, setVw] = React.useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  React.useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isMobile = vw < 768;

  const experts = [
    { initials: 'CV', color: 'var(--rust-500)' },
    { initials: 'MR', color: 'var(--mystic-700)' },
    { initials: 'LM', color: 'var(--amber-600)' },
    { initials: 'DV', color: 'var(--green-500)' },
  ];

  const formatBookingTitle = (text) => {
    const parts = text.split(/[\[\]]/);
    if (parts.length === 3) {
      return (
        <>
          {parts[0]}
          <em style={{ fontStyle: 'normal', fontWeight: 800, color: 'var(--amber-300)' }}>{parts[1]}</em>
          {parts[2]}
        </>
      );
    }
    return text;
  };

  return (
    <section style={{
      background: 'linear-gradient(135deg, var(--navy-700) 0%, var(--mystic-700) 100%)',
      color: '#fff', padding: isMobile ? '64px 0' : '96px 0', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -80, right: -80, width: 360, height: 360, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,183,3,0.14) 0%, transparent 70%)', pointerEvents: 'none',
      }}/>
      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 20px' : '0 32px',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr',
        gap: isMobile ? 36 : 60,
        alignItems: 'center', position: 'relative',
      }}>
        {/* Left: headline + stats */}
        <div>
          <div className="eyebrow" style={{ color: 'var(--amber-300)', marginBottom: 14 }}>{t('booking.eyebrow', 'Premium 1-to-1 advisory · From $12')}</div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: isMobile ? 'clamp(28px,8vw,44px)' : 'clamp(36px,5vw,68px)',
            margin: 0, fontWeight: 600, lineHeight: 0.98, letterSpacing: '-0.03em', color: '#fff',
          }}>
            {formatBookingTitle(t('booking.title', 'When the data and the dictionary run out — [talk to a person who walks the route].'))}
          </h2>
          <p style={{ fontSize: isMobile ? 15 : 17, color: 'rgba(255,255,255,0.82)', marginTop: 18, maxWidth: 580, lineHeight: 1.55 }}>
            {t('booking.desc', 'Fifteen or thirty minutes by video with a resident writer. They audit your itinerary, optimize routes, and answer the questions no app can.')}
          </p>
          <div style={{ display: 'flex', gap: isMobile ? 20 : 28, marginTop: 28, flexWrap: 'wrap' }}>
            {[
              { k: t('booking.stat1Key', '4'),     v: t('booking.stat1Val', 'Local experts') },
              { k: t('booking.stat2Key', '~24h'),  v: t('booking.stat2Val', 'Avg confirm') },
              { k: t('booking.stat3Key', '4.9'),   v: t('booking.stat3Val', 'Avg rating · 887 calls') },
            ].map(s => (
              <div key={s.k}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? 24 : 30, fontWeight: 500, color: 'var(--amber-300)', lineHeight: 1 }}>{s.k}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', letterSpacing: 0.4, fontWeight: 600, textTransform: 'uppercase', marginTop: 4 }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: avatars + CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'flex-start' : 'flex-start', gap: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {experts.map((e, i) => (
              <div key={i} style={{
                width: isMobile ? 48 : 60, height: isMobile ? 48 : 60, borderRadius: '50%', background: e.color,
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: isMobile ? 13 : 16,
                border: '3px solid var(--navy-700)', marginLeft: i === 0 ? 0 : -14,
                boxShadow: '0 4px 14px -4px rgba(0,0,0,0.4)',
                fontFamily: 'var(--font-sans)',
              }}>{e.initials}</div>
            ))}
            <div style={{
              marginLeft: 14, padding: '6px 12px', borderRadius: 999,
              background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.28)',
              fontSize: 12, fontWeight: 700, letterSpacing: 0.3,
            }}>From $12 · 15 min</div>
          </div>
          <Btn kind="amber" size={isMobile ? 'md' : 'lg'} onClick={onExpert} style={{ alignSelf: 'flex-start' }}>
            {t('booking.btn', 'Book a 15-min call')} <I.ArrowR size={15}/>
          </Btn>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', maxWidth: 320, lineHeight: 1.5, fontFamily: 'var(--font-mono)', letterSpacing: 0.3 }}>
            {t('booking.note', 'STRIPE CHECKOUT · REFUNDABLE 12H BEFORE · GOOGLE MEET LINK ARRIVES 1H BEFORE')}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ===================== Footer ===================== */
function Footer({ onNav }) {
  const { t } = useI18n();
  const [vw, setVw] = React.useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [openCol, setOpenCol] = React.useState(null); // mobile accordion

  React.useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isMobile = vw < 640;

  const cols = [
    { h: t('footer.explore', 'Explore'),   l: [
      { t: t('nav.destinations', 'Destinations'),              id: 'destinations' },
      { t: t('footer.suggestedRoutes', 'Suggested routes'),    id: 'destinations' },
      { t: t('footer.whatToDo', 'What to do'),                 id: 'destinations' },
      { t: t('footer.festivalsEvents', 'Festivals & events'),  id: 'destinations' },
    ]},
    { h: t('footer.tools', 'Tools'),     l: [
      { t: t('nav.dashboard', 'Live Dashboard'),               id: 'dashboard' },
      { t: t('nav.dictionary', 'Cultural Dictionary'),         id: 'dictionary' },
      { t: t('nav.guides', 'Travel Guide'),                    id: 'guides' },
      { t: t('nav.sos', 'Emergency Hub'),                      id: 'sos' },
    ]},
    { h: t('footer.getHelp', 'Get help'),  l: [
      { t: t('footer.talkToLocal', 'Talk to a local · $12'),   id: 'expert' },
      { t: t('footer.aiConcierge', 'AI concierge'),            id: 'expert' },
      { t: t('footer.contact', 'Contact'),                     id: 'expert' },
      { t: t('footer.sources', 'Sources'),                     id: 'expert' },
    ]},
  ];

  return (
    <footer style={{ background: 'var(--navy-800)', color: 'rgba(255,255,255,0.7)', padding: isMobile ? '52px 0 28px' : '72px 0 36px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: isMobile ? '0 20px' : '0 32px' }}>

        {/* Brand block — always full width on top in mobile */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr 1fr',
          gap: isMobile ? 0 : 40,
        }}>
          {/* Brand */}
          <div style={{ marginBottom: isMobile ? 32 : 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <img src="assets/logos/logo-mark-256.png" alt="" style={{ height: 32, filter: 'brightness(0) invert(1)' }}/>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 18, color: 'var(--rust-300)' }}>Bolivia<span style={{ color: 'var(--amber-400)', fontWeight: 600 }}>Insight</span></span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.6, maxWidth: 380, margin: 0 }}>
              {t('footer.desc', 'An independent travel guide to Bolivia, written by people who live here. No bookings, no commission — just honest field notes for travelers exploring on their own terms.')}
            </p>
            <div style={{ marginTop: 18, fontSize: 12, fontFamily: 'var(--font-mono)', letterSpacing: 0.4, opacity: 0.5 }}>LA PAZ · SUCRE · UYUNI</div>
          </div>

          {/* Link columns — accordion on mobile, plain list on desktop */}
          {cols.map((col, ci) => (
            <div key={col.h} style={{ borderTop: isMobile ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
              <button
                onClick={() => isMobile ? setOpenCol(openCol === ci ? null : ci) : undefined}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
                  background: 'transparent', border: 0, cursor: isMobile ? 'pointer' : 'default',
                  padding: isMobile ? '14px 0' : '0 0 14px',
                  color: 'var(--amber-400)',
                  fontSize: 11, fontWeight: 800, letterSpacing: 0.4, textTransform: 'uppercase',
                  fontFamily: 'var(--font-sans)',
                }}>
                {col.h}
                {isMobile && (
                  <span style={{ fontSize: 18, opacity: 0.5, transform: openCol === ci ? 'rotate(90deg)' : 'none', transition: 'transform 200ms' }}>›</span>
                )}
              </button>

              {/* Links: always visible on desktop, collapsible on mobile */}
              {(!isMobile || openCol === ci) && (
                <div style={{ paddingBottom: isMobile ? 14 : 0 }}>
                  {col.l.map(x => (
                    <button key={x.t} onClick={() => onNav?.(x.id)} style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      background: 'transparent', border: 0, cursor: 'pointer',
                      color: 'inherit', fontFamily: 'var(--font-sans)',
                      fontSize: 14, padding: '6px 0',
                    }}>{x.t}</button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        maxWidth: 1400, margin: '32px auto 0', padding: isMobile ? '20px 20px 0' : '24px 32px 0',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        fontSize: 12, opacity: 0.5,
        gap: isMobile ? 6 : 12,
        textAlign: isMobile ? 'center' : 'left',
      }}>
        <div>© 2026 Bolivia Insight S.R.L. · La Paz, Bolivia</div>
        <div>{t('footer.privacy', 'Privacy · Terms · Cookies')}</div>
      </div>
    </footer>
  );
}

export default Landing;
