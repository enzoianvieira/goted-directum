-- ============================================================================
-- GOTED — Schema (PostgreSQL / Supabase)
-- ============================================================================
-- Este schema já foi aplicado ao projeto Supabase "dioptria-lab"
-- (vuxwlthdeekxojktcxwg), dentro do schema `goted` — isolado dos demais
-- schemas do projeto (public, pessoalmapp, valor-ativo etc. pertencem a
-- outras aplicações que compartilham o mesmo projeto).
--
-- A aplicação (app/) já usa supabase-js para Horizonte, OKR e Auth (e-mail/
-- senha) — ver lib/supabase/. O restante das telas (Auto/Pro Scanner, Rota
-- GOTED, Copiloto) ainda usa dados mockados/locais. Este arquivo documenta o
-- banco já criado, servindo de referência para o que falta integrar.
--
-- A seção "PROPOSTA — ainda não aplicada" no fim deste arquivo documenta
-- tabelas desenhadas mas NÃO criadas no Supabase (ver lib/scanner/ para a
-- lógica equivalente já implementada no front, hoje com dados locais).
--
-- Convém rodar este arquivo novamente do zero apenas em outro projeto/ambiente
-- (ex: staging). No projeto atual, use migrations incrementais a partir daqui.
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
alter table goted.organizations enable row level security;

-- ─── Usuários ───────────────────────────────────────────────────────────────
-- Em produção, id deve corresponder a auth.users(id) do Supabase Auth.

create table goted.users (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text not null unique,
  created_at timestamptz not null default now()
);
alter table goted.users enable row level security;

-- Vínculo entre usuários e organizações (um usuário pode pertencer/atender a
-- mais de uma organização, ex: consultor com várias empresas atribuídas).

create table goted.organization_members (
  organization_id uuid not null references goted.organizations (id) on delete cascade,
  user_id uuid not null references goted.users (id) on delete cascade,
  role goted.user_role not null default 'cliente',
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);
alter table goted.organization_members enable row level security;

-- ─── Scanners (Auto Scanner e Pro Scanner) ─────────────────────────────────

create table goted.scanners (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references goted.organizations (id) on delete cascade,
  tipo goted.scanner_tipo not null,
  conducted_by uuid references goted.users (id), -- consultor responsável, quando tipo = 'pro'
  created_at timestamptz not null default now()
);
alter table goted.scanners enable row level security;

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
alter table goted.scanner_respostas enable row level security;

-- Resultado consolidado por pilar (o cálculo em si fica fora do banco, no
-- futuro algoritmo de diagnóstico).

create table goted.scanner_resultados_pilar (
  id uuid primary key default gen_random_uuid(),
  scanner_id uuid not null references goted.scanners (id) on delete cascade,
  pilar goted.pilar_slug not null,
  pontuacao numeric(5, 2) not null,
  unique (scanner_id, pilar)
);
alter table goted.scanner_resultados_pilar enable row level security;

-- ─── Destino: Horizonte ─────────────────────────────────────────────────────

create table goted.horizontes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references goted.organizations (id) on delete cascade,
  ano goted.horizonte_ano not null,
  descricao text not null default '',
  updated_at timestamptz not null default now(),
  unique (organization_id, ano)
);
alter table goted.horizontes enable row level security;

-- ─── Destino: OKRs ──────────────────────────────────────────────────────────

create table goted.objetivos (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references goted.organizations (id) on delete cascade,
  titulo text not null,
  created_at timestamptz not null default now()
);
alter table goted.objetivos enable row level security;

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
alter table goted.resultados_chave enable row level security;

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
alter table goted.roadmap_itens enable row level security;

create table goted.jornada_progresso (
  organization_id uuid primary key references goted.organizations (id) on delete cascade,
  pilar_atual goted.pilar_slug,
  progresso_percentual numeric(5, 2) not null default 0,
  updated_at timestamptz not null default now()
);
alter table goted.jornada_progresso enable row level security;

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
alter table goted.pilar_conteudos enable row level security;

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
alter table goted.atividades enable row level security;

create table goted.sessoes_mentoria (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references goted.organizations (id) on delete cascade,
  consultor_id uuid references goted.users (id),
  data timestamptz not null default now(),
  notas text
);
alter table goted.sessoes_mentoria enable row level security;

-- ============================================================================
-- Observações para a evolução futura:
--
-- 1. RLS: todas as tabelas têm RLS habilitado mas SEM políticas ainda — ou
--    seja, hoje só o service_role (que ignora RLS) consegue ler/escrever.
--    Isso é intencional (fecha tudo por padrão) até existir autenticação real.
--    Quando o Supabase Auth for adicionado, cada tabela com organization_id
--    precisa de políticas baseadas em uma função tipo
--    current_user_organization_ids() (o usuário só enxerga linhas das
--    organizações às quais pertence/atende).
--
-- 2. O schema `goted` não está na lista de schemas expostos pela Data API por
--    padrão — hoje só é acessível via service_role (backend) ou pelo SQL
--    Editor do Supabase. Se for exposto via REST/Data API no futuro, revisar
--    as políticas de RLS antes.
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
-- PROPOSTA — ainda não aplicada ao Supabase
-- ============================================================================
-- Escala de maturidade por marchas (N, 1ª a 5ª), hoje implementada apenas no
-- front-end com dados locais — ver lib/scanner/marcha.ts, perguntas.ts e
-- resultado.ts. As tabelas abaixo documentam como isso viraria persistência
-- real; nada aqui foi rodado no banco ainda.
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
-- alter table goted.scanner_perguntas enable row level security;
-- (conteúdo institucional, sem organization_id — mesma lógica de
-- goted.pilar_conteudos: leitura pública, escrita só por admin GOTED)

create table goted.scanner_resultados_subpilar (
  id uuid primary key default gen_random_uuid(),
  scanner_id uuid not null references goted.scanners (id) on delete cascade,
  pilar goted.pilar_slug not null,
  subpilar_id text not null,
  valor numeric(4, 2), -- null = subpilar não aplicável (todas as respostas N)
  unique (scanner_id, subpilar_id)
);
-- alter table goted.scanner_resultados_subpilar enable row level security;
-- ============================================================================


-- ============================================================================
-- PROPOSTA — ainda não aplicada ao Supabase
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
--      por uma query/mutação Supabase (`select/update ...
--      goted.pilar_ferramentas where organization_id = $1`) — os componentes
--      que consomem esse arquivo (a lista e a página [slug]) não mudam, só a
--      fonte da URL.
--   3. Quando a integração real com Google Drive/Sheets API existir
--      (criação de pasta por empresa, cópia de templates, leitura de dados
--      para dashboards/Copiloto — ver anotações no chat/PRD), external_url
--      passa a ser preenchido automaticamente após o fluxo de OAuth +
--      provisionamento, em vez de configurado manualmente pelo usuário.
--   4. RLS: mesma lógica das demais tabelas com organization_id — só quem
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
-- alter table goted.pilar_ferramentas enable row level security;
-- ============================================================================
