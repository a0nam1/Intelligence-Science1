import { useState } from "react";
import { formatFixed4 } from "../../lib/format";
import { buildEpisodeTransitions, parseStateSequence, stateValuesToRecord } from "../../lib/reinforcement/simulation";
import { repeatTdEpisode, runTdEpisode } from "../../lib/reinforcement/td";
import type { ConvergenceResult, EpisodeResult, StateValue } from "../../types/reinforcement";
import { ResultCard } from "../ResultCard";
import { CalculationSteps } from "./CalculationSteps";
import { StateTransitionDiagram } from "./StateTransitionDiagram";

const sampleStates: StateValue[] = [
  { state: "S1", value: 3 },
  { state: "S2", value: 13 },
  { state: "S3", value: 33 },
  { state: "S4", value: 43 },
  { state: "S5", value: 73 },
];

const sampleOrder = "S3 → S2 → S1 → S2 → S3 → S4 → S5 → G2";

function parseNumber(value: string, label: string): number {
  const parsed = Number(value);
  if (!value.trim() || !Number.isFinite(parsed)) {
    throw new Error(`${label}を正しい数値で入力してください。`);
  }
  return parsed;
}

export function EpisodeTdCalculator() {
  const [states, setStates] = useState<StateValue[]>(sampleStates);
  const [order, setOrder] = useState(sampleOrder);
  const [alpha, setAlpha] = useState("0.5");
  const [gamma, setGamma] = useState("1");
  const [normalReward, setNormalReward] = useState("0");
  const [terminalState, setTerminalState] = useState("G2");
  const [terminalReward, setTerminalReward] = useState("100");
  const [repetitions, setRepetitions] = useState("10");
  const [tolerance, setTolerance] = useState("1e-10");
  const [maxIterations, setMaxIterations] = useState("100000");
  const [episodeResult, setEpisodeResult] = useState<EpisodeResult | null>(null);
  const [convergenceResult, setConvergenceResult] = useState<ConvergenceResult | null>(null);
  const [error, setError] = useState("");
  const [copyLabel, setCopyLabel] = useState("答えをコピー");

  const updateState = (index: number, key: keyof StateValue, value: string) => {
    setStates((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: key === "value" ? Number(value) : value } : item)),
    );
  };

  const addState = () => {
    setStates((current) => [...current, { state: `S${current.length + 1}`, value: 0 }]);
  };

  const deleteState = (index: number) => {
    setStates((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const buildInputs = () => {
    const values = stateValuesToRecord(states);
    const sequence = parseStateSequence(order);
    const transitions = buildEpisodeTransitions(
      sequence,
      Object.keys(values),
      parseNumber(normalReward, "通常の遷移報酬"),
      terminalState,
      parseNumber(terminalReward, "終端状態に入ったときの報酬"),
    );
    return {
      values,
      transitions,
      alpha: parseNumber(alpha, "学習率α"),
      gamma: parseNumber(gamma, "割引率γ"),
    };
  };

  const runOnce = () => {
    setCopyLabel("答えをコピー");
    try {
      const input = buildInputs();
      setEpisodeResult(runTdEpisode(input.values, input.transitions, input.alpha, input.gamma));
      setConvergenceResult(null);
      setError("");
    } catch (caughtError) {
      setEpisodeResult(null);
      setConvergenceResult(null);
      setError(caughtError instanceof Error ? caughtError.message : "計算できませんでした。");
    }
  };

  const runRepeated = (mode: "fixed" | "converge") => {
    setCopyLabel("答えをコピー");
    try {
      const input = buildInputs();
      const result = repeatTdEpisode(input.values, input.transitions, input.alpha, input.gamma, {
        repetitions: mode === "fixed" ? Number(repetitions) : undefined,
        tolerance: parseNumber(tolerance, "許容誤差"),
        maxIterations: Number(maxIterations),
      });
      setEpisodeResult(null);
      setConvergenceResult(result);
      setError("");
    } catch (caughtError) {
      setEpisodeResult(null);
      setConvergenceResult(null);
      setError(caughtError instanceof Error ? caughtError.message : "計算できませんでした。");
    }
  };

  const loadSample = () => {
    setStates(sampleStates);
    setOrder(sampleOrder);
    setAlpha("0.5");
    setGamma("1");
    setNormalReward("0");
    setTerminalState("G2");
    setTerminalReward("100");
    setEpisodeResult(null);
    setConvergenceResult(null);
    setError("");
    setCopyLabel("答えをコピー");
  };

  const reset = () => {
    setStates([{ state: "S1", value: 0 }, { state: "S2", value: 0 }, { state: "S3", value: 0 }]);
    setOrder("");
    setEpisodeResult(null);
    setConvergenceResult(null);
    setError("");
  };

  const finalValues = episodeResult?.values ?? convergenceResult?.values;
  const copyAnswer = async () => {
    if (!finalValues) return;
    const answer = states.map((state) => formatFixed4(finalValues[state.state])).join(" ");
    await navigator.clipboard.writeText(answer);
    setCopyLabel("コピーしました");
  };

  return (
    <section className="card wide-card">
      <p className="section-kicker">エピソードTD学習</p>
      <h2>複数回の状態遷移と収束計算</h2>
      <p className="description">各遷移で値をすぐ更新し、次の遷移では更新後の最新値を使うオンライン更新です。</p>

      <StateTransitionDiagram
        currentState={(order.trim() ? order.replace(/→/g, " ").replace(/->/g, " ").split(/\s+/).filter(Boolean)[0] : "S3")}
        states={[
          { state: "G1", terminal: true },
          ...states.map((state) => ({ state: state.state, value: state.value })),
          { state: terminalState || "G2", terminal: true },
        ]}
      />

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>状態名</th>
              <th>初期状態価値</th>
              <th>削除</th>
            </tr>
          </thead>
          <tbody>
            {states.map((state, index) => (
              <tr key={`${state.state}-${index}`}>
                <td><input value={state.state} onChange={(event) => updateState(index, "state", event.target.value)} aria-label={`${index + 1}番目の状態名`} /></td>
                <td><input type="number" step="any" value={Number.isNaN(state.value) ? "" : state.value} onChange={(event) => updateState(index, "value", event.target.value)} aria-label={`${state.state}の初期状態価値`} /></td>
                <td><button type="button" className="danger-button" onClick={() => deleteState(index)} disabled={states.length <= 1}>削除</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="button-row">
        <button type="button" className="secondary-button" onClick={addState}>状態を追加</button>
      </div>

      <label>
        <span>移動順</span>
        <textarea value={order} onChange={(event) => setOrder(event.target.value)} rows={2} />
      </label>

      <div className="grid-2">
        <label><span>通常の遷移報酬</span><input type="number" step="any" value={normalReward} onChange={(event) => setNormalReward(event.target.value)} /></label>
        <label><span>終端状態</span><input value={terminalState} onChange={(event) => setTerminalState(event.target.value)} /></label>
        <label><span>終端状態に入ったときの報酬</span><input type="number" step="any" value={terminalReward} onChange={(event) => setTerminalReward(event.target.value)} /></label>
        <label><span>学習率 α</span><input type="number" step="any" value={alpha} onChange={(event) => setAlpha(event.target.value)} /></label>
        <label><span>割引率 γ</span><input type="number" step="any" value={gamma} onChange={(event) => setGamma(event.target.value)} /></label>
        <label><span>繰り返し回数</span><input type="number" step="1" value={repetitions} onChange={(event) => setRepetitions(event.target.value)} /></label>
        <label><span>収束判定の許容誤差</span><input value={tolerance} onChange={(event) => setTolerance(event.target.value)} /></label>
        <label><span>最大反復回数</span><input type="number" step="1" value={maxIterations} onChange={(event) => setMaxIterations(event.target.value)} /></label>
      </div>

      <div className="button-row">
        <button type="button" onClick={runOnce}>1エピソード計算</button>
        <button type="button" onClick={() => runRepeated("fixed")}>指定回数だけ繰り返す</button>
        <button type="button" onClick={() => runRepeated("converge")}>収束するまで繰り返す</button>
        <button type="button" className="secondary-button" onClick={loadSample}>サンプル入力</button>
        <button type="button" className="secondary-button" onClick={reset}>リセット</button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {episodeResult && (
        <ResultCard title="1エピソードの計算結果">
          <p className="answer-line correct-result">{states.map((state) => `${state.state}=${formatFixed4(episodeResult.values[state.state])}`).join("　")}</p>
          <button type="button" className="copy-button" onClick={copyAnswer}>{copyLabel}</button>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>番号</th><th>現在状態</th><th>移動先</th><th>報酬</th><th>更新前V(s)</th><th>V(s')</th><th>TD誤差</th><th>更新後V(s)</th>
                </tr>
              </thead>
              <tbody>
                {episodeResult.history.map((step) => (
                  <tr key={step.step}>
                    <td>{step.step}</td><td>{step.from}</td><td>{step.to}</td><td>{formatFixed4(step.reward)}</td><td>{formatFixed4(step.previousValue)}</td><td>{formatFixed4(step.nextValue)}</td><td>{formatFixed4(step.tdError)}</td><td>{formatFixed4(step.updatedValue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <CalculationSteps steps={episodeResult.history.slice(0, 3).map((step) => `${step.step}回目: V(${step.from}) = ${formatFixed4(step.updatedValue)}`)} />
        </ResultCard>
      )}

      {convergenceResult && (
        <ResultCard title="繰り返し計算の結果">
          <div className="summary-grid">
            <div><span>反復回数</span><strong>{convergenceResult.iterationCount}</strong></div>
            <div><span>最大変化量</span><strong>{formatFixed4(convergenceResult.maxChange)}</strong></div>
            <div><span>収束</span><strong>{convergenceResult.converged ? "収束しました" : "指定回数で終了"}</strong></div>
          </div>
          <p className="answer-line correct-result">{states.map((state) => `${state.state}=${formatFixed4(convergenceResult.values[state.state])}`).join("　")}</p>
          <button type="button" className="copy-button" onClick={copyAnswer}>{copyLabel}</button>
          <div className="mini-chart" aria-label="状態価値の推移">
            {states.map((state) => (
              <div className="chart-row" key={state.state}>
                <span>{state.state}</span>
                <div>
                  {convergenceResult.iterations.slice(0, 40).map((iteration) => (
                    <i key={`${state.state}-${iteration.iteration}`} style={{ height: `${Math.max(4, Math.min(100, iteration.values[state.state]))}%` }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ResultCard>
      )}
    </section>
  );
}
