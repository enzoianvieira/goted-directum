"use client";

import { useState } from "react";
import { DESCRICOES_PADRAO, type MarchaResposta } from "@/lib/scanner/marcha";
import type { ScannerPergunta } from "@/lib/scanner/perguntas";

const OPCOES: MarchaResposta[] = ["N", 1, 2, 3, 4, 5];

function rotulo(opcao: MarchaResposta): string {
  return opcao === "N" ? "N" : `${opcao}ª`;
}

export function MarchaSelector({
  pergunta,
  value,
  onChange,
}: {
  pergunta: ScannerPergunta;
  value?: MarchaResposta;
  onChange: (resposta: MarchaResposta) => void;
}) {
  const [emFoco, setEmFoco] = useState<MarchaResposta | null>(null);
  const exibida = emFoco ?? value ?? null;
  const descricao = exibida
    ? pergunta.descricoes?.[exibida] ?? DESCRICOES_PADRAO[exibida]
    : "Passe o mouse ou selecione uma marcha para ver o que ela significa.";

  return (
    <div className="marcha-question">
      {pergunta.subpilarNome && <div className="marcha-subpilar-tag">{pergunta.subpilarNome}</div>}
      <p className="marcha-pergunta-texto">{pergunta.pergunta}</p>

      <div className="marcha-row" onMouseLeave={() => setEmFoco(null)}>
        {OPCOES.map((opcao) => (
          <button
            key={opcao}
            type="button"
            className={`marcha-btn ${opcao === "N" ? "marcha-btn-n" : `marcha-btn-${opcao}`} ${
              value === opcao ? "active" : ""
            }`}
            onMouseEnter={() => setEmFoco(opcao)}
            onFocus={() => setEmFoco(opcao)}
            onBlur={() => setEmFoco(null)}
            onClick={() => onChange(opcao)}
          >
            {rotulo(opcao)}
          </button>
        ))}
      </div>

      <p className="marcha-descricao">{descricao}</p>
    </div>
  );
}
