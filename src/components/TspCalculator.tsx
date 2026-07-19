import { useState } from "react";
import type { City, RouteResult } from "../types";
import { factorialBigInt } from "../lib/math";
import { findShortestRoutes, validateCities } from "../lib/tsp";
import { formatBigIntWithCommas, formatFixed4, formatRawNumber } from "../lib/format";
import { CoordinateTable } from "./CoordinateTable";
import { ResultCard } from "./ResultCard";

type TspCalculatorProps = {
  cities: City[];
  setCities: (cities: City[]) => void;
};

type ShortestResult = {
  routes: RouteResult[];
  comparedCount: bigint;
  elapsedMs: number;
};

export const sampleCities: City[] = [
  { id: 1, x: 3.21, y: 6.54 },
  { id: 2, x: 9.87, y: 4.32 },
  { id: 3, x: 7.65, y: 0.98 },
  { id: 4, x: 5.43, y: 8.76 },
];

function reindexCities(cities: City[]): City[] {
  return cities.map((city, index) => ({ ...city, id: index + 1 }));
}

function newCity(id: number): City {
  return { id, x: 0, y: 0 };
}

export function TspCalculator({ cities, setCities }: TspCalculatorProps) {
  const [result, setResult] = useState<ShortestResult | null>(null);
  const [error, setError] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [copyLabel, setCopyLabel] = useState("答えをコピー");

  const handleChangeCity = (id: number, key: "x" | "y", value: string) => {
    setCities(
      cities.map((city) =>
        city.id === id
          ? {
              ...city,
              [key]: value.trim() === "" ? Number.NaN : Number(value),
            }
          : city,
      ),
    );
    setResult(null);
  };

  const handleAddCity = () => {
    if (cities.length >= 10) {
      return;
    }
    setCities([...cities, newCity(cities.length + 1)]);
    setResult(null);
  };

  const handleDeleteCity = (id: number) => {
    if (cities.length <= 3) {
      return;
    }
    setCities(reindexCities(cities.filter((city) => city.id !== id)));
    setResult(null);
  };

  const handleSetCityCount = (count: number) => {
    if (!Number.isInteger(count) || count < 3 || count > 10) {
      return;
    }
    if (count === cities.length) {
      return;
    }
    if (count > cities.length) {
      const additions = Array.from({ length: count - cities.length }, (_, index) => newCity(cities.length + index + 1));
      setCities([...cities, ...additions]);
      return;
    }
    setCities(cities.slice(0, count));
    setResult(null);
  };

  const handleLoadSample = () => {
    setCities(sampleCities);
    setResult(null);
    setError("");
    setCopyLabel("答えをコピー");
  };

  const handleReset = () => {
    setCities([
      { id: 1, x: 0, y: 0 },
      { id: 2, x: 3, y: 0 },
      { id: 3, x: 0, y: 4 },
    ]);
    setResult(null);
    setError("");
    setCopyLabel("答えをコピー");
  };

  const handleCalculate = () => {
    setCopyLabel("答えをコピー");
    setIsCalculating(true);
    setError("");
    window.setTimeout(() => {
      const startedAt = performance.now();
      try {
        validateCities(cities, 3, 10);
        const routes = findShortestRoutes(cities);
        const elapsedMs = performance.now() - startedAt;
        setResult({
          routes,
          comparedCount: factorialBigInt(cities.length - 1),
          elapsedMs,
        });
      } catch (caughtError) {
        setResult(null);
        setError(caughtError instanceof Error ? caughtError.message : "計算できませんでした。");
      } finally {
        setIsCalculating(false);
      }
    }, 0);
  };

  const handleCopy = async () => {
    if (!result?.routes.length) {
      return;
    }
    await navigator.clipboard.writeText(formatFixed4(result.routes[0].totalDistance));
    setCopyLabel("コピーしました");
  };

  return (
    <section className="card wide-card">
      <p className="section-kicker">機能3</p>
      <h2>巡回セールスマン問題の最短経路</h2>
      <p className="description">
        都市1を出発地点に固定し、都市2以降の並び順をすべて比較します。逆順の経路は同じ巡回経路として扱えますが、全探索の確認用として同率の経路も表示します。
      </p>

      <CoordinateTable
        cities={cities}
        onChangeCity={handleChangeCity}
        onAddCity={handleAddCity}
        onDeleteCity={handleDeleteCity}
        onSetCityCount={handleSetCityCount}
        onLoadSample={handleLoadSample}
      />

      <div className="button-row">
        <button type="button" onClick={handleCalculate} disabled={isCalculating}>
          {isCalculating ? "計算中" : "最短経路を計算する"}
        </button>
        <button type="button" className="secondary-button" onClick={handleReset} disabled={isCalculating}>
          リセット
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {result && (
        <ResultCard title="最短経路">
          <div className="summary-grid">
            <div>
              <span>最短距離</span>
              <strong className="big-result">{formatFixed4(result.routes[0].totalDistance)}</strong>
            </div>
            <div>
              <span>比較した経路数</span>
              <strong>{formatBigIntWithCommas(result.comparedCount)}</strong>
            </div>
            <div>
              <span>計算時間</span>
              <strong>{formatFixed4(result.elapsedMs)} ms</strong>
            </div>
          </div>

          <button type="button" className="copy-button" onClick={handleCopy}>
            {copyLabel}
          </button>

          <div className="route-results">
            {result.routes.map((routeResult, index) => (
              <article className="route-block" key={routeResult.route.join("-")}>
                <h4>同率{index + 1}</h4>
                <p>
                  問題で使う経路表記: <strong>{routeResult.route.join(" → ")}</strong>
                </p>
                <p>
                  実際の巡回経路: <strong>{[...routeResult.route, 1].join(" → ")}</strong>
                </p>
                <p>丸める前の合計距離: {formatRawNumber(routeResult.totalDistance)}</p>
                <ul className="segment-list">
                  {routeResult.segmentDistances.map((segment) => (
                    <li key={`${routeResult.route.join("-")}-${segment.from}-${segment.to}`}>
                      都市{segment.from} → 都市{segment.to}: {formatFixed4(segment.distance)}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </ResultCard>
      )}
    </section>
  );
}
