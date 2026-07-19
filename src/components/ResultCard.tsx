import type { ReactNode } from "react";

type ResultCardProps = {
  title: string;
  children: ReactNode;
};

export function ResultCard({ title, children }: ResultCardProps) {
  return (
    <div className="result-panel" aria-live="polite">
      <h3>{title}</h3>
      {children}
    </div>
  );
}
