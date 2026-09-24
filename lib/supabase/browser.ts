import { createBrowserClient } from "@supabase/ssr";

// Client de navegador com sessão persistida em cookies (necessário para OAuth
// e para o middleware/servidor conseguirem ler quem está logado).
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { db: { schema: "goted" } }
  );
}
