import { formatFixed4 } from "../../lib/format";
import type { RouletteProbability } from "../../types/genetic";

type FitnessChartProps = {
  probabilities: RouletteProbability[];
};

export function FitnessChart({ probabilities }: FitnessChartProps) {
  return (
    <div className="fitness-chart" aria-label="選択確率の棒グラフ">
      {probabilities.map((item) => (
        <div className="fitness-bar-row" key={item.id}>
          <span>{item.name}</span>
          <div><i style={{ width: `${Math.max(2, item.probability * 100)}%` }} /></div>
          <strong>{formatFixed4(item.probability)}</strong>
        </div>
      ))}
    </div>
  );
}
