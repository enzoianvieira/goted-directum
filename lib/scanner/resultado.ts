import { PILARES } from "@/lib/pilares";
import type { PilarSlug } from "@/lib/types";
import { calcularAgregado, valorNumerico, type MarchaResposta } from "./marcha";
import type { ScannerPergunta } from "./perguntas";

export type RespostasScanner = Record<string, MarchaResposta>; // perguntaId -> resposta

export interface ResultadoSubpilar {
  subpilarId: string;
  subpilarNome: string;
  pilarId: PilarSlug;
  valor: number | null; // null = todas as respostas do subpilar são N/não respondidas
}

export interface ResultadoPilar {
  pilarId: PilarSlug;
  nome: string;
  valor: number | null;
  subpilares: ResultadoSubpilar[];
}

export interface ResultadoScanner {
  geral: number | null;
  pilares: ResultadoPilar[];
}

// Cada nível (subpilar, pilar, geral) é calculado como a média ponderada das
// respostas válidas que pertencem a ele — respostas N ou ainda não
// respondidas nunca entram na conta, e um grupo sem nenhuma resposta válida
// resulta em null (não aplicável), nunca zero.
export function calcularResultado(
  perguntas: ScannerPergunta[],
  respostas: RespostasScanner
): ResultadoScanner {
  const respondidas = perguntas
    .map((p) => {
      const resposta = respostas[p.id];
      if (resposta === undefined) return null;
      return { pergunta: p, valor: valorNumerico(resposta), peso: p.peso };
    })
    .filter((r): r is { pergunta: ScannerPergunta; valor: number | null; peso: number } => r !== null);

  const pilares: ResultadoPilar[] = PILARES.map((pilarInfo) => {
    const doPilar = perguntas.filter((p) => p.pilarId === pilarInfo.slug);
    if (doPilar.length === 0) return null;

    const subpilarIds = Array.from(
      new Set(doPilar.filter((p) => p.subpilarId).map((p) => p.subpilarId as string))
    );

    const subpilares: ResultadoSubpilar[] = subpilarIds.map((subId) => {
      const doSubpilar = respondidas.filter(
        (r) => r.pergunta.pilarId === pilarInfo.slug && r.pergunta.subpilarId === subId
      );
      // O nome vem de qualquer pergunta do subpilar (respondida ou não) — não
      // dá pra depender só das respondidas, senão o nome só aparece depois
      // que o usuário responder a primeira pergunta daquele subpilar.
      const perguntaDoSubpilar = doPilar.find((p) => p.subpilarId === subId);
      return {
        subpilarId: subId,
        subpilarNome: perguntaDoSubpilar?.subpilarNome ?? subId,
        pilarId: pilarInfo.slug,
        valor: calcularAgregado(doSubpilar.map((r) => ({ valor: r.valor, peso: r.peso }))),
      };
    });

    const respondidasDoPilar = respondidas.filter((r) => r.pergunta.pilarId === pilarInfo.slug);
    const valorPilar = calcularAgregado(
      respondidasDoPilar.map((r) => ({ valor: r.valor, peso: r.peso }))
    );

    return {
      pilarId: pilarInfo.slug,
      nome: pilarInfo.nome,
      valor: valorPilar,
      subpilares,
    };
  }).filter((p): p is ResultadoPilar => p !== null);

  const geral = calcularAgregado(respondidas.map((r) => ({ valor: r.valor, peso: r.peso })));

  return { geral, pilares };
}
