import { Badge } from "@/components/ui/Badge";
import { Metric } from "@/components/ui/Metric";
import { PanelHead } from "@/components/ui/PanelHead";
import { Progress } from "@/components/ui/Progress";
import { JORNADA_PROGRESSO, ROADMAP_MOCK } from "@/lib/mock-data";
import { getPilar } from "@/lib/pilares";

const STATUS_LABEL: Record<string, { label: string; tone: "green" | "teal" | "muted" }> = {
  concluido: { label: "Concluído", tone: "green" },
  em_andamento: { label: "Em andamento", tone: "teal" },
  planejado: { label: "Planejado", tone: "muted" },
};

export default function PainelRotaPage() {
  const pilarAtual = getPilar(JORNADA_PROGRESSO.pilarAtual);

  return (
    <div className="page-stack">
      <div className="metric-grid">
        <Metric label="Progresso da jornada" value={`${JORNADA_PROGRESSO.progressoGeral}%`} accent />
        <Metric label="Pilar atual" value={pilarAtual?.nome ?? "—"} />
        <Metric label="Pilares no roadmap" value={String(ROADMAP_MOCK.length)} />
        <Metric label="Próximos passos" value={String(JORNADA_PROGRESSO.proximosPassos.length)} />
      </div>

      <section className="panel">
        <PanelHead title="Progresso geral da jornada" />
        <div className="panel-body">
          <Progress label="Rota GOTED" value={JORNADA_PROGRESSO.progressoGeral} />
        </div>
      </section>

      <section className="panel">
        <PanelHead title="Ordem de prioridade dos pilares" action="Dados fictícios" />
        <div className="panel-body" style={{ display: "grid", gap: 10 }}>
          {ROADMAP_MOCK.map((item) => {
            const pilar = getPilar(item.pilar);
            const status = STATUS_LABEL[item.status];
            return (
              <div
                key={item.ordem}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "12px 14px",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: 10,
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: "var(--color-petroleo-soft)",
                    color: "var(--color-petroleo)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {item.ordem}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-main)" }}>
                    {pilar?.nome}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-sub)" }}>{item.justificativa}</div>
                </div>
                <Badge tone={status.tone}>{status.label}</Badge>
              </div>
            );
          })}
        </div>
      </section>

      <section className="panel">
        <PanelHead title="Próximos passos" />
        <div className="panel-body" style={{ display: "grid", gap: 8 }}>
          {JORNADA_PROGRESSO.proximosPassos.map((passo, i) => (
            <div key={i} style={{ fontSize: 13, color: "var(--text-sub)" }}>
              • {passo}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
