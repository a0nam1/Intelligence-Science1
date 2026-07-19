import { useState } from "react";
import { calculateRequiredGeneCount, validateGroupCount } from "../../lib/genetic/geneCount";
import { ResultCard } from "../ResultCard";
import { CalculationSteps } from "../reinforcement/CalculationSteps";

export function GeneCountCalculator() {
  const [people, setPeople] = useState("100");
  const [groups, setGroups] = useState("29");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [copyLabel, setCopyLabel] = useState("答えをコピー");

  const calculate = () => {
    setCopyLabel("答えをコピー");
    try {
      const peopleCount = Number(people);
      const groupCount = Number(groups);
      validateGroupCount(peopleCount, groupCount);
      setResult(calculateRequiredGeneCount(peopleCount));
      setError("");
    } catch (caughtError) {
      setResult(null);
      setError(caughtError instanceof Error ? caughtError.message : "計算できませんでした。");
    }
  };

  const exponent = result ? Math.log2(result) : 0;

  return (
    <section className="card">
      <p className="section-kicker">遺伝子数</p>
      <h2>人数以上の最小の2の累乗</h2>
      <div className="grid-2">
        <label><span>人数</span><input type="number" step="1" value={people} onChange={(event) => setPeople(event.target.value)} /></label>
        <label><span>グループ数</span><input type="number" step="1" value={groups} onChange={(event) => setGroups(event.target.value)} /></label>
      </div>
      <div className="button-row">
        <button type="button" onClick={calculate}>計算する</button>
        <button type="button" className="secondary-button" onClick={() => { setPeople("100"); setGroups("29"); setResult(null); setError(""); }}>サンプル入力</button>
        <button type="button" className="secondary-button" onClick={() => { setPeople(""); setGroups(""); setResult(null); setError(""); }}>リセット</button>
      </div>
      {error && <p className="error-message">{error}</p>}
      {result !== null && (
        <ResultCard title="計算結果">
          <p className="big-result correct-result">{result}</p>
          <button type="button" className="copy-button" onClick={async () => { await navigator.clipboard.writeText(String(result)); setCopyLabel("コピーしました"); }}>{copyLabel}</button>
          <CalculationSteps steps={[`geneCount = 2^ceil(log2(${people}))`, `2^${exponent - 1} = ${2 ** (exponent - 1)}`, `2^${exponent} = ${result}`, `遺伝子数 = ${result}`]} />
        </ResultCard>
      )}
    </section>
  );
}
