import { Badge } from "@/components/ui/Badge";
import { PanelHead } from "@/components/ui/PanelHead";
import { ORG_USERS_MOCK } from "@/lib/mock-data";
import type { UserRole } from "@/lib/types";

const ROLE_LABEL: Record<UserRole, { label: string; tone: "teal" | "amber" | "muted" }> = {
  cliente: { label: "Cliente / Empresário", tone: "muted" },
  consultor: { label: "Consultor GOTED", tone: "teal" },
  admin_goted: { label: "Administrador GOTED", tone: "amber" },
};

export default function UsuariosPage() {
  return (
    <div className="page-stack">
      <section className="panel">
        <PanelHead title="Usuários com acesso a esta empresa" action="Dados fictícios" />
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Perfil</th>
            </tr>
          </thead>
          <tbody>
            {ORG_USERS_MOCK.map((user) => {
              const role = ROLE_LABEL[user.role];
              return (
                <tr key={user.id}>
                  <td>{user.nome}</td>
                  <td style={{ color: "var(--text-sub)" }}>{user.email}</td>
                  <td>
                    <Badge tone={role.tone}>{role.label}</Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section className="panel">
        <div className="panel-body">
          <p style={{ fontSize: 13, color: "var(--text-sub)", lineHeight: 1.6 }}>
            Convidar novos usuários e gerenciar permissões ainda não está
            disponível neste MVP. Um consultor GOTED pode futuramente atender a
            várias empresas, e um administrador GOTED terá acesso mais amplo
            entre organizações.
          </p>
        </div>
      </section>
    </div>
  );
}
