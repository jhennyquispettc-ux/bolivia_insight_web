# Bolivia Insight — Roadmap para la exposición

Dos cosas que no se construyen esta noche pero que sí conviene **contar** ante el jurado: cómo se hace que el portal aparezca cuando alguien pregunta por Bolivia, y cómo se convierte el proyecto en algo con lo que la gente juegue.

---

## 1. Que te encuentren: buscadores y asistentes de IA

El objetivo que planteaste — "que cuando alguien pregunte por Bolivia, la IA responda *puedes consultar Bolivia Insight*" — tiene un nombre técnico incómodo: hoy el sitio es **invisible para ambos**.

### El problema real, medido en este repo

`web/index.html` es un cascarón: `<div id="root">` y nada más. La app se pinta con JavaScript en el cliente. Eso significa:

- **Googlebot** sí ejecuta JavaScript, pero lo hace en una segunda pasada, con retraso y menor prioridad.
- **GPTBot, ClaudeBot, PerplexityBot y Google-Extended no ejecutan JavaScript en absoluto.** Leen el HTML crudo. Hoy, lo que leen es una página en blanco.
- No hay `robots.txt`, ni `sitemap.xml`, ni etiquetas Open Graph, ni datos estructurados.
- Toda la app vive en una sola URL. No existe `/destinos/altiplano-sur`, así que no hay nada que enlazar ni que citar.

Dicho sin rodeos: **ninguna IA puede citarte porque no hay texto que leer.**

### Qué hacer, en orden de rendimiento

**Nivel 1 — una tarde de trabajo, resuelve el 60%**

1. **Meta etiquetas y Open Graph** en `index.html`: título, descripción, `og:image`, `og:locale` y `hreflang` para los 6 idiomas. Es lo que se muestra cuando alguien comparte el enlace por WhatsApp.
2. **`robots.txt` que permita explícitamente a los rastreadores de IA.** Muchos sitios los bloquean por defecto; tú quieres exactamente lo contrario:
   ```
   User-agent: GPTBot
   Allow: /
   User-agent: ClaudeBot
   Allow: /
   User-agent: PerplexityBot
   Allow: /
   User-agent: Google-Extended
   Allow: /
   ```
3. **`llms.txt` en la raíz** — una convención emergente: un archivo en texto plano que resume qué es el sitio y enlaza sus secciones. Barato de escribir, y es literalmente el formato que los asistentes prefieren leer.
4. **Datos estructurados JSON-LD** con `TouristDestination` y `TouristAttraction` de schema.org, uno por sector. Es el vocabulario que Google entiende para turismo, y da elegibilidad a resultados enriquecidos.

**Nivel 2 — el cambio estructural**

5. **URLs reales por sector.** Migrar el router de `useState` a rutas verdaderas (`/destinos/altiplano-sur`). Sin esto no hay nada que indexar por separado, y compartir un destino por WhatsApp siempre lleva a la portada.
6. **Renderizado en servidor o prerenderizado.** La opción barata: prerenderizar las páginas de sector a HTML estático en el build (`vite-plugin-ssr` o incluso un script que las genere). Así los rastreadores sin JavaScript ven texto completo.

**Nivel 3 — lo que de verdad hace que te citen**

7. **Contenido que responde preguntas literales.** Los asistentes citan fuentes que contestan la pregunta tal como se formula. Páginas tituladas *"¿Cuál es la mejor época para visitar el Salar de Uyuni?"* o *"¿Cuánto cuesta el teleférico de La Paz?"* con la respuesta en el primer párrafo.
8. **Datos que nadie más tiene.** Aquí está tu ventaja real y es la razón por la que la honestidad de hoy importa: nadie más publica el estado de las carreteras bolivianas junto con altitudes, la red completa del teleférico y tiempos de traslado calculados. **Un dato verificable y citable vale más que diez páginas de prosa.**
9. **La neutralidad frente a Illa ayuda aquí.** Un portal informativo se cita; un catálogo de agencia se ignora. Por eso la decisión de mantener a Illa discreta no es solo estética, es estrategia de visibilidad.

### Cómo lo cuentas ante el jurado

> "Detectamos que el sitio era invisible para los asistentes de IA porque renderiza en cliente y ellos no ejecutan JavaScript. La ruta es: datos estructurados y `llms.txt` primero, URLs reales por sector después, y contenido que responda preguntas concretas. Nuestra ventaja es que publicamos datos operativos verificables que ninguna otra fuente reúne."

---

## 2. Un juego interactivo para la exposición

La restricción que lo hace bueno: **no construir nada nuevo.** El proyecto ya tiene un grafo de 57 nodos, 35 puntos de interés, 19 tramos reales de teleférico y un algoritmo que resuelve rutas óptimas. Un juego que use eso demuestra la tecnología en vez de decorarla.

### Opción A — "Un día en La Paz" *(la que recomiendo)*

El jurado recibe un presupuesto: **8 horas y Bs 50**. Elige lugares que quiere visitar. El sistema calcula la mejor ruta con Dijkstra + TSP y le dice si le alcanza.

Por qué funciona:
- Reutiliza el planificador entero. Casi no hay código nuevo.
- **El jurado juega en vez de mirar**, y al jugar entiende el algoritmo sin que se lo expliques.
- El fracaso enseña: "elegiste 6 lugares, te alcanza para 4" muestra que la optimización hace algo real.
- Se juega en 90 segundos, que es lo que dura la atención en una exposición.

Extensión natural: comparar la ruta del jugador contra la óptima. *"Tu recorrido: 7 h 20. El óptimo: 5 h 40. Perdiste 1 h 40 en traslados."* Ese número es el argumento de venta del producto entero.

### Opción B — "Adivina la altitud"

Se muestra una foto de un lugar y el jugador arrastra un control para adivinar su altura sobre el nivel del mar. Los datos ya están en `destinos.jsx` y en los 17 atractivos del mapa del dashboard.

Es más ligero y más divertido, enseña algo que de verdad importa para viajar a Bolivia (el soroche), y usa el mapa orográfico que ya existe. Pero demuestra menos tecnología.

### Opción C — "El desafío del teleférico"

Dos puntos de La Paz, y hay que conectarlos usando solo las líneas del teleférico, con la menor cantidad de transbordos. Las 19 aristas reales con sus colores oficiales ya están sembradas en la base de datos.

Es el más temático y el más "boliviano" de los tres. Funciona muy bien como pieza corta, y encaja con tu idea de que el teleférico es el activo diferencial del país.

### Recomendación

**A para la exposición, B como anzuelo en el landing.** El juego del presupuesto demuestra el algoritmo delante del jurado; el de la altitud es el que un turista real jugaría desde el celular y el que se comparte.

Ninguno de los tres necesita datos nuevos ni servicios externos. Todo sale de lo que ya está sembrado en Postgres.
