import { useState } from "react";
import { formatFixed4, formatRawNumber } from "../../lib/format";
import { selectGreedyActions } from "../../lib/reinforcement/epsilonGreedy";
import { chooseQAction, updateQValue } from "../../lib/reinforcement/qLearning";
import type { ActionValue, QLearningResult } from "../../types/reinforcement";
import { ResultCard } from "../ResultCard";
import { CalculationSteps } from "./CalculationSteps";
import { StateTransitionDiagram } from "./StateTransitionDiagram";

type QAction = ActionValue;
type QResult = QLearningResult & {
  currentState: string;
  nextState: string;
  alpha: number;
  gamma: number;
  reward: number;
  tiedActions: string[];
};

const sampleCurrent = [
  { action: "左に行く", value: 10 },
  { action: "右に行く", value: 80 },
];

const sampleNext = [
  { action: "左に行く", value: 40 },
  { action: "右に行く", value: 50 },
];

export function QLearningCalculator() {
  const [currentState, setCurrentState] = useState("S3");
  const [nextState, setNextState] = useState("S4");
  const [currentActions, setCurrentActions] = useState<QAction[]>(sampleCurrent);
  const [nextActions, setNextActions] = useState<QAction[]>(sampleNext);
  const [method, setMethod] = useState<"greedy" | "manual">("greedy");
  const [manualAction, setManualAction] = useState("右に行く");
  const [reward, setReward] = useState("0");
  const [alpha, setAlpha] = useState("0.1");
  const [gamma, setGamma] = useState("0.9");
  const [terminal, setTerminal] = useState(false);
  const [result, setResult] = useState<QResult | null>(null);
  const [error, setError] = useState("");
  const [copyLabel, setCopyLabel] = useState("答えをコピー");

  const updateAction = (list: "current" | "next", index: number, key: keyof QAction, value: string) => {
    const setter = list === "current" ? setCurrentActions : setNextActions;
    setter((items) =>
      items.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: key === "value" ? Number(value) : value } : item)),
    );
  };

  const calculate = () => {
    setCopyLabel("答えをコピー");
    try {
      const selectedAction = chooseQAction(currentActions, method, manualAction);
      const selected = currentActions.find((action) => action.action === selectedAction);
      if (!selected) throw new Error("選択された行動が見つかりません。");
      const q = updateQValue(
        selected.value,
        nextActions.map((action) => action.value),
        Number(reward),
        Number(alpha),
        Number(gamma),
        terminal,
      );
      setResult({
        ...q,
        selectedAction,
        currentState,
        nextState,
        alpha: Number(alpha),
        gamma: Number(gamma),
        reward: Number(reward),
        tiedActions: selectGreedyActions(currentActions),
      });
      setError("");
    } catch (caughtError) {
      setResult(null);
      setError(caughtError instanceof Error ? caughtError.message : "計算できませんでした。");
    }
  };

  const loadSample = (sampleNumber: 1 | 2 | 3) => {
    if (sampleNumber === 1) {
      setCurrentState("S3");
      setNextState("S4");
      setCurrentActions(sampleCurrent);
      setNextActions(sampleNext);
      setManualAction("右に行く");
      setTerminal(false);
    } else if (sampleNumber === 2) {
      setCurrentState("S1");
      setNextState("G1");
      setCurrentActions([{ action: "左に行く", value: 100 }, { action: "右に行く", value: 20 }]);
      setNextActions([]);
      setManualAction("左に行く");
      setTerminal(true);
    } else {
      setCurrentState("S5");
      setNextState("S4");
      setCurrentActions([{ action: "左に行く", value: 90 }, { action: "右に行く", value: 50 }]);
      setNextActions(sampleNext);
      setManualAction("左に行く");
      setTerminal(false);
    }
    setMethod("greedy");
    setReward("0");
    setAlpha("0.1");
    setGamma("0.9");
    setResult(null);
    setError("");
    setCopyLabel("答えをコピー");
  };

  const copy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(formatFixed4(result.updatedQ));
    setCopyLabel("コピーしました");
  };

  const actionTable = (title: string, list: "current" | "next", actions: QAction[]) => (
    <div>
      <h3 className="subheading">{title}</h3>
      <div className="table-wrap">
        <table>
          <thead><tr><th>行動</th><th>Q値</th><th>削除</th></tr></thead>
          <tbody>
            {actions.map((action, index) => (
              <tr key={`${list}-${action.action}-${index}`}>
                <td><input value={action.action} onChange={(event) => updateAction(list, index, "action", event.target.value)} /></td>
                <td><input type="number" step="any" value={Number.isNaN(action.value) ? "" : action.value} onChange={(event) => updateAction(list, index, "value", event.target.value)} /></td>
                <td><button type="button" className="danger-button" onClick={() => (list === "current" ? setCurrentActions(currentActions.filter((_, itemIndex) => itemIndex !== index)) : setNextActions(nextActions.filter((_, itemIndex) => itemIndex !== index)))}>削除</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" className="secondary-button small-button" onClick={() => (list === "current" ? setCurrentActions([...currentActions, { action: `行動${currentActions.length + 1}`, value: 0 }]) : setNextActions([...nextActions, { action: `行動${nextActions.length + 1}`, value: 0 }]))}>行動を追加</button>
    </div>
  );

  return (
    <section className="card wide-card">
      <p className="section-kicker">Q学習</p>
      <h2>行動価値関数の更新</h2>
      <p className="description">Q(s,a) ← Q(s,a) + α {"{ r + γ max Q(s',a') - Q(s,a) }"} を計算します。</p>

      <StateTransitionDiagram
        mode="q"
        currentState={currentState}
        states={[
          { state: "G1", terminal: true },
          { state: "S1", qLeft: 100, qRight: 20 },
          { state: "S2", qLeft: 0, qRight: 0 },
          { state: "S3", qLeft: 10, qRight: 80 },
          { state: "S4", qLeft: 40, qRight: 50 },
          { state: "S5", qLeft: 90, qRight: 50 },
          { state: "G2", terminal: true },
        ]}
      />

      <div className="grid-2">
        <label><span>現在の状態</span><input value={currentState} onChange={(event) => setCurrentState(event.target.value)} /></label>
        <label><span>移動先状態</span><input value={nextState} onChange={(event) => setNextState(event.target.value)} /></label>
        <label><span>行動選択方法</span><select value={method} onChange={(event) => setMethod(event.target.value as "greedy" | "manual")}><option value="greedy">greedy方策で自動選択</option><option value="manual">手動選択</option></select></label>
        <label><span>手動選択する行動</span><input value={manualAction} onChange={(event) => setManualAction(event.target.value)} disabled={method === "greedy"} /></label>
        <label><span>即時報酬 r</span><input type="number" step="any" value={reward} onChange={(event) => setReward(event.target.value)} /></label>
        <label><span>学習率 α</span><input type="number" step="any" value={alpha} onChange={(event) => setAlpha(event.target.value)} /></label>
        <label><span>割引率 γ</span><input type="number" step="any" value={gamma} onChange={(event) => setGamma(event.target.value)} /></label>
        <label className="check-label"><input type="checkbox" checked={terminal} onChange={(event) => setTerminal(event.target.checked)} /><span>移動先は終端状態</span></label>
      </div>

      <div className="split-grid">
        {actionTable("現在状態で選択可能な行動", "current", currentActions)}
        {actionTable("移動先状態で選択可能な行動", "next", nextActions)}
      </div>

      <div className="button-row">
        <button type="button" onClick={calculate}>計算する</button>
        <button type="button" className="secondary-button" onClick={() => loadSample(1)}>サンプル1</button>
        <button type="button" className="secondary-button" onClick={() => loadSample(2)}>サンプル2</button>
        <button type="button" className="secondary-button" onClick={() => loadSample(3)}>サンプル3</button>
      </div>

      {error && <p className="error-message">{error}</p>}
      {result && (
        <ResultCard title="計算結果">
          {result.tiedActions.length > 1 && <p className="note">最大Q値が同率です: {result.tiedActions.join("、")}</p>}
          <dl className="result-list">
            <div><dt>選択された行動</dt><dd>{result.selectedAction}</dd></div>
            <div><dt>移動先</dt><dd>{result.nextState}</dd></div>
            <div><dt>更新対象のQ値</dt><dd>{formatFixed4(result.previousQ)}</dd></div>
            <div><dt>移動先状態の最大Q値</dt><dd>{formatFixed4(result.nextMaxQ)}</dd></div>
            <div><dt>TDターゲット</dt><dd>{formatFixed4(result.tdTarget)}</dd></div>
            <div><dt>TD誤差</dt><dd>{formatFixed4(result.tdError)}</dd></div>
            <div><dt>更新後のQ値</dt><dd className="big-result correct-result">{formatFixed4(result.updatedQ)}</dd></div>
          </dl>
          <button type="button" className="copy-button" onClick={copy}>{copyLabel}</button>
          <CalculationSteps
            steps={[
              `max Q(${result.nextState}, a') = ${formatRawNumber(result.nextMaxQ)}`,
              `Q(${result.currentState}, ${result.selectedAction})`,
              `= ${formatRawNumber(result.previousQ)} + ${formatRawNumber(result.alpha)} × {${formatRawNumber(result.reward)} + ${formatRawNumber(result.gamma)} × ${formatRawNumber(result.nextMaxQ)} - ${formatRawNumber(result.previousQ)}}`,
              `= ${formatFixed4(result.updatedQ)}`,
            ]}
          />
        </ResultCard>
      )}
    </section>
  );
}
