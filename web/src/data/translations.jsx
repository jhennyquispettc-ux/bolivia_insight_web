import React, { useState, useEffect, useContext, createContext } from 'react';

const TRANSLATIONS = {
  es: {
    // Navigation
    "nav.destinations": "Destinos",
    "nav.dashboard": "Tablero en Vivo",
    "nav.guides": "Guía de Viaje",
    "nav.sos": "SOS",
    "nav.talkToLocal": "Hablar con un local",
    "nav.signIn": "Acceder",
    "nav.profile": "Mi Perfil",
    "nav.logout": "Cerrar sesión",
    "nav.lang": "Idioma · Español",
    "nav.drawerTitle": "Bolivia Insight",
    "nav.drawerFooter": "Llamada de 15 min desde $12 · Expertos locales",

    // Hero
    "hero.sparkleSunset": "Salar a las 18:42, atardecer",
    "hero.sparkleNight": "Salar a las 04:32 a.m.",
    "hero.titleDay": "Bolivia, en la [última luz].",
    "hero.titleNight": "Bolivia, bajo la [luz plateada].",
    "hero.subtitle": "El salar tiene dos caras. Una guía de viaje independiente para mochileros que cruzan Bolivia por su cuenta, de día y de noche.",
    "hero.ctaOpenGuide": "Abrir la guía",
    "hero.ctaBrowseDestinations": "Ver destinos",
    "hero.watchAltiplano": "Ver el altiplano →",
    "hero.countryWorth": "El país por el que\n[vale la pena ir despacio].",
    "hero.liveWeather": "Clima en Vivo",
    "hero.roadStatus": "Estado de Carreteras",
    "hero.loading": "Cargando...",
    "hero.expedito": "Expedito",
    "hero.precaution": "Precaución",
    "hero.connectionError": "Error de conexión",
    "weather.loading": "Cargando...",
    "weather.clearFreezing": "Despejado, helado",
    "weather.sunDry": "Soleado, seco",
    "weather.partlyCloudy": "Parcialmente nublado",
    "weather.fog": "Niebla",
    "weather.rain": "Lluvia",
    "weather.snow": "Nieve",
    "weather.thunderstorm": "Tormenta",
    "weather.variable": "Variable",

    // Triptych (Landing tools)
    "companion.eyebrow": "El Compañero · herramientas de uso diario",
    "companion.title": "Tres herramientas que abrirás [cada mañana].",
    "companion.desc": "Gratis, sin iniciar sesión, sin comisiones. La asesoría premium 1-a-1 las financia, para que podamos mantenerlas honestas.",
    "companion.tool1Eyebrow": "Herramienta 01 · Logística",
    "companion.tool1Title": "Tablero en Vivo",
    "companion.tool1Desc": "Carreteras, teleférico, clima, alertas — las cosas que cambian mientras estás en ruta. Una pantalla, actualizada cada cinco minutos.",
    "companion.tool1Cta": "Abrir el tablero",
    "companion.tool2Eyebrow": "Herramienta 02 · Idioma",
    "companion.tool2Title": "Diccionario Cultural",
    "companion.tool2Desc": "Palabras en español boliviano, aymara y quechua que los viajeros realmente escuchan, explicadas por quienes las usan a diario.",
    "companion.tool2Cta": "Abrir el diccionario",
    "companion.tool3Eyebrow": "Herramienta 03 · Seguridad",
    "companion.tool3Title": "Centro de Emergencias SOS",
    "companion.tool3Desc": "Números, hospitales, embajadas, taxis verificados — por ciudad. Diseñado para cargar rápido con mala conexión en el peor momento.",
    "companion.tool3Cta": "Abrir el centro SOS",

    // Booking Band
    "booking.eyebrow": "Asesoría Premium 1-a-1 · Desde $12",
    "booking.title": "Cuando los datos y el diccionario se agotan — [habla con alguien que recorre la ruta].",
    "booking.desc": "Quince o treinta minutos por video con un escritor residente. Auditan tu itinerario, optimizan rutas y responden preguntas que ninguna app puede resolver.",
    "booking.stat1Key": "4",
    "booking.stat1Val": "Expertos locales",
    "booking.stat2Key": "~24h",
    "booking.stat2Val": "Conf. promedio",
    "booking.stat3Key": "4.9",
    "booking.stat3Val": "Calificación · 887 llamadas",
    "booking.btn": "Reservar llamada de 15 min",
    "booking.note": "PAGO POR STRIPE · REEMBOLSABLE 12H ANTES · EL ENLACE DE MEET LLEGA 1H ANTES",

    // Footer
    "footer.desc": "Una guía de viaje independiente de Bolivia, escrita por personas que viven aquí. Sin reservas, sin comisiones — solo notas de campo honestas para viajeros que exploran bajo sus propios términos.",
    "footer.explore": "Explorar",
    "footer.tools": "Herramientas",
    "footer.getHelp": "Obtener ayuda",
    "footer.privacy": "Privacidad · Términos · Cookies",

    // Clusters Section
    "clusters.eyebrow": "Cuatro zonas · 34 rutas en temporada",
    "clusters.title": "Bolivia, por regiones.",
    "clusters.desc": "Cada zona es un viaje en sí mismo: el altiplano sagrado, la aventura metropolitana, los valles coloniales o la selva amazónica.",
    "clusters.viewAll": "Ver todos los destinos",
    "clusters.routes": "rutas",
    "clusters.topPicks": "Destacados",
    "clusters.exploreHighlights": "Explorar atractivos",

    // Cluster Names and details
    "cluster.altiplano.title": "Altiplano Sagrado",
    "cluster.altiplano.sub": "Salar de Uyuni · Lago Titicaca · Tiwanaku",
    "cluster.altiplano.highlights.0": "Salar de Uyuni al atardecer",
    "cluster.altiplano.highlights.1": "Isla del Sol, Lago Titicaca",
    "cluster.altiplano.highlights.2": "Sitio arqueológico de Tiwanaku",
    "cluster.altiplano.highlights.3": "Cementerio de trenes, Uyuni",
    "cluster.altiplano.tip": "Aclimátate 48h en La Paz antes de subir más alto.",

    "cluster.metro.title": "Metropolitano & Aventura",
    "cluster.metro.sub": "La Paz · Tiquipaya · Cordillera Real",
    "cluster.metro.highlights.0": "Red de teleféricos Mi Teleférico",
    "cluster.metro.highlights.1": "Mercado de las Brujas y Calle Jaén",
    "cluster.metro.highlights.2": "Descenso de la Carretera de la Muerte",
    "cluster.metro.highlights.3": "Valle de la Luna",
    "cluster.metro.tip": "Mi Teleférico funciona de 6am a 10pm — Bs. 3 por viaje, 11 líneas.",

    "cluster.valles.title": "Valles & Historia",
    "cluster.valles.sub": "Sucre · Potosí · Tarabuco",
    "cluster.valles.highlights.0": "Casco antiguo colonial de Sucre (UNESCO)",
    "cluster.valles.highlights.1": "Minas de Cerro Rico, Potosí",
    "cluster.valles.highlights.2": "Mercado textil de Tarabuco (domingo)",
    "cluster.valles.highlights.3": "Huellas de dinosaurio en Cal Orck'o",
    "cluster.valles.tip": "Sucre es la transición de altitud más suave hacia el altiplano.",

    "cluster.amazon.title": "Amazonía",
    "cluster.amazon.sub": "Madidi · Rurrenabaque · Río Tuichi",
    "cluster.amazon.highlights.0": "Parque Nacional Madidi (más de 1,000 especies)",
    "cluster.amazon.highlights.1": "Tour de vida silvestre en las Pampas",
    "cluster.amazon.highlights.2": "Albergue ecológico Chalalán",
    "cluster.amazon.highlights.3": "Ribera de San Buenaventura",
    "cluster.amazon.tip": "Calor y humedad de tierras bajas — trae repelente DEET y ropa ligera.",

    "cluster.detail.back": "Todos los destinos",
    "cluster.detail.region": "Región",
    "cluster.detail.suggestedRoutes": "Rutas sugeridas · Sin reservas obligatorias",
    "cluster.detail.waysInto": "Tres rutas en el altiplano.",
    "cluster.detail.readFull": "Ver ruta completa",
    "cluster.detail.writtenBy": "Escrito por",
    "cluster.detail.journalTitle": "Diario · Desde el terreno",
    "cluster.detail.journalQuote": "\"El salar son dos países. Dormimos en uno y despertamos en otro.\"",
    "cluster.detail.journalDesc": "Carla escribe sobre el espejo de la época de lluvias, una fina capa que convierte 10,000 km² de sal en el reflejo más grande del mundo. El momento exacto cambia cada año; aquí te contamos cómo leer las condiciones.",
    "cluster.detail.readEssay": "Leer ensayo",
    "cluster.detail.writerTitle": "Escritora de Altiplano · oriunda de La Paz",

    // Travel Guide Page
    "guide.back": "Volver al inicio",
    "guide.eyebrow": "Guía de Viaje · Para viajeros independientes",
    "guide.title": "Bolivia, lo",
    "guide.titleEm": "esencial.",
    "guide.descIntro": "Sin reservas, sin comisiones. Solo lo que desearíamos haber sabido el primer día, reunido por personas que viven aquí.",
    "guide.needPerson": "¿Necesitas a una persona, no una página?",
    "guide.bookVideo": "Reserva una videollamada de 15 o 30 min con un escritor local que conozca tu ruta — desde $12.",
    "guide.talkButton": "Habla con un local",

    // Travel Guide Tabs
    "guide.tab.arrive": "Llegar",
    "guide.tab.altitude": "Altitud",
    "guide.tab.money": "Dinero y costos",
    "guide.tab.safe": "Seguridad y estafas",
    "guide.tab.dictionary": "Diccionario",
    "guide.tab.when": "Cuándo ir",

    // SOS Hub
    "sos.back": "Volver al inicio",
    "sos.eyebrow": "SOS · Centro de Emergencias",
    "sos.title": "SOS · Bolivia.",
    "sos.desc": "Números reales, vigentes a abril de 2026. Guarda esta página sin conexión antes de salir del wifi del hotel.",
    "sos.saveOffline": "Guardar sin conexión",
    "sos.selectCity": "Selecciona tu ciudad",
    "sos.redFlags": "Alertas rojas de altitud — desciende a menor altura",
    "sos.vomiting": "Vómitos, labios morados, dificultad para caminar recto, dolor de cabeza persistente tras 24h. No esperes: desciende.",
    "sos.nearest": "Ciudad más cercana a menor altitud:",
    "sos.verifyMonthly": "Verificamos estos números mensualmente. ¿Detectaste un cambio?",
    "sos.emailUs": "Escríbenos",
    "sos.updateNotice": "— lo actualizaremos en 24-48 horas."
  },

  en: {
    // Navigation
    "nav.destinations": "Destinations",
    "nav.dashboard": "Live Dashboard",
    "nav.guides": "Travel Guide",
    "nav.sos": "SOS",
    "nav.talkToLocal": "Talk to a local",
    "nav.signIn": "Sign In",
    "nav.profile": "My Profile",
    "nav.logout": "Log Out",
    "nav.lang": "Language · English",
    "nav.drawerTitle": "Bolivia Insight",
    "nav.drawerFooter": "15-min call from $12 · Resident experts",

    // Hero
    "hero.sparkleSunset": "Salar at 18:42, sunset",
    "hero.sparkleNight": "Salar at 04:32 a.m.",
    "hero.titleDay": "Bolivia, in [last light].",
    "hero.titleNight": "Bolivia, in [silver light].",
    "hero.subtitle": "The salt flats keep two faces. An independent travel guide for flashpackers crossing Bolivia on their own — by day and by night.",
    "hero.ctaOpenGuide": "Open the guide",
    "hero.ctaBrowseDestinations": "Browse destinations",
    "hero.watchAltiplano": "Watch the altiplano →",
    "hero.countryWorth": "The country\n[worth slowing for].",
    "hero.liveWeather": "Live Weather",
    "hero.roadStatus": "Road Status",
    "hero.loading": "Loading...",
    "hero.expedito": "Expedito",
    "hero.precaution": "Warning",
    "hero.connectionError": "Connection error",
    "weather.loading": "Loading...",
    "weather.clearFreezing": "Clear, freezing",
    "weather.sunDry": "Sun, dry",
    "weather.partlyCloudy": "Partly cloudy",
    "weather.fog": "Fog",
    "weather.rain": "Rain",
    "weather.snow": "Snow",
    "weather.thunderstorm": "Thunderstorm",
    "weather.variable": "Variable",

    // Triptych (Landing tools)
    "companion.eyebrow": "The Compañero · daily-use tools",
    "companion.title": "Three tools you'll open [every morning].",
    "companion.desc": "Free, no login, no commission. The Premium 1-to-1 advisory pays for them — so we can keep these honest.",
    "companion.tool1Eyebrow": "Tool 01 · Logistics",
    "companion.tool1Title": "Live Dashboard",
    "companion.tool1Desc": "Roads, cable car, weather, alerts — the things that change while you're on the road. One screen, refreshed every five minutes.",
    "companion.tool1Cta": "Open the dashboard",
    "companion.tool2Eyebrow": "Tool 02 · Language",
    "companion.tool2Title": "Cultural Dictionary",
    "companion.tool2Desc": "Bolivian-Spanish, Aymara, and Quechua words travelers actually hear — said by people who use them every day.",
    "companion.tool2Cta": "Open the dictionary",
    "companion.tool3Eyebrow": "Tool 03 · Safety",
    "companion.tool3Title": "Emergency SOS Hub",
    "companion.tool3Desc": "Numbers, hospitals, embassies, verified taxis — by city. Designed to load fast on a bad connection at the worst moment.",
    "companion.tool3Cta": "Open the SOS hub",

    // Booking Band
    "booking.eyebrow": "Premium 1-to-1 advisory · From $12",
    "booking.title": "When the data and the dictionary run out — [talk to a person who walks the route].",
    "booking.desc": "Fifteen or thirty minutes by video with a resident writer. They audit your itinerary, optimize routes, and answer the questions no app can.",
    "booking.stat1Key": "4",
    "booking.stat1Val": "Local experts",
    "booking.stat2Key": "~24h",
    "booking.stat2Val": "Avg confirm",
    "booking.stat3Key": "4.9",
    "booking.stat3Val": "Avg rating · 887 calls",
    "booking.btn": "Book a 15-min call",
    "booking.note": "STRIPE CHECKOUT · REFUNDABLE 12H BEFORE · MEET LINK ARRIVES 1H BEFORE",

    // Footer
    "footer.desc": "An independent travel guide to Bolivia, written by people who live here. No bookings, no commission — just honest field notes for travelers exploring on their own terms.",
    "footer.explore": "Explore",
    "footer.tools": "Tools",
    "footer.getHelp": "Get help",
    "footer.privacy": "Privacy · Terms · Cookies",

    // Clusters Section
    "clusters.eyebrow": "Four clusters · 34 routes in season",
    "clusters.title": "Bolivia, by region.",
    "clusters.desc": "Each cluster is a self-contained journey — high altiplano, urban metropolitan, colonial valley, or Amazon basin.",
    "clusters.viewAll": "View all destinations",
    "clusters.routes": "routes",
    "clusters.topPicks": "Top picks",
    "clusters.exploreHighlights": "Explore highlights",

    // Cluster Names and details
    "cluster.altiplano.title": "Sacred Altiplano",
    "cluster.altiplano.sub": "Salar de Uyuni · Lake Titicaca · Tiwanaku",
    "cluster.altiplano.highlights.0": "Salar de Uyuni at sunset",
    "cluster.altiplano.highlights.1": "Isla del Sol, Lake Titicaca",
    "cluster.altiplano.highlights.2": "Tiwanaku archaeological site",
    "cluster.altiplano.highlights.3": "Train cemetery, Uyuni",
    "cluster.altiplano.tip": "Acclimatize 48h in La Paz before climbing higher.",

    "cluster.metro.title": "Metro & Adventure",
    "cluster.metro.sub": "La Paz · Tiquipaya · Cordillera Real",
    "cluster.metro.highlights.0": "Mi Teleférico cable car network",
    "cluster.metro.highlights.1": "Witches' Market & Calle Jaén",
    "cluster.metro.highlights.2": "Death Road descent",
    "cluster.metro.highlights.3": "Valle de la Luna (Moon Valley)",
    "cluster.metro.tip": "Mi Teleférico runs 6am–10pm — Bs. 3 per ride, 11 lines.",

    "cluster.valles.title": "Valleys & History",
    "cluster.valles.sub": "Sucre · Potosí · Tarabuco",
    "cluster.valles.highlights.0": "Sucre colonial old town (UNESCO)",
    "cluster.valles.highlights.1": "Cerro Rico mines, Potosí",
    "cluster.valles.highlights.2": "Tarabuco textile market (Sunday)",
    "cluster.valles.highlights.3": "Dinosaur footprints at Cal Orck'o",
    "cluster.valles.tip": "Sucre is the gentlest altitude transition into the highlands.",

    "cluster.amazon.title": "Amazon Basin",
    "cluster.amazon.sub": "Madidi · Rurrenabaque · Tuichi River",
    "cluster.amazon.highlights.0": "Madidi National Park (1,000+ bird species)",
    "cluster.amazon.highlights.1": "Pampas wildlife river tour",
    "cluster.amazon.highlights.2": "Chalalán community ecolodge",
    "cluster.amazon.highlights.3": "San Buenaventura riverfront",
    "cluster.amazon.tip": "Lowland heat & humidity — bring DEET and breathable layers.",

    "cluster.detail.back": "All destinations",
    "cluster.detail.region": "Region",
    "cluster.detail.suggestedRoutes": "Suggested routes · No booking required",
    "cluster.detail.waysInto": "Three ways into the altiplano.",
    "cluster.detail.readFull": "Read full route",
    "cluster.detail.writtenBy": "Written by",
    "cluster.detail.journalTitle": "Journal · From the field",
    "cluster.detail.journalQuote": "\"The salar is two countries. We sleep in one and wake in another.\"",
    "cluster.detail.journalDesc": "Carla writes about the wet-season mirror — a thin film that turns 10,000 km² of salt into the largest reflection on earth. The right night to visit changes every year; here's how to read the conditions.",
    "cluster.detail.readEssay": "Read essay",
    "cluster.detail.writerTitle": "Altiplano writer · La Paz native",

    // Travel Guide Page
    "guide.back": "Back to home",
    "guide.eyebrow": "Travel Guide · For independent travelers",
    "guide.title": "Bolivia, the",
    "guide.titleEm": "essentials.",
    "guide.descIntro": "No bookings, no commission. Just what we wish we'd known on day one — pulled together by people who actually live here.",
    "guide.needPerson": "Need a person, not a page?",
    "guide.bookVideo": "Book a 15- or 30-min video call with a local writer who knows your route — from $12.",
    "guide.talkButton": "Talk to a local",

    // Travel Guide Tabs
    "guide.tab.arrive": "Arrive",
    "guide.tab.altitude": "Altitude",
    "guide.tab.money": "Money & costs",
    "guide.tab.safe": "Safety & scams",
    "guide.tab.dictionary": "Dictionary",
    "guide.tab.when": "When to go",

    // SOS Hub
    "sos.back": "Back to home",
    "sos.eyebrow": "SOS · Emergency Hub",
    "sos.title": "SOS · Bolivia.",
    "sos.desc": "Real numbers, current as of April 2026. Save this page offline before you leave the hotel wifi.",
    "sos.saveOffline": "Save offline",
    "sos.selectCity": "Select your city",
    "sos.redFlags": "Altitude red flags — get to lower ground",
    "sos.vomiting": "Vomiting, blue lips, can't walk straight, persistent headache after 24h. Don't wait it out — descend.",
    "sos.nearest": "Nearest lower-altitude town:",
    "sos.verifyMonthly": "We verify these numbers monthly. Spotted a change?",
    "sos.emailUs": "Email us",
    "sos.updateNotice": "— we'll update within 24-48 hours."
  },

  pt: {
    // Navigation
    "nav.destinations": "Destinos",
    "nav.dashboard": "Painel ao Vivo",
    "nav.guides": "Guia de Viagem",
    "nav.sos": "SOS",
    "nav.talkToLocal": "Falar com local",
    "nav.signIn": "Entrar",
    "nav.profile": "Meu Perfil",
    "nav.logout": "Sair",
    "nav.lang": "Idioma · Português",
    "nav.drawerTitle": "Bolivia Insight",
    "nav.drawerFooter": "Chamada de 15 min a partir de $12 · Especialistas",

    // Hero
    "hero.sparkleSunset": "Salar às 18:42, pôr do sol",
    "hero.sparkleNight": "Salar às 04:32 a.m.",
    "hero.titleDay": "Bolívia, na [última luz].",
    "hero.titleNight": "Bolívia, sob [luz prateada].",
    "hero.subtitle": "O deserto de sal tem duas faces. Um guia de viagem independente para mochileiros que cruzam a Bolívia por conta própria — de dia e de noite.",
    "hero.ctaOpenGuide": "Abrir o guia",
    "hero.ctaBrowseDestinations": "Ver destinos",
    "hero.watchAltiplano": "Ver o altiplano →",
    "hero.countryWorth": "O país pelo qual\n[vale a pena desacelerar].",
    "hero.liveWeather": "Clima ao Vivo",
    "hero.roadStatus": "Estado das Estradas",
    "hero.loading": "Carregando...",
    "hero.expedito": "Livre",
    "hero.precaution": "Atenção",
    "hero.connectionError": "Erro de conexão",
    "weather.loading": "Carregando...",
    "weather.clearFreezing": "Limpo, congelando",
    "weather.sunDry": "Ensolarado, seco",
    "weather.partlyCloudy": "Parcialmente nublado",
    "weather.fog": "Névoa",
    "weather.rain": "Chuva",
    "weather.snow": "Neve",
    "weather.thunderstorm": "Tempestade",
    "weather.variable": "Variável",

    // Triptych (Landing tools)
    "companion.eyebrow": "O Compañero · ferramentas diárias",
    "companion.title": "Três ferramentas que você abrirá [todas as manhãs].",
    "companion.desc": "Grátis, sem login, sem comissão. A consultoria premium 1 a 1 financia as ferramentas — para que continuem honestas.",
    "companion.tool1Eyebrow": "Ferramenta 01 · Logística",
    "companion.tool1Title": "Painel ao Vivo",
    "companion.tool1Desc": "Estradas, teleférico, clima, alertas — tudo o que muda enquanto você está na estrada. Uma tela, atualizada a cada 5 minutos.",
    "companion.tool1Cta": "Abrir o painel",
    "companion.tool2Eyebrow": "Ferramenta 02 · Idioma",
    "companion.tool2Title": "Dicionário Cultural",
    "companion.tool2Desc": "Palavras em espanhol boliviano, aymara e quechua que os viajantes realmente ouvem, explicadas por quem as usa diariamente.",
    "companion.tool2Cta": "Abrir dicionário",
    "companion.tool3Eyebrow": "Ferramenta 03 · Segurança",
    "companion.tool3Title": "Central SOS de Emergência",
    "companion.tool3Desc": "Números, hospitais, embaixadas, táxis verificados — por cidade. Criado para carregar rápido mesmo com sinal fraco no pior momento.",
    "companion.tool3Cta": "Abrir o centro SOS",

    // Booking Band
    "booking.eyebrow": "Consultoria Premium 1 para 1 · Desde $12",
    "booking.title": "Quando os dados e o dicionário acabarem — [fale com uma pessoa que faz a rota].",
    "booking.desc": "Vídeo de 15 ou 30 min com um escritor local. Eles analisam seu itinerário, otimizam rotas e respondem às perguntas que nenhum app resolve.",
    "booking.stat1Key": "4",
    "booking.stat1Val": "Escritores locais",
    "booking.stat2Key": "~24h",
    "booking.stat2Val": "Conf. média",
    "booking.stat3Key": "4.9",
    "booking.stat3Val": "Nota média · 887 chamadas",
    "booking.btn": "Agendar chamada de 15 min",
    "booking.note": "PAGAMENTO VIA STRIPE · REEMBOLSÁVEL 12H ANTES · LINK GOOGLE MEET 1H ANTES",

    // Footer
    "footer.desc": "Um guia de viagem independente sobre a Bolívia, escrito por moradores. Sem comissões ou reservas — apenas notas de campo honestas para explorar no seu próprio ritmo.",
    "footer.explore": "Explorar",
    "footer.tools": "Ferramentas",
    "footer.getHelp": "Ajuda",
    "footer.privacy": "Privacidade · Termos · Cookies",

    // Clusters Section
    "clusters.eyebrow": "Quatro regiões · 34 rotas na temporada",
    "clusters.title": "Bolívia, por regiões.",
    "clusters.desc": "Cada região é uma jornada própria: altiplano sagrado, aventura metropolitana, vales coloniais ou selva amazônica.",
    "clusters.viewAll": "Ver todos os destinos",
    "clusters.routes": "rotas",
    "clusters.topPicks": "Destaques",
    "clusters.exploreHighlights": "Ver atrações",

    // Cluster Names and details
    "cluster.altiplano.title": "Altiplano Sagrado",
    "cluster.altiplano.sub": "Salar de Uyuni · Lago Titicaca · Tiwanaku",
    "cluster.altiplano.highlights.0": "Salar de Uyuni ao pôr do sol",
    "cluster.altiplano.highlights.1": "Isla del Sol, Lago Titicaca",
    "cluster.altiplano.highlights.2": "Sítio arqueológico de Tiwanaku",
    "cluster.altiplano.highlights.3": "Cemitério de trens, Uyuni",
    "cluster.altiplano.tip": "Aclimate-se por 48h em La Paz antes de subir mais alto.",

    "cluster.metro.title": "Metro & Aventura",
    "cluster.metro.sub": "La Paz · Tiquipaya · Cordillera Real",
    "cluster.metro.highlights.0": "Rede de teleféricos Mi Teleférico",
    "cluster.metro.highlights.1": "Mercado das Bruxas & Calle Jaén",
    "cluster.metro.highlights.2": "Descida da Estrada da Morte",
    "cluster.metro.highlights.3": "Valle de la Luna",
    "cluster.metro.tip": "O Mi Teleférico funciona das 6h às 22h — Bs. 3 por trecho, 11 linhas.",

    "cluster.valles.title": "Vales & História",
    "cluster.valles.sub": "Sucre · Potosí · Tarabuco",
    "cluster.valles.highlights.0": "Casco antigo colonial de Sucre (UNESCO)",
    "cluster.valles.highlights.1": "Minas de Cerro Rico, Potosí",
    "cluster.valles.highlights.2": "Mercado têxtil de Tarabuco (domingo)",
    "cluster.valles.highlights.3": "Pegadas de dinossauro em Cal Orck'o",
    "cluster.valles.tip": "Sucre é a transição de altitude mais suave rumo às terras altas.",

    "cluster.amazon.title": "Amazônia",
    "cluster.amazon.sub": "Madidi · Rurrenabaque · Rio Tuichi",
    "cluster.amazon.highlights.0": "Parque Nacional Madidi (1.000+ espécies de aves)",
    "cluster.amazon.highlights.1": "Tour de vida selvagem nas Pampas",
    "cluster.amazon.highlights.2": "Ecolodge comunitário Chalalán",
    "cluster.amazon.highlights.3": "Orla de San Buenaventura",
    "cluster.amazon.tip": "Calor e umidade — traga repelente DEET e roupas leves.",

    "cluster.detail.back": "Todos os destinos",
    "cluster.detail.region": "Região",
    "cluster.detail.suggestedRoutes": "Roteiros sugeridos · Sem reservas",
    "cluster.detail.waysInto": "Três caminhos pelo altiplano.",
    "cluster.detail.readFull": "Ver roteiro completo",
    "cluster.detail.writtenBy": "Escrito por",
    "cluster.detail.journalTitle": "Diário · De campo",
    "cluster.detail.journalQuote": "\"O salar é composto por dois países. Dormimos em um e acordamos no outro.\"",
    "cluster.detail.journalDesc": "Carla escreve sobre o espelho d'água na estação de chuvas — uma fina camada de água que transforma 10.000 km² de sal no maior espelho da Terra.",
    "cluster.detail.readEssay": "Ler ensaio",
    "cluster.detail.writerTitle": "Escritora de Altiplano · natural de La Paz",

    // Travel Guide Page
    "guide.back": "Voltar ao início",
    "guide.eyebrow": "Guia de Viagem · Para viajantes independentes",
    "guide.title": "Bolívia, o",
    "guide.titleEm": "essencial.",
    "guide.descIntro": "Sem reservas, sem taxas. O que gostaríamos de saber desde o primeiro dia, escrito por quem mora aqui.",
    "guide.needPerson": "Precisa de uma pessoa e não de uma página?",
    "guide.bookVideo": "Reserve uma conversa por vídeo de 15 ou 30 min com um escritor local que conhece seu roteiro — desde $12.",
    "guide.talkButton": "Falar com local",

    // Travel Guide Tabs
    "guide.tab.arrive": "Chegada",
    "guide.tab.altitude": "Altitude",
    "guide.tab.money": "Dinheiro e custos",
    "guide.tab.safe": "Segurança",
    "guide.tab.dictionary": "Dicionário",
    "guide.tab.when": "Quando ir",

    // SOS Hub
    "sos.back": "Voltar ao início",
    "sos.eyebrow": "SOS · Central de Emergências",
    "sos.title": "SOS · Bolívia.",
    "sos.desc": "Números reais, atualizados para abril de 2026. Salve esta página offline antes de sair do wi-fi do hotel.",
    "sos.saveOffline": "Salvar offline",
    "sos.selectCity": "Selecione sua cidade",
    "sos.redFlags": "Sinais vermelhos de altitude — desça para altitudes menores",
    "sos.vomiting": "Vômitos, lábios roxos, perda de equilíbrio, dor de cabeça forte por mais de 24h. Não aguarde: desça.",
    "sos.nearest": "Cidade mais próxima em altitude baixa:",
    "sos.verifyMonthly": "Verificamos os telefones mensalmente. Notou alguma mudança?",
    "sos.emailUs": "Envie um e-mail",
    "sos.updateNotice": "— atualizaremos em 24 a 48 horas."
  },

  fr: {
    // Navigation
    "nav.destinations": "Destinations",
    "nav.dashboard": "Tableau de Bord",
    "nav.guides": "Guide de Voyage",
    "nav.sos": "SOS",
    "nav.talkToLocal": "Parler à un local",
    "nav.signIn": "Connexion",
    "nav.profile": "Mon Profil",
    "nav.logout": "Déconnexion",
    "nav.lang": "Langue · Français",
    "nav.drawerTitle": "Bolivia Insight",
    "nav.drawerFooter": "Appel de 15 min dès 12 $ · Experts locaux",

    // Hero
    "hero.sparkleSunset": "Salar à 18h42, coucher de soleil",
    "hero.sparkleNight": "Salar à 04h32",
    "hero.titleDay": "La Bolivie, dans sa [dernière lueur].",
    "hero.titleNight": "La Bolivie, sous sa [lueur argentée].",
    "hero.subtitle": "Le désert de sel cache deux visages. Un guide de voyage indépendant pour les voyageurs traversant la Bolivie par eux-mêmes — de jour comme de nuit.",
    "hero.ctaOpenGuide": "Ouvrir le guide",
    "hero.ctaBrowseDestinations": "Voir les destinations",
    "hero.watchAltiplano": "Voir l'altiplano →",
    "hero.countryWorth": "Le pays qui\n[mérite de ralentir].",
    "hero.liveWeather": "Météo en Direct",
    "hero.roadStatus": "État des Routes",
    "hero.loading": "Chargement...",
    "hero.expedito": "Fluide",
    "hero.precaution": "Attention",
    "hero.connectionError": "Erreur de connexion",
    "weather.loading": "Chargement...",
    "weather.clearFreezing": "Clair, gel",
    "weather.sunDry": "Soleillé, sec",
    "weather.partlyCloudy": "Partiellement nuageux",
    "weather.fog": "Brouillard",
    "weather.rain": "Pluie",
    "weather.snow": "Neige",
    "weather.thunderstorm": "Orage",
    "weather.variable": "Variable",

    // Triptych (Landing tools)
    "companion.eyebrow": "Le Compañero · outils quotidiens",
    "companion.title": "Trois outils que vous ouvrirez [chaque matin].",
    "companion.desc": "Gratuit, sans inscription, sans commission. Notre service de conseil 1-à-1 finance le site pour le garder indépendant.",
    "companion.tool1Eyebrow": "Outil 01 · Logistique",
    "companion.tool1Title": "Tableau en Direct",
    "companion.tool1Desc": "Routes, téléphériques, météo, alertes — ce qui change pendant votre voyage. Un seul écran, actualisé toutes les 5 minutes.",
    "companion.tool1Cta": "Ouvrir le tableau",
    "companion.tool2Eyebrow": "Outil 02 · Langue",
    "companion.tool2Title": "Dictionnaire Culturel",
    "companion.tool2Desc": "Expressions en espagnol bolivien, aymara et quechua que vous entendrez partout, décodées par des locaux.",
    "companion.tool2Cta": "Ouvrir le dictionnaire",
    "companion.tool3Eyebrow": "Outil 03 · Sécurité",
    "companion.tool3Title": "Centre d'Urgence SOS",
    "companion.tool3Desc": "Urgences, hôpitaux, ambassades, taxis fiables par ville. Conçu pour charger vite même avec un réseau faible.",
    "companion.tool3Cta": "Ouvrir le centre SOS",

    // Booking Band
    "booking.eyebrow": "Conseil premium 1-à-1 · Dès 12 $",
    "booking.title": "Quand les données et le dictionnaire ne suffisent plus — [parlez à quelqu'un qui parcourt l'itinéraire].",
    "booking.desc": "Quinze ou trente minutes en visio avec un auteur local. Il relit votre itinéraire, optimise les temps de trajet et répond à vos questions.",
    "booking.stat1Key": "4",
    "booking.stat1Val": "Experts locaux",
    "booking.stat2Key": "~24h",
    "booking.stat2Val": "Confirmation moy.",
    "booking.stat3Key": "4.9",
    "booking.stat3Val": "Note · 887 appels",
    "booking.btn": "Réserver un appel (15 min)",
    "booking.note": "PAIEMENT STRIPE · ANNULABLE 12H AVANT · LIEN MEET ENVOYÉ 1H AVANT",

    // Footer
    "footer.desc": "Un guide de voyage indépendant sur la Bolivie, écrit par des habitants. Sans commissions ni intermédiaires — de vraies notes de terrain pour voyager libre.",
    "footer.explore": "Explorer",
    "footer.tools": "Outils",
    "footer.getHelp": "Assistance",
    "footer.privacy": "Confidentialité · Mentions · Cookies",

    // Clusters Section
    "clusters.eyebrow": "Quatre régions · 34 itinéraires",
    "clusters.title": "La Bolivie, par régions.",
    "clusters.desc": "Chaque zone a sa propre âme : les mystères de l'altiplano, l'énergie des villes, le charme des vallées ou le souffle de l'Amazonie.",
    "clusters.viewAll": "Voir les destinations",
    "clusters.routes": "trajets",
    "clusters.topPicks": "Coups de cœur",
    "clusters.exploreHighlights": "Voir les incontournables",

    // Cluster Names and details
    "cluster.altiplano.title": "Altiplano Sacré",
    "cluster.altiplano.sub": "Salar d'Uyuni · Lac Titicaca · Tiwanaku",
    "cluster.altiplano.highlights.0": "Le Salar d'Uyuni au coucher du soleil",
    "cluster.altiplano.highlights.1": "L'Isla del Sol (Lac Titicaca)",
    "cluster.altiplano.highlights.2": "Le site archéologique de Tiwanaku",
    "cluster.altiplano.highlights.3": "Le cimetière des trains à Uyuni",
    "cluster.altiplano.tip": "Restez 48h à La Paz pour vous acclimater avant de monter plus haut.",

    "cluster.metro.title": "Villes & Aventure",
    "cluster.metro.sub": "La Paz · Tiquipaya · Cordillère Royale",
    "cluster.metro.highlights.0": "Le réseau de téléphériques Mi Teleférico",
    "cluster.metro.highlights.1": "Le Marché des Sorcières & la Calle Jaén",
    "cluster.metro.highlights.2": "La descente de la Route de la Mort",
    "cluster.metro.highlights.3": "La Vallée de la Lune",
    "cluster.metro.tip": "Le téléphérique circule de 6h à 22h — 3 Bs. le ticket, 11 lignes.",

    "cluster.valles.title": "Vallées & Histoire",
    "cluster.valles.sub": "Sucre · Potosí · Tarabuco",
    "cluster.valles.highlights.0": "Le centre historique de Sucre (UNESCO)",
    "cluster.valles.highlights.1": "Les mines du Cerro Rico, Potosí",
    "cluster.valles.highlights.2": "Le marché textile du dimanche à Tarabuco",
    "cluster.valles.highlights.3": "Les empreintes de dinosaures de Cal Orck'o",
    "cluster.valles.tip": "Sucre est la transition d'altitude idéale vers les sommets.",

    "cluster.amazon.title": "Amazonie",
    "cluster.amazon.sub": "Madidi · Rurrenabaque · Rivière Tuichi",
    "cluster.amazon.highlights.0": "Parc national Madidi (1 000+ espèces d'oiseaux)",
    "cluster.amazon.highlights.1": "Safari animalier dans la pampa",
    "cluster.amazon.highlights.2": "L'écolodge communautaire Chalalán",
    "cluster.amazon.highlights.3": "Les rives de San Buenaventura",
    "cluster.amazon.tip": "Chaud et très humide — prévoyez du répulsif DEET et des vêtements amples.",

    "cluster.detail.back": "Toutes les destinations",
    "cluster.detail.region": "Région",
    "cluster.detail.suggestedRoutes": "Itinéraires suggérés · Sans réservation",
    "cluster.detail.waysInto": "Trois façons d'explorer l'altiplano.",
    "cluster.detail.readFull": "Voir le trajet complet",
    "cluster.detail.writtenBy": "Écrit par",
    "cluster.detail.journalTitle": "Carnet · Sur le terrain",
    "cluster.detail.journalQuote": "\"Le salar est fait de deux pays. On s'endort dans l'un, on s'éveille dans l'autre.\"",
    "cluster.detail.journalDesc": "Carla raconte le miroir d'eau de la saison humide — une fine pellicule d'eau qui transforme 10 000 km² de sel en le plus grand reflet du monde.",
    "cluster.detail.readEssay": "Lire l'essai",
    "cluster.detail.writerTitle": "Auteure Altiplano · originaire de La Paz",

    // Travel Guide Page
    "guide.back": "Retour à l'accueil",
    "guide.eyebrow": "Guide pratique · Pour voyageurs indépendants",
    "guide.title": "La Bolivie, l'",
    "guide.titleEm": "essentiel.",
    "guide.descIntro": "Pas de commission, pas d'intermédiaire. Juste les conseils qu'on aurait aimé recevoir le premier jour, partagés par des locaux.",
    "guide.needPerson": "Besoin de parler à quelqu'un en direct ?",
    "guide.bookVideo": "Réservez un échange vidéo de 15 ou 30 min avec un auteur local sur votre itinéraire — dès 12 $.",
    "guide.talkButton": "Parler à un local",

    // Travel Guide Tabs
    "guide.tab.arrive": "Arriver",
    "guide.tab.altitude": "Altitude",
    "guide.tab.money": "Budget & coûts",
    "guide.tab.safe": "Sécurité & pièges",
    "guide.tab.dictionary": "Dictionnaire",
    "guide.tab.when": "Saisons",

    // SOS Hub
    "sos.back": "Retour à l'accueil",
    "sos.eyebrow": "SOS · Guide d'Urgence",
    "sos.title": "SOS · Bolivie.",
    "sos.desc": "Numéros vérifiés, à jour d'avril 2026. Sauvegardez cette page hors connexion avant de quitter votre hôtel.",
    "sos.saveOffline": "Enregistrer hors ligne",
    "sos.selectCity": "Choisissez votre ville",
    "sos.redFlags": "Urgences d'altitude — redescendez immédiatement",
    "sos.vomiting": "Vomissements, lèvres bleues, perte d'équilibre, maux de tête intenses après 24h. Ne patientez pas : descendez.",
    "sos.nearest": "Ville de basse altitude la plus proche :",
    "sos.verifyMonthly": "Nous vérifions ces numéros chaque mois. Une erreur ?",
    "sos.emailUs": "Contactez-nous",
    "sos.updateNotice": "— mise à jour sous 24 à 48 heures."
  },

  ja: {
    // Navigation
    "nav.destinations": "目的地",
    "nav.dashboard": "ライブダッシュボード",
    "nav.guides": "旅行ガイド",
    "nav.sos": "緊急SOS",
    "nav.talkToLocal": "現地スタッフと話す",
    "nav.signIn": "ログイン",
    "nav.profile": "マイプロフィール",
    "nav.logout": "ログアウト",
    "nav.lang": "言語 · 日本語",
    "nav.drawerTitle": "ボリビア・インサイト",
    "nav.drawerFooter": "15分の相談 $12から · 地元在住スタッフ",

    // Hero
    "hero.sparkleSunset": "ウユニ塩湖 18:42、夕暮れ",
    "hero.sparkleNight": "ウユニ塩湖 04:32、夜明け前",
    "hero.titleDay": "ボリビア、[最後の光]の中で。",
    "hero.titleNight": "ボリビア、[銀色の光]の下で。",
    "hero.subtitle": "ウユニ塩湖には2つの顔があります。昼も夜も、自分だけの力でボリビアを旅する人のための独立した旅行ガイドです。",
    "hero.ctaOpenGuide": "ガイドを開く",
    "hero.ctaBrowseDestinations": "目的地を見る",
    "hero.watchAltiplano": "アルティプラーノを見る →",
    "hero.countryWorth": "[ゆっくり進む価値のある]国。",
    "hero.liveWeather": "現在の天気",
    "hero.roadStatus": "道路交通状況",
    "hero.loading": "読み込み中...",
    "hero.expedito": "通行可",
    "hero.precaution": "要注意",
    "hero.connectionError": "接続エラー",
    "weather.loading": "読み込み中...",
    "weather.clearFreezing": "快晴、氷点下",
    "weather.sunDry": "晴れ、乾燥",
    "weather.partlyCloudy": "晴れのち曇り",
    "weather.fog": "霧",
    "weather.rain": "雨",
    "weather.snow": "雪",
    "weather.thunderstorm": "雷雨",
    "weather.variable": "不安定",

    // Triptych (Landing tools)
    "companion.eyebrow": "コンパニェーロ · 日常お役立ちツール",
    "companion.title": "毎朝開くことになる[3つのツール]。",
    "companion.desc": "無料、登録不要、仲介手数料なし。個別相談のサポートにより、この透明性の高い情報発信を維持しています。",
    "companion.tool1Eyebrow": "ツール 01 · 移動・交通",
    "companion.tool1Title": "ライブ交通情報",
    "companion.tool1Desc": "道路状況、ケーブルカー運行情報、天気、アラート情報など、移動中に変化する状況を5分ごとに更新して表示します。",
    "companion.tool1Cta": "ダッシュボードを開く",
    "companion.tool2Eyebrow": "ツール 02 · 現地言葉",
    "companion.tool2Title": "文化ミニ辞典",
    "companion.tool2Desc": "ボリビアのスペイン語、アイマラ語、ケチュア語など、現地旅行中に実際に耳にする言葉をわかりやすく解説します。",
    "companion.tool2Cta": "ミニ辞典を開く",
    "companion.tool3Eyebrow": "ツール 03 · 安全対策",
    "companion.tool3Title": "緊急SOSハブ",
    "companion.tool3Desc": "都市別の緊急連絡先、病院、大使館、信頼できるタクシー情報。電波の悪い場所でもすぐに開くよう軽量設計されています。",
    "companion.tool3Cta": "SOSハブを開く",

    // Booking Band
    "booking.eyebrow": "個別相談サービス · $12〜",
    "booking.title": "データや辞書だけでは足りない時 — [そのルートを実際に歩んでいる人と話しましょう]。",
    "booking.desc": "現地に暮らすライターと15分または30分、オンラインで直接相談できます。旅程のチェック、安全なルートのアドバイス、細かな疑問にお答えします。",
    "booking.stat1Key": "4",
    "booking.stat1Val": "現地エキスパート",
    "booking.stat2Key": "~24h",
    "booking.stat2Val": "平均返答時間",
    "booking.stat3Key": "4.9",
    "booking.stat3Val": "平均評価 · 887件の相談",
    "booking.btn": "相談を予約する（15分間）",
    "booking.note": "STRIPE決済対応 · 12時間前までキャンセル無料 · 1時間前にMeetリンクを送付",

    // Footer
    "footer.desc": "ボリビアに住む現地の人々によって書かれた、独立した旅行ガイドです。手数料や予約の誘導はありません。自分の足で自由に旅をするための正直な現地メモです。",
    "footer.explore": "探索する",
    "footer.tools": "ツール",
    "footer.getHelp": "サポート",
    "footer.privacy": "プライバシー · 利用規約 · クッキーポリシー",

    // Clusters Section
    "clusters.eyebrow": "4つのエリア · シーズン中34のルート",
    "clusters.title": "地域から探す",
    "clusters.desc": "聖なるアルティプラーノ、都会のアドベンチャー、歴史あるのどかな渓谷、神秘のアマゾン。それぞれの地域に、それぞれの魅力があります。",
    "clusters.viewAll": "すべての目的地を見る",
    "clusters.routes": "ルート",
    "clusters.topPicks": "おすすめスポット",
    "clusters.exploreHighlights": "ハイライトを見る",

    // Cluster Names and details
    "cluster.altiplano.title": "聖なる高地",
    "cluster.altiplano.sub": "ウユニ塩湖 · チティカカ湖 · ティワナク",
    "cluster.altiplano.highlights.0": "夕暮れのウユニ塩湖",
    "cluster.altiplano.highlights.1": "チティカカ湖・太陽の島",
    "cluster.altiplano.highlights.2": "ティワナク遺跡",
    "cluster.altiplano.highlights.3": "列車の墓場（ウユニ）",
    "cluster.altiplano.tip": "さらに高い場所に行く前に、ラパス（3,600m）で48時間体を慣らしてください。",

    "cluster.metro.title": "都市と大自然",
    "cluster.metro.sub": "ラパス · ティキパヤ · レアル山脈",
    "cluster.metro.highlights.0": "ロープウェイ「ミ・テレフェリコ」",
    "cluster.metro.highlights.1": "魔女の市場とハエン通り",
    "cluster.metro.highlights.2": "デスロード・自転車ダウンヒル",
    "cluster.metro.highlights.3": "月の谷",
    "cluster.metro.tip": "ミ・テレフェリコは朝6時から夜10時まで運行、1乗車3ボリビアーノ（11路線）。",

    "cluster.valles.title": "歴史薫る渓谷",
    "cluster.valles.sub": "スクレ · ポトシ · タラブコ",
    "cluster.valles.highlights.0": "世界遺産スクレの旧市街",
    "cluster.valles.highlights.1": "ポトシ・セロリコ鉱山",
    "cluster.valles.highlights.2": "タラブコの日曜伝統市",
    "cluster.valles.highlights.3": "カル・オルコ恐竜の足跡化石",
    "cluster.valles.tip": "スクレは高地に上がるための最も体に優しいステップです。",

    "cluster.amazon.title": "アマゾン熱帯雨林",
    "cluster.amazon.sub": "マディディ · ルレナバケ · トゥイチ川",
    "cluster.amazon.highlights.0": "マディディ国立公園（1,000種以上の鳥類）",
    "cluster.amazon.highlights.1": "大湿原パンパス・野生動物ボートツアー",
    "cluster.amazon.highlights.2": "チャララン・コミュニティエコッジ",
    "cluster.amazon.highlights.3": "サンブエナベントゥーラのリバーサイド",
    "cluster.amazon.tip": "低地で高温多湿です。強力な虫除け（DEET）と風通しの良い長袖を持参してください。",

    "cluster.detail.back": "すべての目的地",
    "cluster.detail.region": "地域",
    "cluster.detail.suggestedRoutes": "おすすめルート · 予約不要",
    "cluster.detail.waysInto": "アルティプラーノへの3つのアプローチ。",
    "cluster.detail.readFull": "ルート詳細を見る",
    "cluster.detail.writtenBy": "著者 :",
    "cluster.detail.journalTitle": "フィールドダイアリー · 現地エッセイ",
    "cluster.detail.journalQuote": "「塩湖は2つの国。私たちは一方で眠り、もう一方で目を覚ます。」",
    "cluster.detail.journalDesc": "カルラが雨季 of 鏡張りについて執筆 — 10,000平方キロメートルの塩原を地球上最大の鏡に変える薄い水膜。最適な訪問のタイミングについて解説します。",
    "cluster.detail.readEssay": "エッセイを読む",
    "cluster.detail.writerTitle": "アルティプラーノ担当ライター · ラパス生まれ",

    // Travel Guide Page
    "guide.back": "ホームに戻る",
    "guide.eyebrow": "旅行ガイド · 個人旅行者のための必須知識",
    "guide.title": "ボリビア旅行の",
    "guide.titleEm": "基本のすべて。",
    "guide.descIntro": "広告や提携先の紹介はありません。現地で暮らす私たちが、到着初日に知っておきたかった情報だけをまとめました。",
    "guide.needPerson": "記事だけではなく、人に相談したいですか？",
    "guide.bookVideo": "ルートをよく知る現地のライターとの15分または30分のオンライン相談を予約できます（$12から）。",
    "guide.talkButton": "スタッフに相談する",

    // Travel Guide Tabs
    "guide.tab.arrive": "入国・到着",
    "guide.tab.altitude": "高山病対策",
    "guide.tab.money": "お金と物価",
    "guide.tab.safe": "治安とトラブル",
    "guide.tab.dictionary": "ミニ辞典",
    "guide.tab.when": "ベストシーズン",

    // SOS Hub
    "sos.back": "ホームに戻る",
    "sos.eyebrow": "緊急連絡先 · SOSハブ",
    "sos.title": "緊急連絡先 · ボリビア",
    "sos.desc": "2026年4月現在の情報です。インターネットが繋がらない場所に備え、このページをオフラインで保存してください。",
    "sos.saveOffline": "オフラインで保存",
    "sos.selectCity": "都市を選択",
    "sos.redFlags": "高山病の赤信号 — すぐに高度を下げてください",
    "sos.vomiting": "嘔吐、唇が紫色になる、ふらつく、24時間経っても激しい頭痛が続く場合は我慢せずすぐに低い場所に移動してください。",
    "sos.nearest": "最も近い低高度の町 :",
    "sos.verifyMonthly": "電話番号は毎月確認しています。変更にお気づきですか？",
    "sos.emailUs": "メールで連絡する",
    "sos.updateNotice": "— 通常24〜48時間以内に修正します。"
  },

  ko: {
    // Navigation
    "nav.destinations": "목적지",
    "nav.dashboard": "라이브 대시보드",
    "nav.guides": "여행 가이드",
    "nav.sos": "SOS",
    "nav.talkToLocal": "현지 전문가 대화",
    "nav.signIn": "로그인",
    "nav.profile": "내 프로필",
    "nav.logout": "로그아웃",
    "nav.lang": "언어 · 한국어",
    "nav.drawerTitle": "볼리비아 인사이트",
    "nav.drawerFooter": "15분 상담 $12부터 · 현지 상주 전문가",

    // Hero
    "hero.sparkleSunset": "우유니 사막 18:42, 일몰",
    "hero.sparkleNight": "우유니 사막 04:32, 새벽",
    "hero.titleDay": "볼리비아, [마지막 빛] 속에서.",
    "hero.titleNight": "볼리비아, [은빛 하늘] 아래서.",
    "hero.subtitle": "소금 사막은 두 가지 얼굴을 가지고 있습니다. 낮과 밤, 스스로 볼리비아를 횡단하는 여행자들을 위한 독립적인 여행 가이드입니다.",
    "hero.ctaOpenGuide": "가이드 열기",
    "hero.ctaBrowseDestinations": "목적지 보기",
    "hero.watchAltiplano": "알티플라노 보기 →",
    "hero.countryWorth": "[천천히 머무를 가치가 있는] 나라.",
    "hero.liveWeather": "실시간 날씨",
    "hero.roadStatus": "도로 교통 상황",
    "hero.loading": "불러오는 중...",
    "hero.expedito": "통행 원활",
    "hero.precaution": "주의 필요",
    "hero.connectionError": "연결 에러",
    "weather.loading": "불러오는 중...",
    "weather.clearFreezing": "맑음, 추움",
    "weather.sunDry": "맑고 건조",
    "weather.partlyCloudy": "구름 조금",
    "weather.fog": "안개",
    "weather.rain": "비",
    "weather.snow": "눈",
    "weather.thunderstorm": "뇌우",
    "weather.variable": "변덕스러움",

    // Triptych (Landing tools)
    "companion.eyebrow": "동반자 · 매일 쓰는 여행 도구",
    "companion.title": "매일 아침 열어볼 [세 가지 도구].",
    "companion.desc": "무료, 로그인 없음, 수수료 없음. 1대1 프리미엄 맞춤 상담 수익으로 투명하고 진실성 있는 정보를 운영합니다.",
    "companion.tool1Eyebrow": "도구 01 · 교통 정보",
    "companion.tool1Title": "실시간 상황판",
    "companion.tool1Desc": "도로 상황, 케이블카 운행, 날씨, 경보 등 실시간 정보를 5분마다 업데이트하여 한 화면에 보여줍니다.",
    "companion.tool1Cta": "상황판 열기",
    "companion.tool2Eyebrow": "도구 02 · 현지 언어",
    "companion.tool2Title": "문화 미니 사전",
    "companion.tool2Desc": "볼리비아식 스페인어, 아이마라어, 케추아어 등 현지에서 실제로 듣게 되는 표현을 자세히 해설합니다.",
    "companion.tool2Cta": "미니 사전 열기",
    "companion.tool3Eyebrow": "도구 03 · 안전 대책",
    "companion.tool3Title": "긴급 SOS 허브",
    "companion.tool3Desc": "도시별 긴급 번호, 병원, 대사관, 검증된 택시 정보. 인터넷 연결이 원활하지 않은 상황에서도 빠르게 열리도록 경량 설계되었습니다.",
    "companion.tool3Cta": "SOS 허브 열기",

    // Booking Band
    "booking.eyebrow": "프리미엄 1대1 자문 · $12부터",
    "booking.title": "데이터와 사전만으로 부족할 때 — [그 경로를 직접 걷는 사람과 이야기해 보세요].",
    "booking.desc": "볼리비아 현지 작가와 15분 또는 30분 동안 화상 통화로 이야기할 수 있습니다. 일정을 검토받고, 경로를 단축하며, 무엇이든 물어보세요.",
    "booking.stat1Key": "4",
    "booking.stat1Val": "현지 전문가",
    "booking.stat2Key": "~24h",
    "booking.stat2Val": "평균 확인 시간",
    "booking.stat3Key": "4.9",
    "booking.stat3Val": "평균 평점 · 887건 상담",
    "booking.btn": "15분 상담 예약하기",
    "booking.note": "STRIPE 안전 결제 · 12시간 전 취소 시 전액 환불 · 1시간 전 구글 미트 링크 발송",

    // Footer
    "footer.desc": "볼리비아 현지에 사는 사람들이 작성한 독립 여행 가이드입니다. 예약 수수료나 광고 없이, 자유롭게 여행하는 이들을 위한 솔직한 현장 기록입니다.",
    "footer.explore": "탐색하기",
    "footer.tools": "도구",
    "footer.getHelp": "도움말",
    "footer.privacy": "개인정보 보호방침 · 이용약관 · 쿠키 설정",

    // Clusters Section
    "clusters.eyebrow": "4대 권역 · 시즌별 34개 루트",
    "clusters.title": "권역별 보기",
    "clusters.desc": "신비로운 고원 지대, 활기찬 도시 모험, 역사적인 계곡 지대, 아마존 열대우림 등 각 권역은 그 자체로 완벽한 여정이 됩니다.",
    "clusters.viewAll": "모든 목적지 보기",
    "clusters.routes": "개 코스",
    "clusters.topPicks": "추천 스팟",
    "clusters.exploreHighlights": "하이라이트 보기",

    // Cluster Names and details
    "cluster.altiplano.title": "성스러운 고원",
    "cluster.altiplano.sub": "우유니 소금사막 · 티티카카 호수 · 티와나쿠",
    "cluster.altiplano.highlights.0": "일몰 무렵의 우유니 소금사막",
    "cluster.altiplano.highlights.1": "티티카카 호수 태양의 섬",
    "cluster.altiplano.highlights.2": "티와나쿠 역사 유적지",
    "cluster.altiplano.highlights.3": "기차 무덤 (우유니)",
    "cluster.altiplano.tip": "더 높은 고도로 가기 전에 라파스(3,600m)에서 48시간 이상 적응 시간을 가지세요.",

    "cluster.metro.title": "도시 & 모험",
    "cluster.metro.sub": "라파스 · 티키파야 · 코르디예라 레알",
    "cluster.metro.highlights.0": "케이블카 대중교통 '미 텔레페리코'",
    "cluster.metro.highlights.1": "마녀 시장 & 하엔 거리",
    "cluster.metro.highlights.2": "데스 로드 자전거 다운힐",
    "cluster.metro.highlights.3": "달의 계곡",
    "cluster.metro.tip": "미 텔레페리코는 오전 6시부터 밤 10시까지 운행됩니다. 편도 3볼리비아노 (11개 노선).",

    "cluster.valles.title": "계곡 & 역사",
    "cluster.valles.sub": "수크레 · 포토시 · 타라부코",
    "cluster.valles.highlights.0": "수크레 유네스코 역사 지구",
    "cluster.valles.highlights.1": "포토시 세로 리코 광산",
    "cluster.valles.highlights.2": "타라부코 일요 섬유 시장",
    "cluster.valles.highlights.3": "칼 오르코 공룡 발자국 화석",
    "cluster.valles.tip": "수크레는 고지대로 이동하기 전 고도 적응에 가장 적합한 완만한 도시입니다.",

    "cluster.amazon.title": "아마존 열대우림",
    "cluster.amazon.sub": "마디디 · 루레나바케 · 투이치 강",
    "cluster.amazon.highlights.0": "마디디 국립공원 (1,000종 이상의 조류 서식)",
    "cluster.amazon.highlights.1": "팜파스 야생동물 보트 투어",
    "cluster.amazon.highlights.2": "찰랄란 지역사회 에코롯지",
    "cluster.amazon.highlights.3": "산 부에나벤투라 강변 지구",
    "cluster.amazon.tip": "고온다습한 저지대입니다. 강력한 모기약(DEET)과 통기성이 좋은 긴 소매 옷을 준비하세요.",

    "cluster.detail.back": "모든 목적지",
    "cluster.detail.region": "권역",
    "cluster.detail.suggestedRoutes": "추천 루트 · 예약 불필요",
    "cluster.detail.waysInto": "알티플라노를 즐기는 세 가지 방법.",
    "cluster.detail.readFull": "전체 루트 보기",
    "cluster.detail.writtenBy": "작성자 :",
    "cluster.detail.journalTitle": "필드 저널 · 현장 소식",
    "cluster.detail.journalQuote": "“소금사막은 두 개의 나라와 같습니다. 우리는 한 곳에서 잠들고 다른 곳에서 눈을 뜹니다.”",
    "cluster.detail.journalDesc": "작가가 우기 시즌의 거울 효과에 대해 작성 — 10,000km² 면적의 소금 사막을 세계 최대의 거울로 바꾸는 얇은 물막 현상과 기상 조건 판별법 소개.",
    "cluster.detail.readEssay": "에세이 읽기",
    "cluster.detail.writerTitle": "알티플라노 작가 · 라파스 현지인",

    // Travel Guide Page
    "guide.back": "홈으로 돌아가기",
    "guide.eyebrow": "여행 가이드 · 자유 여행 필수 지식",
    "guide.title": "볼리비아 여행의",
    "guide.titleEm": "핵심 요약.",
    "guide.descIntro": "대행사 수수료나 추천 수수료가 없습니다. 현지에 사는 사람들이 알려주는, 첫날 바로 알아야 했던 소중한 정보들입니다.",
    "guide.needPerson": "글이 아닌 사람의 조언이 필요하신가요?",
    "guide.bookVideo": "당신의 여행 경로를 잘 아는 현지 작가와의 15분 또는 30분 화상 통화를 예약해 보세요 ($12부터).",
    "guide.talkButton": "현지 전문가와 상담",

    // Travel Guide Tabs
    "guide.tab.arrive": "입국·도착",
    "guide.tab.altitude": "고도 적응",
    "guide.tab.money": "비용 & 물가",
    "guide.tab.safe": "치안 & 안전",
    "guide.tab.dictionary": "미니 사전",
    "guide.tab.when": "여행 시즌",

    // SOS Hub
    "sos.back": "홈으로 돌아가기",
    "sos.eyebrow": "SOS · 긴급 연락처 허브",
    "sos.title": "SOS · 볼리비아",
    "sos.desc": "2026년 4월 기준 실제 긴급 번호입니다. 인터넷 연결이 원활하지 않을 때를 대비해 이 페이지를 오프라인으로 저장하세요.",
    "sos.saveOffline": "오프라인으로 저장",
    "sos.selectCity": "도시 선택",
    "sos.redFlags": "고산병 위험 신호 — 즉시 낮은 고도로 이동하세요",
    "sos.vomiting": "구토, 푸른 입술, 균형 상실, 24시간 이후에도 지속되는 극심한 두통 시 지체 없이 고도를 낮춰 하산해야 합니다.",
    "sos.nearest": "가장 가까운 낮은 고도 도시:",
    "sos.verifyMonthly": "긴급 번호는 매달 검증합니다. 정보가 변경되었나요?",
    "sos.emailUs": "이메일 보내기",
    "sos.updateNotice": "— 보통 24~48시간 이내에 반영됩니다."
  }
};

const I18nContext = createContext();

function I18nProvider({ children }) {
  const [locale, setLocale] = useState(() => {
    try {
      const saved = localStorage.getItem("bolivia_insight_lang");
      if (saved && TRANSLATIONS[saved]) return saved;
    } catch (e) {}
    return "es"; // Fallback to Spanish as default
  });

  const changeLocale = (lang) => {
    if (TRANSLATIONS[lang]) {
      setLocale(lang);
      try {
        localStorage.setItem("bolivia_insight_lang", lang);
      } catch (e) {}
    }
  };

  const t = (key, defaultValue = "") => {
    const localeDict = TRANSLATIONS[locale] || TRANSLATIONS["es"];
    const val = localeDict[key];
    if (val !== undefined) return val;
    // Fallback to Spanish if not in localeDict
    const esVal = TRANSLATIONS["es"][key];
    if (esVal !== undefined) return esVal;
    return defaultValue || key;
  };

  return (
    <I18nContext.Provider value={{ locale, changeLocale, t, languages: TRANSLATIONS }}>
      {children}
    </I18nContext.Provider>
  );
}

function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

export { I18nContext, I18nProvider, useI18n, TRANSLATIONS };
