import React, { useState, useEffect } from 'react';
import { useI18n } from '../data/translations.jsx';
import I from '../ui/iconos.jsx';
import Btn from '../ui/Boton.jsx';

function NavBar({ current, onNav, dark, user, onLogout }) {
  const { t, locale, changeLocale } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [vw, setVw] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawer]);

  const isMobile = vw < 960;
  const onLight = !dark || scrolled;

  const items = [
    { id: 'destinations', label: t('nav.destinations', 'Destinations'),  icon: <I.Pin size={16}/> },
    { id: 'dashboard',    label: t('nav.dashboard', 'Live Dashboard'), icon: <I.Activity size={16}/>, live: true },
    { id: 'guides',       label: t('nav.guides', 'Travel Guide'),   icon: <I.Book size={16}/> },
    { id: 'planner',      label: t('nav.planner', 'Planificador'), icon: <I.Route size={16}/> },
    { id: 'sos',          label: t('nav.sos', 'SOS'),            icon: <I.Alert size={16}/>, accent: 'rust' },
  ];

  const goto = (id) => { setDrawer(false); onNav(id); };

  const getLangLabel = (code) => {
    switch (code) {
      case 'en': return 'EN';
      case 'es': return 'ES';
      case 'pt': return 'PT';
      case 'fr': return 'FR';
      case 'ja': return 'JA';
      case 'ko': return 'KO';
      default: return code.toUpperCase();
    }
  };

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 60,
        transition: 'all 280ms var(--ease-out)',
        background: scrolled
          ? 'rgba(248,249,250,0.82)'
          : (dark ? 'rgba(13,18,30,0.32)' : 'rgba(255,255,255,0.32)'),
        backdropFilter: 'blur(18px) saturate(140%)',
        WebkitBackdropFilter: 'blur(18px) saturate(140%)',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid rgba(255,255,255,0.12)',
      }}>
        <div style={{
          maxWidth: 1400, margin: '0 auto',
          padding: isMobile ? '12px 18px' : '14px 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
        }}>
          {}
          <button onClick={() => goto('home')} aria-label="Bolivia Insight — home" style={{
            background: 'none', border: 0, cursor: 'pointer', padding: 0,
            display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
          }}>
            <img src="assets/logos/logo-mark-256.png" alt="" style={{
              height: 30,
              filter: onLight ? 'none' : 'brightness(0) invert(1)',
              transition: 'filter 220ms',
            }}/>
            <span style={{
              fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 18,
              letterSpacing: '-0.01em',
              color: onLight ? 'var(--rust-500)' : 'var(--rust-300)',
            }}>Bolivia<span style={{
              color: onLight ? 'var(--amber-600)' : 'var(--amber-400)', fontWeight: 600,
            }}>Insight</span></span>
          </button>

          {/* Desktop nav */}
          {!isMobile && (
            <nav style={{ display: 'flex', gap: 2 }} aria-label="Primary">
              {items.map(it => {
                const active = current === it.id;
                const isSos = it.accent === 'rust';
                return (
                  <button key={it.id} onClick={() => goto(it.id)}
                    aria-current={active ? 'page' : undefined}
                    style={{
                      background: active
                        ? (onLight ? 'rgba(27,42,65,0.08)' : 'rgba(255,255,255,0.18)')
                        : 'transparent',
                      border: 0, cursor: 'pointer',
                      padding: '9px 14px', borderRadius: 999,
                      fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 600,
                      color: isSos
                        ? (onLight ? 'var(--rust-600)' : 'var(--rust-300)')
                        : (onLight ? 'var(--navy-700)' : '#fff'),
                      transition: 'all 160ms',
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      whiteSpace: 'nowrap',
                    }}>
                    {it.label}
                    {it.live && <LivePulse onLight={onLight}/>}
                  </button>
                );
              })}
            </nav>
          )}

          {}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {!isMobile && (
              <div style={{ position: 'relative' }}>
                <button aria-label="Language Selector" onClick={() => setLangOpen(!langOpen)} style={{
                  background: 'transparent', border: 0, cursor: 'pointer',
                  color: onLight ? 'var(--navy-700)' : '#fff',
                  padding: '8px 12px', borderRadius: 999,
                  fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <I.Globe size={15}/> {getLangLabel(locale)}
                </button>
                {langOpen && (
                  <>
                    <div onClick={() => setLangOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 90 }} />
                    <div style={{
                      position: 'absolute', top: '100%', right: 0, marginTop: 8,
                      background: scrolled ? 'rgba(255,255,255,0.92)' : 'rgba(13,18,30,0.92)',
                      border: scrolled ? '1px solid var(--border)' : '1px solid rgba(255,255,255,0.15)',
                      borderRadius: 14, padding: '6px', minWidth: 160,
                      boxShadow: 'var(--shadow-lg)', zIndex: 100,
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      display: 'flex', flexDirection: 'column', gap: 2,
                      animation: 'bi-fade 150ms var(--ease-out)',
                    }}>
                      {[
                        { code: 'en', label: '🇺🇸 English' },
                        { code: 'es', label: '🇪🇸 Español' },
                        { code: 'pt', label: '🇧🇷 Português' },
                        { code: 'fr', label: '🇫🇷 Français' },
                        { code: 'ja', label: '🇯🇵 日本語' },
                        { code: 'ko', label: '🇰🇷 한국어' },
                      ].map(l => (
                        <button key={l.code} onClick={() => { changeLocale(l.code); setLangOpen(false); }} style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          width: '100%', textAlign: 'left',
                          background: locale === l.code ? 'rgba(179,63,46,0.12)' : 'transparent',
                          border: 0, padding: '8px 12px', borderRadius: 8, cursor: 'pointer',
                          color: scrolled ? 'var(--navy-700)' : '#fff',
                          fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600,
                          transition: 'background 120ms',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                        onMouseLeave={e => e.currentTarget.style.background = locale === l.code ? 'rgba(179,63,46,0.12)' : 'transparent'}>
                          <span>{l.label}</span>
                          {locale === l.code && <I.Check size={13} style={{ color: 'var(--amber-400)' }}/>}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
            {!isMobile && !user && (
              <button aria-label="Sign In" onClick={() => goto('auth')} style={{
                background: 'transparent', border: 0, cursor: 'pointer',
                color: onLight ? 'var(--navy-700)' : '#fff',
                padding: '8px 12px', borderRadius: 999,
                fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>{t('nav.signIn', 'Acceder')}</button>
            )}
            
            {!isMobile && user && (
              <div style={{ position: 'relative' }}>
                <button onClick={() => setProfileOpen(!profileOpen)} style={{
                  background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                  cursor: 'pointer', padding: '4px 12px 4px 4px', borderRadius: 999,
                  display: 'flex', alignItems: 'center', gap: 8,
                  color: onLight ? 'var(--navy-700)' : '#fff',
                  fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600,
                }}>
                  {user.picture ? (
                    <img src={user.picture} alt="Avatar" style={{ width: 26, height: 26, borderRadius: '50%' }} />
                  ) : (
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--navy-700)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {user.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  {user.name ? user.name.split(' ')[0] : t('nav.profile', 'Perfil')}
                </button>
                {profileOpen && (
                  <>
                    <div onClick={() => setProfileOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 90 }} />
                    <div style={{
                      position: 'absolute', top: '100%', right: 0, marginTop: 8,
                      background: 'var(--bg)', border: '1px solid var(--border)',
                      borderRadius: 12, padding: 8, minWidth: 160,
                      boxShadow: 'var(--shadow-lg)', zIndex: 100,
                    }}>
                      <button onClick={() => { setProfileOpen(false); goto('profile'); }} style={{
                        width: '100%', textAlign: 'left', background: 'transparent', border: 0,
                        padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
                        color: 'var(--fg1)', fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600,
                      }}>
                        {t('nav.profile', 'Mi Perfil')}
                      </button>
                      <button onClick={() => { setProfileOpen(false); onLogout(); }} style={{
                        width: '100%', textAlign: 'left', background: 'transparent', border: 0,
                        padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
                        color: 'var(--rust-600)', fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600,
                      }}>
                        {t('nav.logout', 'Cerrar sesión')}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
            {!isMobile && (
              <Btn kind="primary" size="sm" onClick={() => goto('expert')}>
                {t('nav.talkToLocal', 'Talk to a local')} <I.ArrowR size={13}/>
              </Btn>
            )}
            {isMobile && (
              <button onClick={() => setDrawer(true)} aria-label="Open menu" aria-expanded={drawer} style={{
                background: 'transparent', border: 0, cursor: 'pointer',
                color: onLight ? 'var(--navy-700)' : '#fff',
                width: 44, height: 44, borderRadius: 999,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><I.Menu size={22}/></button>
            )}
          </div>
        </div>
      </header>

      {}
      {isMobile && drawer && (
        <>
          <div onClick={() => setDrawer(false)} style={{
            position: 'fixed', inset: 0, zIndex: 70,
            background: 'rgba(13,18,30,0.55)',
            backdropFilter: 'blur(4px)',
            animation: 'bi-fade 180ms var(--ease-out)',
          }}/>
          <aside role="dialog" aria-label="Menu" style={{
            position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 71,
            width: 'min(86vw, 360px)',
            background: 'var(--bg)',
            display: 'flex', flexDirection: 'column',
            boxShadow: '-20px 0 60px -20px rgba(13,18,30,0.4)',
            animation: 'bi-slide-in 240ms var(--ease-out)',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 20px', borderBottom: '1px solid var(--border)',
            }}>
              <span style={{
                fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 16,
                color: 'var(--rust-500)',
              }}>Bolivia<span style={{ color: 'var(--amber-600)', fontWeight: 600 }}>Insight</span></span>
              <button onClick={() => setDrawer(false)} aria-label="Close menu" style={{
                background: 'transparent', border: 0, cursor: 'pointer',
                width: 44, height: 44, borderRadius: 999,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--fg1)',
              }}><I.X size={20}/></button>
            </div>

            <nav style={{ flex: 1, padding: '12px 12px', overflowY: 'auto' }} aria-label="Primary">
              {items.map(it => {
                const active = current === it.id;
                const isSos = it.accent === 'rust';
                return (
                  <button key={it.id} onClick={() => goto(it.id)}
                    aria-current={active ? 'page' : undefined}
                    style={{
                      width: '100%', textAlign: 'left',
                      background: active ? 'var(--stone-50)' : 'transparent',
                      border: 0, cursor: 'pointer',
                      padding: '14px 16px', borderRadius: 12,
                      fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 600,
                      color: isSos ? 'var(--rust-600)' : 'var(--fg1)',
                      display: 'flex', alignItems: 'center', gap: 12,
                      minHeight: 52,
                    }}>
                    <span style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: isSos ? 'var(--rust-50, #fdecea)' : 'var(--stone-50)',
                      color: isSos ? 'var(--rust-600)' : 'var(--navy-700)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>{it.icon}</span>
                    <span style={{ flex: 1 }}>{it.label}</span>
                    {it.live && <LivePulse onLight/>}
                    <I.ArrowR size={15}/>
                  </button>
                );
              })}

              <div style={{ height: 1, background: 'var(--border)', margin: '14px 16px' }}/>

              <button onClick={() => setMobileLangOpen(!mobileLangOpen)} style={{
                width: '100%', textAlign: 'left',
                background: 'transparent', border: 0, cursor: 'pointer',
                padding: '14px 16px', borderRadius: 12,
                fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600,
                color: 'var(--fg2)',
                display: 'flex', alignItems: 'center', gap: 12, minHeight: 52,
                justifyContent: 'space-between',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <I.Globe size={16}/> {t('nav.lang', 'Language · English')}
                </span>
                <span style={{ transform: mobileLangOpen ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 200ms', fontSize: 18, color: 'var(--fg3)' }}>›</span>
              </button>

              {mobileLangOpen && (
                <div style={{
                  padding: '4px 12px 14px 44px',
                  display: 'flex', flexDirection: 'column', gap: 4,
                  animation: 'bi-fade 150ms var(--ease-out)',
                }}>
                  {[
                    { code: 'en', label: '🇺🇸 English' },
                    { code: 'es', label: '🇪🇸 Español' },
                    { code: 'pt', label: '🇧🇷 Português' },
                    { code: 'fr', label: '🇫🇷 Français' },
                    { code: 'ja', label: '🇯🇵 日本語' },
                    { code: 'ko', label: '🇰🇷 한국어' },
                  ].map(l => (
                    <button key={l.code} onClick={() => { changeLocale(l.code); setDrawer(false); setMobileLangOpen(false); }} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      width: '100%', textAlign: 'left', background: locale === l.code ? 'rgba(27, 42, 65, 0.08)' : 'transparent',
                      border: 0, padding: '10px 14px', borderRadius: 8, cursor: 'pointer',
                      color: locale === l.code ? 'var(--rust-600)' : 'var(--fg1)',
                      fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600,
                    }}>
                      <span>{l.label}</span>
                      {locale === l.code && <I.Check size={14} style={{ color: 'var(--rust-500)' }}/>}
                    </button>
                  ))}
                </div>
              )}
            </nav>

            <div style={{ padding: 16, borderTop: '1px solid var(--border)' }}>
              <Btn kind="primary" size="lg" style={{ width: '100%', justifyContent: 'center', marginBottom: 12 }}
                onClick={() => goto('expert')}>
                {t('nav.talkToLocal', 'Talk to a local')} <I.ArrowR size={15}/>
              </Btn>
              
              {!user ? (
                <Btn kind="secondary" size="lg" style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => goto('auth')}>
                  {t('nav.signIn', 'Acceder al Portal')}
                </Btn>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px', background: 'var(--stone-50)', borderRadius: 12 }}>
                    <img src={user.picture} alt="Avatar" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                    <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14 }}>{user.name}</span>
                  </div>
                  <Btn kind="secondary" size="lg" style={{ width: '100%', justifyContent: 'center', color: 'var(--rust-600)' }}
                    onClick={() => { onLogout(); setDrawer(false); }}>
                    {t('nav.logout', 'Cerrar sesión')}
                  </Btn>
                </div>
              )}
              <p style={{ margin: '10px 0 0', fontSize: 11, color: 'var(--fg3)', textAlign: 'center', letterSpacing: 0.3 }}>
                {t('nav.drawerFooter', '15-min call from $12 · Resident experts')}
              </p>
            </div>
          </aside>
        </>
      )}

      <style>{`
        @keyframes bi-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes bi-slide-in { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </>
  );
}

function LivePulse({ onLight }) {
  return (
    <span aria-label="live" style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      marginLeft: 2,
      fontSize: 9, fontWeight: 800, letterSpacing: 0.5,
      color: onLight ? 'var(--green-700, #1f4f3a)' : 'var(--green-300, #95d3b3)',
      textTransform: 'uppercase',
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: 999,
        background: 'var(--green-500)',
        boxShadow: '0 0 0 3px rgba(45,106,79,0.22)',
        animation: 'bi-pulse 1.8s ease-in-out infinite',
      }}/>
      Live
    </span>
  );
}

export default NavBar;
