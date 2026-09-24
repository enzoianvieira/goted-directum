import type { PilarSlug } from "./types";

// Exemplos ilustrativos do que cada etapa do GPS (Guia → Projeto → Solução)
// poderá conter em cada pilar. Conteúdo fictício/demonstrativo — a versão
// final virá da equipe de metodologia da GOTED.

export interface GpsGuia {
  titulo: string;
  texto: string;
}

export interface GpsProjeto {
  titulo: string;
  descricao: string;
  campos: string[];
}

export interface GpsSolucao {
  titulo: string;
  tipo: string;
  descricao: string;
}

export interface GpsPilarContent {
  guia: GpsGuia;
  projeto: GpsProjeto;
  solucao: GpsSolucao;
}

export const GPS_CONTENT: Record<PilarSlug, GpsPilarContent> = {
  "gente-e-gestao": {
    guia: {
      titulo: "Como estruturar sua liderança",
      texto:
        "Empresas que crescem sem depender de uma única pessoa têm papéis claros e rituais de gestão simples — reuniões curtas e recorrentes valem mais que processos complexos.",
    },
    projeto: {
      titulo: "Mapeamento de papéis e responsabilidades",
      descricao: "Liste os principais cargos da empresa e o que cada um realmente faz hoje.",
      campos: ["Cargo", "Responsável", "Principais responsabilidades", "Reporta a quem"],
    },
    solucao: {
      titulo: "Organograma da empresa",
      tipo: "Documento",
      descricao: "Estrutura visual de cargos e hierarquia, pronta para compartilhar com o time.",
    },
  },
  "operacao-inteligente": {
    guia: {
      titulo: "Por que padronizar processos",
      texto:
        "Um processo escrito reduz a dependência de uma pessoa específica, diminui erros e torna a operação mais previsível — mesmo em equipes pequenas.",
    },
    projeto: {
      titulo: "Desenho de processo",
      descricao: "Descreva um processo-chave da operação, etapa por etapa.",
      campos: ["Nome do processo", "Etapas principais", "Responsável por etapa", "Ferramentas usadas"],
    },
    solucao: {
      titulo: "POP — Procedimento Operacional Padrão",
      tipo: "Documento",
      descricao: "Passo a passo replicável de um processo-chave da operação.",
    },
  },
  "tecnologia-e-informacao": {
    guia: {
      titulo: "Dados que toda empresa deveria acompanhar",
      texto:
        "Antes de comprar sistemas novos, vale mapear o que a empresa já usa e onde as informações importantes realmente ficam guardadas.",
    },
    projeto: {
      titulo: "Inventário de sistemas e dados",
      descricao: "Liste as ferramentas usadas hoje e o que cada uma armazena.",
      campos: ["Sistema/ferramenta", "Informação que armazena", "Quem acessa", "Integra com quê"],
    },
    solucao: {
      titulo: "Painel de indicadores",
      tipo: "Indicador",
      descricao: "Visão consolidada dos números que mais importam para a decisão do dia a dia.",
    },
  },
  "experiencia-do-cliente": {
    guia: {
      titulo: "O que é uma jornada do cliente",
      texto:
        "É o caminho que o cliente percorre desde o primeiro contato até o pós-venda — mapear essa jornada revela onde a empresa perde ou ganha confiança.",
    },
    projeto: {
      titulo: "Mapeamento da jornada do cliente",
      descricao: "Percorra cada etapa da jornada pelos olhos do cliente.",
      campos: ["Etapa da jornada", "Ponto de contato", "O que o cliente sente", "Oportunidade de melhoria"],
    },
    solucao: {
      titulo: "Mapa da jornada do cliente",
      tipo: "Documento",
      descricao: "Visão ponta a ponta da experiência do cliente com a empresa.",
    },
  },
  "dinheiro-e-resultado": {
    guia: {
      titulo: "Indicadores financeiros essenciais",
      texto:
        "Faturar bem não é o mesmo que lucrar bem — entender a margem real de cada produto ou serviço muda as prioridades do negócio.",
    },
    projeto: {
      titulo: "Estrutura de custos e margem",
      descricao: "Organize os custos da empresa para enxergar a margem real.",
      campos: ["Categoria de custo", "Valor mensal", "% da receita", "Observação"],
    },
    solucao: {
      titulo: "Relatório de margem por produto/serviço",
      tipo: "Relatório",
      descricao: "Clareza sobre o que realmente dá lucro no negócio.",
    },
  },
};
