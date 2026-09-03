import React from 'react';
import I from '../ui/iconos.jsx';
import IMG from '../ui/imagenes.jsx';

// Cinco sectores turísticos. Los ids se conservan de la versión anterior de
// cuatro clusters (altiplano / metro / valles / amazon) para que las claves de
// traducción ya escritas en seis idiomas sigan resolviendo; solo
// `altiplano-sur` es nuevo.
//
// La Paz vive en un único sector, con el Camino de la Muerte y los Yungas
// dentro, así que ningún lugar se repite entre tarjetas.
//
// altitude / bestTime / from / gettingThere son datos, no copy: los valores se
// leen igual en cualquier idioma, así que solo se traducen sus etiquetas.
const CLUSTERS = [
  {
    id: 'altiplano',
    title: 'Altiplano Norte',
    sub: 'Lago Titicaca · Copacabana · Isla del Sol · Tiwanaku',
    img: IMG.photoTiticaca,
    color: 'var(--mystic-500)',
    glyph: <I.Sun size={28}/>,
    altitude: '3.810 – 4.000 m',
    bestTime: 'May – Oct',
    from: 'La Paz',
    timeNeeded: '2 – 4 días',
    highlights: [
      'Isla del Sol, Lago Titicaca',
      'Basílica de Copacabana',
      'Sitio arqueológico de Tiwanaku',
      'Estrecho de Tiquina',
    ],
    gettingThere: [
      { mode: 'Bus', detail: 'La Paz → Copacabana · ~4 h · terminal de Cementerio' },
      { mode: 'Bus', detail: 'La Paz → Tiwanaku · ~1,5 h · terminal de Cementerio' },
      { mode: 'Lancha', detail: 'Copacabana → Isla del Sol · ~1,5 h' },
    ],
    tip: 'Aclimátate 48 h en La Paz antes de subir más alto.',
  },
  {
    id: 'metro',
    title: 'La Paz Metropolitana',
    sub: 'Ciudad · Teleférico · Valle de la Luna · Camino de la Muerte',
    img: IMG.photoMetro,
    color: 'var(--rust-500)',
    glyph: <I.Building size={28}/>,
    altitude: '1.200 – 4.100 m',
    bestTime: 'Abr – Oct',
    from: 'Aeropuerto de El Alto',
    timeNeeded: '3 – 5 días',
    highlights: [
      'Red de teleféricos Mi Teleférico',
      'Mercado de las Brujas y Calle Jaén',
      'Descenso del Camino de la Muerte (Yungas)',
      'Valle de la Luna',
    ],
    gettingThere: [
      { mode: 'Avión', detail: 'Aeropuerto El Alto (LPB) · 25 min al centro' },
      { mode: 'Teleférico', detail: '10 líneas · Bs 3 por viaje · 06:00 – 22:00' },
      { mode: 'Bus', detail: 'La Paz → Coroico (Yungas) · ~3 h' },
    ],
    tip: 'El teleférico es la forma más barata y rápida de leer la ciudad: Bs 3 por viaje.',
  },
  {
    id: 'altiplano-sur',
    title: 'Altiplano Sur',
    sub: 'Salar de Uyuni · Lagunas de colores · Cementerio de trenes',
    img: IMG.photoUyuni,
    color: 'var(--amber-500)',
    glyph: <I.Sparkle size={28}/>,
    altitude: '3.650 – 4.900 m',
    bestTime: 'May – Oct seco · Ene – Mar espejo',
    from: 'Uyuni',
    timeNeeded: '3 – 4 días',
    highlights: [
      'Salar de Uyuni al atardecer',
      'Isla Incahuasi y sus cactus',
      'Laguna Colorada y Laguna Verde',
      'Cementerio de trenes, Uyuni',
    ],
    gettingThere: [
      { mode: 'Bus', detail: 'La Paz → Uyuni · ~10 h · servicio nocturno' },
      { mode: 'Avión', detail: 'La Paz → Uyuni (UYU) · ~55 min' },
      { mode: 'Tour', detail: 'Circuitos de 1 a 4 días desde Uyuni en 4x4' },
    ],
    tip: 'Entre enero y marzo la capa de agua crea el efecto espejo; el resto del año el salar está seco y firme.',
  },
  {
    id: 'valles',
    title: 'Valles Históricos',
    sub: 'Sucre · Potosí · Tarabuco',
    img: IMG.photoValles,
    color: 'var(--navy-500)',
    glyph: <I.Coffee size={28}/>,
    altitude: '2.750 – 4.070 m',
    bestTime: 'Todo el año (templado)',
    from: 'Sucre',
    timeNeeded: '3 – 5 días',
    highlights: [
      'Casco antiguo colonial de Sucre (UNESCO)',
      'Cerro Rico y Casa de la Moneda, Potosí',
      'Mercado textil de Tarabuco (domingos)',
      'Huellas de dinosaurio en Cal Orcko',
    ],
    gettingThere: [
      { mode: 'Avión', detail: 'La Paz → Sucre (SRE) · ~1 h' },
      { mode: 'Bus', detail: 'Sucre → Potosí · ~3 h' },
      { mode: 'Bus', detail: 'Sucre → Tarabuco · ~2 h · sale domingo temprano' },
    ],
    tip: 'Sucre es la transición de altitud más suave hacia el altiplano.',
  },
  {
    id: 'amazon',
    title: 'Amazonía',
    sub: 'Madidi · Rurrenabaque · Pampas del Yacuma',
    img: IMG.photoAmazon,
    color: 'var(--green-500)',
    glyph: <I.Mountain size={28}/>,
    altitude: '180 – 600 m',
    bestTime: 'May – Sep (seco)',
    from: 'Rurrenabaque',
    timeNeeded: '4 – 6 días',
    highlights: [
      'Parque Nacional Madidi',
      'Pampas del Yacuma y su fauna',
      'Albergue comunitario Chalalán',
      'Río Beni y San Buenaventura',
    ],
    gettingThere: [
      { mode: 'Avión', detail: 'La Paz → Rurrenabaque (RBQ) · ~45 min' },
      { mode: 'Bus', detail: 'La Paz → Rurrenabaque · ~18 h' },
      { mode: 'Bote', detail: 'Rurrenabaque → Madidi por el río Beni' },
    ],
    tip: 'Calor y humedad de tierras bajas: repelente con DEET y ropa transpirable.',
  },
];

