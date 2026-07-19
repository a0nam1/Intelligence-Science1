import { useState } from "react";
import { formatRawNumber } from "../../lib/format";
import { formatNumberFixed4 } from "../../lib/neural/formatter";
import { runForwardCalculation } from "../../lib/neural/neuron";
import type { ForwardResult } from "../../types/neural";
import { ResultCard } from "../ResultCard";
import { CalculationSteps } from "../reinforcement/CalculationSteps";
import { NeuronDiagram } from "./NeuronDiagram";
import { NumberListEditor } from "./NumberListEditor";

const sampleAWeights = [9999.9999, 1.1111];
const sampleAInputs = [0, 1];
const sampleBWeights = [2.0, 4.0, 8.0, 1.6, 3.2, 6.4, 1.28, 2.56, 5.12, 10.24, 1.1, 4.4, 7.7, 2.2, 5.5, 8.8, 3.3, 6.6, 9.9, 0.001];
const sampleBInputs = [0.0, 1.1, 2.2, 3.3, 4.4, 5.5, 6.6, 7.7, 8.8, 9.9, -0.1, -0.2, -0.3, -0.4, -0.5, -0.6, -0.7, -0.8, -0.9, -1.0];

export function SimpleNeuronCalculator() {
  const [weights, setWeights] = useState(sampleAWeights);
  const [inputs, setInputs] = useState(sampleAInputs);
  const [theta, setTheta] = useState("1");
  const [result, setResult] = useState<ForwardResult | null>(null);
  const [error, setError] = useState("");
  const [copyLabel, setCopyLabel] = useState("答えをコピー");

  const calculate = () => {
    setCopyLabel("答えをコピー");
    try {
      setResult(runForwardCalculation(weights, inputs, Number(theta)));
      setError("");
    } catch (caughtError) {
      setResult(null);
      setError(caughtError instanceof Error ? caughtError.message : "計算できませんでした。");
    }
  };

  const loadSample = (sample: "A" | "B") => {
    setWeights(sample === "A" ? sampleAWeights : sampleBWeights);
    setInputs(sample === "A" ? sampleAInputs : sampleBInputs);
    setTheta(sample === "A" ? "1" : "222.222");
    setResult(null);
    setError("");
    setCopyLabel("答えをコピー");
  };

  const copy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(formatNumberFixed4(result.weightedSum));
    setCopyLabel("コピーしました");
  };

  return (
    <section className="card wide-card">
      <p className="section-kicker">単純ニューロン</p>
      <h2>活性化関数に通す前の値 z</h2>
      <p className="description">z = Σ(wi xi) - θ を計算します。重みと入力は表または一括入力で指定できます。</p>

      <NeuronDiagram weights={weights} inputs={inputs} theta={Number(theta)} activationName="活性化前" output={result?.weightedSum} />
      <NumberListEditor weights={weights} inputs={inputs} onChangeWeights={setWeights} onChangeInputs={setInputs} onError={setError} />

      <label>
        <span>閾値 θ</span>
        <input type="number" step="any" value={theta} onChange={(event) => setTheta(event.target.value)} />
      </label>

      <div className="button-row">
        <button type="button" onClick={calculate}>計算する</button>
        <button type="button" className="secondary-button" onClick={() => loadSample("A")}>サンプルA</button>
        <button type="button" className="secondary-button" onClick={() => loadSample("B")}>サンプルB</button>
        <button type="button" className="secondary-button" onClick={() => { setWeights([0]); setInputs([0]); setTheta(""); setResult(null); setError(""); }}>リセット</button>
      </div>

      {error && <p className="error-message">{error}</p>}
      {result && (
        <ResultCard title="計算結果">
          <dl className="result-list">
            <div><dt>使用した式</dt><dd>z = Σ(wi xi) - θ</dd></div>
            <div><dt>各項 wi xi</dt><dd>{result.weightedTerms.map((term) => formatNumberFixed4(term)).join(" + ")}</dd></div>
            <div><dt>Σ(wi xi)</dt><dd>{formatNumberFixed4(result.weightedTermSum)}</dd></div>
            <div><dt>閾値 θ</dt><dd>{formatNumberFixed4(Number(theta))}</dd></div>
            <div><dt>z</dt><dd className="big-result correct-result">{formatNumberFixed4(result.weightedSum)}</dd></div>
          </dl>
          <button type="button" className="copy-button" onClick={copy}>{copyLabel}</button>
          <CalculationSteps
            steps={[
              `z = ${weights.map((weight, index) => `${formatRawNumber(weight)}×${formatRawNumber(inputs[index])}`).join(" + ")} - ${formatRawNumber(Number(theta))}`,
              `= ${formatRawNumber(result.weightedTermSum)} - ${formatRawNumber(Number(theta))}`,
              `= ${formatNumberFixed4(result.weightedSum)}`,
            ]}
          />
        </ResultCard>
      )}
    </section>
  );
}
