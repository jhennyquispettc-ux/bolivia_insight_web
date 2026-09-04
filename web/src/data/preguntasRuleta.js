// Banco de preguntas de la Ruleta Boliviana.
//
// Cada dato de este archivo se verificó contra fuentes públicas antes de
// escribirse. Regla que seguimos al ampliarlo: nada que caduque (población,
// autoridades, precios, récords vigentes), toda cifra o fecha se comprueba, y
// si las fuentes discrepan la pregunta se descarta en vez de elegir un número.
//
// Las tres opciones incorrectas son siempre elementos reales del mismo dominio:
// plausibles, pero inequívocamente falsas para esa pregunta. El orden es fijo,
// así que lo que se lee aquí es exactamente lo que ve quien juega.

export const CATEGORIAS = [
  { id: 'historia', nombre: 'Historia', corto: 'Historia', color: 'var(--rust-500)', colorTexto: '#fff' },
  { id: 'geografia', nombre: 'Geografía', corto: 'Geografía', color: 'var(--navy-500)', colorTexto: '#fff' },
  { id: 'gastronomia', nombre: 'Gastronomía', corto: 'Comida', color: 'var(--amber-500)', colorTexto: '#142035' },
  { id: 'fiestas', nombre: 'Fiestas y Danzas', corto: 'Fiestas', color: 'var(--mystic-500)', colorTexto: '#fff' },
  { id: 'naturaleza', nombre: 'Naturaleza y Fauna', corto: 'Naturaleza', color: 'var(--green-500)', colorTexto: '#fff' },
  { id: 'lenguas', nombre: 'Lenguas y Símbolos', corto: 'Lenguas', color: 'var(--stone-500)', colorTexto: '#fff' },
];

