import { useState } from "react";
import { onePointCrossover } from "../../lib/genetic/crossover";
import { parseGeneSequence } from "../../lib/genetic/parser";
import type { CrossoverResult } from "../../types/genetic";
import { ResultCard } from "../ResultCard";
import { CalculationSteps } from "../reinforcement/CalculationSteps";
import { ChromosomeDiagram } from "./ChromosomeDiagram";

export function OnePointCrossoverCalculator() {
  const [first, setFirst] = useState("0010000");
  const [second, setSecond] = useState("1101111");
  const [position, setPosition] = useState("3");
  const [result, setResult] = useState<CrossoverResult | null>(null);
  const [error, setError] = useState("");
  const [copyLabel, setCopyLabel] = useState("答えをコピー");

  const calculate = () => {
    setCopyLabel("答えをコピー");
    try {
      setResult(onePointCrossover(parseGeneSequence(first), parseGeneSequence(second), Number(position)));
      setError("");
    } catch (caughtError) {
      setResult(null);
      setError(caughtError instanceof Error ? caughtError.message : "計算できませんでした。");
    }
  };

  const firstGenes = parseSafe(first);
  const secondGenes = parseSafe(second);
  const answer = result ? `${result.firstChild.join("")} ${result.secondChild.join("")}` : "";

  return (
    <section className="card">
      <p className="section-kicker">一点交叉</p>
      <h2>指定位置から後ろを交換</h2>
      <div className="grid-2">
        <label><span>個体1の遺伝子列</span><input value={first} onChange={(event) => setFirst(event.target.value)} aria-label="個体1の遺伝子列" /></label>
        <label><span>個体2の遺伝子列</span><input value={second} onChange={(event) => setSecond(event.target.value)} aria-label="個体2の遺伝子列" /></label>
        <label><span>交叉位置</span><input type="number" step="1" value={position} onChange={(event) => setPosition(event.target.value)} aria-label="一点交叉の交叉位置" /></label>
      </div>
      <ChromosomeDiagram first={firstGenes} second={secondGenes} start={Number(position) || 1} />
      <div className="button-row">
        <button type="button" onClick={calculate}>計算する</button>
        <button type="button" className="secondary-button" onClick={() => { setFirst("0010000"); setSecond("1101111"); setPosition("3"); setResult(null); setError(""); }}>サンプル入力</button>
        <button type="button" className="secondary-button" onClick={() => { setFirst(""); setSecond(""); setPosition(""); setResult(null); setError(""); }}>リセット</button>
      </div>
      {error && <p className="error-message">{error}</p>}
      {result && (
        <ResultCard title="計算結果">
          <dl className="result-list">
            <div><dt>交換される部分</dt><dd>個体1: {firstGenes.slice(Number(position) - 1).join("")} / 個体2: {secondGenes.slice(Number(position) - 1).join("")}</dd></div>
            <div><dt>交叉後の個体1</dt><dd className="correct-result">{result.firstChild.join("")}</dd></div>
            <div><dt>交叉後の個体2</dt><dd className="correct-result">{result.secondChild.join("")}</dd></div>
          </dl>
          <p className="answer-line correct-result">{answer}</p>
          <button type="button" className="copy-button" onClick={async () => { await navigator.clipboard.writeText(answer); setCopyLabel("コピーしました"); }}>{copyLabel}</button>
          <CalculationSteps steps={[
            `child1 = ${firstGenes.slice(0, Number(position) - 1).join("")} + ${secondGenes.slice(Number(position) - 1).join("")} = ${result.firstChild.join("")}`,
            `child2 = ${secondGenes.slice(0, Number(position) - 1).join("")} + ${firstGenes.slice(Number(position) - 1).join("")} = ${result.secondChild.join("")}`,
          ]} />
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
