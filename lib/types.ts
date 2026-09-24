// Tipos centrais do domínio GOTED.
// Pensados para um cenário multi-tenant: toda entidade que pertence a uma empresa
// carrega organizationId, mesmo que hoje os dados sejam mockados em memória.

export type PilarSlug =
  | "gente-e-gestao"
  | "operacao-inteligente"
  | "tecnologia-e-informacao"
  | "experiencia-do-cliente"
  | "dinheiro-e-resultado";

export interface Pilar {
  slug: PilarSlug;
  numero: number;
  nome: string;
  resumo: string;
}

export type UserRole = "cliente" | "consultor" | "admin_goted";

export interface Organization {
  id: string;
  nome: string;
  segmento: string;
}

export interface User {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  organizationId: string;
}

export interface PilarScore {
  pilar: PilarSlug;
  pontuacao: number; // 0-100
}

export interface ScannerResultado {
  tipo: "auto" | "pro";
  organizationId: string;
  pontuacaoGeral: number;
  scoresPorPilar: PilarScore[];
  pontosDeAtencao: string[];
}

export type HorizonteAno = 1 | 3 | 5;

export interface HorizonteRegistro {
  ano: HorizonteAno;
  descricao: string;
}

export interface KeyResult {
  id: string;
  nome: string;
  valorAtual: number;
  valorDesejado: number;
  unidade: string;
  prazo: string;
}

export interface Objetivo {
  id: string;
  titulo: string;
  krs: KeyResult[];
}

export interface RoadmapItem {
  ordem: number;
  pilar: PilarSlug;
  justificativa: string;
  status: "concluido" | "em_andamento" | "planejado";
}

// Ferramentas externas (ex.: Google Sheets) associadas a um pilar da Rota
// GOTED. Pensado para futuramente virar `pilar_ferramentas` no banco — uma
// linha por empresa+ferramenta, com organizationId permitindo que cada
// empresa configure sua própria planilha para a mesma ferramenta (ver
// db/schema.sql, seção PROPOSTA).
export type FerramentaExternaTipo = "google_sheets";

export interface FerramentaExterna {
  slug: string;
  pilar: PilarSlug;
  organizationId: string;
  nome: string;
  descricao: string;
  tipo: FerramentaExternaTipo;
  /** URL configurada pela empresa (equivalente a `tool.external_sheet_url`).
   * null = ferramenta ainda não configurada para essa empresa. */
  externalSheetUrl: string | null;
}
