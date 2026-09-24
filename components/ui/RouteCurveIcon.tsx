// Ícone customizado para "Rota GOTED": dois pontos ligados por uma única
// curva suave — sem parecer nenhum ícone de mapa/bandeira/letra já usado nos
// outros módulos.
export function RouteCurveIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 19 C 12 19, 12 6, 22 6" />
      <circle cx="2" cy="19" r="2" fill="currentColor" stroke="none" />
      <circle cx="22" cy="6" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}
