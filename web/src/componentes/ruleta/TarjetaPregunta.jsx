import React from 'react';
import I from '../../ui/iconos.jsx';
import Btn from '../../ui/Boton.jsx';

// Colores de cada opción según el estado. Antes de responder todas se ven igual;
// al responder se ilumina la correcta y, si falló, se marca en rojo la elegida.
function estiloOpcion(i, pregunta, elegida) {
  const base = {
    display: 'flex', alignItems: 'center', gap: 12, width: '100%',
    textAlign: 'left', padding: '14px 16px', minHeight: 44,
    borderRadius: 'var(--r-lg)', cursor: elegida === null ? 'pointer' : 'default',
    fontFamily: 'var(--font-sans)', fontSize: 14.5, fontWeight: 600,
    transition: 'background 160ms var(--ease-out), border-color 160ms var(--ease-out)',
  };

  if (elegida === null) {
    return { ...base,
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.16)',
      color: 'var(--on-dark-1)' };
  }
  if (i === pregunta.correcta) {
    return { ...base,
      background: 'rgba(69,154,107,0.22)',
      border: '1px solid var(--green-400)',
      color: '#fff' };
  }
  if (i === elegida) {
    return { ...base,
      background: 'rgba(179,63,46,0.22)',
      border: '1px solid var(--rust-400)',
      color: '#fff' };
  }
  return { ...base,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: 'var(--on-dark-3)' };
}

function TarjetaPregunta({ categoria, pregunta, elegida, onElegir, onSiguiente, esVictoria, esFinal }) {
  const respondida = elegida !== null;
  const acerto = respondida && elegida === pregunta.correcta;

  return (
    <div style={{
      width: '100%', maxWidth: 620, margin: '0 auto',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 'var(--r-xl)',
      padding: 'clamp(20px, 4vw, 28px)',
      animation: 'bi-fadeup 320ms var(--ease-out)',
    }}>

      {/* Categoría en la que cayó la ruleta */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: categoria.color, color: categoria.colorTexto,
        padding: '5px 12px', borderRadius: 'var(--r-pill)',
        fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 700,
        letterSpacing: 'var(--ls-wider)', textTransform: 'uppercase',
        marginBottom: 18,
      }}>{categoria.nombre}</div>

      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(20px, 4.2vw, 27px)',
        lineHeight: 1.25, fontWeight: 600, color: '#fff',
        margin: '0 0 22px', textWrap: 'pretty',
      }}>{pregunta.q}</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {pregunta.opciones.map((op, i) => (
          <button key={i}
            onClick={() => elegida === null && onElegir(i)}
            disabled={respondida}
            style={estiloOpcion(i, pregunta, elegida)}>
            <span style={{
              flexShrink: 0, width: 24, height: 24, borderRadius: 'var(--r-pill)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.12)', fontSize: 12, fontWeight: 700,
            }}>
              {respondida && i === pregunta.correcta ? <I.Check size={13} />
                : respondida && i === elegida ? <I.X size={13} />
                : String.fromCharCode(65 + i)}
            </span>
            <span style={{ flex: 1 }}>{op}</span>
          </button>
        ))}
      </div>

      {respondida && (
        <div style={{ marginTop: 22, animation: 'bi-fadeup 260ms var(--ease-out)' }}>
          <div style={{
            fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700,
            letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase',
            color: acerto ? 'var(--green-300)' : 'var(--rust-300)',
            marginBottom: 8,
          }}>{esVictoria ? '¡Racha completa!' : acerto ? 'Correcto' : 'Incorrecto'}</div>

          <p style={{
            fontSize: 14.5, lineHeight: 1.6, color: 'var(--on-dark-2)',
            margin: 0, borderLeft: '2px solid var(--amber-500)',
            paddingLeft: 14, textWrap: 'pretty',
          }}>{pregunta.dato}</p>

          <Btn kind={esVictoria ? 'amber' : 'primary'} size="md" onClick={onSiguiente}
            style={{ marginTop: 20, width: '100%', justifyContent: 'center' }}>
            {esFinal ? 'Ver tu resultado' : 'Siguiente'} <I.ArrowR size={14} />
          </Btn>
        </div>
      )}
    </div>
  );
}

export default TarjetaPregunta;
