import { useState } from "react";
import { formatNumberWithCommas, formatRawNumber } from "../../lib/format";
import {
  calculateQuadraticFitness,
  findTheoreticalMaximumFitness,
} from "../../lib/genetic/fitness";
import type { MaximumFitnessResult } from "../../types/genetic";
import { ResultCard } from "../ResultCard";
import { CalculationSteps } from "../reinforcement/CalculationSteps";
import { FitnessRankingTable } from "./FitnessRankingTable";

export function MaximumFitnessCalculator() {
  const [bitLength, setBitLength] = useState("7");
  const [a, setA] = useState("1");
  const [b, setB] = useState("-20");
  const [c, setC] = useState("10");
  const [result, setResult] = useState<MaximumFitnessResult | null>(null);
  const [error, setError] = useState("");
  const [copyLabel, setCopyLabel] = useState("答えをコピー");

  const calculate = () => {
    setCopyLabel("答えをコピー");
    try {
      const parsedBitLength = parseNumberInput(bitLength, "ビット数");
      const parsedA = parseNumberInput(a, "係数a");
      const parsedB = parseNumberInput(b, "係数b");
      const parsedC = parseNumberInput(c, "係数c");
      setResult(findTheoreticalMaximumFitness(parsedBitLength, parsedA, parsedB, parsedC));
      setError("");
    } catch (caughtError) {
      setResult(null);
      setError(caughtError instanceof Error ? caughtError.message : "計算できませんでした。");
    }
  };

  const loadSample = () => {
    setBitLength("7");
    setA("1");
    setB("-20");
    setC("10");
    setResult(null);
    setError("");
    setCopyLabel("答えをコピー");
  };

  const reset = () => {
    setBitLength("");
    setA("");
    setB("");
    setC("");
    setResult(null);
    setError("");
    setCopyLabel("答えをコピー");
  };

  const parsedA = Number(a);
  const parsedB = Number(b);
  const parsedC = Number(c);
  const best = result?.bestIndividuals[0];
  const answer = result
    ? `${formatRawNumber(result.maximumFitness)} ${result.bestIndividuals.map((item) => `${item.decimalValue}:${item.genes}`).join(" ")}`
    : "";

  return (
    <section className="card">
      <p className="section-kicker">最大適応度</p>
      <h2>全探索で理論上の最大値を確認</h2>
      <p className="description">遺伝子列を符号なし2進数として整数xに変換し、f(x) = ax² + bx + c を全組み合わせで調べます。</p>

      <div className="grid-2">
        <label>
          <span>遺伝子のビット数</span>
          <input type="number" min="1" max="20" step="1" value={bitLength} onChange={(event) => setBitLength(event.target.value)} aria-label="遺伝子のビット数" />
        </label>
        <label>
          <span>係数a</span>
          <input value={a} onChange={(event) => setA(event.target.value)} aria-label="適応度関数の係数a" />
        </label>
        <label>
          <span>係数b</span>
          <input value={b} onChange={(event) => setB(event.target.value)} aria-label="適応度関数の係数b" />
        </label>
        <label>
          <span>係数c</span>
          <input value={c} onChange={(event) => setC(event.target.value)} aria-label="適応度関数の係数c" />
        </label>
      </div>

      <div className="button-row">
        <button type="button" onClick={calculate}>計算する</button>
        <button type="button" className="secondary-button" onClick={loadSample}>サンプル入力</button>
        <button type="button" className="secondary-button" onClick={reset}>リセット</button>
      </div>

      {error && <p className="error-message">{error}</p>}
      {result && best && (
        <ResultCard title="最大適応度の結果">
          <div className="summary-grid">
            <div><span>最大適応度</span><strong className="big-result correct-result">{formatRawNumber(result.maximumFitness)}</strong></div>
            <div><span>整数x</span><strong>{result.bestIndividuals.map((item) => item.decimalValue).join("、")}</strong></div>
            <div><span>遺伝子列</span><strong className="mono-text">{result.bestIndividuals.map((item) => item.genes).join("、")}</strong></div>
          </div>
          <dl className="result-list">
            <div><dt>ビット数</dt><dd>{result.bitLength}</dd></div>
            <div><dt>組み合わせ数</dt><dd>{formatNumberWithCommas(String(result.combinationCount))}</dd></div>
            <div><dt>探索範囲</dt><dd>0 ≦ x ≦ {result.combinationCount - 1}</dd></div>
            <div><dt>使用した適応度関数</dt><dd>{formatFitnessFormula(parsedA, parsedB, parsedC)}</dd></div>
            <div><dt>全探索した組み合わせ数</dt><dd>{formatNumberWithCommas(String(result.combinationCount))}</dd></div>
          </dl>
          <p className="answer-line correct-result">{answer}</p>
          <button type="button" className="copy-button" onClick={async () => { await navigator.clipboard.writeText(answer); setCopyLabel("コピーしました"); }}>{copyLabel}</button>
          <h3 className="subheading">上位の適応度一覧</h3>
          <FitnessRankingTable evaluations={result.topEvaluations} />
          <CalculationSteps steps={[
            `探索範囲: 0 ≦ x ≦ ${result.combinationCount - 1}`,
            `組み合わせ数: 2^${result.bitLength} = ${result.combinationCount}`,
            `最大候補: x = ${best.decimalValue}, 遺伝子列 = ${best.genes}`,
            `f(${best.decimalValue}) = ${formatRawNumber(calculateQuadraticFitness(best.decimalValue, parsedA, parsedB, parsedC))}`,
          ]} />
        </ResultCard>
      )}
    </section>
  );
}

function formatFitnessFormula(a: number, b: number, c: number): string {
  return `f(x) = ${formatRawNumber(a)}x² ${formatSignedTerm(b, "x")} ${formatSignedTerm(c, "")}`;
}

function formatSignedTerm(value: number, suffix: string): string {
  const sign = value >= 0 ? "+" : "-";
  return `${sign} ${formatRawNumber(Math.abs(value))}${suffix}`;
}

function parseNumberInput(value: string, label: string): number {
  if (value.trim() === "") {
    throw new Error(`${label}を入力してください。`);
  }
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`${label}は有限の数値で入力してください。`);
  }
  return parsed;
}
