import React, { useMemo, useRef, useState, useEffect } from 'react';
import I from '../ui/iconos.jsx';
import Btn from '../ui/Boton.jsx';
import Ruleta from '../componentes/ruleta/Ruleta.jsx';
import TarjetaPregunta from '../componentes/ruleta/TarjetaPregunta.jsx';
import Resultados from '../componentes/ruleta/Resultados.jsx';
import { CATEGORIAS, PREGUNTAS, TOTAL_PREGUNTAS } from '../data/preguntasRuleta.js';

const CLAVE_RECORD = 'bolivia_insight_ruleta';
const GIRO_MS = 2600;
const GIRO_MS_REDUCIDO = 300;

function leerRecord() {
  try {
    const v = parseInt(localStorage.getItem(CLAVE_RECORD), 10);
    return Number.isFinite(v) && v > 0 ? v : 0;
  } catch { return 0; }
}

function guardarRecord(v) {
  try { localStorage.setItem(CLAVE_RECORD, String(v)); } catch { /* modo privado */ }
}

function menosMovimiento() {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch { return false; }
}

function RuletaJuego({ onBack }) {
  const [fase, setFase] = useState('inicio');   // inicio | ruleta | girando | pregunta | fin
  const [usadas, setUsadas] = useState(() => new Set());
  const [actual, setActual] = useState(null);   // { catId, idx }
  const [elegida, setElegida] = useState(null);
  const [respondidas, setRespondidas] = useState([]);
  const [racha, setRacha] = useState(0);
  const [mejorRacha, setMejorRacha] = useState(0);
  const [rotacion, setRotacion] = useState(0);
  const [record, setRecord] = useState(leerRecord);
  const [recordPrevio, setRecordPrevio] = useState(0);
  const [porAgotamiento, setPorAgotamiento] = useState(false);

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

  // Una categoría se agota cuando ya salieron todas sus preguntas en esta partida.
  const agotadas = useMemo(() => {
    const s = new Set();
    for (const c of CATEGORIAS) {
      const banco = PREGUNTAS[c.id];
      const vistas = banco.reduce((n, _, i) => n + (usadas.has(`${c.id}:${i}`) ? 1 : 0), 0);
      if (vistas >= banco.length) s.add(c.id);
    }
    return s;
  }, [usadas]);

  const aciertos = respondidas.filter(r => r.correcta).length;
  const pct = respondidas.length === 0 ? 0 : Math.round((aciertos / respondidas.length) * 100);
  const quedanPreguntas = usadas.size < TOTAL_PREGUNTAS;

  const iniciar = () => {
    setRecordPrevio(record);
    setUsadas(new Set());
    setRespondidas([]);
    setActual(null);
    setElegida(null);
    setRacha(0);
    setMejorRacha(0);
    setPorAgotamiento(false);
    setFase('ruleta');
  };

  const terminar = (agotado = false) => {
    if (mejorRacha > record) { guardarRecord(mejorRacha); setRecord(mejorRacha); }
    setPorAgotamiento(agotado);
    setFase('fin');
  };

  // La ruleta está dirigida: primero sorteo entre las categorías que aún tienen
  // preguntas y después calculo el ángulo que deja ese gajo bajo el marcador,
  // así nunca se detiene sobre una categoría agotada.
  const girar = () => {
    const vivas = CATEGORIAS.filter(c => !agotadas.has(c.id));
    if (vivas.length === 0) { terminar(true); return; }

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
        if (!usadas.has(`${cat.id}:${i}`)) acc.push(i);
        return acc;
      }, []);
      setActual({ catId: cat.id, idx: libres[Math.floor(Math.random() * libres.length)] });
      setElegida(null);
      setFase('pregunta');
    }, reducido ? GIRO_MS_REDUCIDO : GIRO_MS);
  };

  const responder = (i) => {
    if (elegida !== null || !actual) return;
    const pregunta = PREGUNTAS[actual.catId][actual.idx];
    const ok = i === pregunta.correcta;
    const nuevaRacha = ok ? racha + 1 : 0;

    setElegida(i);
    setRespondidas(prev => [...prev, { catId: actual.catId, correcta: ok }]);
    setUsadas(prev => new Set(prev).add(`${actual.catId}:${actual.idx}`));
    setRacha(nuevaRacha);
    if (nuevaRacha > mejorRacha) setMejorRacha(nuevaRacha);
  };

  const siguiente = () => {
    if (usadas.size >= TOTAL_PREGUNTAS) { terminar(true); return; }
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
      {/* Resplandores del mismo lenguaje visual que el planificador */}
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
              maxWidth: 480, margin: '20px auto 0', lineHeight: 1.6,
            }}>
              Gira, cae una categoría y responde. {TOTAL_PREGUNTAS} preguntas sobre
              historia, geografía, comida, fiestas, naturaleza y lenguas de Bolivia.
              Ninguna se repite.
            </p>

            <div style={{ margin: '30px 0 34px' }}>
              <Ruleta categorias={CATEGORIAS} agotadas={new Set()} rotacion={0}
                girando={false} duracion={0} tam={tamRuleta} />
            </div>

            {record > 0 && (
              <p style={{
                fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700,
                color: 'var(--amber-300)', margin: '0 0 18px',
              }}>Tu mejor racha: {record}</p>
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
              display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
              justifyContent: 'space-between', marginTop: 26, marginBottom: isMobile ? 26 : 34,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 'var(--r-lg)', padding: '12px 16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                <span style={{
                  fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 700, color: '#fff',
                }}>
                  {aciertos} de {respondidas.length}
                  {respondidas.length > 0 && (
                    <span style={{ color: 'var(--on-dark-3)', fontWeight: 600 }}> · {pct}%</span>
                  )}
                </span>
                {racha > 1 && (
                  <span style={{
                    fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700,
                    color: 'var(--amber-300)',
                  }}>{racha} seguidas</span>
                )}
              </div>
              <button onClick={() => terminar(false)} style={{
                background: 'transparent', border: '1px solid rgba(255,255,255,0.25)',
                color: 'var(--on-dark-2)', padding: '7px 14px', borderRadius: 'var(--r-pill)',
                cursor: 'pointer', minHeight: 44,
                fontFamily: 'var(--font-sans)', fontSize: 12.5, fontWeight: 700,
              }}>Terminar</button>
            </div>

            {(fase === 'ruleta' || fase === 'girando') && (
              <div style={{ textAlign: 'center' }}>
                <Ruleta categorias={CATEGORIAS} agotadas={agotadas} rotacion={rotacion}
                  girando={fase === 'girando'}
                  duracion={menosMovimiento() ? GIRO_MS_REDUCIDO : GIRO_MS}
                  tam={tamRuleta} />

                <div style={{ marginTop: 30 }}>
                  <Btn kind="amber" size="lg" onClick={girar} disabled={fase === 'girando'}>
                    {fase === 'girando' ? 'Girando…' : 'Girar la ruleta'}
                  </Btn>
                </div>

                {agotadas.size > 0 && (
                  <p style={{ fontSize: 12.5, color: 'var(--on-dark-3)', marginTop: 16 }}>
                    {agotadas.size === 1
                      ? 'Una categoría ya se quedó sin preguntas.'
                      : `${agotadas.size} categorías ya se quedaron sin preguntas.`}
                  </p>
                )}
              </div>
            )}

            {fase === 'pregunta' && actual && (
              <TarjetaPregunta
                categoria={CATEGORIAS.find(c => c.id === actual.catId)}
                pregunta={PREGUNTAS[actual.catId][actual.idx]}
                elegida={elegida}
                onElegir={responder}
                onSiguiente={siguiente}
                quedanPreguntas={quedanPreguntas}
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
              mejorRacha={mejorRacha}
              recordPrevio={recordPrevio}
              onReiniciar={iniciar}
              onSalir={onBack}
              porAgotamiento={porAgotamiento}
            />
          </div>
        )}
      </div>
    </main>
  );
}

export default RuletaJuego;
