import type { ReactNode } from "react";

export function Badge({
  children,
  tone = "muted",
}: {
  children: ReactNode;
  tone?: "teal" | "amber" | "green" | "muted";
}) {
  return <span className={`badge ${tone}`}>{children}</span>;
}
