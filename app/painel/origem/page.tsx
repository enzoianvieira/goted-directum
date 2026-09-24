import { Gauge } from "@/components/ui/Gauge";
import { PanelHead } from "@/components/ui/PanelHead";
import { EmptyState } from "@/components/ui/EmptyState";
import { fetchUltimoResultadoAutoScanner } from "@/lib/supabase/queries";
import { CURRENT_ORGANIZATION } from "@/lib/tenant";
import { getPilar } from "@/lib/pilares";

// Lê dados ao vivo do Supabase a cada request — nunca deve virar página estática.
export const dynamic = "force-dynamic";

export default async function PainelOrigemPage() {
  const resultado = await fetchUltimoResultadoAutoScanner(CURRENT_ORGANIZATION.id);

  if (!resultado) {
    return (
      <div className="page-stack">
        <section className="panel">
          <PanelHead title="Resultado geral do Scanner" />
          <div className="panel-body">
            <EmptyState>
              Nenhum resultado de Auto Scanner ainda. Responda o questionário em
              Origem → Auto Scanner para ver os dados aqui.
            </EmptyState>
          </div>
        </section>
      </div>
    );
  }

  const { pontuacaoGeral, scoresPorPilar, pontosDeAtencao } = resultado;
  const pilarForte = getPilar(
    scoresPorPilar.reduce((a, b) => (a.pontuacao > b.pontuacao ? a : b)).pilar
  );
  const pilarCritico = getPilar(
    scoresPorPilar.reduce((a, b) => (a.pontuacao < b.pontuacao ? a : b)).pilar
  );

  return (
    <div className="page-stack">
      <div className="gauge-layout">
        <section className="panel">
          <PanelHead title="Resultado geral do Scanner" />
          <div className="panel-body gauge-panel-body">
            <Gauge value={pontuacaoGeral} />
            <div className="gauge-value">
              <strong>{pontuacaoGeral}</strong>
              <span>de 100</span>
            </div>
          </div>
        </section>

        <section className="panel">
          <PanelHead title="Destaques da Origem" action="Auto Scanner" />
          <div className="info-list">
            <div className="info-row">
              <span className="info-row-label">Pilar mais forte</span>
              <span className="info-row-value accent">{pilarForte?.nome ?? "—"}</span>
            </div>
            <div className="info-row">
              <span className="info-row-label">Pilar mais crítico</span>
              <span className="info-row-value">{pilarCritico?.nome ?? "—"}</span>
            </div>
            <div className="info-row">
              <span className="info-row-label">Pilares avaliados</span>
              <span className="info-row-value">{scoresPorPilar.length} de 5</span>
            </div>
            <div className="info-row">
              <span className="info-row-label">Pontos de atenção</span>
              <span className="info-row-value">{pontosDeAtencao.length}</span>
            </div>
          </div>
        </section>
      </div>

      <section className="panel">
        <PanelHead title="Resultado por pilar" action="Auto Scanner" />
        <div className="panel-body">
          {scoresPorPilar.map((s) => {
            const pilar = getPilar(s.pilar);
            return (
              <div key={s.pilar} className="dist-row">
                <span>{pilar?.nome}</span>
                <div className="dist-bar">
                  <div className="dist-bar-fill" style={{ width: `${s.pontuacao}%` }} />
                </div>
                <span className="dist-count">{s.pontuacao}</span>
              </div>
            );
          })}
        </div>
      </section>

      {pontosDeAtencao.length > 0 && (
        <section className="panel">
          <PanelHead title="Principais pontos de atenção" />
          <div className="panel-body" style={{ display: "grid", gap: 10 }}>
            {pontosDeAtencao.map((ponto, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  color: "var(--text-sub)",
                  padding: "10px 14px",
                  background: "rgba(173, 138, 74, 0.06)",
                  border: "1px solid rgba(173, 138, 74, 0.2)",
                  borderRadius: 8,
                }}
              >
                {ponto}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
