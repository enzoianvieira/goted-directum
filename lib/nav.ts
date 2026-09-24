import type { ComponentType } from "react";
import {
  Compass,
  FileSpreadsheet,
  Flag,
  Gauge,
  Map as MapIcon,
  Settings,
  Sparkles,
} from "lucide-react";
import { RouteCurveIcon } from "@/components/ui/RouteCurveIcon";

export interface NavChild {
  label: string;
  href: string;
}

export interface NavModule {
  key: string;
  label: string;
  href: string;
  icon: ComponentType<{ size?: number }>;
  /** Ícone customizado da marca (PNG, tom areia) — quando presente, usado no
   * lugar do ícone Lucide no rail. */
  iconSrc?: string;
  children: NavChild[];
}

export const NAV: NavModule[] = [
  {
    key: "inicio",
    label: "Início",
    href: "/inicio/mentoria-map",
    icon: MapIcon,
    children: [
      { label: "Mentoria MAP", href: "/inicio/mentoria-map" },
      { label: "Método GOTED", href: "/inicio/metodo-goted" },
    ],
  },
  {
    key: "painel",
    label: "Painel",
    href: "/painel/origem",
    icon: Gauge,
    children: [
      { label: "Origem", href: "/painel/origem" },
      { label: "Destino", href: "/painel/destino" },
      { label: "Rota GOTED", href: "/painel/rota" },
    ],
  },
  {
    key: "origem",
    label: "Origem",
    href: "/origem/auto-scanner",
    icon: Compass,
    iconSrc: "/brand/icone-origem.png",
    children: [
      { label: "Auto Scanner", href: "/origem/auto-scanner" },
      { label: "Pro Scanner", href: "/origem/pro-scanner" },
    ],
  },
  {
    key: "destino",
    label: "Destino",
    href: "/destino/horizonte",
    icon: Flag,
    iconSrc: "/brand/icone-destino.png",
    children: [
      { label: "Horizonte", href: "/destino/horizonte" },
      { label: "OKR", href: "/destino/okr" },
    ],
  },
  {
    key: "rota",
    label: "Rota GOTED",
    href: "/rota/roadmap",
    icon: RouteCurveIcon,
    children: [
      { label: "Roadmap", href: "/rota/roadmap" },
      { label: "Gente e Gestão", href: "/rota/gente-e-gestao" },
      { label: "Operação Inteligente", href: "/rota/operacao-inteligente" },
      { label: "Tecnologia e Informação", href: "/rota/tecnologia-e-informacao" },
      { label: "Experiência do Cliente", href: "/rota/experiencia-do-cliente" },
      { label: "Dinheiro e Resultado", href: "/rota/dinheiro-e-resultado" },
    ],
  },
  {
    key: "ferramentas",
    label: "Ferramentas",
    href: "/ferramentas/planilhas",
    icon: FileSpreadsheet,
    children: [{ label: "Planilhas", href: "/ferramentas/planilhas" }],
  },
  {
    key: "copiloto",
    label: "Copiloto",
    href: "/copiloto",
    icon: Sparkles,
    children: [{ label: "Chat", href: "/copiloto" }],
  },
];

// Configurações não é um módulo de negócio — é acessado pelo ícone de
// engrenagem no rodapé do rail — mas usa a mesma caixa de submódulos que os
// demais módulos, por consistência.
export const SETTINGS_NAV: NavModule = {
  key: "configuracoes",
  label: "Configurações",
  href: "/configuracoes/aparencia",
  icon: Settings,
  children: [
    { label: "Aparência", href: "/configuracoes/aparencia" },
    { label: "Empresa", href: "/configuracoes/empresa" },
    { label: "Usuários", href: "/configuracoes/usuarios" },
  ],
};
