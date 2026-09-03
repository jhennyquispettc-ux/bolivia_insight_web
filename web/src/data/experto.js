// The one real person who takes the advisory calls.
//
// Single source of truth: the booking page, the confirmation screen and the
// landing band all read from here, so no screen can drift into inventing a
// credential. Every field below is a fact supplied by her, not a placeholder.
export const EXPERT = {
  id: 'jhenny',
  name: 'Jhenny Quispe',
  initials: 'JQ',
  color: 'var(--rust-500)',
  city: 'La Paz, Bolivia',
  // Drop the photo at this path and it replaces the initials avatar
  // automatically; until then the avatar renders and nothing looks broken.
  photo: '/assets/images/experto-jhenny.jpg',
  yearsLabel: '4 años',
  languages: ['Español', 'Inglés'],
  credentials: [
    'Licenciada en Turismo',
    'Guía de turismo',
    'Experiencia en los Infotur de La Paz',
  ],
  bio:
    'Licenciada en turismo y guía de La Paz. Cuatro años en la industria ' +
    'organizando viajes, con experiencia atendiendo viajeros en los Infotur ' +
    'de la ciudad. Te ayuda a ordenar el itinerario, entender las rutas y ' +
    'evitar los errores que cuestan días.',
};

export default EXPERT;
