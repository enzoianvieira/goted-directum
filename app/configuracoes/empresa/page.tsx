import { PanelHead } from "@/components/ui/PanelHead";
import { CURRENT_ORGANIZATION } from "@/lib/tenant";

export default function EmpresaPage() {
  return (
    <div className="page-stack">
      <section className="panel">
        <PanelHead title="Dados da empresa" action="Somente leitura neste MVP" />
        <div className="panel-body" style={{ display: "grid", gap: 10 }}>
          <div className="field">
            <label>Nome</label>
            <input defaultValue={CURRENT_ORGANIZATION.nome} disabled />
          </div>
          <div className="field">
            <label>Segmento</label>
            <input defaultValue={CURRENT_ORGANIZATION.segmento} disabled />
          </div>
        </div>
      </section>
    </div>
  );
}
