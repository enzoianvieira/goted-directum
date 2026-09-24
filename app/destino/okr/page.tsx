"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { PanelHead } from "@/components/ui/PanelHead";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  atualizarObjetivoTitulo,
  atualizarResultadoChave,
  criarObjetivo,
  criarResultadoChave,
  fetchObjetivosComKrs,
} from "@/lib/db/queries";
import { CURRENT_ORGANIZATION } from "@/lib/tenant";
import type { Objetivo } from "@/lib/types";

export default function OkrPage() {
  const [objetivos, setObjetivos] = useState<Objetivo[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetchObjetivosComKrs(CURRENT_ORGANIZATION.id)
      .then(setObjetivos)
      .finally(() => setCarregando(false));
  }, []);

  async function adicionarObjetivo() {
    const { id } = await criarObjetivo(CURRENT_ORGANIZATION.id, "Novo objetivo");
    setObjetivos((prev) => [...prev, { id, titulo: "Novo objetivo", krs: [] }]);
  }

  async function adicionarKr(objetivoId: string) {
    const kr = await criarResultadoChave(objetivoId);
    setObjetivos((prev) =>
      prev.map((o) => (o.id === objetivoId ? { ...o, krs: [...o.krs, kr] } : o))
    );
  }

  function editarTitulo(objetivoId: string, titulo: string) {
    setObjetivos((prev) => prev.map((o) => (o.id === objetivoId ? { ...o, titulo } : o)));
  }

  function editarKr(objetivoId: string, krId: string, campo: keyof Objetivo["krs"][number], valor: string) {
    setObjetivos((prev) =>
      prev.map((o) =>
        o.id !== objetivoId
          ? o
          : {
              ...o,
              krs: o.krs.map((kr) =>
                kr.id === krId
                  ? {
                      ...kr,
                      [campo]: campo === "valorAtual" || campo === "valorDesejado" ? Number(valor) : valor,
                    }
                  : kr
              ),
            }
      )
    );
  }

  return (
    <div className="page-stack">
      <section className="panel">
        <PanelHead
          title="Objetivos e Resultados-Chave"
          action={
            <button type="button" className="ghost-btn" onClick={adicionarObjetivo}>
              <Plus size={14} /> Novo objetivo
            </button>
          }
        />
        <div className="panel-body" style={{ display: "grid", gap: 20 }}>
          {carregando && <EmptyState>Carregando objetivos...</EmptyState>}
          {!carregando && objetivos.length === 0 && (
            <EmptyState>Nenhum objetivo cadastrado ainda.</EmptyState>
          )}
          {objetivos.map((objetivo) => (
            <div
              key={objetivo.id}
              style={{
                border: "1px solid var(--border-subtle)",
                borderRadius: 12,
                padding: 18,
              }}
            >
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                  Objetivo
                </label>
                <input
                  value={objetivo.titulo}
                  onChange={(e) => editarTitulo(objetivo.id, e.target.value)}
                  onBlur={(e) => atualizarObjetivoTitulo(objetivo.id, e.target.value)}
                  style={{ fontWeight: 700, fontSize: 14, marginTop: 4 }}
                />
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Indicador (KR)</th>
                    <th>Valor atual</th>
                    <th>Valor desejado</th>
                    <th>Prazo</th>
                  </tr>
                </thead>
                <tbody>
                  {objetivo.krs.map((kr) => (
                    <tr key={kr.id}>
                      <td>
                        <input
                          value={kr.nome}
                          placeholder="Nome do indicador"
                          onChange={(e) => editarKr(objetivo.id, kr.id, "nome", e.target.value)}
                          onBlur={(e) => atualizarResultadoChave(kr.id, { nome: e.target.value })}
                        />
                      </td>
                      <td style={{ width: 110 }}>
                        <input
                          value={kr.valorAtual}
                          type="number"
                          onChange={(e) => editarKr(objetivo.id, kr.id, "valorAtual", e.target.value)}
                          onBlur={(e) => atualizarResultadoChave(kr.id, { valorAtual: Number(e.target.value) })}
                        />
                      </td>
                      <td style={{ width: 110 }}>
                        <input
                          value={kr.valorDesejado}
                          type="number"
                          onChange={(e) => editarKr(objetivo.id, kr.id, "valorDesejado", e.target.value)}
                          onBlur={(e) => atualizarResultadoChave(kr.id, { valorDesejado: Number(e.target.value) })}
                        />
                      </td>
                      <td style={{ width: 140 }}>
                        <input
                          value={kr.prazo}
                          placeholder="Ex: Dez/2026"
                          onChange={(e) => editarKr(objetivo.id, kr.id, "prazo", e.target.value)}
                          onBlur={(e) => atualizarResultadoChave(kr.id, { prazo: e.target.value })}
                        />
                      </td>
                    </tr>
                  ))}
                  {objetivo.krs.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ color: "var(--text-muted)", fontSize: 12 }}>
                        Nenhum resultado-chave cadastrado ainda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <button
                type="button"
                className="ghost-btn"
                style={{ marginTop: 12 }}
                onClick={() => adicionarKr(objetivo.id)}
              >
                <Plus size={14} /> Adicionar KR
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
