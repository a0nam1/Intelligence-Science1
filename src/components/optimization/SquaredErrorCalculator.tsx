import { useState } from "react";
import { formatFixed4, formatRawNumber } from "../../lib/format";
import { parseDataPoints } from "../../lib/optimization/dataParser";
import { formatQuadraticExpression } from "../../lib/optimization/expressionFormatter";
import { calculateSquaredError } from "../../lib/optimization/squaredError";
import { parseRequiredNumber } from "../../lib/optimization/validation";
import type { DataPoint, ErrorDetail, QuadraticCoefficients } from "../../types/optimization";
import { ResultCard } from "../ResultCard";
import { CalculationSteps } from "../reinforcement/CalculationSteps";
import { DataPointEditor } from "./DataPointEditor";
import { ErrorDetailsTable } from "./ErrorDetailsTable";
import { FormulaDisplay } from "./FormulaDisplay";
import { RegressionGraph } from "./RegressionGraph";

const sampleD: DataPoint[] = [
  { x: 0, y: 3 },
  { x: 3, y: 7 },
  { x: 7, y: 2 },
  { x: 4, y: 6 },
  { x: 10, y: -5 },
];

type ErrorResult = {
  coefficients: QuadraticCoefficients;
  details: ErrorDetail[];
  squaredErrorSum: number;
  totalError: number;
};

export function SquaredErrorCalculator() {
  const [a, setA] = useState("-0.5");
  const [b, setB] = useState("5");
  const [c, setC] = useState("-2.5");
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([{ x: 3.14, y: 10.5 }]);
  const [bulkInput, setBulkInput] = useState("(0, 3), (3, 7), (7, 2), (4, 6), (10, -5)");
  const [result, setResult] = useState<ErrorResult | null>(null);
  const [error, setError] = useState("");
  const [copyLabel, setCopyLabel] = useState("答えをコピー");

  const buildCoefficients = (): QuadraticCoefficients => ({
    a: parseRequiredNumber(a, "係数a"),
    b: parseRequiredNumber(b, "係数b"),
    c: parseRequiredNumber(c, "係数c"),
  });

  const calculate = () => {
    setCopyLabel("答えをコピー");
    try {
      const coefficients = buildCoefficients();
      const calculated = calculateSquaredError(coefficients, dataPoints);
      setResult({ coefficients, ...calculated });
      setError("");
    } catch (caughtError) {
      setResult(null);
      setError(caughtError instanceof Error ? caughtError.message : "計算できませんでした。");
    }
  };

  const applyBulkInput = () => {
    try {
      setDataPoints(parseDataPoints(bulkInput));
      setResult(null);
      setError("");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "一括入力を解析できませんでした。");
    }
  };

  const loadSample = (sample: "C" | "D" | "E") => {
    if (sample === "E") {
      setA("-0.2592");
      setB("1.7316");
      setC("3.3090");
      setDataPoints(sampleD);
    } else {
      setA("-0.5");
      setB("5");
      setC("-2.5");
      setDataPoints(sample === "C" ? [{ x: 3.14, y: 10.5 }] : sampleD);
    }
    setResult(null);
    setError("");
    setCopyLabel("答えをコピー");
  };

  const reset = () => {
    setA("");
    setB("");
    setC("");
    setDataPoints([{ x: 0, y: 0 }]);
    setResult(null);
    setError("");
  };

  const copy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(formatFixed4(result.totalError));
    setCopyLabel("コピーしました");
  };

  const previewCoefficients = { a: Number(a), b: Number(b), c: Number(c) };

  return (
    <section className="card wide-card">
      <p className="section-kicker">誤差関数</p>
      <h2>二乗誤差の計算</h2>
      <p className="description">E = 1/2 Σ(yi - f(xi))² を、各データの途中結果を丸めずに合計します。</p>

      <div className="grid-2">
        <label><span>係数 a</span><input type="number" step="any" value={a} onChange={(event) => setA(event.target.value)} /></label>
        <label><span>係数 b</span><input type="number" step="any" value={b} onChange={(event) => setB(event.target.value)} /></label>
        <label><span>係数 c</span><input type="number" step="any" value={c} onChange={(event) => setC(event.target.value)} /></label>
      </div>

      {Number.isFinite(previewCoefficients.a) && Number.isFinite(previewCoefficients.b) && Number.isFinite(previewCoefficients.c) && (
        <FormulaDisplay title="二次関数">{formatQuadraticExpression(previewCoefficients)}</FormulaDisplay>
      )}

      <DataPointEditor dataPoints={dataPoints} onChange={(points) => { setDataPoints(points); setResult(null); }} />

      <label>
        <span>学習データの一括入力</span>
        <textarea value={bulkInput} rows={4} onChange={(event) => setBulkInput(event.target.value)} />
      </label>

      <div className="button-row">
        <button type="button" className="secondary-button" onClick={applyBulkInput} aria-label="一括入力を表に反映する">一括入力を反映</button>
        <button type="button" onClick={calculate} aria-label="二乗誤差を計算する">計算する</button>
        <button type="button" className="secondary-button" onClick={() => loadSample("C")} aria-label="サンプルCを入力する">サンプルC</button>
        <button type="button" className="secondary-button" onClick={() => loadSample("D")} aria-label="サンプルDを入力する">サンプルD</button>
        <button type="button" className="secondary-button" onClick={() => loadSample("E")} aria-label="サンプルEを入力する">サンプルE</button>
        <button type="button" className="secondary-button" onClick={reset} aria-label="誤差関数入力をリセットする">リセット</button>
      </div>

      {error && <p className="error-message">{error}</p>}
      {result && (
        <ResultCard title="計算結果">
          <p className="answer-line correct-result">誤差E: {formatFixed4(result.totalError)}</p>
          <button type="button" className="copy-button" onClick={copy}>{copyLabel}</button>
          <RegressionGraph coefficients={result.coefficients} dataPoints={dataPoints} details={result.details} />
          <ErrorDetailsTable details={result.details} />
          <dl className="result-list">
            <div><dt>二乗誤差の合計</dt><dd>{formatRawNumber(result.squaredErrorSum)}</dd></div>
            <div><dt>二乗誤差の合計÷2</dt><dd>{formatRawNumber(result.totalError)}</dd></div>
            <div><dt>小数点以下第4位の答え</dt><dd className="big-result correct-result">{formatFixed4(result.totalError)}</dd></div>
          </dl>
          <CalculationSteps
            steps={[
              "E = 1/2 Σ(yi - f(xi))²",
              `二乗誤差の合計 = ${formatRawNumber(result.squaredErrorSum)}`,
              `E = 1/2 × ${formatRawNumber(result.squaredErrorSum)}`,
              `= ${formatFixed4(result.totalError)}`,
            ]}
          />
        </ResultCard>
      )}
    </section>
  );
}
