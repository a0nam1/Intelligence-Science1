import { formatFixed4, formatRawNumber } from "../../lib/format";
import type { ErrorDetail } from "../../types/optimization";

type ErrorDetailsTableProps = {
  details: ErrorDetail[];
};

export function ErrorDetailsTable({ details }: ErrorDetailsTableProps) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>番号</th>
            <th>xi</th>
            <th>正解yi</th>
            <th>予測値f(xi)</th>
            <th>残差</th>
            <th>残差の二乗</th>
            <th>誤差への寄与</th>
          </tr>
        </thead>
        <tbody>
          {details.map((detail) => (
            <tr key={detail.index}>
              <td>{detail.index}</td>
              <td>{formatRawNumber(detail.x)}</td>
              <td>{formatRawNumber(detail.actualY)}</td>
              <td>{formatFixed4(detail.predictedY)}</td>
              <td>{formatFixed4(detail.residual)}</td>
              <td>{formatFixed4(detail.squaredResidual)}</td>
              <td>{formatFixed4(detail.contribution)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
