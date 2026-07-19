import { describe, expect, it } from "vitest";
import { applySigmoidFunction, applyStepFunction } from "./activation";
import { formatNumberFixed4 } from "./formatter";
import { updatePerceptronWeights, updateSigmoidNeuronWeights } from "./learning";
import { calculateWeightedSum } from "./neuron";
import { parseNumberList } from "./parser";

const sampleBWeights = [
  2.0, 4.0, 8.0, 1.6, 3.2, 6.4, 1.28, 2.56, 5.12, 10.24, 1.1, 4.4, 7.7, 2.2, 5.5, 8.8,
  3.3, 6.6, 9.9, 0.001,
];

const sampleBInputs = [
  0.0, 1.1, 2.2, 3.3, 4.4, 5.5, 6.6, 7.7, 8.8, 9.9, -0.1, -0.2, -0.3, -0.4, -0.5, -0.6,
  -0.7, -0.8, -0.9, -1.0,
];

describe("neural helpers", () => {
  it("calculates weighted sum before activation", () => {
    expect(calculateWeightedSum([9999.9999, 1.1111], [0, 1], 1)).toBeCloseTo(0.1111);
  });

  it("applies the step function", () => {
    expect(applyStepFunction(0.1111)).toBe(1);
  });

  it("applies the sigmoid function", () => {
    expect(applySigmoidFunction(0.1111)).toBeCloseTo(0.5277, 4);
  });

  it("calculates weighted sum for 20 inputs", () => {
    expect(calculateWeightedSum(sampleBWeights, sampleBInputs, 222.222)).toBeCloseTo(0.219);
  });

  it("calculates sigmoid output for the 20 input sample", () => {
    const z = calculateWeightedSum(sampleBWeights, sampleBInputs, 222.222);
    expect(applySigmoidFunction(z)).toBeCloseTo(0.5545, 4);
  });

  it("updates a two-input step-function neuron", () => {
    const result = updatePerceptronWeights([-0.1, 0.2], [1, 1], -0.3, 0, 0.1);
    expect(result.updatedWeights[0]).toBeCloseTo(-0.2);
    expect(result.updatedWeights[1]).toBeCloseTo(0.1);
    expect(result.updatedTheta).toBeCloseTo(-0.2);
  });

  it("updates a nine-input step-function neuron", () => {
    const result = updatePerceptronWeights(
      [0.1, -0.2, 0.4, -0.8, 1.6, -3.2, 6.4, -1.28, 2.56],
      [-8.8, -7.7, -6.6, -5.5, 4.4, 3.3, 2.2, 1.1, 0.0],
      12.345,
      1,
      0.1,
    );
    expect(result.updatedWeights).toEqual(
      expect.arrayContaining([
        expect.closeTo(-0.78),
        expect.closeTo(-0.97),
        expect.closeTo(-0.26),
        expect.closeTo(-1.35),
        expect.closeTo(2.04),
        expect.closeTo(-2.87),
        expect.closeTo(6.62),
        expect.closeTo(-1.17),
        expect.closeTo(2.56),
      ]),
    );
    expect(result.updatedTheta).toBeCloseTo(12.245);
  });

  it("updates a sigmoid neuron", () => {
    const result = updateSigmoidNeuronWeights([-0.3, 0.6], [1, 1], -0.9, 0, 0.1);
    expect(formatNumberFixed4(result.weightedSum)).toBe("1.2000");
    expect(formatNumberFixed4(result.output)).toBe("0.7685");
    expect(formatNumberFixed4(result.updatedWeights[0])).toBe("-0.3137");
    expect(formatNumberFixed4(result.updatedWeights[1])).toBe("0.5863");
    expect(formatNumberFixed4(result.updatedTheta)).toBe("-0.8863");
  });

  it("parses comma, whitespace, bracketed, and newline number lists", () => {
    expect(parseNumberList("0.1, -0.2")).toEqual([0.1, -0.2]);
    expect(parseNumberList("0.1 -0.2")).toEqual([0.1, -0.2]);
    expect(parseNumberList("[0.1, -0.2]")).toEqual([0.1, -0.2]);
    expect(parseNumberList("0.1\n-0.2")).toEqual([0.1, -0.2]);
  });

  it("rejects mismatched list lengths", () => {
    expect(() => calculateWeightedSum([1, 2], [1], 0)).toThrow();
  });

  it("rejects invalid numbers", () => {
    expect(() => parseNumberList("1, nope")).toThrow();
    expect(() => parseNumberList("Infinity")).toThrow();
    expect(() => calculateWeightedSum([Number.NaN], [1], 0)).toThrow();
  });
});
