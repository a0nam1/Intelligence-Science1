import { assertFiniteNumber } from "./validation";

export function applyStepFunction(z: number): number {
  assertFiniteNumber(z, "z");
  return z >= 0 ? 1 : 0;
}

export function applySigmoidFunction(z: number): number {
  assertFiniteNumber(z, "z");
  const result = 1 / (1 + Math.exp(-z));
  assertFiniteNumber(result, "シグモイド関数の出力");
  return result;
}
