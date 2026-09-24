"use client";

import { useMemo, useState } from "react";
import { PanelHead } from "@/components/ui/PanelHead";
import { Tabs } from "@/components/ui/Tabs";
import { MarchaSelector } from "@/components/scanner/MarchaSelector";
import { ResultadoResumo } from "@/components/scanner/ResultadoResumo";
import { getPerguntas } from "@/lib/scanner/perguntas";
import { calcularResultado, type RespostasScanner } from "@/lib/scanner/resultado";
import type { MarchaResposta } from "@/lib/scanner/marcha";
import { PILARES } from "@/lib/pilares";

const PERGUNTAS = getPerguntas("pro");

export default function ProScannerPage() {
  const [pilarAtivo, setPilarAtivo] = useState(PILARES[0].slug);
  const [respostas, setRespostas] = useState<RespostasScanner>({});

  const resultado = useMemo(() => calcularResultado(PERGUNTAS, respostas), [respostas]);
  const respondidas = Object.keys(respostas).length;
  const perguntasDoPilar = PERGUNTAS.filter((p) => p.pilarId === pilarAtivo);

  function responder(perguntaId: string, valor: MarchaResposta) {
    setRespostas((prev) => ({ ...prev, [perguntaId]: valor }));
  }

  return (
    <div className="page-stack">
      <section className="panel">
        <PanelHead
          title="Pro Scanner"
          action={`${respondidas} de ${PERGUNTAS.length} respondidas`}
        />
        <div className="panel-body">
          <p style={{ fontSize: 13, color: "var(--text-sub)", lineHeight: 1.6 }}>
            Diagnóstico conduzido por um consultor GOTED, normalmente por
            entrevista. Usa a mesma régua de marchas do Auto Scanner, com mais
            perguntas e visão por subpilar — permitindo comparar os dois
            diagnósticos na mesma medida.
          </p>
        </div>

        <Tabs
          tabs={PILARES.map((p) => ({ key: p.slug, label: p.nome }))}
          active={pilarAtivo}
          onChange={(key) => setPilarAtivo(key as typeof pilarAtivo)}
        />

        <div className="panel-body" style={{ paddingTop: 0 }}>
          {perguntasDoPilar.map((pergunta) => (
            <MarchaSelector
              key={pergunta.id}
              pergunta={pergunta}
              value={respostas[pergunta.id]}
              onChange={(valor) => responder(pergunta.id, valor)}
            />
          ))}
        </div>
      </section>

      <ResultadoResumo resultado={resultado} mostrarSubpilares />
    </div>
  );
}
