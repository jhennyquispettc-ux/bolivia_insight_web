# Bolivia Insight — Portal Web

Proyecto de portal turístico de Bolivia hecho con React (sin instalación).

## Cómo abrir el proyecto

Necesitás un servidor local porque el navegador no puede cargar archivos `.jsx` desde `file://` directamente.

**Opción A — VS Code (recomendado para principiantes):**
1. Instalar la extensión **Live Server**.
2. Click derecho sobre `index.html` → *Open with Live Server*.

**Opción B — Python (si lo tenés instalado):**
```bash
cd web
python3 -m http.server 8000
```
Luego abrir http://localhost:8000 en el navegador.

## Estructura de carpetas

```
web/
├── index.html              ← punto de entrada (abrir este)
├── README.md
├── styles/
│   └── colors_and_type.css ← colores y tipografía del diseño
├── assets/
│   ├── images/             ← fotos de destinos
│   └── logos/              ← logos del portal
└── src/
    ├── app.jsx             ← componente principal que arma todo
    ├── ui/                 ← piezas básicas reutilizables
    │   ├── iconos.jsx          (iconos SVG)
    │   ├── imagenes.jsx        (gradientes y rutas de fotos)
    │   ├── Boton.jsx           (botón estilizado)
    │   └── StatusDot.jsx       (punto de estado)
    ├── data/               ← datos del proyecto
    │   └── destinos.jsx        (lista de clusters y tabs)
    ├── componentes/        ← bloques visuales reutilizables
    │   ├── NavBar.jsx
    │   ├── Hero.jsx
    │   ├── Clusters.jsx
    │   ├── Tabs.jsx
    │   ├── AIConcierge.jsx
    │   └── Dictionary.jsx       (se usa embebido dentro de TravelGuide)
    ├── paginas/            ← cada pantalla del sitio
    │   ├── Landing.jsx         (página de inicio)
    │   ├── ClusterDetail.jsx   (detalle de un destino)
    │   ├── TravelGuide.jsx
    │   ├── Dashboard.jsx
    │   ├── EmergencyHub.jsx
    │   └── TalkToExpert.jsx
    └── navegacion/         ← lógica de cambio entre páginas
        └── useRouter.jsx
```

## ¿Dónde modificar qué?

| Quiero cambiar... | Voy a... |
|---|---|
| Colores o tipografía | `styles/colors_and_type.css` |
| Un ícono | `src/ui/iconos.jsx` |
| El estilo del botón | `src/ui/Boton.jsx` |
| Una foto de fondo | `src/ui/imagenes.jsx` |
| Lista de destinos | `src/data/destinos.jsx` |
| La barra de navegación | `src/componentes/NavBar.jsx` |
| Una pantalla específica | `src/paginas/<NombrePagina>.jsx` |
| Cómo se cambia de pantalla | `src/navegacion/useRouter.jsx` |
| Componente raíz / orden de pantallas | `src/app.jsx` |

## Cómo se conectan los archivos

`index.html` carga los scripts en este orden:

1. **React + Babel** desde CDN.
2. **`ui/`** (iconos, imágenes, Botón, StatusDot).
3. **`data/`** (destinos — usa íconos e imágenes).
4. **`componentes/`** (NavBar, Hero, etc).
5. **`paginas/`** (cada vista).
6. **`navegacion/`** (router).
7. **`app.jsx`** (arma todo y monta en `<div id="root">`).

El orden importa: cada archivo usa lo definido por los anteriores.
