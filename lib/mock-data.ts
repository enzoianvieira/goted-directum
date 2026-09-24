import type {
  HorizonteRegistro,
  Objetivo,
  RoadmapItem,
  ScannerResultado,
  User,
} from "./types";
import { CURRENT_ORGANIZATION, CURRENT_USER } from "./tenant";

// Todos os dados abaixo são fictícios, apenas para demonstrar a experiência.
// Futuramente virão do banco (PostgreSQL, via lib/db/), sempre filtrados por organizationId.

// Usuários vinculados à organização atual — futuramente virá de
// organization_members (ver db/schema.sql), incluindo consultores e
// administradores GOTED que atendem esta empresa.
export const ORG_USERS_MOCK: User[] = [
  CURRENT_USER,
  {
    id: "user_demo_002",
    nome: "Consultor GOTED",
    email: "consultor@goted.com.br",
    role: "consultor",
    organizationId: CURRENT_ORGANIZATION.id,
  },
];

export const AUTO_SCANNER_RESULTADO: ScannerResultado = {
  tipo: "auto",
  organizationId: "org_demo_001",
  pontuacaoGeral: 62,
  scoresPorPilar: [
    { pilar: "gente-e-gestao", pontuacao: 55 },
    { pilar: "operacao-inteligente", pontuacao: 68 },
    { pilar: "tecnologia-e-informacao", pontuacao: 41 },
    { pilar: "experiencia-do-cliente", pontuacao: 74 },
    { pilar: "dinheiro-e-resultado", pontuacao: 58 },
  ],
  pontosDeAtencao: [
    "Baixa maturidade em tecnologia e automação de processos.",
    "Ausência de rituais estruturados de gestão de pessoas.",
    "Indicadores financeiros pouco acompanhados no dia a dia.",
  ],
};

export const HORIZONTE_MOCK: HorizonteRegistro[] = [
  {
    ano: 1,
    descricao:
      "Estabilizar a operação atual, organizar processos internos e melhorar o fluxo de caixa mensal.",
  },
  {
    ano: 3,
    descricao:
      "Expandir para uma nova unidade e reduzir a dependência do fundador nas decisões do dia a dia.",
  },
  {
    ano: 5,
    descricao:
      "Ser referência regional no segmento, com estrutura de gestão profissionalizada.",
  },
];

export const OBJETIVOS_MOCK: Objetivo[] = [
  {
    id: "obj_1",
    titulo: "Profissionalizar a gestão financeira",
    krs: [
      {
        id: "kr_1",
        nome: "Margem líquida mensal",
        valorAtual: 8,
        valorDesejado: 15,
        unidade: "%",
        prazo: "Dez/2026",
      },
      {
        id: "kr_2",
        nome: "Inadimplência de clientes",
        valorAtual: 12,
        valorDesejado: 4,
        unidade: "%",
        prazo: "Ago/2026",
      },
    ],
  },
  {
    id: "obj_2",
    titulo: "Melhorar a experiência do cliente",
    krs: [
      {
        id: "kr_3",
        nome: "NPS geral",
        valorAtual: 42,
        valorDesejado: 70,
        unidade: "pts",
        prazo: "Nov/2026",
      },
    ],
  },
];

export const ROADMAP_MOCK: RoadmapItem[] = [
  {
    ordem: 1,
    pilar: "dinheiro-e-resultado",
    justificativa: "Fluxo de caixa apertado é a principal urgência hoje.",
    status: "em_andamento",
  },
  {
    ordem: 2,
    pilar: "gente-e-gestao",
    justificativa: "Time ainda depende demais do empresário para decidir.",
    status: "planejado",
  },
  {
    ordem: 3,
    pilar: "operacao-inteligente",
    justificativa: "Processos funcionam, mas de forma pouco padronizada.",
    status: "planejado",
  },
  {
    ordem: 4,
    pilar: "tecnologia-e-informacao",
    justificativa: "Ganhos de eficiência dependem de dados melhores.",
    status: "planejado",
  },
  {
    ordem: 5,
    pilar: "experiencia-do-cliente",
    justificativa: "Já é um ponto forte da empresa hoje.",
    status: "planejado",
  },
];

export const JORNADA_PROGRESSO = {
  pilarAtual: "dinheiro-e-resultado" as const,
  progressoGeral: 24,
  proximosPassos: [
    "Concluir o mapeamento de custos fixos e variáveis",
    "Definir meta de margem líquida com o consultor GOTED",
    "Agendar sessão de acompanhamento do mês",
  ],
};
