import { useState } from "react";
import type { City, RouteResult } from "../types";
import { calculateRouteDistance } from "../lib/tsp";
import { formatFixed4, formatRawNumber } from "../lib/format";
import { ResultCard } from "./ResultCard";

type RouteDistanceCalculatorProps = {
  cities: City[];
};

function parseRouteInput(input: string): number[] {
  const matches = input.match(/\d+/g);
  if (!matches) {
    throw new Error("経路を「1,3,2,4」または「1 → 3 → 2 → 4」の形式で入力してください。");
  }
  return matches.map(Number);
}

export function RouteDistanceCalculator({ cities }: RouteDistanceCalculatorProps) {
  const [routeInput, setRouteInput] = useState("1,3,2,4");
  const [result, setResult] = useState<RouteResult | null>(null);
  const [error, setError] = useState("");
  const [copyLabel, setCopyLabel] = useState("答えをコピー");

  const handleCalculate = () => {
    setCopyLabel("答えをコピー");
    try {
      const route = parseRouteInput(routeInput);
      const routeResult = calculateRouteDistance(route, cities);
      setResult(routeResult);
      setError("");
    } catch (caughtError) {
      setResult(null);
      setError(caughtError instanceof Error ? caughtError.message : "計算できませんでした。");
    }
  };

  const handleReset = () => {
    setRouteInput("");
    setResult(null);
    setError("");
    setCopyLabel("答えをコピー");
  };

  const handleCopy = async () => {
    if (!result) {
      return;
    }
    await navigator.clipboard.writeText(formatFixed4(result.totalDistance));
    setCopyLabel("コピーしました");
  };

  return (
    <section className="card">
      <p className="section-kicker">機能4</p>
      <h2>指定した経路の距離計算</h2>
      <p className="description">
        機能3の都市座標を使って、入力した訪問順の合計距離を計算します。最後は自動で都市1へ戻します。
      </p>

      <label>
        <span>訪問順</span>
        <input
          type="text"
          value={routeInput}
          onChange={(event) => setRouteInput(event.target.value)}
          placeholder="例: 1,3,2,4"
        />
      </label>

      <div className="button-row">
        <button type="button" onClick={handleCalculate}>
          計算する
        </button>
        <button type="button" className="secondary-button" onClick={handleReset}>
          リセット
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {result && (
        <ResultCard title="計算結果">
          <dl className="result-list">
            <div>
              <dt>指定経路</dt>
              <dd>{result.route.join(" → ")}</dd>
            </div>
            <div>
              <dt>完全な巡回経路</dt>
              <dd>{[...result.route, 1].join(" → ")}</dd>
            </div>
            <div>
              <dt>丸める前の合計距離</dt>
              <dd>{formatRawNumber(result.totalDistance)}</dd>
            </div>
            <div>
              <dt>答え</dt>
              <dd className="big-result">{formatFixed4(result.totalDistance)}</dd>
            </div>
          </dl>

          <ul className="segment-list">
            {result.segmentDistances.map((segment) => (
              <li key={`${segment.from}-${segment.to}`}>
                都市{segment.from} → 都市{segment.to}: {formatFixed4(segment.distance)}
              </li>
            ))}
          </ul>

          <button type="button" className="copy-button" onClick={handleCopy}>
            {copyLabel}
          </button>
        </ResultCard>
      )}
    </section>
  );
}
