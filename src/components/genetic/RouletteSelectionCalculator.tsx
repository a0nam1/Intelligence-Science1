import { useState } from "react";
import { formatFixed4 } from "../../lib/format";
import { parseNamedFitnessList } from "../../lib/genetic/parser";
import { calculateRouletteProbabilities } from "../../lib/genetic/selection";
import type { RouletteIndividual, RouletteProbability } from "../../types/genetic";
import { ResultCard } from "../ResultCard";
import { CalculationSteps } from "../reinforcement/CalculationSteps";
import { FitnessChart } from "./FitnessChart";

const sampleIndividuals: RouletteIndividual[] = [
  { id: "1", name: "個体1", fitness: 32 },
  { id: "2", name: "個体2", fitness: 256 },
  { id: "3", name: "個体3", fitness: 2048 },
  { id: "4", name: "個体4", fitness: 8 },
];

export function RouletteSelectionCalculator() {
  const [individuals, setIndividuals] = useState<RouletteIndividual[]>(sampleIndividuals);
  const [bulk, setBulk] = useState("個体1 32\n個体2 256\n個体3 2048\n個体4 8");
  const [result, setResult] = useState<RouletteProbability[] | null>(null);
  const [error, setError] = useState("");
  const [copyLabel, setCopyLabel] = useState("答えをコピー");

  const update = (index: number, key: "name" | "fitness", value: string) => {
    setIndividuals((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: key === "fitness" ? Number(value) : value } : item));
  };

  const calculate = () => {
    setCopyLabel("答えをコピー");
    try {
      setResult(calculateRouletteProbabilities(individuals));
      setError("");
    } catch (caughtError) {
      setResult(null);
      setError(caughtError instanceof Error ? caughtError.message : "計算できませんでした。");
    }
  };

  const applyBulk = () => {
    try {
      setIndividuals(parseNamedFitnessList(bulk).map((item, index) => ({ id: String(index + 1), ...item })));
      setResult(null);
      setError("");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "一括入力を解析できませんでした。");
    }
  };

  const total = result?.reduce((sum, item) => sum + item.fitness, 0) ?? 0;
  const best = result?.reduce((max, item) => item.probability > max.probability ? item : max, result[0]);

  return (
    <section className="card">
      <p className="section-kicker">ルーレット選択</p>
      <h2>適応度比例の選択確率</h2>
      <div className="table-wrap">
        <table><thead><tr><th>個体名</th><th>適応度</th><th>削除</th></tr></thead><tbody>
          {individuals.map((item, index) => (
            <tr key={item.id}>
              <td><input value={item.name} onChange={(event) => update(index, "name", event.target.value)} aria-label={`${item.name}の名前`} /></td>
              <td><input type="number" step="any" value={Number.isNaN(item.fitness) ? "" : item.fitness} onChange={(event) => update(index, "fitness", event.target.value)} aria-label={`${item.name}の適応度`} /></td>
              <td><button type="button" className="danger-button" disabled={individuals.length <= 1} onClick={() => setIndividuals(individuals.filter((_, itemIndex) => itemIndex !== index))}>削除</button></td>
            </tr>
          ))}
        </tbody></table>
      </div>
      <button type="button" className="secondary-button small-button" onClick={() => setIndividuals([...individuals, { id: crypto.randomUUID(), name: `個体${individuals.length + 1}`, fitness: 0 }])}>個体を追加</button>
      <label><span>一括入力</span><textarea rows={4} value={bulk} onChange={(event) => setBulk(event.target.value)} /></label>
      <div className="button-row">
        <button type="button" className="secondary-button" onClick={applyBulk}>一括入力を反映</button>
        <button type="button" onClick={calculate}>計算する</button>
        <button type="button" className="secondary-button" onClick={() => { setIndividuals(sampleIndividuals); setBulk("個体1 32\n個体2 256\n個体3 2048\n個体4 8"); setResult(null); setError(""); }}>サンプル入力</button>
        <button type="button" className="secondary-button" onClick={() => { setIndividuals([{ id: "1", name: "個体1", fitness: 0 }]); setResult(null); setError(""); }}>リセット</button>
      </div>
      {error && <p className="error-message">{error}</p>}
      {result && best && (
        <ResultCard title="計算結果">
          <div className="summary-grid">
            <div><span>適応度の合計</span><strong>{total}</strong></div>
            <div><span>最も高い個体</span><strong>{best.name}</strong></div>
            <div><span>最も高い選択確率</span><strong className="correct-result">{formatFixed4(best.probability)}</strong></div>
          </div>
          <FitnessChart probabilities={result} />
          <div className="table-wrap"><table><thead><tr><th>個体</th><th>適応度</th><th>選択確率</th></tr></thead><tbody>
            {result.map((item) => <tr key={item.id}><td>{item.name}</td><td>{item.fitness}</td><td>{formatFixed4(item.probability)}</td></tr>)}
          </tbody></table></div>
          <p className="answer-line correct-result">{formatFixed4(best.probability)}</p>
          <button type="button" className="copy-button" onClick={async () => { await navigator.clipboard.writeText(formatFixed4(best.probability)); setCopyLabel("コピーしました"); }}>{copyLabel}</button>
          <CalculationSteps steps={[`P(i) = fitness(i) / Σfitness`, `${best.name}: ${best.fitness} / ${total} = ${formatFixed4(best.probability)}`]} />
        </ResultCard>
      )}
    </section>
  );
}
