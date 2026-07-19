import type { GradientDescentStep, QuadraticCoefficients } from "../../types/optimization";
import { evaluateQuadratic, evaluateQuadraticDerivative } from "./quadratic";
import { assertFiniteNumber, assertIterations, assertPositiveNumber } from "./validation";

export function runGradientDescentStep(
  coefficients: QuadraticCoefficients,
  currentX: number,
  alpha: number,
): GradientDescentStep {
  assertFiniteNumber(currentX, "更新前のx");
  assertPositiveNumber(alpha, "学習率α");

  const previousY = evaluateQuadratic(coefficients, currentX);
  const gradient = evaluateQuadraticDerivative(coefficients, currentX);
  const movement = alpha * gradient;
  const updatedX = currentX - movement;
  const updatedY = evaluateQuadratic(coefficients, updatedX);

  [previousY, gradient, movement, updatedX, updatedY].forEach((value) => {
    assertFiniteNumber(value, "最急降下法の計算結果");
  });

  return {
    iteration: 1,
    previousX: currentX,
    previousY,
    gradient,
    movement,
    updatedX,
    updatedY,
  };
}

export function runGradientDescent(
  coefficients: QuadraticCoefficients,
  initialX: number,
  alpha: number,
  iterations: number,
): GradientDescentStep[] {
  assertIterations(iterations);
  const steps: GradientDescentStep[] = [];
  let currentX = initialX;

  for (let iteration = 1; iteration <= iterations; iteration += 1) {
    const step = runGradientDescentStep(coefficients, currentX, alpha);
    steps.push({ ...step, iteration });
    currentX = step.updatedX;
  }

  return steps;
}

export function isDiverging(steps: GradientDescentStep[]): boolean {
  if (steps.length < 3) {
    return false;
  }
  const recent = steps.slice(-3).map((step) => Math.abs(step.updatedY));
  return recent[2] > recent[1] * 10 && recent[1] > recent[0] * 10;
}
