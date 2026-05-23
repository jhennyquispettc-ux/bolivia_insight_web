/* Bolivia Insight — AI Concierge bubble (popover that grows from bubble) */
function AIConcierge({ expanded, onToggle, onExpert }) {
  const [messages, setMessages] = useState([
    { from: 'ai', text: "Hola, I'm Ayni — your Bolivia Insight concierge. Where are you thinking?" },
  ]);
  const [input, setInput] = useState('');
  const [visible, setVisible] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [vw, setVw] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isMobile = vw < 640;

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 200);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const send = async () => {
    if (!input.trim() || limitReached) return;
    const text = input.trim();
    // Check message limit (20 user messages)
    const userMessages = messages.filter(m => m.from === 'me');
    
    // Intent detection for expert consultation
    const intentKeywords = ['información', 'informacion', 'experto', 'local', 'contacto', 'agendar', 'cita', 'hablar con alguien', 'más detalles'];
    const matchesIntent = intentKeywords.some(k => text.toLowerCase().includes(k));

    if (userMessages.length >= 20 || matchesIntent) {
      setLimitReached(true);
      const ctaMessage = matchesIntent 
        ? "¡Excelente idea! Hablar con un experto local es la mejor forma de planificar tu viaje. "
        : "¡Vaya! Veo que tienes muchas ganas de explorar Bolivia. ";
      
      setMessages(m => [...m, 
        { from: 'me', text },
        { 
          from: 'ai', 
          text: ctaMessage + "¿Sabías que puedes agendar una videollamada personalizada con nuestros expertos locales? \n\nBeneficios:\n✨ Planificación a medida según tus gustos.\n📍 Acceso a lugares 'secretos' que no están en las guías.\n🛠️ Resolución de dudas sobre transporte y logística.\n✅ Ahorro de tiempo y tranquilidad.\n\nSimplemente elige el horario que mejor te convenga y prepárate para vivir una aventura única.",
          isCTA: true 
        }
      ]);
      setInput('');
      return;
    }

    // Add user's message immediately
    const newMessages = [...messages, { from: 'me', text }];
    setMessages(newMessages);
    setInput('');
    
    // Add a temporary typing indicator or just wait
    // We will just wait for the response and append it
    try {
      const res = await fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMessages(m => [...m, { from: 'ai', text: data.reply }]);
      } else {
        console.error("Chat error:", data);
        setMessages(m => [...m, { from: 'ai', text: "Lo siento, I'm having trouble connecting to my brain right now." }]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setMessages(m => [...m, { from: 'ai', text: "Lo siento, my connection is down right now." }]);
    }
  };

  // Hide entirely when not yet scrolled past Hero (and popover is closed)
  if (!visible && !expanded) return null;

  return (
    <>
      {/* Bubble */}
      <button onClick={onToggle} aria-label="Open AI concierge" style={{
        position: 'fixed', right: isMobile ? 20 : 28, bottom: isMobile ? 20 : 28, zIndex: 80,
        width: 64, height: 64, borderRadius: 999,
        background: 'var(--navy-600)',
        color: '#fff', border: 0, cursor: 'pointer',
        boxShadow: '0 12px 32px -8px rgba(27,42,65,0.5), 0 0 0 6px rgba(255,183,3,0.18)',
        animation: 'bi-fade-up 360ms var(--ease-out)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transform: expanded ? 'scale(0.9)' : 'scale(1)',
        transition: 'all 220ms var(--ease-spring)',
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 999,
          background: 'linear-gradient(135deg, var(--amber-500), var(--rust-500))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {expanded ? <I.X size={20}/> : <I.Sparkle size={22}/>}
        </div>
      </button>

      {/* Popover */}
      {expanded && (
        <div style={{
          position: 'fixed',
          right: isMobile ? 12 : 28,
          bottom: isMobile ? 96 : 104,
          left: isMobile ? 12 : 'auto',
          zIndex: 79,
          width: isMobile ? 'auto' : 380,
          height: isMobile ? 'calc(100vh - 120px)' : 520,
          maxHeight: 600,
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(20px)',
          borderRadius: 20,
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column',
          transformOrigin: isMobile ? 'bottom center' : 'bottom right',
          animation: 'bi-grow 220ms var(--ease-spring)',
        }}>
          {/* Header */}
          <div style={{
            padding: '18px 20px',
            background: 'linear-gradient(135deg, var(--navy-600), var(--navy-700))',
            color: '#fff',
            borderRadius: '20px 20px 0 0',
            display: 'flex', alignItems: 'center', gap: 12,
            flexShrink: 0,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 999,
              background: 'linear-gradient(135deg, var(--amber-500), var(--rust-500))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><I.Sparkle size={20}/></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Ayni · Concierge</div>
              <div style={{ fontSize: 11, opacity: 0.7, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--green-400)' }}/>
                Online · La Paz, 14:32
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 12, background: 'var(--stone-25)' }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.from === 'ai' ? 'flex-start' : 'flex-end',
                maxWidth: isMobile ? '90%' : '82%',
                display: 'flex', flexDirection: 'column', gap: 8
              }}>
                <div style={{
                  padding: '10px 14px', borderRadius: 14,
                  background: m.from === 'ai' ? '#fff' : 'var(--rust-500)',
                  color: m.from === 'ai' ? 'var(--fg1)' : '#fff',
                  fontSize: 14, lineHeight: 1.45,
                  border: m.from === 'ai' ? '1px solid var(--border)' : 0,
                  boxShadow: 'var(--shadow-xs)',
                  whiteSpace: 'pre-wrap',
                }}>{m.text}</div>
                
                {m.isCTA && (
                  <button onClick={() => { onToggle(); onExpert(); }} style={{
                    alignSelf: 'flex-start',
                    padding: '8px 16px', borderRadius: 8,
                    background: 'var(--navy-600)', color: '#fff',
                    border: 0, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(27,42,65,0.2)',
                    display: 'flex', alignItems: 'center', gap: 8
                  }}>
                    Consultar Experto Local <I.Calendar size={14}/>
                  </button>
                )}
              </div>
            ))}
            {/* Quick chips */}
            {!limitReached && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                {['Best time for Uyuni?', 'Altitude tips', 'Family with teens'].map(c => (
                  <button key={c} onClick={() => setInput(c)} style={{
                    padding: '6px 12px', borderRadius: 999, border: '1px solid var(--border-strong)',
                    background: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: 'var(--fg1)',
                  }}>{c}</button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{ padding: 14, borderTop: '1px solid var(--border)', background: '#fff', borderRadius: '0 0 20px 20px', flexShrink: 0 }}>
            <div style={{ 
              display: 'flex', alignItems: 'center', gap: 8, padding: '6px 6px 6px 14px', 
              background: limitReached ? 'var(--stone-100)' : 'var(--stone-50)', 
              borderRadius: 999, opacity: limitReached ? 0.6 : 1 
            }}>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
                disabled={limitReached}
                placeholder={limitReached ? "Límite de mensajes" : "Ask Ayni…"} style={{
                flex: 1, border: 0, background: 'transparent', outline: 'none',
                fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--fg1)',
                cursor: limitReached ? 'not-allowed' : 'text',
                minWidth: 0,
              }}/>
              <button onClick={send} disabled={limitReached} style={{
                width: 36, height: 36, borderRadius: 999,
                background: limitReached ? 'var(--stone-300)' : 'var(--rust-500)', 
                color: '#fff', border: 0, cursor: limitReached ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}><I.Send size={15}/></button>
            </div>
            <div style={{ fontSize: 10, color: 'var(--fg3)', marginTop: 8, textAlign: 'center', letterSpacing: 0.3 }}>
              {limitReached ? "Habla con un experto" : "AI suggestions"}
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes bi-grow { from { transform: scale(0.5) translateY(40px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
        @keyframes bi-fade-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          [aria-label="Open AI concierge"] { animation: none !important; }
        }
      `}</style>
    </>
  );
}
window.AIConcierge = AIConcierge;
