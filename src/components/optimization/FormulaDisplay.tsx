import type { ReactNode } from "react";

type FormulaDisplayProps = {
  title?: string;
  children: ReactNode;
  accent?: boolean;
};

export function FormulaDisplay({ title, children, accent = false }: FormulaDisplayProps) {
  return (
    <div className={accent ? "formula-box derivative-box" : "formula-box"}>
      {title && <span>{title}</span>}
      <strong>{children}</strong>
    </div>
  );
}
