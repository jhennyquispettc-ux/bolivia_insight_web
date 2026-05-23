import React from 'react';
import I from '../ui/iconos.jsx';
import IMG from '../ui/imagenes.jsx';

const CLUSTERS = [
  { id: 'altiplano', title: 'Altiplano Sagrado', sub: 'Salar de Uyuni · Lake Titicaca · Tiwanaku', img: IMG.photoAltiplano,
    color: 'var(--amber-500)', glyph: <I.Sun size={28}/>, count: 12,
    altitude: '3,650 – 4,200m', bestTime: 'May – Oct (dry)', from: 'La Paz · 3.5h',
    highlights: ['Salar de Uyuni at sunset', 'Isla del Sol, Lake Titicaca', 'Tiwanaku archaeological site', 'Train cemetery, Uyuni'],
    tip: 'Acclimatize 48h in La Paz before climbing higher.' },
  { id: 'metro', title: 'Metropolitano & Aventura', sub: 'La Paz · Tiquipaya · Cordillera Real', img: IMG.photoMetro,
    color: 'var(--rust-500)', glyph: <I.Building size={28}/>, count: 9,
    altitude: '2,550 – 4,100m', bestTime: 'Apr – Oct', from: 'El Alto airport',
    highlights: ['Mi Teleférico cable network', 'Witches’ Market & Calle Jaén', 'Death Road descent (Yungas)', 'Valle de la Luna'],
    tip: 'Mi Teleférico runs 6am–10pm — Bs. 3 per ride, 11 lines.' },
  { id: 'valles', title: 'Valles & Historia', sub: 'Sucre · Potosí · Tarabuco', img: IMG.photoValles,
    color: 'var(--mystic-500)', glyph: <I.Coffee size={28}/>, count: 7,
    altitude: '2,800 – 4,067m', bestTime: 'Year-round (mild)', from: 'Sucre airport',
    highlights: ['Sucre UNESCO old town', 'Cerro Rico mines, Potosí', 'Tarabuco textile market (Sun)', 'Cretaceous footprints, Cal Orcko'],
    tip: 'Sucre is the gentlest altitude transition into the highlands.' },
  { id: 'amazon', title: 'Amazonía', sub: 'Madidi · Rurrenabaque · Tuichi River', img: IMG.photoAmazon,
    color: 'var(--green-500)', glyph: <I.Mountain size={28}/>, count: 6,
    altitude: '180 – 600m', bestTime: 'May – Sep (dry)', from: 'Rurrenabaque · 45min flight',
    highlights: ['Madidi National Park (1,000+ bird species)', 'Pampas wildlife river tour', 'Chalalán community ecolodge', 'San Buenaventura riverfront'],
    tip: 'Lowland heat & humidity — bring DEET and breathable layers.' },
];

const TABS = [
  { id: 'eat',     label: 'Eat & Drink', icon: <I.Coffee size={18}/>, items: [
    { name: 'Gustu', meta: 'La Paz · Fine dining', img: IMG.food, kicker: 'World 50 Best' },
    { name: 'Café del Mundo', meta: 'Sucre · Café & coworking', img: IMG.food, kicker: 'Wifi · 70 Mbps' },
    { name: 'Mercado Lanza', meta: 'La Paz · Market', img: IMG.food, kicker: 'Local · 6am–4pm' },
    { name: 'Phayawi', meta: 'Cochabamba · Andean fusion', img: IMG.food, kicker: 'Tasting · $48' },
  ]},
  { id: 'culture', label: 'Culture & Museums', icon: <I.Building size={18}/>, items: [
    { name: 'Museo Nacional de Etnografía', meta: 'La Paz · Free Sundays', img: IMG.culture, kicker: 'Bs. 20' },
    { name: 'Casa de la Libertad', meta: 'Sucre · Independence Hall', img: IMG.culture, kicker: 'Audio guide' },
    { name: 'Tiwanaku Site Museum', meta: 'Altiplano · Pre-Inca', img: IMG.culture, kicker: 'UNESCO' },
    { name: 'Casa de la Moneda', meta: 'Potosí · Colonial mint', img: IMG.culture, kicker: 'Bs. 40' },
  ]},
  { id: 'transport', label: 'Transport & Cable Cars', icon: <I.Tram size={18}/>, items: [
    { name: 'Mi Teleférico — Red Line', meta: 'La Paz ↔ El Alto', img: IMG.cable, kicker: 'Bs. 3 · 10 min' },
    { name: 'Mi Teleférico — Yellow', meta: 'Sopocachi ↔ Curva', img: IMG.cable, kicker: 'Bs. 3 · 14 min' },
    { name: 'Bolivia Hop', meta: 'La Paz → Uyuni overnight', img: IMG.cable, kicker: '$45 · 11h' },
    { name: 'Trans-Bolivia Rail', meta: 'Oruro → Tupiza', img: IMG.cable, kicker: '$28 · 7h' },
  ]},
  { id: 'trek',    label: 'Mountain Trekking', icon: <I.Boot size={18}/>, items: [
    { name: 'Huayna Potosí', meta: '6,088m · 3 days', img: IMG.trek, kicker: 'Technical' },
    { name: 'Choro Trek', meta: 'Andes → Yungas · 3 days', img: IMG.trek, kicker: 'Inca Road' },
    { name: 'Pequeño Alpamayo', meta: '5,370m · 2 days', img: IMG.trek, kicker: 'Beginner alpine' },
    { name: 'Illimani', meta: '6,438m · 4 days', img: IMG.trek, kicker: 'Expert' },
  ]},
];

export { CLUSTERS, TABS };
