import { useMemo, useState } from "react";
import { mutateBinaryGenes } from "../../lib/genetic/mutation";
import { parseGeneSequence, parsePositionList } from "../../lib/genetic/parser";
import type { MutationResult } from "../../types/genetic";
import { ResultCard } from "../ResultCard";
import { CalculationSteps } from "../reinforcement/CalculationSteps";
import { ChromosomeDiagram } from "./ChromosomeDiagram";

export function MutationCalculator() {
  const [genes, setGenes] = useState("0010111");
  const [positions, setPositions] = useState("1,5");
  const [result, setResult] = useState<MutationResult | null>(null);
  const [error, setError] = useState("");
  const [copyLabel, setCopyLabel] = useState("答えをコピー");

  const originalGenes = parseSafe(genes);
  const previewPositions = useMemo(() => {
    try {
      return parsePositionList(positions);
    } catch {
      return [];
    }
  }, [positions]);
  const displayMutatedGenes = result?.mutatedGenes ?? originalGenes;
  const answer = result ? result.mutatedGenes.join("") : "";

  const calculate = () => {
    setCopyLabel("答えをコピー");
    try {
      const nextResult = mutateBinaryGenes(parseGeneSequence(genes), parsePositionList(positions));
      setResult(nextResult);
      setError("");
    } catch (caughtError) {
      setResult(null);
      setError(caughtError instanceof Error ? caughtError.message : "計算できませんでした。");
    }
  };

  const loadSample = () => {
    setGenes("0010111");
    setPositions("1,5");
    setResult(null);
    setError("");
    setCopyLabel("答えをコピー");
  };

  const reset = () => {
    setGenes("");
    setPositions("");
    setResult(null);
    setError("");
    setCopyLabel("答えをコピー");
  };

  return (
    <section className="card">
      <p className="section-kicker">突然変異</p>
      <h2>指定位置の0と1を反転</h2>
      <p className="description">突然変異位置は複数指定できます。例: 1,5 / 1 5 / 1番目と5番目</p>

      <div className="grid-2">
        <label>
          <span>突然変異前の遺伝子列</span>
          <input value={genes} onChange={(event) => setGenes(event.target.value)} aria-label="突然変異前の遺伝子列" />
        </label>
        <label>
          <span>突然変異させる位置</span>
          <input value={positions} onChange={(event) => setPositions(event.target.value)} aria-label="突然変異させる位置" />
        </label>
      </div>

      <ChromosomeDiagram
        first={originalGenes}
        second={displayMutatedGenes}
        firstLabel="変更前"
        secondLabel={result ? "変更後" : "プレビュー"}
        start={1}
        highlightPositions={previewPositions}
        markerLabel="突然変異"
      />

      <div className="button-row">
        <button type="button" onClick={calculate}>計算する</button>
        <button type="button" className="secondary-button" onClick={loadSample}>サンプル入力</button>
        <button type="button" className="secondary-button" onClick={reset}>リセット</button>
      </div>

      {error && <p className="error-message">{error}</p>}
      {result && (
        <ResultCard title="突然変異結果">
          <dl className="result-list">
            <div><dt>突然変異前の個体</dt><dd className="mono-text">{result.originalGenes.join("")}</dd></div>
            <div><dt>突然変異対象の位置</dt><dd>{result.mutatedPositions.join("、")}番目</dd></div>
            <div><dt>突然変異後の個体</dt><dd className="correct-result mono-text">{answer}</dd></div>
          </dl>
          <div className="mutation-detail-list">
            {result.mutatedPositions.map((position) => (
              <p key={position}>
                {position}番目: {result.originalGenes[position - 1]} → {result.mutatedGenes[position - 1]}
              </p>
            ))}
          </div>
          <p className="answer-line correct-result">{answer}</p>
          <button type="button" className="copy-button" onClick={async () => { await navigator.clipboard.writeText(answer); setCopyLabel("コピーしました"); }}>{copyLabel}</button>
          <CalculationSteps steps={result.mutatedPositions.map((position) => `${position}番目: ${result.originalGenes[position - 1]} → ${result.mutatedGenes[position - 1]}`)} />
        </ResultCard>
      )}
    </section>
  );
}

function parseSafe(value: string): string[] {
  try {
    return parseGeneSequence(value);
  } catch {
    return [];
  }
}
