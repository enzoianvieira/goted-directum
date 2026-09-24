"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PanelHead } from "@/components/ui/PanelHead";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { getTodasFerramentasExternas } from "@/lib/ferramentas-externas";
import { getPilar } from "@/lib/pilares";
import type { FerramentaExterna } from "@/lib/types";

export default function PlanilhasPage() {
  const [ferramentas, setFerramentas] = useState<FerramentaExterna[]>([]);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    // A URL configurada mora em localStorage — precisa esperar o mount no
    // client para bater com o HTML vazio renderizado no servidor (evita
    // mismatch de hidratação).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFerramentas(getTodasFerramentasExternas());
    setCarregado(true);
  }, []);

  return (
    <div className="page-stack">
      <section className="panel">
        <PanelHead title="Planilhas" />
        <div className="panel-body">
          <p style={{ fontSize: 13, color: "var(--text-sub)", lineHeight: 1.6 }}>
            Cada ferramenta usa uma planilha do Google Sheets como interface —
            configure a URL, acesse e edite sem sair da GOTED.
          </p>
        </div>

        {!carregado ? null : ferramentas.length === 0 ? (
          <div className="panel-body">
            <EmptyState>Nenhuma ferramenta de planilha disponível ainda.</EmptyState>
          </div>
        ) : (
          <div className="panel-body" style={{ paddingTop: 0 }}>
            <div className="tool-grid">
              {ferramentas.map((f) => {
                const pilar = getPilar(f.pilar);
                return (
                  <Link key={f.slug} href={`/ferramentas/planilhas/${f.slug}`} className="tool-card">
                    <div className="tool-card-head">
                      <strong>{f.nome}</strong>
                      <Badge tone={f.externalSheetUrl ? "green" : "muted"}>
                        {f.externalSheetUrl ? "Configurada" : "Não configurada"}
                      </Badge>
                    </div>
                    <p>
                      {f.descricao}
                      {pilar && <> — {pilar.nome}</>}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
