"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, LogOut } from "lucide-react";
import { PanelHead } from "@/components/ui/PanelHead";
import { getSessaoAtual, sair as encerrarSessao, type SessaoUsuario } from "@/lib/db/auth";

export function SessionCard() {
  const router = useRouter();
  const [user, setUser] = useState<SessaoUsuario | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [saindo, setSaindo] = useState(false);

  useEffect(() => {
    getSessaoAtual()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setCarregando(false));
  }, []);

  async function sair() {
    setSaindo(true);
    await encerrarSessao();
    router.push("/login");
  }

  return (
    <section className="panel">
      <PanelHead title="Sessão" action="PostgreSQL" />
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
