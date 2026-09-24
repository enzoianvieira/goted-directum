"use client";

import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "goted-theme";

// Aplica data-theme no <html> e persiste a escolha no localStorage.
// setTheme grava no DOM/localStorage no mesmo passo em que atualiza o estado,
// para não depender de um segundo efeito reativo (que rodaria uma vez com o
// valor inicial antes da leitura do localStorage "vencer" e acabaria
// sobrescrevendo o tema salvo).
export function useTheme(): [Theme, (t: Theme) => void] {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const initial: Theme = saved === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", initial);
    // Sincronização única com o localStorage (fonte externa) logo após montar,
    // antes de qualquer interação do usuário — não há como ler localStorage
    // durante o render (SSR) para evitar isto via estado inicial.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThemeState(initial);
  }, []);

  function setTheme(t: Theme) {
    setThemeState(t);
    document.documentElement.setAttribute("data-theme", t);
    window.localStorage.setItem(STORAGE_KEY, t);
  }

  return [theme, setTheme];
}
