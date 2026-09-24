"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useTheme, type Theme } from "./useTheme";

const ThemeContext = createContext<[Theme, (t: Theme) => void] | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const value = useTheme();
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeContext() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeContext deve ser usado dentro de ThemeProvider");
  return ctx;
}
