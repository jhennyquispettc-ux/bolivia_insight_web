import React, { useMemo, useRef, useState, useEffect } from 'react';
import I from '../ui/iconos.jsx';
import Btn from '../ui/Boton.jsx';
import Ruleta from '../componentes/ruleta/Ruleta.jsx';
import TarjetaPregunta from '../componentes/ruleta/TarjetaPregunta.jsx';
import Resultados from '../componentes/ruleta/Resultados.jsx';
import { CATEGORIAS, PREGUNTAS, TOTAL_PREGUNTAS } from '../data/preguntasRuleta.js';

const METAS = [3, 5, 7];
const META_POR_DEFECTO = 5;
const CLAVE_META = 'bolivia_insight_ruleta_meta';
const CLAVE_MARCA = 'bolivia_insight_ruleta_marca';
const CLAVE_VISTAS = 'bolivia_insight_ruleta_vistas';
const GIRO_MS = 2600;
const GIRO_MS_REDUCIDO = 300;

// Preguntas ya mostradas, conservadas entre partidas y recargas: en una feria
// pasan muchas personas seguidas por la misma pantalla y no deben repetirse.
function leerVistas() {
  try {
    const arr = JSON.parse(localStorage.getItem(CLAVE_VISTAS));
    return new Set(Array.isArray(arr) ? arr : []);
  } catch { return new Set(); }
}

function guardarVistas(set) {
  try { localStorage.setItem(CLAVE_VISTAS, JSON.stringify([...set])); } catch { /* modo privado */ }
}

// Meta elegida en pantalla: cuántos aciertos seguidos hacen falta para ganar.
function leerMeta() {
  try {
    const v = parseInt(localStorage.getItem(CLAVE_META), 10);
    return METAS.includes(v) ? v : META_POR_DEFECTO;
  } catch { return META_POR_DEFECTO; }
}

// Mejor marca: en cuántas preguntas se logró la racha ganadora. Menos es mejor.
function leerMarca() {
  try {
    const v = parseInt(localStorage.getItem(CLAVE_MARCA), 10);
    return Number.isFinite(v) && v > 0 ? v : 0;
  } catch { return 0; }
}

function guardarMarca(v) {
  try { localStorage.setItem(CLAVE_MARCA, String(v)); } catch { /* modo privado */ }
}

function menosMovimiento() {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch { return false; }
}

