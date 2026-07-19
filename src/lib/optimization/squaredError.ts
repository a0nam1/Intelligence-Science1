import type { DataPoint, ErrorDetail, QuadraticCoefficients } from "../../types/optimization";
import { evaluateQuadratic } from "./quadratic";
import { assertFiniteNumber } from "./validation";

export function calculateSquaredError(
  coefficients: QuadraticCoefficients,
  dataPoints: DataPoint[],
): {
  details: ErrorDetail[];
  squaredErrorSum: number;
  totalError: number;
} {
  if (dataPoints.length === 0) {
    throw new Error("学習データを1件以上入力してください。");
  }

  const details = dataPoints.map((point, index) => {
    assertFiniteNumber(point.x, `${index + 1}行目のx`);
    assertFiniteNumber(point.y, `${index + 1}行目のy`);
    const predictedY = evaluateQuadratic(coefficients, point.x);
    const residual = point.y - predictedY;
    const squaredResidual = residual * residual;
    const contribution = squaredResidual / 2;

    [predictedY, residual, squaredResidual, contribution].forEach((value) => {
      assertFiniteNumber(value, `${index + 1}行目の誤差計算結果`);
    });

    return {
      index: index + 1,
      x: point.x,
      actualY: point.y,
      predictedY,
      residual,
      squaredResidual,
      contribution,
    };
  });

  const squaredErrorSum = details.reduce((sum, detail) => sum + detail.squaredResidual, 0);
  const totalError = squaredErrorSum / 2;
  assertFiniteNumber(totalError, "誤差E");

  return {
    details,
    squaredErrorSum,
    totalError,
  };
}
