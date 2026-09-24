import { CURRENT_ORGANIZATION } from "./tenant";
import type { FerramentaExterna } from "./types";

// Catálogo das ferramentas externas (Google Sheets) disponíveis — futuramente
// vem de uma tabela `pilar_ferramentas` (ver db/schema.sql, seção PROPOSTA).
// O slug é o identificador usado nas rotas /ferramentas/planilhas/[slug] —
// deve ser único no catálogo inteiro (não só dentro do pilar).
const CATALOGO_FERRAMENTAS_EXTERNAS: Omit<FerramentaExterna, "organizationId" | "externalSheetUrl">[] = [
  {
    slug: "fluxo-de-caixa",
    pilar: "dinheiro-e-resultado",
    nome: "Fluxo de Caixa",
    descricao: "Controle de entradas, saídas e saldo projetado da empresa.",
    tipo: "google_sheets",
  },
];

function paraFerramentaExterna(
  def: (typeof CATALOGO_FERRAMENTAS_EXTERNAS)[number]
): FerramentaExterna {
  return {
    ...def,
    organizationId: CURRENT_ORGANIZATION.id,
    externalSheetUrl: obterUrlConfigurada(def.slug),
  };
}

export function getTodasFerramentasExternas(): FerramentaExterna[] {
  return CATALOGO_FERRAMENTAS_EXTERNAS.map(paraFerramentaExterna);
}

export function getFerramentaExterna(slug: string): FerramentaExterna | undefined {
  const def = CATALOGO_FERRAMENTAS_EXTERNAS.find((f) => f.slug === slug);
  return def ? paraFerramentaExterna(def) : undefined;
}

// ─── Configuração local da URL (por enquanto em localStorage) ──────────────
// Até existir a tabela `pilar_ferramentas` no banco, a URL que o usuário
// configura pela interface (Ferramentas → Planilhas → Configurar) fica só no
// navegador dele — mesmo padrão usado em lib/useTheme.ts/usePinnedPanel.ts.
// Trocar por uma chamada Supabase aqui é a única mudança que os componentes
// que consomem este arquivo vão precisar (eles não sabem de onde vem a URL).

function chaveStorage(slug: string): string {
  return `goted-sheet-url:${CURRENT_ORGANIZATION.id}:${slug}`;
}

export function obterUrlConfigurada(slug: string): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(chaveStorage(slug));
}

export function salvarUrlConfigurada(slug: string, url: string | null): void {
  if (typeof window === "undefined") return;
  const chave = chaveStorage(slug);
  const valor = url?.trim();
  if (!valor) {
    window.localStorage.removeItem(chave);
  } else {
    window.localStorage.setItem(chave, valor);
  }
}
