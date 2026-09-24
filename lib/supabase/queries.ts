import { supabase } from "./client";
import { PILARES } from "@/lib/pilares";
import type {
  HorizonteAno,
  HorizonteRegistro,
  KeyResult,
  Objetivo,
  PilarSlug,
  ScannerResultado,
} from "@/lib/types";

// Camada de acesso ao Supabase (schema `goted`). Cada função converte entre
// o formato das tabelas e os tipos já usados pela interface (lib/types.ts),
// para não precisar reescrever as páginas do zero.

// ─── Destino: Horizonte ─────────────────────────────────────────────────────

export async function fetchHorizontes(organizationId: string): Promise<HorizonteRegistro[]> {
  const { data, error } = await supabase
    .from("horizontes")
    .select("ano, descricao")
    .eq("organization_id", organizationId);

  if (error) throw error;

  return (data ?? []).map((row) => ({
    ano: Number(row.ano) as HorizonteAno,
    descricao: row.descricao,
  }));
}

export async function salvarHorizonte(
  organizationId: string,
  ano: HorizonteAno,
  descricao: string
): Promise<void> {
  const { error } = await supabase
    .from("horizontes")
    .upsert(
      { organization_id: organizationId, ano: String(ano), descricao, updated_at: new Date().toISOString() },
      { onConflict: "organization_id,ano" }
    );
  if (error) throw error;
}

// ─── Destino: OKRs ──────────────────────────────────────────────────────────

export async function fetchObjetivosComKrs(organizationId: string): Promise<Objetivo[]> {
  const { data, error } = await supabase
    .from("objetivos")
    .select("id, titulo, resultados_chave(id, nome, valor_atual, valor_desejado, unidade, prazo)")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((obj) => ({
    id: obj.id,
    titulo: obj.titulo,
    krs: (obj.resultados_chave ?? []).map(
      (kr): KeyResult => ({
        id: kr.id,
        nome: kr.nome,
        valorAtual: Number(kr.valor_atual),
        valorDesejado: Number(kr.valor_desejado),
        unidade: kr.unidade ?? "",
        prazo: kr.prazo ?? "",
      })
    ),
  }));
}

export async function criarObjetivo(organizationId: string, titulo: string): Promise<{ id: string }> {
  const { data, error } = await supabase
    .from("objetivos")
    .insert({ organization_id: organizationId, titulo })
    .select("id")
    .single();
  if (error) throw error;
  return data;
}

export async function atualizarObjetivoTitulo(objetivoId: string, titulo: string): Promise<void> {
  const { error } = await supabase.from("objetivos").update({ titulo }).eq("id", objetivoId);
  if (error) throw error;
}

export async function atualizarResultadoChave(
  krId: string,
  campos: Partial<{ nome: string; valorAtual: number; valorDesejado: number; prazo: string }>
): Promise<void> {
  const patch: Record<string, unknown> = {};
  if (campos.nome !== undefined) patch.nome = campos.nome;
  if (campos.valorAtual !== undefined) patch.valor_atual = campos.valorAtual;
  if (campos.valorDesejado !== undefined) patch.valor_desejado = campos.valorDesejado;
  if (campos.prazo !== undefined) patch.prazo = campos.prazo;

  const { error } = await supabase.from("resultados_chave").update(patch).eq("id", krId);
  if (error) throw error;
}

export async function criarResultadoChave(objetivoId: string): Promise<KeyResult> {
  const { data, error } = await supabase
    .from("resultados_chave")
    .insert({ objetivo_id: objetivoId, nome: "", valor_atual: 0, valor_desejado: 0 })
    .select("id, nome, valor_atual, valor_desejado, unidade, prazo")
    .single();
  if (error) throw error;
  return {
    id: data.id,
    nome: data.nome,
    valorAtual: Number(data.valor_atual),
    valorDesejado: Number(data.valor_desejado),
    unidade: data.unidade ?? "",
    prazo: data.prazo ?? "",
  };
}

// ─── Origem: resultado do Auto Scanner ─────────────────────────────────────

export async function fetchUltimoResultadoAutoScanner(
  organizationId: string
): Promise<ScannerResultado | null> {
  const { data: scanner, error: scannerError } = await supabase
    .from("scanners")
    .select("id")
    .eq("organization_id", organizationId)
    .eq("tipo", "auto")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (scannerError) throw scannerError;
  if (!scanner) return null;

  const { data: resultados, error: resultadosError } = await supabase
    .from("scanner_resultados_pilar")
    .select("pilar, pontuacao")
    .eq("scanner_id", scanner.id);

  if (resultadosError) throw resultadosError;
  if (!resultados || resultados.length === 0) return null;

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
