import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Para onde o provedor OAuth (Google etc.) volta depois do login, trazendo um
// `code` que trocamos por uma sessão de verdade.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?erro=auth`);
}
