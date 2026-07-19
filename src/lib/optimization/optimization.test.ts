import { describe, expect, it } from "vitest";
import { formatFixed4 } from "../format";
import { parseDataPoints } from "./dataParser";
import { formatDerivativeExpression } from "./expressionFormatter";
import { runGradientDescent } from "./gradientDescent";
import { evaluateQuadratic } from "./quadratic";
import { calculateSquaredError } from "./squaredError";

const sampleD = [
  { x: 0, y: 3 },
  { x: 3, y: 7 },
  { x: 7, y: 2 },
  { x: 4, y: 6 },
  { x: 10, y: -5 },
];

describe("optimization helpers", () => {
  it("evaluates a quadratic function", () => {
    expect(evaluateQuadratic({ a: -0.5, b: 5, c: -2.5 }, 3.14)).toBeCloseTo(8.2702);
  });

  it("formats the derivative naturally", () => {
    expect(formatDerivativeExpression({ a: 3, b: -6, c: -9 })).toBe("f'(x) = 6x - 6");
  });

  it("runs one gradient descent step", () => {
    const [step] = runGradientDescent({ a: 3, b: -6, c: -9 }, 1.48, 0.1, 1);
    expect(step.updatedX).toBeCloseTo(1.192);
  });

  it("uses the updated x in repeated gradient descent", () => {
    const steps = runGradientDescent({ a: 3, b: -6, c: -9 }, -2, 0.1, 4);
    expect(steps[3].updatedX).toBeCloseTo(0.9232);
    expect(steps[1].previousX).toBeCloseTo(steps[0].updatedX);
  });

  it("calculates squared error for one data point", () => {
    const result = calculateSquaredError({ a: -0.5, b: 5, c: -2.5 }, [{ x: 3.14, y: 10.5 }]);
    expect(result.totalError).toBeCloseTo(2.48600402);
    expect(formatFixed4(result.totalError)).toBe("2.4860");
  });

  it("calculates squared error for multiple data points", () => {
    const result = calculateSquaredError({ a: -0.5, b: 5, c: -2.5 }, sampleD);
    expect(result.totalError).toBeCloseTo(42.875);
    expect(formatFixed4(result.totalError)).toBe("42.8750");
  });

  it("calculates squared error for the fitted sample coefficients", () => {
    const result = calculateSquaredError({ a: -0.2592, b: 1.7316, c: 3.309 }, sampleD);
    expect(result.totalError).toBeCloseTo(0.7047753);
    expect(formatFixed4(result.totalError)).toBe("0.7048");
  });

  it("sums unrounded squared residuals", () => {
    const result = calculateSquaredError({ a: -0.5, b: 5, c: -2.5 }, [{ x: 3.14, y: 10.5 }]);
    expect(result.details[0].predictedY).toBeCloseTo(8.2702);
    expect(result.totalError).toBeCloseTo(result.details[0].squaredResidual / 2);
  });

  it("parses three bulk input formats", () => {
    expect(parseDataPoints("0,3\n3,7")).toEqual([{ x: 0, y: 3 }, { x: 3, y: 7 }]);
    expect(parseDataPoints("0 3\n3 7")).toEqual([{ x: 0, y: 3 }, { x: 3, y: 7 }]);
    expect(parseDataPoints("(0, 3), (3, 7)")).toEqual([{ x: 0, y: 3 }, { x: 3, y: 7 }]);
  });

  it("rejects invalid numeric input", () => {
    expect(() => evaluateQuadratic({ a: Number.NaN, b: 1, c: 1 }, 1)).toThrow();
    expect(() => parseDataPoints("0,Infinity")).toThrow();
    expect(() => parseDataPoints("")).toThrow();
  });
});
