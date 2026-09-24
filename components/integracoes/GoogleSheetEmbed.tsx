"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, FileSpreadsheet, TriangleAlert } from "lucide-react";

export interface GoogleSheetEmbedProps {
  /** URL da planilha configurada para a ferramenta. null = não configurada. */
  url: string | null;
  titulo: string;
  /** Altura da área do iframe. Aceita número (px) ou qualquer valor CSS. */
  altura?: number | string;
  /** Mostra o botão "Abrir no Google Sheets". Default: true. */
  permitirAbrirNoSheets?: boolean;
}

const TEMPO_LIMITE_CARREGAMENTO_MS = 8000;
// O evento "load" do iframe dispara quando o documento inicial termina —
// bem antes do Google Sheets (uma SPA pesada) terminar de desenhar a grade
// por dentro. Sem isso, a gente esconde nosso "Carregando..." cedo demais e
// o usuário vê uma área branca por 1-2s antes do conteúdo real aparecer.
const TEMPO_MINIMO_LOADING_MS = 2500;

// A URL que o usuário cola (ex.: .../edit#gid=123) precisa virar a URL de
// pré-visualização do Google, feita para ser incorporada em iframe. Isso não
// muda nenhuma permissão de compartilhamento da planilha — só o formato do
// link usado para exibi-la aqui dentro.
function paraUrlDeEmbed(url: string): string | null {
  const idMatch = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (!idMatch) return null;
  const gidMatch = url.match(/[?#&]gid=(\d+)/);
  const id = idMatch[1];
  const gid = gidMatch?.[1];
  return `https://docs.google.com/spreadsheets/d/${id}/preview${gid ? `?gid=${gid}` : ""}`;
}

export function GoogleSheetEmbed({
  url,
  titulo,
  altura = 640,
  permitirAbrirNoSheets = true,
}: GoogleSheetEmbedProps) {
  const embedUrl = url ? paraUrlDeEmbed(url) : null;
  const [status, setStatus] = useState<"carregando" | "carregado" | "demorando">("carregando");
  const tempoInicioRef = useRef(0);
  const timeoutMinimoRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reseta o status quando a URL embutida muda (ex.: navegou para outra
  // ferramenta) — ajuste feito durante a renderização, não num efeito, para
  // não gerar uma renderização extra em cascata.
  const [embedUrlAnterior, setEmbedUrlAnterior] = useState(embedUrl);
  if (embedUrl !== embedUrlAnterior) {
    setEmbedUrlAnterior(embedUrl);
    setStatus("carregando");
  }

  useEffect(() => {
    if (!embedUrl) return;
    tempoInicioRef.current = Date.now();
    const timeout = setTimeout(() => {
      setStatus((atual) => (atual === "carregando" ? "demorando" : atual));
    }, TEMPO_LIMITE_CARREGAMENTO_MS);
    return () => {
      clearTimeout(timeout);
      if (timeoutMinimoRef.current) clearTimeout(timeoutMinimoRef.current);
    };
  }, [embedUrl]);

  function aoCarregarIframe() {
    const faltam = TEMPO_MINIMO_LOADING_MS - (Date.now() - tempoInicioRef.current);
    if (faltam > 0) {
      timeoutMinimoRef.current = setTimeout(() => setStatus("carregado"), faltam);
    } else {
      setStatus("carregado");
    }
  }

  // Ferramenta ainda sem planilha configurada para esta empresa.
  if (!url) {
    return (
      <div className="sheet-embed-vazio">
        <FileSpreadsheet size={22} />
        <p>Nenhuma planilha configurada para &quot;{titulo}&quot; ainda.</p>
        <span>Configure a URL da planilha do Google Sheets para exibi-la aqui.</span>
      </div>
    );
  }

  // URL configurada, mas não reconhecida como um link de Google Sheets.
  if (!embedUrl) {
    return (
      <div className="sheet-embed-vazio">
        <TriangleAlert size={22} />
        <p>A URL configurada não parece ser uma planilha do Google Sheets.</p>
        <a className="ghost-btn" href={url} target="_blank" rel="noreferrer">
          <ExternalLink size={14} /> Abrir link configurado
        </a>
      </div>
    );
  }

  return (
    <div className="sheet-embed">
      <div className="sheet-embed-head">
        <div>
          <strong>{titulo}</strong>
          <p className="sheet-embed-hint">
            Viu uma tela de erro de login do Google aqui dentro? A planilha
            precisa estar compartilhada como &quot;Qualquer pessoa com o
            link&quot; para abrir embutida — ou use o botão ao lado.
          </p>
        </div>
        {permitirAbrirNoSheets && (
          <a className="ghost-btn" href={url} target="_blank" rel="noreferrer">
            <ExternalLink size={14} /> Abrir no Google Sheets
          </a>
        )}
      </div>

      <div className="sheet-embed-frame-wrap" style={{ height: altura }}>
        {status !== "carregado" && (
          <div className="sheet-embed-loading">Carregando planilha...</div>
        )}

        {status === "demorando" && (
          <div className="sheet-embed-fallback">
            <TriangleAlert size={14} />
            Não conseguimos confirmar que a planilha carregou — ela pode exigir
            login ou permissão de acesso Google.{" "}
            <a href={url} target="_blank" rel="noreferrer">
              Abra diretamente no Google Sheets
            </a>
            .
          </div>
        )}

        <iframe
          key={embedUrl}
          src={embedUrl}
          title={titulo}
          className="sheet-embed-iframe"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={aoCarregarIframe}
        />
      </div>
    </div>
  );
}
