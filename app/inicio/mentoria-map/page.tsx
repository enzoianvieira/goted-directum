import { ArrowRight, Compass, Flag, Map } from "lucide-react";
import { PanelHead } from "@/components/ui/PanelHead";

export default function MentoriaMapPage() {
  return (
    <div className="page-stack">
      <div className="hero">
        <div className="eyebrow">Mentoria MAP</div>
        <h1>Mapear · Alinhar · Prosperar</h1>
        <p>
          A jornada da Mentoria MAP começa por mapear onde a sua empresa está
          hoje, segue alinhando a empresa e os cinco pilares à direção
          desejada, e se transforma em evolução sustentável através do Método
          GOTED. Let&apos;s GOTED.
        </p>
      </div>

      <section className="panel">
        <PanelHead title="O que é o MAP" />
        <div className="panel-body card-grid">
          <div className="info-card">
            <span className="info-card-number">MAPEAR</span>
            <h3>Entenda onde sua empresa está</h3>
            <p>
              Um diagnóstico honesto do cenário atual do negócio — maturidade,
              gargalos e oportunidades — olhando para os cinco pilares do
              Método GOTED.
            </p>
          </div>
          <div className="info-card">
            <span className="info-card-number">ALINHAR</span>
            <h3>Alinhe a empresa à direção desejada</h3>
            <p>
              A partir da Origem, o empresário constrói o Destino e alinha os
              cinco pilares aos objetivos e resultados-chave da empresa.
            </p>
          </div>
          <div className="info-card">
            <span className="info-card-number">PROSPERAR</span>
            <h3>Construa uma evolução sustentável</h3>
            <p>
              A Rota GOTED transforma esse alinhamento em melhores resultados,
              organização e autonomia para o negócio.
            </p>
          </div>
        </div>
      </section>

      <section className="panel">
        <PanelHead title="A jornada estratégica" action="Origem → Destino → Rota GOTED" />
        <div className="panel-body">
          <div className="journey-row">
            <div className="journey-step">
              <Compass size={20} color="#176B78" style={{ marginBottom: 6 }} />
              <strong>Origem</strong>
              <span>Onde a empresa está hoje</span>
            </div>
            <ArrowRight className="journey-arrow" size={20} />
            <div className="journey-step">
              <Flag size={20} color="#176B78" style={{ marginBottom: 6 }} />
              <strong>Destino</strong>
              <span>Onde a empresa quer chegar</span>
            </div>
            <ArrowRight className="journey-arrow" size={20} />
            <div className="journey-step">
              <Map size={20} color="#176B78" style={{ marginBottom: 6 }} />
              <strong>Rota GOTED</strong>
              <span>Como sairemos de um para o outro</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