export const PREGUNTAS = {
  historia: [
  {
    q: '¿Qué nombre recibió la junta de gobierno instalada en La Paz tras el 16 de julio de 1809?',
    opciones: ['Junta Central de Sevilla', 'Primera Junta de Buenos Aires', 'Junta Tuitiva', 'Junta Suprema de Caracas'],
    correcta: 2,
    dato: 'Su nombre completo fue Junta Tuitiva de los Derechos del Rey y del Pueblo, encabezada por Pedro Domingo Murillo.',
  },
  {
    q: '¿A qué autoridad depusieron los patriotas de Chuquisaca el 25 de mayo de 1809?',
    opciones: ['Al presidente Ramón García Pizarro', 'Al gobernador Tadeo Dávila', 'Al mariscal Vicente Nieto', 'Al virrey Baltasar de Cisneros'],
    correcta: 0,
    dato: 'García Pizarro presidía la Real Audiencia de Charcas y terminó entregando el mando a ese mismo tribunal.',
  },
  {
    q: '¿Quién fue la líder aymara, esposa de Túpac Katari, que comandó parte del cerco a La Paz de 1781?',
    opciones: ['Micaela Bastidas', 'Juana Azurduy', 'Vicenta Juaristi Eguino', 'Bartolina Sisa'],
    correcta: 3,
    dato: 'Sisa organizó campamentos rebeldes en alturas como El Alto y Killi Killi durante el asedio.',
  },
  {
    q: '¿Qué sistema de turnos obligatorios abastecía de trabajadores indígenas a las minas de Potosí?',
    opciones: ['La encomienda', 'La mita', 'El pongueaje', 'El ayni'],
    correcta: 1,
    dato: 'El virrey Francisco de Toledo la reorganizó en 1573 con un repartimiento de miles de mitayos.',
  },
  {
    q: '¿A qué virreinato pasó a depender la Audiencia de Charcas en 1776?',
    opciones: ['Al Virreinato del Perú', 'Al Virreinato de Nueva España', 'Al Virreinato de Nueva Granada', 'Al Virreinato del Río de la Plata'],
    correcta: 3,
    dato: 'Charcas había pertenecido al Virreinato del Perú desde su creación en 1559.',
  },
  {
    q: '¿Con qué caudillo compartió Juana Azurduy la jefatura de la republiqueta de La Laguna?',
    opciones: ['Manuel Ascencio Padilla', 'Ignacio Warnes', 'Vicente Camargo', 'Eustaquio Méndez'],
    correcta: 0,
    dato: 'Era su esposo; al morir él, Azurduy asumió el mando de esas guerrillas altoperuanas.',
  },
  {
    q: '¿Quién redactó el proyecto de la primera Constitución de Bolivia, promulgada en 1826?',
    opciones: ['Antonio José de Sucre', 'Simón Bolívar', 'Casimiro Olañeta', 'José Ignacio de Sanjinés'],
    correcta: 1,
    dato: 'Se la llama Constitución vitalicia porque el presidente ejercía el cargo de por vida.',
  },
  {
    q: '¿Qué batalla de 1839 puso fin a la Confederación Perú-Boliviana de Andrés de Santa Cruz?',
    opciones: ['La batalla de Ingavi', 'La batalla de Socabaya', 'La batalla de Yungay', 'La batalla de Ayacucho'],
    correcta: 2,
    dato: 'El Ejército Unido Restaurador, mandado por el chileno Manuel Bulnes, venció allí el 20 de enero de 1839.',
  },
  {
    q: '¿Qué presidente peruano murió invadiendo Bolivia en la batalla de Ingavi de 1841?',
    opciones: ['Agustín Gamarra', 'Ramón Castilla', 'Luis José de Orbegoso', 'Felipe Santiago Salaverry'],
    correcta: 0,
    dato: 'José Ballivián comandó a las tropas bolivianas que vencieron ese 18 de noviembre cerca de Viacha.',
  },
  {
    q: '¿Dónde se izó por primera vez, en 1851, la bandera tricolor roja, amarilla y verde?',
    opciones: ['En la plaza Murillo de La Paz', 'En la Casa de la Libertad de Sucre', 'En el cerro Rico de Potosí', 'En el faro de Conchupata, en Oruro'],
    correcta: 3,
    dato: 'El presidente Manuel Isidoro Belzu estableció ese año el diseño definitivo de la tricolor.',
  },
  {
    q: '¿Qué puerto del Litoral boliviano ocupó Chile el 14 de febrero de 1879?',
    opciones: ['Cobija', 'Antofagasta', 'Mejillones', 'Tocopilla'],
    correcta: 1,
    dato: 'La ocupación impidió el remate de bienes de una salitrera chilena gravada con el impuesto de diez centavos.',
  },
  {
    q: '¿Qué presidente fue derrocado por José Manuel Pando en la Guerra Federal de 1899?',
    opciones: ['Aniceto Arce', 'Mariano Baptista', 'Severo Fernández Alonso', 'Gregorio Pacheco'],
    correcta: 2,
    dato: 'Tras la derrota conservadora en el Segundo Crucero, la sede de gobierno se trasladó a La Paz.',
  },
  {
    q: '¿Qué ferrocarril se comprometió a construir Brasil en el Tratado de Petrópolis de 1903?',
    opciones: ['El Madera-Mamoré', 'El Arica-La Paz', 'El Antofagasta-Oruro', 'El Guaqui-La Paz'],
    correcta: 0,
    dato: 'Por ese tratado Bolivia cedió el Acre y recibió dos millones de libras esterlinas.',
  },
  {
    q: '¿Quién comandaba la guarnición boliviana sitiada en el fortín Boquerón en septiembre de 1932?',
    opciones: ['Óscar Moscoso', 'Manuel Marzana', 'Hans Kundt', 'Enrique Peñaranda'],
    correcta: 1,
    dato: 'Boquerón cayó el 29 de septiembre de 1932 tras veinte días de asedio paraguayo.',
  },
  {
    q: '¿En qué localidad se firmó el decreto de Reforma Agraria del 2 de agosto de 1953?',
    opciones: ['Warisata', 'Ayo Ayo', 'Ucureña', 'Achacachi'],
    correcta: 2,
    dato: 'Ucureña está en el valle alto de Cochabamba y el decreto abolió el pongueaje y extinguió el latifundio.',
  },
  ],

  geografia: [
  {
    q: 'Cobija se levanta a orillas de un río fronterizo, frente a la brasileña Brasiléia. ¿Cuál es?',
    opciones: ['Río Abuná', 'Río Acre', 'Río Orthon', 'Río Madre de Dios'],
    correcta: 1,
    dato: 'El río Acre marca la frontera con Brasil y Cobija es la capital del departamento de Pando.',
  },
  {
    q: '¿Cuál es la capital del departamento del Beni?',
    opciones: ['Riberalta', 'Guayaramerín', 'Trinidad', 'San Borja'],
    correcta: 2,
    dato: 'Trinidad fue fundada en 1686 por el jesuita Cipriano Barace a orillas del río Mamoré.',
  },
  {
    q: '¿En qué departamento se alza el Nevado Sajama, la montaña más alta de Bolivia?',
    opciones: ['Oruro', 'La Paz', 'Potosí', 'Cochabamba'],
    correcta: 0,
    dato: 'Pertenece a la Cordillera Occidental y da nombre al parque nacional más antiguo del país, de 1939.',
  },
  {
    q: 'Bajo la costra del salar de Uyuni se halla una de las mayores reservas mundiales de...',
    opciones: ['Estaño', 'Plata', 'Cobre', 'Litio'],
    correcta: 3,
    dato: 'El salar de Uyuni, en el departamento de Potosí, es además el salar más extenso del mundo.',
  },
  {
    q: '¿Qué área protegida resguarda la Laguna Colorada y los géiseres de Sol de Mañana?',
    opciones: ['Reserva Manuripi Heath', 'Parque Nacional Sajama', 'Reserva Eduardo Avaroa', 'Reserva de Tariquía'],
    correcta: 2,
    dato: 'La Reserva Nacional de Fauna Andina Eduardo Avaroa está en el sudoeste de Potosí, en Sud Lípez.',
  },
  {
    q: '¿A qué cordillera pertenecen el Illimani y el Huayna Potosí?',
    opciones: ['Cordillera Occidental', 'Cordillera Real', 'Cordillera de Lípez', 'Cordillera de Apolobamba'],
    correcta: 1,
    dato: 'La Cordillera Real se extiende al sureste del lago Titicaca, en el departamento de La Paz.',
  },
  {
    q: '¿En qué departamento se encuentra el Parque Nacional Madidi?',
    opciones: ['La Paz', 'Beni', 'Pando', 'Cochabamba'],
    correcta: 0,
    dato: 'Madidi fue creado en 1995 y abarca provincias del norte paceño, colindando al oeste con el Perú.',
  },
  {
    q: '¿Qué parque protege la meseta de Caparú o Huanchaca, en el escudo precámbrico?',
    opciones: ['Parque Amboró', 'Parque Torotoro', 'Parque Madidi', 'Parque Noel Kempff Mercado'],
    correcta: 3,
    dato: 'Está en la provincia Velasco de Santa Cruz y al crearse en 1979 se llamó Parque Nacional Huanchaca.',
  },
  {
    q: 'Después del de Uyuni, ¿cuál es el salar más extenso de Bolivia?',
    opciones: ['Salar de Coipasa', 'Salar de Empexa', 'Salar de Chiguana', 'Salar de Pastos Grandes'],
    correcta: 0,
    dato: 'El salar de Coipasa está en la provincia Sabaya, en Oruro, y rodea por completo al lago Coipasa.',
  },
  {
    q: '¿A qué cuenca hidrográfica pertenece el río Pilcomayo, que atraviesa Villa Montes?',
    opciones: ['Cuenca amazónica', 'Cuenca cerrada del Altiplano', 'Cuenca del Plata', 'Cuenca del río Madera'],
    correcta: 2,
    dato: 'El Pilcomayo nace en los Andes bolivianos y aguas abajo separa a la Argentina del Paraguay.',
  },
  {
    q: '¿Por la unión de qué dos ríos nace el Madera, gran afluente del Amazonas?',
    opciones: ['Mamoré e Iténez', 'Beni y Mamoré', 'Beni y Madre de Dios', 'Ichilo y Grande'],
    correcta: 1,
    dato: 'Ambos ríos confluyen en la frontera entre Bolivia y Brasil, donde comienza el curso del Madera.',
  },
  {
    q: '¿En qué cuerpo de agua desemboca el río Desaguadero, que sale del lago Titicaca?',
    opciones: ['Lago Coipasa', 'Laguna Colorada', 'Laguna Verde', 'Lago Poopó'],
    correcta: 3,
    dato: 'El Desaguadero es el principal desagüe del Titicaca y su cuenca es endorreica, sin salida al mar.',
  },
  {
    q: 'El estrecho de Tiquina divide el Titicaca en el Lago Mayor o Chucuito y el Lago Menor o...',
    opciones: ['Huiñaimarca', 'Uru Uru', 'Coipasa', 'Poopó'],
    correcta: 0,
    dato: 'El estrecho de Tiquina, en el departamento de La Paz, es el paso obligado hacia Copacabana.',
  },
  {
    q: '¿Cuál es el único departamento de Bolivia que no limita con ningún país extranjero?',
    opciones: ['Chuquisaca', 'Oruro', 'Cochabamba', 'Potosí'],
    correcta: 2,
    dato: 'Chuquisaca llega al Chaco y limita con el Paraguay, mientras que Oruro y Potosí lindan con Chile.',
  },
  {
    q: '¿En qué departamento están las misiones jesuíticas de Chiquitos, Patrimonio Mundial?',
    opciones: ['Beni', 'Santa Cruz', 'Chuquisaca', 'Tarija'],
    correcta: 1,
    dato: 'Las misiones chiquitanas fueron inscritas en la lista de Patrimonio Mundial de la Unesco en 1990.',
  },
  ],

  gastronomia: [
  {
    q: '¿Qué paso diferencia la elaboración de la tunta de la del chuño negro?',
    opciones: ['Ahumarla sobre fogón de bosta', 'Hervirla con ceniza de quinua', 'Remojarla en agua corriente varios días', 'Enterrarla en arena caliente'],
    correcta: 2,
    dato: 'Ese remojo en agua helada le quita el amargor y le deja el color blanquecino que la distingue.',
  },
  {
    q: 'Junto al queso, ¿cuál es el ingrediente base del cuñapé del oriente boliviano?',
    opciones: ['Almidón de yuca', 'Harina de maíz willkaparu', 'Harina de quinua', 'Almidón de papa'],
    correcta: 0,
    dato: 'Al no llevar harina de trigo, el cuñapé resulta naturalmente libre de gluten.',
  },
  {
    q: '¿Qué fruta deshidratada se hierve con canela y clavo para el refresco de mocochinchi?',
    opciones: ['Higo', 'Manzana', 'Ciruela', 'Durazno'],
    correcta: 3,
    dato: 'El mocochinchi es durazno pelado y secado, y en el vaso se sirve la fruta junto con su almíbar.',
  },
  {
    q: '¿Qué variedad de maíz se usa tradicionalmente para preparar el tojorí?',
    opciones: ['Pisankalla', 'Willkaparu', 'Kulli', 'Chuspillu'],
    correcta: 1,
    dato: 'El willkaparu, maíz de los valles bolivianos, también se destina a la chicha y al mote.',
  },
  {
    q: '¿De qué animal proviene la chalona que se echa al chairo?',
    opciones: ['Llama', 'Oveja', 'Res', 'Cerdo'],
    correcta: 1,
    dato: 'La chalona es carne ovina deshidratada con sal, sol y helada; el charque suele ser de res o llama.',
  },
  {
    q: '¿Qué acompañamiento crocante corona clásicamente la sopa de maní?',
    opciones: ['Papas fritas', 'Chicharrón de cerdo', 'Maní tostado entero', 'Tostado de maíz pisankalla'],
    correcta: 0,
    dato: 'La sopa se prepara con maní crudo molido y se sirve con pan y llajua al lado.',
  },
  {
    q: '¿Qué ingrediente le da al majadito su característico color rojizo?',
    opciones: ['Ají colorado molido', 'Pimentón ahumado', 'Tomate concentrado', 'Urucú o achiote'],
    correcta: 3,
    dato: 'El urucú se fríe primero en aceite para soltar su color y con él se tuesta el arroz.',
  },
  {
    q: 'Además del tomate, ¿cuál es el ingrediente picante clásico de la llajua?',
    opciones: ['Ají panca', 'Ají amarillo', 'Locoto', 'Pimienta de Jamaica'],
    correcta: 2,
    dato: 'Según la región se le suma quirquiña, wakataya o suyku, hierbas que le cambian el aroma.',
  },
  {
    q: 'El charquekán orureño se prepara tradicionalmente con charque de...',
    opciones: ['Llama', 'Cordero', 'Cerdo', 'Pato'],
    correcta: 0,
    dato: 'Se sirve desmenuzado con mote de maíz, papa con cáscara, queso criollo y huevo duro.',
  },
  {
    q: '¿Qué carne y qué ají definen al fricasé paceño?',
    opciones: ['Cordero y ají panca', 'Res y ají colorado', 'Cerdo y ají amarillo', 'Llama y ulupica'],
    correcta: 2,
    dato: 'Se sirve en plato hondo, con chuño y mote de maíz blanco dentro del caldo.',
  },
  {
    q: 'El trancapecho cochabambino es la versión en sándwich de otro plato. ¿Cuál?',
    opciones: ['Pique macho', 'Silpancho', 'Saice', 'Fricasé'],
    correcta: 1,
    dato: 'Lleva dentro del pan la carne martajada, el arroz, la papa, el huevo y la sarsa del silpancho.',
  },
  {
    q: '¿Cómo se llama el gran mortero de madera del oriente boliviano con que se hace el masaco?',
    opciones: ['Batán', 'Tacú', 'Wislla', 'Callana'],
    correcta: 1,
    dato: 'En los Andes el utensilio equivalente es el batán, una piedra plana con su moledora encima.',
  },
  {
    q: "¿Qué se sumerge ardiendo en el plato de k'ala phurka potosina antes de servirla?",
    opciones: ['Un carbón de quebracho', 'Una barra de hierro', 'Una tapa de barro', 'Una piedra volcánica'],
    correcta: 3,
    dato: 'La piedra se calienta al rojo y hace hervir en el plato el caldo espeso de harina de maíz.',
  },
  {
    q: '¿De qué variedad de uva se destila el singani boliviano?',
    opciones: ['Moscatel de Alejandría', 'Malbec', 'Torrontés', 'Criolla chica'],
    correcta: 0,
    dato: 'Solo puede llamarse singani si proviene de viñedos cultivados por encima de los 1.600 metros.',
  },
  {
    q: 'En el altiplano la quinua se lava varias veces antes de cocinarla para eliminar...',
    opciones: ['El gluten', 'Los taninos', 'La saponina', 'El almidón'],
    correcta: 2,
    dato: "La saponina de la cáscara amarga el grano; por eso el p'esque parte siempre de quinua bien lavada.",
  },
  ],

  fiestas: [
  {
    q: 'En la diablada, ¿qué nombre recibe el personaje femenino que baila junto a Lucifer y Satanás?',
    opciones: ['La China Morena', 'La China Supay', "La Mama T'alla", 'La Ñusta'],
    correcta: 1,
    dato: 'Fue el primer personaje femenino de la diablada y en sus inicios lo interpretaban varones.',
  },
  {
    q: 'El lienzo del Señor Jesús del Gran Poder fue repintado para cubrir un rasgo original: ¿cuál?',
    opciones: ['Tenía tres rostros, por la Trinidad', 'Cargaba la cruz sobre los hombros', 'Tenía el rostro moreno y ojos cerrados', 'Llevaba un corazón flamígero al pecho'],
    correcta: 0,
    dato: 'Placas de rayos X mostraron que bajo la capa pictórica siguen los tres rostros y el triángulo trinitario.',
  },
  {
    q: 'Según la leyenda de la pastorcita quillacolleña, ¿qué significa el nombre quechua Urkupiña?',
    opciones: ['Cómprame', 'Encuentro o choque', 'Ya está en el cerro', 'Juego o carnaval'],
    correcta: 2,
    dato: 'En el Calvario los devotos parten piedras a modo de préstamo y prometen devolverlas al año siguiente.',
  },
  {
    q: 'Según la tradición potosina, ¿qué santo venció al demonio en la cueva de Mullu Punku?',
    opciones: ['Santiago Apóstol', 'San Ignacio de Loyola', 'El arcángel San Miguel', 'San Bartolomé'],
    correcta: 3,
    dato: "Esa leyenda, difundida por Arzáns en su Historia de la Villa Imperial, está detrás de Ch'utillos.",
  },
  {
    q: '¿Al son de qué música bailan las máscaras de la Ichapekene Piesta de San Ignacio de Moxos?',
    opciones: ['Tarqueadas y pinkilladas del altiplano', 'Música barroca de las misiones', 'Bandas de bronces del Gran Poder', 'Cuecas y bailecitos chuquisaqueños'],
    correcta: 1,
    dato: 'La UNESCO inscribió la Ichapekene Piesta en su lista de patrimonio inmaterial en 2012.',
  },
  {
    q: 'El vistoso tocado de plumas de los macheteros del Beni se elabora con plumas de...',
    opciones: ['Paraba o guacamayo', 'Cóndor andino', 'Piyo o ñandú', 'Garza blanca'],
    correcta: 0,
    dato: 'Completan el traje la camijeta de algodón y sonajas de semillas de chacai atadas a los tobillos.',
  },
  {
    q: '¿Qué instrumento de trabajo porta en la mano el danzarín de la kullawada?',
    opciones: ["La honda o q'urawa", 'La matraca giratoria', "La rueca o k'apu", 'El machete de madera'],
    correcta: 2,
    dato: 'La kullawada evoca a los antiguos hilanderos y tejedores del altiplano aymara.',
  },
  {
    q: '¿Qué costumbre española satiriza con ironía la danza waca waca, también llamada waca tokoris?',
    opciones: ['Los juicios de la Real Audiencia', 'Las procesiones de Semana Santa', 'Los bailes de salón virreinales', 'Las corridas de toros'],
    correcta: 3,
    dato: 'Entre sus personajes están el toro, el torero, la española y las lecheras con sus polleras superpuestas.',
  },
  {
    q: 'En el tinku del norte de Potosí, ¿qué sentido ritual tiene la sangre derramada en el encuentro?',
    opciones: ['Es ofrenda de fertilidad a la Pachamama', 'Sella la elección del nuevo jilaqata', 'Paga una deuda con el Tío de la mina', 'Consagra el traje nuevo del danzarín'],
    correcta: 0,
    dato: 'Se ejecuta al ritmo de las jula julas y reúne a ayllus como laymes, jukumanis y machas.',
  },
  {
    q: 'La saya afroboliviana de los Yungas paceños se interpreta esencialmente con...',
    opciones: ['Bandas de bronces y platillos', 'Tambores y un idiófono de raspar', 'Zampoñas, quenas y wankaras', 'Charango, guitarra y acordeón'],
    correcta: 1,
    dato: 'La saya no es el caporal: esta última es una danza urbana y mestiza inspirada en aquella.',
  },
  {
    q: '¿A qué figura de las haciendas coloniales representa el danzarín de caporales?',
    opciones: ['Al esclavo africano encadenado', 'Al arriero de llamas del altiplano', 'Al capataz que vigilaba a los esclavos', 'Al minero mitayo del Cerro Rico'],
    correcta: 2,
    dato: 'El látigo simboliza el poder del capataz y el sombrero remite a los cocaleros de los Yungas.',
  },
  {
    q: '¿A qué grupo social ridiculiza la danza de los doctorcitos?',
    opciones: ['A los médicos de la República', 'A los curas doctrineros', 'A los capataces de hacienda', 'A los abogados y letrados coloniales'],
    correcta: 3,
    dato: 'Sus dos personajes son el doctorcito de levita y su secretaria, en una comparsa pantomímica y picaresca.',
  },
  {
    q: '¿Qué rasgo coreográfico distingue a la danza de los tobas dentro del Carnaval de Oruro?',
    opciones: ['Sus saltos de gran altura', 'Su paso lento y cansino', 'El zapateo con cascabeles', 'El hilado con la rueca en alto'],
    correcta: 0,
    dato: 'Sus pasos tienen nombres propios, como el camba, el bolívar y el chucu-chucu.',
  },
  {
    q: 'En Todos Santos, ¿qué figura de masa se hornea para que el alma pueda subir y bajar?',
    opciones: ['La llama', 'La escalera', 'El sol', 'La serpiente'],
    correcta: 1,
    dato: "La mesa de ofrendas se llama mast'aku y en su centro se colocan las t'anta wawas.",
  },
  {
    q: 'En el Pujllay de Tarabuco, ¿qué es la pukara que levantan las comunidades yamparas?',
    opciones: ['Una máscara de cuero con cuernos', 'Un tambor ceremonial de dos parches', 'Una torre cargada de pan y frutas', 'Un látigo trenzado de cuero crudo'],
    correcta: 2,
    dato: "La pukara es una ch'alla a la Pachamama y un homenaje a los antepasados yamparas.",
  },
  ],

  naturaleza: [
  {
    q: '¿Cuáles son los dos camélidos sudamericanos domesticados?',
    opciones: ['La vicuña y el guanaco', 'La llama y la vicuña', 'La llama y la alpaca', 'La alpaca y el guanaco'],
    correcta: 2,
    dato: 'La vicuña y el guanaco siguen siendo silvestres; la llama se usa como animal de carga y la alpaca por su fibra.',
  },
  {
    q: '¿Cuál de los cuatro camélidos sudamericanos produce la fibra más fina?',
    opciones: ['La llama', 'La alpaca', 'El guanaco', 'La vicuña'],
    correcta: 3,
    dato: 'A la vicuña se la esquila viva en capturas comunales de origen prehispánico y después se la vuelve a soltar.',
  },
  {
    q: '¿Cuál es la única especie de oso que habita en Sudamérica?',
    opciones: ['El oso negro americano', 'El jucumari u oso andino', 'El oso perezoso o bezudo', 'El oso de collar asiático'],
    correcta: 1,
    dato: 'Por dispersar semillas de bromelias y frutos por los Yungas se lo apoda "el jardinero de los Andes".',
  },
  {
    q: '¿Cuál es la presa principal del titi o gato andino en el altiplano?',
    opciones: ['La vizcacha', 'El suri o ñandú petiso', 'La taruca o venado andino', 'El flamenco andino'],
    correcta: 0,
    dato: 'El titi vive entre roquedales altoandinos, justo donde se refugian las vizcachas de las que depende.',
  },
  {
    q: '¿De qué se alimenta principalmente el cóndor de los Andes?',
    opciones: ['De crías de vicuña que caza', 'De peces que atrapa en vuelo', 'De frutos y semillas de altura', 'De carroña'],
    correcta: 3,
    dato: 'Con su pico abre los cueros duros del cadáver y deja el resto accesible a carroñeros más pequeños.',
  },
  {
    q: '¿Contra qué enfermedad fue el primer tratamiento eficaz la corteza del árbol de la quina?',
    opciones: ['La viruela', 'La malaria o paludismo', 'La tuberculosis', 'La fiebre amarilla'],
    correcta: 1,
    dato: 'De esa corteza se aisló la quinina en 1820, y su amargor está en el origen del agua tónica.',
  },
  {
    q: '¿Qué función cumple el tronco abultado del toborochi?',
    opciones: ['Fijar nitrógeno en el suelo', 'Almacenar agua para la época seca', 'Albergar colonias de murciélagos', 'Resistir el fuego de los chaqueos'],
    correcta: 1,
    dato: 'Su corteza verde tiene clorofila y sigue trabajando cuando el árbol se queda sin hojas y florece en la seca.',
  },
  {
    q: '¿Qué año declaró la ONU como Año Internacional de la Quinua?',
    opciones: ['2005', '2009', '2013', '2018'],
    correcta: 2,
    dato: 'La FAO nombró embajadores especiales de ese año al presidente de Bolivia y a la primera dama del Perú.',
  },
  {
    q: '¿Cuál es el único sitio boliviano inscrito por la UNESCO como Patrimonio Natural?',
    opciones: ['El Parque Nacional Madidi', 'El Parque Noel Kempff Mercado', 'El Salar de Uyuni', 'El Parque Nacional Sajama'],
    correcta: 1,
    dato: 'Fue inscrito el año 2000; los otros seis sitios bolivianos de la lista de la UNESCO son culturales.',
  },
  {
    q: '¿Por qué la rana gigante del Titicaca tiene la piel llena de pliegues?',
    opciones: ['Para absorber más oxígeno del agua', 'Para camuflarse entre las totoras', 'Para retener el calor del sol', 'Para almacenar agua en la piel'],
    correcta: 0,
    dato: 'Pasa casi toda su vida sumergida y esos pliegues le funcionan como branquias en un lago pobre en oxígeno.',
  },
  {
    q: 'En el lago Titicaca, ¿cuál de estos peces es una especie introducida?',
    opciones: ['El carachi', 'El ispi', 'El mauri', 'El pejerrey'],
    correcta: 3,
    dato: 'El pejerrey y la trucha arcoíris fueron introducidos en el siglo XX y desplazaron a varios peces nativos.',
  },
  {
    q: '¿En qué región de Bolivia vive la paraba barba azul, endémica del país?',
    opciones: ['Los Yungas de La Paz', 'El Chaco de Tarija', 'Los Llanos de Moxos, en el Beni', 'La Chiquitanía cruceña'],
    correcta: 2,
    dato: 'Se la creía desaparecida hasta su redescubrimiento en 1992 y hoy figura En Peligro Crítico.',
  },
  {
    q: '¿Qué especie fue declarada Patrimonio Natural del Estado boliviano en 2012?',
    opciones: ['El bufeo o delfín de río', 'El jucumari u oso andino', 'El cóndor de los Andes', 'La paraba barba azul'],
    correcta: 0,
    dato: 'La Ley N.º 284 protege a este delfín de agua dulce que habita las cuencas del Mamoré y el Iténez.',
  },
  {
    q: '¿Qué le pasa a la Puya raimondii después de florecer por única vez?',
    opciones: ['Rebrota desde la base', 'Muere tras producir sus semillas', 'Vuelve a florecer al año siguiente', 'Pierde las hojas y queda latente'],
    correcta: 1,
    dato: 'Es una planta monocárpica: acumula reservas durante décadas para una sola floración y luego muere.',
  },
  {
    q: 'Además de la kantuta, ¿cuál es la otra flor nacional de Bolivia?',
    opciones: ['El patujú', 'La retama', 'La orquídea Cattleya', 'La flor del cardón'],
    correcta: 0,
    dato: 'La kantuta tricolor lleva el rojo, el amarillo y el verde de la bandera boliviana.',
  },
  ],

  lenguas: [
  {
    q: '¿Cuál de las cuatro wiphalas reconoce la Constitución como símbolo del Estado boliviano?',
    opciones: ['La del Antisuyu', 'La del Chinchaysuyu', 'La del Kuntisuyu', 'La del Qullasuyu'],
    correcta: 3,
    dato: 'El Artículo 6 nombra a la wiphala del Qullasuyu, tejida con 49 cuadros y siete colores.',
  },
  {
    q: 'En el Artículo 8 de la Constitución, "suma qamaña" se traduce como vivir bien. ¿De qué idioma viene?',
    opciones: ['Guaraní', 'Bésiro', 'Aymara', 'Quechua'],
    correcta: 2,
    dato: 'El mismo artículo suma el quechua "ama qhilla, ama llulla, ama suwa" y el guaraní "ñandereko".',
  },
  {
    q: '"Ivi maraei", principio guaraní citado en la Constitución boliviana, se traduce como:',
    opciones: ['Tierra sin mal', 'Vida armoniosa', 'Camino noble', 'Vida buena'],
    correcta: 0,
    dato: 'El Artículo 8 traduce ñandereko como vida armoniosa, teko kavi como vida buena y qhapaj ñan como camino noble.',
  },
  {
    q: '¿En qué departamento está el municipio de Chipaya, cuna del idioma oficial uru-chipaya?',
    opciones: ['Potosí', 'Oruro', 'La Paz', 'Cochabamba'],
    correcta: 1,
    dato: 'El municipio de Chipaya pertenece a la provincia Sabaya, en el altiplano orureño.',
  },
  {
    q: '¿De qué pueblo del oriente boliviano es lengua propia el bésiro?',
    opciones: ['El pueblo mojeño', 'El pueblo guarayo', 'El pueblo chiquitano', 'El pueblo weenhayek'],
    correcta: 2,
    dato: 'El bésiro es el nombre propio del idioma chiquitano, hablado en la Chiquitania cruceña.',
  },
  {
    q: '¿A orillas de qué río del Chaco vive el pueblo weenhayek, pescador y de lengua oficial?',
    opciones: ['El Pilcomayo', 'El Mamoré', 'El Ichilo', 'El Beni'],
    correcta: 0,
    dato: 'Los weenhayek del Chaco tarijeño organizan su año en torno a la pesca en el Pilcomayo.',
  },
  {
    q: '¿A qué familia lingüística pertenece el mojeño-trinitario, idioma oficial del Beni?',
    opciones: ['Pano', 'Tupí-guaraní', 'Uru-chipaya', 'Arawak'],
    correcta: 3,
    dato: 'En Bolivia también son arawak el baure y el machineri; el chácobo, en cambio, es pano.',
  },
  {
    q: '¿Cuántos fonemas vocálicos tiene el idioma aymara?',
    opciones: ['Cinco', 'Tres', 'Seis', 'Ocho'],
    correcta: 1,
    dato: 'El aymara y el quechua comparten un sistema de tres vocales: a, i, u, con alargamiento vocálico.',
  },
  {
    q: '¿Por qué oficio es célebre el pueblo cuya lengua ritual es el machajuyai-kallawaya?',
    opciones: ['La orfebrería', 'La navegación fluvial', 'La medicina herbolaria', 'La alfarería'],
    correcta: 2,
    dato: 'La UNESCO reconoció la cosmovisión andina de los kallawaya, médicos itinerantes, como patrimonio inmaterial.',
  },
  {
    q: '¿Qué es un apthapi en el mundo aymara?',
    opciones: ['Un tejido ceremonial', 'Un bastón de mando', 'Un canto de siembra', 'Una comida comunitaria compartida'],
    correcta: 3,
    dato: 'Cada participante aporta lo que trae y todo se tiende sobre un aguayo para comerlo en común.',
  },
  {
    q: "En aymara, ¿qué significa el adjetivo jach'a?",
    opciones: ['Grande', 'Sagrado', 'Antiguo', 'Nuevo'],
    correcta: 0,
    dato: "Aparece en topónimos como Jach'a Qullu, cerro grande, y Jach'a Jawira, río grande.",
  },
  {
    q: 'El aymara yatiri deriva del verbo yatiña. ¿Qué significa ese verbo?',
    opciones: ['Curar', 'Saber', 'Soñar', 'Ofrendar'],
    correcta: 1,
    dato: 'Con el sufijo agentivo -ri, yatiri es literalmente "el que sabe".',
  },
  {
    q: 'En la Alasita se compran miniaturas ligadas al Ekeko, deidad aymara de:',
    opciones: ['La guerra', 'La abundancia', 'La lluvia', 'Los muertos'],
    correcta: 1,
    dato: 'La UNESCO inscribió en 2017 los recorridos rituales de la Alasita, cuyo nombre significa "cómprame".',
  },
  {
    q: '¿Quién escribió la letra del Himno Nacional de Bolivia?',
    opciones: ['Leopoldo Benedetto Vincenti', 'Ricardo José Bustamante', 'José Ignacio de Sanjinés', 'Néstor Galindo'],
    correcta: 2,
    dato: 'La música es del italiano Leopoldo Benedetto Vincenti y la obra se estrenó el 18 de noviembre de 1845.',
  },
  {
    q: '¿Qué representan las diez estrellas del escudo de Bolivia?',
    opciones: ['Las diez batallas de la independencia', 'Los nueve departamentos y el Litoral', 'Las diez primeras ciudades fundadas', 'Los nueve departamentos y la capital'],
    correcta: 1,
    dato: 'La décima estrella recuerda al Departamento del Litoral y sostiene la reivindicación marítima.',
  },
  ]
};

export const TOTAL_PREGUNTAS = Object.values(PREGUNTAS)
  .reduce((n, banco) => n + banco.length, 0);
