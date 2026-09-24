"use client";

import { useEffect, useState } from "react";
import { PanelHead } from "@/components/ui/PanelHead";
import { Tabs } from "@/components/ui/Tabs";
import { fetchHorizontes, salvarHorizonte } from "@/lib/db/queries";
import { CURRENT_ORGANIZATION } from "@/lib/tenant";
import type { HorizonteAno } from "@/lib/types";

const ANOS: HorizonteAno[] = [1, 3, 5];

export default function HorizontePage() {
  const [anoAtivo, setAnoAtivo] = useState<HorizonteAno>(1);
  const [textos, setTextos] = useState<Record<HorizonteAno, string>>({ 1: "", 3: "", 5: "" });
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [salvoEm, setSalvoEm] = useState<string | null>(null);

  useEffect(() => {
    fetchHorizontes(CURRENT_ORGANIZATION.id)
      .then((registros) => {
        setTextos((prev) => {
          const next = { ...prev };
          registros.forEach((r) => {
            next[r.ano] = r.descricao;
          });
          return next;
        });
      })
      .finally(() => setCarregando(false));
  }, []);

  async function handleSalvar() {
    setSalvando(true);
    setSalvoEm(null);
    try {
      await salvarHorizonte(CURRENT_ORGANIZATION.id, anoAtivo, textos[anoAtivo]);
      setSalvoEm(new Date().toLocaleTimeString("pt-BR"));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="page-stack">
      <section className="panel">
        <PanelHead title="Horizonte" action="Onde a empresa quer chegar?" />
        <Tabs
          tabs={ANOS.map((ano) => ({ key: String(ano), label: `${ano} ${ano === 1 ? "ano" : "anos"}` }))}
          active={String(anoAtivo)}
          onChange={(key) => setAnoAtivo(Number(key) as HorizonteAno)}
        />
        <div className="form">
          <div className="field">
            <label>Onde a empresa estará em {anoAtivo} {anoAtivo === 1 ? "ano" : "anos"}?</label>
            <textarea
              value={textos[anoAtivo]}
              disabled={carregando}
              onChange={(e) =>
                setTextos((prev) => ({ ...prev, [anoAtivo]: e.target.value }))
              }
              placeholder="Descreva, em poucas frases, onde você pretende que a empresa esteja."
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button type="button" className="primary-btn" onClick={handleSalvar} disabled={salvando || carregando}>
              {salvando ? "Salvando..." : "Salvar horizonte"}
            </button>
            {salvoEm && (
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Salvo às {salvoEm}</span>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
