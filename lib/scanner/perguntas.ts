import type { PilarSlug } from "@/lib/types";
import type { MarchaResposta } from "./marcha";

export type ScannerType = "auto" | "pro";

export interface ScannerPergunta {
  id: string;
  scannerType: ScannerType;
  pilarId: PilarSlug;
  subpilarId?: string;
  subpilarNome?: string;
  pergunta: string;
  peso: number;
  ordem: number;
  ativo: boolean;
  // Sobrescreve DESCRICOES_PADRAO para esta pergunta específica. Opcional —
  // a arquitetura permite, mas a maioria das perguntas usa o texto padrão.
  descricoes?: Partial<Record<MarchaResposta, string>>;
}

// Auto Scanner — diagnóstico rápido: uma pergunta por pilar, sem subpilares.
export const PERGUNTAS_AUTO: ScannerPergunta[] = [
  {
    id: "auto-gente-e-gestao-1",
    scannerType: "auto",
    pilarId: "gente-e-gestao",
    pergunta: "A empresa possui funções e responsabilidades claramente definidas?",
    peso: 1,
    ordem: 1,
    ativo: true,
  },
  {
    id: "auto-operacao-inteligente-1",
    scannerType: "auto",
    pilarId: "operacao-inteligente",
    pergunta: "Os principais processos da operação estão documentados e padronizados?",
    peso: 1,
    ordem: 1,
    ativo: true,
  },
  {
    id: "auto-tecnologia-e-informacao-1",
    scannerType: "auto",
    pilarId: "tecnologia-e-informacao",
    pergunta: "A empresa usa sistemas e dados para apoiar decisões do dia a dia?",
    peso: 1,
    ordem: 1,
    ativo: true,
  },
  {
    id: "auto-experiencia-do-cliente-1",
    scannerType: "auto",
    pilarId: "experiencia-do-cliente",
    pergunta: "A jornada do cliente é conhecida e acompanhada pela empresa?",
    peso: 1,
    ordem: 1,
    ativo: true,
  },
  {
    id: "auto-dinheiro-e-resultado-1",
    scannerType: "auto",
    pilarId: "dinheiro-e-resultado",
    pergunta: "A empresa acompanha margem e resultado financeiro de forma estruturada?",
    peso: 1,
    ordem: 1,
    ativo: true,
  },
];

