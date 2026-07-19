import { evaluateQuadratic } from "../../lib/optimization/quadratic";
import type { GradientDescentStep, QuadraticCoefficients } from "../../types/optimization";
import { formatFixed4 } from "../../lib/format";

type GradientDescentGraphProps = {
  coefficients: QuadraticCoefficients;
  steps: GradientDescentStep[];
  selectedIteration: number;
  onSelectIteration: (iteration: number) => void;
};

const width = 720;
const height = 320;
const pad = 42;

export function GradientDescentGraph({
  coefficients,
  steps,
  selectedIteration,
  onSelectIteration,
}: GradientDescentGraphProps) {
  if (steps.length === 0) {
    return null;
  }

  const points = [
    { iteration: 0, x: steps[0].previousX, y: steps[0].previousY, gradient: steps[0].gradient },
    ...steps.map((step) => ({ iteration: step.iteration, x: step.updatedX, y: step.updatedY, gradient: step.gradient })),
  ];
  const xValues = points.map((point) => point.x);
  const xMinBase = Math.min(...xValues);
  const xMaxBase = Math.max(...xValues);
  const xSpan = Math.max(1, xMaxBase - xMinBase);
  const xMin = xMinBase - xSpan * 0.25 - 0.5;
  const xMax = xMaxBase + xSpan * 0.25 + 0.5;
  const curve = Array.from({ length: 121 }, (_, index) => {
    const x = xMin + (xMax - xMin) * (index / 120);
    return { x, y: evaluateQuadratic(coefficients, x) };
  });
  const yValues = curve.map((point) => point.y).concat(points.map((point) => point.y), [0]);
  const yMinBase = Math.min(...yValues);
  const yMaxBase = Math.max(...yValues);
  const ySpan = Math.max(1, yMaxBase - yMinBase);
  const yMin = yMinBase - ySpan * 0.15;
  const yMax = yMaxBase + ySpan * 0.15;

  const sx = (x: number) => pad + ((x - xMin) / (xMax - xMin)) * (width - pad * 2);
  const sy = (y: number) => height - pad - ((y - yMin) / (yMax - yMin)) * (height - pad * 2);
  const curvePath = curve.map((point, index) => `${index === 0 ? "M" : "L"} ${sx(point.x)} ${sy(point.y)}`).join(" ");
  const selected = points.find((point) => point.iteration === selectedIteration) ?? points[points.length - 1];

  return (
    <div className="graph-panel">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="最急降下法のグラフ">
        <line x1={pad} y1={sy(0)} x2={width - pad} y2={sy(0)} className="axis-line" />
        <line x1={sx(0)} y1={pad} x2={sx(0)} y2={height - pad} className="axis-line" />
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const x = pad + ratio * (width - pad * 2);
          const y = pad + ratio * (height - pad * 2);
          return (
            <g key={ratio}>
              <line x1={x} y1={height - pad} x2={x} y2={height - pad + 5} className="tick-line" />
              <line x1={pad - 5} y1={y} x2={pad} y2={y} className="tick-line" />
            </g>
          );
        })}
        <path d={curvePath} className="quadratic-curve" />
        <polyline points={points.map((point) => `${sx(point.x)},${sy(point.y)}`).join(" ")} className="descent-path" />
        {points.map((point, index) => (
          <g
            key={point.iteration}
            className="svg-click-target"
            role="button"
            tabIndex={0}
            aria-label={`${point.iteration === 0 ? "開始地点" : `${point.iteration}回目`}を選択`}
            onClick={() => onSelectIteration(point.iteration)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                onSelectIteration(point.iteration);
              }
            }}
          >
            <circle
              cx={sx(point.x)}
              cy={sy(point.y)}
              r={index === 0 || index === points.length - 1 ? 6 : 4}
              className={index === 0 ? "start-point" : index === points.length - 1 ? "final-point" : "middle-point"}
            />
          </g>
        ))}
      </svg>
      <p className="graph-caption">
        選択中: {selected.iteration === 0 ? "開始地点" : `${selected.iteration}回目`} / x={formatFixed4(selected.x)} / f(x)=
        {formatFixed4(selected.y)} / 勾配={formatFixed4(selected.gradient)}
      </p>
    </div>
  );
}
