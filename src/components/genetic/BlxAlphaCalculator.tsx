import { useState } from "react";
import { formatFixed4 } from "../../lib/format";
import { calculateBlxAlphaRange } from "../../lib/genetic/blxAlpha";
import type { BlxAlphaResult } from "../../types/genetic";
import { ResultCard } from "../ResultCard";
import { CalculationSteps } from "../reinforcement/CalculationSteps";

export function BlxAlphaCalculator() {
  const [first, setFirst] = useState("1.15");
  const [second, setSecond] = useState("-3.85");
  const [alpha, setAlpha] = useState("0.5");
  const [result, setResult] = useState<BlxAlphaResult | null>(null);
  const [error, setError] = useState("");

  const calculate = () => {
    try {
      setResult(calculateBlxAlphaRange(Number(first), Number(second), Number(alpha)));
      setError("");
    } catch (caughtError) {
      setResult(null);
      setError(caughtError instanceof Error ? caughtError.message : "計算できませんでした。");
    }
  };

  const copy = async (value: number) => {
    await navigator.clipboard.writeText(formatFixed4(value));
  };

  return (
    <section className="card">
      <p className="section-kicker">BLX-α</p>
      <h2>実数値交叉の範囲</h2>
      <div className="grid-2">
        <label><span>親遺伝子1</span><input type="number" step="any" value={first} onChange={(event) => setFirst(event.target.value)} /></label>
        <label><span>親遺伝子2</span><input type="number" step="any" value={second} onChange={(event) => setSecond(event.target.value)} /></label>
        <label><span>α</span><input type="number" step="any" value={alpha} onChange={(event) => setAlpha(event.target.value)} /></label>
      </div>
      <div className="button-row">
        <button type="button" onClick={calculate}>計算する</button>
        <button type="button" className="secondary-button" onClick={() => { setFirst("1.15"); setSecond("-3.85"); setAlpha("0.5"); setResult(null); setError(""); }}>サンプル1</button>
        <button type="button" className="secondary-button" onClick={() => { setFirst("1.15"); setSecond("-3.85"); setAlpha("9999.9999"); setResult(null); setError(""); }}>サンプル2</button>
        <button type="button" className="secondary-button" onClick={() => { setFirst(""); setSecond(""); setAlpha(""); setResult(null); setError(""); }}>リセット</button>
      </div>
      {error && <p className="error-message">{error}</p>}
      {result && (
        <ResultCard title="計算結果">
          <div className="summary-grid">
            <div><span>最小値</span><strong className="correct-result">{formatFixed4(result.lowerBound)}</strong></div>
            <div><span>最大値</span><strong className="correct-result">{formatFixed4(result.upperBound)}</strong></div>
            <div><span>平均値</span><strong className="correct-result">{formatFixed4(result.average)}</strong></div>
          </div>
          <dl className="result-list">
            <div><dt>小さい親遺伝子</dt><dd>{formatFixed4(result.minimumParent)}</dd></div>
            <div><dt>大きい親遺伝子</dt><dd>{formatFixed4(result.maximumParent)}</dd></div>
            <div><dt>距離 I</dt><dd>{formatFixed4(result.interval)}</dd></div>
            <div><dt>αI</dt><dd>{formatFixed4(result.extension)}</dd></div>
          </dl>
          <div className="button-row">
            <button type="button" className="copy-button" onClick={() => copy(result.lowerBound)}>最小値をコピー</button>
            <button type="button" className="copy-button" onClick={() => copy(result.upperBound)}>最大値をコピー</button>
            <button type="button" className="copy-button" onClick={() => copy(result.average)}>平均値をコピー</button>
          </div>
          <CalculationSteps steps={[`I = ${formatFixed4(result.maximumParent)} - (${formatFixed4(result.minimumParent)}) = ${formatFixed4(result.interval)}`, `αI = ${formatFixed4(Number(alpha))} × ${formatFixed4(result.interval)} = ${formatFixed4(result.extension)}`, `lower = ${formatFixed4(result.lowerBound)}`, `upper = ${formatFixed4(result.upperBound)}`, `average = ${formatFixed4(result.average)}`]} />
        </ResultCard>
      )}
    </section>
  );
}
