import { useState } from "react";
import { formatFixed4, formatRawNumber } from "../../lib/format";
import { updateTdValue } from "../../lib/reinforcement/td";
import type { TdUpdateResult } from "../../types/reinforcement";
import { ResultCard } from "../ResultCard";
import { CalculationSteps } from "./CalculationSteps";
import { StateTransitionDiagram } from "./StateTransitionDiagram";

type TdResult = TdUpdateResult & {
  currentState: string;
  nextState: string;
  gamma: number;
  alpha: number;
  terminal: boolean;
};

const sample = {
  currentState: "S3",
  currentValue: "30",
  nextState: "S4",
  nextValue: "40",
  reward: "0",
  alpha: "0.1",
  gamma: "1",
  terminal: false,
  noDiscount: false,
};

function parseNumber(value: string, label: string): number {
  const parsed = Number(value);
  if (!value.trim() || !Number.isFinite(parsed)) {
    throw new Error(`${label}を正しい数値で入力してください。`);
  }
  return parsed;
}

export function TdValueCalculator() {
  const [form, setForm] = useState(sample);
  const [result, setResult] = useState<TdResult | null>(null);
  const [error, setError] = useState("");
  const [copyLabel, setCopyLabel] = useState("答えをコピー");

  const setField = (key: keyof typeof form, value: string | boolean) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const calculate = () => {
    setCopyLabel("答えをコピー");
    try {
      const currentValue = parseNumber(form.currentValue, "現在の状態価値");
      const nextValue = parseNumber(form.nextValue, "移動先の状態価値");
      const reward = parseNumber(form.reward, "即時報酬");
      const alpha = parseNumber(form.alpha, "学習率α");
      const gamma = form.noDiscount ? 1 : parseNumber(form.gamma, "割引率γ");
      const td = updateTdValue(currentValue, nextValue, reward, alpha, gamma, form.terminal);
      setResult({
        ...td,
        currentState: form.currentState.trim() || "S",
        nextState: form.nextState.trim() || "S'",
        gamma,
        alpha,
        terminal: form.terminal,
      });
      setError("");
    } catch (caughtError) {
      setResult(null);
      setError(caughtError instanceof Error ? caughtError.message : "計算できませんでした。");
    }
  };

  const reset = () => {
    setForm({ ...sample, currentValue: "", nextValue: "", reward: "", alpha: "", gamma: "" });
    setResult(null);
    setError("");
    setCopyLabel("答えをコピー");
  };

  const loadSample = () => {
    setForm(sample);
    setResult(null);
    setError("");
    setCopyLabel("答えをコピー");
  };

  const copy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(formatFixed4(result.updatedValue));
    setCopyLabel("コピーしました");
  };

  return (
    <section className="card wide-card">
      <p className="section-kicker">TD学習</p>
      <h2>状態価値関数の更新</h2>
      <p className="description">V(s) ← V(s) + α {"{ r + γV(s') - V(s) }"} を1回分計算します。</p>

      <StateTransitionDiagram
        currentState={form.currentState || "S3"}
        states={[
          { state: "G1", terminal: true },
          { state: "S1", value: 10 },
          { state: "S2", value: 20 },
          { state: "S3", value: Number(form.currentValue) },
          { state: "S4", value: Number(form.nextValue) },
          { state: "S5", value: 50 },
          { state: "G2", terminal: true },
        ]}
      />

      <div className="grid-2">
        <label>
          <span>更新対象の状態名</span>
          <input value={form.currentState} onChange={(event) => setField("currentState", event.target.value)} />
        </label>
        <label>
          <span>現在の状態価値 V(s)</span>
          <input type="number" step="any" value={form.currentValue} onChange={(event) => setField("currentValue", event.target.value)} />
        </label>
        <label>
          <span>移動先の状態名</span>
          <input value={form.nextState} onChange={(event) => setField("nextState", event.target.value)} />
        </label>
        <label>
          <span>移動先の状態価値 V(s')</span>
          <input type="number" step="any" value={form.nextValue} onChange={(event) => setField("nextValue", event.target.value)} />
        </label>
        <label>
          <span>即時報酬 r</span>
          <input type="number" step="any" value={form.reward} onChange={(event) => setField("reward", event.target.value)} />
        </label>
        <label>
          <span>学習率 α</span>
          <input type="number" step="any" value={form.alpha} onChange={(event) => setField("alpha", event.target.value)} />
        </label>
        <label>
          <span>割引率 γ</span>
          <input
            type="number"
            step="any"
            value={form.gamma}
            disabled={form.noDiscount}
            onChange={(event) => setField("gamma", event.target.value)}
          />
        </label>
        <label className="check-label">
          <input type="checkbox" checked={form.noDiscount} onChange={(event) => setField("noDiscount", event.target.checked)} />
          <span>割引率を使用しない（γ=1）</span>
        </label>
        <label className="check-label">
          <input type="checkbox" checked={form.terminal} onChange={(event) => setField("terminal", event.target.checked)} />
          <span>移動先は終端状態</span>
        </label>
      </div>

      <div className="button-row">
        <button type="button" onClick={calculate}>計算する</button>
        <button type="button" className="secondary-button" onClick={loadSample}>サンプル入力</button>
        <button type="button" className="secondary-button" onClick={reset}>リセット</button>
      </div>

      {error && <p className="error-message">{error}</p>}
      {result && (
        <ResultCard title="計算結果">
          <dl className="result-list">
            <div>
              <dt>TD誤差</dt>
              <dd>{formatFixed4(result.tdError)}</dd>
            </div>
            <div>
              <dt>更新前の状態価値</dt>
              <dd>{formatFixed4(result.previousValue)}</dd>
            </div>
            <div>
              <dt>更新後の状態価値</dt>
              <dd className="big-result correct-result">{formatFixed4(result.updatedValue)}</dd>
            </div>
          </dl>
          <button type="button" className="copy-button" onClick={copy}>{copyLabel}</button>
          <CalculationSteps
            steps={[
              `V(${result.currentState})`,
              `= ${formatRawNumber(result.previousValue)} + ${formatRawNumber(result.alpha)} × {${formatRawNumber(result.reward)} + ${formatRawNumber(result.gamma)} × ${formatRawNumber(result.nextValue)} - ${formatRawNumber(result.previousValue)}}`,
              `= ${formatRawNumber(result.previousValue)} + ${formatRawNumber(result.alpha)} × ${formatRawNumber(result.tdError)}`,
              `= ${formatFixed4(result.updatedValue)}`,
            ]}
          />
        </ResultCard>
      )}
    </section>
  );
}
