import { Metric } from "@/components/ui/Metric";
import { PanelHead } from "@/components/ui/PanelHead";
import { Progress } from "@/components/ui/Progress";
import { EmptyState } from "@/components/ui/EmptyState";
import { fetchHorizontes, fetchObjetivosComKrs } from "@/lib/db/queries";
import { CURRENT_ORGANIZATION } from "@/lib/tenant";
import type { KeyResult } from "@/lib/types";

// Lê dados ao vivo do PostgreSQL a cada request — nunca deve virar página estática.
export const dynamic = "force-dynamic";

// Indicador pode ser "quanto maior, melhor" (ex: margem) ou "quanto menor,
// melhor" (ex: inadimplência) — o progresso olha para a direção certa.
function progressoKr(kr: KeyResult): number {
  if (kr.valorDesejado === kr.valorAtual) return 100;
  const menorEhMelhor = kr.valorDesejado < kr.valorAtual;
  return menorEhMelhor
    ? Math.min(100, Math.round((kr.valorDesejado / kr.valorAtual) * 100))
    : Math.min(100, Math.round((kr.valorAtual / kr.valorDesejado) * 100));
}

export default async function PainelDestinoPage() {
  const [horizontes, objetivos] = await Promise.all([
    fetchHorizontes(CURRENT_ORGANIZATION.id),
    fetchObjetivosComKrs(CURRENT_ORGANIZATION.id),
  ]);

  const horizonte5anos = horizontes.find((h) => h.ano === 5);
  const todosKrs = objetivos.flatMap((o) => o.krs);
  const progressoMedio = todosKrs.length
    ? Math.round(todosKrs.reduce((acc, kr) => acc + progressoKr(kr), 0) / todosKrs.length)
    : 0;

  return (
    <div className="page-stack">
      <div className="metric-grid">
        <Metric label="Horizonte" value="5 anos" sub="Definido pelo empresário" accent />
        <Metric label="Objetivos ativos" value={String(objetivos.length)} />
        <Metric label="Resultados-chave" value={String(todosKrs.length)} />
        <Metric label="Progresso médio dos KRs" value={`${progressoMedio}%`} />
      </div>

      <section className="panel">
        <PanelHead title="Horizonte desejado" action="5 anos" />
        <div className="panel-body">
          {horizonte5anos?.descricao ? (
            <p style={{ fontSize: 13, color: "var(--text-sub)", lineHeight: 1.7 }}>
              {horizonte5anos.descricao}
            </p>
          ) : (
            <EmptyState>Horizonte de 5 anos ainda não definido.</EmptyState>
          )}
        </div>
      </section>

      <section className="panel">
        <PanelHead title="Progresso dos objetivos e KRs" />
        <div className="panel-body">
          {objetivos.length === 0 && <EmptyState>Nenhum objetivo cadastrado ainda.</EmptyState>}
          {objetivos.map((obj) => (
            <div key={obj.id} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main)", marginBottom: 10 }}>
                {obj.titulo}
              </div>
              {obj.krs.map((kr) => (
                <Progress key={kr.id} label={kr.nome} value={progressoKr(kr)} />
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
