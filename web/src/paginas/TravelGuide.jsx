import React, { useState, useEffect } from 'react';
import { useI18n } from '../data/translations.jsx';
import I from '../ui/iconos.jsx';
import Btn from '../ui/Boton.jsx';
import IMG from '../ui/imagenes.jsx';
import Dictionary from '../componentes/Dictionary.jsx';

function TravelGuide({ onBack, onExpert, initialTab }) {
  const { t, locale } = useI18n();
  const [tab, setTab] = useState(initialTab || 'arrive');
  const [vw, setVw] = React.useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  React.useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isMobile = vw < 768;

  
  const cardData = {
    arrive: {
      label: t('guide.tab.arrive', 'Arrive'),
      title: locale === 'es' ? 'Cómo llegar.' :
             locale === 'pt' ? 'Como chegar.' :
             locale === 'fr' ? 'Comment arriver.' :
             locale === 'ja' ? '入国と移動。' :
             locale === 'ko' ? '도착 및 입국.' : 'Getting in.',
      sub: locale === 'es' ? 'Sin agencias, sin intermediarios — solo lo que necesitas saber el primer día.' :
           locale === 'pt' ? 'Sem agências, sem guias — apenas o que você precisa saber no primeiro dia.' :
           locale === 'fr' ? 'Pas d\'agence, pas d\'intermédiaire — juste ce que vous devez savoir le premier jour.' :
           locale === 'ja' ? '手配会社を通さず、自分で行く。到着初日に必要な情報だけをお届けします。' :
           locale === 'ko' ? '대행사 없이 스스로 가는 여행 — 첫날 알아야 할 핵심 정보를 모았습니다.' : 'No agency, no hand-holding — just what you need to know on day one.',
      cards: [
        {
          k: { en: 'Main airport', es: 'Aeropuerto principal', pt: 'Aeroporto principal', fr: 'Aéroport principal', ja: '主要空港', ko: '주요 공항' },
          v: { en: 'El Alto (LPB)', es: 'El Alto (LPB)', pt: 'El Alto (LPB)', fr: 'El Alto (LPB)', ja: 'エルアルト (LPB)', ko: '엘알토 (LPB)' },
          n: { en: '4,061 m · 35 min from La Paz centro', es: '4,061 m · a 35 min del centro de La Paz', pt: '4,061 m · a 35 min do centro de La Paz', fr: '4,061 m · 35 min du centre de La Paz', ja: '標高 4,061 m · ラパス中心部から35分', ko: '고도 4,061m · 라파스 시내에서 35분 소요' }
        },
        {
          k: { en: 'Visa', es: 'Visado', pt: 'Visto', fr: 'Visa', ja: 'ビザ', ko: '비자' },
          v: { en: 'Free 30 days', es: 'Gratis 30 días', pt: 'Grátis 30 dias', fr: 'Gratuit 30 jours', ja: '30日間無料', ko: '30일 무료' },
          n: { en: 'Most EU/UK/CA/AU/Mercosur. USA pays $160 on arrival.', es: 'Para UE/RU/CA/AU/Mercosur. EE. UU. paga $160 al llegar.', pt: 'Maioria UE/RU/CA/AU/Mercosul. EUA paga $160 na chegada.', fr: 'Majorité UE/UK/CA/AU/Mercosur. Les USA paient 160 $ à l\'arrivée.', ja: '日本、EU、英、豪など。米国籍は到着時に$160の支払いが必要。', ko: '대부분 국가 무비자. 미국 국적자는 도착 시 $160 지불.' }
        },
        {
          k: { en: 'Currency', es: 'Moneda', pt: 'Moeda', fr: 'Devise', ja: '通貨', ko: '통화' },
          v: { en: 'Boliviano (Bs)', es: 'Boliviano (Bs)', pt: 'Boliviano (Bs)', fr: 'Boliviano (Bs)', ja: 'ボリビアーノ (Bs)', ko: '볼리비아노 (Bs)' },
          n: { en: '≈ 6.96 Bs / USD · ATMs in every city', es: '≈ 6.96 Bs / USD · Cajeros en cada ciudad', pt: '≈ 6.96 Bs / USD · Caixas eletrônicos em todas as cidades', fr: '≈ 6.96 Bs / USD · Distributeurs dans chaque ville', ja: '1 USD ≈ 6.96 Bs · 各都市にATMがあります', ko: '≈ 6.96 Bs / USD · 모든 도시에 ATM 있음' }
        },
        {
          k: { en: 'eSIM', es: 'eSIM', pt: 'eSIM', fr: 'eSIM', ja: 'eSIM', ko: 'eSIM' },
          v: { en: 'Tigo or Entel', es: 'Tigo o Entel', pt: 'Tigo ou Entel', fr: 'Tigo ou Entel', ja: 'Tigo または Entel', ko: 'Tigo 또는 Entel' },
          n: { en: '20 Bs/day · 4G everywhere except Madidi', es: '20 Bs/día · 4G en todas partes excepto Madidi', pt: '20 Bs/dia · 4G em todos os lugares exceto Madidi', fr: '20 Bs/jour · 4G partout sauf à Madidi', ja: '1日20 Bs〜 · マディディ国立公園以外はほぼ4G対応', ko: '하루 20 Bs · 마디디를 제외한 대부분 지역 4G 가능' }
        },
        {
          k: { en: 'Spanish', es: 'Español', pt: 'Espanhol', fr: 'Espagnol', ja: 'スペイン語', ko: '스페인어' },
          v: { en: 'Essential', es: 'Esencial', pt: 'Essencial', fr: 'Essentiel', ja: '必須', ko: '필수' },
          n: { en: 'English in hostels only. Aymara & Quechua audible.', es: 'Inglés solo en hostales. Se escucha aymara y quechua.', pt: 'Inglês apenas em hostels. Ouvir-se-á aymara e quechua.', fr: 'Anglais dans les auberges uniquement. Aymara et Quechua parlés.', ja: '英語はホステルのみ。街中ではアイマラ語やケチュア語も聞こえます。', ko: '호스텔에서만 영어 통함. 아ymara어 및 케추아어 들림.' }
        },
        {
          k: { en: 'Cash culture', es: 'Efectivo', pt: 'Dinheiro vivo', fr: 'Culture cash', ja: '現金文化', ko: '현금 사용' },
          v: { en: 'Bring small bills', es: 'Lleva billetes chicos', pt: 'Traga notas baixas', fr: 'Petites coupures', ja: '小額紙幣を持参', ko: '소액 지폐 지참' },
          n: { en: 'Outside La Paz/SCZ, cards are rare. Bs 10–50 daily.', es: 'Fuera de La Paz/SCZ, tarjetas son raras. Bs 10–50 al día.', pt: 'Fora de La Paz/SCZ, cartões são raros. Bs 10–50 diários.', fr: 'Hors La Paz/SCZ, cartes rares. 10–50 Bs par jour.', ja: 'ラパスやサンタクルス以外ではカード不可多し。1日10〜50 Bs必須。', ko: '라파스/산타크루즈 외에는 카드 드묾. 하루 10~50 Bs 지출.' }
        }
      ]
    },
    altitude: {
      label: t('guide.tab.altitude', 'Altitude'),
      title: locale === 'es' ? 'El problema de la altitud.' :
             locale === 'pt' ? 'O problema da altitude.' :
             locale === 'fr' ? 'La question de l\'altitude.' :
             locale === 'ja' ? '高山病対策について。' :
             locale === 'ko' ? '고도 3,600m의 문제.' : 'The 3,600 m question.',
      sub: locale === 'es' ? 'La Paz está más alta que la mayoría de las pistas de esquí. Así lo manejan los locales.' :
           locale === 'pt' ? 'La Paz fica mais alta do que a maioria das estações de esqui. Veja como os locais lidam.' :
           locale === 'fr' ? 'La Paz est plus haute que la plupart des stations de ski. Voici comment font les locaux.' :
           locale === 'ja' ? 'ラパスは一般的なスキー場より高い場所にあります。地元の人々の知恵を紹介します。' :
           locale === 'ko' ? '라파스는 대부분 스키 리조트보다 높습니다. 현지인들의 대처법을 소개합니다.' : "La Paz sits higher than most ski resorts. Here's how locals handle it.",
      cards: [
        {
          k: { en: 'Day 1', es: 'Día 1', pt: 'Dia 1', fr: 'Jour 1', ja: '1日目', ko: '1일차' },
          v: { en: 'Walk slow', es: 'Camina lento', pt: 'Ande devagar', fr: 'Marchez doucement', ja: 'ゆっくり歩く', ko: '천천히 걷기' },
          n: { en: 'No alcohol. Mate de coca all day. Sleep early.', es: 'Sin alcohol. Mate de coca todo el día. Duerme temprano.', pt: 'Sem álcool. Mate de coca o dia todo. Durma cedo.', fr: 'Pas d\'alcool. Maté de coca toute la journée. Dormir tôt.', ja: 'アルコールは控え、コカ茶をこまめに飲み、早めに寝てください。', ko: '금주. 하루 종일 코카차 마시기. 일찍 잠자리에 들기.' }
        },
        {
          k: { en: 'Day 2', es: 'Día 2', pt: 'Dia 2', fr: 'Jour 2', ja: '2日目', ko: '2일차' },
          v: { en: 'Mostly flat', es: 'Casi todo plano', pt: 'Quase todo plano', fr: 'Plat uniquement', ja: '平坦なルートのみ', ko: '평지 위주 이동' },
          n: { en: "Mercado Lanza, Witches' Market. No teleférico cardio.", es: 'Mercado Lanza, Mercado de las Brujas. Sin teleférico exigente.', pt: 'Mercado Lanza, Mercado das Bruxas. Sem exercícios intensos.', fr: 'Mercado Lanza, Marché des Sorcières. Pas d\'effort inutile.', ja: '魔女の市場やランサ市場の散策。激しいアップダウンは避ける。', ko: '란사 시장, 마녀 시장 투어. 과도한 케이블카 탑승 지양.' }
        },
        {
          k: { en: 'Day 3+', es: 'Día 3+', pt: 'Dia 3+', fr: 'Jour 3+', ja: '3日目以降', ko: '3일차+' },
          v: { en: 'Trek-ready', es: 'Listo para treking', pt: 'Pronto para trekking', fr: 'Prêt pour le trek', ja: 'トレッキング開始', ko: '트레킹 가능 고도' },
          n: { en: 'Now you can do Valle de la Luna, Cumbre, El Alto.', es: 'Ahora puedes ir a Valle de la Luna, Cumbre, El Alto.', pt: 'Agora você pode ir a Valle de la Luna, Cumbre, El Alto.', fr: 'Vous pouvez visiter la Vallée de la Lune, Cumbre ou El Alto.', ja: '月の谷、クンブレ、エルアルトなどの観光ができるようになります。', ko: '이제 달의 계곡, 쿰브레, 엘알토 방문이 가능합니다.' }
        },
        {
          k: { en: 'Pills', es: 'Pastillas', pt: 'Pílulas', fr: 'Médicaments', ja: '高山病の薬', ko: '의약품' },
          v: { en: 'Soroche pills', es: 'Pastillas Sorojchi', pt: 'Pílulas Sorojchi', fr: 'Pilules Soroche', ja: 'ソロチ・ピル', ko: '소로치 약' },
          n: { en: 'Sold OTC at any farmacia · Bs 30 / 12 tablets', es: 'Venta libre en farmacias · Bs 30 las 12 tabletas', pt: 'Venda livre em farmácias · Bs 30 por 12 comprimidos', fr: 'Vente libre en pharmacie · 30 Bs les 12 comprimés', ja: '薬局で処方箋なしで購入可 · 12錠で約30 Bs', ko: '약국에서 처방전 없이 구매 가능 · 12정에 약 30 Bs' }
        },
        {
          k: { en: 'Red flags', es: 'Alertas rojas', pt: 'Sinais de perigo', fr: 'Signes d\'alerte', ja: '危険信号', ko: '위험 신호' },
          v: { en: 'Get to lower ground', es: 'Desciende de inmediato', pt: 'Desça imediatamente', fr: 'Redescendre', ja: '標高を下げる', ko: '즉시 하산' },
          n: { en: 'Vomiting, can\'t walk straight, blue lips → Coroico (1,700m)', es: 'Vómitos, labios morados, dificultad para caminar recto → Coroico (1,700m)', pt: 'Vômitos, lábios azuis, dificuldade para andar → Coroico (1.700m)', fr: 'Vomissements, lèvres bleues, démarche instable → Coroico (1 700m)', ja: '嘔吐、ふらつき、唇の青さがある場合 → コロイコ (1,700m) へ避難', ko: '구토, 푸른 입술, 비틀거림 발생 시 → 코로이코 (1,700m)로 하산' }
        },
        {
          k: { en: 'Worst city', es: 'Peor ciudad', pt: 'Pior cidade', fr: 'Pire ville', ja: '最も過酷な街', ko: '가장 힘든 도시' },
          v: { en: 'Potosí (4,067 m)', es: 'Potosí (4,067 m)', pt: 'Potosí (4.067 m)', fr: 'Potosí (4 067 m)', ja: 'ポトシ (4,067 m)', ko: '포토시 (4,067m)' },
          n: { en: 'Even acclimatized travelers feel it. Plan 1 night max.', es: 'Incluso adaptados la sienten. Planifica 1 noche máximo.', pt: 'Mesmo aclimatados sentem. Planeje no máximo 1 noite.', fr: 'Même acclimaté, on le ressent. Prévoyez 1 nuit maximum.', ja: '高度順化した旅行者でも辛い場所です。滞在は最大1泊を推奨。', ko: '고도 적응을 마친 여행자도 힘든 곳. 최대 1박만 일정 잡기.' }
        }
      ]
    },
    money: {
      label: t('guide.tab.money', 'Money & costs'),
      title: locale === 'es' ? 'Costos reales.' :
             locale === 'pt' ? 'Custos reais.' :
             locale === 'fr' ? 'Le coût des choses.' :
             locale === 'ja' ? 'お金と旅の予算。' :
             locale === 'ko' ? '실제 여행 비용.' : 'What things actually cost.',
      sub: locale === 'es' ? 'Precios reales a abril de 2026 — nivel mochilero intermedio, no de lujo.' :
           locale === 'pt' ? 'Preços reais a abril de 2026 — padrão mochileiro básico/médio, sem luxo.' :
           locale === 'fr' ? 'Chiffres réels d\'avril 2026 — budget voyageur classique, pas luxe.' :
           locale === 'ja' ? '2026年4月現在の実数値です — ラグジュアリーではなく、一般的な旅行者の目安。' :
           locale === 'ko' ? '2026년 4월 기준 실제 수치 — 사치가 아닌 평균적인 여행자 기준.' : 'Real numbers from April 2026 — flashpacker baseline, not luxury.',
      cards: [
        {
          k: { en: 'Hostel dorm', es: 'Dormitorio hostal', pt: 'Cama em hostel', fr: 'Dortoir d\'auberge', ja: 'ホステルドミトリー', ko: '호스텔 도미토리' },
          v: { en: 'Bs 70 – 110', es: 'Bs 70 – 110', pt: 'Bs 70 – 110', fr: '70 – 110 Bs', ja: 'Bs 70 – 110', ko: 'Bs 70 – 110' },
          n: { en: '$10 – $16 · Wild Rover, Loki, Adventure Brew', es: '$10 – $16 · Wild Rover, Loki, Adventure Brew', pt: '$10 – $16 · Wild Rover, Loki, Adventure Brew', fr: '10 $ – 16 $ · Wild Rover, Loki, Adventure Brew', ja: '約$10 〜 $16 · Wild Rover, Loki, Adventure Brewなど', ko: '$10 – $16 · 유명 체인 호스텔 기준' }
        },
        {
          k: { en: 'Private room', es: 'Habitación privada', pt: 'Quarto privativo', fr: 'Chambre privée', ja: '個室シングル', ko: '개인실' },
          v: { en: 'Bs 180 – 320', es: 'Bs 180 – 320', pt: 'Bs 180 – 320', fr: '180 – 320 Bs', ja: 'Bs 180 – 320', ko: 'Bs 180 – 320' },
          n: { en: 'boutique in Sopocachi, La Recoleta', es: 'Hoteles boutique en Sopocachi, La Recoleta', pt: 'Hotéis boutique em Sopocachi, La Recoleta', fr: 'Hôtel-boutique à Sopocachi ou La Recoleta', ja: 'ソポカチ地区やラ・レコレタ地区のブティック宿', ko: '소포카치, 라 레콜레타 지역 부티크 숙소' }
        },
        {
          k: { en: 'Set lunch', es: 'Almuerzo completo', pt: 'Prato feito (Almoço)', fr: 'Menu du midi', ja: 'ランチセット', ko: '점심 세트' },
          v: { en: 'Bs 25 – 45', es: 'Bs 25 – 45', pt: 'Bs 25 – 45', fr: '25 – 45 Bs', ja: 'Bs 25 – 45', ko: 'Bs 25 – 45' },
          n: { en: '"almuerzo" with soup + main + drink', es: '"almuerzo" con sopa + segundo + refresco', pt: '"almuerzo" com sopa + prato principal + bebida', fr: '"almuerzo" avec soupe + plat + boisson', ja: 'スープ・メイン・飲み物付きの「アルムエルソ」', ko: '스프 + 메인 메뉴 + 음료 포함의 현지식' }
        },
        {
          k: { en: 'Salar 3D/2N', es: 'Tour Salar 3D/2N', pt: 'Tour Salar 3D/2N', fr: 'Tour Salar 3J/2N', ja: 'ウユニ塩湖 3日/2泊', ko: '우유니 사막 3일/2박' },
          v: { en: 'Bs 1,400 – 1,800', es: 'Bs 1,400 – 1,800', pt: 'Bs 1,400 – 1.800', fr: '1 400 – 1 800 Bs', ja: 'Bs 1,400 – 1,800', ko: 'Bs 1,400 – 1,800' },
          n: { en: 'group jeep from Uyuni, all-in', es: 'Tour grupal en jeep desde Uyuni, todo incluido', pt: 'Tour compartilhado em jipe saindo de Uyuni, tudo incluso', fr: 'En 4x4 partagé depuis Uyuni, tout inclus', ja: 'ウユニ発の共有ジープツアー、全食・宿代込み', ko: '우유니 출발 소그룹 지프 투어, 올인클루시브' }
        },
        {
          k: { en: 'La Paz → Uyuni bus', es: 'Bus La Paz → Uyuni', pt: 'Ônibus La Paz → Uyuni', fr: 'Bus La Paz → Uyuni', ja: '夜行バス：ラパス ↔ ウユニ', ko: '야간 버스: 라파스 ↔ 우유니' },
          v: { en: 'Bs 200 – 350', es: 'Bs 200 – 350', pt: 'Bs 200 – 350', fr: '200 – 350 Bs', ja: 'Bs 200 – 350', ko: 'Bs 200 – 350' },
          n: { en: 'Overnight semi-cama · 10 hours', es: 'Bus nocturno semi-cama · 10 horas de viaje', pt: 'Ônibus leito/semi-leito noturno · 10 horas', fr: 'Bus de nuit semi-cama · 10 heures', ja: '3列シート（セミ・カマ）夜行 · 約10時間', ko: '야간 우등 버스(세미카마) · 10시간 소요' }
        },
        {
          k: { en: 'Teleférico ride', es: 'Teleférico', pt: 'Tarifa teleférico', fr: 'Ticket téléphérique', ja: 'ロープウェイ乗車', ko: '케이블카 요금' },
          v: { en: 'Bs 3', es: 'Bs 3', pt: 'Bs 3', fr: '3 Bs', ja: 'Bs 3', ko: 'Bs 3' },
          n: { en: '~$0.45 · 9 lines, runs 6am–11pm', es: '~$0.45 · 9 líneas, de 6am a 11pm', pt: '~$0.45 · 9 linhas, funciona das 6h às 23h', fr: '~0,45 $ · 9 lignes, de 6h à 23h', ja: '約0.45米ドル · 全9路線、朝6時〜夜11時運行', ko: '약 $0.45 · 9개 노선, 6am~11pm 운행' }
        }
      ]
    },
    safe: {
      label: t('guide.tab.safe', 'Safety & scams'),
      title: locale === 'es' ? 'Seguridad y prevención.' :
             locale === 'pt' ? 'Segurança e golpes.' :
             locale === 'fr' ? 'La sécurité sur place.' :
             locale === 'ja' ? '治安とトラブル対策。' :
             locale === 'ko' ? '치안 및 예방 대책.' : 'What to actually watch for.',
      sub: locale === 'es' ? 'Bolivia es uno de los países más seguros de la región andina. Los riesgos son muy específicos.' :
           locale === 'pt' ? 'A Bolívia é um dos países mais seguros da região andina. Os riscos são bem específicos.' :
           locale === 'fr' ? 'La Bolivie est parmi les pays andins les plus sûrs. Les risques sont très ciblés.' :
           locale === 'ja' ? 'ボリビアはアンデス地域の中では比較的安全な国ですが、特有のリスクが存在します。' :
           locale === 'ko' ? '볼리비아는 안데스 국가 중 비교적 안전한 편이지만, 특정 상황을 주의해야 합니다.' : 'Bolivia is among the safer Andean countries. The risks are specific.',
      cards: [
        {
          k: { en: 'Fake police', es: 'Falsos policías', pt: 'Falsos policiais', fr: 'Faux policiers', ja: '偽警察官', ko: '가짜 경찰' },
          v: { en: 'Always ask for ID', es: 'Pide siempre credencial', pt: 'Exija sempre identificação', fr: 'Demandez l\'insigne', ja: '必ず身分証を要求する', ko: '항상 ID 요구하기' },
          n: { en: 'Real cops never ask for your passport on the street.', es: 'Policías reales nunca piden pasaporte en plena calle.', pt: 'Policiais de verdade nunca pedem passaporte na rua.', fr: 'Les vrais policiers ne demandent jamais votre passeport dans la rue.', ja: '本物の警察官が路上でパスポート提示を求めることはありません。', ko: '실제 경찰은 길거리에서 여권을 보여달라고 하지 않습니다.' }
        },
        {
          k: { en: 'Express kidnapping', es: 'Secuestro exprés', pt: 'Sequestro expresso', fr: 'Enlèvement express', ja: '特急誘拐', ko: '퀵 납치' },
          v: { en: 'Use Cabify in La Paz', es: 'Usa Cabify en La Paz', pt: 'Use Cabify em La Paz', fr: 'Utilisez Cabify à La Paz', ja: 'ラパスではCabifyを使用', ko: '라파스에서는 Cabify 이용' },
          n: { en: 'Avoid hailed taxis after 22:00 in Sopocachi.', es: 'Evita tomar taxis en la calle después de las 22:00 en Sopocachi.', pt: 'Evite pegar táxis comuns na rua após as 22:00 em Sopocachi.', fr: 'Évitez les taxis hélés dans la rue après 22h à Sopocachi.', ja: '深夜22時以降にソポカチ周辺で流しのタクシーに乗るのは避けてください。', ko: 'Sopocachi 지역에서 밤 10시 이후 길거리 택시 탑승 자제.' }
        },
        {
          k: { en: 'Strikes (paros)', es: 'Huelgas (paros)', pt: 'Bloqueios/Greves', fr: 'Grèves et blocages', ja: 'ストライキ (paros)', ko: '도로 봉쇄 (paros)' },
          v: { en: 'Check bloqueos.bo', es: 'Revisa bloqueos.bo', pt: 'Verifique bloqueos.bo', fr: 'Vérifiez bloqueos.bo', ja: 'bloqueos.bo で確認', ko: 'bloqueos.bo 확인' },
          n: { en: 'Routes can close overnight. Buffer +1 day in itinerary.', es: 'Las rutas se cierran sin aviso. Deja un día de margen.', pt: 'As estradas podem fechar da noite para o dia. Deixe 1 dia extra.', fr: 'Les routes peuvent fermer du jour au lendemain. Gardez 1 jour de secours.', ja: '道路が突然閉鎖されることがあります。旅程には1日の余裕を持たせて。', ko: '하루아침에 도로가 차단될 수 있습니다. 일정에 하루 정도 여유를 두세요.' }
        },
        {
          k: { en: 'Death Road', es: 'Camino de la Muerte', pt: 'Estrada da Morte', fr: 'Route de la Mort', ja: 'デスロード', ko: '데스 로드' },
          v: { en: 'Use insured operators', es: 'Usa agencias con seguro', pt: 'Use empresas com seguro', fr: 'Opérateurs avec assurance', ja: '保険加入済の会社を使う', ko: '보험 가입 대행사 이용' },
          n: { en: 'Gravity Bolivia, Barracuda · ~Bs 600 / $85, helmets + radio', es: 'Gravity Bolivia, Barracuda · ~Bs 600, cascos + comunicación', pt: 'Gravity Bolívia, Barracuda · ~Bs 600, capacetes + rádio', fr: 'Gravity Bolivia, Barracuda · ~600 Bs, équipement complet + radio', ja: 'Gravity Bolivia, Barracuda等 · 約600 Bs、無線ヘルメット付き', ko: 'Gravity Bolivia, Barracuda 등 · ~Bs 600, 안전 장비 필수 제공' }
        },
        {
          k: { en: 'Solo women', es: 'Mujeres solas', pt: 'Mulheres viajando sós', fr: 'Femmes seules', ja: '女性の一人旅', ko: '여성 솔로 여행' },
          v: { en: 'Generally fine', es: 'Generalmente seguro', pt: 'Geralmente tranquilo', fr: 'Généralement sûr', ja: '概ね安全です', ko: '대체로 안전함' },
          n: { en: 'Stick to El Prado, Sopocachi at night. Catcalling, not assault.', es: 'Mantente en El Prado o Sopocachi de noche. Acoso verbal, no físico.', pt: 'Fique no El Prado e Sopocachi à noite. Há cantadas, não violência.', fr: 'Restez sur El Prado ou Sopocachi la nuit. Harcèlement de rue, pas d\'agression.', ja: '夜間はプラド通りやソポカチ周辺に。声かけはありますが身体的被害は稀。', ko: '밤에는 엘 프라도, 소포카치 지역에 머무르기. 가벼운 말걸기 수준.' }
        },
        {
          k: { en: 'Tap water', es: 'Agua del grifo', pt: 'Água da torneira', fr: 'Eau du robinet', ja: '水道水', ko: '수돗물' },
          v: { en: "Don't", es: 'No la tomes', pt: 'Não beba', fr: 'À éviter', ja: '飲まない', ko: '식수 불가능' },
          n: { en: 'Filter or boil. Bottled Bs 5/L. Hostels usually filter.', es: 'Filtra o hierve. Botella Bs 5/L. Los hostales suelen filtrar.', pt: 'Filtre ou ferva. Garrafa Bs 5/L. Hostels costumam filtrar.', fr: 'Filtrez ou bouillez. Bouteille 5 Bs/L. Les auberges filtrent souvent.', ja: '煮沸するかフィルターを通す。ペットボトルは1L約5 Bs。', ko: '끓여 먹거나 필터 사용. 생수 구매 시 1L에 약 5 Bs.' }
        }
      ]
    },
    dictionary: {
      label: t('guide.tab.dictionary', 'Dictionary'),
      title: locale === 'es' ? 'Diccionario cultural.' :
             locale === 'pt' ? 'Dicionário cultural.' :
             locale === 'fr' ? 'Dictionnaire culturel.' :
             locale === 'ja' ? '文化ミニ辞典。' :
             locale === 'ko' ? '문화 미니 사전.' : 'The words that aren\'t in the phrasebook.',
      sub: locale === 'es' ? 'Español boliviano, aymara, quechua — con ejemplos, audios y pronunciación real.' :
           locale === 'pt' ? 'Espanhol boliviano, aymara, quechua — com exemplos e pronúncia real.' :
           locale === 'fr' ? 'Espagnol bolivien, aymara, quechua — avec exemples et prononciation locale.' :
           locale === 'ja' ? 'ボリビアのスペイン語、アイマラ語、ケチュア語など、ガイドブックに載っていない生きた言葉。' :
           locale === 'ko' ? '일반 회화책에 없는 현지식 표현, 아이마라어, 케추아어 해설.' : 'Bolivian Spanish, Aymara, Quechua — searchable, with examples and pronunciation.',
      cards: []
    },
    when: {
      label: t('guide.tab.when', 'When to go'),
      title: locale === 'es' ? 'Las estaciones del año.' :
             locale === 'pt' ? 'As estações do ano.' :
             locale === 'fr' ? 'Choisir sa saison.' :
             locale === 'ja' ? 'ベストシーズンの選択。' :
             locale === 'ko' ? '최적의 여행 시즌.' : 'Reading the seasons.',
      sub: locale === 'es' ? 'Dos épocas distintas. Elige según lo que busques en tu viaje.' :
           locale === 'pt' ? 'Duas épocas distintas. Escolha dependendo do seu objetivo de viagem.' :
           locale === 'fr' ? 'Deux périodes distinctes. Choisissez selon vos envies.' :
           locale === 'ja' ? '雨季と乾季の2つの季節。目的に合わせて時期を選んでください。' :
           locale === 'ko' ? '두 개의 뚜렷한 시즌. 여행 목적에 맞게 선택하세요.' : 'Two windows. Pick by what you came for.',
      cards: [
        {
          k: { en: 'May – Oct', es: 'Mayo – Oct', pt: 'Maio – Out', fr: 'Mai – Oct', ja: '5月 〜 10月', ko: '5월 ~ 10월' },
          v: { en: 'Dry season', es: 'Época seca', pt: 'Temporada seca', fr: 'Saison sèche', ja: '乾季', ko: '건기' },
          n: { en: 'Best for trekking, salar (dry hexagons), city walking. Cold nights.', es: 'Ideal para trekking, salar (hexágonos secos) y ciudades. Noches frías.', pt: 'Ideal para trekking, salar seco (hexágonos) e cidades. Noites frias.', fr: 'Idéal pour le trek, le salar sec (hexagones), les villes. Nuits froides.', ja: '登山・トレッキング、乾いたウユニ塩湖、街歩きに最適。夜は冷え込みます。', ko: '트레킹, 건조한 소금사막(벌집무늬) 보기 좋음. 밤에는 매우 추움.' }
        },
        {
          k: { en: 'Nov – Apr', es: 'Nov – Abr', pt: 'Nov – Abr', fr: 'Nov – Avr', ja: '11月 〜 4月', ko: '11월 ~ 4월' },
          v: { en: 'Wet season', es: 'Época de lluvias', pt: 'Temporada de chuvas', fr: 'Saison des pluies', ja: '雨季', ko: '우기' },
          n: { en: 'Salar mirror reflection, lush altiplano, cheaper. Roads can close.', es: 'Efecto espejo en el salar, paisaje verde, económico. Rutas cortadas.', pt: 'Efeito espelho no salar, campos verdes, mais barato. Estradas fecham.', fr: 'Effet miroir sur le salar, paysage vert, moins cher. Routes coupées.', ja: 'ウユニ塩湖の鏡張り、緑豊かな高原。安くなりますが道路閉鎖のリスクあり。', ko: '소금사막 물 고인 거울 효과, 푸른 초원, 저렴함. 도로 통제 가능성.' }
        },
        {
          k: { en: 'Apr – May', es: 'Abr – May', pt: 'Abr – Mai', fr: 'Avr – Mai', ja: '4月 〜 5月', ko: '4월 ~ 5월' },
          v: { en: 'Sweet spot', es: 'Punto ideal', pt: 'Época de transição', fr: 'Période idéale', ja: 'ベストバランス', ko: '가장 좋은 시기' },
          n: { en: 'Mirror is fading but visible · trails open · Carnaval just past', es: 'Espejo visible pero secándose · senderos abiertos · Carnaval terminado', pt: 'Espelho sumindo mas visível · trilhas abertas · Carnaval recém-passado', fr: 'Miroir visible mais s\'asséchant · sentiers ouverts · Carnaval passé', ja: '鏡張りが少し残り、登山道が開通し、カーニバルがちょうど終わる時期。', ko: '거울 효과가 남아있고 트레킹로 열림 · 카니발 축제 직후' }
        },
        {
          k: { en: 'Jun 21', es: '21 de Junio', pt: '21 de Junho', fr: '21 Juin', ja: '6月21日', ko: '6월 21일' },
          v: { en: 'Aymara new year', es: 'Año Nuevo Aymara', pt: 'Ano Novo Aymara', fr: 'Nouvel an Aymara', ja: 'アイマラ正月', ko: '아이마라 신년' },
          n: { en: 'Tiwanaku at dawn · sun ceremony · the most local thing you\'ll see', es: 'Tiwanaku al amanecer · ceremonia del sol · vivencia muy local', pt: 'Tiwanaku ao amanhecer · cerimônia solar · experiência muito nativa', fr: 'Tiwanaku à l\'aube · cérémonie du soleil · immersion locale garantie', ja: 'ティワナク遺跡での日の出拝み · 太陽の儀式 · 最も伝統的なお祭り', ko: '새벽녘 티와나쿠 · 태양 의식 관람 · 가장 현지다운 행사' }
        },
        {
          k: { en: 'Feb', es: 'Febrero', pt: 'Fevereiro', fr: 'Février', ja: '2月', ko: '2월' },
          v: { en: 'Carnaval de Oruro', es: 'Carnaval de Oruro', pt: 'Carnaval de Oruro', fr: 'Carnaval d\'Oruro', ja: 'オルロのカーニバル', ko: '오루로 카니발' },
          n: { en: 'UNESCO heritage. Book 6 weeks ahead. Folk dance + foam wars.', es: 'Patrimonio UNESCO. Reserva con 6 semanas. Danza folclórica y espuma.', pt: 'Patrimônio UNESCO. Reserve 6 semanas antes. Danças e guerra de espuma.', fr: 'Patrimoine UNESCO. Réservez 6 semaines avant. Danses et mousse.', ja: '世界遺産。6週間前までの要予約。伝統舞踊と泡の掛け合いバトル。', ko: '유네스코 문화유산. 6주 전 예약 필수. 전통 댄스 및 거품 놀이.' }
        },
        {
          k: { en: 'Aug', es: 'Agosto', pt: 'Agosto', fr: 'Août', ja: '8月', ko: '8월' },
          v: { en: 'Driest, coldest', es: 'Más seco y frío', pt: 'Mais seco e frio', fr: 'Le plus sec et froid', ja: '最乾燥・極寒期', ko: '가장 건조하고 추움' },
          n: { en: 'Sub-zero nights in Uyuni, perfect Milky Way, brutal mornings', es: 'Noches bajo cero en Uyuni, Vía Láctea perfecta, mañanas heladas', pt: 'Noites sub-zero em Uyuni, Via Láctea perfeita, manhãs congelantes', fr: 'Nuits glaciales à Uyuni, Voie lactée magnifique, matins très froids', ja: 'ウユニは氷点下の夜、天の川がきれいに見えますが朝は極寒。', ko: '우유니 영하의 밤, 완벽한 은하수 관측 가능, 아침 추위 극심' }
        }
      ]
    }
  };

  // Per-tab visual identity: icon, accent color, featured photo and a per-card
  // icon set — reuses the existing image assets (web/public/assets/images) and
  // icon library (ui/iconos.jsx) to keep the design system consistent.
  const tabMeta = {
    arrive:     { icon: I.Globe,    accent: 'var(--green-500)',   image: IMG.photoCustoms,   cardIcons: [I.Building, I.Flag, I.Star, I.Phone, I.Volume, I.Coffee] },
    altitude:   { icon: I.Mountain, accent: 'var(--mystic-600)',  image: IMG.photoAltiplano, cardIcons: [I.Sun, I.Route, I.Boot, I.Heart, I.Alert, I.Mountain] },
    money:      { icon: I.Coffee,   accent: 'var(--amber-600)',   image: IMG.photoValles,    cardIcons: [I.Building, I.Building, I.Coffee, I.Star, I.Route, I.Tram] },
    safe:       { icon: I.Shield,   accent: 'var(--rust-500)',    image: IMG.photoYungas,    cardIcons: [I.Shield, I.Alert, I.Route, I.Boot, I.Heart, I.Cloud] },
    dictionary: { icon: I.Book,     accent: 'var(--rust-500)',    image: IMG.photoMetro,     cardIcons: [] },
    when:       { icon: I.Calendar, accent: 'var(--navy-600)',    image: IMG.photoUyuni,     cardIcons: [I.Sun, I.Cloud, I.Star, I.Sparkle, I.Heart, I.Moon] },
  };

  const active = cardData[tab];
  const meta = tabMeta[tab] || tabMeta.arrive;

  const gallery = [
    { img: IMG.photoUyuni,    label: { en: 'Salar de Uyuni', es: 'Salar de Uyuni' } },
    { img: IMG.photoTiticaca, label: { en: 'Lake Titicaca',  es: 'Lago Titicaca' } },
    { img: IMG.photoYungas,   label: { en: 'The Yungas',     es: 'Los Yungas' } },
    { img: IMG.photoMadidi,   label: { en: 'Madidi',         es: 'Madidi' } },
  ];
  const galLabel = (l) => l[locale] || l.en;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {}
      <section style={{ color: '#fff', padding: isMobile ? '56px 0 64px' : '80px 0 88px', position: 'relative', overflow: 'hidden' }}>
        {}
        <div className="bi-hero-photo" style={{
          position: 'absolute', inset: 0,
          backgroundImage: IMG.photoEssentials,
          backgroundSize: 'cover', backgroundPosition: 'center',
        }}/>
        {}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(20,32,53,0.85) 0%, rgba(122,40,28,0.78) 60%, rgba(13,18,30,0.92) 100%)',
        }}/>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,183,3,0.2) 0%, transparent 70%)' }}/>
        <div style={{ position: 'absolute', bottom: -150, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(179,63,46,0.18) 0%, transparent 70%)' }}/>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 20px' : '0 32px', position: 'relative' }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', padding: '8px 14px', borderRadius: 999, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, marginBottom: 24 }}><I.ArrowL size={13}/> {t('guide.back', 'Back to home')}</button>
          <div className="eyebrow" style={{ color: 'var(--amber-300)' }}>{t('guide.eyebrow', 'Travel Guide · For independent travelers')}</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? 'clamp(36px,9vw,48px)' : 'clamp(48px,7vw,96px)', lineHeight: 0.95, color: '#fff', margin: '12px 0 0', fontWeight: 600, letterSpacing: '-0.035em', maxWidth: 1100 }}>
            {t('guide.title', 'Bolivia, the')}<br/><em style={{ fontStyle: 'normal', fontWeight: 800, color: 'var(--amber-300)' }}>{t('guide.titleEm', 'essentials.')}</em>
          </h1>
          <p style={{ fontSize: isMobile ? 15 : 19, color: 'rgba(255,255,255,0.85)', marginTop: 20, maxWidth: 640, lineHeight: 1.55 }}>
            {t('guide.descIntro', "No bookings, no commission. Just what we wish we'd known on day one — pulled together by people who actually live here.")}
          </p>

          {}
          <div style={{ display: 'flex', gap: isMobile ? 18 : 36, marginTop: isMobile ? 26 : 34, flexWrap: 'wrap' }}>
            {[
              { k: '3,640 m', v: { en: 'La Paz elevation', es: 'Altitud de La Paz' } },
              { k: '6', v: { en: 'Essential topics', es: 'Temas esenciales' } },
              { k: '100%', v: { en: 'Free · no login', es: 'Gratis · sin login' } },
            ].map((s) => (
              <div key={s.k}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? 22 : 28, fontWeight: 500, color: 'var(--amber-300)', lineHeight: 1 }}>{s.k}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', letterSpacing: 0.4, fontWeight: 600, textTransform: 'uppercase', marginTop: 5 }}>{galLabel(s.v)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {}
      <section style={{ background: '#fff', borderBottom: '1px solid var(--border)', position: 'sticky', top: 64, zIndex: 20, backdropFilter: 'blur(12px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 20px' : '0 32px', display: 'flex', gap: 4, overflowX: 'auto', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
          {Object.entries(cardData).map(([id, s]) => {
            const TabIcon = (tabMeta[id] || {}).icon;
            const activeTab = tab === id;
            return (
              <button key={id} onClick={() => setTab(id)} style={{
                padding: isMobile ? '18px 16px' : '20px 20px', background: 'transparent',
                border: 0, borderBottom: activeTab ? '3px solid var(--rust-500)' : '3px solid transparent',
                cursor: 'pointer', whiteSpace: 'nowrap',
                display: 'inline-flex', alignItems: 'center', gap: 8,
                fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 700,
                color: activeTab ? 'var(--fg1)' : 'var(--fg3)',
                transition: 'all 180ms',
              }}>
                {TabIcon && <TabIcon size={16}/>}
                {s.label}
              </button>
            );
          })}
        </div>
      </section>

      {}
      {tab === 'dictionary' ? (
        <Dictionary embedded onExpert={onExpert}/>
      ) : (
      <section style={{ padding: isMobile ? '40px 0 64px' : '64px 0 100px' }}>
        <div key={tab} className="bi-guide-content" style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 20px' : '0 32px' }}>

          {}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, maxWidth: 760, marginBottom: isMobile ? 24 : 32 }}>
            <div style={{
              width: isMobile ? 44 : 52, height: isMobile ? 44 : 52, borderRadius: 14, flexShrink: 0,
              background: `color-mix(in srgb, ${meta.accent} 14%, #fff)`, color: meta.accent,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `1px solid color-mix(in srgb, ${meta.accent} 30%, transparent)`,
            }}>
              <meta.icon size={isMobile ? 22 : 26}/>
            </div>
            <div>
              <h2 style={{ fontSize: isMobile ? 'clamp(26px,7vw,34px)' : 'clamp(30px,4vw,48px)', margin: 0, lineHeight: 1.05 }}>{active.title}</h2>
              <p style={{ fontSize: isMobile ? 15 : 18, color: 'var(--fg2)', marginTop: 12, lineHeight: 1.6 }}>{active.sub}</p>
            </div>
          </div>

          {}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr',
            gap: isMobile ? 14 : 20, marginBottom: isMobile ? 28 : 40,
          }}>
            {}
            <div style={{
              position: 'relative', borderRadius: 18, overflow: 'hidden',
              minHeight: isMobile ? 200 : 300, boxShadow: 'var(--shadow-md)',
            }}>
              <div className="bi-feature-photo" style={{
                position: 'absolute', inset: 0, backgroundImage: meta.image,
                backgroundSize: 'cover', backgroundPosition: 'center',
              }}/>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(13,18,30,0.05) 0%, rgba(13,18,30,0.78) 100%)' }}/>
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: isMobile ? 18 : 24 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.16)', border: '1px solid rgba(255,255,255,0.28)', backdropFilter: 'blur(8px)', color: '#fff', padding: '6px 12px', borderRadius: 999, fontSize: 11, fontWeight: 800, letterSpacing: 0.4, textTransform: 'uppercase' }}>
                  <meta.icon size={13}/> {active.label}
                </div>
                <div style={{ color: '#fff', fontFamily: 'var(--font-display)', fontSize: isMobile ? 22 : 30, fontWeight: 600, marginTop: 12, letterSpacing: '-0.02em', lineHeight: 1.05 }}>
                  {active.title}
                </div>
              </div>
            </div>

          </div>

          {}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? 12 : 18 }}>
            {active.cards.map((c, i) => {
              const translatedK = c.k[locale] || c.k['en'] || c.k;
              const translatedV = c.v[locale] || c.v['en'] || c.v;
              const translatedN = c.n[locale] || c.n['en'] || c.n;
              const CardIcon = (meta.cardIcons || [])[i] || meta.icon;

              return (
                <article key={i} className="bi-guide-card" style={{
                  background: '#fff', borderRadius: 16,
                  padding: 22, border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-xs)',
                  animationDelay: `${Math.min(i, 6) * 60}ms`,
                  transition: 'transform 220ms var(--ease-out), box-shadow 220ms var(--ease-out)',
                  cursor: 'default',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-xs)'; }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 11, marginBottom: 14,
                    background: `color-mix(in srgb, ${meta.accent} 12%, #fff)`, color: meta.accent,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <CardIcon size={20}/>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.4, textTransform: 'uppercase', color: 'var(--fg3)' }}>{translatedK}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 23, fontWeight: 500, color: 'var(--fg1)', marginTop: 6, lineHeight: 1.15 }}>{translatedV}</div>
                  <div style={{ height: 3, width: 34, borderRadius: 999, background: meta.accent, margin: '12px 0', opacity: 0.85 }}/>
                  <div style={{ fontSize: 13, color: 'var(--fg2)', lineHeight: 1.55, fontFamily: 'var(--font-sans)' }}>{translatedN}</div>
                </article>
              );
            })}
          </div>

          {}
          <div style={{ marginTop: isMobile ? 44 : 64 }}>
            <div className="eyebrow" style={{ marginBottom: 14 }}>{t('guide.galleryEyebrow', 'More of Bolivia')}</div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? 10 : 16 }}>
              {gallery.map((g, i) => (
                <div key={i} className="bi-gallery-item" style={{
                  position: 'relative', borderRadius: 14, overflow: 'hidden',
                  height: isMobile ? 120 : 170, boxShadow: 'var(--shadow-sm)',
                }}>
                  <div className="bi-gallery-photo" style={{
                    position: 'absolute', inset: 0, backgroundImage: g.img,
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    transition: 'transform 500ms var(--ease-out)',
                  }}/>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(13,18,30,0.72) 100%)' }}/>
                  <div style={{ position: 'absolute', left: 12, bottom: 10, color: '#fff', fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-sans)', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>{galLabel(g.label)}</div>
                </div>
              ))}
            </div>
          </div>

          {}
          <div style={{
            marginTop: isMobile ? 40 : 56, padding: isMobile ? 24 : 32, borderRadius: 18,
            background: 'linear-gradient(135deg, var(--navy-700) 0%, var(--mystic-700) 100%)', color: '#fff',
            display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? 16 : 24, flexWrap: 'wrap',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,183,3,0.16) 0%, transparent 70%)', pointerEvents: 'none' }}/>
            <div style={{ width: isMobile ? 48 : 56, height: isMobile ? 48 : 56, borderRadius: 14, background: 'var(--amber-500)', color: 'var(--navy-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative' }}>
              <I.Sparkle size={isMobile ? 22 : 26}/>
            </div>
            <div style={{ flex: 1, minWidth: isMobile ? '100%' : 260, position: 'relative' }}>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.4, textTransform: 'uppercase', color: 'var(--amber-300)' }}>{t('guide.needPerson', 'Need a person, not a page?')}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? 18 : 22, marginTop: 6, fontWeight: 500 }}>{t('guide.bookVideo', 'Book a 15- or 30-min video call with a local writer who knows your route — from $12.')}</div>
            </div>
            <Btn kind="amber" size="md" onClick={onExpert} style={{ width: isMobile ? '100%' : 'auto', justifyContent: 'center', position: 'relative' }}>{t('guide.talkButton', 'Talk to a local')} <I.ArrowR size={14}/></Btn>
          </div>
        </div>
      </section>
      )}

      <style>{`
        .bi-guide-content { animation: bi-guide-fade 360ms var(--ease-out) both; }
        .bi-guide-card { animation: bi-guide-rise 420ms var(--ease-out) both; }
        .bi-feature-photo { transition: transform 600ms var(--ease-out); }
        .bi-gallery-item:hover .bi-gallery-photo { transform: scale(1.06); }
        .bi-play { transition: transform 220ms var(--ease-spring); }
        button:hover > .bi-play, button:focus-visible > .bi-play { transform: scale(1.08); }
        @keyframes bi-guide-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes bi-guide-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @media (prefers-reduced-motion: reduce) {
          .bi-guide-content, .bi-guide-card { animation: none; }
        }
      `}</style>
    </div>
  );
}
export default TravelGuide;
