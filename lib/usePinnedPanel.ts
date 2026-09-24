"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "goted-panel-pinned";

// Controla se o painel de submódulos fica sempre visível (fixado) ou some ao
// tirar o mouse, reaparecendo ao passar o mouse sobre o rail. Mesmo padrão de
// persistência do useTheme (ver lib/useTheme.ts para o porquê do
// eslint-disable).
export function usePinnedPanel(): [boolean, (v: boolean) => void] {
  const [pinned, setPinnedState] = useState(true);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const initial = saved !== "false";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPinnedState(initial);
  }, []);

  function setPinned(v: boolean) {
    setPinnedState(v);
    window.localStorage.setItem(STORAGE_KEY, String(v));
  }

  return [pinned, setPinned];
}
