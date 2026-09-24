"use client";

import { Check, Moon, Sun } from "lucide-react";
import { PanelHead } from "@/components/ui/PanelHead";
import { SessionCard } from "@/components/auth/SessionCard";
import { useThemeContext } from "@/lib/theme-context";

const OPCOES = [
  {
    key: "light" as const,
    label: "Claro",
    icon: Sun,
    descricao: "Fundo areia, o padrão da marca GOTED.",
    preview: "#f5f3ee",
  },
  {
    key: "dark" as const,
    label: "Escuro",
    icon: Moon,
    descricao: "Fundo marinho, ideal para ambientes com pouca luz.",
    preview: "#0b1626",
  },
];

export default function AparenciaPage() {
  const [theme, setTheme] = useThemeContext();

  return (
    <div className="page-stack">
      <SessionCard />

      <section className="panel">
        <PanelHead title="Tema da plataforma" action="Aplicado a toda a plataforma" />
        <div
          className="panel-body"
          style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16 }}
        >
          {OPCOES.map((opt) => {
            const Icon = opt.icon;
            const isActive = theme === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => setTheme(opt.key)}
                style={{
                  textAlign: "left",
                  display: "grid",
                  gap: 10,
                  padding: 14,
                  borderRadius: 14,
                  border: `1px solid ${isActive ? "var(--color-petroleo)" : "var(--border-subtle)"}`,
                  background: isActive ? "var(--color-petroleo-soft)" : "transparent",
                }}
              >
                <div
                  style={{
                    height: 64,
                    borderRadius: 8,
                    background: opt.preview,
                    border: "1px solid var(--border-subtle)",
                  }}
                />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <strong style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-main)" }}>
                    <Icon size={14} /> {opt.label}
                  </strong>
                  {isActive && (
                    <span
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        background: "var(--color-petroleo)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Check size={11} />
                    </span>
                  )}
                </div>
                <small style={{ fontSize: 12, color: "var(--text-sub)" }}>{opt.descricao}</small>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
