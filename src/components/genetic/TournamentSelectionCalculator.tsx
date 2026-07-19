import { useState } from "react";
import { seededSample, selectTournamentWinner } from "../../lib/genetic/selection";
import type { RouletteIndividual } from "../../types/genetic";
import { ResultCard } from "../ResultCard";

const sampleIndividuals: RouletteIndividual[] = [
  { id: "1", name: "個体1", fitness: 32 },
  { id: "2", name: "個体2", fitness: 256 },
  { id: "3", name: "個体3", fitness: 2048 },
  { id: "4", name: "個体4", fitness: 8 },
];

export function TournamentSelectionCalculator() {
  const [individuals, setIndividuals] = useState(sampleIndividuals);
  const [size, setSize] = useState("3");
  const [seed, setSeed] = useState("ga-sample");
  const [selectedIds, setSelectedIds] = useState(["1", "2", "3"]);
  const [winners, setWinners] = useState<RouletteIndividual[] | null>(null);
  const [error, setError] = useState("");

  const selected = individuals.filter((item) => selectedIds.includes(item.id));

  const calculate = () => {
    try {
      setWinners(selectTournamentWinner(selected));
      setError("");
    } catch (caughtError) {
      setWinners(null);
      setError(caughtError instanceof Error ? caughtError.message : "計算できませんでした。");
    }
  };

  const randomPick = () => {
    try {
      const sample = seededSample(individuals, Number(size), seed);
      setSelectedIds(sample.map((item) => item.id));
      setWinners(null);
      setError("");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "抽出できませんでした。");
    }
  };

  return (
    <section className="card">
      <p className="section-kicker">トーナメント選択</p>
      <h2>抽出個体の中から最大適応度を選択</h2>
      <div className="grid-2">
        <label><span>トーナメントサイズ</span><input type="number" step="1" value={size} onChange={(event) => setSize(event.target.value)} /></label>
        <label><span>乱数シード</span><input value={seed} onChange={(event) => setSeed(event.target.value)} /></label>
      </div>
      <div className="table-wrap"><table><thead><tr><th>抽出</th><th>個体名</th><th>適応度</th></tr></thead><tbody>
        {individuals.map((item) => (
          <tr key={item.id}>
            <td><input type="checkbox" checked={selectedIds.includes(item.id)} onChange={(event) => setSelectedIds(event.target.checked ? [...selectedIds, item.id] : selectedIds.filter((id) => id !== item.id))} aria-label={`${item.name}を抽出対象にする`} /></td>
            <td>{item.name}</td><td>{item.fitness}</td>
          </tr>
        ))}
      </tbody></table></div>
      <div className="button-row">
        <button type="button" onClick={calculate}>計算する</button>
        <button type="button" className="secondary-button" onClick={randomPick}>ランダム抽出</button>
        <button type="button" className="secondary-button" onClick={() => { setSelectedIds(["1", "2", "3"]); setWinners(null); setError(""); }}>サンプル入力</button>
      </div>
      {error && <p className="error-message">{error}</p>}
      {winners && (
        <ResultCard title="選択結果">
          <dl className="result-list">
            <div><dt>抽出された個体</dt><dd>{selected.map((item) => `${item.name}(${item.fitness})`).join("、")}</dd></div>
            <div><dt>選択された個体</dt><dd className="correct-result">{winners.map((item) => item.name).join("、")}</dd></div>
            <div><dt>選択理由</dt><dd>{winners.length > 1 ? "同率最大の個体が複数あります。" : "抽出された個体の中で適応度が最も高いためです。"}</dd></div>
          </dl>
        </ResultCard>
      )}
    </section>
  );
}