function RuletaJuego({ onBack }) {
  const [fase, setFase] = useState('inicio');   // inicio | ruleta | girando | pregunta | fin
  const [vistas, setVistas] = useState(leerVistas);       // acumulado entre partidas
  const [dePartida, setDePartida] = useState(() => new Set());
  const [actual, setActual] = useState(null);   // { catId, idx }
  const [elegida, setElegida] = useState(null);
  const [respondidas, setRespondidas] = useState([]);
  const [racha, setRacha] = useState(0);
  const [mejorRacha, setMejorRacha] = useState(0);
  const [rotacion, setRotacion] = useState(0);
  const [meta, setMeta] = useState(leerMeta);
  const [marca, setMarca] = useState(leerMarca);
  const [marcaPrevia, setMarcaPrevia] = useState(0);
  const [gano, setGano] = useState(false);

  const [vw, setVw] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const timer = useRef(null);
  const isMobile = vw < 768;

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const agotadas = useMemo(() => {
    const s = new Set();
    for (const c of CATEGORIAS) {
      const banco = PREGUNTAS[c.id];
      const usadas = banco.reduce((n, _, i) => n + (vistas.has(`${c.id}:${i}`) ? 1 : 0), 0);
      if (usadas >= banco.length) s.add(c.id);
    }
    return s;
  }, [vistas]);

  const aciertos = respondidas.filter(r => r.correcta).length;
  const preguntaActual = actual ? PREGUNTAS[actual.catId][actual.idx] : null;
  const gana = racha >= meta;
  const fallo = elegida !== null && preguntaActual !== null && elegida !== preguntaActual.correcta;

  const rebarajar = (conservar) => {
    const limpio = conservar.size >= TOTAL_PREGUNTAS ? new Set() : new Set(conservar);
    setVistas(limpio);
    guardarVistas(limpio);
    return limpio;
  };

  const cambiarMeta = (n) => {
    setMeta(n);
    try { localStorage.setItem(CLAVE_META, String(n)); } catch { /* modo privado */ }
  };

  const iniciar = () => {
    setMarcaPrevia(marca);
    setDePartida(new Set());
    setRespondidas([]);
    setActual(null);
    setElegida(null);
    setRacha(0);
    setMejorRacha(0);
    setGano(false);
    if (vistas.size >= TOTAL_PREGUNTAS) rebarajar(new Set());
    setFase('ruleta');
  };

  const terminar = (victoria = false, usadasParaGanar = 0) => {
    setGano(victoria);
    if (victoria && (marca === 0 || usadasParaGanar < marca)) {
      guardarMarca(usadasParaGanar);
      setMarca(usadasParaGanar);
    }
    setFase('fin');
  };

  // Ruleta dirigida: primero sorteo entre las categorías que aún tienen
  // preguntas y después calculo el ángulo que deja ese gajo bajo el marcador,
  // así nunca se detiene sobre una categoría agotada.
  const girar = () => {
    // Si ya no queda ninguna pregunta sin ver, se rebaraja el mazo conservando
    // las de esta partida. Hay que recalcular las categorías vivas DESPUÉS de
    // rebarajar: si no, se podría elegir una que se quedó sin preguntas libres.
    let excluir = vistas;
    let vivas = CATEGORIAS.filter(c => !agotadas.has(c.id));

    if (vivas.length === 0) {
      excluir = rebarajar(dePartida);
      vivas = CATEGORIAS.filter(c => PREGUNTAS[c.id].some((_, i) => !excluir.has(`${c.id}:${i}`)));
    }
    if (vivas.length === 0) {
      // Solo aquí es inevitable repetir: la partida ya consumió el banco entero.
      excluir = rebarajar(new Set());
      vivas = CATEGORIAS;
    }

    const cat = vivas[Math.floor(Math.random() * vivas.length)];
    const iSector = CATEGORIAS.findIndex(c => c.id === cat.id);
    const paso = 360 / CATEGORIAS.length;
    const centro = iSector * paso + paso / 2;
    const jitter = (Math.random() - 0.5) * (paso - 18);
    const destino = ((360 - centro + jitter) % 360 + 360) % 360;

    const reducido = menosMovimiento();
    const actualMod = ((rotacion % 360) + 360) % 360;
    const delta = ((destino - actualMod) % 360 + 360) % 360;
    setRotacion(rotacion + (reducido ? 0 : 5 * 360) + delta);
    setFase('girando');

    timer.current = setTimeout(() => {
      const banco = PREGUNTAS[cat.id];
      const libres = banco.reduce((acc, _, i) => {
        if (!excluir.has(`${cat.id}:${i}`)) acc.push(i);
        return acc;
      }, []);
      const pick = libres.length > 0
        ? libres[Math.floor(Math.random() * libres.length)]
        : Math.floor(Math.random() * banco.length);
      setActual({ catId: cat.id, idx: pick });
      setElegida(null);
      setFase('pregunta');
    }, reducido ? GIRO_MS_REDUCIDO : GIRO_MS);
  };

  const responder = (i) => {
    if (elegida !== null || !actual) return;
    const pregunta = PREGUNTAS[actual.catId][actual.idx];
    const ok = i === pregunta.correcta;
    const nuevaRacha = ok ? racha + 1 : 0;
    const clave = `${actual.catId}:${actual.idx}`;

    setElegida(i);
    setRespondidas(prev => [...prev, { catId: actual.catId, correcta: ok }]);
    setRacha(nuevaRacha);
    if (nuevaRacha > mejorRacha) setMejorRacha(nuevaRacha);

    const nuevas = new Set(vistas).add(clave);
    setVistas(nuevas);
    guardarVistas(nuevas);
    setDePartida(prev => new Set(prev).add(clave));
  };

  const siguiente = () => {
    if (gana) { terminar(true, respondidas.length); return; }
    if (fallo) { terminar(false, respondidas.length); return; }   // muerte súbita
    if (vistas.size >= TOTAL_PREGUNTAS) rebarajar(dePartida);
    setActual(null);
    setElegida(null);
    setFase('ruleta');
  };

  const enJuego = fase === 'ruleta' || fase === 'girando' || fase === 'pregunta';
  const tamRuleta = isMobile ? Math.min(vw - 72, 300) : 340;

  return (
    <main style={{
      minHeight: '100vh', background: 'var(--navy-800)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -140, right: -120, width: 520, height: 520,
        borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(255,183,3,0.16) 0%, transparent 65%)',
      }} />
      <div style={{
        position: 'absolute', bottom: -160, left: -120, width: 460, height: 460,
        borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(106,76,147,0.20) 0%, transparent 65%)',
      }} />

      <div style={{
        position: 'relative', maxWidth: 900, margin: '0 auto',
        padding: isMobile ? '96px 20px 64px' : '116px 32px 96px',
      }}>

        <button onClick={onBack} style={{
          background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)',
          color: '#fff', padding: '8px 14px', borderRadius: 'var(--r-pill)', cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: 44,
          fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-sans)',
        }}>
          <I.ArrowL size={13} /> Volver al inicio
        </button>

        {/* ─────────────────────────────────────────────── PORTADA */}
        {fase === 'inicio' && (
          <div style={{ textAlign: 'center', marginTop: isMobile ? 36 : 52 }}>
            <div className="eyebrow" style={{ color: 'var(--amber-300)', marginBottom: 14 }}>
              Juego · Cultura boliviana
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: isMobile ? 'clamp(34px,9vw,46px)' : 'clamp(48px,6vw,72px)',
              lineHeight: 1, fontWeight: 600, color: '#fff',
              letterSpacing: 'var(--ls-tighter)', margin: 0,
            }}>
              La Ruleta<br />
              <em style={{ fontStyle: 'normal', fontWeight: 800, color: 'var(--amber-300)' }}>
                Boliviana.
              </em>
            </h1>
            <p style={{
              fontSize: isMobile ? 15 : 17, color: 'var(--on-dark-2)',
              maxWidth: 500, margin: '20px auto 0', lineHeight: 1.6,
            }}>
              Gira, cae una categoría y responde. Encadena{' '}
              <strong style={{ color: '#fff' }}>{meta} respuestas correctas seguidas</strong>{' '}
              para ganar. Un solo fallo y la partida termina.
            </p>

            <div style={{ marginTop: 26 }}>
              <div className="eyebrow" style={{ color: 'var(--on-dark-3)', marginBottom: 12 }}>
                Aciertos seguidos para ganar
              </div>
              <div style={{ display: 'inline-flex', gap: 8 }} role="group"
                aria-label="Dificultad: aciertos seguidos para ganar">
                {METAS.map(n => (
                  <button key={n} onClick={() => cambiarMeta(n)}
                    aria-pressed={meta === n}
                    style={{
                      minWidth: 54, minHeight: 44, cursor: 'pointer',
                      borderRadius: 'var(--r-pill)',
                      background: meta === n ? 'var(--amber-500)' : 'rgba(255,255,255,0.07)',
                      border: meta === n ? '1px solid var(--amber-500)' : '1px solid rgba(255,255,255,0.22)',
                      color: meta === n ? 'var(--navy-800)' : 'var(--on-dark-2)',
                      fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700,
                      transition: 'background 160ms var(--ease-out)',
                    }}>{n}</button>
                ))}
              </div>
              <p style={{ fontSize: 12.5, color: 'var(--on-dark-3)', margin: '10px 0 0' }}>
                {meta === 3 ? 'Accesible: buen ritmo para público general.'
                  : meta === 5 ? 'Exigente: hay que saber de Bolivia.'
                  : 'Muy difícil: para quien domina el tema.'}
              </p>
            </div>

            <div style={{ margin: '30px 0 34px' }}>
              <Ruleta categorias={CATEGORIAS} agotadas={new Set()} rotacion={0}
                duracion={0} tam={tamRuleta} />
            </div>

            {marca > 0 && (
              <p style={{
                fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700,
                color: 'var(--amber-300)', margin: '0 0 18px',
              }}>Mejor marca: ganaste en {marca} preguntas</p>
            )}

            <Btn kind="primary" size="lg" onClick={iniciar}>
              Iniciar juego <I.ArrowR size={15} />
            </Btn>
          </div>
        )}

        {/* ─────────────────────────────────────────────── PARTIDA */}
        {enJuego && (
          <>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
              justifyContent: 'space-between', marginTop: 26, marginBottom: isMobile ? 26 : 34,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 'var(--r-lg)', padding: '12px 16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <span style={{
                  fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 700,
                  letterSpacing: 'var(--ls-wider)', textTransform: 'uppercase',
                  color: 'var(--on-dark-3)',
                }}>Racha</span>
                <span style={{ display: 'flex', gap: 6 }}>
                  {Array.from({ length: meta }).map((_, i) => (
                    <span key={i} style={{
                      width: 13, height: 13, borderRadius: 'var(--r-pill)',
                      background: i < racha ? 'var(--amber-400)' : 'rgba(255,255,255,0.14)',
                      border: i < racha ? 'none' : '1px solid rgba(255,255,255,0.22)',
                      transition: 'background 200ms var(--ease-out)',
                    }} />
                  ))}
                </span>
                <span style={{
                  fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 700, color: '#fff',
                }}>{racha} de {meta}</span>
                {respondidas.length > 0 && (
                  <span style={{ fontSize: 12.5, color: 'var(--on-dark-3)', fontWeight: 600 }}>
                    · {aciertos}/{respondidas.length} en total
                  </span>
                )}
              </div>
              <button onClick={() => terminar(false)} style={{
                background: 'transparent', border: '1px solid rgba(255,255,255,0.25)',
                color: 'var(--on-dark-2)', padding: '7px 14px', borderRadius: 'var(--r-pill)',
                cursor: 'pointer', minHeight: 44,
                fontFamily: 'var(--font-sans)', fontSize: 12.5, fontWeight: 700,
              }}>Rendirse</button>
            </div>

            {(fase === 'ruleta' || fase === 'girando') && (
              <div style={{ textAlign: 'center' }}>
                <Ruleta categorias={CATEGORIAS} agotadas={agotadas} rotacion={rotacion}
                  duracion={menosMovimiento() ? GIRO_MS_REDUCIDO : GIRO_MS}
                  tam={tamRuleta} />

                <div style={{ marginTop: 30 }}>
                  <Btn kind="amber" size="lg" onClick={girar} disabled={fase === 'girando'}>
                    {fase === 'girando' ? 'Girando…' : 'Girar la ruleta'}
                  </Btn>
                </div>
              </div>
            )}

            {fase === 'pregunta' && actual && (
              <TarjetaPregunta
                categoria={CATEGORIAS.find(c => c.id === actual.catId)}
                pregunta={PREGUNTAS[actual.catId][actual.idx]}
                elegida={elegida}
                onElegir={responder}
                onSiguiente={siguiente}
                esVictoria={gana}
                esFinal={gana || fallo}
              />
            )}
          </>
        )}

        {/* ─────────────────────────────────────────────── RESULTADOS */}
        {fase === 'fin' && (
          <div style={{ marginTop: isMobile ? 40 : 56 }}>
            <Resultados
              categorias={CATEGORIAS}
              respondidas={respondidas}
              gano={gano}
              meta={meta}
              mejorRacha={mejorRacha}
              marcaPrevia={marcaPrevia}
              onReiniciar={iniciar}
              onSalir={onBack}
            />
          </div>
        )}
      </div>
    </main>
  );
}

export default RuletaJuego;
