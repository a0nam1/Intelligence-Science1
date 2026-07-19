import { useState } from "react";
import { formatFixed4, formatRawNumber } from "../../lib/format";
import { formatDerivativeExpression, formatQuadraticExpression } from "../../lib/optimization/expressionFormatter";
import { evaluateQuadratic } from "../../lib/optimization/quadratic";
import { parseRequiredNumber } from "../../lib/optimization/validation";
import type { QuadraticCoefficients } from "../../types/optimization";
import { ResultCard } from "../ResultCard";
import { CalculationSteps } from "../reinforcement/CalculationSteps";
import { FormulaDisplay } from "./FormulaDisplay";

type QuadraticResult = {
  coefficients: QuadraticCoefficients;
  x: number;
  ax2: number;
  bx: number;
  c: number;
  value: number;
};

export function QuadraticCalculator() {
  const [a, setA] = useState("-0.5");
  const [b, setB] = useState("5");
  const [c, setC] = useState("-2.5");
  const [x, setX] = useState("3.14");
  const [result, setResult] = useState<QuadraticResult | null>(null);
  const [error, setError] = useState("");
  const [copyLabel, setCopyLabel] = useState("答えをコピー");

  const buildCoefficients = (): QuadraticCoefficients => ({
    a: parseRequiredNumber(a, "x²の係数a"),
    b: parseRequiredNumber(b, "xの係数b"),
    c: parseRequiredNumber(c, "定数項c"),
  });

  const calculate = () => {
    setCopyLabel("答えをコピー");
    try {
      const coefficients = buildCoefficients();
      const inputX = parseRequiredNumber(x, "入力値x");
      const value = evaluateQuadratic(coefficients, inputX);
      setResult({
        coefficients,
        x: inputX,
        ax2: coefficients.a * inputX * inputX,
        bx: coefficients.b * inputX,
        c: coefficients.c,
        value,
      });
      setError("");
    } catch (caughtError) {
      setResult(null);
      setError(caughtError instanceof Error ? caughtError.message : "計算できませんでした。");
    }
  };

  const loadSample = () => {
    setA("-0.5");
    setB("5");
    setC("-2.5");
    setX("3.14");
    setResult(null);
    setError("");
    setCopyLabel("答えをコピー");
  };

  const reset = () => {
    setA("");
    setB("");
    setC("");
    setX("");
    setResult(null);
    setError("");
    setCopyLabel("答えをコピー");
  };

  const copy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(formatFixed4(result.value));
    setCopyLabel("コピーしました");
  };

  const previewCoefficients = {
    a: Number(a),
    b: Number(b),
    c: Number(c),
  };

  return (
    <section className="card wide-card">
      <p className="section-kicker">二次関数</p>
      <h2>二次関数の出力計算と微分</h2>
      <p className="description">f(x) = ax² + bx + c に x を代入し、導関数 f'(x) = 2ax + b も表示します。</p>

      <div className="grid-2">
        <label><span>x²の係数 a</span><input type="number" step="any" value={a} onChange={(event) => setA(event.target.value)} /></label>
        <label><span>xの係数 b</span><input type="number" step="any" value={b} onChange={(event) => setB(event.target.value)} /></label>
        <label><span>定数項 c</span><input type="number" step="any" value={c} onChange={(event) => setC(event.target.value)} /></label>
        <label><span>入力値 x</span><input type="number" step="any" value={x} onChange={(event) => setX(event.target.value)} /></label>
      </div>

      {Number.isFinite(previewCoefficients.a) && Number.isFinite(previewCoefficients.b) && Number.isFinite(previewCoefficients.c) && (
        <div className="formula-row">
          <FormulaDisplay title="入力された二次関数">{formatQuadraticExpression(previewCoefficients)}</FormulaDisplay>
          <FormulaDisplay title="導関数" accent>{formatDerivativeExpression(previewCoefficients)}</FormulaDisplay>
        </div>
      )}

      <div className="button-row">
        <button type="button" onClick={calculate} aria-label="二次関数を計算する">計算する</button>
        <button type="button" className="secondary-button" onClick={loadSample} aria-label="サンプルCを入力する">サンプル入力</button>
        <button type="button" className="secondary-button" onClick={reset} aria-label="二次関数入力をリセットする">リセット</button>
      </div>

      {error && <p className="error-message">{error}</p>}
      {result && (
        <ResultCard title="計算結果">
          <dl className="result-list">
            <div><dt>入力された二次関数</dt><dd>{formatQuadraticExpression(result.coefficients)}</dd></div>
            <div><dt>各項の値</dt><dd>{formatRawNumber(result.ax2)} + {formatRawNumber(result.bx)} + {formatRawNumber(result.c)}</dd></div>
            <div><dt>丸める前の計算結果</dt><dd>{formatRawNumber(result.value)}</dd></div>
            <div><dt>答え</dt><dd className="big-result correct-result">{formatFixed4(result.value)}</dd></div>
          </dl>
          <button type="button" className="copy-button" onClick={copy}>{copyLabel}</button>
          <CalculationSteps
            steps={[
              `f(${formatRawNumber(result.x)})`,
              `= ${formatRawNumber(result.coefficients.a)} × ${formatRawNumber(result.x)}² + ${formatRawNumber(result.coefficients.b)} × ${formatRawNumber(result.x)} + ${formatRawNumber(result.coefficients.c)}`,
              `= ${formatRawNumber(result.ax2)} + ${formatRawNumber(result.bx)} + ${formatRawNumber(result.c)}`,
              `= ${formatFixed4(result.value)}`,
            ]}
          />
        </ResultCard>
      )}
    </section>
  );
}
