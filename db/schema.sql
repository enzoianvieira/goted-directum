-- ============================================================================
-- GOTED — Schema (PostgreSQL 16)
-- ============================================================================
-- Tudo fica dentro do schema `goted`. Aplicado automaticamente pelo
-- docker-compose.yml na primeira subida do container (junto com db/seed.sql);
-- em outro servidor, rode com: psql "$DATABASE_URL" -f db/schema.sql
--
-- A aplicação (app/) acessa o banco com node-postgres (`pg`) a partir do
-- servidor — ver lib/db/. Horizonte, OKR, resultado do Auto Scanner e login
-- (e-mail/senha, tabelas users/sessions) já usam o banco. O restante das telas
-- (Pro Scanner, Rota GOTED, Copiloto) ainda usa dados mockados/locais.
--
-- As seções "PROPOSTA" no fim deste arquivo documentam tabelas desenhadas mas
-- ainda NÃO usadas pela aplicação (ver lib/scanner/ e lib/ferramentas-externas.ts
-- para a lógica equivalente, hoje com dados locais).
--
-- Rode este arquivo do zero só em banco novo. Em banco existente, use
-- migrations incrementais a partir daqui.
-- ============================================================================

create schema if not exists goted;

-- ─── Enums ──────────────────────────────────────────────────────────────────

create type goted.user_role as enum ('cliente', 'consultor', 'admin_goted');

create type goted.pilar_slug as enum (
  'gente-e-gestao',
  'operacao-inteligente',
  'tecnologia-e-informacao',
  'experiencia-do-cliente',
  'dinheiro-e-resultado'
);

create type goted.scanner_tipo as enum ('auto', 'pro');

create type goted.horizonte_ano as enum ('1', '3', '5');

create type goted.roadmap_status as enum ('concluido', 'em_andamento', 'planejado');

-- Lógica GPS usada nas páginas de pilar (Guia -> Projeto -> Solução).
create type goted.gps_etapa as enum ('guia', 'projeto', 'solucao');

create type goted.atividade_status as enum ('pendente', 'em_andamento', 'concluida');

-- ─── Organizações (empresas-cliente / tenants) ─────────────────────────────

create table goted.organizations (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  segmento text,
  created_at timestamptz not null default now()
);

-- ─── Usuários ───────────────────────────────────────────────────────────────
-- password_hash: bcrypt, gerado em lib/db/auth.ts. Nulo = usuário sem login
-- próprio (ex: cadastrado por um consultor e ainda sem senha definida).

create table goted.users (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text not null unique,
  password_hash text,
  created_at timestamptz not null default now()
);

-- Sessões de login. O cookie do navegador guarda um token opaco; aqui fica só
-- o hash SHA-256 dele (vazar esta tabela não permite sequestrar sessões).

