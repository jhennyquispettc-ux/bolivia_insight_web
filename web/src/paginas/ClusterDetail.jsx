/* Bolivia Insight — Destination Detail Page */
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

  const itineraries = [
    { 
      id: 'salt-sky', 
      title: locale === 'es' ? 'Sal y Cielo' : locale === 'pt' ? 'Sal & Céu' : locale === 'fr' ? 'Sel & Ciel' : locale === 'ja' ? '塩と空' : locale === 'ko' ? '소금과 하늘' : 'Salt & Sky', 
      days: 4, 
      level: locale === 'es' ? 'Fácil' : locale === 'pt' ? 'Fácil' : locale === 'fr' ? 'Facile' : locale === 'ja' ? '初級' : locale === 'ko' ? '쉬움' : 'Easy', 
      author: 'Carla V.', 
      img: IMG.uyuniDay,
      desc: locale === 'es' ? 'Lado Tunupa, amanecer en Incahuasi, estancia en el pueblo de San Pedro de Quemes. Operadores locales realizan este circuito a diario.' : 
            locale === 'pt' ? 'Lado Tunupa, amanecer em Incahuasi, hospedagem no vilarejo de San Pedro de Quemes. Jipes locais fazem este circuito diariamente.' : 
            locale === 'fr' ? 'Côté Tunupa, lever de soleil à Incahuasi, séjour chez l\'habitant à San Pedro de Quemes. Les jeeps locales font ce trajet tous les jours.' : 
            locale === 'ja' ? 'トゥヌパ火山側、インカワシ島からの朝日、サンペドロ・デ・ケメスでの滞在。地元のジープツアーが毎日運行。' : 
            locale === 'ko' ? '투누파 화산 방면, 인카와시 섬 일출, 산 페드로 데 케메스 마을 체류. 현지 지프 투어로 매일 운행.' : 'Tunupa side, Incahuasi sunrise, San Pedro de Quemes village stay. Local jeep operators run this loop daily.' 
    },
    { 
      id: 'titi-deep', 
      title: locale === 'es' ? 'Titicaca profundo' : locale === 'pt' ? 'Titicaca profundo' : locale === 'fr' ? 'Titicaca, en profondeur' : locale === 'ja' ? 'チティカカ湖の深部へ' : locale === 'ko' ? '티티카카 호수 깊숙이' : 'Titicaca, deep', 
      days: 3, 
      level: locale === 'es' ? 'Moderado' : locale === 'pt' ? 'Moderado' : locale === 'fr' ? 'Modéré' : locale === 'ja' ? '中級' : locale === 'ko' ? '보통' : 'Moderate', 
      author: 'Mateo R.', 
      img: IMG.altiplano,
      desc: locale === 'es' ? 'Copacabana → Isla del Sol → Yampupata. Alojamiento comunitario disponible al llegar, sin reserva previa.' : 
            locale === 'pt' ? 'Copacabana → Isla del Sol → Yampupata. Hospedagem comunitária disponível na chegada, sem reservas.' : 
            locale === 'fr' ? 'Copacabana → Isla del Sol → Yampupata. Séjours communautaires réservables à l\'arrivée, pas de réservation nécessaire.' : 
            locale === 'ja' ? 'コパカバーナ ↔ 太陽の島 ↔ ヤンプパタ。現地到着後に民泊の手配が可能です。事前予約不要。' : 
            locale === 'ko' ? '코파카바나 ↔ 태양의 섬 ↔ 얌푸파타. 사전 예약 없이 도착 후 현지 민박 직접 수배 가능.' : 'Copacabana → Isla del Sol → Yampupata. Community homestays bookable on arrival, no reservation needed.' 
    },
    { 
      id: 'tiwanaku', 
      title: locale === 'es' ? 'Tiwanaku → Puerta del Sol' : locale === 'pt' ? 'Tiwanaku → Porta do Sol' : locale === 'fr' ? 'Tiwanaku → Porte du Soleil' : locale === 'ja' ? 'ティワナク ↔ 太陽の門' : locale === 'ko' ? '티와나쿠 ↔ 태양의 문' : 'Tiwanaku → Sun Gate', 
      days: 2, 
      level: locale === 'es' ? 'Fácil' : locale === 'pt' ? 'Fácil' : locale === 'fr' ? 'Facile' : locale === 'ja' ? '初級' : locale === 'ko' ? '쉬움' : 'Easy', 
      author: 'Aymara F.', 
      img: IMG.altiplano,
      desc: locale === 'es' ? 'Sitio pre-inca accesible en minivan pública desde la terminal del Cementerio de La Paz. Bs 25, 1.5h por tramo.' : 
            locale === 'pt' ? 'Sítio pré-inca acessível por van pública saindo do terminal do Cemitério de La Paz. Bs 25, 1.5h por trecho.' : 
            locale === 'fr' ? 'Site pré-inca accessible en minibus public depuis le terminal du cimetière de La Paz. 25 Bs, 1h30 de trajet.' : 
            locale === 'ja' ? 'ラパスの墓地ターミナルから公共ミニバスで行けるプレインカ遺跡。片道25 Bs、約1.5時間。' : 
            locale === 'ko' ? '라파스 공동묘지 터미널에서 미니버스로 이동 가능한 프리인카 유적. 편도 25 Bs, 1시간 30분 소요.' : 'Pre-Inca site reachable by public minibus from La Paz cemetery terminal. Bs 25, 1.5h each way.' 
    },
  ];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* HERO */}
      <section style={{ position: 'relative', height: isMobile ? 420 : 540, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: c.img, backgroundSize: 'cover', backgroundPosition: 'center' }}/>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(27,42,65,0.3) 0%, rgba(27,42,65,0) 30%, rgba(27,42,65,0.85) 100%)' }}/>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1400, margin: '0 auto', padding: isMobile ? '100px 20px 32px' : '140px 32px 48px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <button onClick={onBack} style={{
            background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)',
            color: '#fff', padding: '8px 14px', borderRadius: 999, cursor: 'pointer',
            backdropFilter: 'blur(10px)', display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 12, fontWeight: 700, alignSelf: 'flex-start', marginBottom: 24,
          }}><I.ArrowL size={13}/> {t('cluster.detail.back', 'All destinations')}</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
            <div style={{ width: isMobile ? 44 : 56, height: isMobile ? 44 : 56, borderRadius: isMobile ? 12 : 14, background: c.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 24px -8px rgba(0,0,0,0.4)' }}>
              {React.cloneElement(c.glyph, { size: isMobile ? 24 : 32 })}
            </div>
            <div className="eyebrow" style={{ color: 'var(--amber-300)' }}>{t('cluster.detail.region', 'Region')} · {t('cluster.' + c.id + '.title', c.title)}</div>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? 'clamp(36px,9vw,52px)' : 'clamp(48px,7vw,96px)', lineHeight: 0.95, color: '#fff', margin: 0, fontWeight: 500, letterSpacing: '-0.035em', maxWidth: 900 }}>{t('cluster.' + c.id + '.title', c.title)}.</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: isMobile ? 16 : 20, marginTop: 18, maxWidth: 640, fontWeight: 300, lineHeight: 1.5 }}>{t('cluster.' + c.id + '.sub', c.sub)}</p>
        </div>
      </section>

      {/* QUICK FACTS BAR */}
      <section style={{ background: 'var(--navy-700)', color: '#fff', padding: isMobile ? '20px 0' : '28px 0', borderBottom: '4px solid var(--amber-500)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: isMobile ? '0 20px' : '0 32px', display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(5, 1fr)', gap: isMobile ? 20 : 24 }}>
          {[
            { k: locale === 'es' ? 'Mejor época' : locale === 'pt' ? 'Melhor época' : locale === 'fr' ? 'Meilleure saison' : locale === 'ja' ? 'ベストシーズン' : locale === 'ko' ? '최적 시기' : 'Best season', v: t('cluster.' + c.id + '.bestTime', c.bestTime || 'May – Oct (dry)') },
            { k: locale === 'es' ? 'Altitud' : locale === 'pt' ? 'Altitude' : locale === 'fr' ? 'Altitude' : locale === 'ja' ? '高度' : locale === 'ko' ? '고도' : 'Altitude', v: t('cluster.' + c.id + '.altitude', c.altitude || '3,650 – 4,200 m') },
            { k: locale === 'es' ? 'Tiempo necesario' : locale === 'pt' ? 'Tempo necessário' : locale === 'fr' ? 'Durée conseillée' : locale === 'ja' ? '推奨日数' : locale === 'ko' ? '추천 일정' : 'Time needed', v: locale === 'es' ? '3 – 5 días' : locale === 'pt' ? '3 – 5 dias' : locale === 'fr' ? '3 – 5 jours' : locale === 'ja' ? '3 〜 5日' : locale === 'ko' ? '3 ~ 5일' : '3 – 5 days' },
            { k: locale === 'es' ? 'Cómo llegar' : locale === 'pt' ? 'Como chegar' : locale === 'fr' ? 'S\'y rendre' : locale === 'ja' ? 'アクセス' : locale === 'ko' ? '가는 방법' : 'Getting there', v: locale === 'es' ? 'La Paz · 3.5h en auto' : locale === 'pt' ? 'La Paz · 3.5h de carro' : locale === 'fr' ? 'La Paz · 3.5h de route' : locale === 'ja' ? 'ラパスから車で3.5時間' : locale === 'ko' ? '라파스 기준 차로 3.5시간' : 'La Paz · 3.5h drive' },
            { k: locale === 'es' ? 'Guías locales' : locale === 'pt' ? 'Guias locais' : locale === 'fr' ? 'Guides locaux' : locale === 'ja' ? '現地ガイド' : locale === 'ko' ? '현지 가이드' : 'Local guides', v: locale === 'es' ? 'Muchos en el pueblo' : locale === 'pt' ? 'Muitos na cidade' : locale === 'fr' ? 'Nombreux sur place' : locale === 'ja' ? '現地に多数あり' : locale === 'ko' ? '마을에 많음' : 'Plenty in town' },
          ].map(s => (
            <div key={s.k}>
              <div style={{ fontSize: 11, color: 'var(--amber-300)', fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase' }}>{s.k}</div>
              <div style={{ fontSize: isMobile ? 16 : 18, fontFamily: 'var(--font-display)', marginTop: 6 }}>{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SUGGESTED ROUTES */}
      <section style={{ padding: isMobile ? '64px 0' : '100px 0' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: isMobile ? '0 20px' : '0 32px' }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>{t('cluster.detail.suggestedRoutes', 'Suggested routes · No booking required')}</div>
          <h2 style={{ fontSize: isMobile ? 'clamp(28px, 8vw, 36px)' : 'clamp(32px, 4vw, 48px)', margin: 0, marginBottom: 16 }}>{t('cluster.detail.waysInto', 'Three ways into the altiplano.')}</h2>
          <p style={{ fontSize: isMobile ? 15 : 17, color: 'var(--fg2)', maxWidth: 640, marginBottom: isMobile ? 32 : 40, lineHeight: 1.6 }}>
            {locale === 'es' ? 'Circuitos sugeridos por escritores locales que recorren estas regiones. Organiza el transporte y hospedajes al llegar — cada pueblo tiene agencias y alojamientos.' :
             locale === 'pt' ? 'Roteiros sugeridos por escritores locais que viajam por estas regiões. Organize o transporte e estadias na chegada — cada cidade tem agências e pousadas.' :
             locale === 'fr' ? 'Circuits élaborés par des auteurs locaux qui parcourent ces régions. Organisez le transport et l\'hébergement à l\'arrivée — chaque village possède des agences et des hébergements.' :
             locale === 'ja' ? '現地を知るライターが作成した周遊ルート。移動手段や宿は現地到着後に手配可能です。どの街にも旅行会社や宿があります。' :
             locale === 'ko' ? '현지 작가들이 수집한 추천 경로. 이동 수단과 숙박은 도착 후 수배가 가능합니다 — 마을마다 여행사 및 숙소가 있습니다.' :
             'Loops compiled from local writers who walk these regions. Arrange transport and stays on arrival — every town has agencies and homestays.'}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 24 }}>
            {itineraries.map((it) => (
              <article key={it.id} style={{
                background: '#fff', borderRadius: 18, overflow: 'hidden',
                boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)',
              }}>
                <div style={{ height: 200, backgroundImage: it.img, position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 14, left: 14, padding: '6px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.95)', fontSize: 11, fontWeight: 800, letterSpacing: 0.4, color: 'var(--navy-700)' }}>
                    {it.days} {locale === 'es' ? 'DÍAS' : locale === 'pt' ? 'DIAS' : locale === 'fr' ? 'JOURS' : locale === 'ja' ? '日間' : locale === 'ko' ? '일정' : 'DAYS'} · {it.level.toUpperCase()}
                  </div>
                </div>
                <div style={{ padding: 24 }}>
                  <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 26, lineHeight: 1.1, fontWeight: 500 }}>{it.title}</h3>
                  <p style={{ color: 'var(--fg2)', fontSize: 14, lineHeight: 1.55, marginTop: 10 }}>{it.desc}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 18, paddingTop: 18, borderTop: '1px solid var(--border)' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 999, background: 'var(--mystic-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12, color: 'var(--mystic-700)' }}>{it.author.charAt(0)}</div>
                    <div style={{ flex: 1, fontSize: 12, color: 'var(--fg2)' }}>{t('cluster.detail.writtenBy', 'Written by')} <strong style={{ color: 'var(--fg1)' }}>{it.author}</strong></div>
                  </div>
                  <Btn kind="navy" size="md" style={{ width: '100%', justifyContent: 'center', marginTop: 16 }} onClick={onBook}>{t('cluster.detail.readFull', 'Read full route')} <I.ArrowR size={14}/></Btn>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* JOURNAL TEASER */}
      <section style={{ background: 'var(--stone-50)', padding: isMobile ? '64px 0' : '100px 0' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: isMobile ? '0 20px' : '0 32px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 32 : 60, alignItems: 'center' }}>
          <div style={{ height: isMobile ? 280 : 460, borderRadius: 18, backgroundImage: IMG.uyuniNight, backgroundSize: 'cover', backgroundPosition: 'center', boxShadow: 'var(--shadow-lg)', order: isMobile ? -1 : 0 }}/>
          <div>
            <div className="eyebrow" style={{ marginBottom: 12 }}>{t('cluster.detail.journalTitle', 'Journal · From the field')}</div>
            <h2 style={{ margin: 0, fontSize: isMobile ? 'clamp(28px, 8vw, 36px)' : 'clamp(32px, 4vw, 48px)', lineHeight: 1.06 }}>{t('cluster.detail.journalQuote', '"The salar is two countries. We sleep in one and wake in another."')}</h2>
            <p style={{ fontSize: isMobile ? 15 : 17, color: 'var(--fg2)', lineHeight: 1.6, marginTop: 22 }}>
              {t('cluster.detail.journalDesc', "Carla writes about the wet-season mirror — a thin film that turns 10,000 km² of salt into the largest reflection on earth. The right night to visit changes every year; here's how to read the conditions.")}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 24 }}>
              <div style={{ width: 44, height: 44, borderRadius: 999, background: 'var(--mystic-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--mystic-700)' }}>CV</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>Carla Viscarra</div>
                <div style={{ fontSize: 12, color: 'var(--fg3)' }}>{t('cluster.detail.writerTitle', 'Altiplano writer · La Paz native')}</div>
              </div>
              <Btn kind="ghost" size="sm" style={{ marginLeft: 'auto' }}>{t('cluster.detail.readEssay', 'Read essay')} <I.ArrowR size={14}/></Btn>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
window.ClusterDetail = ClusterDetail;
