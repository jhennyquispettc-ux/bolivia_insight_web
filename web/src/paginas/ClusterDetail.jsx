import React from 'react';
import { useI18n } from '../data/translations.jsx';
import { CLUSTERS } from '../data/destinos.jsx';
import I from '../ui/iconos.jsx';
import Btn from '../ui/Boton.jsx';

// Section labels live here rather than in translations.jsx because the values
// they label (altitudes, seasons, journey times) come straight from destinos.jsx
// and read the same in every language.
const L = {
  bestSeason:  { es: 'Mejor época',      en: 'Best season',    pt: 'Melhor época',      fr: 'Meilleure saison', ja: 'ベストシーズン', ko: '최적 시기' },
  altitude:    { es: 'Altitud',          en: 'Altitude',       pt: 'Altitude',          fr: 'Altitude',         ja: '高度',           ko: '고도' },
  timeNeeded:  { es: 'Tiempo necesario', en: 'Time needed',    pt: 'Tempo necessário',  fr: 'Durée conseillée', ja: '推奨日数',       ko: '추천 일정' },
  gateway:     { es: 'Punto de entrada', en: 'Gateway',        pt: 'Porta de entrada',  fr: "Point d'entrée",   ja: '玄関口',         ko: '관문' },
  whatToSee:   { es: 'Qué ver',          en: 'What to see',    pt: 'O que ver',         fr: 'À voir',           ja: '見どころ',       ko: '볼거리' },
  howToGet:    { es: 'Cómo llegar',      en: 'Getting there',  pt: 'Como chegar',       fr: "S'y rendre",       ja: 'アクセス',       ko: '가는 방법' },
  approx:      { es: 'Tiempos y rutas aproximados. Confirma horarios al llegar.',
                 en: 'Times and routes are approximate. Confirm schedules on arrival.',
                 pt: 'Tempos e rotas aproximados. Confirme os horários ao chegar.',
                 fr: 'Durées et trajets approximatifs. Vérifiez les horaires sur place.',
                 ja: '所要時間と経路は目安です。現地で時刻を確認してください。',
                 ko: '소요 시간과 경로는 참고용입니다. 현지에서 시간표를 확인하세요.' },
  goodToKnow:  { es: 'Bueno saberlo',    en: 'Good to know',   pt: 'Bom saber',         fr: 'Bon à savoir',     ja: '知っておくと便利', ko: '알아두면 좋은 점' },
  ctaTitle:    { es: '¿Quieres afinar este recorrido?', en: 'Want to fine-tune this trip?',
                 pt: 'Quer ajustar este roteiro?',      fr: 'Envie d’affiner ce voyage ?',
                 ja: 'この旅を相談しますか？',            ko: '이 여정을 다듬어 볼까요?' },
  ctaBody:     { es: 'Habla 15 minutos con alguien que vive acá y conoce estas rutas.',
                 en: 'Talk for 15 minutes with someone who lives here and knows these routes.',
                 pt: 'Fale 15 minutos com alguém que mora aqui e conhece estas rotas.',
                 fr: 'Parlez 15 minutes avec une personne qui vit ici et connaît ces itinéraires.',
                 ja: '現地に住み、これらのルートを知る人と15分話せます。',
                 ko: '이곳에 살며 이 경로를 잘 아는 사람과 15분 대화해 보세요.' },
  ctaBtn:      { es: 'Hablar con un local', en: 'Talk to a local', pt: 'Falar com um local',
                 fr: 'Parler à un local',   ja: '現地の人に相談',   ko: '현지인과 대화하기' },
};

