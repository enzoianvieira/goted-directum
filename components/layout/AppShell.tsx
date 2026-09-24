"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { LogOut } from "lucide-react";
import { NAV, SETTINGS_NAV, type NavModule } from "@/lib/nav";
import { CURRENT_ORGANIZATION, CURRENT_USER } from "@/lib/tenant";
import { LogoFull, LogoMark } from "@/components/ui/Logo";
import { ThemeProvider, useThemeContext } from "@/lib/theme-context";
import { usePinnedPanel } from "@/lib/usePinnedPanel";
import { createClient } from "@/lib/supabase/browser";

function useActiveModule(pathname: string): NavModule | undefined {
  const segment = pathname.split("/")[1] ?? "";
  if (segment === SETTINGS_NAV.key) return SETTINGS_NAV;
  return NAV.find((m) => m.key === segment);
}

function AppShellInner({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [theme] = useThemeContext();
  const [pinned, setPinned] = usePinnedPanel();
  const [hovering, setHovering] = useState(false);
  const activeModule = useActiveModule(pathname);
  const isSettings = activeModule?.key === SETTINGS_NAV.key;
  const activeChild = activeModule?.children.find(
    (c) => pathname === c.href || pathname.startsWith(c.href + "/")
  );

  const initials = CURRENT_USER.nome
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const eyebrow = isSettings ? "Sistema" : activeModule?.label ?? "";
  const title = activeChild?.label ?? activeModule?.label ?? "";

  const hasPanel = Boolean(activeModule && activeModule.children.length > 0);
  const panelVisible = pinned || hovering;

  async function sairParaLogin() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  // Telas de autenticação não usam o rail/topbar — a tela toda é o conteúdo.
  if (pathname.startsWith("/login")) {
    return <>{children}</>;
  }

  return (
    <div className="app-shell">
      <div className="sidebar">
        <nav
          className="rail"
          aria-label="Módulos"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <div className="rail-header">
            <LogoMark size={30} tone="areia" />
          </div>
          <div className="rail-nav">
            {NAV.map((mod) => {
              const Icon = mod.icon;
              const isActive = mod.key === activeModule?.key;
              return (
                <Link
                  key={mod.key}
                  href={mod.href}
                  className={`rail-btn ${isActive ? "active" : ""}`}
                >
                  {mod.iconSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="rail-icon-img" src={mod.iconSrc} alt="" width={19} height={19} />
                  ) : (
                    <Icon size={19} />
                  )}
                  <span>{mod.label}</span>
                </Link>
              );
            })}
          </div>
          <div className="rail-bottom">
            <button
              type="button"
              className="rail-avatar"
              title="Sair e voltar para o login"
              onClick={sairParaLogin}
            >
              <span className="rail-avatar-initials">{initials}</span>
              <span className="rail-avatar-logout">
                <LogOut size={14} />
              </span>
            </button>
            <Link
              href={SETTINGS_NAV.href}
              className={`rail-footer ${isSettings ? "active" : ""}`}
              aria-label={SETTINGS_NAV.label}
            >
              <SETTINGS_NAV.icon size={17} />
            </Link>
          </div>
        </nav>

        {hasPanel && (
          <div
            className={`module-panel ${panelVisible ? "" : "panel-hidden"} ${
              pinned ? "" : "floating"
            }`}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            <div className="panel-header">
              <LogoFull height={28} tone={theme === "dark" ? "areia" : "oficial"} />
            </div>
            <div className="panel-title">{activeModule?.label}</div>
            <div className="subnav">
              {activeModule?.children.map((child) => {
                const isActive =
                  pathname === child.href || pathname.startsWith(child.href + "/");
                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={`subnav-btn ${isActive ? "active" : ""}`}
                  >
                    <span>{child.label}</span>
                  </Link>
                );
              })}
            </div>
            <div className="panel-footer">
              <label className="pin-toggle">
                <span className="pin-toggle-label">Fixar menu</span>
                <input
                  type="checkbox"
                  className="pin-toggle-input"
                  checked={pinned}
                  onChange={(e) => setPinned(e.target.checked)}
                />
                <span className="pin-toggle-track">
                  <span className="pin-toggle-thumb" />
                </span>
              </label>
            </div>
          </div>
        )}
      </div>

      <main className={`main ${hasPanel && pinned ? "" : "rail-only"}`}>
        <header className="topbar">
          <div>
            <div className="eyebrow">{eyebrow}</div>
            <h1>{title}</h1>
          </div>
          <div className="topbar-org">
            <strong>{CURRENT_ORGANIZATION.nome}</strong>
            {CURRENT_ORGANIZATION.segmento}
          </div>
        </header>
        <section className="content">{children}</section>
      </main>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AppShellInner>{children}</AppShellInner>
    </ThemeProvider>
  );
}
