import { useState } from "react";
import { calculateDistance } from "../lib/tsp";
import { formatFixed4, formatRawNumber } from "../lib/format";
import type { City } from "../types";
import { ResultCard } from "./ResultCard";

type DistanceResult = {
  cityA: City;
  cityB: City;
  dx: number;
  dy: number;
  distance: number;
};

export function TwoCityDistanceCalculator() {
  const [values, setValues] = useState({
    x1: "1.2",
    y1: "3.4",
    x2: "5.6",
    y2: "7.8",
  });
  const [result, setResult] = useState<DistanceResult | null>(null);
  const [error, setError] = useState("");
  const [copyLabel, setCopyLabel] = useState("答えをコピー");

  const handleChange = (key: keyof typeof values, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const parseValue = (key: keyof typeof values, label: string): number => {
    const value = Number(values[key]);
    if (!values[key].trim() || !Number.isFinite(value)) {
      throw new Error(`${label}を正しい数値で入力してください。`);
    }
    return value;
  };

  const handleCalculate = () => {
    setCopyLabel("答えをコピー");
    try {
      const cityA = { id: 1, x: parseValue("x1", "都市1のx座標"), y: parseValue("y1", "都市1のy座標") };
      const cityB = { id: 2, x: parseValue("x2", "都市2のx座標"), y: parseValue("y2", "都市2のy座標") };
      const distance = calculateDistance(cityA, cityB);
      setResult({
        cityA,
        cityB,
        dx: cityB.x - cityA.x,
        dy: cityB.y - cityA.y,
        distance,
      });
      setError("");
    } catch (caughtError) {
      setResult(null);
      setError(caughtError instanceof Error ? caughtError.message : "計算できませんでした。");
    }
  };

  const handleReset = () => {
    setValues({ x1: "", y1: "", x2: "", y2: "" });
    setResult(null);
    setError("");
    setCopyLabel("答えをコピー");
  };

  const handleCopy = async () => {
    if (!result) {
      return;
    }
    await navigator.clipboard.writeText(formatFixed4(result.distance));
    setCopyLabel("コピーしました");
  };

  return (
    <section className="card">
      <p className="section-kicker">機能2</p>
      <h2>2都市間の距離</h2>

      <div className="grid-2">
        <label>
          <span>都市1のx座標</span>
          <input type="number" step="any" value={values.x1} onChange={(event) => handleChange("x1", event.target.value)} />
        </label>
        <label>
          <span>都市1のy座標</span>
          <input type="number" step="any" value={values.y1} onChange={(event) => handleChange("y1", event.target.value)} />
        </label>
        <label>
          <span>都市2のx座標</span>
          <input type="number" step="any" value={values.x2} onChange={(event) => handleChange("x2", event.target.value)} />
        </label>
        <label>
          <span>都市2のy座標</span>
          <input type="number" step="any" value={values.y2} onChange={(event) => handleChange("y2", event.target.value)} />
        </label>
      </div>

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
              <dt>x座標の差</dt>
              <dd>{formatRawNumber(result.dx)}</dd>
            </div>
            <div>
              <dt>y座標の差</dt>
              <dd>{formatRawNumber(result.dy)}</dd>
            </div>
            <div>
              <dt>計算式</dt>
              <dd>
                √(({formatRawNumber(result.cityB.x)} - {formatRawNumber(result.cityA.x)})² + (
                {formatRawNumber(result.cityB.y)} - {formatRawNumber(result.cityA.y)})²)
              </dd>
            </div>
            <div>
              <dt>丸める前の距離</dt>
              <dd>{formatRawNumber(result.distance)}</dd>
            </div>
            <div>
              <dt>答え</dt>
              <dd className="big-result">{formatFixed4(result.distance)}</dd>
            </div>
          </dl>
          <button type="button" className="copy-button" onClick={handleCopy}>
            {copyLabel}
          </button>
        </ResultCard>
      )}
    </section>
  );
}
