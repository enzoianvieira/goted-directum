import { classificarMarcha } from "@/lib/scanner/marcha";

// Mostra o resultado de um pilar/subpilar/geral na régua de marchas — nunca
// como nota isolada. Ex: "3ª marcha — Estruturada".
export function MarchaBadge({ valor, tamanho = "md" }: { valor: number | null; tamanho?: "sm" | "md" }) {
  const marcha = classificarMarcha(valor);

  if (!marcha) {
    return <span className="marcha-badge marcha-badge-na">Não aplicável</span>;
  }

  return (
    <span className={`marcha-badge marcha-badge-${marcha.numero} ${tamanho === "sm" ? "marcha-badge-sm" : ""}`}>
      <strong>{marcha.label}</strong>
      <span>{marcha.nome}</span>
    </span>
  );
}
