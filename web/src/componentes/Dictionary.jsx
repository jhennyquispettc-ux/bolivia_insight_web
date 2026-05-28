import React, { useState } from 'react';
import IMG from '../ui/imagenes.jsx';
import I from '../ui/iconos.jsx';
import Btn from '../ui/Boton.jsx';

function Dictionary({ onBack, onExpert, embedded }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [playing, setPlaying] = useState(null);

  const words = [
    
    { id: 'llajua',    word: 'Llajua',     ipa: '/ˈʝa.xwa/',     cat: 'food',    feat: true,
      def: 'Spicy salsa of locoto, tomato, and quirquiña. On every Bolivian table.',
      example: '"Pásame la llajua, por favor."', region: 'altiplano' },
    { id: 'yapa',      word: 'Yapa',       ipa: '/ˈʝa.pa/',      cat: 'travel',  feat: true,
      def: 'A small free extra given by a vendor — Quechua origin. Ask politely and you might get one.',
      example: '"Caserita, ¿me regala una yapita?"', region: 'all' },
    { id: 'kencha',    word: 'Kencha',     ipa: '/ˈken.tʃa/',    cat: 'slang',   feat: true,
      def: 'Bad luck, jinx. Used semi-seriously when something is going wrong.',
      example: '"Qué kencha, perdimos el bus."', region: 'all' },
    { id: 'salteña',   word: 'Salteña',    ipa: '/salˈte.ɲa/',   cat: 'food',    feat: true,
      def: 'Juicy mid-morning baked empanada. Eat it standing, lean forward, never before 10:30am.',
      example: '"Una salteña de pollo y un mate, por favor."', region: 'metro' },
    { id: 'cholita',   word: 'Cholita',    ipa: '/tʃoˈli.ta/',   cat: 'culture', feat: true,
      def: 'Indigenous Aymara/Quechua woman, often in pollera skirt and bowler hat. The term is reclaimed and proud.',
      example: '"Vamos a la lucha de cholitas en El Alto el domingo."', region: 'metro' },
    { id: 'pasanaku',  word: 'Pasanaku',   ipa: '/pa.saˈna.ku/', cat: 'money',   feat: true,
      def: 'Rotating savings circle. Quechua origin. Friends pool money monthly; one person collects each round.',
      example: '"Estoy en un pasanaku con las del trabajo."', region: 'all' },

    
    { id: 'achachay',  word: 'Achachay',   ipa: '/a.tʃaˈtʃai/',  cat: 'slang',   def: 'It\'s freezing! Quechua exclamation.', example: '"Achachay, qué frío en La Paz."', region: 'altiplano' },
    { id: 'apthapi',   word: 'Apthapi',    ipa: '/apˈta.pi/',    cat: 'food',    def: 'Communal Aymara meal. Everyone brings something, food spread on a cloth.', example: '"Todos al apthapi del sábado."', region: 'altiplano' },
    { id: 'awicha',    word: 'Awicha',     ipa: '/aˈwi.tʃa/',    cat: 'culture', def: 'Grandmother (Aymara/Quechua mix). Affectionate.', example: '"Mi awicha vive en Achacachi."', region: 'altiplano' },
    { id: 'bollo',     word: 'Bollo',      ipa: '/ˈbo.ʝo/',      cat: 'slang',   def: 'A mess, a problem. Distinct from peninsular Spanish meaning.', example: '"Se armó un bollo en la terminal."', region: 'all' },
    { id: 'chaco',     word: 'Chaco',      ipa: '/ˈtʃa.ko/',     cat: 'travel',  def: 'Lowland scrubland region in southeast Bolivia. Hot, dry, distinct culture.', example: '"Vamos al Chaco a Camiri."', region: 'oriente' },
    { id: 'chamame',   word: 'Chamamé',    ipa: '/tʃa.maˈme/',   cat: 'culture', def: 'Folk music genre from the lowlands, accordion-led.', example: '"En Tarija siempre hay chamamé."', region: 'valles' },
    { id: 'chompa',    word: 'Chompa',     ipa: '/ˈtʃom.pa/',    cat: 'travel',  def: 'Sweater. Buy a real alpaca one before going above 3,500 m.', example: '"Necesitas una chompa para Uyuni."', region: 'all' },
    { id: 'chuño',     word: 'Chuño',      ipa: '/ˈtʃu.ɲo/',     cat: 'food',    def: 'Freeze-dried potato. Pre-Inca preservation. Surprisingly versatile.', example: '"Chairo lleva chuño y carne."', region: 'altiplano' },
    { id: 'chuto',     word: 'Chuto',      ipa: '/ˈtʃu.to/',     cat: 'travel',  def: 'Smuggled / un-registered (often a car). Common in informal economy.', example: '"Es un auto chuto, no tiene papeles."', region: 'all' },
    { id: 'cocoroco',  word: 'Cocoroco',   ipa: '/ko.koˈro.ko/', cat: 'food',    def: 'Sugar-cane spirit, ~96° proof. Used in rituals and very strong cocktails.', example: '"Un sorbito de cocoroco para la Pachamama."', region: 'all' },
    { id: 'cuate',     word: 'Cuate',      ipa: '/ˈkwa.te/',     cat: 'slang',   def: 'Friend, buddy. Very common, casual.', example: '"¿Qué tal, cuate?"', region: 'all' },
    { id: 'flete',     word: 'Flete',      ipa: '/ˈfle.te/',     cat: 'travel',  def: 'Fare or freight. In La Paz, often the price of a private taxi or moving truck.', example: '"¿Cuánto cobra de flete a Sopocachi?"', region: 'metro' },
    { id: 'ghetto',    word: 'Guita',      ipa: '/ˈɡi.ta/',      cat: 'money',   def: 'Cash, money. Lunfardo borrowing, common in cities.', example: '"No tengo guita para el taxi."', region: 'all' },
    { id: 'huaso',     word: 'Huaso',      ipa: '/ˈwa.so/',      cat: 'slang',   def: 'Country person, often used affectionately or self-deprecatingly.', example: '"Soy un huaso del campo, no de la ciudad."', region: 'valles' },
    { id: 'jallalla',  word: 'Jallalla',   ipa: '/xaˈʝa.ʝa/',    cat: 'culture', def: 'Aymara cheer / blessing. "Long live!" Used at events and ceremonies.', example: '"¡Jallalla Bolivia!"', region: 'altiplano' },
    { id: 'jukear',    word: 'Jukear',     ipa: '/xuˈke.aɾ/',    cat: 'travel',  def: 'To skip class / work / a tour stop. Backpacker word.', example: '"Vamos a jukear el museo."', region: 'all' },
    { id: 'minga',     word: 'Minga',      ipa: '/ˈmin.ɡa/',     cat: 'culture', def: 'Communal labor, Quechua origin. Volunteer collective work for the village.', example: '"Hoy hay minga para arreglar el camino."', region: 'altiplano' },
    { id: 'paro',      word: 'Paro',       ipa: '/ˈpa.ɾo/',      cat: 'travel',  def: 'Strike, blockade. Check before any overland trip.', example: '"Hay paro en Caranavi mañana."', region: 'all' },
    { id: 'pega',      word: 'Pega',       ipa: '/ˈpe.ɣa/',      cat: 'slang',   def: 'Job, work. "Conseguir una pega" = land a gig.', example: '"¿Tenés pega ahora?"', region: 'all' },
    { id: 'pucha',     word: 'Pucha',      ipa: '/ˈpu.tʃa/',     cat: 'slang',   def: 'Mild expression of dismay or surprise. "Dang."', example: '"¡Pucha, perdimos el último teleférico!"', region: 'all' },
    { id: 'rocoto',    word: 'Rocoto',     ipa: '/roˈko.to/',    cat: 'food',    def: 'Large, round, very spicy chili. Andean staple.', example: '"Cuidado con el rocoto relleno."', region: 'all' },
    { id: 'sucucho',   word: 'Sucucho',    ipa: '/suˈku.tʃo/',   cat: 'travel',  def: 'Tiny, dim spot — often a tucked-away restaurant. Not a put-down.', example: '"Conozco un sucucho en San Pedro con un saice tremendo."', region: 'all' },
    { id: 'trufi',     word: 'Trufi',      ipa: '/ˈtɾu.fi/',     cat: 'travel',  def: 'Shared taxi running a fixed route. Cheaper than a regular cab. Wave one down on the avenue.', example: '"Toma el trufi 2 hasta el Prado."', region: 'metro' },
    { id: 'wawa',      word: 'Wawa',       ipa: '/ˈwa.wa/',      cat: 'culture', def: 'Baby or small child (Quechua/Aymara). Also: bread doll for All Souls\' Day.', example: '"La wawa está dormida."', region: 'all' },
    { id: 'yatiri',    word: 'Yatiri',     ipa: '/jaˈti.ɾi/',    cat: 'culture', def: 'Aymara spiritual practitioner who reads coca leaves and performs offerings.', example: '"Vamos donde el yatiri en El Alto."', region: 'altiplano' },
  ];

  const filters = [
    { id: 'all',     label: 'All' },
    { id: 'food',    label: 'Food' },
    { id: 'slang',   label: 'Slang' },
    { id: 'culture', label: 'Culture' },
    { id: 'travel',  label: 'Travel' },
    { id: 'money',   label: 'Money' },
  ];

  const matches = words.filter(w => {
    if (filter !== 'all' && w.cat !== filter) return false;
    if (query) {
      const q = query.toLowerCase();
      return w.word.toLowerCase().includes(q) || w.def.toLowerCase().includes(q) || w.example.toLowerCase().includes(q);
    }
    return true;
  });
  const featured = matches.filter(w => w.feat);
  const browse = matches.filter(w => !w.feat).sort((a, b) => a.word.localeCompare(b.word));

  const handlePlay = (id) => {
    setPlaying(id);
    setTimeout(() => setPlaying(null), 1200);
  };

  const vignettes = [
    { tag: 'On the bus to Copacabana', body: 'The cobrador yells "sube, sube, sube" and slaps the side of the minibus three times. That\'s your last warning.' },
    { tag: 'Mercado Lanza, La Paz',    body: 'You order a sandwich. The vendor adds two extra pieces of cheese without saying a word. That was the yapa.' },
    { tag: 'Aymara new year, Tiwanaku', body: 'At dawn the crowd raises its hands toward the sun and shouts "Jallalla". You feel the cold and the heat at once.' },
  ];

  return (
    <div style={{ background: 'var(--bg)', minHeight: embedded ? 'auto' : '100vh' }}>

      {}
      {!embedded && (
      <section style={{
        color: '#fff', padding: '80px 0 88px', position: 'relative', overflow: 'hidden',
      }}>
        {}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: IMG.photoCustoms,
          backgroundSize: 'cover', backgroundPosition: 'center',
        }}/>
        {}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(20,32,53,0.85) 0%, rgba(66,47,92,0.8) 60%, rgba(13,18,30,0.92) 100%)',
        }}/>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 460, height: 460, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,183,3,0.18) 0%, transparent 70%)' }}/>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', position: 'relative' }}>
          <button onClick={onBack} style={{
            background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)',
            color: '#fff', padding: '8px 14px', borderRadius: 999, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, marginBottom: 24,
          }}><I.ArrowL size={13}/> Back to home</button>
          <div className="eyebrow" style={{ color: 'var(--amber-300)' }}>Cultural Dictionary · Bolivian Spanish, Aymara, Quechua</div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(48px,7vw,96px)', lineHeight: 0.95,
            color: '#fff', margin: '12px 0 0', fontWeight: 600, letterSpacing: '-0.035em', maxWidth: 1000,
          }}>The words that aren't<br/><em style={{ fontStyle: 'normal', fontWeight: 800, color: 'var(--amber-300)' }}>in the phrasebook.</em></h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.85)', marginTop: 18, maxWidth: 660, lineHeight: 1.55 }}>
            Hundred-plus Bolivian-Spanish, Aymara, and Quechua words travelers actually hear — said by people who use them every day.
          </p>
        </div>
      </section>
      )}

      {}
      <section style={{
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid var(--border)', position: 'sticky', top: embedded ? 124 : 64, zIndex: 20,
        padding: '18px 0',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px',
          display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <label htmlFor="bi-dict-search" style={{
            display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 280,
            background: '#fff', border: '1px solid var(--border-strong)',
            borderRadius: 999, padding: '10px 18px',
          }}>
            <I.Search size={18}/>
            <input id="bi-dict-search"
              value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search a word, meaning, or example…"
              aria-label="Search dictionary"
              style={{
                flex: 1, border: 0, outline: 'none', background: 'transparent',
                fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--fg1)', minHeight: 24,
              }}/>
            {query && (
              <button onClick={() => setQuery('')} aria-label="Clear search" style={{
                background: 'transparent', border: 0, cursor: 'pointer', padding: 4,
                color: 'var(--fg3)', display: 'flex', alignItems: 'center',
              }}><I.X size={16}/></button>
            )}
          </label>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {filters.map(f => {
              const active = filter === f.id;
              return (
                <button key={f.id} onClick={() => setFilter(f.id)}
                  aria-pressed={active}
                  style={{
                    padding: '8px 14px', borderRadius: 999,
                    border: active ? '1px solid var(--rust-500)' : '1px solid var(--border)',
                    background: active ? 'var(--rust-500)' : '#fff',
                    color: active ? '#fff' : 'var(--fg1)',
                    fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600,
                    cursor: 'pointer', transition: 'all 160ms', minHeight: 36,
                  }}>{f.label}</button>
              );
            })}
          </div>
        </div>
      </section>

      {}
      {featured.length > 0 && (
        <section style={{ padding: '56px 0 24px', background: 'var(--bg)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
            <div className="eyebrow" style={{ marginBottom: 18 }}>Start here · the six you will hear today</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
              {featured.map(w => (
                <FeaturedCard key={w.id} word={w} playing={playing === w.id} onPlay={() => handlePlay(w.id)}/>
              ))}
            </div>
          </div>
        </section>
      )}

      {}
      <section style={{ padding: '40px 0 80px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          {browse.length > 0 ? (
            <>
              <div className="eyebrow" style={{ marginBottom: 18 }}>A — Z · {browse.length} words</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
                {browse.map(w => (
                  <BrowseCard key={w.id} word={w} playing={playing === w.id} onPlay={() => handlePlay(w.id)}/>
                ))}
              </div>
            </>
          ) : matches.length === 0 && (
            <div style={{
              padding: '72px 32px', textAlign: 'center', borderRadius: 16,
              background: 'var(--stone-50)', border: '1px dashed var(--border-strong)',
            }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 500 }}>Nothing matches "{query}".</div>
              <p style={{ color: 'var(--fg2)', marginTop: 10 }}>Try a different word or clear the filter — we add new entries every month.</p>
              <Btn kind="ghost" size="md" style={{ marginTop: 18 }} onClick={() => { setQuery(''); setFilter('all'); }}>Reset filters</Btn>
            </div>
          )}
        </div>
      </section>

      {}
      <section style={{ padding: '80px 0', background: 'var(--stone-25)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ maxWidth: 720, marginBottom: 32 }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>Heard in the wild</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,3.4vw,44px)', margin: 0, fontWeight: 600, lineHeight: 1.05 }}>
              Three sentences you'll wish you had on day one.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
            {vignettes.map((v, i) => (
              <article key={i} style={{
                background: '#fff', borderRadius: 16, padding: 28,
                border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)',
              }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--rust-500)', fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase' }}>{v.tag}</div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--fg1)', marginTop: 12, lineHeight: 1.4, fontWeight: 500 }}>{v.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {}
      <section style={{ background: 'var(--navy-700)', color: '#fff', padding: '64px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px',
          display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div className="eyebrow" style={{ color: 'var(--amber-300)' }}>Want to practice before you go?</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px,3.2vw,36px)', margin: '8px 0 0', fontWeight: 600, lineHeight: 1.15 }}>
              Book a 15-minute call with a local writer.
            </h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.78)', marginTop: 10, maxWidth: 520, lineHeight: 1.55 }}>
              They'll teach you the five words you'll need at customs, in a market, and in a taxi. From $12.
            </p>
          </div>
          <Btn kind="amber" size="lg" onClick={onExpert}>Talk to a local <I.ArrowR size={15}/></Btn>
        </div>
      </section>
    </div>
  );
}

