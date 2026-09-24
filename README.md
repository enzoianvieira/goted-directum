# GOTED — Plataforma (MVP)

MVP navegável da plataforma GOTED: Next.js (App Router) + TypeScript, sem
backend — toda a interface funciona com dados mockados.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000 (redireciona para `/inicio/mentoria-map`).

## Estrutura

- `app/` — rotas (App Router). Cada módulo do menu lateral (Início, Painel,
  Origem, Destino, Rota GOTED, Copiloto) tem sua própria pasta com submenus.
- `components/layout/AppShell.tsx` — casca da aplicação (rail + painel de
  submódulos + topo), monta o menu a partir de `lib/nav.ts`.
- `components/ui/` — componentes de interface reutilizáveis (painel, aba,
  métrica, badge, barra de progresso, estado vazio).
- `lib/types.ts` — tipos do domínio (pensados para multi-tenant: organização,
  usuário, papel, pilar).
- `lib/tenant.ts` — organização/usuário "atuais", mockados. É aqui que a
  autenticação real (Supabase Auth) vai entrar futuramente.
- `lib/mock-data.ts` — todos os dados fictícios usados nas telas.
- `db/schema.sql` — schema PostgreSQL, já aplicado ao schema `goted` do
  projeto Supabase "dioptria-lab" (`vuxwlthdeekxojktcxwg`). RLS habilitado em
  todas as tabelas, sem políticas ainda (fechado por padrão). O código do
  Next.js ainda não tem client Supabase — continua usando `lib/mock-data.ts`.

## O que é só demonstrativo

Auto Scanner, Pro Scanner, OKR, Horizonte, Roadmap e Copiloto têm apenas a
interface pronta — os cálculos, algoritmos e a inteligência do Copiloto ainda
não existem. Isso é intencional: o objetivo deste MVP é validar navegação,
identidade visual e organização das telas antes de construir as regras de
negócio.

## Identidade visual

Paleta e tipografia seguem o Manual de Marca GOTED (`design-system/Manual de
marca Goted Final.pdf`, na raiz do repositório): azul-marinho `#12233F`,
petróleo `#176B78`, areia `#F5F3EE`, Montserrat para títulos. A organização do
layout (rail + painel de submódulos) se inspira na referência de UX da DRZ
(`design-system/`), sem reaproveitar textos ou elementos proprietários dela.