function ClusterDetail({ cluster, onBack, onBook }) {
  const { t, locale } = useI18n();
  const c = cluster || CLUSTERS[0];
  const [vw, setVw] = React.useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  React.useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isMobile = vw < 768;
  const lbl = (key) => L[key][locale] || L[key].es;
  const title = t('cluster.' + c.id + '.title', c.title);

  const facts = [
    { k: lbl('bestSeason'), v: t('cluster.' + c.id + '.bestTime', c.bestTime) },
    { k: lbl('altitude'),   v: t('cluster.' + c.id + '.altitude', c.altitude) },
    { k: lbl('timeNeeded'), v: c.timeNeeded },
    { k: lbl('gateway'),    v: c.from },
  ];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{ position: 'relative', height: isMobile ? 420 : 540, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: c.img, backgroundSize: 'cover', backgroundPosition: 'center' }}/>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(27,42,65,0.3) 0%, rgba(27,42,65,0) 30%, rgba(27,42,65,0.85) 100%)' }}/>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1400, margin: '0 auto', padding: isMobile ? '100px 20px 32px' : '140px 32px 48px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <button onClick={onBack} className="bi-btn" style={{
            background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)',
            color: '#fff', padding: '8px 14px', borderRadius: 999, cursor: 'pointer',
            backdropFilter: 'blur(10px)', display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 12, fontWeight: 700, alignSelf: 'flex-start', marginBottom: 24,
          }}><I.ArrowL size={13}/> {t('cluster.detail.back', 'Todos los destinos')}</button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
            <div style={{ width: isMobile ? 44 : 56, height: isMobile ? 44 : 56, borderRadius: isMobile ? 12 : 14, background: c.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 24px -8px rgba(0,0,0,0.4)' }}>
              {React.cloneElement(c.glyph, { size: isMobile ? 24 : 32 })}
            </div>
            <div className="eyebrow" style={{ color: 'var(--amber-300)' }}>{t('cluster.detail.region', 'Sector')}</div>
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? 'clamp(36px,9vw,52px)' : 'clamp(48px,7vw,96px)', lineHeight: 0.95, color: '#fff', margin: 0, fontWeight: 500, letterSpacing: '-0.035em', maxWidth: 900 }}>{title}</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: isMobile ? 16 : 20, marginTop: 18, maxWidth: 640, fontWeight: 300, lineHeight: 1.5 }}>{t('cluster.' + c.id + '.sub', c.sub)}</p>
        </div>
      </section>

      {/* Fact strip — every value comes from destinos.jsx, so it differs per sector. */}
      <section style={{ background: 'var(--navy-700)', color: '#fff', padding: isMobile ? '20px 0' : '28px 0', borderBottom: '4px solid var(--amber-500)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: isMobile ? '0 20px' : '0 32px', display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: isMobile ? 20 : 24 }}>
          {facts.map(s => (
            <div key={s.k}>
              <div style={{ fontSize: 11, color: 'var(--amber-300)', fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase' }}>{s.k}</div>
              <div style={{ fontSize: isMobile ? 16 : 18, fontFamily: 'var(--font-display)', marginTop: 6 }}>{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* What to see */}
      <section style={{ padding: isMobile ? '56px 0' : '88px 0' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: isMobile ? '0 20px' : '0 32px' }}>
          <h2 style={{ fontSize: isMobile ? 'clamp(28px, 8vw, 36px)' : 'clamp(32px, 4vw, 48px)', margin: '0 0 32px', lineHeight: 1.05 }}>{lbl('whatToSee')}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: isMobile ? 12 : 18 }}>
            {c.highlights.map((h, idx) => (
              <div key={idx} style={{
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                borderRadius: 14, padding: isMobile ? 18 : 22,
                display: 'flex', alignItems: 'flex-start', gap: 14,
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                  background: c.color, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700,
                }}>{idx + 1}</div>
                <div style={{ fontSize: isMobile ? 15 : 16, color: 'var(--fg1)', fontWeight: 600, lineHeight: 1.45, paddingTop: 5 }}>
                  {t('cluster.' + c.id + '.highlights.' + idx, h)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Getting there + the sector tip */}
      <section style={{ background: 'var(--stone-50)', padding: isMobile ? '56px 0' : '88px 0' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: isMobile ? '0 20px' : '0 32px',
          display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr', gap: isMobile ? 36 : 56, alignItems: 'start' }}>

          <div>
            <h2 style={{ fontSize: isMobile ? 'clamp(28px, 8vw, 36px)' : 'clamp(32px, 4vw, 44px)', margin: '0 0 10px', lineHeight: 1.05 }}>{lbl('howToGet')}</h2>
            <p style={{ fontSize: 13, color: 'var(--fg3)', margin: '0 0 24px' }}>{lbl('approx')}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {(c.gettingThere || []).map((g, idx) => (
                <div key={idx} style={{
                  display: 'grid', gridTemplateColumns: isMobile ? '90px 1fr' : '110px 1fr',
                  gap: 14, alignItems: 'baseline',
                  padding: '14px 0',
                  borderBottom: idx < c.gettingThere.length - 1 ? '1px solid var(--border)' : 0,
                }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--rust-600)',
                  }}>{g.mode}</div>
                  <div style={{ fontSize: isMobile ? 14 : 15, color: 'var(--fg1)', lineHeight: 1.5 }}>{g.detail}</div>
                </div>
              ))}
            </div>
          </div>

          <aside style={{
            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
            borderRadius: 16, padding: isMobile ? 22 : 28, boxShadow: 'var(--shadow-xs)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 9, background: 'var(--amber-100)', color: 'var(--amber-700)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><I.Sparkle size={16}/></div>
              <div className="eyebrow" style={{ margin: 0 }}>{lbl('goodToKnow')}</div>
            </div>
            <p style={{ margin: 0, fontSize: isMobile ? 15 : 16, lineHeight: 1.6, color: 'var(--fg1)' }}>
              {t('cluster.' + c.id + '.tip', c.tip)}
            </p>
          </aside>
        </div>
      </section>

      {/* The commercial step: destination leads to a booking, not to a dead end. */}
      <section style={{ background: 'var(--navy-700)', color: '#fff', padding: isMobile ? '52px 0' : '80px 0' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: isMobile ? '0 20px' : '0 32px',
          display: 'flex', flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', gap: 28 }}>
          <div style={{ maxWidth: 600 }}>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: isMobile ? 28 : 40, fontWeight: 500, lineHeight: 1.1, color: '#fff' }}>{lbl('ctaTitle')}</h2>
            <p style={{ margin: '14px 0 0', fontSize: isMobile ? 15 : 17, color: 'rgba(255,255,255,0.78)', lineHeight: 1.55 }}>{lbl('ctaBody')}</p>
          </div>
          <Btn kind="amber" size="lg" onClick={onBook} style={{ flexShrink: 0 }}>
            {lbl('ctaBtn')} <I.ArrowR size={15}/>
          </Btn>
        </div>
      </section>
    </div>
  );
}

export default ClusterDetail;
