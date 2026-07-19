import { useState } from "react";
import { formatFixed4, formatRawNumber } from "../../lib/format";
import { calculateEpsilonGreedyProbability } from "../../lib/reinforcement/epsilonGreedy";
import type { ActionValue, EpsilonGreedyResult } from "../../types/reinforcement";
import { ResultCard } from "../ResultCard";
import { CalculationSteps } from "./CalculationSteps";

const sampleActions: ActionValue[] = [
  { action: "S1へ移動", value: 98 },
  { action: "S3へ移動", value: 33 },
];

function parseActionRows(rows: ActionValue[]): ActionValue[] {
  return rows.map((row) => ({
    action: row.action,
    value: Number(row.value),
  }));
}

export function EpsilonGreedyCalculator() {
  const [currentState, setCurrentState] = useState("S2");
  const [actions, setActions] = useState<ActionValue[]>(sampleActions);
  const [epsilon, setEpsilon] = useState("0.1");
  const [targetAction, setTargetAction] = useState("S1へ移動");
  const [result, setResult] = useState<EpsilonGreedyResult | null>(null);
  const [error, setError] = useState("");
  const [copyLabel, setCopyLabel] = useState("答えをコピー");

  const updateAction = (index: number, key: keyof ActionValue, value: string) => {
    setActions((current) =>
      current.map((action, actionIndex) =>
        actionIndex === index ? { ...action, [key]: key === "value" ? Number(value) : value } : action,
      ),
    );
  };

  const calculate = () => {
    setCopyLabel("答えをコピー");
    try {
      const calculated = calculateEpsilonGreedyProbability(parseActionRows(actions), targetAction, Number(epsilon));
      setResult(calculated);
      setError("");
    } catch (caughtError) {
      setResult(null);
      setError(caughtError instanceof Error ? caughtError.message : "計算できませんでした。");
    }
  };

  const loadSample = () => {
    setCurrentState("S2");
    setActions(sampleActions);
    setEpsilon("0.1");
    setTargetAction("S1へ移動");
    setResult(null);
    setError("");
    setCopyLabel("答えをコピー");
  };

  const copy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(formatFixed4(result.probability));
    setCopyLabel("コピーしました");
  };

  return (
    <section className="card wide-card">
      <p className="section-kicker">ε-greedy方策</p>
      <h2>特定の行動が選ばれる確率</h2>
      <p className="description">探索時は、選択可能なすべての行動から一様ランダムに選ぶ方式で計算します。</p>

      <div className="grid-2">
        <label><span>現在の状態</span><input value={currentState} onChange={(event) => setCurrentState(event.target.value)} /></label>
        <label><span>ε</span><input type="number" step="any" value={epsilon} onChange={(event) => setEpsilon(event.target.value)} /></label>
        <label><span>確率を求める対象の行動</span><input value={targetAction} onChange={(event) => setTargetAction(event.target.value)} /></label>
      </div>

      <div className="table-wrap">
        <table>
          <thead><tr><th>行動名</th><th>評価値</th><th>削除</th></tr></thead>
          <tbody>
            {actions.map((action, index) => (
              <tr key={`${action.action}-${index}`}>
                <td><input value={action.action} onChange={(event) => updateAction(index, "action", event.target.value)} /></td>
                <td><input type="number" step="any" value={Number.isNaN(action.value) ? "" : action.value} onChange={(event) => updateAction(index, "value", event.target.value)} /></td>
                <td><button type="button" className="danger-button" onClick={() => setActions(actions.filter((_, itemIndex) => itemIndex !== index))} disabled={actions.length <= 1}>削除</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="button-row">
        <button type="button" className="secondary-button" onClick={() => setActions([...actions, { action: `行動${actions.length + 1}`, value: 0 }])}>行動を追加</button>
        <button type="button" onClick={calculate}>計算する</button>
        <button type="button" className="secondary-button" onClick={loadSample}>サンプル入力</button>
        <button type="button" className="secondary-button" onClick={() => { setActions([]); setResult(null); setError(""); }}>リセット</button>
      </div>

      {error && <p className="error-message">{error}</p>}
      {result && (
        <ResultCard title="計算結果">
          <div className="summary-grid">
            <div><span>greedy行動</span><strong>{result.greedyActions.join("、")}</strong></div>
            <div><span>最大値</span><strong>{formatFixed4(result.maxValue)}</strong></div>
            <div><span>行動数</span><strong>{result.actionCount}</strong></div>
            <div><span>最大値を持つ行動数</span><strong>{result.greedyActionCount}</strong></div>
            <div><span>知識利用による確率</span><strong>{formatFixed4(result.exploitationProbability)}</strong></div>
            <div><span>探索による確率</span><strong>{formatFixed4(result.explorationProbability)}</strong></div>
          </div>
          <p className="answer-line correct-result">最終的な選択確率: {formatFixed4(result.probability)}</p>
          <button type="button" className="copy-button" onClick={copy}>{copyLabel}</button>
          <CalculationSteps
            steps={[
              result.isGreedy ? "対象はgreedy行動です。" : "対象はgreedy行動ではありません。",
              result.isGreedy
                ? `P = (1 - ε) / m + ε / k`
                : `P = ε / k`,
              result.isGreedy
                ? `= (1 - ${formatRawNumber(Number(epsilon))}) / ${result.greedyActionCount} + ${formatRawNumber(Number(epsilon))} / ${result.actionCount}`
                : `= ${formatRawNumber(Number(epsilon))} / ${result.actionCount}`,
              `= ${formatFixed4(result.probability)}`,
            ]}
          />
        </ResultCard>
      )}
    </section>
  );
}