create table goted.sessions (
  token_hash text primary key,
  user_id uuid not null references goted.users (id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index sessions_user_id_idx on goted.sessions (user_id);

-- Vínculo entre usuários e organizações (um usuário pode pertencer/atender a
-- mais de uma organização, ex: consultor com várias empresas atribuídas).

create table goted.organization_members (
  organization_id uuid not null references goted.organizations (id) on delete cascade,
  user_id uuid not null references goted.users (id) on delete cascade,
  role goted.user_role not null default 'cliente',
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

-- ─── Scanners (Auto Scanner e Pro Scanner) ─────────────────────────────────

create table goted.scanners (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references goted.organizations (id) on delete cascade,
  tipo goted.scanner_tipo not null,
  conducted_by uuid references goted.users (id), -- consultor responsável, quando tipo = 'pro'
  created_at timestamptz not null default now()
);

-- Respostas brutas do questionário (Auto Scanner) ou da entrevista (Pro Scanner).

create table goted.scanner_respostas (
  id uuid primary key default gen_random_uuid(),
  scanner_id uuid not null references goted.scanners (id) on delete cascade,
  pilar goted.pilar_slug not null,
  pergunta_chave text not null,
  valor_resposta integer,
  observacao text,
  created_at timestamptz not null default now()
);

-- Resultado consolidado por pilar (o cálculo em si fica fora do banco, no
-- futuro algoritmo de diagnóstico).

create table goted.scanner_resultados_pilar (
  id uuid primary key default gen_random_uuid(),
  scanner_id uuid not null references goted.scanners (id) on delete cascade,
  pilar goted.pilar_slug not null,
  pontuacao numeric(5, 2) not null,
  unique (scanner_id, pilar)
);

-- ─── Destino: Horizonte ─────────────────────────────────────────────────────

create table goted.horizontes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references goted.organizations (id) on delete cascade,
  ano goted.horizonte_ano not null,
  descricao text not null default '',
  updated_at timestamptz not null default now(),
  unique (organization_id, ano)
);

-- ─── Destino: OKRs ──────────────────────────────────────────────────────────

create table goted.objetivos (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references goted.organizations (id) on delete cascade,
  titulo text not null,
  created_at timestamptz not null default now()
);

create table goted.resultados_chave (
  id uuid primary key default gen_random_uuid(),
  objetivo_id uuid not null references goted.objetivos (id) on delete cascade,
  nome text not null,
  valor_atual numeric(14, 2) not null default 0,
  valor_desejado numeric(14, 2) not null default 0,
  unidade text,
  prazo text,
  created_at timestamptz not null default now()
);

-- ─── Rota GOTED: priorização e progresso ───────────────────────────────────

create table goted.roadmap_itens (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references goted.organizations (id) on delete cascade,
  pilar goted.pilar_slug not null,
  ordem integer not null,
  justificativa text,
  status goted.roadmap_status not null default 'planejado',
  unique (organization_id, pilar)
);

create table goted.jornada_progresso (
  organization_id uuid primary key references goted.organizations (id) on delete cascade,
  pilar_atual goted.pilar_slug,
  progresso_percentual numeric(5, 2) not null default 0,
  updated_at timestamptz not null default now()
);

-- ─── Conteúdo dos pilares (lógica GPS: Guia / Projeto / Solução) ───────────
-- Conteúdo institucional do Método GOTED, não pertence a nenhuma organização.

create table goted.pilar_conteudos (
  id uuid primary key default gen_random_uuid(),
  pilar goted.pilar_slug not null,
  etapa goted.gps_etapa not null,
  titulo text not null,
  corpo text,
  ordem integer not null default 0,
  created_at timestamptz not null default now()
);

-- ─── Atividades e acompanhamento da mentoria ───────────────────────────────

create table goted.atividades (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references goted.organizations (id) on delete cascade,
  pilar goted.pilar_slug,
  titulo text not null,
  descricao text,
  status goted.atividade_status not null default 'pendente',
  prazo date,
  created_by uuid references goted.users (id),
  created_at timestamptz not null default now()
);

create table goted.sessoes_mentoria (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references goted.organizations (id) on delete cascade,
  consultor_id uuid references goted.users (id),
  data timestamptz not null default now(),
  notas text
);

-- ============================================================================
-- Observações para a evolução futura:
--
-- 1. Isolamento por organização: hoje é responsabilidade da aplicação (toda
--    query em lib/db/queries.ts filtra por organization_id). Se o banco for
--    acessado por outros clientes, considerar Row Level Security com uma
--    função tipo current_user_organization_ids().
--
-- 2. Sessões expiradas não são apagadas automaticamente — agendar um
--    `delete from goted.sessions where expires_at < now()` (cron/pg_cron).
--
-- 3. admin_goted: não precisa de tabela própria — é apenas um valor de
--    organization_members.role (ou uma tabela separada goted_admins, se o
--    acesso administrativo não estiver ligado a nenhuma organização
--    específica).
--
-- 4. Cálculo de Rota GOTED (cruzamento Origem + Destino): ainda não modelado.
--    Quando o algoritmo existir, ele provavelmente lerá scanner_resultados_pilar
--    e objetivos/resultados_chave para gerar/atualizar roadmap_itens.
-- ============================================================================


-- ============================================================================
-- PROPOSTA — ainda não usada pela aplicação
-- ============================================================================
-- Escala de maturidade por marchas (N, 1ª a 5ª), hoje implementada apenas no
-- front-end com dados locais — ver lib/scanner/marcha.ts, perguntas.ts e
-- resultado.ts. As tabelas abaixo documentam como isso viraria persistência
-- real; a aplicação ainda não lê nem grava nestas tabelas.
--
-- Resumo da migração quando for feita:
--   1. Criar goted.scanner_perguntas (banco de perguntas por scanner_tipo/
--      pilar/subpilar, com peso, ordem e descrições por marcha).
--   2. Em goted.scanner_respostas (já existente e live): trocar a coluna
--      `pergunta_chave text` por `pergunta_id uuid references
--      goted.scanner_perguntas(id)`, e permitir `valor_resposta` nulo = "N"
--      (não aplicável) — nunca gravar N como zero.
--   3. Em goted.scanner_resultados_pilar (já existente e live): `pontuacao`
--      passa a representar o valor decimal da marcha (ex: 3.42) em vez de uma
--      nota de 0 a 100. Criar uma tabela irmã scanner_resultados_subpilar
--      para a granularidade extra do Pro Scanner.
--   4. Toda agregação (subpilar → pilar → geral) é sempre média ponderada das
--      respostas válidas, ignorando N no numerador e no denominador; um grupo
--      sem nenhuma resposta válida retorna null, nunca zero (mesma regra do
--      lib/scanner/resultado.ts).
-- ============================================================================

create table goted.scanner_perguntas (
  id uuid primary key default gen_random_uuid(),
  scanner_type goted.scanner_tipo not null,
  pilar goted.pilar_slug not null,
  subpilar_id text,
  subpilar_nome text,
  pergunta text not null,
  peso numeric(5, 2) not null default 1,
  ordem integer not null default 0,
  ativo boolean not null default true,
  -- Textos exibidos ao passar o mouse/selecionar cada marcha. Podem ficar
  -- nulos, caso em que a interface usa a descrição padrão (ver
  -- DESCRICOES_PADRAO em lib/scanner/marcha.ts).
  descricao_n text,
  descricao_1 text,
  descricao_2 text,
  descricao_3 text,
  descricao_4 text,
  descricao_5 text,
  created_at timestamptz not null default now()
);
-- -- (conteúdo institucional, sem organization_id — mesma lógica de
-- goted.pilar_conteudos: leitura pública, escrita só por admin GOTED)

create table goted.scanner_resultados_subpilar (
  id uuid primary key default gen_random_uuid(),
  scanner_id uuid not null references goted.scanners (id) on delete cascade,
  pilar goted.pilar_slug not null,
  subpilar_id text not null,
  valor numeric(4, 2), -- null = subpilar não aplicável (todas as respostas N)
  unique (scanner_id, subpilar_id)
);
-- -- ============================================================================


-- ============================================================================
-- PROPOSTA — ainda não usada pela aplicação
-- ============================================================================
-- Ferramentas externas (ex.: Google Sheets embutido via iframe) acessadas
-- inteiramente pelo módulo Ferramentas → Planilhas (/ferramentas/planilhas e
-- /ferramentas/planilhas/[slug]) — cada ferramenta usa uma planilha do Google
-- Sheets como interface; a GOTED não tem mais um editor de planilha nativo.
-- Catálogo (quais ferramentas existem) hoje é local — ver
-- lib/ferramentas-externas.ts e components/integracoes/GoogleSheetEmbed.tsx.
-- A URL que cada empresa configura pela interface ("Configurar planilha")
-- hoje fica em localStorage no navegador do usuário (mesmo padrão de
-- lib/useTheme.ts/usePinnedPanel.ts) — ainda não é persistida no banco.
-- Nenhuma integração real com Google Sheets API / Drive API / OAuth existe
-- ainda — isso é só a configuração da URL exibida em iframe.
--
-- Resumo da migração quando for feita:
--   1. Criar goted.pilar_ferramentas: uma linha por empresa+ferramenta (uma
--      mesma ferramenta, ex. "fluxo-de-caixa", pode ter URLs diferentes por
--      organização — cada empresa-cliente com sua própria planilha).
--   2. lib/ferramentas-externas.ts troca a leitura/escrita em localStorage
--      por uma query/mutação em lib/db/ (`select/update ...
--      goted.pilar_ferramentas where organization_id = $1`) — os componentes
--      que consomem esse arquivo (a lista e a página [slug]) não mudam, só a
--      fonte da URL.
--   3. Quando a integração real com Google Drive/Sheets API existir
--      (criação de pasta por empresa, cópia de templates, leitura de dados
--      para dashboards/Copiloto — ver anotações no chat/PRD), external_url
--      passa a ser preenchido automaticamente após o fluxo de OAuth +
--      provisionamento, em vez de configurado manualmente pelo usuário.
--   4. Acesso: mesma lógica das demais tabelas com organization_id — só quem
--      pertence/atende a organização enxerga/edita sua própria linha.
-- ============================================================================

create table goted.pilar_ferramentas (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references goted.organizations (id) on delete cascade,
  pilar goted.pilar_slug not null,
  slug text not null, -- ex: "fluxo-de-caixa"
  nome text not null,
  descricao text,
  tipo text not null default 'google_sheets', -- futuramente um enum, se surgirem outros tipos
  external_url text, -- null = ferramenta ainda não configurada para essa empresa
  -- Preenchidos quando a integração com Drive/Sheets API existir de verdade
  -- (hoje sempre null — a URL acima é só um link colado manualmente).
  drive_file_id text,
  drive_folder_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, pilar, slug)
);
-- -- ============================================================================
