type ChromosomeDiagramProps = {
  first: string[];
  second: string[];
  start: number;
  end?: number;
  highlightPositions?: number[];
  firstLabel?: string;
  secondLabel?: string;
  markerLabel?: string;
};

export function ChromosomeDiagram({
  first,
  second,
  start,
  end = start,
  highlightPositions,
  firstLabel = "個体1",
  secondLabel = "個体2",
  markerLabel = "対象",
}: ChromosomeDiagramProps) {
  const startIndex = Math.max(0, start - 1);
  const endIndex = Math.max(startIndex, end - 1);
  const geneCount = Math.max(first.length, second.length);
  const highlighted = new Set(
    highlightPositions ?? Array.from({ length: Math.max(0, endIndex - startIndex + 1) }, (_, index) => startIndex + index + 1),
  );

  const row = (label: string, genes: string[]) => (
    <div className="chromosome-row">
      <span>{label}</span>
      <div>
        {genes.map((gene, index) => (
          <i className={highlighted.has(index + 1) ? "gene-cell active-gene" : "gene-cell"} key={`${label}-${index}`}>
            {gene}
          </i>
        ))}
      </div>
    </div>
  );

  return (
    <div className="chromosome-diagram" aria-label="染色体図">
      {geneCount > 0 && (
        <div className="chromosome-row chromosome-position-row">
          <span>位置</span>
          <div>
            {Array.from({ length: geneCount }, (_, index) => (
              <i className={highlighted.has(index + 1) ? "gene-cell active-gene" : "gene-cell"} key={`position-${index}`}>
                {index + 1}
              </i>
            ))}
          </div>
        </div>
      )}
      {row(firstLabel, first)}
      {row(secondLabel, second)}
      {geneCount > 0 && (
        <div className="chromosome-row chromosome-position-row">
          <span>{markerLabel}</span>
          <div>
            {Array.from({ length: geneCount }, (_, index) => (
              <i className={highlighted.has(index + 1) ? "gene-cell active-gene" : "gene-cell"} key={`marker-${index}`}>
                {highlighted.has(index + 1) ? "○" : "×"}
              </i>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
