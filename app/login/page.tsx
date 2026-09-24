"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LogoFull } from "@/components/ui/Logo";
import { criarConta, entrar, getSessaoAtual } from "@/lib/db/auth";

export default function LoginPage() {
  const router = useRouter();
  const [modo, setModo] = useState<"entrar" | "criar-conta">("entrar");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);

  useEffect(() => {
    getSessaoAtual().then((sessao) => {
      if (sessao) router.replace("/");
    });
  }, [router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    setMensagem(null);
    setCarregando(true);

    try {
      const { erro } = modo === "entrar" ? await entrar(email, senha) : await criarConta(email, senha);
      if (erro) {
        setErro(erro);
        setCarregando(false);
        return;
      }
      router.replace("/");
    } catch {
      setErro("Não foi possível conectar ao servidor. Tente novamente.");
      setCarregando(false);
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-glow" />
      <div className="auth-content">
        <LogoFull height={34} tone="areia" />

        <form className="auth-card" onSubmit={handleSubmit}>
          <div className="auth-card-head">
            <h1>{modo === "entrar" ? "Entrar" : "Criar conta"}</h1>
            <p>Acesse a plataforma da sua mentoria GOTED.</p>
          </div>

          <div className="field">
            <label>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@empresa.com.br"
              autoComplete="email"
              required
            />
          </div>

          <div className="field">
            <label>Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              autoComplete={modo === "entrar" ? "current-password" : "new-password"}
              minLength={6}
              required
            />
          </div>

          <button type="submit" className="primary-btn auth-submit" disabled={carregando}>
            {carregando ? "Aguarde..." : modo === "entrar" ? "Entrar" : "Criar conta"}
          </button>

          {erro && <p className="auth-error">{erro}</p>}
          {mensagem && <p className="auth-message">{mensagem}</p>}

          <button
            type="button"
            className="auth-switch"
            onClick={() => {
              setModo((m) => (m === "entrar" ? "criar-conta" : "entrar"));
              setErro(null);
              setMensagem(null);
            }}
          >
            {modo === "entrar" ? "Não tem conta? Criar conta" : "Já tem conta? Entrar"}
          </button>
        </form>

        <p className="auth-footnote">
          Estrutura para crescer · Estratégia para acelerar
        </p>
      </div>
    </div>
  );
}
