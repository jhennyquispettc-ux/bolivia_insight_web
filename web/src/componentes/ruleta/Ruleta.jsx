import React from 'react';

const R = 150;
const CX = 160;
const CY = 160;

// Geometría de un gajo. El sector 0 arranca arriba (12 en punto) y crecen en
// sentido horario, que es como gira la rueda y como apunta el marcador.
function pathSector(i, total) {
  const paso = 360 / total;
  const a0 = ((-90 + i * paso) * Math.PI) / 180;
  const a1 = ((-90 + (i + 1) * paso) * Math.PI) / 180;
  const x0 = CX + R * Math.cos(a0), y0 = CY + R * Math.sin(a0);
  const x1 = CX + R * Math.cos(a1), y1 = CY + R * Math.sin(a1);
  const arcoLargo = paso > 180 ? 1 : 0;
  return `M ${CX} ${CY} L ${x0} ${y0} A ${R} ${R} 0 ${arcoLargo} 1 ${x1} ${y1} Z`;
}

function posEtiqueta(i, total) {
  const paso = 360 / total;
  const medio = -90 + i * paso + paso / 2;
  const rad = (medio * Math.PI) / 180;
  return {
    x: CX + 0.63 * R * Math.cos(rad),
    y: CY + 0.63 * R * Math.sin(rad),
    giro: medio,
  };
}

function Ruleta({ categorias, agotadas, rotacion, duracion, tam = 320 }) {
  const total = categorias.length;

  return (
    <div style={{ position: 'relative', width: tam, height: tam, margin: '0 auto' }}>

      {/* Marcador fijo en las 12 en punto */}
      <div style={{
        position: 'absolute', top: -2, left: '50%', transform: 'translateX(-50%)',
        width: 0, height: 0, zIndex: 3,
        borderLeft: '13px solid transparent',
        borderRight: '13px solid transparent',
        borderTop: '26px solid var(--amber-400)',
        filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.45))',
      }} />

      <svg viewBox="0 0 320 320" width={tam} height={tam} role="img"
        aria-label="Ruleta de categorías">

        {/* Aro exterior */}
        <circle cx={CX} cy={CY} r={R + 7} fill="rgba(255,255,255,0.07)" />
        <circle cx={CX} cy={CY} r={R + 7} fill="none"
          stroke="rgba(255,255,255,0.22)" strokeWidth="2" />

        <g style={{
          transform: `rotate(${rotacion}deg)`,
          transformOrigin: `${CX}px ${CY}px`,
          // La transición queda siempre declarada a propósito. Si se activara en
          // el mismo commit en que cambia el transform, varios navegadores saltan
          // al ángulo final sin animar y el giro no se llega a ver. Al montar el
          // grupo no hay valor previo, así que tampoco anima de más.
          transition: `transform ${duracion}ms cubic-bezier(.15,.9,.2,1)`,
        }}>
          {categorias.map((c, i) => {
            const vacia = agotadas.has(c.id);
            const et = posEtiqueta(i, total);
            return (
              <g key={c.id}>
                <path d={pathSector(i, total)}
                  fill={vacia ? 'rgba(255,255,255,0.06)' : c.color}
                  stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" />
                <text x={et.x} y={et.y}
                  transform={`rotate(${et.giro} ${et.x} ${et.y})`}
                  textAnchor="middle" dominantBaseline="middle"
                  style={{
                    fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700,
                    letterSpacing: '0.01em', pointerEvents: 'none',
                    fill: vacia ? 'rgba(255,255,255,0.28)' : c.colorTexto,
                  }}>
                  {c.corto}
                </text>
              </g>
            );
          })}
        </g>

        {/* Cubo central */}
        <circle cx={CX} cy={CY} r="30" fill="var(--navy-800)"
          stroke="var(--amber-400)" strokeWidth="2.5" />
        <text x={CX} y={CY} textAnchor="middle" dominantBaseline="middle"
          style={{
            fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600,
            fill: 'var(--amber-300)', pointerEvents: 'none',
          }}>BO</text>
      </svg>
    </div>
  );
}

export default Ruleta;
