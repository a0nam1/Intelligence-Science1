import { useState } from "react";
import { formatNumberFixed4, formatNumberListFixed4 } from "../../lib/neural/formatter";
import { updatePerceptronWeights } from "../../lib/neural/learning";
import type { PerceptronUpdateResult } from "../../types/neural";
import { ResultCard } from "../ResultCard";
import { CalculationSteps } from "../reinforcement/CalculationSteps";
import { NeuronDiagram } from "./NeuronDiagram";
import { NumberListEditor } from "./NumberListEditor";

const sampleCWeights = [-0.1, 0.2];
const sampleCInputs = [1, 1];
const sampleDWeights = [0.1, -0.2, 0.4, -0.8, 1.6, -3.2, 6.4, -1.28, 2.56];
const sampleDInputs = [-8.8, -7.7, -6.6, -5.5, 4.4, 3.3, 2.2, 1.1, 0.0];

export function PerceptronLearningCalculator() {
  const [weights, setWeights] = useState(sampleCWeights);
  const [inputs, setInputs] = useState(sampleCInputs);
  const [theta, setTheta] = useState("-0.3");
  const [desired, setDesired] = useState("0");
  const [alpha, setAlpha] = useState("0.1");
  const [result, setResult] = useState<PerceptronUpdateResult | null>(null);
  const [error, setError] = useState("");
  const [copyLabel, setCopyLabel] = useState("答えをコピー");

  const calculate = () => {
    setCopyLabel("答えをコピー");
    try {
      setResult(updatePerceptronWeights(weights, inputs, Number(theta), Number(desired), Number(alpha)));
      setError("");
    } catch (caughtError) {
      setResult(null);
      setError(caughtError instanceof Error ? caughtError.message : "計算できませんでした。");
    }
  };

  const loadSample = (sample: "C" | "D") => {
    setWeights(sample === "C" ? sampleCWeights : sampleDWeights);
    setInputs(sample === "C" ? sampleCInputs : sampleDInputs);
    setTheta(sample === "C" ? "-0.3" : "12.345");
    setDesired(sample === "C" ? "0" : "1");
    setAlpha("0.1");
    setResult(null);
    setError("");
    setCopyLabel("答えをコピー");
  };

  const answer = result ? `${formatNumberListFixed4(result.updatedWeights)} ${formatNumberFixed4(result.updatedTheta)}` : "";

  const copyAnswer = async (value = answer) => {
    await navigator.clipboard.writeText(value);
    setCopyLabel("コピーしました");
  };

  return (
    <section className="card wide-card">
      <p className="section-kicker">ステップ関数の学習</p>
      <h2>ステップ関数ニューロンの1回学習</h2>
      <p className="description">w_i = w_i + α(d - y)x_i、θ = θ - α(d - y) で1回更新します。</p>

      <NeuronDiagram weights={weights} inputs={inputs} theta={Number(theta)} activationName="ステップ関数" output={result?.output} />
      <NumberListEditor weights={weights} inputs={inputs} onChangeWeights={setWeights} onChangeInputs={setInputs} onError={setError} />

      <div className="grid-2">
        <label><span>教師データ d</span><input type="number" step="any" value={desired} onChange={(event) => setDesired(event.target.value)} /></label>
        <label><span>閾値 θ</span><input type="number" step="any" value={theta} onChange={(event) => setTheta(event.target.value)} /></label>
        <label><span>学習率 α</span><input type="number" step="any" value={alpha} onChange={(event) => setAlpha(event.target.value)} /></label>
      </div>

      <div className="button-row">
        <button type="button" onClick={calculate}>計算する</button>
        <button type="button" className="secondary-button" onClick={() => loadSample("C")}>サンプルC</button>
        <button type="button" className="secondary-button" onClick={() => loadSample("D")}>サンプルD</button>
        <button type="button" className="secondary-button" onClick={() => { setWeights([0]); setInputs([0]); setTheta(""); setDesired(""); setAlpha(""); setResult(null); }}>リセット</button>
      </div>

      {error && <p className="error-message">{error}</p>}
      {result && (
        <ResultCard title="学習結果">
          <dl className="result-list">
            <div><dt>z</dt><dd>{formatNumberFixed4(result.weightedSum)}</dd></div>
            <div><dt>ステップ関数による出力 y</dt><dd>{result.output}</dd></div>
            <div><dt>誤差 d - y</dt><dd>{formatNumberFixed4(result.error)}</dd></div>
            <div><dt>更新後の重み</dt><dd className="correct-result">{formatNumberListFixed4(result.updatedWeights)}</dd></div>
            <div><dt>更新後の閾値 θ</dt><dd className="correct-result">{formatNumberFixed4(result.updatedTheta)}</dd></div>
          </dl>
          <p className="answer-line correct-result">{answer}</p>
          <div className="button-row">
            <button type="button" className="copy-button" onClick={() => copyAnswer()}>{copyLabel}</button>
            {result.updatedWeights.map((weight, index) => (
              <button type="button" className="secondary-button" key={index} onClick={() => copyAnswer(formatNumberFixed4(weight))}>w{index + 1}をコピー</button>
            ))}
            <button type="button" className="secondary-button" onClick={() => copyAnswer(formatNumberFixed4(result.updatedTheta))}>θをコピー</button>
          </div>
          <CalculationSteps
            steps={[
              `z = ${formatNumberFixed4(result.weightedSum)}`,
              `y = ${result.output}`,
              `d - y = ${formatNumberFixed4(result.error)}`,
              ...weights.map((weight, index) => `w${index + 1} = ${formatNumberFixed4(weight)} + ${formatNumberFixed4(Number(alpha))}×${formatNumberFixed4(result.error)}×${formatNumberFixed4(inputs[index])} = ${formatNumberFixed4(result.updatedWeights[index])}`),
              `θ = ${formatNumberFixed4(Number(theta))} - ${formatNumberFixed4(Number(alpha))}×${formatNumberFixed4(result.error)} = ${formatNumberFixed4(result.updatedTheta)}`,
            ]}
          />
        </ResultCard>
      )}
    </section>
  );
}
