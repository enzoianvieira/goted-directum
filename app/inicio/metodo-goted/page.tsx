import { Fragment } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PanelHead } from "@/components/ui/PanelHead";
import { PILARES } from "@/lib/pilares";

const GPS_ETAPAS = [
  {
    letra: "G",
    nome: "Guia",
    descricao: "Entenda o que precisa ser feito e por quê.",
  },
  {
    letra: "P",
    nome: "Projeto",
    descricao: "Construa a solução para a realidade da sua empresa.",
  },
  {
    letra: "S",
    nome: "Solução",
    descricao: "Tenha o resultado pronto para colocar em prática.",
  },
];

export default function MetodoGotedPage() {
  return (
    <div className="page-stack">
      <div className="hero">
        <div className="eyebrow">Método GOTED</div>
        <h1>Cinco pilares para dar direção ao negócio</h1>
        <p>
          O Método GOTED organiza a transformação da empresa em cinco pilares.
          Eles têm uma ordem lógica dentro do método, mas cada empresa ataca os
          pilares na ordem que faz sentido para a sua Origem e o seu Destino —
          essa priorização é o que chamamos de Rota GOTED.
        </p>
      </div>

      <section className="panel">
        <PanelHead title="Os 5 pilares" />
        <div className="panel-body card-grid">
          {PILARES.map((pilar) => (
            <div key={pilar.slug} className="info-card">
              <span className="info-card-number">
                {String(pilar.numero).padStart(2, "0")}
              </span>
              <h3>{pilar.nome}</h3>
              <p>{pilar.resumo}</p>
              <Link
                href={`/rota/${pilar.slug}`}
                style={{ fontSize: 12, fontWeight: 600, color: "#176B78" }}
              >
                Ver página do pilar →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <PanelHead title="A ordem não é fixa para todos" />
        <div className="panel-body">
          <p style={{ fontSize: 13, color: "var(--text-sub)", lineHeight: 1.7 }}>
            A prioridade de intervenção em cada pilar depende do cruzamento entre a{" "}
            <strong>Origem</strong> (situação atual da empresa) e o <strong>Destino</strong>{" "}
            (objetivos e resultados desejados). Esse cruzamento é o que, no futuro,
            vai construir a Rota GOTED personalizada de cada cliente — hoje
            demonstrada em <Link href="/rota/roadmap" style={{ color: "#176B78", fontWeight: 600 }}>Rota GOTED → Roadmap</Link>.
          </p>
        </div>
      </section>

      <section className="panel">
        <PanelHead title="Método GPS" action="Guia → Projeto → Solução" />
        <div className="panel-body">
          <p style={{ fontSize: 13, color: "var(--text-sub)", lineHeight: 1.6 }}>
            Da orientação à execução. O GPS é a lógica prática usada dentro da
            plataforma para transformar o conteúdo de cada pilar em algo
            aplicado na sua empresa.
          </p>

          <div className="journey-row" style={{ marginTop: 20 }}>
            {GPS_ETAPAS.map((etapa, i) => (
              <Fragment key={etapa.letra}>
                <div className="journey-step">
                  <span className="journey-step-letter">{etapa.letra}</span>
                  <strong>{etapa.nome}</strong>
                  <span>{etapa.descricao}</span>
                </div>
                {i < GPS_ETAPAS.length - 1 && (
                  <ArrowRight className="journey-arrow" size={20} />
                )}
              </Fragment>
            ))}
          </div>

          <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6, marginTop: 20 }}>
            O GPS não substitui os métodos estratégicos da GOTED — ele é a
            forma transversal como você transforma o método, o pilar ou a
            etapa em um entregável aplicado na empresa: Guia (entender),
            Projeto (construir) e Solução (aplicar).
          </p>
        </div>
      </section>
    </div>
  );
}
