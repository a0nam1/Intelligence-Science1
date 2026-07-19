import { useMemo, useState } from "react";
import { formatFixed4, formatRawNumber } from "../../lib/format";
import { formatDerivativeExpression, formatQuadraticExpression } from "../../lib/optimization/expressionFormatter";
import { isDiverging, runGradientDescent } from "../../lib/optimization/gradientDescent";
import { evaluateQuadratic } from "../../lib/optimization/quadratic";
import { parseRequiredNumber } from "../../lib/optimization/validation";
import type { GradientDescentStep, QuadraticCoefficients } from "../../types/optimization";
import { ResultCard } from "../ResultCard";
import { CalculationSteps } from "../reinforcement/CalculationSteps";
import { FormulaDisplay } from "./FormulaDisplay";
import { GradientDescentGraph } from "./GradientDescentGraph";

type SampleKind = "A" | "B";

export function GradientDescentCalculator() {
  const [a, setA] = useState("3");
  const [b, setB] = useState("-6");
  const [c, setC] = useState("-9");
  const [initialX, setInitialX] = useState("1.48");
  const [alpha, setAlpha] = useState("0.1");
  const [iterations, setIterations] = useState("1");
  const [steps, setSteps] = useState<GradientDescentStep[]>([]);
  const [error, setError] = useState("");
  const [copyLabel, setCopyLabel] = useState("答えをコピー");
  const [selectedIteration, setSelectedIteration] = useState(0);

  const coefficients = useMemo<QuadraticCoefficients>(() => ({ a: Number(a), b: Number(b), c: Number(c) }), [a, b, c]);
  const hasValidPreview = Number.isFinite(coefficients.a) && Number.isFinite(coefficients.b) && Number.isFinite(coefficients.c);

  const buildInputs = () => ({
    coefficients: {
      a: parseRequiredNumber(a, "二次関数の係数a"),
      b: parseRequiredNumber(b, "二次関数の係数b"),
      c: parseRequiredNumber(c, "二次関数の係数c"),
    },
    x: parseRequiredNumber(initialX, "更新前のx"),
    alphaValue: parseRequiredNumber(alpha, "学習率α"),
    iterationCount: Number(iterations),
  });

  const calculate = () => {
    setCopyLabel("答えをコピー");
    try {
      const input = buildInputs();
      const nextSteps = runGradientDescent(input.coefficients, input.x, input.alphaValue, input.iterationCount);
      setSteps(nextSteps);
      setSelectedIteration(nextSteps.length);
      setError("");
    } catch (caughtError) {
      setSteps([]);
      setError(caughtError instanceof Error ? caughtError.message : "計算できませんでした。");
    }
  };

  const loadSample = (sample: SampleKind) => {
    setA("3");
    setB("-6");
    setC("-9");
    setAlpha("0.1");
    setInitialX(sample === "A" ? "1.48" : "-2");
    setIterations(sample === "A" ? "1" : "4");
    setSteps([]);
    setError("");
    setCopyLabel("答えをコピー");
    setSelectedIteration(0);
  };

  const reset = () => {
    setA("");
    setB("");
    setC("");
    setInitialX("");
    setAlpha("");
    setIterations("1");
    setSteps([]);
    setError("");
  };

  const finalStep = steps.length ? steps[steps.length - 1] : null;
  const copy = async () => {
    if (!finalStep) return;
    await navigator.clipboard.writeText(formatFixed4(finalStep.updatedX));
    setCopyLabel("コピーしました");
  };

  return (
    <section className="card wide-card">
      <p className="section-kicker">最急降下法</p>
      <h2>二次関数に対する最急降下法</h2>
      <p className="description">各回の更新後のxを、次の回の更新前のxとして使います。更新回数の上限は100000回です。</p>

      <div className="grid-2">
        <label><span>二次関数の係数 a</span><input type="number" step="any" value={a} onChange={(event) => setA(event.target.value)} /></label>
        <label><span>二次関数の係数 b</span><input type="number" step="any" value={b} onChange={(event) => setB(event.target.value)} /></label>
        <label><span>二次関数の係数 c</span><input type="number" step="any" value={c} onChange={(event) => setC(event.target.value)} /></label>
        <label><span>更新前のx</span><input type="number" step="any" value={initialX} onChange={(event) => setInitialX(event.target.value)} /></label>
        <label><span>学習率 α</span><input type="number" step="any" value={alpha} onChange={(event) => setAlpha(event.target.value)} /></label>
        <label><span>更新回数</span><input type="number" step="1" value={iterations} onChange={(event) => setIterations(event.target.value)} /></label>
      </div>

      {hasValidPreview && (
        <div className="formula-row">
          <FormulaDisplay title="元の二次関数">{formatQuadraticExpression(coefficients)}</FormulaDisplay>
          <FormulaDisplay title="導関数" accent>{formatDerivativeExpression(coefficients)}</FormulaDisplay>
        </div>
      )}

      <div className="button-row">
        <button type="button" onClick={calculate} aria-label="最急降下法を計算する">計算する</button>
        <button type="button" className="secondary-button" onClick={() => loadSample("A")} aria-label="サンプルAを入力する">サンプルA</button>
        <button type="button" className="secondary-button" onClick={() => loadSample("B")} aria-label="サンプルBを入力する">サンプルB</button>
        <button type="button" className="secondary-button" onClick={reset} aria-label="最急降下法入力をリセットする">リセット</button>
      </div>

      {error && <p className="error-message">{error}</p>}
      {finalStep && (
        <ResultCard title="計算結果">
          {isDiverging(steps) && <p className="error-message">値が急激に増加しています。学習率が大きすぎる可能性があります。</p>}
          <div className="summary-grid">
            <div><span>更新前のx</span><strong>{formatFixed4(steps[0].previousX)}</strong></div>
            <div><span>更新前のf(x)</span><strong>{formatFixed4(evaluateQuadratic(coefficients, steps[0].previousX))}</strong></div>
            <div><span>勾配f'(x)</span><strong>{formatFixed4(steps[0].gradient)}</strong></div>
            <div><span>学習率</span><strong>{formatFixed4(Number(alpha))}</strong></div>
            <div><span>更新後のx</span><strong className="correct-result">{formatFixed4(finalStep.updatedX)}</strong></div>
            <div><span>更新後のf(x)</span><strong>{formatFixed4(finalStep.updatedY)}</strong></div>
          </div>
          <p className="answer-line correct-result">コピー用の答え: {formatFixed4(finalStep.updatedX)}</p>
          <button type="button" className="copy-button" onClick={copy}>{copyLabel}</button>
          <CalculationSteps
            steps={[
              `x(new) = x(old) - αf'(x(old))`,
              `f'(${formatRawNumber(steps[0].previousX)}) = ${formatRawNumber(2 * coefficients.a)} × ${formatRawNumber(steps[0].previousX)} + ${formatRawNumber(coefficients.b)} = ${formatRawNumber(steps[0].gradient)}`,
              `x(new) = ${formatRawNumber(steps[0].previousX)} - ${formatRawNumber(Number(alpha))} × ${formatRawNumber(steps[0].gradient)}`,
              `= ${formatFixed4(steps[0].updatedX)}`,
            ]}
          />
          <GradientDescentGraph coefficients={coefficients} steps={steps} selectedIteration={selectedIteration} onSelectIteration={setSelectedIteration} />
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>反復</th><th>更新前x</th><th>更新前f(x)</th><th>勾配</th><th>移動量</th><th>更新後x</th><th>更新後f(x)</th>
                </tr>
              </thead>
              <tbody>
                {steps.map((step) => (
                  <tr key={step.iteration}>
                    <td>{step.iteration}</td><td>{formatFixed4(step.previousX)}</td><td>{formatFixed4(step.previousY)}</td><td>{formatFixed4(step.gradient)}</td><td>{formatFixed4(step.movement)}</td><td>{formatFixed4(step.updatedX)}</td><td>{formatFixed4(step.updatedY)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ResultCard>
      )}
    </section>
  );
}
