function NavBar({ current, onNav, dark, user, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
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
    { id: 'destinations', label: 'Destinations',  icon: <I.Pin size={16}/> },
    { id: 'dashboard',    label: 'Live Dashboard', icon: <I.Activity size={16}/>, live: true },
    { id: 'guides',       label: 'Travel Guide',   icon: <I.Book size={16}/> },
    { id: 'sos',          label: 'SOS',            icon: <I.Alert size={16}/>, accent: 'rust' },
  ];

  const goto = (id) => { setDrawer(false); onNav(id); };

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
          {/* Logo */}
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

          {/* Right cluster */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {!isMobile && (
              <button aria-label="Language: English" style={{
                background: 'transparent', border: 0, cursor: 'pointer',
                color: onLight ? 'var(--navy-700)' : '#fff',
                padding: '8px 12px', borderRadius: 999,
                fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 6,
              }}><I.Globe size={15}/> EN</button>
            )}
            {!isMobile && !user && (
              <button aria-label="Sign In" onClick={() => goto('auth')} style={{
                background: 'transparent', border: 0, cursor: 'pointer',
                color: onLight ? 'var(--navy-700)' : '#fff',
                padding: '8px 12px', borderRadius: 999,
                fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>Acceder</button>
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
                  {user.name ? user.name.split(' ')[0] : 'Perfil'}
                </button>
                {profileOpen && (
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
                      Mi Perfil
                    </button>
                    <button onClick={() => { setProfileOpen(false); onLogout(); }} style={{
                      width: '100%', textAlign: 'left', background: 'transparent', border: 0,
                      padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
                      color: 'var(--rust-600)', fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600,
                    }}>
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            )}
            {!isMobile && (
              <Btn kind="primary" size="sm" onClick={() => goto('expert')}>
                Talk to a local <I.ArrowR size={13}/>
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

      {/* Mobile drawer */}
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

              <button style={{
                width: '100%', textAlign: 'left',
                background: 'transparent', border: 0, cursor: 'pointer',
                padding: '14px 16px', borderRadius: 12,
                fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600,
                color: 'var(--fg2)',
                display: 'flex', alignItems: 'center', gap: 12, minHeight: 52,
              }}><I.Globe size={16}/> Language · English</button>
            </nav>

            <div style={{ padding: 16, borderTop: '1px solid var(--border)' }}>
              <Btn kind="primary" size="lg" style={{ width: '100%', justifyContent: 'center', marginBottom: 12 }}
                onClick={() => goto('expert')}>
                Talk to a local <I.ArrowR size={15}/>
              </Btn>
              
              {!user ? (
                <Btn kind="secondary" size="lg" style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => goto('auth')}>
                  Acceder al Portal
                </Btn>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px', background: 'var(--stone-50)', borderRadius: 12 }}>
                    <img src={user.picture} alt="Avatar" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                    <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14 }}>{user.name}</span>
                  </div>
                  <Btn kind="secondary" size="lg" style={{ width: '100%', justifyContent: 'center', color: 'var(--rust-600)' }}
                    onClick={() => { onLogout(); setDrawer(false); }}>
                    Cerrar sesión
                  </Btn>
                </div>
              )}
              <p style={{ margin: '10px 0 0', fontSize: 11, color: 'var(--fg3)', textAlign: 'center', letterSpacing: 0.3 }}>
                15-min call from $12 · Resident experts
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

window.NavBar = NavBar;