const TABS = [
  { id: 'eat',     label: 'Eat & Drink', icon: <I.Coffee size={18}/>, items: [
    { name: 'Gustu', meta: 'La Paz', img: IMG.food, kicker: 'World 50 Best' },
    { name: 'Café del Mundo', meta: 'Sucre', img: IMG.food, kicker: 'Café y coworking' },
    { name: 'Mercado Lanza', meta: 'La Paz', img: IMG.food, kicker: 'Mercado local' },
    { name: 'Phayawi', meta: 'Cochabamba', img: IMG.food, kicker: 'Fusión andina' },
  ]},
  { id: 'culture', label: 'Culture & Museums', icon: <I.Building size={18}/>, items: [
    { name: 'Museo Nacional de Etnografía', meta: 'La Paz', img: IMG.culture, kicker: 'MUSEF' },
    { name: 'Casa de la Libertad', meta: 'Sucre', img: IMG.culture, kicker: 'Independencia' },
    { name: 'Museo de Tiwanaku', meta: 'Altiplano Norte', img: IMG.culture, kicker: 'UNESCO' },
    { name: 'Casa Nacional de Moneda', meta: 'Potosí', img: IMG.culture, kicker: 'Colonial' },
  ]},
  { id: 'transport', label: 'Transport & Cable Cars', icon: <I.Tram size={18}/>, items: [
    { name: 'Mi Teleférico, Línea Roja', meta: 'La Paz – El Alto', img: IMG.cable, kicker: 'Bs 3 · 11 min' },
    { name: 'Mi Teleférico, Línea Amarilla', meta: 'Mirador – Libertador', img: IMG.cable, kicker: 'Bs 3 · 17 min' },
    { name: 'Bus nocturno', meta: 'La Paz – Uyuni', img: IMG.cable, kicker: '~10 h' },
    { name: 'Vuelo regional', meta: 'La Paz – Rurrenabaque', img: IMG.cable, kicker: '~45 min' },
  ]},
  { id: 'trek',    label: 'Mountain Trekking', icon: <I.Boot size={18}/>, items: [
    { name: 'Huayna Potosí', meta: '6.088 m · 3 días', img: IMG.trek, kicker: 'Técnico' },
    { name: 'Trek El Choro', meta: 'Andes a Yungas · 3 días', img: IMG.trek, kicker: 'Camino inca' },
    { name: 'Pequeño Alpamayo', meta: '5.370 m · 2 días', img: IMG.trek, kicker: 'Alpino inicial' },
    { name: 'Illimani', meta: '6.438 m · 4 días', img: IMG.trek, kicker: 'Experto' },
  ]},
];

export { CLUSTERS, TABS };
