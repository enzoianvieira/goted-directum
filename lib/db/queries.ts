"use server";

import { pool } from "./pool";
import { PILARES } from "@/lib/pilares";
import type {
  HorizonteAno,
  HorizonteRegistro,
  KeyResult,
  Objetivo,
  PilarSlug,
  ScannerResultado,
} from "@/lib/types";

// Camada de acesso ao PostgreSQL (schema `goted`). Cada função converte entre
// o formato das tabelas e os tipos já usados pela interface (lib/types.ts).
// O arquivo é "use server": as funções rodam sempre no servidor e podem ser
// chamadas tanto de Server Components quanto de componentes de cliente
// (viram Server Functions/Actions).

type KrRow = {
  id: string;
  nome: string;
  valor_atual: string | number; // numeric: string via pg, number via json_agg
  valor_desejado: string | number;
  unidade: string | null;
  prazo: string | null;
};

function toKeyResult(row: KrRow): KeyResult {
  return {
    id: row.id,
    nome: row.nome,
    valorAtual: Number(row.valor_atual),
    valorDesejado: Number(row.valor_desejado),
    unidade: row.unidade ?? "",
    prazo: row.prazo ?? "",
  };
}

// ─── Destino: Horizonte ─────────────────────────────────────────────────────

export async function fetchHorizontes(organizationId: string): Promise<HorizonteRegistro[]> {
  const { rows } = await pool.query<{ ano: string; descricao: string }>(
    "select ano, descricao from goted.horizontes where organization_id = $1",
    [organizationId]
  );

  return rows.map((row) => ({
    ano: Number(row.ano) as HorizonteAno,
    descricao: row.descricao,
  }));
}

export async function salvarHorizonte(
  organizationId: string,
  ano: HorizonteAno,
  descricao: string
): Promise<void> {
  await pool.query(
    `insert into goted.horizontes (organization_id, ano, descricao, updated_at)
     values ($1, $2, $3, now())
     on conflict (organization_id, ano)
     do update set descricao = excluded.descricao, updated_at = excluded.updated_at`,
    [organizationId, String(ano), descricao]
  );
}

// ─── Destino: OKRs ──────────────────────────────────────────────────────────

export async function fetchObjetivosComKrs(organizationId: string): Promise<Objetivo[]> {
  const { rows } = await pool.query<{ id: string; titulo: string; krs: KrRow[] }>(
    `select o.id, o.titulo,
            coalesce(
              json_agg(
                json_build_object(
                  'id', kr.id,
                  'nome', kr.nome,
                  'valor_atual', kr.valor_atual,
                  'valor_desejado', kr.valor_desejado,
                  'unidade', kr.unidade,
                  'prazo', kr.prazo
                ) order by kr.created_at
              ) filter (where kr.id is not null),
              '[]'
            ) as krs
       from goted.objetivos o
       left join goted.resultados_chave kr on kr.objetivo_id = o.id
      where o.organization_id = $1
      group by o.id
      order by o.created_at asc`,
    [organizationId]
  );

  return rows.map((obj) => ({
    id: obj.id,
    titulo: obj.titulo,
    krs: obj.krs.map(toKeyResult),
  }));
}

export async function criarObjetivo(organizationId: string, titulo: string): Promise<{ id: string }> {
  const { rows } = await pool.query<{ id: string }>(
    "insert into goted.objetivos (organization_id, titulo) values ($1, $2) returning id",
    [organizationId, titulo]
  );
  return rows[0];
}

export async function atualizarObjetivoTitulo(objetivoId: string, titulo: string): Promise<void> {
  await pool.query("update goted.objetivos set titulo = $2 where id = $1", [objetivoId, titulo]);
}

// Colunas editáveis de um KR — o nome da coluna nunca vem do cliente, só o valor.
const KR_COLUNAS = {
  nome: "nome",
  valorAtual: "valor_atual",
  valorDesejado: "valor_desejado",
  prazo: "prazo",
} as const;

export async function atualizarResultadoChave(
  krId: string,
  campos: Partial<{ nome: string; valorAtual: number; valorDesejado: number; prazo: string }>
): Promise<void> {
  const sets: string[] = [];
  const valores: unknown[] = [krId];

  for (const [campo, coluna] of Object.entries(KR_COLUNAS)) {
    const valor = campos[campo as keyof typeof KR_COLUNAS];
    if (valor === undefined) continue;
    valores.push(valor);
    sets.push(`${coluna} = $${valores.length}`);
  }

  if (sets.length === 0) return;
  await pool.query(`update goted.resultados_chave set ${sets.join(", ")} where id = $1`, valores);
}

export async function criarResultadoChave(objetivoId: string): Promise<KeyResult> {
  const { rows } = await pool.query<KrRow>(
    `insert into goted.resultados_chave (objetivo_id, nome, valor_atual, valor_desejado)
     values ($1, '', 0, 0)
     returning id, nome, valor_atual, valor_desejado, unidade, prazo`,
    [objetivoId]
  );
  return toKeyResult(rows[0]);
}

// ─── Origem: resultado do Auto Scanner ─────────────────────────────────────

export async function fetchUltimoResultadoAutoScanner(
  organizationId: string
): Promise<ScannerResultado | null> {
  const { rows: scanners } = await pool.query<{ id: string }>(
    `select id from goted.scanners
      where organization_id = $1 and tipo = 'auto'
      order by created_at desc
      limit 1`,
    [organizationId]
  );

  const scanner = scanners[0];
  if (!scanner) return null;

  const { rows: resultados } = await pool.query<{ pilar: string; pontuacao: string }>(
    "select pilar, pontuacao from goted.scanner_resultados_pilar where scanner_id = $1",
    [scanner.id]
  );

  if (resultados.length === 0) return null;

  const scoresPorPilar = resultados.map((r) => ({
    pilar: r.pilar as PilarSlug,
    pontuacao: Number(r.pontuacao),
  }));

  const pontuacaoGeral = Math.round(
    scoresPorPilar.reduce((acc, s) => acc + s.pontuacao, 0) / scoresPorPilar.length
  );

  const pontosDeAtencao = scoresPorPilar
    .filter((s) => s.pontuacao < 60)
    .map((s) => {
      const pilar = PILARES.find((p) => p.slug === s.pilar);
      return `${pilar?.nome ?? s.pilar} está com pontuação abaixo de 60.`;
    });

  return {
    tipo: "auto",
    organizationId,
    pontuacaoGeral,
    scoresPorPilar,
    pontosDeAtencao,
  };
}
