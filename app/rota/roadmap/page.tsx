import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { PanelHead } from "@/components/ui/PanelHead";
import { ROADMAP_MOCK } from "@/lib/mock-data";
import { getPilar } from "@/lib/pilares";

const STATUS_LABEL: Record<string, { label: string; tone: "green" | "teal" | "muted" }> = {
  concluido: { label: "Concluído", tone: "green" },
  em_andamento: { label: "Em andamento", tone: "teal" },
  planejado: { label: "Planejado", tone: "muted" },
};

export default function RoadmapPage() {
  return (
    <div className="page-stack">
      <section className="panel">
        <PanelHead
          title="Roadmap GOTED"
          action="Prioridade calculada por Origem + Destino (em breve)"
        />
        <div className="panel-body">
          <p style={{ fontSize: 13, color: "var(--text-sub)", lineHeight: 1.6 }}>
            A ordem abaixo mostra, de forma fictícia, como a Rota GOTED poderá
            priorizar os pilares para esta empresa. No futuro, essa priorização
            nascerá do cruzamento entre a Origem (situação atual) e o Destino
            (objetivos desejados).
          </p>
        </div>
      </section>

      <section className="panel">
        <PanelHead title="Ordem sugerida dos pilares" />
        <div className="panel-body" style={{ display: "grid", gap: 10 }}>
          {ROADMAP_MOCK.map((item) => {
            const pilar = getPilar(item.pilar);
            const status = STATUS_LABEL[item.status];
            return (
              <Link
                key={item.ordem}
                href={`/rota/${item.pilar}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 16px",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: 10,
                  background: "var(--bg-surface)",
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: "var(--color-petroleo-soft)",
                    color: "var(--color-petroleo)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {item.ordem}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-main)" }}>
                    {pilar?.nome}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-sub)" }}>{item.justificativa}</div>
                </div>
                <Badge tone={status.tone}>{status.label}</Badge>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
