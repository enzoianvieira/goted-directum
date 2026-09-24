"use client";

import { useMemo, useState } from "react";
import { PanelHead } from "@/components/ui/PanelHead";
import { MarchaSelector } from "@/components/scanner/MarchaSelector";
import { ResultadoResumo } from "@/components/scanner/ResultadoResumo";
import { getPerguntas } from "@/lib/scanner/perguntas";
import { calcularResultado, type RespostasScanner } from "@/lib/scanner/resultado";
import type { MarchaResposta } from "@/lib/scanner/marcha";

const PERGUNTAS = getPerguntas("auto");

export default function AutoScannerPage() {
  const [respostas, setRespostas] = useState<RespostasScanner>({});

  const resultado = useMemo(() => calcularResultado(PERGUNTAS, respostas), [respostas]);
  const respondidas = Object.keys(respostas).length;

  function responder(perguntaId: string, valor: MarchaResposta) {
    setRespostas((prev) => ({ ...prev, [perguntaId]: valor }));
  }

  return (
    <div className="page-stack">
      <section className="panel">
        <PanelHead
          title="Auto Scanner"
          action={`${respondidas} de ${PERGUNTAS.length} respondidas`}
        />
        <div className="panel-body">
          <p style={{ fontSize: 13, color: "var(--text-sub)", lineHeight: 1.6, marginBottom: 4 }}>
            Para cada pergunta, indique em qual marcha a empresa está hoje nesse
            aspecto. Não existe resposta certa — o objetivo é identificar o
            ponto de partida para avançar.
          </p>
        </div>

        <div className="panel-body" style={{ paddingTop: 0 }}>
          {PERGUNTAS.map((pergunta) => (
            <MarchaSelector
              key={pergunta.id}
              pergunta={pergunta}
              value={respostas[pergunta.id]}
              onChange={(valor) => responder(pergunta.id, valor)}
            />
          ))}
        </div>
      </section>

      <ResultadoResumo resultado={resultado} />
    </div>
  );
}
