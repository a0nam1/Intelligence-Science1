import type { PerceptronUpdateResult, SigmoidUpdateResult } from "../../types/neural";
import { applySigmoidFunction, applyStepFunction } from "./activation";
import { calculateWeightedSum } from "./neuron";
import { assertFiniteNumber, assertLearningRate, validateWeightsAndInputs } from "./validation";

export function updatePerceptronWeights(
  weights: number[],
  inputs: number[],
  theta: number,
  desired: number,
  alpha: number,
): PerceptronUpdateResult {
  validateWeightsAndInputs(weights, inputs);
  assertFiniteNumber(theta, "閾値θ");
  assertFiniteNumber(desired, "教師データd");
  assertLearningRate(alpha);

  const weightedSum = calculateWeightedSum(weights, inputs, theta);
  const output = applyStepFunction(weightedSum);
  const error = desired - output;
  const updatedWeights = weights.map((weight, index) => weight + alpha * error * inputs[index]);
  const updatedTheta = theta - alpha * error;

  updatedWeights.forEach((weight, index) => assertFiniteNumber(weight, `更新後のw${index + 1}`));
  assertFiniteNumber(updatedTheta, "更新後の閾値θ");

  return {
    weightedSum,
    output,
    error,
    updatedWeights,
    updatedTheta,
  };
}

export function updateSigmoidNeuronWeights(
  weights: number[],
  inputs: number[],
  theta: number,
  desired: number,
  alpha: number,
): SigmoidUpdateResult {
  validateWeightsAndInputs(weights, inputs);
  assertFiniteNumber(theta, "閾値θ");
  assertFiniteNumber(desired, "教師データd");
  assertLearningRate(alpha);

  const weightedSum = calculateWeightedSum(weights, inputs, theta);
  const output = applySigmoidFunction(weightedSum);
  const derivativeFactor = output * (1 - output);
  const error = desired - output;
  const delta = alpha * error * derivativeFactor;
  const updatedWeights = weights.map((weight, index) => weight + delta * inputs[index]);
  const updatedTheta = theta - delta;

  updatedWeights.forEach((weight, index) => assertFiniteNumber(weight, `更新後のw${index + 1}`));
  assertFiniteNumber(updatedTheta, "更新後の閾値θ");

  return {
    weightedSum,
    output,
    derivativeFactor,
    error,
    updatedWeights,
    updatedTheta,
  };
}
