import { evaluateQuadratic } from "../../lib/optimization/quadratic";
import type { DataPoint, ErrorDetail, QuadraticCoefficients } from "../../types/optimization";

type RegressionGraphProps = {
  coefficients: QuadraticCoefficients;
  dataPoints: DataPoint[];
  details: ErrorDetail[];
};

const width = 720;
const height = 320;
const pad = 42;

export function RegressionGraph({ coefficients, dataPoints, details }: RegressionGraphProps) {
  if (dataPoints.length === 0) {
    return null;
  }

  const xValues = dataPoints.map((point) => point.x);
  const xMinBase = Math.min(...xValues);
  const xMaxBase = Math.max(...xValues);
  const xSpan = Math.max(1, xMaxBase - xMinBase);
  const xMin = xMinBase - xSpan * 0.2 - 0.5;
  const xMax = xMaxBase + xSpan * 0.2 + 0.5;
  const curve = Array.from({ length: 121 }, (_, index) => {
    const x = xMin + (xMax - xMin) * (index / 120);
    return { x, y: evaluateQuadratic(coefficients, x) };
  });
  const yValues = curve.map((point) => point.y).concat(dataPoints.map((point) => point.y), details.map((detail) => detail.predictedY), [0]);
  const yMinBase = Math.min(...yValues);
  const yMaxBase = Math.max(...yValues);
  const ySpan = Math.max(1, yMaxBase - yMinBase);
  const yMin = yMinBase - ySpan * 0.15;
  const yMax = yMaxBase + ySpan * 0.15;
  const sx = (x: number) => pad + ((x - xMin) / (xMax - xMin)) * (width - pad * 2);
  const sy = (y: number) => height - pad - ((y - yMin) / (yMax - yMin)) * (height - pad * 2);
  const curvePath = curve.map((point, index) => `${index === 0 ? "M" : "L"} ${sx(point.x)} ${sy(point.y)}`).join(" ");

  return (
    <div className="graph-panel">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="二次関数と学習データのグラフ">
        <line x1={pad} y1={sy(0)} x2={width - pad} y2={sy(0)} className="axis-line" />
        <line x1={sx(0)} y1={pad} x2={sx(0)} y2={height - pad} className="axis-line" />
        <path d={curvePath} className="quadratic-curve" />
        {details.map((detail) => (
          <g key={detail.index}>
            <line x1={sx(detail.x)} y1={sy(detail.actualY)} x2={sx(detail.x)} y2={sy(detail.predictedY)} className="residual-line" />
            <circle cx={sx(detail.x)} cy={sy(detail.predictedY)} r="4" className="predicted-point" />
            <circle cx={sx(detail.x)} cy={sy(detail.actualY)} r="5" className="data-point" />
          </g>
        ))}
      </svg>
      <p className="graph-caption">青い曲線が二次関数、黒い点が正解値、白い点が予測値、縦線が残差です。</p>
    </div>
  );
}
