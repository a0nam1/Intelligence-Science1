import { useState } from "react";
import { twoPointCrossover } from "../../lib/genetic/crossover";
import { parseGeneSequence } from "../../lib/genetic/parser";
import type { CrossoverResult } from "../../types/genetic";
import { ResultCard } from "../ResultCard";
import { CalculationSteps } from "../reinforcement/CalculationSteps";
import { ChromosomeDiagram } from "./ChromosomeDiagram";

export function TwoPointCrossoverCalculator() {
  const [first, setFirst] = useState("0000000");
  const [second, setSecond] = useState("1111111");
  const [start, setStart] = useState("3");
  const [end, setEnd] = useState("6");
  const [mode, setMode] = useState("restore");
  const [result, setResult] = useState<CrossoverResult | null>(null);
  const [error, setError] = useState("");
  const [copyLabel, setCopyLabel] = useState("答えをコピー");

  const calculate = () => {
    setCopyLabel("答えをコピー");
    try {
      setResult(twoPointCrossover(parseGeneSequence(first), parseGeneSequence(second), Number(start), Number(end)));
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
      <p className="section-kicker">二点交叉</p>
      <h2>範囲内の遺伝子を交換</h2>
      <div className="grid-2">
        <label><span>個体1</span><input value={first} onChange={(event) => setFirst(event.target.value)} aria-label="二点交叉の個体1" /></label>
        <label><span>個体2</span><input value={second} onChange={(event) => setSecond(event.target.value)} aria-label="二点交叉の個体2" /></label>
        <label><span>開始位置</span><input type="number" step="1" value={start} onChange={(event) => setStart(event.target.value)} aria-label="二点交叉の開始位置" /></label>
        <label><span>終了位置</span><input type="number" step="1" value={end} onChange={(event) => setEnd(event.target.value)} aria-label="二点交叉の終了位置" /></label>
        <label><span>計算モード</span><select value={mode} onChange={(event) => setMode(event.target.value)}><option value="forward">交叉前から交叉後を求める</option><option value="restore">交叉後から交叉前を復元する</option></select></label>
      </div>
      <ChromosomeDiagram first={firstGenes} second={secondGenes} start={Number(start) || 1} end={Number(end) || Number(start) || 1} />
      <div className="button-row">
        <button type="button" onClick={calculate}>計算する</button>
        <button type="button" className="secondary-button" onClick={() => { setFirst("0000000"); setSecond("1111111"); setStart("3"); setEnd("6"); setMode("restore"); setResult(null); setError(""); }}>サンプル入力</button>
        <button type="button" className="secondary-button" onClick={() => { setFirst(""); setSecond(""); setStart(""); setEnd(""); setResult(null); setError(""); }}>リセット</button>
      </div>
      {error && <p className="error-message">{error}</p>}
      {result && (
        <ResultCard title={mode === "restore" ? "復元結果" : "交叉結果"}>
          <dl className="result-list">
            <div><dt>交換範囲</dt><dd>{start}番目から{end}番目</dd></div>
            <div><dt>計算結果1</dt><dd className="correct-result">{result.firstChild.join("")}</dd></div>
            <div><dt>計算結果2</dt><dd className="correct-result">{result.secondChild.join("")}</dd></div>
          </dl>
          <p className="answer-line correct-result">{answer}</p>
          <button type="button" className="copy-button" onClick={async () => { await navigator.clipboard.writeText(answer); setCopyLabel("コピーしました"); }}>{copyLabel}</button>
          <CalculationSteps steps={[`交換範囲内: ${firstGenes.slice(Number(start) - 1, Number(end)).join("")} と ${secondGenes.slice(Number(start) - 1, Number(end)).join("")}`, `結果: ${answer}`]} />
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
