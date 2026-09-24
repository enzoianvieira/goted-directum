import { createClient } from "@supabase/supabase-js";

// Client de navegador, sempre apontando para o schema `goted` (as tabelas do
// projeto GOTED, isoladas dos outros schemas que existem no mesmo projeto
// Supabase). Usa a chave publicável — segura para expor no browser porque o
// acesso é controlado por RLS no banco (ver db/schema.sql).
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  { db: { schema: "goted" } }
);
