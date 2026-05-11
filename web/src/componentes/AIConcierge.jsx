/* Bolivia Insight — AI Concierge bubble (popover that grows from bubble) */
function AIConcierge({ expanded, onToggle }) {
  const [messages, setMessages] = useState([
    { from: 'ai', text: "Hola, I'm Sumaq — your Bolivia Insight concierge. Where are you thinking?" },
  ]);
  const [input, setInput] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 200);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const send = () => {
    if (!input.trim()) return;
    const text = input.trim();
    setMessages(m => [...m, { from: 'me', text }]);
    setInput('');
    setTimeout(() => {
      setMessages(m => [...m, { from: 'ai', text: "Got it. For Uyuni in May, I'd avoid the wet-season tail and push you toward Tunupa side. Want a 3-day draft?" }]);
    }, 700);
  };

  // Hide entirely when not yet scrolled past Hero (and popover is closed)
  if (!visible && !expanded) return null;

  return (
    <>
      {/* Bubble */}
      <button onClick={onToggle} aria-label="Open AI concierge" style={{
        position: 'fixed', right: 28, bottom: 28, zIndex: 80,
        width: expanded ? 64 : 64, height: 64, borderRadius: 999,
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
          position: 'fixed', right: 28, bottom: 104, zIndex: 79,
          width: 380, height: 520,
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(20px)',
          borderRadius: 20,
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column',
          transformOrigin: 'bottom right',
          animation: 'bi-grow 220ms var(--ease-spring)',
        }}>
          {/* Header */}
          <div style={{
            padding: '18px 20px',
            background: 'linear-gradient(135deg, var(--navy-600), var(--navy-700))',
            color: '#fff',
            borderRadius: '20px 20px 0 0',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 999,
              background: 'linear-gradient(135deg, var(--amber-500), var(--rust-500))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><I.Sparkle size={20}/></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Sumaq · Concierge</div>
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
                maxWidth: '82%',
                padding: '10px 14px', borderRadius: 14,
                background: m.from === 'ai' ? '#fff' : 'var(--rust-500)',
                color: m.from === 'ai' ? 'var(--fg1)' : '#fff',
                fontSize: 14, lineHeight: 1.45,
                border: m.from === 'ai' ? '1px solid var(--border)' : 0,
                boxShadow: 'var(--shadow-xs)',
              }}>{m.text}</div>
            ))}
            {/* Quick chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
              {['Best time for Uyuni?', 'Altitude tips', 'Family with teens'].map(c => (
                <button key={c} onClick={() => setInput(c)} style={{
                  padding: '6px 12px', borderRadius: 999, border: '1px solid var(--border-strong)',
                  background: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: 'var(--fg1)',
                }}>{c}</button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div style={{ padding: 14, borderTop: '1px solid var(--border)', background: '#fff', borderRadius: '0 0 20px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 6px 6px 14px', background: 'var(--stone-50)', borderRadius: 999 }}>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Ask Sumaq…" style={{
                flex: 1, border: 0, background: 'transparent', outline: 'none',
                fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--fg1)',
              }}/>
              <button onClick={send} style={{
                width: 36, height: 36, borderRadius: 999,
                background: 'var(--rust-500)', color: '#fff', border: 0, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><I.Send size={15}/></button>
            </div>
            <div style={{ fontSize: 10, color: 'var(--fg3)', marginTop: 8, textAlign: 'center', letterSpacing: 0.3 }}>
              AI suggestions · cross-checked against our local writers' field notes
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
