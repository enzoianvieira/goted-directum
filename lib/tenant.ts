import type { Organization, User } from "./types";

// Simulação do "tenant atual" enquanto não existe autenticação real.
// Os IDs abaixo correspondem à organização/usuário semeados no Supabase
// (schema `goted`, ver db/schema.sql) — hoje fixos, futuramente virão da
// sessão do usuário logado (Supabase Auth).

export const CURRENT_ORGANIZATION: Organization = {
  id: "00000000-0000-4000-8000-000000000001",
  nome: "Empresa Demonstração Ltda.",
  segmento: "Comércio e serviços",
};

export const CURRENT_USER: User = {
  id: "00000000-0000-4000-8000-000000000002",
  nome: "Empresário Demo",
  email: "contato@empresademo.com.br",
  role: "cliente",
  organizationId: CURRENT_ORGANIZATION.id,
};
