// Medidor em semicírculo (conta-giros / velocímetro), ecoando o ponteiro do
// símbolo GOTED. Uso: indicadores de 0 a 100 (ex: resultado do Scanner,
// progresso da jornada).

const CX = 100;
const CY = 100;
const R = 80;
const TRACK_WIDTH = 14;

function pointOn(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CX + radius * Math.cos(rad), y: CY - radius * Math.sin(rad) };
}

// 0% -> 180° (esquerda) · 50% -> 90° (topo) · 100% -> 0° (direita)
function angleFor(pct: number) {
  return 180 - (pct / 100) * 180;
}

function arcPath(pct: number, radius: number) {
  const start = pointOn(180, radius);
  const end = pointOn(angleFor(pct), radius);
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 0 1 ${end.x} ${end.y}`;
}

export function Gauge({
  value,
  max = 100,
  size = 200,
}: {
  value: number;
  max?: number;
  size?: number;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const needleAngle = angleFor(pct);
  const needleTip = pointOn(needleAngle, R - 18);

  return (
    <svg viewBox="0 0 200 112" width={size} style={{ maxWidth: "100%" }}>
      <path
        d={arcPath(100, R)}
        fill="none"
        stroke="rgba(var(--overlay-rgb), 0.12)"
        strokeWidth={TRACK_WIDTH}
        strokeLinecap="round"
      />
      <path
        d={arcPath(pct, R)}
        fill="none"
        stroke="var(--color-petroleo)"
        strokeWidth={TRACK_WIDTH}
        strokeLinecap="round"
      />
      <circle cx={CX} cy={CY} r={6} fill="var(--text-main)" />
      <line
        x1={CX}
        y1={CY}
        x2={needleTip.x}
        y2={needleTip.y}
        stroke="var(--text-main)"
        strokeWidth={3}
        strokeLinecap="round"
      />
    </svg>
  );
}
