import { useMemo, useState } from "react";
import {
  crossoverByPositions,
  crossoverEvenPositions,
  crossoverOddPositions,
} from "../../lib/genetic/crossover";
import { parseGeneSequence, parsePositionList } from "../../lib/genetic/parser";
import type { PositionCrossoverResult } from "../../types/genetic";
import { ResultCard } from "../ResultCard";
import { CalculationSteps } from "../reinforcement/CalculationSteps";
import { ChromosomeDiagram } from "./ChromosomeDiagram";

type CrossoverMode = "odd" | "even" | "custom";

export function PositionCrossoverCalculator() {
  const [first, setFirst] = useState("1010101");
  const [second, setSecond] = useState("1110000");
  const [mode, setMode] = useState<CrossoverMode>("odd");
  const [customPositions, setCustomPositions] = useState("1,3,5,7");
  const [result, setResult] = useState<PositionCrossoverResult | null>(null);
  const [error, setError] = useState("");
  const [copyLabel, setCopyLabel] = useState("答えをコピー");

  const firstGenes = parseSafe(first);
  const secondGenes = parseSafe(second);
  const previewPositions = useMemo(
    () => getPreviewPositions(mode, firstGenes.length, customPositions),
    [customPositions, firstGenes.length, mode],
  );
  const answer = result ? `${result.firstChild.join("")} ${result.secondChild.join("")}` : "";

  const calculate = () => {
    setCopyLabel("答えをコピー");
    try {
      const parsedFirst = parseGeneSequence(first);
      const parsedSecond = parseGeneSequence(second);
      const nextResult =
        mode === "odd"
          ? crossoverOddPositions(parsedFirst, parsedSecond)
          : mode === "even"
            ? crossoverEvenPositions(parsedFirst, parsedSecond)
            : crossoverByPositions(parsedFirst, parsedSecond, parsePositionList(customPositions));
      setResult(nextResult);
      setError("");
    } catch (caughtError) {
      setResult(null);
      setError(caughtError instanceof Error ? caughtError.message : "計算できませんでした。");
    }
  };

  const loadSample = () => {
    setFirst("1010101");
    setSecond("1110000");
    setMode("odd");
    setCustomPositions("1,3,5,7");
    setResult(null);
    setError("");
    setCopyLabel("答えをコピー");
  };

  const reset = () => {
    setFirst("");
    setSecond("");
    setMode("odd");
    setCustomPositions("");
    setResult(null);
    setError("");
    setCopyLabel("答えをコピー");
  };

  return (
    <section className="card">
      <p className="section-kicker">奇数位置交叉</p>
      <h2>指定した位置の遺伝子を交換</h2>
      <p className="description">位置は1番目から数えます。初期設定では1、3、5、7番目のような奇数位置を交換します。</p>

      <div className="grid-2">
        <label>
          <span>個体1の遺伝子列</span>
          <input value={first} onChange={(event) => setFirst(event.target.value)} aria-label="奇数位置交叉の個体1の遺伝子列" />
        </label>
        <label>
          <span>個体2の遺伝子列</span>
          <input value={second} onChange={(event) => setSecond(event.target.value)} aria-label="奇数位置交叉の個体2の遺伝子列" />
        </label>
        <label>
          <span>交換方法</span>
          <select value={mode} onChange={(event) => setMode(event.target.value as CrossoverMode)} aria-label="交換方法">
            <option value="odd">奇数位置</option>
            <option value="even">偶数位置</option>
            <option value="custom">ユーザー指定位置</option>
          </select>
        </label>
        <label>
          <span>ユーザー指定位置</span>
          <input
            value={customPositions}
            onChange={(event) => setCustomPositions(event.target.value)}
            aria-label="ユーザー指定の交換位置"
            disabled={mode !== "custom"}
          />
        </label>
      </div>

      <ChromosomeDiagram
        first={firstGenes}
        second={secondGenes}
        start={1}
        highlightPositions={previewPositions}
        markerLabel="交換対象"
      />

      <div className="button-row">
        <button type="button" onClick={calculate}>計算する</button>
        <button type="button" className="secondary-button" onClick={loadSample}>サンプル入力</button>
        <button type="button" className="secondary-button" onClick={reset}>リセット</button>
      </div>

      {error && <p className="error-message">{error}</p>}
      {result && (
        <ResultCard title="交叉結果">
          <dl className="result-list">
            <div><dt>交叉前の個体1</dt><dd className="mono-text">{firstGenes.join("")}</dd></div>
            <div><dt>交叉前の個体2</dt><dd className="mono-text">{secondGenes.join("")}</dd></div>
            <div><dt>交換対象となる位置</dt><dd>{result.exchangedPositions.join("、")}番目</dd></div>
            <div><dt>交叉後の個体1</dt><dd className="correct-result mono-text">{result.firstChild.join("")}</dd></div>
            <div><dt>交叉後の個体2</dt><dd className="correct-result mono-text">{result.secondChild.join("")}</dd></div>
          </dl>
          <p className="answer-line correct-result">{answer}</p>
          <button type="button" className="copy-button" onClick={async () => { await navigator.clipboard.writeText(answer); setCopyLabel("コピーしました"); }}>{copyLabel}</button>
          <CalculationSteps steps={result.firstChild.map((gene, index) => {
            const position = index + 1;
            const source = result.exchangedPositions.includes(position) ? "個体2" : "個体1";
            return `交叉後の個体1 位置${position}: ${source}の${gene}`;
          }).concat(result.secondChild.map((gene, index) => {
            const position = index + 1;
            const source = result.exchangedPositions.includes(position) ? "個体1" : "個体2";
            return `交叉後の個体2 位置${position}: ${source}の${gene}`;
          }))} />
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

function getPreviewPositions(mode: CrossoverMode, geneCount: number, customPositions: string): number[] {
  if (mode === "custom") {
    try {
      return parsePositionList(customPositions);
    } catch {
      return [];
    }
  }

  const start = mode === "odd" ? 1 : 2;
  return Array.from({ length: Math.ceil(geneCount / 2) }, (_, index) => start + index * 2).filter(
    (position) => position <= geneCount,
  );
}
