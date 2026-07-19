import type { QuadraticCoefficients } from "../../types/optimization";
import { assertFiniteNumber } from "./validation";

export function evaluateQuadratic(coefficients: QuadraticCoefficients, x: number): number {
  validateCoefficients(coefficients);
  assertFiniteNumber(x, "x");
  const value = coefficients.a * x * x + coefficients.b * x + coefficients.c;
  assertFiniteNumber(value, "計算結果");
  return value;
}

export function differentiateQuadratic(
  coefficients: QuadraticCoefficients,
): {
  linearCoefficient: number;
  constant: number;
} {
  validateCoefficients(coefficients);
  return {
    linearCoefficient: 2 * coefficients.a,
    constant: coefficients.b,
  };
}

export function evaluateQuadraticDerivative(coefficients: QuadraticCoefficients, x: number): number {
  const derivative = differentiateQuadratic(coefficients);
  assertFiniteNumber(x, "x");
  const value = derivative.linearCoefficient * x + derivative.constant;
  assertFiniteNumber(value, "導関数の値");
  return value;
}

export function validateCoefficients(coefficients: QuadraticCoefficients): void {
  assertFiniteNumber(coefficients.a, "x²の係数a");
  assertFiniteNumber(coefficients.b, "xの係数b");
  assertFiniteNumber(coefficients.c, "定数項c");
}
