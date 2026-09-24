// Escala de maturidade GOTED, baseada na analogia das marchas de um veículo.
// Usada em Auto Scanner e Pro Scanner — ver components/scanner e
// lib/scanner/perguntas.ts.

export type MarchaResposta = "N" | 1 | 2 | 3 | 4 | 5;
export type MarchaNumero = 1 | 2 | 3 | 4 | 5;

export interface MarchaInfo {
  numero: MarchaNumero;
  label: string; // "3ª marcha"
  nome: string; // "Estruturada"
  ideiaChave: string;
}

export const MARCHAS: MarchaInfo[] = [
  { numero: 1, label: "1ª marcha", nome: "Inicial", ideiaChave: "Inexistente ou informal." },
  { numero: 2, label: "2ª marcha", nome: "Básica", ideiaChave: "Existe, mas ainda não é confiável." },
  { numero: 3, label: "3ª marcha", nome: "Estruturada", ideiaChave: "Existe um padrão." },
  { numero: 4, label: "4ª marcha", nome: "Gerenciada", ideiaChave: "É gerenciado." },
  { numero: 5, label: "5ª marcha", nome: "Otimizada", ideiaChave: "Funciona e evolui continuamente." },
];

// Descrições padrão exibidas ao passar o mouse / selecionar cada marcha.
// Cada pergunta pode sobrescrever qualquer uma delas (ver ScannerPergunta.descricoes).
export const DESCRICOES_PADRAO: Record<MarchaResposta, string> = {
  N: "Não se aplica à realidade da empresa.",
  1: "Não temos isso estruturado.",
  2: "Existe parcialmente ou de maneira informal.",
  3: "Existe um padrão definido e aplicado.",
  4: "Além de estruturado, acompanhamos seu funcionamento.",
  5: "É maduro, mensurado e continuamente melhorado.",
};

// N nunca vira zero — vira ausência de valor, e é excluído dos cálculos.
export function valorNumerico(resposta: MarchaResposta): number | null {
  return resposta === "N" ? null : resposta;
}

export interface RespostaPonderada {
  valor: number | null;
  peso: number;
}

// soma(nota × peso) / soma(pesos das respostas válidas) — respostas N (valor
// null) nunca entram no numerador nem no denominador. Se não houver nenhuma
// resposta válida, o agregado é null (não aplicável), nunca zero.
export function calcularAgregado(respostas: RespostaPonderada[]): number | null {
  const validas = respostas.filter((r): r is { valor: number; peso: number } => r.valor !== null);
  if (validas.length === 0) return null;
  const somaPesos = validas.reduce((acc, r) => acc + r.peso, 0);
  if (somaPesos === 0) return null;
  const somaPonderada = validas.reduce((acc, r) => acc + r.valor * r.peso, 0);
  return somaPonderada / somaPesos;
}

// Classifica um valor decimal (ex: 3.42) na marcha mais próxima, para exibição
// ("3ª marcha — Estruturada"). O valor decimal em si nunca é arredondado ao
// ser armazenado/comparado — só a classificação visual usa arredondamento.
export function classificarMarcha(valorDecimal: number | null): MarchaInfo | null {
  if (valorDecimal === null) return null;
  const numero = Math.min(5, Math.max(1, Math.round(valorDecimal))) as MarchaNumero;
  return MARCHAS.find((m) => m.numero === numero) ?? null;
}

export function formatarValorDecimal(valor: number | null): string {
  return valor === null ? "—" : valor.toFixed(2);
}
