import React from 'react';
import I from '../../ui/iconos.jsx';
import Btn from '../../ui/Boton.jsx';

function veredicto(pct, total) {
  if (total === 0) return 'No llegaste a responder ninguna pregunta.';
  if (pct >= 90) return 'Conoces Bolivia como muy pocos.';
  if (pct >= 70) return 'Dominio serio de la cultura boliviana.';
  if (pct >= 50) return 'Buena base, todavía hay terreno por recorrer.';
  if (pct >= 30) return 'Queda mucha Bolivia por descubrir.';
  return 'Bolivia entera te está esperando.';
}

function Resultados({ categorias, respondidas, mejorRacha, recordPrevio, onReiniciar, onSalir, porAgotamiento }) {
  const total = respondidas.length;
  const aciertos = respondidas.filter(r => r.correcta).length;
  const pct = total === 0 ? 0 : Math.round((aciertos / total) * 100);
  const nuevoRecord = mejorRacha > recordPrevio && mejorRacha > 0;

  const desglose = categorias
    .map(c => {
      const suyas = respondidas.filter(r => r.catId === c.id);
      return { cat: c, total: suyas.length, aciertos: suyas.filter(r => r.correcta).length };
    })
    .filter(d => d.total > 0);

  return (
    <div style={{
      width: '100%', maxWidth: 560, margin: '0 auto', textAlign: 'center',
      animation: 'bi-fadeup 340ms var(--ease-out)',
    }}>

      {porAgotamiento && (
        <div className="eyebrow" style={{ color: 'var(--amber-300)', marginBottom: 14 }}>
          Recorriste todas las preguntas
        </div>
      )}

      <div style={{
        fontFamily: 'var(--font-display)', fontSize: 'clamp(56px, 14vw, 88px)',
        fontWeight: 600, lineHeight: 1, color: 'var(--amber-300)',
        letterSpacing: 'var(--ls-tighter)',
      }}>{pct}%</div>

      <p style={{
        fontSize: 'clamp(16px, 3.4vw, 19px)', color: '#fff',
        margin: '14px 0 6px', fontWeight: 600,
      }}>{veredicto(pct, total)}</p>

      <p style={{ fontSize: 14, color: 'var(--on-dark-3)', margin: 0 }}>
        {aciertos} de {total} correctas · mejor racha {mejorRacha}
      </p>

      {nuevoRecord && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 7, marginTop: 16,
          background: 'rgba(255,183,3,0.14)', border: '1px solid var(--amber-500)',
          color: 'var(--amber-300)', padding: '7px 14px', borderRadius: 'var(--r-pill)',
          fontFamily: 'var(--font-sans)', fontSize: 12.5, fontWeight: 700,
        }}>
          <I.Star size={13} /> Nueva mejor racha
        </div>
      )}

      {desglose.length > 0 && (
        <div style={{
          marginTop: 34, textAlign: 'left',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 'var(--r-xl)', padding: '18px 20px',
        }}>
          <div className="eyebrow" style={{ color: 'var(--on-dark-3)', marginBottom: 14 }}>
            Por categoría
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {desglose.map(d => (
              <div key={d.cat.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{
                  flexShrink: 0, width: 10, height: 10, borderRadius: 'var(--r-pill)',
                  background: d.cat.color,
                }} />
                <span style={{
                  flex: 1, fontFamily: 'var(--font-sans)', fontSize: 13.5,
                  fontWeight: 600, color: 'var(--on-dark-2)',
                }}>{d.cat.nombre}</span>
                <span style={{ display: 'flex', gap: 4 }}>
                  {Array.from({ length: d.total }).map((_, i) => (
                    <span key={i} style={{
                      width: 7, height: 7, borderRadius: 'var(--r-pill)',
                      background: i < d.aciertos ? 'var(--green-400)' : 'rgba(255,255,255,0.18)',
                    }} />
                  ))}
                </span>
                <span style={{
                  flexShrink: 0, minWidth: 38, textAlign: 'right',
                  fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--on-dark-3)',
                }}>{d.aciertos}/{d.total}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, marginTop: 30, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Btn kind="primary" size="lg" onClick={onReiniciar}>
          Jugar otra vez <I.ArrowR size={14} />
        </Btn>
        <Btn kind="glass" size="lg" onClick={onSalir}>Volver al inicio</Btn>
      </div>
    </div>
  );
}

export default Resultados;
