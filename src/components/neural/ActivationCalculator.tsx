import { useState } from "react";
import { formatNumberFixed4 } from "../../lib/neural/formatter";
import { applySigmoidFunction, applyStepFunction } from "../../lib/neural/activation";
import { ResultCard } from "../ResultCard";
import { CalculationSteps } from "../reinforcement/CalculationSteps";
import { NeuronDiagram } from "./NeuronDiagram";

export function ActivationCalculator() {
  const [z, setZ] = useState("0.1111");
  const [result, setResult] = useState<{ z: number; step: number; sigmoid: number; expValue: number } | null>(null);
  const [error, setError] = useState("");
  const [copyLabel, setCopyLabel] = useState("答えをコピー");

  const calculate = () => {
    setCopyLabel("答えをコピー");
    const value = Number(z);
    if (!z.trim() || !Number.isFinite(value)) {
      setResult(null);
      setError("zは有限の数値で入力してください。");
      return;
    }
    setResult({
      z: value,
      step: applyStepFunction(value),
      sigmoid: applySigmoidFunction(value),
      expValue: Math.exp(-value),
    });
    setError("");
  };

  const copy = async (value: string) => {
    await navigator.clipboard.writeText(value);
    setCopyLabel("コピーしました");
  };

  return (
    <section className="card wide-card">
      <p className="section-kicker">活性化関数</p>
      <h2>ステップ関数とシグモイド関数</h2>
      <p className="description">zを入力し、ステップ関数とシグモイド関数の出力を計算します。</p>

      <NeuronDiagram weights={[1]} inputs={[Number(z)]} theta={0} activationName="ステップ / シグモイド" output={result?.sigmoid} />

      <label>
        <span>z</span>
        <input type="number" step="any" value={z} onChange={(event) => setZ(event.target.value)} />
      </label>

      <div className="button-row">
        <button type="button" onClick={calculate}>計算する</button>
        <button type="button" className="secondary-button" onClick={() => { setZ("0.1111"); setResult(null); setError(""); }}>サンプル1</button>
        <button type="button" className="secondary-button" onClick={() => { setZ("0.2190"); setResult(null); setError(""); }}>サンプル2</button>
        <button type="button" className="secondary-button" onClick={() => { setZ(""); setResult(null); setError(""); }}>リセット</button>
      </div>

      {error && <p className="error-message">{error}</p>}
      {result && (
        <ResultCard title="計算結果">
          <div className="summary-grid">
            <div><span>z</span><strong>{formatNumberFixed4(result.z)}</strong></div>
            <div><span>ステップ関数の出力</span><strong className="correct-result">{result.step}</strong></div>
            <div><span>exp(-z)</span><strong>{formatNumberFixed4(result.expValue)}</strong></div>
            <div><span>シグモイド関数の出力</span><strong className="correct-result">{formatNumberFixed4(result.sigmoid)}</strong></div>
          </div>
          <div className="button-row">
            <button type="button" className="copy-button" onClick={() => copy(String(result.step))}>{copyLabel}（step）</button>
            <button type="button" className="copy-button" onClick={() => copy(formatNumberFixed4(result.sigmoid))}>答えをコピー（sigmoid）</button>
          </div>
          <CalculationSteps
            steps={[
              `ステップ関数: z >= 0 なので y = ${result.step}`,
              `シグモイド関数: y = 1 / (1 + exp(-z))`,
              `= 1 / (1 + ${formatNumberFixed4(result.expValue)})`,
              `= ${formatNumberFixed4(result.sigmoid)}`,
            ]}
          />
        </ResultCard>
      )}
    </section>
  );
}