// Pro Scanner — diagnóstico aprofundado: dois subpilares por pilar, com
// perguntas próprias, permitindo maior precisão e visão consultiva.
export const PERGUNTAS_PRO: ScannerPergunta[] = [
  // Gente e Gestão
  {
    id: "pro-gg-lideranca-1",
    scannerType: "pro",
    pilarId: "gente-e-gestao",
    subpilarId: "lideranca",
    subpilarNome: "Liderança",
    pergunta: "Os líderes da empresa têm clareza sobre suas responsabilidades de gestão?",
    peso: 1,
    ordem: 1,
    ativo: true,
  },
  {
    id: "pro-gg-lideranca-2",
    scannerType: "pro",
    pilarId: "gente-e-gestao",
    subpilarId: "lideranca",
    subpilarNome: "Liderança",
    pergunta: "Existem rituais recorrentes de acompanhamento do time (1:1, reuniões, feedback)?",
    peso: 1,
    ordem: 2,
    ativo: true,
  },
  {
    id: "pro-gg-estrutura-1",
    scannerType: "pro",
    pilarId: "gente-e-gestao",
    subpilarId: "estrutura-de-equipe",
    subpilarNome: "Estrutura de Equipe",
    pergunta: "A empresa tem um organograma atualizado e conhecido pelo time?",
    peso: 1,
    ordem: 3,
    ativo: true,
  },
  {
    id: "pro-gg-estrutura-2",
    scannerType: "pro",
    pilarId: "gente-e-gestao",
    subpilarId: "estrutura-de-equipe",
    subpilarNome: "Estrutura de Equipe",
    pergunta: "As contratações seguem um processo definido de perfil e seleção?",
    peso: 1,
    ordem: 4,
    ativo: true,
  },

  // Operação Inteligente
  {
    id: "pro-oi-processos-1",
    scannerType: "pro",
    pilarId: "operacao-inteligente",
    subpilarId: "processos",
    subpilarNome: "Processos",
    pergunta: "Os processos críticos da operação estão mapeados?",
    peso: 1,
    ordem: 1,
    ativo: true,
  },
  {
    id: "pro-oi-processos-2",
    scannerType: "pro",
    pilarId: "operacao-inteligente",
    subpilarId: "processos",
    subpilarNome: "Processos",
    pergunta: "Existem indicadores de desempenho operacional acompanhados periodicamente?",
    peso: 1,
    ordem: 2,
    ativo: true,
  },
  {
    id: "pro-oi-padronizacao-1",
    scannerType: "pro",
    pilarId: "operacao-inteligente",
    subpilarId: "padronizacao",
    subpilarNome: "Padronização",
    pergunta: "Novos colaboradores recebem treinamento formal nos processos?",
    peso: 1,
    ordem: 3,
    ativo: true,
  },
  {
    id: "pro-oi-padronizacao-2",
    scannerType: "pro",
    pilarId: "operacao-inteligente",
    subpilarId: "padronizacao",
    subpilarNome: "Padronização",
    pergunta: "Erros e retrabalhos são registrados e analisados?",
    peso: 1,
    ordem: 4,
    ativo: true,
  },

  // Tecnologia e Informação
  {
    id: "pro-ti-sistemas-1",
    scannerType: "pro",
    pilarId: "tecnologia-e-informacao",
    subpilarId: "sistemas",
    subpilarNome: "Sistemas",
    pergunta: "As áreas da empresa usam sistemas integrados (não apenas planilhas soltas)?",
    peso: 1,
    ordem: 1,
    ativo: true,
  },
  {
    id: "pro-ti-sistemas-2",
    scannerType: "pro",
    pilarId: "tecnologia-e-informacao",
    subpilarId: "sistemas",
    subpilarNome: "Sistemas",
    pergunta: "Existe um responsável ou área cuidando da tecnologia da empresa?",
    peso: 1,
    ordem: 2,
    ativo: true,
  },
  {
    id: "pro-ti-dados-1",
    scannerType: "pro",
    pilarId: "tecnologia-e-informacao",
    subpilarId: "dados",
    subpilarNome: "Dados",
    pergunta: "As informações importantes da empresa estão centralizadas e acessíveis?",
    peso: 1,
    ordem: 3,
    ativo: true,
  },
  {
    id: "pro-ti-dados-2",
    scannerType: "pro",
    pilarId: "tecnologia-e-informacao",
    subpilarId: "dados",
    subpilarNome: "Dados",
    pergunta: "A empresa usa dados históricos para embasar decisões?",
    peso: 1,
    ordem: 4,
    ativo: true,
  },

  // Experiência do Cliente
  {
    id: "pro-ec-jornada-1",
    scannerType: "pro",
    pilarId: "experiencia-do-cliente",
    subpilarId: "jornada",
    subpilarNome: "Jornada",
    pergunta: "A jornada do cliente está mapeada, da atração ao pós-venda?",
    peso: 1,
    ordem: 1,
    ativo: true,
  },
  {
    id: "pro-ec-jornada-2",
    scannerType: "pro",
    pilarId: "experiencia-do-cliente",
    subpilarId: "jornada",
    subpilarNome: "Jornada",
    pergunta: "A empresa mede a satisfação do cliente de forma recorrente (NPS, pesquisas)?",
    peso: 1,
    ordem: 2,
    ativo: true,
  },
  {
    id: "pro-ec-relacionamento-1",
    scannerType: "pro",
    pilarId: "experiencia-do-cliente",
    subpilarId: "relacionamento",
    subpilarNome: "Relacionamento",
    pergunta: "Existe um processo definido de atendimento e resposta ao cliente?",
    peso: 1,
    ordem: 3,
    ativo: true,
  },
  {
    id: "pro-ec-relacionamento-2",
    scannerType: "pro",
    pilarId: "experiencia-do-cliente",
    subpilarId: "relacionamento",
    subpilarNome: "Relacionamento",
    pergunta: "Reclamações e feedbacks geram ações concretas de melhoria?",
    peso: 1,
    ordem: 4,
    ativo: true,
  },

  // Dinheiro e Resultado
  {
    id: "pro-dr-financeiro-1",
    scannerType: "pro",
    pilarId: "dinheiro-e-resultado",
    subpilarId: "financeiro",
    subpilarNome: "Financeiro",
    pergunta: "A empresa separa claramente as finanças pessoais das empresariais?",
    peso: 1,
    ordem: 1,
    ativo: true,
  },
  {
    id: "pro-dr-financeiro-2",
    scannerType: "pro",
    pilarId: "dinheiro-e-resultado",
    subpilarId: "financeiro",
    subpilarNome: "Financeiro",
    pergunta: "Existe controle de fluxo de caixa atualizado?",
    peso: 1,
    ordem: 2,
    ativo: true,
  },
  {
    id: "pro-dr-indicadores-1",
    scannerType: "pro",
    pilarId: "dinheiro-e-resultado",
    subpilarId: "indicadores",
    subpilarNome: "Indicadores",
    pergunta: "A empresa acompanha margem de lucro por produto ou serviço?",
    peso: 1,
    ordem: 3,
    ativo: true,
  },
  {
    id: "pro-dr-indicadores-2",
    scannerType: "pro",
    pilarId: "dinheiro-e-resultado",
    subpilarId: "indicadores",
    subpilarNome: "Indicadores",
    pergunta: "Metas financeiras são definidas e revisadas periodicamente?",
    peso: 1,
    ordem: 4,
    ativo: true,
  },
];

export function getPerguntas(tipo: ScannerType): ScannerPergunta[] {
  return (tipo === "auto" ? PERGUNTAS_AUTO : PERGUNTAS_PRO)
    .filter((p) => p.ativo)
    .sort((a, b) => a.ordem - b.ordem);
}
