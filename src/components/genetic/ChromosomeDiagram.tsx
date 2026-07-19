type ChromosomeDiagramProps = {
  first: string[];
  second: string[];
  start: number;
  end?: number;
};

export function ChromosomeDiagram({ first, second, start, end = start }: ChromosomeDiagramProps) {
  const startIndex = Math.max(0, start - 1);
  const endIndex = Math.max(startIndex, end - 1);

  const row = (label: string, genes: string[]) => (
    <div className="chromosome-row">
      <span>{label}</span>
      <div>
        {genes.map((gene, index) => (
          <i className={index >= startIndex && index <= endIndex ? "gene-cell active-gene" : "gene-cell"} key={`${label}-${index}`}>
            {gene}
          </i>
        ))}
      </div>
    </div>
  );

  return (
    <div className="chromosome-diagram" aria-label="染色体図">
      {row("個体1", first)}
      {row("個体2", second)}
    </div>
  );
}
