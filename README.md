# GOTED — Plataforma (MVP)

MVP navegável da plataforma GOTED: Next.js (App Router) + TypeScript +
PostgreSQL 16. Parte das telas já lê/grava no banco; o restante ainda usa
dados mockados.

## Rodando localmente

Pré-requisitos: Node 20+ e Docker (ou um PostgreSQL 16 acessível).

```bash
docker compose up -d          # sobe o PostgreSQL 16 na porta 5433 e aplica db/schema.sql + db/seed.sql
cp .env.example .env.local    # DATABASE_URL apontando para o container
npm install
npm run dev
```

Abra http://localhost:3000 (redireciona para `/inicio/mentoria-map`).

Para usar outro PostgreSQL (ex.: o do servidor), aplique `db/schema.sql` e
`db/seed.sql` nele com `psql` (ou pelo pgAdmin, Query Tool) e ajuste
`DATABASE_URL` no `.env.local`.

## Estrutura

- `app/` — rotas (App Router). Cada módulo do menu lateral (Início, Painel,
  Origem, Destino, Rota GOTED, Copiloto) tem sua própria pasta com submenus.
- `components/layout/AppShell.tsx` — casca da aplicação (rail + painel de
  submódulos + topo), monta o menu a partir de `lib/nav.ts`.
- `components/ui/` — componentes de interface reutilizáveis (painel, aba,
  métrica, badge, barra de progresso, estado vazio).
- `lib/types.ts` — tipos do domínio (pensados para multi-tenant: organização,
  usuário, papel, pilar).
- `lib/tenant.ts` — organização/usuário "atuais", mockados (demo). Futuramente
  virão da sessão do usuário logado.
- `lib/mock-data.ts` — todos os dados fictícios usados nas telas.
- `lib/db/` — acesso ao PostgreSQL com `pg` (node-postgres), sempre no
  servidor: `pool.ts` (conexão via `DATABASE_URL`), `queries.ts` (Horizonte,
  OKR, Auto Scanner) e `auth.ts` (login e-mail/senha com bcrypt + sessão em
  cookie httpOnly). Os arquivos são `"use server"`, então páginas de cliente
  chamam as funções diretamente como Server Functions.
- `db/schema.sql` — schema `goted` (tabelas, enums). `db/seed.sql` — organização
  e usuário de demonstração (IDs de `lib/tenant.ts`).
- `docker-compose.yml` — PostgreSQL 16 local para desenvolvimento.

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
