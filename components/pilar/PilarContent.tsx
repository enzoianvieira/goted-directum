"use client";

import { useState } from "react";
import { Tabs } from "@/components/ui/Tabs";
import { Badge } from "@/components/ui/Badge";
import { GPS_CONTENT } from "@/lib/gps-content";
import type { Pilar } from "@/lib/types";

// Lógica GPS: Guia (entender) → Projeto (construir) → Solução (aplicar).
// É a forma transversal como o conteúdo de cada pilar vira algo aplicado na
// empresa — ver Início → Método GOTED para o conceito completo.
const GPS_TABS = [
  { key: "guia", letra: "G", label: "Guia", microcopy: "Entenda o que precisa ser feito e por quê." },
  { key: "projeto", letra: "P", label: "Projeto", microcopy: "Construa a solução para a realidade da sua empresa." },
  { key: "solucao", letra: "S", label: "Solução", microcopy: "Tenha o resultado pronto para colocar em prática." },
] as const;

export function PilarContent({ pilar }: { pilar: Pilar }) {
  const [tab, setTab] = useState<(typeof GPS_TABS)[number]["key"]>("guia");
  const etapa = GPS_TABS.find((t) => t.key === tab) ?? GPS_TABS[0];
  const conteudo = GPS_CONTENT[pilar.slug];

  return (
    <div className="page-stack">
      <div className="hero">
        <div className="eyebrow">Pilar {String(pilar.numero).padStart(2, "0")}</div>
        <h1>{pilar.nome}</h1>
        <p>{pilar.resumo}</p>
      </div>

      <section className="panel">
        <Tabs
          tabs={GPS_TABS.map((t) => ({ key: t.key, label: t.label }))}
          active={tab}
          onChange={(key) => setTab(key as (typeof GPS_TABS)[number]["key"])}
        />
        <div className="panel-body">
          <div className="gps-tab-head">
            <span className="journey-step-letter">{etapa.letra}</span>
            <strong>{etapa.microcopy}</strong>
          </div>

          {tab === "guia" && (
            <div className="gps-example-card">
              <h3>{conteudo.guia.titulo}</h3>
              <p>{conteudo.guia.texto}</p>
            </div>
          )}

          {tab === "projeto" && (
            <div className="gps-example-card">
              <h3>{conteudo.projeto.titulo}</h3>
              <p>{conteudo.projeto.descricao}</p>
              <div className="form" style={{ padding: "14px 0 0" }}>
                <div className="form-row">
                  {conteudo.projeto.campos.map((campo) => (
                    <div key={campo} className="field">
                      <label>{campo}</label>
                      <input placeholder={`Ex: ${campo.toLowerCase()}`} disabled />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "solucao" && (
            <div className="gps-example-card">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <h3 style={{ margin: 0 }}>{conteudo.solucao.titulo}</h3>
                <Badge tone="teal">{conteudo.solucao.tipo}</Badge>
              </div>
              <p>{conteudo.solucao.descricao}</p>
            </div>
          )}

          <p className="gps-example-note">
            Exemplo ilustrativo — o conteúdo final de {pilar.nome} ainda será definido pela
            metodologia GOTED.
          </p>
        </div>
      </section>
    </div>
  );
}
