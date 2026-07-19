import { useState } from "react";
import { factorialBigInt } from "../lib/math";
import { calculateSolutionCount } from "../lib/tsp";
import { formatBigIntWithCommas } from "../lib/format";
import { ResultCard } from "./ResultCard";

type SolutionResult = {
  cityCount: number;
  factorial: bigint;
  answer: bigint;
};

export function SolutionCountCalculator() {
  const [cityCount, setCityCount] = useState("11");
  const [result, setResult] = useState<SolutionResult | null>(null);
  const [error, setError] = useState("");
  const [copyLabel, setCopyLabel] = useState("答えをコピー");

  const handleCalculate = () => {
    setCopyLabel("答えをコピー");
    const parsed = Number(cityCount);

    if (!cityCount.trim() || !Number.isFinite(parsed) || !Number.isInteger(parsed) || parsed < 3) {
      setResult(null);
      setError("都市数は3以上の整数で入力してください。");
      return;
    }

    try {
      setResult({
        cityCount: parsed,
        factorial: factorialBigInt(parsed - 1),
        answer: calculateSolutionCount(parsed),
      });
      setError("");
    } catch (caughtError) {
      setResult(null);
      setError(caughtError instanceof Error ? caughtError.message : "計算できませんでした。");
    }
  };

  const handleReset = () => {
    setCityCount("");
    setResult(null);
    setError("");
    setCopyLabel("答えをコピー");
  };

  const handleCopy = async () => {
    if (!result) {
      return;
    }
    await navigator.clipboard.writeText(result.answer.toString());
    setCopyLabel("コピーしました");
  };

  return (
    <section className="card">
      <div className="card-heading">
        <div>
          <p className="section-kicker">機能1</p>
          <h2>有効な巡回経路の総数</h2>
        </div>
      </div>

      <label>
        <span>都市数 n</span>
        <input
          type="number"
          min="3"
          step="1"
          value={cityCount}
          onChange={(event) => setCityCount(event.target.value)}
          placeholder="例: 11"
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
          <p className="formula">
            ({result.cityCount} - 1)! ÷ 2 = {result.cityCount - 1}! ÷ 2
          </p>
          <dl className="result-list">
            <div>
              <dt>階乗の値</dt>
              <dd>{result.factorial.toString()}</dd>
            </div>
            <div>
              <dt>有効な解の総数</dt>
              <dd className="big-result">{result.answer.toString()}</dd>
            </div>
            <div>
              <dt>カンマ付き</dt>
              <dd>{formatBigIntWithCommas(result.answer)}</dd>
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
