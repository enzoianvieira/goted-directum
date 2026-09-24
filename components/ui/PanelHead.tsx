import type { ReactNode } from "react";

export function PanelHead({
  title,
  action,
}: {
  title: string;
  action?: ReactNode | string;
}) {
  return (
    <div className="panel-head">
      <h2>{title}</h2>
      {typeof action === "string" ? <span>{action}</span> : action}
    </div>
  );
}
