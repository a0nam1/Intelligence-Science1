import type { FitnessEvaluation } from "../../types/genetic";

type FitnessRankingTableProps = {
  evaluations: FitnessEvaluation[];
};

export function FitnessRankingTable({ evaluations }: FitnessRankingTableProps) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>順位</th>
            <th>遺伝子列</th>
            <th>整数x</th>
            <th>適応度</th>
          </tr>
        </thead>
        <tbody>
          {evaluations.map((evaluation, index) => (
            <tr key={`${evaluation.genes}-${evaluation.decimalValue}`}>
              <td>{index + 1}</td>
              <td className="mono-text">{evaluation.genes}</td>
              <td>{evaluation.decimalValue}</td>
              <td>{evaluation.fitness}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
