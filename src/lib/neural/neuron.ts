import type { ForwardResult } from "../../types/neural";
import { applySigmoidFunction, applyStepFunction } from "./activation";
import { assertFiniteNumber, validateWeightsAndInputs } from "./validation";

export function calculateWeightedSum(weights: number[], inputs: number[], theta: number): number {
  validateWeightsAndInputs(weights, inputs);
  assertFiniteNumber(theta, "閾値θ");

  const sum = weights.reduce((total, weight, index) => total + weight * inputs[index], 0);
  const z = sum - theta;
  assertFiniteNumber(z, "活性化関数に通す前の値z");
  return z;
}

export function runForwardCalculation(weights: number[], inputs: number[], theta: number): ForwardResult {
  validateWeightsAndInputs(weights, inputs);
  assertFiniteNumber(theta, "閾値θ");

  const weightedTerms = weights.map((weight, index) => weight * inputs[index]);
  weightedTerms.forEach((term, index) => assertFiniteNumber(term, `w${index + 1}x${index + 1}`));
  const weightedTermSum = weightedTerms.reduce((sum, term) => sum + term, 0);
  const weightedSum = weightedTermSum - theta;

  return {
    weightedTerms,
    weightedTermSum,
    weightedSum,
    stepOutput: applyStepFunction(weightedSum),
    sigmoidOutput: applySigmoidFunction(weightedSum),
  };
}
