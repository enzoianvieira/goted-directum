"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, Settings2 } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { GoogleSheetEmbed } from "@/components/integracoes/GoogleSheetEmbed";
import { getFerramentaExterna, salvarUrlConfigurada } from "@/lib/ferramentas-externas";
import { getPilar } from "@/lib/pilares";
import type { FerramentaExterna } from "@/lib/types";

export default function PlanilhaExternaPage() {
  const params = useParams<{ slug: string }>();
  const [ferramenta, setFerramenta] = useState<FerramentaExterna | null | undefined>(undefined);
  const [editando, setEditando] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  useEffect(() => {
    // A URL configurada mora em localStorage — precisa esperar o mount no
    // client para bater com o HTML vazio renderizado no servidor (evita
    // mismatch de hidratação).
    const encontrada = getFerramentaExterna(params.slug) ?? null;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFerramenta(encontrada);
    setUrlInput(encontrada?.externalSheetUrl ?? "");
  }, [params.slug]);

  function salvar() {
    if (!ferramenta) return;
    salvarUrlConfigurada(ferramenta.slug, urlInput);
    setFerramenta({ ...ferramenta, externalSheetUrl: urlInput.trim() || null });
    setEditando(false);
  }

  function cancelar() {
    setUrlInput(ferramenta?.externalSheetUrl ?? "");
    setEditando(false);
  }

  if (ferramenta === undefined) return null;

  if (ferramenta === null) {
    return (
      <div className="page-stack">
        <section className="panel">
          <div className="panel-body">
            <EmptyState>Ferramenta não encontrada.</EmptyState>
          </div>
        </section>
      </div>
    );
  }

  const pilar = getPilar(ferramenta.pilar);

  return (
    <div className="page-stack">
      <Link href="/ferramentas/planilhas" className="ghost-btn" style={{ width: "fit-content" }}>
        <ArrowLeft size={14} /> Planilhas
      </Link>

      <div className="hero">
        {pilar && <div className="eyebrow">{pilar.nome}</div>}
        <h1>{ferramenta.nome}</h1>
        <p>{ferramenta.descricao}</p>
      </div>

      <section className="panel">
        <div className="sheet-config-bar">
          {editando ? (
            <>
              <input
                className="sheet-config-input"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Cole o link de compartilhamento da planilha do Google Sheets"
                autoFocus
              />
              <button type="button" className="primary-btn" onClick={salvar}>
                <Check size={14} /> Salvar
              </button>
              <button type="button" className="ghost-btn" onClick={cancelar}>
                Cancelar
              </button>
            </>
          ) : (
            <button type="button" className="ghost-btn" onClick={() => setEditando(true)}>
              <Settings2 size={14} />
              {ferramenta.externalSheetUrl ? "Trocar planilha" : "Configurar planilha"}
            </button>
          )}
        </div>

        <GoogleSheetEmbed url={ferramenta.externalSheetUrl} titulo={ferramenta.nome} altura={700} />
      </section>
    </div>
  );
}
