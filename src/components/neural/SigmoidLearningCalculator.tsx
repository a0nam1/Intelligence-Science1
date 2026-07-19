import { useState } from "react";
import { formatNumberFixed4, formatNumberListFixed4 } from "../../lib/neural/formatter";
import { updateSigmoidNeuronWeights } from "../../lib/neural/learning";
import type { SigmoidUpdateResult } from "../../types/neural";
import { ResultCard } from "../ResultCard";
import { CalculationSteps } from "../reinforcement/CalculationSteps";
import { NeuronDiagram } from "./NeuronDiagram";
import { NumberListEditor } from "./NumberListEditor";

const sampleWeights = [-0.3, 0.6];
const sampleInputs = [1, 1];

export function SigmoidLearningCalculator() {
  const [weights, setWeights] = useState(sampleWeights);
  const [inputs, setInputs] = useState(sampleInputs);
  const [theta, setTheta] = useState("-0.9");
  const [desired, setDesired] = useState("0");
  const [alpha, setAlpha] = useState("0.1");
  const [result, setResult] = useState<SigmoidUpdateResult | null>(null);
  const [error, setError] = useState("");
  const [copyLabel, setCopyLabel] = useState("答えをコピー");

  const calculate = () => {
    setCopyLabel("答えをコピー");
    try {
      setResult(updateSigmoidNeuronWeights(weights, inputs, Number(theta), Number(desired), Number(alpha)));
      setError("");
    } catch (caughtError) {
      setResult(null);
      setError(caughtError instanceof Error ? caughtError.message : "計算できませんでした。");
    }
  };

  const loadSample = () => {
    setWeights(sampleWeights);
    setInputs(sampleInputs);
    setTheta("-0.9");
    setDesired("0");
    setAlpha("0.1");
    setResult(null);
    setError("");
    setCopyLabel("答えをコピー");
  };

  const answer = result ? `${formatNumberListFixed4(result.updatedWeights)} ${formatNumberFixed4(result.updatedTheta)}` : "";

  const copy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(answer);
    setCopyLabel("コピーしました");
  };

  return (
    <section className="card wide-card">
      <p className="section-kicker">シグモイド学習</p>
      <h2>シグモイドニューロンの1回学習</h2>
      <p className="description">w_i = w_i + α(d - y)x_i y(1 - y)、θ = θ - α(d - y)y(1 - y) で更新します。</p>

      <NeuronDiagram weights={weights} inputs={inputs} theta={Number(theta)} activationName="シグモイド関数" output={result?.output} />
      <NumberListEditor weights={weights} inputs={inputs} onChangeWeights={setWeights} onChangeInputs={setInputs} onError={setError} />

      <div className="grid-2">
        <label><span>教師データ d</span><input type="number" step="any" value={desired} onChange={(event) => setDesired(event.target.value)} /></label>
        <label><span>閾値 θ</span><input type="number" step="any" value={theta} onChange={(event) => setTheta(event.target.value)} /></label>
        <label><span>学習率 α</span><input type="number" step="any" value={alpha} onChange={(event) => setAlpha(event.target.value)} /></label>
      </div>

      <div className="button-row">
        <button type="button" onClick={calculate}>計算する</button>
        <button type="button" className="secondary-button" onClick={loadSample}>サンプルE</button>
        <button type="button" className="secondary-button" onClick={() => { setWeights([0]); setInputs([0]); setTheta(""); setDesired(""); setAlpha(""); setResult(null); }}>リセット</button>
      </div>

      {error && <p className="error-message">{error}</p>}
      {result && (
        <ResultCard title="学習結果">
          <dl className="result-list">
            <div><dt>z</dt><dd>{formatNumberFixed4(result.weightedSum)}</dd></div>
            <div><dt>シグモイド出力 y</dt><dd>{formatNumberFixed4(result.output)}</dd></div>
            <div><dt>y(1-y)</dt><dd>{formatNumberFixed4(result.derivativeFactor)}</dd></div>
            <div><dt>誤差 d - y</dt><dd>{formatNumberFixed4(result.error)}</dd></div>
            <div><dt>更新後の重み</dt><dd className="correct-result">{formatNumberListFixed4(result.updatedWeights)}</dd></div>
            <div><dt>更新後の閾値 θ</dt><dd className="correct-result">{formatNumberFixed4(result.updatedTheta)}</dd></div>
          </dl>
          <p className="answer-line correct-result">{answer}</p>
          <button type="button" className="copy-button" onClick={copy}>{copyLabel}</button>
          <CalculationSteps
            steps={[
              `z = ${formatNumberFixed4(result.weightedSum)}`,
              `y = 1 / (1 + exp(-z)) = ${formatNumberFixed4(result.output)}`,
              `y(1-y) = ${formatNumberFixed4(result.derivativeFactor)}`,
              `d - y = ${formatNumberFixed4(result.error)}`,
              ...weights.map((weight, index) => `w${index + 1} = ${formatNumberFixed4(weight)} + ${formatNumberFixed4(Number(alpha))}×${formatNumberFixed4(result.error)}×${formatNumberFixed4(inputs[index])}×${formatNumberFixed4(result.derivativeFactor)} = ${formatNumberFixed4(result.updatedWeights[index])}`),
              `θ = ${formatNumberFixed4(Number(theta))} - ${formatNumberFixed4(Number(alpha))}×${formatNumberFixed4(result.error)}×${formatNumberFixed4(result.derivativeFactor)} = ${formatNumberFixed4(result.updatedTheta)}`,
            ]}
          />
        </ResultCard>
      )}
    </section>
  );
}
