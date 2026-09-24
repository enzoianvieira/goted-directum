import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Client de servidor (Server Components / Route Handlers), lendo a sessão a
// partir dos cookies da requisição.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      db: { schema: "goted" },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Chamado de um Server Component sem permissão de escrita — o
            // middleware já cuida de manter a sessão atualizada.
          }
        },
      },
    }
  );
}
