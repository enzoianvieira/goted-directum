"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, LogOut } from "lucide-react";
import { PanelHead } from "@/components/ui/PanelHead";
import { createClient } from "@/lib/supabase/browser";
import type { User } from "@supabase/supabase-js";

export function SessionCard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [saindo, setSaindo] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setCarregando(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function sair() {
    setSaindo(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <section className="panel">
      <PanelHead title="Sessão" action="Supabase Auth" />
      <div className="panel-body" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        {carregando ? (
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Verificando sessão...</span>
        ) : user ? (
          <>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main)" }}>
                Logado
              </div>
              <div style={{ fontSize: 12, color: "var(--text-sub)" }}>{user.email}</div>
            </div>
            <button type="button" className="ghost-btn" onClick={sair} disabled={saindo}>
              <LogOut size={14} /> {saindo ? "Saindo..." : "Sair"}
            </button>
          </>
        ) : (
          <>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main)" }}>
                Navegando em modo demo
              </div>
              <div style={{ fontSize: 12, color: "var(--text-sub)" }}>
                Sem login — os dados mostrados são da organização de demonstração.
              </div>
            </div>
            <a href="/login" className="primary-btn">
              <LogIn size={14} /> Entrar
            </a>
          </>
        )}
      </div>
    </section>
  );
}