function FeaturedCard({ word, playing, onPlay }) {
  return (
    <article style={{
      background: 'var(--stone-25)', borderRadius: 16, padding: 24,
      border: '1px solid var(--border)', display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 36, margin: 0, fontWeight: 600, lineHeight: 1, letterSpacing: '-0.02em' }}>{word.word}</h3>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg3)', marginTop: 6, letterSpacing: 0.3 }}>{word.ipa}</div>
        </div>
        <button onClick={onPlay} aria-label={`Play pronunciation of ${word.word}`} style={{
          width: 44, height: 44, borderRadius: 999,
          background: playing ? 'var(--rust-500)' : '#fff',
          color: playing ? '#fff' : 'var(--rust-500)',
          border: '1px solid var(--rust-200, #f4c8bf)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, transition: 'all 160ms',
        }}><I.Volume size={18}/></button>
      </div>
      <p style={{ fontSize: 14, color: 'var(--fg2)', lineHeight: 1.55, marginTop: 14, flex: 1 }}>{word.def}</p>
      <p style={{
        fontStyle: 'italic', fontSize: 13, color: 'var(--fg2)',
        marginTop: 14, padding: '12px 14px', background: '#fff', borderRadius: 10,
        borderLeft: '3px solid var(--amber-500)',
      }}>{word.example}</p>
    </article>
  );
}

function BrowseCard({ word, playing, onPlay }) {
  return (
    <article style={{
      background: '#fff', borderRadius: 12, padding: 18,
      border: '1px solid var(--border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, margin: 0, fontWeight: 500, lineHeight: 1.1 }}>{word.word}</h3>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg3)', marginTop: 4, letterSpacing: 0.3 }}>{word.ipa}</div>
        </div>
        <button onClick={onPlay} aria-label={`Play pronunciation of ${word.word}`} style={{
          width: 36, height: 36, borderRadius: 999,
          background: playing ? 'var(--rust-500)' : 'var(--stone-50)',
          color: playing ? '#fff' : 'var(--fg2)',
          border: 0, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, transition: 'all 160ms',
        }}><I.Volume size={15}/></button>
      </div>
      <p style={{ fontSize: 13, color: 'var(--fg2)', lineHeight: 1.5, marginTop: 10 }}>{word.def}</p>
    </article>
  );
}

export default Dictionary;
