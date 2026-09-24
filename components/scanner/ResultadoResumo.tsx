import { PanelHead } from "@/components/ui/PanelHead";
import { MarchaBadge } from "./MarchaBadge";
import { classificarMarcha } from "@/lib/scanner/marcha";
import type { ResultadoScanner } from "@/lib/scanner/resultado";

export function ResultadoResumo({
  resultado,
  mostrarSubpilares = false,
}: {
  resultado: ResultadoScanner;
  mostrarSubpilares?: boolean;
}) {
  const geral = classificarMarcha(resultado.geral);

  return (
    <section className="panel">
      <PanelHead title="Resultado" action="Dados fictícios — apenas demonstração" />
      <div className="panel-body" style={{ display: "grid", gap: 20 }}>
        <div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>
            Resultado geral
          </div>
          {geral ? (
            <p style={{ fontSize: 15, color: "var(--text-main)" }}>
              Sua empresa está atualmente na <strong>{geral.label}</strong> — {geral.nome.toLowerCase()}.
            </p>
          ) : (
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
              Responda ao menos uma pergunta para ver o resultado.
            </p>
          )}
        </div>

        <div style={{ display: "grid", gap: 14 }}>
          {resultado.pilares.map((pilar) => (
            <div key={pilar.pilarId}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  marginBottom: mostrarSubpilares && pilar.subpilares.length > 0 ? 8 : 0,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main)" }}>
                  {pilar.nome}
                </span>
                <MarchaBadge valor={pilar.valor} tamanho="sm" />
              </div>
              {mostrarSubpilares && pilar.subpilares.length > 0 && (
                <div style={{ display: "grid", gap: 6, paddingLeft: 12 }}>
                  {pilar.subpilares.map((sub) => (
                    <div
                      key={sub.subpilarId}
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}
                    >
                      <span style={{ fontSize: 12, color: "var(--text-sub)" }}>{sub.subpilarNome}</span>
                      <MarchaBadge valor={sub.valor} tamanho="sm" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
