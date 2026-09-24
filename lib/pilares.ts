import type { Pilar, PilarSlug } from "./types";

export const PILARES: Pilar[] = [
  {
    slug: "gente-e-gestao",
    numero: 1,
    nome: "Gente e Gestão",
    resumo: "Liderança, cultura, estrutura de equipe e processos de gestão de pessoas.",
  },
  {
    slug: "operacao-inteligente",
    numero: 2,
    nome: "Operação Inteligente",
    resumo: "Processos, produtividade e eficiência da operação do dia a dia.",
  },
  {
    slug: "tecnologia-e-informacao",
    numero: 3,
    nome: "Tecnologia e Informação",
    resumo: "Sistemas, dados e automações que sustentam a tomada de decisão.",
  },
  {
    slug: "experiencia-do-cliente",
    numero: 4,
    nome: "Experiência do Cliente",
    resumo: "Jornada, relacionamento e percepção de valor do cliente.",
  },
  {
    slug: "dinheiro-e-resultado",
    numero: 5,
    nome: "Dinheiro e Resultado",
    resumo: "Saúde financeira, indicadores e geração de resultado.",
  },
];

export function getPilar(slug: PilarSlug | string): Pilar | undefined {
  return PILARES.find((p) => p.slug === slug);
}
