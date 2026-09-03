import React, { useState, useEffect } from 'react';
import { useI18n } from '../data/translations.jsx';
import I from '../ui/iconos.jsx';
import Btn from '../ui/Boton.jsx';

function EmergencyHub({ onBack }) {
  const { t, locale } = useI18n();
  const [city, setCity] = useState('copacabana');
  const [vw, setVw] = React.useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  React.useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isMobile = vw < 768;

  const cities = [
    // Ordered by how much a traveller on the classic Bolivia circuit needs them,
    // not alphabetically or by population.
    { id: 'copacabana',  label: locale === 'ja' ? 'コパカバーナ' : locale === 'ko' ? '코파카바나' : 'Copacabana' },
    { id: 'uyuni',       label: locale === 'ja' ? 'ウユニ' : locale === 'ko' ? '우유니' : 'Uyuni' },
    { id: 'lapaz',       label: locale === 'ja' ? 'ラパス' : locale === 'ko' ? '라파스' : 'La Paz' },
    { id: 'sucre',       label: locale === 'ja' ? 'スクレ' : locale === 'ko' ? '수크레' : 'Sucre' },
    { id: 'cochabamba',  label: locale === 'ja' ? 'コチャバンバ' : locale === 'ko' ? '코차반바' : 'Cochabamba' },
    { id: 'rurrenabaque',label: locale === 'ja' ? 'ルレナバケ' : locale === 'ko' ? '루레나바케' : 'Rurrenabaque' },
    { id: 'potosi',      label: locale === 'ja' ? 'ポトシ' : locale === 'ko' ? '포토시' : 'Potosí' },
    { id: 'santacruz',   label: locale === 'ja' ? 'サンタクルス' : locale === 'ko' ? '산타크루즈' : 'Santa Cruz' },
  ];

  const critical = [
    { id: 'police',  label: t('sos.police', 'Police'),         number: '110', icon: <I.Shield size={28}/>,   note: locale === 'es' ? 'Línea de emergencia nacional' : locale === 'pt' ? 'Linha de emergência nacional' : locale === 'fr' ? 'Ligne d\'urgence nationale' : locale === 'ja' ? '全国共通緊急ダイヤル' : locale === 'ko' ? '경찰 긴급 신고' : 'National emergency line' },
    { id: 'medical', label: t('sos.medical', 'Medical / SAR'),  number: '118', icon: <I.Heart size={28}/>,    note: locale === 'es' ? 'Ambulancia y búsqueda y rescate' : locale === 'pt' ? 'Ambulância e busca & salvamento' : locale === 'fr' ? 'Ambulance et recherche & sauvetage' : locale === 'ja' ? '救急車・捜索救助' : locale === 'ko' ? '구급차 및 구조대' : 'Ambulance and search & rescue' },
    { id: 'tourist', label: t('sos.touristPolice', 'Tourist Police'), number: '800-14-0081', icon: <I.Flag size={28}/>, note: locale === 'es' ? 'Atención en inglés, enfocado en turistas' : locale === 'pt' ? 'Atendimento em inglês, focado em turistas' : locale === 'fr' ? 'Anglophone, dédié aux touristes' : locale === 'ja' ? '観光警察（英語対応、旅行者向け）' : locale === 'ko' ? '관광 경찰 (영어 가능, 여행자 특화)' : 'English-speaking, tourist-focused' },
  ];

  
  const directories = {
    lapaz: {
      hospitals: [
        { name: 'Clínica Alemana',         addr: 'Av. 6 de Agosto 2821, Sopocachi',   phone: '+591 2 244-8400', hours: '24h',          note: 'Best-equipped private hospital' },
        { name: 'Hospital del Tórax',      addr: 'Plaza Antofagasta, San Pedro',       phone: '+591 2 248-9015', hours: '24h',          note: 'Public, altitude specialists' },
        { name: 'Centro Médico Boliviano-Belga', addr: 'Av. Saavedra 2384, Miraflores', phone: '+591 2 222-2155', hours: '24h',         note: 'Mid-range, English staff' },
      ],
      pharmacies: [
        { name: 'Farmacorp Sopocachi',     addr: 'Av. 20 de Octubre 2002',             phone: '+591 2 211-9988', hours: '24h',          note: 'Largest 24-hour chain' },
        { name: 'Chávez El Prado',         addr: 'Av. 16 de Julio 1571',               phone: '+591 2 233-7676', hours: '24h',          note: 'Central, English signage' },
      ],
      embassies: [
        { name: 'United States Embassy',   addr: 'Av. Arce 2780, San Jorge',           phone: '+591 2 216-8000', hours: 'Mon–Fri 8–17',  note: 'After-hours emergency line on website' },
        { name: 'British Embassy',         addr: 'Av. Arce 2732',                      phone: '+591 2 243-3424', hours: 'Mon–Fri 9–13',  note: 'Consular emergencies 24h' },
        { name: 'German Embassy',          addr: 'Av. Arce 2395',                      phone: '+591 2 244-0606', hours: 'Mon–Fri 8–12',  note: '' },
        { name: 'Embajada de Argentina',   addr: 'Aspiazu 497, Sopocachi',             phone: '+591 2 241-7737', hours: 'Mon–Fri 9–14',  note: '' },
      ],
      banks: [
        { name: 'Banco Bisa Sopocachi',    addr: 'Av. 20 de Octubre 2300',             phone: '+591 2 234-3232', hours: 'Mon–Fri 8:30–17', note: 'USD exchange, traveler\'s checks' },
        { name: 'BCP Calacoto',            addr: 'Calle 17, Calacoto',                 phone: '+591 2 277-5000', hours: 'Mon–Fri 8:30–17', note: 'Largest ATM network' },
      ],
      taxis: [
        { name: 'InDriver',                addr: 'App-based, citywide',                phone: 'app',             hours: '24h',           note: 'Cheapest, set your own price' },
        { name: 'Cabify',                  addr: 'App-based, citywide',                phone: 'app',             hours: '24h',           note: 'Highest safety rating' },
        { name: 'Radio Móvil',             addr: 'Dispatch — citywide',                phone: '+591 2 235-0000', hours: '24h',           note: 'Phone-dispatched, fixed rates' },
      ],
      tourist: [
        { name: 'Infotur La Paz',          addr: 'Plaza del Estudiante (Prado)',       phone: '+591 2 237-1044', hours: 'Daily 9–18',    note: 'Free maps, route advice' },
      ],
    },
    sucre: {
      hospitals: [
        { name: 'Hospital Santa Bárbara',  addr: 'Calle Ravelo, centro',                phone: '+591 4 645-1900', hours: '24h',          note: 'Public, central' },
        { name: 'Clínica Los Olivos',      addr: 'Calle Aniceto Arce 8',               phone: '+591 4 645-3800', hours: '24h',          note: 'Private, mid-range' },
      ],
      pharmacies: [
        { name: 'Farmacia Bolivia',        addr: 'Calle España 75',                    phone: '+591 4 645-3142', hours: 'Daily 8–22',    note: '' },
      ],
      embassies: [],
      banks: [
        { name: 'BCP Sucre',               addr: 'Plaza 25 de Mayo',                   phone: '+591 4 645-1011', hours: 'Mon–Fri 8:30–17', note: 'USD exchange' },
      ],
      taxis: [
        { name: 'Radio Taxi Sucre',        addr: 'Citywide',                           phone: '+591 4 645-1414', hours: '24h',          note: '' },
      ],
      tourist: [
        { name: 'Casa de Turismo',         addr: 'Plaza 25 de Mayo, esquina Argentina', phone: '+591 4 643-1640', hours: 'Daily 8:30–18', note: '' },
      ],
    },
    santacruz: {
      hospitals: [
        { name: 'Hospital Foianini',       addr: 'Av. Irala 468',                      phone: '+591 3 336-2211', hours: '24h',          note: 'Best private in eastern lowlands' },
        { name: 'Hospital Japonés',        addr: 'Av. Japón 3er Anillo',                phone: '+591 3 346-2031', hours: '24h',          note: 'Public reference hospital' },
      ],
      pharmacies: [
        { name: 'Farmacorp Equipetrol',    addr: 'Av. San Martín 100',                 phone: '+591 3 343-4000', hours: '24h',          note: '' },
      ],
      embassies: [
        { name: 'Brazilian Consulate',     addr: 'Av. Busch 330',                      phone: '+591 3 333-4400', hours: 'Mon–Fri 9–13',  note: '' },
      ],
      banks: [
        { name: 'BCP Equipetrol',          addr: 'Av. San Martín y 4to Anillo',         phone: '+591 3 354-0900', hours: 'Mon–Fri 8:30–17', note: '' },
      ],
      taxis: [
        { name: 'Yango',                   addr: 'App-based, citywide',                phone: 'app',             hours: '24h',           note: 'Most active in Santa Cruz' },
      ],
      tourist: [
        { name: 'Infotur Santa Cruz',      addr: 'Plaza 24 de Septiembre',             phone: '+591 3 339-0205', hours: 'Mon–Sat 8–18',  note: '' },
      ],
    },
    cochabamba: {
      hospitals: [
        { name: 'Clínica Belga',           addr: 'Av. Antezana 455',                   phone: '+591 4 425-9100', hours: '24h',          note: '' },
      ],
      pharmacies: [{ name: 'Farmacorp Recoleta', addr: 'Av. América', phone: '+591 4 411-4600', hours: '24h', note: '' }],
      embassies: [],
      banks: [{ name: 'BCP El Prado', addr: 'Plaza Colón', phone: '+591 4 425-0000', hours: 'Mon–Fri 8:30–17', note: '' }],
      taxis: [{ name: 'Radio Taxi Líder', addr: 'Citywide', phone: '+591 4 411-1111', hours: '24h', note: '' }],
      tourist: [{ name: 'Infotur Cochabamba', addr: 'Plaza 14 de Septiembre', phone: '+591 4 425-8030', hours: 'Mon–Sat 8–18', note: '' }],
    },
    uyuni: {
      hospitals: [
        { name: 'Hospital Mario Mercado',  addr: 'Av. Ferroviaria',                    phone: '+591 2 693-2025', hours: '24h',          note: 'Basic care · serious cases evac to Potosí or La Paz' },
      ],
      pharmacies: [{ name: 'Farmacia Salar', addr: 'Av. Potosí', phone: '+591 2 693-2099', hours: 'Daily 8–22', note: '' }],
      embassies: [],
      banks: [{ name: 'Banco Unión',     addr: 'Av. Potosí esq. Bolívar',     phone: '+591 2 693-2188', hours: 'Mon–Fri 8:30–16:30', note: 'Only ATM in town — bring backup cash' }],
      taxis: [{ name: 'Radio Taxi Uyuni', addr: 'Plaza Arce dispatch', phone: '+591 2 693-2700', hours: '24h', note: '' }],
      tourist: [{ name: 'Infotur Uyuni', addr: 'Plaza Arce', phone: '+591 2 693-2060', hours: 'Mon–Sat 9–18', note: 'Tour operators verified here' }],
    },
    copacabana: {
      hospitals: [{ name: 'Hospital Copacabana', addr: 'Av. 6 de Agosto', phone: '+591 2 862-2104', hours: '24h', note: 'Basic · evac to La Paz for serious cases' }],
      pharmacies: [{ name: 'Farmacia Virgen', addr: 'Av. 6 de Agosto', phone: '+591 2 862-2200', hours: 'Daily 8–21', note: '' }],
      embassies: [],
      banks: [{ name: 'Banco Unión Copacabana', addr: 'Av. 6 de Agosto', phone: '+591 2 862-2300', hours: 'Mon–Fri 8:30–16', note: 'Single ATM in town' }],
      taxis: [{ name: 'Trufi Copacabana → La Paz', addr: 'Av. 16 de Julio', phone: '+591 2 862-2080', hours: 'Daily 6–18', note: '' }],
      tourist: [{ name: 'Casa de Turismo', addr: 'Av. 16 de Julio', phone: '+591 2 862-2103', hours: 'Daily 9–18', note: '' }],
    },
    rurrenabaque: {
      hospitals: [{ name: 'Hospital Rurrenabaque', addr: 'Av. Bolívar', phone: '+591 3 892-2052', hours: '24h', note: 'Basic · malaria & dengue care' }],
      pharmacies: [{ name: 'Farmacia Madidi', addr: 'Calle Comercio', phone: '+591 3 892-2114', hours: 'Daily 8–22', note: '' }],
      embassies: [],
      banks: [{ name: 'BancoSol Rurre', addr: 'Calle Comercio', phone: '+591 3 892-2099', hours: 'Mon–Fri 8:30–16', note: '' }],
      taxis: [{ name: 'Moto-taxi dispatch', addr: 'Plaza principal', phone: 'on-site', hours: '24h', note: '' }],
      tourist: [{ name: 'Infotur Rurrenabaque', addr: 'Av. Bolívar y Vaca Diez', phone: '+591 3 892-2300', hours: 'Daily 9–18', note: 'Verifies Madidi operators' }],
    },
    potosi: {
      hospitals: [{ name: 'Hospital Daniel Bracamonte', addr: 'Calle Bustillos', phone: '+591 2 622-7100', hours: '24h', note: 'Public · altitude trained' }],
      pharmacies: [{ name: 'Farmacia Potosí', addr: 'Calle Lanza', phone: '+591 2 622-3088', hours: 'Daily 8–22', note: '' }],
      embassies: [],
      banks: [{ name: 'BCP Potosí', addr: 'Plaza 10 de Noviembre', phone: '+591 2 622-2120', hours: 'Mon–Fri 8:30–17', note: '' }],
      taxis: [{ name: 'Radio Taxi Potosí', addr: 'Citywide', phone: '+591 2 622-3300', hours: '24h', note: '' }],
      tourist: [{ name: 'Infotur Potosí', addr: 'Plaza 6 de Agosto', phone: '+591 2 622-7405', hours: 'Mon–Sat 8:30–18', note: '' }],
    },
  };

  const noteTranslations = {
    'Best-equipped private hospital': { es: 'Hospital privado mejor equipado', pt: 'Hospital privado mais bem equipado', fr: 'Hôpital privé le mieux équipé', ja: '最高設備の私立病院', ko: '최고 시설의 사립 병원' },
    'Public, altitude specialists': { es: 'Público, especialistas en altitud', pt: 'Público, especialistas em altitude', fr: 'Public, spécialiste de l\'altitude', ja: '公立、高山病専門', ko: '공립, 고산병 전문' },
    'Mid-range, English staff': { es: 'Rango medio, personal habla inglés', pt: 'Padrão médio, equipe fala inglês', fr: 'Moyenne gamme, personnel anglophone', ja: '中規模、英語対応可', ko: '중형 병원, 영어 가능 직원' },
    'Largest 24-hour chain': { es: 'La cadena de 24 horas más grande', pt: 'Maior rede 24 horas', fr: 'Plus grande chaîne 24h/24', ja: '最大手の24時間営業チェーン', ko: '최대 규모의 24시간 체인' },
    'Central, English signage': { es: 'Central, señalización en inglés', pt: 'Central, sinalização em inglês', fr: 'Central, panneaux en anglais', ja: '中心部、英語の案内あり', ko: '시내 중심, 영어 안내판' },
    'After-hours emergency line on website': { es: 'Línea de emergencia fuera de horario en el sitio web', pt: 'Linha de emergência fora de hora no site', fr: 'Ligne d\'urgence après fermeture sur le site', ja: '営業時間外의緊急連絡先はウェブに記載', ko: '근무 시간 외 긴급 연락처는 홈페이지 참고' },
    'Consular emergencies 24h': { es: 'Emergencias consulares 24h', pt: 'Emergências consulares 24h', fr: 'Urgences consulaires 24h', ja: '領事緊急連絡先24時間対応', ko: '24시간 영사 긴급 연락 가능' },
    'USD exchange, traveler\'s checks': { es: 'Cambio de USD, cheques de viajero', pt: 'Câmbio de USD, cheques de viagem', fr: 'Change USD, chèques de voyage', ja: '米ドル両替、トラベラーズチェック対応', ko: '미화 환전, 여행자 수표 가능' },
    'Largest ATM network': { es: 'La red de cajeros automáticos más grande', pt: 'Maior rede de caixas eletrônicos', fr: 'Plus grand réseau de distributeurs', ja: '最大規模のATMネットワーク', ko: '최대 규모의 ATM 네트워크' },
    'Cheapest, set your own price': { es: 'El más barato, tú propones el precio', pt: 'Mais barato, você define o preço', fr: 'Le moins cher, fixez votre prix', ja: '最安値、価格交渉可能', ko: '가장 저렴함, 직접 요금 제안' },
    'Highest safety rating': { es: 'Calificación de seguridad más alta', pt: 'Maior classificação de segurança', fr: 'Niveau de sécurité le plus élevé', ja: '最高評価の安全性', ko: '가장 높은 안전 등급' },
    'Phone-dispatched, fixed rates': { es: 'Despacho telefónico, tarifas fijas', pt: 'Chamada por telefone, tarifas fixas', fr: 'Sur appel téléphonique, tarifs fixes', ja: '電話配車、固定料金制', ko: '전화 배차, 고정 요금제' },
    'Free maps, route advice': { es: 'Mapas gratis, asesoramiento de rutas', pt: 'Mapas grátis, dicas de rotas', fr: 'Cartes gratuites, conseils d\'itinéraires', ja: '無料地図、ルート案内', ko: '무료 지도, 경로 안내' },
    'Public, central': { es: 'Público, céntrico', pt: 'Público, central', fr: 'Public, central', ja: '公立、中心部', ko: '공립, 시내 중심' },
    'Private, mid-range': { es: 'Privado, rango medio', pt: 'Privado, médio padrão', fr: 'Privé, moyenne gamme', ja: '私立、中規模', ko: '사립, 중형 병원' },
    'Best private in eastern lowlands': { es: 'Mejor hospital privado en tierras bajas', pt: 'Melhor hospital privado do leste', fr: 'Meilleur hôpital privé de l\'est', ja: '東部低地で最高の私立病院', ko: '동부 저지대 최고의 사립 병원' },
    'Public reference hospital': { es: 'Hospital público de referencia', pt: 'Hospital público de referência', fr: 'Hôpital public de référence', ja: '公立の総合病院', ko: '공립 거점 병원' },
    'Most active in Santa Cruz': { es: 'El más activo en Santa Cruz', pt: 'Mais usado em Santa Cruz', fr: 'Le plus actif à Santa Cruz', ja: 'サン타クルスで最も普及', ko: '산타크루즈에서 가장 활성화됨' },
    'Basic care · serious cases evac to Potosí or La Paz': { es: 'Atención básica · casos graves se trasladan a Potosí o La Paz', pt: 'Atendimento básico · casos graves transferidos para Potosí ou La Paz', fr: 'Soins de base · évacuation vers Potosí ou La Paz pour les cas graves', ja: '基本治療のみ · 重症時はポトシやラパスへ移送', ko: '기초 치료 · 중증 환자는 포토시 또는 라파스로 이송' },
    'Only ATM in town — bring backup cash': { es: 'Único cajero en el pueblo — lleva efectivo de respaldo', pt: 'Único caixa eletrônico da cidade — traga dinheiro extra', fr: 'Unique distributeur en ville — prévoyez du cash de secours', ja: '町で唯一のATM — 予備の現金を持参してください', ko: '마을의 유일한 ATM — 예비 현금 필수 지참' },
    'Plaza Arce dispatch': { es: 'Despacho desde Plaza Arce', pt: 'Ponto na Plaza Arce', fr: 'Sur la Plaza Arce', ja: 'アルセ広場での配車', ko: '아르세 광장에서 배차' },
    'Tour operators verified here': { es: 'Operadores turísticos verificados aquí', pt: 'Operadores turísticos verificados aqui', fr: 'Agences de voyage certifiées ici', ja: '公認のツアー会社リストあり', ko: '검증된 여행사 리스트 제공' },
    'Basic · evac to La Paz for serious cases': { es: 'Básico · traslado a La Paz en casos graves', pt: 'Básico · transferência para La Paz para casos graves', fr: 'Basique · évacuation vers La Paz pour les cas graves', ja: '基本治療のみ · 重症時はラパスへ移送', ko: '기초 치료 · 중증 환자는 라파스로 이송' },
    'Single ATM in town': { es: 'Único cajero en el pueblo', pt: 'Único caixa eletrônico na cidade', fr: 'Unique distributeur en ville', ja: '町で唯一のATM', ko: '마을의 유일한 ATM' },
    'Basic · malaria & dengue care': { es: 'Básico · atención de malaria y dengue', pt: 'Básico · atendimento de malária e dengue', fr: 'Basique · soins pour le paludisme et la dengue', ja: '基本治療のみ · マラリアやデング熱に対応', ko: '기초 치료 · 말라리아 및 뎅기열 치료 가능' },
    'Verifies Madidi operators': { es: 'Verifica operadores de Madidi', pt: 'Verifica agências de Madidi', fr: 'Certifie les agences pour le Madidi', ja: 'マディディの公認ツアー会社を調査', ko: '마디디 국립공원 공인 여행사 확인' },
    'Public · altitude trained': { es: 'Público · capacitados para altitud', pt: 'Público · treinados para altitude', fr: 'Public · formé pour l\'altitude', ja: '公立 · 高地医療のトレーニングあり', ko: '공립 · 고산병 특화 치료 가능' }
  };

  const translateNote = (note) => {
    if (!note) return '';
    if (noteTranslations[note] && noteTranslations[note][locale]) {
      return noteTranslations[note][locale];
    }
    return note;
  };

  const dir = directories[city] || directories.lapaz;
  
  

  const altitudeAlts = {
    lapaz: locale === 'ja' ? 'コロイコ (標高 1,700 m、RN-3経由で車で2.5時間)' : locale === 'ko' ? '코로이코 (고도 1,700m, RN-3 도로 기준 2.5시간 소요)' : 'Coroico (1,700 m, 2.5h drive via RN-3)',
    potosi: locale === 'ja' ? 'スクレ (標高 2,810 m、RN-6経由で車で3時間)' : locale === 'ko' ? '수크레 (고도 2,810m, RN-6 도로 기준 3시간 소요)' : 'Sucre (2,810 m, 3h drive via RN-6)',
    uyuni: locale === 'ja' ? 'トゥピサ (標高 2,950 m、車で4時間)' : locale === 'ko' ? '투피사 (고도 2,950m, 4시간 소요)' : 'Tupiza (2,950 m, 4h drive)',
    copacabana: locale === 'ja' ? 'コロイコ (標高 1,700 m、ラパス経由で5時間)' : locale === 'ko' ? '코로이코 (고도 1,700m, 라파스 경유 5시간 소요)' : 'Coroico (1,700 m, via La Paz · 5h)',
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {}
      <section style={{ background: 'var(--navy-800)', color: '#fff', padding: isMobile ? '56px 0 64px' : '80px 0 88px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 20px' : '0 32px' }}>
          <button onClick={onBack} style={{
            background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)',
            color: '#fff', padding: '8px 14px', borderRadius: 999, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, marginBottom: 24,
          }}><I.ArrowL size={13}/> {t('sos.back', 'Back to home')}</button>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div className="eyebrow" style={{ color: 'var(--rust-300)' }}>{t('sos.eyebrow', 'SOS · Emergency Hub')}</div>
              <h1 style={{
                fontFamily: 'var(--font-display)', fontSize: isMobile ? 'clamp(36px,9vw,52px)' : 'clamp(40px,5.5vw,72px)', lineHeight: 0.98,
                color: '#fff', margin: '12px 0 0', fontWeight: 600, letterSpacing: '-0.03em',
              }}>{t('sos.title', 'SOS · Bolivia.')}</h1>
              <p style={{ fontSize: isMobile ? 15 : 16, color: 'rgba(255,255,255,0.78)', marginTop: 14, maxWidth: 580, lineHeight: 1.55 }}>
                {t('sos.desc', 'Numeros de referencia. Confirma antes de usarlos y guarda esta pagina sin conexion antes de salir del wifi.')}
              </p>
            </div>
            <Btn kind="glass" size={isMobile ? "sm" : "md"} onClick={() => window.print()} style={{ flexShrink: 0, marginTop: isMobile ? 12 : 0 }}>
              <I.Download size={14}/> {t('sos.saveOffline', 'Save offline')}
            </Btn>
          </div>
        </div>
      </section>

      {}
      <section style={{ background: 'var(--bg)', padding: isMobile ? '24px 0 8px' : '32px 0 8px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 20px' : '0 32px',
          display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
          {critical.map(c => (
            <a key={c.id} href={`tel:${c.number.replace(/[\s-]/g, '')}`} style={{
              display: 'flex', alignItems: 'center', gap: 18,
              background: 'var(--rust-500)', color: '#fff',
              padding: '20px 24px', borderRadius: 16, textDecoration: 'none',
              boxShadow: '0 12px 28px -10px rgba(179,63,46,0.5)',
              minHeight: 96, cursor: 'pointer',
              transition: 'transform 160ms var(--ease-out)',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                background: 'rgba(255,255,255,0.18)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>{c.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.4, textTransform: 'uppercase', color: 'rgba(255,255,255,0.82)' }}>{c.label}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 500, marginTop: 2, lineHeight: 1.1, letterSpacing: '-0.01em' }}>{c.number}</div>
                <div style={{ fontSize: 12, marginTop: 4, color: 'rgba(255,255,255,0.78)' }}>{c.note}</div>
              </div>
              <I.Phone size={22}/>
            </a>
          ))}
        </div>
      </section>

      {}
      <section style={{ padding: isMobile ? '24px 0 8px' : '32px 0 8px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 20px' : '0 32px' }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>{t('sos.selectCity', 'Select your city')}</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: isMobile ? 'nowrap' : 'wrap', overflowX: isMobile ? 'auto' : 'visible', paddingBottom: isMobile ? 8 : 0, scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
            {cities.map(c => {
              const active = city === c.id;
              return (
                <button key={c.id} onClick={() => setCity(c.id)}
                  aria-pressed={active}
                  style={{
                    padding: isMobile ? '8px 14px' : '10px 18px', borderRadius: 999,
                    border: active ? '1px solid var(--navy-700)' : '1px solid var(--border-strong)',
                    background: active ? 'var(--navy-700)' : '#fff',
                    color: active ? '#fff' : 'var(--fg1)',
                    fontFamily: 'var(--font-sans)', fontSize: isMobile ? 13 : 14, fontWeight: 600,
                    cursor: 'pointer', transition: 'all 160ms', minHeight: isMobile ? 40 : 44,
                    whiteSpace: isMobile ? 'nowrap' : 'normal',
                    flexShrink: isMobile ? 0 : 1,
                  }}>{c.label}</button>
              );
            })}
          </div>
        </div>
      </section>

      {}
      {altitudeAlts[city] && (
        <section style={{ padding: '20px 0 8px', background: 'var(--bg)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 20px' : '0 32px' }}>
            <div style={{
              display: 'flex', gap: 16, padding: '20px 22px',
              background: 'var(--amber-50, #fff8e1)', border: '1px solid var(--amber-200, #ffe07a)',
              borderRadius: 14, alignItems: 'flex-start',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10, background: 'var(--amber-500)',
                color: 'var(--navy-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}><I.Mountain size={22}/></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.4, textTransform: 'uppercase', color: 'var(--rust-600)' }}>{t('sos.redFlags', 'Altitude red flags — get to lower ground')}</div>
                <p style={{ fontSize: 14, color: 'var(--fg1)', marginTop: 6, lineHeight: 1.55 }}>
                  {t('sos.vomiting', "Vomiting, blue lips, can't walk straight, persistent headache after 24h. Don't wait it out — descend.")}
                </p>
                <p style={{ fontSize: 13, color: 'var(--fg2)', marginTop: 6 }}>
                  {t('sos.nearest', 'Nearest lower-altitude town:')} <strong style={{ color: 'var(--fg1)' }}>{altitudeAlts[city]}</strong>.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {}
      <section style={{ padding: isMobile ? '32px 0 64px' : '40px 0 80px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 20px' : '0 32px',
          display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(360px, 1fr))', gap: isMobile ? 16 : 20 }}>
          <CategoryBlock title={t('sos.cat.hospitals', 'Hospitals')}           icon={<I.Hospital size={18}/>}  items={dir.hospitals} translateNote={translateNote}/>
          <CategoryBlock title={t('sos.cat.pharmacies', '24-hour pharmacies')}  icon={<I.Heart size={18}/>}     items={dir.pharmacies} translateNote={translateNote}/>
          <CategoryBlock title={t('sos.cat.embassies', 'Embassies')}           icon={<I.Flag size={18}/>}      items={dir.embassies}    empty={t('sos.cat.embassies.empty', 'No consular presence in this city. Nearest in La Paz.')} translateNote={translateNote}/>
          <CategoryBlock title={t('sos.cat.banks', 'Banks · USD exchange')} icon={<I.Building size={18}/>} items={dir.banks} translateNote={translateNote}/>
          <CategoryBlock title={t('sos.cat.taxis', 'Verified taxis')}      icon={<I.Route size={18}/>}     items={dir.taxis} translateNote={translateNote}/>
          <CategoryBlock title={t('sos.cat.tourist', 'Tourist information')} icon={<I.Pin size={18}/>}       items={dir.tourist} translateNote={translateNote}/>
        </div>
      </section>

      {}
      <section style={{ background: 'var(--stone-50)', padding: isMobile ? '20px 0' : '28px 0', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 20px' : '0 32px',
          display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', gap: 14, flexDirection: isMobile ? 'column' : 'row',
          fontSize: 13, color: 'var(--fg2)' }}>
          <I.Shield size={16}/>
          <span>
            {t('sos.verifyMonthly', 'We verify these numbers monthly. Spotted a change?')} <a href="mailto:hola@illasoluciones.com" style={{ color: 'var(--rust-600)', fontWeight: 700 }}>{t('sos.emailUs', 'Email us')}</a> {t('sos.updateNotice', "— we'll update within 24-48 hours.")}
          </span>
        </div>
      </section>
    </div>
  );
}

function CategoryBlock({ title, icon, items, empty, translateNote }) {
  return (
    <section style={{
      background: '#fff', borderRadius: 16, border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-xs)', overflow: 'hidden',
    }}>
      <header style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '16px 22px', borderBottom: '1px solid var(--border)',
        background: 'var(--stone-25)',
      }}>
        <span style={{
          width: 32, height: 32, borderRadius: 8, background: 'var(--navy-700)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{icon}</span>
        <h3 style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 800, letterSpacing: 0.3, textTransform: 'uppercase', color: 'var(--fg1)' }}>{title}</h3>
      </header>
      {items.length === 0 ? (
        <div style={{ padding: '20px 22px', fontSize: 13, color: 'var(--fg3)', fontStyle: 'italic' }}>{empty || 'Not available in this city.'}</div>
      ) : (
        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
          {items.map((it, i) => {
            const tel = typeof it.phone === 'string' && it.phone.startsWith('+') ? it.phone.replace(/[\s-]/g, '') : null;
            return (
              <li key={i} style={{
                padding: '16px 22px',
                borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 0,
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 500, lineHeight: 1.2 }}>{it.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--fg3)', marginTop: 4 }}>{it.addr}</div>
                  </div>
                  {tel ? (
                    <a href={`tel:${tel}`} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '8px 14px', borderRadius: 999,
                      background: 'var(--navy-700)', color: '#fff',
                      fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, letterSpacing: 0.3,
                      textDecoration: 'none', minHeight: 36,
                    }}><I.Phone size={13}/> {it.phone}</a>
                  ) : (
                    <span style={{
                      padding: '6px 12px', borderRadius: 999,
                      background: 'var(--stone-50)', color: 'var(--fg2)',
                      fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, letterSpacing: 0.3,
                    }}>{it.phone}</span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 14, marginTop: 8, fontSize: 12, color: 'var(--fg2)', flexWrap: 'wrap' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><I.Clock size={12}/> {it.hours}</span>
                  {it.note && <span>· {translateNote(it.note)}</span>}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default EmergencyHub;
